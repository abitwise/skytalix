// ABC-010 design hop: run every FEN literal in <tree>/src and <tree>/spike through today's parseFen,
// then through a PROTOTYPE of the page's semantic rules (this script only; nothing in src/ changes).
// Usage: node fen-corpus.mjs <tree>
import { readdirSync, readFileSync, statSync } from "node:fs";
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
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

const RE = /([pnbrqkPNBRQK1-8]{1,8}(?:\/[pnbrqkPNBRQK1-8]{1,8}){7})\s+([wb])\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d+)/g;
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const f = `${d}/${n}`; if (statSync(f).isDirectory()) { if (n !== "__snapshots__") walk(f); } else if (n.endsWith(".ts") || n.endsWith(".json")) files.push(f); } };
walk(`${tree}/src`); walk(`${tree}/spike`);
let seen = 0, accepted = 0, gramRejected = 0; const unique = new Map(); const rejects = [];
for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(RE)) {
      seen++;
      const fen = m[0].replace(/\s+/g, " ");
      let p; try { p = parseFen(fen); } catch { gramRejected++; continue; }
      accepted++;
      const fault = semanticFault(fen.split(" "), p);
      if (!unique.has(fen)) unique.set(fen, fault);
      if (fault) rejects.push(`${f.slice(tree.length + 1)}:${i + 1}  ${fault}  ::  ${fen.slice(0, 70)}`);
    }
  });
}
console.log(`files scanned ${files.length}; FEN-shaped literals ${seen}; parse today ${accepted}; grammar-rejected today ${gramRejected}`);
console.log(`unique accepted FENs ${unique.size}; semantically rejected by prototype ${[...unique.values()].filter(Boolean).length}`);
console.log(`occurrences rejected: ${rejects.length}`);
for (const r of rejects) console.log("  " + r);
