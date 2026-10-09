// QE probe (qe-ABC-082): row 21's re-found HANGING_CORPUS pair (and the pair it replaced), read
// on any tree: legality, check, which move each arm picks at depth 1 and 3, and the depth-3
// margin of the losing capture against the best other root move.
// Usage: node pair.ts <tree>
import { pathToFileURL } from "node:url";

const tree = process.argv[2];
const load = (f: string) => import(pathToFileURL(`${tree}/src/${f}`).href);
const S = await load("search.ts");
const { parseFen } = await load("fen.ts");
const { legalMoves, isInCheck } = await load("legal.ts");
const { makeMove, unmakeMove } = await load("apply.ts");
const { squareName, EMPTY } = await load("position.ts");
const label = (m: { from: number; to: number; promotion: number }) =>
  `${squareName(m.from)}${squareName(m.to)}${m.promotion === EMPTY ? "" : m.promotion}`;

const ROWS = [
  ["new  R takes a pawn a bishop defends (+g7)", "4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1", "b1b2"],
  ["new  mirror (+g2)", "1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1", "b8b7"],
  ["old  R takes a pawn a bishop defends", "4k3/8/8/8/8/b7/1p6/1R2K3 w - - 0 1", "b1b2"],
  ["old  mirror", "1r2k3/1P6/B7/8/8/8/8/4K3 b - - 0 1", "b8b7"],
];

for (const [name, fen, losing] of ROWS) {
  const p = parseFen(fen);
  const legal = legalMoves(p);
  const values: Record<string, number> = {};
  for (const m of legal) {
    const undo = makeMove(p, m);
    values[label(m)] = 0 - S.search(p, 2).score;
    unmakeMove(p, m, undo);
  }
  const others = Object.entries(values).filter(([k]) => k !== losing);
  const bestOther = Math.max(...others.map(([, v]) => v));
  console.log(
    JSON.stringify({
      row: name,
      inCheck: isInCheck(parseFen(fen)),
      losingLegal: legal.some((m: never) => label(m) === losing),
      d1: label(S.search(parseFen(fen), 1).move),
      bareD1: label(S.searchWithoutQuiescence(parseFen(fen), 1).move),
      d3: label(S.search(parseFen(fen), 3).move),
      bareD3: label(S.searchWithoutQuiescence(parseFen(fen), 3).move),
      losingD3: values[losing],
      bestOtherD3: bestOther,
      margin: bestOther - (values[losing] as number),
    }),
  );
}
