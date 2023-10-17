import { lookup } from "bcp-47-match";
import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { CALCOM_VERSION } from "@calcom/lib/constants";
import { createProxySSGHelpers } from "@calcom/trpc/react/ssg";
import { createContext } from "@calcom/trpc/server/createContext";
import { appRouter } from "@calcom/trpc/server/routers/_app";

import { serverSideTranslations } from "@server/lib/serverSideTranslations";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n: i18nConfig } = require("@calcom/config/next-i18next.config");
/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssrInit(context: GetServerSidePropsContext, options?: { noI18nPreload: boolean }) {
  const ctx = await createContext(context);
  const locale = await getLocale(context.req);
  const resolvedLocale = lookup(i18nConfig.locales, locale) ?? locale;
  const i18n = await serverSideTranslations(resolvedLocale, ["common", "vital"]);

  const ssr = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: { ...ctx, locale: resolvedLocale, i18n },
  });

  // manually set query value, insetead of fetching it
  if (!options?.noI18nPreload) {
    ssr.queryClient.setQueryData(
      [
        ["viewer", "public", "i18n"],
        { input: { locale: resolvedLocale, CalComVersion: CALCOM_VERSION }, type: "query" },
      ],
      { i18n }
    );
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
