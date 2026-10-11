// ABC-083 A10 (pawnless, ABC-079 A3 cap rig, class F): deepest quiescence ply on candidate runaway rigs,
// full window, the test's own harness shape. Usage: node rigscan.mjs <tree-root> <label>
const [root, label] = process.argv.slice(2);
const { quiesce, QUIESCENCE_MAX_PLY } = await import(`${root}/src/quiescence.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const RIGS = [
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/4k3/8/K7 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/4k3/8/K7 b - - 0 1",
  "1q1q1q1q/Q1Q1Q1Q1/1q1q1q1q/Q1Q1Q1Q1/8/4k3/8/K7 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/8/4k3/K7 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/8/8/K3k3 w - - 0 1",
  "r1r1r1r1/1R1R1R1R/r1r1r1r1/1R1R1R1R/8/4k3/8/K7 w - - 0 1",
  "n1n1n1n1/1N1N1N1N/n1n1n1n1/1N1N1N1N/8/4k3/8/K7 w - - 0 1",
  "b1b1b1b1/1B1B1B1B/b1b1b1b1/1B1B1B1B/8/4k3/8/K7 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/K3k3 w - - 0 1",
  "8/q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/4k3/K7 w - - 0 1",
  "r1q1r1q1/1Q1R1Q1R/q1r1q1r1/1R1Q1R1Q/8/4k3/8/K7 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/r1r1r1r1/1R1R1R1R/8/K3k3 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/b1b1b1b1/1B1B1B1B/8/K3k3 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/8/8/K3k3 w - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/1Q1Q1Q1Q/8/8/K3k3 b - - 0 1",
  "q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/8/K3k3 b - - 0 1",
];
for (const fen of RIGS) {
  let p; try { p = parseFen(fen); } catch (e) { console.log(JSON.stringify({ label, fen, err: e.message.slice(0, 70) })); continue; }
  let nodes = 0, deepest = 0;
  const t = performance.now();
  const score = quiesce(p, -Infinity, Infinity, 0, (q) => { nodes++; if (q > deepest) deepest = q; });
  console.log(JSON.stringify({ label, fen, deepest, cap: QUIESCENCE_MAX_PLY, nodes, score, ms: Math.round(performance.now() - t) }));
}
