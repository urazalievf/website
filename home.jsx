/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar, CountUp, ListeningCarousel, Guestbook, ReadingNow, ChessBoard, WineCard, WireGlobe, GoodreadsQuote, LiveCounters */
const { useEffect: hUseEffect, useState: hUseState } = React;

const HOME_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "showStarfield": true,
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

/* ── Inline brand glyphs for the profiles strip ─────────────────────── */
const ProfileIcon = ({ name }) => {
  const common = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "currentColor", stroke: "none" };
  switch (name) {
    case "LinkedIn":
      return <svg {...common}><path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.22 8h4.53V23H.22V8zM7.5 8h4.34v2.05h.06c.6-1.13 2.07-2.32 4.27-2.32 4.57 0 5.42 3 5.42 6.92V23h-4.52v-6.5c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.49 1.69-2.49 3.43V23H7.5V8z"/></svg>;
    case "X":
      return <svg {...common}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.255 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
    case "GitHub":
      return <svg {...common}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>;
    case "Medium":
      return <svg {...common}><path d="M2.846 6.887a.84.84 0 0 0-.272-.71L.55 3.733V3.37h6.272l4.847 10.633L15.929 3.37H21.91v.363l-1.732 1.66a.51.51 0 0 0-.193.486v12.21a.51.51 0 0 0 .193.487l1.69 1.66v.362h-8.498v-.362l1.752-1.7c.172-.172.172-.222.172-.487V8.265L9.72 20.564h-.659L3.39 8.265v8.243a1.15 1.15 0 0 0 .314.954l2.28 2.768v.363H.045v-.363l2.28-2.768a1.11 1.11 0 0 0 .293-.954V6.887z"/></svg>;
    case "Goodreads":
      return <svg {...common}><path d="M11.43 21.825c-3.246 0-5.39-1.708-5.567-4.402h2.46c.236 1.488 1.673 2.276 3.472 2.246 2.376-.034 3.652-1.4 3.652-4.612v-1.342h-.043c-.795 1.518-2.357 2.474-4.255 2.474C6.703 16.19 4.327 13.36 4.327 9.583c0-3.853 2.354-6.69 6.91-6.69 1.917 0 3.59.97 4.302 2.486h.043V3.241h2.346v11.654c0 4.595-2.78 6.93-6.498 6.93zm.063-7.78c2.836 0 4.604-2.187 4.604-4.566 0-2.84-1.62-4.71-4.604-4.71-2.985 0-4.604 1.86-4.604 4.71 0 2.38 1.768 4.566 4.604 4.566z"/></svg>;
    case "Last.fm":
      return <svg {...common}><path d="M10.584 17.21l-.88-2.392s-1.43 1.594-3.573 1.594c-1.897 0-3.244-1.649-3.244-4.288 0-3.382 1.704-4.591 3.381-4.591 2.42 0 3.189 1.567 3.849 3.574l.88 2.749c.88 2.667 2.529 4.81 7.285 4.81 3.409 0 5.718-1.044 5.718-3.793 0-2.227-1.265-3.381-3.629-3.93l-1.759-.412c-1.21-.275-1.567-.77-1.567-1.595 0-.934.742-1.484 1.952-1.484 1.32 0 2.034.495 2.144 1.677l2.749-.33c-.22-2.474-1.924-3.492-4.756-3.492-2.502 0-4.948.935-4.948 3.93 0 1.87.907 3.05 3.189 3.6l1.869.44c1.402.331 1.869.907 1.869 1.704 0 1.018-.99 1.43-2.859 1.43-2.777 0-3.93-1.456-4.59-3.464l-.907-2.749c-1.155-3.574-2.997-4.893-6.653-4.893C2.227 5.295 0 7.66 0 11.694c0 3.876 1.98 5.965 5.526 5.965 2.86 0 4.234-1.347 5.058-2.45z"/></svg>;
    default: return null;
  }
};

