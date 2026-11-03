/**
 * `ABC-239` (`ADR-0067` decisions 4 and 5): the tracer. It re-implements `src/evaluate.ts`'s term
 * counts, so a position becomes white-minus-black counts per term, the net mobility count m and
 * the phase w. The evaluation is then linear in the table:
 *
 *   model = (w / 24) · (c · θ_mg + clamp(W_mg · m)) + ((24 − w) / 24) · (c · θ_eg + clamp(W_eg · m))
 *
 * `src/evaluate.ts` computes mg + trunc(Δ · (24 − w) / 24) from the same integer sums, so the two
 * differ by under 1 cp, and are equal where w = 24. The identity gate (`gateMiss`) holds the tracer
 * to that on every row before any fit. `src/` gains no tracing code (`ABC-239` A3).
 */
import * as P from "../../src/evaluate-params.ts";
import {
  BISHOP,
  BLACK,
  EMPTY,
  KING,
  KNIGHT,
  PAWN,
  type Position,
  ROOK,
} from "../../src/position.ts";

/** Term layout: each term index has an mg and an eg parameter. */
export const T_MAT = 0; // + pieceType − 1, pawn … queen
export const T_PST = 5; // + (pieceType − 1) × 64 + table index
export const T_PASS = 389; // + own rank index − 1 (PASSED index 1 … 6)
export const T_DBL = 395;
export const T_ISO = 396;
export const T_SHEL = 397;
export const T_HALF = 398;
export const T_OPEN = 399;
export const N_TERMS = 400;

export const PST_NAMES = ["pawn", "knight", "bishop", "rook", "queen", "king"] as const;

const BLACK_PAWN = PAWN | BLACK;
const KNIGHT_STEPS = [33, 31, 18, 14, -14, -18, -31, -33];
const KING_STEPS = [17, 16, 15, 1, -1, -15, -16, -17];
const RAYS = [17, 15, -15, -17, 16, 1, -1, -16];

function reached(b: Uint8Array, sq: number, piece: number): number {
  const t = piece & 7;
  const black = (piece & BLACK) !== 0;
  let n = 0;
  if (t === KNIGHT || t === KING) {
    for (const s of t === KNIGHT ? KNIGHT_STEPS : KING_STEPS) {
      const to = sq + s;
      if ((to & 0x88) !== 0) continue;
      const x = b[to] as number;
      if (x === EMPTY || ((x & BLACK) !== 0) !== black) n++;
    }
    return n;
  }
  const from = t === ROOK ? 4 : 0;
  const to = t === BISHOP ? 4 : 8;
  for (let i = from; i < to; i++) {
    const r = RAYS[i] as number;
    for (let a = sq + r; (a & 0x88) === 0; a += r) {
      const x = b[a] as number;
      if (x === EMPTY) {
        n++;
        continue;
      }
      if (((x & BLACK) !== 0) !== black) n++;
      break;
    }
  }
  return n;
}

function passed(b: Uint8Array, sq: number): boolean {
  const p = b[sq] as number;
  const enemy = p ^ BLACK;
  const step = (p & BLACK) !== 0 ? -1 : 1;
  const f = sq & 7;
  const f0 = f === 0 ? 0 : f - 1;
  const f1 = f === 7 ? 7 : f + 1;
  for (let r = (sq >> 4) + step; r >= 1 && r <= 6; r += step) {
    for (let x = f0; x <= f1; x++) if (b[r * 16 + x] === enemy) return false;
  }
  return true;
}

/** Per file of the king's file and its neighbours: [shelter missing, half-open, open] counts. */
function exposure(b: Uint8Array, k: number, own: number, en: number, step: number): number[] {
  const kf = k & 7;
  const r1 = (k >> 4) + step;
  const r2 = r1 + step;
  const f0 = kf === 0 ? 0 : kf - 1;
  const f1 = kf === 7 ? 7 : kf + 1;
  let shelter = 0;
  let half = 0;
  let open = 0;
  for (let f = f0; f <= f1; f++) {
    const ok =
      (r1 >= 0 && r1 <= 7 && b[r1 * 16 + f] === own) ||
      (r2 >= 0 && r2 <= 7 && b[r2 * 16 + f] === own);
    if (!ok) shelter++;
    let o = false;
    let e = false;
    for (let r = 1; r <= 6; r++) {
      const x = b[r * 16 + f];
      if (x === own) o = true;
      else if (x === en) e = true;
    }
    if (!o) {
      if (e) half++;
      else open++;
    }
  }
  return [shelter, half, open];
}

/** One traced position: sparse (term, count) pairs, white minus black, in term order. */
export interface Trace {
  readonly f: number[];
  readonly m: number;
  readonly w: number;
}

