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
 * FIXED SIZE, ONE `Uint32Array` OVER ONE `SharedArrayBuffer`, NEVER A `Map` (`ADR-0025` Decision 2
 * as amended 2026-11-02 for `ABC-265`, `ABC-081` `A7`, `NFR-009`). `TABLE_ENTRIES` slots × four
 * 32-bit words — word 0 `keyLo ^ data`, word 1 `keyHi ^ score`, word 2 `data` (the packed move,
 * bound and depth), word 3 the score as an unsigned 32-bit pattern — is 16 bytes a slot, 4 MiB at
 * 2^18, allocated ONCE per process on first use and never grown. It shows in
 * `process.memoryUsage().arrayBuffers` to the byte. A 2^20 table (16 MiB) would break
 * `NFR-009`'s 16 MiB total on its own; re-levelling needs a measured need, not this constant.
 * The 64-bit key is split into its 32-bit halves here and only here, inside `probeTable` and
 * `storeEntry`; everywhere else it stays a `bigint`. A hit needs a non-zero data word and both XOR
 * equations, so a slot whose words came from two different stores reads as a miss.
 *
 * LIFETIME: ONE SEARCH (`ADR-0025` Decision 4). `clearTable` runs at every `search()` and every
 * `chooseMove` entry, so an entry spans the iterations of one move and never the next move.
 * Clearing zeroes the whole buffer: a zero data word is an empty slot, because every stored word
 * carries a non-zero bound, and a cleared table equals a freshly allocated one.
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
 * Threading: one table per process, shared by every search worker, with no lock — `ADR-0057` D2
 * (D2.3 is this layout) and the `ADR-0025` amendment of 2026-11-02 (`ABC-265`). A store writes
 * words 2, 3, 0, 1 with plain writes; a torn slot fails the XOR check. A cutoff uses the data and
 * score words the probe verified, never a second read of the slot (the verified copy, below).
 */

import type { Move } from "./moves.ts";

/** log2 of the slot count. The one constant to change for `ADR-0025` falsifier `T2`'s A/B. */
const TABLE_BITS = 18;

/** Slots in the table: 2^18. Every slot costs 16 bytes, so the table is 4 MiB. */
export const TABLE_ENTRIES = 1 << TABLE_BITS;

const INDEX_MASK = TABLE_ENTRIES - 1;
const LOW_HALF = 0xffff_ffffn;

/** The stored score is the node's exact negamax value to the stored depth. */
export const BOUND_EXACT = 1;
/** The stored score failed high: the true value is at least this. */
export const BOUND_LOWER = 2;
/** The stored score failed low: the true value is at most this. */
export const BOUND_UPPER = 3;

/**
 * Any score at or beyond `±MATE_FLOOR` is a mate score. `MATE_SCORE` is 30 000 and a mate reads
 * `±(MATE_SCORE - ply)`, with `ply` bounded by `KEY_ARRAY_CAPACITY` plus `QUIESCENCE_MAX_PLY`,
 * 136 plies, since quiescence scores a mate in check (`ABC-228`, `ADR-0053` decision 3); a static
 * evaluation is at most 10 885 cp in magnitude within legal promotion (derived from `evaluate.ts`,
 * `ADR-0059` d2's 2026-11-02 bullet, `QE-264-b`). 20 000 sits between the two with room on both
 * sides. Declared here rather than imported, because
 * `search.ts` imports this module; `src/transposition.test.ts` asserts the relation.
 */
export const MATE_FLOOR = 20_000;

// The packed word: move (17 bits) | bound << 17 (2 bits) | depth << 19 (13 bits).
const MOVE_BITS = 0x1_ffff;
const BOUND_SHIFT = 17;
const DEPTH_SHIFT = 19;

/** The one buffer, or `null` before the first `clearTable`. Four words a slot. */
let buffer: SharedArrayBuffer | null = null;
let table: Uint32Array<ArrayBufferLike> = new Uint32Array(0);

