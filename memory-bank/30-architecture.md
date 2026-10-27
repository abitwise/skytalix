# Architecture
_As-built: 2026-10-27, by Architect/Design (task `arch-repass-30-architecture`, `EPIC-008` close step 2, Orchestrator `orch-2026-10-27m`). **Full re-pass against `main` `c383f8f0`.** Every module, boundary, count and data-flow line below was re-read from `src/` and `package.json` on that commit. `ABC-208`'s null move is in; `ABC-207`, `ABC-209` and `ABC-210` are not. The 2026-10-26 snapshot notice is retired, and every earlier dated correction is folded into the body. § Change log at the end has one dated line per edit. Records only: nothing was run, built or timed._
_Previously: 2026-10-26 snapshot notice and dated corrections (`arch-records-arch-snapshot`, `arch-records-arch-page`, `arch-adr0050-in-force`); 2026-09-19 (`ABC-075`, the `zobrist.ts` row); 2026-08-12 rewrite to as-built (`arch-audit-2026-08-12`); 2026-08-06 (deployment posture); 2026-07-29 (as-built after `EPIC-001`). The earlier text is in git history._

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  Architecture, system patterns, and tech context: the shape of the system and the decisions
  that hold it together. Ships EMPTY — fill per-project during bootstrap. Record the why of a
  structural choice as an ADR in 50-decisions/, not here. Keep it short.
-->

## System context

**One local process. Two programs over one rules-and-engine core, plus a perft harness.**

- `npm run chess` runs `src/cli.ts`: a single-player terminal chess game against the engine (`ABC-042`).
- `npm run uci` runs `src/uci.ts`: the engine as `skytalix`, speaking UCI on stdin and stdout (`ABC-168`, `ADR-0044`).
- `npm run perft` runs `src/perft-bench.ts`: the perft counts and a nodes/s reading (`ABC-006`).

No network, no database, no service boundary. **Zero runtime dependencies:** `package.json` has no
`dependencies` key. It is `private`, with no `main` and no `exports`. Its one `bin` is `skytalix` →
`dist/uci.js` (`ADR-0044` D8). Nothing is published (`ADR-0049`).

Two data paths sit outside `src/`. The opening book `data/opening-book/book.json` is read at run time
(`ADR-0037`). A finished game is written as PGN under `games/` (`ADR-0047`). `src/puzzle-suite.baseline.json`
is test data.

**No barrel.** No `src/` module re-exports another (0 `export … from`); a consumer imports a file by path.
**Three entry points**, each with zero exports and a `main()` call at module scope (`ADR-0011` clause 4):
`cli.ts`, `uci.ts` and `perft-bench.ts`.

Delivery state is the board's (`plans/board.md`). At this re-pass `EPIC-001`…`EPIC-005` and `EPIC-007`
are done; `EPIC-006` and `EPIC-008` are open.

## Key components

**46 production modules, flat in `src/`.** A production module is every `.ts` under `src/` that is not a
`.test.ts` (`ADR-0011` clause 1, "no exclusions"). That one expression is pinned whole in
`src/history-pane.nfr.test.ts` (`productionModulesIn`). `src/` has one subdirectory, `__snapshots__`,
which holds two `.snap` files and no `.ts`.

**Production module is not the same as loaded by an entry.** The three entries load 42 of the 46 at run
time (`chess` 38, `uci` 18, `perft` 7). Five core modules are in all three closures. Four modules are loaded
by no entry:

- three TEST-ONLY corpora, by their own headers: `evaluate.mirror-corpus.ts`, `puzzle-corpus.ts`, `search.mate-corpus.ts`;
- `virtual-clock.ts`, deterministic mode's clock for harnesses and tests (`ADR-0027` decisions 3–4).

**Ruling, `virtual-clock.ts` (close item `…cdc1fb61`): it IS a production module, and it is NOT loaded by
any entry.** The count is 46 production modules, of which 42 are loaded by an entry. "42 or 43 of 46"
mixed those two questions.

