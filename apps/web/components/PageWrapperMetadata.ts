import type { Metadata } from "next";

import { IS_CALCOM, WEBAPP_URL } from "@calcom/lib/constants";
import { buildCanonical } from "@calcom/lib/next-seo.config";

export const buildMetadata = (path: string): Metadata => ({
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
  alternates: {
    canonical: IS_CALCOM
      ? buildCanonical({ path, origin: "https://cal.com" }) // cal.com & .dev
      : buildCanonical({ path, origin: WEBAPP_URL }),
  },
  twitter: {
    card: "summary_large_image",
    title: "@calcom",
  },
});
