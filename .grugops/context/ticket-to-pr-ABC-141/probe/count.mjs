// SE ABC-141 independent derive counter. Usage: node count.mjs <archived-tree>
// Splices a counter into legalMoves of the ARCHIVED copy (never the worktree), then counts calls
// in one resolveMoveInput(newGame(fen), line). Controls: a no-check ambiguity must count 1.
import { readFileSync, writeFileSync } from "node:fs";
const tree = process.argv[2];
const p = `${tree}/src/legal.ts`;
let src = readFileSync(p, "utf8");
const anchor = "export function legalMoves(position: Position): Move[] {\n";
const hits = src.split(anchor).length - 1;
if (hits !== 1) throw new Error(`anchor x${hits}`);
if (!src.includes("__seCount")) src = src.replace(anchor, anchor + "  (globalThis as any).__seCount++;\n");
writeFileSync(p, src);
const t = readFileSync(`${tree}/src/move-input.test.ts`, "utf8");
const fen = (n) => t.match(new RegExp(`const ${n} = "([^"]+)"`))[1];
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
for (const [name, line] of [["SIX_QUEENS_FEN", "Qxd4"], ["TWO_KNIGHTS_FEN", "Nd2"], ["BOTH_CAPTURES_FEN", "BXC4"]]) {
  const h = newGame(fen(name));
  globalThis.__seCount = 0;
  const out = resolveMoveInput(h, line);
  const c = globalThis.__seCount;
  console.log(`${name} ${fen(name)} line=${line} derives=${c} kind=${out.kind} messages=${JSON.stringify(out.messages)}`);
}
const { parseFen } = await import(`${tree}/src/fen.ts`);
const r = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000");
console.log("parseFen fullmove 10000 ->", JSON.stringify(r.ok === undefined ? r : r).slice(0, 300));
