// ruling-abc082-levels, row 21 (ABC-079 A1 deep). For every HANGING_CORPUS row in <tree>, and for the
// candidate replacements of the red pair, read: the move search() picks at depth 1 and 3, the bare
// leaf's pick at depth 1 (the A1 mutant), the depth-3 value of the labelled losing capture against
// the best other root move (the MARGIN the label rests on), and whether the forced recapture lands
// in a dead draw (gameStatus insufficient-material), which scores an exact 0 at depth >= 2.
// Usage: node hanging-replace.ts <tree-root>      (plain node, no src edits; read-only on <tree>)
import { readFileSync } from "node:fs";

const root = process.argv[2];
const S = await import(`${root}/src/search.ts`);
const F = await import(`${root}/src/fen.ts`);
const P = await import(`${root}/src/position.ts`);
const E = await import(`${root}/src/evaluate.ts`);
const A = await import(`${root}/src/apply.ts`);
const L = await import(`${root}/src/legal.ts`);
const G = await import(`${root}/src/gameend.ts`);
const src = readFileSync(`${root}/src/quiescence.test.ts`, "utf8");
const start = src.indexOf("const HANGING_CORPUS");
const body = src.slice(start, src.indexOf("];", start) + 2);
const corpus: { name: string; fen: string; losing: string }[] = new Function(
  `${body.replace(/^const HANGING_CORPUS[^=]*=/, "return")}`,
)();

const lbl = (m: { from: number; to: number } | null) =>
  m ? P.squareName(m.from) + P.squareName(m.to) : "null";

// The red pair and the candidate replacements. Each candidate keeps the row's theme (R takes a
// pawn a bishop defends) and adds ONE pawn so the forced recapture no longer lands in a dead draw.
const CANDIDATES = [
  { name: "C1 + white h2", fen: "4k3/8/8/8/8/b7/1p5P/1R2K3 w - - 0 1", losing: "b1b2" },
  { name: "C1 mirror + black h7", fen: "1r2k3/1P5p/B7/8/8/8/8/4K3 b - - 0 1", losing: "b8b7" },
  { name: "C2 + black g7", fen: "4k3/6p1/8/8/8/b7/1p6/1R2K3 w - - 0 1", losing: "b1b2" },
  { name: "C2 mirror + white g2", fen: "1r2k3/1P6/B7/8/8/8/6P1/4K3 b - - 0 1", losing: "b8b7" },
  { name: "C3 + white g2", fen: "4k3/8/8/8/8/b7/1p4P1/1R2K3 w - - 0 1", losing: "b1b2" },
  { name: "C3 mirror + black g7", fen: "1r2k3/1P4p1/B7/8/8/8/8/4K3 b - - 0 1", losing: "b8b7" },
];

/** Depth-3 value of each root move (make it, negate a depth-2 search), best first. */
function rootValues(fen: string) {
  const p = F.parseFen(fen);
  return L.legalMoves(p)
    .map((m: { from: number; to: number }) => {
      const u = A.makeMove(p, m);
      const v = -S.search(p, 2).score;
      A.unmakeMove(p, m, u);
      return [lbl(m), v] as [string, number];
    })
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
}

/** After the losing capture, does the cheapest recapture on that square reach a dead draw? */
function recaptureDeadDraw(fen: string, losing: string): boolean {
  const p = F.parseFen(fen);
  const cap = L.legalMoves(p).find((m: { from: number; to: number }) => lbl(m) === losing);
  A.makeMove(p, cap);
  const re = L.legalMoves(p).filter(
    (m: { from: number; to: number }) => P.squareName(m.to) === losing.slice(2),
  );
  return re.some((m: { from: number; to: number }) => {
    const u = A.makeMove(p, m);
    const dead = G.gameStatus(p).reason === "insufficient-material";
    A.unmakeMove(p, m, u);
    return dead;
  });
}

function read(row: { name: string; fen: string; losing: string }) {
  const p = F.parseFen(row.fen);
  const legal = L.legalMoves(p).map(lbl);
  const values = rootValues(row.fen);
  const losingValue = (values.find(([m]) => m === row.losing) as [string, number])[1];
  const bestOther = (values.find(([m]) => m !== row.losing) as [string, number])[1];
  return {
    name: row.name,
    legal: legal.includes(row.losing),
    inCheck: L.isInCheck(p),
    staticEval: E.evaluate(F.parseFen(row.fen)),
    d1: lbl(S.search(F.parseFen(row.fen), 1).move),
    d1bare: lbl(S.searchWithoutQuiescence(F.parseFen(row.fen), 1).move),
    d3: lbl(S.search(F.parseFen(row.fen), 3).move),
    losingAtD3: losingValue,
    bestOtherAtD3: bestOther,
    margin: bestOther - losingValue,
    deadDrawRecapture: recaptureDeadDraw(row.fen, row.losing),
  };
}

const tree = root.split("/").filter(Boolean).slice(-1)[0];
for (const row of corpus) console.log(JSON.stringify({ tree, set: "corpus", ...read(row) }));
for (const row of CANDIDATES) console.log(JSON.stringify({ tree, set: "candidate", ...read(row) }));
