---
id: 20261010T143605Z-software-engineer-observation-abc131-margin-one-reading-w9-row-de48f703
kind: observation
by: software-engineer
at: 2026-10-10T14:36:05Z
verified_by:
confidence: high
refs:
  - ABC-131
  - ADR-0034
  - RISK-003
  - ABC-127
  - ABC-126
  - ABC-083
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-131`: 0.8x holds with one clock reading to spare; `W9` reads 44, not 45

Hand-authored, no seal. Every run was out of tree, in a copy of the delivered tree whose only change was
`stepMs` in the copied baseline. The worktree's `git status --porcelain src` was empty after each run.

**Margin (for Security/NFR's `RISK-003` figure, `UNKNOWN - verify` until now):**

| stepMs | nominal readings | readings with `now() < 25` | solved | NEWLY-MISSED |
|---|---|---|---|---|
| 1 | 1x | 24 | 54/58 | 0 |
| 1.25 | 0.8x | 19 | **54/58** | **0** (`A3`) |
| 1.3 | 0.77x | 19 | 54/58 | 0 |
| 1.35 | 0.74x | 18 | 51/58 | 3: seeds **1**, **69**, **1163** |
| 1.4 / 1.5 | 0.71x / 0.67x | 17 / 16 | 51/58 | the same 3 |

`virtualClock` advances one step per reading, and the loop runs while `now() < deadline`. So steps 1.25
and 1.3 are the same 19 readings, and the first loss is at 18 readings. **The 0.8x promise holds with one
reading of slack.** The tightest retained rows are mate-in-3 seeds 1, 69 and 1163. They are lost at
−26 % nominal readings (−25 % counted as 18/24). This matches the page's "about 25 %". It is not
more than that, so an `ABC-083` term that grows the tree by more than about 20 % should be expected to
red these three rows first.

**`A4` measured on the re-cut tree:** 14/17 red. Survivors: 7 of 10 red (`W1`, `W1b`, `W2`, `W4`,
`W5`, `W13`, `W16`). Green: `W10`, `W11` and `W14`. This is exactly the computed expectation.
**One per-row count differs from the cut's recount** (`drop-recount.out.txt`): `W9` reads **44/58**,
against 45 recounted. The extra miss is `discovered check: the bishop moves, Rxd8`, a row `ABC-126`
re-authored after QE's `ABC-127` per-row files were taken. The recount ran on pre-`ABC-126` rows.
Every other red's solved count equals the recount. `W9` was red either way, so the verdict does not move.
Raw: `raw-a4-weakenings.jsonl`, `raw-sweep-step*.txt`, `raw-a3-step1.25.txt`.
