// Feasibility read for ABC-135 sizing only (not a design): apply render-seam.test.ts:136-139's existing
// comment strip before the A8 instrument, compare the consumer map with the unstripped one, re-run QE-054-a/c rows.
import { readdirSync, readFileSync } from "node:fs";
const dir = process.argv[2];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const binds = (source, target) =>
  [...source.matchAll(new RegExp(`^import\\s+([^;"]*?)\\s*from\\s+"\\./${target.replace(".", "\\.")}";`, "gm"))].some(([, clause = ""]) => {
    if (/^type\s/.test(clause)) return false;
    const outside = clause.replace(/\{[^}]*\}/, "").replace(/,/g, "").trim();
    if (outside !== "") return true;
    return (clause.match(/\{([^}]*)\}/)?.[1] ?? "").split(",").map((s) => s.trim()).some((s) => s !== "" && !/^type\s/.test(s));
  });
const prod = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).sort();
const src = Object.fromEntries(prod.map((f) => [f, readFileSync(`${dir}/${f}`, "utf8")]));
let same = 0, diff = [], pairs = 0;
for (const t of prod) for (const f of prod) if (f !== t) {
  const a = binds(src[f], t), b = binds(strip(src[f]), t);
  if (a) pairs++;
  a === b ? same++ : diff.push(`${f}->${t} ${a}->${b}`);
}
console.log({ orderedPairs: same + diff.length, consumerPairsUnstripped: pairs, differ: diff });
const rows = [
  ['import { /* c */ type X } from "./m.ts";', false], ['import {\n  type X, // c\n} from "./m.ts";', false],
  ['import {\n  type X,\n  // f,\n} from "./m.ts";', false], ['/*\nimport { f } from "./m.ts";\n*/', false],
  ['import {\n  type X,\n  f,\n} from "./m.ts";', true], ['import type { X } from "./m.ts";\nimport { f } from "./m.ts";', true],
];
for (const [s, want] of rows) console.log(binds(strip(s), "m.ts") === want ? "ok " : "BAD", JSON.stringify(s));
