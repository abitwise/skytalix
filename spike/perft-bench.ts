/**
 * ABC-008 SPIKE — THROWAWAY BENCHMARK. DO NOT BUILD ON THIS.
 *
 * Measures the throughput ceiling of the hot loop a chess search runs: move
 * generation + in-place make/unmake + recursive tree walk, on the real stack
 * (TypeScript on Node).
 *
 * This is deliberately NOT correct chess. There is no legality filtering, no
 * castling, no en passant, no promotion, no check detection. Those are
 * ABC-001..ABC-005 and they are the real implementation. What is measured here
 * is the COST of the operations, not their correctness — that is the only way
 * to get the number before the generator exists.
 *
 * The result carries bias in BOTH directions, so it is a proxy and not a
 * prediction:
 *   - OPTIMISTIC — no legality filtering and no special moves, so the real
 *     generator does more work per node than this one.
 *   - PESSIMISTIC — no alpha-beta, no transposition table, no move ordering,
 *     so a real search reaches the same depth visiting far fewer nodes.
 * Report metric B (search-shaped). Metric A (classic perft) is printed only to
 * show why the widely-quoted perft nodes/sec figure must NOT be compared to an
 * engine's NFR target: it counts leaves that did no work.
 */

import os from "node:os";

// 0x88 board. Square = rank * 16 + file; off-board iff (sq & 0x88) !== 0.
// This is the representation ABC-001 is most likely to use, which is the point:
// the benchmark must pay the same indexing costs the real thing will pay.
const EMPTY = 0;
const W_PAWN = 1;
const W_KNIGHT = 2;
const W_BISHOP = 3;
const W_ROOK = 4;
const W_QUEEN = 5;
const W_KING = 6;
const BLACK = 8;

const KNIGHT_OFFSETS = [-33, -31, -18, -14, 14, 18, 31, 33];
const KING_OFFSETS = [-17, -16, -15, -1, 1, 15, 16, 17];
const BISHOP_RAYS = [-17, -15, 15, 17];
const ROOK_RAYS = [-16, -1, 1, 16];
const QUEEN_RAYS = [-17, -16, -15, -1, 1, 15, 16, 17];

/** Move packed into one int32: from | to<<7 | captured<<14. Allocation-light on purpose. */
const packMove = (from: number, to: number, captured: number): number =>
  from | (to << 7) | (captured << 14);

const moveFrom = (m: number): number => m & 0x7f;
const moveTo = (m: number): number => (m >> 7) & 0x7f;
const moveCaptured = (m: number): number => (m >> 14) & 0xf;

function startPosition(): Uint8Array {
  const b = new Uint8Array(128);
  const backRank = [W_ROOK, W_KNIGHT, W_BISHOP, W_QUEEN, W_KING, W_BISHOP, W_KNIGHT, W_ROOK];
  for (let file = 0; file < 8; file++) {
    b[file] = backRank[file] as number;
    b[16 + file] = W_PAWN;
    b[96 + file] = W_PAWN | BLACK;
    b[112 + file] = (backRank[file] as number) | BLACK;
  }
  return b;
}

const isBlack = (piece: number): boolean => (piece & BLACK) !== 0;

/**
 * Pseudo-legal-ish generation. Writes packed moves into `out` starting at 0,
 * returns the count. No legality filtering — see the file header.
 */
function generateMoves(board: Uint8Array, blackToMove: boolean, out: Int32Array): number {
  let n = 0;

  for (let from = 0; from < 128; from++) {
    if ((from & 0x88) !== 0) continue;
    const piece = board[from] as number;
    if (piece === EMPTY) continue;
    if (isBlack(piece) !== blackToMove) continue;

    const type = piece & 7;

    if (type === W_PAWN) {
      const push = blackToMove ? -16 : 16;
      const startRank = blackToMove ? 6 : 1;
      const one = from + push;
      if ((one & 0x88) === 0 && board[one] === EMPTY) {
        out[n++] = packMove(from, one, EMPTY);
        const two = one + push;
        if (from >> 4 === startRank && (two & 0x88) === 0 && board[two] === EMPTY) {
          out[n++] = packMove(from, two, EMPTY);
        }
      }
      for (const diag of blackToMove ? [-17, -15] : [15, 17]) {
        const to = from + diag;
        if ((to & 0x88) !== 0) continue;
        const target = board[to] as number;
        if (target !== EMPTY && isBlack(target) !== blackToMove) {
          out[n++] = packMove(from, to, target);
        }
      }
      continue;
    }

    if (type === W_KNIGHT || type === W_KING) {
      const offsets = type === W_KNIGHT ? KNIGHT_OFFSETS : KING_OFFSETS;
      for (const off of offsets) {
        const to = from + off;
        if ((to & 0x88) !== 0) continue;
        const target = board[to] as number;
        if (target !== EMPTY && isBlack(target) === blackToMove) continue;
        out[n++] = packMove(from, to, target);
      }
      continue;
    }

    // Sliding pieces: the expensive path, and the one worth measuring.
    const rays = type === W_BISHOP ? BISHOP_RAYS : type === W_ROOK ? ROOK_RAYS : QUEEN_RAYS;
    for (const ray of rays) {
      let to = from + ray;
      while ((to & 0x88) === 0) {
        const target = board[to] as number;
        if (target === EMPTY) {
          out[n++] = packMove(from, to, EMPTY);
        } else {
          if (isBlack(target) !== blackToMove) out[n++] = packMove(from, to, target);
          break;
        }
        to += ray;
      }
    }
  }

  return n;
}

