// qe-ABC-298-freeze: SG2 (a)'s hand cases (raw/sg2-cases.json "sg2a") against MAIN's oracle, after the hand values
// were written. Plain node, out of tree. usage:
//   node sg2-oracle.mjs <treeDir> <sg2-cases.json> [plant]
// Per case: the FEN parses (parseFen, or parseFenGrammarOnly where the case says "grammarOnly"), round-trips, and the side not to move is not in check; the bits go into the table by
// main's own storeEntry, probeTable finds the slot, and entryMove(slot, legalMoves(position)) is the oracle
// (ADR-0077 d2). The answer must equal the hand value (null, or the six fields), and the position must be
// byte-identical after (toFen, zobristKey). With "plant", every expectation is flipped (null <-> the oracle's move, a
// move <-> null) and every case must FAIL: a check on the checker. Exit 0 only if the run reads as it should.
import { readFileSync } from "node:fs";
const [tree, casesPath, mode] = process.argv.slice(2);
const { parseFen, parseFenGrammarOnly, toFen } = await import(`${tree}/src/fen.ts`);
const { zobristKey } = await import(`${tree}/src/zobrist.ts`);
const { legalMoves } = await import(`${tree}/src/legal.ts`);
const { isSquareAttackedBy } = await import(`${tree}/src/moves.ts`);
const tt = await import(`${tree}/src/transposition.ts`);
const cases = JSON.parse(readFileSync(casesPath, "utf8")).sg2a;
const plant = mode === "plant";
const six = (m) => (m ? [m.from, m.to, m.piece, m.captured, m.flags, m.promotion] : null);
let fails = 0;
const seen = new Set();
for (const c of cases) {
  if (seen.has(c.id)) throw new Error(`duplicate id ${c.id}`);
  seen.add(c.id);
  const p = c.parse === "grammarOnly" ? parseFenGrammarOnly(c.fen) : parseFen(c.fen);
  const fen0 = toFen(p);
  const key0 = zobristKey(p);
  const roundTrip = fen0 === c.fen;
  // The side NOT to move must not be in check: find its king, ask if the mover attacks it.
  const theirKing = 6 | (p.blackToMove ? 0 : 8);
  const kingSq = p.board.findIndex((x) => x === theirKing);
  const legalPos = kingSq !== -1 && !isSquareAttackedBy(p, kingSq, p.blackToMove);
  tt.clearTable();
  tt.storeEntry(key0, 1, tt.BOUND_EXACT, 0, 0, { from: c.from, to: c.to, promotion: c.promotion, piece: 0, captured: 0, flags: 0 });
  const slot = tt.probeTable(key0);
  const got = slot === -1 ? "MISS" : six(tt.entryMove(slot, legalMoves(p)));
  const pure = toFen(p) === fen0 && zobristKey(p) === key0;
  // The hand bits, re-found independently: a legal move with these three fields.
  const byFields = legalMoves(p).filter((m) => m.from === c.from && m.to === c.to && m.promotion === c.promotion).map(six);
  let expect = c.expect;
  if (plant) expect = expect === null ? (byFields[0] ?? [0, 0, 0, 0, 0, 0]) : null;
  const ok = roundTrip && legalPos && slot !== -1 && pure && JSON.stringify(got) === JSON.stringify(expect) && byFields.length === (expect === null ? 0 : 1);
  if (!ok) fails++;
  console.log(JSON.stringify({ id: c.id, ok, got, expect, roundTrip, legalPos, pure, byFields: byFields.length }));
}
console.log(`cases ${cases.length} fails ${fails} mode ${plant ? "plant" : "real"}`);
process.exit(plant ? (fails === cases.length ? 0 : 1) : fails === 0 ? 0 : 1);
