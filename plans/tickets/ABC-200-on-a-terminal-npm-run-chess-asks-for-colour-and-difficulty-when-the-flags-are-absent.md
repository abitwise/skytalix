---
id: ABC-200
title: "On a terminal, `npm run chess` asks for colour and difficulty before the first board when their flags are absent (EPIC-006 G6)"
status: in-review
column: In Review
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
>
> **Design ruled 2026-10-22 by Architect/Design** (task `arch-design-ABC-200`, records only, at `main` `9c54df47`).
> Notes: `.grugops/context/arch-design-ABC-200/notes/` (`…f612277c` the ruling, `…0d7cbff3` the pins and prototype).
> - **The shape:** one line reader per stream, so the questions and the game share `ABC-037`'s queue.
> - **No ADR is new, changed or reversed**, so there is no owner STOP.
> - **Build to `## Build notes` below.** No acceptance criterion moved. Two statements on this page are
>   corrected in place, each marked *Corrected 2026-10-22 (Architect/Design)*.
>
> **Follow-ups ruled 2026-10-22 by BA/PM** (task `bapm-cut-ABC-200-followups`, records only, at `main` `3bee4bdd`).
> The ruling is in `.grugops/context/bapm-cut-ABC-200-followups/notes/`. No acceptance criterion moved.
> - **`QE-200-a` (LOW): accepted, not cut.** The one unread link is a single statement, `cli.ts` L184–186, which
>   takes `.options` from the questions' result. Text pins hold it, and the realistic regression is already red.
>   No behavioural row fits an XS, test-only ticket inside the accepted ADRs.
> - **`AR-200-C1ECHO` (LOW): left accepted. `QE-200-d` (INFO): no ticket.** Both ride along with the next ticket
>   that edits either `printableOf` or the questions' end-of-input path.
> - **Record corrected:** the (b1) line list, as a dated erratum under `## NFR triggers`.
> - **Cut:** `ABC-201`, the fresh-clone reading of `EPIC-006` acceptance 1 and `NFR-007`.

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
  - *Corrected 2026-10-22 (Architect/Design):* under the ruled wiring, `src/cli.ts` reads no `isTTY`. The
    questions module reads `isTTY` off the stream objects it is handed. (b1) still **fires**, on two `cli.ts`
    lines: the moved `const sink = process.stdout;` and the new `const stdin = process.stdin;`. So the
    Security/NFR hop is still owed. Neither new module holds a limb, so `ADR-0036` § 3's trigger does not fire.
  - *Erratum 2026-10-22 (BA/PM, `bapm-cut-ABC-200-followups`), from Security/NFR `…08e4152e` § 1 and the
    Orchestrator's `…e459881c`. The verdict is unchanged; only the line list was wrong.* (b1) fires, on limb 2 only,
    on **three** `src/cli.ts` lines at code `1efd2cee` (tip `0a07df04`):
    - **L150:** `const parsed = resolveOptions(process.argv.slice(2));`, the same argv read with its binding renamed;
    - **L167:** `const stdin = process.stdin;`, new;
    - **L200:** `warn: (line) => process.stderr.write(…)`, moved into the `try` byte for byte.

    **`const sink = process.stdout;` is unchanged** (L154 at base `bd745ac9`, L164 at the tip). Its line number
    moved, but the line did not. It is not a (b1) line. The sentence above and `…f612277c` that call it "moved" are
    superseded by this list.

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
6. *Added 2026-10-22 (Architect/Design):*
   - **`A7`:** drive it with the **real** `createLineInputSeam` over the same stream the questions read, with
     the input written in one `write`.
   - **Plant P6:** give each caller a private reader, with no per-source sharing. It reds `A7`. The scratch
     prototype measured the game's first read as `eof` under P6, against `e5` under the shared reader.

## Size and priority

