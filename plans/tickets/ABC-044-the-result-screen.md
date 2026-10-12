---
id: ABC-044
title: The result screen — eight reasons settled against `ABC-020`'s shipped set, two faults that are not chess outcomes, and the full move list
status: done
column: Done
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-044 — how the game ends on screen: which of eight, whether anyone claimed it, and every move played

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition.
>
> **THE REASON COUNT IS SETTLED HERE, WHICH IS WHAT THE EPIC'S 2026-07-31 AMENDMENT ASKED FOR** —
> *"settle the count at decomposition, against `ABC-020`'s shipped reason set"*. `ABC-020` merged
> 2026-08-02, so this was a **read**, not a decision. **It is eight.** See `## The count, settled`.

## Problem

*User*: every player, in the last five seconds of every game.

*Pain*: **the loop's exit test returns a `LoopOutcome` and nothing renders it.** `ABC-019` computes
`{ result, reason, exitCode }` and stops (`src/turn-loop.ts:285-287`); a player sees the final frame —
a board and a status panel — and then the process ends. **The status panel shows the side to move, not
the outcome, and the history pane shows only the last 8 rows of moves** (`HISTORY_ROWS = 8`,
`src/history-pane.ts:70`). Nothing says *you were checkmated* and nothing shows the game.

*Value*: the epic's own third acceptance criterion, and the difference between a program that stops
and a game that ends. It is also the only place a **fault** — an engine that crashed — can be shown to
a player without pretending it was a chess result.

## The count, settled

**Eight game outcomes the screen names, two faults it must present as faults, and one path that gets
no screen at all.** Read off merged code, not decided:

| # | reason | value on `LoopOutcome.reason` | `result` | source |
|---|---|---|---|---|
| 1 | checkmate | `checkmate` | a win | `src/gameend.ts:41` |
| 2 | stalemate | `stalemate` | draw | `src/gameend.ts:42` |
| 3 | insufficient material | `insufficient-material` | draw | `src/gameend.ts:43` |
| 4 | fivefold repetition, **automatic** (9.6.1) | `fivefold-repetition` | draw | `src/gameend.ts:44` |
| 5 | seventy-five-move, **automatic** (9.6.2) | `seventy-five-move` | draw | `src/gameend.ts:45` |
| 6 | threefold repetition, **claimed** (9.2) | `threefold-repetition` | draw | `src/gameend.ts:48` |
| 7 | fifty-move, **claimed** (9.3) | `fifty-move` | draw | `src/gameend.ts:48` |
| 8 | resignation | `resignation` | a win | `src/turn-loop.ts:81` |

**Plus two that are NOT chess outcomes and must never be shown as one** — `engine-failure` and
`engine-threw` (`src/turn-loop.ts:82-83`), both arriving with `result: null`. `ABC-019` `A10` states
the rule this ticket inherits: *"a result screen can never present an engine bug as a chess outcome"*.

**Plus one path with no screen at all**: end of input, `{ result: null, reason: null }`. The loop has
already written `INPUT_ENDED_NOTICE` and there is no game to report (`ABC-019` `A8`).

**Why the epic's acceptance criterion said six and is now amended to eight.** FIDE distinguishes a
draw a player *claims* from one that arrives automatically, so `ABC-020` split repetition into 9.2 /
9.6.1 and fifty-move into 9.3 / 9.6.2. **A screen that says "draw by repetition" without saying whether
anyone claimed it is under-reporting what happened in the game** — the epic's own words, and `A2`
below is what enforces them. **The ninth reason QE flagged (a draw offer) does not exist**: no epic's
scope contains a draw-offer command and none is cut. Eight stands until one is.

## Scope

- **One new module, flat in `src/`, that renders a result screen as rows** — a pure function of
  `LoopOutcome` and `GameHistory`, returning `readonly string[]`. It derives no game state.
- **Its wiring into `ABC-043`'s entry point**, written in the same ticket. See
  `## Why the wiring is in this ticket and not a follow-up`.
- **The full move list**, in SAN, in move-number pairs — every ply of the game, not the pane's
  last 8 rows. It is produced the way `renderHistory` produces its window: parse `initialFen`, replay
  forward, `toSan(position, move)` before each `makeMove`.
- **The screen is NOT a frame** — it is written after the final frame, through the same `FrameSink`,
  in **one** write. It has no constant height, it is not bounded by `MESSAGE_ROWS`, and it does not go
  through `assembleFrame`'s width padding. `INPUT_ENDED_NOTICE` is the merged precedent for a non-frame
  write to the sink (`src/turn-loop.ts:313`).

## Why the wiring is in this ticket and not a follow-up

**A renderer merged without a caller is the fifth module in this repository that only tests can
reach, and the first four are the entire reason this epic was raised `P2` → `P1`.** So the ticket that
adds the module also adds its call site. **This is a rule with one deliberate exception in this epic:**
`ABC-041` ships without its caller because its caller (`ABC-042`) is cut, `P0`, and the very next pull.
`ABC-043` — this ticket's caller — is **blocked**, so the exception does not apply and this ticket
must not merge ahead of it.

