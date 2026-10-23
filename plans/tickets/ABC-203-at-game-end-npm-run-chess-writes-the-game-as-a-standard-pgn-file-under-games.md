---
id: ABC-203
title: "At game end, `npm run chess` writes the game as a standard PGN file under `games/` (EPIC-006, PGN export)"
status: in-review
column: In Review
size: M
priority: P1
epic: EPIC-006
feature: —
---

# ABC-203: at game end, write the game as a PGN file the owner can open in an analysis tool

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-pgn-export`, records only, at `main` `f4eec73d`). The ruling is in
> `.grugops/context/bapm-cut-pgn-export/notes/`. This hop ran no test and took no timing. It ran one read-only npm
> probe in the scratchpad (below). Every cost on this page is an estimate.
>
> **Source.** On 2026-10-23 the owner moved PGN export from `EPIC-006` § Negotiable slice into scope: *"Yes record PGN
> file export as a feature, since it allows to analyze games."* The Orchestrator's transcription is
> `.grugops/context/owner-word-2026-10-23/notes/20261023T194500Z-orchestrator-decision-715b9cbf.md`, item 1. The play-test
> log's game 1 row says *"PGN wanted = y"*. Save/resume is unaffected and still waits on the play-test.
>
> **Shape reference.** `plans/uat/EPIC-006-game-1.pgn` was made by hand from game 1's printed move list. `A7` pins this
> ticket's output against it.

## Problem

- **User:** the owner, as a player who wants to study his games after they end.
- **Pain:** the CLI prints the full move list on the result screen and then exits. Nothing is kept. To analyse game 1,
  the owner pasted the screen into the session and the Orchestrator turned it into PGN by hand, replaying 70 plies to
  check them. That has to happen again for every game.
- **Value:** every finished game is already a `.pgn` file when the process exits, and the screen says where. The owner
  opens it in any analysis tool (Stockfish GUIs, lichess import, etc.) with no transcription step.

## Scope

1. **When a file is written. It happens automatically, with no command and no flag.** Exactly one file is written
   when the turn loop returns a non-null `reason`. That covers the eight chess outcomes (`resignation` included) and
   the two engine faults. It is written after the result screen.
2. **When no file is written.** A confirmed `quit`, end of input (at a move prompt or at a startup question), a
   usage error, or an internal error (exit `70`). On these paths the product behaves byte for byte as it does at
   base. **The ruling:** `resign` ends the game with a record, and `quit` leaves without one. An unfinished game
   gets kept by save/resume, which still waits on the play-test. EOF is also the scripted path: every piped test and
   the `ABC-201` reading end that way.
3. **Where.** The file goes in the directory `games` under the process's working directory, which is created if it is
   absent. Under `npm run chess` that directory is the clone root, because npm runs a script from the package root
   whatever directory it is invoked from. This was checked with npm 11.20.0: a script invoked from a subdirectory
   printed the package root as its working directory. `.gitignore` gains `games/`, so a played game leaves
   `git status` clean.
4. **File name.** `skytalix-YYYYMMDD-HHMMSS.pgn` is built from local time at one clock reading taken when the game
   starts, just before the loop starts. The `Date` tag comes from the same reading. The name is ASCII only and has no
   `:`.
5. **Never overwrite.** If the name exists, the file is written as `…-2.pgn`, then `-3`, and so on up to `-99`. A file
   that already exists is never modified. If all 99 names are taken, that counts as a write failure (row 7).
6. **Content.** It is a single-game PGN in export shape:
   - **Ten tag pairs, in this order:**
     - the Seven Tag Roster (`Event`, `Site`, `Date`, `Round`, `White`, `Black`, `Result`);
     - `Termination`;
     - two custom tags, `Difficulty` and `HumanColour`.
   - Then one empty line, then the movetext, then a final LF.
   - **Movetext:**
     - SAN from `src/san.ts` `toSan`, with check and mate suffixes;
     - `N.` before each White move;
     - one closing comment holding the result screen's headline;
     - the result token.

   The table in `A4` and `A5` fixes every value.
7. **When the file can't be written.** The game is not affected. The result screen is written in full and unchanged.
   stderr gets exactly one line, `PGN not saved: <CODE>`, where `<CODE>` is the error's errno code. The exit code is
   unchanged (`0`) and no partial file is left behind. The human asked to play a game, and that game was played. The
   save is a service the human did not request, and its failure is reported, not hidden.
8. **On success,** stdout gets exactly one more line after the result screen: `PGN saved: games/<file name>`.

## Out of scope

- A `pgn` or `save` command, a `--pgn` / `--no-pgn` / `--pgn-dir` flag, an environment variable that moves the
  directory, or a startup question about saving. None of them is needed for the owner's use. Each one would widen the
  argv or grammar surface, or the path surface.
- Writing on `quit`, end of input, `new` (a `new` discards the plies before it: the file holds only the game that
  reached an outcome), a usage error or an internal error.
- Save/resume or loading a PGN (`EPIC-006` § Negotiable slice: still waits on the play-test).
- Engine evaluations, clock tags, annotations other than the closing comment, `SetUp`/`FEN` tags (the CLI only starts
  from the standard position), and more than one game per file.
- The UCI entry point (`src/uci.ts`, `EPIC-007`). It writes no file.
- Reading the OS user name or host name for `White`/`Black`/`Site`.
- Any change to `src/turn-loop.ts` or to `renderResultScreen`'s rows (see `A14`).

## Acceptance criteria

`A1`–`A12` run in the default lane, in memory or in a `mkdtemp` directory. `A13` is a QE hand reading on the host.

- **`A1` (the eight outcomes write one file each).** **Given** a session whose loop returns each of the eight
  chess outcomes in turn, **when** the session ends, **then** exactly 1 file is created per session. `Result` and
  `Termination` are:

  | `LoopOutcome.result` | `Result` tag and token | `Termination` |
  |---|---|---|
  | `white-wins` | `1-0` | `normal` |
  | `black-wins` | `0-1` | `normal` |
  | `draw` | `1/2-1/2` | `normal` |

  `resignation` follows its `result` (the side that did not resign wins).
- **`A2` (a fault writes a file and gives no result).** **Given** `engine-failure`, and separately `engine-threw`,
  **then** exactly 1 file is created, with `Result "*"`, `Termination "unterminated"` and the result token `*`.
- **`A3` (no file on the other paths).** **Given** each of the following, **then** 0 files are created, `games/` is not
  created, and stdout, stderr and the exit code are byte-identical to base for the same input:
  - a confirmed `quit` after ≥ 1 ply each;
  - end of input after ≥ 1 ply each;
  - end of input at a startup question;
  - a usage error;
  - an internal error.
- **`A4` (the tag section).** **Then** the file opens with exactly 10 tag lines, in this order, each in the form
  `[Name "value"]`:
  `Event "skytalix CLI game"`, `Site "?"`, `Date "YYYY.MM.DD"` (local date of the game-start reading), `Round "-"`,
  `White`, `Black`, `Result`, `Termination`, `Difficulty "N"` (the resolved level, `1`–`5`), and `HumanColour "white"`
  or `"black"`.
  - The human's side is named `Human`. The engine's side is named `skytalix (difficulty N)`.
  - With `--colour random`, the tag shows the colour the coin resolved.
  - There is no `SetUp` and no `FEN` tag.
  - The tag section is followed by exactly one empty line.
- **`A5` (the movetext).** **Then:**
  - **Order:** move number, White SAN, Black SAN, repeating, in play order. `N.` is written directly before each White
    move, and `N` is the position's `fullmoveNumber`.
  - **Tail:** after the last move comes one comment `{<headline>}`. `<headline>` is the result screen's headline rows
    joined with one space: `Black wins by checkmate.`, or a fault's two lines. Then comes the result token, equal to
    the `Result` tag.
  - **Spacing:** words are separated by single spaces. A line wraps before a word that would take it past
    **79 characters**, and no word is split.
  - **Bytes:** the file ends with exactly one LF. It uses LF only. Every byte is `0x20`–`0x7E` or LF.
- **`A6` (round trip).** **Given** a game of ≥ 40 plies that includes both castlings, an en passant capture, a
  promotion, a check and a mate, **when** the movetext's SAN words are replayed with `parseSan` from the start
  position (move numbers, the comment and the result removed), **then**:
  - every word resolves to exactly one legal move;
  - the replayed moves equal `history.moves`, element by element;
  - `toFen` of the final position equals `toFen(history.position)`.
- **`A7` (the shape reference).** **Given** game 1's 70 plies replayed from `plans/uat/EPIC-006-game-1.pgn`, with
  outcome `black-wins` / `checkmate`, difficulty `5`, human `black` and a clock fixed at 2026-10-23, **then:**
  - the movetext matches the sample's movetext byte for byte, with whitespace normalised and the comment removed;
  - the comment is `{Black wins by checkmate.}`;
  - the tags are `White "skytalix (difficulty 5)"`, `Black "Human"`, `Result "0-1"`, `Termination "normal"`,
    `Difficulty "5"`, `HumanColour "black"` and `Date "2026.10.23"`.
- **`A8` (where, and the name).** **Given** a working directory with no `games/`, **when** a game ends by an
  outcome, **then** `games/` exists and holds exactly one new file named `skytalix-YYYYMMDD-HHMMSS.pgn`, taken from
  the game-start reading in local time. The repository `.gitignore` holds a `games/` line, and after one game played in
  a clone, `git status --porcelain` prints 0 lines.
- **`A9` (never overwrite).** **Given** `games/skytalix-<stamp>.pgn` already exists, and separately both it and
  `…-2.pgn` exist, **then** the new game is written to `…-2.pgn` (or `…-3.pgn`). Every pre-existing file has
  unchanged bytes and an unchanged mtime. **Given** all 99 names exist, **then** `A10`'s failure path runs with code
  `EEXIST`.
- **`A10` (the file cannot be written).** **Given** `games` is a regular file, and separately a `games/` directory
  with mode `0555` (run as non-root), **then**:
  - 0 new files are created;
  - the result screen's stdout bytes are identical to a successful run's, and no `PGN saved:` line is written;
  - stderr holds exactly one line, matching `^PGN not saved: E[A-Z0-9]+$`, and no stack trace;
  - the exit code is `0`.
- **`A11` (the saved line).** **Given** a successful write, **then** stdout equals base's stdout for the same game
  plus exactly one final line, `PGN saved: games/<name>`. stderr is byte-identical to base.
- **`A12` (written once, after the game).** **Then** the PGN write runs 0 times before the turn loop returns and
  exactly 1 time after it. The game start takes one clock reading and does no filesystem work before the first board
  (`NFR-007`, `NFR-002` untouched).
- **`A13` (QE hand reading on the host).** QE plays one game to a finish with `npm run chess` in a clone. QE then
  loads the written file into an independent PGN reader and records 0 parse errors and the same final position as the
  screen. The reader may be `cutechess-cli` 1.5.1's `-openings file=<f> format=pgn`, already on the host from
  `ABC-202`, or another reader available there; the exact tool is `UNKNOWN - verify` and is pinned on the first run.
  The raw output is kept under the QE task's context.
- **`A14` (nothing else moved).** The following are unchanged:
  - `package.json` (0 new dependencies, `bin` and `scripts` as they are);
  - `src/uci.ts`;
  - `src/turn-loop.ts`;
  - `renderResultScreen`'s returned rows for every `LoopOutcome`.

  The ticket may edit existing spawned-child pins only where a child reaches an outcome, and only to expect `A11`'s
  line.

## NFR triggers

- **Security: the CLI's first file write.** The process has only read files so far (`src/book-file.ts`).
  - **`ADR-0036` (b1) is expected to fire** on limb 1 (a production `node:fs` import that writes). **(b2) is expected
    to fire** too, because `src/cli.ts` gains a value import edge to a module that holds a limb. **A Security/NFR hop
    is owed.**
  - **Path surface (ASVS L1, V12 file handling).** No argv, environment or typed byte reaches the path: 0
    user-controlled bytes. The directory name is fixed and the file name is generated by the product.
  - **Overwrite and errors.** The write is an exclusive create, so it never overwrites and never follows a symlink at
    the last path component. A pre-existing `games` symlink to a directory is followed; Security/NFR rules whether that
    is acceptable. stderr carries only the errno code.
  - **Measurable targets:**
    - 0 pre-existing files modified across `A9`'s cases;
    - 0 non-ASCII or control bytes in the file (`A5`);
    - 0 stack-trace lines on stderr (`A10`).
- **`ADR-0007` / `ADR-0018`** (local-only posture, `git clone` + `npm run chess`): unaffected. The file is local and
  inside the clone, and the channel does not change.
- **The write's cost.** Building the PGN and writing it adds **≤ 50 ms wall, max of 5 runs**, for a 300-ply history
  on the reference host (Apple M3). It runs once, after the result screen. QE takes one reading; it is not a new
  catalog row unless Security/NFR places one.
- **`NFR-007`** (< 2 s to the first board): the bar is unchanged. `A12` keeps all filesystem work after the game.
- **`NFR-002`** (< 16 ms redraw): unchanged. Nothing runs per ply.
- **`NFR-008`** (`npm test` wall ≤ 10 s at load1 ≤ 8): +1 default-lane test file expected. The target is 0 new spawns
  (`N8-SPAWN` unchanged). The estimate is ≤ 0.05 s of wall; it is not a reading. Security/NFR rules whether an
  `N8-LANE` reading is owed.
  - **The tree must stay clean under `npm test`.** Existing children that reach an outcome run with the tree root as
    their working directory (`src/cli.real-engine.test.ts` header; `src/cli.test.ts` `resigns`). Under row 3 they would
    write into `<root>/games/`. Design question 2 owns this.

## Test notes

1. Put the PGN text in a pure function that the tests import and that does no I/O. Drive it with a constructed
   `GameHistory` and `LoopOutcome`, as `src/result-screen.test.ts` does. `A1`, `A2` and `A4`–`A7` need no file.
2. Test the writer in a fresh `mkdtemp` directory that is removed by its exact path. `A8`–`A10` create files there and
   nowhere else.
3. Fix the time zone (for example `TZ=UTC` in the test, or an injected clock) so the name and `Date` are
   deterministic.
4. `A7` reads `plans/uat/EPIC-006-game-1.pgn`. The hand-made sample is the oracle; it is not rewritten to match the
   output.
5. Red-first plants for QE:
   - **P1:** write on a confirmed `quit`, which reds `A3`.
   - **P2:** open with `w` instead of an exclusive create, which reds `A9`.
   - **P3:** drop the move number before a White move, or put one before a Black move, which reds `A5` and `A7`.
   - **P4:** wrap at 80 or more, which reds `A5`.
   - **P5:** give `*` for a fault the wrong `Termination`, or a result token unequal to the tag, which reds `A2` and
     `A5`.
   - **P6:** write before the loop returns, which reds `A12`.
   - **P7:** echo the error's message instead of its code, which reds `A10`.
6. UAT: the diff has production lines, so the waiver does not apply. QE's verdict against `A1`–`A14` signs UAT under
   the owner's delegation (`…5aaf7cec`, item 2). The owner's real check is opening a file in his own tool. If he does,
   the Orchestrator records it in `plans/uat/EPIC-006-play-test-log.md`.

## Size and priority

- **Size `M` (3).** The work is:
  - a pure formatter of about 80 lines;
  - a small writer of about 40 lines: directory create, exclusive create, the suffix loop and errno reporting;
  - about 15 lines of wiring in `src/cli.ts`, plus the clock reading and the two output lines;
  - one `.gitignore` line;
  - 1 test file, plus pin edits where a spawned child reaches an outcome.

  It also needs an Architect/Design ruling first, then QE and Security/NFR. Splitting the formatter from the writer was
  considered and refused: a formatter alone puts no file in the owner's hands, so it has no value alone.
- **Priority `P1`.** It is the owner's explicit current ask, and the play-test is running now. Every game played before
  this lands needs an Orchestrator transcription to be analysed, as game 1 did. Nothing is broken, and a workaround
  exists (transcription), so it is not `P0`.

## Dependencies

- **Done and merged:**
  - `ABC-044`: the result screen and its headline;
  - `ABC-045`: `resign`;
  - `ABC-046`: `quit`;
  - `ABC-101` and `ABC-200`: difficulty, colour and the questions;
  - `src/san.ts`: `toSan` and `parseSan`.
- **Architect/Design ruling first (In Design).** Questions for the ruling:
  1. **Module shape.** Options are a pure formatter plus a writer that holds the `node:fs` limb (as
     `src/book-file.ts` does for reads) plus the wiring. The formatter should import `history.ts` as a type only, as
     `src/result-screen.ts` does, so `ADR-0002` clause 4's licence equality holds. It must also settle how the
     headline reaches the comment: export it from `result-screen.ts`, or read it off `renderResultScreen`'s rows.
  2. **Keeping the tree clean under `npm test`.** Existing children reach an outcome with the tree root as their
     working directory, and row 3 would make them write `<root>/games/`. Options are to move those children to a
     neutral `mkdtemp` working directory (the `ABC-162` precedent) or to use another seam. No argv or environment
     value may reach the production path, which is the `src/book-file.ts` precedent.
  3. **The clock seam** for the game-start reading.
  4. **Whether this needs an ADR** (for example, "the CLI writes game records under `./games` by exclusive create").
     A new ADR is fine. **If the shape reverses or changes an accepted ADR, STOP:** that goes to the owner under his
     delegation (`…5aaf7cec`, item 3). BA/PM sees none reversed: `ADR-0007`, `ADR-0018`, `ADR-0011` clause 4 (`cli.ts`
     still exports nothing) and `ADR-0036` (it fires as designed).
- **Merge order:** none forced. `arch-analyse-game-1` touches no `src/`.
- **Builder:** Software Engineer after the ruling, then QE (`A13`), then Security/NFR.

## Owner questions

None blocking. The `sign_off_acceptance` checkpoint is `notify`. Two product calls on this page are cheap to reverse
before the build if the owner wants it otherwise:
- **(a)** The file is written automatically into `games/` in the clone, not by a command or a flag. `git clean -fdx`
  deletes `games/`.
- **(b)** `quit` writes no file. `resign` keeps a record.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `f4eec73d`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the user (the owner, analysing his games), the pain (nothing is kept; game 1 was transcribed by hand), the value (a `.pgn` per finished game, path printed) |
| 2 | scope and out-of-scope clear | ✅ eight scope lines covering when, when not, where, name, overwrite, content, failure and the saved line; commands, flags, quit/EOF/`new`, save/resume, UCI and the loop fenced |
| 3 | INVEST-shaped | ✅ independent of open work; valuable alone; estimable; `M`; testable in memory plus `mkdtemp` and one hand reading |
| 4 | acceptance testable and measurable | ✅ file counts (1 and 0), 10 tags in order, result-token table, ≤ 79-character lines, ASCII bytes, round trip to an equal FEN, byte match to the game 1 sample, suffix `-2`…`-99`, 0 modified files, one stderr line by regex, exit `0`, 0 writes before the loop returns |
| 5 | dependencies known | ✅ merged tickets named; the Architect ruling with four questions and a named STOP |
| 6 | security/NFR triggers with a measurable target | ✅ `ADR-0036` (b1)/(b2) expected to fire, Security/NFR hop owed; 0 user-controlled path bytes; exclusive create; ≤ 50 ms write; `NFR-007`/`NFR-002` untouched by `A12`; `NFR-008` +1 file, 0 new spawns |
| 7 | test notes present | ✅ six, with seven plants |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P1`, argued |
| 10 | no major unresolved blocker | ✅ the design questions have an owner and a stop rule; no owner word is needed |

