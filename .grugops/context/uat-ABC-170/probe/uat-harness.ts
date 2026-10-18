// UAT ABC-170: a throwaway acceptance harness for the engine's two optional limits, `maxDepth` and
// `maxNodes`. It is an authoring aid, not a committed spec. This repository has no browser e2e lane,
// so there is no uat/*.uat.spec.ts.
//
// Usage:  node uat-harness.ts <tip tree root> <today's tree root>
//   <tip tree root>    a checkout of grugops/ABC-170 @ 36e3a753 (the engine under acceptance)
//   <today's tree root> a checkout of main's src/ (today's shipped engine; its src/engine.ts is
//                      byte-identical to the ABC-170 base 358810ac)
//
// What it exercises: the PUBLIC API of src/engine.ts only (chooseMove, createEngine), plus
// src/levels.ts createLevel, the game's own caller of chooseMove. Every call runs on a VIRTUAL
// clock (ADR-0027): a virtual millisecond is not a real one, every figure is a function of node
// counts, and the output is the same on every host. This harness takes NO wall-clock reading and
// prints no real time: ABC-170 A6 (NFR-005) is OWNER-RULED, NOT MEASURED.
//
// It writes nothing. It reads the two trees and prints PASS/FAIL lines to stdout.
// Scenarios, fixtures, budgets and seeds were fixed before the first run (see the UAT pack note).
import { isDeepStrictEqual } from "node:util";
import { pathToFileURL } from "node:url";

const [TIP, TODAY] = process.argv.slice(2);
if (!TIP || !TODAY) throw new Error("usage: uat-harness.ts <tip tree root> <today's tree root>");
const at = (root: string, rel: string) => pathToFileURL(`${root}/${rel}`).href;

// biome-ignore lint/suspicious/noExplicitAny: harness
type Any = any;
const tip: Any = await import(at(TIP, "src/engine.ts"));
const today: Any = await import(at(TODAY, "src/engine.ts"));
const tipLevels: Any = await import(at(TIP, "src/levels.ts"));
const todayLevels: Any = await import(at(TODAY, "src/levels.ts"));
const { search }: Any = await import(at(TIP, "src/search.ts"));
const { parseFen, toFen }: Any = await import(at(TIP, "src/fen.ts"));
const { legalMoves }: Any = await import(at(TIP, "src/legal.ts"));
const { squareName }: Any = await import(at(TIP, "src/position.ts"));
const { virtualClock }: Any = await import(at(TIP, "src/virtual-clock.ts"));

// --- fixtures (fixed before the first run) ------------------------------------------------------
const PERFT: ReadonlyArray<[string, string]> = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES: ReadonlyArray<[string, string]> = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const ALL = [...PERFT, ...ENDGAMES];
const fen = (name: string) => (ALL.find(([n]) => n === name) as [string, string])[1];
const CEILING = tip.HARD_CEILING_MS as number;
const INTERVAL = tip.NODES_PER_CLOCK_CHECK as number;

/** The test file's `tickingClock`: advances `step` virtual ms on every consultation. */
function ticking(step: number) {
  let t = 0;
  return () => {
    const r = t;
    t += step;
    return r;
  };
}
/** A ticking clock that counts its consultations and throws past a fuse (RF-1's shape). */
function counting(step: number, fuse: number) {
  const tick = ticking(step);
  const c = {
    reads: 0,
    now: (): number => {
      c.reads++;
      if (c.reads > fuse) throw new Error(`clock consulted ${c.reads} times: unbounded`);
      return tick();
    },
  };
  return c;
}

const PROMO = ["", "", "n", "b", "r", "q"];
const uci = (m: Any) => (m ? `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}` : "null");
const view = (c: Any) =>
  c === null ? null : { move: uci(c.move), score: c.score, depth: c.depth, nodes: c.nodes, elapsedMs: c.elapsedMs };
const show = (c: Any) => (c === null ? "null" : `d${c.depth} ${uci(c.move)} ${c.score} n=${c.nodes} t=${c.elapsedMs}v`);
const isLegal = (p: Any, m: Any) =>
  legalMoves(p).some((x: Any) => x.from === m.from && x.to === m.to && x.promotion === m.promotion && x.flags === m.flags);

/** Runs `fn` on a fresh position and also proves the position is untouched afterwards. */
function onFresh(name: string, fn: (p: Any) => Any) {
  const p = parseFen(fen(name));
  const before = structuredClone(p);
  const fenBefore = toFen(p);
  const out = fn(p);
  const unchanged = toFen(p) === fenBefore && isDeepStrictEqual(p, before);
  const legal = out && typeof out === "object" && "move" in out ? isLegal(p, out.move) : null;
  return { out, unchanged, legal };
}

