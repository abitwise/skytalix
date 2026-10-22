---
id: ABC-200
title: "On a terminal, `npm run chess` asks for colour and difficulty before the first board when their flags are absent (EPIC-006 G6)"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-006
feature: —
---

# ABC-200: the startup questions. On a terminal, with a flag absent, ask for it; Enter keeps today's default

> **Cut 2026-10-22 by BA/PM** (task `bapm-next-slice`, records only, at `main` `08d42d01`). The ruling is in
> `.grugops/context/bapm-next-slice/notes/`. This hop ran no test, took no timing and ran no probe. Every
> cost below is an estimate.
>
> **Source.** `EPIC-006` § Scope, first bullet: *"Startup: choose colour (white/black/random) and difficulty, via
> prompt or CLI flags."* `EPIC-006` acceptance 4 (*"Given `--colour black --difficulty 3` … then no prompts
> appear"*) presumes that prompts appear when the flags are absent. Gap `G6`
> (`.grugops/context/epic-to-tickets-EPIC-006-packaging/notes/20260816T065300Z-ba-pm-observation-e17a.md`, MEDIUM)
> recorded it on 2026-08-16. `ABC-101` § Out of scope left it to BA/PM at the next refinement.
> `memory-bank/60-progress.md` § Known UNCUT work, item 3, calls it cuttable today. It is in the epic's scope,
> so this cut adds no requirement.

## Problem

- **User:** a player who runs `npm run chess` without reading the usage line.
- **Pain:** that player always plays White against level 5. Level 5 is the strongest level and the default
  (`ADR-0045`, `src/cli-options.ts` `DEFAULT_DIFFICULTY`). Nothing on screen says that `--colour` or `--difficulty`
  exist. A beginner meets full strength and has no way to find level 1.
- **Value:** on a terminal, the game asks two short questions. A beginner can pick Black and level 1 without
  knowing a flag. Pressing Enter twice gives today's game, so nobody loses anything.

## Scope

1. **When the questions are asked.** Both `process.stdin` and `process.stdout` are TTYs, and the flag for that
   question is absent from the command line. Colour is asked first, then difficulty. Both come before the first
   frame.
2. **Colour answers.** `white`, `black` or `random`, the same words `--colour` takes. Case and surrounding spaces are
   ignored. An empty line means `white`, today's no-argument default. `random` is resolved by the same coin as
   `--colour random`.
3. **Difficulty answers.** `1` to `5`, the same values `--difficulty` takes, after trimming spaces. An empty line
   means `5` (`DEFAULT_DIFFICULTY`).
4. **A wrong answer.** One line names the accepted answers and echoes what was typed. The echo is filtered like the
   usage path's `printableOf` (C0 and `U+007F` dropped). Then the same question is asked again. A line over
   `MAX_LINE_LENGTH` (1 024) is a wrong answer.
5. **End of input at a question.** The process exits `0`. No frame and no result screen are written.
6. **Not a terminal.** When either stream is not a TTY, no question is asked, and the program behaves byte for byte
   as it does at base.
7. **Line ownership.** Lines typed ahead or pasted in one chunk are consumed in order. The questions take exactly
   the lines they need, and the game's first prompt reads the next one (the `ABC-037` `A2` property).

## Out of scope

- Any question in the UCI entry point (`src/uci.ts`, `EPIC-007`). UCI talks to programs.
- A changed default colour or level, a `--no-prompt` flag, remembering answers between runs, or a glyph-mode question.
- A change to the usage line, `ACCEPTED_ARGUMENTS`, the in-game `help`, or the move grammar.
- Raw mode, single-key answers, arrow keys or completion (`EPIC-003` § Out of scope).
- A status-panel cell for the level (`ABC-101` ruling 4).

## Acceptance criteria

The rows run on in-memory streams whose `isTTY` is set by the test. `A8` is the only reading on a real terminal.

