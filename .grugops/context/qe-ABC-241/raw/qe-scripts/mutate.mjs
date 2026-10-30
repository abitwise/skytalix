// qe-ABC-241 mutants (PREREG § 2): a scratch copy of the head archive per mutant, one exact string replacement (asserted
// unique), the full `npm test` in the copy, then qrows.mjs on it. Never touches src/ of any checkout.
// usage: node mutate.mjs <scratch> <QM1|QM2|QM3|QM4>
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, realpathSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const [scr, id] = process.argv.slice(2);
const PSEUDO =
  "((t, b) => [(b ? t + 16 : t - 16) - 1, (b ? t + 16 : t - 16) + 1].some((s) => (s & 0x88) === 0 && position.board[s] === (PAWN | (b ? 8 : 0))))(position.epSquare, position.blackToMove)";
const M = {
  QM1: ["src/levels.ts", "[...priorKeys, repetitionKey(position, zobristKey(position))]", "[...priorKeys, zobristKey(position)]"],
  QM2: ["src/gameend.ts", "positionCounts.get(repetitionKey(position, zobristKey(position)))", "positionCounts.get(zobristKey(position))"],
  QM3: ["src/uci-session.ts", "const keys = [repetitionKey(position, zobristKey(position))];", "const keys = [zobristKey(position)];"],
  QM4: ["src/gameend.ts", "if (position.epSquare === NO_SQUARE || hasLegalEnPassant(position)) return key;", `if (position.epSquare === NO_SQUARE || ${PSEUDO}) return key;`],
};
const [file, from, to] = M[id];
const dir = join(scr, "mut", id);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
cpSync(join(scr, "head"), dir, { recursive: true, filter: (s) => !s.endsWith("/node_modules") });
symlinkSync(realpathSync(join(scr, "head/node_modules")), join(dir, "node_modules"));
const text = readFileSync(join(dir, file), "utf8");
const n = text.split(from).length - 1;
if (n !== 1) {
  console.error(`${id}: expected 1 occurrence in ${file}, found ${n}`);
  process.exit(5);
}
writeFileSync(join(dir, file), text.replace(from, to));
const out = join(scr, "out/mutants");
mkdirSync(out, { recursive: true });
const t = spawnSync("npm", ["test"], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const tt = `${t.stdout}${t.stderr}`;
writeFileSync(join(out, `${id}-npm-test.txt`), tt);
const tests = /^\s+Tests\s+(.*)$/m.exec(tt)?.[1] ?? "?";
const failed = [...tt.matchAll(/^\s*(?:×|✗|FAIL)\s+(.*)$/gm)].map((m) => m[1]).filter((s) => !/^\s*$/.test(s));
const q = spawnSync(process.execPath, [join(scr, "scripts/qrows.mjs"), join(scr, "base"), dir], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
writeFileSync(join(out, `${id}-qrows.txt`), `${q.stdout}${q.stderr}`);
const qfail = q.stdout.split("\n").filter((l) => l.endsWith("| FAIL")).map((l) => l.split(" | ")[0]);
console.log(`${id} ${file}: npm test rc=${t.status} :: ${tests}`);
for (const f of [...new Set(failed)].slice(0, 30)) console.log(`  red: ${f}`);
console.log(`  qrows FAIL ${qfail.length}: ${qfail.join(", ")}`);
rmSync(dir, { recursive: true, force: true });