- Production module: `ADR-0011` clause 1 names no exclusion, and `ADR-0027` decision 4 says it "ships as one small production module".
- Not loaded: no other module imports it. Its one import (`Clock` from `engine.ts`) is `import type`, erased at run time.
- Its importers are six test files. Its own rows live in `src/engine.test.ts` (`ADR-0027` decision 4).

Level = longest import path, type-only edges included (the 2026-08-12 convention). Loaded by = the entries
whose run-time closure holds the module. Fan-in = importers among the other 45 modules, written as on
paper / at run time.

| L | Module | Loaded by | Fan-in | Owns |
|---|---|---|---|---|
| 1 | `position.ts` | all three | 23 / 18 | the 0x88 board (`ADR-0001`), piece encoding, square geometry and naming. The hub |
| 1 | `book-file.ts` | chess, uci | 2 / 2 | `readBookFile`: the book's bytes for the probe's injected `read`. A capability holder (`node:fs`, `ADR-0036` limb 1) |
| 1 | `line-reader.ts` | chess | 2 / 2 | `lineReaderOf`: one reader per source, shared by the startup questions and the prompt (`ABC-200`) |
| 1 | `puzzle-corpus.ts` | none | 0 / 0 | TEST-ONLY data: `ABC-084`'s puzzle suite and `ABC-079`'s 24 do-not-hang rows |
| 1 | `search.mate-corpus.ts` | none | 0 / 0 | TEST-ONLY data, frozen: `ABC-121`'s mate-rich corpus (`ADR-0026` decision 9) |
| 2 | `moves.ts` | all three | 21 / 7 | pseudo-legal move generation, the `Move` flags and `isSquareAttackedBy` |
| 2 | `evaluate.ts` | chess, uci | 2 / 2 | static evaluation: material, piece-square tables, pawn structure, king safety, and mobility at one weight |
| 2 | `render.ts` | chess | 4 / 1 | `renderBoard`: the board frame as a VALUE, either glyph mode, either orientation. Writes nothing |
| 3 | `apply.ts` | all three | 15 / 14 | `makeMove` / `unmakeMove` and `makeNullMove` / `unmakeNullMove` (`ABC-208`, `ADR-0050`). The only module that changes an existing `Position` |
| 3 | `fen.ts` | all three | 8 / 8 | FEN parse and serialise; a fault is named by a typed `FenError`. `parseFen` is the boundary; `parseFenGrammarOnly` is for rules-core tests (`ADR-0033`) |
| 3 | `frame.ts` | chess | 2 / 2 | `assembleFrame` (a constant-height VALUE) and `beginFrameSession` (the writer, strategy chosen once). Imports one type only (`ADR-0011`) |
| 3 | `glyph-mode.ts` | chess | 2 / 1 | the glyph precedence rule, and the session that reads `isTTY` and `env` exactly once. The only non-entry module that reads `process` |
| 3 | `transposition.ts` | chess, uci | 3 / 3 | the fixed-size transposition table, cleared per search (`ADR-0025`, decision 4 as written) |
| 4 | `legal.ts` | all three | 15 / 15 | `legalMoves`, `isInCheck`, `hasLegalMove`, `legalCaptures`, `givesCheck`, `hasLegalEnPassant`: make, test, unmake (`ADR-0003`) |
| 4 | `zobrist.ts` | chess, uci | 5 / 5 | the 64-bit `bigint` key: `zobristKey` (full scan), `zobristKeyAfterMove` (`ADR-0020`), `zobristKeyAfterNullMove` (`ADR-0050`). A pure read; it imports `apply.ts` for types only |
| 4 | `cli-options.ts` | chess | 3 / 2 | the argv resolver: options, or a usage error naming the fault (`ABC-042`). Pure apart from the `random` colour's coin |
| 5 | `gameend.ts` | chess, uci | 6 / 4 | `gameStatus`: checkmate, stalemate, 50/75-move, repetition, insufficient material; `leafEndReason` for the search |
| 5 | `quiescence.ts` | chess, uci | 2 / 2 | capture-only quiescence, most-valuable-victim first (`ADR-0024`); no checks in quiescence (`ADR-0024` decision 4) |
| 5 | `book.ts` | chess, uci | 5 / 2 | the opening-book probe: position in, a book move or nothing out. Data and randomness are injected (`ADR-0037`) |
| 5 | `coordinate-move.ts` | chess, uci | 3 / 3 | coordinate input (`e2e4`, `e7e8q`) resolved against the legal move list |
| 5 | `san.ts` | chess | 7 / 7 | `toSan` and `parseSan`: one grammar, both directions (`ADR-0004`) |
| 5 | `perft.ts` | perft | 1 / 1 | perft node counts and per-first-move divide (`RISK-001`) |
| 5 | `startup-questions.ts` | chess | 1 / 1 | on a terminal, asks for an absent colour, then an absent difficulty (`ABC-200`) |
| 5 | `evaluate.mirror-corpus.ts` | none | 0 / 0 | TEST-ONLY: the evaluation suites' mirror corpus and its helpers, `clonePosition` and `mirrorPosition` |
| 6 | `search.ts` | chess, uci | 3 / 3 | negamax alpha-beta: PVS, LMR, null move, killers, the table, quiescence at the leaf; the test-only off doors (`ADR-0026`, `ADR-0050`) |
| 6 | `history.ts` | chess | 9 / 2 | `GameHistory`: the move list is the authority (`ADR-0002`); undo, keys and repetition counts derived by replay |
| 6 | `rejection.ts` | chess | 1 / 1 | the closed reason set for an illegal move, computed from the generator (`ABC-034`) |
| 6 | `perft-bench.ts` | perft | 0 / 0 | entry point, `npm run perft` |
| 7 | `turn-loop.ts` | chess | 10 / 1 | ply dispatch over three injected seams and a `FrameSink`. Publishes `RenderSeam`, `InputSeam` and `EngineSeam`. Owns no I/O |
| 7 | `status-panel.ts` | chess | 1 / 1 | the status panel rows as a VALUE. `status` is a parameter; the check marker is its own `isInCheck` read |
| 7 | `history-pane.ts` | chess | 1 / 1 | the bounded two-column SAN pane, constant height and width. Returns rows, writes nothing |
| 8 | `engine.ts` | chess, uci | 3 / 2 | iterative deepening on an injected `Clock` (default `Date.now`), the per-move budget and `HARD_CEILING_MS`; `createEngine` gives an `EngineSeam` |
| 8 | `book-engine.ts` | chess | 1 / 1 | `withBook`: the book as a decorator of `EngineSeam` (`ADR-0012` clause 2) |
| 8 | `render-seam.ts` | chess | 1 / 1 | the render seam: board, status panel and history pane into `assembleFrame`. The frame path's one composition root (`ADR-0029`) |
| 8 | `move-input.ts` | chess | 2 / 1 | one input line, two grammars (coordinate and SAN), no mode switch (`ABC-033`) |
| 8 | `result-screen.ts` | chess | 2 / 2 | the end-of-game screen (`ABC-044`) |
| 9 | `levels.ts` | chess, uci | 2 / 2 | difficulty levels as data (budget and blunder rate), `createLevel` and the seeded generator (`ADR-0032`, `ADR-0045`) |
| 9 | `command-input.ts` | chess | 1 / 1 | the command table, classified ahead of move input (`ABC-035`) |
| 9 | `pgn.ts` | chess | 2 / 2 | a finished game as PGN text. Pure: no I/O and no clock (`ADR-0047` D1) |
| 9 | `virtual-clock.ts` | none | 0 / 0 | deterministic mode's clock for harnesses and tests (`ADR-0027` decisions 3–4) |
| 10 | `uci-session.ts` | uci | 1 / 1 | the UCI protocol as a pure module, lines in and lines out. Capability-free: `write`, `now`, `random` and the book are injected (`ADR-0044` D2) |
| 10 | `level-seam.ts` | chess | 1 / 1 | a difficulty level as the turn loop's `EngineSeam` (`ABC-101`) |
| 10 | `line-input.ts` | chess | 1 / 1 | the production `InputSeam`: read one line, dispatch it, answer the loop (`ABC-037`) |
| 10 | `pgn-file.ts` | chess | 1 / 1 | writes one game's PGN under `games/` by exclusive create. A capability holder (`node:fs`, `ADR-0047`, `ADR-0036` limb 1) |
| 11 | `cli.ts` | chess | 0 / 0 | entry point, `npm run chess`: the program's composition root. Binds argv, stdin, stdout, stderr, the clock, randomness, the book file and the PGN writer |
| 11 | `uci.ts` | uci | 0 / 0 | entry point, `npm run uci` and `skytalix`. Binds stdin through `node:readline`, stdout, `Date.now`, `Math.random` and the book file |

