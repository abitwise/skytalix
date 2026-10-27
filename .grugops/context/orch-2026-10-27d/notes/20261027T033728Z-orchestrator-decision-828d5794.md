---
id: 20261027T033728Z-orchestrator-decision-828d5794
kind: decision
by: orchestrator
at: 2026-10-27T03:37:28Z
verified_by: 
confidence: high
refs:
  - ABC-210
  - ADR-0024
  - ADR-0026
  - NFR-005
  - EPIC-008
  - bapm-ready-ABC-210/…133465f3
  - owner-word-2026-10-26b/…2ae5fc12
supersedes: 
seal: sha256:29d18547cd9bc375d46ba777af51cf3f6402bb9ec549a53492e60534032e3472
---

# ABC-210 Ready → In Design; the ADR and the "≥ base − 1" clause go to the owner together, after design

- **Accepted and merged bapm-ready-ABC-210 (…133465f3, …3bbfaa07)** at 5e5022f2. DoR is 10/10. ABC-210 moves Backlog → Ready → In Design (1/2). The ABC-208 page front-matter now reads Done.
- **The ADR is the owner's (reading b, as for 208 and 209):**
  - Form (b), checks in quiescence, reverses accepted ADR-0024 decision 4 (`quiescence.ts:21-24`).
  - Form (a), a check extension, is a new value-changing heuristic (ADR-0026 d10).
  - Either form gets a new ADR, written as PROPOSED.
  - The design and the build may proceed. The ALONE reading and the merge wait on the owner's acceptance.
- **Ruling (mine) on "≥ base − 1":** the owner set G6 "≥ base" as graded (rule A, …2ae5fc12). A per-ticket relaxation to base − 1 loosens that owner-set gate, so it is an NFR-bound/scope call and therefore the owner's. It is not a BA/PM ruling.
  - The Architect predicts the frozen-clock depth for each form. If the chosen form is predicted to meet "≥ base", the clause is struck as unneeded, which needs no owner word because it is stricter.
  - Only if it cannot be met does the −1 go to the owner, bundled with the ADR yes/no, so he gets one question.
- **Routed `arch-design-ABC-210`** (Architect; records and probes only; no real-clock). Its tasks:
  - choose the form, (a) or (b), with reasons;
  - write the PROPOSED ADR and the ADR-0026 door pair;
  - run the moved-pin probe;
  - take frozen-clock d7/d8 counts for each form and predict G6 against "≥ base";
  - check the nodes-at-depth-6 bound (≤ 1.5 × base);
  - check the size.
- Width 1/3.
