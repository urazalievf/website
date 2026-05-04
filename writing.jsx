/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar */
const { useState: wUseState, useMemo: wUseMemo, useEffect: wUseEffect } = React;

const WR_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

function WritingApp() {
  const [t, setTweak] = useTweaks(WR_DEFAULTS);
  wUseEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t]);

  const [posts, setPosts] = wUseState([]);
  const [loading, setLoading] = wUseState(true);

  wUseEffect(() => {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.feruzurazaliev.com/feed')
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && data.items) {
          const mapped = data.items.map(item => {
            const snippet = (item.description || '').match(/medium-feed-snippet">(.*?)<\/p>/)?.[1] || '';
            const cats = item.categories || [];
            const tag = cats.find(c => ['data-engineering','python','machine-learning','databricks','data-science'].includes(c))
                     || cats[0] || 'engineering';
            const d = new Date(item.pubDate);
            const date = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            return { date, title: item.title, sum: snippet, tag, href: item.link, thumb: item.thumbnail };
          });
          setPosts(mapped);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tags = ["all", ...Array.from(new Set(posts.map(p => p.tag)))];
  const [filter, setFilter] = wUseState("all");
  const visible = wUseMemo(
    () => filter === "all" ? posts : posts.filter(p => p.tag === filter),
    [filter]
  );

  return (
    <>
      {t.showOrbs && <OrbField count={6} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="writing" />

      <main className="container">
        <section className="wr-hero" data-screen-label="Writing Hero">
          <div className="hero-stamp" style={{marginBottom:16}}>
            <span><span className="num">004</span> / Writing</span>
            <span>{posts.length > 0 ? posts.length + ' entries' : '—'} entries</span>
            <span style={{color:'var(--lumen-2)'}}>· on Medium</span>
          </div>
          <h1>Notes, drafts,<br/><em>marginalia</em>.</h1>
          <p className="lead">
            Data engineering, mostly. Long-form lives on Medium — this is the index.
          </p>

          <div className="tag-filters">
            {tags.map(tag => (
              <button
                key={tag}
                className={"tag-filter " + (filter === tag ? "is-active" : "")}
                onClick={() => setFilter(tag)}
              >
                {tag === "all" ? "All · " + posts.length : tag}
              </button>
            ))}
          </div>
        </section>

        <section data-screen-label="Index">
          <div className="wr-list">
            {visible.map((p, i) => (
              <a key={p.title} className="wr-row" href="https://medium.feruzurazaliev.com" target="_blank" rel="noreferrer">
                <span className="date">{p.date}</span>
                <span className="title">{p.title}</span>
                <span className="summary">{p.sum}</span>
                <span className="meta">
                  <div>{p.read} · {p.tag}</div>
                  <div className={p.status === "draft" ? "draft" : ""}>● {p.status}</div>
                </span>
                <span className="arr">↗</span>
              </a>
            ))}
            {visible.length === 0 && (
              <div style={{padding: '60px 14px', fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)', textAlign: 'center'}}>
                Nothing here under "{filter}" — yet.
              </div>
            )}
          </div>
        </section>

        <section data-screen-label="Subscribe" style={{ paddingBottom: 40 }}>
          <div className="wr-callouts">
            <div className="wr-sub glass glass--violet">
              <div className="hero-stamp" style={{marginBottom: 4}}>
                <span><span className="num">005</span> / Letter</span>
                <span style={{color: 'var(--fg-faint)'}}>—— monthly-ish</span>
              </div>
              <h3>One letter, <em>a month</em>. No more.</h3>
              <p>What I read, what I built, what I'd rebuild. Short, low-pressure, never sold. Unsubscribe with one click.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                window.open("https://medium.feruzurazaliev.com/subscribe", "_blank");
              }}>
                <input type="email" placeholder="you@somewhere.tld" required />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            </div>

            <aside className="wr-side glass">
              <h6>Working on</h6>
              <div className="bullet"><span className="b">●</span><span>A long one on Spark partitioning</span></div>
              <div className="bullet"><span className="b">○</span><span>Tasting notes — Kakheti '23 vintage</span></div>
              <div className="bullet"><span className="b">○</span><span>Re-read of <em style={{color:'var(--lumen)',fontStyle:'italic'}}>Skin in the Game</em></span></div>
              <div className="bullet"><span className="b">○</span><span>A short list of unfashionable opinions</span></div>
            </aside>
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

ReactDOM.createRoot(document.getElementById("root")).render(<WritingApp />);