**Test files: 61 `*.test.ts`, not one per module.** Seven modules carry a `*.nfr.test.ts` sibling:
`gameend`, `glyph-mode`, `history-pane`, `san`, `status-panel`, `turn-loop` and `zobrist`. `search.ts` has
six files, `moves.ts` and `san.ts` five each. Eleven modules have no test file named after them, among
them the three corpora, `virtual-clock.ts` and `position.ts`. `ladder.test.ts` and
`puzzle-suite.test.ts` are named after no module. The opt-in deep lanes and their switches are in `AGENTS.md`.

## System patterns

- **Layered acyclic dependencies, measured from `src/*.ts` at `c383f8f0`.** **46 modules, 175 import
  edges, ZERO cycles, depth 11.** The measuring script reproduced the 2026-08-12 figures (17, 49, 12 type-only, depth 8)
  on that commit before it was run here.
  - Five modules import nothing: `position.ts`, `book-file.ts`, `line-reader.ts` and two corpora.
  - `position.ts` is the hub (fan-in 23 of the other 45), then `moves.ts` (21), `apply.ts` and `legal.ts` (15 each).
  - Seven modules have no importer: the three entries, `virtual-clock.ts` and the three corpora.
- **48 of the 175 edges are type-only and are ERASED at run time.** Under `verbatimModuleSyntax` an
  `import type` compiles to nothing. The run-time graph has 127 edges and depth 10. The distinction is
  load-bearing:
  - `moves.ts` drops from 21 importers to 7: most importers want the `Move` type only.
  - `render.ts` has four importers on paper and one at run time, `render-seam.ts`.
  - `turn-loop.ts` has ten importers on paper and one at run time, `cli.ts`. The rest import seam types.
  - `history.ts` has nine importers on paper and two at run time, `turn-loop.ts` and `cli.ts`. That pair is
    exactly `LICENSED_DRIVERS` in `src/history-pane.nfr.test.ts` (`ADR-0002` clause 4, `ADR-0011` clause 3).
  - A guard that read the text instead of the loads would get these wrong. That is why `NFR-002`'s probe
    observes module loads in a child process (`ADR-0029`, `ADR-0030`).
