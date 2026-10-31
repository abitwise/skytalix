// qe-ABC-242 ORACLE: ABC-242 A1, A2, A3, A6 (no keys / empty list) read against the REAL base tree (B = 4387d4e8), not
// only the SE's test-local base() copy, plus SE-242-e (that copy equals B's real blunder) and a differential sweep.
// Out of the repository, on counting shim copies of B and H (shim.mjs). Never edits a tree.
// usage: node oracle.mjs <B> <H> <scratchDir> [steps=10,1] [sweepGames=4]
//
// Every check prints one line "CHECK <id> <PASS|FAIL> <detail>"; the last line is "ORACLE <n> checks, <f> FAIL".
//  C0  SE-242-e: B's real createLevel blunder == the SE's base() copy (run on B's modules): list, depth, nodes,
//      elapsedMs, child-search count, on all 7 fixtures, with and without keys, at each step.
//  A1  each THIRD fixture: H scores the repeat exactly 0; B scores it otherwise; H runs legal-1 child searches,
//      B runs legal; H's entries before the repeat == B's.  A1p: probe scored[0] = d8e8:0 and 4 searches.
//      A1l: on `last` the whole H list == B's but its last entry, which is 0.
//  A2  second occurrence: H == B (list, depth, nodes, elapsedMs), 5 searches, B's d8e8 != 0.
//  A3  clock 0 + the 7 keys untrimmed: H == B (list, depth, nodes, elapsedMs), 5 searches.
//  A6  no keys and [] on all 7 fixtures: H == B (list, depth, nodes, elapsedMs, searches).
//  CB  (informative, condition 2) the budgetMs handed to each child search and its depth, B and H.
//  SW  differential sweep: seeded games built to repeat; at every root, an INDEPENDENT count of each child's
//      earlier occurrences in the game's repetition keys inside its reversible window (distance <= min(child clock,
//      101)); a child with >= 2 must be 0 and unsearched at H; every other child is searched; entries before the
//      first such move == B's; with none, H == B in full; A5's pick recomputed from H's list.
import { join } from "node:path";
import { buildShim } from "./shim.mjs";

const [B, H, scratch, stepsArg = "10,1", gamesArg = "4"] = process.argv.slice(2);
const steps = stepsArg.split(",").map(Number);
const srcB = buildShim(B, join(scratch, "shim-B"));
const srcH = buildShim(H, join(scratch, "shim-H"));
const load = async (src) => ({
  levels: await import(`${src}/levels.ts`),
  engine: await import(`${src}/engine.ts`),
  history: await import(`${src}/history.ts`),
  legal: await import(`${src}/legal.ts`),
  fen: await import(`${src}/fen.ts`),
  apply: await import(`${src}/apply.ts`),
  gameend: await import(`${src}/gameend.ts`),
  zobrist: await import(`${src}/zobrist.ts`),
  position: await import(`${src}/position.ts`),
  vc: await import(`${src}/virtual-clock.ts`),
});
const mB = await load(srcB);
const mH = await load(srcH);
const label = (m) => mB.position.squareName(m.from) + mB.position.squareName(m.to) + (m.promotion ? `=${m.promotion}` : "");
const LEVEL1 = mB.levels.LEVELS[1].budgetMs;
const forced = { budgetMs: LEVEL1, blunderRate: 1 };

let n = 0, fails = 0;
const check = (id, ok, detail) => { n++; if (!ok) fails++; console.log(`CHECK ${id} ${ok ? "PASS" : "FAIL"} ${detail}`); };
const calls = () => globalThis.__qeCalls;
const listOf = (scored) => (scored ?? []).map((s) => `${label(s.move)}:${s.score}`);

/** The level under test (B or H real createLevel) at rate 1, seed 1, virtualClock(step); counts child searches. */
function runLevel(m, fen, prior, step) {
  globalThis.__qeCalls = [];
  const r = m.levels.createLevel(forced, { seed: 1, now: m.vc.virtualClock(step) })(m.fen.parseFen(fen), prior);
  return { list: listOf(r.scored), move: label(r.move), kind: r.kind, depth: r.depth, nodes: r.nodes, elapsedMs: r.elapsedMs, searches: calls().length, calls: calls().map((c) => ({ ...c })) };
}

