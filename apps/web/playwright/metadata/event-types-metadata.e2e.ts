import { expect } from "@playwright/test";

import { test } from "../lib/fixtures";
import { metadataCommons } from "../lib/metadata";

test.describe("Event Types Metadata1", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("emits proper metadata", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");
    await page.waitForSelector('[data-testid="event-types"]');

    expect(await metadataCommons.getTitle(page)).toMatch(/(Event Types|Cal\.com) \| Cal\.com/);

    expect(await metadataCommons.getCanonicalLinkHref(page)).toEqual("http://localhost:3000/event-types");

    expect(await metadataCommons.getAppleTouchIconHref(page)).toEqual("/api/logo?type=apple-touch-icon");

    expect(await metadataCommons.getManifestHref(page)).toEqual("/site.webmanifest");

    expect(await metadataCommons.getMaskIconHref(page)).toEqual("/safari-pinned-tab.svg");
    expect(await metadataCommons.getMaskIconColor(page)).toEqual("#000000");

    expect(await metadataCommons.getLink16Href(page)).toEqual("/api/logo?type=favicon-16");

    expect(await metadataCommons.getLink32Href(page)).toEqual("/api/logo?type=favicon-32");

    expect(await metadataCommons.getViewportContent(page)).toEqual(
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    );

    expect(await metadataCommons.getRobotsContent(page)).toEqual("index,follow");

    expect(await metadataCommons.getTileColorContent(page)).toEqual("#ff0000");

    expect(await metadataCommons.getLightSchemeName(page)).toEqual("theme-color");

    expect(await metadataCommons.getLightSchemeContent(page)).toEqual("#f9fafb");

    expect(await metadataCommons.getDarkSchemeName(page)).toEqual("theme-color");

    expect(await metadataCommons.getDarkSchemeContent(page)).toEqual("#1C1C1C");

    expect(await metadataCommons.getTwitterCardContent(page)).toEqual("summary_large_image");

    expect(await metadataCommons.getTwitterSiteContent(page)).toEqual("@calcom");

    expect(await metadataCommons.getTwitterAuthorContent(page)).toEqual("@calcom");

    expect(await metadataCommons.getOgDescriptionContent(page)).toEqual(
      "Create events to share for people to book on your calendar."
    );

    expect(await metadataCommons.getOgUrlContent(page)).toEqual("http://localhost:3000/event-types");

    expect(await metadataCommons.getOgTypeContent(page)).toEqual("website");

    expect(await metadataCommons.getOgSiteNameContent(page)).toEqual("Cal.com");

    expect(await metadataCommons.getOgTitleContent(page)).toMatch(/(Event Types|Cal\.com) \| Cal\.com/);

    expect(
      (await metadataCommons.getOgImageContent(page))?.startsWith(
        "http://localhost:3000/_next/image?w=1200&q=100&url="
      )
    ).toBeTruthy();
  });
});
