// Reference read of ADR-0030 decision 2 on a tree: value-binding importers of each target,
// and the count of production files holding a multi-line import statement.
import { readdirSync, readFileSync } from "node:fs";
const dir = process.argv[2];
const prod = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
const src = (f) => readFileSync(`${dir}/${f}`, "utf8");
const bindsValue = (clause) => {
  if (/^type\b/.test(clause)) return false;
  if (/\*\s*as\s+\w+/.test(clause)) return true;
  const before = clause.split("{")[0].replace(/,\s*$/, "").trim();
  if (before && !clause.startsWith("{")) return true; // default binding
  const brace = clause.match(/\{([^}]*)\}/)?.[1] ?? "";
  return brace.split(",").map((s) => s.trim()).filter(Boolean).some((s) => !/^type\b/.test(s));
};
for (const t of ["render.ts", "status-panel.ts", "history-pane.ts"]) {
  const re = new RegExp(`^import\\s+([^;]*?)\\s*from\\s+"\\./${t.replace(".", "\\.")}";`, "gm");
  const c = prod.filter((f) => f !== t && [...src(f).matchAll(re)].some(([, cl]) => bindsValue(cl)));
  console.log(t, JSON.stringify(c));
}
const multi = prod.filter((f) => /^import\s[^;]*\n[^;]*from\s+"[^"]+";/m.test(src(f)));
console.log("production files:", prod.length, "with a multi-line import:", multi.length, JSON.stringify(multi));
const trig = prod.filter((f) => /export[^;]*from "\.\/frame\.ts"|import\(\s*["'`]\.\/frame/.test(src(f)));
console.log("AR-053-COMPOSER trigger hits:", JSON.stringify(trig));
