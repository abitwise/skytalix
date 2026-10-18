# ADR-0044: The engine speaks UCI through a second entry point, `node src/uci.ts`, over the unchanged core

## Status

**proposed** — 2026-10-18 by Architect/Design (task `wave-2026-09-25`, subtask `arch-engine-research`).
**Owner acceptance owed.** Nothing is built because of this ADR, and no ticket may enter `Ready` on it
until the owner accepts it.

- **The ask.** The owner's word of 2026-10-18 (note
  `.grugops/context/wave-2026-09-25/notes/20261018T073030Z-orchestrator-decision-owner-word-chess-engine-conversion-research-only-5b37b0bc.md`):
  research how to turn this program into a chess engine that a chess UI can drive. A web UI may follow
  as a separate project. Research and design only, no development. **KISS is his explicit constraint.**
- **It reverses one standing sentence, and only on his word.** `plans/epics/EPIC-004-engine-and-ai-opponent.md`
  § Out of scope reads: *"UCI protocol support or driving an external engine such as Stockfish —
  permanent non-goal; this is a self-contained engine."* If the owner accepts this ADR, the **UCI half** of
  that sentence is lifted. The "driving an external engine" half stays a non-goal: this design makes the
  engine *drivable*, and it never drives Stockfish. Rewriting the epic is BA/PM's job (`bapm-engine-plan`),
  not this ADR's.
- **Evidence** is in the shared context, not restated here:
  - standards research with primary-source URLs — `.grugops/context/arch-engine-research/notes/20261018T074200Z-architect-design-observation-chess-engine-standards-read-on-the-primary-sources-3f1a9c20.md`;
  - repo-fit map (what we have, what is missing) — `…/20261018T074300Z-architect-design-observation-repo-fit-map-what-uci-needs-against-what-src-has-7b2e4d18.md`;
  - this hop's decision, its fences, and the owner questions — `…/20261018T074400Z-architect-design-decision-adr-0044-proposed-uci-v1-shape-and-the-owner-questions-c5d07e91.md`.

## Context

**The standard is UCI.** The *Universal Chess Interface* (Huber and Meyer-Kahlen, 2000; text of the April
2006 version) is a line protocol over stdin and stdout. The GUI holds the game. The engine is stateless
between commands, apart from the position it was last given. The research note shows that UCI is what
every target we care about speaks:

- desktop GUIs and the engine-testing tool `cutechess-cli` (`proto=[uci | xboard]`);
- Stockfish.js in a browser Web Worker (*"speaks UCI … over `postMessage`"*);
- the Lichess external-engine reference provider (it sends `uci`, `isready`, `position fen … moves …`,
  `go movetime|depth|nodes`, `stop`);
- `lichess-bot` (*"UCI, XBoard, and Homemade engines"*).

CECP (xboard) is the older alternative. It is stateful: the engine plays a side, and there is a force
mode, `level`/`st`/`sd`, `time`/`otim` and feature negotiation.

**Most of what UCI needs already exists** (the repo-fit note has the map):

| UCI needs | the repo has |
|---|---|
| `position fen …` | `parseFen` / `FenError` (`src/fen.ts`) |
| `… moves e2e4 e7e8q e1g1` | `parseCoordinateMove` (`src/coordinate-move.ts`); the grammar is UCI long algebraic, castling is king-to-square, and the parser selects from `legalMoves` |
| make the moves | `makeMove` (`src/apply.ts`) |
| a move within a time budget | `chooseMove(position, { budgetMs, now })` (`src/engine.ts`), which returns `move`, `score`, `depth`, `nodes`, `elapsedMs` |
| `bestmove e2e4` out | `squareName` (`src/position.ts`); `src/book.ts` already has a private `uciOf` |
| `score mate N` | `MATE_SCORE` (`src/search.ts`), `MATE_FLOOR` (`src/transposition.ts`) |
| correctness standard | perft, pinned to the Chess Programming Wiki counts (`src/perft.test.ts`: startpos 20…4 865 609, Kiwipete 48…4 085 603) |

