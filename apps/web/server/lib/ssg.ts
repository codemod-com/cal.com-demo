import type { GetStaticPropsContext } from "next";
import superjson from "superjson";

import { CALCOM_VERSION } from "@calcom/lib/constants";
import prisma from "@calcom/prisma";
import { createProxySSGHelpers } from "@calcom/trpc/react/ssg";
import { appRouter } from "@calcom/trpc/server/routers/_app";

import { serverSideTranslations } from "@server/lib/serverSideTranslations";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("@calcom/config/next-i18next.config");

/**
 * Initialize static site rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getStaticProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssgInit<TParams extends { locale?: string }>(opts: GetStaticPropsContext<TParams>) {
  const requestedLocale = opts.params?.locale || opts.locale || i18n.defaultLocale;
  const isSupportedLocale = i18n.locales.includes(requestedLocale);
  if (!isSupportedLocale) {
    console.warn(`Requested unsupported locale "${requestedLocale}"`);
  }
  const locale = isSupportedLocale ? requestedLocale : i18n.defaultLocale;

  const _i18n = await serverSideTranslations(locale, ["common"]);

  const ssg = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      prisma,
      session: null,
      locale,
      i18n: _i18n,
    },
  });

  ssg.queryClient.setQueryData(
    [["viewer", "public", "i18n"], { input: { locale, CalComVersion: CALCOM_VERSION }, type: "query" }],
    { i18n: _i18n }
  );
  // always preload i18n

  return ssg;
}
