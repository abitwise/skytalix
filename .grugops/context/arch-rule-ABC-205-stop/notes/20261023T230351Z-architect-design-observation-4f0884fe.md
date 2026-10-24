---
id: 20261023T230351Z-architect-design-observation-4f0884fe
kind: observation
by: architect-design
at: 2026-10-23T23:03:51Z
verified_by: 
confidence: high (deterministic, reproduced the Engineer's figures exactly)
refs:
  - ABC-205
  - EPIC-008
  - ABC-121
  - ABC-081
  - ABC-083
  - ADR-0026
  - ADR-0028
  - ADR-0031
  - ADR-0034
  - ADR-0039
  - OD-205-1
  - OD-205-2
  - 4f650a45
  - bfc94880
  - f00038ef
  - grugops/ABC-205
  - grugops/arch-rule-ABC-205-stop
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-18a6a03c
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-3050b787
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:18f81a07649429b80a1e89e3c17dbadf893e5c3f097f670c3e2e235025b92a90
---

# Architect/Design: ABC-205 STOP probes. Deterministic readings on scratch copies of `src/` (never `src/`)

Base is `f47b3429` (merge-base). Build is `grugops/ABC-205` `4f650a45`. The scratchpad `rule205/` holds the scripts (`probe/s1.mjs`, `s1reuse.mjs`, `s1maxdepth.mjs`, `s1scan.mjs`, `drift.mjs`) and the outputs in `out/`. Nothing is committed. Node v26.11.1, Apple M3, shared host at load1 4–12. No timing is quoted.

## S1 (transposition `A4`, `k7/8/8/K7/8/8/8/1R6 b - - 1 1`)
- Pre-`ABC-121` door by ticks:
  - base: depth 10 at 160–220 ticks;
  - build: depth 9 at 160–170 ticks, and depth 10 at 180–220 ticks.
  - Every score is −29 992. The shipped engine reaches depth 11 on both at 160–220 ticks, also −29 992.
- `maxDepth` 9 and 10, frozen clock: door and shipped read exactly that depth and −29 992, on base and build. `searchWithoutTable` at depth 10 reads −29 992 on both.
- ±ply mutant (`storeEntry` and `entryScore` adjustment removed):
  - door −29 992 on base and build at every budget from 40 to 400 ticks, step 20;
  - by history at 160 ticks: `318c11ac` −29 994, `5b5a0a36` −29 994, `3858e3cf` −29 994; `f00038ef` −29 992, `abfc1acb` −29 992.
- Cross-ply mate reads, instrumented, at 160 and 180 ticks: base 0 and 0; build 1 and 1. No root score changes.
- Re-find scan: 287 mate-corpus positions × depths 6–10, door plain against door mutant.
  - Base: 0 cells differ.
  - Build: 1 cell differs, `8/7k/8/7K/8/8/8/R7 w - - 2 2` at depth 9 (29 993 against 29 995). The shipped result is unchanged.

## S2/S3 (pvs-lmr `A1`, 190 corpus, depth 5; `search()` against `searchWithoutReductions`, and `chooseMove` against `chooseMoveWithoutReductions` with `maxDepth: 5`)
| tree | within 25 cp (search / engine) | max (search / engine) | worst |
|---|---|---|---|
| base | 97.33 / 97.86 % | 51 / 51 | position-6/e2d2 8 → 59 |
| build | 96.79 / 97.33 % | 79 / 79 | position-6/e2d2 56 → 135 |
| scale ×1, blend + gate | 97.33 / 97.86 % | 83 / 83 | e2d2 2 → 85 |
| scale ×1, blend only | 97.33 / 97.86 % | 55 / 55 | e2d2 4 → 59 |
| scale ×1, gate only | 97.86 / 97.86 % | 87 / 87 | e2d2 2 → 89 |
| scale ×3, no taper or gate | 97.86 / 98.40 % | 107 / 107 | position-5/h1f1 −42 → −149 |
| build, `early` mutant | 93.05 / 91.44 % | 79 / 198 | position-5/c4b5 654 → 852 (engine) |
| base, `early` mutant | 91.44 / 91.98 % | 93 / 93 | position-5/c4a6 513 → 606 |

- The base and build rows reproduce the Engineer's figures exactly, and base matches `ABC-083`'s recorded 97.33 / 97.86 %, 51 cp.
- Every row has 0 mate flips, over 187 compared positions.
- `early` is `REDUCTION_MIN_DEPTH` 2 with `REDUCTION_MIN_INDEX` 1.