/** The SE's test-local base() (src/levels.test.ts at 6884d61a), transcribed line for line, on B's modules. */
function seBaseCopy(m, fen, prior, step) {
  globalThis.__qeCalls = [];
  const position = m.fen.parseFen(fen);
  const now = m.vc.virtualClock(step);
  const keys = prior === undefined ? undefined : [...prior, m.gameend.repetitionKey(position, m.zobrist.zobristKey(position))];
  const start = now();
  const moves = m.legal.legalMoves(position);
  const scored = [];
  let depth = 0, nodes = 0;
  moves.forEach((move, i) => {
    const undo = m.apply.makeMove(position, move);
    try {
      const deadline = start + (forced.budgetMs * (i + 1)) / moves.length;
      const child = m.engine.chooseMove(position, { budgetMs: deadline - now(), now, ...(keys === undefined ? {} : { priorKeys: keys }) });
      if (child === null) throw new Error("fixture: a child with no legal move");
      scored.push({ move, score: -child.score });
      depth = Math.max(depth, child.depth);
      nodes += child.nodes;
    } finally {
      m.apply.unmakeMove(position, move, undo);
    }
  });
  return { list: listOf(scored), depth, nodes, elapsedMs: now() - start, searches: calls().length };
}

const gameOf = (m, fen, moves) => {
  const g = m.history.newGame(fen);
  for (const t of moves.split(" ").filter(Boolean)) {
    const mv = m.legal.legalMoves(g.position).find((x) => label(x) === t);
    if (mv === undefined) throw new Error(`fixture: ${t} not legal`);
    m.history.playMove(g, mv);
  }
  return g;
};
const priorOf = (m, g) => m.engine.trimPriorKeys(m.history.repetitionKeyHistory(g), g.position.halfmoveClock);

const THIRD = [
  ["probe", "4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b2 e8d8 b2b1 d8e8 b1b2 e8d8 b2b1", "d8e8"],
  ["last", "8/3k4/8/8/8/8/8/Q3K3 w - - 0 1", "a1a2 d7e8 a2a1 e8d7 a1a2 d7e8 a2a1", "e8d7"],
  ["white losing", "q3k3/8/8/8/8/8/8/4K3 b - - 0 1", "a8a7 e1d1 a7a8 d1e1 a8a7 e1d1 a7a8", "d1e1"],
  ["white winning", "8/8/8/4k3/8/7p/7P/6KR b - - 0 1", "e5d5 g1f1 d5e5 f1g1 e5f5 g1f1 f5e5", "f1g1"],
  ["black winning", "6kr/7p/7P/8/4K3/8/8/8 w - - 0 1", "e4d4 g8f8 d4e4 f8g8 e4f4 g8f8 f4e4", "f8g8"],
];
// Fixture roots and their key lists, built ONCE on B's modules (keys are data; B and H share zobrist/history bytes).
const FIX = [];
for (const [name, fen, moves, repeat] of THIRD) {
  const g = gameOf(mB, fen, moves);
  FIX.push({ name, root: mB.fen.toFen(g.position), prior: priorOf(mB, g), repeat });
}
{
  const g = gameOf(mB, THIRD[0][1], "b1b2 e8d8 b2b1");
  FIX.push({ name: "A2 second", root: mB.fen.toFen(g.position), prior: priorOf(mB, g), repeat: "d8e8" });
  const g7 = gameOf(mB, THIRD[0][1], THIRD[0][2]);
  FIX.push({ name: "A3 clock0", root: "3k4/8/8/8/8/8/8/1Q2K3 b - - 0 4", prior: mB.history.repetitionKeyHistory(g7).slice(0, -1), repeat: "d8e8" });
}
console.log(`fixtures: ${FIX.map((f) => `${f.name} [${f.root}] keys=${f.prior.length}`).join(" | ")}`);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const core = (r) => ({ list: r.list, depth: r.depth, nodes: r.nodes, elapsedMs: r.elapsedMs, searches: r.searches });

