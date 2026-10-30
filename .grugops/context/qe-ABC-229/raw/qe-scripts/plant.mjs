// qe-ABC-229 planted faults on scratch copies of the head tree (src/ is never edited). Each plant is a literal string
// replacement that must match exactly once, else the plant is refused. Each copy runs src/quiescence.test.ts and
// src/gameend.nfr.test.ts, one file per run, via the local vitest entry at heap 400 (never npx / npm exec), then
// QE's sweep.mjs --list-only. usage: node plant.mjs <headTree> <plantRoot> <outDir> <sweep.mjs>
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync, appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
const [H, root, out, sweep] = process.argv.slice(2);
const PLANTS = [
  ["P2-qply0-only", "src/quiescence.ts", "moves = rules.quietPromotions\n", "moves = rules.quietPromotions && qply === 0\n"],
  ["P3-second-legalMoves-pass", "src/quiescence.ts", "? legalCapturesAndQueenPromotions(position)\n",
    "? [...legalCaptures(position), ...legalMoves(position).filter((m) => m.captured === 0 && m.promotion === 5)]\n"],
  ["P5-quiet-under-promotions", "src/legal.ts", "if (!isSquareAttackedBy(position, kingHome, !moverIsBlack)) moves.push(move);",
    "if (!isSquareAttackedBy(position, kingHome, !moverIsBlack)) { moves.push(move); for (const promotion of [4, 3, 2]) moves.push({ ...move, promotion }); }"],
  ["QE1-promotions-only-without-captures", "src/legal.ts", "  const pawn = PAWN | (moverIsBlack ? BLACK : 0);\n  const forward",
    "  if (moves.length > 0) return moves;\n  const pawn = PAWN | (moverIsBlack ? BLACK : 0);\n  const forward"],
  ["QE2-no-empty-square-check", "src/legal.ts", "if (board[from] !== pawn || board[to] !== EMPTY) continue;", "if (board[from] !== pawn) continue;"],
];
for (const [name, file, from, to] of PLANTS) {
  const dir = join(root, name);
  if (existsSync(dir)) rmSync(dir, { recursive: true });
  mkdirSync(dir, { recursive: true });
  for (const f of ["src", "data", "tools", "package.json", "vitest.config.ts", "tsconfig.json"]) cpSync(join(H, f), join(dir, f), { recursive: true });
  symlinkSync(join(H, "node_modules"), join(dir, "node_modules"));
  const text = readFileSync(join(dir, file), "utf8");
  const n = text.split(from).length - 1;
  if (n !== 1) { appendFileSync(join(out, "plant.log"), `${name} REFUSED: anchor matched ${n} times\n`); console.log(`${name} REFUSED (${n})`); continue; }
  writeFileSync(join(dir, file), text.replace(from, to));
  let line = `== ${name} (${file})`;
  for (const t of ["src/quiescence.test.ts", "src/gameend.nfr.test.ts"]) {
    const r = spawnSync(process.execPath, ["./node_modules/vitest/vitest.mjs", "run", t, "--reporter=verbose"], { cwd: dir, env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=400" }, encoding: "utf8", maxBuffer: 64 << 20 });
    const txt = `${r.stdout}${r.stderr}`;
    writeFileSync(join(out, `${name}-${t.replace(/^src\//, "").replace(/\.test\.ts$/, "")}.txt`), txt);
    const tests = /^\s+Tests\s+(.*)$/m.exec(txt)?.[1] ?? "?";
    const red = [...txt.matchAll(/^\s+×\s+(.*?)(?:\s+\d+ms)?$/gm)].map((m) => m[1].trim());
    line += `\n  ${t}: rc=${r.status} :: ${tests}${red.length ? `\n    red: ${red.join("\n    red: ")}` : ""}`;
  }
  const s = spawnSync(process.execPath, [sweep, dir, "--list-only"], { encoding: "utf8", maxBuffer: 64 << 20 });
  line += `\n  QE sweep --list-only: rc=${s.status} :: ${(/^LIST: .*$/m.exec(s.stdout) ?? ["?"])[0]}`;
  appendFileSync(join(out, "plant.log"), `${line}\n`);
  console.log(line);
}
