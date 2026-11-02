---
id: 20261102T153742Z-ba-pm-observation-aaa39809
kind: observation
by: ba-pm
at: 2026-11-02T15:37:42Z
verified_by: 
confidence: high (files in this branch, commit bff76da1)
refs:
  - bapm-phase2-records
  - grugops/bapm-phase2-records
  - EPIC-011
  - P1
  - P2
  - P3
  - P4
  - P6
  - ABC-264
  - ABC-233
  - ABC-121
  - ADR-0059
  - ADR-0060
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - QE-264-e
  - QE-264-p2-a
  - QE-264-p2-b
  - QE-264-p2-c
  - QE-264-a
  - QE-264-b
  - RISK-EPIC011-08
  - 4d1c0616
  - 4849c4ab
  - bff76da1
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-rebase/20261102T151839Z-architect-design-observation-e4680ed2
  - arch-ADR-0060-reopen/20261102T153114Z-architect-design-decision-e17a23f4
  - arch-ADR-0060-reopen/20261102T153114Z-architect-design-observation-79be958e
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:67a491d90461f0bc86354a5d6e1d0315af8545b06efc8847087163b9d442d6b3
---

# Artifacts of bapm-phase2-records: the ABC-264 page closed as dropped, and the EPIC-011 page (top block, Phase 2 rows, the "P1, parked" stub, § Tickets row 16, the owner-question row, RISK-EPIC011-08)

## Files (branch `grugops/bapm-phase2-records`, from `main` `4849c4ab`; records commit `bff76da1`)
- `plans/tickets/ABC-264-…md`:
  - front matter: `status: dropped`, `column: Done`, a `closed:` line replacing `blocked:` (the old text is quoted in
    it), and the `adr:` line reading "NOT IN FORCE on main";
  - a top block "CLOSED AS DROPPED, NOT MERGED";
  - a dated closing line under § Definition of Ready.
- `plans/epics/EPIC-011-…md`:
  - a top block;
  - § Phases rows: P2 (dropped), P1 ("history-adjusted" struck; parked), P4 (waits with P1), P3 and P6 ("after P2"
    struck);
  - a new subsection "P1, parked (stub)";
  - § Tickets row 16 (dropped);
  - § Owner questions: the row "P1's 27 cp cap" (optional; default keep);
  - § Risks: `RISK-EPIC011-08`.

## Facts checked against sources (not re-measured)
- From `ADR-0056` D2: P1 +40–100 S–M; P2 +30–60; P3 +15–40; P4 +20–40 (depends on P1); P5 +10–30; P6 +5–15.
- 94 cp = ⌊1.5 × 63⌋, and A4 (a) is 0.8699 against 0.85 (`ADR-0060` § Status and `…e17a23f4`).
- The P1 firing figure of 11.0 % and main's door counts 1 116 785 / 1 602 457 / 1 575 537 / 476 244 come from
  `…e4680ed2`.

## Open questions
- **Orchestrator:** the board cards. `ABC-264` goes to Done/dropped. P1 has no card, because it has no id.
- **BA/PM, later:** whether `ABC-233`'s page carries a history term in LMR (`ADR-0060` d11).
- **Owner (optional, via the Orchestrator):** the 27 cp cap question. The default, keep, stands without an answer.
