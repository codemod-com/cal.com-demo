import LegacyPage, { getServerSideProps as _getServerSideProps } from "@pages/team/[slug]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { type GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const props = await getData(
    buildLegacyCtx(headers(), cookies(), params) as unknown as GetServerSidePropsContext
  );
  const teamName = props.team.name || "Nameless Team";

  return await _generateMetadata(
    () => teamName,
    () => teamName
  );
};

const getData = withAppDir(_getServerSideProps);

export default WithLayout({
  Page: LegacyPage,
  // @ts-expect-error getData arg
  getData,
  getLayout: null,
  isBookingPage: true,
})<"P">;
