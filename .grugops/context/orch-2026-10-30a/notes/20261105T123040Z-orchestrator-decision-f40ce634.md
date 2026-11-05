---
id: 20261105T123040Z-orchestrator-decision-f40ce634
kind: decision
by: orchestrator
at: 2026-11-05T12:30:40Z
verified_by: 
confidence: high
refs:
  - NFR-008
  - ABC-303
  - ABC-305
  - R-CEN-1
  - R-N8H-2
  - T-QEHOP-GROWTH
supersedes: 
seal: sha256:f10f2b57e3c055606fe4f80e2b58581023571aa55d12eb88139017289d76ca70
---

Census merged (…19cea480): NFR-008 MET 9.515 s [9.31, 9.63], outcome G-WITH, nine rows, skip probe −0.365 s.

Rulings:
1. ABC-305 gets no exemption. G-WITH was sealed before the read and turned on 0.015 s, but the move is needed for the second merge either way, and waiving a sealed rule on a close figure is the wrong habit. The row move merges before or with the next lane-adding merge, whichever of ABC-303 and ABC-305 that is.
2. A new ticket carries the nine rows: BA/PM cuts it, the Architect does remnants and mutant reads including ABC-241 A7 and says what happens to T-QEHOP-GROWTH if the qe-hop trio moves, QE re-grades. The qe-hop trio moves together or not at all. Dropping it or all three cli rows falls short, and that comes back to me.
3. ABC-305's build and its N8-LANE read may run now; only the landing waits. A build needs no ruling from the census.
4. R-CEN-1 accepted LOW, owner Orchestrator. The owner's other project shares the host; he has been told and may hold it for timing reads. Session 1's 9.76 s stays void and is not cited.
5. NFR-008's catalog line (9.515 s) rides with the row ticket's graded read. T-QEHOP-GROWTH: 83 notes short of 5 500; the Architect plans it in the same hop.
