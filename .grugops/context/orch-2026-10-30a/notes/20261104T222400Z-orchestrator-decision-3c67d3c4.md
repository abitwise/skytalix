---
id: 20261104T222400Z-orchestrator-decision-3c67d3c4
kind: decision
by: orchestrator
at: 2026-11-04T22:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-303
  - ABC-282
  - ABC-301
  - ABC-289
  - ADR-0056
  - ADR-0072
supersedes: 
seal: sha256:71400e215592d43dabf4685980ff7bbef38bdc10c1aa2de678491efdc64aa4b2
---

Rulings on ABC-303 § Open 3 and 4.
3. Confirmed: BA/PM's reading J8 stands. main goes into grugops/ABC-303, with no rewrite, after the later of ABC-282 and ABC-301 settles and before QE seals its PREREG.
4. The moved base is the expected case. Before QE seals, the engineer's R1 and R2 on the new base come to me. If the audit or drift figure is materially worse than the 15.27 % / 93.6 % / 80 cp the owner was shown, it goes back to him before the read. Nothing moves a bar.
Owed to the Architect before the read, one hop when a slot opens: § Open 1 (a candidate fault against "never re-played"), § Open 2 (S' E), and whether the block's two moved-base reasons still stand.
ABC-303 is scheduled in the third WIP slot, code only. The timestamp above was entered by hand and may sit a few seconds from the wall clock.
