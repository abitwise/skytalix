// SCRATCH PROTOTYPE (arch-ABC-239): the E2 tuner's data stage. PREREG `…9ed1db11`.
// Usage: node extract.ts <e1 src dir> <out.jsonl> <pgn files...>
// Reads own self-play PGNs, keeps quiet non-book positions, traces the evaluation into per-term
// white-minus-black counts, and checks the identity gate G-P1 against the engine's evaluate.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const [srcDir, outPath, ...pgns] = process.argv[1]?.endsWith("extract.ts") ? process.argv.slice(2) : [process.argv[2]!];
const imp = (m: string) => import(`${srcDir}/${m}`);
const { makeMove } = await imp("apply.ts");
const { parseFen, toFen } = await imp("fen.ts");
const { isInCheck } = await imp("legal.ts");
const { quiesce } = await imp("quiescence.ts");
const { evaluate } = await imp("evaluate.ts");
const { parseSan } = await imp("san.ts");
const P = await imp("evaluate-params.ts");

const EMPTY = 0, PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, KING = 6, BLACK = 8;
const BP = PAWN | BLACK;
const pt = (p: number) => p & 7;
const isB = (p: number) => (p & BLACK) !== 0;
const KN = [33, 31, 18, 14, -14, -18, -31, -33];
const KG = [17, 16, 15, 1, -1, -15, -16, -17];
const RAYS = [17, 15, -15, -17, 16, 1, -1, -16];

// Term layout (each term has an mg and an eg parameter).
export const T_MAT = 0; // +type-1, P..Q
export const T_PST = 5; // + (type-1)*64 + idx
export const T_PASS = 389; // + rank-1
export const T_DBL = 395, T_ISO = 396, T_SHEL = 397, T_HALF = 398, T_OPEN = 399;
export const T_SHELQ = 400, T_HALFQ = 401, T_OPENQ = 402; // arch-ABC-270 D5: queen-on exposure counts
export const N_TERMS = 403;

function reached(b: Uint8Array, sq: number, piece: number): number {
  const t = pt(piece), bl = isB(piece);
  let n = 0;
  if (t === KNIGHT || t === KING) {
    for (const s of t === KNIGHT ? KN : KG) {
      const to = sq + s;
      if (to & 0x88) continue;
      const x = b[to] as number;
      if (x === EMPTY || isB(x) !== bl) n++;
    }
    return n;
  }
  const from = t === ROOK ? 4 : 0, to = t === BISHOP ? 4 : 8;
  for (let i = from; i < to; i++) {
    const r = RAYS[i] as number;
    for (let a = sq + r; (a & 0x88) === 0; a += r) {
      const x = b[a] as number;
      if (x === EMPTY) { n++; continue; }
      if (isB(x) !== bl) n++;
      break;
    }
  }
  return n;
}

function passed(b: Uint8Array, sq: number): boolean {
  const p = b[sq] as number, enemy = p ^ BLACK, step = isB(p) ? -1 : 1, f = sq & 7;
  const f0 = f === 0 ? 0 : f - 1, f1 = f === 7 ? 7 : f + 1;
  for (let r = (sq >> 4) + step; r >= 1 && r <= 6; r += step)
    for (let x = f0; x <= f1; x++) if (b[r * 16 + x] === enemy) return false;
  return true;
}

function exposure(b: Uint8Array, k: number, own: number, en: number, step: number): [number, number, number] {
  const kf = k & 7, r1 = (k >> 4) + step, r2 = r1 + step;
  const f0 = kf === 0 ? 0 : kf - 1, f1 = kf === 7 ? 7 : kf + 1;
  let shel = 0, half = 0, open = 0;
  for (let f = f0; f <= f1; f++) {
    const ok = (r1 >= 0 && r1 <= 7 && b[r1 * 16 + f] === own) || (r2 >= 0 && r2 <= 7 && b[r2 * 16 + f] === own);
    if (!ok) shel++;
    let o = false, e = false;
    for (let r = 1; r <= 6; r++) { const x = b[r * 16 + f]; if (x === own) o = true; else if (x === en) e = true; }
    if (!o) { if (e) half++; else open++; }
  }
  return [shel, half, open];
}

