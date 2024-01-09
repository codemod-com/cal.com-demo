import Page from "@pages/apps/installed/[category]";
import { withAppDirSsr } from "app/WithAppDirSsr";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { APP_NAME } from "@calcom/lib/constants";

import { getServerSideProps } from "@lib/apps/installed/[category]/getServerSideProps";

export const generateMetadata = async () => {
  return await _generateMetadata(
    (t) => `${t("installed_apps")} | ${APP_NAME}`,
    (t) => t("manage_your_connected_apps")
  );
};

// @ts-expect-error Argument of type '(ctx: AppGetServerSidePropsContext) => Promise<{ redirect: { destination: string; permanent: boolean; }; notFound?: undefined; props?: undefined; }
export default WithLayout({ getLayout: null, getData: withAppDirSsr(getServerSideProps), Page });
