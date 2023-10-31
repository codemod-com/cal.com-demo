import NoMeetingFoundPage from "@pages/video/no-meeting-found";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata("no_meeting_found", "no_meeting_found_description");

export default NoMeetingFoundPage;
