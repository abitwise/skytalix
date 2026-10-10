// QE ABC-129 exit probe. Usage: node exit-probe.mjs <repo> <base> <tip> <file...>
// Reads blobs via `git show`; writes nothing. Three measures per file:
//  (i)   every changed line (git diff -U0) is comment-only: regex AND TS comment ranges
//  (ii)  ts.transpileModule(removeComments) emit identical at base and tip (owner Q4 measure)
//  (iii) ts.createPrinter({removeComments}) of the TS AST identical (type-preserving; stricter)
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";

const [repo, base, tip, ...files] = process.argv.slice(2);
const require = createRequire(`${repo}/package.json`);
const ts = require("typescript");
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const h = (s) => `${createHash("sha256").update(s).digest("hex").slice(0, 16)} (${Buffer.byteLength(s)} B)`;

export const emit = (src, name) =>
  ts.transpileModule(src, {
    fileName: name,
    compilerOptions: { removeComments: true, target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
  }).outputText;

export const printed = (src, name) => {
  const sf = ts.createSourceFile(name, src, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return ts.createPrinter({ removeComments: true }).printFile(sf);
};

// Character ranges of every real comment (AST-driven, so template/string contents are never comments).
export const commentRanges = (src, name) => {
  const sf = ts.createSourceFile(name, src, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const seen = new Map();
  const add = (rs) => { for (const r of rs ?? []) seen.set(r.pos, r.end); };
  const walk = (n) => {
    add(ts.getLeadingCommentRanges(src, n.pos));
    add(ts.getTrailingCommentRanges(src, n.end));
    for (const c of n.getChildren(sf)) walk(c);
  };
  walk(sf);
  return [...seen].map(([pos, end]) => ({ pos, end }));
};

// Is every non-whitespace character on 1-based line `ln` inside a comment range?
export const lineIsComment = (src, ranges, ln) => {
  const lines = src.split("\n");
  let off = 0;
  for (let i = 0; i < ln - 1; i++) off += lines[i].length + 1;
  const text = lines[ln - 1];
  for (let k = 0; k < text.length; k++) {
    if (/\s/.test(text[k])) continue;
    const p = off + k;
    if (!ranges.some((r) => p >= r.pos && p < r.end)) return false;
  }
  return true;
};

const RX = /^[+-][\s]*(\*|\/\*\*|\*\/|\/\/)/;

// Parse `git diff -U0` hunks into [{side:'-'|'+', line, text}]
export const changed = (diff) => {
  const out = [];
  let o = 0, n = 0;
  for (const l of diff.split("\n")) {
    const m = l.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (m) { o = +m[1]; n = +m[2]; continue; }
    if (l.startsWith("+++") || l.startsWith("---")) continue;
    if (l.startsWith("-")) out.push({ side: "-", line: o++, text: l });
    else if (l.startsWith("+")) out.push({ side: "+", line: n++, text: l });
  }
  return out;
};

export const measure = (name, bsrc, tsrc, diff) => {
  const ch = changed(diff);
  const br = commentRanges(bsrc, name), tr = commentRanges(tsrc, name);
  const rx = ch.filter((c) => RX.test(c.text)).length;
  const ast = ch.filter((c) => lineIsComment(c.side === "-" ? bsrc : tsrc, c.side === "-" ? br : tr, c.line)).length;
  const eb = emit(bsrc, name), et = emit(tsrc, name);
  const pb = printed(bsrc, name), pt = printed(tsrc, name);
  return { changed: ch.length, rx, ast, emitBase: h(eb), emitSame: eb === et, emitTip: h(et), printSame: pb === pt };
};

if (files.length) {
  for (const f of files) {
    const b = git("show", `${base}:${f}`), t = git("show", `${tip}:${f}`);
    const d = git("diff", "-U0", base, tip, "--", f);
    const r = measure(f, b, t, d);
    console.log(
      `${f}\t(i) changed ${r.changed} / regex-comment ${r.rx} / AST-comment ${r.ast}\t(ii) ${r.emitBase} ${r.emitSame ? "IDENTICAL" : `DIFFERENT -> ${r.emitTip}`}\t(iii) ${r.printSame ? "IDENTICAL" : "DIFFERENT"}`,
    );
  }
}
