import { test, expect } from "@playwright/test";

// Pages to audit. Each main route gets exercised under all three
// viewport projects defined in playwright.config.mjs.
const PAGES = [
  { path: "/index.html",    name: "home" },
  { path: "/projects.html", name: "projects" },
  { path: "/writing.html",  name: "writing" },
  { path: "/rewards.html",  name: "rewards" },
  { path: "/bio.html",      name: "bio" },
];

// Wait for the React-via-Babel boot to settle. Babel-standalone evaluates
// JSX at runtime, so the DOM is empty until #root mounts content.
async function waitForApp(page) {
  await page.waitForSelector("#root > *", { timeout: 15_000 });
  // Give Babel one more frame to settle any synchronous layout effects.
  await page.waitForTimeout(150);
}

for (const p of PAGES) {
  test.describe(p.name, () => {
    test("does not scroll horizontally", async ({ page }) => {
      await page.goto(p.path);
      await waitForApp(page);
      const { docW, bodyW, clientW } = await page.evaluate(() => ({
        docW: document.documentElement.scrollWidth,
        bodyW: document.body.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      // 1px slack absorbs subpixel rounding on fractional DPRs.
      expect(docW, "documentElement.scrollWidth exceeds clientWidth").toBeLessThanOrEqual(clientW + 1);
      expect(bodyW, "body.scrollWidth exceeds clientWidth").toBeLessThanOrEqual(clientW + 1);
    });

    test("nav adapts to viewport", async ({ page, viewport }) => {
      await page.goto(p.path);
      await waitForApp(page);
      const burger = page.locator(".nav-burger").first();
      const links = page.locator(".nav-links").first();
      const burgerVisible = await burger.isVisible().catch(() => false);
      const linksVisible = await links.isVisible().catch(() => false);

      if ((viewport?.width ?? 0) < 860) {
        expect(burgerVisible, "hamburger should be visible on narrow viewports").toBe(true);
      } else {
        expect(linksVisible, "desktop nav links should be visible on wide viewports").toBe(true);
      }
    });
  });
}
