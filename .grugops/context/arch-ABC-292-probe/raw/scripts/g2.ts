// SCRATCH PROBE (arch-ABC-292-probe), STAGE B ONLY: PR8, G2 in ADR-0067 d8's A5 shape (ADR-0076 d6's instrument);
// arch-ABC-291-probe's g2.ts with a fourth arm, X = `cut`, in the same session list.
// argv: <scratch root> <order, e.g. "B,C,H,X"> <pgn>. B = main copy, C = main2 (control), H = cand (ON: the shipped
// entry, evaluateAtPhase), X = cut (ON). ENTRY=bypass reads evaluateWithoutPawnCache instead (PR10's per-call ratio with
// the memo bypassed). Graded set: the six roots. Report set EG: six endgame positions chosen by rule from the pgn (in file
// order: ply >= 60, phase <= 8, at least one passed pawn, at most one per game; the first six). Rounds 2, 4 and 6
// (counted from 1) reverse the session's list; round 1 is the dropped warm-up. r = mean(H) / mean(B), x = mean(X) /
// mean(B), c = mean(C) / mean(B), each on the unrounded means of rounds 2-6. The level is mean(B) in ns a call.
import { readFileSync } from "node:fs";
const [S, orderArg, pgn] = process.argv.slice(2) as [string, string, string];
const BYPASS = process.env.ENTRY === "bypass";
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"];
const dirs: Record<string, string> = { B: "main", C: "main2", H: "cand", X: "cut" };
const mods: [string, (p: any, ph: number) => number, any][] = [];
for (const k of orderArg.split(",")) {
  const m = await import(`${S}/${dirs[k]}/src/evaluate.ts`);
  const f = await import(`${S}/${dirs[k]}/src/fen.ts`);
  mods.push([k, BYPASS ? (p: any) => m.evaluateWithoutPawnCache(p) : m.evaluateAtPhase, f.parseFen]);
}
const bEval = await import(`${S}/main/src/evaluate.ts`);
const bFen = await import(`${S}/main/src/fen.ts`);
const bApply = await import(`${S}/main/src/apply.ts`);
const bSan = await import(`${S}/main/src/san.ts`);
const EG: string[] = [];
for (const block of readFileSync(pgn, "utf8").split(/\n(?=\[Event )/)) {
  if (EG.length >= 6) break;
  const fenM = block.match(/\[FEN "([^"]+)"\]/);
  const sans = (block.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").match(/[^\s]+/g) ?? []).filter((t) => !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t.length);
  const p = bFen.parseFen(fenM ? fenM[1] : ROOTS[0]);
  for (let i = 0; i < sans.length; i++) {
    const r = bSan.parseSan(p, sans[i]); if (r.outcome !== "move") break; bApply.makeMove(p, r.move);
    if (i + 1 < 60 || bEval.phaseOf(p) > 8) continue;
    let passer = false;
    for (let sq = 0; sq < 128 && !passer; sq++) { if (sq & 0x88) continue; const pc = p.board[sq]; if ((pc & 7) === 1 && bEval.isPassedPawn(p.board, sq)) passer = true; }
    if (passer) { EG.push(bFen.toFen(p)); break; }
  }
}
const N = BYPASS ? 50_000 : 200_000; let sink = 0;
const time = (ev: any, p: any, ph: number) => { const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) sink += ev(p, ph); return Number(process.hrtime.bigint() - t) / N; };
const run = (set: string[]) => {
  const PH = set.map((f) => bEval.phaseOf(bFen.parseFen(f)));
  const res: Record<string, number[]> = {};
  for (let r = 0; r < 6; r++) {
    const order = r % 2 ? [...mods].reverse() : mods;
    for (const [tag, ev, pf] of order) { const per = set.map((f, i) => time(ev, pf(f), PH[i] as number)); (res[tag] ??= []).push(per.reduce((a, b) => a + b) / per.length); }
  }
  const mean = (a: number[]) => a.slice(1).reduce((x, y) => x + y) / (a.length - 1);
  const b = mean(res.B as number[]);
  const ratio = (k: string) => (res[k] ? mean(res[k] as number[]) / b : null);
  return { phases: PH, rounds: res, mean: Object.fromEntries(Object.entries(res).map(([k, a]) => [k, mean(a)])), level: b, r: ratio("H"), x: ratio("X"), c: ratio("C") };
};
const roots = run(ROOTS);
const eg = run(EG);
console.log(JSON.stringify({ node: process.version, order: orderArg, entry: BYPASS ? "bypass" : "evaluateAtPhase", roots, eg, egFens: EG, sink: sink % 7 }));
console.log(`r_s=${roots.r} x_s=${roots.x} c_s=${roots.c} level=${roots.level} eg_r=${eg.r} eg_x=${eg.x} eg_c=${eg.c}`);
