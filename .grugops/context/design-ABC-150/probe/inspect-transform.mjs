// ABC-150 D2 prep (inspection only, no timing): print what vite's esbuild + SSR transform make of a src file.
// Usage (from the worktree root): FILE=src/moves.ts node .grugops/context/design-ABC-150/probe/inspect-transform.mjs
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { moduleRunnerTransform, transformWithEsbuild } from "vite";
const file = resolve(process.env.FILE ?? "src/moves.ts");
const src = readFileSync(file, "utf8");
const es = await transformWithEsbuild(src, file, { sourcemap: false });
const ssr = await moduleRunnerTransform(es.code, null, file);
process.stdout.write(ssr.code);
