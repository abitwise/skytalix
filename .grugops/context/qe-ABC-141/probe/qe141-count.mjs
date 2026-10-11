// QE ABC-141 independent derive counter. Usage: node qe141-count.mjs <archived-tree>
// Technique (differs from SE's entry-splice): RENAME the exported legalMoves to an inner
// function and APPEND a wrapper export that counts and snapshots each call's position via
// toFen (hooked in from the driver, so legal.ts gains no import). Runs on an archive copy only.
import { readFileSync, writeFileSync } from "node:fs";
const tree = process.argv[2];
const p = `${tree}/src/legal.ts`;
let src = readFileSync(p, "utf8");
const decl = "export function legalMoves(position: Position): Move[] {";
if (!src.includes("__qeInner")) {
  const n = src.split(decl).length - 1;
  if (n !== 1) throw new Error(`decl x${n}`);
  src = src.replace(decl, "function __qeInner(position: Position): Move[] {");
  src += "\nexport function legalMoves(position: Position): Move[] {\n  const g = globalThis as any;\n  g.__qeN++;\n  if (g.__qeHook) g.__qeHook(position);\n  return __qeInner(position);\n}\n";
  writeFileSync(p, src);
}
const t = readFileSync(`${tree}/src/move-input.test.ts`, "utf8");
const fenOf = (n) => t.match(new RegExp(`const ${n} = "([^"]+)"`))[1];
const { toFen, parseFen } = await import(`${tree}/src/fen.ts`);
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
const cases = [["SIX_QUEENS_FEN", "Qxd4"], ["TWO_KNIGHTS_FEN", "Nd2"]];
for (const [name, line] of cases) {
  const fen = fenOf(name);
  const h = newGame(fen);
  const seen = [];
  globalThis.__qeN = 0;
  globalThis.__qeHook = (pos) => seen.push(toFen(pos));
  const out = resolveMoveInput(h, line);
  globalThis.__qeHook = null;
  const onStart = seen.filter((f) => f === fen).length;
  console.log(`${name} fen="${fen}" line=${line} kind=${out.kind} derives=${globalThis.__qeN} on-start=${onStart} on-other=${seen.length - onStart} distinct-other=${new Set(seen.filter((f) => f !== fen)).size}`);
  if (out.kind === "ambiguous") console.log(`  messages=${JSON.stringify(out.messages ?? out)}`.slice(0, 400));
}
const pos = parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000");
console.log(`parseFen fullmove 10000 -> fullmoveNumber=${pos.fullmoveNumber}`);
