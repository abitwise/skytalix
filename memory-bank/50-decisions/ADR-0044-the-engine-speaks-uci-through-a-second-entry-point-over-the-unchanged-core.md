# ADR-0044: The engine speaks UCI as `skytalix`, a second entry point with a book, levels and `go depth`/`nodes`, and one small engine edit

*The file name keeps its first slug ("over the unchanged core") so that existing references still
resolve. Since the 2026-10-18 revision that slug is no longer true: see § Revision, R6.*

## Status

**proposed** — 2026-10-18 by Architect/Design (task `wave-2026-09-25`, subtask `arch-engine-research`).
**Revised 2026-10-18** by Architect/Design (subtask `arch-engine-revise`) against the owner's answers to
Q1–Q11. It is still **proposed**. **The owner must accept the revision.** Nothing is built because of this
ADR, and no ticket may enter `Ready` on it until he accepts it.

- **The ask.** The owner's word of 2026-10-18 (note
  `.grugops/context/wave-2026-09-25/notes/20261018T073030Z-orchestrator-decision-owner-word-chess-engine-conversion-research-only-5b37b0bc.md`):
  research how to turn this program into a chess engine that a chess UI can drive. A web UI may follow
  as a separate project. Research and design only, no development. **KISS is his explicit constraint.**
- **His answers to Q1–Q11** (note
  `.grugops/context/wave-2026-09-25/notes/20261018T093000Z-orchestrator-decision-owner-word-engine-q1-q11-answered-a41c7e02.md`)
  are folded in below. § Revision lists what changed.
- **It reverses one standing sentence, and only on his word (Q1 = yes).** `plans/epics/EPIC-004-engine-and-ai-opponent.md`
  § Out of scope reads: *"UCI protocol support or driving an external engine such as Stockfish —
  permanent non-goal; this is a self-contained engine."* The **UCI half** of that sentence is lifted.
  The "driving an external engine" half stays a non-goal: this design makes the engine *drivable*, and
  it never drives Stockfish. Rewriting the epic is BA/PM's job, not this ADR's.
- **Evidence** is in the shared context, not restated here:
  - standards research with primary-source URLs — `.grugops/context/arch-engine-research/notes/20261018T074200Z-architect-design-observation-chess-engine-standards-read-on-the-primary-sources-3f1a9c20.md`;
  - repo-fit map (what we have, what is missing) — `…/20261018T074300Z-architect-design-observation-repo-fit-map-what-uci-needs-against-what-src-has-7b2e4d18.md`;
  - the first hop's decision — `…/20261018T074400Z-architect-design-decision-adr-0044-proposed-uci-v1-shape-and-the-owner-questions-c5d07e91.md`;
  - this revision's decision and repo-fit facts — `.grugops/context/arch-engine-revise/notes/20261018T095000Z-architect-design-decision-adr-0044-revised-book-levels-go-limits-skytalix-artifact-gpl-e4a7c912.md`.

## Revision — 2026-10-18 (the owner's answers to Q1–Q11)

