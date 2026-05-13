# Design rules

Rules the site has settled on after PR #76 (mobile-first responsive
fixes). The `design-rules` GitHub Action checks the load-bearing ones
on every PR. The rest live here so reviewers have something concrete
to point at.

## Breakpoints

Mobile-first. Default styles target phones; media queries widen the
layout. Use one of the canonical max-width breakpoints below — adding
a new value should be a deliberate, page-wide choice, not a one-off.

| Token       | Max-width | Use for                                        |
|-------------|-----------|------------------------------------------------|
| `phone-sm`  | 480px     | Tiny phones; single-column collapse            |
| `phone`     | 540px     | Standard phones; primary mobile breakpoint     |
| `phone-lg`  | 720px     | Large phones / small tablets in portrait       |
| `tablet`    | 760px     | Tablets / small landscape                      |
| `tablet-lg` | 880px     | Bigger tablets, narrow laptops                 |
| `desktop`   | 980px     | Hero-grid collapses below this                 |
| `wide`      | 1100px    | Multi-column → two-column for tiles/grids      |

Every page-scoped CSS file (`home.css`, `projects.css`, `writing.css`,
`rewards.css`, `bio.css`) must declare **at least one** rule at
`≤760px` so the page has *something* for tablet/mobile.

`560px` and `900px` are grandfathered from code that predates PR #76
and remain in the script's allowed set so existing files keep passing.
New media queries should pick from the primary table above.

## Global overflow guards (site.css)

These keep accidental child overflow from producing a sideways scroll
on phones. The check script verifies all three exist.

```css
html, body {
  overflow-x: hidden;   /* fallback */
  overflow-x: clip;     /* preferred — no scroll container */
}
img, video, picture, svg:not([width]) {
  max-width: 100%;
  height: auto;
}
```

`html` carries the guard *as well as* `body` because body's overflow
doesn't reliably propagate to `documentElement.scrollWidth` on every
engine — without the root guard, an oversize child (a wide canvas, a
fixed parallax layer that escapes its clipping container, an inline
SVG with a width attribute) can still push the document width past
the viewport on mobile.

Long-content containers (rows with emails, URLs, tile bodies) get
`min-width: 0` so flex/grid children can shrink below their content
min-size. The list is in `site.css` under the "Mobile-friendly
defaults" comment — add to it when you introduce a new long-content
row.

## Viewport-bucketed scenes

WebGL and canvas scenes are sized off `window.innerWidth` buckets, not
the raw pixel value, so the canvas doesn't re-instantiate on every
resize tick. See `pickGlobeSize` in `home.jsx` and the orb-count
ladder (4 → 6 → 9). Any new heavy scene follows the same pattern.

## Mobile navigation

`SiteNav` (in `site-shell.jsx`) collapses to a hamburger drawer below
860px. The drawer locks body scroll, dismisses on Escape and on
resize past the breakpoint, and is z-ordered below the X button so
the close affordance stays tappable. New nav links must live in both
the desktop list and the drawer.

## Typography that scales

Display headings use `clamp(min, vw, max)` so they shrink on phones
without media queries. Don't set inline `font-size` on hero headings
— bind to a class so media queries can override. (PR #76 had to
unwind this exact mistake on `.hero-name`.)

## When in doubt

If you're touching CSS and aren't sure whether your change is
mobile-safe, open the dev tools, resize to 360px, and scroll. If the
page scrolls horizontally, something is leaking width — usually a
fixed `min-width`, an unsized image, or a flex/grid child without
`min-width: 0`.
