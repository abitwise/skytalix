// QE ABC-141 owner-Q4 harness (independent of exit132.mjs). Usage: node qe141-q4.mjs <repo> <base> <tip> <file...>
// (i)  every changed line (removed lines judged at BASE, added lines at TIP) has every non-blank char
//      inside a comment range attached to the TS AST (getLeading/TrailingCommentRanges over all nodes).
// (ii) ts.transpileModule(removeComments) emit byte-identical base vs tip, repo tsconfig AND ESNext.
// Controls mutate the TIP text in memory. Temp files go to the scratchpad dir given by $QE_TMP.
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
const [repo, base, tip, ...files] = process.argv.slice(2);
const ts = createRequire(`${repo}/package.json`)("typescript");
const tmp = mkdtempSync(join(process.env.QE_TMP, "q4-"));
const show = (rev, f) => execFileSync("git", ["-C", repo, "show", `${rev}:${f}`], { encoding: "utf8" });
const h = (s) => createHash("sha256").update(s).digest("hex").slice(0, 12);
const cfg = JSON.parse(readFileSync(`${repo}/tsconfig.json`, "utf8")).compilerOptions;
const OPTS = {
  repo: ts.convertCompilerOptionsFromJson({ ...cfg, noEmit: false }, repo).options,
  esnext: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
};
const emit = (src, f, o) => ts.transpileModule(src, { fileName: f, compilerOptions: { ...o, removeComments: true } }).outputText;
function commentMask(src, f) {
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true);
  const mask = new Uint8Array(src.length);
  const add = (rs) => { for (const r of rs ?? []) mask.fill(1, r.pos, r.end); };
  const visit = (n) => { add(ts.getLeadingCommentRanges(src, n.pos)); add(ts.getTrailingCommentRanges(src, n.end)); n.getChildren(sf).forEach(visit); };
  visit(sf);
  return mask;
}
function changed(a, b) { // line numbers (1-based): removed in a, added in b
  const fa = join(tmp, "a"), fb = join(tmp, "b");
  writeFileSync(fa, a); writeFileSync(fb, b);
  const out = spawnSync("git", ["diff", "--no-index", "-U0", fa, fb], { encoding: "utf8" }).stdout;
  const rem = [], add = [];
  for (const m of out.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
    const [ra, rc, aa, ac] = [+m[1], m[2] === undefined ? 1 : +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
    for (let i = 0; i < rc; i++) rem.push(ra + i);
    for (let i = 0; i < ac; i++) add.push(aa + i);
  }
  return { rem, add };
}
function linesInComment(src, f, nums) {
  const mask = commentMask(src, f); const lines = src.split("\n"); let off = 0; const starts = [];
  for (const l of lines) { starts.push(off); off += l.length + 1; }
  return nums.filter((n) => { const s = starts[n - 1], l = lines[n - 1];
    for (let i = 0; i < l.length; i++) if (!/\s/.test(l[i]) && !mask[s + i]) return false; return true; }).length;
}
function measure(a, b, f) {
  const { rem, add } = changed(a, b);
  const okR = linesInComment(a, f, rem), okA = linesInComment(b, f, add);
  const i = rem.length + add.length > 0 && okR === rem.length && okA === add.length;
  const e = Object.fromEntries(Object.entries(OPTS).map(([k, o]) => [k, [emit(a, f, o), emit(b, f, o)]]));
  const ii = Object.values(e).every(([x, y]) => x === y);
  return { rem: `${okR}/${rem.length}`, add: `${okA}/${add.length}`, i, ii, conj: i && ii,
    emit: Object.entries(e).map(([k, [x, y]]) => `${k}:${h(x)}${x === y ? "=" : "!="}${h(y)}(${x.length}B)`).join(" ") };
}
const fmt = (r) => `(i) rem-at-base ${r.rem} add-at-tip ${r.add} ${r.i ? "HOLDS" : "FAILS"} | (ii) ${r.ii ? "IDENTICAL" : "DIFFERS"} ${r.emit} | Q4 ${r.conj ? "HOLDS" : "FAILS"}`;
for (const f of files) {
  const a = show(base, f), b = show(tip, f);
  console.log(`== ${f}\n  DIFF  ${fmt(measure(a, b, f))}`);
  const firstAdd = changed(a, b).add[0]; const L = b.split("\n");
  const ins = (at, s) => [...L.slice(0, at), s, ...L.slice(at)].join("\n");
  const firstImport = L.findIndex((l) => l.startsWith("import "));
  const ctl = {
    "POS-docblock-line": ins(firstAdd, " * QE positive control: a comment line inside the edited docblock."),
    "NEG-exec": b + "\nexport const __qeNeg = 1;\n",
    "NEG-type-only": b + "\nexport type __QeNeg = number;\n",
    "NEG-template-slashslash": b + "\nexport const __qeT = `\n// inside a template, not a comment\n`;\n",
    "NEG-code-behind-comment": b + "\n/* c */ export const __qeB = 2;\n",
    "NEG-code-commented-out": L.map((l, i) => (i === firstImport ? `// ${l}` : l)).join("\n"),
  };
  for (const [k, v] of Object.entries(ctl)) console.log(`  ${k.padEnd(24)} ${fmt(measure(a, v, f))}`);
}
