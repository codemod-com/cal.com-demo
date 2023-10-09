import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";
import { installAppleCalendar } from "./lib/testUtils";

test.describe.configure({ mode: "parallel" });

test.afterEach(({ users }) => users.deleteAll());

test.describe("App Store - Authed", () => {
  test("Browse apple-calendar and try to install", async ({ page, users }) => {
    const pro = await users.create();
    await pro.apiLogin();

    await installAppleCalendar(page);

    await expect(page.locator(`text=Connect to Apple Server`)).toBeVisible();
  });

  test("sees proper metadata1", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/apps/installed");

    {
      const locator = page.locator('meta[name="viewport"]');

      await expect(locator).toHaveAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      );
    }

    {
      const locator = page.locator('meta[name="twitter:card"]');

      await expect(locator).toHaveAttribute("content", "summary_large_image");
    }

    {
      const locator = page.locator('meta[name="twitter:site"]');

      await expect(locator).toHaveAttribute("content", "@calcom");
    }

    {
      const locator = page.locator('meta[name="twitter:creator"]');

      await expect(locator).toHaveAttribute("content", "@calcom");
    }

    {
      const locator = page.locator('meta[name="robots"]');

      await expect(locator).toHaveAttribute("content", "index,follow");
    }

    {
      const locator = page.locator('meta[property="og:description"]');

      await expect(locator).toHaveAttribute("content", "Manage your installed apps or change settings");
    }

    {
      const locator = page.locator('meta[property="og:url"]');

      await expect(locator).toHaveAttribute("content", "http://localhost:3000/apps/installed/calendar");
    }

    {
      const locator = page.locator('meta[property="og:type"]');

      await expect(locator).toHaveAttribute("content", "website");
    }

    {
      const locator = page.locator('meta[property="og:site_name"]');

      await expect(locator).toHaveAttribute("content", "Cal.com");
    }

    {
      const locator = page.locator('link[rel="canonical"]');

      await expect(locator).toHaveAttribute("href", "http://localhost:3000/apps/installed/calendar");
    }

    {
      const locator = page.locator('meta[property="og:title"]');

      const content = await locator.getAttribute("content");

      expect(content).toMatch(/(Installed Apps|Cal\.com) \| Cal\.com/);
    }

    {
      const locator = page.locator('meta[property="og:image"]');
      const content = await locator.getAttribute("content");

      expect(content?.startsWith("http://localhost:3000/_next/image?w=1200&q=100&url=")).toBeTruthy();
    }

    {
      const locator = page.locator("title");

      const innerText = await locator.innerText();

      expect(innerText).toMatch(/(Installed Apps|Cal\.com) \| Cal\.com/);
    }

    {
      const locator = page.locator('link[rel="apple-touch-icon"]');

      const href = await locator.getAttribute("href");

      expect(href).toEqual("/api/logo?type=apple-touch-icon");
    }

    {
      const locator = page.locator('link[sizes="32x32"]');

      const href = await locator.getAttribute("href");

      expect(href).toEqual("/api/logo?type=favicon-32");
    }

    {
      const locator = page.locator('link[sizes="16x16"]');

      const href = await locator.getAttribute("href");

      expect(href).toEqual("/api/logo?type=favicon-16");
    }

    {
      const locator = page.locator('link[rel="manifest"]');

      const href = await locator.getAttribute("href");

      expect(href).toEqual("/site.webmanifest");
    }

    {
      const locator = page.locator('link[rel="mask-icon"]');

      const href = await locator.getAttribute("href");

      expect(href).toEqual("/safari-pinned-tab.svg");

      const color = await locator.getAttribute("color");

      expect(color).toEqual("#000000");
    }

    {
      const locator = page.locator('meta[name="msapplication-TileColor"]');

      const content = await locator.getAttribute("content");

      expect(content).toEqual("#ff0000");
    }

    {
      const locator = page.locator('meta[media="(prefers-color-scheme: light)"]');

      const name = await locator.getAttribute("name");

      expect(name).toEqual("theme-color");

      const content = await locator.getAttribute("content");

      expect(content).toEqual("#f9fafb");
    }

    {
      const locator = page.locator('meta[media="(prefers-color-scheme: dark)"]');

      const name = await locator.getAttribute("name");

      expect(name).toEqual("theme-color");

      const content = await locator.getAttribute("content");

      expect(content).toEqual("#1C1C1C");
    }
  });

  test("Installed Apps - Navigation", async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/apps/installed");
    await page.waitForSelector('[data-testid="connect-calendar-apps"]');
    await page.click('[data-testid="vertical-tab-payment"]');
    await page.waitForSelector('[data-testid="connect-payment-apps"]');
    await page.click('[data-testid="vertical-tab-automation"]');
    await page.waitForSelector('[data-testid="connect-automation-apps"]');
  });
});

test.describe("App Store - Unauthed", () => {
  test("Browse apple-calendar and try to install", async ({ page }) => {
    await installAppleCalendar(page);

    await expect(page.locator(`[data-testid="login-form"]`)).toBeVisible();
  });
});
