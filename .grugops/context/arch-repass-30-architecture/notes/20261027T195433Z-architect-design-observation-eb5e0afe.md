---
id: 20261027T195433Z-architect-design-observation-eb5e0afe
kind: observation
by: architect-design
at: 2026-10-27T19:54:33Z
verified_by: 
confidence: high: read-only parse and git reads at c383f8f0; calibration reproduced the 2026-08-12 figures exactly
refs:
  - EPIC-008
  - ABC-207
  - ABC-208
  - ABC-209
  - ABC-210
  - ADR-0011
  - ADR-0024
  - ADR-0025
  - ADR-0027
  - ADR-0029
  - ADR-0050
  - ADR-0051
  - NFR-002
  - NFR-008
  - memory-bank/30-architecture.md
  - orch-2026-10-27m/20261027T194139Z-orchestrator-decision-64925a53
  - bapm-s1-ABC-210/20261027T194008Z-ba-pm-decision-ff16a93d
  - arch-records-arch-snapshot/20261026T042539Z-architect-design-observation-cdc1fb61
  - grugops/arch-repass-30-architecture
  - c383f8f0
  - 4ab6f2f9
  - 9236f4e7
  - b5c67ab7
supersedes: 
seal: sha256:7f4b40489c3c4c882505870137cc8b2ca6c75602a460c61edc0ebe2d14c82d3f
---

# Architect/Design: how the `30-architecture` re-pass measured `main` `c383f8f0`, and two INFO items. Nothing is owed

All readings are read-only on `main` `c383f8f0`; nothing was run, built or timed.

## Method
- A scratch script parsed every non-test `src/*.ts` with the TypeScript parser (`createSourceFile`, a library
  read, no `tsc` run). It counted `import`, `import type` and `export … from` edges.
- **Calibration:** on `9236f4e7`'s `src/` the same script gives 17 modules, 49 edges, 12 type-only, 37 run time,
  depth 8, `position.ts` fan-in 11 and five zero-importer modules. Those are the 2026-08-12 page's figures exactly.
- **At `c383f8f0`:** 46 modules, 175 edges, 48 type-only, 127 run time, 0 cycles, depth 11 (10 at run time).
  There are no dynamic imports and no `export … from`. `position.ts` fan-in is 23 (18 at run time); `moves.ts`
  is 21 (7). Zero importers: 7. Leaves: 5.
- **Entry closures (run-time edges):** `cli.ts` 38, `uci.ts` 18, `perft-bench.ts` 7, union 42. Five core
  modules are in all three. The union is the same with type edges included.
- `history.ts`'s run-time importers are exactly `turn-loop.ts` and `cli.ts`, which matches `LICENSED_DRIVERS`.
  `render-seam.ts` is `COMPOSITION_ROOT`.
- Three modules import a `node:` builtin. `process` is read in code by the three entries and `glyph-mode.ts`.
  No production module imports `worker_threads`.
- `grugops/ABC-208` `2e9eb9a7` is an ancestor of `main`. `grugops/ABC-207` `5477df21`, `grugops/ABC-209`
  `bb6cf451` and `grugops/ABC-210` `a96f36b0` are not.
- `search.ts` and `engine.ts` have 0 check-extension matches. `clearTable()` is called per search in `engine.ts`
  and `search.ts`. `evaluate.ts` has one `MOBILITY_WEIGHT`.
- A cell-by-cell cross-check of the page table against the measurement found 0 mismatches over 46 rows. The
  page cites 32 ADRs, and all of them resolve.

## INFO (no route needed)
1. `ADR-0027` decision 4 says harnesses (`ABC-084`, `ABC-085`, `ABC-087`) import the clock "outside any test
   file". As built, those harnesses are test files (`puzzle-suite.test.ts`, `ladder.test.ts`,
   `levels.test.ts`). The clock module itself does sit outside a test file, which is the rejected alternative's
   point. The page records the as-built fact; the ADR is not edited. Class: records, INFO. Count: 1.
2. The three corpora call themselves TEST-ONLY, yet `ADR-0011` clause 1 counts them as production modules.
   That is consistent: `ADR-0011` itself separates "production module" from "in scope". Class: wording, INFO.
   Count: 1.
