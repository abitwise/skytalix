// BA/PM probe (bapm-abc010-qe129a-2026-10-10): src/levels.test.ts:351's stalemate fixture under ADR-0033,
// and a candidate replacement. Reads <tree>/src only; writes nothing. Usage: node levels-stalemate.mts <tree> <fen> <move>
const [tree, fen, want] = process.argv.slice(2);
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { legalMoves, isInCheck } = await import(`${tree}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${tree}/src/apply.ts`);
const { createLevel } = await import(`${tree}/src/levels.ts`);
const { virtualClock } = await import(`${tree}/src/virtual-clock.ts`);
const { squareName } = await import(`${tree}/src/position.ts`);
const { semanticFault } = await import("../../recut-abc010/probe/rules.mjs");
const label = (m) => `${squareName(m.from)}${squareName(m.to)}`;
const p = parseFen(fen);
console.log(`fen ${fen}`);
console.log(`  adr0033 = ${semanticFault(fen.split(" "), parseFen(fen)) ?? "accepted"}`);
const moves = legalMoves(parseFen(fen));
console.log(`  legal ${moves.length}: ${moves.map(label).join(" ")}`);
const m = moves.find((x) => label(x) === want);
if (m) { const q = parseFen(fen); const u = makeMove(q, m); console.log(`  after ${want}: replies ${legalMoves(q).length}, in check ${isInCheck(q)}`); unmakeMove(q, m, u); }
const choice = createLevel({ budgetMs: 100, blunderRate: 0.999_999 }, { seed: 1, now: virtualClock(100) })(p);
console.log(`  createLevel(always, seed 1, virtualClock(100)): kind ${choice?.kind}, ${want} score ${choice?.scored?.find((s) => label(s.move) === want)?.score}`);
