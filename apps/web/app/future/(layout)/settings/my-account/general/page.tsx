import GeneralPage from "@pages/settings/my-account/general";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("general", "general_description");

export default GeneralPage;