## Design ruling

**2026-10-23, Architect/Design** (subtask `arch-design-ABC-203`, branch `grugops/arch-design-ABC-203` from `main`
`06fabb18`). Records only: no `src/`, test, `package*.json` or `.gitignore` edit. The decision is
`memory-bank/50-decisions/ADR-0047-a-finished-game-is-written-under-games-by-exclusive-create-from-one-fs-holder-whose-path-only-a-date-reaches.md`
(**accepted**, new, reverses nothing). Notes: `.grugops/context/arch-design-ABC-203/notes/`. **The STOP did not
fire.** Scope, acceptance and test notes above are unchanged, except the one `A14` clarification in item 2.

### 1. Module shape

- **`src/pgn.ts` (new, pure).** It exports two functions.
  - `pgnStamp(startedAt: Date)` returns `{ stem, date }`: `skytalix-YYYYMMDD-HHMMSS` and `YYYY.MM.DD`. It uses the
    local getters (`getFullYear`, `getMonth() + 1`, `getDate`, `getHours`, `getMinutes`, `getSeconds`),
    zero-padded. It never calls `toISOString` (UTC), `toLocale*` or `Intl` (locale digits can be non-ASCII).
  - `formatPgn(outcome, history, game)` returns the whole file text. `game` is
    `{ startedAt, difficulty, humanColour }`. It is total over the ten non-null reasons. The caller gates on
    `outcome.reason !== null`, which is the same guard as the screen's zero rows.
  - It does its own replay: `parseFen(history.initialFen)`, then `toSan` before each `makeMove`, with `N.`
    from the replayed position's `fullmoveNumber`. It does not reuse the screen's move rows. PGN export format
    and the screen are two reasons to change, and `A6`/`A7` pin the PGN side.
  - `history.ts` and `turn-loop.ts` are `import type` only, as in `src/result-screen.ts`. `ADR-0002` clause 4's
    licence equality (`LICENSED_DRIVERS` in `src/history-pane.nfr.test.ts`) does not move.
