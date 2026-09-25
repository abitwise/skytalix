/**
 * PROBE (ruling-abc121-g6): confirm each g6-bite.mjs variant really took effect — the pair's full
 * keys, and the incremental key after 1. Rh2 Kd8 2. Rh1 Ke8 against the full key of the result.
 *
 * Usage: node g6-keycheck.mjs <scratch-dir>   (run g6-bite.mjs first; it builds the trees)
 */
import { join } from "node:path";

const [scratch] = process.argv.slice(2);
for (const variant of ["clean", "drop-rights", "delta-ignores-rights"]) {
  const src = join(scratch, variant, "src");
  const { parseFen } = await import(join(src, "fen.ts"));
  const z = await import(join(src, "zobrist.ts"));
  const { legalMoves } = await import(join(src, "legal.ts"));
  const { makeMove } = await import(join(src, "apply.ts"));
  const withRight = parseFen("4k3/8/8/8/8/8/8/4K1NR w K - 0 1");
  const without = parseFen("4k3/8/8/8/8/8/8/4K1NR w - - 0 1");
  // Walk h1h2 e8d8 h2h1 d8e8 incrementally from the right-carrying root.
  let key = z.zobristKey(withRight);
  const p = parseFen("4k3/8/8/8/8/8/8/4K1NR w K - 0 1");
  for (const [from, to] of [
    [0x07, 0x17],
    [0x74, 0x73],
    [0x17, 0x07],
    [0x73, 0x74],
  ]) {
    const move = legalMoves(p).find((m) => m.from === from && m.to === to);
    if (!move) throw new Error(`no move ${from}->${to}`);
    const undo = makeMove(p, move);
    key = z.zobristKeyAfterMove(key, p, move, undo);
  }
  console.log(
    JSON.stringify({
      variant,
      rootKeysDiffer: z.zobristKey(withRight) !== z.zobristKey(without),
      incrementalMatchesFull: key === z.zobristKey(p),
      afterRookRoundTripEqualsNoRightRoot: z.zobristKey(p) === z.zobristKey(without),
    }),
  );
}
