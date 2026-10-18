---
id: 20261018T211300Z-qe-e2e-decision-abc167-recheck-verdict-pass-with-gaps-c02ebd96
kind: decision
by: qe-e2e
task: qe2-ABC-167
at: 2026-10-18T21:13:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - ADR-0044
  - NFR-008
  - QE-167-a
  - QE-167-b
  - QE-167-c
  - QE-167-d
  - QE-167-e
  - QE-167-f
  - QE-167-g
  - QE-167-h
  - QE-167-i
  - QE-167-j
  - 20261018T201300Z-qe-e2e-decision-abc167-verdict-pass-with-gaps-e100c23c
  - 20261018T202300Z-ba-pm-decision-abc167-amendment-rulings-for-qe-167-a-to-h-7d2e41b9
  - 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30
  - 20261018T211000Z-qe-e2e-observation-abc167-rows-and-gates-ee144f96
  - 20261018T211100Z-qe-e2e-observation-abc167-mutants-92d6d4e6
  - 20261018T211200Z-qe-e2e-observation-abc167-n8-lane-owed-3f802e17
supersedes:
---

# QE re-check `ABC-167` at `6922f772`: **PASS_WITH_GAPS**

Hand-authored and unsealed. This was a lean re-check, not a redo of `qe-ABC-167`. Nothing was committed to
`grugops/ABC-167`, and nothing was pushed or merged. No defect was fixed.

**Why PASS_WITH_GAPS:**
- Every amended row exists, passes, and fails on the wrong build it names (`…92d6d4e6`).
- The gates are green: 1908/1908, `success: true`, skips 0 "No findings." (`…ee144f96`).
- Both MEDIUM gaps are closed.
- What is left: one routed LOW (QE-167-g, bracket access), one new LOW (QE-167-i), one new INFO (QE-167-j), and
  N8-LANE OWED. None of them is a wrong behaviour at the tip.

## Gap register
| gap | state | evidence |
|---|---|---|
| QE-167-a MEDIUM | **closed** | A4-a1, A4-a2 kill M29 |
| QE-167-b MEDIUM | **closed** | A5-b1..b5 kill M03, M04, M05, M06, M11 |
| QE-167-c LOW | **closed** | A5-c1 kills M02. M09/M10 **accepted** (ruled equivalent; they still survive) |
| QE-167-d LOW | **closed** | A6-d1 kills M12 |
| QE-167-e LOW | **closed** | code: release on `position`/`ucinewgame`/`quit`. A6-e1..e5 kill M15, N01–N03, N10–N12, N17. Residual order edge → QE-167-j |
| QE-167-f LOW | **closed** | code: `valueAfter`. A7-f1..f3 kill N04, N05, N16, N20, N21. Residual coverage → QE-167-i |
| QE-167-g LOW | **open, routed** | A11-g1 kills M47–M51, N18, N19. M38/M41 are **accepted** (lint catches them). M40/M42, bracket access, still survive the file and the lane. The page routes them to `In Security/NFR` |
| QE-167-h INFO | **closed** | A3-h1, A9-h1, A7-h1 kill M43, M44, M23. The A8 constants row is **accepted** (it counts for nothing) |

## New gaps
- **QE-167-i LOW (a test gap; the tip is correct).**
  - **What is pinned:** A7-f1 pins "a keyword is never a value" for the depth/nodes/mate group only, and only with
    `movetime` as the following keyword.
  - **What survives:**
    - N06: the ms tokens read a keyword as their value, so `go movetime depth 3` searches 3 000 ms at depth 5
      instead of depth 3;
    - N07: `movestogo` reads a keyword as its value;
    - N13–N15: `infinite`, `depth` or `winc` is missing from `GO_KEYWORDS`.
  - **The worst one is N13.** `go depth infinite` and `go searchmoves e2e4 infinite` then write `bestmove` at once
    and do not hold it until `stop`.
  - **The fix:** one row per group, plus an `infinite` row. For example, `go movetime depth 3` → `depth 3`, and
    `go depth infinite` → held until `stop`. Owner: the SE, as test rows, if the Orchestrator wants them before the
    gate. Otherwise accept them.
- **QE-167-j INFO.** When the GUI sends a refused `position` while a `bestmove` is held, the tip writes the
  `bestmove` first, then the `info string`. The page rules that order ("write it, then do the command"), but no
  row pins it (N09).

## Next column
- **Recommended:** `In Security/NFR`. That hop owes the N8-LANE reading in a quiet window, and reviews M40/M42
  (QE-167-g).
- **Before or at the gate:** decide QE-167-i. Add the rows or accept the gap.
- **Then UAT:** the owner's UAT applies, because production `src/uci-session.ts` is in the diff.
- The Orchestrator decides. I did not touch `plans/board.md` or `plans/traceability.md`.
