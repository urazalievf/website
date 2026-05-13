import { defineConfig } from "@playwright/test";

// Responsive smoke tests. Serves the static site from Python's built-in
// http.server so the test suite has no extra Node dep beyond Playwright
// itself. Three viewport projects mirror the DESIGN.md breakpoints.

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:8123",
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: "python3 -m http.server 8123 --bind 127.0.0.1",
    url: "http://127.0.0.1:8123/index.html",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "mobile",  use: { viewport: { width: 360,  height: 740 } } },
    { name: "tablet",  use: { viewport: { width: 768,  height: 1024 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
});
