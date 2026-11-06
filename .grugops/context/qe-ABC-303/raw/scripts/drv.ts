// qe-ABC-303: QE's own driver for ADR-0056's tables 1 to 3, count rows only. Nothing here reads a clock.
// Each mode runs in its own process. usage: node drv.ts <mode> <H root> [<B root>]
// Arms: ON = search / chooseMove; OFF = ...WithoutQuietBundle; P4 = ...WithoutMoveCountPruning; CM = ...WithoutCountermove.
import { readFileSync } from "node:fs";
const [mode, H, B] = process.argv.slice(2) as [string, string, string | undefined];
const mods = async (r: string) => ({ s: await import(`${r}/src/search.ts`), e: await import(`${r}/src/engine.ts`) });
const h = await mods(H);
const { parseFen, toFen } = await import(`${H}/src/fen.ts`);
const { legalMoves } = await import(`${H}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${H}/src/apply.ts`);
const { gameStatus } = await import(`${H}/src/gameend.ts`);
const { squareName } = await import(`${H}/src/position.ts`);
const { MATE_CORPUS } = await import(`${H}/src/search.mate-corpus.ts`);
const print = (x: unknown) => console.log(JSON.stringify(x));
const uci = (m: any) => (m ? `${squareName(m.from)}${squareName(m.to)}` : "none");
const mate = (v: number) => Math.abs(v) >= h.s.MATE_SCORE - 1000;
const frozen = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const TWO: [string, string][] = [["kiwipete", KIWI], ["position-6", POS6]];
const arm = (m: any, a: string) => a === "ON" ? { s: m.s.search, c: m.e.chooseMove }
  : a === "OFF" ? { s: m.s.searchWithoutQuietBundle, c: m.e.chooseMoveWithoutQuietBundle }
  : a === "P4" ? { s: m.s.searchWithoutMoveCountPruning, c: m.e.chooseMoveWithoutMoveCountPruning }
  : { s: m.s.searchWithoutCountermove, c: m.e.chooseMoveWithoutCountermove };
const same = (x: any, y: any) => x.nodes === y.nodes && x.score === y.score && uci(x.move) === uci(y.move) && x.depth === y.depth;

/** ADR-0063 d8's 190: six roots, each root's in-progress children, six endings. */
function the190(): string[] {
  const roots = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", KIWI, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
    "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", POS6];
  const ends = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
  const all: string[] = [];
  for (const fen of roots) {
    all.push(fen);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") all.push(toFen(p));
      unmakeMove(p, m, u);
    }
  }
  return all.concat(ends);
}

