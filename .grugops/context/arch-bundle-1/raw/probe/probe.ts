// arch-bundle-1 scratch probe (forms, doors and readings by PREREG). A form is a name from forms.json, or names joined
// by "+". Usage, from the patched copy's root: node probe.ts <mode> <door form> <head,head,...> [baseRoot]
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import * as E from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import * as S from "./src/search.ts";

const { PROBE } = S as any;
const FORMS = JSON.parse(readFileSync("./forms.json", "utf8"));
const BLANK = { lmp: [0, 0, 0, 0], lmpZero: false, lmpBig3: false, cm: false, ch1: false, ch2: false, count: false, nodesFull: 0, lmpEligible: 0, lmpFiredNodes: 0, lmpSkipped: 0, ordNodes: 0, ordChanged: 0, cmHit: 0, cutAll: 0, cutFirst: 0, cutQ: 0, cutQIdx: 0, cutQKiller: 0, cutQCounter: 0, audit: 0, fired: 0, auditLog: [] };
const cfgOf = (name: string) => Object.assign({}, ...name.split("+").map((n) => { if (!(n in FORMS)) throw new Error(`no form ${n}`); return FORMS[n]; }));
const setCfg = (cfg: Record<string, unknown>) => Object.assign(PROBE, BLANK, { auditLog: [] }, cfg);
(S as any).probeSetFen(toFen);
const [mode, doorName = "MAIN", headArg = "", baseRoot] = process.argv.slice(2);
const DOOR = cfgOf(doorName);
const HEADS = headArg.split(",").filter(Boolean);
const out = (o: unknown) => console.log(JSON.stringify(o));
const isMate = (s: number) => Math.abs(s) > S.MATE_SCORE - 1000;
const mv = (m: { from: number; to: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const choose = (fen: string, d: number, f: any = E.chooseMove) => f(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as { move: any; score: number; nodes: number; depth: number };

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

if (mode === "check") {
  // The instrument: all knobs off equals the unpatched copy, nodes, score and move, in both recursions, and at the doors.
  const BS = await import(`${baseRoot}/src/search.ts`);
  const BE = await import(`${baseRoot}/src/engine.ts`);
  setCfg({});
  let same = 0, rows = 0;
  for (const name of ["kiwipete", "position-6"]) for (const d of [6, 7, 8]) {
    const fen = fenOfRoot(name);
    for (const [what, a, b] of [
      ["search", S.search(parseFen(fen), d), BS.search(parseFen(fen), d)],
      ["chooseMove", choose(fen, d), choose(fen, d, BE.chooseMove)],
      ["searchWithoutBundle", S.searchWithoutBundle(parseFen(fen), d), BS.searchWithoutBundle(parseFen(fen), d)],
      ["chooseMoveWithoutBundle", choose(fen, d, E.chooseMoveWithoutBundle), choose(fen, d, BE.chooseMoveWithoutBundle)],
    ] as const) {
      const eq = a.nodes === b.nodes && a.score === b.score && mv(a.move) === mv(b.move);
      rows++; if (eq) same++;
      out({ name, d, what, nodes: a.nodes, base: b.nodes, score: a.score, move: mv(a.move), eq });
    }
  }
  out({ check: same, of: rows });
}

if (mode === "nodes") {
  const depth = Number(process.env.D ?? 8);
  const names = (process.env.POS ?? "kiwipete,position-6").split(",");
  const read = (cfg: any) => names.map((name) => { const fen = fenOfRoot(name); setCfg(cfg); const s = S.search(parseFen(fen), depth); setCfg(cfg); const c = choose(fen, depth); return { name, s: s.nodes, c: c.nodes, sm: mv(s.move), ss: s.score, cm: mv(c.move), cs: c.score }; });
  const door = read(DOOR);
  out({ door: doorName, depth, rows: door });
  for (const h of HEADS) {
    const head = read(cfgOf(h));
    const ratios = head.flatMap((r, i) => [+(r.s / (door[i] as any).s).toFixed(4), +(r.c / (door[i] as any).c).toFixed(4)]);
    out({ head: h, door: doorName, depth, rows: head, ratios, max: Math.max(...ratios), geomean: +Math.exp(ratios.reduce((a, x) => a + Math.log(x), 0) / ratios.length).toFixed(4) });
  }
}

if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  const rows = corpus();
  const read = (cfg: any) => { setCfg(cfg); return rows.map(([, fen]) => { const c = E.chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as any; return { d: c.depth as number, m: mv(c.move) }; }); };
  const mean = (a: number[]) => +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(3);
  const door = read(DOOR);
  for (const h of HEADS) {
    const head = read(cfgOf(h));
    out({ head: h, door: doorName, maxNodes, rows: rows.length, doorMean: mean(door.map((x) => x.d)), headMean: mean(head.map((x) => x.d)), gain: +(mean(head.map((x) => x.d)) - mean(door.map((x) => x.d))).toFixed(3), deeper: head.filter((x, i) => x.d > door[i]!.d).length, shallower: head.filter((x, i) => x.d < door[i]!.d).length, moveDiff: head.filter((x, i) => x.m !== door[i]!.m).length });
  }
}

if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  const rows = corpus();
  for (const which of ["search", "chooseMove"] as const) {
    const read = (cfg: any) => { setCfg(cfg); return rows.map(([, fen]) => { const r = which === "search" ? S.search(parseFen(fen), depth) : choose(fen, depth); return { s: r.score, m: mv(r.move) }; }); };
    const door = read(DOOR);
    for (const h of HEADS) {
      const head = read(cfgOf(h));
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
      out({ head: h, door: doorName, which, depth, rows: rows.length, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff });
    }
  }
}

if (mode === "floor") {
  // The same-depth floors on the 287. The door form is the shipped path with the door's knobs; the older doors take no knob.
  const viol = (door: number[], head: number[]) => { let mates = 0; const v: string[] = []; door.forEach((r, i) => { if (!isMate(r)) return; mates++; const g = head[i] as number; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v.push(`${MATE_CORPUS[i]}: ${r} -> ${g}`); }); return { mates, violations: v.length, v }; };
  setCfg(DOOR);
  const s = (d: number) => MATE_CORPUS.map((f: string) => S.search(parseFen(f), d).score);
  const c = (d: number) => MATE_CORPUS.map((f: string) => choose(f, d).score);
  const doorS5 = s(5), doorC5 = c(5), doorC6 = c(6);
  const older: Record<string, number[]> = {
    "searchWithoutBundle d5": MATE_CORPUS.map((f: string) => S.searchWithoutBundle(parseFen(f), 5).score),
    "searchWithoutFutility d5": MATE_CORPUS.map((f: string) => S.searchWithoutFutility(parseFen(f), 5).score),
    "searchWithoutSeePruning d5": MATE_CORPUS.map((f: string) => S.searchWithoutSeePruning(parseFen(f), 5).score),
    "searchWithoutTaper d5": MATE_CORPUS.map((f: string) => S.searchWithoutTaper(parseFen(f), 5).score),
    "searchWithoutTaper d4": MATE_CORPUS.map((f: string) => S.searchWithoutTaper(parseFen(f), 4).score),
  };
  const olderC = MATE_CORPUS.map((f: string) => choose(f, 5, E.chooseMoveWithoutBundle).score);
  for (const h of HEADS) {
    setCfg(cfgOf(h));
    const s5 = s(5), c5 = c(5), c6 = c(6);
    const rows: Record<string, unknown> = { B1_search_d5: viol(doorS5, s5), B2_choose_d5: viol(doorC5, c5), R1_choose_d6: viol(doorC6, c6), B3_chooseWithoutBundle_d5: viol(olderC, c5) };
    for (const [k, v] of Object.entries(older)) rows[`B3_${k}`] = viol(v, s5);
    out({ head: h, door: doorName, rows });
  }
}

if (mode === "krk") {
  // qe-ABC-283's fresh corpus (seed 283, 300 KRK and 300 KQK), a report: the door form's shipped path against each head.
  let x = 283;
  const rnd = (n: number) => { x = (Math.imul(x, 1103515245) + 12345) >>> 0; return (x >>> 8) % n; };
  const fenOf = (b: (string | null)[], stm: string) => { const rows: string[] = []; for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const p = b[r * 8 + f]; if (!p) e++; else { if (e) s += e; e = 0; s += p; } } if (e) s += e; rows.push(s); } return `${rows.join("/")} ${stm} - - 0 1`; };
  const adj = (a: number, c: number) => Math.abs((a >> 3) - (c >> 3)) <= 1 && Math.abs((a & 7) - (c & 7)) <= 1;
  const rows: string[] = [];
  for (const piece of ["R", "Q"]) { let made = 0; while (made < 300) { const white = rnd(2) === 0; const stm = rnd(2) === 0 ? "w" : "b"; const sq = [rnd(64), rnd(64), rnd(64)] as number[]; if (new Set(sq).size < 3 || adj(sq[0]!, sq[1]!)) continue; const b: (string | null)[] = Array(64).fill(null); b[sq[0]!] = white ? "K" : "k"; b[sq[1]!] = white ? "k" : "K"; b[sq[2]!] = white ? piece : piece.toLowerCase(); const fen = fenOf(b, stm); let p; try { p = parseFen(fen); } catch { continue; } if (legalMoves(p).length === 0) continue; rows.push(fen); made++; } }
  const reads: [string, (f: string) => number][] = [["search d5", (f) => S.search(parseFen(f), 5).score], ["chooseMove d5", (f) => choose(f, 5).score], ["chooseMove d6", (f) => choose(f, 6).score]];
  for (const [what, fn] of reads) {
    setCfg(DOOR); const door = rows.map(fn);
    for (const h of HEADS) { setCfg(cfgOf(h)); const head = rows.map(fn); let mates = 0, v = 0; door.forEach((r, i) => { if (!isMate(r)) return; mates++; const g = head[i]!; if (!isMate(g) || Math.sign(g) !== Math.sign(r)) v++; }); out({ head: h, door: doorName, what, corpus: rows.length, mates, violations: v }); }
  }
}

