// SCRATCH PROBE (arch-ABC-292-probe). Runs on the patched `cand` copy, copied to its root. Modes follow
// arch-ABC-291-probe's e4bprobe.ts. The form argument is the probe-only switch: ON calls the shipped entries, OFF calls
// d5's doors. Deterministic counts only; no timing here. Usage: node e5probe.ts <mode> <ON|OFF>
// FIX = QE's frozen fixtures.json; PGNS = the two d.pgn files, comma-separated.
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutPieceTerms } from "./src/engine.ts";
import { clearPawnCacheForTest, evaluate, evaluateAtPhaseWithoutPieceTerms, evaluateWithoutPawnCache, pawnCacheProbeForTest, pawnStructureForTest, phaseOf, pieceTermsForTest } from "./src/evaluate.ts";
import { buildCorpus, mirrorPosition } from "./src/evaluate.mirror-corpus.ts";
import { TAPER_DOOR_CORPUS, TAPER_MIRROR_POSITIONS } from "./src/evaluate.taper-corpus.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { parseSan } from "./src/san.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutPieceTerms } from "./src/search.ts";
import { HAND_ROWS, label } from "./labeller.ts";

const [mode, form] = process.argv.slice(2) as [string, string];
if (form !== "ON" && form !== "OFF") throw new Error(`form ${form}`);
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const pick = (f: string) => (f === "ON" ? chooseMove : chooseMoveWithoutPieceTerms);
const pickSearch = (f: string) => (f === "ON" ? search : searchWithoutPieceTerms);
const choose = (f: string, fen: string, d: number) =>
  pick(f)(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as { move: any; score: number; nodes: number; depth: number };
const off = (p: any): number => evaluateAtPhaseWithoutPieceTerms(p, phaseOf(p));
const KEYS = ["BISHOP_PAIR", "ROOK_OPEN_FILE", "ROOK_SEMI_OPEN_FILE"] as const;
const sum = (parts: any) => KEYS.reduce((a, k) => a + parts[k].mg, 0);
const sumEg = (parts: any) => KEYS.reduce((a, k) => a + parts[k].eg, 0);

const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
function corpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, fen] of ROOTS) {
    out.push([name as string, fen as string]);
    const p = parseFen(fen as string);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...(ENDGAMES as [string, string][])];
}
const fenOf = (name: string) => (ROOTS.find((r) => r[0] === name) as string[])[1] as string;

// QE's freeze (fixtures.json): the K1 (c) rows and K2's boards with their hand parts, and K1 (a)'s new positions.
const FIX = JSON.parse(readFileSync(process.env.FIX as string, "utf8"));
type Frozen = { id: string; fen: string; white: any; black: any; stm?: number };
const frozenRows = (): Frozen[] => {
  const rows: Frozen[] = FIX.k1c.map((r: any) => ({ id: r.id, fen: r.fen, white: r.white.parts, black: r.black.parts, stm: r.stm }));
  for (const k of FIX.k2) {
    if (k.fen) rows.push({ id: k.id, fen: k.fen, white: k.hand.white.parts, black: k.hand.black.parts });
    for (const arm of ["closedF5", "halfOpenE5"]) if (k[arm]) rows.push({ id: `${k.id}-${arm}`, fen: k[arm], white: k.hand[arm].white.parts, black: k.hand[arm].black.parts });
  }
  return rows;
};
const mirrorFen = (fen: string) => toFen(mirrorPosition(parseFen(fen)));
const frozenFens = (): string[] => {
  const base = [...frozenRows().map((r) => r.fen), ...FIX.k1a.map((r: any) => r.fen)];
  return [...base, ...base.map(mirrorFen)];
};

