// QE ABC-132 exit probe (independent of qe-ABC-129's). Usage: node exit132.mjs <repo> <base> <tip> <file...>
// Writes nothing in the repo. Temp files go to os.tmpdir().
//  (i)   every changed line (git diff -U0) is comment-only: ticket regex AND TS-scanner comment trivia
//  (ii)  ts.transpileModule removeComments emit byte-identical (repo tsconfig opts AND ESNext defaults)
//  (iii) non-trivia token stream identical (extra; catches type-only edits (ii) cannot see)
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const [repo, base, tip, ...files] = process.argv.slice(2);
const require = createRequire(`${repo}/package.json`);
const ts = require("typescript");
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const sha = (s) => createHash("sha256").update(s).digest("hex");
const tmp = mkdtempSync(join(tmpdir(), "qe132-"));
const tsconfig = JSON.parse(readFileSync(`${repo}/tsconfig.json`, "utf8")).compilerOptions;
const repoOpts = ts.convertCompilerOptionsFromJson({ ...tsconfig, noEmit: false }, repo).options;

const emit = (src, name, opts) => ts.transpileModule(src, { fileName: name, reportDiagnostics: false,
  compilerOptions: { ...opts, removeComments: true } }).outputText;
const OPTS = { repo: repoOpts, esnext: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } };

// Scanner pass: per-character mask of comment trivia, plus the non-trivia token stream.
const scan = (src) => {
  const sc = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, src);
  const inComment = new Uint8Array(src.length); const toks = [];
  const rescan = new Set([ts.SyntaxKind.SlashToken, ts.SyntaxKind.SlashEqualsToken]);
  let k; let prev = ts.SyntaxKind.Unknown; let depth = []; // template tracking via brace stack
  while ((k = sc.scan()) !== ts.SyntaxKind.EndOfFileToken) {
    if (k === ts.SyntaxKind.SingleLineCommentTrivia || k === ts.SyntaxKind.MultiLineCommentTrivia) {
      inComment.fill(1, sc.getTokenStart(), sc.getTokenEnd()); continue;
    }
    if (k === ts.SyntaxKind.WhitespaceTrivia || k === ts.SyntaxKind.NewLineTrivia) continue;
    if (rescan.has(k) && ![ts.SyntaxKind.Identifier, ts.SyntaxKind.CloseParenToken, ts.SyntaxKind.CloseBracketToken,
      ts.SyntaxKind.NumericLiteral, ts.SyntaxKind.StringLiteral].includes(prev)) k = sc.reScanSlashToken();
    if (k === ts.SyntaxKind.TemplateHead) depth.push(0);
    else if (k === ts.SyntaxKind.OpenBraceToken && depth.length) depth[depth.length - 1]++;
    else if (k === ts.SyntaxKind.CloseBraceToken && depth.length) {
      if (depth[depth.length - 1] === 0) { k = sc.reScanTemplateToken(false); if (k === ts.SyntaxKind.TemplateTail) depth.pop(); }
      else depth[depth.length - 1]--;
    }
    toks.push(`${k}:${sc.getTokenText()}`); prev = k;
  }
  return { inComment, toks: toks.join("\u0000") };
};
const lineIsComment = (src, mask, ln) => {
  const lines = src.split("\n"); let off = 0;
  for (let i = 0; i < ln - 1; i++) off += lines[i].length + 1;
  const t = lines[ln - 1];
  for (let c = 0; c < t.length; c++) if (!/\s/.test(t[c]) && !mask[off + c]) return false;
  return true;
};
// Header lines are recognised only OUTSIDE a hunk (inHunk resets on "diff "), so an added `++i;`
// (diff text `+++i;`) or removed `--i;` (`---i;`) is counted as a changed line, not skipped.
const hunks = (diff) => { const out = []; let o = 0, n = 0, inHunk = false;
  for (const l of diff.split("\n")) { const m = l.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (m) { o = +m[1]; n = +m[2]; inHunk = true; continue; } if (l.startsWith("diff ")) { inHunk = false; continue; }
    if (!inHunk) continue;
    if (l.startsWith("-")) out.push({ s: "-", ln: o++, t: l }); else if (l.startsWith("+")) out.push({ s: "+", ln: n++, t: l }); }
  return out; };
