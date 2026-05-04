/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar */

const RC_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

/* CARDS — referrals + the perks I'd actually call out for each one.
   Each entry: image (optional, falls back to letter mark), brand, name,
   af (annual fee), welcome (current sign-up offer), benefits[], href.
   Welcome offers rotate frequently — verify against the issuer's page
   before treating any number here as ground truth. */
const CARDS = [
  {
    brand: "American Express",
    name: "Platinum Card",
    image: "images/Amex-Platinum.png",
    af: "$695",
    welcome: "80k–175k pts",
    desc: "The flagship Amex — built for people who actually use the lounge access and the credit stack. Targeted offers up to 175k MR points have run all year.",
    benefits: [
      "Centurion Lounge + Priority Pass + Delta Sky Club access",
      "5x on flights booked direct or via Amex Travel",
      "$200 airline + $200 hotel + $240 digital + $200 Uber credits",
      "Marriott Gold + Hilton Gold status included",
    ],
    href: "https://americanexpress.com/en-us/referral/all-cards?ref=FERUZUhV8d&xl=cp10a1",
  },
  {
    brand: "American Express",
    name: "Gold Card",
    image: "images/Amex-Gold.png",
    af: "$325",
    welcome: "60k–90k pts",
    desc: "Restaurants, takeout, groceries — the everyday-spend card. The dining and Uber credits offset most of the AF if you'd buy that stuff anyway.",
    benefits: [
      "4x at restaurants worldwide (incl. takeout & delivery)",
      "4x at U.S. supermarkets, up to $25k/yr",
      "3x on flights booked direct or via Amex Travel",
      "$120 dining credit + $120 Uber Cash credit per year",
    ],
    href: "https://americanexpress.com/en-us/referral/gold-card?ref=FERUZUp3GY&xl=cp10a1",
  },
  {
    brand: "American Express",
    name: "Hilton Honors Aspire",
    image: "images/Hilton-Aspire.png",
    af: "$550",
    welcome: "175k Hilton pts",
    desc: "If you stay at Hiltons more than two or three times a year, the math is unbeatable. Diamond status is a real upgrade and the Free Night Reward alone covers the AF at most properties.",
    benefits: [
      "Automatic Hilton Diamond status",
      "Annual Free Night Reward (+ second after $60k spend)",
      "$400 Hilton Resort credit + $200 airline credit + $189 CLEAR",
      "14x at Hilton, 7x flights/car/dining",
    ],
    href: "https://americanexpress.com/en-us/referral/hilton-honors?ref=FERUZU5Cgf&xl=cp10a1",
  },
  {
    brand: "American Express",
    name: "Blue Business Plus",
    image: "images/Amex-Business-Plus.jpg",
    af: "$0",
    welcome: "15k pts",
    desc: "The quietly excellent no-fee Amex for any 1099 work. 2x MR with no category caps is rare — and points transfer to all the same partners as the Platinum.",
    benefits: [
      "2x Membership Rewards on the first $50k/yr (then 1x)",
      "0% intro APR for 12 months on purchases",
      "Points fully transferable to Amex airline & hotel partners",
      "Employee cards at no extra cost",
    ],
    href: "https://americanexpress.com/en-us/referral/bluebusinessplus-credit-card?ref=FERUZUTtif&xl=cp10a1",
  },
  {
    brand: "American Express",
    name: "Blue Cash Everyday",
    image: "images/Amex-EveryDay.png",
    af: "$0",
    welcome: "$200 statement credit",
    desc: "No-fee cash-back card for the categories you'd otherwise leave on a debit card. Pairs cleanly with the Gold for off-category spend.",
    benefits: [
      "3% cash back at U.S. supermarkets (up to $6k/yr)",
      "3% cash back on U.S. online retail",
      "3% cash back at U.S. gas stations",
      "0% intro APR for 15 months on purchases",
    ],
    href: "https://americanexpress.com/en-us/referral/blue-cash-everyday-credit-card?ref=FERUZUuQJw&xl=cp10a1",
  },
  {
    brand: "Chase",
    name: "Sapphire Reserve",
    image: "images/CSR.png",
    af: "$795",
    welcome: "150,000 pts",
    desc: "Premium travel card, freshly refreshed in 2025. The Points Boost redemptions and Priority Pass / Sapphire Lounge access are the real value; the credit stack covers most of the AF for anyone who actually travels.",
    benefits: [
      "8x on Chase Travel; 4x flights/hotels direct; 3x dining",
      "$300 annual travel credit, applied automatically",
      "Priority Pass + Sapphire Lounge access",
      "Points Boost — 1.5x to 2x value on select redemptions",
    ],
    href: "https://www.referyourchasecard.com/19w/EFBD3HA3XO",
  },
  {
    brand: "Chase",
    name: "Freedom Unlimited",
    image: null,
    mark: "F",
    color: "m-emerald",
    af: "$0",
    welcome: "$200 cash back",
    desc: "The no-fee everyday card that quietly beats most 2% flat-cash cards once you stack the points with a Sapphire. Same referral covers Freedom Flex.",
    benefits: [
      "1.5% cash back on every purchase",
      "5% on Chase Travel; 3% on dining and drugstores",
      "0% intro APR for 15 months on purchases",
      "Points combine with Sapphire/Ink for transfer-partner value",
    ],
    href: "https://www.referyourchasecard.com/18a/EFCJKNWJFX",
  },
  {
    brand: "Chase · United",
    name: "United MileagePlus",
    image: "images/pc-mileageplus-visa-infinite.png",
    af: "varies",
    welcome: "50k–100k miles",
    desc: "One referral link covers the whole United lineup — Explorer ($95), Quest ($250), or Club Infinite ($695). Pick the tier that matches how often you fly United.",
    benefits: [
      "Free first checked bag for cardholder + companion",
      "Priority boarding on every United flight",
      "25% off inflight food, drinks & Wi-Fi",
      "Higher tiers add Star Alliance Gold status & Club access",
    ],
    href: "https://www.referyourchasecard.com/215r/EFBJUDNXZQ",
  },
  {
    brand: "Chase · Marriott",
    name: "Bonvoy Bountiful",
    image: "images/Marriott-Bountiful.png",
    af: "$250",
    welcome: "85k Bonvoy pts",
    desc: "The newest Bonvoy card from Chase — strong everyday earn outside Marriott and a Free Night Award on every anniversary that more than covers the fee.",
    benefits: [
      "4x at Marriott; 3x grocery & dining (up to $15k/yr)",
      "Annual Free Night Award (up to 50k pts)",
      "Automatic Silver Elite status; 15 Elite Night Credits/yr",
      "$100 statement credit on Marriott stays of two nights+",
    ],
    href: "https://www.referyourchasecard.com/252u/EFC1HSUR2M",
  },
  {
    brand: "Chase · Amazon",
    name: "Prime Visa",
    image: "images/Amazon.png",
    af: "$0",
    welcome: "$100–$200 Amazon credit",
    desc: "If you're a Prime member, this is the only Amazon-spend card worth carrying. Stacks 5% on top of any Prime Day discount.",
    benefits: [
      "5% back at Amazon, Whole Foods, and Chase Travel",
      "2% back at gas, restaurants, and on transit / rideshare",
      "1% back on every other purchase",
      "No foreign transaction fees",
    ],
    href: "https://www.amazon.com/dp/BT00LN946S?externalReferenceId=20501fe0-77d0-4d52-b9ce-9c8ded8aac85",
  },
  {
    brand: "Capital One",
    name: "Venture X",
    image: "images/Venture-X.png",
    af: "$395",
    welcome: "75,000–100,000 miles",
    desc: "Quietly the best mid-tier travel card on the market — flat 2x earn, $300 portal credit, lounge access, and a 10k anniversary bonus that effectively prices the AF at $95.",
    benefits: [
      "$300 annual Capital One Travel credit",
      "10k bonus miles every account anniversary",
      "Priority Pass + Capital One Lounge + Plaza Premium",
      "10x hotels/cars, 5x flights via Capital One Travel; 2x else",
    ],
    href: "https://i.capitalone.com/JdTk4YVGu",
  },
  {
    brand: "Capital One",
    name: "VentureOne Rewards",
    image: "images/Venture-One.png",
    af: "$0",
    welcome: "20,000 miles",
    desc: "The no-fee version of Venture. Good for international purchases — no foreign transaction fees and the miles transfer to the same partners as the X.",
    benefits: [
      "1.25x miles on every purchase",
      "5x miles on hotels and rental cars via Capital One Travel",
      "No foreign transaction fees",
      "Transfer to 15+ airline & hotel partners",
    ],
    href: "https://i.capitalone.com/JBcfARJtb",
  },
  {
    brand: "Bilt · Cardless",
    name: "Bilt 2.0",
    image: "images/Bilt_card_D.png",
    af: "$0 / $95 / $495",
    welcome: "—",
    desc: "The 2025 relaunch — three tiers (base, Plus, Reserve) but the headline is the same: still the only no-fee way to earn points on rent.",
    benefits: [
      "1x points on rent — no transaction fee, up to 100k pts/yr",
      "3x on dining, 2x on travel (base tier; higher on Plus/Reserve)",
      "1:1 transfers to Hyatt, AA, United, Hawaiian, Marriott, and more",
      "Rent Day on the 1st of each month — earn rates double",
    ],
    href: "https://www.bilt.com/card?invite=DSXB23DA",
  },
  {
    brand: "Apple · Goldman Sachs",
    name: "Apple Card",
    image: "images/Apple-Card.png",
    af: "$0",
    welcome: "—",
    desc: "Best when paid with Apple Pay. The no-fee, no-fine-print structure is rare — and Daily Cash actually hits your account daily.",
    benefits: [
      "3% Daily Cash at select merchants (Apple, Uber, T-Mobile…)",
      "2% Daily Cash on every Apple Pay purchase",
      "1% Daily Cash on every other purchase",
      "No fees of any kind, ever",
    ],
    href: "https://apple.co/referdailycash",
  },
  {
    brand: "Rakuten · Imprint",
    name: "Rakuten Credit Card",
    image: "images/Rakuten-Card.png",
    af: "$0",
    welcome: "$30 cash back",
    desc: "Stacks on top of normal Rakuten cash-back rates — effectively turns the Rakuten extension into a 5–10% back tool at participating stores.",
    benefits: [
      "Boosted cash back at Rakuten.com partner stores",
      "Stacks with the Rakuten browser extension's normal rates",
      "No annual fee, no foreign transaction fees",
      "Quarterly payout via PayPal or Big Fat Check",
    ],
    href: "https://r.imprint.co/JDBxwN",
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
            Cards I actually carry — in roughly the order I'd recommend them. Each link is a referral that earns me a small bonus and gets you a welcome offer. Welcome offers rotate, so the numbers below are a recent baseline; the issuer's page will show what's actually live the day you apply.
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
                <div className={"rw-mark " + (c.image ? "m-img" : (c.color || "m-violet"))}>
                  {c.image
                    ? <img src={c.image} alt={c.brand + " " + c.name} loading="lazy" />
                    : (c.mark || c.brand[0])}
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
                  <div className="label">Welcome offer</div>
                  <div className="amt"><em>{c.welcome === "—" ? "—" : c.welcome}</em></div>
                  <div className="label">{c.af === "$0" ? "no annual fee" : "AF " + c.af}</div>
                </div>
                <span className="rw-cta">Apply →</span>
              </a>
            ))}
          </div>
        </section>

        <section style={{paddingBottom: 40}}>
          <div className="rw-fineprint glass">
            <strong>About 5/24.</strong> Chase will deny most applications if you've opened five or more cards across all banks in the last 24 months. If you're new to this, start with Chase. <strong>About welcome offers.</strong> Issuers rotate sign-up bonuses constantly — the figures above are a recent snapshot, not a guarantee. Click through and the issuer's page will show the live offer at the moment you apply. <strong>About credit pulls.</strong> Each application is a hard pull (~5 point dip, recovers in months). Don't apply for these on a whim if you're about to get a mortgage.
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
