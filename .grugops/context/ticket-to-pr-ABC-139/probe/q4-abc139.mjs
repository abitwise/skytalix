// Own Q4 harness: (a) every changed line lies wholly in TS AST comment ranges; (b) comment-stripped print identical.
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const [repo, base, tip, file] = process.argv.slice(2);
const ts = createRequire(`${repo}/package.json`)("typescript");
const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const commentMask = (src) => {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const mask = new Uint8Array(src.length); const seen = new Set();
  const mark = (rs) => { for (const r of rs ?? []) { if (seen.has(r.pos)) continue; seen.add(r.pos); mask.fill(1, r.pos, r.end); } };
  const visit = (n) => { mark(ts.getLeadingCommentRanges(src, n.getFullStart())); mark(ts.getTrailingCommentRanges(src, n.getEnd())); n.getChildren(sf).forEach(visit); };
  visit(sf); return { mask, sf };
};
const lineOk = (src, mask, ln) => { const ls = src.split("\n"); let off = 0; for (let i = 0; i < ln - 1; i++) off += ls[i].length + 1;
  const t = ls[ln - 1]; for (let c = 0; c < t.length; c++) if (!/\s/.test(t[c]) && !mask[off + c]) return false; return true; };
const strip = (sf) => ts.createPrinter({ removeComments: true }).printFile(sf);
export const run = (b, t, diff) => {
  const B = commentMask(b), T = commentMask(t); let o = 0, n = 0, inH = false; const ch = [];
  for (const l of diff.split("\n")) { const m = l.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (m) { o = +m[1]; n = +m[2]; inH = true; continue; } if (!inH) continue;
    if (l.startsWith("-")) ch.push(["-", o++]); else if (l.startsWith("+")) ch.push(["+", n++]); }
  const bad = ch.filter(([s, ln]) => !(s === "-" ? lineOk(b, B.mask, ln) : lineOk(t, T.mask, ln)));
  const same = strip(B.sf) === strip(T.sf);
  return `changed ${ch.length} (-${ch.filter(c=>c[0]==="-").length}/+${ch.filter(c=>c[0]==="+").length}), non-comment ${bad.length} -> ${bad.length===0&&ch.length>0?"HOLDS":"FAILS"}; stripped print ${same?"IDENTICAL":"DIFFERENT"} => Q4 ${bad.length===0&&ch.length>0&&same?"HOLDS":"FAILS"}`;
};
const b = git("show", `${base}:${file}`), t = git("show", `${tip}:${file}`);
console.log("REAL ", run(b, t, git("diff", "-U0", base, tip, "--", file)));
// controls on the tip text, diffed in memory against tip
import { writeFileSync, mkdtempSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os"; import { spawnSync } from "node:child_process";
const d = mkdtempSync(join(tmpdir(), "q4-"));
const md = (x, y) => { writeFileSync(join(d, "x.ts"), x); writeFileSync(join(d, "y.ts"), y); return spawnSync("git", ["diff", "--no-index", "-U0", join(d,"x.ts"), join(d,"y.ts")], { encoding: "utf8" }).stdout; };
const anchor = "    expect(run.renders).toBe(4);\n";
const ctl = { "POS // line": t.replace(anchor, "    // control sentence.\n" + anchor),
  "NEG 4->5": t.replace("expect(run.renders).toBe(4);", "expect(run.renders).toBe(5);"),
  "NEG code after //": t.replace(anchor, "    // x\n    void 0;\n" + anchor) };
for (const [k, v] of Object.entries(ctl)) console.log(`ctl ${k}: `, run(t, v, md(t, v)));
