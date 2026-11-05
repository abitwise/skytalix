---
id: 20261105T152827Z-orchestrator-decision-b17275dd
kind: decision
by: orchestrator
at: 2026-11-05T15:28:27Z
verified_by: 
confidence: high
refs:
  - ABC-307
  - NFR-008
  - R-CEN-1
supersedes: 
seal: sha256:a069283fa3bce499a24c0e0cb9a2794590638db3fca20cb03b76922bf1b6e5e1
---

qe-ABC-307 stopped at A9 (…43927eb6): two void reads, no verdict. A1 to A5, A7 with the new MC1 read, and A8 all hold.

Ruling on which void line governs: read 2 stays void. QE sealed "any flagged round" from my brief's wording, and the older …b9038a14 rule (up to 2 of 8 scored) would keep it. Choosing the looser line after seeing the flags is what sealing forbids, and the fault in the wording is mine: I wrote it stricter than the method.

A new read gets a new PREREG, stating both voids, sealed before any run, on …b9038a14's rule. That is fixed now, before any further figure exists. It reads on main's merge candidate or the branch as the page allows, H's lane inputs equal.

It runs only in a window the owner holds the other project for: three of today's five timing reads were lost to that load (session 1 of the census, ABC-305, A9 read 1), and read 2's flag has an unknown source. R-CEN-1 moves LOW to MEDIUM: it has become the critical path's main delay, though no figure was wrongly read. Asked of the owner. Dispatch waits on his word.