// Every position of the games: the start position, each position after a move, the last one included.
function walkGames(visit: (p: any, game: number) => void): { games: number; failedGames: number } {
  const files = (process.env.PGNS as string).split(",");
  let games = 0, failedGames = 0;
  for (const file of files) {
    for (const block of readFileSync(file, "utf8").split(/\n(?=\[Event )/)) {
      if (!block.includes("[Event ")) continue;
      const fenM = block.match(/\[FEN "([^"]+)"\]/);
      const movesText = block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
      const sans = (movesText.match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t.length);
      const p = parseFen(fenM ? (fenM[1] as string) : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      games++;
      try {
        for (let i = 0; i <= sans.length; i++) {
          visit(p, games);
          if (i === sans.length) break;
          const r = parseSan(p, sans[i] as string);
          if (r.outcome !== "move") throw new Error(`san ${sans[i]} ${r.outcome}`);
          makeMove(p, r.move);
        }
      } catch { failedGames++; }
    }
  }
  return { games, failedGames };
}
const gameFens = (): { fens: string[]; games: number; failedGames: number } => {
  const fens: string[] = [];
  const g = walkGames((p) => fens.push(toFen(p)));
  return { fens, ...g };
};
const sets = (): [string, string[]][] => {
  const g = gameFens();
  if (g.games !== 200 || g.failedGames !== 0) throw new Error(`games ${g.games} failed ${g.failedGames}`);
  return [
    ["G3", buildCorpus().map(({ position }) => toFen(position))],
    ["taper-mirror", TAPER_MIRROR_POSITIONS.map((r) => r.fen)],
    ["frozen", frozenFens()],
    ["games", g.fens],
  ];
};

if (mode === "load") {
  const p = parseFen((ROOTS[0] as string[])[1] as string);
  console.log(JSON.stringify({ startposOn: evaluate(p), isZero: Object.is(evaluate(p), 0) }));
} else if (mode === "nodes") {
  const depths = (process.env.DS ?? "7,8").split(",").map(Number);
  const rec = process.env.REC ?? "choose";
  for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
    for (const d of depths) {
      const r: any = rec === "search" ? pickSearch(form)(parseFen(fenOf(name)), d) : choose(form, fenOf(name), d);
      console.log(JSON.stringify({ rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move) }));
    }
  }
} else if (mode === "mirror") {
  // PR2: K1 (a)'s sets, ON, Object.is: G3 + TAPER_MIRROR_POSITIONS + QE's 15 new positions; QE's K1 (c) and K2 boards join.
  const groups: [string, any[]][] = [
    ["G3", buildCorpus().map(({ position }) => position)],
    ["taper-mirror", TAPER_MIRROR_POSITIONS.map((r) => parseFen(r.fen))],
    ["qe-k1a", FIX.k1a.map((r: any) => parseFen(r.fen))],
    ["qe-k1c+k2", frozenRows().map((r) => parseFen(r.fen))],
  ];
  let total = 0, bad = 0, moved = 0; const per: Record<string, number> = {};
  for (const [name, ps] of groups) {
    per[name] = ps.length;
    for (const p of ps) {
      total++;
      if (!Object.is(evaluate(p), evaluate(mirrorPosition(p)))) bad++;
      if (evaluate(p) !== off(p)) moved++;
    }
  }
  console.log(JSON.stringify({ mirrorPairs: total, per, mirrorMismatches: bad, positionsTheTermMoves: moved }));
} else if (mode === "arith") {
  // PR3. (1) The labeller's own hand rows. (2) The seam against QE's frozen parts, each row and its mirror (parts swap),
  // with K1 (d)'s relation on each. (3) The seam against the labeller over G3, taper-mirror, the frozen positions and
  // their mirrors, and the games. `hot` is K1 (d)'s relation and mg = eg, a report; a non-zero `hot` is a prototype
  // defect under rule 1.
  let handBad = 0;
  for (const [fen, w, b] of HAND_ROWS) {
    const l = label(fen);
    const got = (x: any) => KEYS.map((k) => x[k].mg);
    if (JSON.stringify(got(l.white)) !== JSON.stringify(w) || JSON.stringify(got(l.black)) !== JSON.stringify(b)) handBad++;
  }
  console.log(JSON.stringify({ handRows: HAND_ROWS.length, handBad }));
  if (handBad > 0) process.exit(3);
  const eq = (a: any, b: any) => KEYS.every((k) => a[k].mg === b[k].mg && a[k].eg === b[k].eg);
  const signedNet = (p: any, s: any) => { const n = sum(s.white) - sum(s.black); return p.blackToMove ? 0 - n : n; };
  let frozenBad = 0, frozenStmBad = 0, frozenHot = 0, labellerVsQE = 0, rowsRead = 0; const fex: string[] = [];
  for (const r of frozenRows()) {
    for (const [fen, w, b] of [[r.fen, r.white, r.black], [mirrorFen(r.fen), r.black, r.white]] as [string, any, any][]) {
      rowsRead++;
      const p = parseFen(fen);
      const seam = pieceTermsForTest(p);
      if (!eq(seam.white, w) || !eq(seam.black, b)) { frozenBad++; if (fex.length < 5) fex.push(`${r.id} ${fen}`); }
      const l = label(fen);
      if (!eq(l.white, w) || !eq(l.black, b)) labellerVsQE++;
      const handNet = sum(w) - sum(b);
      const handStm = p.blackToMove ? 0 - handNet : handNet;
      if (fen === r.fen && r.stm !== undefined && r.stm !== handStm) frozenStmBad++;
      if (evaluate(p) - off(p) !== handStm) frozenHot++;
    }
  }
  console.log(JSON.stringify({ frozen: "QE k1c 39 + K2 boards 3, each with its mirror", rowsRead, frozenMismatches: frozenBad, qeStmFieldBad: frozenStmBad, k1dRelationBad: frozenHot, labellerVsQE, ex: fex }));
  for (const [name, fens] of sets()) {
    let mismatches = 0, hot = 0, fired = 0; const ex: string[] = [];
    for (const fen of fens) {
      const p = parseFen(fen);
      const seam = pieceTermsForTest(p);
      const want = label(fen);
      if (!eq(seam.white, want.white) || !eq(seam.black, want.black)) { mismatches++; if (ex.length < 3) ex.push(fen); }
      if (sum(seam.white) !== sumEg(seam.white) || sum(seam.black) !== sumEg(seam.black)) hot++;
      if (evaluate(p) - off(p) !== signedNet(p, seam)) hot++;
      if (sum(want.white) + sum(want.black) !== 0) fired++;
    }
    console.log(JSON.stringify({ set: name, positions: fens.length, labelledNonZero: fired, mismatches, hot, ex }));
  }
} else if (mode === "memo") {
  // PR4, in-copy parts: a hit equals a fresh call (the file word included; a forced collision too), ON then OFF on one
  // slot, and the memo-bypassed evaluate Object.is the memoised one.
  const fens = [...sets().flatMap(([, f]) => f), ...TAPER_DOOR_CORPUS.map((r) => r.fen)];
  const same = (a: any, b: any) => a.structure === b.structure && a.whitePassers === b.whitePassers && a.blackPassers === b.blackPassers && a.files === b.files;
  let hitBad = 0, notHit = 0, bypassBad = 0;
  const bySlot = new Map<number, Map<string, string>>();
  for (const fen of fens) {
    const p = parseFen(fen);
    const fresh = pawnStructureForTest(p, false);
    const first = pawnStructureForTest(p, true);
    if (!pawnCacheProbeForTest(p).hit) notHit++;
    const second = pawnStructureForTest(p, true);
    if (!same(fresh, first) || !same(fresh, second)) hitBad++;
    if (!Object.is(evaluateWithoutPawnCache(p), evaluate(p))) bypassBad++;
    const pawns = (fen.split(" ")[0] as string).replace(/[1-8]/g, (n) => ".".repeat(Number(n))).replace(/[^Pp/]/g, ".");
    const slot = pawnCacheProbeForTest(p).slot;
    if (!bySlot.has(slot)) bySlot.set(slot, new Map());
    (bySlot.get(slot) as Map<string, string>).set(pawns, fen);
  }
  let collisions = 0, collisionBad = 0;
  for (const group of bySlot.values()) {
    const list = [...group.values()];
    for (let i = 1; i < list.length && collisions < 2000; i++) {
      const a = parseFen(list[0] as string), b = parseFen(list[i] as string);
      collisions++;
      pawnStructureForTest(a, true);
      const overB = pawnStructureForTest(b, true);
      if (pawnCacheProbeForTest(a).hit) collisionBad++;
      const backA = pawnStructureForTest(a, true);
      if (!same(backA, pawnStructureForTest(a, false)) || !same(overB, pawnStructureForTest(b, false))) collisionBad++;
    }
  }
  let onOffBad = 0;
  for (const fen of fens) {
    const p = parseFen(fen);
    clearPawnCacheForTest();
    const off1 = off(p), on1 = evaluate(p);
    clearPawnCacheForTest();
    const on2 = evaluate(p), off2 = off(p);
    if (!Object.is(off1, off2) || !Object.is(on1, on2)) onOffBad++;
  }
  console.log(JSON.stringify({ positions: fens.length, hitBad, notHit, bypassBad, collisions, collisionBad, onOffBad }));
} else if (mode === "mate") {
  // PR5: ADR-0064 B2's rows on the 287. The door (OFF) at D against ON at D + PLUS.
  const d = Number(process.env.D ?? 4);
  const plus = Number(process.env.PLUS ?? 1);
  let mates = 0, viol = 0, longer = 0; const bad: string[] = [];
  for (const fen of MATE_CORPUS) {
    const a = searchWithoutPieceTerms(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    const b = search(parseFen(fen), d + plus);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) { viol++; bad.push(fen); }
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ d, plus, corpus: MATE_CORPUS.length, mates, viol, longer, bad }));
} else if (mode === "zug") {
  // PR6: ADR-0050 d9's seven rows at recorded depths, ON, the played move only. No score, no margin, no nodes.
  const rows = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
  ] as const;
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    const played = mv(choose("ON", fen, d).move);
    if (played === want) ok++;
    console.log(JSON.stringify({ name, d, played, want, ok: played === want }));
  }
  console.log(JSON.stringify({ zugzwang: `${ok} / ${rows.length}` }));
} else if (mode === "g1") {
  // PR7: the 58, ON against OFF. A NEWLY-MISSED line here is a puzzle ON misses and OFF solves. Row 1632's nodes reported.
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  const watch: Record<string, unknown> = {};
  const run = (f: string) => {
    const missed: string[] = [];
    for (const p of PUZZLES as any[]) {
      const c = pick(f)(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
      const chosen = c === null ? "null" : mv(c.move);
      const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
      if (!ok) missed.push(p.name);
      if (p.name.includes("seed 1632")) watch[f] = { chosen, ok, depth: c?.depth, nodes: c?.nodes };
    }
    return missed;
  };
  const mOff = run("OFF"), mOn = run("ON");
  const total = (PUZZLES as any[]).length;
  console.log(JSON.stringify({ total, solvedOff: total - mOff.length, solvedOn: total - mOn.length, newlyMissedOnAgainstOff: mOn.filter((n) => !mOff.includes(n)), newlySolvedOnAgainstOff: mOff.filter((n) => !mOn.includes(n)), onMissedOutsideBaseline: mOn.filter((n) => !base.unsolved.includes(n)), offMissedOutsideBaseline: mOff.filter((n) => !base.unsolved.includes(n)), row1632: watch }));
} else if (mode === "row1632") {
  // PR7's report: G1's "mate in 3, seed 1632", ON and OFF, in qe-ABC-291's row1632.ts form. budget = nodes the 25 ms run
  // spends at 1x (virtual clock, step 1); used = nodes of the first iteration, read with maxDepth and no clock, whose
  // move is the accepted e7e2. A report; it decides nothing.
  const fen = "8/2R1QpK1/5p2/8/8/8/7n/1N4k1 w - - 0 1";
  const { virtualClock } = await import("./src/virtual-clock.ts");
  for (const f of ["OFF", "ON"]) {
    const c = pick(f)(parseFen(fen), { budgetMs: 25, now: virtualClock(1) }) as any;
    let used: number | null = null, usedDepth: number | null = null;
    for (let d = 1; d <= 8 && used === null; d++) {
      const r = choose(f, fen, d);
      if (mv(r.move) === "e7e2") { used = r.nodes; usedDepth = d; }
    }
    console.log(JSON.stringify({ form: f, budgetRun: { depth: c.depth, move: mv(c.move), nodes: c.nodes, solved: mv(c.move) === "e7e2" }, used, usedDepth }));
  }
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const depths: number[] = [];
  for (const [, fen] of corpus()) {
    const c = pick(form)(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number };
    depths.push(c.depth);
  }
  console.log(JSON.stringify({ form, maxNodes, rows: depths.length, meanDepth: +(depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(3) }));
} else if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  for (const [name, fen] of corpus()) {
    const a = choose("OFF", fen, depth);
    const b = choose("ON", fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const dd = Math.abs(a.score - b.score);
    if (dd <= 25) within++;
    if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ depth, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
} else if (mode === "fire") {
  // PR9: static evaluate, ON minus OFF, at every position of the 200 games. The bar reads the exact fraction:
  // MET iff ge10 / positions >= 5.0 %, as integers, ge10 x 20 >= positions, no rounding. `parts` is PR10's PR9 by part:
  // per part, |white - black| on the seam's mg.
  let positions = 0, nonzero = 0, ge10 = 0, ge25 = 0; const games25 = new Set<number>();
  const parts = Object.fromEntries(KEYS.map((k) => [k, { nonzero: 0, ge10: 0 }])) as Record<string, { nonzero: number; ge10: number }>;
  const g = walkGames((p, game) => {
    const d = Math.abs(evaluate(p) - off(p));
    positions++;
    if (d) nonzero++;
    if (d >= 10) ge10++;
    if (d >= 25) { ge25++; games25.add(game); }
    const s = pieceTermsForTest(p);
    for (const k of KEYS) {
      const v = Math.abs(s.white[k].mg - s.black[k].mg);
      if (v) (parts[k] as any).nonzero++;
      if (v >= 10) (parts[k] as any).ge10++;
    }
  });
  console.log(JSON.stringify({ ...g, positions, nonzero, ge10, ge25, ge10Pct: +(100 * ge10 / positions).toFixed(4), nonzeroPct: +(100 * nonzero / positions).toFixed(2), ge25Pct: +(100 * ge25 / positions).toFixed(2), gamesWithGe25: games25.size, met: ge10 * 20 >= positions, parts }));
} else throw new Error(`mode ${mode}`);
