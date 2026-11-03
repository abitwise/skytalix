// SCRATCH PROBE (arch-ABC-270). Runs on the patched scratch tree (patch_k3.py), copied to its root. Adapted from
// arch-E1's e1probe.ts (modes nodes / mate / zug / g1 / reach / drift / fut unchanged in logic; forms replaced).
// Forms: BASE (main), X (exposure endgame halves 0), Q (queen-on pairs = 2 x base, halves equal), QX (both: the
// candidate). Deterministic counts only; no timing is read. Usage: node k3probe.ts <mode> <FORM>
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove, chooseMoveWithoutFutility } from "./src/engine.ts";
import { evaluate, exposurePackedForProbe, setK3Form } from "./src/evaluate.ts";
import { buildCorpus, clonePosition, mirrorPosition } from "./src/evaluate.mirror-corpus.ts";
import {
  TAPER_KP_ENDINGS,
  TAPER_KP_SHELTER_STRESS,
  TAPER_MIRROR_POSITIONS,
} from "./src/evaluate.taper-corpus.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { pieceType, QUEEN, squareName } from "./src/position.ts";
import { parseSan } from "./src/san.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, search, searchWithoutFutility } from "./src/search.ts";

const FORMS: Record<string, [boolean, boolean]> = {
  BASE: [false, false],
  X: [true, false],
  Q: [false, true],
  QX: [true, true],
};
const setForm = (f: string) => setK3Form(...(FORMS[f] as [boolean, boolean]));
const [mode, form] = process.argv.slice(2) as [string, string];
if (!(form in FORMS)) throw new Error(`form ${form}`);
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const choose = (fen: string, d: number) =>
  chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as {
    move: any;
    score: number;
    nodes: number;
    depth: number;
  };
const unpack = (p: number) => {
  const mg = (p << 16) >> 16;
  return { mg, eg: (p - mg) / 65536 };
};

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

