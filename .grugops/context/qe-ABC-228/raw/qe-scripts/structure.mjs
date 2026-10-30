// qe-ABC-228: structure only (side to move in check?, legal move list) for candidate QE Q-SET rows, read on a tree's
// legal.ts. No quiescence value is read here. usage: node structure.mjs <tree> <rows.json>
import { readFileSync } from "node:fs";
const [T, rowsPath] = process.argv.slice(2);
const { parseFen } = await import(`${T}/src/fen.ts`);
const { isInCheck, legalMoves } = await import(`${T}/src/legal.ts`);
const { makeMove } = await import(`${T}/src/apply.ts`);
const { squareName } = await import(`${T}/src/position.ts`);
const lab = (m) => `${squareName(m.from)}${squareName(m.to)}${["", "", "n", "b", "r", "q"][m.promotion] ?? ""}`;
for (const r of JSON.parse(readFileSync(rowsPath, "utf8"))) {
  const p = parseFen(r.fen);
  const ms = legalMoves(p);
  const out = { id: r.id, check: isInCheck(p), legal: ms.length, moves: ms.map((m) => `${lab(m)}${m.captured ? "x" : ""}`) };
  if (r.line) {
    const steps = [];
    for (const l of r.line) {
      const m = legalMoves(p).find((x) => lab(x) === l);
      if (!m) {
        steps.push(`${l}: NOT LEGAL`);
        break;
      }
      makeMove(p, m);
      steps.push(`${l}: check=${isInCheck(p)} legal=${legalMoves(p).length}`);
    }
    out.line = steps;
  }
  console.log(JSON.stringify(out));
}
