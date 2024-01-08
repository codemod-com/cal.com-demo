import Login from "@pages/auth/login";
import { mapGetServerSidePropsResultForAppDir } from "app/AppDirSSRHOC";
import { ssrInit } from "app/_trpc/ssrInit";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { APP_NAME } from "@calcom/lib/constants";

import type { LegacyCtx } from "@lib/buildLegacyCtx";

import { getData } from "@server/lib/loginGetData";

export const generateMetadata = async () => {
  return await _generateMetadata(
    (t) => `${t("login")} | ${APP_NAME}`,
    (t) => t("login")
  );
};

const getDataBuilder = async (ctx: LegacyCtx) => {
  const ssr = await ssrInit();

  const data = await getData(ctx, () => ssr.dehydrate(), "dehydratedState");

  return mapGetServerSidePropsResultForAppDir(data);
};

export default WithLayout({ getLayout: null, Page: Login, getData: getDataBuilder })<"P">;
