import { getServerSideProps } from "@pages/team/[slug]";
import { withAppDir } from "app/AppDirSSRHOC";
import type { PageProps } from "app/_types";
import type { GetServerSidePropsContext } from "next";
import { cookies, headers } from "next/headers";

import { buildLegacyCtx } from "@lib/buildLegacyCtx";
import withEmbedSsr from "@lib/withEmbedSsr";

const Page = async ({ params }: PageProps) => {
  const legacyCtx = buildLegacyCtx(headers(), cookies(), params);

  await withAppDir(withEmbedSsr(getServerSideProps))(legacyCtx as unknown as GetServerSidePropsContext);

  return null;
};

export default Page;
