/* global React, ReactDOM, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar, SplineScene */

const RP_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true
}/*EDITMODE-END*/;

const COUPONS = [
  /* SHOPPING ─────────────────────────────────────────────────────── */
  {
    group: "Shopping",
    brand: "Rakuten",
    name: "Cash back at thousands of stores",
    desc: "Get cash back at thousands of online stores. Auto-applies coupon codes at checkout.",
    benefits: ["Stacks with credit-card rewards", "Quarterly check or PayPal payout"],
    code: "FERUZU4",
    href: "http://www.rakuten.com/r/FERUZU4?eeid=28187",
    image: "images/CMiakN3Wg_sCEAE.png.webp",
  },
  {
    group: "Shopping",
    brand: "Capital One Shopping",
    name: "Auto-apply codes at checkout",
    desc: "Browser extension that instantly applies any available coupon code at checkout — no Capital One account required.",
    benefits: ["Free, no card needed", "Price-comparison tool included"],
    code: "SXYJWF8",
    href: "http://capitaloneshopping.com/r/SXYJWF8",
    image: "images/images_1.png",
  },

  /* AMAZON ───────────────────────────────────────────────────────── */
  {
    group: "Amazon",
    brand: "Amazon Prime",
    name: "Free 30-day trial",
    desc: "Fast free shipping, exclusive movies and TV, unlimited photo storage, and Prime Day access.",
    benefits: ["Same-day shipping in many cities", "Includes Prime Video"],
    code: "",
    href: "https://amzn.to/3WzOTkJ",
    image: "images/images-6.png",
  },
  {
    group: "Amazon",
    brand: "Kindle Unlimited",
    name: "Free reading + listening trial",
    desc: "Unlimited reading from over 1 million ebooks and unlimited listening to thousands of audiobooks.",
    benefits: ["Read on any device", "Cancel before the trial ends to avoid charges"],
    code: "",
    href: "https://amzn.to/46gU2kY",
    image: "images/id-11134207-7r98o-lkk972njeonde9.jpeg",
  },
  {
    group: "Amazon",
    brand: "Audible",
    name: "Free trial + first audiobook",
    desc: "The world's largest selection of digital audiobooks and spoken-word content.",
    benefits: ["First audiobook is yours to keep", "Plus a member-only podcast each month"],
    code: "",
    href: "https://amzn.to/4cdt6UV",
    image: "images/newsroom-fallback_2x.png",
  },

  /* FOOD ─────────────────────────────────────────────────────────── */
  {
    group: "Food",
    brand: "Uber Eats",
    name: "First-order discount",
    desc: "Get the food you want, from the restaurants you love, delivered at Uber speed.",
    benefits: ["Promo applied automatically with code", "Stacks with Uber One members' free delivery"],
    code: "eats-2smg655zu7",
    href: "https://ubereats.com/feed?promoCode=eats-2smg655zu7",
    image: "images/images.png",
  },
  {
    group: "Food",
    brand: "DoorDash",
    name: "Discount on first order",
    desc: "Order with a tap of a button and track your fresh meal racing straight to you.",
    benefits: ["DashPass-eligible restaurants included", "Schedule orders for later"],
    code: "",
    href: "https://drd.sh/J92zuoOLeqP9RQ6Y",
    image: "images/images-2.png",
  },

  /* FINANCE ──────────────────────────────────────────────────────── */
  {
    group: "Finance",
    brand: "Copilot",
    name: "Money tracker · free trial",
    desc: "The best money tracker app I've used. Categorizes every transaction and shows clean monthly summaries.",
    benefits: ["Apple Card import (rare)", "Investment + crypto net-worth tracking"],
    code: "",
    href: "https://copilot.money/link/UAEZkLKnouLoQDWZA",
    image: "images/lbjK_2bl_400x400.jpg",
  },

  /* TRAVEL ───────────────────────────────────────────────────────── */
  {
    group: "Travel",
    brand: "Airbnb",
    name: "Travel credit on first stay",
    desc: "Live like a local or stay a night in a castle — Airbnb is my go-to for unique stays anywhere.",
    benefits: ["Credit applied automatically", "Use across multiple bookings"],
    code: "feruzu",
    href: "https://www.airbnb.com/r/feruzu?s=6&t=061n1v",
    image: "images/BpgKDmvE_400x400.jpg",
  },
  {
    group: "Travel",
    brand: "Uber",
    name: "Free rides credit",
    desc: "The easiest way to get around at the tap of a button — credit applied to your first rides.",
    benefits: ["Credit auto-applies on signup", "Works in 70+ countries"],
    code: "j2x7hjf41gun",
    href: "https://referrals.uber.com/refer?id=j2x7hjf41gun",
    image: "images/ubers-new-logo-is-just-the-word-uber_sf59.1200.jpg.webp",
  },
  {
    group: "Travel",
    brand: "Lyft",
    name: "Free rides credit",
    desc: "Lyft is your friend with a car, whenever you need one — credit applied to your first ride.",
    benefits: ["Pink (priority pickup) available in major cities", "Schedule airport rides in advance"],
    code: "FERUZ99716",
    href: "https://www.lyft.com/i/FERUZ99716?utm_medium=p2pi_iacc",
    image: "images/lyft-logo-D9853248A9-seeklogo.com.png",
  },
];

