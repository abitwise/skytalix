// QE qe-ABC-209 A4 (NFR-009) QE variant, the D path: run under `node --expose-gc`. One UCI session (head) plays White
// for 40 searches through its own tracker (one token: each line extends the last), `go depth 6` on a frozen clock, book
// off, from tools/rating/openings.epd line 1. Black replies with BASE's engine at depth 6 on a frozen clock (a separate
// module instance with its own table, allocated by a warm-up call before search 1, so its 4 MiB is in both reads).
// heapUsed and arrayBuffers after gc() at search 1 and at search 40. Usage: node --expose-gc a4-uci.mts <head> <base>
const [head, base] = process.argv.slice(2);
const OPENING = "rnbqk1nr/ppppppbp/6p1/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1";
const { createUciSession } = await import(`${head}/src/uci-session.ts`);
const { seededRandom } = await import(`${head}/src/levels.ts`);
const { tableByteLength } = await import(`${head}/src/transposition.ts`);
const B = await import(`${base}/src/engine.ts`);
const Bfen = await import(`${base}/src/fen.ts`);
const Bapply = await import(`${base}/src/apply.ts`);
const Bpos = await import(`${base}/src/position.ts`);
const Blegal = await import(`${base}/src/legal.ts`);
const coord = (m: any) => `${Bpos.squareName(m.from)}${Bpos.squareName(m.to)}${m.promotion || ""}`;
const read = () => { (globalThis as any).gc(); (globalThis as any).gc(); const m = process.memoryUsage(); return { heapUsed: m.heapUsed, arrayBuffers: m.arrayBuffers }; };
const out: string[] = [];
const s = createUciSession({ write: (l: string) => out.push(l), now: () => 0, random: seededRandom(1), book: { inBook: () => false, bookMove: () => undefined, openingName: () => undefined } });
s.handleLine("setoption name OwnBook value false");
const board = Bfen.parseFen(OPENING);
B.chooseMove(Bfen.parseFen(OPENING), { budgetMs: 3_000, now: () => 0, maxDepth: 1 }); // allocate base's table before any read
const moves: string[] = [];
let a: any, b: any, searches = 0, ended = "";
for (let search = 1; search <= 40; search++) {
  const before = out.length;
  s.handleLine(moves.length ? `position fen ${OPENING} moves ${moves.join(" ")}` : `position fen ${OPENING}`);
  s.handleLine("go depth 6");
  const best = (out.slice(before).find((l) => l.startsWith("bestmove")) ?? "").split(" ")[1] as string;
  searches = search;
  if (search === 1) a = read();
  if (search === 40) b = read();
  if (best === "0000" || best === undefined) { ended = `white has no move at search ${search}`; break; }
  Bapply.makeMove(board, Blegal.legalMoves(board).find((x: any) => coord(x) === best));
  moves.push(best);
  if (search === 40) break;
  const r = B.chooseMove(board, { budgetMs: 3_000, now: () => 0, maxDepth: 6 });
  if (r === null) { ended = `black has no move after search ${search}`; break; }
  Bapply.makeMove(board, r.move);
  moves.push(coord(r.move));
}
console.log(JSON.stringify({ searches, ended, plies: moves.length, a, b, dHeapUsed: b ? b.heapUsed - a.heapUsed : null, dArrayBuffers: b ? b.arrayBuffers - a.arrayBuffers : null, table: tableByteLength(), node: process.version }));