- **Size `M` (3).** One small module plus one test file, about 15 lines of wiring in `src/cli.ts`, an
  Architect/Design ruling first, then QE (with a pty reading) and Security/NFR. Splitting colour from difficulty was
  considered and refused: both share the same reader hand-off, and two tickets would double the design, QE and
  Security hops for about 10 lines. `ABC-101` also ruled a difficulty-only prompt inconsistent.
  - *Corrected 2026-10-22 (Architect/Design):* the size stays `M`, but the file count grows.
    - **New:** 2 production modules (`src/line-reader.ts`, which is a move of about 95 lines out of
      `src/line-input.ts`, and `src/startup-questions.ts`) and 1 test file.
    - **Edited:** 3 production modules (`src/cli.ts` about 15–20 lines, `src/cli-options.ts`, and a slimmer
      `src/line-input.ts`) and 1 test file (`src/line-input.test.ts`, guards only).
    - **`NFR-008`:** still +1 test file.
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

## Build notes (Architect/Design ruling, 2026-10-22)

The full ruling is `.grugops/context/arch-design-ABC-200/notes/20261022T191404Z-architect-design-decision-f612277c.md`.
The pins it keeps are listed in `…0d7cbff3`. In short:

1. **One line reader per stream.**
   - **The move:** `ABC-037`'s line state machine moves out of `src/line-input.ts` into a new
     `src/line-reader.ts`, unchanged in behaviour. That covers the decoder, the partial line, the over-cap
     flag, the overshoot queue, the single `waiting` slot, the `end` listener attached once, and pause
     between reads.
   - **The export:** `lineReaderOf(source)`. A module-level `WeakMap` memoizes it, so one source always gets
     one reader.
   - **Re-exports:** `MAX_LINE_LENGTH` and `LineSource` move with it, and `line-input.ts` re-exports both.
   - **The seam:** `createLineInputSeam` keeps its signature, its per-seam command resolver and its prompt,
     and reads through `lineReaderOf(source)`.
   - **Why a new module:** `cli.test.ts`'s `inputSeamThrows` child substitutes `./line-input.ts` with a double
     that exports only `createLineInputSeam`. A new import from `line-input.ts` fails at link time and reds
     that child (measured).
2. **The questions go in `src/startup-questions.ts`.** The name must not start with `cli`: `A9` pins the `cli*`
   list.
   - **Shape:** one export, for example `askAbsentOptions(parsed, { source, output })`. It returns
     `{ options } | null`, where `null` means input ended at a question.
   - **When it asks:** only when `source.isTTY === true && output.isTTY === true`. Otherwise it makes 0 reads
     and 0 writes and never calls `lineReaderOf`.
   - **It reaches for nothing:** no `process`, no Node builtin, no error listener (`ADR-0016` clause 3), no
     cursor control, no `try`.
   - **Runtime imports:** only `./line-reader.ts` and `./cli-options.ts`. Never `./line-input.ts`, never
     `./history.ts`.
   - **Answers:**
     - **Colour:** trim and lower-case, then exact membership in `COLOUR_VALUES`.
     - **Difficulty:** trim, then exact membership in `DIFFICULTY_VALUES`.
     - **Empty line:** `white` or `DEFAULT_DIFFICULTY`, imported and never re-spelled.
     - **Over-cap line:** a wrong answer with an empty echo.
     - **Echo filter:** the module's own copy of the C0/`U+007F` filter. `printableOf` stays in `cli.ts`,
       because `numbersIn("cli.ts")` pins its bounds.
3. **`src/cli-options.ts` changes additively.**
   - The ok branch of `Resolution` gains `absent: { colour: boolean; difficulty: boolean }`, **beside**
     `options`. `ResolvedOptions` does not change, because `.options` is compared whole.
   - Export `COLOUR_VALUES`, `DIFFICULTY_VALUES` and `ColourValue`.
   - The coin and the orientation rule move into one exported pure function, for example `optionsFor(colour,
     flags, difficulty)`, which `resolveOptions` also calls.
   - **Keep:**
     - no new number literal and no new string literal;
     - no `process`;
     - no code word matching `A7`'s `/depth|ply|…|budget/i`. It is a substring match, so `apply`, `reply`
       and `supply` red it;
     - exact equality only. `toLowerCase` stays in the questions module.
