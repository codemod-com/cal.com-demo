import EnterprisePage from "@pages/enterprise/component";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("create_your_org"),
    (t) => t("create_your_org_description")
  );

export default EnterprisePage;