for (const step of steps) {
  console.log(`\n=== step ${step} (level 1 budget ${LEVEL1} ms, rate 1, seed 1)`);
  for (const f of FIX) {
    for (const [tag, prior] of [["keys", f.prior], ["nokeys", undefined], ["empty", []]]) {
      const rb = runLevel(mB, f.root, prior, step);
      const cb = seBaseCopy(mB, f.root, prior, step);
      check(`C0[${step}] ${f.name} ${tag}`, same(core(rb), core(cb)), `real-B ${JSON.stringify(core(rb))}${same(core(rb), core(cb)) ? "" : ` copy ${JSON.stringify(core(cb))}`}`);
      const rh = runLevel(mH, f.root, prior, step);
      console.log(`  ${f.name} ${tag}: B ${rb.move} ${rb.kind} [${rb.list.join(" ")}] s${rb.searches} d${rb.depth} n${rb.nodes} t${rb.elapsedMs}`);
      console.log(`  ${f.name} ${tag}: H ${rh.move} ${rh.kind} [${rh.list.join(" ")}] s${rh.searches} d${rh.depth} n${rh.nodes} t${rh.elapsedMs}`);
      if (tag === "keys") {
        console.log(`  CB[${step}] ${f.name} child budgets B ${rb.calls.map((c) => `${c.budgetMs}ms/d${c.depth}`).join(",")} | H ${rh.calls.map((c) => `${c.budgetMs}ms/d${c.depth}`).join(",")}`);
      }
      if (tag !== "keys") {
        check(`A6[${step}] ${f.name} ${tag}`, same(core(rb), core(rh)), `H == B (list, depth, nodes, elapsedMs, searches)`);
        continue;
      }
      const at = rb.list.findIndex((e) => e.startsWith(`${f.repeat}:`));
      const legal = rb.list.length;
      if (f.name === "A2 second" || f.name === "A3 clock0") {
        check(`${f.name.slice(0, 2)}[${step}] ${f.name}`, same(core(rb), core(rh)) && rh.searches === legal && rb.list[at] !== `${f.repeat}:0`,
          `H == B in full, ${rh.searches}/${legal} searches, B ${rb.list[at]}`);
        continue;
      }
      const ok = rh.list[at] === `${f.repeat}:0` && rb.list[at] !== `${f.repeat}:0` && rh.searches === legal - 1 && rb.searches === legal && same(rh.list.slice(0, at), rb.list.slice(0, at));
      check(`A1[${step}] ${f.name}`, ok, `H ${rh.list[at]} B ${rb.list[at]} searches H ${rh.searches} B ${rb.searches} of ${legal}; prefix(${at}) equal ${same(rh.list.slice(0, at), rb.list.slice(0, at))}`);
      if (f.name === "probe") check(`A1p[${step}]`, rh.list[0] === "d8e8:0" && rh.searches === 4 && rh.move !== "d8e8", `scored[0] ${rh.list[0]}, ${rh.searches} searches, plays ${rh.move}`);
      if (f.name === "last") check(`A1l[${step}]`, at === legal - 1 && same(rh.list, [...rb.list.slice(0, -1), `${f.repeat}:0`]), `last-in-order at ${at}/${legal - 1}; H == B but its last 0`);
    }
  }
}

