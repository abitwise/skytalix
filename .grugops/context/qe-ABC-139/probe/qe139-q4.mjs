// QE ABC-139 — own Q4 harness (independent of the SE's q4-abc139.mjs and of exit132.mjs).
// usage: node qe139-q4.mjs <repo> <base> <tip> <file> <scratch-dir>
//
// Measure (a), two-sided: a changed line is COMMENT-ONLY iff every non-whitespace character on it
//   lies inside a TS comment range (getLeading/TrailingCommentRanges at every AST leaf token's
//   full start / end, JSDoc subtrees excluded so JSDoc is never mistaken for code) AND no character
//   lies inside an AST leaf token's own span [getStart, end). Removed lines are judged on base,
//   added lines on tip.
// Measure (b): ts.createPrinter({ removeComments: true }) print of base and tip is identical.
// Corroboration (c): the AST leaf-token stream (kind + text) is identical.
// Q4 = (a) AND (b). (c) is reported, never substituted.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const [repo, base, tip, file, scratch] = process.argv.slice(2);
const ts = createRequire(join(repo, "package.json"))("typescript");
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });

function analyse(text) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const comment = new Uint8Array(text.length);
  const code = new Uint8Array(text.length);
  const leaves = [];
  const isJSDoc = (n) => n.kind >= ts.SyntaxKind.FirstJSDocNode && n.kind <= ts.SyntaxKind.LastJSDocNode;
  const walk = (n) => {
    if (isJSDoc(n)) return;
    const kids = n.getChildren(sf).filter((k) => !isJSDoc(k));
    if (kids.length === 0) {
      leaves.push(n);
      const start = n.getStart(sf);
      if (n.end > start) code.fill(1, start, n.end);
      for (const r of ts.getLeadingCommentRanges(text, n.pos) ?? []) comment.fill(1, r.pos, r.end);
      for (const r of ts.getTrailingCommentRanges(text, n.end) ?? []) comment.fill(1, r.pos, r.end);
      return;
    }
    for (const k of kids) walk(k);
  };
  walk(sf);
  const lineStarts = sf.getLineStarts();
  const lineIsCommentOnly = (ln) => {
    const from = lineStarts[ln - 1];
    const to = ln < lineStarts.length ? lineStarts[ln] : text.length;
    let sawComment = false;
    for (let i = from; i < to; i++) {
      if (/\s/.test(text[i])) continue;
      if (code[i] || !comment[i]) return false;
      sawComment = true;
    }
    return sawComment;
  };
  const printed = ts.createPrinter({ removeComments: true }).printFile(sf);
  const tokens = leaves.map((l) => `${l.kind}:${l.getText(sf)}`).join("\u0000");
  return { lineIsCommentOnly, printed, tokens };
}

function changedLines(diff) {
  const out = [];
  let o = 0;
  let n = 0;
  let inHunk = false;
  for (const l of diff.split("\n")) {
    const m = l.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (m) {
      o = Number(m[1]);
      n = Number(m[2]);
      inHunk = true;
      continue;
    }
    if (!inHunk || l.startsWith("\\")) continue;
    if (l.startsWith("-")) out.push(["-", o++]);
    else if (l.startsWith("+")) out.push(["+", n++]);
  }
  return out;
}

function judge(b, t, diff) {
  const B = analyse(b);
  const T = analyse(t);
  const ch = changedLines(diff);
  const bad = ch.filter(([s, ln]) => !(s === "-" ? B : T).lineIsCommentOnly(ln));
  const a = ch.length > 0 && bad.length === 0;
  const pb = B.printed === T.printed;
  const tc = B.tokens === T.tokens;
  const minus = ch.filter((c) => c[0] === "-").length;
  return (
    `changed ${ch.length} (-${minus}/+${ch.length - minus}), not-comment-only ${bad.length}` +
    `${bad.length ? ` [${bad.map(([s, l]) => s + l).join(",")}]` : ""} -> (a) ${a ? "HOLDS" : "FAILS"}; ` +
    `(b) print ${pb ? "IDENTICAL" : "DIFFERENT"}; (c) tokens ${tc ? "IDENTICAL" : "DIFFERENT"} ` +
    `=> Q4 ${a && pb ? "HOLDS" : "FAILS"}`
  );
}

const b = git("show", `${base}:${file}`);
const t = git("show", `${tip}:${file}`);
console.log(`REAL ${base}..${tip} ${file}`);
console.log(`  ${judge(b, t, git("diff", "-U0", base, tip, "--", file))}`);

// Controls: mutate the TIP text in memory, diff tip -> mutant with git --no-index.
mkdirSync(scratch, { recursive: true });
const memDiff = (x, y) => {
  writeFileSync(join(scratch, "x.ts"), x);
  writeFileSync(join(scratch, "y.ts"), y);
  return spawnSync("git", ["diff", "--no-index", "-U0", join(scratch, "x.ts"), join(scratch, "y.ts")], {
    encoding: "utf8",
  }).stdout;
};
// Anchors are unique to ABC-035 A3's row (checked: each count is asserted 1 below).
const ASSERT = "    expect(run.renders).toBe(4);\n    for (const messages of run.messagesPerFrame)";
const SENT = "    // add one more frame per `board`, three in all.\n";
const TITLE = `it("renders exactly once per prompt cycle, plus the loop's own first frame", async () => {`;
const IFACE = "  readonly renders: number;\n";
const count = (s, needle) => s.split(needle).length - 1;
for (const [k, a] of Object.entries({ ASSERT, SENT, TITLE, IFACE })) {
  if (count(t, a) !== 1) throw new Error(`anchor ${k} count ${count(t, a)} != 1`);
}
const ctl = {
  "POS reword a line in the block": t.replace(SENT, "    // add one extra frame per `board`, three extra in all.\n"),
  "POS insert /* */ line in the block": t.replace(ASSERT, `    /* QE control: a block comment line. */\n${ASSERT}`),
  "POS insert // line in the block": t.replace(ASSERT, `    // QE control sentence.\n${ASSERT}`),
  "NEG toBe(4)->toBe(5) on A3's assertion": t.replace(ASSERT, ASSERT.replace("toBe(4)", "toBe(5)")),
  "NEG ' // x' inside the it() title string": t.replace(TITLE, TITLE.replace("first frame", "first frame // x")),
  "NEG type-only: renders: number -> number | undefined": t.replace(IFACE, "  readonly renders: number | undefined;\n"),
  "NEG-for-(a)-alone: /* ... */ comments OUT the assertion": t.replace(
    ASSERT,
    `    /*\n${ASSERT.split("\n")[0]}\n    */\n${ASSERT.split("\n")[1]}`,
  ),
  "BOUNDARY trailing // on the assertion line": t.replace(ASSERT, ASSERT.replace("toBe(4);", "toBe(4); // QE")),
};
for (const [k, v] of Object.entries(ctl)) {
  if (v === t) throw new Error(`control ${k} did not apply`);
  console.log(`ctl ${k}\n  ${judge(t, v, memDiff(t, v))}`);
}
