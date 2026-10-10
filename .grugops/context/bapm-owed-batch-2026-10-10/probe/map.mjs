// Consumer map over every production target, instrument copied from src/render-seam.test.ts at 35ad336b.
import { readdirSync, readFileSync } from "node:fs";
const dir = process.argv[2];
const bindsAValueFrom = (source, target) =>
  [...source.matchAll(new RegExp(`^import\\s+([^;"]*?)\\s*from\\s+"\\./${target.replace(".", "\\.")}";`, "gm"))].some(([, clause = ""]) => {
    if (/^type\s/.test(clause)) return false;
    const outsideBraces = clause.replace(/\{[^}]*\}/, "").replace(/,/g, "").trim();
    if (outsideBraces !== "") return true;
    return (clause.match(/\{([^}]*)\}/)?.[1] ?? "").split(",").map((s) => s.trim()).some((s) => s !== "" && !/^type\s/.test(s));
  });
const prod = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).sort();
let pairs = 0;
const multiLine = new Set();
for (const t of prod) for (const f of prod) if (f !== t) {
  const src = readFileSync(`${dir}/${f}`, "utf8");
  if (bindsAValueFrom(src, t)) pairs++;
}
for (const f of prod) { const s = readFileSync(`${dir}/${f}`, "utf8"); if (/^import\s+[^;"]*\n[^;"]*from\s+"/m.test(s)) multiLine.add(f); }
console.log({ productionModules: prod.length, consumerPairs: pairs, filesWithMultiLineImport: multiLine.size });