if (mode === "nodes") {
  const depths = (process.env.DS ?? "7,8").split(",").map(Number);
  const rec = process.env.REC ?? "choose";
  for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
    for (const d of depths) {
      setForm(form);
      const r = rec === "search" ? search(parseFen(fenOf(name)), d) : choose(fenOf(name), d);
      console.log(JSON.stringify({ form, rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move) }));
    }
  }
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  setForm(form);
  const depths: number[] = [];
  for (const [, fen] of corpus()) {
    const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number };
    depths.push(c.depth);
  }
  console.log(JSON.stringify({ form, maxNodes, rows: depths.length, meanDepth: +(depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(3) }));
} else if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  for (const [name, fen] of corpus()) {
    setForm("BASE"); const a = choose(fen, depth);
    setForm(form); const b = choose(fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const dd = Math.abs(a.score - b.score);
    if (dd <= 25) within++;
    if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ form, depth, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 4);
  const plus = Number(process.env.PLUS ?? 1);
  let mates = 0, viol = 0, longer = 0;
  for (const fen of MATE_CORPUS) {
    setForm("BASE"); const a = search(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    setForm(form); const b = search(parseFen(fen), d + plus);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) viol++;
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ form, d, plus, corpus: MATE_CORPUS.length, mates, viol, longer }));
} else if (mode === "zug") {
  const rows = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
  ] as const;
  setForm(form);
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    const c = choose(fen, d);
    const hit = mv(c.move) === want;
    if (hit) ok++;
    console.log(JSON.stringify({ form, name, d, played: mv(c.move), want, ok: hit, nodes: c.nodes }));
  }
  console.log(JSON.stringify({ form, zugzwang: `${ok} / ${rows.length}` }));
} else if (mode === "g1") {
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  setForm(form);
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) {
    const c = chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
    const chosen = c === null ? "null" : mv(c.move);
    const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
    if (ok) solved++; else missed.push(p.name);
  }
  const newly = missed.filter((n) => !base.unsolved.includes(n));
  const newlySolved = (base.unsolved as string[]).filter((n) => !missed.includes(n));
  console.log(JSON.stringify({ form, solved, total: (PUZZLES as any[]).length, newlyMissed: newly, newlySolved }));
} else if (mode === "static") {
  setForm(form);
  // (1) the mirror, Object.is, over G3's corpus plus ABC-269's frozen mirror set
  let pairs = 0, bad = 0;
  const mirrorFens = [...buildCorpus().map(({ position }) => position), ...TAPER_MIRROR_POSITIONS.map((r) => parseFen(r.fen))];
  for (const position of mirrorFens) {
    pairs++;
    if (!Object.is(evaluate(position), evaluate(mirrorPosition(position)))) bad++;
  }
  // (2) K1 (b): the 9 frozen king-and-pawn endings, centre minus corner from the walking king's side
  const side = (fen: string, walking: "white" | "black") => {
    const p = parseFen(fen);
    const e = evaluate(p);
    return (walking === "white") === !p.blackToMove ? e : -e;
  };
  const kp = [...TAPER_KP_SHELTER_STRESS, ...TAPER_KP_ENDINGS].map((r) => ({
    id: r.id,
    v: side(r.centreFen, r.walkingKing) - side(r.cornerFen, r.walkingKing),
    main: r.mainCentreMinusCorner,
  }));
  // (3) K1 (c), implementation check: every frozen mirror/perft position holding a queen, with one colour's queens
  // removed. The king whose enemy lost its queens: its exposure halves with = 3 x without (QX, Q) or equal (BASE, X).
  const qpairs: { fen: string; king: string; withQ: { mg: number; eg: number }; without: { mg: number; eg: number }; ratioOk: boolean }[] = [];
  const queenFactor = FORMS[form]![1] ? 3 : 1;
  for (const position of mirrorFens) {
    for (const colourBlack of [false, true]) {
      const p = clonePosition(position);
      let had = false;
      for (let sq = 0; sq < 128; sq++) {
        if (sq & 0x88) continue;
        const pc = p.board[sq] as number;
        if (pc !== 0 && pieceType(pc) === QUEEN && ((pc & 8) !== 0) === colourBlack) { p.board[sq] = 0; had = true; }
      }
      if (!had) continue;
      const [ww, wb] = exposurePackedForProbe(position);
      const [xw, xb] = exposurePackedForProbe(p);
      // the queens removed were black's -> the white king's enemy queen is gone
      const withQ = unpack(colourBlack ? ww : wb), without = unpack(colourBlack ? xw : xb);
      const other = colourBlack ? [wb, xb] : [ww, xw];
      const ratioOk = withQ.mg === queenFactor * without.mg && withQ.eg === queenFactor * without.eg && other[0] === other[1];
      qpairs.push({ fen: toFen(position), king: colourBlack ? "white" : "black", withQ, without, ratioOk });
    }
  }
  const exposed = qpairs.filter((q) => q.without.mg !== 0);
  // (4) full-material shapes, form minus BASE (phase 24: the blend is the mg half exactly)
  const ev = (fen: string) => evaluate(parseFen(fen));
  const mid = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", fenOf("kiwipete"), fenOf("position-6"),
    "r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1", "r1bqk2r/pp2bppp/2n1pn2/3p4/8/2NBPN2/PP1P1PPP/R1BQK2R w KQkq - 0 1",
    "r2q1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R2Q1RK1 w - - 0 1", "r1bq1rk1/ppp2ppp/2n2n2/3pp3/1bPP4/2N1PN2/PP1B1PPP/R2QKB1R w KQ - 0 1"];
  const midHead = mid.map(ev);
  setForm("BASE");
  const midBase = mid.map(ev);
  console.log(JSON.stringify({
    form, mirrorPairs: pairs, mirrorMismatches: bad,
    k1b: kp, k1bMin: Math.min(...kp.map((r) => r.v)), k1bAtLeast20: kp.filter((r) => r.v >= 20).length,
    k1c: { pairs: qpairs.length, withExposure: exposed.length, ratioOk: qpairs.filter((q) => q.ratioOk).length, sample: exposed.slice(0, 6) },
    midDiffVsBase: midHead.map((v, i) => v - (midBase[i] as number)),
  }));
} else if (mode === "fut") {
  setForm(form);
  const opts = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
  for (const which of ["search", "choose"]) {
    let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0;
    for (const [name, fen] of corpus()) {
      const a = which === "search" ? searchWithoutFutility(parseFen(fen), 5) : (chooseMoveWithoutFutility(parseFen(fen), opts(5)) as any);
      const b = which === "search" ? search(parseFen(fen), 5) : (chooseMove(parseFen(fen), opts(5)) as any);
      if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
      if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
      n++;
      const dd = Math.abs(a.score - b.score);
      if (dd <= 25) within++;
      if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
    }
    console.log(JSON.stringify({ form, futilityDrift: which, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip }));
  }
} else if (mode === "game1") {
  // REPORT (decides nothing): EPIC-006 game 1, the positions before White's moves 4, 8, 10, 13, 17; chooseMove at
  // depth 7 and 8 on a frozen clock; the played move and score, with the static exposure of the white king.
  const pgn = readFileSync(process.env.PGN as string, "utf8").replace(/^\[.*\]$/gm, "");
  const sans = (pgn.match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, ""));
  const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const want = new Set([4, 8, 10, 13, 17]);
  setForm(form);
  for (let i = 0; i < sans.length; i++) {
    const moveNo = (i >> 1) + 1;
    if (i % 2 === 0 && want.has(moveNo)) {
      const fen = toFen(p);
      const exp = unpack(exposurePackedForProbe(p)[0]);
      const r7 = choose(fen, 7), r8 = choose(fen, 8);
      console.log(JSON.stringify({ form, moveNo, played: sans[i], fen, whiteExposure: exp, d7: { move: mv(r7.move), score: r7.score }, d8: { move: mv(r8.move), score: r8.score } }));
    }
    const r = parseSan(p, sans[i] as string);
    if (r.outcome !== "move") throw new Error(`san ${sans[i]} ${r.outcome}`);
    makeMove(p, r.move);
  }
}
if (mode === "matediag") {
  // POST HOC (addendum …3f24d8a0; decides nothing): the d5-against-d5 violations, named, with the form at d6 and d7.
  for (const fen of MATE_CORPUS) {
    setForm("BASE"); const a = search(parseFen(fen), 5);
    if (!isMate(a.score)) continue;
    setForm(form); const b = search(parseFen(fen), 5);
    if (isMate(b.score) && Math.sign(b.score) === Math.sign(a.score)) continue;
    const c6 = search(parseFen(fen), 6), c7 = search(parseFen(fen), 7);
    console.log(JSON.stringify({ form, fen, base5: { score: a.score, move: mv(a.move) }, form5: { score: b.score, move: mv(b.move) }, form6: { score: c6.score, mate: isMate(c6.score) }, form7: { score: c7.score, mate: isMate(c7.score) } }));
  }
}
