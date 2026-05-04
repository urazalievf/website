/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar, CountUp */

const RW_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

function RewardsApp() {
  const [t, setTweak] = useTweaks(RW_DEFAULTS);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t]);

  return (
    <>
      {t.showOrbs && <OrbField count={6} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="rewards" />

      <main className="container">
        <section className="rw-hero" data-screen-label="Rewards Hero">
          <div className="hero-stamp">
            <span><span className="num">005</span> / Referrals</span>
            <span>three lists</span>
            <span style={{color:'var(--lumen-2)'}}>cards I actually carry, the bank I actually use, codes I actually share</span>
          </div>
          <h1>A short list of <em>things worth signing up for</em>.</h1>
          <p className="lead">
            Every link below is a real referral — for accounts I actually have. If you sign up, we both get a small bonus. If you don't, no harm done. The list stays short on purpose; nothing here just to fill the page.
          </p>

          <div className="rw-stat-row">
            <div className="rw-stat glass">
              <div className="num"><CountUp to={3} /></div>
              <div className="label">Categories</div>
            </div>
            <div className="rw-stat glass">
              <div className="num"><CountUp to={10} /></div>
              <div className="label">Cards in wallet</div>
            </div>
            <div className="rw-stat glass">
              <div className="num"><em><CountUp to={22} /></em></div>
              <div className="label">Active referrals</div>
            </div>
          </div>
        </section>

        <section data-screen-label="Routes">
          <div className="hero-stamp" style={{marginTop: 32, marginBottom: 16}}>
            <span><span className="num">006</span> / Pick a list</span>
            <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>three doors</span>
          </div>

          <div className="rw-routes">
            <a className="rw-route glass" href="rewards-banking.html">
              <span className="num">01 / Banking</span>
              <h3>Open an <em>account</em>.</h3>
              <div className="desc">Schwab Investor Checking + Brokerage — fee-free, global ATM rebates, no foreign transaction fees. The setup I built around.</div>
              <div className="meta"><span>1 account</span><span>·</span><span>USD</span></div>
              <span className="arrow">See the bank <span className="arr">→</span></span>
            </a>

            <a className="rw-route glass" href="rewards-cards.html">
              <span className="num">02 / Credit cards</span>
              <h3>Get a <em>card</em>.</h3>
              <div className="desc">Ten cards I'd recommend to a friend — Amex Platinum, Gold, and Blue Cash; Chase Sapphire Reserve, Prime Visa, United Club; Capital One Venture X and VentureOne; Bilt; Apple Card. Each with the perks I'd actually call out.</div>
              <div className="meta"><span>10 cards</span><span>·</span><span>credit pull required</span></div>
              <span className="arrow">See cards <span className="arr">→</span></span>
            </a>

            <a className="rw-route glass" href="rewards-coupons.html">
              <span className="num">03 / Coupons</span>
              <h3>Save a <em>few dollars</em>.</h3>
              <div className="desc">Eleven referral codes for stuff I use — Rakuten, Capital One Shopping, Amazon Prime, Kindle Unlimited, Audible, Uber Eats, DoorDash, Copilot, Airbnb, Uber, Lyft. Click to copy.</div>
              <div className="meta"><span>11 codes</span><span>·</span><span>5 categories</span></div>
              <span className="arrow">See coupons <span className="arr">→</span></span>
            </a>
          </div>
        </section>

        <section style={{paddingBottom: 40}}>
          <div className="rw-fineprint glass">
            <strong>How this works.</strong> Most links on these pages are referrals. If you sign up through one, I usually get a small kickback (a card statement credit, a few free months, sometimes nothing) and you get a bonus too. I'd link these even without the bonus — they're things I use. If a deal stops being worth it, the row comes off.
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

ReactDOM.createRoot(document.getElementById("root")).render(<RewardsApp />);
