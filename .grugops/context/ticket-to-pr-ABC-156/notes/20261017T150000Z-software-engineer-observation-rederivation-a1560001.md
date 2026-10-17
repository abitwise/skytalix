---
id: 20261017T150000Z-software-engineer-observation-rederivation-a1560001
kind: observation
by: software-engineer
at: 2026-10-17T15:00:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-156
  - ABC-156
  - ABC-039
supersedes:
---

# What was re-derived, and from what

- The `## Chronology` table in `plans/tickets/history/backward-move-ordinals.md` has 15 rows. All 15 commits pass
  `git merge-base --is-ancestor <c> 3215004c`. `uniq -c` by ticket gives 009 1, 011 1, 016 2, 017 2, 019 3,
  025 1, 027 1, 028 3, 029 1. That is 9 tickets and 15 moves, and 15 / 25 = 0.60.
- The five disputed moves were checked by the `plans/board.md` section before and after each commit. All five
  go to `In Development`: `5d387e60` In Review (017), `e22ed720` In Security/NFR (017), and `9e7d9ab7`,
  `8cc4d8c3`, `c6ea796d` In Review (019).
- **Done order.** For every commit up to `3215004c` that touches `plans/board.md`, the ticket ids under
  `## Done` were diffed. First entries, in order: 001/002/008, 003, 004-007, 020, 011, 012, 014, 015, 018, 009,
  022, 023, 013 (out at `47b5b935`, back at `995d398d`; its place does not change), 025, 016, 027, 017, then
  019/028/029 together at `0ee148ef`. The `Done` list order at `3215004c` agrees.
- The last ten have 7 bounced tickets and 13 moves. The first ten have 1 and 1 (`ABC-011`). The middle five
  have 1 and 1 (`ABC-009`). 13 + 1 + 1 = 15.
- `git diff --numstat ac7d9589 -- src/ memory-bank/ plans/`: `plans/metrics.md` 2/1, this ticket page with
  additions only, `plans/traceability.md` 1/0.
