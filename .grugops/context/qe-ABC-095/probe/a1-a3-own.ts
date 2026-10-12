// qe-ABC-095: QE's own A1/A3 reading, out of suite, through the delivered readBookFile and withBook (no test file).
// node a1-a3-own.ts <tree root>
const R = process.argv[2];
const { readBookFile } = await import(`${R}/src/book-file.ts`);
const { createBookProbe } = await import(`${R}/src/book.ts`);
const { withBook } = await import(`${R}/src/book-engine.ts`);
const { newGame, playMove } = await import(`${R}/src/history.ts`);
const { legalMoves } = await import(`${R}/src/legal.ts`);
const { squareName } = await import(`${R}/src/position.ts`);
const { zobristKey } = await import(`${R}/src/zobrist.ts`);
const { readFileSync } = await import("node:fs");
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const BOOK = JSON.parse(readFileSync(new URL(`file://${R}/data/opening-book/book.json`), "utf8"));
const uci = (m: any) => `${squareName(m.from)}${squareName(m.to)}${["", "", "n", "b", "r", "q"][m.promotion] ?? ""}`;
const entries = (h: any) => (BOOK.positions[zobristKey(h.position).toString(16).padStart(16, "0")]?.m ?? []).map(([u]: any) => u);
const after = (moves: string[]) => { const h = newGame(START); for (const u of moves) { const mv = legalMoves(h.position).find((m: any) => uci(m) === u); if (!mv) throw new Error(`illegal ${u}`); playMove(h, mv); } return h; };
let stderrWrites = 0;
const orig = process.stderr.write.bind(process.stderr);
(process.stderr as any).write = (...a: any[]) => { stderrWrites++; return orig(...a); };
// A1: 200 fresh probes (Math.random, as the root binds it), start position: every reply a book entry, inner never called.
let a1Inner = 0, a1Bad = 0; const seen = new Map<string, number>();
for (let i = 0; i < 200; i++) {
  let warned = 0;
  const probe = createBookProbe({ read: readBookFile, warn: () => warned++, random: Math.random });
  const m = await withBook(probe, async () => { a1Inner++; return legalMoves(newGame(START).position)[0]; })(newGame(START));
  if (!entries(newGame(START)).includes(uci(m)) || warned) a1Bad++;
  seen.set(uci(m), (seen.get(uci(m)) ?? 0) + 1);
}
console.log(JSON.stringify({ A1: { probes: 200, innerCalls: a1Inner, notABookEntryOrWarned: a1Bad, distinctReplies: seen.size, top: [...seen].sort((a, b) => b[1] - a[1]).slice(0, 5) } }));
// A3: out-of-book positions, one fresh probe per position: inner called exactly once, its move returned, 0 warn, 0 stderr writes.
const lines = [["e2e4", "e7e5", "e1e2"], ["c2c3"], ["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "g8f6", "f3g5", "d7d5", "e4d5", "f6d5", "g5f7", "e8f7", "d1f3", "f7e6", "b1c3", "c6e7", "e1g1", "c7c6", "f1e1", "h7h6"], ["a2a3", "h7h6", "h2h4"]];
const a3: any[] = [];
for (const line of lines) {
  const h = after(line);
  const inBook = entries(h).length;
  let warned = 0, inner = 0; let innerMove: any;
  const probe = createBookProbe({ read: readBookFile, warn: () => warned++, random: Math.random });
  probe.bookMove(newGame(START).position); // the read happens on a hit first, as in a session
  const before = stderrWrites;
  const m = await withBook(probe, async (hh: any) => { inner++; innerMove = legalMoves(hh.position)[0]; return innerMove; })(h);
  a3.push({ line: line.join(" "), artifactEntries: inBook, innerCalls: inner, returnedInnersMove: m === innerMove, legal: legalMoves(h.position).some((x: any) => uci(x) === uci(m)), warned, stderrWrites: stderrWrites - before });
}
console.log(JSON.stringify({ A3: a3 }));
// A4 helper: after 1. e4 X, is 2. Ke2 out of book for every book reply X?
const replies = entries(after(["e2e4"]));
console.log(JSON.stringify({ A4helper: { repliesAfterE4: replies.length, KE2OutOfBookAfterEvery: replies.every((x: string) => { const h = after(["e2e4", x]); const k = legalMoves(h.position).find((m: any) => uci(m) === "e1e2"); return k === undefined || (playMove(h, k), entries(h).length === 0); }) } }));
