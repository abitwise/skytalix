---
id: 20261009T165753Z-software-engineer-observation-abc082-rehop-gates-and-deep-lanes-without-and-with-row17-f32a56ca
kind: observation
by: software-engineer
at: 2026-10-09T16:57:53Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-079
  - ABC-081
  - ADR-0028
  - src/quiescence.test.ts
  - src/transposition.test.ts
supersedes:
---

# Re-hop gate and deep lanes, without and with the row-17 commit

Run on the worktree `.claude/worktrees/ABC-082-pawn-structure`, 2026-10-09 16:54–16:57Z, Apple M3.

| lane | without row 17 (commit 1's tree) | with row 17 (tip) |
|---|---|---|
| `npm test` | exit 0, 49 files, 1504 passed, 0 skipped | exit 0, 49 / 1504 / 0 skipped |
| `npm run lint` / `typecheck` / `build` | 0 / 0 / 0 | 0 / 0 / 0 |
| `test-skip-integrity.js --skip-count 0` | `No findings.` | `No findings.` |
| `SEARCH_DEEP=1` `src/quiescence.test.ts` | exit 0, **37 / 37**, 2.1 s. `A1 depth 3: losing capture chosen 0/24 with quiescence, 0/24 without` | same file, unchanged by row 17 |
| `SEARCH_DEEP=1` `src/transposition.test.ts` | exit 1, **39 passed / 1 failed** (40), 52.3 s. The red is `A2 position-6 at depth 5`: 14.46% vs ≥ 0.15 | exit 0, **40 / 40**, 56.9 s |
| default `quiescence` / `transposition`, run alone | inside `npm test` only | 29 / 29, 25 / 25 |

The A2 readings printed by the deep lane are identical on both trees, because the literal does not
feed them: kiwipete fixed d5 **15.63%** (ID 40.54%), position-6 fixed d5 **14.46%** (ID 44.98%).
They match the ruling's `…39129557` scratch readings.

The other five deep lanes were not run: no file they read changed.
