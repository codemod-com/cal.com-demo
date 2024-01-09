import AppsPage from "@pages/apps";
import { withAppDir } from "app/AppDirSSRHOC";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { getLayout } from "@calcom/features/MainLayoutAppDir";
import { APP_NAME } from "@calcom/lib/constants";

import { getServerSideProps } from "@lib/apps/getServerSideProps";

export const generateMetadata = async () => {
  return await _generateMetadata(
    () => `Apps | ${APP_NAME}`,
    () => ""
  );
};

export default WithLayout({ getLayout, getData: withAppDir(getServerSideProps), Page: AppsPage });