if (mode === "zug") {
  const rows = [["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9], ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8], ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8], ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8], ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8], ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11], ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12]] as const;
  for (const h of HEADS) {
    setCfg(cfgOf(h));
    let ok = 0; const detail: unknown[] = [];
    for (const [name, fen, want, d] of rows) { const c = choose(fen, d); const good = mv(c.move) === want && c.depth === d; if (good) ok++; detail.push({ name, d, played: mv(c.move), good, nodes: c.nodes }); }
    out({ head: h, zugzwang: ok, of: rows.length, detail });
  }
}

if (mode === "g1") {
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  for (const h of HEADS) {
    setCfg(cfgOf(h));
    let solved = 0; const missed: string[] = [];
    for (const p of PUZZLES as any[]) { const c = E.chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any; const chosen = c === null ? "null" : mv(c.move); const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen); if (ok) solved++; else missed.push(p.name); }
    out({ head: h, solved, total: (PUZZLES as any[]).length, newlyMissed: missed.filter((n) => !base.unsolved.includes(n)), newlySolved: (base.unsolved as string[]).filter((n) => !missed.includes(n)) });
  }
}

if (mode === "audit") {
  // ADR-0061's audit: search() at depth 6 over the 190 + 6 endgames, every 10th node where P4 skipped a move, each searched
  // fresh three times with the tables as they stood at the mark: head at the node's window, door at it, door full window.
  const depth = Number(process.env.D ?? 6);
  const every = Number(process.env.AUD ?? 10);
  const INF = Number.POSITIVE_INFINITY;
  for (const h of HEADS) {
    const headCfg = cfgOf(h);
    const blank = () => ({ n: 0, flips: 0, ffl: 0, ffh: 0, unstable: 0, e100: 0, e200: 0, e300: 0, e500: 0 });
    const by: Record<string, ReturnType<typeof blank>> = {};
    const big: unknown[] = [];
    let fired = 0, sampled = 0, carried = 0;
    for (const [, fen] of corpus()) {
      setCfg({ ...headCfg, audit: every, fired: carried });
      S.search(parseFen(fen), depth);
      carried = PROBE.fired;
      fired += PROBE.lmpFiredNodes;
      const log = PROBE.auditLog as any[];
      sampled += log.length;
      for (const r of log) {
        if (Math.abs(r.alpha) > 15000) continue;
        setCfg(headCfg); const hv = (S as any).probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r);
        setCfg(DOOR); const dnw = (S as any).probeNode(parseFen(r.fen), r.depth, r.alpha, r.beta, r);
        const v = (S as any).probeNode(parseFen(r.fen), r.depth, 0 - INF, INF, r);
        for (const key of ["all", `d${r.depth}`]) {
          const row = (by[key] ??= blank());
          row.n++;
          const hFL = hv <= r.alpha, dFL = dnw <= r.alpha;
          if (hFL === dFL) continue;
          row.flips++;
          let err: number;
          if (hFL) { row.ffl++; err = v - r.alpha; } else { row.ffh++; err = r.beta - v; }
          if (err <= 0) { row.unstable++; continue; }
          if (err >= 100) row.e100++;
          if (err >= 200) row.e200++;
          if (err >= 300) row.e300++;
          if (err >= 500) row.e500++;
          if (key === "all" && err >= 200) big.push({ err, depth: r.depth, fen: r.fen, alpha: r.alpha, hv, dnw, v });
        }
      }
    }
    out({ head: h, door: doorName, depth, every, fired, sampled });
    for (const [k, row] of Object.entries(by).sort()) out({ head: h, key: k, ...row, flipPct: +(100 * row.flips / row.n).toFixed(2) });
    for (const b of (big as any[]).sort((x, y) => y.err - x.err).slice(0, 8)) out({ head: h, top: b });
  }
}

