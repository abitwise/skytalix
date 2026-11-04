// SCRATCH PROBE (arch-ABC-271). Runs on a patched scratch tree (patch_e4a.py), copied to its root. Adapted from
// arch-ABC-270's k3probe.ts (modes nodes / mate / zug / g1 / reach / drift unchanged in logic; forms replaced).
// Forms (king distance KD, free path FP, unstoppable UN): BASE (all off = main), H (all three: the candidate),
// KD, FP, UN, KF, KU, FU. Deterministic counts only; no timing here. Usage: node e4aprobe.ts <mode> <FORM>
import { readFileSync } from "node:fs";
import { makeMove, unmakeMove } from "./src/apply.ts";
import { chooseMove } from "./src/engine.ts";
import { evaluate, phaseOf, setE4aForm } from "./src/evaluate.ts";
import { buildCorpus, mirrorPosition } from "./src/evaluate.mirror-corpus.ts";
import { TAPER_MIRROR_POSITIONS } from "./src/evaluate.taper-corpus.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { legalMoves } from "./src/legal.ts";
import { squareName } from "./src/position.ts";
import { parseSan } from "./src/san.ts";
import { MATE_CORPUS } from "./src/search.mate-corpus.ts";
import { MATE_SCORE, search } from "./src/search.ts";

const FORMS: Record<string, [boolean, boolean, boolean]> = {
  BASE: [false, false, false],
  H: [true, true, true],
  KD: [true, false, false],
  FP: [false, true, false],
  UN: [false, false, true],
  KF: [true, true, false],
  KU: [true, false, true],
  FU: [false, true, true],
};
const setForm = (f: string) => setE4aForm(...(FORMS[f] as [boolean, boolean, boolean]));
const [mode, form] = process.argv.slice(2) as [string, string];
if (!(form in FORMS)) throw new Error(`form ${form}`);
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const mv = (m: { from: number; to: number; promotion?: number } | null) => (m ? squareName(m.from) + squareName(m.to) : "-");
const choose = (fen: string, d: number) =>
  chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxDepth: d }) as unknown as { move: any; score: number; nodes: number; depth: number };

const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"],
  ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"],
  ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"],
  ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"],
  ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
// Twelve new passer positions at phases 0..24 (the mirror rows; written before any reading).
const PASSER_SET = [
  "8/8/4k3/P7/8/8/8/7K w - - 0 1",
  "8/8/3k4/P7/8/8/8/7K b - - 0 1",
  "8/1P6/8/8/8/8/5k2/2K5 w - - 0 1",
  "8/8/8/2k5/8/5K2/p7/8 w - - 0 1",
  "6k1/8/8/3P4/8/8/2p5/6K1 b - - 0 1",
  "8/5pk1/8/1P6/8/8/6PP/6K1 w - - 0 1",
  "4r1k1/5ppp/8/1P6/8/8/5PPP/3R2K1 w - - 0 1",
  "2r3k1/5ppp/1P6/8/8/8/5PPP/2R3K1 b - - 0 1",
  "3r2k1/1P3ppp/8/8/3n4/8/5PPP/1R4K1 w - - 0 1",
  "r4rk1/pP3ppp/8/8/8/8/P4PPP/R4RK1 w - - 0 1",
  "4k3/8/8/8/2p5/8/8/4K2R w - - 0 1",
  "rn1qkbnr/pPp2ppp/8/8/8/8/P1PP1PPP/RNBQKBNR b KQkq - 0 1",
];
function corpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, fen] of ROOTS) {
    out.push([name as string, fen as string]);
    const p = parseFen(fen as string);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...(ENDGAMES as [string, string][])];
}
const fenOf = (name: string) => (ROOTS.find((r) => r[0] === name) as string[])[1] as string;
// evaluate from White's side
const white = (fen: string) => { const p = parseFen(fen); const e = evaluate(p); return p.blackToMove ? -e : e; };

