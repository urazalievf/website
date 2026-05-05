/* global React */
const { useState, useEffect, useRef } = React;

/* ─────────────────────────────────────────────────────────────────
   SiteNav — sticky pill nav with brand, link list, and CTA
   ───────────────────────────────────────────────────────────────── */
function SiteNav({ active = "home" }) {
  const links = [
    { id: "home",     label: "Home",     href: "index.html" },
    { id: "projects", label: "Projects", href: "projects.html" },
    { id: "writing",  label: "Writing",  href: "writing.html" },
    { id: "rewards",  label: "Referrals",  href: "rewards.html" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner glass glass--pill">
        <a className="nav-brand" href="index.html">
          <span className="dot" />
          <span>Feruz Urazaliev</span>
        </a>
        <div className="nav-links">
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

  const reduce = typeof window !== "undefined"
    && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Drive the 3D footer accent with @splinetool/runtime instead of
  // <spline-viewer>. The viewer wrapper injects a fixed "Built with Spline"
  // badge for free-tier scenes; the runtime renders the same scene without
  // it, so we attribute Spline ourselves in foot-meta below.
  const canvasRef = useRef(null);
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let app;
    let cancelled = false;
    import("https://cdn.jsdelivr.net/npm/@splinetool/runtime/+esm")
      .then((mod) => {
        if (cancelled) return;
        app = new mod.Application(canvas);
        return app.load("https://prod.spline.design/Lqu1KhxLD6g3YGtG/scene.splinecode");
      })
      .catch((err) => { console.warn("Spline runtime failed:", err); });
    return () => {
      cancelled = true;
      if (app && typeof app.dispose === "function") {
        try { app.dispose(); } catch (_e) { /* ignore */ }
      }
    };
  }, [reduce]);

  const fmt = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Chicago"
  });

  return (
    <>
      <footer className="site-foot">
        {!reduce && (
          <div className="foot-spline" aria-hidden="true">
            <canvas ref={canvasRef} />
          </div>
        )}
        <div className="container">
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
            <span>© {time.getFullYear()} — F.U.</span>
            <span>
              {fmt} CT · <span style={{ color: "var(--violet)" }}>● online</span>
              {!reduce && (
                <>
                  {" · "}
                  <a
                    className="foot-credit"
                    href="https://spline.design"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Footer scene · Spline ↗
                  </a>
                </>
              )}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

Object.assign(window, { SiteNav, SiteFooter });
