import { headers } from "next/headers";

import { constructGenericImage } from "@calcom/lib/OgImages";
import { IS_CALCOM, WEBAPP_URL, APP_NAME, SEO_IMG_OGIMG } from "@calcom/lib/constants";
import { getFixedT } from "@calcom/lib/server/getFixedT";

import { preparePageMetadata } from "@lib/metadata";

export const _generateMetadata = async (
  titleKey: string,
  descriptionKey: string,
  usePlainTitleKey?: boolean,
  usePlainDescriptionKey?: boolean
) => {
  const h = headers();
  const canonical = h.get("x-pathname") ?? "";
  const locale = h.get("x-locale") ?? "en";

  const t = await getFixedT(locale, "common");

  const title = usePlainTitleKey ? titleKey : t(titleKey);
  const description = usePlainDescriptionKey ? descriptionKey : t(descriptionKey);

  const metadataBase = new URL(IS_CALCOM ? "https://cal.com" : WEBAPP_URL);

  const image =
    SEO_IMG_OGIMG +
    constructGenericImage({
      title,
      description,
    });

  return preparePageMetadata({
    title,
    canonical,
    image,
    description,
    siteName: APP_NAME,
    metadataBase,
  });
};
