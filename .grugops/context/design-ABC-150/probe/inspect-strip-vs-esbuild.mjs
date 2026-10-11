// ABC-150 D2 prep, inspection only (no timing): does vite's esbuild TS transform emit different JS from
// Node's own type stripping for the engine's hot files? Both outputs are re-printed by esbuild as plain JS
// (loader "js", same options), so formatting cannot differ; any remaining difference is semantic.
// Usage (from the worktree root): node .grugops/context/design-ABC-150/probe/inspect-strip-vs-esbuild.mjs
import { readFileSync, readdirSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { transform } from "esbuild";
import { transformWithEsbuild } from "vite";
const files = readdirSync("src").filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")).sort();
const reprint = async (code) => (await transform(code, { loader: "js", format: "esm", target: "esnext" })).code;
let same = 0;
const differ = [];
for (const f of files) {
  const src = readFileSync(`src/${f}`, "utf8");
  const viaVite = await reprint((await transformWithEsbuild(src, `src/${f}`, { sourcemap: false })).code);
  const viaNode = await reprint(stripTypeScriptTypes(src, { mode: "strip" }));
  if (viaVite === viaNode) same++;
  else differ.push(f);
}
console.log(JSON.stringify({ node: process.version, files: files.length, identical: same, differ }, null, 1));
