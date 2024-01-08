import LegacyPage, { getServerSideProps as _getServerSideProps } from "@pages/team/[slug]";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  const legacyCtx = buildLegacyCtx(headers(), cookies(), params);

  // @ts-expect-error context arg
  const props = await getData(legacyCtx);
  const teamName = props.team.name || "Nameless Team";

  return await _generateMetadata(
    () => teamName,
    () => teamName
  );
};

const getData = withAppDir(_getServerSideProps);

// @ts-expect-error getData arg
export default WithLayout({ Page: LegacyPage, getData, getLayout: null })<"P">;
