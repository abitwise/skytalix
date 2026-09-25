---
id: 20260926T005500Z-qe-e2e-observation-repointed-rows-spotchecked-against-tree-45a9dcaf
kind: observation
by: qe-e2e
at: 2026-09-26T00:55:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T184200Z-software-engineer-observation-abc121-every-repointed-row-one-line-each-d9a84a04.md
supersedes:
---

# Re-pointed rows checked against the tree — none moved, all faithful

Hand-authored, no `seal` (no sanctioned writer on this install, `AGENTS.md`).

Reproduced the full default lane at HEAD (`312a188`): `npm test` 48 files / 1466 tests / 0
skipped, `npm run lint` clean (85 files), `npm run typecheck` exit 0,
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No
findings.`. All match the recorded build figures exactly.

Spot-checked note `…d9a84a04`'s row list directly in `src/`:

- `src/search.ordering.test.ts:438` — promotion-capture pin `261` on
  `searchWithoutPvsOrReductions`, matching row 3 exactly.
- `src/transposition.test.ts:311-343` — the G6 knight pair (row 6): both literals unchanged
  (830 / 820), `search()`'s side re-pointed to `searchWithoutPvsOrReductions`, and the
  docstring text at line 333 matches `ruling-abc121-g6`'s `…ea306e58` §4 replacement text
  **verbatim** — the G6 ruling was applied correctly, no assertion/identifier/literal changed
  beyond the sentence the ruling named.
- `src/transposition.test.ts:190-229` — the rook-ending split (row 14, decision 7's own
  example): the door (`chooseMoveWithoutPvsOrReductions`) carries the depth-10-at-160-ticks
  measurement and the `searchWithoutTable` equality; the literal `−(MATE_SCORE − 8)` (−29 992)
  stays on the shipped `chooseMove`, whose depth assertion is `toBeGreaterThanOrEqual(10)` —
  consistent with the build's claim that it now completes depth 11 at the same budget.

No bar, ratio, pin or literal found moved in any row checked. The full re-pointed-row list
(20 numbered rows plus the "deliberately not re-pointed" block) was read against `…d9a84a04`
and against `ADR-0026` decision 4/5/7's own text; every row's door assignment matches the
decision it is claimed under. No discrepancy found.
