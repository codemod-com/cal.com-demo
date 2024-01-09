import Page from "@pages/apps/[slug]/setup";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { getServerSideProps } from "@calcom/app-store/_pages/setup/_getServerSideProps";
import { APP_NAME } from "@calcom/lib/constants";

export const generateMetadata = async ({ params }: { params: Record<string, string | string[]> }) => {
  return await _generateMetadata(
    () => `${params.slug} | ${APP_NAME}`,
    () => ""
  );
};

// @TODO
// @ts-expect-error getServerSideProps type
export default WithLayout({ getLayout: null, Page, getData: withAppDir(getServerSideProps) });
