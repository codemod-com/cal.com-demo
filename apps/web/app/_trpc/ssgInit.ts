import type { SSRConfig } from "next-i18next";
import { headers } from "next/headers";
import superjson from "superjson";

import { create } from "@calcom/lib/server/getFixedT";
import prisma from "@calcom/prisma";
import { appRouter } from "@calcom/trpc/server/routers/_app";

import { createTRPCNextLayout } from "./createTRPCNextLayout";

/**
 * Initialize static site rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getStaticProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssgInit() {
  const locale = headers().get("x-locale") ?? "en";

  const i18n = await create(locale, "common");

  const ssg = createTRPCNextLayout({
    router: appRouter,
    transformer: superjson,
    createContext() {
      // TODO: improve typing so that casting as SSRConfig is unnecessary
      return { prisma, session: null, locale, i18n: i18n as unknown as SSRConfig };
    },
  });

  return ssg;
}
