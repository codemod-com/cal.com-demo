import Page from "@pages/video/meeting-ended/[uid]";
import { withAppDir } from "app/AppDirSSRHOC";
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
export default WithLayout({ getData: withAppDir(getServerSideProps), Page, getLayout: null })<"P">;
