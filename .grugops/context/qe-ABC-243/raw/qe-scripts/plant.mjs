// qe-ABC-243 plants (PREREG § A2, § A6), scratch copies only, never committed to src/.
// A scratch copy of tree <B|H> per plant; one exact string replacement in src/uci-session.ts, asserted unique; then
// node_modules/.bin/vitest run <files> with the json reporter (NODE_OPTIONS=--max-old-space-size=128, as npm test).
// usage: node plant.mjs <scratch> <none|L1..L7|QM3> <B|H> <outDir> [test files...]   (no files = the whole suite)
import { cpSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const [scr, id, tree, out, ...files] = process.argv.slice(2);
// QE's own insertion point (not the SE's): an early return at the top of setOption, after `got`.
const GOT = '    const got = value === "" ? "nothing" : value;\n';
const level = (L) => ["src/uci-session.ts", GOT, `${GOT}    if (name === "hash") {\n      skill = ${L};\n      return;\n    }\n`];
const M = {
  none: null,
  ...Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((L) => [`L${L}`, level(L)])),
  // qe-ABC-241 raw/qe-scripts/mutate.mjs QM3, byte for byte.
  QM3: ["src/uci-session.ts", "const keys = [repetitionKey(position, zobristKey(position))];", "const keys = [zobristKey(position)];"],
};
if (!(id in M)) throw new Error(`unknown plant ${id}`);
const dir = join(scr, "plant", `${id}-${tree}`);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(join(scr, tree), dir, { recursive: true, filter: (s) => !s.endsWith("/node_modules") });
symlinkSync(realpathSync(join(scr, tree, "node_modules")), join(dir, "node_modules"));
if (M[id]) {
  const [file, from, to] = M[id];
  const text = readFileSync(join(dir, file), "utf8");
  const n = text.split(from).length - 1;
  if (n !== 1) {
    console.error(`${id}@${tree}: expected 1 occurrence in ${file}, found ${n}`);
    process.exit(5);
  }
  writeFileSync(join(dir, file), text.replace(from, to));
}
mkdirSync(out, { recursive: true });
const json = join(out, `${id}-${tree}.json`);
const r = spawnSync("node_modules/.bin/vitest", ["run", ...files, "--reporter=json", `--outputFile=${json}`], {
  cwd: dir,
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
  env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=128" },
});
const j = JSON.parse(readFileSync(json, "utf8"));
const fails = j.testResults.flatMap((f) =>
  f.assertionResults.filter((a) => a.status === "failed").map((a) => `${a.fullName} :: ${(a.failureMessages[0] ?? "").split("\n")[0].slice(0, 140)}`),
);
const suiteErr = j.testResults.filter((f) => f.status === "failed" && f.assertionResults.length === 0).map((f) => f.name);
const line = `${id}@${tree} rc=${r.status} total=${j.numTotalTests} passed=${j.numPassedTests} failed=${j.numFailedTests} pending=${j.numPendingTests + j.numTodoTests} suiteErrors=${suiteErr.length}`;
writeFileSync(join(out, `${id}-${tree}.txt`), [line, ...fails.map((f) => `  red: ${f}`), ...suiteErr.map((s) => `  suite error: ${s}`)].join("\n") + "\n");
console.log(line);
for (const f of fails) console.log(`  red: ${f}`);
rmSync(dir, { recursive: true, force: true });
