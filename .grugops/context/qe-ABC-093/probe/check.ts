// QE ABC-093 independent harness. Usage: node check.ts <worktree> <tsv dir>
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [WT, TSV] = process.argv.slice(2) as [string, string];
const { makeMove } = await import(join(WT, "src/apply.ts"));
const { parseFen, toFen } = await import(join(WT, "src/fen.ts"));
const { legalMoves } = await import(join(WT, "src/legal.ts"));
const { parseSan } = await import(join(WT, "src/san.ts"));
const { zobristKey } = await import(join(WT, "src/zobrist.ts"));
const { squareName } = await import(join(WT, "src/position.ts"));
const compileSrc = readFileSync(join(WT, "tools/opening-book/compile.ts"), "utf8");
const SOURCE_COMMIT = /SOURCE_COMMIT = "([0-9a-f]{40})"/.exec(compileSrc)?.[1];
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const PROMO = ["", "", "n", "b", "r", "q"];
const uciOf = (m: any) => `${squareName(m.from)}${squareName(m.to)}${PROMO[m.promotion] ?? ""}`;
const hex = (p: any) => zobristKey(p).toString(16).padStart(16, "0");
const text = readFileSync(join(WT, "data/opening-book/book.json"), "utf8");
const book = JSON.parse(text);
const out: Record<string, unknown> = {};
const fails: string[] = [];
const ck = (cond: boolean, msg: string) => { if (!cond) fails.push(msg); };

// 1. structure
out.topKeys = Object.keys(book).join(",");
ck(out.topKeys === "format,source,attribution,maxPly,positions", "top-level keys");
ck(book.format === 1, "format 1");
ck(book.source?.repo === "lichess-org/chess-openings", "repo");
ck(book.source?.commit === SOURCE_COMMIT, "commit == SOURCE_COMMIT");
ck(readFileSync(join(WT, "data/opening-book/ATTRIBUTION.md"), "utf8").includes(book.source.commit), "ATTRIBUTION has commit");
ck(text.endsWith("}\n") && !text.endsWith("\n\n"), "one trailing newline");
ck(text === `${JSON.stringify(book)}\n`, "JSON.stringify form");
const keys = Object.keys(book.positions);
out.entries = keys.length;
ck(keys.every((k) => /^[0-9a-f]{16}$/.test(k)), "16-hex keys");
ck(keys.every((k, i) => i === 0 || keys[i - 1]! < k), "keys strictly sorted");
let emptyM = 0, emptyMNoName = 0, named = 0, ctl = 0, dupUci = 0, unsortedM = 0, badW = 0, extraField = 0, badUci = 0;
for (const k of keys) {
  const e = book.positions[k];
  if (Object.keys(e).some((f) => f !== "m" && f !== "n")) extraField++;
  if (e.m.length === 0) { emptyM++; if (e.n === undefined) emptyMNoName++; }
  if (e.n !== undefined) { named++; if (e.n === "" || [...e.n].some((c: string) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f)) ctl++; }
  const ucis = e.m.map(([u]: [string]) => u);
  if (new Set(ucis).size !== ucis.length) dupUci++;
  if (!ucis.every((u: string, i: number) => i === 0 || ucis[i - 1] < u)) unsortedM++;
  for (const [u, w] of e.m) { if (!/^[a-h][1-8][a-h][1-8][nbrq]?$/.test(u)) badUci++; if (!Number.isSafeInteger(w) || w < 1) badW++; }
}
Object.assign(out, { emptyM, emptyMNoName, named, ctl, dupUci, unsortedM, badW, extraField, badUci });
ck(emptyMNoName + ctl + dupUci + unsortedM + badW + extraField + badUci === 0, "entry shape");