4. **The `src/cli.ts` wiring, which keeps every `cli.test.ts` pin (`A6`: 0 edited lines).**
   1. `const parsed = resolveOptions(process.argv.slice(2));` The usage path is unchanged apart from the name.
   2. `const sink = process.stdout;` then `const stdin = process.stdin;`
   3. The `EPIPE` arm, now calling `stdin.destroy()`. It is installed **before** the questions see the handle.
   4. `try {`
   5. `const resolution = await askAbsentOptions(parsed, { source: stdin, output: sink });`
   6. `if (resolution === null) return;`
   7. `const { colour, orientation, flags, difficulty } = resolution.options;`
   8. Then everything as today, including `input: createLineInputSeam({ source: process.stdin, output: sink })`
      written literally.

   **Pin accounting:**
   - `process` still occurs 10 times, with the same list.
   - `process.stdin` occurs twice, `process.stdout` once, and `resolveOptions(` once.
   - `difficulty` occurs twice in code, and `sink.write(` once.
   - No new numbers.

   **Side effect:** a defect thrown before the loop now exits `70`, not as an unhandled rejection.
5. **`A9` holds by order.** The book probe and the glyph-mode session are built after the questions return.
6. **Tests.**
   - **New file `src/startup-questions.test.ts`:** in-memory `PassThrough` streams with the test setting
     `isTTY`, 0 spawns, and injection rather than `vi.spyOn` (`ADR-0042`).
   - **`A7`** uses the real `createLineInputSeam` (test note 6).
   - **`A9`** is a source-order row over `cli.ts`.
   - **`src/line-input.test.ts`:** its import-set row gains `./line-reader.ts`, and its code bars must scan
     `line-reader.ts` too.
7. **Residual risks, all LOW.**
   - **The shared `waiting` slot:** sequential by R4's `await`. The trigger is any new caller of
     `lineReaderOf`.
   - **`EPIPE` during a question:** unreachable, because stdout is a TTY there.
   - **Ctrl-D at a question on a real terminal:** that the process exits promptly is `UNKNOWN - verify`.
     QE could add it to the `A8` reading; that is a suggestion, not a criterion.

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

## N8-LANE reading (Security/NFR, 2026-10-23)

Task `security-nfr-timing-2026-10-23`, part 1. It is the reading owed before merge by `…08e4152e` § 3, taken as that section
spells it. The pre-registration is `c9dd9d1f`, committed before any poll. The evidence is in
`.grugops/context/security-nfr-timing-2026-10-23/` (`probe/p1/`).

**Trees:**
- **The merge:** `grugops/sec-timing-ABC-200` = `grugops/qe-ABC-200` `55618845` with `main` `1d5316e0` merged in (a merge, no
  conflict), giving merge `5bf1e3d6`. `1d5316e0` is `c91445e3` plus records only.
- **Correctness at the merge:** `npm test` exit 0, `last-run.json` `success: true`, 61 files / 2 018 tests.

**Arms** (out of tree, each with its own `npm ci --ignore-scripts`, all on vitest 4.1.12):
- **B:** `1d5316e0`, with a one-assertion placeholder at `src/startup-questions.test.ts`.
- **T:** the same, built separately. `diff -r` against B is clean.
- **H:** `5bf1e3d6`.

**The set** (resolved at HEAD): `src/startup-questions.test.ts` and `src/line-input.test.ts`, plus `vitest related` on the five
changed sources. That gives 5 files: `cli.real-engine.test.ts`, `cli.test.ts`, `engine.test.ts`, `line-input.test.ts` and
`startup-questions.test.ts`. B and T run 174 tests; H runs 195.

**Run:** 9 interleaved rounds with the order rotated. Round 0 was discarded, leaving 8 scored. The command was
`NODE_OPTIONS=--max-old-space-size=128 npx vitest run <set>`, and CPU came from `/usr/bin/time -p`.

**Preconditions:**
- **The gate:** 60 s of OK polls (AC, load1 ≤ 8, 0 vitest).
- **The window:** 180 s with 0 foreign polls, and AC on all 37 polls (load1 max 3.10).
- **Every run:** AC on all 27, thermal 0 → 0, load1 2.72–3.68, 0 foreign.

