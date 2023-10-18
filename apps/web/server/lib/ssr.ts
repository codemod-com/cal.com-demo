import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { CALCOM_VERSION } from "@calcom/lib/constants";
import { createProxySSGHelpers } from "@calcom/trpc/react/ssg";
import { createContext } from "@calcom/trpc/server/createContext";
import { appRouter } from "@calcom/trpc/server/routers/_app";
import { serverSideTranslations } from "@calcom/web/server/lib/serverSideTranslations";

/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Automatically prefetches i18n based on the passed in `context`-object to prevent i18n-flickering.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export async function ssrInit(context: GetServerSidePropsContext, options?: { noI18nPreload: boolean }) {
  const ctx = await createContext(context);
  const locale = await getLocale(context.req);
  const i18n = await serverSideTranslations(locale, ["common", "vital"]);

  const ssr = createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: { ...ctx, locale, i18n },
  });

  // manually set query value, insetead of fetching it
  if (!options?.noI18nPreload) {
    ssr.queryClient.setQueryData(
      [["viewer", "public", "i18n"], { input: { locale, CalComVersion: CALCOM_VERSION }, type: "query" }],
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