if (mode === "s1") {
  const b = await mods(B as string); let eq = 0, n = 0;
  for (const [name, fen] of TWO) for (const d of [6, 7, 8]) {
    const pairs: [string, any, any][] = [
      ["search", arm(h, "OFF").s(parseFen(fen), d), b.s.search(parseFen(fen), d)],
      ["chooseMove", arm(h, "OFF").c(parseFen(fen), frozen(d)), b.e.chooseMove(parseFen(fen), frozen(d))]];
    for (const [what, x, y] of pairs) { n++; const ok = same(x, y); if (ok) eq++; print({ row: "S1", name, d, what, nodes: x.nodes, base: y.nodes, score: x.score, baseScore: y.score, move: uci(x.move), baseMove: uci(y.move), ok }); }
  }
  print({ S1: eq, of: n });
}
if (mode === "s2") {
  const b = await mods(B as string); let eq = 0, n = 0;
  const sDoors = Object.keys(b.s).filter((k) => k.startsWith("searchWithout"));
  const cDoors = Object.keys(b.e).filter((k) => k.startsWith("chooseMoveWithout"));
  const newS = Object.keys(h.s).filter((k) => k.startsWith("searchWithout") && !sDoors.includes(k));
  const newC = Object.keys(h.e).filter((k) => k.startsWith("chooseMoveWithout") && !cDoors.includes(k));
  const lost = [...sDoors.filter((k) => !h.s[k]), ...cDoors.filter((k) => !h.e[k])];
  print({ doors: sDoors.length + cDoors.length, newS, newC, lost });
  for (const [name, fen] of TWO) {
    for (const k of sDoors) {
      // A door with alpha-beta off is too wide for depth 5 on these roots; those two read at depth 3.
      const d = /^searchWithout(Pruning|PruningOrQuiescence)$/.test(k) ? 3 : 5;
      const x = h.s[k](parseFen(fen), d), y = b.s[k](parseFen(fen), d); const ok = same(x, y); n++; if (ok) eq++;
      print({ row: "S2", door: k, name, d, nodes: x.nodes, base: y.nodes, ok });
    }
    for (const k of cDoors) {
      const x = h.e[k](parseFen(fen), frozen(6)), y = b.e[k](parseFen(fen), frozen(6)); const ok = same(x, y); n++; if (ok) eq++;
      print({ row: "S2", door: k, name, d: 6, nodes: x.nodes, base: y.nodes, ok });
    }
  }
  print({ S2: eq, of: n });
}
if (mode === "nodes") {
  const r: Record<string, number[]> = {}; const m: Record<string, string[]> = {};
  for (const a of ["ON", "OFF", "P4", "CM"]) {
    r[a] = []; m[a] = [];
    for (const [, fen] of TWO) {
      const s = arm(h, a).s(parseFen(fen), 8), c = arm(h, a).c(parseFen(fen), frozen(8));
      r[a].push(s.nodes, c.nodes); m[a].push(uci(s.move), uci(c.move));
    }
    print({ arm: a, nodes: r[a], moves: m[a] });
  }
  const q = (x: string, y: string) => (r[x] as number[]).map((v, i) => +(v / (r[y] as number[])[i]!).toFixed(4));
  print({ P3_on_over_P4door: q("ON", "P4"), R3_on_over_CMdoor: q("ON", "CM"), R3_alone_P4door_over_OFF: q("P4", "OFF"), R6_on_over_OFF: q("ON", "OFF") });
}
if (mode === "reach") {
  const rows = the190();
  const depths = (a: string) => rows.map((f) => arm(h, a).c(parseFen(f), { budgetMs: 1e9, now: () => 0, maxNodes: 47000 }));
  const mean = (x: any[]) => x.reduce((t, c) => t + c.depth, 0) / x.length;
  const on = depths("ON");
  for (const a of ["P4", "OFF"]) {
    const door = depths(a);
    print({ rows: rows.length, door: a, doorMean: +mean(door).toFixed(4), onMean: +mean(on).toFixed(4), gain: +(mean(on) - mean(door)).toFixed(4),
      deeper: on.filter((c, i) => c.depth > door[i].depth).length, shallower: on.filter((c, i) => c.depth < door[i].depth).length, moveDiff: on.filter((c, i) => uci(c.move) !== uci(door[i].move)).length });
  }
}
if (mode === "drift") {
  const rows = the190();
  for (const rec of ["search", "chooseMove"]) {
    const read = (a: string) => rows.map((f) => rec === "search" ? arm(h, a).s(parseFen(f), 5) : arm(h, a).c(parseFen(f), frozen(5)));
    const on = read("ON");
    for (const a of ["P4", "CM", "OFF"]) {
      const door = read(a); let plain = 0, inside = 0, cap = 0, sign = 0, flip = 0;
      door.forEach((x, i) => {
        const y = on[i]; const xm = mate(x.score), ym = mate(y.score);
        if (xm !== ym) { flip++; return; }
        if (xm) { if (Math.sign(x.score) !== Math.sign(y.score)) sign++; return; }
        plain++; const gap = Math.abs(x.score - y.score); if (gap <= 25) inside++; if (gap > cap) cap = gap;
      });
      print({ rec, door: a, rows: rows.length, plain, pct: +(100 * inside / plain).toFixed(2), capCp: cap, signChanges: sign, mateFlips: flip });
    }
  }
}
if (mode === "floor") {
  // A violation: the door proves a mate and the head does not hold a same-sign mate (ADR-0063 d11; PREREG aa5c4dc1).
  const v = (door: number[], head: number[]) => { const idx = door.flatMap((x, i) => mate(x) ? [i] : []); const bad = idx.filter((i) => !mate(head[i]!) || Math.sign(head[i]!) !== Math.sign(door[i]!)); return { mates: idx.length, violations: bad.length, fens: bad.map((i) => MATE_CORPUS[i]) }; };
  const S = (f: any, d: number) => MATE_CORPUS.map((x: string) => f(parseFen(x), d).score as number);
  const C = (f: any, d: number) => MATE_CORPUS.map((x: string) => f(parseFen(x), frozen(d)).score as number);
  const on5 = S(h.s.search, 5), onC5 = C(h.e.chooseMove, 5), onC6 = C(h.e.chooseMove, 6);
  print({ n: MATE_CORPUS.length, B1: v(S(arm(h, "OFF").s, 5), on5), B2: v(C(arm(h, "OFF").c, 5), onC5),
    B3_bundle5: v(S(h.s.searchWithoutBundle, 5), on5), B3_futility5: v(S(h.s.searchWithoutFutility, 5), on5), B3_seePruning5: v(S(h.s.searchWithoutSeePruning, 5), on5),
    B3_taper5: v(S(h.s.searchWithoutTaper, 5), on5), B3_taper4: v(S(h.s.searchWithoutTaper, 4), on5), B3_chooseBundle5: v(C(h.e.chooseMoveWithoutBundle, 5), onC5),
    R4_chooseD6: v(C(arm(h, "OFF").c, 6), onC6) });
}
if (mode === "krk") {
  // qe-ABC-283's fresh seeded 300 KRK + 300 KQK: same generator, seed 283, so the figures compare.
  let x = 283; const next = (n: number) => { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 8) % n; };
  const fens: string[] = [];
  for (const piece of ["R", "Q"]) {
    let made = 0;
    while (made < 300) {
      const white = next(2) === 0, stm = next(2) === 0 ? "w" : "b", sq = [next(64), next(64), next(64)] as [number, number, number];
      const near = Math.abs((sq[0] >> 3) - (sq[1] >> 3)) <= 1 && Math.abs((sq[0] & 7) - (sq[1] & 7)) <= 1;
      if (new Set(sq).size < 3 || near) continue;
      const b: (string | null)[] = new Array(64).fill(null);
      b[sq[0]] = white ? "K" : "k"; b[sq[1]] = white ? "k" : "K"; b[sq[2]] = white ? piece : piece.toLowerCase();
      const ranks: string[] = [];
      for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const c = b[r * 8 + f]; if (c) { if (e) s += e; e = 0; s += c; } else e++; } ranks.push(e ? s + e : s); }
      const fen = `${ranks.join("/")} ${stm} - - 0 1`;
      let p; try { p = parseFen(fen); } catch { continue; }
      if (legalMoves(p).length === 0) continue;
      fens.push(fen); made++;
    }
  }
  const reads: [string, (f: string, a: string) => number][] = [["search d5", (f, a) => arm(h, a).s(parseFen(f), 5).score], ["chooseMove d5", (f, a) => arm(h, a).c(parseFen(f), frozen(5)).score], ["chooseMove d6", (f, a) => arm(h, a).c(parseFen(f), frozen(6)).score]];
  for (const [what, read] of reads) {
    let mates = 0, bad = 0;
    for (const f of fens) { const d = read(f, "OFF"); if (!mate(d)) continue; mates++; const g = read(f, "ON"); if (!mate(g) || Math.sign(g) !== Math.sign(d)) bad++; }
    print({ what, corpus: fens.length, mates, violations: bad });
  }
}
if (mode === "zug") {
  // ADR-0050 d9's table, copied from the ADR: SAN there, written here as from-to.
  const rows: [string, string, string, number][] = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8]];
  let good = 0;
  for (const [name, fen, want, d] of rows) { const c = h.e.chooseMove(parseFen(fen), frozen(d)); const ok = uci(c.move) === want && c.depth === d; if (ok) good++; print({ name, d, want, played: uci(c.move), depth: c.depth, nodes: c.nodes, ok }); }
  print({ S4: good, of: rows.length });
}
if (mode === "g1") {
  const { PUZZLES } = await import(`${H}/src/puzzle-corpus.ts`);
  const { virtualClock } = await import(`${H}/src/virtual-clock.ts`);
  const base = JSON.parse(readFileSync(`${H}/src/puzzle-suite.baseline.json`, "utf8"));
  const missed: string[] = [];
  for (const p of PUZZLES as any[]) {
    const c = h.e.chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) });
    const got = c === null ? "null" : uci(c.move);
    if (!(p.kind === "do-not-hang" ? got !== p.losing : p.accept.includes(got))) missed.push(p.name);
  }
  const total = (PUZZLES as any[]).length;
  print({ S5: total - missed.length, of: total, missed, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)) });
}
if (mode === "bytes") print({ P5: h.s.countermoveByteLength() });
if (mode === "forms") {
  // P2 by direct call, on top of the source read: T by depth, the clauses of moveCountNode, the table.
  const open = parseFen("r2q1rk1/ppp2ppp/2n1bn2/3pp3/3PP3/2N1BN2/PPP2PPP/R2Q1RK1 w - - 0 1");
  const thin = parseFen("6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1");
  const check = parseFen("r2q1rk1/ppp2ppp/2n1bn2/3pp3/1b1PP3/2N1BN2/PPP2PPP/R2QK2R w KQ - 0 1");
  const f = h.s.moveCountNode;
  print({ T: [1, 2, 3].map((d) => f(open, d, 1, 0, 1)), d0: f(open, 0, 1, 0, 1), d4: f(open, 4, 1, 0, 1), root: f(open, 2, 0, 0, 1), wide: f(open, 2, 1, 0, 5), thin: f(thin, 2, 1, 0, 1),
    mateWindow: f(open, 2, 1, h.s.MATE_SCORE - 10, h.s.MATE_SCORE - 9), inCheckFen: f(check, 2, 1, 0, 1), bytes: h.s.countermoveByteLength() });
}
if (mode === "nps") {
  // R5, a timing, NOT a count: read only in an owner-held window. search() d8, arms alternating, best of 5, ratio door / head.
  const best: Record<string, number[]> = { OFF: [0, 0], ON: [0, 0] };
  for (let rep = 0; rep < 5; rep++) for (const a of rep % 2 ? ["ON", "OFF"] : ["OFF", "ON"]) TWO.forEach(([, fen], i) => {
    const t = performance.now(); const r = arm(h, a).s(parseFen(fen), 8); const v = r.nodes / ((performance.now() - t) / 1000);
    if (v > best[a]![i]!) best[a]![i] = v;
  });
  const ratio = best.OFF!.map((v, i) => +(v / best.ON![i]!).toFixed(4));
  print({ R5_door_over_head: ratio, mean: +((ratio[0]! + ratio[1]!) / 2).toFixed(4), best });
}