if (mode === "fire") {
  // The firing figure at 100 ms: chooseMove at 47 000 nodes on the 190 (frozen clock).
  const rows = corpus();
  for (const h of HEADS) {
    setCfg({ ...cfgOf(h), count: true });
    let nodes = 0, depths = 0;
    for (const [, fen] of rows) { const c = E.chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes: 47000 }) as any; nodes += c.nodes; depths += c.depth; }
    const p = PROBE;
    out({ head: h, rows: rows.length, nodes, meanDepth: +(depths / rows.length).toFixed(3), lmpEligible: p.lmpEligible, lmpFiredNodes: p.lmpFiredNodes, lmpSkipped: p.lmpSkipped, firedPer1000Nodes: +(1000 * p.lmpFiredNodes / nodes).toFixed(2), firedPctOfEligible: p.lmpEligible ? +(100 * p.lmpFiredNodes / p.lmpEligible).toFixed(2) : 0, ordNodes: p.ordNodes, ordChangedPct: p.ordNodes ? +(100 * p.ordChanged / p.ordNodes).toFixed(2) : 0, cmHitPct: p.ordNodes ? +(100 * p.cmHit / p.ordNodes).toFixed(2) : 0, cutAll: p.cutAll, cutFirstPct: +(100 * p.cutFirst / p.cutAll).toFixed(2), cutQ: p.cutQ, cutQMeanIdx: +(p.cutQIdx / p.cutQ).toFixed(3), cutQKillerPct: +(100 * p.cutQKiller / p.cutQ).toFixed(2), cutQCounterPct: +(100 * p.cutQCounter / p.cutQ).toFixed(2), bytes: (S as any).probeByteLength() });
  }
}

if (mode === "nps") {
  // A report, timing read with the host lock held: `search()` at depth 8, alternating arms, the best of REPS; and the clear.
  const reps = Number(process.env.REPS ?? 5);
  const arms = [doorName, ...HEADS];
  const best: Record<string, Record<string, number>> = {};
  for (let r = 0; r < reps; r++) for (const a of arms) for (const name of ["kiwipete", "position-6"]) {
    setCfg(cfgOf(a));
    const t0 = performance.now();
    const res = S.search(parseFen(fenOfRoot(name)), 8);
    const nps = res.nodes / ((performance.now() - t0) / 1000);
    const row = (best[a] ??= {});
    row[name] = Math.max(row[name] ?? 0, nps);
  }
  for (const a of arms) {
    setCfg(cfgOf(a));
    const t0 = performance.now();
    for (let i = 0; i < 2000; i++) S.clearHistory();
    out({ arm: a, nps: best[a], clearMicros: +((performance.now() - t0) / 2).toFixed(1), ratioToDoor: Object.fromEntries(Object.entries(best[a]!).map(([k, v]) => [k, +(best[doorName]![k]! / v).toFixed(4)])) });
  }
}