**What is missing is small and lives in one place.** There is no protocol loop. There is no rule that turns
a GUI clock into a budget. There is no `info` line, and no way to read `stop` while `chooseMove` holds the
thread. `chooseMove` is synchronous.

**Rulings this design must respect:**

- **`ADR-0011`.** Clause 1: every non-test `.ts` under `src/` is a production module. Clause 3: the
  importers of `src/history.ts` must equal the licence set `{ turn-loop.ts, cli.ts }`. Clause 4: an entry
  point exports nothing. Trigger `R3` fires on the first `.ts` file in a subdirectory of `src/`.
- **`ADR-0016`.** Whoever acquires stdout owns its `EPIPE` arm. Exit codes stay `0` / `1` / `70`.
- **`ADR-0036`.** Clause (b1) fires on a production diff that adds `process.` or a Node builtin import.
- **`ADR-0002` clause 3.** The search reads only the position, not the game history.
- **`ABC-078` `A4` and `ADR-0027` decision 3.** The engine takes no depth argument, and there is no new
  `EngineOptions` field.
- **`ADR-0024` decision 7, coding rule 7.** No engine option in production.
- **`NFR-004`.** The 5 s hard ceiling holds at any difficulty, enforced by the clamp in `src/engine.ts`.
- **`NFR-008`.** The `N8-LANE` and `N8-SPAWN` accounts. `N8-SPAWN` has a balance of 0 ms.
- **`ADR-0007` and `ADR-0018`.** The product runs locally, from a clone. Nothing is published.

## Decision

### D1. One protocol: UCI (2006 text). No CECP.

### D2. Shape: two new flat files, and the core is not edited

- **`src/uci.ts`, the entry point** (`ADR-0011` clause 4: it exports nothing). It is the only module that
  acquires `process.stdin` and `process.stdout` in this mode.
  - It reads lines with `node:readline` and passes each one to the session.
  - It installs the one stdout `EPIPE` arm before anything is written (`ADR-0016` clauses 3–4). On
    `EPIPE` the session ends at exit `0`.
  - Exit codes: `0` on `quit` or end of input. `1` if any command-line argument is given (it takes none).
    `70` on an exception, which is the `cli.ts` shape.
- **`src/uci-session.ts`, the protocol.** It has no capabilities: no `process`, no Node builtin, no
  real-clock read of its own.
  - Its shape is `createUciSession({ write, choose }) → { handleLine(line): "continue" | "quit" }`.
    `write` takes one output line. `choose` is `chooseMove` bound to its clock, so the tests inject a
    virtual one (`ADR-0027`).
  - It holds the current position and, while `go infinite` waits for `stop`, the held `bestmove`.
  - It is the `cli.ts` / `cli-options.ts` split again: the entry point is composition only, and
    everything that can be unit-tested lives here.
- **Imports allowed:**
  - `fen.ts`, `coordinate-move.ts`, `apply.ts`, `engine.ts`, `position.ts`, `search.ts` (for
    `MATE_SCORE`), and `transposition.ts` (for `MATE_FLOOR`), or that constant re-derived.
  - **Not** `history.ts` and **not** `turn-loop.ts`. So `ADR-0011` clause 3's licence set does not move,
    and no `GameHistory` is built.
  - **Not** `book-file.ts`, so the session reaches no `fs` (D9).
- **No edit** to `engine.ts`, `search.ts`, `levels.ts`, `book*.ts`, `turn-loop.ts`, `cli.ts`, `fen.ts`,
  `moves.ts`, `legal.ts`, `apply.ts` or `coordinate-move.ts`. **`npm run chess` is byte-identical.**
- One `package.json` script line: `"uci": "node src/uci.ts"`. A GUI is pointed at `node <clone>/src/uci.ts`.

### D3. The v1 command set (the minimum a GUI needs)