- **Composition by injection, from two roots.** `cli.ts` is the program's composition root: it binds every
  capability and builds the three seams. `render-seam.ts` is the frame path's one declared composition root
  (`ADR-0029`, superseding `ADR-0011` clause 2 in part). `frame.ts` imports one type and composes nothing
  itself.
- **The capability boundary is short and named.** Three modules import a `node:` builtin: `book-file.ts`
  and `pgn-file.ts` (`node:fs`, capability holders, `ADR-0036`) and `uci.ts` (`node:readline`). In code,
  `process` is read by the three entries and by `glyph-mode.ts` (`isTTY`, `env`) only. `engine.ts` and
  `levels.ts` fall back to `Date.now` when no clock is injected. `cli-options.ts` reads `Math.random` for
  the `random` colour only. `uci-session.ts` holds no capability (`ADR-0044` D2).
- **Mutable `Position`, make/unmake, never copy.** `makeMove` changes the 128-byte board in place and
  returns an `UndoRecord` the **caller** owns; `unmakeMove` reverses it. The null move pair works the same
  way (`NullUndo`, `ADR-0050`). `fen.ts` fills only the fresh `Position` it returns. **No clone function is
  on any entry's load path.** The one clone function is `clonePosition` in the TEST-ONLY
  `evaluate.mirror-corpus.ts`. A `Position` is a live object, never a snapshot.
