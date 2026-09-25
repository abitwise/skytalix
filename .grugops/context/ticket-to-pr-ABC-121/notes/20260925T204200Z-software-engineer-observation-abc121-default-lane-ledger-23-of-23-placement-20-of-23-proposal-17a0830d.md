---
id: 20260925T204200Z-software-engineer-observation-abc121-default-lane-ledger-23-of-23-placement-20-of-23-proposal-17a0830d
kind: observation
by: software-engineer
at: 2026-09-25T20:42:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - N8-LANE
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200100Z-software-engineer-observation-abc121-23-planted-variants-23-red-one-door-gap-closed-7f29f842.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-p4.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-ledger-placement.txt
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-ledger-placement.json
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-ledger-p4.txt
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-ledger-p4.json
supersedes:
---

# Planted variants, DEFAULT LANE ALONE: 23 of 23 red at the placement (`6c1e895`); 20 of 23 with the build's four-row proposal applied

Hand-authored, no `seal`.

## Harness (`rehop-mutants.mjs`)

- The build's 23 mutants are read out of `probe/mutants.mjs` itself, so there is one table, not a copy.
- Each mutant is applied as an exact string, asserted to match once.
- Each variant runs the whole default lane, `vitest run --dir src`, with no `*_DEEP` variable.
- An unmutated `__baseline__` run must be fully green first. Both ledgers' baselines were: 0
  failures.

**Caught in my own harness, so recorded:** the first cut copied only `src/`, and `src/cli.test.ts`
reads `AGENTS.md`. Five cli rows then went red under every mutant, which would have hidden every
survivor. The harness now copies the whole tree and demands a green baseline.

## Ledger (red rows per variant; the full row names are in the `.json` files)

| variant | placement `6c1e895` | four-row proposal (`P4`) |
|---|---|---|
| tactical / r2 / early | 4 / 4 / 4 | 4 / 3 / 3 |
| noLmrResearch / noResearch | 2 / 2 | 1 / 1 |
| gross / pvsNoResearch | 16 / 8 | 15 / 7 |
| **noLmrResearch-engine-only** | **1** (`A4` `chooseMove`) | **0 — SURVIVES** |
| noLmrResearch-search-only | 1 | 1 |
| pvsNoResearch-engine-only / -search-only | 4 / 4 | 3 / 4 |
| **noResearch-engine-only** | **1** (`A4` `chooseMove`) | **0 — SURVIVES** |
| reduces-at-root | 5 | 4 |
| ignores-in-check / -gives-check / -promotion | 1 / 1 / 1 | 1 / 1 / 1 |
| no-unmake-in-predicate | 7 (8 at the build; the seed guard left) | 6 |
| search-literal-reduction / engine-bypasses-predicate | 1 / 1 | 1 / 1 |
| door-withoutReductions-reduces | 1 (kp-vs-k guard) | 1 |
| door-pre121-has-pvs / engine-door-pre121-has-pvs | 12 / 2 | 12 / 2 |
| **engine-door-withoutReductions-reduces** | **1** (engine-doors bite) | **0 — SURVIVES** |
| **total red** | **23 / 23** | **20 / 23** |

## Per criterion, default lane, at the placement

| criterion | its variants | red in the default lane by |
|---|---|---|
| `A3` | tactical, r2, early, the four clause mutants, `no-unmake`, the two wiring mutants | `A3`'s table and source rows |
| `A4` | noLmrResearch and noResearch, each recursion alone and both | `A4`'s `search()` row and `A4`'s `chooseMove` row |
| PVS identity / doors (`ADR-0026` decision 8) | the four door mutants | kp-vs-k guard, the PVS bite, the engine-doors bite, merged re-pointed rows |
| PVS window | pvsNoResearch, each recursion | `A4` ×2, `ABC-077` `A1`, `ABC-078` `A3`, `ABC-080` Scope, `ABC-081` `A5` |
| `A1` | — | **`A1`'s own default rows (the corpus length pin) red none of the 23**, and neither did the moved seed guard. `A1`'s variants (r2, noResearch, early, pvsNoResearch) are red in the default lane through the `A3`/`A4` rows, and through `A1`'s own rows only in the deep lane. **That was already true at the build; it is not a change.** |
| `A5` | — (a "does something" pin) | unchanged: the position-3 guard stays default |
