---
id: 20261103T221452Z-architect-design-observation-54131dab
kind: observation
by: architect-design
at: 2026-11-03T22:14:52Z
verified_by: 
confidence: high
refs:
  - arch-owner-answers-1103b
  - grugops/arch-owner-answers-1103b
  - ADR-0068
  - ADR-0069
  - ADR-0024
  - ADR-0067
  - ADR-0065
  - ADR-0064
  - ADR-0056
  - ADR-0053
  - ADR-0028
  - ABC-270
  - ABC-239
  - ABC-272
  - ABC-274
  - ABC-271
  - Q1
  - E3
  - E3a
  - EPIC-011
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - Q-3K-6
  - Q-3K-8
  - 0bf243df
  - 7acdd528
  - f554dba4
  - orch-2026-10-30a/20261103T220500Z-orchestrator-decision-401c3d09
  - arch-ABC-270/20261103T203621Z-architect-design-decision-c858b5a5
  - arch-Q1-see-pruning/20261103T202937Z-architect-design-decision-5e73b0d4
  - arch-owner-answers-1103/20261103T202049Z-architect-design-observation-e81f6b25
supersedes: 
seal: sha256:816d68fd28fe7e1bce49521a9f55e8839bb1f5111b9d753ddc65621e1c78ed9a
---

# arch-owner-answers-1103b owed lines: BA/PM's on `ABC-239`, `ABC-270`, `EPIC-011` and the Q1 ticket; QE's K1 (c) freeze; two optional `ADR-0068` pointers for a later Architect fold

None of these were edited here. Ticket pages and `EPIC-011` belong to BA/PM, who is working on them in parallel
(`bapm-owner-answers-1103b`).

## For BA/PM
- **`ABC-239`:**
  - B-T4 / A3–A4 gain one pointer: "re-pin rule: `ADR-0067`'s dated block under its bars table (2026-11-03)". The PR
    lists every re-pin (file, row, old → new).
  - B-T5 / A5 gain one pointer: "KQK risk, `ADR-0067` (2026-11-03). If it fires, F4; `ABC-272` is the structural fix".
  - Dependencies: the fit is taken on a `main` with `ABC-270`, and Q1 merges, or misses, before the B-T7 / B-T8 freeze.
  - Test notes: the tracer's queen-on count row on `ABC-270` K1 (c)'s frozen pairs, and one gate re-run on the emitted
    file (`ADR-0067` d4 / d5's dated line).
  - The rest is as `…c858b5a5` § 5 and `…5e73b0d4` § 5 already list.
- **`ABC-270`:** the lines of `…c858b5a5` § 5, plus "`ADR-0068` ACCEPTED 2026-11-03 (`…401c3d09`)", and "S2 nps
  reported only (Orchestrator `…401c3d09`)". DoR row 10 is met.
- **`EPIC-011`:**
  - Phase 4 order: `ABC-270` (structure) → `ABC-239`'s fit, with Q1 before the B-T7 / B-T8 freeze;
  - `ADR-0068` and `ADR-0069` are accepted;
  - the Q1 stub becomes a ticket row.
- **The Q1 ticket cut:** as `…5e73b0d4` § 5. Its DoR row 10, "`ADR-0069` accepted by the owner", is now met
  (`…401c3d09`).

## For QE
- Freeze ≥ 6 queen pairs before `ABC-270`'s build (`ADR-0068` K1 (c)). `ADR-0067`'s new tracer row reuses them.

## For a later Architect/Design fold (not in this brief's list; flagged, not edited, under coding rule 5)
- **`ADR-0064` d10** says "E3a is `ADR-0068` (PROPOSED)". It owes "(ACCEPTED 2026-11-03)".
- **`ADR-0031` § Addendum status:** its dated line is headed "`ADR-0068` PROPOSED". It is history at its date, and an
  acceptance pointer is optional.
