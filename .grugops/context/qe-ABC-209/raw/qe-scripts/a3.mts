// QE qe-ABC-209 A3, independent of the SE's row and through the PRODUCT's game owners (the SE's row drives chooseMove
// directly): two consecutive moves of one game; the reply is the stored hash move (the page's pair); the second
// search's FIRST probe must hit an entry the first search stored (bar >= 1). Instrumented copy: `__qeProbe` sees every
// probe's slot, `__qePrepare` whether the table was kept. Also reported: the same with a reply that is NOT the hash
// move, and the second search's nodes against a fresh search of the same position.
// Usage: node a3.mts <head-instr root>
const [root] = process.argv.slice(2);
const OPENINGS = [
  "rnbqk1nr/ppppppbp/6p1/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
  "rnbqkbnr/pp1ppppp/8/8/1p2P3/8/P1PP1PPP/RNBQKBNR w KQkq - 0 1",
];
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { createUciSession } = await import(`${root}/src/uci-session.ts`);
const { seededRandom } = await import(`${root}/src/levels.ts`);
const { createLevelSeam } = await import(`${root}/src/level-seam.ts`);
const { newGame, playMove } = await import(`${root}/src/history.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { parseFen } = await import(`${root}/src/fen.ts`);
const { makeMove } = await import(`${root}/src/apply.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const { zobristKey } = await import(`${root}/src/zobrist.ts`);
const { probeTable, entryMove } = await import(`${root}/src/transposition.ts`);
const coord = (m: any) => `${squareName(m.from)}${squareName(m.to)}${m.promotion || ""}`;

let armed = false, first: number | null = null, probes = 0, hits = 0, kept: boolean | null = null;
(globalThis as any).__qeProbe = (slot: number) => { if (!armed) return; probes++; if (slot !== -1) hits++; if (first === null) first = slot; };
(globalThis as any).__qePrepare = (k: boolean) => { if (armed && kept === null) kept = k; };
const arm = () => { armed = true; first = null; probes = 0; hits = 0; kept = null; };
const disarm = () => { armed = false; return { kept, firstProbeHit: first !== null && first !== -1, probes, hits }; };
/** The hash move stored for `p` (peeked BEFORE the reply, outside any armed window), or null. */
const hashMove = (p: any) => { const slot = probeTable(zobristKey(p)); return slot === -1 ? null : entryMove(slot, legalMoves(p)); };
let lastNodes = -1;
(globalThis as any).__qeChoice = (c: any) => { lastNodes = c.nodes; };

function uci() {
  const out: string[] = [];
  const s = createUciSession({ write: (l: string) => out.push(l), now: () => 0, random: seededRandom(1), book: { inBook: () => false, bookMove: () => undefined, openingName: () => undefined } });
  s.handleLine("setoption name OwnBook value false");
  return (...lines: string[]) => {
    const before = out.length;
    for (const l of lines) s.handleLine(l);
    const w = out.slice(before);
    const info = w.filter((l) => l.startsWith("info depth")).pop() ?? "";
    return { nodes: Number(/ nodes (\d+)/.exec(info)?.[1]), bestmove: (w.filter((l) => l.startsWith("bestmove")).pop() ?? "").split(" ")[1] as string };
  };
}
const rows: string[] = [];
let met = 0, pairs = 0;
for (const [i, fen] of OPENINGS.entries()) {
  for (const replyKind of ["hash", "other"]) {
    const say = uci();
    const r1 = say(`position fen ${fen}`, "go depth 6");
    const p = parseFen(fen);
    makeMove(p, legalMoves(p).find((x: any) => coord(x) === r1.bestmove));
    const h = hashMove(p);
    const reply = replyKind === "hash" ? h : legalMoves(p).find((x: any) => h === null || coord(x) !== coord(h));
    const line = `position fen ${fen} moves ${r1.bestmove} ${coord(reply)}`;
    arm();
    const r2 = say(line, "go depth 6");
    const seen = disarm();
    const fresh = uci()(line, "go depth 6");
    if (replyKind === "hash") { pairs++; if (seen.firstProbeHit) met++; }
    rows.push(`UCI opening ${i + 1}, reply ${replyKind} (${coord(reply)}): kept=${seen.kept} first probe hit=${seen.firstProbeHit} hits ${seen.hits}/${seen.probes}; nodes kept ${r2.nodes} vs fresh ${fresh.nodes} (${(r2.nodes / fresh.nodes).toFixed(3)}x), bestmove ${r2.bestmove} vs ${fresh.bestmove}`);
  }
}
for (const replyKind of ["hash", "other"]) {
  const s = createLevelSeam(5, { seed: 1, now: virtualClock(500) });
  const h = newGame(START);
  playMove(h, await s(h));
  const hm = hashMove(h.position);
  const reply = replyKind === "hash" ? hm : legalMoves(h.position).find((x: any) => hm === null || coord(x) !== coord(hm));
  playMove(h, reply);
  arm();
  await s(h);
  const seen = disarm();
  const kNodes = lastNodes;
  const f = createLevelSeam(5, { seed: 1, now: virtualClock(500) });
  const g = newGame(START);
  for (const m of h.moves) playMove(g, m);
  await f(g); // a new seam: its tracker's first call gives a new token, so this clears
  if (replyKind === "hash") { pairs++; if (seen.firstProbeHit) met++; }
  rows.push(`CLI seam level 5 from the start, reply ${replyKind} (${coord(reply)}): kept=${seen.kept} first probe hit=${seen.firstProbeHit} hits ${seen.hits}/${seen.probes}; nodes kept ${kNodes} vs fresh ${lastNodes}`);
}
for (const r of rows) console.log(r);
console.log(`A3 (reply = the stored hash move): ${met} of ${pairs} pairs, the second search's first probe hits (bar >= 1 entry)`);