const ticketRx = (t) => /^[+-][^+-]/.test(t) ? /^[+-]\s*(\*|\/\*\*|\*\/)/.test(t) : true; // lines the ticket's 1st grep drops count as "not printed"

export const measure = (name, b, t, diff) => {
  const ch = hunks(diff); const sb = scan(b), st = scan(t);
  const rx = ch.filter((c) => ticketRx(c.t)).length;
  const sca = ch.filter((c) => lineIsComment(c.s === "-" ? b : t, c.s === "-" ? sb.inComment : st.inComment, c.ln)).length;
  const e = Object.fromEntries(Object.entries(OPTS).map(([k, o]) => { const eb = emit(b, name, o), et = emit(t, name, o);
    return [k, { same: eb === et, base: `${sha(eb).slice(0, 16)} (${Buffer.byteLength(eb)} B)`, tip: sha(et).slice(0, 16) }]; }));
  const i = ch.length > 0 && sca === ch.length; const ii = e.repo.same && e.esnext.same;
  return { changed: ch.length, rx, sca, i, ii, emit: e, tokSame: sb.toks === st.toks, waiver: i && ii };
};
const fmt = (f, r) => `${f}\n  (i)  changed ${r.changed} / ticket-regex ${r.rx} / scanner-comment ${r.sca} -> ${r.i ? "HOLDS" : "FAILS"}\n` +
  `  (ii) emit repo-tsconfig ${r.emit.repo.base} ${r.emit.repo.same ? "IDENTICAL" : "DIFFERENT->" + r.emit.repo.tip}; esnext ${r.emit.esnext.base} ${r.emit.esnext.same ? "IDENTICAL" : "DIFFERENT->" + r.emit.esnext.tip} -> ${r.ii ? "HOLDS" : "FAILS"}\n` +
  `  (iii) token stream ${r.tokSame ? "IDENTICAL" : "DIFFERENT"}   => Q4 conjunction ${r.waiver ? "HOLDS" : "FAILS"}`;
const memDiff = (name, b, t) => { const p = join(tmp, "b.ts"), q = join(tmp, "t.ts"); writeFileSync(p, b); writeFileSync(q, t);
  return spawnSync("git", ["diff", "--no-index", "-U0", p, q], { encoding: "utf8" }).stdout; };

for (const f of files) {
  const b = git("show", `${base}:${f}`), t = git("show", `${tip}:${f}`);
  console.log("REAL " + fmt(f, measure(f, b, t, git("diff", "-U0", base, tip, "--", f))));
  // Controls, each a mutation of the TIP held in memory.
  const lines = t.split("\n");
  const firstCode = lines.findIndex((l) => /^(import|export|const|function)\b/.test(l));
  const mut = (label, fn) => { const m = fn(lines.slice()).join("\n"); console.log(`  ctl ${label}: ` + fmt("", measure(f, t, m, memDiff(f, t, m))).replace(/\n\s*/g, " | ")); };
  mut("NEG-exec (append `export const __qeNeg = 1;`)", (L) => (L.push("export const __qeNeg = 1;"), L));
  mut("NEG-type-only (append `export type __QeNeg = 1;`)", (L) => (L.push("export type __QeNeg = 1;"), L));
  mut("NEG-template-slashslash (append template whose line starts `//`)", (L) => (L.push("export const __qeT = `", "// not a comment", "`;"), L));
  mut("NEG-code-behind-comment (`/* x */ export const __qeC = 2;`)", (L) => (L.push("/* x */ export const __qeC = 2;"), L));
  mut("POS-comment-only (insert ` * QE control sentence.` in header)", (L) => (L.splice(2, 0, " * QE control sentence."), L));
  void firstCode;
}
