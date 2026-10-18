---
id: ABC-167
title: "`src/uci-session.ts`: a capability-free UCI session that answers the `ADR-0044` D3 commands, with the D4 time rule and the D12 `go` limits"
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-007
feature: —
---

# ABC-167 — the UCI protocol as a pure module: lines in, lines out, a virtual clock, no process

> **Amended 2026-10-18 by BA/PM** (subtask `bapm-amend-ABC-167`, from `main` `86e8be75`) for the gaps `qe-ABC-167`
> found (`…e100c23c`: PASS_WITH_GAPS, QE-167-a..h), and for the SE's five choices (`…297da9e5` on `grugops/ABC-167` @
> `4dbbfbd8`). **Records only.** The new rows are under each criterion, marked *Amended 2026-10-18*, and named
> `<criterion>-<gap><n>`. A row marked **(owner may overrule)** is a BA/PM recommendation where `ADR-0044` does not
> decide. Every expected figure was read on the tip in a scratch copy on `virtualClock` (no wall clock). All the new
> rows pass at the tip except **`A6-e2`, `A6-e3`, `A6-e4` and `A7-f1`**, which fail there by design: the SE fix hop
> changes the code for those four, and adds the others as test rows only. `A11-g1` changes the test's guard, not the
> module. The size stays `S`.

> **Accepted 2026-10-18 by the owner** (BA/PM, subtask `bapm-epic007-accept`). Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"accept the revised ADR-0044 and EPIC-007"*. The DoR item "owner acceptance" (item
> 10) is met, and the score is now 10 of 10. Readings below are unchanged from the cut.

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**. The id was
> reserved by `bapm-engine-plan`. It stays in `Backlog` until the owner accepts the revised `ADR-0044` and `EPIC-007`.
> Design: `ADR-0044` D2–D5 and D12. Owner word: Q1–Q3, Q6, Q9 (`…a41c7e02`). **This hop ran nothing.**

## Problem

*User:* the owner's UI backend, and any UCI GUI or tester.

*Pain:* nothing in `src/` speaks UCI. There is no protocol loop, no rule that turns a GUI clock into a budget, and no
`info` or `bestmove` line (`ADR-0044` § Context).

*Value:* the whole protocol is testable without a process, on the virtual clock. `ABC-171` adds the options on top, and
`ABC-168` puts it behind stdin and stdout.

## Scope

1. **`src/uci-session.ts`** exports `createUciSession({ write, now })`, which returns `{ handleLine(line) }`.
   `handleLine` returns `"quit"` or `"continue"`. `ABC-171` adds `random` and `book`, which completes `ADR-0044` D2's
   shape.
2. **Commands (D3), without options:** `uci`, `isready`, `ucinewgame`, `position`, `go`, `stop`, `ponderhit`, `quit`.
   `setoption`, `debug`, `register` and anything unknown are ignored. **In this ticket the strength is fixed at
   `DEFAULT_LEVEL` 3** (rate 0, so `chooseMove` is called directly) and the book is off. That is the behaviour
   `ABC-171`'s defaults keep, apart from the book.
3. **The D4 time rule**, capped by level 3's 3 000 ms, and the **D12 mapping** of `depth`, `nodes` and `mate` onto
   `ABC-170`'s fields.
4. **Output (D3):** one `info` line and one `bestmove` per `go`; `score cp` or `score mate ±M`; diagnostics as
   `info string`.
5. **`src/uci-session.test.ts`**, one new default-lane file.

## Out of scope

- `option` lines, `setoption` handling, the book and `Skill Level` levels 1, 2, 4 and 5. Those are `ABC-171`.
- `src/uci.ts`, any `process` use, readline, exit codes and the build. Those are `ABC-168`.
- A worker, or answering during a search (`ADR-0044` D5). `searchmoves`. A pv longer than one move.
- Any edit to an existing file under `src/`.

## Acceptance (Given/When/Then)

Every row drives `handleLine` with strings, collects `write`'s lines, and injects a ticking virtual clock (`ADR-0027`).

