import { expect } from "@playwright/test";

import { test } from "./lib/fixtures";

test.afterEach(({ users }) => users.deleteAll());

test.describe("Change Password Test", () => {
  test("change password metadata", async ({ page, users }) => {
    const pro = await users.create();
    await pro.apiLogin();
    // Go to http://localhost:3000/settings/security
    await page.goto("/settings/security/password");

    expect(pro.username).toBeTruthy();

    await page.waitForLoadState("networkidle");

    // metadata
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
      const locator = page.locator('link[rel="canonical"]');

      await expect(locator).toHaveAttribute("href", "http://localhost:3000/settings/security/password");
    }

    {
      const locator = page.locator("title");

      const innerText = await locator.innerText();

      expect(innerText).toMatch(/(Password|Cal\.com) \| Cal\.com/);
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

    // Fill form
    await page.locator('[name="oldPassword"]').fill(String(pro.username));

    const $newPasswordField = page.locator('[name="newPassword"]');
    $newPasswordField.fill(`${pro.username}Aa1111`);

    await page.locator("text=Update").click();

    const toast = await page.waitForSelector('[data-testid="toast-success"]');

    expect(toast).toBeTruthy();
  });
});
