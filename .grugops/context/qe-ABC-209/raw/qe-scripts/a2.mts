// QE qe-ABC-209 A2, independent of the SE's rows: game A (>= 10 moves) through one game owner, then the first search of
// game B, compared with the same search in a FRESH PROCESS (spawned). UCI: the session on a frozen clock, book off,
// `go depth`; nodes from its own `info` line. CLI: the level seam (level 5, virtual clock, seed 1); nodes from the
// instrumented copy's one hook (`__qeChoice`, behaviour unchanged: frozen counts equal). A continuing line is the power
// control: it must DIFFER from fresh, or the comparison could not fail.
// Usage: node a2.mts <head-instr root>            (driver)
//        node a2.mts <root> fresh-uci <json lines> (child)   |   node a2.mts <root> fresh-cli <json moves> (child)
import { spawnSync } from "node:child_process";
const [root, mode, arg] = process.argv.slice(2);
const OPENING = "rnbqk1nr/ppppppbp/6p1/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1"; // tools/rating/openings.epd line 1
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const { createUciSession } = await import(`${root}/src/uci-session.ts`);
const { seededRandom } = await import(`${root}/src/levels.ts`);
const { createLevelSeam } = await import(`${root}/src/level-seam.ts`);
const { newGame, playMove, takeBack } = await import(`${root}/src/history.ts`);
const { legalMoves } = await import(`${root}/src/legal.ts`);
const { parseFen, toFen } = await import(`${root}/src/fen.ts`);
const { makeMove } = await import(`${root}/src/apply.ts`);
const { squareName } = await import(`${root}/src/position.ts`);
const { virtualClock } = await import(`${root}/src/virtual-clock.ts`);
const coord = (m: any) => `${squareName(m.from)}${squareName(m.to)}${m.promotion || ""}`;

function uci() {
  const out: string[] = [];
  const s = createUciSession({ write: (l: string) => out.push(l), now: () => 0, random: seededRandom(1), book: { inBook: () => false, bookMove: () => undefined, openingName: () => undefined } });
  s.handleLine("setoption name OwnBook value false");
  return (...lines: string[]) => {
    const before = out.length;
    for (const l of lines) s.handleLine(l);
    const w = out.slice(before);
    const info = w.filter((l) => l.startsWith("info depth")).pop() ?? "";
    return { nodes: Number(/ nodes (\d+)/.exec(info)?.[1]), depth: Number(/^info depth (\d+)/.exec(info)?.[1]), bestmove: (w.filter((l) => l.startsWith("bestmove")).pop() ?? "").split(" ")[1] };
  };
}
let last: any = null;
(globalThis as any).__qeChoice = (c: any) => { last = c; };
const seam = () => createLevelSeam(5, { seed: 1, now: virtualClock(500) });

if (mode === "fresh-uci") {
  console.log(JSON.stringify(uci()(...JSON.parse(arg as string))));
  process.exit(0);
}
if (mode === "fresh-cli") {
  const h = newGame(START);
  for (const m of JSON.parse(arg as string)) {
    const mv = legalMoves(h.position).find((x: any) => coord(x) === m);
    playMove(h, mv);
  }
  const move = coord(await seam()(h));
  console.log(JSON.stringify({ move, nodes: last.nodes, depth: last.depth }));
  process.exit(0);
}
const fresh = (kind: string, payload: unknown) => {
  const r = spawnSync(process.execPath, [new URL(import.meta.url).pathname, root as string, kind, JSON.stringify(payload)], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout.trim());
};
const line = (fen: string, moves: string[]) => (moves.length ? `position fen ${fen} moves ${moves.join(" ")}` : `position fen ${fen}`);
const results: string[] = [];
let met = 0, cases = 0;
const judge = (name: string, b: unknown, f: unknown, expectEqual: boolean) => {
  const eq = JSON.stringify(b) === JSON.stringify(f);
  const ok = eq === expectEqual;
  if (expectEqual) { cases++; if (ok) met++; }
  results.push(`${name}: game-B ${JSON.stringify(b)} fresh ${JSON.stringify(f)} -> ${eq ? "EQUAL" : "DIFFERS"} (${expectEqual ? "must equal" : "power control: must differ"}) ${ok ? "OK" : "FAIL"}`);
};

