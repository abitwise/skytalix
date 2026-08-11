/**
 * Re-verification of the TWO load-bearing premises of the ABC-028 A4 blocker.
 * ESM, strict mode by construction (this is a module).
 */
import { newGame, playMove } from "../src/history.ts";
import { legalMoves } from "../src/legal.ts";
import type { Move } from "../src/moves.ts";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

console.log("node", process.version, "| module strict mode:", (function () {
  return this === undefined;
})());

// ---------------------------------------------------------------- PREMISE 1
console.log("\n=== PREMISE 1: Object.freeze on a Uint8Array view ===");
for (const n of [0, 1, 8, 128]) {
  try {
    Object.freeze(new Uint8Array(n));
    console.log(`  Uint8Array(${n})   -> frozen OK, isFrozen=${Object.isFrozen(new Uint8Array(n))}`);
  } catch (error) {
    console.log(`  Uint8Array(${n})   -> THROWS ${(error as Error).constructor.name}: ${(error as Error).message}`);
  }
}

// The real board object from the real code path.
const h1 = newGame(START_FEN);
console.log(`  history.position.board is ${h1.position.board.constructor.name}(${h1.position.board.length})`);
try {
  Object.freeze(h1.position.board);
  console.log("  freeze(history.position.board) -> OK (premise 1 REFUTED)");
} catch (error) {
  console.log(`  freeze(history.position.board) -> THROWS ${(error as Error).constructor.name}: ${(error as Error).message}`);
}

// ---------------------------------------------------------------- PREMISE 2
console.log("\n=== PREMISE 2: freezing history.moves leaves the SLOT writable ===");
const h2 = newGame(START_FEN);
const first = legalMoves(h2.position)[0] as Move;
playMove(h2, first);
Object.freeze(h2.moves);
console.log(`  Object.isFrozen(h2.moves) = ${Object.isFrozen(h2.moves)}`);
console.log(`  descriptor of the 'moves' SLOT = ${JSON.stringify(
  Object.getOwnPropertyDescriptor(h2, "moves"),
  (_k, v) => (Array.isArray(v) ? `[Array(${v.length})]` : v),
)}`);

// contents: must throw (this is what A9 buys)
try {
  (h2.moves as Move[]).push(first);
  console.log("  contents  h2.moves.push(...) -> SUCCEEDED (A9's freeze is a no-op?!)");
} catch (error) {
  console.log(`  contents  h2.moves.push(...) -> THROWS ${(error as Error).constructor.name} (A9's freeze bites)`);
}

// slot: WMOVESWAP mechanically
const saved = h2.moves;
try {
  (h2 as { moves: readonly Move[] }).moves = [...h2.moves];
  const swapped = h2.moves !== saved;
  console.log(`  SLOT      h2.moves = [...] -> SUCCEEDED, slot swapped=${swapped}, new array frozen=${Object.isFrozen(h2.moves)}`);
  (h2 as { moves: readonly Move[] }).moves = saved;
  console.log(`  SLOT      restored -> h2.moves === original: ${h2.moves === saved}`);
} catch (error) {
  console.log(`  SLOT      h2.moves = [...] -> THROWS ${(error as Error).constructor.name}: ${(error as Error).message} (premise 2 REFUTED)`);
}

// and initialFen, for completeness — the fourth slot the ticket names
const savedFen = h2.initialFen;
try {
  (h2 as { initialFen: string }).initialFen = "8/8/8/8/8/8/8/8 w - - 0 1";
  console.log(`  SLOT      h2.initialFen = ... -> SUCCEEDED (now ${h2.initialFen === savedFen ? "same" : "different"})`);
  (h2 as { initialFen: string }).initialFen = savedFen;
} catch (error) {
  console.log(`  SLOT      h2.initialFen = ... -> THROWS ${(error as Error).message}`);
}
