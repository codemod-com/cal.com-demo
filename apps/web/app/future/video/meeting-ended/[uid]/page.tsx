import Page from "@pages/video/meeting-ended/[uid]";
import { withAppDirSsr } from "app/WithAppDirSsr";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";

import { getServerSideProps } from "@lib/video/meeting-ended/[uid]/getServerSideProps";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Meeting Unavailable",
    () => "Meeting Unavailable"
  );

// @TODO
// @ts-expect-error getData
export default WithLayout({ getData: withAppDirSsr(getServerSideProps), Page, getLayout: null })<"P">;
