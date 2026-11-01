import sys,re
P=sys.argv[1]
def sub(f, old, new, count=1):
    s=open(f"{P}/{f}").read()
    n=s.count(old)
    assert n==count, (f, old[:60], n)
    open(f"{P}/{f}","w").write(s.replace(old,new))
# zobrist halves
sub("zobrist.ts", "export function zobristKey(position: Position): bigint {", '''const LO = (k: bigint): number => Number(k & 0xffffffffn);
const HI = (k: bigint): number => Number(k >> 32n);
const PS_LO = Uint32Array.from(PIECE_SQUARE, LO);
const PS_HI = Uint32Array.from(PIECE_SQUARE, HI);
const CK_LO = Uint32Array.from(CASTLE_KEYS, LO);
const CK_HI = Uint32Array.from(CASTLE_KEYS, HI);
const EP_LO = Uint32Array.from(EP_FILE, LO);
const EP_HI = Uint32Array.from(EP_FILE, HI);
const BTM_LO = LO(BLACK_TO_MOVE);
const BTM_HI = HI(BLACK_TO_MOVE);
export function zobristHalvesAfterMove(keys: Uint32Array, ply: number, position: Position, move: Move, undo: UndoRecord): void {
  const board = position.board;
  const i = ply << 1;
  let lo = (keys[i] as number) ^ BTM_LO;
  let hi = (keys[i + 1] as number) ^ BTM_HI;
  let x = (move.piece << 7) | move.from;
  lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
  x = ((board[move.to] as number) << 7) | move.to;
  lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
  if ((move.flags & FLAG_EN_PASSANT) !== 0) {
    x = (move.captured << 7) | enPassantCaptureSquare(move);
    lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
  } else if (undo.captured !== EMPTY) {
    x = (undo.captured << 7) | move.to;
    lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
  }
  if ((move.flags & FLAG_CASTLE) !== 0) {
    const kingside = fileOf(move.to) === 6;
    const rookFrom = kingside ? move.to + 1 : move.to - 2;
    const rookTo = kingside ? move.to - 1 : move.to + 1;
    const rook = board[rookTo] as number;
    x = (rook << 7) | rookFrom; lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
    x = (rook << 7) | rookTo; lo ^= PS_LO[x] as number; hi ^= PS_HI[x] as number;
  }
  const castlingChanged = undo.castling ^ position.castling;
  if (castlingChanged !== 0) {
    for (let c = 0; c < CASTLE_FLAGS.length; c++) {
      if ((castlingChanged & (CASTLE_FLAGS[c] as number)) !== 0) { lo ^= CK_LO[c] as number; hi ^= CK_HI[c] as number; }
    }
  }
  if (undo.epSquare !== NO_SQUARE) { x = fileOf(undo.epSquare); lo ^= EP_LO[x] as number; hi ^= EP_HI[x] as number; }
  if (position.epSquare !== NO_SQUARE) { x = fileOf(position.epSquare); lo ^= EP_LO[x] as number; hi ^= EP_HI[x] as number; }
  keys[i + 2] = lo;
  keys[i + 3] = hi;
}
export function zobristHalvesAfterNullMove(keys: Uint32Array, ply: number, undo: NullUndo): void {
  const i = ply << 1;
  let lo = (keys[i] as number) ^ BTM_LO;
  let hi = (keys[i + 1] as number) ^ BTM_HI;
  if (undo.epSquare !== NO_SQUARE) { const x = fileOf(undo.epSquare); lo ^= EP_LO[x] as number; hi ^= EP_HI[x] as number; }
  keys[i + 2] = lo;
  keys[i + 3] = hi;
}
export function setHalves(keys: Uint32Array, at: number, key: bigint): void { keys[at << 1] = LO(key); keys[(at << 1) + 1] = HI(key); }
export function zobristKey(position: Position): bigint {''')
# transposition halves
T="transposition.ts"
sub(T,"let keys: BigUint64Array | null = null;","let keys: BigUint64Array | null = null;\nlet halves = new Uint32Array(0);\nconst SLOT_MASK = TABLE_ENTRIES - 1;")
sub(T,"    keys = new BigUint64Array(TABLE_ENTRIES);\n","    keys = new BigUint64Array(0);\n    halves = new Uint32Array(TABLE_ENTRIES * 2);\n")
sub(T,"return (keys?.byteLength ?? 0) +","return (keys === null ? 0 : halves.byteLength) +")
sub(T,"/** The remaining depth", '''export function probeHalves(lo: number, hi: number): number {
  const slot = lo & SLOT_MASK;
  return words[slot] !== 0 && halves[slot << 1] === lo && halves[(slot << 1) + 1] === hi ? slot : -1;
}
export function storeHalves(lo: number, hi: number, depth: number, bound: number, score: number, ply: number, move: Move): void {
  const slot = lo & SLOT_MASK;
  halves[slot << 1] = lo;
  halves[(slot << 1) + 1] = hi;
  words[slot] = packMove(move) | (bound << BOUND_SHIFT) | (depth << DEPTH_SHIFT);
  scores[slot] = score >= MATE_FLOOR ? score + ply : score <= -MATE_FLOOR ? score - ply : score;
}
/** The remaining depth''')
# engine
E="engine.ts"
sub(E,"  probeTable,\n","  probeHalves,\n")
sub(E,"  storeEntry,\n","  storeHalves,\n")
sub(E,'import { zobristKey, zobristKeyAfterMove, zobristKeyAfterNullMove } from "./zobrist.ts";','import { setHalves, zobristHalvesAfterMove, zobristHalvesAfterNullMove, zobristKey } from "./zobrist.ts";')
sub(E,"  readonly keys: BigUint64Array;","  readonly keys: Uint32Array;")
sub(E,"  readonly prior: readonly bigint[];\n}","  readonly prior: Uint32Array;\n}")
sub(E,'''function repeatsBeforeRoot(
  prior: readonly bigint[],
  key: bigint,
  ply: number,
  halfmoveClock: number,
): boolean {
  const oldest = Math.max(ply - halfmoveClock, -Math.min(prior.length, PRIOR_KEYS_WINDOW));
  let matches = 0;
  for (let earlier = Math.min(ply - 4, (ply & 1) - 2); earlier >= oldest; earlier -= 2) {
    if (prior[prior.length + earlier] === key && ++matches === 2) return true;
  }
  return false;
}''','''function repeatsInPathH(keys: Uint32Array, ply: number, halfmoveClock: number): boolean {
  const lo = keys[ply << 1] as number;
  const hi = keys[(ply << 1) + 1] as number;
  const oldest = Math.max(0, ply - halfmoveClock);
  for (let earlier = ply - 4; earlier >= oldest; earlier -= 2) {
    if (keys[earlier << 1] === lo && keys[(earlier << 1) + 1] === hi) return true;
  }
  return false;
}
function repeatsBeforeRoot(
  prior: Uint32Array,
  keys: Uint32Array,
  ply: number,
  halfmoveClock: number,
): boolean {
  const n = prior.length >> 1;
  const lo = keys[ply << 1] as number;
  const hi = keys[(ply << 1) + 1] as number;
  const oldest = Math.max(ply - halfmoveClock, -Math.min(n, PRIOR_KEYS_WINDOW));
  let matches = 0;
  for (let earlier = Math.min(ply - 4, (ply & 1) - 2); earlier >= oldest; earlier -= 2) {
    const j = (n + earlier) << 1;
    if (prior[j] === lo && prior[j + 1] === hi && ++matches === 2) return true;
  }
  return false;
}''')
sub(E,'''  const key = keys[ply] as bigint;
  // `ABC-230`''','''  const klo = keys[ply << 1] as number;
  const khi = keys[(ply << 1) + 1] as number;
  // `ABC-230`''')
