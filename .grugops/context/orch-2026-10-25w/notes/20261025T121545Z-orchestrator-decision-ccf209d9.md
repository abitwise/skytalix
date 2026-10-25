---
id: 20261025T121545Z-orchestrator-decision-ccf209d9
kind: decision
by: orchestrator
at: 2026-10-25T12:15:45Z
verified_by: 
confidence: high
refs:
  - ABC-215
  - ABC-207
  - EPIC-008
  - ADR-0048
  - NFR-005
  - NFR-008
  - LIC-PUB-1
  - OQ-214-4
  - QE-215-a
  - QE-215-b
  - .grugops/context/qe-ABC-215/
supersedes: 
seal: sha256:6fafacf8a2e720d1b8bd9c97da071b91748886a004690cdc7436fcf95608eccc
---

# ABC-215 accepted and merged; next hops

**Verdict accepted as-is.** qe-ABC-215 PASS at 7d4cea3e (sealed notes …dc2c86cc, …a34270bf, …0c9bab9a, …c2c3540f):
- A1–A8a MET.
- G6 MET: position-6 head 8×5 vs base median 7; kiwipete 7/7. Pre-check: position-6 d8 −6.65 %.
- G2 MET: 642.6/641.2 ns vs base 641.1/637.8.
- D: 400/400 games, 107/89/204, Elo +15.6 ± 23.8 → NEUTRAL with X ≥ 0. S3/A7 MET, no extension owed. This was ABC-215's one reading, final under …4c3f7639.
- Overlap: 0 vitest-overlapped games; without the 8 load>8 games it reads +15.1 ± 24.0 (same grade).
- UAT is signed by this QE PASS (…5aaf7cec item 2).

**Merged:** grugops/qe-ABC-215 → main as 5c91e2e4. Gates on main: ci, lint, typecheck and build exit 0; npm test 2090/2090, last-run success, skips 0, integrity "No findings." NFR-008 sentinel: 8.29 s and 7.29 s, no foreign vitest (≤ 10 s). ABC-215 → Done. In Review 0/3. Main 5c91e2e4 is ABC-207's D base.

**Findings, dispositions (delivery calls):**
- QE-215-a LOW: the G6 reading rule (5 rounds, median, any run < 6 fails) goes into EPIC-008's G6 row before ABC-207's reading. → BA/PM. No bound moves.
- QE-215-b INFO: base position-6 d8 medians swing between sessions (1/5 vs 3/5). Carried to the owner's open QE-205-c question. Default A (graded) stands.
- QE-215-d and QE-215-e INFO → Backlog notes.

**Routes (width 3; all records-only, no timing, so none overlaps a reading):**
1. arch-adr0048-status: dated ADR-0048 § Status line (carve-out ended by ABC-215 at 5c91e2e4).
2. arch-design-ABC-207 (same Architect, claim_cap 2): ABC-207 Ready → In Design. The design rules weights and the queen term, plus a moved-pin probe and frozen-clock d7/d8 counts. It follows ABC-215's pattern, because the SE fence "other row moves → STOP" needs a ruling first.
3. bapm-epic008-g6-rule: QE-215-a, plus a dated ABC-215 Done line on EPIC-008 (row 9, M2 reading).
4. security-nfr-lic-pub-1: LIC-PUB-1 / OQ-214-4 dispositions at the tip. This is deferred to the next free slot, because width is 3/3. LIC-PUB-1 is owner-held: Security records the evidence, and the owner is told.

ABC-207's own single real-clock G6 + D reading runs ALONE after its build, under the …4c3f7639 scope reading (veto open).
