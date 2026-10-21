// ADR-0036 § Canonical clause (b) — the DELTA instrument, WIDENED LIMBS (F-072-1, 2026-10-10). One limb per run.
//
// CANONICAL from 2026-10-10 (ADR-0036 § Canonical clause (b) › "Widened limbs — 2026-10-10"). It is
// `.grugops/context/design-ABC-072/probe/clause-b.mjs` (ABC-072's record, kept unchanged) with
// Security/NFR's `secnfr-ABC-072/probe/limb-ruling.patch` applied, plus the Architect's deltas marked
// `F-072-1` below. Old readings stay reproducible from the old path.
// ABC-163 (2026-10-21) folds ADR-0036 § S1 Ruling 2 in place, marked `ABC-163` below. Readings taken before
// it stay reproducible from this file at `341da4c1` (`git show 341da4c1:<this path>`).
// ABC-188 (2026-10-21) widens Ruling 2 to `+` and `-` lines, marked `ABC-188` below. Readings taken before it stay
// reproducible from this file at `87d3897d`.
//
// Usage, from the repository root:
//   node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 1   # non-local import
//   node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 2   # reference to the global `process`
//   node .grugops/context/design-F-072-1/probe/clause-b.mjs <base> <head> 3   # spawn/exec/fetch/eval/Function/WebSocket call
//
// Reads git objects only (`git show <rev>:<path>`), never the working tree, so any commit pair works.
// Production files: every JS/TS source under `src/` (`.ts .mts .cts .js .mjs .cjs`) that is not a test
// (`.test.<ext>`) and not a declaration file (`.d.ts .d.mts .d.cts`), at each revision.
//
// COUNTS occurrences in EXECUTABLE CODE, found on the TypeScript AST. Comments and string prose are
// not code, so they are never counted.
//   Limb 1: an import whose specifier is not local (does not start with `.`): a builtin with or without
//           `node:`, or a package. Static, `export … from`, literal `import()`, and literal `require()`
//           (F-072-1: the import form of the `.cjs`/`.cts` files the ruling made production, and of
//           `createRequire` in ESM). `import type` / `export type` are not imports at runtime.
//   Limb 2: any value reference to the global `process` (member read, element access, destructuring,
//           aliasing, shorthand) and `globalThis.process`. Declarations, property names and type
//           positions named `process` are not references.
//   Limb 3: a call to spawn / spawnSync / exec / execSync / execFile / execFileSync / fork / fetch / eval /
//           Function, with or without `new` / `new WebSocket`, bare or via `globalThis.` (F-072-1: `new
//           globalThis.X` too), or via a `child_process` binding (ESM import, or F-072-1: a `require()` /
//           `await import()` of it bound to a name). The WHOLE CALL SPAN counts, arguments included.
// LISTS, never counts: word hits on added lines that the AST does not count (a comment, a string,
// `RegExp.prototype.exec`, computed forms such as `(0, eval)(…)` or `globalThis["eval"]`). A listed hit
// someone disputes falls under the fail-safe (`AR-072-WORDHIT`).
//
// (b1) fires when an occurrence of the limb has any line on a `+` line of `git diff -U0 --no-renames`.
//      ABC-163, Ruling 2 (ADR-0036 § S1), limb 1 only: (b1) also fires on any changed line, `+` or `-` (ABC-188),
//      comments included, in a production file that holds limb 1 in code at <base> or at <head>. A holder
//      deleted or renamed away at <head> counts: all its lines are `-`. With no holder at either end it adds
//      nothing. It reads the same diff as above and never runs a pathspec diff, so an empty holder set
//      cannot widen to every changed file.
// (b2) fires when a production file gains a RUNTIME import edge (value or bare; `import type` and
//      `export type` are not edges) to a local module whose runtime closure at <head>, the module
//      itself included, holds the limb in executable code.
// UNRESOLVED (a non-literal `import()`/`require()` in a file the diff touches, or a new edge to a local
//      path that is not a production file at <head>) is a dispute: the limb FIRES (disputed).
// The limb FIRES if (b1), (b2) or an unresolved item does. Clause (b) fires if any of the three limbs fires.
import { execFileSync } from "node:child_process";
import path from "node:path";
import ts from "typescript";

const [base, head, limbArg] = process.argv.slice(2);
const limb = Number(limbArg);
if (!base || !head || ![1, 2, 3].includes(limb)) {
  console.error("usage: node clause-b.mjs <base> <head> <1|2|3>");
  process.exit(2);
}