| | reading |
|---|---|
| **H − B CPU** (the charge) | **+0.030 s**, interval [−0.010, +0.060], sign 6/8 |
| twin T − B CPU | −0.005 s (−0.06 % of B 8.225 s), sign 4+/4−, p 1.000: **admissible**; **R 0.050 s** |
| H − B wall | −0.020 s [−0.070, +0.050], reported only |
| **state at 650 ms CPU** | **MET** (R ≤ b and the median ≤ b), in the grading view (thermal kept and flagged; 0 thermal runs), the 174a view and the strict 174 view |

- **Accounts:** the floor is charged by count (1 file) to the floor account. `N8-SPAWN` takes 0.
- **The provisional F (16 %, 1.316 s) is above the bound:**
  - It does not change the state. F is a cut-time rule, and the state test does not read it.
  - This window's twin (R 0.050 s) is the set's first admissible reading.
  - Re-reading F is Architect/Design's job, as with `R-178-1`.
- **The full-lane `NFR-008` reading is not owed before merge.** `N8-LANE` is MET, so the published headroom (0.990 s, `…d0c770b5`)
  is spent by an estimate, as the catalog says, until the next full-lane window.

## QE

**2026-10-22, QE/E2E (`qe-ABC-200`): PASS_WITH_GAPS** (decision `…b8aa74fb`). No gap blocks. Under the owner delegation (`…5aaf7cec`) this verdict signs UAT. QE releases `In Review`; the Orchestrator moves the board.

- **Where it ran:** merge `d062d60e` (tip `0a07df04` plus `main` `be70482f`), base `bd745ac9`. QE's own worktree, `node_modules` and scratch. The verdict was formed before the SE's notes were opened.
- **Notes:** `.grugops/context/qe-ABC-200/notes/`:
  - criteria and plants `…0bce441b`
  - gates `…7d19b107`
  - A8 reading `…97b2d4d9`
  - A8 raw transcripts `…9c82cf61`
  - gaps `…843719f4`
  - verdict `…b8aa74fb`
- **A1–A7, A9 MET** on QE's own runs. P1–P6 each red on the row the test notes name. QE's extra plants P2 (difficulty), Q2o, Q2i, Q3 and Q4 are also red.
- **A8 MET on a real pseudo-terminal.** It was driven by `expect` + `script -q`, and case 7 by GNU `screen` with `hardcopy`. All eight cases were read, plus `--colour black` alone and `--difficulty 2` alone.
  - `black`, `1`: the engine moved first as White.
  - Two empty lines: the human plays White.
  - The pasted `e5` was played after the engine's first move.
  - Ctrl-D at either question: exit 0, no frame, no stack trace.
  - The first frame replaces the question lines on the rendered screen.
  - Pipes: no question, and the output is byte-identical to base.
- **Deviation** (an empty answer keeps `parsed.options`): the behaviour is identical and in line with the ruling ("never re-spelled"). Accepted.
- **Gates at the merge:**
  - lint, typecheck and build 0; `dist/` holds no new module;
  - `npm test` 61 / 2 017 (base 60 / 1 995, run for real), success true;
  - skips 0, `No findings.`;
  - CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32, INPUT_DEEP 34.
- **Gaps:**
  - `QE-200-a` (LOW): the entry point's use of the answered options is held by text pins only (plant Q1b is green). The pty and a probe show it works.
  - `QE-200-b`: A9's row is source order (plant P5b is green); a probe shows 1 book read, after the answers.
  - `QE-200-c`: a 1 025-character line cannot be submitted at a macOS terminal (`MAX_CANON` 1 024).
  - `QE-200-d`: EOF at a question writes no newline.
  - `QE-200-e`: `line-reader.ts`'s import set is not pinned.
  - `QE-200-f`: merge after ABC-178 and ABC-199, then re-gate.
  - `QE-200-g`: QE's merge commit subject is git's default.
- **No timing claims** and no `NFR-008` or `N8-LANE` reading.
