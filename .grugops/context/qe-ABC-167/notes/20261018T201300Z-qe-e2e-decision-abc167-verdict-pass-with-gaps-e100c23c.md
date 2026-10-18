---
id: 20261018T201300Z-qe-e2e-decision-abc167-verdict-pass-with-gaps-e100c23c
kind: decision
by: qe-e2e
task: qe-ABC-167
at: 2026-10-18T20:13:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - ADR-0044
  - EPIC-007
  - NFR-008
  - QE-170-g
  - QE-167-a
  - QE-167-b
  - QE-167-c
  - QE-167-d
  - QE-167-e
  - QE-167-f
  - QE-167-g
  - QE-167-h
  - 20261018T201000Z-qe-e2e-observation-abc167-criteria-and-gates-0631b3b6
  - 20261018T201100Z-qe-e2e-observation-abc167-mutants-8bb44ca0
  - 20261018T201200Z-qe-e2e-observation-abc167-break-attempts-and-n8-lane-44fa966c
  - 20261018T193740Z-software-engineer-decision-choices-the-page-left-open-297da9e5
  - 20261018T193741Z-software-engineer-observation-readings-eb9aa161
  - 20261018T193742Z-software-engineer-artifact-ref-delivery-469c4efb
supersedes:
---

# QE `ABC-167` on `grugops/ABC-167` (tip `4dbbfbd8`, code `3dd0db1b`, base `e286526d`): **PASS_WITH_GAPS**

Hand-authored and unsealed. Nothing was committed to `grugops/ABC-167`, and nothing was pushed or merged. No defect was fixed.
**N8-LANE is OWED**: there was no quiet window, so it was not read and not estimated.

**A1–A12 are all MET** (`…0631b3b6`). The gates are green: lint, typecheck and build exit 0. `npm test` exited 0 on the first
run with 59 files and 1888/1888, and `last-run.json` has `success: true`. Integrity at skip 0 found nothing, and merge-tree is
clean. No criterion is unmet, and no gap blocks on its own. The two MEDIUM gaps are test pins that are missing or vacuous;
the behaviour at the tip is correct in both.

## The SE's five choices (`…297da9e5`), graded
| # | choice | decided by | grade |
|---|---|---|---|
| 1 | a new session starts at the start position | **ADR, implicitly.** D3's `ucinewgame` "sets the position back to the start" names the start as the session's start state. D3's `bestmove 0000` "when no position is held" reads as the refused case (A4) | decided. Unpinned (M44), so **QE-167-h INFO** |
| 2 | time-token value rules (any finite decimal; `movestogo` positive integer; unreadable → drop with `info string`) | **Neither.** D12's positive-integer rule names `depth`/`nodes`/`mate` only. D4 gives formulas, not validation | **gap, QE-167-f LOW.** Safe at the tip: negative or zero `movetime` gives d1 through the engine's degenerate-budget rule. Two gaps remain. Ratification belongs to BA/PM. The swallowing found in QE-167-f is a parser consequence of this choice |
| 3 | a held `bestmove` is written first when a new `go` arrives | **ADR.** D5 says "one `bestmove` per `go` always holds", and D3 quotes the spec's "for every go … a bestmove is needed". Dropping the held line would break both | decided. Unpinned (M15). The neighbouring edges are not decided: `position`/`ucinewgame` while held, and `quit` while held. **QE-167-e LOW** |
| 4 | `searchmoves` consumes tokens up to the next `go` keyword | **Partly.** D12/D6 say "ignored, with one `info string`", and the page's A7 row is satisfied either way. How far it consumes is not decided | **gap, QE-167-h INFO.** Behaviour-neutral for move tokens, which are unknown tokens anyway. The alternative that differs (to end of line, M23) would drop later limits, so the SE's reading is the more permissive one |
| 5 | `nps = round(nodes × 1000 / max(1, time))` | **Neither.** D3 names the field only. This is the UCI meaning (nodes per second), guarded against a 0 ms time | **gap, QE-167-h INFO.** Unpinned (M43) |

## Gap register
- **QE-167-a MEDIUM (vacuous pin, A4).**
  - **What the test misses:**
    - A4's "only printable characters" assertion and the dedicated ESC row both test a bad-FEN message;
    - `parseFen`'s message never echoes the input, so that message never contains the ESC;
    - removing the C0 filter (M29) leaves the whole lane green;
    - `probe/m29.ts` shows the ESC then reaching the output through `position startpos moves e2e4\x1b[31m` and `go depth \x1b[31m`.
  - **The fix:** the tip itself filters correctly. A row on an echoing path (an illegal move token, or a `go` value) would make
    the pin real.