const NAME = {
  1: "non-local import (Node builtin, prefixed or not, or a package)",
  2: "reference to the global `process`",
  3: "call to spawn / exec / fetch / eval / Function / WebSocket (child_process family included)",
};
const UNIT = {
  1: "import statements in code",
  2: "read sites in code",
  3: "call sites in code",
};
const WORD = { 1: /node:|from\s*["'][^."'\/]|import\(\s*["'`][^."'`\/]/, 2: /\bprocess\b/, 3: /\b(?:spawn|spawnSync|exec|execSync|execFile|execFileSync|fork|fetch|eval|WebSocket)\b|\bFunction\s*\(/ };
const CALLS = new Set(["spawn", "spawnSync", "exec", "execSync", "execFile", "execFileSync", "fork", "fetch", "eval", "Function", "WebSocket"]);
const CHILD_PROCESS = new Set(["node:child_process", "child_process"]);

const git = (...args) => execFileSync("git", ["-c", "core.quotePath=false", ...args], { encoding: "utf8", maxBuffer: 256 << 20 });
const short = (rev) => git("rev-parse", "--short=8", rev).trim();
const isProduction = (f) => f.startsWith("src/") && /\.[mc]?[jt]s$/.test(f) && !/\.test\.[mc]?[jt]s$/.test(f) && !/\.d\.[mc]?ts$/.test(f);
const productionFiles = (rev) =>
  git("ls-tree", "-r", "--name-only", rev, "--", "src").split("\n").filter(isProduction);

// One file at one revision → its limb occurrences (line spans) and its runtime import specifiers.
function scan(rev, file) {
  const text = git("show", `${rev}:${file}`);
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, /\.[mc]?js$/.test(file) ? ts.ScriptKind.JS : ts.ScriptKind.TS);
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  const occ = { 1: [], 2: [], 3: [] };
  const add = (l, node) => occ[l].push({ first: lineOf(node.getStart(sf)), last: lineOf(node.getEnd()) });
  const edges = [];
  const unresolvable = [];
  const cpNamespace = new Set();
  const cpAlias = new Set();

  for (const st of sf.statements) {
    const isImport = ts.isImportDeclaration(st);
    if (!(isImport || ts.isExportDeclaration(st))) continue;
    if (!st.moduleSpecifier || !ts.isStringLiteral(st.moduleSpecifier)) continue;
    const spec = st.moduleSpecifier.text;
    const typeOnly = isImport ? Boolean(st.importClause?.isTypeOnly) : st.isTypeOnly;
    if (!spec.startsWith(".") && !typeOnly) add(1, st);
    if (spec.startsWith(".") && !typeOnly) edges.push(spec);
    if (isImport && CHILD_PROCESS.has(spec) && st.importClause && !typeOnly) {
      const c = st.importClause;
      if (c.name) cpNamespace.add(c.name.text);
      const nb = c.namedBindings;
      if (nb && ts.isNamespaceImport(nb)) cpNamespace.add(nb.name.text);
      if (nb && ts.isNamedImports(nb)) {
        for (const el of nb.elements) if (CALLS.has((el.propertyName ?? el.name).text)) cpAlias.add(el.name.text);
      }
    }
  }

  const inType = (n) => { for (let p = n.parent; p; p = p.parent) if (ts.isTypeNode(p)) return true; return false; };
  const isProcessRef = (n) => {
    if (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "globalThis" && n.name.text === "process") return true;
    if (!ts.isIdentifier(n) || n.text !== "process" || inType(n)) return false;
    const p = n.parent;
    if (ts.isPropertyAccessExpression(p) && p.name === n) return false;
    if ((ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p) || ts.isMethodDeclaration(p) || ts.isBindingElement(p)) && p.name === n) return false;
    if (ts.isBindingElement(p) && p.propertyName === n) return false;
    if ((ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isFunctionDeclaration(p)) && p.name === n) return false;
    if (ts.isImportSpecifier(p) || ts.isExportSpecifier(p) || ts.isImportClause(p) || ts.isNamespaceImport(p)) return false;
    return true;
  };
  // F-072-1: `import(…)` and `require(…)` are one form here — a module load by specifier.
  const loadCall = (n) => {
    if (!ts.isCallExpression(n)) return null;
    if (n.expression.kind === ts.SyntaxKind.ImportKeyword) return "import()";
    if (ts.isIdentifier(n.expression) && n.expression.text === "require") return "require()";
    return null;
  };
  // F-072-1: `const cp = require("child_process")`, `const { spawn: s } = await import("node:child_process")`.
  // Collected before the count so a call above its binding is still seen.
  const collect = (n) => {
    if (ts.isVariableDeclaration(n) && n.initializer) {
      const init = ts.isAwaitExpression(n.initializer) ? n.initializer.expression : n.initializer;
      const a = loadCall(init) && init.arguments[0];
      if (a && ts.isStringLiteralLike(a) && CHILD_PROCESS.has(a.text)) {
        if (ts.isIdentifier(n.name)) cpNamespace.add(n.name.text);
        else if (ts.isObjectBindingPattern(n.name)) {
          for (const el of n.name.elements) {
            const key = el.propertyName ?? el.name;
            if (ts.isIdentifier(key) && ts.isIdentifier(el.name) && CALLS.has(key.text)) cpAlias.add(el.name.text);
          }
        }
      }
    }
    ts.forEachChild(n, collect);
  };
  collect(sf);
  const visit = (n) => {
    const load = loadCall(n);
    if (load) {
      const a = n.arguments[0];
      if (a && ts.isStringLiteralLike(a)) {
        if (!a.text.startsWith(".")) add(1, n);
        if (a.text.startsWith(".")) edges.push(a.text);
      } else unresolvable.push(`${file}:${lineOf(n.getStart(sf))} dynamic ${load} of a non-literal`);
    } else if (isProcessRef(n)) {
      add(2, n);
    } else if (ts.isCallExpression(n)) {
      const e = n.expression;
      if (ts.isIdentifier(e) && (CALLS.has(e.text) || cpAlias.has(e.text))) add(3, n);
      else if (
        ts.isPropertyAccessExpression(e) &&
        CALLS.has(e.name.text) &&
        ts.isIdentifier(e.expression) &&
        (cpNamespace.has(e.expression.text) || e.expression.text === "globalThis")
      )
        add(3, n);
    } else if (ts.isNewExpression(n)) {
      const e = n.expression; // F-072-1: `new globalThis.X(…)` is the same global as `new X(…)`
      const name = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === "globalThis" ? e.name.text : "";
      if (name === "Function" || name === "WebSocket") add(3, n);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);

  const targets = [];
  for (const spec of edges) {
    const t = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
    targets.push(t);
  }
  return { text, occ, targets, unresolvable };
}

