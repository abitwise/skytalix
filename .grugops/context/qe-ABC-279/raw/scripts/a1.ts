// qe-ABC-279 A1, independent: QE's own hand rows (worked swap lists in the note), none copied from src/see.test.ts,
// run against the head tree's src/see.ts; the losing-test truth table; purity (board bytes) and 288.
// usage: node a1.ts <scratch-qe-dir>
const [Q] = process.argv.slice(2);
const H = `${Q}/head`;
const { see, isLosingCapture, seeScratchByteLength } = await import(`${H}/src/see.ts`);
const { parseFen } = await import(`${H}/src/fen.ts`);
const { legalMoves } = await import(`${H}/src/legal.ts`);
const { squareName } = await import(`${H}/src/position.ts`);
const uci = (m: any) => squareName(m.from) + squareName(m.to);
// [label, fen, move, hand see, hand losing]
const ROWS: [string, string, string, number, boolean][] = [
  ["Q1 PxP undefended", "4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1", "e4d5", 100, false],
  ["Q2 QxP def by P", "4k3/8/2p5/3p4/8/8/8/3QK3 w - - 0 1", "d1d5", -800, true],
  ["Q3 RxP def by N", "4k3/8/8/3p4/8/4n3/8/3RK3 w - - 0 1", "d1d5", -400, true],
  ["Q4 R battery vs R+K (x-ray own)", "3rk3/3p4/8/8/8/8/3R4/3RK3 w - - 0 1", "d2d7", -400, true],
  ["Q5 black BxN, x-ray Q behind B", "q3k3/1b6/8/3N4/4P3/8/8/4K3 b - - 0 1", "b7d5", 90, false],
  ["Q6 QxR def by B", "1r2k3/b7/8/8/8/8/8/1Q2K3 w - - 0 1", "b1b8", -400, true],
  ["Q7 BxN def by P", "4k3/2p5/3n4/8/8/8/7B/4K3 w - - 0 1", "h2d6", -10, true],
  ["Q8 NxP 3v3 pawn/knight/bishop", "4k3/6b1/2np4/4p3/2NP4/5N2/8/4K3 w - - 0 1", "f3e5", -220, true],
  ["Q9 black mirror of Q8", "4k3/8/5n2/2np4/4P3/2NP4/6B1/4K3 b - - 0 1", "f6e4", -220, true],
  ["Q10 Q front of R vs P+R", "3rk3/8/4p3/3p4/8/8/3Q4/3RK3 w - - 0 1", "d2d5", -800, true],
  ["Q11 R front of Q vs P+R", "3rk3/8/4p3/3p4/8/8/3R4/3QK3 w - - 0 1", "d2d5", -400, true],
  ["Q12 QxN, B x-ray behind Q, P defends", "4k3/8/3p4/4n3/8/2Q5/1B6/4K3 w - - 0 1", "c3e5", -480, true],
  ["Q13 RxP def only by K, 2nd R behind", "4k3/3p4/8/8/8/8/3R4/3RK3 w - - 0 1", "d2d7", 100, false],
  ["Q14 RxP def only by K, alone", "4k3/3p4/8/8/8/8/8/3RK3 w - - 0 1", "d1d7", -400, true],
];
let ok = 0;
const fails: string[] = [];
for (const [label, fen, mv, hand, losing] of ROWS) {
  const p = parseFen(fen);
  const m = legalMoves(p).find((x: any) => uci(x) === mv);
  if (!m) { fails.push(`${label}: ${mv} not legal`); continue; }
  const before = Array.from(p.board).join(",") + `|${p.blackToMove}|${p.castling}|${p.epSquare}`;
  const s = see(p, m), l = isLosingCapture(p, m), s2 = see(p, m);
  const after = Array.from(p.board).join(",") + `|${p.blackToMove}|${p.castling}|${p.epSquare}`;
  const good = s === hand && l === losing && s2 === s && before === after;
  if (good) ok++; else fails.push(`${label}: see ${s} (hand ${hand}) losing ${l} (hand ${losing}) repeat ${s2} pure ${before === after}`);
  console.log(`${good ? "OK  " : "FAIL"} ${label}: ${mv} see ${s} hand ${hand} losing ${l}`);
}
// truth table extras: king capture onto a defended square (SEE alone < 0), en passant, capturing promotion, equal victim
const TT: [string, string, string, boolean][] = [
  ["e.p. capture", "4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2", "e5d6", false],
  ["capturing promotion onto a defended square", "1r1nk3/2P5/8/8/8/8/8/4K3 w - - 0 1", "c7d8", false],
  ["NxN defended by P (0)", "4k3/2p5/3n4/8/4N3/8/8/4K3 w - - 0 1", "e4d6", false],
  ["quiet move", "4k3/8/8/8/8/8/8/3QK3 w - - 0 1", "d1d4", false],
];
for (const [label, fen, mv, want] of TT) {
  const p = parseFen(fen);
  const ms = legalMoves(p).filter((x: any) => uci(x) === mv);
  if (ms.length === 0) { fails.push(`${label}: ${mv} not legal`); console.log(`FAIL ${label}: ${mv} not legal`); continue; }
  for (const m of ms) {
    const l = isLosingCapture(p, m);
    const s = m.captured ? see(p, m) : "n/a";
    const good = l === want;
    if (good) ok++; else fails.push(`${label}: losing ${l}`);
    console.log(`${good ? "OK  " : "FAIL"} ${label}: ${mv}${m.promotion ? `=${m.promotion}` : ""} losing ${l} (want ${want}) see ${s}`);
  }
}
// The king clause: a LEGAL king capture never reads see < 0 (the target is unattacked after the move), so the move is
// taken from a board where Kxd2 is legal and called on the same squares with d2 pawn-defended (hand-built, as the SE's row).
{
  const legal = parseFen("4k3/8/8/8/8/8/3p4/4K3 w - - 0 1");
  const m = legalMoves(legal).find((x: any) => uci(x) === "e1d2");
  const p = parseFen("4k3/8/8/8/8/2p5/3p4/4K3 w - - 0 1");
  const s = see(p, m), l = isLosingCapture(p, m);
  const good = s === 100 - 20000 && l === false;
  if (good) ok++; else fails.push(`king clause: see ${s} losing ${l}`);
  console.log(`${good ? "OK  " : "FAIL"} king clause (hand-built Kxd2 onto c3-pawn cover): see ${s} (hand -19900) losing ${l} (want false); legal on that board: ${legalMoves(p).some((x: any) => uci(x) === "e1d2")}`);
}
console.log(JSON.stringify({ seeScratchByteLength: seeScratchByteLength(), ok, fails }));
