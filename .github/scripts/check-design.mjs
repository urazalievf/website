#!/usr/bin/env node
// Enforces the load-bearing rules from DESIGN.md. Pure Node, no deps —
// runs in the design-rules workflow and is cheap to run locally:
//
//   node .github/scripts/check-design.mjs
//
// Adding a rule? Push it as a function returning {ok, msg} and append
// it to RULES. Keep the rule scope narrow — this script is meant to
// catch regressions, not replace human review.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

// Strip CSS comments so pattern checks don't false-match on prose
// inside /* ... */ blocks.
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const PAGE_CSS = ["home.css", "projects.css", "writing.css", "rewards.css", "bio.css"];

// Canonical breakpoints — see DESIGN.md. 560 and 900 are grandfathered
// from pre-PR-#76 code; new media queries should pick from the primary
// set (480 / 540 / 720 / 760 / 860 / 880 / 980 / 1100).
const CANONICAL = new Set([480, 540, 560, 720, 760, 860, 880, 900, 980, 1100]);

const rules = [
  {
    name: "site.css declares html and body overflow-x guards",
    run() {
      const css = stripComments(read("site.css"));
      // Scan every selector list that ends with the root or body so
      // grouped selectors ("html, body { margin: 0 }") don't shadow
      // the dedicated blocks that hold the overflow guard.
      const bodyBlocks = css.match(/(^|[\s,}])body\s*\{[^}]*\}/g) || [];
      const htmlBlocks = css.match(/(^|[\s,}])html\s*\{[^}]*\}/g) || [];
      const re = /overflow-x:\s*(clip|hidden)/;
      const bodyOk = bodyBlocks.some((b) => re.test(b));
      const htmlOk = htmlBlocks.some((b) => re.test(b));
      if (!bodyOk && !htmlOk) {
        return { ok: false, msg: "html { overflow-x: clip } AND body { overflow-x: clip } both missing — phones will scroll sideways on any child overflow" };
      }
      if (!htmlOk) {
        return { ok: false, msg: "html { overflow-x: clip | hidden } missing — body's overflow-x doesn't reliably propagate to documentElement on every engine, so a fixed/parallax child can still extend the document width" };
      }
      if (!bodyOk) {
        return { ok: false, msg: "body { overflow-x: clip | hidden } missing — needed alongside the html guard for sticky-descendant compatibility" };
      }
      return { ok: true };
    },
  },
  {
    name: "site.css declares img/media max-width guard",
    run() {
      const css = stripComments(read("site.css"));
      // Look for a selector list that includes img and sets max-width
      const blocks = css.match(/[^}]*\bimg\b[^{}]*\{[^}]*\}/g) || [];
      const ok = blocks.some((b) => /max-width:\s*100%/.test(b));
      return ok
        ? { ok: true }
        : { ok: false, msg: "img { max-width: 100% } not found — unsized images can burst the viewport on mobile" };
    },
  },
  {
    name: "every page CSS has a tablet/mobile breakpoint",
    run() {
      const missing = [];
      for (const file of PAGE_CSS) {
        let css;
        try { css = stripComments(read(file)); }
        catch { continue; }
        const has = /@media[^{]*\(\s*max-width:\s*(480|540|720|760)px\s*\)/.test(css);
        if (!has) missing.push(file);
      }
      return missing.length === 0
        ? { ok: true }
        : { ok: false, msg: `missing a ≤760px breakpoint: ${missing.join(", ")}` };
    },
  },
  {
    name: "media query breakpoints are canonical",
    run() {
      const offenders = [];
      const files = [...PAGE_CSS, "site.css", "globals.css"];
      for (const file of files) {
        let css;
        try { css = stripComments(read(file)); }
        catch { continue; }
        const matches = css.matchAll(/@media[^{]*\(\s*max-width:\s*(\d+)px\s*\)/g);
        for (const m of matches) {
          const px = parseInt(m[1], 10);
          if (!CANONICAL.has(px)) offenders.push(`${file}: ${px}px`);
        }
      }
      return offenders.length === 0
        ? { ok: true }
        : { ok: false, msg: `non-canonical breakpoints — see DESIGN.md:\n    ${offenders.join("\n    ")}` };
    },
  },
];

let failures = 0;
for (const r of rules) {
  const { ok, msg } = r.run();
  if (ok) {
    console.log(`ok    ${r.name}`);
  } else {
    failures++;
    console.log(`FAIL  ${r.name}`);
    console.log(`      ${msg}`);
  }
}

if (failures > 0) {
  console.log(`\n${failures} rule${failures === 1 ? "" : "s"} failed. See DESIGN.md for context.`);
  process.exit(1);
}
console.log(`\nAll ${rules.length} design rules passed.`);
