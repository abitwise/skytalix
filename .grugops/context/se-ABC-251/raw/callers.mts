// se-ABC-251: which caller frames the isBlack / pieceType self samples sit under. Usage: node callers.mts <dir> <board> <runs...>
import { readFileSync } from "node:fs";
const [dir, board, ...runs] = process.argv.slice(2);
const agg = new Map<string, number>(); let total = 0;
for (const run of runs) {
  const res = JSON.parse(readFileSync(`${dir}/${board}-${run}.json`, "utf8"));
  const p = JSON.parse(readFileSync(`${dir}/${board}-${run}.cpuprofile`, "utf8"));
  const byId = new Map(p.nodes.map((n: any) => [n.id, n])); const parent = new Map<number, number>();
  for (const n of p.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
  let t = p.startTime;
  p.samples.forEach((id: number, i: number) => {
    t += p.timeDeltas[i]; if (t < res.t0us || t > res.t1us) return; total++;
    const f = (byId.get(id) as any).callFrame;
    if (f.functionName !== "isBlack" && f.functionName !== "pieceType") return;
    const pf = (byId.get(parent.get(id)!) as any).callFrame;
    const k = `${f.functionName} <- ${pf.functionName} ${(pf.url.match(/src\/[^/]+\.ts$/) ?? ["?"])[0]}:${pf.lineNumber + 1}`;
    agg.set(k, (agg.get(k) ?? 0) + 1);
  });
}
for (const [k, v] of [...agg].sort((a, b) => b[1] - a[1])) console.log(`${(100 * v / total).toFixed(2)}% ${k}`);
