// PROBE driver (ruling-abc086-seed). Read-only against src/ @ 092f647. Not a test, not shipped.
// Run from the repo root:  node .grugops/context/ruling-abc086-seed/probe/run.ts <mode> [args]
//   faithful               probe copy (wideRoot off, no seed) vs src chooseMove / door: move, score,
//                          depth AND nodes, at virtual budgets 2/4/8/32 ticks, corpus "small" (30)
//   fixed <d> <corpus>     equal-depth comparison at iteration d: shipped (S) vs Q1(a) with no seed
//                          (W: window only) vs Q1(a) seeded 1..5 (K) — LMR on; and the same three
//                          with LMR off (SR/WR/KR). corpus = small | broad (190)
//   budget <ticks>         same virtual budget (ticking(1)): S vs W vs K1..K5, depth reached + move
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import { chooseMove, chooseMoveWithoutReductions, type Clock } from "../../../../src/engine.ts";
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import type { Move } from "../../../../src/moves.ts";
import { squareName } from "../../../../src/position.ts";
import { type ProbeConfig, probeChoose } from "./engine-seeded.ts";

const ROOTS: Array<[string, string]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES: Array<[string, string]> = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const lbl = (m: Move): string =>
  `${squareName(m.from)}${squareName(m.to)}${m.promotion ? String(m.promotion) : ""}`;

/** BA/PM's rescore-abc086 corpus: six roots + their first four children (30). */
function small(): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [name, fen] of ROOTS) {
    out.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p).slice(0, 4)) {
      const u = makeMove(p, m);
      out.push([`${name}/${lbl(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return out;
}
/** ADR-0026's 190: six roots + every in-progress child + six endgames. */
function broad(): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [name, fen] of ROOTS) {
    out.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${lbl(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...ENDGAMES];
}
const ticking = (step: number): Clock => {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
};
const out = (o: unknown): void => console.log(JSON.stringify(o));
const SEEDS = [1, 2, 3, 4, 5];
const cfg = (reductions: boolean, wideRoot: boolean, seed: number | null): ProbeConfig => ({
  pvs: true,
  reductions,
  wideRoot,
  seed,
});

const [mode, a1, a2] = process.argv.slice(2);

if (mode === "faithful") {
  let same = 0;
  let total = 0;
  for (const ticks of [2, 4, 8, 32]) {
    for (const [name, fen] of small()) {
      for (const [door, red] of [
        [chooseMove, true],
        [chooseMoveWithoutReductions, false],
      ] as const) {
        const s = door(parseFen(fen), { budgetMs: ticks, now: ticking(1) });
        const p = probeChoose(parseFen(fen), { budgetMs: ticks, now: ticking(1) }, cfg(red, false, null));
        const k = (c: typeof s) => (c ? `${lbl(c.move)} ${c.score} ${c.depth} ${c.nodes}` : "null");
        total++;
        if (k(s) === k(p)) same++;
        else out({ DIFF: name, ticks, red, src: k(s), probe: k(p) });
      }
    }
  }
  out({ summary: "faithful", same, total });
} else if (mode === "fixed") {
  const d = Number(a1);
  const corpus = a2 === "broad" ? broad() : small();
  const t0 = performance.now();
  const agg: Record<string, { scoreDiff: number; maxCp: number; moveDiff: number; nodes: number }> = {};
  const bump = (k: string, sd: number, md: boolean, n: number) => {
    const g = (agg[k] ??= { scoreDiff: 0, maxCp: 0, moveDiff: 0, nodes: 0 });
    if (sd !== 0) g.scoreDiff++;
    g.maxCp = Math.max(g.maxCp, Math.abs(sd));
    if (md) g.moveDiff++;
    g.nodes += n;
  };
  let tiedPositions = 0;
  let a3Distinct = 0;
  let a3DistinctR = 0;
  for (const [name, fen] of corpus) {
    const row: Record<string, unknown> = { name };
    for (const red of [true, false]) {
      const tag = red ? "" : "R";
      const run = (w: boolean, seed: number | null) =>
        probeChoose(parseFen(fen), { budgetMs: 1, now: () => 0 }, cfg(red, w, seed), d);
      const S = run(false, null);
      const W = run(true, null);
      if (!S || !W) continue;
      bump(`S${tag}`, 0, false, S.nodes);
      bump(`W${tag}`, W.score - S.score, lbl(W.move) !== lbl(S.move), W.nodes);
      const ks = SEEDS.map((s) => run(true, s) as NonNullable<typeof S>);
      for (const K of ks) bump(`K${tag}`, K.score - S.score, lbl(K.move) !== lbl(S.move), K.nodes);
      const distinct = new Set(ks.map((k) => lbl(k.move))).size;
      if (red) {
        if (W.ties > 1) tiedPositions++;
        if (distinct > 1) a3Distinct++;
      } else if (distinct > 1) a3DistinctR++;
      row[`S${tag}`] = `${lbl(S.move)} ${S.score} n=${S.nodes}`;
      row[`W${tag}`] = `${lbl(W.move)} ${W.score} n=${W.nodes} ties=${W.ties}`;
      row[`K${tag}`] = ks.map((k) => `${lbl(k.move)} ${k.score} n=${k.nodes}`);
    }
    out(row);
  }
  out({
    summary: "fixed",
    depth: d,
    corpus: a2 ?? "small",
    positions: corpus.length,
    tiedAtFinalIteration: tiedPositions,
    a3DistinctAcross5Seeds: a3Distinct,
    a3DistinctAcross5SeedsLmrOff: a3DistinctR,
    // scoreDiff/moveDiff: K counts runs (positions x 5 seeds); S/W count positions
    agg,
    nodesW_over_S: +((agg.W?.nodes ?? 0) / (agg.S?.nodes ?? 1)).toFixed(4),
    nodesK_over_S5: +((agg.K?.nodes ?? 0) / 5 / (agg.S?.nodes ?? 1)).toFixed(4),
    nodesWR_over_SR: +((agg.WR?.nodes ?? 0) / (agg.SR?.nodes ?? 1)).toFixed(4),
    ms: Math.round(performance.now() - t0),
  });
} else if (mode === "budget") {
  const ticks = Number(a1);
  let depthDiffW = 0;
  let depthDiffK = 0;
  let moveDiffK = 0;
  let sumS = 0;
  let sumW = 0;
  for (const [name, fen] of small()) {
    const run = (w: boolean, seed: number | null) =>
      probeChoose(parseFen(fen), { budgetMs: ticks, now: ticking(1) }, cfg(true, w, seed)) as NonNullable<
        ReturnType<typeof probeChoose>
      >;
    const S = run(false, null);
    const W = run(true, null);
    const ks = SEEDS.map((s) => run(true, s));
    sumS += S.depth;
    sumW += W.depth;
    if (W.depth !== S.depth) depthDiffW++;
    for (const K of ks) {
      if (K.depth !== S.depth) depthDiffK++;
      if (lbl(K.move) !== lbl(S.move)) moveDiffK++;
    }
    out({ name, S: `${lbl(S.move)} d=${S.depth} s=${S.score}`, W: `${lbl(W.move)} d=${W.depth} s=${W.score}`, K: ks.map((k) => `${lbl(k.move)} d=${k.depth}`) });
  }
  out({ summary: "budget", ticks, positions: 30, depthDiffW, depthDiffKruns: depthDiffK, moveDiffKruns: moveDiffK, meanDepthS: sumS / 30, meanDepthW: sumW / 30 });
}
