import Page from "@pages/video/meeting-not-started/[uid]";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("this_meeting_has_not_started_yet"),
    () => ""
  );

export default Page;
