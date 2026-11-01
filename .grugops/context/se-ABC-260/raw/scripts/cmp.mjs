import { readFileSync } from "node:fs";
const root = process.argv[2];
const OLD = /\/\*[\s\S]*?\*\/|\/\/.*$/gm;
const NEW = /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\[\s\S])*`|\/\*[\s\S]*?\*\/|\/\/.*$/gm;
const strip = (s) => s.replace(NEW, (m) => (m[0] === "/" ? "" : m));
for (const f of ["engine","search","quiescence","evaluate","transposition","levels"]) {
  const src = readFileSync(`${root}/src/${f}.ts`, "utf8");
  const a = src.replace(OLD, ""), b = strip(src);
  const strs = [...src.replace(OLD,"").matchAll(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\[\s\S])*`/g)].map(m=>m[0]);
  console.log(f, a === b ? "IDENTICAL" : "DIFF", "strings:", strs.length, "templates:", strs.filter(s=>s[0]==="`").length, "squote:", strs.filter(s=>s[0]==="'").length);
  if (a !== b) { const al=a.split("\n"), bl=b.split("\n"); for (let i=0;i<Math.max(al.length,bl.length);i++) if (al[i]!==bl[i]) { console.log(" first diff line", i+1, JSON.stringify(al[i]), "||", JSON.stringify(bl[i])); break; } }
}