## Out of scope

- **Sanitizing anything.** Every string on this screen is generated by this product from merged
  values; no player-typed byte reaches it. *(If that ever changes, the sanitizer is `src/frame.ts`'s
  and this module must route through it.)*
- **`play again?` / restarting** — `ABC-046`'s `new`.
- **A PGN export or a saved file** — the epic's own negotiable slice, and it is **not cut**.
- **Deciding the exit code** — `ABC-043` owns it, and this ticket asserts it rather than choosing it.
- **Changing `src/gameend.ts`, `src/turn-loop.ts` or `src/history-pane.ts`.** The reason set is read
  from them.

## Acceptance (Given/When/Then)

`A1`–`A5` are pure-value assertions with **no process and no TTY**. `A6`/`A7` drive the delivered
entry point over pipes.

- **`A1` (all eight, each named, each distinct).** **Given** a constructed `LoopOutcome` for each of
  the eight reasons above, **then** the screen names that reason, and the eight strings are
  **pairwise distinct** — asserted as a set of size **8**, not by eight independent contains-checks.
- **`A2` (claimed and automatic are distinguishable — the epic's amendment as a criterion).**
  **Given** `threefold-repetition` and `fivefold-repetition`, and again `fifty-move` and
  `seventy-five-move`, **then** each pair's two screens differ by more than the rule's name: **the
  claimed one states that a player claimed it and the automatic one states that it was automatic**,
  and neither string is a substring of the other. **The discriminating requirement:** a build that
  prints "draw by repetition" for both passes `A1` and fails this.
- **`A3` (a fault is never a chess outcome).** **Given** `engine-failure` and `engine-threw` with
  `result: null`, **then** the screen (i) contains **none** of the eight reason strings from `A1`,
  (ii) contains none of the words `win`, `wins`, `draw`, `checkmate`, `stalemate`, and (iii) states
  that the game did not finish. *(`ABC-019` `A10`, as a criterion rather than as a comment.)*
- **`A4` (end of input gets no screen).** **Given** `{ result: null, reason: null }`, **then** the
  module produces **zero rows** and the entry point writes **zero bytes** for it. *(The loop has
  already written `INPUT_ENDED_NOTICE`; a second line would double-report.)*
- **`A5` (the full move list, exactly, in order).** **Given** a `GameHistory` of **≥ 40 plies**,
  **then** the screen carries exactly `history.moves.length` SAN tokens, in play order, each
  **byte-identical** to `toSan(positionBeforeThatPly, move)` on a fresh replay from `initialFen`, and
  the move numbers run `1.` upward with no gap. **And given a history that starts from a black-to-move
  `initialFen`**, the first pair is numbered and elided the way a chess move list is
  (`src/history-pane.ts`'s merged rule, read not re-invented). *(A ≥ 40-ply case is required because
  the history pane shows 8 rows: a 16-ply game cannot tell the full list from the pane.)*
- **`A6` (it reaches the player, after the last frame, in one write).** **Given** a scripted game
  driven to checkmate through the entry point with stdout a pipe, **then** the emitted stream ends
  with the result screen, it appears **after** the final frame's last row, the module emits **zero**
  ANSI CSI sequences of its own, and the process exits with the loop's `exitCode` verbatim (**0**).
- **`A7` (nothing else changed).** `git diff --numstat` shows this module, its test file and
  `ABC-043`'s entry point, and **nothing else** — `src/gameend.ts`, `src/turn-loop.ts`,
  `src/history-pane.ts`, `src/frame.ts` **byte-identical**. Suite green, skip **0**.

## Dependencies

- **`ABC-043` must land first — OPEN, and it is blocked in turn.** This ticket's wiring has nowhere to
  attach until the session runs. **It must not merge ahead of it** — see
  `## Why the wiring is in this ticket`.
- **`ABC-020` is MERGED** and is where the eight-reason set is read from; **`ABC-019` is MERGED** and
  publishes `TerminalReason`, `FinalResult` and the `A10` rule; **`ABC-013` is MERGED** and publishes
  `toSan`.
- **`EPIC-004` is NOT a dependency.** The two fault reasons are `ABC-019`'s merged values, and this
  ticket renders them without an engine existing.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol.
- **`NFR-002` — not triggered, and `A6` and `A7` are what hold it.** The screen is not a frame, it is
  produced **once per game** rather than once per ply, and `src/frame.ts` is byte-identical. **This
  module is NOT a frame producer and must NOT be added to the probe's declared root list**
  (`ADR-0011` clause 2) — stated so the count moves deliberately in both directions.
- **`ADR-0011` census: this adds one production module**, on the entry point's side of the graph, not
  the frame path's.
- **Cost of the replay, priced rather than assumed:** `A5`'s move list is an `O(plies)` replay — the
  same shape as `renderHistory`'s, ~46–50 µs at 120 plies (`src/history.ts:13-15`) — and it runs
  **once, after the last ply**. It is not on any per-ply budget.
- **Security: not triggered.** No outside input reaches this module, it spawns nothing and opens
  nothing. **Firing threshold, falsifiable:** it fires if any string on this screen is ever derived
  from a player-typed byte, or if the diff adds a runtime dependency or a Node builtin.

## Test notes

1. **Assert the eight as a SET of size 8** (`A1`). Eight independent contains-checks pass on a build
   that prints the same string twice.
2. **`A2` is the criterion the epic's amendment was written for.** Assert the non-substring property,
   not just inequality: "draw by repetition" and "draw by repetition (claimed)" are unequal and still
   wrong.
3. **`A5` needs ≥ 40 plies and one black-to-move anchor.** Both are cheap and both catch a real class
   of error the pane's own tests cannot.
4. **Build the `LoopOutcome`s by hand for `A1`–`A4`.** Driving eight real games to eight real
   terminal conditions is expensive and tests `gameend.ts`, which is already `Done` and mutation-tested.
5. **`A6` shares `ABC-042`/`ABC-043`'s spawn harness.** Do not build a third one.

## Lane cost — how many test FILES this ticket implies

**One, median-weight.** A single `*.test.ts` beside the new module for `A1`–`A5`; **`A6` and `A7`
extend `ABC-042`'s existing entry-point file and add no file.** No `vi.mock`, so **no
`*.nfr.test.ts`**. ≈ **160 ms CPU**, **≈ 1.2% of the 13 s clause** (arithmetic over the published
floor, not a new measurement).

**Weight:** pure functions over hand-built values, one ≥ 40-ply replay costing tens of microseconds,
no corpus and no spawn of its own. **Median-weight or lighter** — the QE gap routed to BA/PM
(mean 309 ms vs median 94.2 ms) is discharged for this file by construction.

## Size and priority rationale

**Size `S` (2).** One pure renderer, one call site, ten enumerated cases and one replay that copies a
merged pattern. No state, no async, no I/O of its own, no open design decision — the one decision it
needed (the reason count) was a **read** of merged code and is settled on this page.

**Not `XL`. The split line if it moves:** **(a)** the reason vocabulary — `A1`–`A4`; **(b)** the move
list — `A5`. Part (a) is `XS` and ships alone.

**Priority `P1`.** The epic's third acceptance criterion depends on it, and without it a finished game
just stops. **Not `P0`:** `ABC-042` and `ABC-043` are both ahead of it and it cannot merge before
`ABC-043`; a game that ends without a screen is worse than one nobody can start, but only after
somebody can start one.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 8 of 10 clean, 2 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** every player at the end of every game; the loop returns an outcome nothing renders, and the pane shows 8 rows of a possibly 120-ply game — both read from merged code |
| 2 | scope and out-of-scope clear | **✅** one module plus its call site, the screen explicitly **not** a frame; five fences, including PGN and save/resume named as the epic's uncut negotiable slice |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: `ABC-043` must land first, and this ticket deliberately refuses to merge ahead of it |
| 4 | acceptance testable and measurable | **✅** seven criteria: a set of size **8**, a non-substring property on two pairs, a word-list exclusion, **zero rows** on the EOF path, `moves.length` SAN tokens byte-identical to a fresh replay at ≥ 40 plies, **zero** CSI sequences, exit code verbatim |
| 5 | dependencies known | **✅** one open (`ABC-043`, itself blocked); three merged tickets named as the sources of the reason set, the types and `toSan`; `EPIC-004` named as **not** a dependency |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` not triggered with the probe-root consequence stated in both directions; the replay priced at ~46–50 µs once per game; security not triggered with a falsifiable threshold |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` (2), with the split line named |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️** **one ordering dependency is OPEN and is itself blocked** — `ABC-043` waits on `ABC-037` and on an `EngineSeam` that does not exist. **The question this ticket was cut to answer — the reason count — is SETTLED, not open** |

## Amendment — 2026-10-12 (delivered by `ABC-095`'s diff): (N) confirmed, no Given changes

BA/PM (task `wave-2026-09-25`, subtask `bapm-amend-ABC-095`), at `main` `85e9d5cc`. **This page stays
`Done`, and no criterion's text changes.** `ABC-095`'s diff moves the engine double in the children
that this page's two `src/cli.test.ts` rows read, from `./engine.ts` to `./book-engine.ts` (`withBook`).
That is `ADR-0037` § Addendum — 2026-10-12 R2. Reasons: `.grugops/context/bapm-amend-ABC-095/notes/`.

- **`A3`.** Its Given, "`engine-failure` and `engine-threw` with `result: null`", does not change. The
  row reads `ABC-043` `A5`'s two children (`engineThrows`, `engineForeign`). (N) is confirmed on
  `ABC-043`'s page: the same `EngineSeam` at `engine:`, the screen produced by product code, one seam.
  With the book wired and the old double, the "did not finish" screen went missing, because the fault
  was never reached (`…ef39c9a6`).
- **`A6`.** It reads `ABC-043` `A2`'s `mate` child, "a scripted game driven to checkmate". That Given
  stipulates the scripted opponent, so (N) is confirmed and unchanged. The re-target also closes the
  40 % flake the book would have put on this row.
