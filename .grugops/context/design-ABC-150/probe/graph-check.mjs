// ABC-150 D3 admissibility, static (no process runs, no timing). Which production modules could be
// externalized (imported natively, outside the module runner) WITHOUT blinding a mock or a namespace spy?
//   M = every src/ module a default-lane test file mocks (vi.mock / vi.doMock) or spies on through a
//       namespace import (import * as ns ...; vi.spyOn(ns, ...)).
//   A module X is SAFE to externalize only if X is not in M and nothing X imports, transitively, is in M:
//   a natively loaded module imports its dependencies natively, so a mock or spy on any of them would not
//   see X's calls.
// Usage (from the worktree root): node .grugops/context/design-ABC-150/probe/graph-check.mjs
import { readFileSync, readdirSync } from "node:fs";
const files = readdirSync("src").filter((f) => f.endsWith(".ts"));
const prod = files.filter((f) => !f.endsWith(".test.ts")).sort();
const tests = files.filter((f) => f.endsWith(".test.ts"));
const importsOf = (f) =>
  [...readFileSync(`src/${f}`, "utf8").matchAll(/^\s*(?:import|export)\s[^;]*?from\s+["']\.\/([^"']+\.ts)["']/gms)]
    .map((m) => m[1])
    .filter((x) => prod.includes(x));
const graph = Object.fromEntries(prod.map((f) => [f, [...new Set(importsOf(f))]]));
const M = new Map();
const add = (mod, why) => M.set(mod, [...(M.get(mod) ?? []), why]);
for (const t of tests) {
  const s = readFileSync(`src/${t}`, "utf8");
  for (const m of s.matchAll(/vi\.(?:mock|doMock)\(\s*["']\.\/([^"']+\.ts)["']/g)) add(m[1], `${t} mock`);
  const ns = Object.fromEntries([...s.matchAll(/^import \* as (\w+) from ["']\.\/([^"']+\.ts)["']/gm)].map((m) => [m[1], m[2]]));
  for (const m of s.matchAll(/vi\.spyOn\(\s*(\w+)\s*,/g)) if (ns[m[1]]) add(ns[m[1]], `${t} spyOn(${m[1]})`);
}
const closure = (f, seen = new Set()) => {
  for (const d of graph[f] ?? []) if (!seen.has(d)) seen.add(d), closure(d, seen);
  return seen;
};
const safe = prod.filter((f) => !M.has(f) && ![...closure(f)].some((d) => M.has(d)));
const hot = ["moves.ts", "legal.ts", "position.ts", "apply.ts", "evaluate.ts", "search.ts", "engine.ts", "perft.ts", "quiescence.ts", "transposition.ts", "zobrist.ts"];
console.log(JSON.stringify({
  productionModules: prod.length,
  mockedOrSpied: Object.fromEntries([...M].sort()),
  hotModules: Object.fromEntries(hot.map((h) => [h, M.has(h) ? "mocked/spied itself" : [...closure(h)].filter((d) => M.has(d)).length ? `imports mocked/spied: ${[...closure(h)].filter((d) => M.has(d)).join(", ")}` : "SAFE"])),
  safeToExternalize: safe,
}, null, 1));
