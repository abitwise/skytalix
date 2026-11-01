---
id: ABC-246
title: "In `uci-clock-mode`, a row pins the hard stop with an increment near the clock edge and a row pins `movetime` over a clock, so QE's HSCM and CLOCKWINSCM plants turn the lane red; one stale `src/engine.test.ts` comment is corrected (test-only)"
status: done
column: Done
size: XS
priority: P3
epic: EPIC-009
---

# ABC-246: pin `uci-clock-mode`'s hard stop and its `movetime`-first rule with two rows (QE-221-a)

> **FRONT MATTER FOLDED 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`):
> `status` and `column` read Done, as the board holds this ticket: merged `0ce5041d` (Orchestrator `46365ed0`:
> "ABC-246 Done"). The page still read an earlier column, which invites the same work twice. No other line on this
> page is changed.

> **Cut 2026-10-31 by BA/PM** (task `bapm-ABC-221-fold`, records only, at `main` `9c008db4`; nothing run). Source: QE
> gap **QE-221-a** (LOW, test strength) in `qe-ABC-221` `…8ad25906`, with the plants note `…c6f37a35`, and SE-221-g
> (INFO) in `se-ABC-221` `…7896971d`. `ABC-221` met its acceptance as worded and is Done (merged `af32f82c`). This is a
> lane gap, not a build fault: the code on `main` is right, and QE's out-of-tree oracle catches both mutants. **DoR
> 10/10.** The move to Ready and the pull order are the Orchestrator's.

## Problem

- **User:** the SE or QE who next edits `src/uci-session.ts`'s `parseGo`, and the owner, whose `cutechess-cli` match
  in `uci-clock-mode` must never lose on time (`EPIC-009` M1).
- **Pain:** two of the mode's behaviours have no row. QE's plants **HSCM** and **CLOCKWINSCM** survive the whole
  default lane.
  - **HSCM** drops the hard stop `t − 1 100` in this mode only. `ABC-221` A5's given (`go wtime 3000 btime 3000
    movestogo 1`) cannot tell the hard stop from the spread: with no increment and t ≥ 1 000 the spread never exceeds
    it, and at m = 1 the two are equal. No row in the mode sends an increment near the clock edge. The mutant hands
    1 890 ms with 800 ms on the clock (`winc 2000`), which loses on time.
  - **CLOCKWINSCM** lets a clock beat `movetime` in this mode only. No row in the mode sends both.
- **Why it matters:** the hard stop is the line that keeps the mode from losing on time. Today only
  `simple-tournament`'s rows pin the shared code, so a regression that touches only this mode's branch would leave the
  lane green.
- **Value:** the mode's two guards are held by rows, not by QE's oracle. Cost: two rows in one test file, and one
  comment. The class is `QE-220-a`'s, which became `ABC-221` A12.

## Scope

1. **Two rows** in `src/uci-session.test.ts`'s `ABC-221` block (`describe("ABC-221 — TimeMode uci-clock-mode over UCI
   (ADR-0052 D4)")`), on the stubbed `chooseMove`, reading the budget handed, as A5's and A7's budget rows do:
   - `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → **1 900**;
   - `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → **5 000**.
2. **One stale comment (SE-221-g).** `src/engine.test.ts`'s `ABC-170` A2 block says *"The ceiling, on a 1 ms step:
   about 5 000 consultations, so the clock never binds first."* That has been stale since `ABC-212` (32 000), and it is
   staler at `HARD_CEILING_MS` 60 000. The comment is corrected to a figure the SE derives at 60 000, or the count is
   dropped. The code and assertions in that block do not change.

## Out of scope

- Any change under `src/` other than `src/uci-session.test.ts` and the one comment in `src/engine.test.ts`.
  `src/uci-session.ts` and `src/engine.ts` do not change.
- **QE-221-b**, the stale `src/levels.ts` header comment ("`HARD_CEILING_MS` is the largest of them", lines 49–50).
  It is a production line, and it would void this ticket's zero-production-lines UAT waiver. It is carried in
  `ADR-0045` § AMENDMENT A3's 2026-10-31 fold line, for the next ticket that edits `src/levels.ts`'s production lines.
- Any existing `ABC-220` or `ABC-221` row: none is edited. Any other mode-specific mutant QE did not name.

## Acceptance criteria

The figures are `ADR-0052` D2 and D4: `C = max(1, min((t − 1 000 − m × 100) / m + i, t − 1 100))`, and in this mode
`movetime x` → `min(x, 59 500)`, a clock → `min(59 500, C)`.

- **A1 (the hard stop binds).** **Given** `setoption name TimeMode value uci-clock-mode`, **when** the session gets
  `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1`, **then** the budget handed is **1 900**. The spread is
  (3 000 − 1 000 − 100) / 1 + 500 = 2 400, so the hard stop 3 000 − 1 100 = 1 900 binds, and a build without it
  hands 2 400.
- **A2 (`movetime` is read first).** **Given** the mode, **when** the session gets `go wtime 900000 btime 900000
  movestogo 40 movetime 5000`, **then** the budget handed is **5 000**. `C` here is (900 000 − 1 000 − 4 000) / 40 =
  22 375, so a build where the clock wins hands 22 375.
- **A3 (the plants turn red).** **Given** QE's plants HSCM (the hard stop dropped in this mode only) and CLOCKWINSCM
  (a clock beats `movetime` in this mode only), each applied alone, **then** A1 turns red under HSCM and A2 turns red
  under CLOCKWINSCM. Both are green on `main`'s `src/uci-session.ts`. Read once by the SE out of tree and re-read by
  QE; the plants are never committed.
- **A4 (the comment).** `git diff` on `src/engine.test.ts` lists comment lines only. The `ABC-170` A2 comment carries
  no figure that is false at `HARD_CEILING_MS` 60 000, or it carries no count.
- **A5 (gates).** lint, typecheck and build exit 0. `npm test` green with 0 skips, and skip-integrity and the lane
  inventory are clean. Net rows +2. Every existing `ABC-220` and `ABC-221` row passes unedited. `G8` ≤ 10 s.

## NFR triggers

- **`NFR-008`:** two stubbed, virtual-clock rows; 0 real-clock rows and 0 real-engine rows, so no `ADR-0046` R1 census
  line beyond "0 real-engine rows" and no R2 step. The default lane stays **≤ 10 s** at load1 ≤ 8. Estimate: well
  under +0.01 s (`ABC-221`'s 30 new rows cost 39 ms in-thread; `se-ABC-221` `…af63269c`), `UNKNOWN - verify` until
  `G8` reads it.
  - `ABC-221`'s `G8` 9.84 s is inadmissible as a trigger (the Orchestrator's ruling, `9c008db4`); the clean re-read is
    at `ABC-245`'s QE hop. ~~If this ticket's own `G8` head median reads > 9.6 s on a clean host, `ABC-244`'s tranche-2
    trigger fires.~~
    *(2026-10-31, `bapm-tranche2-ruling`: **that trigger is spent.** It fired on `qe-ABC-245`'s head median of 9.82 s
    (`…af467c7b`). Tranche 2 is open (`ADR-0046` § Addendum 2026-10-31) and is cut as `ABC-248`, pulled after this
    ticket. No tranche 3 is defined, so a head median above 9.6 s here re-opens nothing. This ticket's `G8` is graded
    on `NFR-008` ≤ 10 s alone (A5), and a reading above 10 s goes to the owner (`ADR-0035` D6). The 9.7 s owner line
    and W1 start at `ABC-248`'s gate, not here. QE reports this ticket's head median, which becomes part of
    `ABC-248`'s base.)*
- **`NFR-004` / `NFR-009` / `AR-UCI-BUSY`:** no production line changes, so none moves.
- **Security (ASVS L1):** no input path.

## Test notes

1. The rows follow `ABC-221` A5's and A7's form: `session220()`, `rig221.send(CLOCK_MODE)`, `position startpos moves
   e2e4`, the `go` line, and `handed`'s `budgetMs`. A1 may also read the clock left through `replayClock`, as A5's
   first row does; the budget is the graded figure.
2. QE re-runs HSCM and CLOCKWINSCM (A3) and reads `G8`. No production line: **UAT waived** under the standing
   zero-production-lines rule (`git diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'` is empty). S2 with no
   smoke.
3. Host: `G8` runs on a clear host, never during `ABC-223`'s ALONE reading (≤ ~5 h). The order is the Orchestrator's.

## Size and priority

- **Size: XS.** Two rows and one comment, in two test files.
- **Priority: P3.** A regression guard on code that is right on `main`, in the owner's milestone 2 ("later").

## Dependencies

- `ABC-221` merged (met, `af32f82c`): the mode and its block are on `main`.
- No open ticket edits `src/uci-session.test.ts` or `src/engine.test.ts`. `ABC-245` (In Development) edits
  `src/levels.test.ts` only. No design wait and no owner question.
  *(2026-10-31, `bapm-tranche2-ruling`: `ABC-245` is Done (`2cce84e0`). `ABC-248` (tranche 2, S, P1, Backlog
  recommended Ready) also edits `src/uci-session.test.ts`, in `ABC-167`'s A4 and A5 blocks, not in `ABC-221`'s. It is
  ordered **after** this ticket, so this ticket's two rows are in its base. This ticket's scope does not change.)*

## Definition of Ready (scored 2026-10-31, `bapm-ABC-221-fold`)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ QE-221-a: two named survivors, the input that kills each, and the loss on time HSCM would cause |
| 2 | scope and out-of-scope | ✅ two rows, one comment; production lines and QE-221-b out |
| 3 | INVEST | ✅ XS; independent of `ABC-223` and `ABC-245`; testable |
| 4 | testable, measurable acceptance | ✅ exact budgets 1 900 and 5 000; each plant red; comment-only diff; gates; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-221` merged; no shared file in flight |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s (0 real-engine rows); ~~the 9.6 s tranche-2 line on a clean host~~ *(2026-10-31, `bapm-tranche2-ruling`: spent at `qe-ABC-245`; graded on 10 s alone, see § NFR triggers)* |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10.** Ready for the Orchestrator's pull; test-only, UAT waived.
