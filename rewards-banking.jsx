/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar */

const RB_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

const BANKS = [
  {
    brand: "Charles Schwab",
    name: "Investor Checking + Brokerage",
    desc: "Linked checking + brokerage account I use as my main USD setup. Conveniently fund investments and manage day-to-day cash from one login.",
    benefits: [
      "Unlimited ATM fee rebates worldwide",
      "$0 monthly service fees, $0 account minimum",
      "No foreign transaction fees",
      "Free online bill pay + mobile check deposit",
    ],
    bonus: "$0",
    small: "fee-free",
    href: "https://www.schwab.com/client-referral?refrid=REFERAPCN8RGZ",
    cta: "Get one",
    image: null,
    mark: "S",
    color: "m-mid",
  },
];

function RewardsBankingApp() {
  const [t, setTweak] = useTweaks(RB_DEFAULTS);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t]);

  return (
    <>
      {t.showOrbs && <OrbField count={5} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="rewards" />

      <main className="container">
        <section className="rw-hero" data-screen-label="Banking Hero">
          <div className="hero-stamp">
            <span><span className="num">005</span> / Rewards / Banking</span>
            <a href="rewards.html" style={{color:'var(--violet)', borderBottom:0, fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'var(--tr-mono-up)', textTransform:'uppercase'}}>back to all</a>
            <span style={{color:'var(--lumen-2)'}}>{BANKS.length} account</span>
          </div>
          <h1>Open an <em>account</em>.</h1>
          <p className="lead">
            The bank I actually use. Linked checking and brokerage in one place — fee-free, with global ATM rebates and no foreign transaction friction. Open through the link and we both get a referral credit.
          </p>
        </section>

        <section data-screen-label="Bank list" style={{paddingBottom: 24}}>
          <div className="rw-section-head">
            <h2>What I <em>actually</em> bank with.</h2>
            <div className="stamp-line">As of this month</div>
          </div>
          <div className="rw-list">
            {BANKS.map((b) => (
              <a key={b.brand} className="rw-card glass" href={b.href} target="_blank" rel="noreferrer">
                <div className={"rw-mark " + (b.image ? "m-img m-square" : b.color)}>
                  {b.image ? <img src={b.image} alt={b.brand} loading="lazy" /> : b.mark}
                </div>
                <div className="rw-body">
                  <div className="brand">{b.brand} · referral</div>
                  <div className="name">{b.name}</div>
                  <div className="desc">{b.desc}</div>
                  {b.benefits && b.benefits.length > 0 && (
                    <ul className="benefits">
                      {b.benefits.map((bn, i) => <li key={i}>{bn}</li>)}
                    </ul>
                  )}
                </div>
                <div className="rw-bonus">
                  <div className="label">Sign-up bonus</div>
                  <div className="amt"><em>{b.bonus}</em></div>
                  <div className="label">{b.small}</div>
                </div>
                <span className="rw-cta">{b.cta} →</span>
              </a>
            ))}
          </div>
        </section>

        <section style={{paddingBottom: 40}}>
          <div className="rw-fineprint glass">
            <strong>What you'll need to open.</strong> Your Social Security or Tax Identification Number, your employer's name and mailing address (if applicable), and your email + mobile phone number. The whole thing takes about ten minutes online.
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

ReactDOM.createRoot(document.getElementById("root")).render(<RewardsBankingApp />);
