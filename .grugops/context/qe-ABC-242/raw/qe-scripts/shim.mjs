// qe-ABC-242: build a counting copy of a tree's src/ (out of the repository), so the blunder's child searches can be
// counted and their handed budgets read WITHOUT the SE's in-file spy. src/engine.ts is renamed engine-real.ts and a
// shim engine.ts re-exports it, wrapping chooseMove to log { budgetMs, depth, nodes } per call into globalThis.__qeCalls.
// One module instance per module (every file is a byte copy in one dir), so the engine's table is not duplicated.
// usage (library): import { buildShim } from "./shim.mjs"; const dir = buildShim(tree, outDir) -> <outDir>/src
import { cpSync, existsSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function buildShim(tree, outDir) {
  rmSync(outDir, { recursive: true, force: true });
  cpSync(join(tree, "src"), join(outDir, "src"), { recursive: true });
  const src = join(outDir, "src");
  renameSync(join(src, "engine.ts"), join(src, "engine-real.ts"));
  if (existsSync(join(src, "engine.ts"))) throw new Error("shim: engine.ts still present");
  writeFileSync(
    join(src, "engine.ts"),
    [
      'export * from "./engine-real.ts";',
      'import { chooseMove as realChooseMove } from "./engine-real.ts";',
      "globalThis.__qeCalls ??= [];",
      "export function chooseMove(position, options) {",
      "  const r = realChooseMove(position, options);",
      "  globalThis.__qeCalls.push({ budgetMs: options?.budgetMs, depth: r?.depth ?? null, nodes: r?.nodes ?? null });",
      "  return r;",
      "}",
      "",
    ].join("\n"),
  );
  // Sanity: the levels module imports chooseMove from ./engine.ts (so the shim is on its path).
  if (!/from "\.\/engine\.ts"/.test(readFileSync(join(src, "levels.ts"), "utf8"))) throw new Error("shim: levels.ts import moved");
  return src;
}