| GUI → engine | engine does |
|---|---|
| `uci` | `id name <name>`, `id author <author>`, `uciok`. **No `option` lines.** |
| `isready` | `readyok` |
| `ucinewgame` | sets the position back to the start (the table is already cleared per search, `ADR-0025`) |
| `position startpos \| fen <6 fields> [moves m1 m2 …]` | parse it, then apply the moves through `parseCoordinateMove` and `makeMove`. If the FEN or any move is bad, the **whole command is refused**: no position is held, and one `info string` line names the fault (text filtered to printable characters, the `cli.ts` `printableOf` rule) |
| `go [movetime x] [wtime x btime x winc x binc x movestogo x] [infinite] [depth/nodes/mate/searchmoves/ponder …]` | budget as in D4. Search. Write one `info` line, then `bestmove` |
| `stop` | if a held `bestmove` is waiting (`infinite`), write it. Otherwise ignore |
| `ponderhit` | the same as `stop` in v1. No `Ponder` option is offered, so a GUI should not send it |
| `quit` | end: exit `0`, without `process.exit` (the `ADR-0016` precedent) |
| `debug`, `register`, `setoption …`, anything unknown | ignored. The spec says *"if the engine or the GUI receives an unknown command or token it should just ignore it"*. This covers the options Lichess's provider sets unconditionally (`UCI_AnalyseMode`, `UCI_Chess960`, `Threads`, `Hash`, `MultiPV`) |

**Output, exactly:**

- `info depth <D> score cp <S> nodes <N> time <T> nps <X> pv <move>`, or `score mate <±M>` where
  `|score| ≥ MATE_FLOOR`. Then `M = ceil((MATE_SCORE − |score|) / 2)`, and it is negative when the engine
  is being mated. The UCI scoring rule is *"mate in y moves, not plies"*.
- `bestmove <move>`. `bestmove 0000` when no position is held or the position has no legal move. The spec
  sends a null move as `0000`, and *"for every `go` command a `bestmove` command is needed"*.
- Nothing else is ever written on stdout. Diagnostics are `info string` lines.

### D4. Time management: one rule, in the session

- `movetime x` gives `x`.
- Otherwise, if the side to move has a clock `t` (with increment `i`, default 0, and `movestogo m`):
  `max(1, min(t / (m ?? 20) + i / 2, t − 50))`. The Chess Programming Wiki's *"base / 20 + increment / 2"*
  plus a 50 ms move overhead. The tuning belongs to the ticket and is measured, not argued here.
- `infinite` or `ponder` gives `HARD_CEILING_MS`, and the `bestmove` is **held** until `stop`. The spec
  says *"Do not exit the search without being told so in this mode"*. The engine may stop thinking
  early. It may not answer early.
- Neither (a bare `go`, or only `depth`/`nodes`/`mate`) gives `DEFAULT_BUDGET_MS`. v1 parses those limits
  and **does not honour them**, and says so once in `info string`.
- **The engine clamps every budget at `HARD_CEILING_MS`** (`NFR-004` clause B, unchanged).

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
`NODES_PER_CLOCK_CHECK` nodes, so **this needs no change to `src/engine.ts`**. Build it only when one of
these triggers fires:

- the owner lifts the 5 s ceiling for UCI (Q3);
- pondering is wanted;
- a target GUI is shown to time out on `isready` or `stop`.

### D6. Not in v1, each with what would bring it in

| left out | brought in by |
|---|---|
| UCI options: `Hash`, `Threads`, `MultiPV`, `Ponder`, `OwnBook`, `Skill Level`, `UCI_LimitStrength` / `UCI_Elo`, `UCI_Chess960` | the owner's word per option (Q4, Q5). `ADR-0024` d7 and rule 7 forbid an unrequested engine option |
| honouring `depth` / `nodes` / `mate` / `searchmoves` | Q6. It would need an optional depth cap on `EngineOptions`, which amends `ABC-078` `A4` and `ADR-0027` d3 |
| `info` per iteration, `currmove`, `seldepth`, a pv longer than one move | needs a per-iteration hook in `src/engine.ts` (a GUI shows the final line only in v1) |
| the opening book, difficulty levels | Q4, Q5 |
| game-history repetition seen by the search | an `ADR-0002` clause 3 amendment. Today's terminal game has the same gap |
| Chess960, CECP, `go perft`, any server, bundler or WASM build in this repo | rejected below, or belongs to the web project |

### D7. The terminal UI is unchanged

`npm run chess`, `src/cli.ts` and the frame path (`ADR-0029`) are untouched. Both entry points compose the
same core.

