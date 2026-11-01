// qe-ABC-260: old strip vs the tip's stripComments, byte-compared on the six scanned files of a tree; also counts kept literals.
import { readFileSync } from "node:fs";
const root = process.argv[2];
const oldStrip = (s) => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const LIT = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\[\s\S])*`|\/\*[\s\S]*?\*\/|\/\/.*$/gm;
const newStrip = (s) => s.replace(LIT, (t) => (t.startsWith("/") ? "" : t));
for (const f of ["engine", "search", "quiescence", "evaluate", "transposition", "levels"]) {
  const s = readFileSync(`${root}/src/${f}.ts`, "utf8");
  const lits = [...s.matchAll(LIT)].map((m) => m[0]).filter((t) => !t.startsWith("/"));
  const n = newStrip(s);
  console.log(`${f}.ts identical=${oldStrip(s) === n} literals=${lits.length} (dq ${lits.filter((t) => t[0] === '"').length}, sq ${lits.filter((t) => t[0] === "'").length}, tpl ${lits.filter((t) => t[0] === "`").length}) bprocess_hits=${(n.match(/\bprocess\b/g) ?? []).length} literal_with_comment_opener=${lits.filter((t) => /\/\/|\/\*/.test(t)).length}`);
}
