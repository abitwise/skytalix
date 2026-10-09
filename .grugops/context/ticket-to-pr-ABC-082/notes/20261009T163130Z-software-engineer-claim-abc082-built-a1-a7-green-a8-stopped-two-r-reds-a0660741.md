---
id: 20261009T163130Z-software-engineer-claim-abc082-built-a1-a7-green-a8-stopped-two-r-reds-a0660741
kind: claim
by: software-engineer
at: 2026-10-09T16:31:30Z
verified_by:
confidence: high
refs:
  - ABC-082
  - grugops/ABC-082-pawn-structure
  - 34c9c02
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-decision-abc082-term-shape-lift-and-a4-search-row-refixtured-7040acad.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-a8-repin-ledger-and-fixture-bites-b92fa204.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-stop-two-r-levels-red-on-deep-lanes-9bdc69b3.md
  - .grugops/context/ticket-to-pr-ABC-082/notes/20261009T163130Z-software-engineer-observation-abc082-a6-cost-nfr005-depth-warn-n8lane-a00b6aaa.md
supersedes:
---

# `ABC-082` built at `34c9c02`. `A1`–`A7` green, gate green. **`A8` NOT met: STOPPED on two red class-R levels.** Result `BLOCKED_NEEDS_FIX`: Architect/Design rules

This is a claim, not a finding: no `§14-gate` verdict exists on this install. The branch is not
merged and not pushed.

## Criteria

- **`A1`–`A5`, `A7`: green** in `src/evaluate.pawns.test.ts`.
  - The mirror corpus is the 184 plus 36 unique pawn-structure FENs. 35 of them are new; the
    start position is already among the 184.
  - `A5` has 25 hand-labelled cases, with the adjacent-ahead and same-file-behind traps named.
  - `A3` and `A4` each carry an equal-material row that is red without the term (proven red
    before the term existed).
  - Before the term: 28 failed / 9 passed. After: 37 / 37.
- **`A6`:** purity green; cost 385–394 ns (≤ 1,100 met). `NFR-005` depth: no FAIL, **WARN on
  kiwipete** (`…a00b6aaa`).
- **`A8`:** ledger complete and every F mutant red (`…b92fa204`). **Two R rows red** (`…9bdc69b3`).

## Gate, in the worktree at `34c9c02`

| check | result |
|---|---|
| `npm run lint` | exit 0, 94 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0: **49 files, 1504 passed, 0 skipped**, 6.75 s, load 10.9 |
| skip count, then `test-skip-integrity.js` | 0, then `No findings.`, exit 0 |
| `host-protection.js` | exit 2: `UNKNOWN - verify` (no git remote; production environment not checked by design) |

## Engine deep lanes (`A8`'s seven)

| lane | result | wall | load1 at start |
|---|---|---|---|
| `SEARCH_DEEP` `src/search.test.ts` | 57 / 57 green | 63.8 s | 7.7 |
| `SEARCH_DEEP` `src/search.ordering.test.ts` | 38 / 38 green. `A3` d4 1.87% / 1.72% (≤ 4%); `A4` delete rule held | 171.1 s | 6.9 |
| `SEARCH_DEEP` `src/search.pvs-lmr.test.ts` | 29 / 29 green. Drift d5 98.40% / 98.93% within 25 cp, max 45 cp; mate floor 0 of 180 | 1 066 s | 8.1 → 3.3 |
| `SEARCH_DEEP` `src/quiescence.test.ts` | **36 / 37: `A1` d3 RED 2/24**. `A5` levels green: kiwipete 12.14x / 11.72x / 5.40x, position-6 6.21x / 17.86x / 2.90x; oracle pins green | 3.8 s | 7.9 |
| `SEARCH_DEEP` `src/transposition.test.ts` | **39 / 40: `A2` position-6 d5 RED 14.46%**. `A3` 60.60% / 47.97% (≤ 70%) | 74.8 s | 6.5 |
| `ENGINE_DEEP` `src/transposition.test.ts` | 26 / 26 green | 5.0 s | 4.6 |
| `ENGINE_DEEP` `src/engine.test.ts` | 33 / 33 green (wall-clock cases included) | 124.7 s | 4.5 |

## Terminal result

**`BLOCKED_NEEDS_FIX`**, reason: the stop condition (two class-R levels red). It is a ruling for
Architect/Design, not an agent-fixable failure. No self-fix attempt was spent, and no level and
no weight was moved to clear it.
