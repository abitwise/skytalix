// Condense plant logs to one evidence file: id, expect/got, cmd tail, diff, first 4 reds. usage: node condense.mjs <out.txt> <dir>...
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [out, ...dirs] = process.argv.slice(2);
let txt = "";
for (const d of dirs) {
  const order = readFileSync(join(d, "results.tsv"), "utf8").split("\n").slice(1).filter(Boolean).map((l) => l.split("\t")[0]);
  for (const id of order) {
    const log = readFileSync(join(d, `${id}.log`), "utf8");
    const head = log.split("\n## diff\n")[0].split("\n").filter((l) => /^(# |why|expect|got|exit|env|failed)/.test(l)).join("\n");
    const diff = (log.split("\n## diff\n")[1] ?? "").split("\n## reds")[0].replace(/^(---|\+\+\+) (\S+)\t.*$/gm, (_, a, p) => `${a} ${p.replace(/.*\/(P|W)-(head|old|base)\//, "")}`).replace(/^(---|\+\+\+) \/.*\/(P-|W-|base\/)(head\/|old\/)?/gm, "$1 ");
    const reds = (log.split(/\n## reds \(\d+\)\n/)[1] ?? "").split("\n## stderr tail")[0].split("\n").filter(Boolean);
    txt += `===== ${id}\n${head}\n${diff.trim()}\nreds (${reds.length}), first 4:\n${reds.slice(0, 4).map((r) => `  ${r.slice(0, 300)}`).join("\n")}\n\n`;
  }
}
writeFileSync(out, txt);