// --- reporting -----------------------------------------------------------------------------------
const tally: Record<string, { pass: number; fail: number }> = {};
const lines: string[] = [];
function check(scenario: string, ok: boolean, what: string) {
  tally[scenario] ??= { pass: 0, fail: 0 };
  tally[scenario][ok ? "pass" : "fail"]++;
  lines.push(`${ok ? "ok  " : "FAIL"} ${scenario} ${what}`);
}
let calls = 0;
const tc = (p: Any, o: Any) => (calls++, tip.chooseMove(p, o));
const dc = (p: Any, o: Any) => (calls++, today.chooseMove(p, o));

// --- S1 (A3, A6 behaviour-only): no limit given = today's engine, same move ---------------------
// Every position x budgets 5 and 50 (tickingClock(1)) x three doors. Today's engine with no
// options against the tip run five ways: absent, explicit undefined, the A3 "huge" pair,
// Infinity/Infinity, and maxDepth only. All five fields must match today's, field for field.
const DOORS = ["chooseMove", "chooseMoveWithoutReductions", "chooseMoveWithoutPvsOrReductions"] as const;
for (const [name] of ALL) {
  for (const budgetMs of [5, 50]) {
    for (const door of DOORS) {
      const base = onFresh(name, (p) => (calls++, today[door](p, { budgetMs, now: ticking(1) })));
      const variants: Record<string, Any> = {
        absent: {},
        undefined: { maxDepth: undefined, maxNodes: undefined },
        huge: { maxDepth: 1000, maxNodes: Number.MAX_SAFE_INTEGER },
        infinite: { maxDepth: Number.POSITIVE_INFINITY, maxNodes: Number.POSITIVE_INFINITY },
      };
      for (const [label, extra] of Object.entries(variants)) {
        const got = onFresh(name, (p) => (calls++, tip[door](p, { budgetMs, now: ticking(1), ...extra })));
        check(
          "S1",
          isDeepStrictEqual(view(got.out), view(base.out)) && got.unchanged && base.unchanged,
          `${name} ${budgetMs}v ${door} ${label}: tip ${show(got.out)} | today ${show(base.out)}`,
        );
      }
    }
  }
}

// --- S2 (A3, A7): the game's own callers behave as before ---------------------------------------
// The five levels (createLevel, seeds 1-3, virtualClock(100)) each answer three positions in a row
// on one instance, so the blunder draws carry from move to move as in a game. The engine seam
// (createEngine) answers the same positions. Tip against today, choice for choice.
for (const level of [1, 2, 3, 4, 5] as const) {
  for (const seed of [1, 2, 3]) {
    const tipLevel = tipLevels.createLevel(tipLevels.LEVELS[level], { seed, now: virtualClock(100) });
    const todayLevel = todayLevels.createLevel(todayLevels.LEVELS[level], { seed, now: virtualClock(100) });
    for (const name of ["startpos", "kiwipete", "kp-vs-k"]) {
      calls += 2;
      const a = onFresh(name, (p) => tipLevel(p));
      const b = onFresh(name, (p) => todayLevel(p));
      const strip = (c: Any) => c && { ...c, move: uci(c.move), scored: c.scored?.map((s: Any) => [uci(s.move), s.score]) ?? null };
      check(
        "S2",
        isDeepStrictEqual(strip(a.out), strip(b.out)) && a.unchanged && a.legal === true,
        `level ${level} seed ${seed} ${name}: tip ${a.out.kind} ${uci(a.out.move)} d${a.out.depth} n=${a.out.nodes} | today ${b.out.kind} ${uci(b.out.move)} d${b.out.depth} n=${b.out.nodes}`,
      );
    }
  }
}
for (const name of ["startpos", "kiwipete", "position-4", "kp-vs-k"]) {
  calls += 2;
  const a = await tip.createEngine({ budgetMs: 20, now: ticking(1) })({ position: parseFen(fen(name)) });
  const b = await today.createEngine({ budgetMs: 20, now: ticking(1) })({ position: parseFen(fen(name)) });
  check("S2", uci(a) === uci(b), `engine seam ${name} 20v: tip ${uci(a)} | today ${uci(b)}`);
}

