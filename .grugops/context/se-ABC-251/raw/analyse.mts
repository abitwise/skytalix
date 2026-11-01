// se-ABC-251: self-time shares inside the chooseMove window. Usage: node analyse.mts <dir> <board> <runs...>
import { readFileSync } from "node:fs";
const [dir, board, ...runs] = process.argv.slice(2);
const WATCH = ["isBlack", "pieceType", "deepen", "countNode"];
for (const run of runs) {
  const res = JSON.parse(readFileSync(`${dir}/${board}-${run}.json`, "utf8"));
  const p = JSON.parse(readFileSync(`${dir}/${board}-${run}.cpuprofile`, "utf8"));
  const byId = new Map(p.nodes.map((n: any) => [n.id, n]));
  const self = new Map<string, number>();
  let t = p.startTime, total = 0;
  p.samples.forEach((id: number, i: number) => {
    t += p.timeDeltas[i];
    if (t < res.t0us || t > res.t1us) return;
    total++;
    const f = (byId.get(id) as any).callFrame;
    const file = (f.url.match(/src\/[^/]+\.ts$/) ?? [f.url ? "(other)" : "(native)"])[0];
    const k = `${f.functionName || "(anon)"} ${file}:${f.lineNumber + 1}`;
    self.set(k, (self.get(k) ?? 0) + 1);
  });
  const pct = (n: number) => (100 * n / total).toFixed(2);
  const top = [...self].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${pct(v)}% ${k}`);
  const watch = WATCH.map((w) => { const n = [...self].filter(([k]) => k.startsWith(w + " ")).reduce((s, [, v]) => s + v, 0); return `${w}=${pct(n)}%`; });
  console.log(`${board} run ${run}: samples ${total}, nps ${res.nps}, depth ${res.depth}, load1 ${res.load1.toFixed(2)} | ${watch.join(" ")}`);
  for (const l of top) console.log("   " + l);
}
