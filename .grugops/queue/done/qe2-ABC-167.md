---
done_at: 2026-10-18T21:14:00Z
branch: grugops/ABC-167 (worktree ../wt-ABC-167, untouched)
tip: 6922f772 (unchanged; QE committed nothing to the branch)
result: PASS_WITH_GAPS
---

This was a lean re-check of `qe-ABC-167` after the fix hops (`20a9fc5d`, then `6922f772`) and both BA/PM amendments.
It ran in the scratch worktree `../wt-qe2-ABC-167`, detached at `6922f772`, which has been removed. The mutants and
probes ran on a scratchpad copy whose `src/` was `diff -r`-identical to the tip. I did not touch `src/`,
`plans/board.md`, `plans/traceability.md`, `../wt-ABC-167`, `../wt-ABC-146` or any process I did not start. No
defect was fixed.

The notes are in `.grugops/context/qe2-ABC-167/` in main's working tree. They are hand-authored, unsealed and
uncommitted:
- the rows and gates, `…ee144f96`;
- the mutants, `…92d6d4e6`;
- N8-LANE, `…3f802e17`;
- **the decision, `…c02ebd96`, PASS_WITH_GAPS**.

## Gap states
| gap | state |
|---|---|
| QE-167-a MEDIUM | **closed**: A4-a1/a2 kill M29 |
| QE-167-b MEDIUM | **closed**: A5-b1..b5 kill M03–M06, M11 |
| QE-167-c LOW | **closed**: A5-c1 kills M02. M09/M10 accepted as equivalent |
| QE-167-d LOW | **closed**: A6-d1 kills M12 |
| QE-167-e LOW | **closed**: release on `position`/`ucinewgame`/`quit`. A6-e1..e5 kill M15, N01–N03, N10–N12, N17 |
| QE-167-f LOW | **closed**: `valueAfter`. A7-f1..f3 kill N04, N05, N16, N20, N21 |
| QE-167-g LOW | **open, routed to `In Security/NFR`** (M40/M42, bracket access). A11-g1 kills M47–M51, N18, N19. M38/M41 accepted (lint catches them) |
| QE-167-h INFO | **closed**: A3-h1, A9-h1, A7-h1 kill M43, M44, M23. The A8 constants row is accepted |

## New gaps
- **QE-167-i LOW (a test gap; the tip is correct).**
  - **What is pinned:** "a keyword is never a value" is pinned only for depth/nodes/mate, and only with `movetime`
    after it.
  - **What survives:**
    - N06: the ms tokens swallow a keyword, so `go movetime depth 3` searches depth 5 for 3 000 ms;
    - N07: `movestogo` swallows a keyword;
    - N13–N15: `infinite`, `depth` or `winc` is missing from `GO_KEYWORDS`. With N13, `go depth infinite` and
      `go searchmoves e2e4 infinite` answer at once instead of holding.
  - **The fix:** one row per group, plus an `infinite` row. Add them or accept the gap.
- **QE-167-j INFO.** A refused `position` while a `bestmove` is held: the release-first order is ruled by the page
  but no row pins it (N09).

## Mutants: 44 run, 31 killed, 13 survived
- **The brief's list, 17 of 17 killed:** M02–M06, M11, M12, M15, M23, M29, M43, M44, M47–M51.
- **Re-checked, 6 still survive, all as ruled:**
  - M09, M10: equivalent;
  - M38, M41: lint catches them;
  - M40, M42: they survive the lane as well; routed to `In Security/NFR`.
- **New, N01–N21 on the fix-hop code: 14 killed, 7 survived.**
  - The survivors are N06, N07, N13, N14, N15 (QE-167-i) and N09 (QE-167-j).
  - N08 is equivalent.

## Gates at `6922f772`
- lint 0, typecheck 0, build 0.
- `npm test` exit 0 on the first run: 59 files, 1908/1908, 26.48 s. A foreign vitest was running at the same time,
  so this is not a lane reading.
- `last-run.json`: `success: true`, 1908 total, 1908 passed, 0 failed, 0 pending.
- `test-skip-integrity --skip-count 0`: "No findings."
- A12: the `src` diff from `e286526d` is exactly the two files.
- merge-tree against main `702895c7`: clean.

## N8-LANE: **OWED**
- **The window check:** on MacBook-Air.local, from 2026-10-18T21:06:00Z for 180 s, in the foreground, with 181 polls.
  - No foreign vitest.
  - `oeselg-labs/platform` was in 22 polls (iTerm `pidinfo --git-state …/oeselg-labs/platform`).
  - load1 was 6.21–14.29.
- Not quiet, so nothing was timed or estimated.

## Next column
- **Recommended:** `In Security/NFR`, for the N8-LANE reading and M40/M42.
- **QE-167-i:** add the rows or accept the gap, before or at the gate.
- **Then the owner's UAT:** production `src/uci-session.ts` is in the diff.
- The Orchestrator decides.

## Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
| ABC-167 | EPIC-007 / ADR-0044 D2–D4, D12 | `grugops/ABC-167` @ `6922f772` | `src/uci-session.ts`, `src/uci-session.test.ts` | QE re-check `qe2-ABC-167`: 44 mutants 31 killed / 13 survived (brief's 17 all killed); 1908/1908, success true; skips 0 No findings; N8-LANE OWED (no quiet window) | PASS_WITH_GAPS: QE-167-a, -b, -c, -d, -e, -f, -h closed; -g open, routed to Security/NFR (M40/M42); new QE-167-i LOW (keyword-boundary rows for ms/movestogo/`infinite`), -j INFO; production → owner's UAT applies |
