---
id: 20261019T190000Z-software-engineer-decision-abc173-lightened-rows-and-steps-a7c3d910
kind: decision
by: software-engineer
at: 2026-10-19T19:00:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-173
refs: [ABC-173, ABC-170, ABC-167, ADR-0008]
---

# `ABC-173`: the coverage-timeout rows go to coarser virtual-clock steps (owner `…6e1d9b47`), commit `48842a1f`

Hand-authored and unsealed (no `context-io.ts`). This is test-only: heap rows, flags and the 5 s timeout are unchanged.
Node counts come from a scratch census: `deepen`'s return was instrumented to log nodes per test, over the whole
default lane. Every count is in nodes, not time.

| row | step | nodes per row, before -> after | the wrong build it targets, still rejected |
|---|---|---|---|
| `ABC-170 A3` startpos | 1 -> 5 | 90 154 -> 12 330 | QE's M15 (an extra clock read only when `maxNodes` is absent): all 6 rows red under vitest at step 5; the correct build 6/6 green |
| `ABC-170 A3` kiwipete | 1 -> 5 | 95 412 -> 17 588 | same |
| `ABC-170 A3` position-3 | 1 -> 5 | 88 092 -> 10 268 | same |
| `ABC-170 A3` position-4 | 1 -> 5 | 93 080 -> 17 304 | same |
| `ABC-170 A3` position-5 | 1 -> 5 | 92 288 -> 14 464 | same |
| `ABC-170 A3` position-6 | 1 -> 5 | 93 490 -> 17 032 | same |
| `ABC-167 A5` movetime 100 | 1 -> 10 | 96 277 -> 6 165 | M01–M11 + three `movetime` wrong builds (ignored -> 3000, minus overhead -> 50, halved -> 50): the per-row kill sets are identical at step 1 and step 10. Step 100 would admit the two W = 50 builds (\|50 − 100\| ≤ 200), so 10 is the coarsest step in BA/PM's set |

**Same-profile candidates, NOT changed (reported):**
- **`ABC-167 A5` "white reads wtime"** (45 077 nodes, step 1). At step 10, M01 (`/19`, G 52) falls inside 50–70, so
  the row loses discrimination.
- **`ABC-167 A5` "black reads btime"** (40 991 nodes, step 10). At step 100, M01 (G 473) falls inside 450–650.
- **`ABC-167 A6` `go infinite` until stop / until ponderhit** (76 863 nodes each: 3 searches at step 100). These are
  already at the coarsest step in BA/PM's {1, 10, 100}. A coarser step needs BA/PM's word.
- **`ABC-167 A7` `go depth 3`** (55 972 nodes, step 50). Its precondition is that an unlimited `go` reaches depth ≥ 5,
  and a coarser step was not shown to keep it.

**Hunk sizes:** `src/uci-session.test.ts` changes one line (`ABC-171` also edits this file, at lines 6–113 and after
527, with no overlap). `src/engine.test.ts` changes two values plus a comment.

**Records that read "step 1" and now differ:** the `ABC-170` page's `A3` Given ("on `tickingClock(1)`"), and BA/PM's
"Step 1 stays in the unamended `A5` rows" (`…5c7a1e30`) for "movetime 100". Both are moved by the owner's word, not
re-ruled here.