// ---- SW: the differential sweep (step 10, the lane form; H vs B real; independent occurrence count) ----
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const STARTS = [
  ["KQvK w", "4k3/8/8/8/8/8/8/1Q2K3 w - - 0 1"],
  ["KQvK b", "q3k3/8/8/8/8/8/8/4K3 b - - 0 1"],
  ["KRPvKP w", "8/8/8/4k3/8/7p/7P/6KR w - - 0 1"],
  ["KRPvKP b", "6kr/7p/7P/8/4K3/8/8/8 b - - 0 1"],
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["KQvK clock 90", "4k3/8/8/8/8/8/8/1Q2K3 w - - 90 60"],
];
const PLIES = 48;
const sw = { roots: 0, rootsWithThird: 0, thirdMoves: 0, secondMoves: 0, identical: 0, maxClock: 0 };
for (const [sname, sfen] of STARTS) {
  for (let gi = 0; gi < Number(gamesArg); gi++) {
    const rnd = mulberry32(1000 * gi + sname.length * 7 + 1);
    const g = mB.history.newGame(sfen);
    for (let ply = 0; ply < PLIES; ply++) {
      const pos = g.position;
      const moves = mB.legal.legalMoves(pos);
      if (moves.length === 0) break;
      if (mB.gameend.gameStatus(pos).result !== "in-progress") break;
      const G = mB.history.repetitionKeyHistory(g); // every position, the root last
      const prior = priorOf(mB, g);
      // Independent expectation per legal move, in legalMoves order.
      const expect = moves.map((mv) => {
        const undo = mB.apply.makeMove(pos, mv);
        const c = pos.halfmoveClock;
        const k = mB.gameend.repetitionKey(pos, mB.zobrist.zobristKey(pos));
        mB.apply.unmakeMove(pos, mv, undo);
        let occ = 0;
        for (let j = 0; j < G.length; j++) { const d = G.length - j; if (d <= Math.min(c, 101) && G[j] === k) occ++; }
        return { mv: label(mv), occ, third: occ >= 2 };
      });
      const fen = mB.fen.toFen(pos);
      sw.maxClock = Math.max(sw.maxClock, pos.halfmoveClock);
      const rb = runLevel(mB, fen, prior, 10);
      const rh = runLevel(mH, fen, prior, 10);
      sw.roots++;
      const thirdIdx = expect.map((e, i) => (e.third ? i : -1)).filter((i) => i >= 0);
      sw.thirdMoves += thirdIdx.length;
      sw.secondMoves += expect.filter((e) => e.occ === 1).length;
      if (thirdIdx.length === 0) {
        const ok = same(core(rb), core(rh));
        if (ok) sw.identical++;
        if (!ok) check(`SW ${sname}#${gi} ply ${ply}`, false, `no third move but H != B: B [${rb.list.join(" ")}] H [${rh.list.join(" ")}]`);
      } else {
        sw.rootsWithThird++;
        const first = thirdIdx[0];
        const zeros = thirdIdx.every((i) => rh.list[i] === `${expect[i].mv}:0`);
        const searched = rh.searches === moves.length - thirdIdx.length;
        const prefix = same(rh.list.slice(0, first), rb.list.slice(0, first));
        check(`SW ${sname}#${gi} ply ${ply} [${fen}]`, zeros && searched && prefix,
          `third=${thirdIdx.map((i) => `${expect[i].mv}(occ ${expect[i].occ})`).join(",")} H [${rh.list.join(" ")}] B [${rb.list.join(" ")}] searches ${rh.searches}/${moves.length}`);
      }
      // A5: the pick on H's list is the strict second-best, ties to the first (ADR-0032 d2), recomputed here.
      const sc = rh.list.map((e) => Number(e.split(":")[1]));
      const best = Math.max(...sc), worst = Math.min(...sc);
      let pick = -1;
      sc.forEach((s, i) => { if (s < best && s > worst && (pick < 0 || s > sc[pick])) pick = i; });
      const want = pick >= 0 ? rh.list[pick].split(":")[0] : rh.list[sc.indexOf(best)].split(":")[0];
      if (want !== rh.move || (pick >= 0 ? "blunder" : "no-candidate") !== rh.kind) check(`SW-A5 ${sname}#${gi} ply ${ply}`, false, `played ${rh.move} ${rh.kind}, recomputed ${want}`);
      // Next move: prefer one that returns to an earlier position (to build repetitions), else random, rarely a capture.
      const back = expect.filter((e) => e.occ >= 1);
      let choice;
      if (back.length > 0 && rnd() < 0.85) choice = back[Math.floor(rnd() * back.length)].mv;
      else {
        const quiet = moves.filter((mv) => mv.captured === 0);
        const pool = quiet.length > 0 && rnd() < 0.9 ? quiet : moves;
        choice = label(pool[Math.floor(rnd() * pool.length)]);
      }
      mB.history.playMove(g, moves.find((mv) => label(mv) === choice));
    }
  }
}
check("SW summary", sw.rootsWithThird > 0 && sw.secondMoves > 0, JSON.stringify(sw));
console.log(`ORACLE ${n} checks, ${fails} FAIL`);
