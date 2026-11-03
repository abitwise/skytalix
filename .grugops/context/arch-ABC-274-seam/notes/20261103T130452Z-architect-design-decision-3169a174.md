---
id: 20261103T130452Z-architect-design-decision-3169a174
kind: decision
by: architect-design
at: 2026-11-03T13:04:52Z
verified_by: 
confidence: high: seam and test text read from c131ecd0 by git show; rules read from ADR-0026 d2, ADR-0064 d7, ADR-0067 d5/d6; S1's arithmetic is a reading, not run (UNKNOWN - verify until the repair's rows show it); the seam's shipped-path cost UNKNOWN - verify (A5)
refs:
  - arch-ABC-274-seam
  - grugops/arch-ABC-274-seam
  - ABC-274
  - ABC-239
  - EPIC-011
  - E2-pre
  - ADR-0067
  - ADR-0064
  - ADR-0026
  - ADR-0002
  - ADR-0062
  - F8
  - A3
  - A4
  - A5
  - A7
  - A9
  - S1
  - S2
  - S3
  - Q1
  - Q2
  - Q3
  - Q4
  - withParametersForTest
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - src/evaluate-params.ts
  - c131ecd0
  - 0730e294
  - e2d99bc1
  - se-ABC-274/20261103T125734Z-software-engineer-decision-22e25cea
  - se-ABC-274/20261103T125734Z-software-engineer-observation-3219e70e
  - se-ABC-274/20261103T125734Z-software-engineer-observation-c4eedfc0
  - memory-bank/50-decisions/ADR-0067
supersedes: 
seal: sha256:aada5f5e8517a0f0fd550bfd0137d1a56450b0428af383f171476fa477822013
---

# arch-ABC-274-seam ruling: ACCEPT WITH CONDITIONS. `withParametersForTest` is an allowed test-only seam (not a door, not ADR-0026 d2's module-level hook). Three conditions S1–S3, met by one test-only Engineer repair before QE's verdict. ABC-239 does not reuse the seam. A3's stated rule suffices: QE freezes no rows, and checks Q1–Q4 instead. Written into ADR-0067 decision 8 (dated line) and F8; no bar moved

Architect/Design, task `arch-ABC-274-seam`, branch `grugops/arch-ABC-274-seam` from `main` `e2d99bc1`. It reads `grugops/ABC-274` (`0730e294`, code `c131ecd0`) by `git show` only. Nothing was run. Cites `se-ABC-274` `…22e25cea` § The A3 seam and `…3219e70e` § A3's positions, and the ticket page's `## Scope` 3–4 and A3 / test note 1.

## Why the seam is allowed
- **Not a door** (`ADR-0064` d7, `ADR-0026` d2–d3): it reproduces no older path, adds no switch, and no shipped call reads a flag or an argument for it. Scope 4 holds.
- **Not `ADR-0026` d2's rejected "module-level hook".** That was a switch the shipped recursion would read. This seam re-runs the load-time loader into the same arrays, inside one synchronous call, and rebuilds from `src/evaluate-params.ts` in `finally`. `evaluate` still writes no module state (A4).
- **Precedent in the same file:** `clearPawnCacheForTest`, `pawnCacheProbeForTest`, `VALUE_TABLES_FOR_TEST`. It tests `src/evaluate.ts` itself; the outside-`src/` route would test a model.
- **`ADR-0002`** (game-history ownership) does not govern it: nothing is added to `Position` or make / unmake.

## The price, named
- The 5 scalar terms and mobility's 4 values moved into typed arrays so the seam can refill them: about 9 typed-array reads per call where `main` read module constants. Inside A5's bar; size `UNKNOWN - verify`. Named as part of the cost, not pre-named as F8's cut.
- Scope of use: evaluation entries only inside `run`. A search under the seam is not a reading (Lazy SMP workers, `ADR-0062`, hold their own module state).

## Conditions (Engineer, one test-only repair, before QE's verdict)
1. **S1, A3 reads the table, not E1's equal halves.** A3's mobility count is (`evaluate` − `evaluateWithoutMobility`) / `MOBILITY_WEIGHT.mg`. Under the tapered entry that difference is mob_mg + trunc((Δ′ + mob_eg − mob_mg)(D − w)/D) − trunc(Δ′(D − w)/D): the mg term only while mob_eg = mob_mg (E1: 4/4, 100/100). `ABC-239` frees both halves (d6) and may edit no test (d6, B-T4), so its emitted set would redden A3's `MOBILITY_WEIGHT` / `MOBILITY_CAP` rows with no defect; an mg weight of 0 (allowed by "≥ 0") divides by zero. Fix: count m by a test counter (`squaresReached`'s rule) or via the seam with weights 1/1 and a non-binding cap; re-run the mutant for the two mobility families.
2. **S2, restore on any throw.** `loadParameters(parameters)` sits before the `try`; a loader throw leaves the arrays half-written for the rest of the file. Move it inside the `try`. One row: a throwing `run`, and a parameter object the loader throws on (cast), each throw out of the seam, and afterwards every corpus score is `Object.is` its score before.
3. **S3, source pin.** One row in the form of `src/evaluate.pawns.test.ts`'s "no non-test module under src/ imports …": no non-test `src/` file but `src/evaluate.ts`, and no `tools/` file, names `withParametersForTest`; `loadParameters(` is called at module load and inside the seam only.
- **Carry-over:** A1 / A2 / A5 / A6 read on `c131ecd0` carry to the repair head iff `git diff c131ecd0 <repair> -- src/` touches only `withParametersForTest`'s body and `src/*.test.ts`. QE may therefore seal A5's PREREG and read A5 / A6 without waiting for the repair, if the Orchestrator wants that order.

## ABC-239 reuse: no
- d5's identity gate compares the tracer with `evaluate` at the current values, which are the shipped file; after `emit` the file is the values. No seam is needed. `tools/tune/` imports no TEST-ONLY export (S3). A3 and A9 re-check the emitted set with no new row (S1 makes A3 hold). A tool needing `evaluate` at values not in the file needs a new dated decision in `ADR-0067`.

## A3's positions: rule suffices; QE does not freeze before the verdict
- Test note 1's freeze-before-build ordering was missed; a freeze now postdates the build and protects nothing more. The protection is that selection is code: a filter over frozen corpora on phase 1–23 and the test's own count, read at the shipped table, never inside the seam, so it cannot pick rows by result.
- **QE checks:** Q1 the selection reads nothing inside the seam (source read); Q2 per-family row count (≥ 3, asserted) and phase spread, reported; Q3 the mate corpus was added for a row count (`KING_FILE_OPEN` had none), the corpora are whole files in fixed order, nothing dropped; Q4 C = 24 is a multiple of D, so A3 cannot always tell one trunc over summed Δ from per-term truncs, so QE confirms by source read one `Math.trunc` over `egDelta` (`ADR-0064` d2's form). QE also confirms S1–S3 rows exist and are green, and the carry-over diff condition.
- The missed freeze is a LOW process gap, not a defect. QE may add frozen rows (added only, A7); not owed.
