import WebhooksPage from "@pages/settings/developer/webhooks";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () => await _generateMetadata("webhooks", "add_webhook_description");

export default WebhooksPage;
