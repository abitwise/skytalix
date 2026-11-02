// QE qe-ABC-269-freeze: builds every frozen set from its stated rule, verifies it on main, writes data.json.
import { analyse, edit, parseFen, toFen, W, evaluate } from "./lib.ts";
import { writeFileSync } from "node:fs";
const { legalMoves } = await import(W + "legal.ts");
const { makeMove, unmakeMove } = await import(W + "apply.ts");
const { buildCorpus, mirrorPosition } = await import(W + "evaluate.mirror-corpus.ts");
const POS4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";
const POS5 = "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8";
const die = (m: string) => { throw new Error(m); };
function ladder(base: string, order: string[]) {
  let f = base; const out: Record<number, { fen: string; removed: string[] }> = {}; const removed: string[] = [];
  for (const sq of order) { f = edit(f, [sq]); parseFen(f); removed.push(sq); out[analyse(f).raw] = { fen: f, removed: [...removed] }; }
  return out;
}
const L1 = ladder(POS4, ["f3","a5","a4","b6","b4","f6","h6","g6","a1","a8","f1","h8","d1","a3"]);
const L3 = ladder(POS4, ["d1","a3","f3","a5","a4","b6","b4","f6","h6","g6","a1","a8","f1","h8"]);
const L2 = ladder(POS5, ["d1","d8","a1","a8","h1","h8","b1","b8","c1","c8","c4","e7","e2","f2"]);
const flipOrNull = (f: string) => { const p = parseFen(f); p.blackToMove = !p.blackToMove; p.epSquare = -1; const g = toFen(p); try { parseFen(g); return g; } catch { return null; } };
const flip = (f: string) => flipOrNull(f) ?? die("flip " + f);
const mirror: any[] = [];
const addM = (id: string, fen: string, source: string, why: string) => { parseFen(fen); const a = analyse(fen); mirror.push({ id, fen: a.fen, phase: a.raw, source, why }); };
addM("M-p24-pos5-btm", flip(POS5), "position-5 (G3 root), side to move flipped to black", "phase 24 from a non-start root, black to move; the blend must vanish (w = D)");
for (let ph = 23; ph >= 16; ph--) { const r = L1[ph] ?? die("L1 " + ph); const fl = ph % 2 === 0 ? flipOrNull(r.fen) : null; addM(`M-p${ph}-L1`, fl ?? r.fen, `position-4 minus ${r.removed.join(" ")} (ladder L1: minors first, alternating W/B, board order)${fl ? ", black to move" : ph % 2 === 0 ? " (white to move: black to move is illegal, white is in check)" : ""}`, "high phase, delta -50 (king g1/e8), product not a multiple of 24: trunc vs floor differs"); }
for (const ph of [15, 13, 11, 9]) { const r = L3[ph] ?? die("L3 " + ph); addM(`M-p${ph}-L3`, r.fen, `position-4 minus ${r.removed.join(" ")} (ladder L3: queens first, then minors, then rooks)`, "the odd phases L1 and L2 skip; delta -50"); }
for (const ph of [14, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0]) { const r = L2[ph] ?? die("L2 " + ph); const fl = ph % 2 === 0 ? flipOrNull(r.fen) : null; addM(`M-p${ph}-L2`, fl ?? r.fen, `position-5 minus ${r.removed.join(" ")} (ladder L2: queens, rooks, then minors)${fl ? ", black to move" : ph % 2 === 0 ? " (white to move: black to move is illegal, white is in check)" : ""}`, "low phase, delta +125 (kings e1/f8, passer d7), both signs of the side to move"); }
// clamp rows: raw phase above 24 (promoted queens; pawn counts allow it)
addM("M-clamp28", edit(POS4, [], { c3: "Q" }), "position-4 plus a white queen on c3 (white has 7 pawns: one promotion is reachable)", "raw phase 28 must clamp to 24 (d1); unclamped, w > D flips the blend's sign");
addM("M-clamp32", edit(POS4, [], { c3: "Q", e5: "q" }), "position-4 plus a white queen c3 and a black queen e5", "raw phase 32, clamp, both sides promoted");
// the -0 traps (found by a seeded random walk from the start, seed 269, first hits; adversarial by design)
addM("M-negzero-a", "4qb1r/r1p1kp2/1Bnpb2p/P3pQ2/P1P1P1P1/3P2PP/N5K1/R4BnR b - - 0 22", "seeded random walk from the start (seed 269, game 1383, ply 42)", "mg exactly 0, delta +5 at phase 23: the full form trunc((mg w + eg (D - w)) / D) returns -0 for its white-to-move mirror, the delta form mg + trunc(...) returns +0 (Object.is)");
addM("M-negzero-b", "4q3/pBp2k1r/n2pb2n/1p1Pp1p1/4Q1p1/2P1b2N/4PP1P/RN1K2R1 w - - 0 22", "seeded random walk from the start (seed 269, game 3257, ply 42), side to move set to white", "mg exactly 0, delta -5 at phase 21, white to move: the full form returns -0 here directly");
// ep row: first double push (by legalMoves order) from L3's phase-9 rung, black to move
{ const p = parseFen(L3[9]!.fen); let got = "";
  for (const m of legalMoves(p)) { const u = makeMove(p, m); if (p.epSquare !== -1) { got = toFen(p); unmakeMove(p, m, u); break; } unmakeMove(p, m, u); }
  addM("M-ep-p9", got || die("no ep"), "L3's phase-9 rung, then its first double pawn push in legalMoves order", "en-passant square set and black to move at phase 9: the mirror helper's ep and castling paths below phase 24"); }
