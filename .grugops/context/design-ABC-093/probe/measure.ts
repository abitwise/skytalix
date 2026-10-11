// design-ABC-093 probe: measures D1 candidates on the real source. Imports src/ read-only.
import { readFileSync } from "node:fs";
import { join } from "node:path";
const W = process.argv[2] as string;
const DATA = process.argv[3] as string;
const { parseFen, toFen } = await import(join(W, "src/fen.ts"));
const { parseSan } = await import(join(W, "src/san.ts"));
const { makeMove } = await import(join(W, "src/apply.ts"));
const { legalMoves } = await import(join(W, "src/legal.ts"));
const { zobristKey } = await import(join(W, "src/zobrist.ts"));
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MAX = 12;
const FILES = "abcdefgh";
const sq = (s: number) => `${FILES[s & 7]}${(s >> 4) + 1}`;
const PROMO = ["", "", "n", "b", "r", "q"];
const uci = (m: any) => `${sq(m.from)}${sq(m.to)}${m.promotion ? (PROMO[m.promotion] ?? "?") : ""}`;
const fen4 = (p: any) => toFen(p).split(" ").slice(0, 4).join(" ");
const zhex = (p: any) => zobristKey(p).toString(16).padStart(16, "0");

type Node = { moves: Map<string, number>; name?: string[]; ply: number };
const byZ = new Map<string, Node>();
const zToFen = new Map<string, string>();
let rows = 0, rejected = 0, truncatedLines = 0, namedBeyond = 0, maxPlyAll = 0;
const t0 = performance.now();
for (const f of ["a", "b", "c", "d", "e"]) {
  const lines = readFileSync(join(DATA, `${f}.tsv`), "utf8").split("\n").slice(1).filter(Boolean);
  for (const line of lines) {
    rows++;
    const [, name, pgn] = line.split("\t") as [string, string, string];
    const sans = pgn.split(" ").filter((t) => !/^\d+\.$/.test(t));
    maxPlyAll = Math.max(maxPlyAll, sans.length);
    if (sans.length > MAX) truncatedLines++;
    const pos = parseFen(START);
    let ok = true;
    for (let i = 0; i < Math.min(sans.length, MAX); i++) {
      const k = zhex(pos);
      if (!zToFen.has(k)) zToFen.set(k, fen4(pos));
      else if (zToFen.get(k) !== fen4(pos)) throw new Error(`zobrist collision ${k}`);
      const r = parseSan(pos, sans[i] as string);
      if (r.outcome !== "move") { ok = false; rejected++; break; }
      let n = byZ.get(k); if (!n) { n = { moves: new Map(), ply: i }; byZ.set(k, n); }
      n.ply = Math.min(n.ply, i);
      const u = uci(r.move); n.moves.set(u, (n.moves.get(u) ?? 0) + 1);
      makeMove(pos, r.move);
    }
    if (!ok) continue;
    if (sans.length <= MAX) {
      const k = zhex(pos);
      if (!zToFen.has(k)) zToFen.set(k, fen4(pos));
      let n = byZ.get(k); if (!n) { n = { moves: new Map(), ply: sans.length }; byZ.set(k, n); }
      (n.name ??= []).push(name);
    } else namedBeyond++;
  }
}
const tCompile = performance.now() - t0;
const withMoves = [...byZ.values()].filter((n) => n.moves.size > 0).length;
const multiName = [...byZ.values()].filter((n) => (n.name?.length ?? 0) > 1);
const sorted = [...byZ.keys()].sort();
function emit(keyOf: (k: string) => string, weight: "uniform" | "count") {
  const positions: Record<string, unknown> = {};
  for (const k of [...sorted].sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : 1))) {
    const n = byZ.get(k) as Node;
    const m = [...n.moves.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([u, c]) => [u, weight === "uniform" ? 1 : c]);
    const e: Record<string, unknown> = { m };
    if (n.name) e.n = [...n.name].sort()[0];
    positions[keyOf(k)] = e;
  }
  return JSON.stringify({ format: 1, source: { repo: "lichess-org/chess-openings", commit: "a6189a30dc273ccb21fc2536a9a2fefd5592a67a" }, maxPly: MAX, positions });
}
const zU = emit((k) => k, "uniform"), zC = emit((k) => k, "count"), fU = emit((k) => zToFen.get(k) as string, "uniform");
const zNoName = JSON.stringify(Object.fromEntries([...JSON.parse(zU).positions ? Object.entries(JSON.parse(zU).positions) : []].map(([k, v]: any) => [k, { m: v.m }])));
console.log(`rows ${rows}; SAN rejected ${rejected}; lines >${MAX} plies ${truncatedLines} (longest ${maxPlyAll}); names lost to truncation ${namedBeyond}`);
console.log(`positions ${byZ.size} (with >=1 move ${withMoves}); positions with >1 source name ${multiName.length}; compile ${tCompile.toFixed(0)} ms`);
console.log(`bytes: zobrist-hex+uniform ${zU.length}; zobrist-hex+line-count ${zC.length}; fen4+uniform ${fU.length}; zobrist w/o names ${zNoName.length}; bar 1048576`);
// determinism: emit twice
console.log(`reproducible in-process: ${emit((k) => k, "count") === zC}`);
// A2-style replay walk over the artifact (zobrist keys): DFS from start, check legality + key match
const art = JSON.parse(zC);
const t1 = performance.now();
let examined = 0, movesChecked = 0, illegal = 0, deepest = 0;
const seen = new Set<string>();
function walk(fen: string, ply: number) {
  const p = parseFen(fen); const k = zhex(p);
  const e = art.positions[k]; if (!e || seen.has(k)) return; seen.add(k); examined++;
  deepest = Math.max(deepest, ply);
  const legal = legalMoves(p);
  for (const [u] of e.m) {
    movesChecked++;
    const mv = legal.find((m: any) => uci(m) === u);
    if (!mv) { illegal++; continue; }
    const q = parseFen(fen); makeMove(q, mv); walk(toFen(q), ply + 1);
  }
}
walk(START, 0);
const tWalk = performance.now() - t1;
console.log(`replay walk: entries examined ${examined} of ${Object.keys(art.positions).length}; moves ${movesChecked}; illegal ${illegal}; deepest ply with moves ${deepest}; ${tWalk.toFixed(0)} ms in-process`);
const startK = zhex(parseFen(START));
const root = art.positions[startK].m as [string, number][];
const tot = root.reduce((s, [, w]) => s + w, 0);
console.log(`start: ${root.length} first moves; line-count share e2e4 ${(100 * (root.find(([u]) => u === "e2e4")?.[1] ?? 0) / tot).toFixed(1)}% d2d4 ${(100 * (root.find(([u]) => u === "d2d4")?.[1] ?? 0) / tot).toFixed(1)}%; uniform share each ${(100 / root.length).toFixed(1)}%`);
const e4 = parseFen(START); makeMove(e4, legalMoves(e4).find((m: any) => uci(m) === "e2e4")); 
console.log(`after 1.e4: ${art.positions[zhex(e4)].m.length} replies; name "${art.positions[zhex(e4)].n}"`);
console.log(`first moves (line counts): ${root.map(([u, w]) => `${u}:${w}`).join(" ")}`);
const t2 = performance.now(); JSON.parse(zC); console.log(`JSON.parse of artifact ${(performance.now() - t2).toFixed(1)} ms`);
console.log(`multi-name sample: ${multiName.slice(0, 2).map((n) => n.name?.join(" | ")).join(" || ")}`);