- **The headline reaches the comment through an export.** `src/result-screen.ts` exports its existing `headline`
  function (under a name the SE picks, for example `resultHeadline`). `renderResultScreen` keeps calling it, so its
  rows do not change (`A14`). `pgn.ts` joins the returned rows with one space. Reading the rows back off
  `renderResultScreen` was refused, because it couples the record to the screen's leading blank row. The SE
  updates `result-screen.ts`'s header sentence "only `src/cli.ts` imports it": `pgn.ts` becomes a second
  importer. Neither is on the frame path, whose root is `render-seam.ts` (`ADR-0029`).
- **`src/pgn-file.ts` (new, the `node:fs` holder, `ADR-0036` limb 1).** Its whole contract, stated in its header
  as `book-file.ts` states its own:
  - one `node:fs` import, one export `writePgnFile(startedAt: Date, text: string)`, no `process.` reference,
    nothing written to stdout or stderr;
  - the name comes from `pgnStamp(startedAt).stem` inside the holder, so **only a `Date` reaches the path**;
  - `mkdirSync("games", { recursive: true })`, then each candidate opened with flag `"wx"`: the stem, then
    `-2` to `-99`. `EEXIST` moves on, and after `-99` the result is `EEXIST`;
  - all bytes written to the open descriptor (`writeFileSync(fd, text)`), then `closeSync`. If either fails,
    `unlinkSync` that one path (this call created it), then report;
  - it returns `{ ok: true, path: "games/<name>" } | { ok: false, code }`. Only an error whose `code` matches
    `^E[A-Z0-9]+$` becomes `{ ok: false, code }`. Any other throw is rethrown as a defect.
