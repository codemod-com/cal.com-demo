import { type Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { redirect } from "next/navigation";

import { WEBAPP_URL } from "@calcom/lib/constants";

export default function getEmbedUrl(query: Record<string, string | string[]>, destinationUrl: string) {
  const embed = query.embed;
  const layout = query.layout;
  if (!embed || !layout) {
    return destinationUrl;
  }

  let urlPrefix = "";

  // Get the URL parsed from URL so that we can reliably read pathname and searchParams from it.
  const destinationUrlObj = new URL(destinationUrl, WEBAPP_URL);

  // If it's a complete URL, use the origin as the prefix to ensure we redirect to the same domain.
  if (destinationUrl.search(/^(http:|https:).*/) !== -1) {
    urlPrefix = destinationUrlObj.origin;
  } else {
    // Don't use any prefix for relative URLs to ensure we stay on the same domain
    urlPrefix = "";
  }

  const destinationQueryStr = destinationUrlObj.searchParams.toString();
  // Make sure that redirect happens to /embed page and pass on embed query param as is for preserving Cal JS API namespace
  const newDestinationUrl = `${urlPrefix}${destinationUrlObj.pathname}/embed?${
    destinationQueryStr ? `${destinationQueryStr}&` : ""
  }layout=${layout}&embed=${embed}`;
  return redirect(newDestinationUrl);
}
