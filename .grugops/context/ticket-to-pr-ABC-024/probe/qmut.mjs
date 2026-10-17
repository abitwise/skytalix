import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const [S] = process.argv.slice(2);
const tree = `${S}/tree`; const file = `${tree}/src/moves.castling.hardening.test.ts`;
const pristine = readFileSync(`${S}/test.pristine.ts`, "utf8");
const a1 = [...pristine.matchAll(/^  \["[KQkq]", "[a-h][18]", .*\],\n/gm)].map((m) => m[0]);
const a2 = [...pristine.matchAll(/^  \["(clocks|ep)", "([^"]+)", 24\],\n/gm)].map((m) => [m[0], m[2]]);
console.log("A1 rows found", a1.length, "A2 rows found", a2.length);
const muts = [
  ...a1.map((row) => [`delete A1 row ${row.trim().slice(0, 30)}`, row, ""]),
  ...a2.map(([row, fen]) => { const f = fen.split(" "); const nf = `${f.slice(0, 3).join(" ")} - 0 1`; return [`narrow A2 row ${fen} -> ${nf}`, row, row.replace(fen, nf)]; }),
];
const env = { ...process.env, PATH: `${tree}/node_modules/.bin:${process.env.PATH}` }; delete env.PERFT_DEEP;
for (const [name, from, to] of muts) {
  if (pristine.split(from).length - 1 !== 1) { console.log(name, "HARNESS ERROR anchor"); continue; }
  writeFileSync(file, pristine.replace(from, to));
  const out = `${S}/q.json`;
  spawnSync("vitest", ["run", "src/moves.castling.hardening.test.ts", "--reporter=json", `--outputFile=${out}`], { cwd: tree, env, encoding: "utf8" });
  const j = JSON.parse(readFileSync(out, "utf8"));
  const failed = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => a.title));
  console.log(`${name}\tpassed ${j.numPassedTests}/${j.numTotalTests}\tfailed: ${failed.join(" | ")}`);
}
writeFileSync(file, pristine);
