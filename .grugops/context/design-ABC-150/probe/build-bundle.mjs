// ABC-150 C3: bundle workload150.mjs (E, S, P and every src/ module they reach) into ONE ES module with
// esbuild, no minify, no renaming beyond scope hoisting, target esnext. Inside the bundle a call from one
// src/ module to another is a plain binding, not a runner namespace getter. node: built-ins stay external.
// Usage (from the worktree root): node .grugops/context/design-ABC-150/probe/build-bundle.mjs
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
const here = dirname(fileURLToPath(import.meta.url));
const outfile = join(here, "bundle", "workload150.bundle.mjs");
const r = await build({
  entryPoints: [join(here, "workload150.mjs")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "esnext",
  minify: false,
  sourcemap: false,
  outfile,
  metafile: true,
  logLevel: "warning",
});
const inputs = Object.keys(r.metafile.inputs).sort();
const sha = createHash("sha256").update(readFileSync(outfile)).digest("hex").slice(0, 16);
console.log(JSON.stringify({ outfile: "bundle/workload150.bundle.mjs", sha256_16: sha, inputs }, null, 1));
