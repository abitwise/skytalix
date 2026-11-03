// SCRATCH PROTOTYPE (arch-ABC-239): the E2 tuner's fit stage. PREREG `…9ed1db11`.
// Usage: node fit.ts <e1 src dir> <positions.jsonl> <out.json>
import { readFileSync, writeFileSync } from "node:fs";

const [srcDir, inPath, outPath] = process.argv.slice(2);
const X = await import(`${process.argv[1]!.replace(/diag\.ts$/, "extract.ts")}`);
let MODE: "ce" | "mse" = "ce"; let FREEZE = false; const FROZEN = new Set([0, 1, 2, 3, 4, 16, 17, 18, 19, 20]);
void srcDir;
const { T_MAT, T_PST, T_PASS, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN } = X;
const E1 = X.e1Params();
const t0 = Date.now();

// ---------- load, de-duplicate by position key, split by opening ----------
type Row = { k: string; o: string; y: number; w: number; m: number; f: number[] };
const fnv = (s: string) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h; };
const raw: Row[] = readFileSync(inPath!, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const isVal = (o: string) => fnv(`ABC-239/split/v1\n${o}`) % 5 === 0;
const isInner = (o: string) => fnv(`ABC-239/inner/v1\n${o}`) % 4 === 0;
type Pos = { y: number; w: number; m: number; f: number[]; inner: boolean; n: number };
function merge(rows: Row[]) {
  const by = new Map<string, Pos & { ysum: number }>();
  for (const r of rows) {
    const p = by.get(r.k);
    if (p) { p.ysum += r.y; p.n++; p.inner = p.inner && isInner(r.o); }
    else by.set(r.k, { y: 0, ysum: r.y, n: 1, w: r.w, m: r.m, f: r.f, inner: isInner(r.o) });
  }
  for (const p of by.values()) p.y = p.ysum / p.n;
  return by;
}
const trainMap = merge(raw.filter((r) => !isVal(r.o)));
const valMapAll = merge(raw.filter((r) => isVal(r.o)));
let leak = 0;
for (const k of [...valMapAll.keys()]) if (trainMap.has(k)) { valMapAll.delete(k); leak++; }
const train = [...trainMap.values()], val = [...valMapAll.values()];
const openings = new Set(raw.map((r) => r.o));
const valOpen = [...openings].filter(isVal).length;
const counts = { rows: raw.length, train: train.length, val: val.length, valRemovedAsInTraining: leak, openings: openings.size, valOpenings: valOpen,
  innerTrain: train.filter((p) => !p.inner).length, innerVal: train.filter((p) => p.inner).length };

// ---------- parameterisation ----------
// A config maps a free vector z to (mg[400], eg[400], wmg, weg) and gives per-position gradient
// d eval / d z as a sparse list. Linear in z except the mobility clamp.
const CAP = E1.cap;
const PST_NAMES = 6;
const mirrorCell = (idx: number) => { const r = idx >> 3, f = idx & 7; return r * 4 + (f < 4 ? f : 7 - f); };
interface Cfg { name: string; n: number; z0: Float64Array; prior: Float64Array | null; grad: (p: Pos, z: Float64Array) => { idx: number[]; val: number[]; e: number }; toParams: (z: Float64Array) => typeof E1 }

function scalarsIdx() {
  // 34 scalars: material 5, passed 6, dbl, iso, shel, half, open (17 terms) x2, + wmg, weg (2) -> 36? see below
  return [0, 1, 2, 3, 4, T_PASS, T_PASS + 1, T_PASS + 2, T_PASS + 3, T_PASS + 4, T_PASS + 5, T_DBL, T_ISO, T_SHEL, T_HALF, T_OPEN];
}
const SC = scalarsIdx(); // 16 terms -> 32 params, + 2 mobility = 34
const scPos = new Map<number, number>(SC.map((t, i) => [t, i]));

function makeCfg(kind: "S" | "F"): Cfg {
  // layout: [sc mg (16), sc eg (16), wmg, weg, then PST part]
  const nSc = 34;
  const nP = kind === "S" ? 12 : PST_NAMES * 32 * 2;
  const n = nSc + nP;
  const z0 = new Float64Array(n);
  SC.forEach((t, i) => { z0[i] = E1.mg[t]; z0[16 + i] = E1.eg[t]; });
  z0[32] = E1.wmg; z0[33] = E1.weg;
  const prior = kind === "F" ? new Float64Array(n) : null;
  const pstMask = new Uint8Array(n); // 1 = regularised (F cells)
  const fixedZero = new Uint8Array(n);
  if (kind === "S") { for (let i = 0; i < 12; i++) z0[nSc + i] = 1; }
  else {
    for (let t = 0; t < 6; t++) for (let c = 0; c < 32; c++) for (let h = 0; h < 2; h++) {
      const j = nSc + (t * 32 + c) * 2 + h;
      // E1 tables are left-right symmetric, so any member of the pair gives the value
      const r = c >> 2, f = c & 3, idx = r * 8 + f;
      z0[j] = (h === 0 ? E1.mg : E1.eg)[T_PST + t * 64 + idx];
      prior![j] = z0[j]!; pstMask[j] = 1;
      if (t === 0 && (r === 0 || r === 7)) fixedZero[j] = 1;
    }
  }
  const grad = (p: Pos, z: Float64Array) => {
    const wm = p.w / 24, we = 1 - wm;
    const acc = new Map<number, number>();
    const add = (j: number, v: number) => acc.set(j, (acc.get(j) ?? 0) + v);
    let e = 0;
    for (let i = 0; i < p.f.length; i += 2) {
      const t = p.f[i]!, c = p.f[i + 1]!;
      const s = scPos.get(t);
      if (s !== undefined) { add(s, wm * c); add(16 + s, we * c); e += wm * c * z[s]! + we * c * z[16 + s]!; continue; }
      // PST term
      const tt = Math.floor((t - T_PST) / 64), idx = (t - T_PST) % 64;
      if (kind === "S") {
        const vm = c * E1.mg[t], ve = c * E1.eg[t];
        add(nSc + tt * 2, wm * vm); add(nSc + tt * 2 + 1, we * ve);
        e += wm * vm * z[nSc + tt * 2]! + we * ve * z[nSc + tt * 2 + 1]!;
      } else {
        const j = nSc + (tt * 32 + mirrorCell(idx)) * 2;
        if (!fixedZero[j]) { add(j, wm * c); add(j + 1, we * c); }
        e += wm * c * z[j]! + we * c * z[j + 1]!;
      }
    }
    const am = z[32]! * p.m, ae = z[33]! * p.m;
    if (Math.abs(am) < CAP) { add(32, wm * p.m); e += wm * am; } else e += wm * Math.sign(am) * CAP;
    if (Math.abs(ae) < CAP) { add(33, we * p.m); e += we * ae; } else e += we * Math.sign(ae) * CAP;
    const idx: number[] = [], val: number[] = [];
    for (const [j, v] of acc) if (v !== 0 && !(FREEZE && FROZEN.has(j))) { idx.push(j); val.push(v); }
    return { idx, val, e };
  };
  const toParams = (z: Float64Array) => {
    const mg = Float64Array.from(E1.mg), eg = Float64Array.from(E1.eg);
    SC.forEach((t, i) => { mg[t] = z[i]!; eg[t] = z[16 + i]!; });
    for (let t = 0; t < 6; t++) for (let idx = 0; idx < 64; idx++) {
      const T = T_PST + t * 64 + idx;
      if (kind === "S") { mg[T] = E1.mg[T] * z[nSc + t * 2]!; eg[T] = E1.eg[T] * z[nSc + t * 2 + 1]!; }
      else { const j = nSc + (t * 32 + mirrorCell(idx)) * 2; mg[T] = z[j]!; eg[T] = z[j + 1]!; }
    }
    return { mg, eg, wmg: z[32]!, weg: z[33]!, cap: CAP };
  };
  void pstMask;
  return { name: `C-${kind}`, n, z0, prior, grad, toParams };
}

// ---------- loss ----------
const LN10 = Math.log(10);
const sig = (e: number, K: number) => 1 / (1 + Math.pow(10, (-K * e) / 400));
function lossOf(rows: Pos[], th: typeof E1, K: number) {
  let ce = 0, mse = 0;
  for (const p of rows) {
    const s = Math.min(1 - 1e-12, Math.max(1e-12, sig(X.model(p.f, p.m, p.w, th), K)));
    ce -= p.y * Math.log(s) + (1 - p.y) * Math.log(1 - s);
    mse += (s - p.y) ** 2;
  }
  return { ce: ce / rows.length, mse: mse / rows.length };
}
function fitK(rows: Pos[], th: typeof E1) {
  let a = 0.1, b = 5; const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a), d = a + g * (b - a);
  const L = (k: number) => MODE === "ce" ? lossOf(rows, th, k).ce : lossOf(rows, th, k).mse;
  let fc = L(c), fd = L(d);
  for (let i = 0; i < 60; i++) {
    if (fc < fd) { b = d; d = c; fd = fc; c = b - g * (b - a); fc = L(c); }
    else { a = c; c = d; fc = fd; d = a + g * (b - a); fd = L(d); }
  }
  return (a + b) / 2;
}