/* ── Larger brand glyphs for the off-grid logbook tiles ─────────────── */
const BrandGlyph = ({ brand }) => {
  if (brand === "chess") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M19 44h22v3H19zM21 41h18v3H21z" fill="currentColor"/>
        <path d="M22 41c0-9 4-13 7-15.5 1.6-1.3 2-2.5 1.5-4.2-.4-1.4-1.5-2.4-2.7-2.6L26 18l1.5-3 1.6.3c2.3.3 4.4 1.6 5.6 3.6 2 3.4 4.5 6.4 4.5 12.1 0 5-2 8-2 10H22z" fill="currentColor"/>
        <circle cx="34" cy="24" r="1.1" fill="#0e0e10"/>
        <path d="M22 33c.5-2 2.5-3.5 4.5-3.5" stroke="#0e0e10" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (brand === "vivino") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path d="M18 11h20v8c0 5.5-4.5 10-10 10s-10-4.5-10-10v-8z" fill="currentColor"/>
        <path d="M22 11l6 12 6-12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M28 29v12M22 41h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/>
      </svg>
    );
  }
  if (brand === "untappd") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <g transform="translate(28 28)">
          {Array.from({length:20}).map((_,i)=>(
            <rect key={i} x="-2" y="-22" width="4" height="6" rx="1" fill="currentColor" transform={`rotate(${i*18})`}/>
          ))}
          <circle r="16" fill="currentColor"/>
          <path d="M-8 -2 q4 -6 8 0 t8 0" stroke="#0e0e10" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M-8 4 q4 -6 8 0 t8 0" stroke="#0e0e10" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        </g>
      </svg>
    );
  }
  return null;
};

const SOCIALS = [
  { name: "LinkedIn",  cls: "s-linkedin",  href: "https://www.linkedin.com/in/urazalievf/" },
  { name: "X",         cls: "s-x",         href: "https://www.x.com/urazaliev_f" },
  { name: "GitHub",    cls: "s-github",    href: "https://github.com/urazalievf" },
  { name: "Medium",    cls: "s-medium",    href: "https://medium.feruzurazaliev.com" },
  { name: "Goodreads", cls: "s-goodreads", href: "https://www.goodreads.com/urazaliev_f" },
  { name: "Last.fm",   cls: "s-lastfm",    href: "https://www.last.fm/user/urazaliev_f" },
];

const OFFGRID = [
  { num: "01", brand: "chess",   name: "Chess.com", desc: "Slow rapid games, mostly e4 weeks. Send a challenge.", cta: "Play",   href: "https://www.chess.com/" },
  { num: "02", brand: "vivino",  name: "Vivino",    desc: "Wine notes, no agenda. Reds mostly, the occasional impulse Burgundy.", cta: "Follow", href: "https://www.vivino.com/users/urazaliev_f" },
  { num: "03", brand: "untappd", name: "Untappd",   desc: "Belgian abbey ales, Czech lagers, whatever the bar pours.", cta: "Follow", href: "https://untappd.com/user/urazaliev_f" },
];

