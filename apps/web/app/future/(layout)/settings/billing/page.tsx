import BillingPage from "@pages/settings/billing";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("billing", "manage_billing_description");

export default BillingPage;
