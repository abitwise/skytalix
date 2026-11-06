// SCRATCH PROBE (arch-ABC-291-probe). Runs on the patched `cand` copy, copied to its root. Modes nodes / mate / zug /
// g1 / reach / drift / fire follow arch-ABC-271's e4aprobe.ts. The form argument is the probe-only switch: ON calls the
// shipped entries, OFF calls d4's doors. Deterministic counts only; no timing here. Usage: node e4bprobe.ts <mode> <ON|OFF>
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutPawnShape } from "./src/engine.ts";
import { clearPawnCacheForTest, evaluate, evaluateAtPhaseWithoutPawnShape, pawnCacheProbeForTest, pawnShapeForTest, pawnStructureForTest, phaseOf } from "./src/evaluate.ts";
import { buildCorpus, mirrorPosition } from "./src/evaluate.mirror-corpus.ts";
import { TAPER_MIRROR_POSITIONS } from "./src/evaluate.taper-corpus.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { parseSan } from "./src/san.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutPawnShape } from "./src/search.ts";
import { HAND_ROWS, label } from "./labeller.ts";

const [mode, form] = process.argv.slice(2) as [string, string];
if (form !== "ON" && form !== "OFF") throw new Error(`form ${form}`);
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const pick = (f: string) => (f === "ON" ? chooseMove : chooseMoveWithoutPawnShape);
const pickSearch = (f: string) => (f === "ON" ? search : searchWithoutPawnShape);
const choose = (f: string, fen: string, d: number) =>
  pick(f)(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as { move: any; score: number; nodes: number; depth: number };
const off = (p: any): number => evaluateAtPhaseWithoutPawnShape(p, phaseOf(p));

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
// Sixteen new pawn-shape positions (the mirror rows, K1 (a)'s "at least 12"; written before any reading).
const PAWN_SET = [
  "4k3/8/8/8/3P4/2P5/1P6/4K3 w - - 0 1", // a white chain
  "4k3/1p6/2p5/3p4/8/8/8/4K3 b - - 0 1", // a black chain
  "4k3/8/8/3PP3/8/8/8/4K3 w - - 0 1", // a phalanx
  "4k3/8/8/8/P7/1P6/8/4K3 w - - 0 1", // connected on the a-file
  "4k3/8/8/7p/6p1/8/8/4K3 b - - 0 1", // connected, black, by the h-file
  "4k3/8/8/4p3/2P5/3P4/8/4K3 w - - 0 1", // backward, attacked stop square
  "4k3/8/3p4/2p5/4P3/8/8/4K3 b - - 0 1", // the same for black
  "4k3/8/8/4p3/8/3P4/8/4K3 w - - 0 1", // clause (a) fails: isolated
  "4k3/8/8/4p3/8/2PP4/8/4K3 w - - 0 1", // clause (b) fails: a neighbour on rank R
  "4k3/8/8/8/2P5/3P4/8/4K3 w - - 0 1", // clause (c) fails
  "4k3/8/8/8/2PPp3/8/3P4/4K3 w - - 0 1", // a backward rear pawn of a doubled pair
  "4k3/8/8/8/2Pp4/3P4/8/4K3 w - - 0 1", // backward, enemy pawn on the stop square
  "4k3/8/8/6p1/6P1/7P/8/4K3 w - - 0 1", // backward on the h-file
  "4k3/8/p7/1p6/1P6/8/8/4K3 b - - 0 1", // backward on the a-file, black
  "r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1", // full phase
  "r1bq1rk1/pp2bppp/2n1pn2/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 1", // full phase, black to move
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
    ["pawn-set", PAWN_SET],
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
  // PR2: K1 (a)'s sets, ON, Object.is.
  const positions = [...buildCorpus().map(({ position }) => position), ...TAPER_MIRROR_POSITIONS.map((r) => parseFen(r.fen)), ...PAWN_SET.map((f) => parseFen(f))];
  let bad = 0, moved = 0;
  for (const p of positions) {
    if (!Object.is(evaluate(p), evaluate(mirrorPosition(p)))) bad++;
    if (evaluate(p) !== off(p)) moved++;
  }
  console.log(JSON.stringify({ mirrorPairs: positions.length, g3: buildCorpus().length, taperMirror: TAPER_MIRROR_POSITIONS.length, pawnSet: PAWN_SET.length, mirrorMismatches: bad, positionsTheTermMoves: moved }));
} else if (mode === "arith") {
  // PR3: the seam's parts against the labeller. `hot` is K1 (d)'s relation, a report beside the row.
  let handBad = 0;
  for (const [fen, w, b] of HAND_ROWS) {
    const l = label(fen);
    const got = (x: any) => [x.connected.mg, x.phalanx.mg, x.backward.mg];
    if (JSON.stringify(got(l.white)) !== JSON.stringify(w) || JSON.stringify(got(l.black)) !== JSON.stringify(b)) handBad++;
  }
  console.log(JSON.stringify({ handRows: HAND_ROWS.length, handBad }));
  if (handBad > 0) process.exit(3);
  const net = (s: any, h: "mg" | "eg") => s.white.connected[h] + s.white.phalanx[h] - s.white.backward[h] - (s.black.connected[h] + s.black.phalanx[h] - s.black.backward[h]);
  for (const [name, fens] of sets()) {
    let mismatches = 0, hot = 0, fired = 0; const ex: string[] = [];
    for (const fen of fens) {
      const p = parseFen(fen);
      const seam = pawnShapeForTest(p);
      const want = label(fen);
      if (JSON.stringify(seam) !== JSON.stringify(want)) { mismatches++; if (ex.length < 3) ex.push(fen); }
      if (net(seam, "mg") !== net(seam, "eg")) hot++;
      const delta = evaluate(p) - off(p);
      if (delta !== (p.blackToMove ? 0 - net(seam, "mg") : net(seam, "mg"))) hot++;
      if (JSON.stringify(want) !== '{"white":{"connected":{"mg":0,"eg":0},"phalanx":{"mg":0,"eg":0},"backward":{"mg":0,"eg":0}},"black":{"connected":{"mg":0,"eg":0},"phalanx":{"mg":0,"eg":0},"backward":{"mg":0,"eg":0}}}') fired++;
    }
    console.log(JSON.stringify({ set: name, positions: fens.length, labelledNonZero: fired, mismatches, hot, ex }));
  }
} else if (mode === "memo") {
  // PR4, in-copy parts: a hit equals a fresh call (a forced collision too), and ON then OFF on one slot.
  const fens = sets().flatMap(([, f]) => f);
  const same = (a: any, b: any) => a.structure === b.structure && a.whitePassers === b.whitePassers && a.blackPassers === b.blackPassers && a.shape === b.shape;
  let hitBad = 0, notHit = 0;
  const bySlot = new Map<number, Map<string, string>>();
  for (const fen of fens) {
    const p = parseFen(fen);
    const fresh = pawnStructureForTest(p, false);
    const first = pawnStructureForTest(p, true);
    if (!pawnCacheProbeForTest(p).hit) notHit++;
    const second = pawnStructureForTest(p, true);
    if (!same(fresh, first) || !same(fresh, second)) hitBad++;
    // The pawns alone, one character a square: two different keys are two different pairs of masks.
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
  console.log(JSON.stringify({ positions: fens.length, hitBad, notHit, collisions, collisionBad, onOffBad }));
} else if (mode === "mate") {
  // PR5: ADR-0064 B2's rows on the 287. The door (OFF) at D against ON at D + PLUS.
  const d = Number(process.env.D ?? 4);
  const plus = Number(process.env.PLUS ?? 1);
  let mates = 0, viol = 0, longer = 0; const bad: string[] = [];
  for (const fen of MATE_CORPUS) {
    const a = searchWithoutPawnShape(parseFen(fen), d);
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
  // PR7: the 58, ON against OFF. A NEWLY-MISSED line here is a puzzle ON misses and OFF solves.
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  const run = (f: string) => {
    const missed: string[] = [];
    for (const p of PUZZLES as any[]) {
      const c = pick(f)(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
      const chosen = c === null ? "null" : mv(c.move);
      const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
      if (!ok) missed.push(p.name);
    }
    return missed;
  };
  const mOff = run("OFF"), mOn = run("ON");
  const total = (PUZZLES as any[]).length;
  console.log(JSON.stringify({ total, solvedOff: total - mOff.length, solvedOn: total - mOn.length, newlyMissedOnAgainstOff: mOn.filter((n) => !mOff.includes(n)), newlySolvedOnAgainstOff: mOff.filter((n) => !mOn.includes(n)), onMissedOutsideBaseline: mOn.filter((n) => !base.unsolved.includes(n)), offMissedOutsideBaseline: mOff.filter((n) => !base.unsolved.includes(n)) }));
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
  // MET iff ge10 / positions >= 5.0 %, as integers, ge10 x 20 >= positions, no rounding. `parts` is PR10's PR9 by part.
  let positions = 0, nonzero = 0, ge10 = 0, ge25 = 0; const games25 = new Set<number>();
  const parts = { connected: { nonzero: 0, ge10: 0 }, phalanx: { nonzero: 0, ge10: 0 }, backward: { nonzero: 0, ge10: 0 } };
  const g = walkGames((p, game) => {
    const d = Math.abs(evaluate(p) - off(p));
    positions++;
    if (d) nonzero++;
    if (d >= 10) ge10++;
    if (d >= 25) { ge25++; games25.add(game); }
    const s = pawnShapeForTest(p);
    for (const k of ["connected", "phalanx", "backward"] as const) {
      const v = Math.abs(s.white[k].mg - s.black[k].mg);
      if (v) parts[k].nonzero++;
      if (v >= 10) parts[k].ge10++;
    }
  });
  console.log(JSON.stringify({ ...g, positions, nonzero, ge10, ge25, ge10Pct: +(100 * ge10 / positions).toFixed(4), nonzeroPct: +(100 * nonzero / positions).toFixed(2), ge25Pct: +(100 * ge25 / positions).toFixed(2), gamesWithGe25: games25.size, met: ge10 * 20 >= positions, parts }));
} else throw new Error(`mode ${mode}`);