- **QE-167-b MEDIUM (D4 terms unpinned, A5).**
  - **What survives:**
    - the increment (`+ i/2`): dropped, unhalved or the wrong side's (M03, M04, M06);
    - `movestogo` (M05);
    - `movetime` beating a clock (M11).
  - **Why the page cannot pin it:** its only increment row is capped at 3 000 ms, so even a row that matches the page exactly
    cannot pin the increment.
  - **The tip is correct.** On `virtualClock(1)`, `wtime 2000 winc 1000` gives 601 (G 600) and `movestogo 5` gives 201 (G 200).
  - **Owner:** BA/PM, for an amended A5 row such as `wtime 2000 btime 2000 winc 1000 binc 1000` → 600. The SE then adds the row.
- **QE-167-c LOW (A5 bound too wide on the 1 ms row).**
  - **Why the bound cannot tell:**
    - at step 1 the bound `G ≤ time ≤ G + 2` admits G = 2;
    - so the 50 ms move overhead is pinned nowhere: M02, overhead 0, gives G = min(2, 40) = 2 and passes.
  - **The floor mutants:** M09/M10 (the `max(1, …)` floor) are observationally equivalent at that step, because the engine plays
    d1 on any budget ≤ 0.
  - **The fix:** a sub-millisecond step, or a row where `t − 50` binds above 1 (for example `wtime 60` → 10), separates them.
- **QE-167-d LOW (A6).**
  - **What the ADR rules:** D4.3 says `go ponder` holds as `infinite` does.
  - **What is pinned:** nothing. The page's A6 tests only `infinite`, and M12 (ponder does not hold) survives.
- **QE-167-e LOW (choice 3's edges).**
  - **What is unpinned:** release-on-new-`go` (M15).
  - **Where the held answer goes stale:**
    - it survives `ucinewgame` and `position`;
    - a later `stop` then writes a move from the old position (`bestmove h8g8` after `position startpos`);
    - `quit` drops the held line.
  - **Why it is LOW:** the spec expects the GUI to `stop` first. The page and ADR are silent. Owner: BA/PM or Architect, as a
    ruling for `ABC-168`/`ABC-171`.
- **QE-167-f LOW (choice 2).**
  - **What is undecided:** the value rules for time tokens are not decided by the page or ADR, as above.
  - **What the parser does wrong:**
    - a keyword with no value consumes the next keyword as its value;
    - `go depth movetime 100` drops the `movetime`, and searches 3 000 ms instead of 100 ms;
    - it is one `info string`, not a crash.
- **QE-167-g LOW (A11 guard is textual).**
  - **Survives every gate:**
    - side-effect imports of `turn-loop`, `book-file`, `line-input`, `book-engine` and `level-seam` (M47–M51; `book-file` would
      give the session `fs` reach);
    - bracket access, `globalThis["process"]` and `globalThis["Math"]["random"]` (M42, M40).
  - **Survives the test, but lint catches it:** `from 'node:fs'` in single quotes, and a bare `"fs"` (M38, M41).
  - **Caught by the lane:** the `history.ts` side-effect import, through the ADR-0011 licence row (M39).
  - **The fix:** the import regex in the A11 row could match `import "./x"` and `import("./x")`. Security/NFR may want to raise
    the severity.
- **QE-167-h INFO.**
  - Choices 1, 4 and 5 are unpinned (M44, M23, M43).
  - A8's "M = ceil((MATE_SCORE − |score|)/2)" row computes over constants and exercises no module code. The module's rule is
    pinned by the A7 and A8 behaviour rows (M31–M33 killed).

## QE-170-g
- **Closed for `ABC-167`.** `go depth 0`, `go mate 0`, `go depth 2.5`, `go nodes 1` and `mate N` → 2N−1 are each pinned by a row
  that fails on a wrong build (M17, M19, M20, M21, M24).
- **The over-limit node count is covered.** At `go nodes 1` the reported count runs over the limit: 21 at the start position,
  602 on Kiwipete. That matches A7's "unless depth 1 alone took more".

## Next column
- **Recommendation for the `In Review` exit:** `In Security/NFR`, which owes the N8-LANE reading in a quiet window and reviews
  QE-167-g.
- **Then UAT:** the waiver does not apply, because production `src/uci-session.ts` is in the diff.
- **QE-167-a and QE-167-b** should be fixed or accepted before the gate. QE-167-b needs a BA/PM amendment to A5 first.
- The Orchestrator decides.
- I did not touch `plans/board.md` or `plans/traceability.md`. The trace row is in the done file.
