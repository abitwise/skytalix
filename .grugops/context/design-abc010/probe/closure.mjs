// Runtime (non-type-only) import closure per production module in src/, with and without a hypothetical fen.ts -> legal.ts edge.
import { readdirSync, readFileSync } from "node:fs";
const src = process.argv[2];
const files = readdirSync(src).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
const edges = {};
for (const f of files) {
  const text = readFileSync(`${src}/${f}`, "utf8");
  const re = /^import\s+(type\s+)?([\s\S]*?)\s+from\s+"\.\/([^"]+)";/gm;
  const out = new Set();
  let m;
  while ((m = re.exec(text))) {
    if (m[1]) continue; // import type
    const names = m[2];
    // all-type named imports: { type A, type B }
    const inner = names.match(/^\{([\s\S]*)\}$/);
    // ADR-0030: under verbatimModuleSyntax an inline all-type import still EVALUATES the module, so it stays an edge.
    out.add(m[3]);
  }
  edges[f] = [...out];
}
function closure(f, e) { const seen = new Set(); const st = [...(e[f] || [])]; while (st.length) { const x = st.pop(); if (seen.has(x)) continue; seen.add(x); st.push(...(e[x] || [])); } return [...seen].sort(); }
function depth(f, e, memo = {}) { if (memo[f] !== undefined) return memo[f]; const d = 1 + Math.max(0, ...(e[f] || []).map((x) => depth(x, e, memo))); return (memo[f] = d); }
const after = JSON.parse(JSON.stringify(edges)); after["fen.ts"] = [...new Set([...after["fen.ts"], "legal.ts"])];
const importersOfFen = files.filter((f) => (edges[f] || []).includes("fen.ts"));
console.log("runtime edges fen.ts:", edges["fen.ts"], " legal.ts:", edges["legal.ts"]);
console.log("modules:", files.length, "runtime edges:", Object.values(edges).flat().length);
// cycle check after
function hasCycle(e) { const st = {}; const v = (n) => { if (st[n] === 1) return true; if (st[n] === 2) return false; st[n] = 1; for (const x of e[n] || []) if (v(x)) return true; st[n] = 2; return false; }; return files.some(v); }
console.log("cycle before:", hasCycle(edges), "after:", hasCycle(after));
console.log("max depth before:", Math.max(...files.map((f) => depth(f, edges))), "after:", Math.max(...files.map((f) => depth(f, after, {}))));
for (const f of files) { const b = closure(f, edges), a = closure(f, after); if (b.join() !== a.join()) console.log(`CLOSURE GROWS ${f}: +${a.filter((x) => !b.includes(x)).join(",")}  (before ${b.length}, after ${a.length})`); }
console.log("importers of fen.ts:", importersOfFen.join(", "));
console.log("depth fen before/after:", depth("fen.ts", edges), depth("fen.ts", after, {}));
for (const f of importersOfFen) console.log(" ", f, "depth before", depth(f, edges), "after", depth(f, after, {}));
