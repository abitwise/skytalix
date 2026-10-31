// qe-ABC-221 A8 / D8 fence (plain node + git): which files changed base..head, and in src/engine.ts and src/uci-session.ts
// which NON-COMMENT lines changed (block-comment and // lines stripped, blank lines dropped). Also byte-equality of the
// LEVELS block, DEFAULT_LEVEL and the Skill Level option line.
// usage: node a8diff.mjs <repo> <base> <head>
import { execFileSync } from "node:child_process";
const [repo, base, head] = process.argv.slice(2);
const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8" });
console.log("changed files:", git("diff", "--name-only", base, head).trim().split("\n").join(", "));
for (const f of ["src/levels.ts", "src/search.ts", "src/uci.ts", "src/cli.ts", "src/cli-options.ts", "src/startup-questions.ts", "src/pgn.ts", "src/level-seam.ts", "src/virtual-clock.ts", "package.json", "package-lock.json"])
  console.log(`${f}: ${git("rev-parse", `${base}:${f}`).trim() === git("rev-parse", `${head}:${f}`).trim() ? "byte-identical" : "CHANGED"}`);
const code = (text) => {
  const out = [];
  let inBlock = false;
  for (const raw of text.split("\n")) {
    let l = raw.trim();
    if (inBlock) { if (l.includes("*/")) { inBlock = false; l = l.slice(l.indexOf("*/") + 2).trim(); } else continue; }
    if (l.startsWith("/*")) { if (!l.includes("*/")) { inBlock = true; continue; } l = l.slice(l.indexOf("*/") + 2).trim(); }
    if (l.startsWith("//")) continue;
    l = l.replace(/\s+\/\/.*$/, "");
    if (l !== "") out.push(l);
  }
  return out;
};
for (const f of ["src/engine.ts", "src/uci-session.ts"]) {
  const b = code(git("show", `${base}:${f}`)), h = code(git("show", `${head}:${f}`));
  const bs = new Map(), hs = new Map();
  for (const l of b) bs.set(l, (bs.get(l) ?? 0) + 1);
  for (const l of h) hs.set(l, (hs.get(l) ?? 0) + 1);
  const gone = [...bs].flatMap(([l, n]) => Array(Math.max(0, n - (hs.get(l) ?? 0))).fill(l));
  const added = [...hs].flatMap(([l, n]) => Array(Math.max(0, n - (bs.get(l) ?? 0))).fill(l));
  console.log(`${f}: non-comment lines removed ${gone.length}, added ${added.length}`);
  for (const l of gone) console.log(`  - ${l}`);
  for (const l of added) console.log(`  + ${l}`);
}
const lv = (rev) => { const t = git("show", `${rev}:src/levels.ts`); return [t.match(/export const LEVELS[\s\S]*?\n\}\);/)?.[0], t.match(/export const DEFAULT_LEVEL[^\n]*/)?.[0], t.match(/export const EASIEST_LEVEL[^\n]*/)?.[0], t.match(/export const HARDEST_LEVEL[^\n]*/)?.[0]]; };
console.log(`LEVELS / DEFAULT_LEVEL / EASIEST / HARDEST byte-equal: ${JSON.stringify(lv(base)) === JSON.stringify(lv(head))} (${lv(head).map((x) => (x === undefined ? "NOT FOUND" : "found")).join(",")})`);
const sk = (rev) => git("show", `${rev}:src/uci-session.ts`).match(/`option name Skill Level type spin[^\n]*/)?.[0];
console.log(`Skill Level option line byte-equal: ${sk(base) !== undefined && sk(base) === sk(head)} :: ${sk(head)}`);
