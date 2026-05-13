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
      const result = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        // If we're over, walk the DOM and pick out every element whose
        // right edge sits beyond the client width. Surface the worst
        // few so the failure message says exactly which node leaks.
        let offenders = [];
        if (docW > clientW + 1 || bodyW > clientW + 1) {
          const all = document.querySelectorAll("body *");
          const rows = [];
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > clientW + 1 && r.width > 0) {
              const id = el.id ? "#" + el.id : "";
              const cls = el.className && typeof el.className === "string"
                ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
                : "";
              rows.push({
                sel: (el.tagName.toLowerCase() + id + cls).slice(0, 80),
                right: Math.round(r.right),
                w: Math.round(r.width),
              });
            }
          }
          rows.sort((a, b) => b.right - a.right);
          offenders = rows.slice(0, 8);
        }
        return { docW, bodyW, clientW, offenders };
      });

      const detail = result.offenders.length
        ? "\nOverflow offenders (right edge, width):\n" +
          result.offenders.map((o) => `  ${o.right}px wide=${o.w}  ${o.sel}`).join("\n")
        : "";
      // 1px slack absorbs subpixel rounding on fractional DPRs.
      expect(
        result.docW,
        `documentElement.scrollWidth ${result.docW} exceeds clientWidth ${result.clientW}.${detail}`
      ).toBeLessThanOrEqual(result.clientW + 1);
      expect(
        result.bodyW,
        `body.scrollWidth ${result.bodyW} exceeds clientWidth ${result.clientW}.${detail}`
      ).toBeLessThanOrEqual(result.clientW + 1);
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