export function trace(position: Position): Trace {
  const b = position.board;
  const c = new Int32Array(N_TERMS);
  let m = 0;
  let phase = 0;
  let wk = -1;
  let bk = -1;
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const sq = rank * 16 + file;
      const p = b[sq] as number;
      if (p === EMPTY) continue;
      const t = p & 7;
      const black = (p & BLACK) !== 0;
      const s = black ? -1 : 1;
      const idx = (black ? rank : 7 - rank) * 8 + file;
      if (t !== KING) c[T_MAT + t - 1] = (c[T_MAT + t - 1] as number) + s;
      c[T_PST + (t - 1) * 64 + idx] = (c[T_PST + (t - 1) * 64 + idx] as number) + s;
      if (t === PAWN) continue;
      m += s * reached(b, sq, p);
      if (t === KING) {
        if (black) bk = sq;
        else wk = sq;
      } else phase += P.PHASE_WEIGHT[t] as number;
    }
  }
  let wf = 0;
  let bf = 0;
  for (let r = 1; r <= 6; r++) {
    for (let f = 0; f < 8; f++) {
      const x = b[r * 16 + f];
      const bit = 1 << f;
      if (x === PAWN) {
        if ((wf & bit) !== 0) c[T_DBL] = (c[T_DBL] as number) - 1;
        wf |= bit;
      } else if (x === BLACK_PAWN) {
        if ((bf & bit) !== 0) c[T_DBL] = (c[T_DBL] as number) + 1;
        bf |= bit;
      }
    }
  }
  const adj = (f: number): number => (((1 << f) << 1) | ((1 << f) >> 1)) & 0xff;
  for (let r = 1; r <= 6; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = r * 16 + f;
      const x = b[sq];
      if (x === PAWN) {
        if ((wf & adj(f)) === 0) c[T_ISO] = (c[T_ISO] as number) - 1;
        if (passed(b, sq)) c[T_PASS + r - 1] = (c[T_PASS + r - 1] as number) + 1;
      } else if (x === BLACK_PAWN) {
        if ((bf & adj(f)) === 0) c[T_ISO] = (c[T_ISO] as number) + 1;
        if (passed(b, sq)) c[T_PASS + (7 - r) - 1] = (c[T_PASS + (7 - r) - 1] as number) - 1;
      }
    }
  }
  const eb = exposure(b, bk, BLACK_PAWN, PAWN, -1);
  const ew = exposure(b, wk, PAWN, BLACK_PAWN, 1);
  c[T_SHEL] = (c[T_SHEL] as number) + (eb[0] as number) - (ew[0] as number);
  c[T_HALF] = (c[T_HALF] as number) + (eb[1] as number) - (ew[1] as number);
  c[T_OPEN] = (c[T_OPEN] as number) + (eb[2] as number) - (ew[2] as number);
  const f: number[] = [];
  for (let t = 0; t < N_TERMS; t++) if (c[t] !== 0) f.push(t, c[t] as number);
  return { f, m, w: phase > 24 ? 24 : phase };
}

/** A table as vectors over the 400 terms, plus mobility's weights and cap. */
export interface Table {
  readonly mg: Float64Array;
  readonly eg: Float64Array;
  readonly wmg: number;
  readonly weg: number;
  readonly cap: number;
}

type Params = typeof P;

/** `src/evaluate-params.ts`'s shape read into term vectors. Penalties keep their positive value. */
export function tableOf(params: Params): Table {
  const mg = new Float64Array(N_TERMS);
  const eg = new Float64Array(N_TERMS);
  for (let t = 1; t <= 5; t++) {
    mg[T_MAT + t - 1] = params.MATERIAL.mg[t] as number;
    eg[T_MAT + t - 1] = params.MATERIAL.eg[t] as number;
  }
  PST_NAMES.forEach((name, i) => {
    for (let s = 0; s < 64; s++) {
      mg[T_PST + i * 64 + s] = params.PST[name].mg[s] as number;
      eg[T_PST + i * 64 + s] = params.PST[name].eg[s] as number;
    }
  });
  for (let r = 1; r <= 6; r++) {
    mg[T_PASS + r - 1] = params.PASSED.mg[r] as number;
    eg[T_PASS + r - 1] = params.PASSED.eg[r] as number;
  }
  const scalars: Array<[number, { readonly mg: number; readonly eg: number }]> = [
    [T_DBL, params.DOUBLED],
    [T_ISO, params.ISOLATED],
    [T_SHEL, params.KING_SHELTER_MISSING],
    [T_HALF, params.KING_FILE_HALF_OPEN],
    [T_OPEN, params.KING_FILE_OPEN],
  ];
  for (const [t, pair] of scalars) {
    mg[t] = pair.mg;
    eg[t] = pair.eg;
  }
  return {
    mg,
    eg,
    wmg: params.MOBILITY_WEIGHT.mg,
    weg: params.MOBILITY_WEIGHT.eg,
    cap: params.MOBILITY_CAP.mg,
  };
}

/** The shipped table, as `src/evaluate.ts` reads it now. */
export const SHIPPED: Table = tableOf(P);

/**
 * The penalties (doubled, isolated, the king-file terms) count −1 for a white defect, so their
 * positive value enters with the count's sign and the model adds c · θ for every term alike.
 */
export function model(f: readonly number[], m: number, w: number, th: Table): number {
  let a = 0;
  let e = 0;
  for (let i = 0; i < f.length; i += 2) {
    const t = f[i] as number;
    const c = f[i + 1] as number;
    a += (th.mg[t] as number) * c;
    e += (th.eg[t] as number) * c;
  }
  a += Math.max(-th.cap, Math.min(th.cap, th.wmg * m));
  e += Math.max(-th.cap, Math.min(th.cap, th.weg * m));
  return (w * a + (24 - w) * e) / 24;
}

/**
 * The identity gate (`ADR-0067` d5): a miss is |model − evaluate| ≥ 1, or any difference at w = 24.
 * `evaluateWhite` is `evaluate` from WHITE's side.
 */
export function gateMiss(t: Trace, evaluateWhite: number, th: Table): { miss: boolean; d: number } {
  const d = Math.abs(model(t.f, t.m, t.w, th) - evaluateWhite);
  return { miss: !(d < 1) || (t.w === 24 && d !== 0), d };
}
