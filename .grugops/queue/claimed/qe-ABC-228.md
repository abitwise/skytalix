---
subtask: qe-ABC-228
role: qe-e2e
ticket: ABC-228
ref: .grugops/context/qe-ABC-228/
branch: grugops/ABC-228 @ d9c5bcde (code 9bd3c519; base main 61d5d629); QE commits on a new grugops/qe-ABC-228 from it
width: ALONE (timing + games)
---

# QE ABC-228: freeze-review the Q-SET, read the graded G6, then A6 (the smoke pair)

## Read
- The ticket (FOLDED blocks), ADR-0053 (ACCEPTED; decisions 9 and 10), SE notes `se-ABC-228/…1f8c9d92`, `…daf5ded5`,
  `…06ece474`, `…e87dea4a`; EPIC-010 § The merge rule; how qe-ABC-230 ran.

## Do
- PREREG first, sealed and committed before any timed run or game.
- **Q-SET:** the SE wrote the 12 rows without a prior QE freeze. Review each against the ticket and the ADR, and add rows
  where the class coverage is thin. Re-run the A1 identity (new doors = base's shipped path; older doors = themselves).
- **G6 (graded by its rule):** 5 interleaved runs per build at 3 000 ms on kiwipete and position-6, median, "≥ base",
  floor 6. The SE's forecast for position-6 is 98.3 %, so the margin is thin. **On a miss, STOP before the smokes and
  report.** The Orchestrator routes (ii) (ADR-0053 d10: A9 at 4 000 ms ≤ 133 %, level 5 → 4 s). Do not apply it yourself.
- G5 (real clock), G11 per the ticket, G1, G8 (time base and head in this session), gates, deep lanes (one file at a time,
  heap flag as needed).
- **A6, the smoke pair, ALONE at `--concurrency 1`** (Orchestrator's delivery call, as in qe-ABC-230):
  `d d9c5bcde 61d5d629 <out> --budget-ms 1500 --rounds 5 --concurrency 1` and `r d9c5bcde <out> --elo 1910 --rounds 5 --concurrency 1`.
  S-1..S-4. Host: no cutechess, no foreign vitest at start (wait-clear). Thermal stop: median > 85 °C → STOP.
- Note in your verdict that the SE ran one `npm exec --offline -- vitest` (an npx-like call). Rule its severity.

## Fences
- No src/, tools/ or data/ edits. Never push, force, amend or rebase. Never merge into main. No board edits. Linters only
  via `npm run …`; **never a bare `npx` or `npm exec`**. **No host paths in any commit**, intermediate ones included.
  Scratch goes in your own scratchpad subdirectory (`qe-228/`).

## Publish
- Seal notes (task `qe-ABC-228`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell trace row
  into this brief, then move it and its claim.md to done/. If the worktree guard refuses, put the done/ move on your
  branch's tracked copy and say so.
