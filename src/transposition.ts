/**
 * ABC-081 — the transposition table, `ADR-0025`'s fixed-size structure.
 *
 * WHAT IT IS. One entry per slot: the position's full 64-bit Zobrist key (a hit is VERIFIED
 * against it, never assumed from the index), the remaining depth it was searched to, the bound
 * that score is (exact, lower, upper), the score, and the best move found — which `ABC-080`'s
 * comparator tries first as the hash move. It is keyed on the VALUE read from the recursion's
 * per-ply key array (`ADR-0002` clause 3, `ADR-0020` Decision 3) and shares nothing else with
 * that array: not its storage, not its seeding, not its lifetime (`ADR-0025` Decision 1).
 *
 * FIXED SIZE, TYPED ARRAYS, NEVER A `Map` (`ADR-0025` Decision 2, `ABC-081` `A7`, `NFR-009`).
 * `TABLE_ENTRIES` slots × 16 bytes — an 8-byte key, a 4-byte packed word, a 4-byte score — is
 * 4 MiB at 2^18, allocated ONCE per process on first use and never grown. It shows in
 * `process.memoryUsage().arrayBuffers` to the byte. A 2^20 table (16 MiB) would break
 * `NFR-009`'s 16 MiB total on its own; re-levelling needs a measured need, not this constant.
 *
 * LIFETIME: ONE SEARCH (`ADR-0025` Decision 4). `clearTable` runs at every `search()` and every
 * `chooseMove` entry, so an entry spans the iterations of one move and never the next move.
 * Clearing zeroes the packed words only: a zero word is an empty slot, because every stored word
 * carries a non-zero bound.
 *
 * REPLACEMENT POLICY — ALWAYS REPLACE. A store overwrites whatever its slot held, whichever
 * position and whatever depth. The table lives for one move, so there is no stale generation to
 * age out, and the newest entry is the one the current iteration is about to want again. Stated
 * here because `ABC-081`'s Scope requires it stated in the delivered code; `ADR-0025` falsifier
 * `T2` is the measurement that would change it (or the size).
 *
 * MATE SCORES ARE STORED RELATIVE TO THE NODE AND RESTORED RELATIVE TO THE ROOT (`ADR-0025`
 * Decision 3, `ABC-081` `A4`). The search reports a mate `ply` plies from the root as
 * `±(MATE_SCORE - ply)`. Stored as-is, that number would be wrong at every OTHER ply the same
 * position is reached at — the classic table bug that makes an engine claim mates that are not
 * there. So a store at `ply` moves a mate score `ply` plies further from zero (distance from the
 * node) and a probe at `ply` moves it back (distance from the root).
 *
 * Only full-width nodes probe and store it; quiescence does neither (`ADR-0025` Decision 5).
 * Single-threaded, like the search that owns it; threading stays `UNKNOWN - verify`.
 */

import type { Move } from "./moves.ts";

/** log2 of the slot count. The one constant to change for `ADR-0025` falsifier `T2`'s A/B. */
const TABLE_BITS = 18;

/** Slots in the table: 2^18. Every slot costs 16 bytes, so the table is 4 MiB. */
export const TABLE_ENTRIES = 1 << TABLE_BITS;

const INDEX_MASK = BigInt(TABLE_ENTRIES - 1);

/** The stored score is the node's exact negamax value to the stored depth. */
export const BOUND_EXACT = 1;
/** The stored score failed high: the true value is at least this. */
export const BOUND_LOWER = 2;
/** The stored score failed low: the true value is at most this. */
export const BOUND_UPPER = 3;

/**
 * Any score at or beyond `±MATE_FLOOR` is a mate score. `search.ts`'s `MATE_SCORE` is 30 000 and
 * a mate reads `±(MATE_SCORE - ply)`, with `ply` bounded by `KEY_ARRAY_CAPACITY` plus the
 * quiescence plies; a static evaluation is under 10 000 (a full board of queens). 20 000 sits
 * between the two with room on both sides. Declared here rather than imported, because
 * `search.ts` imports this module; `src/transposition.test.ts` asserts the relation.
 */
export const MATE_FLOOR = 20_000;