// ---------- Newton ----------
function cholSolve(H: Float64Array, g: Float64Array, n: number) {
  const L = Float64Array.from(H);
  for (let j = 0; j < n; j++) {
    let s = L[j * n + j]!;
    for (let k = 0; k < j; k++) s -= L[j * n + k]! ** 2;
    if (s <= 0) throw new Error("not positive definite");
    const d = Math.sqrt(s); L[j * n + j] = d;
    for (let i = j + 1; i < n; i++) { let t = L[i * n + j]!; for (let k = 0; k < j; k++) t -= L[i * n + k]! * L[j * n + k]!; L[i * n + j] = t / d; }
  }
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) { let t = g[i]!; for (let k = 0; k < i; k++) t -= L[i * n + k]! * y[k]!; y[i] = t / L[i * n + i]!; }
  const x = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) { let t = y[i]!; for (let k = i + 1; k < n; k++) t -= L[k * n + i]! * x[k]!; x[i] = t / L[i * n + i]!; }
  return x;
}
function objective(cfg: Cfg, rows: Pos[], z: Float64Array, K: number, lam: number) {
  let ce = 0;
  for (const p of rows) {
    const { e } = cfg.grad(p, z);
    const s = Math.min(1 - 1e-12, Math.max(1e-12, sig(e, K)));
    if (MODE === "mse") ce += (s - p.y) ** 2; else ce -= p.y * Math.log(s) + (1 - p.y) * Math.log(1 - s);
  }
  ce /= rows.length;
  if (cfg.prior && lam > 0) { let r = 0; for (let j = 34; j < cfg.n; j++) r += (z[j]! - cfg.prior[j]!) ** 2; ce += 0.5 * lam * r; }
  return ce;
}
function newton(cfg: Cfg, rows: Pos[], K: number, lam: number) {
  const n = cfg.n, a = (K * LN10) / 400;
  let z = Float64Array.from(cfg.z0);
  let f = objective(cfg, rows, z, K, lam);
  let steps = 0;
  for (; steps < 50; steps++) {
    const g = new Float64Array(n), H = new Float64Array(n * n);
    for (const p of rows) {
      const { idx, val, e } = cfg.grad(p, z);
      const s = sig(e, K), sp = a * s * (1 - s);
      const r = MODE === "ce" ? a * (s - p.y) : 2 * (s - p.y) * sp, h = MODE === "ce" ? a * a * s * (1 - s) : 2 * sp * sp;
      for (let u = 0; u < idx.length; u++) {
        const iu = idx[u]!, vu = val[u]!;
        g[iu] += r * vu;
        const row = iu * n, hv = h * vu;
        for (let v = 0; v < idx.length; v++) H[row + idx[v]!] += hv * val[v]!;
      }
    }
    const N = rows.length;
    for (let j = 0; j < n; j++) { g[j] /= N; for (let k = 0; k < n; k++) H[j * n + k] /= N; }
    if (cfg.prior && lam > 0) for (let j = 34; j < n; j++) { g[j] += lam * (z[j]! - cfg.prior[j]!); H[j * n + j] += lam; }
    // tiny ridge on the diagonal for unvisited / fixed cells (keeps H positive definite; does not move a visited cell)
    for (let j = 0; j < n; j++) H[j * n + j] += 1e-12 + (H[j * n + j] === 0 ? 1 : 0);
    const d = cholSolve(H, g, n);
    let t = 1, fn = Infinity, zn = z;
    for (let ls = 0; ls < 30; ls++) {
      zn = z.map((v, j) => v - t * d[j]!);
      fn = objective(cfg, rows, zn, K, lam);
      if (fn <= f) break;
      t /= 2;
    }
    if (!(fn <= f)) break;
    const rel = (f - fn) / f;
    z = zn; f = fn;
    if (rel < 1e-9) { steps++; break; }
  }
  return { z, f, steps };
}
const roundAway = (v: number) => Math.sign(v) * Math.round(Math.abs(v));
function rounded(th: typeof E1) {
  return { mg: th.mg.map(roundAway), eg: th.eg.map(roundAway), wmg: roundAway(th.wmg), weg: roundAway(th.weg), cap: th.cap } as typeof E1;
}

