import ImpersonationPage from "@pages/settings/security/impersonation";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata("impersonation", "impersonation_description");

export default ImpersonationPage;