### D8. How a UI reaches it

- **Any desktop UCI GUI, or `cutechess-cli`,** launches `node <clone>/src/uci.ts` as a child process. This
  stays inside `ADR-0007` and `ADR-0018`: local, from a clone.
- **A separate web UI** (another project, **out of scope here**) speaks the same UCI text by one of two
  routes:
  - **(a) Bridge.** A small server in the web project spawns `node src/uci.ts` and relays lines over a
    WebSocket. The engine runs on a server, which is a deploy decision of that project.
  - **(b) In-browser.** The web project bundles the core plus `uci-session.ts` into a Web Worker. Lines go
    over `postMessage` (the Stockfish.js pattern), and blocking the worker's thread never blocks the page.
    There is no server.
- **This repo's only obligation for either route is D2's:** `uci-session.ts` stays capability-free, so
  route (b) needs no fork. The route is the web project's to choose. The recommendation to it is (b) for a
  single-user UI and (a) only if the engine must not ship to the client.

### D9. Tests (shape only; the ticket writes them)

- **Default lane:** one new file, `src/uci-session.test.ts`. It drives `handleLine` with strings and an
  injected `choose` or virtual clock. It spawns nothing (the `N8-SPAWN` balance stays at 0 ms) and adds one
  file to the per-file floor (`NFR-008`).
- **Opt-in real-child lane** (the `ABC-119` precedent): one scripted dialogue against `node src/uci.ts`,
  under an env flag; unset means NOT DEFINED.
- **Acceptance outside vitest:** a `cutechess-cli` match, `proto=uci`, N games at a short time control,
  with 0 illegal moves, 0 time forfeits and 0 disconnects. That `cutechess-cli` is installed on this host
  is `UNKNOWN - verify`. Perft stays the move-generator standard and already holds.

## Alternatives

| # | option | why it is rejected |
|---|---|---|
| 1 | **CECP / xboard instead of UCI** | The engine would have to hold the game state, the side it plays, force mode, `level`/`st`/`sd`, `time`/`otim` and feature negotiation (*"feature done=1"*), with SIGINT legacy (*"this grungy feature"*). Every target in Context speaks UCI, and the testers (`cutechess-cli`, `lichess-bot`) take either, so UCI loses nothing and is less state |
| 2 | **Both protocols** | Twice the surface for no named user |
| 3 | **A `--uci` flag on `src/cli.ts`** | It mixes a protocol into the frame-path entry point. It edits `cli-options.ts`'s `ACCEPTED_ARGUMENTS`, the `cli.test.ts` pins and `AGENTS.md`'s guarded Dev/run slot. A second entry point is a local change, and this is not |
| 4 | **The engine as an HTTP/WebSocket server in this repo** | It adds a network capability (`ADR-0036` (b1)) and a deploy posture this project does not have (`ADR-0007`). stdio is the standard. A bridge belongs to the web project (D8a) |
| 5 | **A worker thread in v1** | It buys an immediate `readyok` and `stop`, but costs a second thread, message passing and its error paths. Under the 5 s ceiling the latency it saves is at most 5 s. Deferred with triggers (D5) |
| 6 | **A yielding or async search** (`setImmediate` every N nodes) | It edits the recursion in `engine.ts`, which is identity-swept against `search.ts`, slows the search and breaks `ABC-078` pins |
| 7 | **Reuse `EngineSeam` / `history.ts`** (`newGame` / `playMove`) | It adds an importer of `history.ts`, which amends `ADR-0011` clause 3's licence set and its guard. It buys repetition counts the search does not read (`ADR-0002` clause 3) |
| 8 | **Reuse `src/line-input.ts`** | It writes the `"> "` prompt to stdout, which breaks the protocol. It routes lines to the human command table. Its `MAX_LINE_LENGTH` of 1024 is shorter than a `position startpos moves …` line after about 200 plies |
| 9 | **Honour `go depth` in v1** | Through a new `maxDepth`, it amends `A4` and `ADR-0027` d3. Through `search(position, depth)`, the search cannot be aborted and is not bounded by the ceiling (`NFR-004` B). Left to the owner (Q6) |
| 10 | **Ship the book, or levels as options, in v1** | That is a product choice, and production engine options are fenced by `ADR-0024` d7. Left to the owner (Q4, Q5) |
| 11 | **A WASM or bundled build inside this repo** | It adds a toolchain to a no-bundler stack (`AGENTS.md` § Stack) for a consumer that lives elsewhere (D8b) |

