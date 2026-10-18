import { createUciSession } from "./src/uci-session.ts";
import { virtualClock } from "./src/virtual-clock.ts";
function run(pos: string, go: string, step: number) {
  const out: string[] = []; let reads = 0; const c = virtualClock(step);
  const s = createUciSession({ write: (l) => out.push(l), now: () => { reads++; return c(); } });
  s.handleLine(pos); s.handleLine(go);
  const info = out.find((l) => /^info depth/.test(l)) ?? "";
  const t = Number(/ time (\d+)/.exec(info)?.[1]); const n = Number(/ nodes (\d+)/.exec(info)?.[1]);
  return { t, n, reads };
}
const SP = "position startpos";
// [row, pos, go, G, step, wrongs as [label, standInGo]]
const rows: [string, string, string, number, number, [string, string][]][] = [
  ["A5-b1", SP, "go wtime 2000 btime 2000 winc 1000 binc 0", 600, 100, [["100", "go movetime 100"], ["1100", "go movetime 1100"]]],
  ["A5-b2", "position startpos moves e2e4", "go wtime 2000 btime 2000 winc 1000 binc 0", 100, 100, [["600", "go movetime 600"]]],
  ["A5-b3", SP, "go wtime 1000 btime 1000 movestogo 5", 200, 10, [["50", "go movetime 50"]]],
  ["A5-b4", SP, "go wtime 1000 btime 1000 movetime 300", 300, 100, [["50", "go movetime 50"]]],
  ["A5-b5", SP, "go movetime 300 wtime 60000 btime 60000", 300, 100, [["3000", "go movetime 3000"]]],
  ["A5-c1", SP, "go wtime 100 btime 100 winc 1000 binc 1000", 50, 10, [["100", "go movetime 100"], ["5", "go movetime 5"]]],
  ["A6-d1", SP, "go ponder", 3000, 100, [["5000", "go movetime 5000"]]],
  ["A7-f1", SP, "go depth movetime 100", 100, 100, [["3000", "go"]]],
  ["A7-f2", SP, "go movetime", 3000, 100, [["1", "go movetime 1"]]],
  ["A7-f3a", SP, "go movetime 1e2", 3000, 100, [["100", "go movetime 100"]]],
  ["A7-f3b", SP, "go wtime 1000 btime 1000 movestogo 0", 50, 100, [["950", "go movetime 950"]]],
  ["A7-h1", SP, "go searchmoves e2e4 d2d4 movetime 100", 100, 100, [["3000", "go"]]],
];
for (const [row, pos, go, G, step, wrongs] of rows) {
  const r = run(pos, go, step); const hi = G + 2 * step; const ok = r.t >= G && r.t <= hi;
  const w = wrongs.map(([l, g]) => { const x = run(pos, g, step); return `${l}->${x.t} ${x.t < G || x.t > hi ? "REJECT" : "PASSES!"}`; });
  const r1 = run(pos, go, 1);
  console.log(`${row} step ${step} win ${G}..${hi} time ${r.t} ${ok ? "OK" : "OUT!"} nodes ${r.n} | step1 nodes ${r1.n} | ${w.join(", ")}`);
}