- **Transient mutation behind pure-looking queries.** `legalMoves`, `gameStatus`, `perft` and `toSan`
  play moves and take them back, returning the position as they found it. `zobristKey`,
  `zobristKeyAfterMove` and `zobristKeyAfterNullMove` write nothing: the en-passant component keys on
  `epSquare` being set (`ADR-0020`). No production module imports `worker_threads`, so no parallel search
  exists; `ADR-0005` `F6`'s foreclosure stays discharged (`ADR-0020`).
- **The renderers replay; they never rewind the caller.** `history-pane.ts` and `status-panel.ts` call
  `parseFen` and `makeMove` on **their own fresh position** built from the anchor, never on the caller's.
- **The core owns a position, not a game.** `gameStatus(position, positionCounts?)` takes repetition counts
  as an optional map. `history.ts` supplies it through `gameStatusOf` (`ADR-0002` clause 4). The search
  keeps its own per-ply key array, `KEY_ARRAY_CAPACITY` 128 (`ADR-0002` clause 3, `ADR-0020` decision 3).
- **The loop owns no I/O.** `turn-loop.ts` takes its `FrameSink` and its render, input and engine seams as
  options. It names `process.stdout` only in a doc comment, and it never reads stdin.
- **A value-changing search heuristic ships behind a test-only off door pair and a bounded oracle**
  (`ADR-0026` decision 10). The `…Without…` exports of `search.ts` and `engine.ts` are those doors. What is
  in force on `main`:
  - **In force:** PVS and LMR (`ADR-0026`); the null move (`ADR-0050`, from merge `b5c67ab7`, `ABC-208`).
  - **`ADR-0024` decision 4 stands:** no checks in quiescence (`src/quiescence.ts:21-24`). A leaf in check
    goes to `quiesce`.
  - **`ADR-0025` decision 4 stands as written:** `engine.ts` and `search.ts` call `clearTable()` at the start
    of each search. Its game-lived amendment is accepted, not in force (`ABC-209` dropped).
  - **`ADR-0051` is accepted, not in force:** `search.ts` and `engine.ts` hold no check extension (`ABC-210` dropped).
  - **`ABC-207` is not merged:** `evaluate.ts` keeps one `MOBILITY_WEIGHT`.

## Data flow

**`npm run chess` (`src/cli.ts`).** Exit 0 for a normal session, 1 for a refused command line, 70 for an internal error.

1. `resolveOptions(argv)` (`cli-options.ts`) gives options, or a usage line and exit 1.
2. On a terminal, `askAbsentOptions` (`startup-questions.ts`, over `line-reader.ts`) asks for an absent flag.
3. `beginGlyphModeSession` reads the terminal once. `newGame(START_FEN)` (`history.ts`) starts the game.
4. `createBookProbe` (`book.ts`) gets `readBookFile`, a `warn` line writer and `Math.random`.
5. `runTurnLoop` (`turn-loop.ts`) gets the history, the human's colour, the three seams and stdout as its `FrameSink`.
   - **Render seam** (`makeRenderSeam`): `renderBoard`, `renderStatusPanel` and `renderHistory` go into
     `assembleFrame`; the book supplies the opening name (`ADR-0043`). `beginFrameSession` writes frames.
   - **Input seam** (`createLineInputSeam` over stdin): `command-input.ts` takes a command; otherwise
     `move-input.ts` tries `coordinate-move.ts`, then `san.ts`. `rejection.ts` names why a move is illegal.
   - **Engine seam** (`withBook(book, createLevelSeam(…))`): a book hit plays the book move. Otherwise
     `levels.ts` drives `engine.ts`, and `search.ts` uses `quiescence.ts`, `transposition.ts`, `evaluate.ts`
     and `gameend.ts`.
   - Each move is played into the history by `playMove`.
