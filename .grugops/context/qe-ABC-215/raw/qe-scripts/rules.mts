// QE's own rebuild of ABC-215's seven rules (different method from the SE's test: squares as (file, rank)
// pairs; knight reach and diagonal reach counted by scanning all 64 targets). Compares with a tree's
// VALUE_TABLES_FOR_TEST, counts cells differing from a base tree's arrays (parsed from its source text).
// usage: node rules.mts <head-tree> <base-tree>
const [head, base] = process.argv.slice(2);
const { readFileSync } = await import("node:fs");
const { VALUE_TABLES_FOR_TEST: T } = await import(`${head}/src/evaluate.ts`);
const sq = (i: number) => ({ f: i % 8, r: 8 - Math.floor(i / 8) }); // rank-8-first layout, r 1..8 from White
const all = [...Array(64).keys()];
const edge = (f: number) => Math.min(f, 7 - f);
const ring = (i: number) => { const { f, r } = sq(i); return Math.min(edge(f), r - 1, 8 - r); };
const knightN = (i: number) => { const a = sq(i); return all.filter((j) => { const b = sq(j); const df = Math.abs(a.f - b.f), dr = Math.abs(a.r - b.r); return (df === 1 && dr === 2) || (df === 2 && dr === 1); }).length; };
const diagN = (i: number) => { const a = sq(i); return all.filter((j) => { const b = sq(j); const df = Math.abs(a.f - b.f), dr = Math.abs(a.r - b.r); return df === dr && df > 0; }).length; };
const z = (x: number) => (Object.is(x, -0) ? 0 : x);
const rules: Record<string, number[]> = {
  PIECE_VALUE: [0, 100, 300 + 25, 300 + 25, 500, 900, 0],
  PAWN_TABLE: all.map((i) => { const { f, r } = sq(i); return r === 1 || r === 8 ? 0 : z(2 * edge(f) * (r - 2)); }),
  KNIGHT_TABLE: all.map((i) => 10 * knightN(i) - 50),
  BISHOP_TABLE: all.map((i) => 5 * (diagN(i) - 9)),
  BISHOP_RING_ALT: all.map((i) => 10 * ring(i) - 10),
  ROOK_TABLE: all.map((i) => (sq(i).r === 7 ? 20 : 0)),
  QUEEN_TABLE: all.map((i) => 5 * ring(i) - 5),
  KING_TABLE: all.map((i) => { const { f, r } = sq(i); const d = Math.min(Math.abs(f - 1), Math.abs(f - 6)); return z(Math.max(-50, -10 * d - 10 * (r - 1))); }),
};
// base arrays parsed from base source text
const src = readFileSync(`${base}/src/evaluate.ts`, "utf8");
const parse = (name: string) => { const m = src.match(new RegExp(`const ${name}: readonly number\\[\\] = \\[([\\s\\S]*?)\\];`)); if (!m) throw new Error(name); return m[1].replace(/\/\/[^\n]*/g, "").split(",").map((s) => s.trim()).filter(Boolean).map(Number); };
const out: Record<string, unknown> = { keys: Object.keys(T).sort().join(",") };
for (const n of ["PIECE_VALUE", "PAWN_TABLE", "KNIGHT_TABLE", "BISHOP_TABLE", "ROOK_TABLE", "QUEEN_TABLE", "KING_TABLE"]) {
  const a = Array.from(T[n] as number[]); const b = parse(n); const r = rules[n];
  out[n] = { len: a.length, equals_rule: a.length === r.length && a.every((v, i) => v === r[i]), differ_from_base: a.filter((v, i) => v !== b[i]).length, base_len: b.length, min: Math.min(...a), max: Math.max(...a) };
}
out.bishop_ring_identity = rules.BISHOP_TABLE.every((v, i) => v === rules.BISHOP_RING_ALT[i]);
console.log(JSON.stringify(out, null, 1));