function analyse(rev) {
  const files = productionFiles(rev);
  const per = new Map(files.map((f) => [f, scan(rev, f)]));
  return { files, per };
}

// Runtime closure of `start` at a revision (start included), over production files only.
function closure(an, start) {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const f = queue.shift();
    for (const t of an.per.get(f)?.targets ?? []) if (an.per.has(t) && !seen.has(t)) seen.add(t), queue.push(t);
  }
  return seen;
}

// Added line numbers per production file, from the hunk headers of a zero-context diff.
// ABC-188: and the count of deleted lines per production file at <base>, from the same headers.
function changedLines(b, h) {
  const out = new Map();
  const removed = new Map();
  let file = null;
  let old = null;
  const quoted = new Set(); // ABC-193: a path git still prints C-quoted ("…"), as git printed it, a/ or b/ dropped
  for (const line of git("diff", "-U0", "--no-renames", "--text", "--no-textconv", "--no-ext-diff", "--no-color", "--src-prefix=a/", "--dst-prefix=b/", b, h, "--", "src").split("\n")) {
    if (/^(?:---|\+\+\+) "/.test(line)) quoted.add(line.slice(4).replace(/^"[ab]\//, '"'));
    if (line.startsWith("--- ")) {
      const p = line.slice(4);
      old = p === "/dev/null" ? null : p.replace(/^a\//, "");
      if (old && !isProduction(old)) old = null;
    }
    if (old && line.startsWith("@@")) {
      const m = /^@@ -\d+(?:,(\d+))? /.exec(line);
      removed.set(old, (removed.get(old) ?? 0) + (m[1] === undefined ? 1 : Number(m[1])));
    }
    if (line.startsWith("+++ ")) {
      const p = line.slice(4);
      file = p === "/dev/null" ? null : p.replace(/^b\//, "");
      if (file && !isProduction(file)) file = null;
      if (file) out.set(file, out.get(file) ?? new Set());
    } else if (file && line.startsWith("@@")) {
      const m = /\+(\d+)(?:,(\d+))? @@/.exec(line);
      const start = Number(m[1]);
      const count = m[2] === undefined ? 1 : Number(m[2]);
      for (let i = 0; i < count; i++) out.get(file).add(start + i);
    }
  }
  return { added: out, removed, quoted };
}

const B = analyse(base);
const H = analyse(head);
const { added, removed, quoted } = changedLines(base, head);
const holders = H.files.filter((f) => H.per.get(f).occ[limb].length > 0);
const holderSet = new Set(holders);

const b1 = [];
const words = [];
for (const [file, lines] of added) {
  const s = H.per.get(file);
  if (!s) continue; // deleted at <head>
  const src = s.text.split("\n");
  const counted = new Set();
  for (const o of s.occ[limb]) {
    for (let l = o.first; l <= o.last; l++) counted.add(l);
    let hit = false;
    for (let l = o.first; l <= o.last; l++) if (lines.has(l)) hit = true;
    if (hit) b1.push(`${file}:${o.first}  ${src[o.first - 1].trim()}`);
  }
  for (const l of [...lines].sort((x, y) => x - y)) {
    if (!counted.has(l) && WORD[limb].test(src[l - 1] ?? "")) words.push(`${file}:${l}  ${src[l - 1].trim()}`);
  }
}

const newEdges = [];
const unresolved = [];
for (const f of H.files) {
  const s = H.per.get(f);
  if (added.has(f)) unresolved.push(...s.unresolvable); // scoped to the diff: a STATE listing must not decide a DELTA verdict
  const before = new Set(B.per.get(f)?.targets ?? []);
  for (const t of s.targets) {
    if (!H.per.has(t)) {
      if (!before.has(t)) unresolved.push(`${f} -> ${t} (not a production file at <head>)`);
      continue;
    }
    if (!before.has(t)) newEdges.push([f, t]);
  }
}
for (const q of quoted) unresolved.push(`${q} (C-quoted by git; not read)`); // ABC-193: a dispute, never dropped
const b2 = [];
for (const [f, t] of newEdges) {
  const reached = [...closure(H, t)].filter((x) => holderSet.has(x));
  if (reached.length) b2.push(`${f} -> ${t}  (${holderSet.has(t) ? "holds it" : `reaches ${reached.join(", ")}`})`);
}

const rawFiles = H.files.filter((f) => WORD[limb].test(H.per.get(f).text));
const changed = [...added.keys()].filter((f) => H.per.has(f) || B.per.has(f));
// ABC-163: Ruling 2 — for limb 1, the (b1) unit is the holder file, holders taken at <base> and at <head>.
const baseHolders = B.files.filter((f) => B.per.get(f).occ[limb].length > 0);
const ruling2 = [];
if (limb === 1) {
  // ABC-188: every file with a changed line, `+` or `-`; a file deleted at <head> is only in `removed`.
  for (const file of new Set([...added.keys(), ...removed.keys()])) {
    const atBase = baseHolders.includes(file);
    if (!(atBase || holderSet.has(file))) continue;
    const at = [atBase && "<base>", holderSet.has(file) && "<head>"].filter(Boolean).join(" and ");
    const plus = added.get(file)?.size ?? 0;
    const minus = removed.get(file) ?? 0;
    ruling2.push(`${file}  (fired by Ruling 2: ${plus} + line${plus === 1 ? "" : "s"}, ${minus} - line${minus === 1 ? "" : "s"}; holds limb 1 at ${at})`);
  }
}

const fires = b1.length > 0 || ruling2.length > 0 || b2.length > 0 || unresolved.length > 0;
const list = (xs) => xs.map((x) => `      ${x}`).join("\n");

console.log(`ADR-0036 clause (b), limb ${limb} of 3: ${NAME[limb]}`);
console.log(`  diff ${base}..${head} = ${short(base)}..${short(head)}; production files changed: ${changed.length}${changed.length ? `\n${list(changed)}` : ""}`);
console.log(`  COUNTS ${UNIT[limb]} (TypeScript AST; comments and strings are not code). Word hits are LISTED, never counted.`);
console.log(`  (b1) capability lines added or changed: ${b1.length}${b1.length ? `\n${list(b1)}` : ""}`);
if (limb === 1) {
  if (!baseHolders.length && !holders.length) console.log("  (b1) Ruling 2 (ADR-0036 § S1, the holder file): no limb-1 holder at <base> or <head>; adds nothing");
  else console.log(`  (b1) Ruling 2 (ADR-0036 § S1, the holder file): holders ${baseHolders.length} at <base>, ${holders.length} at <head>; holder files with changed lines (+ or -): ${ruling2.length}${ruling2.length ? `\n${list(ruling2)}` : ""}`);
}
console.log(`  (b2) new runtime import edges: ${newEdges.length}; reaching a holder of this limb at <head>: ${b2.length}${b2.length ? `\n${list(b2)}` : ""}`);
if (newEdges.length > b2.length) console.log(`       edges reaching no holder: ${newEdges.filter(([f, t]) => !b2.some((x) => x.startsWith(`${f} -> ${t} `))).map(([f, t]) => `${f} -> ${t}`).join("; ")}`);
if (unresolved.length) console.log(`       unresolved, listed (a dispute -> the fail-safe): ${unresolved.length}\n${list(unresolved)}`);
console.log(`  word hits on added lines, not counted: ${words.length}${words.length ? `\n${list(words)}` : ""}`);
console.log(`  baseline at <head>, STATE (recorded, not a trigger): ${H.files.length} production files; ${holders.length} hold this limb in code${holders.length ? ` (${holders.join(", ")})` : ""}; ${rawFiles.length} by raw word hit`);
console.log(`  limb ${limb}: ${!fires ? "does not fire" : b1.length || ruling2.length || b2.length ? "FIRES" : "FIRES (disputed: unresolved, the fail-safe)"}`);