/** Trace: sparse counts (term -> white-minus-black count), mobility net m, phase w. */
export function trace(pos: { board: Uint8Array }) {
  const b = pos.board;
  const c = new Map<number, number>();
  const add = (k: number, v: number) => c.set(k, (c.get(k) ?? 0) + v);
  let m = 0, phase = 0, wk = -1, bk = -1, wq = false, bq = false;
  for (let rank = 7; rank >= 0; rank--) for (let file = 0; file < 8; file++) {
    const sq = rank * 16 + file, p = b[sq] as number;
    if (p === EMPTY) continue;
    const t = pt(p), bl = isB(p), s = bl ? -1 : 1;
    const idx = (bl ? rank : 7 - rank) * 8 + file;
    if (t !== KING) add(T_MAT + t - 1, s);
    add(T_PST + (t - 1) * 64 + idx, s);
    if (t === PAWN) continue;
    m += s * reached(b, sq, p);
    if (t === 5) { if (bl) bq = true; else wq = true; }
    if (t === KING) { if (bl) bk = sq; else wk = sq; } else phase += P.PHASE_WEIGHT[t];
  }
  // pawn structure
  let wf = 0, bf = 0;
  for (let r = 1; r <= 6; r++) for (let f = 0; f < 8; f++) {
    const x = b[r * 16 + f], bit = 1 << f;
    if (x === PAWN) { if (wf & bit) add(T_DBL, -1); wf |= bit; }
    else if (x === BP) { if (bf & bit) add(T_DBL, 1); bf |= bit; }
  }
  const adj = (f: number) => (((1 << f) << 1) | ((1 << f) >> 1)) & 0xff;
  for (let r = 1; r <= 6; r++) for (let f = 0; f < 8; f++) {
    const sq = r * 16 + f, x = b[sq];
    if (x === PAWN) {
      if ((wf & adj(f)) === 0) add(T_ISO, -1);
      if (passed(b, sq)) add(T_PASS + r - 1, 1);
    } else if (x === BP) {
      if ((bf & adj(f)) === 0) add(T_ISO, 1);
      if (passed(b, sq)) add(T_PASS + (7 - r) - 1, -1);
    }
  }
  const eb = exposure(b, bk, BP, PAWN, -1), ew = exposure(b, wk, PAWN, BP, 1);
  add(T_SHEL, eb[0] - ew[0]); add(T_HALF, eb[1] - ew[1]); add(T_OPEN, eb[2] - ew[2]);
  // the black king's counts while White has a queen, minus the white king's while Black has one
  add(T_SHELQ, (wq ? eb[0] : 0) - (bq ? ew[0] : 0)); add(T_HALFQ, (wq ? eb[1] : 0) - (bq ? ew[1] : 0)); add(T_OPENQ, (wq ? eb[2] : 0) - (bq ? ew[2] : 0));
  const w = phase > 24 ? 24 : phase;
  const f: number[] = [];
  for (const [k, v] of c) if (v !== 0) f.push(k, v);
  return { f, m, w };
}

/** E1 parameter vectors (mg, eg) over the 400 terms, plus mobility weights. */
export function e1Params() {
  const mg = new Float64Array(N_TERMS), eg = new Float64Array(N_TERMS);
  for (let t = 1; t <= 5; t++) { mg[T_MAT + t - 1] = P.MATERIAL.mg[t]; eg[T_MAT + t - 1] = P.MATERIAL.eg[t]; }
  const names = ["pawn", "knight", "bishop", "rook", "queen", "king"];
  names.forEach((n, i) => { for (let s = 0; s < 64; s++) { mg[T_PST + i * 64 + s] = P.PST[n].mg[s]; eg[T_PST + i * 64 + s] = P.PST[n].eg[s]; } });
  for (let r = 1; r <= 6; r++) { mg[T_PASS + r - 1] = P.PASSED.mg[r]; eg[T_PASS + r - 1] = P.PASSED.eg[r]; }
  // penalties enter with the sign the counts already carry (count -1 for a white defect)
  mg[T_DBL] = P.DOUBLED.mg; eg[T_DBL] = P.DOUBLED.eg;
  mg[T_ISO] = P.ISOLATED.mg; eg[T_ISO] = P.ISOLATED.eg;
  mg[T_SHEL] = P.KING_SHELTER_MISSING.mg; eg[T_SHEL] = P.KING_SHELTER_MISSING.eg;
  mg[T_HALF] = P.KING_FILE_HALF_OPEN.mg; eg[T_HALF] = P.KING_FILE_HALF_OPEN.eg;
  mg[T_OPEN] = P.KING_FILE_OPEN.mg; eg[T_OPEN] = P.KING_FILE_OPEN.eg;
  return { mg, eg, wmg: P.MOBILITY_WEIGHT.mg, weg: P.MOBILITY_WEIGHT.eg, cap: P.MOBILITY_CAP.mg };
}

