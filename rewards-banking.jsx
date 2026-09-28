/* global React, ReactDOM, SiteNav, SiteFooter, OrbField, StatusBar */

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
    image: "images/Schwab.png",
    mark: "S",
    color: "m-mid",
  },
  {
    brand: "Capital One",
    name: "360 Checking",
    desc: "No-fee everyday checking with early direct deposit and a huge fee-free ATM network. The referral bonus is the easy kind — two paychecks and you're done.",
    benefits: [
      "$300 bonus after 2 direct deposits of $500+ within 75 days",
      "No monthly fees, no minimums, no overdraft fees",
      "70,000+ fee-free Capital One, MoneyPass & Allpoint ATMs",
      "Paid up to 2 days early with direct deposit",
    ],
    bonus: "$300",
    small: "2 direct deposits",
    href: "https://i.capitalone.com/JTFXUL5rz",
    cta: "Get $300",
    image: "images/Capital-One.svg",
    mark: "C",
    color: "m-rose",
  },
  {
    brand: "Capital One",
    name: "360 Performance Savings",
    desc: "High-yield savings with a tiered referral bonus — park $5k for 90 days for $75, or scale up to $1,500 at $100k. Pairs with the 360 Checking above.",
    benefits: [
      "$75 / $300 / $750 / $1,500 for $5k / $20k / $50k / $100k deposited",
      "Deposit within 15 days, hold 90 days — that's it",
      "No monthly fees, no minimum balance",
      "Competitive APY on every dollar, no tiers",
    ],
    bonus: "$75–$1,500",
    small: "by deposit size",
    href: "https://i.capitalone.com/JiRSYrs3T",
    cta: "Get the bonus",
    image: "images/Capital-One.svg",
    mark: "C",
    color: "m-sand",
  },
  {
    brand: "Robinhood",
    name: "Brokerage",
    desc: "Commission-free stocks, ETFs, options and crypto in one app. Sign up through the link, fund the account, and Robinhood drops a gift stock in for both of us.",
    benefits: [
      "$5–$200 in fractional gift stock after signup + deposit",
      "Commission-free trades, no account minimum",
      "IRA with a 1% match on contributions",
      "4%+ APY on uninvested cash with Gold",
    ],
    bonus: "$5–$200",
    small: "gift stock",
    href: "https://join.robinhood.com/feruzu",
    cta: "Get gift stock",
    image: "images/Robinhood.png",
    mark: "R",
    color: "m-emerald",
  },
];

function RewardsBankingApp() {
  return (
    <>
      <OrbField count={5} />
      <StatusBar />
      <SiteNav active="rewards" />

      <main className="container">
        <section className="rw-hero">
          <div className="hero-stamp">
            <span><span className="num">005</span> / Rewards / Banking</span>
            <a href="rewards.html" style={{color:'var(--violet)', borderBottom:0, fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'var(--tr-mono-up)', textTransform:'uppercase'}}>back to all</a>
            <span style={{color:'var(--lumen-2)'}}>{BANKS.length} account{BANKS.length === 1 ? '' : 's'}</span>
          </div>
          <h1>Open an <em>account</em>.</h1>
          <p className="lead">
            The accounts I actually use. Schwab for the checking + brokerage core, Capital One 360 for no-fee checking and high-yield savings, Robinhood for the play money. Open through a link and we both get a referral credit.
          </p>
        </section>

        <section style={{paddingBottom: 24}}>
          <div className="rw-section-head">
            <h2>What I <em>actually</em> bank with.</h2>
            <div className="stamp-line">As of this month</div>
          </div>
          <div className="rw-list">
            {BANKS.map((b) => (
              <a key={b.brand + b.name} className="rw-card glass" href={b.href} target="_blank" rel="noreferrer">
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
            <strong>What you'll need to open.</strong> Your Social Security or Tax Identification Number, your employer's name and mailing address (if applicable), and your email + mobile phone number. Each one takes about ten minutes online. Bonus terms are as of September 2026 — the issuer's page is the source of truth.
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RewardsBankingApp />);
