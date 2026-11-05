---
id: 20261104T211909Z-software-engineer-decision-8fb36960
kind: decision
by: software-engineer
at: 2026-11-04T21:19:09Z
verified_by: 
confidence: high: the forced-form read and the own-phase read are both run outputs; the two deviations are the Engineer's and QE grades them
refs:
  - se-ABC-301-s0
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - E2
  - E4a
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - B-T1
  - NFR-008
  - R-N8H-1
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-4917f0f7
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-d0f7af61
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-2608eabc
  - orch-2026-10-30a/20261104T162502Z-orchestrator-decision-264e420e
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - grugops/ABC-301
  - 57e942fb
  - df7d07a2
  - src/evaluate.passer.test.ts
  - tools/tune/tracer.ts
  - tools/tune/tune.ts
  - tools/tune/tune.test.ts
supersedes: 
seal: sha256:0c89b78862aa10a444fd29738be3a4b12d8494dd3886abcef45dab5251cfa23c
---

# se-ABC-301-s0 decision: scope 0 built test-and-tool only. P1's row runs each fixture at its own phase, because the forced phase-0 form reads 31 of 44; the tracer row reads the seam through QE's frozen record, because no tools/ file may name it; E4a's terms enter the tool with no fit parameter

Software Engineer, task `se-ABC-301-s0`, on `grugops/ABC-301` from `main` `bbd0d54a`. Two deviations from the written form follow. Neither loosens a bar, and QE grades both.

**1. P1 / `QE-271-h`: the written form is not true of the build, so the row takes a stronger form.**
- The ticket's P1, `ADR-0070` d4's dated line and `…d0f7af61` all read: white-POV `evaluateAtPhase(p, 0)`, minus the same at the shipped values, equals the seam's white minus black, exact on 44 / 44.
- Run as written it reads **31 / 44** (`raw/forced-phase-probe.out`). All 13 misses are ± 400 exactly, on fixtures of phase 1–5 whose square holds. `passerTerms` fires U on the phase ARGUMENT, and the seam reads `phaseOf(position)`. So forcing phase 0 fires U on the hot side only. The 14 phase-0 fixtures all hold. The build is right: `evaluateAtPhase` documents that its phase must be `phaseOf(position)`, and the form breaks that contract.
- The row instead runs each fixture at its OWN phase k: live = mg + trunc((D + e) × (24 − k) / 24), with mg and D read at the shipped values and e the seam's move between the two tables. That is QE's own hot-row identity (`…2608eabc`), and at k = 0 it is the ticket's equation. It is exact on 44 / 44 at the full probed values, U included. It holds no tolerance.
- Rejected: holding U at 0 on the phase > 0 fixtures. That keeps the forced call and reads 44 / 44, but it cannot see a hot path that fires U off phase 0. The own-phase form kills that mutant (H1).
- e is the difference of two seam reads, not the probed read alone, so the row stays true after the fit moves the shipped E4a values. Today the shipped read is 0.

**2. The tracer row (`ADR-0067` d5's line) reads the seam through QE's frozen file.** d5 says the row compares with `passerTermsForTest` inside `withParametersForTest`. `ABC-274` S3 bars any tools/ file from naming the second seam, and P2 bars any tools/ file from calling the first. So the row in `tools/tune/tune.test.ts` compares with the frozen `seam` and `features` of `src/evaluate.passer-fixtures.json`, which the default lane's K1 (c) row holds to the live seam. The chain is one hop longer and nothing is unchecked.

**The tool's shape.**
- Terms are appended after `T_OPENQ`: `T_KE` 403, `T_KO` 409, `T_FP` 415, `T_UN` 421, `N_TERMS` 422. No existing index moves.
- Per d5 no mg feature is traced; `tableOf` reads the eg halves only, as `src/evaluate.ts` does.
- The trace does not repeat the skip at w = 24: the eg weight is 0 there, so the term adds exactly 0.
- `makeCfg` is unchanged, so the new terms have no parameter and any fit holds them at the base value. Freeing KD and FP is scope 3. The bound-set enumeration is scope 1. Neither is built here, by the brief.
- "13 exports become 17" is read as the value exports (`canonicalValues`). The file has 20 `export const`, the other three being `PHASE_WEIGHT`, `PHASE_MG` and `PHASE_EG`, as on `main`. The row checks both counts.
- The four exports' comments are `main`'s, byte for byte, because `ABC-271`'s comment row pins the prior text. One header line gains E4a's held halves, and the base-table line names E4a at 0.

**P2.** The row keeps its place and gains the second name, a recursive walk of `tools/`, `spike/` and `scripts/` (absent today, read if it appears), `package.json`, `vitest.config.ts`, and a count in `src/evaluate.ts` of each seam's call form, which must be its definition only. `tools/` is read whole, test files too: the ticket's "any tools/ file" is stricter than the brief's "outside test files", and it holds.
