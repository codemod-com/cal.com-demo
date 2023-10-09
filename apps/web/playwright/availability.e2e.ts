import { expect } from "@playwright/test";

import dayjs from "@calcom/dayjs";

import { test } from "./lib/fixtures";

test.describe.configure({ mode: "parallel" });

test.describe("Availablity tests", () => {
  test.beforeEach(async ({ page, users }) => {
    const user = await users.create();
    await user.apiLogin();
    await page.goto("/availability");
    // We wait until loading is finished
    await page.waitForSelector('[data-testid="schedules"]');
  });

  test.afterEach(async ({ users }) => {
    await users.deleteAll();
  });

  test("sees proper metadata1", async ({ page }) => {
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
      const locator = page.locator('meta[property="og:url"]');

      await expect(locator).toHaveAttribute("content", "http://localhost:3000/availability");
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

      await expect(locator).toHaveAttribute("href", "http://localhost:3000/availability");
    }

    {
      const locator = page.locator('meta[property="og:title"]');

      const content = await locator.getAttribute("content");

      expect(content).toMatch(/(Availability|Cal\.com) \| Cal\.com/);
    }

    {
      const locator = page.locator('meta[property="og:image"]');
      const content = await locator.getAttribute("content");

      expect(content?.startsWith("http://localhost:3000/_next/image?w=1200&q=100&url=")).toBeTruthy();
    }

    {
      const locator = page.locator("title");

      const innerText = await locator.innerText();

      expect(innerText).toMatch(/(Availability|Cal\.com) \| Cal\.com/);
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

  test("Date Overrides", async ({ page }) => {
    await test.step("Can add a date override", async () => {
      await page.locator('[data-testid="schedules"] > li a').click();
      await page.locator('[data-testid="add-override"]').click();
      await page.locator('[id="modal-title"]').waitFor();
      await page.locator('[data-testid="incrementMonth"]').click();
      await page.locator('[data-testid="day"][data-disabled="false"]').nth(0).click();
      await page.locator('[data-testid="date-override-mark-unavailable"]').click();
      await page.locator('[data-testid="add-override-submit-btn"]').click();
      await expect(page.locator('[data-testid="date-overrides-list"] > li')).toHaveCount(1);
      await page.locator('[form="availability-form"][type="submit"]').click();
    });

    await test.step("Date override is displayed in troubleshooter", async () => {
      const response = await page.waitForResponse("**/api/trpc/availability/schedule.update?batch=1");
      const json = await response.json();
      // @ts-expect-error trust me bro
      const date = json[0].result.data.json.schedule.availability.find((a) => !!a.date);
      const troubleshooterURL = `/availability/troubleshoot?date=${dayjs(date.date).format("YYYY-MM-DD")}`;
      await page.goto(troubleshooterURL);
      await expect(page.locator('[data-testid="troubleshooter-busy-time"]')).toHaveCount(1);
    });
  });

  test("Availability pages", async ({ page }) => {
    await test.step("Can add a new schedule", async () => {
      await page.locator('[data-testid="new-schedule"]').click();
      await page.locator('[id="name"]').fill("More working hours");
      page.locator('[type="submit"]').click();
      await expect(page.locator("[data-testid=availablity-title]")).toHaveValue("More working hours");
    });
    await test.step("Can delete a schedule", async () => {
      await page.getByRole("button", { name: /Go Back/i }).click();
      await page.locator('[data-testid="schedules"] > li').nth(1).getByTestId("schedule-more").click();
      await page.locator('[data-testid="delete-schedule"]').click();
      const toast = await page.waitForSelector('[data-testid="toast-success"]');
      expect(toast).toBeTruthy();

      await expect(page.locator('[data-testid="schedules"] > li').nth(1)).toHaveCount(0);
    });
    await test.step("Cannot delete a schedule if a single schedule is present", async () => {
      await page.locator('[data-testid="schedules"] > li').nth(0).getByTestId("schedule-more").click();
      await page.locator('[data-testid="delete-schedule"]').click();
      const toast = await page.waitForSelector('[data-testid="toast-error"]');
      expect(toast).toBeTruthy();

      await expect(page.locator('[data-testid="schedules"] > li').nth(0)).toHaveCount(1);
    });
  });
});