- **`A1` (handshake).** **Given** a new session, **when** it gets `uci`, **then** it writes exactly 3 lines, in this
  order: `id name skytalix`, `id author Olger Oeselg`, `uciok`.
- **`A2` (ready).** `isready` writes exactly `readyok`.
- **`A3` (a move from a position).** **Given** `position startpos moves e2e4 e7e5`, **when** `go movetime 100` arrives,
  **then** exactly 2 lines are written: `info depth D score cp S nodes N time T nps X pv M`, then `bestmove M`. The two
  `M`s are equal, and `M` is in `legalMoves` of that position.
  - *Amended 2026-10-18 (SE choice 5, QE-167-h) **(owner may overrule)**:* **`A3-h1`.** On that `info` line,
    `X = round(N × 1000 / max(1, T))`, which is nodes per second guarded against `T = 0`. D3 names the field but
    gives no formula. This is the UCI meaning, and it is what the tip computes. A build that writes `nps N` (M43)
    fails.
- **`A4` (bad input holds no position).** **Given** `position fen 8/8/8 w - - 0 1`, or `position startpos moves e2e5`,
  **when** it is handled, **then** exactly one `info string` line is written. That line holds only printable characters
  (the `cli.ts` `printableOf` rule). The next `go movetime 100` writes `bestmove 0000`. **And** a held position with no
  legal move, the stalemate `7k/5Q2/6K1/8/8/8/8/8 b - - 0 1`, answers `go` with `bestmove 0000`.
  - *Amended 2026-10-18 (QE-167-a):* the printable check has to run on a message that **echoes the input**. The
    bad-FEN message does not echo it, so the check passed there even with no filter (M29). In the rows below,
    `\x1b` is U+001B (ESC). "Printable" means no code point below U+0020 and no U+007F. The `printableOf` rule
    **drops** those code points and keeps everything else, so the echoed text is asserted with only the ESC removed.
    That assertion is also what proves the input was echoed.
    - **`A4-a1`.** **Given** a new session, **when** `position startpos moves e2e4\x1b[31m` is handled, **then**
      exactly one line is written. It is an `info string` line, it is printable, and it contains `e2e4[31m`. The
      next `go movetime 100` writes `bestmove 0000`.
    - **`A4-a2`.** **Given** `position startpos`, **when** `go depth \x1b[31m` is handled, **then** the first line
      is one `info string`, printable and containing `[31m`. Then exactly one `info` line and one `bestmove`
      follow, and that move is legal from the start position.
