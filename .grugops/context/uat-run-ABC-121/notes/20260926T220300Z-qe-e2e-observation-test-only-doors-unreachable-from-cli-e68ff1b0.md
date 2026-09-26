---
id: 20260926T220300Z-qe-e2e-observation-test-only-doors-unreachable-from-cli-e68ff1b0
kind: observation
by: qe-e2e
at: 2026-09-26T22:03:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - src/cli.ts
  - src/engine.ts
  - src/search.ts
supersedes:
---

# Independently confirmed: the `ABC-121` test-only doors are unreachable from `src/cli.ts`

Hand-authored, unsealed. `grep -rn "WithoutReductions\|WithoutPvsOrReductions\|lateMoveReduction"
src --include="*.ts" | grep -v "\.test\.ts:"` returns matches only inside `src/search.ts` and
`src/engine.ts` (each door's own definition and doc comments) and one comment line in
`src/search.mate-corpus.ts`. No non-test file outside those two names a door.

`src/cli.ts:175`'s one engine construction is `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` — a
literal object with one key, `budgetMs`. No `pvs` or `reductions` key is present, no CLI flag
resolves to one (`src/cli-options.ts`'s closed enumeration is `--ascii` / `--unicode` / `--colour`
only), and `options` is never spread into the call. This matches Security/NFR's
`…76eb826c` finding exactly, reproduced independently rather than taken on trust.
