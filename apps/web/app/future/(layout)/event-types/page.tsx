import EventTypes from "@pages/event-types";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata("event_types_page_title", "event_types_page_subtitle");

export default EventTypes;
