import WebhooksPage from "@pages/settings/developer/webhooks";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("webhooks"),
    (t) => t("add_webhook_description")
  );

export default WebhooksPage;