// KP endings
const KP = [
 ["D1","white","d4","a1","none","8/5pk1/6p1/7p/3K3P/6P1/5P2/8 w - - 0 1","8/5pk1/6p1/7p/7P/6P1/5P2/K7 w - - 0 1","kingside pawn chains, white king stranded on the far corner a1"],
 ["D2","white","e5","h1","partial","8/p1k5/1p4p1/4K3/8/8/PP5P/8 b - - 0 1","8/p1k5/1p4p1/8/8/8/PP5P/7K b - - 0 1","corner h1 sheltered on the h-file only (h2); black to move; queenside majority for white"],
 ["D3","black","e4","h8","none","8/pp6/2p5/8/4kP2/1P4K1/P7/8 b - - 0 1","7k/pp6/2p5/8/5P2/1P4K1/P7/8 b - - 0 1","black king walks; its pawns on the queenside, corner h8 bare; centre square beside an enemy pawn"],
 ["D4","black","d5","a8","partial","8/p7/6p1/3k3p/7P/6P1/5PK1/8 w - - 0 1","k7/p7/6p1/7p/7P/6P1/5PK1/8 w - - 0 1","black corner a8 sheltered on the a-file only (a7); white to move, read from black's side"],
 ["D5","white","e4","h8","none","8/5k2/1p6/p5p1/P3K1P1/1P6/8/8 b - - 0 1","7K/5k2/1p6/p5p1/P5P1/1P6/8/8 b - - 0 1","white king in the enemy's corner h8 (its mg table already -50 there); blocked pawns"],
 ["D6","black","d4","a1","none","8/8/8/pp6/3k4/5P2/6PP/6K1 w - - 0 1","8/8/8/pp6/8/5P2/6PP/k5K1 w - - 0 1","black king in the enemy's corner a1; black has two connected passers"],
];
const SS = [
 ["S1","white","e4","h1","full","6k1/p5pp/8/8/4K3/8/P5PP/8 w - - 0 1","6k1/p5pp/8/8/8/8/P5PP/7K w - - 0 1","castled corner h1 behind g2 h2, centre files d e f bare"],
 ["S2","black","d5","a8","full","8/pp3p2/8/3k4/8/8/PP3P2/1K6 b - - 0 1","k7/pp3p2/8/8/8/8/PP3P2/1K6 b - - 0 1","castled corner a8 behind a7 b7, centre files c d e bare"],
 ["S3","white","d5","a1","full","5k2/1pp2pp1/8/3K4/8/8/PP6/8 w - - 0 1","5k2/1pp2pp1/8/8/8/8/PP6/K7 w - - 0 1","castled corner a1 behind a2 b2, an enemy pawn on the c-file"],
];
const kpRow = (r: string[]) => { const [id, king, cs, ks, shelter, centreFen, cornerFen, why] = r;
  const a = analyse(centreFen), b = analyse(cornerFen); if (a.raw !== 0 || b.raw !== 0) die("kp phase " + id);
  const side = (x: any, v: number) => ((king === "black") !== x.stmBlack ? 0 - v : v);
  return { id, walkingKing: king, centreSquare: cs, cornerSquare: ks, cornerShelter: shelter, centreFen: a.fen, cornerFen: b.fen, phase: 0, why, mainCentreMinusCorner: side(a, a.main) - side(b, b.main), forecastE1: side(a, a.forecast) - side(b, b.forecast) }; };