// The packed word: move (17 bits) | bound << 17 (2 bits) | depth << 19 (13 bits).
const MOVE_BITS = 0x1_ffff;
const BOUND_SHIFT = 17;
const DEPTH_SHIFT = 19;

let keys: BigUint64Array | null = null;
let words = new Uint32Array(0);
let scores = new Int32Array(0);

/**
 * Empty the table for a new search, allocating it the first time. Called at every `search()` and
 * every `chooseMove` entry — nothing learned while choosing one move is offered to the next.
 */
export function clearTable(): void {
  if (keys === null) {
    keys = new BigUint64Array(TABLE_ENTRIES);
    words = new Uint32Array(TABLE_ENTRIES);
    scores = new Int32Array(TABLE_ENTRIES);
    return;
  }
  words.fill(0);
}

/** The bytes the table holds: fixed from its first allocation, 0 before it. `A7`'s reading. */
export function tableByteLength(): number {
  return (keys?.byteLength ?? 0) + words.byteLength + scores.byteLength;
}

/** The slot holding THIS position — its full key verified — or -1 when the table has none. */
export function probeTable(key: bigint): number {
  const slot = Number(key & INDEX_MASK);
  return words[slot] !== 0 && (keys as BigUint64Array)[slot] === key ? slot : -1;
}

/** The remaining depth the entry in `slot` was searched to. */
function entryDepth(slot: number): number {
  return (words[slot] as number) >>> DEPTH_SHIFT;
}

/** `BOUND_EXACT`, `BOUND_LOWER` or `BOUND_UPPER`. */
function entryBound(slot: number): number {
  return ((words[slot] as number) >>> BOUND_SHIFT) & 3;
}

/** The entry's score, restored relative to the root of a search that probes it at `ply`. */
function entryScore(slot: number, ply: number): number {
  const stored = scores[slot] as number;
  if (stored >= MATE_FLOOR) return stored - ply;
  if (stored <= -MATE_FLOOR) return stored + ply;
  return stored;
}

/** The entry's best move, found in `moves` (this node's legal list), or `null` if absent. */
export function entryMove(slot: number, moves: readonly Move[]): Move | null {
  const packed = (words[slot] as number) & MOVE_BITS;
  for (const move of moves) {
    if (packMove(move) === packed) return move;
  }
  return null;
}

/** From and to are 0x88 squares (7 bits each); the promotion is a piece type (3 bits). */
function packMove(move: Move): number {
  return move.from | (move.to << 7) | (move.promotion << 14);
}

/**
 * Record a full-width node's result: searched to `depth`, scoring `score` at `ply` from the root,
 * as `bound`, with `move` its best move. Always replaces — see the module header.
 */
export function storeEntry(
  key: bigint,
  depth: number,
  bound: number,
  score: number,
  ply: number,
  move: Move,
): void {
  const slot = Number(key & INDEX_MASK);
  (keys as BigUint64Array)[slot] = key;
  words[slot] = packMove(move) | (bound << BOUND_SHIFT) | (depth << DEPTH_SHIFT);
  scores[slot] = score >= MATE_FLOOR ? score + ply : score <= -MATE_FLOOR ? score - ply : score;
}

/**
 * The value a table entry settles at `depth` inside `(alpha, beta)`, or `null` when it settles
 * nothing. An entry cuts ONLY at the depth it was searched to, never a deeper one: a value from a
 * deeper search is a different number, and `ABC-081` `A1` requires the table to change the work
 * and never the value.
 */
export function tableCutoff(
  slot: number,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
): number | null {
  if (entryDepth(slot) !== depth) return null;
  const score = entryScore(slot, ply);
  const bound = entryBound(slot);
  if (bound === BOUND_EXACT) return score;
  if (bound === BOUND_LOWER && score >= beta) return score;
  if (bound === BOUND_UPPER && score <= alpha) return score;
  return null;
}

/** The bound a fail-soft `best` is, against the window `(alphaIn, beta)` the node was entered with. */
export function boundOf(best: number, alphaIn: number, beta: number): number {
  if (best <= alphaIn) return BOUND_UPPER;
  if (best >= beta) return BOUND_LOWER;
  return BOUND_EXACT;
}