/**
 * THE VERIFIED COPY (`ADR-0025` Decision 2 as amended): the slot, data word and score word of the
 * last probe that hit, read once, by the check itself. `tableCutoff` reads these, not the slot, so
 * a store into that slot between the probe and the cutoff cannot hand this position another
 * position's depth, bound or score. Module state of the calling thread; never shared.
 */
let hitSlot = -1;
let hitData = 0;
let hitScore = 0;

/**
 * Empty the table for a new search, allocating it the first time. Called at every `search()` and
 * every `chooseMove` entry — nothing learned while choosing one move is offered to the next.
 */
export function clearTable(): void {
  hitSlot = -1;
  if (buffer === null) {
    buffer = new SharedArrayBuffer(TABLE_ENTRIES * 16);
    table = new Uint32Array(buffer);
    return;
  }
  table.fill(0);
}

/** The bytes the table holds: fixed from its first allocation, 0 before it. `A7`'s reading. */
export function tableByteLength(): number {
  return table.byteLength;
}

/**
 * The table's one `SharedArrayBuffer`, or `null` before the first `clearTable` — the handle a
 * worker pool hands to each worker once (`ABC-266`). Not an engine option and not read by any
 * recursion.
 */
export function tableBuffer(): SharedArrayBuffer | null {
  return buffer;
}

/** The slot holding THIS position — both key halves verified — or -1 when the table has none. */
export function probeTable(key: bigint): number {
  const keyLo = Number(key & LOW_HALF);
  const slot = keyLo & INDEX_MASK;
  const base = slot << 2;
  const data = table[base + 2] as number;
  if (data === 0 || ((table[base] as number) ^ data) >>> 0 !== keyLo) return -1;
  const score = table[base + 3] as number;
  if (((table[base + 1] as number) ^ score) >>> 0 !== Number(key >> 32n)) return -1;
  hitSlot = slot;
  hitData = data;
  hitScore = score | 0;
  return slot;
}

/** The entry's score, restored relative to the root of a search that probes it at `ply`. */
function restoredScore(stored: number, ply: number): number {
  if (stored >= MATE_FLOOR) return stored - ply;
  if (stored <= -MATE_FLOOR) return stored + ply;
  return stored;
}

/**
 * The entry's best move, found in `moves` (this node's legal list), or `null` if absent. A live
 * read of word 2, as before the shared layout: the move is a hint checked against the legal list.
 */
export function entryMove(slot: number, moves: readonly Move[]): Move | null {
  const packed = (table[(slot << 2) + 2] as number) & MOVE_BITS;
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
 * as `bound`, with `move` its best move. Always replaces — see the module header. Writes words 2,
 * 3, 0, 1, plain writes.
 */
export function storeEntry(
  key: bigint,
  depth: number,
  bound: number,
  score: number,
  ply: number,
  move: Move,
): void {
  const keyLo = Number(key & LOW_HALF);
  const base = (keyLo & INDEX_MASK) << 2;
  const data = packMove(move) | (bound << BOUND_SHIFT) | (depth << DEPTH_SHIFT);
  const stored = score >= MATE_FLOOR ? score + ply : score <= -MATE_FLOOR ? score - ply : score;
  table[base + 2] = data;
  table[base + 3] = stored;
  table[base] = keyLo ^ data;
  table[base + 1] = Number(key >> 32n) ^ stored;
}

/**
 * The value a table entry settles at `depth` inside `(alpha, beta)`, or `null` when it settles
 * nothing. An entry cuts ONLY at the depth it was searched to, never a deeper one: a value from a
 * deeper search is a different number, and `ABC-081` `A1` requires the table to change the work
 * and never the value. It reads the verified copy of `slot`'s last hit, never the slot again.
 */
export function tableCutoff(
  slot: number,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
): number | null {
  if (slot !== hitSlot || hitData >>> DEPTH_SHIFT !== depth) return null;
  const score = restoredScore(hitScore, ply);
  const bound = (hitData >>> BOUND_SHIFT) & 3;
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
