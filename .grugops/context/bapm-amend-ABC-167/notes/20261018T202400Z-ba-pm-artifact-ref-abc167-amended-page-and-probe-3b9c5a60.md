---
id: 20261018T202400Z-ba-pm-artifact-ref-abc167-amended-page-and-probe-3b9c5a60
kind: artifact-ref
by: ba-pm
task: bapm-amend-ABC-167
at: 2026-10-18T20:24:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - plans/tickets/ABC-167-a-capability-free-uci-session-answers-the-d3-commands-with-the-d4-time-rule-and-the-go-limits.md
  - .grugops/context/bapm-amend-ABC-167/probe/rows.ts
  - .grugops/context/bapm-amend-ABC-167/probe/rows2.ts
  - .grugops/context/bapm-amend-ABC-167/probe/rows.out
  - 20261018T202300Z-ba-pm-decision-abc167-amendment-rulings-for-qe-167-a-to-h-7d2e41b9
supersedes:
---

# ABC-167 amended page (21 new rows) and the probe behind its figures

This note is hand-authored and unsealed.

**Where.** Branch `grugops/bapm-amend-ABC-167`, from `main` `86e8be75`. The ticket page gained dated amendment lines
under A3, A4, A5, A6, A7, A8, A9 and A11, under Security/NFR, and under DoR.

**The 21 new rows:**
- `A3-h1`;
- `A4-a1`, `A4-a2`;
- `A5-b1`–`b5`, `A5-c1`;
- `A6-d1`, `A6-e1`–`e5`;
- `A7-f1`–`f3`, `A7-h1`;
- `A9-h1`;
- `A11-g1`.

**The probe.** `probe/rows.ts` and `probe/rows2.ts` import a scratch copy of tip `4dbbfbd8`'s `src/` by absolute path,
from the session scratchpad. Nothing was placed in any worktree's `src/`, and nothing reads the wall clock.

**The step-1 readings (`time` = G + 1):**

| row | G | `time` read |
|---|---|---|
| `A5-b1` | 600 | 601 |
| `A5-b2` | 100 | 101 |
| `A5-b3` | 200 | 201 |
| `A5-b4` | 300 | 301 |
| `A5-b5` | 300 | 301 |
| `A5-c1` | 50 | 51 |
| `A7-h1` | 100 | 101 |
| `A7-f3`, the `movestogo 0` line | 50 | 51 |

**The cases the tip fails, as `rows.out` shows them:**
- `A7-f1`: `go depth movetime 100` gives `time 3010` at step 10;
- `A6-e2`/`e3`: `h8g8` is written only at the later `stop`;
- `A6-e4`: `quit` returns `"quit"` and writes no `bestmove`.

**The echo cases** contain no C0 code point: `illegal move e2e4[31m`, and `got [31m`.

**Not run:** no test run, no vitest, no build and no timing.
