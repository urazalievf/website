/* global React */
const { useState, useEffect, useRef } = React;

/* ─────────────────────────────────────────────────────────────────
   VaultMark — the gold "V" monogram on a dark card, the Cards Vault
   "Ultra" brand mark. Used in the nav and footer. `uid` keeps the
   gradient ids unique when the mark renders more than once per page.
   ───────────────────────────────────────────────────────────────── */
function VaultMark({ size = 26, uid = "vm" }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={uid + "_bg"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a2f1f" />
          <stop offset="100%" stopColor="#1a140a" />
        </linearGradient>
        <linearGradient id={uid + "_v"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff5cc" />
          <stop offset="50%" stopColor="#ecc97e" />
          <stop offset="100%" stopColor="#a87830" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill={`url(#${uid}_bg)`} stroke="rgba(236,201,126,0.4)" strokeWidth="1.2" />
      <path d="M 13 13 L 25 13 L 32 37 L 39 13 L 51 13 L 32 52 Z" fill={`url(#${uid}_v)`} />
      <path d="M 13 13 L 25 13 L 25 16 L 13 16 Z" fill="rgba(255,255,255,0.5)" />
      <path d="M 39 13 L 51 13 L 51 16 L 39 16 Z" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SiteNav — sticky pill nav with brand, link list, and CTA.
   On narrow viewports the link list collapses into a hamburger
   drawer that opens a full-screen sheet with the same links + CTA.
   ───────────────────────────────────────────────────────────────── */
function SiteNav({ active = "home" }) {
  const links = [
    { id: "home",     label: "Home",     href: "index.html" },
    { id: "projects", label: "Projects", href: "projects.html" },
    { id: "writing",  label: "Writing",  href: "writing.html" },
    { id: "rewards",  label: "Referrals",  href: "rewards.html" },
  ];

  const [open, setOpen] = useState(false);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Snap closed when the viewport grows past the mobile breakpoint —
  // otherwise an open drawer survives a desktop resize and traps the
  // scrollable area off-screen.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = (e) => { if (e.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return (
    <nav className={"nav" + (open ? " is-open" : "")}>
      <div className="nav-inner glass glass--pill">
        <a className="nav-brand" href="index.html">
          <VaultMark size={26} uid="navmark" />
          <span>Feruz Urazaliev</span>
        </a>
        <div className="nav-links" id="primary-nav">
          {links.map(l => (
            <a
              key={l.id}
              href={l.href}
              className={"nav-link " + (active === l.id ? "is-active" : "")}
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          className="nav-cta"
          href="https://medium.feruzurazaliev.com/subscribe"
          target="_blank"
          rel="noreferrer"
        >
          Subscribe
        </a>
        <button
          type="button"
          className={"nav-burger" + (open ? " is-active" : "")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(o => !o)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer — rendered always so the height transition can
          run smoothly; gated by the .is-open modifier on the parent. */}
      <div
        id="mobile-menu"
        className="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!open}
      >
        <div
          className="nav-drawer-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
        <div className="nav-drawer-panel glass">
          <ul className="nav-drawer-links">
            {links.map(l => (
              <li key={l.id}>
                <a
                  href={l.href}
                  className={"nav-drawer-link " + (active === l.id ? "is-active" : "")}
                  onClick={() => setOpen(false)}
                >
                  <span className="lbl">{l.label}</span>
                  <span className="arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            className="nav-drawer-cta"
            href="https://medium.feruzurazaliev.com/subscribe"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Subscribe ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SiteFooter — large name marquee + 4-col link grid + meta
   ───────────────────────────────────────────────────────────────── */
function SiteFooter() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const fmt = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Chicago"
  });

  return (
    <>
      <footer className="site-foot">
        <div className="container">
          <div className="foot-brand">
            <span className="foot-logo">
              <VaultMark size={28} uid="footmark" /> Feruz Urazaliev
            </span>
            <p className="foot-tagline">
              Data engineer in Chicago. Building data things, reading too much,
              losing at chess. Consider this the vault.
            </p>
          </div>
          <div className="foot-grid">
            <div className="foot-col">
              <h6>Site</h6>
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="writing.html">Writing</a></li>
                <li><a href="rewards.html">Referrals</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h6>Elsewhere</h6>
              <ul>
                <li><a href="https://www.linkedin.com/in/urazalievf/" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
                <li><a href="https://www.x.com/urazaliev_f" target="_blank" rel="noreferrer">Twitter / X ↗</a></li>
                <li><a href="https://github.com/urazalievf" target="_blank" rel="noreferrer">GitHub ↗</a></li>
                <li><a href="https://medium.feruzurazaliev.com" target="_blank" rel="noreferrer">Medium ↗</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h6>Off-grid</h6>
              <ul>
                <li><a href="https://www.goodreads.com/urazaliev_f" target="_blank" rel="noreferrer">Goodreads ↗</a></li>
                <li><a href="https://www.last.fm/user/urazaliev_f" target="_blank" rel="noreferrer">Last.fm ↗</a></li>
                <li><a href="https://www.vivino.com/users/urazaliev_f" target="_blank" rel="noreferrer">Vivino ↗</a></li>
                <li><a href="https://untappd.com/user/urazaliev_f" target="_blank" rel="noreferrer">Untappd ↗</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h6>Contact</h6>
              <ul>
                <li><a href="mailto:contacts@feruzurazaliev.com">contacts@feruzurazaliev.com</a></li>
                <li><a href="https://buy.stripe.com/5kA2bmbWr4Bm8483cc" target="_blank" rel="noreferrer">Payments ↗</a></li>
              </ul>
            </div>
          </div>

          <div className="foot-meta">
            <span>© {time.getFullYear()} — F.U. · All rights reserved</span>
            <span className="foot-status">
              <span className="tick" aria-hidden="true" />
              {fmt} CT · online · Status: operational
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

Object.assign(window, { SiteNav, SiteFooter });