6. `renderResultScreen` writes the end screen. `formatPgn` (`pgn.ts`) and `writePgnFile` (`pgn-file.ts`)
   save the game under `games/`.

**`npm run uci` / `skytalix` (`src/uci.ts`).** Exit 0 on `quit` or end of input, 1 on any argument, 70 on an
exception. `node:readline` hands each stdin line to `createUciSession(…).handleLine` (`uci-session.ts`). The
session calls `levels.ts`, `engine.ts` and `search.ts`, and answers through the injected `write` to stdout.

**`npm run perft` (`src/perft-bench.ts`).** `fen.ts` and `perft.ts` only; it prints counts and a nodes/s figure.

## Tech context

TypeScript on Node >= 22.18 (`package.json` `engines.node`, `ABC-216`; `ADR-0044`), ESM. Node type-strips
`.ts` directly, so there is no bundler. Intra-repo imports carry explicit `.ts` extensions
(`allowImportingTsExtensions`, `verbatimModuleSyntax`).

- `npm run typecheck` is `tsc --noEmit` over the whole tree.
- `npm run build` is `tsc -p tsconfig.build.json`. It compiles `src/uci.ts` and its closure to `dist/`
  (`rewriteRelativeImportExtensions`; `ADR-0044` D8). `dist/` is git-ignored.
- Vitest `~4.1.11` with the module runner off, and Biome for lint and format. `vitest.config.ts`
  (`ABC-026`) sets `pool: "threads"` and pins `maxWorkers: 2` (`ABC-144`, `ADR-0040` addendum 2).
  Isolation stays on.
- `spike/perft-bench.ts` (`npm run spike:perft`) is `ABC-008`'s throwaway harness and is not production.
- Commands and their receipts live in `AGENTS.md` and `memory-bank/90-agents-md-command-log.md`.

**The default test lane has a ratified budget, `NFR-008`**, and the catalog row in `plans/nfr-catalog.md` is
its one statement (`ADR-0008`, `ADR-0019`, `ADR-0035`, `ADR-0046`). Per `ADR-0008`, cost is driven by test
file count, not test count, so file count is charged to the floor account, owner Architect/Design. Not
re-measured here.

## Deployment posture — deploys nowhere, runs locally

**Present posture, explicitly revisitable. Revisit trigger: `EPIC-006` (packaging).** Owner's
instruction, 2026-08-06: *"this project currently does not deploy anywhere, mark that as well, it
will be used locally for now."*

Nothing is deployed, published or released, and there is no deploy target of any kind. **Every
bullet below was RE-VERIFIED at `c383f8f0`, 2026-10-27, by reading files only:**

- **No deploy artifact.** No Dockerfile, compose file, chart, manifest or IaC, and no tracked YAML file.
- **No CI, so no CI deploy step.** `.github/` holds one file (`copilot-instructions.md`), and there is
  no `.github/workflows/`.
- **Runnable locally, publishable nowhere.** `npm run chess`, `npm run uci` and `npm run perft` run from a
  checkout. `npm run build` emits `dist/uci.js` locally for the `skytalix` `bin`. `package.json` stays
  `private`, with no `main`, `exports` or `start` script.
- **One git remote; the source is public.** The owner added the remote on 2026-10-23. Pushing is the
  owner's (`ADR-0049`).
- **Nothing released.** `plans/releases/` holds only `.gitkeep`.

The config says this rather than implying a cluster: `default_stack.deploy` is `none-local-only`
and `environments` is `["local"]`.