sub(E,'''    repeatsInPath(keys, ply, position.halfmoveClock) ||
    repeatsBeforeRoot(budget.prior, key, ply, position.halfmoveClock)''','''    repeatsInPathH(keys, ply, position.halfmoveClock) ||
    repeatsBeforeRoot(budget.prior, keys, ply, position.halfmoveClock)''')
sub(E,"  const slot = probeTable(key);","  const slot = probeHalves(klo, khi);")
sub(E,"        keys[ply + 1] = zobristKeyAfterNullMove(key, nullUndo);","        zobristHalvesAfterNullMove(keys, ply, nullUndo);")
sub(E,"      keys[ply + 1] = zobristKeyAfterMove(key, position, move, undo);","      zobristHalvesAfterMove(keys, ply, position, move, undo);")
sub(E,"  storeEntry(key, remaining,","  storeHalves(klo, khi, remaining,")
sub(E,'''  const rootKey = budget.keys[0] as bigint;
  const slot = probeTable(rootKey);''','''  const slot = probeHalves(budget.keys[0] as number, budget.keys[1] as number);''')
sub(E,"      budget.keys[1] = zobristKeyAfterMove(rootKey, position, move, undo);","      zobristHalvesAfterMove(budget.keys, 0, position, move, undo);")
sub(E,"  storeEntry(rootKey, remaining, BOUND_EXACT,","  storeHalves(budget.keys[0] as number, budget.keys[1] as number, remaining, BOUND_EXACT,")
sub(E,"    keys: new BigUint64Array(KEY_ARRAY_CAPACITY + 1),\n    prior: heuristics.priorKeys ? (options.priorKeys ?? NO_PRIOR_KEYS) : NO_PRIOR_KEYS,",
"    keys: new Uint32Array((KEY_ARRAY_CAPACITY + 1) * 2),\n    prior: toHalves(heuristics.priorKeys ? (options.priorKeys ?? NO_PRIOR_KEYS) : NO_PRIOR_KEYS),")
sub(E,"  budget.keys[0] = zobristKey(position);","  setHalves(budget.keys, 0, zobristKey(position));")
sub(E,"/** Thrown from inside the recursion","function toHalves(keys: readonly bigint[]): Uint32Array {\n  const out = new Uint32Array(keys.length * 2);\n  for (let i = 0; i < keys.length; i++) setHalves(out, i, keys[i] as bigint);\n  return out;\n}\n\n/** Thrown from inside the recursion")
