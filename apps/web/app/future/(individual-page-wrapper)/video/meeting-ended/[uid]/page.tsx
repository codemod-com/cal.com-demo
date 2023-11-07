import Page from "@pages/video/meeting-ended/[uid]";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => "Meeting Unavailable",
    () => "Meeting Unavailable"
  );

export default Page;
