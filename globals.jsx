/* global React */ // v2026-05-05a
const { useState: gUseState, useEffect: gUseEffect, useRef: gUseRef, useMemo: gUseMemo } = React;

/* ─────────────────────────────────────────────────────────────────
   Single source of truth for "years in industry".
   Bumping the constant or letting the calendar tick over is enough —
   no more hand-edited "twelve years" sprinkled across pages.
   ───────────────────────────────────────────────────────────────── */
const CAREER_START_YEAR = 2014;
const YEAR_WORDS = ["zero","one","two","three","four","five","six","seven","eight","nine",
  "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen",
  "nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five"];
function yearsInIndustry() {
  return Math.max(0, new Date().getFullYear() - CAREER_START_YEAR);
}
function yearsInIndustryWord(opts = {}) {
  const n = yearsInIndustry();
  const w = YEAR_WORDS[n] || String(n);
  return opts.capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w;
}

/* ─────────────────────────────────────────────────────────────────
   OrbField — drifting blurred color blobs behind everything.
   Positions use a golden-angle distribution so they spread evenly
   instead of clumping. The whole field follows the cursor with a
   parallax lean — each orb has its own depth so the field has motion.
   ───────────────────────────────────────────────────────────────── */
function OrbField({ count = 6 }) {
  const fieldRef = gUseRef(null);

  const orbs = gUseMemo(() => {
    const palette = [
      "radial-gradient(circle, rgba(139,92,255,0.70), transparent 70%)",
      "radial-gradient(circle, rgba(255,180,84,0.60), transparent 70%)",
      "radial-gradient(circle, rgba(110,231,255,0.45), transparent 70%)",
      "radial-gradient(circle, rgba(166,132,255,0.60), transparent 70%)",
      "radial-gradient(circle, rgba(255,210,138,0.55), transparent 70%)",
      "radial-gradient(circle, rgba(139,92,255,0.55), transparent 70%)",
    ];
    // Golden-angle spread for even distribution across the viewport.
    const PHI = 0.61803398875;
    return Array.from({ length: count }).map((_, i) => {
      // deterministic-ish jitter per orb, but stable across renders
      const t  = (i + 1) * PHI;
      const tx = (i * 0.27 + 0.13) % 1;
      const ty = (i * 0.41 + 0.29) % 1;
      return {
        id: i,
        size: 360 + (((i * 137) % 380)),
        // map [0,1) → [6, 94] so orbs stay clearly inside viewport
        top:  6 + ((t * 1.7) % 1) * 88,
        left: 6 + ((tx + ty) % 1)   * 88,
        bg: palette[i % palette.length],
        anim: `orb-drift-${(i % 4) + 1}`,
        dur: 18 + ((i * 7) % 22),
        delay: -((i * 3) % 20),
        // parallax depth: 0 = pinned, 1 = max travel toward cursor
        depth: 0.25 + ((i * 0.137) % 0.75),
      };
    });
  }, [count]);

  // Track mouse → translate each orb proportionally to its depth.
  // rAF-throttled so it stays cheap on slow GPUs.
  gUseEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = { x: 0, y: 0 };   // -1..1 from viewport center
    let current = { x: 0, y: 0 };  // eased
    let raf = 0;

    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.x = (e.clientX / w) * 2 - 1;
      target.y = (e.clientY / h) * 2 - 1;
    };
    const onLeave = () => { target.x = 0; target.y = 0; };

    const tick = () => {
      // ease toward target
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      const orbsEls = field.querySelectorAll(".orb-wrap");
      orbsEls.forEach((el, i) => {
        const d = orbs[i] ? orbs[i].depth : 0.5;
        // Max travel ~60px on a fully-deflected cursor.
        const tx = -current.x * 60 * d;
        const ty = -current.y * 60 * d;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [orbs]);

  return (
    <div className="orb-field" aria-hidden="true" ref={fieldRef}>
      {orbs.map(o => (
        <div
          key={o.id}
          className="orb-wrap"
          style={{
            position: "absolute",
            top:  `${o.top}%`,
            left: `${o.left}%`,
            width: o.size, height: o.size,
            transition: "transform 0.6s cubic-bezier(.2,.8,.2,1)",
            willChange: "transform",
          }}
        >
          <div
            className="orb"
            style={{
              position: "absolute",
              inset: 0,
              top: 0, left: 0,
              background: o.bg,
              animation: `${o.anim} ${o.dur}s ease-in-out ${o.delay}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   StatusBar — clock, location, weather (live via Open-Meteo after locate)
   ───────────────────────────────────────────────────────────────── */
function StatusBar() {
  const [t, setT] = gUseState(() => new Date());
  const [loc, setLoc] = gUseState(null); // { city, timeZone, weather }

  gUseEffect(() => {
    const i = setInterval(() => setT(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);

  gUseEffect(() => {
    const onLocated = async (e) => {
      const { lat, lon, city, timeZone } = e.detail;
      setLoc({ city, timeZone, weather: null });
      // Fetch weather from Open-Meteo (free, no key)
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
        const r = await fetch(url);
        const d = await r.json();
        const cw = d.current_weather;
        if (cw) {
          const wc = cw.weathercode;
          // WMO weather codes → simple labels
          const label = wc === 0 ? "clear" : wc <= 3 ? "partly cloudy" : wc <= 9 ? "foggy"
            : wc <= 19 ? "drizzle" : wc <= 29 ? "rain" : wc <= 39 ? "snow"
            : wc <= 49 ? "foggy" : wc <= 59 ? "drizzle" : wc <= 69 ? "rain"
            : wc <= 79 ? "snow" : wc <= 84 ? "showers" : wc <= 94 ? "thunderstorm" : "stormy";
          const icon = wc === 0 ? "☀" : wc <= 3 ? "⛅" : wc <= 9 ? "🌫" : wc <= 69 ? "🌧" : wc <= 79 ? "❄" : wc <= 84 ? "🌦" : "⛈";
          setLoc(l => ({ ...l, weather: `${icon} ${Math.round(cw.temperature)}°F · ${label}` }));
        }
      } catch(e) {}
    };
    window.addEventListener("user-located", onLocated);
    return () => window.removeEventListener("user-located", onLocated);
  }, []);

  const timeZone = loc?.timeZone || "America/Chicago";
  const city = loc?.city || "Chicago, IL";
  const time = t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
  const date = t.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" });

  // Default weather if no location yet
  const day = t.getDate();
  const defaultWeathers = ["◐ 47°F · low clouds","☀ 53°F · clear","❄ 38°F · flurries","☁ 44°F · overcast","☂ 41°F · drizzle"];
  const weather = loc?.weather || defaultWeathers[day % defaultWeathers.length];

  return (
    <div className="statusbar">
      <span className="seg">
        <span className="dot" />
        <span className="label-name">Status</span>
        <span className="val">online</span>
      </span>
      <span className="seg hide-sm">
        <span className="label-name">Local</span>
        <span className="val violet">{time} {loc ? "" : "CT"}</span>
        <span className="val" style={{color: "var(--lumen-3)"}}>· {date}</span>
      </span>
      <span className="seg hide-sm">
        <span className="label-name">Weather</span>
        <span className="val amber">{weather}</span>
      </span>
      {loc?.city && (
        <span className="seg hide-sm">
          <span className="label-name">📍</span>
          <span className="val" style={{color:"var(--violet)"}}>{loc.city}</span>
        </span>
      )}
      <span className="seg pushright hide-sm">
        <span className="label-name">v</span>
        <span className="val">3.0</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   InfiniteCounter — counts up to target on mount, then sits there.
   ───────────────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "", duration = 1400, decimals = 0 }) {
  const [v, setV] = gUseState(0);
  const ref = gUseRef(null);
  gUseEffect(() => {
    let started = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(eased * to);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  const display = decimals ? v.toFixed(decimals) : Math.round(v).toString();
  return <span ref={ref} className="counter">{display}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────────
   ListenCarousel — Last.fm-flavored row of recent tracks.
   Pulls live from Last.fm if an API key is set; falls back to the
   curated seed below when the key is missing or the request fails.
   Get a free key at https://www.last.fm/api/account/create
   ───────────────────────────────────────────────────────────────── */
const LASTFM_API_KEY = "f0bfcc59305e8b9c3fe9793bf524fb86";  // public read-only key, fine to ship
const LASTFM_USER    = "urazaliev_f";   // change if username ever shifts
const LASTFM_LIMIT   = 8;
const LASTFM_REFRESH_MS = 60_000;       // re-poll once a minute

const LISTENS_SEED = [
  { id: 1, title: "Wild God",                    artist: "Nick Cave & The Bad Seeds", initial: "W", progress: 62, now: true,  when: "playing now" },
  { id: 2, title: "Dance, No One's Watching",   artist: "Ezra Collective",            initial: "D", progress: 100, when: "23m ago" },
  { id: 3, title: "Tabula Rasa",                 artist: "Arvo Pärt",                  initial: "T", progress: 100, when: "1h ago" },
  { id: 4, title: "A LA SALA",                    artist: "Khruangbin",                 initial: "A", progress: 100, when: "Sun" },
  { id: 5, title: "Blackstar",                   artist: "David Bowie",                initial: "B", progress: 100, when: "Sun" },
  { id: 6, title: "Lift Your Skinny Fists…",     artist: "Godspeed You! Black Emperor",initial: "L", progress: 100, when: "Sat" },
  { id: 7, title: "Blue Train",                  artist: "John Coltrane",              initial: "B", progress: 100, when: "Fri" },
  { id: 8, title: "OK Computer",                 artist: "Radiohead",                  initial: "O", progress: 100, when: "Fri" },
];

function relativeTime(unixSeconds) {
  if (!unixSeconds) return "";
  const diff = Math.floor(Date.now() / 1000) - Number(unixSeconds);
  if (diff < 60)        return "just now";
  if (diff < 60 * 60)   return Math.floor(diff / 60) + "m ago";
  if (diff < 60 * 60 * 24) return Math.floor(diff / 3600) + "h ago";
  const days = Math.floor(diff / 86400);
  if (days === 1) return "yesterday";
  if (days < 7)   return days + "d ago";
  return new Date(Number(unixSeconds) * 1000).toLocaleDateString(undefined, { weekday: "short" });
}

function ListeningCarousel() {
  const VIEWS = [
    { id: "recent",  label: "Recent",       method: "user.getrecenttracks", limit: 10 },
    { id: "artists", label: "Top artists",  method: "user.gettopartists",   limit: 10 },
    { id: "albums",  label: "Top albums",   method: "user.gettopalbums",    limit: 10 },
    { id: "tracks",  label: "Top tracks",   method: "user.gettoptracks",    limit: 10 },
  ];
  const PERIODS = [
    { id: "7day",    label: "7 days" },
    { id: "1month",  label: "1 month" },
    { id: "3month",  label: "3 months" },
    { id: "12month", label: "1 year" },
    { id: "overall", label: "All time" },
  ];

  const [view, setView]     = gUseState("recent");
  const [period, setPeriod] = gUseState("1month");
  const [items, setItems]   = gUseState([]);
  const [isLive, setIsLive] = gUseState(false);
  const [loading, setLoading] = gUseState(true);

  // Single fetch effect — re-runs whenever view / period changes.
  gUseEffect(() => {
    if (!LASTFM_API_KEY) { setLoading(false); return; }
    const v = VIEWS.find(x => x.id === view);
    if (!v) return;
    let cancelled = false;
    setLoading(true);

    async function pull() {
      try {
        const params = [
          `method=${v.method}`,
          `user=${encodeURIComponent(LASTFM_USER)}`,
          `api_key=${LASTFM_API_KEY}`,
          `limit=${v.limit}`,
          `format=json`,
        ];
        if (view !== "recent") params.push(`period=${period}`);
        const url = `https://ws.audioscrobbler.com/2.0/?${params.join("&")}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error("lastfm " + r.status);
        const data = await r.json();

        let raw = [];
        if (view === "recent")  raw = (data?.recenttracks?.track) || [];
        if (view === "artists") raw = (data?.topartists?.artist)  || [];
        if (view === "albums")  raw = (data?.topalbums?.album)    || [];
        if (view === "tracks")  raw = (data?.toptracks?.track)    || [];
        if (cancelled) return;

        const pickImg = (arr) => {
          if (!Array.isArray(arr)) return "";
          const want = ["extralarge","large","medium","small"];
          for (const sz of want) {
            const m = arr.find(im => im.size === sz);
            if (m && m["#text"]) return m["#text"];
          }
          return "";
        };

        const mapped = raw.map((t, i) => {
          if (view === "recent") {
            const nowPlaying = t["@attr"]?.nowplaying === "true";
            const ts = t.date?.uts;
            return {
              id: (t.url || (t.name + i)) + "-" + i,
              title: t.name || "—",
              subtitle: t.artist?.["#text"] || t.artist?.name || "",
              cover: pickImg(t.image),
              now: !!nowPlaying,
              trailing: nowPlaying ? "playing now" : relativeTime(ts),
              url: t.url || `https://www.last.fm/user/${LASTFM_USER}`,
              rank: null,
            };
          }
          if (view === "artists") {
            return {
              id: (t.url || t.name) + "-" + i,
              title: t.name || "—",
              subtitle: "",
              cover: pickImg(t.image), // last.fm artist images are mostly placeholders, may be empty
              now: false,
              trailing: `${Number(t.playcount || 0).toLocaleString()} plays`,
              url: t.url || `https://www.last.fm/user/${LASTFM_USER}`,
              rank: i + 1,
            };
          }
          if (view === "albums") {
            return {
              id: (t.url || (t.name + i)) + "-" + i,
              title: t.name || "—",
              subtitle: t.artist?.name || t.artist?.["#text"] || "",
              cover: pickImg(t.image),
              now: false,
              trailing: `${Number(t.playcount || 0).toLocaleString()} plays`,
              url: t.url || `https://www.last.fm/user/${LASTFM_USER}`,
              rank: i + 1,
            };
          }
          // tracks
          return {
            id: (t.url || (t.name + i)) + "-" + i,
            title: t.name || "—",
            subtitle: t.artist?.name || t.artist?.["#text"] || "",
            cover: pickImg(t.image),
            now: false,
            trailing: `${Number(t.playcount || 0).toLocaleString()} plays`,
            url: t.url || `https://www.last.fm/user/${LASTFM_USER}`,
            rank: i + 1,
          };
        });

        // Last.fm artist images are unreliable — fill from iTunes for any rows
        // that came back empty.
        const needArt = mapped.filter(m => !m.cover);
        if (needArt.length) {
          const enrich = await Promise.all(needArt.map(async (m) => {
            try {
              const q = encodeURIComponent(view === "artists"
                ? m.title
                : `${m.subtitle} ${m.title}`);
              const ent = view === "artists" ? "musicArtist"
                       : view === "albums"  ? "album"
                       : "song";
              const r2 = await fetch(`https://itunes.apple.com/search?term=${q}&entity=${ent}&limit=1`);
              if (!r2.ok) return [m.id, ""];
              const d2 = await r2.json();
              const art = d2?.results?.[0]?.artworkUrl100;
              return [m.id, art ? art.replace("100x100bb", "300x300bb") : ""];
            } catch { return [m.id, ""]; }
          }));
          const lookup = Object.fromEntries(enrich);
          mapped.forEach(m => { if (lookup[m.id]) m.cover = lookup[m.id]; });
        }

        if (!cancelled) {
          setItems(mapped);
          setIsLive(true);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) { setIsLive(false); setLoading(false); }
      }
    }

    pull();
    const id = view === "recent" ? setInterval(pull, LASTFM_REFRESH_MS) : null;
    return () => { cancelled = true; if (id) clearInterval(id); };
  }, [view, period]);

  const isTop = view !== "recent";
  const subtitle = view === "recent"
    ? (isLive ? "live · scrobbled" : "scrobbled")
    : `top ${view} · ${PERIODS.find(p => p.id === period)?.label.toLowerCase()}`;

  return (
    <div className="listen-carousel glass">
      <div className="hero-stamp" style={{marginBottom: 16}}>
        <span><span className="num">●</span> Last.fm · {LASTFM_USER}</span>
        <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— {subtitle}</span>
      </div>

      <div className="listen-tabs" role="tablist">
        {VIEWS.map(v => (
          <button key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={view === v.id}
                  className={"listen-tab" + (view === v.id ? " is-on" : "")}
                  onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>

      {isTop && (
        <div className="listen-periods">
          {PERIODS.map(p => (
            <button key={p.id}
                    type="button"
                    className={"listen-period" + (period === p.id ? " is-on" : "")}
                    onClick={() => setPeriod(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="listen-list">
        {loading && items.length === 0 && (
          <div className="listen-empty">loading scrobbles…</div>
        )}
        {!loading && items.length === 0 && (
          <div className="listen-empty">no data — try a different range.</div>
        )}
        {items.map(l => (
          <a key={l.id}
             className={"listen-row" + (l.now ? " is-now" : "")}
             href={l.url}
             target="_blank" rel="noreferrer">
            {l.rank != null
              ? <span className="lr-rank">{String(l.rank).padStart(2,"0")}</span>
              : <span className="lr-rank lr-rank--dot">{l.now ? <span className="dot" /> : "·"}</span>}
            <span className="lr-cover" aria-hidden="true">
              {l.cover
                ? <img src={l.cover} alt="" loading="lazy"
                       onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                : <span className="lr-fallback">{(l.title || "?").trim().slice(0,1).toUpperCase()}</span>}
            </span>
            <span className="lr-text">
              <span className="lr-title">{l.title}</span>
              {l.subtitle && <span className="lr-sub">{l.subtitle}</span>}
            </span>
            <span className={"lr-trailing" + (l.now ? " is-now" : "")}>{l.trailing}</span>
          </a>
        ))}
      </div>

      <a className="listen-foot" href={`https://www.last.fm/user/${LASTFM_USER}`} target="_blank" rel="noreferrer">
        Full profile on Last.fm →
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ChessBoard — a real, playable, simplified board.
   Click a piece, then a target square. No castling/en passant/promotion.
   Just legal-ish moves so a visitor can push pawns around.
   ───────────────────────────────────────────────────────────────── */
const PIECES = {
  K:"♔", Q:"♕", R:"♖", B:"♗", N:"♘", P:"♙",
  k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟",
};
const INITIAL = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"],
];
function isWhite(p) { return p && p === p.toUpperCase() && p !== ""; }
function isBlack(p) { return p && p === p.toLowerCase() && p !== ""; }

function pieceMoves(board, r, c) {
  const p = board[r][c]; if (!p) return [];
  const moves = [];
  const me = isWhite(p) ? "w" : "b";
  const enemy = me === "w" ? "b" : "w";
  const isMine = (q) => (me === "w" ? isWhite(q) : isBlack(q));
  const isEnemy = (q) => q && (me === "w" ? isBlack(q) : isWhite(q));
  const inB = (rr, cc) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8;

  const slide = (dr, dc) => {
    let rr = r + dr, cc = c + dc;
    while (inB(rr, cc)) {
      if (!board[rr][cc]) moves.push([rr, cc]);
      else { if (isEnemy(board[rr][cc])) moves.push([rr, cc]); break; }
      rr += dr; cc += dc;
    }
  };
  const step = (dr, dc) => {
    const rr = r + dr, cc = c + dc;
    if (inB(rr, cc) && !isMine(board[rr][cc])) moves.push([rr, cc]);
  };

  const t = p.toLowerCase();
  if (t === "p") {
    const dir = me === "w" ? -1 : 1;
    const startRow = me === "w" ? 6 : 1;
    if (inB(r+dir, c) && !board[r+dir][c]) {
      moves.push([r+dir, c]);
      if (r === startRow && !board[r+2*dir][c]) moves.push([r+2*dir, c]);
    }
    for (const dc of [-1, 1]) {
      const rr = r+dir, cc = c+dc;
      if (inB(rr, cc) && isEnemy(board[rr][cc])) moves.push([rr, cc]);
    }
  } else if (t === "n") {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) step(dr, dc);
  } else if (t === "b") {
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
  } else if (t === "r") {
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
  } else if (t === "q") {
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
  } else if (t === "k") {
    for (const dr of [-1,0,1]) for (const dc of [-1,0,1]) if (dr || dc) step(dr, dc);
  }
  return moves;
}
function squareName(r, c) {
  return "abcdefgh"[c] + (8 - r);
}

function ChessBoard() {
  const [board, setBoard] = gUseState(INITIAL.map(row => row.slice()));
  const [sel, setSel]   = gUseState(null);   // [r,c]
  const [legal, setLegal] = gUseState([]);
  const [turn, setTurn] = gUseState("w");
  const [moves, setMoves] = gUseState([]);   // log of "e2-e4"

  const click = (r, c) => {
    const p = board[r][c];
    if (sel) {
      if (sel[0] === r && sel[1] === c) {
        setSel(null); setLegal([]); return;
      }
      const isLegal = legal.some(([rr, cc]) => rr === r && cc === c);
      if (isLegal) {
        const next = board.map(row => row.slice());
        const piece = next[sel[0]][sel[1]];
        const captured = next[r][c];
        next[r][c] = piece;
        next[sel[0]][sel[1]] = "";
        const note = `${piece.toUpperCase() === piece && piece.toLowerCase() !== piece ? "" : ""}${squareName(sel[0], sel[1])}${captured ? "x" : "-"}${squareName(r, c)}`;
        setBoard(next);
        setMoves(m => [...m, { ply: m.length + 1, t: turn, n: note }]);
        setSel(null);
        setLegal([]);
        setTurn(turn === "w" ? "b" : "w");
        return;
      }
    }
    if (p && ((turn === "w" && isWhite(p)) || (turn === "b" && isBlack(p)))) {
      setSel([r, c]);
      setLegal(pieceMoves(board, r, c));
    } else {
      setSel(null); setLegal([]);
    }
  };

  const reset = () => {
    setBoard(INITIAL.map(row => row.slice()));
    setSel(null); setLegal([]); setTurn("w"); setMoves([]);
  };

  return (
    <div className="chess-wrap glass">
      <div>
        <div className="hero-stamp" style={{marginBottom: 12}}>
          <span><span className="num">●</span> Chess.com · open game</span>
          <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— click a piece, then a square</span>
        </div>
        <div className="chess-board">
          {board.map((row, r) =>
            row.map((p, c) => {
              const isSel = sel && sel[0] === r && sel[1] === c;
              const tgt   = legal.some(([rr, cc]) => rr === r && cc === c);
              const cap   = tgt && p;
              const lightSquare = (r + c) % 2 === 0;
              return (
                <div
                  key={r + "-" + c}
                  className={[
                    "chess-cell",
                    lightSquare ? "light" : "dark",
                    isSel ? "is-selected" : "",
                    tgt && !cap ? "is-target" : "",
                    cap ? "is-capture" : "",
                  ].join(" ")}
                  onClick={() => click(r, c)}
                >
                  {p && (
                    <span className={"piece " + (isWhite(p) ? "white" : "black")}>
                      {PIECES[p]}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="chess-side">
        <div>
          <div className="ply">Ply {moves.length}</div>
          <div className="turn">
            {turn === "w" ? <>White to <em>move</em></> : <>Black to <em>move</em></>}
          </div>
        </div>
        <div className="moves">
          {moves.length === 0
            ? <span style={{color:"var(--fg-faint)"}}>your move…</span>
            : moves.map(m => (
                <div key={m.ply}>{m.ply}. {m.t === "w" ? "" : "… "}{m.n}</div>
              ))}
        </div>
        <button className="chess-reset" onClick={reset}>↻ Reset</button>
        <a className="link-amber" href="https://www.chess.com/" target="_blank" rel="noreferrer" style={{borderBottom:0, fontFamily:"var(--font-mono)", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--violet)"}}>
          Real game on Chess.com →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Guestbook — local-storage-backed
   ───────────────────────────────────────────────────────────────── */
const GB_KEY = "fu-guestbook-v1";
const GB_SEED = [
  { name: "Olivia", msg: "Came for the chess, stayed for the wine notes. The Saturday flight idea is good.", at: Date.now() - 86400000 * 2 },
  { name: "Marco",  msg: "Antifragile re-read squad ✦ keep going.",                              at: Date.now() - 86400000 * 5 },
  { name: "Ana",    msg: "The orbs are perfect. Don't change them.",                            at: Date.now() - 86400000 * 9 },
];

function Guestbook() {
  const [entries, setEntries] = gUseState(() => {
    try {
      const raw = localStorage.getItem(GB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return GB_SEED;
  });
  const [name, setName] = gUseState("");
  const [msg, setMsg]   = gUseState("");

  gUseEffect(() => {
    try { localStorage.setItem(GB_KEY, JSON.stringify(entries)); } catch (e) {}
  }, [entries]);

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim(), m = msg.trim();
    if (!n || !m) return;
    setEntries([{ name: n, msg: m, at: Date.now(), mine: true }, ...entries]);
    setName(""); setMsg("");
  };

  const fmt = (at) => {
    const diff = Date.now() - at;
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 7)  return d + "d ago";
    return new Date(at).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  };

  return (
    <div className="gb-wrap glass">
      <div className="hero-stamp">
        <span><span className="num">●</span> Guestbook</span>
        <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— sign the wall</span>
      </div>
      <form className="gb-form" onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={40} />
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Leave a note…" maxLength={240} />
        <button type="submit">Sign</button>
      </form>
      <div className="gb-list">
        {entries.slice(0, 8).map((e, i) => (
          <div key={i} className="gb-entry">
            <span className={"who " + (e.mine ? "is-amber" : "")}>{e.name}{e.mine ? " (you)" : ""}</span>
            <span className="msg">{e.msg}</span>
            <span className="when">{fmt(e.at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WineCard — fetches from wine.json (update that file when you open a bottle)
   ───────────────────────────────────────────────────────────────── */
function WineCard() {
  const [wine, setWine] = gUseState(null);
  const [err, setErr] = gUseState(false);

  gUseEffect(() => {
    fetch("wine.json")
      .then(r => r.json())
      .then(d => setWine(d))
      .catch(() => setErr(true));
  }, []);

  const w = wine || {
    name: "Loading…", winery: "", vintage: "", region: "", country: "",
    varietal: "", rating: 0, notes: "", tags: [], when: "", image: "",
  };

  const stars = w.rating > 0 ? "★".repeat(Math.floor(w.rating)) + (w.rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(w.rating)) : "";
  const regionLine = [w.winery, w.region, w.country].filter(Boolean).join(" · ");
  const vintageLine = [w.varietal, w.vintage].filter(Boolean).join(" · ");

  return (
    <div className="wine-card glass">
      <div className="wine-bottle" style={w.image ? {
        backgroundImage: `url(${w.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 8,
        width: 80, height: 140,
      } : undefined} />
      <div>
        <div className="w-meta">Vivino · {w.when || "most recent pour"}</div>
        <div className="w-name"><em>{w.name}</em></div>
        {regionLine && <div className="w-meta" style={{marginTop:4, color:"var(--lumen-2)"}}>{regionLine}</div>}
        {vintageLine && <div className="w-meta" style={{marginTop:2, color:"var(--fg-muted)"}}>{vintageLine}</div>}
        <div className="w-notes" style={{marginTop:8}}>{w.notes}</div>
        {w.tags && w.tags.length > 0 && (
          <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
            {w.tags.map((t,i) => (
              <span key={i} className={"tag" + (i===1 ? " tag--amber" : "")}>{t}</span>
            ))}
          </div>
        )}
      </div>
      {w.rating > 0 && (
        <div className="w-rating">
          <div className="w-stars">{"★".repeat(Math.floor(w.rating))}{"☆".repeat(5 - Math.floor(w.rating))}</div>
          <div className="w-score">{Math.floor(w.rating)}.<em>{Math.round((w.rating % 1) * 10)}</em></div>
          <div className="w-meta" style={{marginTop:6}}>my rating</div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ReadingNow — small live card on home, cover pulled from Open Library
   ───────────────────────────────────────────────────────────────── */
const READING = {
  title: "Antifragile",
  subtitle: "third pass",
  author: "Nassim Nicholas Taleb",
  pages: 519,
  pct: 63,
  isbn: "9780812979688", // Open Library lookup key
  letter: "A",            // fallback when no cover
};

function ReadingNow() {
  const [coverUrl, setCoverUrl] = gUseState(null);
  const [coverFailed, setCoverFailed] = gUseState(false);

  gUseEffect(() => {
    if (!READING.isbn) return;
    // Open Library covers: ?default=false → 404s when no cover, so we can detect it
    const url = `https://covers.openlibrary.org/b/isbn/${READING.isbn}-L.jpg?default=false`;
    const img = new Image();
    img.onload = () => {
      // Open Library returns a 1x1 placeholder if size mismatch — guard against it
      if (img.naturalWidth > 1) setCoverUrl(url);
      else setCoverFailed(true);
    };
    img.onerror = () => setCoverFailed(true);
    img.src = url;
  }, []);

  return (
    <div className="read-now glass">
      <div className="book-cover" style={coverUrl ? {
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "transparent",
      } : undefined}>
        {coverUrl ? "" : READING.letter}
      </div>
      <div>
        <div className="r-title"><em>{READING.title}</em> · <span style={{color:"var(--lumen-2)"}}>{READING.subtitle}</span></div>
        <div className="r-author">{READING.author} · {READING.pages} pp</div>
        <div className="r-progress"><span style={{width: READING.pct + "%"}} /></div>
      </div>
      <div className="r-pct">{READING.pct}%</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LiveCounters — fetches real data from public APIs.
   Medium followers via RSS+Feedly, Goodreads via RSS,
   Chess.com via public API, Last.fm scrobbles via API.
   Falls back to seeded values while loading.
   ───────────────────────────────────────────────────────────────── */
function LiveCounters() {
  const SEED = { medium: 2400, chess: 1450, goodreads: 143, lastfm: 0 };
  const [vals, setVals] = gUseState(SEED);

  gUseEffect(() => {
    // Chess.com public API — no auth needed
    fetch("https://api.chess.com/pub/player/urazalievf/stats")
      .then(r => r.json())
      .then(d => {
        const rating = d?.chess_rapid?.last?.rating || d?.chess_blitz?.last?.rating;
        if (rating) setVals(v => ({ ...v, chess: rating }));
      }).catch(() => {});

    // Last.fm total scrobbles
    if (LASTFM_API_KEY) {
      fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json`)
        .then(r => r.json())
        .then(d => {
          const count = parseInt(d?.user?.playcount, 10);
          if (count) setVals(v => ({ ...v, lastfm: count }));
        }).catch(() => {});
    }
  }, []);

  const counters = [
    { key: "medium",    n: vals.medium,    suf: "", lbl: "followers on Medium" },
    { key: "chess",     n: vals.chess,     suf: "", lbl: "rapid rating · chess.com" },
    { key: "goodreads", n: vals.goodreads, suf: "", lbl: "books read · Goodreads" },
    { key: "lastfm",    n: vals.lastfm,    suf: "", lbl: "tracks scrobbled · Last.fm" },
  ];

  return (
    <div className="counter-strip glass" style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--s-4)",
      padding: "var(--s-4)",
      borderRadius: "var(--r-3)",
      marginTop: "var(--s-5)",
    }}>
      {counters.map((c) => {
        return (
          <div key={c.key} style={{display: "flex", flexDirection: "column", gap: 4, alignItems: "center", textAlign: "center"}}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 144',
              fontSize: "clamp(28px, 4vw, 56px)",
              lineHeight: 1,
              color: "var(--lumen)",
              letterSpacing: "-0.03em",
            }}>
              <CountUp to={c.n} decimals={0} />
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-mono-xs)",
              letterSpacing: "var(--tr-mono-up)",
              textTransform: "uppercase",
              color: "var(--fg-muted)",
            }}>{c.lbl}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WireGlobe — Dot-style globe using globe.gl points layer.
   Land areas shown as glowing dots, ocean transparent.
   Day/night terminator via dot color/opacity.
   ───────────────────────────────────────────────────────────────── */
function WireGlobe({ size = 420 }) {
  const mountRef = gUseRef(null);
  const globeRef = gUseRef(null);
  const [hud, setHud] = gUseState({ lat: null, lon: null, utc: "", city: "", localTime: "" });
  const [locState, setLocState] = gUseState("idle");

  gUseEffect(() => {
    const el = mountRef.current;
    if (!el || !window.Globe) return;

    const now = new Date();
    const utcH = now.getUTCHours() + now.getUTCMinutes()/60;
    const initLng = (utcH / 24 - 0.5) * 360;

    function sunDir() {
      const n = new Date();
      const h = n.getUTCHours() + n.getUTCMinutes()/60 + n.getUTCSeconds()/3600;
      const lng = (h / 24 - 0.5) * 360;
      const doy = Math.floor((Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())
                 - Date.UTC(n.getUTCFullYear(),0,0)) / 86400000);
      const lat = 23.44 * Math.sin(2*Math.PI*(doy-81)/365);
      return { lat, lng };
    }

    function dotColor() {
      return 'rgba(220,200,255,1.0)'; // pure bright white-violet, fully opaque
    }

    const globe = Globe({ animateIn: false })(el);

    // Dark globe surface so back of globe is opaque, not transparent
    globe.globeMaterial({
      color: '#0a0f1a',
      transparent: false,
    });
    globe
      .width(size).height(size)
      .backgroundColor('rgba(0,0,0,0)')
      .showGlobe(true)
      .globeImageUrl('')
      .showAtmosphere(true)
      .atmosphereColor('rgba(100,140,255,0.7)')
      .atmosphereAltitude(0.15)
      .pointOfView({ lat: 10, lng: -80, altitude: 1.55 }, 0); // start on Americas

    // Set dark globe surface color after init
    setTimeout(() => {
      if (globe.scene) {
        globe.scene().traverse(obj => {
          if (obj.isMesh && obj.material && !obj.material.map) {
            obj.material.color = { r: 0.04, g: 0.06, b: 0.10 };
          }
        });
      }
    }, 500);

    // Load land dots and render
    fetch('land_dots.json').then(r => r.json()).then(dots => {
      globe
        .pointsData(dots)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(dotColor)
        .pointAltitude(0.005)   // slightly elevated so dots sit ON the surface
        .pointRadius(0.35)
        .pointsMerge(false);

      // Dots are always full brightness — no day/night
      setInterval(() => { /* no-op */ }, 60000);
    });

    if (globe.controls && globe.controls()) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.controls().enableZoom = false;
    }

    const n0 = new Date();
    setHud(h => ({ ...h, utc: n0.getUTCHours().toString().padStart(2,"0")+":"+n0.getUTCMinutes().toString().padStart(2,"0") }));
    const hudInt = setInterval(() => {
      const n = new Date();
      setHud(h => ({ ...h, utc: n.getUTCHours().toString().padStart(2,"0")+":"+n.getUTCMinutes().toString().padStart(2,"0") }));
    }, 30000);

    globeRef.current = globe;
    return () => { clearInterval(hudInt); };
  }, []);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLocState("located");
        const g = globeRef.current;
        if (g) {
          if (g.controls && g.controls()) g.controls().autoRotate = false;
          g.pointOfView({ lat, lng: lon, altitude: 1.8 }, 1000);
          // Add pin as a ring/label
          g.ringsData([{ lat, lng: lon }])
           .ringLat('lat').ringLng('lng')
           .ringColor(() => 'rgba(255,180,50,0.9)')
           .ringMaxRadius(3).ringPropagationSpeed(2).ringRepeatPeriod(800);
        }
        setHud(h => ({ ...h, lat, lon }));
        fetch("https://nominatim.openstreetmap.org/reverse?lat="+lat+"&lon="+lon+"&format=json")
          .then(r => r.json()).then(data => {
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.county || "";
            const stateCode = addr["ISO3166-2-lvl4"] ? addr["ISO3166-2-lvl4"].split("-")[1] : "";
            const region = addr.country_code === "us" ? stateCode : (addr.country || "");
            const label = [city, region].filter(Boolean).join(", ");
            if (label) setHud(h => ({ ...h, city: label }));
            fetch("https://timeapi.io/api/timezone/coordinate?latitude="+lat+"&longitude="+lon)
              .then(r2 => r2.json()).then(tz => {
                if (tz && tz.timeZone) {
                  const localTime = new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:false, timeZone:tz.timeZone });
                  setHud(h => ({ ...h, localTime }));
                  window.dispatchEvent(new CustomEvent("user-located", { detail: { lat, lon, city: label, timeZone: tz.timeZone } }));
                }
              }).catch(() => {});
          }).catch(() => {});
      },
      () => setLocState("denied")
    );
  };

  const locLabel = { idle: "locate me", locating: "…", located: "located ✓", denied: "denied" }[locState];
  const locColor = locState === "located" ? "rgba(255,180,84,1)" : locState === "denied" ? "rgba(255,80,80,0.9)" : "rgba(139,92,255,0.9)";

  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <div ref={mountRef} style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", position:"relative", zIndex:1, cursor:"grab", background:"#0a0f1a" }} />
      <div style={{ position:"absolute", bottom:14, right:14, zIndex:2, fontFamily:'"JetBrains Mono","SF Mono",monospace', fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)", lineHeight:2.0, textAlign:"right", pointerEvents:"none", userSelect:"none", textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>
        {hud.city && <span style={{display:"block",color:"rgba(255,200,100,1)",fontSize:12,textTransform:"none",letterSpacing:"0.04em",marginBottom:2,fontWeight:600}}>{hud.city}</span>}
        {hud.lat != null && <><span style={{display:"block"}}>Lat <span style={{color:"rgba(255,200,100,1)"}}>{hud.lat.toFixed(2)}°</span></span><span style={{display:"block"}}>Lon <span style={{color:"rgba(255,200,100,1)"}}>{hud.lon.toFixed(2)}°</span></span></>}
        {hud.localTime ? <span style={{display:"block"}}>Local <span style={{color:"rgba(255,200,100,1)"}}>{hud.localTime}</span></span> : <span style={{display:"block"}}>UTC <span style={{color:"rgba(255,200,100,1)"}}>{hud.utc}</span></span>}
      </div>
      <button onClick={locate} disabled={locState==="locating"||locState==="located"} style={{ position:"absolute", bottom:14, left:14, zIndex:2, fontFamily:'"JetBrains Mono",monospace', fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:locColor, background:"rgba(5,8,14,0.75)", border:"1px solid "+locColor, borderRadius:99, padding:"6px 12px", cursor:locState==="located"?"default":"pointer", backdropFilter:"blur(8px)", transition:"all 0.2s ease" }}>
        {locState==="idle"?"📍 ":""}{locLabel}
      </button>
      <div style={{ position:"absolute", inset:-6, borderRadius:"50%", zIndex:2, background:"radial-gradient(circle, transparent 49%, rgba(60,100,255,0.2) 68%, rgba(20,60,200,0.08) 82%, transparent 100%)", pointerEvents:"none" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   GoodreadsQuote — rotates through hardcoded liked quotes.
   ───────────────────────────────────────────────────────────────── */
const TALEB_QUOTES = [
  { text: "The three most harmful addictions are heroin, carbohydrates, and a monthly salary.", attrib: "Nassim Nicholas Taleb" },
  { text: "Missing a train is only painful if you run after it! Likewise, not matching the idea of success others expect from you is only painful if that's what you are seeking.", attrib: "Nassim Nicholas Taleb" },
  { text: "Charm is the ability to insult people without offending them; nerdiness the reverse.", attrib: "Nassim Nicholas Taleb" },
  { text: "Half of the people lie with their lips; the other half with their tears.", attrib: "Nassim Nicholas Taleb" },
  { text: "What I learned on my own I still remember.", attrib: "Nassim Nicholas Taleb" },
  { text: "You may never know what type of person someone is unless they are given opportunities to violate moral or ethical codes.", attrib: "Nassim Nicholas Taleb" },
  { text: "Remember that you are a Black Swan.", attrib: "Nassim Nicholas Taleb" },
  { text: "The difference between technology and slavery is that slaves are fully aware that they are not free.", attrib: "Nassim Nicholas Taleb" },
];

function GoodreadsQuote({ num = "004" }) {
  const [idx, setIdx] = gUseState(() => Math.floor(Math.random() * TALEB_QUOTES.length));

  const q = TALEB_QUOTES[idx];
  const cycle = () => setIdx(i => (i + 1) % TALEB_QUOTES.length);

  return (
    <div className="bio-quote glass glass--violet">
      <div className="hero-stamp" style={{ marginBottom: 16 }}>
        <span><span className="num">{num}</span> / Liked quotes</span>
        <span style={{marginLeft: 'auto', color: 'var(--fg-faint)'}}>—— {idx + 1} / {TALEB_QUOTES.length}</span>
      </div>
      <p className="pull-quote">{q.text}</p>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginTop:16}}>
        <div className="attrib">— {q.attrib}</div>
        <button
          onClick={cycle}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--fs-mono-xs)",
            letterSpacing: "var(--tr-mono-up)",
            textTransform: "uppercase",
            background: "transparent",
            border: "1px solid var(--hairline-strong)",
            color: "var(--lumen-2)",
            padding: "7px 14px",
            borderRadius: "var(--r-pill)",
            cursor: "pointer",
            transition: "all var(--dur-quick) var(--ease-out)",
            flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.color = "var(--amber)"; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = "var(--hairline-strong)"; e.currentTarget.style.color = "var(--lumen-2)"; }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  OrbField, StatusBar, CountUp, ListeningCarousel, ChessBoard, Guestbook, WineCard, ReadingNow, WireGlobe, GoodreadsQuote, LiveCounters,
  CAREER_START_YEAR, yearsInIndustry, yearsInIndustryWord
});
