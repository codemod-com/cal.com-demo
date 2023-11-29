import Page from "@pages/availability/troubleshoot";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("troubleshoot"),
    (t) => t("troubleshoot_availability")
  );

export default Page;
