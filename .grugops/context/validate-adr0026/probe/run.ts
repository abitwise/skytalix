/**
 * PROBE driver. `node run.ts <mode> [args]` — every mode prints JSON lines on stdout.
 *   faithful          probe (all switches off) vs src search(): score AND nodes, d1-d4, six roots + endgames
 *   identity <d>      PVS-only vs search() (A1 shape), table-off PVS vs searchWithoutTable (ABC-081 A1),
 *                     deepen(PVS) vs fixed(PVS) (ABC-078 A3) — on the broad corpus at depth d
 *   lmr <d>           PVS+LMR vs PVS-only at depth d on the broad corpus: score drift, mate flips,
 *                     move changes; and the three identity shapes WITH LMR on both sides
 *   lmrplain <d>      LMR without PVS vs baseline, same drift figures
 *   mates             the mate rows of search.test.ts A3 / transposition A4, under each config
 *   budget <ms>       depth completed within <ms>, kiwipete and position-6, per config
 *   work <d>          node counts at depth d, six roots, per config (the pins that move)
 */
import { parseFen, toFen } from "../../../../src/fen.ts";
import { gameStatus } from "../../../../src/gameend.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { makeMove, unmakeMove } from "../../../../src/apply.ts";
import type { Move } from "../../../../src/moves.ts";
import { MATE_SCORE, search, searchWithoutTable, searchWithoutOrdering } from "../../../../src/search.ts";
import { squareName } from "../../../../src/position.ts";
import { BASE, type Cfg, deepen, fixed } from "./lmr.ts";

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
const lbl = (m: Move | null): string => (m ? `${squareName(m.from)}${squareName(m.to)}` : "-");

/** search.test.ts broadCorpus(): six roots + every position one legal move away, in progress. */
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

const PVS: Cfg = { ...BASE, pvs: true };
const LMR: Cfg = { ...BASE, pvs: true, lmr: true };
const PLAIN: Cfg = { ...BASE, lmrPlain: true };
const off = (c: Cfg): Cfg => ({ ...c, table: false });
const isMate = (s: number): boolean => Math.abs(s) > MATE_SCORE - 1000;
const out = (o: unknown): void => console.log(JSON.stringify(o));

const [mode, arg] = process.argv.slice(2);