| # | owner's answer | what changed in this ADR |
|---|---|---|
| R1 | Q1–Q3: the recommended answers | No change. UCI only, the first user is a human in his UI, and the 5 s ceiling stays (`NFR-004`) |
| R2 | Q4: **book on in v1** | New **D10**. `OwnBook` is a `check` option with `default true`. The book is read once per process, lazily, and a bad file degrades to no book |
| R3 | Q5: **strength control in v1** | New **D11**. `Skill Level` is a `spin` from 1 to 5 over `LEVELS`, `default 3`. It claims no Elo. The level's budget is a minimum against the `go` time |
| R4 | Q6: **honour `go depth` / `nodes`** | New **D12**. `depth`, `nodes` and `mate` are honoured through **two new optional `EngineOptions` fields** |
| R5 | Q7: **a separate backend spawns the CLI** | **D8 is replaced.** This repo ships a built artifact, `npm run build` → `dist/uci.js`, with a `package.json` `bin` named `skytalix`. The Web Worker route is no longer v1 |
| R6 | consequence of R4 | **The "core unchanged" claim is dropped for `src/engine.ts`.** It gets one minimal, defaulted edit (D12). `src/search.ts`, `src/levels.ts` and `src/book*.ts` stay unedited |
| R7 | Q8: **GPL v3** | New **D13**. `GPL-3.0-or-later` (the Orchestrator's reading). Everything bundled was checked. One item needs the owner's call: the evaluation tables' provenance (new **Q12**) |
| R8 | Q9: **name `skytalix`** | D3 and D13: `id name skytalix`, `id author Olger Oeselg`, and `bin` `skytalix`. The package, the repo and the terminal game are **not** renamed (new **Q13**) |
| R9 | Q10, Q11 | The owner installs `cutechess-cli` and En Croissant. v1 is done without the web UI. D9's acceptance relies on both |

## Context

**The standard is UCI.** The *Universal Chess Interface* (Huber and Meyer-Kahlen, 2000; text of the April
2006 version) is a line protocol over stdin and stdout. The GUI holds the game. The engine is stateless
between commands, apart from the position it was last given and its option values. The research note
shows that UCI is what every target we care about speaks:

- desktop GUIs and the engine-testing tool `cutechess-cli` (`proto=[uci | xboard]`);
- Stockfish.js in a browser Web Worker (*"speaks UCI … over `postMessage`"*);
- the Lichess external-engine reference provider (it sends `uci`, `isready`, `position fen … moves …`,
  `go movetime|depth|nodes`, `stop`);
- `lichess-bot` (*"UCI, XBoard, and Homemade engines"*).

CECP (xboard) is the older alternative. It is stateful: the engine plays a side, and there is a force
mode, `level`/`st`/`sd`, `time`/`otim` and feature negotiation.

**Most of what UCI needs already exists** (the repo-fit notes have the map):

| UCI needs | the repo has |
|---|---|
| `position fen …` | `parseFen` / `FenError` (`src/fen.ts`) |
| `… moves e2e4 e7e8q e1g1` | `parseCoordinateMove` (`src/coordinate-move.ts`); the grammar is UCI long algebraic, castling is king-to-square, and the parser selects from `legalMoves` |
| make the moves | `makeMove` (`src/apply.ts`) |
| a move within a time budget | `chooseMove(position, { budgetMs, now })` (`src/engine.ts`), which returns `move`, `score`, `depth`, `nodes`, `elapsedMs` |
| `OwnBook` | `createBookProbe({ read, warn, random })` (`src/book.ts`). It is keyed by `zobristKey(position)`, so it needs the position and never the move history. `readBookFile` (`src/book-file.ts`) supplies `read` |
| `Skill Level` | `LEVELS` 1–5, `DEFAULT_LEVEL` = 3, `createLevel(level, { seed, now })`, `seededRandom` (`src/levels.ts`) |
| `go depth` / `nodes` | iterative deepening with a node counter (`src/engine.ts` `deepen`, `countNode`). There is no cap on either today (D12) |
| `bestmove e2e4` out | `squareName` (`src/position.ts`); `src/book.ts` already has a private `uciOf` |
| `score mate N` | `MATE_SCORE` (`src/search.ts`), `MATE_FLOOR` (`src/transposition.ts`) |
| correctness standard | perft, pinned to the Chess Programming Wiki counts (`src/perft.test.ts`: startpos 20…4 865 609, Kiwipete 48…4 085 603) |

**What is missing is small.** There is no protocol loop. There is no rule that turns a GUI clock into a
budget. There is no `info` line, and no way to read `stop` while `chooseMove` holds the thread.
`chooseMove` is synchronous. Nothing caps the deepening at a depth or a node count.

**Rulings this design must respect** (an *amended* tag means the owner's word moves it, as D12 states):

- **`ADR-0011`.** Clause 1: every non-test `.ts` under `src/` is a production module. Clause 3: the
  importers of `src/history.ts` must equal the licence set `{ turn-loop.ts, cli.ts }`. Clause 4: an entry
  point exports nothing. Trigger `R3` fires on the first `.ts` file in a subdirectory of `src/`.
- **`ADR-0016`.** Whoever acquires stdout owns its `EPIPE` arm. Exit codes stay `0` / `1` / `70`.
- **`ADR-0036`.** Clause (b1) fires on a production diff that adds `process.` or a Node builtin import.
  `src/book-file.ts` is a capability holder (limb 1).
- **`ADR-0002` clause 3.** The search reads only the position, not the game history.
- **`ADR-0012` clause 2.** In the terminal game the book is an `EngineSeam` decorator (`withBook`).
- **`ADR-0037` D3 and `ADR-0027` d1–d2.** The randomness is injected. The seed reaches the blunder
  draw and the book draw only, never move selection.
- **`ABC-078` `A4` and `ADR-0027` decision 3.** No depth argument and no new `EngineOptions` field.
  **Amended by D12** on the owner's Q6 word.
- **`ADR-0024` decision 7, coding rule 7.** No *unrequested* engine option. `OwnBook` and `Skill Level`
  are **requested** (Q4, Q5), and nothing else is offered.
- **`NFR-004`.** The 5 s hard ceiling holds at any difficulty, enforced by the clamp in `src/engine.ts`.
- **`NFR-006`.** The book is at most 1 MB. Today it is 356 526 bytes.
- **`NFR-008`.** The `N8-LANE` and `N8-SPAWN` accounts. `N8-SPAWN` has a balance of 0 ms.
- **`ADR-0007` and `ADR-0018`.** The product runs locally, from a clone. Nothing is published.

## Decision

### D1. One protocol: UCI (2006 text). No CECP.

### D2. Shape: two new flat files, and one minimal edit to the engine

- **`src/uci.ts`, the entry point** (`ADR-0011` clause 4: it exports nothing). It is the only module that
  acquires `process.stdin` and `process.stdout` in this mode. Its first line is `#!/usr/bin/env node`,
  for the `bin` (D8).
  - It reads lines with `node:readline` and passes each one to the session.
  - It installs the one stdout `EPIPE` arm before anything is written (`ADR-0016` clauses 3–4). On
    `EPIPE` the session ends at exit `0`.
  - It composes the capabilities: `Date.now` as the clock, `Math.random` as the randomness, and one
    `createBookProbe({ read: readBookFile, warn, random: Math.random })`. `warn` writes
    `info string <message>` (D10).
  - Exit codes: `0` on `quit` or end of input. `1` if any command-line argument is given (it takes none).
    `70` on an exception, which is the `cli.ts` shape.
- **`src/uci-session.ts`, the protocol.** It has no capabilities: no `process`, no Node builtin, no
  real-clock read and no `Math.random` of its own.
  - Its shape is `createUciSession({ write, now, random, book }) → { handleLine(line): "continue" | "quit" }`.
    `write` takes one output line. `now` is the `Clock`, so the tests inject a virtual one
    (`ADR-0027`). `random` returns values in [0, 1) and draws the blunder seeds (D11). `book` is a
    `BookProbe`.
  - It holds the current position, the two option values, and the held `bestmove` while `go infinite`
    waits for `stop`.
  - It is the `cli.ts` / `cli-options.ts` split again: the entry point is composition only, and
    everything that can be unit-tested lives here.
- **Imports allowed in the session:**
  - `fen.ts`, `coordinate-move.ts`, `apply.ts`, `legal.ts`, `engine.ts`, `levels.ts`, `position.ts`,
    `search.ts` (for `MATE_SCORE`), and `transposition.ts` (for `MATE_FLOOR`), or that constant
    re-derived. `book.ts` **as a type only** (`BookProbe`).
  - **Not** `history.ts`, `turn-loop.ts`, `book-engine.ts` or `level-seam.ts`. The last two are
    `EngineSeam` adapters over a `GameHistory`. So `ADR-0011` clause 3's licence set does not move, and
    no `GameHistory` is built.
  - **Not** `book-file.ts`, so the session reaches no `fs`. Only `uci.ts` imports it.
- **One edit to `src/engine.ts`**, which D12 specifies: two optional fields, defaulted to today's
  behaviour. **No edit** to `search.ts`, `levels.ts`, `book.ts`, `book-engine.ts`, `book-file.ts`,
  `level-seam.ts`, `turn-loop.ts`, `cli.ts`, `fen.ts`, `moves.ts`, `legal.ts`, `apply.ts` or
  `coordinate-move.ts`. **`npm run chess` is byte-identical.**
- **Build and run lines** (D8): `"uci": "node src/uci.ts"` for development, `"build"` emits
  `dist/`, and `"bin": { "skytalix": "dist/uci.js" }`.

### D3. The v1 command set (the minimum a GUI needs)

| GUI → engine | engine does |
|---|---|
| `uci` | `id name skytalix`, `id author Olger Oeselg`, `option name OwnBook type check default true`, `option name Skill Level type spin default 3 min 1 max 5`, `uciok` |
| `setoption name <id> [value <x>]` | `<id>` is the text between `name` and `value`, matched **case-insensitively** (the spec says option names *"should not be case sensitive and can inlude spaces"*). `OwnBook`: `true` or `false`. `Skill Level`: an integer from 1 to 5, looked up by an own key (`Object.hasOwn(LEVELS, n)`, the `level-seam.ts` rule). An invalid value keeps the old value and writes one `info string`. **Any other name is ignored**, which covers the options Lichess's provider sets unconditionally (`UCI_AnalyseMode`, `UCI_Chess960`, `Threads`, `Hash`, `MultiPV`) |
| `isready` | the first time with `OwnBook` on, it warms the book (D10). Then `readyok` |
| `ucinewgame` | sets the position back to the start. It does not reset the options, reload the book or reseed anything (D10, D11). The table is already cleared per search (`ADR-0025`) |
| `position startpos \| fen <6 fields> [moves m1 m2 …]` | parse it, then apply the moves through `parseCoordinateMove` and `makeMove`. If the FEN or any move is bad, the **whole command is refused**: no position is held, and one `info string` line names the fault (text filtered to printable characters, the `cli.ts` `printableOf` rule) |
| `go [movetime x] [wtime x btime x winc x binc x movestogo x] [depth x] [nodes x] [mate x] [infinite] [ponder] [searchmoves …]` | book first (D10). If there is no book move, budget as in D4 and limits as in D12. Write one `info` line, then `bestmove` |
| `stop` | if a held `bestmove` is waiting (`infinite`), write it. Otherwise ignore |
| `ponderhit` | the same as `stop` in v1. No `Ponder` option is offered, so a GUI should not send it |
| `quit` | end: exit `0`, without `process.exit` (the `ADR-0016` precedent) |
| `debug`, `register`, anything unknown | ignored. The spec says *"if the engine or the GUI receives an unknown command or token it should just ignore it"* |

**Output, exactly:**

- After a search that went through `chooseMove`:
  `info depth <D> score cp <S> nodes <N> time <T> nps <X> pv <move>`, or `score mate <±M>` where
  `|score| ≥ MATE_FLOOR`. Then `M = ceil((MATE_SCORE − |score|) / 2)`, and it is negative when the engine
  is being mated. The UCI scoring rule is *"mate in y moves, not plies"*.
- After a move through `createLevel` (levels with a blunder rate, D11):
  `info depth <D> nodes <N> time <T> pv <move>`. `LevelChoice` carries no score, so none is sent. A
  score is optional in UCI.
- After a book move: `info string book`.
- `bestmove <move>`. `bestmove 0000` when no position is held or the position has no legal move. The spec
  sends a null move as `0000`, and *"for every `go` command a `bestmove` command is needed"*.
- Nothing else is ever written on stdout. Diagnostics are `info string` lines.

### D4. Time management: one rule, in the session

1. **The `go` budget, `G`:**
   - `movetime x` gives `x`.
   - Otherwise, if the side to move has a clock `t` (with increment `i`, default 0, and `movestogo m`):
     `max(1, min(t / (m ?? 20) + i / 2, t − 50))`. That is the Chess Programming Wiki's *"base / 20 +
     increment / 2"* plus a 50 ms move overhead. The tuning belongs to the ticket and is measured, not
     argued here.
   - Otherwise (`infinite`, `ponder`, only `depth`/`nodes`/`mate`, or a bare `go`), `G` is
     `HARD_CEILING_MS`.
2. **The level caps it.** The budget passed down is `min(G, LEVELS[skill].budgetMs)` (D11). A bare `go`
   at the default level is therefore 3 000 ms, which is `DEFAULT_BUDGET_MS`, the same as the first
   version of this ADR.
3. **`infinite` or `ponder` holds the `bestmove` until `stop`.** The spec says *"Do not exit the search
   without being told so in this mode"*. The engine may stop thinking early. It may not answer early.
4. **The engine clamps every budget at `HARD_CEILING_MS`** (`NFR-004` clause B, unchanged).

### D5. One thread, synchronous search. No worker in v1.

`chooseMove` runs to its budget inside `handleLine`. Input that arrives meanwhile waits in the pipe and is
handled in order afterwards. The consequences are accepted and stated:

- `isready` during a search is answered at most one budget late, so at most about 5 s. The spec says
  *"should … immediately answer"*.
- `stop` takes effect at most one budget late. A `stop` that arrives after the `bestmove` is ignored.
- One `bestmove` per `go` always holds.

**The upgrade is pre-designed and is not built.** The search would move to one `worker_threads` worker.
The stop flag would be a `SharedArrayBuffer` slot, read through the engine's **existing** injected `now`
clock: `now = () => (stopped ? Infinity : Date.now())`. The clock is already consulted every
`NODES_PER_CLOCK_CHECK` nodes, so this needs no edit to `src/engine.ts` beyond D12's. Build it only when
one of these triggers fires:

- the owner lifts the 5 s ceiling for UCI (Q3 was answered "keep it");
- pondering is wanted;
- a target GUI is shown to time out on `isready` or `stop`.

### D6. Not in v1, each with what would bring it in

| left out | brought in by |
|---|---|
| UCI options `Hash`, `Threads`, `MultiPV`, `Ponder`, `UCI_Chess960`, `UCI_LimitStrength` / `UCI_Elo` | the owner's word per option. `ADR-0024` d7 and rule 7 forbid an unrequested engine option. `UCI_Elo` also needs Elo numbers, and this project has never claimed one (`src/levels.ts`) |
| honouring `searchmoves` | a named user. It would need a root-move filter in `src/engine.ts` |
| `info` per iteration, `currmove`, `seldepth`, a pv longer than one move | needs a per-iteration hook in `src/engine.ts` (a GUI shows only the final line in v1) |
| game-history repetition seen by the search | an `ADR-0002` clause 3 amendment. Today's terminal game has the same gap |
| `depth`/`nodes`/`mate` at a level with a blunder rate (1, 2) | an edit to `src/levels.ts` to forward the limits. Not wanted for v1 (D11) |
| Chess960, CECP, `go perft`, any server, a bundler, a Web Worker bundle or a WASM build in this repo | rejected below, or belongs to the web project (D8) |

### D7. The terminal UI is unchanged

`npm run chess`, `src/cli.ts` and the frame path (`ADR-0029`) are untouched. Both entry points compose the
same core. D12's fields are absent on every terminal-game call, so its engine is node for node the same.

### D8. The engine artifact, and how a UI reaches it (replaces the first version's D8)

**The owner's Q7 answer.** The web UI has its own backend (WebSocket or an API). That backend runs the
engine CLI as a child process. The router is not in this repo, but this repo must build into something
that backend can run.

- **The artifact is plain JavaScript emitted by `tsc`, the compiler already in the stack.** It is not a
  bundle and not a native binary.
  - **`tsconfig.build.json`** extends `tsconfig.json` with `noEmit: false`,
    `rewriteRelativeImportExtensions: true` (TypeScript 5.7 or later; the lock has 5.9.3), `rootDir: "src"`,
    `outDir: "dist"` and `files: ["src/uci.ts"]`. So it emits only `uci.ts` and what it imports, flat in
    `dist/`. No test file and no terminal-only module is emitted.
  - **`npm run build`** becomes `tsc -p tsconfig.build.json`. The `build` mandatory gate therefore
    changes meaning, from a second typecheck to "the engine artifact builds". The `typecheck` gate still
    checks the whole tree. `AGENTS.md`'s Build line is the Scribe's to update. `dist/` is already in
    `.gitignore`.
  - **`package.json`** gets `"bin": { "skytalix": "dist/uci.js" }` and `"uci": "node src/uci.ts"`. The
    package stays `"private": true`, and its name stays `cli-chess` (D13, Q13).
- **How it is run.** In a clone: `npm ci && npm run build`. Then the backend spawns
  `node <clone>/dist/uci.js`, or `skytalix` on the `PATH` after `npm link` in that clone. A desktop GUI or
  `cutechess-cli` is pointed at the same command. `node <clone>/src/uci.ts` still works for development.
- **The book travels with the clone, not inside `dist/`.** `src/book-file.ts` reads
  `../data/opening-book/book.json` relative to its own URL. Because `dist/` is flat, `dist/book-file.js`
  resolves to the same `data/` file. A `dist/` copied away from its clone plays without a book, after one
  `info string` warning (D10). It does not fail.
- **Why build at all, when `node src/uci.ts` runs.**
  - Node refuses to strip types under `node_modules`. The Node docs say it *"refuses to handle
    TypeScript files inside folders under a `node_modules` path"*. So the `.ts` source stops working the
    moment the backend takes this repo as a dependency. The emitted JavaScript keeps working.
  - Type stripping is on by default only from Node 22.18.0 / 23.6.0. `"engines"` says `>=22`, and the
    emitted JavaScript needs no stripping at all.
  - The owner asked for the engine to be buildable.
- **Out of v1:** `npm publish`, a `prepare` script or install from a git URL, a native single binary,
  a bundler, and the Web Worker route. The session stays capability-free, so a Worker bundle remains
  possible later without a fork. It would inject a `read` that returns book bytes the page fetched.
  Each of these is `ADR-0018`'s or `EPIC-006`'s revisit, and none is decided here.
- **This stays inside `ADR-0007` and `ADR-0018`.** It is local and built from a clone, and nothing is
  published. Where the backend is deployed is the web project's decision.

### D9. Tests (shape only; the tickets write them)

- **Default lane:**
  - One new file, `src/uci-session.test.ts`. It drives `handleLine` with strings and injects `now` (a
    virtual clock), `random` (`seededRandom(k)`) and `book` (a probe over in-memory bytes). It spawns
    nothing (the `N8-SPAWN` balance stays at 0 ms) and adds one file to the per-file floor
    (`NFR-008`). It covers the option lines, `setoption`, the book hit and miss, the level paths, and
    each `go` limit.
  - D12's rows go in `src/engine.test.ts`, not a new file. One row each: `maxDepth` stops at that
    depth, `maxNodes` aborts and discards the iteration, and absent fields match today's readings.
- **Opt-in real-child lane** (the `ABC-119` precedent): one scripted dialogue against
  `node src/uci.ts`, under an env flag; unset means NOT DEFINED.
- **Acceptance outside vitest:** after `npm run build`, a `cutechess-cli` match against `dist/uci.js` (or
  `skytalix`), `proto=uci`, N games at a short time control, with 0 illegal moves, 0 time forfeits and
  0 disconnects. Then the owner plays it in En Croissant (Q10: he installs both). Perft stays the
  move-generator standard and already holds.

### D10. The opening book under UCI (Q4: on in v1)

- **What is reused.**
  - `src/book.ts` `createBookProbe` is constructed **once**, in `src/uci.ts`.
  - `src/book-file.ts` `readBookFile` is bound as its `read`, unedited.
  - `src/book-engine.ts` (`withBook`) is **not imported**. It decorates an `EngineSeam` over a
    `GameHistory`, which the session does not have. The session applies the same rule in the same order,
    in one expression: `book.bookMove(position) ?? search`. The terminal game does the same: `withBook`
    around the level seam (`src/cli.ts`). `ADR-0012` binds the turn loop's seam, and the session has none.
- **From a `position … moves …` history.** The session applies the moves first, then probes the
  **resulting position**. The book is keyed by `zobristKey(position)`, so it needs no move list, a
  transposition hits the same entry, and a `position fen …` that reaches a book position hits it too.
- **`OwnBook` is a `check` option with `default true`.** The owner said "on". The spec says that when the
  GUI sets it false, *"the engine should not access its own book"*. Then the session never calls the
  probe, and the file is never read.
- **A book hit** returns the move with no search, whatever the `go` limits or the level are. That is the
  terminal game's order (book before level). The line is `info string book`, then `bestmove`. Under
  `go infinite` the `bestmove` is held until `stop`, as in D4.
- **When it is read.** Construction does no filesystem operation (`N-LOAD`), so `uci` → `uciok` reads
  nothing. The bytes are read **once per process**, at the first `isready` while `OwnBook` is on, or else
  at the first `go`. The spec says `isready` *"is also required once before the engine is asked to do any
  search to wait for the engine to finish initializing"*. The session warms the book with one
  `book.openingName(position)` call, which loads the file and calls neither `legalMoves` nor `random`.
  `ucinewgame` does not reload it. A changed file is seen only by a new process.
- **A missing or unreadable file** (or one over 1 MB, not UTF-8, not JSON, not the schema, or holding an
  illegal move) switches the probe off for the life of the process. That is `ABC-094`'s contract, and it
  never throws. Its one warning reaches the GUI as `info string opening book … playing on without it`.
  Every later `go` searches. The session never fails and the exit code does not change. The warning
  text is fixed and carries no byte of the file.
- **The book's randomness** is `Math.random`, bound in `uci.ts` (`ADR-0037` D3). The tests bind
  `seededRandom`.

### D11. Strength control (Q5: in v1)

- **`option name Skill Level type spin default 3 min 1 max 5`.** The values are `src/levels.ts`'s ordinals,
  and `default 3` is `DEFAULT_LEVEL`, the terminal game's default (the shipped engine at 3 s, no
  blunders). **No Elo is claimed.** `UCI_LimitStrength` / `UCI_Elo` is rejected (Alternatives).
- **With the `go` time.** The budget is `min(G, LEVELS[skill].budgetMs)` (D4). The level is a cap on
  effort and the GUI's clock is a cap on time, so the smaller one binds. Level 1 thinks at most 100 ms
  even with plenty of time on the clock. Any level thinks less when the clock is short. The engine still
  clamps at `HARD_CEILING_MS`.
- **Two paths, chosen by the level's data, not its number:**
  - **`blunderRate` is 0** (levels 3, 4, 5 today): the session calls `chooseMove(position, { budgetMs, now,
    maxDepth, maxNodes })` directly. That is what `createLevel` does for a rate of 0, so it is the same
    move, and D12's limits apply.
  - **`blunderRate` is above 0** (levels 1, 2): the session calls
    `createLevel({ budgetMs, blunderRate }, { seed, now })(position)`, with `budgetMs` already the
    minimum above. `createLevel` takes no depth or node limit, so `depth`, `nodes` and `mate` are
    ignored here, with one `info string`. Forwarding them would edit `src/levels.ts` (D6).
- **The blunder seed.** A fresh level instance is made **per `go`**, because its budget can change per
  `go`. Its seed is `Math.floor(random() * 2 ** 32)`, drawn from the injected `random`. `uci.ts` binds
  `Math.random`, which is `src/cli.ts`'s own seed source, and the tests bind `seededRandom(k)`, so a
  test is deterministic. **`ucinewgame` does not reseed.** The session holds no generator state, so there
  is nothing to reset, and no seed option is offered.

### D12. `go depth`, `go nodes`, `go mate` (Q6: honour them), and the one engine edit

- **What the engine already has** (`src/engine.ts`): iterative deepening in `deepen`, from depth 1 up while
  `now() < deadline`. Depth 1 always completes. A node counter, `budget.nodes`, consults the clock every
  `NODES_PER_CLOCK_CHECK` = 1024 nodes from iteration 2 on, and throws `ABORTED`. An aborted iteration
  is discarded whole (`A3`). `EngineChoice` reports `depth` and `nodes`. `chooseMove`'s options are
  `budgetMs` (required) and `now`.
- **What it does not have, and cannot be made to do from outside:**
  - **A depth cap.** No injected value stops the loop at a depth.
  - **`search(position, depth)`** (`src/search.ts`) runs to a fixed depth, but it cannot be aborted and
    is not bound by the ceiling (`NFR-004` B). It is rejected.
  - **A node cap.** One could be faked by a clock that counts its own calls, but that ties the session
    to how often the engine reads its clock, and it breaks the `Clock` contract (milliseconds). It is
    rejected.
- **The edit (minimal).** Two optional fields on `EngineOptions`, absent meaning today's engine:
  - `readonly maxDepth?: number` — stop deepening once this iteration has completed. In the loop:
    `iteration <= (options.maxDepth ?? Infinity)`, beside `now() < deadline`.
  - `readonly maxNodes?: number` — abort once `budget.nodes ≥ maxNodes`. The test sits in `countNode`'s
    existing every-1024-nodes branch, **after** the clock read (`now() >= deadline || nodes >= maxNodes`),
    and in the loop condition. The aborted iteration is discarded, as for time.
  - Nothing else changes. No export is added (`A4`'s export list holds), and `chooseMove.length` stays 2.
    `budgetMs` stays required. Both fields can only **shorten** a search that the clock and
    `HARD_CEILING_MS` still bound, so `NFR-004` is untouched.
  - **Absent fields are node for node and clock read for clock read today's engine.** The clock is read
    first in both places, so a virtual-clock reading (`ADR-0027`) does not move. Every existing pin in
    `src/engine.test.ts` stays as it is, except `A4`.
  - **Amendments this brings, stated plainly:**
    - **`ABC-078` `A4`.** Its "no depth default and no depth constant" check bans `max_?depth`, and
      `maxDepth` would trip it. The ticket amends that one check: still no depth default and no depth
      constant, plus a pin that `maxDepth` is optional and has no default value. The export and arity
      pins are unchanged. RISK-002 still holds: the budget is still time, and a depth can only cut it short.
    - **`ADR-0027` decision 3** ("no `EngineOptions` field … no node budget") is amended for these two
      fields only, on the owner's word.
    - **`ADR-0024` decision 7** is met: the owner requested this.
- **The session's mapping:**
  - `depth N` (an integer ≥ 1) → `maxDepth: N`.
  - `nodes N` (an integer ≥ 1) → `maxNodes: N`. It stops at the node budget, not at the next completed
    iteration: the last completed iteration is played, and the search may overshoot by the same bound
    `A2` states for time (up to one interval per stack level). The first iteration always completes, so
    a tiny `N` still returns a depth-1 move.
  - `mate N` (an integer ≥ 1) → `maxDepth: 2N − 1` plies, the depth at which a full-width search sees a
    mate in N. If `depth` is also given, the smaller one wins. The engine reports `score mate` if it finds
    the mate. This is an approximation and is stated as one: late-move reductions and the time budget can
    hide a mate that the depth would otherwise show. Not finding a mate is not an error, and a `bestmove`
    is always sent.
  - With no time token, `G` is the ceiling (D4), capped by the level.
  - A value that is not a positive integer drops that token, with one `info string`.
  - `searchmoves` is ignored, with one `info string` (D6).

### D13. Licence and name (Q8, Q9)

- **Name.** `id name skytalix`, `id author Olger Oeselg`. The `bin` is `skytalix`. **Not renamed:** the
  npm package (`cli-chess`), the repository, `npm run chess` and the terminal game's text. Renaming
  them is the owner's open item (Q13).
- **Licence.** `GPL-3.0-or-later`. The Orchestrator read the owner's "GNU GPL v3" that way, and he may
  say `-only` instead (Q12). `ABC-169` adds the `LICENSE` text and `"license": "GPL-3.0-or-later"` to
  `package.json`.
- **What would be bundled, checked on 2026-10-18:**

| item | where from | licence | GPL-3.0 |
|---|---|---|---|
| `data/opening-book/book.json` (the moves and opening names) | `lichess-org/chess-openings` at `a6189a30`, compiled by `tools/opening-book/compile.ts` (`ADR-0023`, `data/opening-book/ATTRIBUTION.md`) | CC0-1.0 | compatible |
| `seededRandom` in `src/levels.ts` (mulberry32) | Tommy Ettinger's `mulberry32.c` gist | CC0 dedication (*"dedicated all copyright … to the public domain worldwide"*) | compatible |
| `splitmix64` in `src/zobrist.ts` (its constants) | Sebastiano Vigna's `splitmix64.c` | public-domain dedication | compatible |
| **`PIECE_VALUE` and the six piece-square tables in `src/evaluate.ts`** | **They match Tomasz Michniewski's "Simplified Evaluation Function", value for value.** P/N/B/R/Q = 100/320/330/500/900, and all six tables (pawn, knight, bishop, rook, queen, king middle game) were checked row by row against <https://www.chessprogramming.org/Simplified_Evaluation_Function> on 2026-10-18. The file calls them "hand-written" | the wiki's footer says *"licensed CC BY-SA 3.0 by its contributors"*. Creative Commons says *"no non-CC licenses have been designated as compatible with BY-SA 3.0"*. Whether 64-number tables are copyrightable at all, and whether the wiki's licence binds numbers first posted to a mailing list, is a legal question: `UNKNOWN - verify` | **the one possible blocker (Q12)** |
| perft counts, Kiwipete and other test FENs | the Chess Programming Wiki | facts, used in tests only, not in `dist/` | no issue |
| the puzzle corpus (`src/puzzle-corpus.ts`) | hand-built (its header) | own work, not imported by `uci.ts` | no issue |
| devDependencies: `@biomejs/biome` (MIT OR Apache-2.0), `typescript` (Apache-2.0), `vitest`, `vite`, `@vitest/coverage-v8`, `@types/node` (MIT) | npm | permissive | not shipped in `dist/`. `package-lock.json` holds **0** non-dev packages, so nothing ships at run time |
| `tools/grugops/*.js` | the grugops kit's tools. Four headers (`host-protection.js`, `reference-check.js`, `test-skip-integrity.js`, `uat-spec-integrity.js`) name kit phases or call themselves kit-shipped | `UNKNOWN - verify` | not in `dist/`. A repo-wide `LICENSE` would cover them, so their owner must agree (Q12) |
| the Node.js runtime | not bundled | — | — |

- **Interop.** A GUI or backend talks to `skytalix` over stdio, as a separate process. GPL for this repo
  also suits a later Worker bundle beside GPL-3.0 `chessground` / Stockfish.js. That is the web project's
  concern.

## Alternatives

| # | option | why it is rejected |
|---|---|---|
| 1 | **CECP / xboard instead of UCI** | The engine would have to hold the game state, the side it plays, force mode, `level`/`st`/`sd`, `time`/`otim` and feature negotiation (*"feature done=1"*), with SIGINT legacy (*"this grungy feature"*). Every target in Context speaks UCI, and the testers (`cutechess-cli`, `lichess-bot`) take either, so UCI loses nothing and is less state |
| 2 | **Both protocols** | Twice the surface for no named user |
| 3 | **A `--uci` flag on `src/cli.ts`** | It mixes a protocol into the frame-path entry point. It edits `cli-options.ts`'s `ACCEPTED_ARGUMENTS`, the `cli.test.ts` pins and `AGENTS.md`'s guarded Dev/run slot. A second entry point is a local change, and this is not |
| 4 | **The engine as an HTTP/WebSocket server in this repo** | It adds a network capability (`ADR-0036` (b1)) and a deploy posture this project does not have (`ADR-0007`). The owner's Q7 puts the router in the web project's backend. stdio is the standard |
| 5 | **A worker thread in v1** | It buys an immediate `readyok` and `stop`, but costs a second thread, message passing and its error paths. Under the 5 s ceiling the latency it saves is at most 5 s. Deferred with triggers (D5) |
| 6 | **A yielding or async search** (`setImmediate` every N nodes) | It edits the recursion in `engine.ts`, which is identity-swept against `search.ts`, slows the search and breaks `ABC-078` pins |
| 7 | **Reuse `EngineSeam` / `history.ts` / `withBook` / `createLevelSeam`** | They take a `GameHistory`. Building one adds an importer of `history.ts`, which amends `ADR-0011` clause 3's licence set and its guard. Faking one is a type lie. They buy only an ordering (book, then level) that the session writes in one expression |
| 8 | **Reuse `src/line-input.ts`** | It writes the `"> "` prompt to stdout, which breaks the protocol. It routes lines to the human command table. Its `MAX_LINE_LENGTH` of 1024 is shorter than a `position startpos moves …` line after about 200 plies |
| 9 | **`go depth` through `search(position, depth)`** | It cannot be aborted and is not bounded by the ceiling (`NFR-004` B). D12's optional cap keeps the clock in charge |
| 10 | **A node cap through a call-counting clock** | It needs no engine edit, but it couples the session to the engine's clock cadence, breaks the `Clock` contract (milliseconds), and miscounts the unarmed first iteration. D12's field is two lines and honest |
| 11 | **`go mate N` ignored with an `info string`** | The owner said not to ignore what the engine can do. `maxDepth: 2N − 1` costs no extra code beyond D12 |
| 12 | **`UCI_LimitStrength` / `UCI_Elo`** | It needs Elo numbers this project has never claimed or measured (`src/levels.ts`: *"No level claims an Elo number"*). A spin over the existing ordinals invents nothing |
| 13 | **`Skill Level` default 5** (Stockfish's convention: full strength by default) | Levels 4 and 5 add only think time. Level 3 is the product's stated default and the `NFR-004` 3 s point. A GUI that wants more sets 5 |
| 14 | **Editing `src/levels.ts` to take a per-call budget or the limits** | It edits merged `ABC-087` code. A per-`go` instance over a `Level` built from the table's data uses the existing API unchanged |
| 15 | **Reseeding at `ucinewgame`, or a `Seed` option** | A per-`go` draw from the injected source holds no state to reset, and a seed option is unrequested (`ADR-0024` d7) |
| 16 | **Loading the book at process start** | It breaks `N-LOAD` and delays `uciok`. `isready` is the spec's place for initialization |
| 17 | **A native single binary** (Node SEA, `pkg`, `bun build --compile`, `deno compile`) | Each is a new toolchain, builds per platform, and has to embed `book.json`. The owner's need is a CLI the backend can spawn, which `node dist/uci.js` / `skytalix` is. Revisit only for a named consumer without Node |
| 18 | **A bundler, or a WASM build inside this repo** | It adds a toolchain to a no-bundler stack (`AGENTS.md` § Stack). `tsc` already emits runnable JavaScript |
| 19 | **No build; the `bin` points at `src/uci.ts`** | It breaks under `node_modules` (Node will not strip types there) and on Node 22 before 22.18. The owner asked for a build |
| 20 | **`build` keeps `tsc --noEmit`, plus a new `build:engine` script** | Two build words for one artifact. `typecheck` already holds the full-tree typecheck |

## Consequences

- **Census.**
  - Two new production modules (`ADR-0011` clause 1). `src/uci.ts` is the third entry point, after
    `perft-bench.ts` and `cli.ts` (clause 4), and is never on the frame path.
  - Neither imports `history.ts`, so the clause 3 licence set is unchanged. Both are flat in `src/`, so
    `R3` does not fire.
  - **`src/engine.ts` is edited** (D12): two optional fields. **The "core unchanged" claim of the first
    version is withdrawn** for this file only.
  - Config: `tsconfig.build.json` (new); `package.json` `build`, `uci` and `bin`; `LICENSE` and
    `"license"` (`ABC-169`).
- **Gates.**
  - The ticket that builds `src/uci.ts` fires `ADR-0036` (b1) (`process.`, `node:readline`, and the
    import of the capability holder `book-file.ts`) and routes through `In Security/NFR`.
    `uci-session.ts` must carry no limb, and that is a review check.
  - The engine edit touches a pinned core module. Its ticket amends `A4`, keeps every other
    `src/engine.test.ts` pin unedited, and reruns the identity sweep (`A3`).
  - The `build` gate now emits `dist/` (D8).
- **For BA/PM's plan (a suggestion, not a ticket cut):** the engine edit fits its own XS ticket ahead of
  the session ticket, because it is a core module with its own pins. The build line and `bin` fit with
  the entry-point ticket (`ABC-168`). `ABC-169` (licence) enters v1, gated by Q12.
- **NFRs** (the catalog is **not** edited by this proposal; Security/NFR places rows at acceptance):
  - `NFR-004` binds the UCI entry point unchanged, held by the existing clamp. D12 only shortens.
  - `NFR-005` (depth in budget at the default level): the edit adds one comparison per 1024 nodes and
    one per iteration. The cost is believed negligible, `UNKNOWN - verify`. The engine ticket re-reads
    `NFR-005` on its existing protocol.
  - `NFR-006` is unchanged (the same book file).
  - `NFR-009` is unchanged (no `Hash` option, so the table stays fixed).
  - `NFR-001` is unchanged (move generation is not touched).
  - `NFR-002`, `NFR-003` and `NFR-007` do not apply to `uci.ts`.
  - `NFR-008`: one new default-lane file plus rows in `engine.test.ts`. Spawns run only in the opt-in
    lane.
  - **Candidate rows for Security/NFR:**
    - (i) idle responsiveness: `uci` to `uciok` and `isready` to `readyok` within a bound, the book
      load included;
    - (ii) time safety: 0 forfeits in a `cutechess-cli` run at a stated time control;
    - (iii) stdout hygiene: every byte written is a UCI line.
- **Known weaknesses, stated:**
  - A GUI that pings during a search waits up to one budget (D5).
  - Game-history repetitions are invisible to the search (D6).
  - Analysis is capped at 5 s per `go` (Q3), and by the level's budget.
  - At levels 1 and 2, `depth`/`nodes`/`mate` are ignored and no score is sent (D11).
  - A book move ignores the `go` limits (D10).
  - `go mate N` is a depth approximation (D12).
  - `dist/` relies on the clone's `data/` beside it for the book (D8).
  - With the book off, or out of book at levels 3–5, the engine plays deterministically
    (`ADR-0027` d1).
- **Docs owed at build time:** `npm run uci` and the new `npm run build` meaning in `AGENTS.md`
  § Commands (the Scribe), and `memory-bank/30-architecture.md`.
- **Distribution is unchanged** (`ADR-0018`): a clone, built locally. Publishing, or a single executable,
  is that ADR's revisit trigger, and neither is decided here.

## Rollback

- **Before acceptance:** mark this ADR `rejected`. Nothing else exists.
- **After build:**
  - Delete `src/uci.ts`, `src/uci-session.ts`, their tests, `tsconfig.build.json`, and the `uci` and
    `bin` lines. Restore `"build": "tsc --noEmit"`.
  - Revert D12's two fields and the `A4` amendment. That is safe because no other caller passes them.
  - Restore `EPIC-004`'s non-goal sentence on the owner's word.
  - The licence is a separate decision, and is not rolled back with the engine.

## Owner questions

### Answered on 2026-10-18 (the Orchestrator's note `…a41c7e02`)

| # | question | answer | where it landed |
|---|---|---|---|
| Q1 | Accept UCI (lift the UCI half of `EPIC-004`'s non-goal)? | yes (recommended) | D1 |
| Q2 | What is it for first? | humans in his UI (recommended) | the scope of D3–D12 |
| Q3 | Keep the 5 s ceiling for UCI? | keep it (recommended) | D4, D5 |
| Q4 | Book under UCI? | **on in v1** | D10 |
| Q5 | Strength control? | **in v1** | D11 |
| Q6 | Honour `go depth` / `nodes`? | **implement them** | D12 |
| Q7 | How does the web project get the engine? | **its own backend spawns the CLI. This repo must be buildable** | D8 |
| Q8 | Licence? | **GNU GPL v3** | D13 |
| Q9 | `id name` / `id author`? | **`skytalix`**, author unchanged | D3, D13 |
| Q10 | Who installs `cutechess-cli` and En Croissant? | he does | D9 |
| Q11 | Is v1 done without a web UI? | yes | D9 |

### New, raised by this revision (kept to two)

- **Q12. The licence's scope** (it blocks `ABC-169`, not the engine work).
  - **(a)** `src/evaluate.ts`'s value and piece-square tables match Michniewski's Simplified Evaluation
    Function. The Chess Programming Wiki publishes that under CC BY-SA 3.0, which Creative Commons
    lists no non-CC licence as compatible with. Do you **treat the tables as uncopyrightable numbers and
    add a credit** (recommended, as KISS; your legal call), or have them **replaced by our own values**?
    Replacing them re-tunes the engine and moves the evaluation, puzzle and level pins.
  - **(b)** The grugops kit's files in `tools/grugops/` would fall under a repo-wide `LICENSE`. May
    they, or should `LICENSE` exclude them? Their own licence is `UNKNOWN - verify`.
  - **(c)** `GPL-3.0-or-later` (as read), or `GPL-3.0-only`?
- **Q13. The rename.** Rename the npm package `cli-chess`, the repository and the terminal game to
  `skytalix`, or keep `skytalix` as the engine's UCI name and `bin` only? **Recommended: keep the rest
  as is for v1.** A rename touches `AGENTS.md`, `ADR-0018`'s clone instructions and every `npm run chess`
  reference, and buys the engine nothing.
