// ADR-0036 § Canonical clause (b) — the DELTA instrument (ABC-072 A3). One limb per run.
//
// Usage, from the repository root:
//   node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 1   # Node builtin import
//   node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 2   # `process.` read
//   node .grugops/context/design-ABC-072/probe/clause-b.mjs <base> <head> 3   # spawn/exec/fetch/eval/new Function call
//
// Reads git objects only (`git show <rev>:<path>`), never the working tree, so any commit pair works.
// Production files: `.ts` under `src/`, not `.test.ts`, at each revision.
//
// COUNTS occurrences in EXECUTABLE CODE, found on the TypeScript AST. Comments and string prose are
// not code, so they are never counted. Limb 1 counts imports (static, `export … from`, dynamic
// `import()`); limbs 2 and 3 count CALL SITES / READ SITES, not files and not words.
// LISTS, never counts: word hits on added lines that the AST does not count (a comment, a string,
// `RegExp.prototype.exec`, a bare `process`). A listed hit someone disputes falls under the fail-safe.
//
// (b1) fires when an occurrence of the limb sits on a `+` line of `git diff -U0 --no-renames`.
//      An import statement counts if any line of it is added; a call or read counts by its callee line.
// (b2) fires when a production file gains a RUNTIME import edge (value or bare; `import type` and
//      `export type` are not edges) to a local module whose runtime closure at <head>, the module
//      itself included, holds the limb in executable code.
// The limb FIRES if (b1) or (b2) does. Clause (b) fires if any of the three limbs fires.
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
  1: "Node builtin import (`node:` specifier)",
  2: "`process.` read",
  3: "call to spawn / exec / fetch / eval / new Function (child_process family included)",
};
const UNIT = {
  1: "import statements in code",
  2: "read sites in code",
  3: "call sites in code",
};
const WORD = { 1: /node:/, 2: /process\./, 3: /\b(?:spawn|spawnSync|exec|execSync|execFile|execFileSync|fork|fetch|eval)\b|\bnew\s+Function\b/ };
const CALLS = new Set(["spawn", "spawnSync", "exec", "execSync", "execFile", "execFileSync", "fork", "fetch", "eval"]);
const CHILD_PROCESS = new Set(["node:child_process", "child_process"]);

const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 << 20 });
const short = (rev) => git("rev-parse", "--short=8", rev).trim();
const isProduction = (f) => f.startsWith("src/") && f.endsWith(".ts") && !f.endsWith(".test.ts");
const productionFiles = (rev) =>
  git("ls-tree", "-r", "--name-only", rev, "--", "src").split("\n").filter(isProduction);

// One file at one revision → its limb occurrences (line spans) and its runtime import specifiers.
function scan(rev, file) {
  const text = git("show", `${rev}:${file}`);
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
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
    if (spec.startsWith("node:")) add(1, st);
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

  const visit = (n) => {
    if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const a = n.arguments[0];
      if (a && ts.isStringLiteralLike(a)) {
        if (a.text.startsWith("node:")) add(1, n);
        if (a.text.startsWith(".")) edges.push(a.text);
      } else unresolvable.push(`${file}:${lineOf(n.getStart(sf))} dynamic import() of a non-literal`);
    } else if (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "process") {
      add(2, n);
    } else if (ts.isCallExpression(n)) {
      const e = n.expression;
      if (ts.isIdentifier(e) && (CALLS.has(e.text) || cpAlias.has(e.text))) add(3, e);
      else if (
        ts.isPropertyAccessExpression(e) &&
        CALLS.has(e.name.text) &&
        ts.isIdentifier(e.expression) &&
        (cpNamespace.has(e.expression.text) || e.expression.text === "globalThis")
      )
        add(3, e);
    } else if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "Function") {
      add(3, n.expression);
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
function addedLines(b, h) {
  const out = new Map();
  let file = null;
  for (const line of git("diff", "-U0", "--no-renames", b, h, "--", "src").split("\n")) {
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
  return out;
}

const B = analyse(base);
const H = analyse(head);
const added = addedLines(base, head);
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
  unresolved.push(...s.unresolvable);
  const before = new Set(B.per.get(f)?.targets ?? []);
  for (const t of s.targets) {
    if (!H.per.has(t)) {
      if (!before.has(t)) unresolved.push(`${f} -> ${t} (not a production file at <head>)`);
      continue;
    }
    if (!before.has(t)) newEdges.push([f, t]);
  }
}
const b2 = [];
for (const [f, t] of newEdges) {
  const reached = [...closure(H, t)].filter((x) => holderSet.has(x));
  if (reached.length) b2.push(`${f} -> ${t}  (${holderSet.has(t) ? "holds it" : `reaches ${reached.join(", ")}`})`);
}

const rawFiles = H.files.filter((f) => WORD[limb].test(H.per.get(f).text));
const changed = [...added.keys()].filter((f) => H.per.has(f) || B.per.has(f));
const fires = b1.length > 0 || b2.length > 0;
const list = (xs) => xs.map((x) => `      ${x}`).join("\n");

console.log(`ADR-0036 clause (b), limb ${limb} of 3: ${NAME[limb]}`);
console.log(`  diff ${base}..${head} = ${short(base)}..${short(head)}; production files changed: ${changed.length}${changed.length ? `\n${list(changed)}` : ""}`);
console.log(`  COUNTS ${UNIT[limb]} (TypeScript AST; comments and strings are not code). Word hits are LISTED, never counted.`);
console.log(`  (b1) capability lines added or changed: ${b1.length}${b1.length ? `\n${list(b1)}` : ""}`);
console.log(`  (b2) new runtime import edges: ${newEdges.length}; reaching a holder of this limb at <head>: ${b2.length}${b2.length ? `\n${list(b2)}` : ""}`);
if (newEdges.length > b2.length) console.log(`       edges reaching no holder: ${newEdges.filter(([f, t]) => !b2.some((x) => x.startsWith(`${f} -> ${t} `))).map(([f, t]) => `${f} -> ${t}`).join("; ")}`);
if (unresolved.length) console.log(`       unresolved, listed (a dispute -> the fail-safe): ${unresolved.length}\n${list(unresolved)}`);
console.log(`  word hits on added lines, not counted: ${words.length}${words.length ? `\n${list(words)}` : ""}`);
console.log(`  baseline at <head>, STATE (recorded, not a trigger): ${H.files.length} production files; ${holders.length} hold this limb in code${holders.length ? ` (${holders.join(", ")})` : ""}; ${rawFiles.length} by raw word hit`);
console.log(`  limb ${limb}: ${fires ? "FIRES" : "does not fire"}`);
