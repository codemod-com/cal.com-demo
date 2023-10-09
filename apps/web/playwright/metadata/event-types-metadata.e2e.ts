import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import { test } from "../lib/fixtures";

const getTitle = async (page: Page): Promise<string> => page.locator("title").innerText();

const getCanonicalLinkHref = async (page: Page): Promise<string | null> =>
  page.locator('link[rel="canonical"]').getAttribute("href");

const getAppleTouchIconHref = async (page: Page): Promise<string | null> =>
  page.locator('link[rel="apple-touch-icon"]').getAttribute("href");

const getManifestHref = async (page: Page): Promise<string | null> =>
  page.locator('link[rel="manifest"]').getAttribute("href");

const getMaskIconHref = async (page: Page): Promise<string | null> =>
  page.locator('link[rel="mask-icon"]').getAttribute("href");

const getMaskIconColor = async (page: Page): Promise<string | null> =>
  page.locator('link[rel="mask-icon"]').getAttribute("color");

const getLink16Href = async (page: Page): Promise<string | null> =>
  page.locator('link[sizes="16x16"]').getAttribute("href");

const getLink32Href = async (page: Page): Promise<string | null> =>
  page.locator('link[sizes="32x32"]').getAttribute("href");

const getViewportContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="viewport"]').getAttribute("content");

const getRobotsContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="robots"]').getAttribute("content");

const getTileColorContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="msapplication-TileColor"]').getAttribute("content");

const getLightSchemeName = async (page: Page): Promise<string | null> =>
  page.locator('meta[media="(prefers-color-scheme: light)"]').getAttribute("name");

const getLightSchemeContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[media="(prefers-color-scheme: light)"]').getAttribute("content");

const getDarkSchemeName = async (page: Page): Promise<string | null> =>
  page.locator('meta[media="(prefers-color-scheme: dark)"]').getAttribute("name");

const getDarkSchemeContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[media="(prefers-color-scheme: dark)"]').getAttribute("content");

const getTwitterCardContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="twitter:card"]').getAttribute("content");

const getTwitterSiteContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="twitter:site"]').getAttribute("content");

const getTwitterAuthorContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[name="twitter:creator"]').getAttribute("content");

const getOgDescriptionContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:description"]').getAttribute("content");

const getOgUrlContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:url"]').getAttribute("content");

const getOgTypeContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:type"]').getAttribute("content");

const getOgSiteNameContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:site_name"]').getAttribute("content");

const getOgTitleContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:title"]').getAttribute("content");

const getOgImageContent = async (page: Page): Promise<string | null> =>
  page.locator('meta[property="og:image"]').getAttribute("content");

test.describe("Event Types Metadata1", () => {
  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("emits proper metadata", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/event-types");
    await page.waitForSelector('[data-testid="event-types"]');

    expect(await getTitle(page)).toMatch(/(Event Types|Cal\.com) \| Cal\.com/);

    expect(await getCanonicalLinkHref(page)).toEqual("http://localhost:3000/event-types");

    expect(await getAppleTouchIconHref(page)).toEqual("/api/logo?type=apple-touch-icon");

    expect(await getManifestHref(page)).toEqual("/site.webmanifest");

    expect(await getMaskIconHref(page)).toEqual("/safari-pinned-tab.svg");
    expect(await getMaskIconColor(page)).toEqual("#000000");

    expect(await getLink16Href(page)).toEqual("/api/logo?type=favicon-16");

    expect(await getLink32Href(page)).toEqual("/api/logo?type=favicon-32");

    expect(await getViewportContent(page)).toEqual(
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    );

    expect(await getRobotsContent(page)).toEqual("index,follow");

    expect(await getTileColorContent(page)).toEqual("#ff0000");

    expect(await getLightSchemeName(page)).toEqual("theme-color");

    expect(await getLightSchemeContent(page)).toEqual("#f9fafb");

    expect(await getDarkSchemeName(page)).toEqual("theme-color");

    expect(await getDarkSchemeContent(page)).toEqual("#1C1C1C");

    expect(await getTwitterCardContent(page)).toEqual("summary_large_image");

    expect(await getTwitterSiteContent(page)).toEqual("@calcom");

    expect(await getTwitterAuthorContent(page)).toEqual("@calcom");

    expect(await getOgDescriptionContent(page)).toEqual(
      "Create events to share for people to book on your calendar."
    );

    expect(await getOgUrlContent(page)).toEqual("http://localhost:3000/event-types");

    expect(await getOgTypeContent(page)).toEqual("website");

    expect(await getOgSiteNameContent(page)).toEqual("Cal.com");

    expect(await getOgTitleContent(page)).toMatch(/(Event Types|Cal\.com) \| Cal\.com/);

    expect(
      (await getOgImageContent(page))?.startsWith("http://localhost:3000/_next/image?w=1200&q=100&url=")
    ).toBeTruthy();
  });
});
