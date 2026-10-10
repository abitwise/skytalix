// semanticFault copied verbatim from .grugops/context/design-abc010/probe/fen-corpus.mjs (Architect prototype of ADR-0033 rules)
const tree = process.argv[2];
const { isSquareAttackedBy } = await import(`${tree}/src/moves.ts`);
const P = await import(`${tree}/src/position.ts`);
const { PAWN, ROOK, KING, BLACK, EMPTY, NO_SQUARE, CASTLE_WK, CASTLE_WQ, CASTLE_BK, CASTLE_BQ, squareName } = P;

const RIGHTS = [ // right, char, king home, rook home, colour bit
  [CASTLE_WK, "K", 4, 7, 0], [CASTLE_WQ, "Q", 4, 0, 0], [CASTLE_BK, "k", 116, 119, BLACK], [CASTLE_BQ, "q", 116, 112, BLACK],
];
export function semanticFault(fields, p) {
  const [, , , , half, full] = fields;
  for (const [f, label] of [[half, "halfmove clock"], [full, "fullmove number"]]) if (String(Number(f)) !== f) return `clock: ${label} "${f.slice(0, 12)}" does not round-trip`;
  for (let file = 0; file < 8; file++) for (const r of [0, 7]) { const sq = r * 16 + file; if ((p.board[sq] & 7) === PAWN) return `pawn on rank ${r + 1} (${squareName(sq)})`; }
  for (const [right, ch, k, r, c] of RIGHTS) if (p.castling & right) {
    if (p.board[k] !== (KING | c)) return `castling ${ch}: no king on ${squareName(k)}`;
    if (p.board[r] !== (ROOK | c)) return `castling ${ch}: no rook on ${squareName(r)}`;
  }
  if (p.epSquare !== NO_SQUARE) {
    const ep = p.epSquare, w = !p.blackToMove; // white to move => black just pushed => ep on rank 6
    const wantRank = w ? 5 : 2, front = w ? ep - 16 : ep + 16, origin = w ? ep + 16 : ep - 16;
    if (ep >> 4 !== wantRank) return `ep ${squareName(ep)}: wrong rank for side to move`;
    if (p.board[ep] !== EMPTY) return `ep ${squareName(ep)}: target occupied`;
    if (p.board[front] !== (PAWN | (w ? BLACK : 0))) return `ep ${squareName(ep)}: no pushed pawn on ${squareName(front)}`;
    if (p.board[origin] !== EMPTY) return `ep ${squareName(ep)}: origin ${squareName(origin)} occupied`;
  }
  const notMoving = !p.blackToMove;
  const king = p.board.indexOf(KING | (notMoving ? BLACK : 0));
  if (isSquareAttackedBy(p, king, !notMoving)) return `side not to move (${notMoving ? "black" : "white"}) is in check`;
  return null;
}