function CouponCard({ c }) {
  const [copied, setCopied] = React.useState(false);
  const copy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(c.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }).catch(() => {});
  };
  return (
    <a className="rw-card glass" href={c.href} target="_blank" rel="noreferrer">
      <div className="rw-mark m-img m-square">
        <img src={c.image} alt={c.brand} loading="lazy" />
      </div>
      <div className="rw-body">
        <div className="brand">{c.brand} · {c.code ? "code" : "referral link"}</div>
        <div className="name">{c.name}</div>
        <div className="desc">{c.desc}</div>
        {c.benefits && c.benefits.length > 0 && (
          <ul className="benefits">
            {c.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
        {c.code && (
          <div style={{marginTop: 10}}>
            <button type="button" onClick={copy} className={"rw-coupon-code " + (copied ? "is-copied" : "")}>
              <span>{c.code}</span>
              <span className="copy-tip">{copied ? "✓ COPIED" : "CLICK TO COPY"}</span>
            </button>
          </div>
        )}
      </div>
      <div className="rw-bonus">
        <div className="label">Category</div>
        <div className="amt" style={{fontSize: 22}}><em>{c.group}</em></div>
        <div className="label">{c.code ? "code in link" : "ready to use"}</div>
      </div>
      <span className="rw-cta">Open →</span>
    </a>
  );
}

function RewardsCouponsApp() {
  const [t, setTweak] = useTweaks(RP_DEFAULTS);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t]);

  // Group coupons by category for sectioned rendering
  const grouped = React.useMemo(() => {
    const map = new Map();
    COUPONS.forEach(c => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <>
      <SplineScene />
      {t.showOrbs && <OrbField count={5} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="rewards" />

      <main className="container">
        <section className="rw-hero" data-screen-label="Coupons Hero">
          <div className="hero-stamp">
            <span><span className="num">005</span> / Rewards / Coupons</span>
            <a href="rewards.html" style={{color:'var(--violet)', borderBottom:0, fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'var(--tr-mono-up)', textTransform:'uppercase'}}>back to all</a>
            <span style={{color:'var(--lumen-2)'}}>{COUPONS.length} codes — click to copy</span>
          </div>
          <h1>Save a few <em>dollars</em>.</h1>
          <p className="lead">
            Codes and referral links for services I actually use. Tap any code to copy it; tap the card to open the signup page with the discount baked into the URL.
          </p>
        </section>

        {grouped.map(([group, items]) => (
          <section key={group} data-screen-label={group + " coupons"} style={{paddingBottom: 12}}>
            <div className="rw-section-head">
              <h2><em>{group}</em></h2>
              <div className="stamp-line">{items.length} {items.length === 1 ? "code" : "codes"}</div>
            </div>
            <div className="rw-list">
              {items.map((c) => <CouponCard key={c.brand} c={c} />)}
            </div>
          </section>
        ))}

        <section style={{paddingBottom: 40}}>
          <div className="rw-fineprint glass">
            <strong>How they work.</strong> Most of these are referral links — both of us get a small benefit when you sign up. A couple are flat-discount codes the company gave me to share. If a code stops working, please email me and I'll fix it.
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

ReactDOM.createRoot(document.getElementById("root")).render(<RewardsCouponsApp />);
