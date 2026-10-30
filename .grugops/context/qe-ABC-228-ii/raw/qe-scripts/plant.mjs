// qe-ABC-228-ii SE-228ii-a ruling: run src/uci-session.test.ts on each planted scratch copy (a `setoption name Hash`
// that silently moves the level to L), via the local vitest entry (never npx / npm exec). Scratch copies only; src/
// is never edited. usage: node plant.mjs <plantDir> <outDir>
import { spawnSync } from "node:child_process";
import { readdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const [plantDir, out] = process.argv.slice(2);
for (const name of readdirSync(plantDir).sort()) {
  const cwd = join(plantDir, name);
  const r = spawnSync(process.execPath, ["./node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "--reporter=verbose"], {
    cwd,
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" },
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const text = `${r.stdout}${r.stderr}`;
  writeFileSync(join(out, `plant-${name}.txt`), text);
  const tests = /^\s+Tests\s+(.*)$/m.exec(text)?.[1] ?? "?";
  const failed = [...text.matchAll(/^\s+(?:×|✗|FAIL)\s+(.*)$/gm)].map((m) => m[1].trim());
  const line = `${name} rc=${r.status} :: ${tests}${failed.length ? `\n  red: ${failed.join("\n  red: ")}` : ""}`;
  appendFileSync(join(out, "plant.log"), `${line}\n`);
  console.log(line);
}
