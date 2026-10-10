// ABC-127: do the NEW puzzle rows pass ADR-0033 / ABC-010's six parseFen rules? Independent of src/
// (QE's move generator via curation/oracle.mjs). Reads the corpus by import (data only).
// Run from the worktree root: node .grugops/context/ticket-to-pr-ABC-127/probe/adr0033-rows.mjs
import { parse, otherInCheck } from "./curation/oracle.mjs";
const { PUZZLES } = await import(`${process.cwd()}/src/puzzle-corpus.ts`);
let bad = 0;
const rows = PUZZLES.map((p, i) => ({ p, i }));
for (const { p, i } of rows) {
  const f = p.fen.split(" ");
  const pos = parse(p.fen);
  const back = [0, 7].some((r) => [...Array(8).keys()].some((c) => pos.board[r * 16 + c].toLowerCase() === "p"));
  const kings = pos.board.filter((x) => x === "K").length === 1 && pos.board.filter((x) => x === "k").length === 1;
  const fails = [
    typeof p.fen !== "string" && "non-string",
    back && "pawn on rank 1/8",
    f[2] !== "-" && "castling rights present (checked by hand: none expected)",
    f[3] !== "-" && "en-passant square present",
    !(String(Number(f[4])) === f[4] && String(Number(f[5])) === f[5]) && "clock round trip",
    otherInCheck(pos) && "side not to move in check",
    !kings && "kings",
  ].filter(Boolean);
  if (fails.length) { if (p.tags) bad++; console.log(`${p.tags ? "NEW" : "old"} row ${i} FAILS: ${fails.join(", ")} — ${p.name}`); }
}
const added = PUZZLES.filter((p) => p.tags).length;
console.log(`new rows ${added}: ${bad === 0 ? "ALL PASS the six rules" : `${bad} FAIL`}`);
