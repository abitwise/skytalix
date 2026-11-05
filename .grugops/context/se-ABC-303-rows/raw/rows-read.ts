// se-ABC-303-rows: prints the list's UNKNOWN - verify items as read, so they are figures, not a green.
// usage: node rows-read.ts <tree>
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const tree = resolve(process.argv[2] as string);
const load = (file: string) => import(pathToFileURL(resolve(tree, "src", file)).href);
const engine = await load("engine.ts");
const { parseFen } = await load("fen.ts");
const { virtualClock } = await load("virtual-clock.ts");
const { createUciSession } = await load("uci-session.ts");
const { createBookProbe } = await load("book.ts");
const { seededRandom } = await load("levels.ts");
const { squareName } = await load("position.ts");
const FEN: Record<string, string> = {
  kiwipete: "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
  "position-6": "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10",
};
const label = (m: { from: number; to: number }) => squareName(m.from) + squareName(m.to);
const show = (c: { move: { from: number; to: number }; score: number; depth: number; nodes: number; partial?: boolean }) => ({
  move: label(c.move),
  score: c.score,
  depth: c.depth,
  nodes: c.nodes,
  partial: c.partial,
});
const print = (row: object) => console.log(JSON.stringify(row));
const on = engine.chooseMove;
const door = engine.chooseMoveWithoutQuietBundle;
// E1 at budget 5
const e1 = (o: object) => show(on(parseFen(FEN["position-6"]), { now: virtualClock(1), ...o }));
print({ row: "E1 head", budget: 5, ...e1({ budgetMs: 5, softMs: 5 / 2.3 }) });
print({ row: "E1 base", budget: 5, ...e1({ budgetMs: 5 }) });
print({ row: "E1 N(3)", ...show(on(parseFen(FEN["position-6"]), { budgetMs: 60_000, now: () => 0, maxDepth: 3 })) });
print({ row: "E1 N(4)", ...show(on(parseFen(FEN["position-6"]), { budgetMs: 60_000, now: () => 0, maxDepth: 4 })) });
// the door on virtualClock(1), A0-2's four rows, and the shipped side
for (const [name, budgetMs] of [["kiwipete", 50], ["kiwipete", 200], ["position-6", 50], ["position-6", 200]] as const) {
  print({ row: "A0-2 door", name, budgetMs, ...show(door(parseFen(FEN[name]), { budgetMs, now: virtualClock(1) })) });
  print({ row: "A0-2 on", name, budgetMs, ...show(on(parseFen(FEN[name]), { budgetMs, now: virtualClock(1) })) });
}
// softMs: 1 on the tip, A0-1's six rows
for (const name of ["kiwipete", "position-6"]) {
  for (const maxDepth of [6, 7, 8]) {
    const frozen = { budgetMs: 60_000, now: () => 0, maxDepth };
    print({ row: "A0-1 softMs absent", name, ...show(on(parseFen(FEN[name as string]), frozen)) });
    print({ row: "A0-1 softMs 1", name, ...show(on(parseFen(FEN[name as string]), { ...frozen, softMs: 1 })) });
  }
}
// D5's whole output
const out: string[] = [];
const empty = new TextEncoder().encode(JSON.stringify({ format: 1, maxPly: 12, positions: {} }));
const session = createUciSession({
  write: (line: string) => out.push(line),
  now: virtualClock(1),
  random: seededRandom(1),
  book: createBookProbe({ read: () => empty, warn: () => {}, random: seededRandom(7) }),
});
session.handleLine("setoption name TimeMode value uci-clock-mode");
session.handleLine("setoption name OwnBook value false");
session.handleLine("position fen r1b1k3/pppp2pp/8/8/1PB5/5r2/P2QNb1P/q1BK1R2 b q - 1 13");
out.length = 0;
session.handleLine("go wtime 1105 btime 1105 movestogo 1");
print({ row: "D5", count: out.length, lines: out });
