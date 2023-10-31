import InsightsPage from "@pages/insights";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("Insights", "insights_subtitle", true);

export default InsightsPage;