// --- S3 (A1): maxDepth N never reports more than N, and the move is legal ---------------------------
// A1 literally: kp-vs-k at budgetMs 10 on tickingClock(1).
{
  const free = onFresh("kp-vs-k", (p) => tc(p, { budgetMs: 10, now: ticking(1) }));
  check("S3", free.out.depth >= 6, `A1 fixture is a real stop: unlimited kp-vs-k 10v reaches ${show(free.out)} (needs d>=6)`);
  const d3 = onFresh("kp-vs-k", (p) => tc(p, { budgetMs: 10, now: ticking(1), maxDepth: 3 }));
  const ref = search(parseFen(fen("kp-vs-k")), 3);
  check(
    "S3",
    d3.out.depth === 3 && uci(d3.out.move) === uci(ref.move) && d3.out.score === ref.score && d3.legal && d3.unchanged,
    `A1 maxDepth 3: ${show(d3.out)} | search(p,3) ${uci(ref.move)} ${ref.score}`,
  );
  const d1 = onFresh("kp-vs-k", (p) => tc(p, { budgetMs: 10, now: ticking(1), maxDepth: 1 }));
  check("S3", d1.out !== null && d1.out.depth === 1 && d1.legal === true && d1.unchanged, `A1 maxDepth 1: ${show(d1.out)}, legal ${d1.legal}`);
}
// Sweep: maxDepth 1-8 on four positions at budgetMs 50. Depth must be min(N, unlimited depth),
// never above N; the move legal; the position unchanged; never more nodes than unlimited.
for (const name of ["startpos", "kiwipete", "position-3", "kp-vs-k"]) {
  const free = onFresh(name, (p) => tc(p, { budgetMs: 50, now: ticking(1) })).out;
  for (let n = 1; n <= 8; n++) {
    const r = onFresh(name, (p) => tc(p, { budgetMs: 50, now: ticking(1), maxDepth: n }));
    const want = Math.min(n, free.depth);
    check(
      "S3",
      r.out.depth === want && r.out.depth <= n && r.legal === true && r.unchanged && r.out.nodes <= free.nodes,
      `${name} 50v maxDepth ${n}: ${show(r.out)} (expect d${want}; unlimited ${show(free)})`,
    );
  }
}

// --- S4 (A2): maxNodes K stops near K, plays the last completed depth, leaves the board alone ----
{
  const LONG = CEILING; // the ceiling on a 1 ms step: the clock does not bind first
  const k = onFresh("kiwipete", (p) => tc(p, { budgetMs: LONG, now: ticking(1), maxNodes: 20_000 }));
  const oracle = onFresh("kiwipete", (p) => tc(p, { budgetMs: LONG, now: ticking(1), maxDepth: k.out.depth })).out;
  const ref = search(parseFen(fen("kiwipete")), k.out.depth);
  check(
    "S4",
    k.out.nodes >= 20_000 && k.out.nodes <= 20_000 + INTERVAL && k.out.elapsedMs < LONG && k.legal === true && k.unchanged,
    `A2 kiwipete maxNodes 20000: ${show(k.out)} (bound <= ${20_000 + INTERVAL})`,
  );
  check(
    "S4",
    uci(k.out.move) === uci(ref.move) && k.out.score === ref.score,
    `A2 discard, search(p,${k.out.depth}) reference: ${uci(ref.move)} ${ref.score}`,
  );
  check(
    "S4",
    uci(k.out.move) === uci(oracle.move) && k.out.score === oracle.score && k.out.depth === oracle.depth && k.out.nodes > oracle.nodes,
    `A2 discard, maxDepth ${k.out.depth} oracle: ${show(oracle)} (node-limited run visited more: it entered and dropped the next depth)`,
  );
  const one = onFresh("kiwipete", (p) => tc(p, { budgetMs: LONG, now: ticking(1), maxNodes: 1 }));
  check("S4", one.out !== null && one.out.depth === 1 && one.legal === true && one.unchanged, `A2 maxNodes 1: ${show(one.out)}, legal ${one.legal}`);
}
// Sweep: K in {5 000, 20 000, 60 000} on four positions. Bound: nodes <= max(K, depth-1 cost) + one
// interval. Discard: move, score and depth equal a maxDepth-d run (the exact oracle, QE-170-e).
for (const name of ["startpos", "kiwipete", "position-3", "kp-vs-k"]) {
  const d1cost = onFresh(name, (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxDepth: 1 })).out.nodes;
  for (const K of [5_000, 20_000, 60_000]) {
    const r = onFresh(name, (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxNodes: K }));
    const o = onFresh(name, (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxDepth: r.out.depth })).out;
    const bound = Math.max(K, d1cost) + INTERVAL;
    check(
      "S4",
      r.out.nodes <= bound &&
        r.legal === true &&
        r.unchanged &&
        uci(r.out.move) === uci(o.move) &&
        r.out.score === o.score &&
        r.out.depth === o.depth,
      `${name} maxNodes ${K}: ${show(r.out)} (bound <= ${bound}); maxDepth ${r.out.depth} oracle ${uci(o.move)} ${o.score}`,
    );
  }
}