const kp = KP.map(kpRow), ss = SS.map(kpRow);
// passer pairs
const LAYOUT: Record<number, Record<string, string>> = { 0: {}, 6: { b3: "R", b5: "N", g6: "r", g4: "n" },
  18: { b2: "Q", b3: "R", c3: "R", b5: "N", g7: "q", g6: "r", f6: "r", g4: "n" },
  24: { b2: "Q", b3: "R", c3: "R", b4: "B", c4: "B", b5: "N", c5: "N", g7: "q", g6: "r", f6: "r", g5: "b", f5: "b", g4: "n", f4: "n" } };
const PB = [0, 5, 10, 20, 35, 60, 100, 0];
const EMPTY8 = "8/8/8/8/8/8/8/8 w - - 0 1";
const passer: any[] = [];
for (const colour of ["white", "black"]) for (const rank of [2, 3, 4, 5, 6, 7]) for (const ph of [0, 6, 18, 24]) {
  if (colour === "black" && ![2, 5, 7].includes(rank)) continue;
  const sq = colour === "white" ? `d${rank}` : `e${9 - rank}`;
  const B = edit("K7/8/8/8/8/8/8/7k w - - 0 1", [], LAYOUT[ph]);
  const A = edit(B, [], { [sq]: colour === "white" ? "P" : "p" });
  const a = analyse(A), b = analyse(B);
  if (a.raw !== ph || b.raw !== ph || b.delta !== 0 || Math.abs(a.delta) !== PB[rank - 1]) die("passer " + A);
  const sgn = colour === "white" ? 1 : -1;
  passer.push({ id: `E-${colour[0]}${rank}-p${ph}`, passer: colour, ownRank: rank, square: sq, phase: ph, withPasserFen: a.fen, withoutPasserFen: b.fen, baseBonus: PB[rank - 1],
    mainDifference: sgn * (a.main - b.main), forecastTerm: sgn * ((a.forecast - b.forecast) - (a.main - b.main)) + PB[rank - 1] });
}
// B1(c): main's evaluate on every fixture position and its mirror; G3's 184 in buildCorpus order
const all: string[] = [...mirror.map((m) => m.fen), ...kp.flatMap((k) => [k.centreFen, k.cornerFen]), ...ss.flatMap((k) => [k.centreFen, k.cornerFen]), ...passer.flatMap((p) => [p.withPasserFen, p.withoutPasserFen])];
const seen = new Set<string>(); const door: { fen: string; main: number }[] = [];
for (const f of all) for (const g of [f, toFen(mirrorPosition(parseFen(f)))]) { if (seen.has(g)) continue; seen.add(g); door.push({ fen: g, main: evaluate(parseFen(g)) }); }
const g3 = buildCorpus().map((c: any) => evaluate(c.position));
// self-checks
for (const m of mirror) { const p = parseFen(m.fen); if (!Object.is(evaluate(p), evaluate(mirrorPosition(p)))) die("main mirror " + m.id); }
const forecasts = { mirror: mirror.map((m) => { const a = analyse(m.fen); const b = analyse(toFen(mirrorPosition(parseFen(m.fen)))); return { id: m.id, w: a.w, delta: a.delta, rem: a.rem, forecast: a.forecast, mirrorForecast: b.forecast, deltaFormMirrorEqual: Object.is(a.forecast, b.forecast), fullFormMirrorEqual: Object.is(a.forecastFullForm, b.forecastFullForm) }; }) };
writeFileSync("data.json", JSON.stringify({ mirror, kp, ss, passer, door, g3, forecasts }, null, 1));
console.log("mirror", mirror.length, "phases", mirror.map((m) => m.phase).join(","), "kp", kp.length, "ss", ss.length, "passer", passer.length, "door", door.length, "g3", g3.length);
console.log("fullForm mirror mismatches:", forecasts.mirror.filter((x) => !x.fullFormMirrorEqual).map((x) => x.id).join(","), " deltaForm mismatches:", forecasts.mirror.filter((x) => !x.deltaFormMirrorEqual).length);
for (const k of [...kp, ...ss]) console.log(k.id, k.cornerShelter, "main", k.mainCentreMinusCorner, "forecast", k.forecastE1);