## Consequences

- **Census.**
  - Two new production modules (`ADR-0011` clause 1).
  - `src/uci.ts` is the third entry point, after `perft-bench.ts` and `cli.ts` (clause 4), and is never on
    the frame path.
  - Neither file imports `history.ts`, so the clause 3 licence set is unchanged.
  - Both files are flat in `src/`, so `R3` does not fire.
- **Gates.** The ticket that builds `src/uci.ts` fires `ADR-0036` (b1) (`process.`, `node:readline`) and
  routes through `In Security/NFR`. `uci-session.ts` must carry no limb, and that is a review check.
- **NFRs** (the catalog is **not** edited by this proposal; Security/NFR places rows at acceptance):
  - `NFR-004` binds the UCI entry point unchanged, held by the existing clamp.
  - `NFR-009` is unchanged (no `Hash` option, so the table stays fixed).
  - `NFR-001` and `NFR-005` are unchanged (the core is untouched).
  - `NFR-002`, `NFR-003` and `NFR-007` do not apply to `uci.ts`.
  - `NFR-008`: one default-lane file. Spawns run only in the opt-in lane.
  - **Candidate rows for Security/NFR:**
    - (i) idle responsiveness: `uci` to `uciok` and `isready` to `readyok` within a bound;
    - (ii) time safety: 0 forfeits in a `cutechess-cli` run at a stated time control;
    - (iii) stdout hygiene: every byte written is a UCI line.
- **Known weaknesses, stated:**
  - A GUI that pings during a search waits up to one budget (D5).
  - Game-history repetitions are invisible to the search (D6).
  - Analysis is capped at 5 s per `go` (Q3).
  - `go depth`/`nodes` are ignored (Q6).
  - The engine plays deterministically (`ADR-0027` d1) with the book off, so every game from the same
    position goes the same way (Q4).
- **Docs owed at build time:** an `npm run uci` line in `AGENTS.md` § Commands (the Scribe), and
  `memory-bank/30-architecture.md`.
- **Distribution is unchanged** (`ADR-0018`). A GUI that insists on a single executable is that ADR's
  revisit trigger ("a binary"). It is not decided here.

## Rollback

- **Before acceptance:** mark this ADR `rejected`. Nothing else exists.
- **After build:** delete `src/uci.ts`, `src/uci-session.ts`, their tests and the `"uci"` script line. The
  core was not edited, so nothing else reverts. Restore `EPIC-004`'s non-goal sentence on the owner's word.

## Owner questions (only he can answer)

- **Q1.** Accept UCI as the engine protocol, which lifts the UCI half of `EPIC-004`'s "permanent non-goal"?
  Yes or no.
- **Q2.** What is the engine *for* first? Playing humans in your web UI, analysis, engine-vs-engine
  testing, or a Lichess bot? This decides Q3–Q6.
- **Q3.** The 5 s per-move ceiling (`NFR-004`): keep it for UCI (v1 as designed), or lift it for UCI? Lifting
  it brings in the D5 worker and an `NFR-004` re-scope.
- **Q4.** The opening book under UCI: off (v1, the recommendation), always on, or an `OwnBook` option?
- **Q5.** Strength control under UCI: none (v1), `Skill Level` 1–5 mapped to `LEVELS`, or
  `UCI_LimitStrength` / `UCI_Elo`? The last needs Elo numbers this project has never claimed.
- **Q6.** Must v1 honour `go depth` / `nodes`? Lichess's external-engine provider sends them.
- **Q7.** How should the web project get this engine: a git submodule, a copy, or a package? A package is
  `ADR-0018`'s revisit trigger and `EPIC-006`'s.
- **Q8.** Licence. This repo has none (all rights reserved). `chessground` is GPL-3.0 and Stockfish.js is
  GPL-3.0. Before code is shared between two projects you need to pick one.
