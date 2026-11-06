// se-ABC-303 driver: the offline rows on the BUILT doors, no knob, nothing in src/ or tools/. The probe's corpus and
// readers (arch-bundle-1 raw/probe/probe.ts), with its forms replaced by the four doors:
//   ALL = search / chooseMove, OFF = ...WithoutQuietBundle, NOP4 = ...WithoutMoveCountPruning, NOCM = ...WithoutCountermove.
// Usage: node read.ts <mode> <root> [baseRoot]; run each mode in its own process.
import { readFileSync } from "node:fs";
const [mode, root, baseRoot] = process.argv.slice(2);
const load = async (r: string) => ({ S: await import(`${r}/src/search.ts`), E: await import(`${r}/src/engine.ts`) });
const { S, E } = await load(root as string);
const { makeMove, unmakeMove } = await import(`${root}/src/apply.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { gameStatus } = await import(`${root}/src/gameend.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { MATE_CORPUS } = await import(`${root}/src/search.mate-corpus.ts`);
type Pair = { s: any; c: any };
const ARM: Record<string, Pair> = {
  ALL: { s: S.search, c: E.chooseMove },
  OFF: { s: S.searchWithoutQuietBundle, c: E.chooseMoveWithoutQuietBundle },
  NOP4: { s: S.searchWithoutMoveCountPruning, c: E.chooseMoveWithoutMoveCountPruning },
  NOCM: { s: S.searchWithoutCountermove, c: E.chooseMoveWithoutCountermove },
};
const out = (o: unknown) => console.log(JSON.stringify(o));
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const choose = (fen: string, d: number, f: any) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d });
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
] as const;
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
] as const;
const fenOfRoot = (name: string) => (ROOTS.find((r) => r[0] === name) as readonly string[])[1] as string;
function corpus(): [string, string][] {
  const rows: [string, string][] = [];
  for (const [name, fen] of ROOTS) {
    rows.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") rows.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...rows, ...(ENDGAMES as unknown as [string, string][])];
}

if (mode === "s1") {
  // S1: the all-off door against the base's shipped path. S2: every older door against the same door on the base.
  const { S: BS, E: BE } = await load(baseRoot as string);
  let same = 0, rows = 0;
  const eq = (a: any, b: any) => a.nodes === b.nodes && a.score === b.score && mv(a.move) === mv(b.move);
  for (const name of ["kiwipete", "position-6"]) for (const d of [6, 7, 8]) {
    const fen = fenOfRoot(name);
    for (const [what, a, b] of [["search", S.searchWithoutQuietBundle(parseFen(fen), d), BS.search(parseFen(fen), d)], ["chooseMove", choose(fen, d, E.chooseMoveWithoutQuietBundle), choose(fen, d, BE.chooseMove)]] as const) {
      const ok = eq(a, b); rows++; if (ok) same++;
      out({ row: "S1", name, d, what, nodes: a.nodes, base: b.nodes, score: a.score, move: mv(a.move), eq: ok });
    }
  }
  out({ S1: same, of: rows });
}
if (mode === "s2") {
  const { S: BS, E: BE } = await load(baseRoot as string);
  let same = 0, rows = 0;
  const eq = (a: any, b: any) => a.nodes === b.nodes && a.score === b.score && mv(a.move) === mv(b.move);
  const NEW = /MoveCountPruning|Countermove|QuietBundle/;
  const doorsS = Object.keys(BS).filter((k) => /^searchWithout/.test(k) && !NEW.test(k));
  const doorsE = Object.keys(BE).filter((k) => /^chooseMoveWithout/.test(k) && !NEW.test(k));
  for (const [name, fen] of ROOTS.filter((r) => r[0] === "kiwipete" || r[0] === "position-6")) {
    for (const k of doorsS) {
      const d = /Pruning$|PruningOrQuiescence/.test(k) && !/See|Futility/.test(k) ? 3 : 5;
      const a = S[k](parseFen(fen), d), b = BS[k](parseFen(fen), d); const ok = eq(a, b); rows++; if (ok) same++;
      out({ row: "S2", door: k, name, d, nodes: a.nodes, base: b.nodes, eq: ok });
    }
    for (const k of doorsE) {
      const a = choose(fen, 6, E[k]), b = choose(fen, 6, BE[k]); const ok = eq(a, b); rows++; if (ok) same++;
      out({ row: "S2", door: k, name, d: 6, nodes: a.nodes, base: b.nodes, eq: ok });
    }
  }
  out({ S2: same, of: rows, doorsS: doorsS.length, doorsE: doorsE.length });
}
if (mode === "nodes") {
  const depth = Number(process.env.D ?? 8);
  const read = (a: string) => ["kiwipete", "position-6"].map((name) => { const fen = fenOfRoot(name); const s = ARM[a]!.s(parseFen(fen), depth); const c = choose(fen, depth, ARM[a]!.c); return { name, s: s.nodes, c: c.nodes, sm: mv(s.move), ss: s.score, cm: mv(c.move), cs: c.score }; });
  const R: Record<string, any[]> = {}; for (const a of Object.keys(ARM)) { R[a] = read(a); out({ arm: a, depth, rows: R[a] }); }
  const ratio = (h: string, d: string) => R[h]!.flatMap((r, i) => [+(r.s / R[d]![i].s).toFixed(4), +(r.c / R[d]![i].c).toFixed(4)]);
  out({ row: "P3 all/NOP4", ratios: ratio("ALL", "NOP4") });
  out({ row: "R3 all/NOCM", ratios: ratio("ALL", "NOCM") });
  out({ row: "R3 NOP4/OFF", ratios: ratio("NOP4", "OFF") });
  out({ row: "R6 all/OFF", ratios: ratio("ALL", "OFF") });
}
if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = corpus();
  const read = (a: string) => rows.map(([, fen]) => { const c = ARM[a]!.c(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }); return { d: c.depth as number, m: mv(c.move) }; });
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3);
  const head = read("ALL");
  for (const dn of ["NOP4", "OFF"]) {
    const door = read(dn);
    out({ head: "ALL", door: dn, maxNodes, rows: rows.length, doorMean: mean(door.map((x) => x.d)), headMean: mean(head.map((x) => x.d)), gain: +(mean(head.map((x) => x.d)) - mean(door.map((x) => x.d))).toFixed(3), deeper: head.filter((x, i) => x.d > door[i]!.d).length, shallower: head.filter((x, i) => x.d < door[i]!.d).length, moveDiff: head.filter((x, i) => x.m !== door[i]!.m).length });
  }
}
if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  const rows = corpus();
  for (const which of ["search", "chooseMove"] as const) {
    const read = (a: string) => rows.map(([, fen]) => { const r = which === "search" ? ARM[a]!.s(parseFen(fen), depth) : choose(fen, depth, ARM[a]!.c); return { s: r.score as number, m: mv(r.move) }; });
    const head = read("ALL");
    for (const dn of ["NOP4", "OFF", "NOCM"]) {
      const door = read(dn);
      let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
      head.forEach((b, i) => {
        const a = door[i]!;
        if (a.m !== b.m) moveDiff++;
        if (isMate(a.s) !== isMate(b.s)) { mateFlip++; return; }
        if (isMate(a.s)) { if (Math.sign(a.s) !== Math.sign(b.s)) signFlip++; return; }
        n++;
        const d = Math.abs(a.s - b.s);
        if (d <= 25) within++;
        if (d > max) { max = d; maxName = `${rows[i]![0]} ${a.s}->${b.s}`; }
      });
      out({ head: "ALL", door: dn, which, depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff });
    }
  }
}
if (mode === "floor") {
  const viol = (door: number[], head: number[]) => { let mates = 0; const v: string[] = []; door.forEach((r, i) => { if (!isMate(r)) return; mates++; const g = head[i] as number; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v.push(`${MATE_CORPUS[i]}: ${r} -> ${g}`); }); return { mates, violations: v.length, v }; };
  const s = (f: any, d: number) => MATE_CORPUS.map((x: string) => f(parseFen(x), d).score as number);
  const c = (f: any, d: number) => MATE_CORPUS.map((x: string) => choose(x, d, f).score as number);
  const older: Record<string, number[]> = {
    "searchWithoutBundle d5": s(S.searchWithoutBundle, 5),
    "searchWithoutFutility d5": s(S.searchWithoutFutility, 5),
    "searchWithoutSeePruning d5": s(S.searchWithoutSeePruning, 5),
    "searchWithoutTaper d5": s(S.searchWithoutTaper, 5),
    "searchWithoutTaper d4": s(S.searchWithoutTaper, 4),
  };
  const olderC = c(E.chooseMoveWithoutBundle, 5);
  const doorS5 = s(ARM.OFF!.s, 5), doorC5 = c(ARM.OFF!.c, 5), doorC6 = c(ARM.OFF!.c, 6);
  for (const a of ["ALL", "NOP4", "NOCM"]) {
    const s5 = s(ARM[a]!.s, 5), c5 = c(ARM[a]!.c, 5), c6 = c(ARM[a]!.c, 6);
    const rows: Record<string, unknown> = { B1_search_d5: viol(doorS5, s5), B2_choose_d5: viol(doorC5, c5), R1_choose_d6: viol(doorC6, c6), B3_chooseWithoutBundle_d5: viol(olderC, c5) };
    for (const [k, v] of Object.entries(older)) rows[`B3_${k}`] = viol(v, s5);
    out({ head: a, rows });
  }
}
if (mode === "krk") {
  let x = 283;
  const rnd = (n: number) => { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 8) % n; };
  const fenOf = (b: (string | null)[], stm: string) => { const rows: string[] = []; for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const p = b[r * 8 + f]; if (!p) e++; else { if (e) s += e; e = 0; s += p; } } if (e) s += e; rows.push(s); } return `${rows.join("/")} ${stm} - - 0 1`; };
  const adj = (a: number, c: number) => Math.abs((a >> 3) - (c >> 3)) <= 1 && Math.abs((a & 7) - (c & 7)) <= 1;
  const rows: string[] = [];
  for (const piece of ["R", "Q"]) { let made = 0; while (made < 300) { const white = rnd(2) === 0; const stm = rnd(2) === 0 ? "w" : "b"; const sq = [rnd(64), rnd(64), rnd(64)] as number[]; if (new Set(sq).size < 3 || adj(sq[0]!, sq[1]!)) continue; const b: (string | null)[] = Array(64).fill(null); b[sq[0]!] = white ? "K" : "k"; b[sq[1]!] = white ? "k" : "K"; b[sq[2]!] = white ? piece : piece.toLowerCase(); const fen = fenOf(b, stm); let p; try { p = parseFen(fen); } catch { continue; } if (legalMoves(p).length === 0) continue; rows.push(fen); made++; } }
  const reads: [string, (f: string, a: string) => number][] = [["search d5", (f, a) => ARM[a]!.s(parseFen(f), 5).score], ["chooseMove d5", (f, a) => choose(f, 5, ARM[a]!.c).score], ["chooseMove d6", (f, a) => choose(f, 6, ARM[a]!.c).score]];
  for (const [what, fn] of reads) { const door = rows.map((f) => fn(f, "OFF")); const head = rows.map((f) => fn(f, "ALL")); let mates = 0, v = 0; door.forEach((r, i) => { if (!isMate(r)) return; mates++; const g = head[i]!; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v++; }); out({ head: "ALL", door: "OFF", what, corpus: rows.length, mates, violations: v }); }
}
if (mode === "zug") {
  const rows = [["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9], ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8], ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8], ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8], ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8], ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11], ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12]] as const;
  let ok = 0; const detail: unknown[] = [];
  for (const [name, fen, want, d] of rows) { const c = choose(fen, d, E.chooseMove); const good = mv(c.move) === want && c.depth === d; if (good) ok++; detail.push({ name, d, played: mv(c.move), good, nodes: c.nodes }); }
  out({ head: "ALL", zugzwang: ok, of: rows.length, detail });
}
if (mode === "g1") {
  const { PUZZLES } = await import(`${root}/src/puzzle-corpus.ts`);
  const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
  const base = JSON.parse(readFileSync(`${root}/src/puzzle-suite.baseline.json`, "utf8"));
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) { const c = E.chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }); const chosen = c === null ? "null" : mv(c.move); const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen); if (ok) solved++; else missed.push(p.name); }
  out({ head: "ALL", solved, total: (PUZZLES as any[]).length, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)), newlySolved: (base.unsolved as string[]).filter((n) => !missed.includes(n)) });
}
if (mode === "nps") {
  const reps = Number(process.env.REPS ?? 5);
  const best: Record<string, Record<string, number>> = {};
  for (let r = 0; r < reps; r++) for (const a of ["OFF", "ALL", "NOP4", "NOCM"]) for (const name of ["kiwipete", "position-6"]) {
    const t0 = performance.now();
    const res = ARM[a]!.s(parseFen(fenOfRoot(name)), 8);
    const nps = res.nodes / ((performance.now() - t0) / 1000);
    const row = (best[a] ??= {});
    row[name] = Math.max(row[name] ?? 0, nps);
  }
  for (const a of Object.keys(best)) out({ arm: a, nps: best[a], ratioToDoor: Object.fromEntries(Object.entries(best[a]!).map(([k, v]) => [k, +(best.OFF![k]! / v).toFixed(4)])) });
}
if (mode === "bytes") out({ P5: S.countermoveByteLength() });
