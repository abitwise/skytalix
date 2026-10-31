// se-ABC-243 plants on scratch copies only (never committed to src). usage: node plant.mjs <worktree> <scratch> <none|L4|L6|L7|QM3> <tip|base>
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { spawnSync, execFileSync } from "node:child_process";
import { join } from "node:path";
const [wt, scr, id, which] = process.argv.slice(2);
const HASH_FROM = '    } else if (name === "timemode") {';
const hash = (L) => ["src/uci-session.ts", HASH_FROM, `    } else if (name === "hash") {\n      skill = ${L};\n${HASH_FROM}`];
const M = {
  none: null,
  L4: hash(4), L6: hash(6), L7: hash(7),
  QM3: ["src/uci-session.ts", "const keys = [repetitionKey(position, zobristKey(position))];", "const keys = [zobristKey(position)];"],
};
const dir = join(scr, "plant", `${id}-${which}`);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(wt, dir, { recursive: true, filter: (s) => !s.endsWith("/node_modules") && !s.endsWith("/.git") });
symlinkSync(join(wt, "node_modules"), join(dir, "node_modules"));
if (which === "base") writeFileSync(join(dir, "src/uci-session.test.ts"), execFileSync("git", ["-C", wt, "show", "HEAD:src/uci-session.test.ts"]));
if (M[id]) {
  const [file, from, to] = M[id];
  const text = readFileSync(join(dir, file), "utf8");
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${id}: ${n} occurrences`);
  writeFileSync(join(dir, file), text.replace(from, to));
}
const r = spawnSync(process.execPath, ["node_modules/vitest/vitest.mjs", "run", "src/uci-session.test.ts", "--reporter=verbose"], { cwd: dir, encoding: "utf8", env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" } });
const out = r.stdout + r.stderr;
if (process.env.DBG) console.log(out.slice(-3000));
const pick = (re) => out.split("\n").filter((l) => re.test(l)).map((l) => l.trim().slice(0, 160));
console.log(`== ${id} on ${which} test file: exit ${r.status}`);
for (const l of pick(/Hash value 64 writes nothing|own key counts|Tests +\d|AssertionError|^ *[❯>] src\/uci-session.test.ts:\d/)) console.log("  " + l);
rmSync(dir, { recursive: true, force: true });
