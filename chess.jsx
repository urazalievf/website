/* global React, ReactDOM, Chess, SiteNav, SiteFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, OrbField, StatusBar, SplineScene */

const CHESS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "aesthetic": "glass",
  "font": "classic",
  "showOrbs": true,
  "showStatusBar": true,
  "depth": 3
}/*EDITMODE-END*/;

const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

const PIECE_GLYPH = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟",
};

function evaluate(game) {
  if (game.in_checkmate()) return game.turn() === "w" ? -1e6 : 1e6;
  if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) return 0;
  let score = 0;
  for (const row of game.board()) {
    for (const sq of row) {
      if (!sq) continue;
      const v = PIECE_VALUE[sq.type];
      score += sq.color === "w" ? v : -v;
    }
  }
  return score;
}

function search(game, depth, alpha, beta, maximizing) {
  if (depth === 0 || game.game_over()) {
    return [evaluate(game), null];
  }
  const moves = game.moves();
  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }
  let best = null;
  if (maximizing) {
    let value = -Infinity;
    for (const m of moves) {
      game.move(m);
      const [v] = search(game, depth - 1, alpha, beta, false);
      game.undo();
      if (v > value) { value = v; best = m; }
      if (value > alpha) alpha = value;
      if (alpha >= beta) break;
    }
    return [value, best];
  } else {
    let value = Infinity;
    for (const m of moves) {
      game.move(m);
      const [v] = search(game, depth - 1, alpha, beta, true);
      game.undo();
      if (v < value) { value = v; best = m; }
      if (value < beta) beta = value;
      if (alpha >= beta) break;
    }
    return [value, best];
  }
}