**What this does NOT mean.** `production_requires_human_confirmation` stays `true`; the release and
incident machinery stays; the never-deploy limit in every role stays. *"We have no production"* is a
fact about today, and those are rails for the day it changes. A rail costs nothing while unused.
**Distribution:** `git clone` + `npm install` + `npm run chess`, "for now", on the owner's word
(`ADR-0018`, superseding `ADR-0007` clause 5 only).

Why, and the alternatives weighed (including why `environments` is `["local"]` and not `[]`):
**`50-decisions/ADR-0007`**. Operations, which here means nothing to operate, deploy or roll back:
`70-runbook.md`.

## Change log

One dated line per edit of the 2026-10-27 re-pass (`arch-repass-30-architecture`, at `main` `c383f8f0`):

- 2026-10-27, header: the 2026-10-26 snapshot notice is retired. The page is as-built at `c383f8f0`, and the older `_Updated_` lines are condensed into one "Previously" line.
- 2026-10-27, § System context: rewritten as-built. It folds the 2026-10-26 corrections on `bin`, "two epics are built" and "no entry module". It names the three programs, the two data paths and the three entries.
- 2026-10-27, § Key components, count: "Seventeen production modules" and its 2026-10-26 correction become 46 (`ADR-0011` clause 1), with 42 loaded by an entry.
- 2026-10-27, § Key components, ruling: `virtual-clock.ts` is a production module, loaded by no entry. Close item `…cdc1fb61` is settled.
- 2026-10-27, § Key components, table: rebuilt from 17 rows to 46, with new Loaded-by and Fan-in columns.
- 2026-10-27, `apply.ts` row: the 2026-10-26 null-move correction (`ABC-208`, `ADR-0050`) is folded in. The "only writer" claim is narrowed to "changes an existing `Position`": `fen.ts` fills the fresh one it returns.
- 2026-10-27, `zobrist.ts` row: the 2026-09-19 and 2026-10-26 corrections are folded in. The depth that was `UNKNOWN - verify` is measured: level 4 (3 at run time). It no longer imports `legal.ts`.
- 2026-10-27, test files: 28 becomes 61, with seven `*.nfr.test.ts` siblings.
- 2026-10-27, § System patterns, graph: 17 / 49 / 12 type-only / depth 8 becomes 46 / 175 / 48 / depth 11 (run time 127, depth 10). The hub, leaf and zero-importer lines are re-measured.
- 2026-10-27, § System patterns, importers: "`render.ts` has zero importers at run time" becomes one (`render-seam.ts`). "`turn-loop.ts` is the single run-time importer of `history.ts`" becomes `turn-loop.ts` and `cli.ts` (`LICENSED_DRIVERS`).
- 2026-10-27, § System patterns, injection: "Nothing in `src/` imports a renderer" is replaced by the two composition roots (`cli.ts`; `render-seam.ts`, `ADR-0029`).
- 2026-10-27, § System patterns, clone: "No clone function exists" is corrected. `clonePosition` exists, only in the TEST-ONLY `evaluate.mirror-corpus.ts`.
- 2026-10-27, § System patterns, parallel search: "whether `EPIC-004` ever wants a parallel shape is `UNKNOWN - verify`" becomes "no production module imports `worker_threads`".
- 2026-10-27, § System patterns, new bullets: the capability boundary, and the search heuristics' state on `main`. `ADR-0024` d4 stands, `ADR-0025` d4 stands as written, `ADR-0050` is in force, `ADR-0051` is accepted but not in force, and `ABC-207` is not merged.
- 2026-10-27, § Data flow: new section, one path per entry, read from `cli.ts` and `uci.ts`.
- 2026-10-27, § Tech context: the 2026-10-26 corrections on Node >= 22.18, `vitest.config.ts` and `npm run build` are folded in. The `NFR-008` figures are replaced by a pointer to its catalog row, which has been amended since.
- 2026-10-27, § Deployment posture: re-verified at `c383f8f0`. The 2026-10-24 remote correction and the 2026-10-26 entry-and-`bin` correction are folded in. The "UNDECIDED … [DECIDED `ADR-0018`]" distribution sentence is replaced by the decision.