if (mode === "faithful") {
  let bad = 0;
  for (const [name, fen] of [...ROOTS, ...ENDGAMES]) {
    for (let d = 1; d <= 4; d++) {
      const a = search(parseFen(fen), d);
      const b = fixed(parseFen(fen), d, BASE);
      const c = searchWithoutTable(parseFen(fen), d);
      const e = fixed(parseFen(fen), d, off(BASE));
      const ok = a.score === b.score && a.nodes === b.nodes && lbl(a.move) === lbl(b.move) &&
        c.score === e.score && c.nodes === e.nodes;
      if (!ok) bad++;
      out({ name, d, search: [a.score, a.nodes, lbl(a.move)], probe: [b.score, b.nodes, lbl(b.move)], tableOff: [c.nodes, e.nodes], ok });
    }
  }
  out({ summary: "faithful", mismatches: bad });
} else if (mode === "identity" || mode === "lmr" || mode === "lmrplain") {
  const d = Number(arg);
  const corpus = broad();
  const t0 = performance.now();
  if (mode === "identity") {
    let a1 = 0, t1 = 0, id = 0, idMove = 0, nodesPvs = 0, nodesBase = 0;
    for (const [name, fen] of corpus) {
      const ref = search(parseFen(fen), d);
      const p = fixed(parseFen(fen), d, PVS);
      const pOff = fixed(parseFen(fen), d, off(PVS));
      const refOff = searchWithoutTable(parseFen(fen), d);
      const deep = deepen(parseFen(fen), PVS, d);
      nodesPvs += p.nodes; nodesBase += ref.nodes;
      if (p.score !== ref.score) { a1++; out({ diverge: "pvs-vs-search", name, ref: ref.score, pvs: p.score }); }
      if (pOff.score !== refOff.score || pOff.score !== p.score) { t1++; out({ diverge: "pvs-table-on-vs-off", name, on: p.score, off: pOff.score, refOff: refOff.score }); }
      if (deep.score !== p.score) { id++; out({ diverge: "pvs-deepen-vs-fixed", name, deepen: deep.score, fixed: p.score }); }
      if (lbl(deep.move) !== lbl(p.move)) idMove++;
    }
    out({ summary: "identity", depth: d, positions: corpus.length, pvsVsSearch: a1, pvsTableOnVsOff: t1, pvsDeepenVsFixed: id, moveDiffersDeepenVsFixed: idMove, nodesPvsOverBase: +(nodesPvs / nodesBase).toFixed(4), ms: Math.round(performance.now() - t0) });
  } else {
    const on = mode === "lmr" ? LMR : PLAIN;
    const base = mode === "lmr" ? PVS : BASE;
    const deltas: number[] = [];
    let flips = 0, moveDiff = 0, tableDiv = 0, deepDiv = 0, nOn = 0, nBase = 0, reductions = 0, reSearch = 0;
    const worst: Array<[number, string, number, number]> = [];
    for (const [name, fen] of corpus) {
      const b = fixed(parseFen(fen), d, base);
      const l = fixed(parseFen(fen), d, on);
      nOn += l.nodes; nBase += b.nodes; reductions += l.stats.reductions; reSearch += l.stats.lmrReSearches;
      if (isMate(b.score) !== isMate(l.score) || (isMate(b.score) && Math.sign(b.score) !== Math.sign(l.score))) {
        flips++; out({ mateFlip: name, base: b.score, lmr: l.score });
      }
      if (!isMate(b.score) && !isMate(l.score)) {
        const dlt = Math.abs(l.score - b.score);
        deltas.push(dlt);
        worst.push([dlt, name, b.score, l.score]);
      }
      if (lbl(b.move) !== lbl(l.move)) moveDiff++;
      if (mode === "lmr") {
        const lo = fixed(parseFen(fen), d, off(on));
        if (lo.score !== l.score) tableDiv++;
        const dp = deepen(parseFen(fen), on, d);
        if (dp.score !== l.score) deepDiv++;
      }
    }
    deltas.sort((x, y) => x - y);
    const pct = (q: number): number => deltas[Math.min(deltas.length - 1, Math.floor(q * deltas.length))] as number;
    const within = (cp: number): number => +(deltas.filter((x) => x <= cp).length / deltas.length).toFixed(4);
    worst.sort((x, y) => y[0] - x[0]);
    out({
      summary: mode, depth: d, positions: corpus.length, compared: deltas.length, mateFlips: flips,
      identical: +(deltas.filter((x) => x === 0).length / deltas.length).toFixed(4),
      within10: within(10), within25: within(25), within50: within(50), within100: within(100),
      p50: pct(0.5), p90: pct(0.9), p95: pct(0.95), p99: pct(0.99), max: deltas[deltas.length - 1],
      moveDiffers: moveDiff, worst5: worst.slice(0, 5),
      ...(mode === "lmr" ? { lmrTableOnVsOffDiverge: tableDiv, lmrDeepenVsFixedDiverge: deepDiv } : {}),
      nodesOnOverBase: +(nOn / nBase).toFixed(4), reductions, lmrReSearches: reSearch,
      ms: Math.round(performance.now() - t0),
    });
  }
} else if (mode === "mates") {
  // search.test.ts A3 rows and transposition.test.ts's deep mate row, re-read from the files at probe time.
  const rows: Array<[string, string, number, number]> = JSON.parse(arg as string);
  for (const [name, fen, d, want] of rows) {
    const r: Record<string, number> = {};
    for (const [k, c] of Object.entries({ base: BASE, pvs: PVS, lmr: LMR, plain: PLAIN })) {
      r[k] = fixed(parseFen(fen), d, c).score;
      r[`${k}-deepen`] = deepen(parseFen(fen), c, d).score;
    }
    out({ name, d, want, ...r, lmrKeepsIt: r.lmr === want && r["lmr-deepen"] === want });
  }
} else if (mode === "budget") {
  const ms = Number(arg);
  for (const [cname, c] of Object.entries({ base: BASE, pvs: PVS, lmrPlain: PLAIN, pvsLmr: LMR })) {
    for (const [name, fen] of ROOTS.filter(([n]) => n === "kiwipete" || n === "position-6")) {
      const r = deepen(parseFen(fen), c, 64, ms);
      out({ cfg: cname, name, budgetMs: ms, depth: r.depth, perIteration: r.perIteration, score: r.score, move: lbl(r.move) });
    }
  }
} else if (mode === "nodes-to") {
  // Clock-free: cumulative deepening nodes per iteration to depth <arg>, per config. Exact under load.
  const d = Number(arg);
  for (const [cname, c] of Object.entries({ base: BASE, pvs: PVS, lmrPlain: PLAIN, pvsLmr: LMR })) {
    for (const [name, fen] of ROOTS.filter(([n]) => n === "kiwipete" || n === "position-6")) {
      const r = deepen(parseFen(fen), c, d);
      out({ cfg: cname, name, depth: r.depth, cumulativeNodes: r.perIteration.map(([it, n]) => [it, n]), score: r.score, move: lbl(r.move) });
    }
  }
} else if (mode === "ratios") {
  // The two ratio bars, with PVS on BOTH sides (every pruned door carries PVS under the ruling).
  const f = (n: string): string => (ROOTS.find(([r]) => r === n) as [string, string])[1];
  const verify = (n: string, d: number, c: Cfg) => fixed(parseFen(f(n)), d, c);
  for (const [n, d] of [["position-6", 2], ["kiwipete", 4], ["position-6", 4]] as Array<[string, number]>) {
    const baseFull = searchWithoutTable(parseFen(f(n)), d).nodes;
    const baseNone = searchWithoutOrdering(parseFen(f(n)), d).nodes;
    const full = verify(n, d, off(PVS));
    const none = verify(n, d, { ...off(PVS), unordered: true });
    out({ bar: "ABC-080 A3 (<= 0.405 at d2, <= 0.04 at d4)", name: n, d, base: [baseFull, baseNone, +(baseFull / baseNone).toFixed(4)], pvs: [full.nodes, none.nodes, +(full.nodes / none.nodes).toFixed(4)], sameScore: full.score === none.score });
  }
  for (const [n, d] of [["position-3", 4], ["kiwipete", 5], ["position-6", 5]] as Array<[string, number]>) {
    const on0 = deepen(parseFen(f(n)), BASE, d), off0 = deepen(parseFen(f(n)), off(BASE), d);
    const on = deepen(parseFen(f(n)), PVS, d), offP = deepen(parseFen(f(n)), off(PVS), d);
    out({ bar: "ABC-081 A3 (<= 0.70, deepened)", name: n, d, base: [on0.nodes, off0.nodes, +(on0.nodes / off0.nodes).toFixed(4)], pvs: [on.nodes, offP.nodes, +(on.nodes / offP.nodes).toFixed(4)], sameScore: on.score === offP.score });
  }
} else if (mode === "work") {
  const d = Number(arg);
  for (const [name, fen] of ROOTS) {
    const row: Record<string, unknown> = { name, d };
    for (const [cname, c] of Object.entries({ base: BASE, pvs: PVS, pvsLmr: LMR })) {
      const r = fixed(parseFen(fen), d, c);
      row[cname] = [r.score, r.nodes];
    }
    const un = searchWithoutOrdering(parseFen(fen), d);
    const unPvs = fixed(parseFen(fen), d, off(PVS));
    row.orderingRatioBase = +(search(parseFen(fen), d).nodes / un.nodes).toFixed(4);
    row.tableOffPvsNodes = unPvs.nodes;
    out(row);
  }
}
