import type { SSRConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { headers } from "next/headers";
import superjson from "superjson";

import { CALCOM_VERSION } from "@calcom/lib/constants";
import prisma from "@calcom/prisma";
import { appRouter } from "@calcom/trpc/server/routers/_app";

import { createTRPCNextLayout } from "./createTRPCNextLayout";

export async function ssrInit(options?: { noI18nPreload: boolean }) {
  const locale = headers().get("x-locale") ?? "en";

  const i18n = (await serverSideTranslations(locale, ["common", "vital"])) || "en";

  const ssr = createTRPCNextLayout({
    router: appRouter,
    transformer: superjson,
    createContext() {
      return { prisma, session: null, locale, i18n: i18n as unknown as SSRConfig };
    },
  });

  // i18n translations are already retrieved from serverSideTranslations call, there is no need to run a i18n.fetch
  // we can set query data directly to the queryClient
  const queryKey = [
    ["viewer", "public", "i18n"],
    { input: { locale, CalComVersion: CALCOM_VERSION }, type: "query" },
  ];
  if (!options?.noI18nPreload) {
    ssr.queryClient.setQueryData(queryKey, { i18n });
  }

  await Promise.allSettled([
    // So feature flags are available on first render
    ssr.viewer.features.map.prefetch(),
    // Provides a better UX to the users who have already upgraded.
    ssr.viewer.teams.hasTeamPlan.prefetch(),
    ssr.viewer.public.session.prefetch(),
  ]);

  return ssr;
}