// ---- UCI: game A = 12 searches of self-play from opening 1 through one session (each line extends the last) ----
const gameA = () => {
  const say = uci();
  const moves: string[] = [];
  for (let i = 0; i < 12; i++) moves.push(say(line(OPENING, moves), "go depth 4").bestmove as string);
  return { say, moves };
};
{
  const { say, moves } = gameA();
  const lines = ["position startpos", "go depth 5"];
  judge("UCI ucinewgame then position startpos", say("ucinewgame", ...lines), fresh("fresh-uci", lines), true);
}
{
  const { say, moves } = gameA();
  const lines = [line(OPENING, moves), "go depth 5"]; // extends game A's last searched line: only the new tracker clears it
  judge("UCI ucinewgame then a line that extends game A", say("ucinewgame", ...lines), fresh("fresh-uci", lines), true);
}
{
  const { say } = gameA();
  const lines = ["position startpos moves e2e4", "go depth 5"];
  judge("UCI non-continuing position (another start, unrelated line)", say(...lines), fresh("fresh-uci", lines), true);
}
{
  const { say, moves } = gameA();
  const lines = [line(OPENING, moves.slice(0, 11)), "go depth 5"]; // game A's last searched line, searched again
  judge("UCI the same position searched again", say(...lines), fresh("fresh-uci", lines), true);
}
{
  const { say, moves } = gameA();
  const lines = [line(OPENING, moves.slice(0, 8)), "go depth 5"]; // a take-back of 3 plies
  judge("UCI take-back (a shorter line, same start)", say(...lines), fresh("fresh-uci", lines), true);
}
{
  const { say, moves } = gameA();
  const p = parseFen(OPENING);
  for (const m of moves) makeMove(p, legalMoves(p).find((x: any) => coord(x) === m));
  const lines = [`position fen ${toFen(p)}`, "go depth 5"]; // `position fen` sent each move: another start
  judge("UCI position fen of the current position (fen each move)", say(...lines), fresh("fresh-uci", lines), true);
}
{
  const { say, moves } = gameA();
  const lines = [line(OPENING, moves), "go depth 5"]; // CONTINUES game A: the table is kept
  judge("UCI power control: the line continues game A", say(...lines), fresh("fresh-uci", lines), false);
}

// ---- CLI: game A = 10 engine moves through one seam, the human replying with base's depth-2 move ----
const BASE = (root as string).replace(/head-instr$/, "base");
const baseEngine = await import(`${BASE}/src/engine.ts`);
const baseFen = await import(`${BASE}/src/fen.ts`);
const cliGameA = async () => {
  const s = seam();
  const h = newGame(START);
  for (let i = 0; i < 10; i++) {
    playMove(h, await s(h));
    // the human's reply: base's engine at depth 2 on a frozen clock (a separate module, its own table: head's is untouched)
    const r = baseEngine.chooseMove(baseFen.parseFen(toFen(h.position)), { budgetMs: 3_000, now: () => 0, maxDepth: 2 });
    playMove(h, legalMoves(h.position).find((x: any) => coord(x) === `${squareName(r.move.from)}${squareName(r.move.to)}${r.move.promotion || ""}`));
  }
  return { s, h };
};
{
  const { s, h } = await cliGameA();
  takeBack(h, h.moves.length); // `new` (ABC-046): a take-back to the start
  const move = coord(await s(h));
  judge("CLI new (same seam and level instance)", { move, nodes: last.nodes, depth: last.depth }, fresh("fresh-cli", []), true);
}
{
  const { s, h } = await cliGameA();
  takeBack(h, 2); // `undo`: two plies back; the engine is to move at the same ply count as its last search
  const ms = h.moves.map(coord);
  const move = coord(await s(h));
  judge("CLI undo (two plies back)", { move, nodes: last.nodes, depth: last.depth }, fresh("fresh-cli", ms), true);
}
{
  const { s, h } = await cliGameA();
  const ms = h.moves.map(coord);
  const move = coord(await s(h)); // the game continues: kept
  judge("CLI power control: the game continues", { move, nodes: last.nodes, depth: last.depth }, fresh("fresh-cli", ms), false);
}
for (const r of results) console.log(r);
console.log(`A2 cases: ${met} of ${cases} equal to a fresh process; power controls: ${results.filter((r) => r.includes("power control") && r.endsWith("OK")).length} of 2 differ`);
