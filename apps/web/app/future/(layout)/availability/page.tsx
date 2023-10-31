import AvailabilityPage from "@pages/availability";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("availability", "configure_availability");

export default AvailabilityPage;