export function model(f: number[], m: number, w: number, th: ReturnType<typeof e1Params>) {
  let a = 0, e = 0;
  for (let i = 0; i < f.length; i += 2) { a += th.mg[f[i] as number]! * (f[i + 1] as number); e += th.eg[f[i] as number]! * (f[i + 1] as number); }
  a += Math.max(-th.cap, Math.min(th.cap, th.wmg * m));
  e += Math.max(-th.cap, Math.min(th.cap, th.weg * m));
  return (w * a + (24 - w) * e) / 24;
}

if (outPath && process.argv[1]?.endsWith("extract.ts")) {
  const t0 = Date.now();
  const th = e1Params();
  const stats: Record<string, number> = {};
  const inc = (k: string, n = 1) => { stats[k] = (stats[k] ?? 0) + n; };
  const seenGames = new Set<string>();
  const fileHashes: string[] = [];
  const out: string[] = [];
  let worst = 0;
  const RULES = { evasions: true, quietPromotions: true, taper: true };
  for (const path of pgns) {
    const text = readFileSync(path, "utf8");
    let contributes = false;
    for (const game of text.split(/\n(?=\[Event )/)) {
      if (!/\[Result /.test(game)) continue;
      inc("games.read");
      const tag = (n: string) => new RegExp(`\\[${n} "([^"]*)"\\]`).exec(game)?.[1];
      const W = tag("White"), B = tag("Black"), R = tag("Result");
      if (!["skytalix", "base"].includes(W ?? "") || !["skytalix", "base"].includes(B ?? "")) { inc("games.drop.player"); continue; }
      if (R !== "1-0" && R !== "0-1" && R !== "1/2-1/2") { inc("games.drop.result"); continue; }
      const fen = tag("FEN") ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const body = game.replace(/^\[.*\]$/gm, "");
      const toks = body.match(/\{[^}]*\}|[^\s{}]+/g) ?? [];
      const moves: { san: string; comment: string | null }[] = [];
      for (const tk of toks) {
        if (tk.startsWith("{")) { if (moves.length) moves[moves.length - 1]!.comment ??= tk; continue; }
        if (/^\d+\.+$/.test(tk) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tk) || /^\$\d+$/.test(tk)) continue;
        const san = tk.replace(/^\d+\.+/, "");
        if (san) moves.push({ san, comment: null });
      }
      const key = `${fen}|${moves.map((x) => x.san).join(" ")}`;
      if (seenGames.has(key)) { inc("games.drop.duplicate"); continue; }
      seenGames.add(key);
      inc("games.kept");
      contributes = true;
      const y = R === "1-0" ? 1 : R === "0-1" ? 0 : 0.5;
      const pos = parseFen(fen);
      for (const mv of moves) {
        inc("pos.seen");
        let keep = true;
        if (mv.comment === null) { inc("pos.drop.book"); keep = false; }
        else if (/M/.test(mv.comment)) { inc("pos.drop.mate"); keep = false; }
        else if (isInCheck(pos)) { inc("pos.drop.check"); keep = false; }
        if (keep) {
          const ev = evaluate(pos);
          const q = quiesce(pos, -Infinity, Infinity, 0, 0, RULES, () => {});
          if (q !== ev) { inc("pos.drop.noisy"); keep = false; }
          else {
            const tr = trace(pos);
            const evW = pos.blackToMove ? -ev : ev;
            const mdl = model(tr.f, tr.m, tr.w, th);
            const d = Math.abs(mdl - evW);
            if (d > worst) worst = d;
            if (!(d < 1) || (tr.w === 24 && d !== 0)) inc("gate.miss");
            out.push(JSON.stringify({ k: toFen(pos).split(" ").slice(0, 4).join(" "), o: fen, y, w: tr.w, m: tr.m, f: tr.f }));
            inc("pos.kept");
          }
        }
        const r = parseSan(pos, mv.san);
        if (r.outcome !== "move") throw new Error(`${path}: ${mv.san} ${r.outcome}`);
        makeMove(pos, r.move);
      }
    }
    if (contributes) fileHashes.push(`${path} ${createHash("sha256").update(readFileSync(path)).digest("hex")}`);
  }
  fileHashes.sort();
  writeFileSync(outPath, `${out.join("\n")}\n`);
  writeFileSync(`${outPath}.files`, `${fileHashes.join("\n")}\n`);
  const setHash = createHash("sha256").update(`${fileHashes.join("\n")}\n`).digest("hex");
  console.log(JSON.stringify({ stats, gateWorstAbsDiff: worst, files: fileHashes.length, setHash, seconds: (Date.now() - t0) / 1000 }, null, 1));
}
