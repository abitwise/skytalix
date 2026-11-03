---
id: 20261103T104220Z-architect-design-decision-f8d36d73
kind: decision
by: architect-design
at: 2026-11-03T10:42:20Z
verified_by: 
confidence: high (an addendum sealed before the run; D1-D3 figures quoted from the run output; inner split only, nothing graded)
refs:
  - arch-ABC-239
  - grugops/arch-ABC-239
  - ABC-239
  - E2
  - ADR-0067
  - arch-ABC-239/20261103T104045Z-architect-design-decision-255e9bcf
supersedes: 
seal: sha256:d85bc35a445d4a0f03e7ce53cae0083e19fb48f622eb4c921eea7afa1f586e38
---

# arch-ABC-239 PREREG addendum 2 (the last diagnostic, sealed before it runs): D4 = C-S, cross-entropy, material frozen, and box bounds read from the relation tests; inner split only; nothing graded

Architect/Design, task `arch-ABC-239`. Follows addendum `…255e9bcf`, whose D1–D3 read (inner split): D1 (squared error, free) queen 3470 / −237, so **the loss is not the cause** — the hypothesis there is falsified; D2 (cross-entropy, material frozen) 0.9952 × E1's inner cross-entropy, with dbl mg, open mg, three endgame king penalties and one mobility weight below 0; D3 (squared error, frozen) 0.9944 × CE, 0.9879 × MSE, with similar sign breaks.

## D4
- C-S, cross-entropy, K as D2's, material frozen at E1's values.
- **Box bounds** (projected Newton: after each step every bounded parameter is clamped; one at its bound whose gradient points outward is held for the next step): doubled, isolated, missing shelter, half-open and open file penalties ≥ 0 in both halves; the mobility weight ≥ 0 in both halves; every passed bonus ≥ 0; every PST scale ≥ 0. These are the sign relations the `src/evaluate*.test.ts` rows rely on. Monotone passers are reported, not enforced.
- Reports as D1–D3. This is the last diagnostic in this hop: whatever it reads, `ADR-0067` takes it as found.
