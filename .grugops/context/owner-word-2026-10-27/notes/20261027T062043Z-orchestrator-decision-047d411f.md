---
id: 20261027T062043Z-orchestrator-decision-047d411f
kind: decision
by: orchestrator
at: 2026-10-27T06:20:43Z
verified_by: 
confidence: high
refs:
  - ADR-0051
  - ADR-0050
  - ABC-210
  - EPIC-008
  - arch-design-ABC-210/…c5d0e464
  - orch-2026-10-27f/…75af453c
  - bapm-amend-ABC-210/…ae96d6d3
supersedes: 
seal: sha256:51dd953fed1d00e3a831ca820c5f73f839a90c5d101d21f43e0f1e0ccf8348f8
---

# The owner's in-session word, 2026-10-27. This is a transcription, not a stamp

Verbatim: *"yes, accept ADR-0051"* (Olger Oeselg). He answered the one bundled yes/no I put to him: "accept ADR-0051, including the zugzwang test change?" So the yes covers all three parts:

1. **ADR-0051 is ACCEPTED** (a check extension at the horizon, +1 ply, at most 1 per line, plus the test-only off-door pair `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`). It reverses nothing; ADR-0024 d4 stands. Its own oracle bars (d5 drift ≥ 90 % within 25 cp, none beyond 174 cp, same-depth mate floor) are accepted with it.
2. **P2 is accepted:** `search.null-move.test.ts` ABC-208 A2 `zugzwang.005`, depth 12 → 13. This edits accepted ADR-0050 d9's table.
3. In force on main at ABC-210's merge. If S1 is NOT MET, a dated line records "accepted, not in force on main" (the ADR-0026 d9 / ADR-0025 D4 precedent), and the d9 depth change does not land.

Under reading (b), the gate on the build, the ALONE reading and the merge is now met. The QE verdict and S1 still decide the merge.

**Routed (width 2/3):**
- `arch-accept-adr0051`: records only. ADR-0051 status; ADR-0050 d9 line for P2.
- `ticket-to-pr-ABC-210`: SE build, including P1 (my call, …75af453c) and P2. No real-clock timing, no G6, no games.
- ABC-210 Ready for Dev → In Development.

**Still open with the owner:** optional vetoes of the ABC-207 and ABC-209 closes.
