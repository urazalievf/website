/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar */

const PROJ_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

const DATACAMP_URL = "https://www.datacamp.com/portfolio/urazalievf";

function ProjectsApp() {
  const [t, setTweak] = useTweaks(PROJ_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t]);

  return (
    <>
      {t.showOrbs && <OrbField count={6} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="projects" />

      <main className="container">
        <section className="proj-hero" data-screen-label="Projects redirect" style={{paddingTop: 40, paddingBottom: 80}}>
          <div className="hero-stamp" style={{marginBottom: 24}}>
            <span><span className="num">003</span> / Projects</span>
            <span>Lives on DataCamp</span>
            <span style={{color: 'var(--lumen-2)'}}>portfolio + writeups</span>
          </div>

          <h1 style={{marginBottom: 16}}>
            The work lives <em>elsewhere</em>.
          </h1>

          <p className="lead" style={{maxWidth: 640}}>
            I keep the long-form portfolio on <strong style={{color: "var(--amber)", fontWeight: 500}}>DataCamp</strong>, where I have a bit more leverage over what gets posted. Pipelines, dashboards, certifications, and writeups — all of it lives there.
          </p>

          <p className="lead" style={{maxWidth: 640, marginTop: 16, color: "var(--lumen-3)"}}>
            This page used to hold a redacted index. It now just points at the source of truth.
          </p>

          <div style={{
            marginTop: 40,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}>
            <a
              className="btn btn-primary"
              href={DATACAMP_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "var(--duotone)",
                fontSize: 18,
                padding: "16px 28px",
              }}
            >
              Open the DataCamp portfolio →
            </a>
            <a className="btn btn-ghost" href="index.html">Back to home</a>
          </div>

          {/* Decorative card */}
          <div style={{
            marginTop: 60,
            padding: "var(--s-5)",
            borderRadius: "var(--r-3)",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: "var(--s-4)",
            alignItems: "center",
            maxWidth: 720,
          }} className="glass">
            <div style={{
              width: 64, height: 64,
              borderRadius: 12,
              background: "var(--duotone)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144',
              fontSize: 36,
              color: "#fff",
              boxShadow: "0 8px 24px var(--violet-glow)",
            }}>D</div>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--fs-mono-xs)",
                letterSpacing: "var(--tr-mono-up)",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}>Destination</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 144',
                fontWeight: 380,
                fontSize: 26,
                color: "var(--lumen)",
                letterSpacing: "-0.02em",
                marginTop: 2,
              }}>
                datacamp.com/portfolio/<em style={{color: "var(--amber)"}}>urazalievf</em>
              </div>
            </div>
            <a href={DATACAMP_URL} target="_blank" rel="noreferrer" className="link-amber" style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "var(--tr-mono-up)",
              textTransform: "uppercase",
              color: "var(--violet)",
              borderBottom: 0,
              padding: "10px 14px",
              border: "1px solid var(--hairline-strong)",
              borderRadius: "var(--r-pill)",
            }}>Open ↗</a>
          </div>
        </section>
      </main>

      <SiteFooter />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Aesthetic">
          <TweakRadio
            label="System"
            value={t.aesthetic}
            options={[{value:"glass",label:"Glass"},{value:"paper",label:"Paper"}]}
            onChange={(v) => setTweak("aesthetic", v)}
          />
        </TweakSection>
        <TweakSection title="Typography">
          <TweakSelect
            label="Display font"
            value={t.font}
            options={[
              { value: "classic",   label: "Fraunces - classic" },
              { value: "editorial", label: "Instrument Serif - quieter" },
              { value: "modern",    label: "Bricolage - grotesque" },
            ]}
            onChange={(v) => setTweak("font", v)}
          />
        </TweakSection>
        <TweakSection title="Atmosphere">
          <TweakRadio
            label="Floating orbs"
            value={t.showOrbs ? "on" : "off"}
            options={[{value:"on",label:"On"},{value:"off",label:"Off"}]}
            onChange={(v) => setTweak("showOrbs", v === "on")}
          />
          <TweakRadio
            label="Status bar"
            value={t.showStatusBar ? "on" : "off"}
            options={[{value:"on",label:"On"},{value:"off",label:"Off"}]}
            onChange={(v) => setTweak("showStatusBar", v === "on")}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ProjectsApp />);
