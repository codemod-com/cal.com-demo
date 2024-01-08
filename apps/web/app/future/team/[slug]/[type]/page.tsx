import LegacyPage, { getServerSideProps as _getServerSideProps } from "@pages/team/[slug]/[type]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { cookies, headers } from "next/headers";

import { trpc } from "@calcom/trpc";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const legacyCtx = buildLegacyCtx(headers(), cookies(), params);

  // @ts-expect-error context arg
  const pageProps = await getData(legacyCtx);
  const { entity, booking, user, slug } = pageProps;
  const rescheduleUid = booking?.uid;
  const { data: event } = trpc.viewer.public.event.useQuery(
    { username: user, eventSlug: slug, isTeamEvent: false, org: entity.orgSlug ?? null },
    { refetchOnWindowFocus: false }
  );
  const profileName = event?.profile?.name ?? "";
  const title = event?.title ?? "";
  return await _generateMetadata(
    (t) => `${rescheduleUid && !!booking ? t("reschedule") : ""} ${title} | ${profileName}`,
    (t) => `${rescheduleUid ? t("reschedule") : ""} ${title}`
  );
};

const getData = withAppDir(_getServerSideProps);

// @ts-expect-error getData arg
export default WithLayout({ Page: LegacyPage, getData, getLayout: null })<"P">;
