/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar */

const RC_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

const CARDS = [
  {
    brand: "American Express",
    name: "Platinum · Schwab edition",
    image: "images/Amex-Platinum.png",
    af: "$695",
    desc: "The Schwab-branded Platinum — same lounge access and credits as the standard Plat, plus the option to redeem points to a linked Schwab brokerage.",
    benefits: [
      "5x points on flights and hotels via Amex Travel",
      "$200 hotel credit + $200 airline fee credit",
      "$240 digital entertainment credit",
    ],
    href: "https://americanexpress.com/en-us/referral/all-cards?ref=FERUZUmedP&xl=cp01",
  },
  {
    brand: "American Express",
    name: "Gold Card",
    image: "images/Amex-Gold.png",
    af: "$250",
    desc: "Restaurants, takeout, groceries — the everyday-spend card. The dining and Uber credits offset most of the AF if you'd buy that stuff anyway.",
    benefits: [
      "4x points at restaurants worldwide",
      "4x points at U.S. supermarkets",
      "3x points on flights booked direct or via Amex Travel",
    ],
    href: "https://americanexpress.com/en-us/referral/all-cards?ref=FERUZUmedP&xl=cp01",
  },
  {
    brand: "American Express",
    name: "Blue Cash Everyday",
    image: "images/Amex-EveryDay.png",
    af: "$0",
    desc: "No-fee cash-back card for the categories you'd otherwise leave on a debit card. Pairs cleanly with the Gold for off-category spend.",
    benefits: [
      "3% cash back at U.S. supermarkets",
      "3% cash back on U.S. online retail",
      "3% cash back at U.S. gas stations",
    ],
    href: "https://americanexpress.com/en-us/referral/all-cards?ref=FERUZUmedP&xl=cp01",
  },
  {
    brand: "Chase · Amazon",
    name: "Prime Visa",
    image: "images/Amazon.png",
    af: "$0",
    desc: "If you're a Prime member, this is the only Amazon-spend card worth carrying. Stacks 5% on top of any Prime Day discount.",
    benefits: [
      "5% back at Amazon, Whole Foods, and Chase Travel",
      "2% back at gas, restaurants, and on transit / rideshare",
      "1% back on everything else",
    ],
    href: "https://www.amazon.com/dp/BT00LN946S?externalReferenceId=20501fe0-77d0-4d52-b9ce-9c8ded8aac85",
  },
  {
    brand: "Chase",
    name: "Sapphire Reserve",
    image: "images/CSR.png",
    af: "$550",
    desc: "Premium travel card. The Pay Yourself Back redemptions and Priority Pass lounge access are the real value; the AF is steep but the credits cover most of it.",
    benefits: [
      "10x points on hotels and car rentals via Chase Travel",
      "5x points on flights via Chase Travel",
      "$300 annual travel credit, applied automatically",
    ],
    href: "https://www.referyourchasecard.com/19q/0377PCTCSO",
  },
  {
    brand: "Chase · United",
    name: "United Club Card",
    image: "images/pc-mileageplus-visa-infinite.png",
    af: "$525",
    desc: "Worth it only if you actually fly United often enough to use the lounge. The Club membership alone runs ~$650/year retail.",
    benefits: [
      "United Club℠ membership included",
      "4 miles per $1 on United purchases",
      "2 miles per $1 on dining",
    ],
    href: "https://www.referyourchasecard.com/215R/0WQL1ZLSQR",
  },
  {
    brand: "Capital One",
    name: "Venture X",
    image: "images/Venture-X.png",
    af: "$395",
    desc: "Quietly the best mid-tier travel card on the market — flat 2x earn, $300 portal credit, lounge access, and a 10k anniversary bonus that effectively prices the AF at $95.",
    benefits: [
      "10x miles on hotels and car rentals via Capital One Travel",
      "5x miles on flights via Capital One Travel",
      "2x miles on every other purchase",
    ],
    href: "https://capital.one/3LnA0fK",
  },
  {
    brand: "Capital One",
    name: "VentureOne Rewards",
    image: "images/Venture-One.png",
    af: "$0",
    desc: "The no-fee version of Venture. Good for international purchases — no foreign transaction fees and the miles transfer to the same partners as the X.",
    benefits: [
      "1.25x miles on every purchase",
      "5x miles on hotels and rental cars via Capital One Travel",
      "No foreign transaction fees",
    ],
    href: "https://i.capitalone.com/JhBlr1c2G",
  },
  {
    brand: "Wells Fargo · Bilt",
    name: "Bilt Mastercard",
    image: "images/Bilt_card_D.png",
    af: "$0",
    desc: "The only no-fee way to earn points on rent. You have to use the card 5x/month for points to post, but that's easy.",
    benefits: [
      "1x points on rent — no transaction fee",
      "3x points on dining",
      "2x points on travel",
    ],
    href: "https://bilt.page/r/2VB3-1XWE",
  },
  {
    brand: "Apple · Goldman Sachs",
    name: "Apple Card",
    image: "images/Apple-Card.png",
    af: "$0",
    desc: "Best when paid with Apple Pay. The no-fee, no-fine-print structure is rare — and Daily Cash actually hits your account daily.",
    benefits: [
      "3% Daily Cash at select merchants (Apple, Uber, T-Mobile…)",
      "2% Daily Cash on every Apple Pay purchase",
      "1% on everything else",
    ],
    href: "https://apple.co/referdailycash",
  },
];