- **`A1` (both questions, both answered).** **Given** TTY stdin and stdout and no flags, **when** the program starts
  and the answers are `black` and `1`, **then** exactly 2 questions are written, colour first, and 0 frame bytes are
  written before the second answer. The game then starts with the human as Black, and the level seam is built with
  difficulty `1`.
- **`A2` (Enter keeps today's game).** **Given** the same, **when** both answers are empty lines, **then** the
  resolved options equal base's no-argument options: colour `white`, difficulty `5`.
- **`A3` (a flag skips its question).** **Given** TTY streams:
  - with `--colour black --difficulty 3`, 0 questions are written (`EPIC-006` acceptance 4);
  - with `--colour black` alone, exactly 1 question is written, and it is the difficulty question;
  - with `--difficulty 2` alone, exactly 1 question is written, and it is the colour question.
- **`A4` (a wrong answer teaches and asks again).** **Given** TTY streams, **when** the colour answer is `purple`,
  and separately when the difficulty answers are `6`, `0`, `03`, and a 1 025-character line, **then** each one
  writes exactly 1 rejection line that names the accepted answers, then asks the same question again. 0 frames are
  written. The next valid answer is accepted. A typed `\x1b` does not appear in the echo.
- **`A5` (end of input at a question).** **Given** TTY streams, **when** input ends at the colour question, and
  separately at the difficulty question, **then** the exit code is `0`, 0 frame rows and 0 result-screen rows are
  written, and stderr holds no stack trace.
- **`A6` (a pipe is unchanged).** **Given** a non-TTY stdin or stdout, **then** 0 questions are written. The
  existing `src/cli.test.ts` and `src/cli.real-engine.test.ts` pass with 0 edited lines. A piped script whose
  first line is a move plays that move as the human's first move.
- **`A7` (no line is lost or stolen).** **Given** TTY streams, **when** `black\n1\ne5\n` arrives in one chunk,
  **then** the two questions consume `black` and `1`, and `e5` reaches the game's first prompt after the engine's
  first move. 0 lines are dropped and 0 are read twice.
- **`A8` (QE hand reading on a real pseudo-terminal).** QE runs `npm run chess` under a pseudo-terminal (for example
  macOS `script -q /dev/null npm run chess`; the exact spelling is `UNKNOWN - verify`, pinned on the first run).
  QE answers `black` and `1`, and records that the engine moves first as White. QE then answers two empty lines and
  records that the human plays White. Raw output is kept under the QE task's context.
- **`A9` (the first question comes before the book is read).** **Given** TTY streams and no flags, **then** the
  book file is read 0 times before the colour question is written. The questions add no work ahead of today's first
  board, so `NFR-007`'s bar is not spent on them.

## NFR triggers

- **`NFR-007`** (launch to first board < 2 s): the bar is unchanged. On the question path the board waits for a
  human, so the reading is taken with both flags given (0 questions). `A9` keeps the questions ahead of the book
  read. The row's wording is Security/NFR's at its measuring hop, as the row already allows.
- **`NFR-008`** (`npm test` wall ≤ 10 s at load1 ≤ 8): +1 default-lane test file expected, on in-memory streams,
  with 0 spawns, so `N8-SPAWN` is unchanged. The cost estimate is ≤ 0.05 s of wall against 0.605 s of published
  headroom (9.395 s at `ABC-177`'s merge). This is an estimate, not a reading. Security/NFR rules whether an
  `N8-LANE` reading is owed (≤ 650 ms CPU per one-file set, as `ABC-199` cites it).
- **`NFR-003`** (input responsiveness): the terminal echoes typed keys in line mode. No new bar.
- **Security.** The answers are untrusted input (ASVS V5 input validation, L1). The accepted set is closed and
  matched exactly after trim and lower-casing. The echo is filtered, and the 1 024 line cap holds. `ADR-0036`
  clause (b1) is expected to fire, because `src/cli.ts` gains `process.stdin.isTTY` and `process.stdout.isTTY`
  reads. **A Security/NFR hop is owed.** `ABC-041` clause (a) does not fire, because `package.json` is not touched.

## Test notes

1. Put the question logic in a module the tests can import (`src/cli.ts` exports nothing, `ADR-0011` clause 4).
   Drive it with a fake line source, a fake output and an injected TTY flag, as `src/line-input.test.ts` does.
2. Spawn no child in the default lane. `A6` is proved by the existing child-spawning suites staying unedited and
   green.
3. Red-first plants for QE: (P1) ask on a non-TTY stream, which reds `A6`; (P2) change an empty answer's
   default, which reds `A2`; (P3) read a second chunk eagerly so the game loses `e5`, which reds `A7`; (P4) echo
   unfiltered, which reds `A4`; (P5) read the book before the first question, which reds `A9`.
4. `A8` is a hand reading, recorded raw. No pty library becomes a dependency.
5. UAT: the diff has production lines, so the waiver does not apply. QE's verdict against `A1`–`A9` signs UAT
   under the owner's delegation (`…5aaf7cec`, item 2).

## Size and priority

- **Size `M` (3).** One small module plus one test file, about 15 lines of wiring in `src/cli.ts`, an
  Architect/Design ruling first, then QE (with a pty reading) and Security/NFR. Splitting colour from difficulty was
  considered and refused: both share the same reader hand-off, and two tickets would double the design, QE and
  Security hops for about 10 lines. `ABC-101` also ruled a difficulty-only prompt inconsistent.
- **Priority `P2`.** It is user-visible and fills the last uncut item in `EPIC-006`'s scope. Nothing is broken: the
  flags work today, so it is not `P1`.

## Dependencies

- **Done and merged:** `ABC-037` (the line reader), `ABC-042` and `ABC-101` (the entry point and the options).
- **Architect/Design ruling first (In Design).** The open question is how the questions read stdin without breaking
  `ABC-037`'s one-chunk queue or `src/cli.ts`'s "built once, called nowhere" note. One shared reader is one option;
  a hand-off that leaves no overshoot is another. The Architect picks, within the accepted ADRs (`ADR-0011`,
  `ADR-0016`, `ADR-0036`). **If the shape needs a new ADR or changes an accepted one, STOP:** that goes to the
  owner under his delegation (`…5aaf7cec`, item 3).
- **Merge order.** It merges after `ABC-178`'s B7/B8 timing hop, so that reading sees a tree without the new test
  file. It touches no file that `ABC-178`, `ABC-197` or `ABC-199` touch.
- **Builder:** Software Engineer, after the Architect's ruling. Then QE, then Security/NFR.

## Owner questions

None. The work is inside `EPIC-006`'s accepted scope, moves no NFR bound, and keeps both defaults.

## Definition of Ready

BA/PM, 2026-10-22, at `main` `08d42d01`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the user (a player without the flags), the pain (always White at level 5, nothing says otherwise), the value (pick Black and level 1 with no flag) |
| 2 | scope and out-of-scope clear | ✅ seven scope lines; UCI, defaults, usage line, grammar and raw mode fenced |
| 3 | INVEST-shaped | ✅ independent of the open tickets; valuable alone; estimable; `M`; testable on in-memory streams plus one pty reading |
| 4 | acceptance testable and measurable | ✅ question counts (2, 1, 0), order, 0 frame bytes before the answers, exit code 0, 0 edited lines in two suites, 0 lost lines, 0 book reads before the first question |
| 5 | dependencies known | ✅ three merged tickets; the Architect ruling with a named STOP; the merge after `ABC-178`'s timing hop |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-007` < 2 s read with flags; `NFR-008` ≤ 10 s, +1 file, ≤ 0.05 s estimated; `N8-LANE` ≤ 650 ms CPU if owed; ASVS V5 closed set and 1 024 cap; (b1) hop owed |
| 7 | test notes present | ✅ five, with five plants |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2`, argued |
| 10 | no major unresolved blocker | ✅ the design question has an owner and a stop rule; no owner word is needed |
