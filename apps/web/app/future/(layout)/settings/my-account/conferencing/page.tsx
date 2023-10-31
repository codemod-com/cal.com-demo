import ConferencingPage from "@pages/settings/my-account/conferencing";
import { _generateMetadata } from "app/_utils";

export const generateMetadata = async () =>
  await _generateMetadata("conferencing", "conferencing_description");

export default ConferencingPage;
