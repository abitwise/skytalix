import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const tree = process.argv[2];
const list = JSON.parse(readFileSync("frozen-mutants.json", "utf8"));
for (const id of ["H1", "H2"]) {
  const m = list.find((x) => x.id === id), p = `${tree}/${m.file}`, orig = readFileSync(p, "utf8");
  writeFileSync(p, orig.replace(m.from, () => m.to));
  const r = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "-t", "go infinite holds the bestmove"], { cwd: tree, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" } });
  writeFileSync(p, orig);
  console.log(id, "exit", r.status, "restored", readFileSync(p, "utf8") === orig);
  const o = r.stdout + r.stderr;
  for (const l of o.split("\n").filter((l) => /FAIL|❯ src\/uci-session.test.ts:\d+|^\s+\d+\|.*expect|AssertionError|Tests /.test(l))) console.log("  ", l.trim().slice(0, 140));
}
