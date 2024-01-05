import { getData } from "@pages/getData";
import { ssrInit } from "app/_trpc/ssrInit";
import { WithLayout } from "app/layoutHOC";
import { notFound, redirect } from "next/navigation";

import { getLayout } from "@calcom/features/MainLayoutAppDir";

import type { LegacyCtx } from "@lib/buildLegacyCtx";

const getDataBuilder = async (ctx: LegacyCtx) => {
  const ssr = await ssrInit();

  return getData(
    ctx,
    () => ssr.dehydrate(),
    () => notFound(),
    (r) => redirect("") // TODO
  );
};

export default WithLayout({ getLayout, getData: getDataBuilder })<"L">;
