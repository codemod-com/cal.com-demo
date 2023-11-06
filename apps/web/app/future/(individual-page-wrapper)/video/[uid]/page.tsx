import Page from "@pages/video/[uid]";
import { _generateMetadata } from "app/_utils";

import { APP_NAME } from "@calcom/lib/constants";

export const generateMetadata = async () =>
  await _generateMetadata(
    () => `${APP_NAME} Video`,
    () => ""
  );

export default Page;
