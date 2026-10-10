// Security/NFR ABC-087 probe 2 (out of tree), REAL clock:
//  (a) AR-NFR004-A discharge reading: level 3 through createLevel on the six benchmark positions x 5.
//  (b) the ceiling through the level layer: a synthetic 20 s always-blunder level on the widest positions.
//  (c) level 1's blunder path on busy middlegames (the depth-1 floor), seeds chosen so the draw fires.
import os from "node:os";
import { LEVELS, createLevel, seededRandom } from "<sec-scratch>/tree/src/levels.ts";
import { parseFen } from "<sec-scratch>/tree/src/fen.ts";
const l1 = () => os.loadavg()[0].toFixed(2);
const BENCH: [string, string][] = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const which = process.argv[2] ?? "abc";
if (which.includes("a")) {
  const rows: number[] = [];
  for (let r = 0; r < 5; r++) for (const [name, fen] of BENCH) {
    const load = l1();
    const t0 = Date.now();
    const c = createLevel(LEVELS[3], { seed: 1000 + r })(parseFen(fen));
    const wall = Date.now() - t0;
    rows.push(wall);
    console.log("a level3", r, name.padEnd(10), "kind", c?.kind, "depth", c?.depth, "elapsedMs", c?.elapsedMs, "wall", wall, "load1", load);
  }
  const over = rows.filter((w) => w > 3000);
  rows.sort((x, y) => x - y);
  console.log("a SUMMARY level 3: n", rows.length, "over 3000:", over.length, "max", rows.at(-1), "median", rows[15], "overshoot max", rows.at(-1)! - 3000, "ms =", ((rows.at(-1)! - 3000) / 30).toFixed(2), "%");
}
if (which.includes("b")) {
  const W: [string, string][] = [
    ["kiwipete", BENCH[1][1]],
    ["kiwi-child-43", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N1BQ1p/PPP1BPPP/R3K2R b KQkq - 1 1"],
    ["position-4", BENCH[3][1]],
  ];
  for (const [name, fen] of W) for (let r = 0; r < 2; r++) {
    const load = l1();
    const t0 = Date.now();
    const c = createLevel({ budgetMs: 20_000, blunderRate: 0.999999 }, { seed: 7 + r })(parseFen(fen));
    const wall = Date.now() - t0;
    console.log("b 20s-level", name.padEnd(14), "kind", c?.kind, "children", c?.scored?.length, "elapsedMs", c?.elapsedMs, "wall", wall, "over 5000:", wall - 5000, "load1", load);
  }
}
if (which.includes("c")) {
  const firing: number[] = [];
  for (let s = 1; firing.length < 3; s++) if (seededRandom(s)() < LEVELS[1].blunderRate) firing.push(s);
  const W: [string, string][] = [
    ["kiwipete", BENCH[1][1]],
    ["kiwi-child-43", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N1BQ1p/PPP1BPPP/R3K2R b KQkq - 1 1"],
    ["position-4", BENCH[3][1]],
    ["position-6", BENCH[5][1]],
    ["startpos", BENCH[0][1]],
  ];
  for (const [name, fen] of W) for (const s of firing) {
    const t0 = Date.now();
    const c = createLevel(LEVELS[1], { seed: s })(parseFen(fen));
    const wall = Date.now() - t0;
    console.log("c level1 seed", s, name.padEnd(14), "kind", c?.kind, "children", c?.scored?.length, "elapsedMs", c?.elapsedMs, "wall", wall, "x budget", (wall / 100).toFixed(2), "load1", l1());
  }
}
