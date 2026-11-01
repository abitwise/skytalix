// qe-ABC-246 A4 (b) (PREREG section 4): the ABC-170 A2 block's own call (kiwipete, budget HARD_CEILING_MS, a 1 ms ticking
// clock, maxNodes 6 000), with the clock's readings counted. The kiwipete FEN is read by regex from the tree's own
// src/engine.test.ts PERFT_CORPUS. Plain node (type stripping): node a4-readings.ts <treeRoot>
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.argv[2] as string;
const imp = (p: string) => import(pathToFileURL(join(root, p)).href);
const { chooseMove, HARD_CEILING_MS, NODES_PER_CLOCK_CHECK } = await imp("src/engine.ts");
const { parseFen } = await imp("src/fen.ts");
const fen = (/\{ name: "kiwipete", fen: "([^"]+)" \}/.exec(readFileSync(join(root, "src/engine.test.ts"), "utf8")) as RegExpExecArray)[1];
// tickingClock(1) as src/engine.test.ts defines it, plus a counter.
let ticks = 0, reads = 0;
const now = () => { reads++; const r = ticks; ticks += 1; return r; };
const r = chooseMove(parseFen(fen), { budgetMs: HARD_CEILING_MS, now, maxNodes: 6_000 });
console.log(JSON.stringify({ HARD_CEILING_MS, NODES_PER_CLOCK_CHECK, fen, readings: reads, nodes: r.nodes, depth: r.depth, elapsedMs: r.elapsedMs }));
console.log(`readings at a 1 ms step up to the ${HARD_CEILING_MS} ms deadline (arithmetic): ${HARD_CEILING_MS / 1}`);
