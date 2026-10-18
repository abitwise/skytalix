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
- **`A4` (bad input holds no position).** **Given** `position fen 8/8/8 w - - 0 1`, or `position startpos moves e2e5`,
  **when** it is handled, **then** exactly one `info string` line is written. That line holds only printable characters
  (the `cli.ts` `printableOf` rule). The next `go movetime 100` writes `bestmove 0000`. **And** a held position with no
  legal move, the stalemate `7k/5Q2/6K1/8/8/8/8/8 b - - 0 1`, answers `go` with `bestmove 0000`.
- **`A5` (the D4 time rule).** On the virtual clock, read from the `info` line's `time`:
  - `go movetime 100` → a 100 ms budget;
  - white to move, `go wtime 1000 btime 9000` → 50 ms (`1000 / 20`, white's clock is read);
  - black to move, the same line → 450 ms (`9000 / 20`);
  - `go wtime 40 btime 40` → 1 ms (`max(1, min(2, −10))`);
  - `go wtime 60000 btime 60000 winc 1000 binc 1000` → 3 000 ms (G = 3 500, capped by level 3);
  - a bare `go` → 3 000 ms (G = `HARD_CEILING_MS`, capped by level 3).
  The "within" bound for each figure is the engine's own overshoot on the chosen clock step, and the test names it.
- **`A6` (`infinite` waits for `stop`).** **Given** `go infinite`, **then** no `bestmove` is written. **When** `stop`
  arrives, exactly one `bestmove` is written. A second `stop` writes nothing. `ponderhit` behaves as `stop`.
- **`A7` (the D12 limits).**
  - `go depth 3`, on a clock where an unlimited `go` reaches depth ≥ 5 → the `info` line reports `depth 3`;
  - `go nodes 20000` → `nodes` ≤ 21 024, unless depth 1 alone took more;
  - `go mate 2` on `5r1k/6pp/7N/3Q4/8/8/8/6K1 w - - 0 1` (`src/puzzle-corpus.ts:128`) → `score mate 2` and
    `bestmove d5g8`;
  - `go depth 3 mate 5` → `depth 3` (the smaller one wins);
  - `go depth 0`, `go nodes x` and `go depth 2.5` each write one `info string`, drop that token, and still write one
    `bestmove`;
  - `go movetime 1000 searchmoves e2e4` writes one `info string` and searches all moves.
- **`A8` (mate scores).** On `7k/8/6K1/8/8/8/8/R7 b - - 1 1` (corpus row `:127` after `f6g6`; black is mated next
  move), `go movetime 500` reports `score mate -1`. `A7`'s mate-in-2 reports `score mate 2`. The rule is
  `M = ceil((MATE_SCORE − |score|) / 2)`, negative when the engine is being mated.
- **`A9` (ignored and reset).** `setoption name Hash value 64`, `debug on`, `register later`, `foo` and an empty line
  each write **nothing**. **Given** `position fen <Kiwipete>`, **when** `ucinewgame` then `go movetime 100` arrive,
  **then** the `bestmove` is legal from the start position.
- **`A10` (quit).** `handleLine("quit")` returns `"quit"`. Every other line in this file's rows returns `"continue"`.
- **`A11` (capability-free, and M4).** `src/uci-session.ts` holds no `ADR-0036` limb token in code (`process.`, a
  `node:` import, `spawn`, `exec(`, `fetch(`, `eval(`, `new Function`), no `Date.now` and no `Math.random`. It imports
  none of `history.ts`, `turn-loop.ts`, `book-engine.ts`, `level-seam.ts`, `book-file.ts` or `line-input.ts`. **Every
  line written in every row** starts with `id`, `option`, `uciok`, `readyok`, `info` or `bestmove` (`EPIC-007` M4).
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
