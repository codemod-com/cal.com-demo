import { ssrInit } from "app/_trpc/ssrInit";
import { WithLayout } from "app/layoutHOC";
import { notFound, redirect } from "next/navigation";

import type { LegacyCtx } from "@lib/buildLegacyCtx";

import { getData } from "@server/lib/getData";

const getDataBuilder = async (ctx: LegacyCtx) => {
  const ssr = await ssrInit();

  const data = await getData(
    ctx,
    () => ssr.dehydrate(),
    () => notFound(),
    (r) => redirect(r.destination)
  );

  if ("props" in data) {
    return data.props;
  }

  return data;
};

export default WithLayout({ getLayout: null, getData: getDataBuilder })<"L">;