/** Preallocated per-ply move buffers — no allocation inside the search. */
const MAX_DEPTH = 8;
const buffers: Int32Array[] = Array.from({ length: MAX_DEPTH + 1 }, () => new Int32Array(256));

/** Counts the work actually done, so the reported rate is not inflated by free leaves. */
let generationCalls = 0;

/**
 * `leavesAreFree = true`  → classic perft. Leaf nodes return immediately.
 *   Fast, but the resulting nodes/sec is INFLATED: almost every counted node did no work.
 *
 * `leavesAreFree = false` → search-shaped. Leaves also generate moves, standing in for the
 *   evaluation and quiescence work a real search pays at every leaf. This is the number that
 *   actually maps onto engine throughput.
 */
function perftLike(
  board: Uint8Array,
  blackToMove: boolean,
  depth: number,
  leavesAreFree: boolean,
): number {
  if (depth === 0) {
    if (leavesAreFree) return 1;
    // Stand-in for leaf evaluation cost. A real eval walks the board much as generation does.
    generationCalls++;
    generateMoves(board, blackToMove, buffers[0] as Int32Array);
    return 1;
  }

  const moves = buffers[depth] as Int32Array;
  generationCalls++;
  const count = generateMoves(board, blackToMove, moves);

  let nodes = 0;
  for (let i = 0; i < count; i++) {
    const m = moves[i] as number;
    const from = moveFrom(m);
    const to = moveTo(m);

    // make
    const moving = board[from] as number;
    board[to] = moving;
    board[from] = EMPTY;

    nodes += perftLike(board, !blackToMove, depth - 1, leavesAreFree);

    // unmake
    board[from] = moving;
    board[to] = moveCaptured(m);
  }

  return nodes;
}

interface Measurement {
  nodes: number;
  generations: number;
  seconds: number;
}

function measure(depth: number, leavesAreFree: boolean): Measurement {
  const board = startPosition();
  generationCalls = 0;
  const started = process.hrtime.bigint();
  const nodes = perftLike(board, false, depth, leavesAreFree);
  const seconds = Number(process.hrtime.bigint() - started) / 1e9;
  return { nodes, generations: generationCalls, seconds };
}

const rate = (n: number, seconds: number): string =>
  `${Math.round(n / seconds).toLocaleString("en-US")}/sec`;

function main(): void {
  const depth = Number(process.argv[2] ?? 5);

  // Warm the JIT so the numbers reflect steady state, not the interpreter.
  measure(3, true);
  measure(3, false);

  const bulk = measure(depth, true);
  const searchShaped = measure(depth, false);

  const cpu = os.cpus()[0]?.model ?? "UNKNOWN - verify";

  console.log("ABC-008 SPIKE — Node search throughput (THROWAWAY BENCHMARK)");
  console.log("===========================================================");
  console.log(`node       ${process.version}`);
  console.log(`platform   ${process.platform}/${process.arch}`);
  console.log(`cpu        ${cpu}`);
  console.log(`depth      ${depth}`);
  console.log("");

  console.log("A. perft-shaped (leaves free) — the CLASSIC but INFLATED metric");
  console.log(`   leaf nodes    ${bulk.nodes.toLocaleString("en-US")}`);
  console.log(`   generations   ${bulk.generations.toLocaleString("en-US")}`);
  console.log(`   elapsed       ${bulk.seconds.toFixed(3)} s`);
  console.log(`   leaf rate     ${rate(bulk.nodes, bulk.seconds)}  <-- do NOT compare to NFR`);
  console.log(`   generations   ${rate(bulk.generations, bulk.seconds)}`);
  console.log("");
  console.log("   Why inflated: ~96% of those leaf nodes generate nothing and evaluate");
  console.log("   nothing. They return 1 immediately. The rate counts free work.");
  console.log("");

  console.log("B. search-shaped (leaves evaluate) — the metric that MAPS TO AN ENGINE");
  console.log(`   nodes visited ${searchShaped.nodes.toLocaleString("en-US")}`);
  console.log(`   generations   ${searchShaped.generations.toLocaleString("en-US")}`);
  console.log(`   elapsed       ${searchShaped.seconds.toFixed(3)} s`);
  console.log(`   node rate     ${rate(searchShaped.nodes, searchShaped.seconds)}`);
  console.log("");

  const searchRate = searchShaped.nodes / searchShaped.seconds;
  const verdict = (target: number): string =>
    searchRate >= target ? "AT OR ABOVE target" : "BELOW target";

  console.log("Against the NFR targets, using metric B:");
  console.log(`   NFR-001  >= 1,000,000 nodes/sec (generation)  ${verdict(1_000_000)}`);
  console.log(`   NFR-005  >=   500,000 nodes/sec (with eval)   ${verdict(500_000)}`);
  console.log("");
  console.log("Known biases, both directions:");
  console.log("  - OPTIMISTIC: no legality filtering, no castling/en-passant/promotion.");
  console.log("    The real generator does more work per node than this one.");
  console.log("  - PESSIMISTIC: no alpha-beta pruning, no transposition table, no move");
  console.log("    ordering. A real search visits far fewer nodes to reach the same depth.");
  console.log("  Metric B is a rough proxy, not a prediction. Read it with margin.");
}

main();