// --- S5 (A5): the limits combine with the clock, whichever comes first; the ceiling still holds -
{
  // (a) the clock comes first: tiny budget, generous limits -> exactly the unlimited answer.
  for (const name of ["kp-vs-k", "startpos", "kiwipete"]) {
    const free = onFresh(name, (p) => tc(p, { budgetMs: 5, now: ticking(1) })).out;
    const both = onFresh(name, (p) => tc(p, { budgetMs: 5, now: ticking(1), maxDepth: 50, maxNodes: 1e9 })).out;
    check("S5", isDeepStrictEqual(view(both), view(free)), `clock first, ${name} 5v + maxDepth 50 + maxNodes 1e9: ${show(both)} | unlimited ${show(free)}`);
  }
  // (b) the depth comes first: kp-vs-k at 10v reaches d>=6 unlimited; maxDepth 3 returns earlier.
  {
    const free = onFresh("kp-vs-k", (p) => tc(p, { budgetMs: 10, now: ticking(1) })).out;
    const cap = onFresh("kp-vs-k", (p) => tc(p, { budgetMs: 10, now: ticking(1), maxDepth: 3 })).out;
    check("S5", cap.depth === 3 && cap.elapsedMs < free.elapsedMs && cap.nodes < free.nodes, `depth first, kp-vs-k 10v maxDepth 3: ${show(cap)} | unlimited ${show(free)}`);
  }
  // (c) the node count comes first: kiwipete at the ceiling stops long before the clock.
  {
    const r = onFresh("kiwipete", (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxNodes: 20_000 })).out;
    check("S5", r.elapsedMs < CEILING, `nodes first, kiwipete ${CEILING}v maxNodes 20000: ${show(r)} (returns before ${CEILING}v)`);
  }
  // (d) both limits given: the tighter one decides.
  {
    const depthWins = onFresh("kiwipete", (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxDepth: 2, maxNodes: 10_000_000 })).out;
    const depthOnly = onFresh("kiwipete", (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxDepth: 2 })).out;
    check("S5", isDeepStrictEqual(view(depthWins), view(depthOnly)) && depthWins.depth === 2, `both, depth tighter: maxDepth 2 + maxNodes 1e7 ${show(depthWins)} | maxDepth 2 alone ${show(depthOnly)}`);
    const nodesWin = onFresh("kiwipete", (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxDepth: 10, maxNodes: 3_000 })).out;
    const nodesOnly = onFresh("kiwipete", (p) => tc(p, { budgetMs: CEILING, now: ticking(1), maxNodes: 3_000 })).out;
    check("S5", isDeepStrictEqual(view(nodesWin), view(nodesOnly)), `both, nodes tighter: maxDepth 10 + maxNodes 3000 ${show(nodesWin)} | maxNodes 3000 alone ${show(nodesOnly)}`);
  }
  // (e) an infinite budget with a huge limit still stops at the ceiling: same clock-read count and
  // same answer as without the limit (RF-1's fused clock, 2 500 virtual ms per read, fuse 64).
  for (const extra of [{ maxDepth: 1000 }, { maxNodes: Number.MAX_SAFE_INTEGER }, { maxDepth: 1000, maxNodes: Number.MAX_SAFE_INTEGER }]) {
    const a = counting(2_500, 64);
    const b = counting(2_500, 64);
    const x = view(tc(parseFen(fen("startpos")), { budgetMs: Number.POSITIVE_INFINITY, now: a.now }));
    const y = view(tc(parseFen(fen("startpos")), { budgetMs: Number.POSITIVE_INFINITY, now: b.now, ...extra }));
    check("S5", a.reads === b.reads && isDeepStrictEqual(x, y), `ceiling, budget Infinity + ${JSON.stringify(extra)}: ${b.reads} clock reads | ${a.reads} without`);
  }
}

// --- S6 (A1, A2 through the seam): the limits pass through createEngine, the session's door ------
for (const [name, extra] of [
  ["kiwipete", { maxDepth: 2 }],
  ["kp-vs-k", { maxDepth: 3 }],
  ["kiwipete", { maxNodes: 20_000 }],
] as const) {
  calls++;
  const seamMove = await tip.createEngine({ budgetMs: CEILING, now: ticking(1), ...extra })({ position: parseFen(fen(name)) });
  const direct = tc(parseFen(fen(name)), { budgetMs: CEILING, now: ticking(1), ...extra });
  check("S6", uci(seamMove) === uci(direct.move), `seam ${name} ${JSON.stringify(extra)}: seam ${uci(seamMove)} | chooseMove ${show(direct)}`);
}

// --- report --------------------------------------------------------------------------------------
for (const line of lines) console.log(line);
console.log("");
for (const [s, { pass, fail }] of Object.entries(tally)) {
  console.log(`${s}: ${fail === 0 ? "PASS" : "FAIL"} (${pass} ok, ${fail} failed)`);
}
console.log(`engine calls: ${calls}`);
