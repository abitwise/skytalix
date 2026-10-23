import { readFileSync } from "node:fs";
const [base, branch] = process.argv.slice(2).map((p) => readFileSync(p, "utf8"));
const exec = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const withoutStringText = (code) => { let kept = "", i = 0; while (i < code.length) { const c = code[i];
  if (c === '"' || c === "'") { kept += c; i++; while (i < code.length && code[i] !== c) i += code[i] === "\\" ? 2 : 1; kept += c; i++; continue; }
  if (c === "`") { kept += c; i++; while (i < code.length && code[i] !== "`") i += code[i] === "\\" ? 2 : 1; kept += c; i++; continue; }
  kept += c; i++; } return kept; };
const lineHits = (src, re, view) => { const v = view(src); const out = []; const lines = v.split("\n");
  lines.forEach((l, n) => { const m = l.match(re); if (m) out.push(`${n + 1}: ${l.trim()} [x${m.length}]`); }); return out; };
const rows = [
  ["A9 process census \\bprocess\\b", /\bprocess\b/g, exec],
  ["A9 process.\\w+ list", /process\.\w+/g, exec],
  ["ABC-044 A6 sink.write(", /sink\.write\(/g, exec],
  ["ABC-101 A8' \\bdifficulty\\b (strings blanked)", /\bdifficulty\b/g, (s) => withoutStringText(exec(s))],
];
for (const [name, re, view] of rows) {
  const b = (view(base).match(re) ?? []).length, n = (view(branch).match(re) ?? []).length;
  const bl = new Set(lineHits(base, re, view).map((x) => x.replace(/^\d+: /, "")));
  const added = lineHits(branch, re, view).filter((x) => !bl.has(x.replace(/^\d+: /, "")));
  console.log(`${name}: base ${b} -> branch ${n}; lines new or changed on branch:`); for (const a of added) console.log("   " + a);
}