// ---------- diagnostic runs (inner split only; PREREG addendum …255e9bcf) ----------
function summarize(th: typeof E1) {
  const pick = (t: number) => [th.mg[t], th.eg[t]];
  const pst = (t: number) => ({ mg: Array.from(th.mg.slice(T_PST + t * 64, T_PST + t * 64 + 64)), eg: Array.from(th.eg.slice(T_PST + t * 64, T_PST + t * 64 + 64)) });
  return {
    material: [0, 1, 2, 3, 4].map((i) => pick(T_MAT + i)), passed: [0, 1, 2, 3, 4, 5].map((i) => pick(T_PASS + i)),
    doubled: pick(T_DBL), isolated: pick(T_ISO), shelter: pick(T_SHEL), halfOpen: pick(T_HALF), open: pick(T_OPEN), mobility: [th.wmg, th.weg],
    pst: ["pawn", "knight", "bishop", "rook", "queen", "king"].map((n, i) => [n, pst(i)]),
  };
}

const innerT = train.filter((p) => !p.inner), innerV = train.filter((p) => p.inner);
const out: Record<string, unknown> = { counts: { innerTrain: innerT.length, innerVal: innerV.length } };
const relations = (th: typeof E1) => {
  const r: string[] = [];
  for (const [h, arr] of [["mg", th.mg], ["eg", th.eg]] as const) {
    for (let i = 1; i < 6; i++) if (arr[T_PASS + i]! < arr[T_PASS + i - 1]!) r.push(`passed ${h} r${i + 1} < r${i}`);
    for (const [n, t] of [["dbl", T_DBL], ["iso", T_ISO], ["shel", T_SHEL], ["half", T_HALF], ["open", T_OPEN]] as const) if (arr[t]! < 0) r.push(`${n} ${h} < 0`);
    for (const t of [1, 2]) if (arr[T_MAT + t]! <= 3 * arr[T_MAT]!) r.push(`minor${t} ${h} <= 3P`);
  }
  if (th.wmg < 0 || th.weg < 0) r.push("W < 0");
  return r;
};
for (const [name, mode, freeze] of [["D1", "mse", false], ["D2", "ce", true], ["D3", "mse", true]] as const) {
  MODE = mode; FREEZE = freeze;
  const K = fitK(innerT, E1);
  const cfg = makeCfg("S");
  const r = newton(cfg, innerT, K, 0);
  const th = rounded(cfg.toParams(r.z));
  const e1 = lossOf(innerV, E1, K), fit = lossOf(innerV, th, K);
  out[name] = { mode, freeze, K, steps: r.steps, innerValE1: e1, innerValFit: fit, ratioCE: fit.ce / e1.ce, ratioMSE: fit.mse / e1.mse, relations: relations(th), params: summarize(th) };
  console.log(name, mode, freeze ? "frozen" : "free", "K", K.toFixed(4), "steps", r.steps, "CE", (fit.ce / e1.ce).toFixed(4), "MSE", (fit.mse / e1.mse).toFixed(4), "mat", JSON.stringify((summarize(th) as any).material), "rel", relations(th).join("; "), "t", ((Date.now() - t0) / 1000).toFixed(1));
}
writeFileSync(outPath!, JSON.stringify(out, null, 1));
