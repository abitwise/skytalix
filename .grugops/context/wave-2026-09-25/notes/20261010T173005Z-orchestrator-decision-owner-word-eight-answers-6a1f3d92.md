---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-10T17:30:05Z
sealed: false
---

# Owner word, 2026-10-10 — answers to the eight open questions

Verbatim: "1. accept; 2. accept; 3. ok ; 4. retire ; 5. move to node version 26 ; 6. explain more ; 7. ok ; 8. yes"

Mapped to the questions as last put to the owner:
1. **ABC-131 and ABC-010: UAT ACCEPTED.**
2. **ADR-0035 ACCEPTED, with NFR-008 option R-1** (the option the question recommended: wall ≤ 10 s, CPU reported,
   not gated). If the owner meant a different option, this note is superseded.
3. **ABC-060 DROPPED** (scope empty) — dropped, not delivered.
4. **NFR-005's depth-7 PROVISIONAL marker RETIRED.**
5. **Reference runtime re-based: Node v24.12.0 → v26.11.0** (the M3's runtime).
6. **ADR-0036 (clause (b) = DELTA): no ruling yet** — the owner asked for more explanation. ADR-0036 stands as
   Architect-accepted meanwhile; routing continues on the DELTA test.
7. **Scribe rank 3 APPROVED:** the Safety-rules "Deploy is allowed…" bullet may be shortened to a pointer to
   "Deployment posture".
8. **Permission allow-list APPROVED** for running committed `.grugops/context/**/probe/` scripts.