function RewardsCardsApp() {
  const [t, setTweak] = useTweaks(RC_DEFAULTS);
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
        <section className="rw-hero" data-screen-label="Cards Hero">
          <div className="hero-stamp">
            <span><span className="num">005</span> / Rewards / Credit cards</span>
            <a href="rewards.html" style={{color:'var(--violet)', borderBottom:0, fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'var(--tr-mono-up)', textTransform:'uppercase'}}>back to all</a>
            <span style={{color:'var(--lumen-2)'}}>{CARDS.length} cards</span>
          </div>
          <h1>Get a <em>card</em>.</h1>
          <p className="lead">
            Cards I actually carry — sorted roughly by how often they leave the wallet. Each link is a referral that earns me a small bonus and gets you a welcome offer. Annual fees and the three perks I'd actually call out are listed below.
          </p>
        </section>

        <section data-screen-label="Cards list" style={{paddingBottom: 24}}>
          <div className="rw-section-head">
            <h2>The <em>{CARDS.length}</em> in my wallet.</h2>
            <div className="stamp-line">credit pull required · 5/24 applies</div>
          </div>
          <div className="rw-list">
            {CARDS.map((c) => (
              <a key={c.brand + c.name} className="rw-card glass" href={c.href} target="_blank" rel="noreferrer">
                <div className="rw-mark m-img">
                  <img src={c.image} alt={c.brand + " " + c.name} loading="lazy" />
                </div>
                <div className="rw-body">
                  <div className="brand">{c.brand} · referral</div>
                  <div className="name">{c.name}</div>
                  <div className="desc">{c.desc}</div>
                  {c.benefits && c.benefits.length > 0 && (
                    <ul className="benefits">
                      {c.benefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
                <div className="rw-bonus">
                  <div className="label">Annual fee</div>
                  <div className="amt"><em>{c.af}</em></div>
                  <div className="label">{c.af === "$0" ? "no fee" : "per year"}</div>
                </div>
                <span className="rw-cta">Apply →</span>
              </a>
            ))}
          </div>
        </section>

        <section style={{paddingBottom: 40}}>
          <div className="rw-fineprint glass">
            <strong>About 5/24.</strong> Chase will deny most applications if you've opened five or more cards across all banks in the last 24 months. If you're new to this, start with Chase. <strong>About credit pulls.</strong> Each application is a hard pull (~5 point dip, recovers in months). Don't apply for these on a whim if you're about to get a mortgage.
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

ReactDOM.createRoot(document.getElementById("root")).render(<RewardsCardsApp />);