if (mode === "nodes") {
  const depths = (process.env.DS ?? "7,8").split(",").map(Number);
  const rec = process.env.REC ?? "choose";
  for (const name of (process.env.POS ?? "kiwipete,position-6").split(",")) {
    for (const d of depths) {
      setForm(form);
      const r = rec === "search" ? search(parseFen(fenOf(name)), d) : choose(fenOf(name), d);
      console.log(JSON.stringify({ form, rec, name, d, nodes: r.nodes, score: r.score, move: mv(r.move) }));
    }
  }
} else if (mode === "mate") {
  const d = Number(process.env.D ?? 4);
  const plus = Number(process.env.PLUS ?? 1);
  let mates = 0, viol = 0, longer = 0; const bad: string[] = [];
  for (const fen of MATE_CORPUS) {
    setForm("BASE"); const a = search(parseFen(fen), d);
    if (!isMate(a.score)) continue;
    mates++;
    setForm(form); const b = search(parseFen(fen), d + plus);
    if (!isMate(b.score) || Math.sign(b.score) !== Math.sign(a.score)) { viol++; bad.push(fen); }
    else if (Math.abs(b.score) < Math.abs(a.score)) longer++;
  }
  console.log(JSON.stringify({ form, d, plus, corpus: MATE_CORPUS.length, mates, viol, longer, bad }));
} else if (mode === "zug") {
  const rows = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
  ] as const;
  setForm(form);
  let ok = 0;
  for (const [name, fen, want, d] of rows) {
    const c = choose(fen, d);
    const hit = mv(c.move) === want;
    if (hit) ok++;
    console.log(JSON.stringify({ form, name, d, played: mv(c.move), score: c.score, want, ok: hit, nodes: c.nodes }));
  }
  console.log(JSON.stringify({ form, zugzwang: `${ok} / ${rows.length}` }));
} else if (mode === "zz001") {
  // zugzwang.001 at depth 9: v(m) = -search(after m, 8) for e1f1 and e1e5, White's view (arch-ABC-239-f3f4 D2's form)
  setForm(form);
  const fen = "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1";
  const p = parseFen(fen);
  const out: Record<string, number> = {};
  for (const want of ["e1f1", "e1e5"]) {
    const m = legalMoves(p).find((x) => mv(x) === want)!;
    const u = makeMove(p, m);
    out[want] = -search(p, 8).score;
    unmakeMove(p, m, u);
  }
  const c = choose(fen, 9);
  console.log(JSON.stringify({ form, d: 9, v_e1f1: out.e1f1, v_e1e5: out.e1e5, gap: out.e1f1! - out.e1e5!, played: mv(c.move), score: c.score, nodes: c.nodes }));
} else if (mode === "g1") {
  const { PUZZLES } = await import("./src/puzzle-corpus.ts");
  const { virtualClock } = await import("./src/virtual-clock.ts");
  const base = JSON.parse(readFileSync("./src/puzzle-suite.baseline.json", "utf8"));
  setForm(form);
  let solved = 0; const missed: string[] = [];
  for (const p of PUZZLES as any[]) {
    const c = chooseMove(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) }) as any;
    const chosen = c === null ? "null" : mv(c.move);
    const ok = p.kind === "do-not-hang" ? chosen !== p.losing : p.accept.includes(chosen);
    if (ok) solved++; else missed.push(p.name);
  }
  const newly = missed.filter((n) => !base.unsolved.includes(n));
  const newlySolved = (base.unsolved as string[]).filter((n) => !missed.includes(n));
  console.log(JSON.stringify({ form, solved, total: (PUZZLES as any[]).length, newlyMissed: newly, newlySolved }));
} else if (mode === "reach") {
  const maxNodes = Number(process.env.N ?? 47000);
  setForm(form);
  const depths: number[] = [];
  for (const [, fen] of corpus()) {
    const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes }) as unknown as { depth: number };
    depths.push(c.depth);
  }
  console.log(JSON.stringify({ form, maxNodes, rows: depths.length, meanDepth: +(depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(3) }));
} else if (mode === "drift") {
  const depth = Number(process.env.D ?? 5);
  let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0;
  for (const [name, fen] of corpus()) {
    setForm("BASE"); const a = choose(fen, depth);
    setForm(form); const b = choose(fen, depth);
    if (mv(a.move) !== mv(b.move)) moveDiff++;
    if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
    if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
    n++;
    const dd = Math.abs(a.score - b.score);
    if (dd <= 25) within++;
    if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
  }
  console.log(JSON.stringify({ form, depth, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff }));
} else if (mode === "static") {
  setForm(form);
  // (E1) mirror, Object.is: G3's corpus + ABC-269's frozen mirror set + the twelve passer positions
  const mirrorPositions = [...buildCorpus().map(({ position }) => position), ...TAPER_MIRROR_POSITIONS.map((r) => parseFen(r.fen)), ...PASSER_SET.map((f) => parseFen(f))];
  let pairs = 0, bad = 0;
  for (const position of mirrorPositions) { pairs++; if (!Object.is(evaluate(position), evaluate(mirrorPosition(position)))) bad++; }
  // (E2) phase 24 is E1: every position of those sets and of the corpus with phase >= 24, Object.is vs BASE
  const all = [...mirrorPositions.map((p) => toFen(p)), ...corpus().map((r) => r[1])];
  const full = all.filter((f) => phaseOf(parseFen(f)) >= 24);
  const headFull = full.map((f) => evaluate(parseFen(f)));
  // (report) how many positions of the sets move at all, any phase
  const headAll = all.map((f) => evaluate(parseFen(f)));
  setForm("BASE");
  const baseFull = full.map((f) => evaluate(parseFen(f)));
  const baseAll = all.map((f) => evaluate(parseFen(f)));
  let p24bad = 0; for (let i = 0; i < full.length; i++) if (!Object.is(headFull[i], baseFull[i])) p24bad++;
  let moved = 0, maxMove = 0; for (let i = 0; i < all.length; i++) { const d = Math.abs((headAll[i] as number) - (baseAll[i] as number)); if (d) moved++; if (d > maxMove) maxMove = d; }
  console.log(JSON.stringify({ form, mirrorPairs: pairs, mirrorMismatches: bad, phase24Positions: full.length, phase24Mismatches: p24bad, setPositions: all.length, moved, maxMove }));
} else if (mode === "rel") {
  // (E3) relations, generated over every K+P v K placement (phase 0), White's pawn, both sides to move; plus the
  // same with a rook each (phase 4) for (d). Kings never adjacent, never on the pawn, the side not to move not in check.
  // Fixture conditions named in the PREREG: twin kings share the king's endgame table value (same m) and the same
  // reach (king moves on the empty board). Rows read the form's evaluate from the passer's side (White).
  setForm(form);
  const sq = (f: number, r: number) => "abcdefgh"[f]! + (r + 1);
  const cheb = (a: number[], b: number[]) => Math.max(Math.abs(a[0]! - b[0]!), Math.abs(a[1]! - b[1]!));
  const m = (k: number[]) => Math.min(...[[3, 3], [4, 3], [3, 4], [4, 4]].map((c) => Math.abs(k[0]! - c[0]!) + Math.abs(k[1]! - c[1]!)));
  const reach = (k: number[]) => { let n = 0; for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) { if (!df && !dr) continue; const f = k[0]! + df, r = k[1]! + dr; if (f >= 0 && f < 8 && r >= 0 && r < 8) n++; } return n; };
  const fenFor = (pawn: number[], wk: number[], bk: number[], btm: boolean, rooks: boolean) => {
    const b: string[][] = Array.from({ length: 8 }, () => Array(8).fill(""));
    b[pawn[1]!]![pawn[0]!] = "P"; b[wk[1]!]![wk[0]!] = "K"; b[bk[1]!]![bk[0]!] = "k";
    if (rooks) { if (b[0]![0]) return null; b[0]![0] = "R"; if (b[7]![7]) return null; b[7]![7] = "r"; }
    const rows: string[] = [];
    for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const c = b[r]![f]; if (!c) e++; else { if (e) s += e; e = 0; s += c; } } if (e) s += e; rows.push(s); }
    return `${rows.join("/")} ${btm ? "b" : "w"} - - 0 1`;
  };
  const legal = (fen: string) => { try { const p = parseFen(fen); return gameStatus(p).result === "in-progress" && legalMoves(p).length > 0; } catch { return false; } };
  const U = 400;
  let cPairs = 0, cFail = 0, cPairsAny = 0, cFailAny = 0; const cEx: string[] = [];
  let dPairs = 0, dFail = 0, dPairsAny = 0, dFailAny = 0; const dEx: string[] = [];
  const unst = (pawn: number[], bk: number[], btm: boolean) => { const moves = pawn[1] === 1 ? 5 : 7 - pawn[1]!; return moves < cheb(bk, [pawn[0]!, 7]) - (btm ? 1 : 0); };
  const wk = [7, 0]; // white king h1 unless it collides; then a1
  for (let pf = 0; pf < 8; pf++) for (let pr = 1; pr <= 6; pr++) for (const btm of [false, true]) for (const rooks of [false, true]) {
    const pawn = [pf, pr]; const q = [pf, 7];
    const kW = pf >= 6 ? [0, 0] : wk; if (rooks && kW[0] === 0 && kW[1] === 0) continue;
    for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) {
      const far = [f, r];
      if ((f === pf && r === pr) || cheb(far, kW) <= 1) continue;
      for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
        if (!df && !dr) continue;
        const near = [f + df, r + dr];
        if (near[0]! < 0 || near[0]! > 7 || near[1]! < 0 || near[1]! > 7) continue;
        if ((near[0] === pf && near[1] === pr) || cheb(near, kW) <= 1) continue;
        if (cheb(near, q) !== cheb(far, q) - 1) continue; // one step nearer the queening square
        const fa = fenFor(pawn, kW, far, btm, rooks), fn = fenFor(pawn, kW, near, btm, rooks);
        if (!fa || !fn || !legal(fa) || !legal(fn)) continue;
        const same = m(far) === m(near) && reach(far) === reach(near);
        const diff = white(fa) - white(fn);
        if (!rooks) {
          // (c) the square: far outside, near inside
          if (unst(pawn, far, btm) && !unst(pawn, near, btm)) {
            cPairsAny++; if (diff < U) cFailAny++;
            if (same) { cPairs++; if (diff < U) { cFail++; if (cEx.length < 4) cEx.push(`${fa} | ${fn} : ${diff}`); } }
          }
        }
        // (d) monotone: same unstoppable status, farther distance <= 5
        if (unst(pawn, far, btm) === unst(pawn, near, btm) && cheb(far, q) <= 5) {
          dPairsAny++; if (!(diff > 0)) dFailAny++;
          if (same) { dPairs++; if (!(diff > 0)) { dFail++; if (dEx.length < 4) dEx.push(`${fa} | ${fn} : ${diff}`); } }
        }
      }
    }
  }
  // (e) free path: KPK + a black knight either on a square ahead of the pawn or on a8/h8 (off the path); the
  // form's evaluate minus the same form without FP equals FREE[R] x (24 - phase) / 24 truncated only when empty.
  const FREE = [0, 5, 10, 20, 35, 60, 100, 0];
  let ePairs = 0, eFail = 0; const eEx: string[] = [];
  const hasFP = FORMS[form]![1];
  for (let pf = 1; pf < 7; pf++) for (let pr = 1; pr <= 5; pr++) {
    for (let ar = pr + 1; ar <= 7; ar++) {
      const mk = (nf: number, nr: number) => {
        const b: string[][] = Array.from({ length: 8 }, () => Array(8).fill(""));
        b[pr]![pf] = "P"; b[0]![pf <= 3 ? 7 : 0] = "K"; b[7]![pf <= 3 ? 6 : 1] = "k"; if (b[nr]![nf]) return null; b[nr]![nf] = "n";
        const rows: string[] = []; for (let r = 7; r >= 0; r--) { let s = "", e = 0; for (let f = 0; f < 8; f++) { const c = b[r]![f]; if (!c) e++; else { if (e) s += e; e = 0; s += c; } } if (e) s += e; rows.push(s); }
        return `${rows.join("/")} w - - 0 1`;
      };
      const blocked = mk(pf, ar), open = mk(pf <= 3 ? 7 : 0, 3);
      if (!blocked || !open || !legal(blocked) || !legal(open)) continue;
      const fpPart = (fen: string) => { const [k, , u] = FORMS[form]!; const a = white(fen); setE4aForm(k, false, u); const b2 = white(fen); setForm(form); return a - b2; };
      const want = hasFP ? Math.trunc((FREE[pr]! * (24 - 1)) / 24) : 0; // one knight: phase 1
      ePairs++;
      const pb = fpPart(blocked), po = fpPart(open);
      // the blend truncates the whole delta, so allow the truncation of the rest (|error| < 1)
      if (!(pb === 0 && Math.abs(po - want) <= 1)) { eFail++; if (eEx.length < 4) eEx.push(`${blocked}: ${pb} | ${open}: ${po} want ${want}`); }
    }
  }
  console.log(JSON.stringify({ form, U, c: { pairsSameKingCell: cPairs, fail: cFail, pairsAny: cPairsAny, failAny: cFailAny, ex: cEx }, d: { pairsSameKingCell: dPairs, fail: dFail, pairsAny: dPairsAny, failAny: dFailAny, ex: dEx }, e: { pairs: ePairs, fail: eFail, ex: eEx } }));
} else if (mode === "fire") {
  // The firing figure at 100 ms: every position of the 200 C2' games at 100 ms on record (qe-ABC-269 b8, qe-ABC-279
  // c2), static evaluate, form minus BASE. Phase and passers as played at 100 ms.
  const files = (process.env.PGNS as string).split(",");
  let positions = 0, nonzero = 0, ge10 = 0, ge25 = 0, games = 0, gamesGe25 = 0, unstoppable = 0, failedGames = 0;
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const block of text.split(/\n(?=\[Event )/)) {
      if (!block.includes("[Event ")) continue;
      const fenM = block.match(/\[FEN "([^"]+)"\]/);
      const movesText = block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
      const sans = (movesText.match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t.length);
      const p = parseFen(fenM ? (fenM[1] as string) : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
      games++;
      let any25 = false;
      try {
        for (let i = 0; i <= sans.length; i++) {
          setForm("BASE"); const a = evaluate(p);
          setForm(form); const b = evaluate(p);
          positions++;
          const d = Math.abs(a - b);
          if (d) nonzero++; if (d >= 10) ge10++; if (d >= 25) { ge25++; any25 = true; } if (d >= 300) unstoppable++;
          if (i === sans.length) break;
          const r = parseSan(p, sans[i] as string);
          if (r.outcome !== "move") throw new Error(`san ${sans[i]} ${r.outcome}`);
          makeMove(p, r.move);
        }
      } catch { failedGames++; }
      if (any25) gamesGe25++;
    }
  }
  console.log(JSON.stringify({ form, games, failedGames, positions, nonzeroPct: +(100 * nonzero / positions).toFixed(2), ge10Pct: +(100 * ge10 / positions).toFixed(2), ge25Pct: +(100 * ge25 / positions).toFixed(2), gamesWithGe25Pct: +(100 * gamesGe25 / games).toFixed(1), ge300: unstoppable }));
}
