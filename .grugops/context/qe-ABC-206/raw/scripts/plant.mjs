// usage: node plant.mjs <plantTree> <headTree> <id>  — resets src from head, then applies one plant.
import { cpSync, readFileSync, writeFileSync } from "node:fs";
const [plant, head, id] = process.argv.slice(2);
cpSync(`${head}/src`, `${plant}/src`, { recursive: true });
const edit = (file, from, to) => {
  const p = `${plant}/src/${file}`;
  const s = readFileSync(p, "utf8");
  if (!s.includes(from)) throw new Error(`plant ${id}: anchor not found in ${file}`);
  writeFileSync(p, s.replace(from, to));
};
const P = {
  none: () => {},
  // SE's three, re-planted
  P1: () => edit("gameend.ts", "if (!hasLegalMove(position)) return", "if (legalMoves(position).length === 0) return"),
  P2: () => {
    edit("quiescence.ts", "const captures = legalCaptures(position);", "const captures = legalMoves(position).filter((m) => m.captured !== 0);");
    edit("quiescence.ts", 'import { legalCaptures } from "./legal.ts";', 'import { legalCaptures, legalMoves } from "./legal.ts";');
  },
  P3: () => {
    edit("search.ts", "return givesCheck(position, move) ? 0 : 1;", "const undo = makeMove(position, move);\n  const gc = isInCheck(position);\n  unmakeMove(position, move, undo);\n  return gc ? 0 : 1;");
  },
  // QE: the same regressions, but inside legal.ts (an intra-module call the spies cannot see)
  Q1: () => edit("legal.ts", "export function hasLegalMove(position: Position): boolean {\n", "export function hasLegalMove(position: Position): boolean {\n  if (PLANT) return legalMoves(position).length > 0;\n"),
  Q2: () => edit("legal.ts", "export function legalCaptures(position: Position): Move[] {\n", "export function legalCaptures(position: Position): Move[] {\n  if (PLANT) return legalMoves(position).filter((m) => m.captured !== EMPTY);\n"),
  Q3: () => edit("legal.ts", "  if (move.flags !== FLAG_NONE) {\n    const undo", "  if (PLANT) {\n    const undo"),
  // QE: value breaks the identity instruments must see
  Q4: () => edit("legal.ts", "  return captures;\n}", "  return captures.reverse();\n}"),
  Q5: () => edit("legal.ts", "  board[move.from] = EMPTY;\n  const check", "  const check"),
};
P[id]();
if (id.startsWith("Q") && ["Q1","Q2","Q3"].includes(id)) edit("legal.ts", "/** The two neighbouring files", "const PLANT = true as boolean;\n\n/** The two neighbouring files");
console.log(`planted ${id}`);
