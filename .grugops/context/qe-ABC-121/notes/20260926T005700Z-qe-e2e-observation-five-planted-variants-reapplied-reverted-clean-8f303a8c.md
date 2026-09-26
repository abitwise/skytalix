---
id: 20260926T005700Z-qe-e2e-observation-five-planted-variants-reapplied-reverted-clean-8f303a8c
kind: observation
by: qe-e2e
at: 2026-09-26T00:57:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200100Z-software-engineer-observation-abc121-23-planted-variants-23-red-one-door-gap-closed-7f29f842.md
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204200Z-software-engineer-observation-abc121-default-lane-ledger-23-of-23-placement-20-of-23-proposal-17a0830d.md
---

# Five of 23 planted variants re-applied by hand in this worktree, each confirmed red in the default lane, each reverted byte-for-byte

Hand-authored, no `seal`. Applied directly to `src/search.ts` / `src/engine.ts` in this
worktree (never in the scratch-tree harness), one variant at a time: `npx vitest run --dir
src`, then `git status --short -- src` confirmed empty after each revert. `git status -- src`
is clean at the end of this note's work (see the artifact-ref note for the final check).

| variant | default-lane reading | matches build ledger `…17a0830d`? |
|---|---|---|
| `tactical` | 4 failed: `A3`'s predicate table (capture/promotion/checking/in-check rows) | yes |
| `r2` | 4 failed: `A3`'s "exactly one ply" pin (×2) + `A4` (×2, `search()` and `chooseMove`) | yes |
| `noLmrResearch` (both recursions) | 2 failed: `A4`'s two rows only, nothing else | yes — matches "`A4` ×2 only; no deep row" exactly |
| `pvsNoResearch` (both recursions) | 8 failed (`A4` ×2, `ABC-078 A3` abort ×2, `ABC-080` Scope, `ABC-081 A5`, `ABC-077 A1`, plus `search.test.ts` `A1` position-4) | yes — matches the build's default-lane count of 8 |
| `noResearch` (both recursions) | 2 failed: `A4`'s two rows only (its drift-d5 catch is deep-lane, correctly absent here) | yes |

Each mutation was the same exact-string edit `probe/mutants.mjs` names (`TACTICAL`, `R2`,
`NO_LMR_S`/`NO_LMR_E`, `PVS_NR_S`/`PVS_NR_E`, `NO_RESEARCH_S`/`NO_RESEARCH_E`), applied by hand
via the Edit tool and reverted by the inverse edit, never `git checkout`. No mutant was left
applied between runs; the full default lane was re-run green (48/1466) before moving to the
next variant and again after the last revert.