// 2. independent DFS walk: children rebuilt from FEN text (fresh objects), longest PATH not BFS depth
const reached = new Map<string, string>(); // key -> 4-field fen
let illegal = 0, moves = 0, fenRoundTripMismatch = 0, collisions = 0;
const longest = new Map<string, number>();
const onStack = new Set<string>();
let cycle = false;
function visit(fen: string): number {
  const p = parseFen(fen);
  const k = hex(p);
  const e = book.positions[k];
  if (e === undefined) return 0;
  if (onStack.has(k)) { cycle = true; return 0; }
  const f4 = toFen(p).split(" ").slice(0, 4).join(" ");
  if (reached.has(k)) { if (reached.get(k) !== f4) collisions++; return longest.get(k)!; }
  reached.set(k, f4);
  if (hex(parseFen(toFen(p))) !== k) fenRoundTripMismatch++;
  onStack.add(k);
  const legal = legalMoves(p);
  let best = 0;
  for (const [u] of e.m) {
    moves++;
    const mv = legal.find((c: any) => uciOf(c) === u);
    if (!mv) { illegal++; continue; }
    const c = parseFen(toFen(p));
    makeMove(c, mv);
    best = Math.max(best, 1 + visit(toFen(c)));
  }
  onStack.delete(k);
  longest.set(k, best);
  return best;
}
const longestPath = visit(START);
Object.assign(out, { examined: reached.size, moves, illegal, longestPath, cycle, collisions, fenRoundTripMismatch });
ck(reached.size === keys.length, "examined == entries");
ck(illegal === 0, "0 illegal");
ck(longestPath >= 8 && longestPath <= book.maxPly && book.maxPly <= 12, "depth bounds (longest path)");

// 3. replay every TSV row: each prefix (<=12 ply) in book with the move; name at end; weights == line counts
const counts = new Map<string, number>();
let rows = 0, rowMiss = 0, nameMiss = 0, nameChecked = 0;
for (const f of ["a", "b", "c", "d", "e"]) {
  const lines = readFileSync(join(TSV, `${f}.tsv`), "utf8").split("\n").filter((l) => l !== "");
  for (const line of lines.slice(1)) {
    rows++;
    const [, name, pgn] = line.split("\t") as [string, string, string];
    const sans = pgn.split(" ").filter((t) => t !== "" && !/^\d+\.$/.test(t));
    const p = parseFen(START);
    sans.forEach((san, ply) => {
      const r = parseSan(p, san);
      if (r.outcome !== "move") { rowMiss++; return; }
      if (ply < 12) {
        const k = hex(p), u = uciOf(r.move);
        const ck2 = `${k} ${u}`;
        counts.set(ck2, (counts.get(ck2) ?? 0) + 1);
        if (!book.positions[k]?.m.some(([x]: [string]) => x === u)) rowMiss++;
      }
      makeMove(p, r.move);
    });
    if (sans.length <= 12) { nameChecked++; if (book.positions[hex(p)]?.n !== name) nameMiss++; }
  }
}
let weightMismatch = 0, weightEdges = 0;
for (const k of keys) for (const [u, w] of book.positions[k].m) { weightEdges++; if (counts.get(`${k} ${u}`) !== w) weightMismatch++; }
const startEntry = book.positions[hex(parseFen(START))];
const startSum = startEntry.m.reduce((s: number, [, w]: [string, number]) => s + w, 0);
const e4 = startEntry.m.find(([u]: [string]) => u === "e2e4")?.[1];
const e4rows = ["a","b","c","d","e"].flatMap((f) => readFileSync(join(TSV, `${f}.tsv`), "utf8").split("\n").slice(1)).filter((l) => l.split("\t")[2]?.startsWith("1. e4")).length;
Object.assign(out, { rows, rowMiss, nameChecked, nameMiss, weightEdges, weightMismatch, counted: counts.size, startSum, e4weight: e4, e4rowsByText: e4rows });
ck(rowMiss === 0 && nameMiss === 0 && weightMismatch === 0 && counts.size === weightEdges, "source replay");
ck(startSum === rows && e4 === e4rows, "weights by text");
// A4 independent
const pe4 = parseFen(START); makeMove(pe4, legalMoves(pe4).find((m: any) => uciOf(m) === "e2e4"));
out.e4Replies = book.positions[hex(pe4)].m.filter(([, w]: [string, number]) => w > 0).length;
out.e4Name = book.positions[hex(pe4)].n;
console.log(JSON.stringify(out, null, 1));
console.log(fails.length === 0 ? "HARNESS: ALL CHECKS PASSED" : `HARNESS FAILS: ${fails.join("; ")}`);
process.exit(fails.length === 0 ? 0 : 1);
