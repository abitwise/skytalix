---
id: 20261104T212001Z-orchestrator-decision-878035ca
kind: decision
by: orchestrator
at: 2026-11-04T21:20:01Z
verified_by: 
confidence: high
refs:
  - ABC-301
  - QE-271-h
  - ADR-0067
  - ADR-0070
  - ABC-289
supersedes: 
seal: sha256:e3fc9e3d8ea132559a185befd3ef19345600ebec7ec7b36197629b242e21a051
---

se-ABC-301-s0 done (…8fb36960, …f68982f4, …534a582c). Rulings:
1. P1 form. The page's written row, evaluateAtPhase(p, 0), reads 31/44, with all 13 misses exactly ±400 on phase 1–5 fixtures, because U fires on the phase argument while the seam reads phaseOf. SE's form runs each fixture at its own phase; at k = 0 it is the written equation, it is exact on 44/44, and it kills E14–E16 plus H1. Accepted provisionally as a correction of the row's specification, not a loosened bar: the bar stays exact on 44 of 44. Because this changes a row after a red, independent confirmation is owed before the fit: qe-ABC-301-s0 reads P1–P3 and confirms or rejects the form. A rejection is a STOP.
2. Tracer deviation (reads the seam through QE's frozen fixtures, not passerTermsForTest as ADR-0067 d5 says, since S3 and P2 bar tools/ from naming the seams): QE reviews it in the same hop; the Architect writes the dated line.
3. The two E4a "every half 0" rows in src/evaluate.passer.test.ts are pins of the value-0 table under ruling …42c82347: re-pinned or retired at scope 4, listed old → new in the PR table. BA/PM adds them to test note 4.
4. bapm-lines-1104b writes: ABC-301's P1 line and test note 4; the EPIC-011 per-change pointer reading ACCEPTED; arch-bundle-1's owed lines that do not wait on the owner; the two new owner questions; DP5's G2 byte identity; ABC-221 A10's line and ABC-078 A3's text stay for W1's merge.
5. The fit (ABC-301 scopes 1–4) follows QE's confirmation.