- **`src/cli.ts` wiring** (about 10 lines, inside the existing `try`):
  - `const startedAt = new Date();` once, directly before `runTurnLoop(` (item 3);
  - after the screen's write: `if (outcome.reason !== null)`, build the text, call the holder once, then write
    `PGN saved: <path>\n` on `sink`, or `PGN not saved: <code>\n` on `process.stderr`;
  - `difficulty` and `colour` are the values `resolution.options` already gives (`colour` is already resolved
    from `random`).
- **A throw from `pgn.ts` or a non-errno throw from the holder** reaches the one session `catch`. The process then
  prints `INTERNAL_ERROR` after the result screen and exits `70`. The SE keeps it that way: it is a defect, and
  `[D31]`'s rule already covers a defect. `A10` covers only errno failures.

### 2. Keeping the tree clean under `npm test`

- **The seam is the child's working directory.** The production path is the literal `games`, relative to the
  process working directory. No argv token and no environment value reaches it (`book-file.ts` precedent, and
  scope's out-of-scope list).
- **`src/cli.test.ts`.** Its one `spawnSync` site (`childOf`) runs every child that executes `ENTRY_POINT`
  directly, `/bin/sh` wrappers included, with a module-scope `mkdtemp` directory as `cwd`. An `afterAll` removes it
  with `rmSync` on the exact path `mkdtemp` returned. Both the entry point (`ENTRY_POINT`) and the hooks (`data:`
  URLs) are absolute, so nothing else in a child changes. `npmRun` keeps `REPOSITORY`, because npm resolves the
  package from its `cwd`. It ends by end of input (stdin `""`), so it writes nothing.
- **The guard (0 spawns).** One row asserts that no child whose `cwd` is `REPOSITORY` has `PGN saved:` or
  `PGN not saved:` on stdout or stderr. A second row asserts that the neutral directory's `games/` holds exactly as
  many files as there are children that printed `PGN saved:`. A future child that reaches an outcome from the
  repository reds the first row.
- **`N8-SPAWN` is unchanged.** No child is added. The children that reach an outcome (`mate`, `resigns`, the engine
  faults and any other) gain `A11`'s line in their pins. The line is matched by
  `^PGN saved: games/skytalix-\d{8}-\d{6}(-\d{1,2})?\.pgn$`, because several children share one directory and one
  second.
- **`src/cli.real-engine.test.ts` (opt-in `CLI_DEEP`).** Its children already run from a `mkdtemp` copy or the
  `ABC-162` neutral directory, and `games/` lands there and is removed with them. Any child left with the repository
  as `cwd` gets the same guard row. If one reaches an outcome, it moves to the neutral directory. The header's
  "every other child keeps its tree root as cwd" is updated to say so.
- **The writer's own tests** (`A8`–`A10`) cannot run in-process. The holder writes relative to the working
  directory, and the lane runs `pool: "threads"` (`vitest.config.ts`), where `process.chdir` throws
  `ERR_WORKER_UNSUPPORTED_OPERATION` (measured at this hop). The new test file therefore holds **one** spawned
  child. It is `node --input-type=module -e <script>` with a fresh `mkdtemp` directory as `cwd`, removed by exact
  path. The script imports the holder by absolute URL and runs every `A8`–`A10` case in its own subdirectory
  (the main thread may `chdir`). It prints one JSON line, and the test asserts on it. The child follows
  `src/cli.test.ts`'s discipline: argument array, no shell, empty environment, a `timeout`, a loud throw on
  `child.error`. Giving the holder a directory parameter for tests was refused: a caller path would reach the
  write (`ADR-0047` alternative 1).
- **`.gitignore` gains `games/`** (scope row 3). That is the backstop for a human's own games, not for tests.
- **`A14` clarification.** `A14` licenses pin edits "only where a child reaches an outcome". One more class must
  move, and this ruling licenses it: **source-reading rows on `src/cli.ts` that count what this ticket adds.** The
  known one is `A9`'s `process` census in `src/cli.test.ts` (about L1699–1734). It gains a fourth
  `process.stderr`, and `\bprocess\b` goes from 10 to 11, with a dated reason line in the form the row already uses.
  The source-order rows in `src/startup-questions.test.ts` (`A9`, the `askAbsentOptions(` ordering) stay green
  as they are. Any other red is a STOP for the SE, back to this role. BA/PM may fold this sentence into `A14`.

### 3. The clock seam

- **One reading, in the composition root.** `const startedAt = new Date();` appears exactly once in `src/cli.ts`.
  It comes after the questions and the book probe, and directly before `runTurnLoop(`. That is the precedent of
  `src/uci.ts`, which binds `Date.now` at its root. `cli.ts` imports no virtual clock (`ABC-086` `A5` (ii) stays
  green).
- **The `Date` is the seam.** The pure `pgnStamp` and the holder both take it as a parameter. Tests construct it
  with the local-time constructor, `new Date(2026, 9, 23, 14, 5, 9)`. Its local getters read back the same fields
  in any time zone, as measured under `TZ` +14 and −10. **No `TZ` setting is needed** (test note 3), provided a
  test avoids a daylight-saving gap hour.
- **`A12`'s check is a source-order row** of the form `startup-questions.test.ts` already uses. In `cli.ts`, the
  index of `new Date(` is above `runTurnLoop(`, and `writePgnFile(` and `formatPgn(` are below
  `renderResultScreen(`. Plant P6 reds it.
- **Known and accepted:** after `new`, the stamp is still the session's start, not the restarted game's. Scope
  row 4 says "when the game starts, just before the loop starts", and there is one loop per session. That reading
  is kept.

### 4. ADR

**Needed, and written: `ADR-0047`, accepted, new.** The CLI's first file write, its path rule, exclusive create,
errno-only reporting and the test working-directory rule are choices a maintainer would need the *why* for.
It **reverses nothing**: `ADR-0007`, `ADR-0018`, `ADR-0011` clause 4, `ADR-0002` clause 4, `ADR-0029`,
`ADR-0016` and `ADR-0021` do not move, and `ADR-0036` fires as designed. **The STOP did not fire.**

### What Security/NFR must check (the hop is owed, after QE)

1. **`ADR-0036` clause (b), on the delivered pair**, with the canonical instrument
   (`.grugops/context/design-F-072-1/probe/clause-b.mjs`):
   - limb 1 (b1) fires on `src/pgn-file.ts` (the import, and Ruling 2's whole holder file);
   - (b2) fires on `cli.ts -> pgn-file.ts`. `cli.ts -> pgn.ts` and `pgn.ts -> result-screen.ts` reach no holder;
   - limb 2 (b1) fires on `cli.ts`'s new `process.stderr`. Limb 3 stays silent.
2. **§ Decision 3 re-arms twice**: `pgn-file.ts` is the **sixth** holder (5 at `06fabb18`), and it is the first
   holder that exports a function taking a caller value that reaches a capability. Rule whether (b2) needs a
   call-graph reach. This role's input: **no**. The holder has one importer, and that edge already fires. A new call
   over it can pass another `Date` or other text, never a path byte.
3. **The `games` symbolic link.** Measured: a `games` link to a directory is followed, and the file lands in the
   target. A dangling `games` link gives `ENOENT`, and a link at the file name gives `EEXIST`. Rule whether to
   accept or refuse with `lstat`. This role's input: **accept, LOW**. Planting a link in the clone needs write access
   to the clone, which already runs code through `src/`. The create stays exclusive and the bytes are product-made.
4. **ASVS L1 V12 (file handling)**: 0 user-controlled path bytes (only a `Date` reaches the path), exclusive
   create, no partial file, stderr carrying only `^PGN not saved: E[A-Z0-9]+$`. Check that no message text and no
   stack can leak through D5's rethrow, which prints only `INTERNAL_ERROR`.
5. **NFRs:** the ≤ 50 ms write reading (QE takes it). `NFR-007` and `NFR-002` are unchanged by `A12`. `NFR-008`
   gains +1 file and **1** spawn (the writer's child, item 2), not the page's estimated 0. `N8-SPAWN` in
   `src/cli.test.ts` is unchanged. Rule whether an `N8-LANE` reading is owed. `plans/nfr-catalog.md` is not edited here (fence). Security/NFR places any row.

### Next move

**`In Design` → `Ready for Dev`**, then `In Development` with the Software Engineer on `ADR-0047` and items 1–3.
The SE runs the default lane before handing to QE (`A1`–`A13`, plants P1–P7). Then Security/NFR checks the five
items above. Merge order with `arch-analyse-game-1`: none forced.

## QE

**2026-10-24, QE/E2E** (subtask `qe-ABC-203`, branch `grugops/qe-ABC-203`, merge `8fa09e14` = build `5900d100` +
`main` `bcf9ce95`). Findings only: no `src/` edit. Notes: `.grugops/context/qe-ABC-203/notes/` (`…5b146b4b` per
criterion and plants, `…1f3c2e3d` owed readings, `…2f8e789e` gates and pin audit, `…f28588e1` verdict). Raw:
`.grugops/context/qe-ABC-203/raw/`.

**Verdict: `PASS_WITH_GAPS`.** `A1`–`A14` are all MET, and it signs UAT under the owner's delegation (`…5aaf7cec`, item 2).

| item | result |
|---|---|
| `A1`–`A12`, `A14` | MET. Lane rows re-read and re-run. Own base-vs-branch readings through the CLI: `A3` on 7 no-write paths (byte-identical, no `games/`), and `A11` on 4 outcome paths (base stdout + one saved line) |
| `A10` via the CLI | MET. A `games` file gives `EEXIST`, a `0555` `games/` gives `EACCES`, and 99 taken names give `EEXIST`. In each case: one stderr line, screen bytes equal to the success run's minus its saved line, exit `0`, 0 new files. Extra: a failed write after the open (`EFBIG`) also leaves no partial file |
| `A13` | MET. `npm run chess` in a clone, under a real pty: a 54-ply game ended by mate (`27...Qxd2#`), and `git status` was clean. **Readers pinned:** `cutechess-cli` 1.5.1 `-openings format=pgn` (0 warnings) and python-chess 1.11.2 (0 errors). Both give the screen's final position, `6k1/4ppbp/3p2p1/7P/2b1P3/Pr6/1r1q1PP1/3K3R w - - 0 28` |
| write time at 300 plies | **max 8.39 ms of 5 cold runs** (bar 50 ms). Apple M3, Node 26.11.1 |
| plants | P1, P2, P6 and P7 re-run and red. Extra X1 (no unlink) and X2 (exit 70 after a failed save) **pass the lane**: QE-203-b and -a |
| pin audit | process 10→11, `sink.write` 1→2 and `difficulty` 2→3 each add exactly one hit, the ticket's own line. **All in `A14`'s ruled class**, so no finding |
| gates | lint, typecheck and build 0. `npm test` 62 / 2038, `last-run.json` success. Skips 0, `No findings.` `CLI_DEEP` 11/11. Heap 128 / 400 |
| tree | clean. No `games/` in the worktree or in `main`'s checkout |

**Findings:**
- **QE-203-a LOW (gap):** no lane row pins `A10` at the CLI.
- **QE-203-b LOW (gap):** no lane row pins "no partial file".
- **QE-203-c LOW:** a double fault (the write fails, then the cleanup `unlinkSync` fails) escapes as exit `70` and leaves the file. Reproduced by fault injection, and it goes against `ADR-0047` D5. Routed to Security/NFR.
- **QE-203-d INFO:** the wrap can split `N.` from its move, and a comment can wrap across lines.
- **QE-203-e INFO:** a `games` regular file reads `EEXIST`, the same code as "99 taken".

**Next move:** `In Review` → `In Security/NFR`, with the ruling's five items plus QE-203-c.