- **`A5` (the D4 time rule).** On the virtual clock, read from the `info` line's `time`:
  - `go movetime 100` → a 100 ms budget;
  - white to move, `go wtime 1000 btime 9000` → 50 ms (`1000 / 20`, white's clock is read);
  - black to move, the same line → 450 ms (`9000 / 20`);
  - `go wtime 40 btime 40` → 1 ms (`max(1, min(2, −10))`);
  - `go wtime 60000 btime 60000 winc 1000 binc 1000` → 3 000 ms (G = 3 500, capped by level 3);
  - a bare `go` → 3 000 ms (G = `HARD_CEILING_MS`, capped by level 3).
  The "within" bound for each figure is the engine's own overshoot on the chosen clock step, and the test names it.
  - *Amended 2026-10-18 (QE-167-b, QE-167-c):* the six rows above cannot pin D4's increment, `movestogo`, overhead
    or `movetime` precedence. Their only increment row is capped at 3 000 ms, and at step 1 the 1 ms row also admits
    the no-overhead G of 2 (M02). Six rows are added. Each one has G below the 3 000 ms cap, and each runs on
    **step 1**, with the bound **G ≤ `time` ≤ G + 2·step**, which is G to G + 2. The last column gives the G a wrong
    build produces, and each of those falls outside the bound. At the tip, every row reads `time` = G + 1.

    | row | given | go line | G (ms) | a wrong build gives |
    |---|---|---|---|---|
    | `A5-b1` | `position startpos` (white) | `go wtime 2000 btime 2000 winc 1000 binc 0` | **600** = min(2000/20 + 1000/2, 2000 − 50) | 100 with no increment or the other side's (M03, M06); 1 100 if not halved (M04) |
    | `A5-b2` | `position startpos moves e2e4` (black) | the same line | **100** = min(2000/20 + 0/2, 1950) | 600 with white's increment (M06) |
    | `A5-b3` | `position startpos` | `go wtime 1000 btime 1000 movestogo 5` | **200** = min(1000/5, 950) | 50 with `movestogo` ignored (M05) |
    | `A5-b4` | `position startpos` | `go wtime 1000 btime 1000 movetime 300` | **300** (`movetime` wins; the clock alone gives 50) | 50 if the clock wins (M11), or with min(movetime, clock G) |
    | `A5-b5` | `position startpos` | `go movetime 300 wtime 60000 btime 60000` | **300** (the clock alone gives 3 000 after the cap) | 3 000 if the clock wins or with max(movetime, clock G); the order is reversed from `A5-b4`, so a build where the last token wins fails one of the two rows |
    | `A5-c1` | `position startpos` | `go wtime 100 btime 100 winc 1000 binc 1000` | **50** = max(1, min(100/20 + 1000/2, 100 − 50)), where the overhead binds | 100 with overhead 0 (M02); 5 with no increment |

    **The 1 ms row (QE-167-c) keeps its figure and its step.** It still pins D4's `max(1, …)` floor as an outcome:
    `time` is between 1 and 3, and the move is legal. The overhead pin moves to `A5-c1`. M09 and M10 (the floor
    lowered or removed) are **accepted as observationally equivalent**: the engine plays depth 1 on any budget of
    0 ms or less, so there is no row a correct build passes that they fail.
- **`A6` (`infinite` waits for `stop`).** **Given** `go infinite`, **then** no `bestmove` is written. **When** `stop`
  arrives, exactly one `bestmove` is written. A second `stop` writes nothing. `ponderhit` behaves as `stop`.
  - *Amended 2026-10-18 (QE-167-d, D4.3):* **`A6-d1`.** **Given** `position startpos`, **when** `go ponder`
    arrives, **then** exactly one line is written: the `info` line, with `time` between 3 000 and 3 000 + 2·step
    (D4.1: `ponder` gives `HARD_CEILING_MS`, capped at 3 000). No `bestmove` is written yet. **When** `ponderhit`
    arrives, exactly one `bestmove M` is written, and `M` equals the `pv` move. A second `ponderhit` writes nothing.
    A build where `go ponder` does not hold (M12) fails this row.
  - *Amended 2026-10-18 (QE-167-e). What a held `bestmove` does on the next command.* The rule rests on D5's
    "one `bestmove` per `go` always holds" and on D3's quote of the spec, *"for every go … a bestmove is needed"*.
    A held line is therefore **never dropped**. Six commands release it: `stop`, `ponderhit`, `go`, `position`,
    `ucinewgame` and `quit`. Releasing means writing it, then doing the command. Every other line leaves it held.
    - **`A6-e1`** (a new `go`; **decided by D5**). **Given** `position startpos` and `go infinite`, **when**
      `go movetime 100` arrives, **then** that call writes, in order: the held `bestmove`, the new `info` line and
      the new `bestmove`. The whole dialogue holds exactly two `bestmove` lines. A following `stop` writes nothing.
      A build that drops the held line (M15) fails this row.
    - **`A6-e2`** (a `position`; **owner may overrule**). **Given**
      `position fen 7k/8/6K1/8/8/8/8/R7 b - - 1 1` (A8's FEN, where black's only legal move is `h8g8`) and
      `go infinite`, **when** `position startpos` arrives, **then** that call writes exactly one line,
      `bestmove h8g8`. A following `stop` writes nothing. A following `go movetime 100` writes a `bestmove` that is
      legal from the start position. **The tip fails this row**, because it writes `bestmove h8g8` at the later
      `stop`, after the GUI has set a new position.
    - **`A6-e3`** (a `ucinewgame`; **owner may overrule**). This is `A6-e2` with `ucinewgame` in place of
      `position startpos`. **The tip fails this row too.**
    - **`A6-e4`** (a `quit`; BA/PM's reading of D5, **owner may overrule**). **Given** `position startpos` and
      `go infinite`, **when** `quit` arrives, **then** `handleLine` returns `"quit"`, and that call writes exactly
      one line, a `bestmove`. **The tip fails this row**, because it drops the held line.
    - **`A6-e5`** (lines that do not release). **Given** `position startpos` and `go infinite`, `isready` writes
      exactly `readyok` and no `bestmove`, as the spec's "immediately answer" requires. `foo` and
      `setoption name Hash value 64` each write nothing. The following `stop` then writes the one `bestmove`. A
      build that releases on every command fails this row.
    - *Why `A6-e2` and `A6-e3` write first (recommendation; the ADR does not decide this).* The spec expects the
      GUI to `stop` before it sends `position` or `ucinewgame`, so the ADR is silent on this case. Keeping the line
      held, as the tip does, also keeps one `bestmove` per `go`, but the move then arrives after the GUI has set a
      new position, and it may be illegal there (`h8g8` from the start). Writing it first answers each `go` in the
      position that `go` searched. D4.3's "it may not answer early" covers the search ending on its own; a
      `position` or a `ucinewgame` is the GUI ending the mode. This is for `ABC-168`/`ABC-171` to inherit.
- **`A7` (the D12 limits).**
  - `go depth 3`, on a clock where an unlimited `go` reaches depth ≥ 5 → the `info` line reports `depth 3`;
  - `go nodes 20000` → `nodes` ≤ 21 024, unless depth 1 alone took more;
  - `go mate 2` on `5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1` (`src/puzzle-corpus.ts:128`) → `score mate 2` and
    `bestmove d5g8`;
  - `go depth 3 mate 5` → `depth 3` (the smaller one wins);
  - `go depth 0`, `go nodes x` and `go depth 2.5` each write one `info string`, drop that token, and still write one
    `bestmove`;
  - `go movetime 1000 searchmoves e2e4` writes one `info string` and searches all moves.
  - *Amended 2026-10-18 (QE-167-f, SE choice 2; **owner may overrule**, because D4 gives formulas and D12's
    positive-integer rule names only `depth`, `nodes` and `mate`).* **Value rules for the time tokens:**
    - `movetime`, `wtime`, `btime`, `winc` and `binc` take an optional `-`, then digits, then optionally `.` and
      digits. Zero and negative values are accepted, because D4's `max(1, …)` and the engine's depth-1 floor
      already make them safe (QE probe: `movetime -5` and `wtime -1000` give a legal depth-1 move).
    - `movestogo` follows D12's positive-integer rule.
    - An unreadable value (for example `1e2`, `2.5` for `movestogo`, or `0` for `movestogo`) drops that token with
      one `info string`, and a `bestmove` is still written. This mirrors D12. The SE's choice is ratified.
    - **A keyword is never a value.** A keyword's value is the next token only when that token is not itself a
      `go` keyword (the session's keyword set). When the next token is a keyword, or there is none, the keyword is
      valueless: it writes one `info string`, and parsing goes on at the next token, so that token is read as a
      keyword. This is the same boundary choice 4 uses for `searchmoves`.
    - **`A7-f1`.** **Given** `position startpos`, on step 1, **when** `go depth movetime 100` arrives, **then**
      exactly one `info string` is written (it names `depth`), the `info` line's `time` is between 100 and 102,
      and one `bestmove` follows. **The tip fails this row**: it reads `movetime` as `depth`'s value, then searches
      the bare-`go` 3 000 ms.
    - **`A7-f2`.** `go movetime` with no value writes one `info string`, then searches as a bare `go` (`time`
      between 3 000 and 3 000 + 2·step), then writes one `bestmove`.
    - **`A7-f3`.** On step 1, `go movetime 1e2` writes one `info string` and searches as a bare `go`. On step 1,
      `go wtime 1000 btime 1000 movestogo 0` writes one `info string` and reads G = 50, with `time` between 50
      and 52.
  - *Amended 2026-10-18 (SE choice 4, QE-167-h; **owner may overrule**, because D6/D12 say "ignored" but not how
    far).* `searchmoves` consumes the tokens up to the next `go` keyword, which the SE chose and BA/PM ratifies.
    **`A7-h1`.** On step 1, `go searchmoves e2e4 d2d4 movetime 100` writes one `info string`, and the `info`
    line's `time` is between 100 and 102, so the `movetime` after `searchmoves` is honoured. A build where
    `searchmoves` consumes to the end of the line (M23) fails this row.
- **`A8` (mate scores).** On `7k/8/6K1/8/8/8/8/R7 b - - 1 1` (corpus row `:127` after `f6g6`; black is mated next
  move), `go movetime 500` reports `score mate -1`. `A7`'s mate-in-2 reports `score mate 2`. The rule is
  `M = ceil((MATE_SCORE − |score|) / 2)`, negative when the engine is being mated.
  - *Amended 2026-10-18 (QE-167-h):* the test row that computes `ceil` over constants, without calling the module,
    **counts for nothing** toward `A8`. `A8` is met by its two behaviour rows, `mate -1` and `mate 2`, which kill
    M31–M33. The fix hop may delete that row or keep it. Nothing else is required.
- **`A9` (ignored and reset).** `setoption name Hash value 64`, `debug on`, `register later`, `foo` and an empty line
  each write **nothing**. **Given** `position fen <Kiwipete>`, **when** `ucinewgame` then `go movetime 100` arrive,
  **then** the `bestmove` is legal from the start position.
  - *Amended 2026-10-18 (SE choice 1, QE-167-h; decided by D3, which says `ucinewgame` "sets the position back
    to the start").* **`A9-h1`.** **Given** a new session with no `position` line, **when** `go movetime 100`
    arrives, **then** one `info` line and one `bestmove` are written, and the move is legal from the start
    position. A build where a new session holds no position (M44) fails this row.
- **`A10` (quit).** `handleLine("quit")` returns `"quit"`. Every other line in this file's rows returns `"continue"`.
- **`A11` (capability-free, and M4).** `src/uci-session.ts` holds no `ADR-0036` limb token in code (`process.`, a
  `node:` import, `spawn`, `exec(`, `fetch(`, `eval(`, `new Function`), no `Date.now` and no `Math.random`. It imports
  none of `history.ts`, `turn-loop.ts`, `book-engine.ts`, `level-seam.ts`, `book-file.ts` or `line-input.ts`. **Every
  line written in every row** starts with `id`, `option`, `uciok`, `readyok`, `info` or `bestmove` (`EPIC-007` M4).
  - *Amended 2026-10-18 (QE-167-g). This fix is cheap and clear, so it is made here.* **`A11-g1`.** The check
    for the six banned modules matches **every import form**, each with either quote: `from "<m>"`, the
    side-effect `import "<m>"`, and `import("<m>")`. A build that adds `import "./turn-loop.ts"`,
    `"./book-file.ts"`, `"./line-input.ts"`, `"./book-engine.ts"` or `"./level-seam.ts"` (M47–M51) then fails
    this file, not only the lane. M38 and M41 (`'node:fs'` in single quotes, and a bare `"fs"`) already fail the
    mandatory lint gate. **Bracket access to globals (`globalThis["process"]`, `globalThis["Math"]["random"]`;
    M40 and M42) is not amended here.** A text check cannot close it, so it goes to the **`In Security/NFR` hop**.
    That hop may raise the severity, and it may ask for a runtime import-closure check like the one QE ran. No
    follow-up ticket is cut unless that hop asks for one.
- **`A12` (fences, and M5).** `git diff --name-only <base> <tip> -- src` lists exactly `src/uci-session.ts` and
  `src/uci-session.test.ts`. The `ADR-0044` D2 "no edit" list is unchanged.

## Dependencies

- **`ABC-170`** (the `maxDepth` / `maxNodes` fields). `A7` cannot pass without it.
- **Blocks `ABC-171`** and, through it, `ABC-168`.
- **Gate: met.** The owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`).

## Security / NFR triggers

- **Security: not triggered.** (a) no manifest. (b1) no limb token. (b2) none of its imports holds a limb: the
  `bapm-engine-plan` grep found only `coordinate-move.ts:91`, which is `RegExp.prototype.exec`, and `levels.ts:115`'s
  `options.now ?? Date.now` is not a limb token. (c) the test spawns nothing. (d) only the two named files. QE confirms
  (b2) as a review check (`ADR-0044` § Consequences).
- *Amended 2026-10-18 (QE-167-g):* the bracket-access evasions of the `A11` text guard (M40, M42) go to the
  `In Security/NFR` hop for review. They are not a BA/PM criterion (see `A11-g1`).
- **`NFR-004`:** held by the engine's clamp. `A5` shows no budget above 3 000 ms leaves the session.
- **`NFR-008`:** +1 default-lane file, all on the virtual clock, 0 spawns (`N8-SPAWN` stays 0 ms). The `N8-LANE`
  delta is measured at the gate.

## Test notes

1. **One helper drives a script.** It takes the lines in and returns the lines out, so every row reads as a UCI dialogue.
2. **The clock is ticking and virtual**, so `A5`'s and `A7`'s figures are exact on every host. No row reads the wall
   clock.
3. **`A8`'s FEN is derived, not corpus-pinned.** If the first build shows it is not a mate in 1 for white, the row
   picks another position, says why, and keeps the negative-`M` assertion.
4. **`A7`'s mate row is an approximation by design** (`ADR-0044` D12). If depth 3 does not find this mate, the build
   reports it as a D12 finding. It does not quietly swap the FEN.
5. **`A4`'s stalemate FEN** (`7k/5Q2/6K1/8/8/8/8/8 b`) is checked as stalemate by `legalMoves` in the test itself
   before `go` runs.

## Size and priority

**`S`:** one new module and one test file, over existing APIs, with about twelve criteria. **Not `XS`:** it is a new
protocol and the time rule. **Not `M`:** the options and the process are split out (`ABC-171`, `ABC-168`).

**`P1`, inherited from `EPIC-007`.**

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `50e081fc` (subtask
`bapm-epic007-accept`). It was 9 of 10 at the cut, with item 10 open until the owner accepted.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** no protocol, time rule or output line exists |
| 2 | scope and out-of-scope clear | **✅** two new files; options, process and worker fenced off |
| 3 | INVEST-shaped | **✅** valuable alone (a testable protocol); small; testable without a process |
| 4 | acceptance testable and measurable | **✅** exact lines, budgets in ms, depth 3, ≤ 21 024 nodes, `mate 2`, `mate -1` |
| 5 | dependencies known | **✅** `ABC-170`; blocks `ABC-171` |
| 6 | security/NFR triggers with a measurable target | **✅** none fire; ≤ 3 000 ms out; +1 file, 0 spawns |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Recommended: → `Ready` after `ABC-170`, as far as Ready's WIP limit (8) allows.** Column moves are the
Orchestrator's.

**Re-scored 2026-10-18 by BA/PM (subtask `bapm-amend-ABC-167`, from `main` `86e8be75`). Result: still 10 of 10.**
- **Item 4 (testable and measurable):** still **✅**, and now stronger. The 21 new rows each give an exact
  figure, line or count, and each names the build it fails:
  - `A3-h1`;
  - `A4-a1`, `A4-a2`;
  - `A5-b1`–`b5`, `A5-c1`;
  - `A6-d1`, `A6-e1`–`e5`;
  - `A7-f1`–`f3`, `A7-h1`;
  - `A9-h1`;
  - `A11-g1`.
- **Item 10 (no major unresolved blocker):** **✅**. Five rulings are BA/PM recommendations where `ADR-0044` is
  silent, marked **owner may overrule**:
  - `A3-h1`;
  - `A6-e2`/`e3`;
  - `A6-e4`;
  - the `A7` time-token rules;
  - `A7-h1`.

  None of them blocks the fix hop.
- **Item 8 (size):** **`S` holds.** The code change is a few lines in one module: the valueless-keyword
  boundary, and a release on `position`, `ucinewgame` and `quit`. The rest is rows in the one existing test file.
- Every other item is unchanged. The ticket's column is the Orchestrator's; `qe-ABC-167` recommends
  `In Security/NFR` after the SE fix hop.
