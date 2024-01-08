import { getServerSideProps } from "@pages/team/[slug]";
import { withAppDir } from "app/AppDirSSRHOC";
import type { GetServerSidePropsContext } from "next";
import type { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import withEmbedSsr from "@lib/withEmbedSsr";

type PageProps = Readonly<{
  params: Params;
}>;

const Page = async ({ params }: PageProps) => {
  const legacyCtx = buildLegacyCtx(headers(), cookies(), params);

  await withAppDir(withEmbedSsr(getServerSideProps))(legacyCtx as unknown as GetServerSidePropsContext);

  return null;
};

export default Page;