function HomeApp() {
  const [tweaks, setTweak] = useTweaks(HOME_DEFAULTS);

  hUseEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", tweaks.aesthetic);
    document.documentElement.setAttribute("data-font", tweaks.font);
    if (!tweaks.showStarfield) document.body.classList.add("no-stars");
    else document.body.classList.remove("no-stars");
  }, [tweaks]);

  // local clock for the now-band
  const [time, setTime] = hUseState(() => new Date());
  hUseEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const fmt  = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Chicago" });
  const date = time.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });

  return (
    <>
      {tweaks.showOrbs && <OrbField count={9} />}
      {tweaks.showStatusBar && <StatusBar />}
      <SiteNav active="home" />

      <main className="container">
        {/* HERO ─────────────────────────────────────────────── */}
        <section className="hero" data-screen-label="Hero">
          <div className="hero-stamp">
            <span><span className="num">001</span> / Personal site</span>
            <span>Edition 03 — 2026</span>
            <span className="live"><span className="tick" /> Live · online</span>
          </div>

          <div className="hero-grid hero-grid--globe">
            <div className="hero-text">
              <h1>
                <span style={{fontWeight: 700, letterSpacing: "-0.04em", fontSize: "clamp(48px, 7vw, 120px)"}}>Feruz Urazaliev</span>
              </h1>
              <p className="lead" style={{marginTop: "var(--s-4)", maxWidth: "52ch"}}>
                Building data things. Metalcore on repeat. Occasionally losing at chess.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "var(--s-4)" }}>
                <a className="btn btn-primary" href="#profiles">Profiles ↓</a>
              </div>
            </div>
            <div className="hero-globe">
              <WireGlobe size={420} />
            </div>
          </div>

          <div className="hero-now glass">
            <span className="label"><span className="tick" /> Now</span>
            <span className="now-text">Reading <em style={{color: 'var(--lumen)', fontStyle: 'italic'}}>Antifragile</em> for the third time. Drafting a small note on Spark partitioning.</span>
            <span className="now-meta">{date}</span>
            <span className="now-meta" style={{color: 'var(--violet)'}}>{fmt} CT</span>
          </div>

          <LiveCounters />
        </section>

        {/* PROFILES STRIP ─────────────────────────────────────── */}
        <section data-screen-label="Profiles" id="profiles">
          <div className="hero-stamp">
            <span><span className="num">002</span> / Profiles</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>six places, one of me</span>
          </div>
          <div className="socials-card glass" style={{display:"flex", justifyContent:"center"}}>
            <div className="socials">
              {SOCIALS.map(s => (
                <a key={s.name} className={"social-tile " + s.cls} href={s.href}
                   target="_blank" rel="noreferrer"
                   aria-label={s.name} title={s.name}>
                  <ProfileIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* TILES — three doors ─────────────────────────────────── */}
        <section data-screen-label="Sections">
          <div className="hero-stamp" style={{ marginBottom: 16 }}>
            <span><span className="num">003</span> / The doors</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— pick one</span>
          </div>

          <div className="tiles">
            <a className="tile tile-lg glass is-featured" href="projects.html">
              <div className="tile-head">
                <span><span className="num">01.</span> &nbsp;PROJECTS</span>
                <span className="kind">Index</span>
              </div>
              <div>
                <div className="tile-title">Data engineer. <em>Pipelines</em>, dashboards, warehouses.</div>
                <div className="tile-body">A short note + a link to the place I actually publish work — DataCamp.</div>
              </div>
              <div className="tile-foot">
                <span className="tag tag--amber">DataCamp ↗</span>
                <span className="tile-arrow" style={{marginLeft: 'auto'}}>↗</span>
              </div>
            </a>

            <a className="tile tile-md glass" href="writing.html">
              <div className="tile-head">
                <span><span className="num">02.</span> &nbsp;WRITING</span>
                <span className="kind">Notes</span>
              </div>
              <div>
                <div className="tile-title">Notes, drafts, <em>marginalia</em>.</div>
                <div className="tile-body">Engineering notes, reading-room thoughts, the occasional half-finished essay. Cross-posted to Medium.</div>
              </div>
              <div className="tile-foot">
                <span className="tag">Medium</span>
                <span className="tile-arrow" style={{marginLeft: 'auto'}}>↗</span>
              </div>
            </a>

            <a className="tile tile-sm glass" href="rewards.html">
              <div className="tile-head">
                <span><span className="num">03.</span> &nbsp;REWARDS</span>
                <span className="kind">Referrals</span>
              </div>
              <div>
                <div className="tile-title">Banks, cards, <em>coupons</em>.</div>
              </div>
              <div className="tile-foot">
                <span className="tag tag--amber">3 lists</span>
                <span className="tile-arrow" style={{marginLeft: 'auto'}}>↗</span>
              </div>
            </a>

            <a className="tile tile-sm glass" href="https://buy.stripe.com/5kA2bmbWr4Bm8483cc" target="_blank" rel="noreferrer">
              <div className="tile-head">
                <span><span className="num">04.</span> &nbsp;PAYMENTS</span>
                <span className="kind">External ↗</span>
              </div>
              <div>
                <div className="tile-title">Owed me <em>something?</em></div>
              </div>
              <div className="tile-foot">
                <span className="tag">Stripe</span>
                <span className="tile-arrow" style={{marginLeft: 'auto'}}>↗</span>
              </div>
            </a>

          </div>
        </section>

        {/* QUOTE ─ live from Goodreads liked quotes ───────────── */}
        <section data-screen-label="Quote">
          <GoodreadsQuote num="004" user="urazaliev_f" fallback={{
            text: "A Stoic is someone who transforms fear into prudence, pain into transformation, mistakes into initiation, and desire into undertaking.",
            attrib: "Nassim Nicholas Taleb · The Bed of Procrustes"
          }} />
        </section>

        {/* READING NOW ─────────────────────────────────────────── */}
        <section data-screen-label="Reading">
          <div className="hero-stamp" style={{ marginBottom: 4 }}>
            <span><span className="num">005</span> / Reading right now</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— live shelf</span>
          </div>
          <ReadingNow />
        </section>

        {/* LISTENING ───────────────────────────────────────────── */}
        <section data-screen-label="Listening">
          <div className="hero-stamp">
            <span><span className="num">006</span> / Listening</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>Last.fm scrobbles</span>
          </div>
          <ListeningCarousel />
        </section>

        {/* CHESS BOARD ─────────────────────────────────────────── */}
        <section data-screen-label="Chess">
          <div className="hero-stamp">
            <span><span className="num">007</span> / Chess board</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>have a go</span>
          </div>
          <ChessBoard />
        </section>

        {/* TASTING NOTE ────────────────────────────────────────── */}
        <section data-screen-label="Wine">
          <div className="hero-stamp">
            <span><span className="num">008</span> / Tasting note</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>most recent</span>
          </div>
          <WineCard />
        </section>

        {/* OFF-GRID — branded logbooks ─────────────────────────── */}
        <section data-screen-label="Off-grid">
          <div className="hero-stamp">
            <span><span className="num">009</span> / Off-grid</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>logbooks I keep for fun</span>
          </div>
          <div className="morelinks">
            {OFFGRID.map(m => (
              <a key={m.num} className={`link-tile lt-${m.brand}`} href={m.href} target="_blank" rel="noreferrer">
                <div className="lt-mark" aria-hidden="true">
                  <BrandGlyph brand={m.brand} />
                </div>
                <div className="lt-body">
                  <div className="lt-row">
                    <span className="num">{m.num}</span>
                    <span className="lt-host">{
                      m.brand === "chess" ? "chess.com"
                      : m.brand === "vivino" ? "vivino.com"
                      : "untappd.com"
                    }</span>
                  </div>
                  <h5>{m.name}</h5>
                  <p>{m.desc}</p>
                  <span className="cta">{m.cta} <span aria-hidden="true">→</span></span>
                </div>
              </a>
            ))}
          </div>
        </section>


      </main>

      <SiteFooter />

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Aesthetic">
          <TweakRadio
            label="System"
            value={tweaks.aesthetic}
            options={[
              { value: "glass", label: "Glass" },
              { value: "paper", label: "Paper" },
            ]}
            onChange={(v) => setTweak("aesthetic", v)}
          />
        </TweakSection>
        <TweakSection title="Typography">
          <TweakSelect
            label="Display font"
            value={tweaks.font}
            options={[
              { value: "classic",   label: "Fraunces · classic editorial" },
              { value: "editorial", label: "Instrument Serif · quieter" },
              { value: "modern",    label: "Bricolage · modern grotesque" },
            ]}
            onChange={(v) => setTweak("font", v)}
          />
        </TweakSection>
        <TweakSection title="Atmosphere">
          <TweakRadio
            label="Floating orbs"
            value={tweaks.showOrbs ? "on" : "off"}
            options={[{value: "on", label: "On"}, {value: "off", label: "Off"}]}
            onChange={(v) => setTweak("showOrbs", v === "on")}
          />
          <TweakRadio
            label="Stars"
            value={tweaks.showStarfield ? "on" : "off"}
            options={[{value: "on", label: "On"}, {value: "off", label: "Off"}]}
            onChange={(v) => setTweak("showStarfield", v === "on")}
          />
          <TweakRadio
            label="Status bar"
            value={tweaks.showStatusBar ? "on" : "off"}
            options={[{value: "on", label: "On"}, {value: "off", label: "Off"}]}
            onChange={(v) => setTweak("showStatusBar", v === "on")}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomeApp />);
