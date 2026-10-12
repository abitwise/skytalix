---
id: 20261012T131450Z-architect-design-observation-wiring-premises-and-book-odds-7f2adbae
kind: observation
by: architect-design
task: design-ABC-095-wiring
at: 2026-10-12T13:14:50Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-043
  - ABC-119
  - ADR-0015
  - ADR-0037
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - data/opening-book/book.json
  - 20261012T125300Z-software-engineer-observation-wiring-reds-merged-criteria-ef39c9a6
supersedes:
---

# What the wiring ruling stands on: bar 4 is file-scoped by its test, 10 children substitute `./engine.ts`, and the book makes 1 of them a 40% flake

This note is hand-authored and unsealed. It was read at `main` `1c765b04`, and on the SE's branch tip
`1f205b00` through `git show`. No timing was read.

**`ABC-042` bar 4.**
- **The page.** `plans/tickets/ABC-042-…md:267-272` reads *"No filesystem and no network — in the
  production modules"*. It is a grammar over import specifiers, plus the globals `fetch`, `WebSocket`
  and `XMLHttpRequest`.
- **Its test.** The row "bar 1 — the production modules treat arguments as data" (`src/cli.test.ts`,
  near :1738) loops over `["cli.ts", "cli-options.ts"]`. It reads only those two files' **own** source.
- **The scope paragraph** above the bars (`:243`) names the scope for bars 1 and 3 as "the entry
  point and the resolver". Bar 4 says only "in the production modules". Its test is file-scoped.

**`ABC-042` `A9`.**
- The rule `A9` tests: "only the entry point may acquire `process.stdout` — or `process.stderr` — as a
  writable handle".
- The census row pins 9 `process` identifiers and a sorted list that holds `process.stderr` twice.
- `src/cli.ts`'s header says the same: "Only this module may acquire `process.stdout`, `process.stderr`
  or `process.stdin`".

**The substitution sites in `src/cli.test.ts`.**
- **`./engine.ts`, 10 children:**
  - `black` (:698) and `random` (:699);
  - `mate` (:727);
  - `engineThrows` (:766) and `engineForeign` (:784);
  - `colourBlack` (:804) and `colourWhite` (:814);
  - `resigns` (:826), `quits` (:838) and `renews` (:849).
- **`./line-input.ts`, 1 child:** `inputSeamThrows` (:748).
- **No row pins a substituted module's name.** `grep` finds no guard over the `substituting(` arguments.

**`src/cli.real-engine.test.ts`.**
- `ARGV` is `[ENTRY_POINT, "--colour", "black", "--ascii"]` (:49).
- The two children are `played`, with empty stdin, and `rejected`, with one unreadable line.
- The engine moves at ply 0, from the start position, which is in book. With the book wired, no child
  in this lane reaches the search.

**`createEngine` (`src/engine.ts:518`) is a closure.** It allocates nothing until it is called: the
transposition table allocates lazily (`src/transposition.ts:80`). A child that loads the real
`engine.ts` and never calls it pays module evaluation only. That cost is `UNKNOWN - verify` (no timing
was read).

**The artifact, read by a scratch script outside the repository.** The script imports `src/`
read-only from `main` `1c765b04`. It was run as
`node book-odds.ts /Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example`, and printed:

```text
{"firstMoves":20,"positionsAfterWhiteFirstMoveInBook":19,"outOfBook":["c2c3"]}
start in book: 2032/3865 = 52.6% of 20 moves
mate child, ply 1 (1. f3 ... e7e5): 3/5 = 60.0% of 3 moves
mate child, ply 3 (1. f3 e5 2. g4 ... d8h4): 1/1 = 100.0% of 1 moves
e4 children, ply 1 (1. e4 ... e7e5): 1033/2031 = 50.9% of 19 moves
```

The script:

```ts
import { readFileSync } from "node:fs";
const R = process.argv[2];
const { newGame, playMove } = await import(R + "/src/history.ts");
const { legalMoves } = await import(R + "/src/legal.ts");
const { squareName } = await import(R + "/src/position.ts");
const { zobristKey } = await import(R + "/src/zobrist.ts");
const book = JSON.parse(readFileSync(R + "/data/opening-book/book.json", "utf8"));
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const uci = (m: any) => squareName(m.from) + squareName(m.to);
const key = (h: any) => zobristKey(h.position).toString(16).padStart(16, "0");
const after = (line: string[]) => { const h = newGame(START); for (const u of line) playMove(h, legalMoves(h.position).find((m: any) => uci(m) === u)); return h; };
const share = (line: string[], u: string) => { const e = book.positions[key(after(line))]; if (!e || e.m.length === 0) return "OUT OF BOOK"; const tot = e.m.reduce((s: number, [, w]: any) => s + w, 0); const hit = e.m.find(([x]: any) => x === u); return `${hit ? hit[1] : 0}/${tot} = ${((hit ? hit[1] : 0) / tot * 100).toFixed(1)}% of ${e.m.length} moves`; };
const start = newGame(START);
const firsts = legalMoves(start.position).map(uci);
let inBook = 0; const outs: string[] = [];
for (const f of firsts) { const e = book.positions[key(after([f]))]; if (e && e.m.length > 0) inBook++; else outs.push(f); }
console.log(JSON.stringify({ firstMoves: firsts.length, positionsAfterWhiteFirstMoveInBook: inBook, outOfBook: outs }));
console.log("start in book:", share([], "e2e4"));
console.log("mate child, ply 1 (1. f3 ... e7e5):", share(["f2f3"], "e7e5"));
console.log("mate child, ply 3 (1. f3 e5 2. g4 ... d8h4):", share(["f2f3", "e7e5", "g2g4"], "d8h4"));
console.log("e4 children, ply 1 (1. e4 ... e7e5):", share(["e2e4"], "e7e5"));
```

**What the readings mean.**
- **The SE's 6 default-lane reds are a lower bound.** Under the attempted wiring, `mate` (`ABC-043`
  `A2`, Fool's Mate) passes only when the book answers `1. f3` with `e5`, which is 60% of runs. After
  `2. g4`, the book plays `Qh4#` with certainty.
- **One run passing is the expected case,** so `mate` is a flake on 40% of runs that a single run does
  not show.
- **The `e4` children** (`colourWhite`, `resigns`, `quits`, `renews`) meet a random reply. Theirs is
  `e5` about 51% of the time.
- **Exactly one first move leaves book: `1. c3`.** Every other human-first child is answered by the
  book on the engine's first ply.
