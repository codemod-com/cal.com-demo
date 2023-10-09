import type { Page } from "@playwright/test";

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

export const metadataCommons = {
  getTitle,
  getCanonicalLinkHref,
  getAppleTouchIconHref,
  getManifestHref,
  getMaskIconHref,
  getMaskIconColor,
  getLink16Href,
  getLink32Href,
  getViewportContent,
  getRobotsContent,
  getTileColorContent,
  getLightSchemeName,
  getLightSchemeContent,
  getDarkSchemeName,
  getDarkSchemeContent,
  getTwitterCardContent,
  getTwitterSiteContent,
  getTwitterAuthorContent,
  getOgDescriptionContent,
  getOgUrlContent,
  getOgTypeContent,
  getOgSiteNameContent,
  getOgTitleContent,
  getOgImageContent,
};
