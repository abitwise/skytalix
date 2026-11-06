---
id: 20261106T204802Z-software-engineer-observation-2cddd25a
kind: observation
by: software-engineer
at: 2026-11-06T20:48:02Z
verified_by: 
confidence: high: read as run
refs:
  - ABC-291
  - ABC-282
  - ADR-0075
  - ADR-0071
  - EPIC-011
  - arch-ABC-291-stop/20261106T203245Z-architect-design-decision-2d2c2bad
  - arch-ABC-291-stop/20261106T203300Z-architect-design-observation-77dd9228
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
supersedes: 
seal: sha256:385068b6f48ddfe972a1641c7fac651dfeec7c3039b27293c88fbbddc5eb42c7
---

# se-ABC-291-repair observation: every count green at `a3474306`; no STOP line fired; § 1's literals read as written

Each run was under the host lock, one at a time, on the tree of `a3474306` (run before the commit, same bytes).

| check | result |
|---|---|
| typecheck | exit 0 |
| lint | exit 0, 148 files |
| `npm test` | 71 files, 2 790 of 2 790, none skipped (2 789 + the new row) |
| `ENGINE_DEEP` `src/uci-session.test.ts` | 270 of 270, 341.64 s |
| `ENGINE_DEEP` `src/engine.test.ts` | 105 of 105, 269.93 s |

Walls are single ungraded readings.

## The STOP lines
- **Any literal in § 1 reads otherwise:** no. All six A0-3 rows are green, so `cp 88`, `cp 99` and `nodes 10614`, which `…77dd9228` left to this run, are now read by it.
- **D3's row red:** no.
- **The new row finds another `pawnShape: true`:** no. It finds exactly search 176, 1226; engine 396, 888; `tools/tune/tune.ts` 118, 121.
- **A production line would have to move:** no. `git diff --name-only 63af973e` over `src` and `tools` lists only the three test files. Blob ids of `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/evaluate.ts` and `tools/tune/tune.ts` equal `63af973e`'s.

## The new row bites
On a scratch copy, not on the branch, with the row run alone: clean green; red on a planted `src/` file, on a planted `tools/` `.js` file, on `searchWithoutPawnShape`'s literal turned true, and on a `pawnShape: true` line just after `RULES_PAWN_SHAPE`'s closing brace. 4 of 4 red.

## Not read here
- The `D8` leak mutant `…77dd9228` asks of QE. `D8`'s one-read margin stands as the Architect wrote it.
- K0, K2, K3, K7 and the other deep lanes: § 5 says they stand, and no production line moved.
- One vitest call without `NODE_OPTIONS` was refused by `tools/grugops/heap-guard.js` before any test loaded. It is not a result, and it was re-run with the brief's spelling.
