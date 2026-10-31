// qe-ABC-242 G9 bytes + fences: LEVELS (the whole frozen block), EASIEST/DEFAULT/HARDEST_LEVEL, HARD_CEILING_MS and the
// level layer's sum clamp line, read as bytes from B and H; sha256 of each; plus whole-file sha256 of the engine-path
// files the ADR fences (engine.ts, search.ts, level-seam.ts, uci-session.ts, cli.ts, history.ts, gameend.ts, zobrist.ts).
// usage: node g9.mjs <B> <H>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [B, H] = process.argv.slice(2);
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const grab = (tree, file, re) => { const m = re.exec(readFileSync(join(tree, file), "utf8")); if (!m) throw new Error(`${file}: ${re} not found in ${tree}`); return m[0]; };
const items = [
  ["levels.ts LEVELS block", "src/levels.ts", /export const LEVELS[\s\S]*?\n\}\);\n/],
  ["levels.ts EASIEST_LEVEL", "src/levels.ts", /export const EASIEST_LEVEL = .*\n/],
  ["levels.ts DEFAULT_LEVEL", "src/levels.ts", /export const DEFAULT_LEVEL = .*\n/],
  ["levels.ts HARDEST_LEVEL", "src/levels.ts", /export const HARDEST_LEVEL = .*\n/],
  ["levels.ts sum clamp", "src/levels.ts", /return blunder\(position, Math\.min\(level\.budgetMs, HARD_CEILING_MS\).*\n/],
  ["engine.ts HARD_CEILING_MS", "src/engine.ts", /export const HARD_CEILING_MS = .*\n/],
];
let bad = 0;
for (const [name, file, re] of items) {
  const b = grab(B, file, re), h = grab(H, file, re);
  const ok = b === h; if (!ok) bad++;
  console.log(`${ok ? "EQUAL" : "DIFF "} ${name}: B ${sha(b)} H ${sha(h)} | ${JSON.stringify(h.trim().split("\n")[0]).slice(0, 90)}`);
}
for (const f of ["engine.ts", "search.ts", "level-seam.ts", "uci-session.ts", "cli.ts", "history.ts", "gameend.ts", "zobrist.ts", "quiescence.ts", "transposition.ts"]) {
  const b = readFileSync(join(B, "src", f)), h = readFileSync(join(H, "src", f));
  const ok = Buffer.compare(b, h) === 0; if (!ok) bad++;
  console.log(`${ok ? "EQUAL" : "DIFF "} src/${f} (whole file) B ${sha(b)} H ${sha(h)}`);
}
// The exported surface of levels.ts (names only): no new export (ABC-078 A4 / § A8 pins).
const exportsOf = (tree) => [...readFileSync(join(tree, "src/levels.ts"), "utf8").matchAll(/^export (?:const|function|interface|type|class) (\w+)/gm)].map((m) => m[1]).sort().join(",");
const importsOf = (tree) => [...readFileSync(join(tree, "src/levels.ts"), "utf8").matchAll(/^import [\s\S]*? from "(.*)";/gm)].map((m) => m[0].replace(/\s+/g, " ")).join(" | ");
const eb = exportsOf(B), eh = exportsOf(H), ib = importsOf(B), ih = importsOf(H);
if (eb !== eh) bad++; if (ib !== ih) bad++;
console.log(`${eb === eh ? "EQUAL" : "DIFF "} levels.ts exports: ${eh}`);
console.log(`${ib === ih ? "EQUAL" : "DIFF "} levels.ts imports: ${ih}`);
console.log(`G9 ${bad === 0 ? "MET" : "NOT MET"} (${bad} differences)`);