function ChessApp() {
  const [t, setTweak] = useTweaks(CHESS_DEFAULTS);
  const gameRef = React.useRef(null);
  if (!gameRef.current) gameRef.current = new Chess();
  const game = gameRef.current;

  const [, setTick] = React.useState(0);
  const refresh = () => setTick(x => x + 1);

  const [selected, setSelected] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);
  const [history, setHistory] = React.useState([]);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-aesthetic", t.aesthetic);
    document.documentElement.setAttribute("data-font", t.font);
  }, [t.aesthetic, t.font]);

  const status = (() => {
    if (game.in_checkmate()) return game.turn() === "w" ? "Checkmate. Engine wins." : "Checkmate. You win.";
    if (game.in_stalemate()) return "Stalemate.";
    if (game.in_draw()) return "Draw.";
    if (thinking) return "Engine thinking…";
    if (game.in_check()) return game.turn() === "w" ? "You are in check." : "Engine is in check.";
    return game.turn() === "w" ? "Your move (white)." : "Engine to move.";
  })();

  const playEngine = React.useCallback(() => {
    if (game.game_over()) return;
    setThinking(true);
    setTimeout(() => {
      const depth = Math.max(1, Math.min(4, t.depth | 0));
      const [, m] = search(game, depth, -Infinity, Infinity, false);
      if (m) {
        game.move(m);
        setHistory(h => [...h, { side: "engine", san: m }]);
      }
      setThinking(false);
      refresh();
    }, 30);
  }, [game, t.depth]);

  const onSquareClick = (sq) => {
    if (thinking || game.turn() !== "w" || game.game_over()) return;
    if (selected) {
      const moved = game.move({ from: selected, to: sq, promotion: "q" });
      setSelected(null);
      if (moved) {
        setHistory(h => [...h, { side: "you", san: moved.san }]);
        refresh();
        playEngine();
        return;
      }
    }
    const piece = game.get(sq);
    setSelected(piece && piece.color === "w" ? sq : null);
  };

  const reset = () => {
    game.reset();
    setSelected(null);
    setHistory([]);
    refresh();
  };

  const takeBack = () => {
    if (thinking) return;
    game.undo();
    game.undo();
    setSelected(null);
    setHistory(h => h.slice(0, -2));
    refresh();
  };

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const board = game.board();
  const hintTargets = selected
    ? new Set(game.moves({ square: selected, verbose: true }).map(m => m.to))
    : new Set();

  return (
    <>
      <SplineScene />
      {t.showOrbs && <OrbField count={6} />}
      {t.showStatusBar && <StatusBar />}
      <SiteNav active="chess" />

      <main className="container">
        <section data-screen-label="Chess" style={{ paddingTop: 40, paddingBottom: 80 }}>
          <div className="hero-stamp" style={{ marginBottom: 24 }}>
            <span><span className="num">005</span> / Chess</span>
            <span>Minimax + alpha-beta</span>
            <span style={{ color: "var(--lumen-2)" }}>you are white</span>
          </div>

          <h1 style={{ marginBottom: 16 }}>
            A small <em>chess engine</em>.
          </h1>

          <p className="lead" style={{ maxWidth: 640, marginBottom: 24 }}>
            Material-only evaluation, a couple ply ahead. Good enough to punish hanging pieces; happy to be outplayed by anyone with a plan. Click a piece, then a destination.
          </p>

          <div className="chess-status glass" style={{ marginBottom: 16, padding: "12px 16px", borderRadius: "var(--r-2)", display: "inline-block" }}>
            {status}
          </div>

          <div className="chess-board" role="grid" aria-label="Chess board">
            {ranks.map((rank, ri) =>
              files.map((file, fi) => {
                const sq = file + rank;
                const piece = board[ri][fi];
                const isLight = (ri + fi) % 2 === 0;
                const isSel = selected === sq;
                const isHint = hintTargets.has(sq);
                const cls = `sq ${isLight ? "light" : "dark"}${isSel ? " sel" : ""}${isHint ? " hint" : ""}${isHint && piece ? " capture" : ""}`;
                return (
                  <button
                    key={sq}
                    className={cls}
                    onClick={() => onSquareClick(sq)}
                    aria-label={sq + (piece ? ` ${piece.color}${piece.type}` : " empty")}
                  >
                    {piece && PIECE_GLYPH[piece.color + piece.type.toUpperCase()]}
                  </button>
                );
              })
            )}
          </div>

          <div className="chess-controls">
            <button className="btn btn-primary" onClick={reset}>New game</button>
            <button className="btn btn-ghost" onClick={takeBack} disabled={thinking || history.length < 2}>
              Take back
            </button>
          </div>

          <div className="chess-meta">
            <div className="pill">Engine depth<strong>{t.depth}</strong></div>
            <div className="pill">Moves played<strong>{history.length}</strong></div>
            <div className="pill">Turn<strong>{game.turn() === "w" ? "white" : "black"}</strong></div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Aesthetic">
          <TweakRadio
            label="System"
            value={t.aesthetic}
            options={[{ value: "glass", label: "Glass" }, { value: "paper", label: "Paper" }]}
            onChange={(v) => setTweak("aesthetic", v)}
          />
        </TweakSection>
        <TweakSection title="Typography">
          <TweakSelect
            label="Display font"
            value={t.font}
            options={[
              { value: "classic", label: "Fraunces - classic" },
              { value: "editorial", label: "Instrument Serif - quieter" },
              { value: "modern", label: "Bricolage - grotesque" },
            ]}
            onChange={(v) => setTweak("font", v)}
          />
        </TweakSection>
        <TweakSection title="Engine">
          <TweakSelect
            label="Search depth"
            value={String(t.depth)}
            options={[
              { value: "1", label: "1 — random-ish" },
              { value: "2", label: "2 — quick" },
              { value: "3", label: "3 — default" },
              { value: "4", label: "4 — slower, sharper" },
            ]}
            onChange={(v) => setTweak("depth", Number(v))}
          />
        </TweakSection>
        <TweakSection title="Atmosphere">
          <TweakRadio
            label="Floating orbs"
            value={t.showOrbs ? "on" : "off"}
            options={[{ value: "on", label: "On" }, { value: "off", label: "Off" }]}
            onChange={(v) => setTweak("showOrbs", v === "on")}
          />
          <TweakRadio
            label="Status bar"
            value={t.showStatusBar ? "on" : "off"}
            options={[{ value: "on", label: "On" }, { value: "off", label: "Off" }]}
            onChange={(v) => setTweak("showStatusBar", v === "on")}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ChessApp />);
