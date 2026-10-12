import { spawnSync } from "node:child_process";
const [S] = process.argv.slice(2);
const runs = [
  ["delivered", "tree root (as A7 today)", `${S}/delivered`, `${S}/delivered`],
  ["delivered", "neutral empty dir",       `${S}/delivered`, `${S}/neutral`],
  ["P6b",       "tree root (as A7 today)", `${S}/p6b`,       `${S}/p6b`],
  ["P6b",       "neutral empty dir",       `${S}/p6b`,       `${S}/neutral`],
  ["P6b",       "dir holding a planted data/opening-book/book.json", `${S}/p6b`, `${S}/hostile`],
  ["delivered", "dir holding a planted data/opening-book/book.json", `${S}/delivered`, `${S}/hostile`],
];
for (const [build, where, tree, cwd] of runs) {
  const c = spawnSync(process.execPath, [`${tree}/src/cli.ts`, "--colour", "white", "--ascii"],
    { cwd, env: {}, input: "e2e4\n", encoding: "utf8", timeout: 60000 });
  console.log(`${build.padEnd(9)} | cwd = ${where.padEnd(52)} | exit ${c.status} | stderr ${Buffer.byteLength(c.stderr)} B ${JSON.stringify(c.stderr.trim())}`);
}
