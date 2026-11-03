# arch-ABC-239 PREREG addendum (post-hoc diagnostic, sealed before it runs): the prototype's verdict stands as read; three diagnostic fits on the INNER split only probe why the fitted material is implausible (queen mg 2593, eg 137), to inform `ADR-0067`'s loss and free-set decisions. Nothing is graded and the outer validation is not read

Architect/Design, task `arch-ABC-239`. PREREG `…9ed1db11` governs the prototype and its verdict; this addendum changes neither.

## What was seen (the prototype run, 2026-11-03T10:39Z, reported in full in the results note)
- G-P1, G-P2 and G-P3 hold: the chosen C-S's rounded set reads 0.9863 × E1's outer-validation cross-entropy.
- But the fitted material is implausible for play: queen mg 2593 / eg 137, knight 572 / 246, rook 905 / 360. Relation checks reported: a minor < 3 pawns in the endgame half, passed mg not monotone (rank 3 = −25), endgame shelter and half-open penalties negative.
- Reading (a hypothesis, not a finding): cross-entropy keeps a full-strength gradient (σ − y) on decided positions (a queen up in self-play at 100 ms almost always wins), where Texel's squared error damps it by σ(1 − σ). The loss moves partly by fitting the decided tail, which a search does not need.

## The diagnostics (fit on inner-training, read on inner-validation; the outer validation is not opened)
- **D1:** C-S with **squared error** (Texel's), K re-fitted on inner-training under squared error, Gauss-Newton steps (same stop rule).
- **D2:** C-S with cross-entropy and **material frozen** at E1's values (32 free).
- **D3:** C-S with squared error and material frozen.
- Each reports: inner-validation cross-entropy and squared error against E1's on the same rows (E1 scored with each run's own K), the fitted material, and the relation checks of PREREG `…9ed1db11`.

## How it is used
- It informs `ADR-0067`'s choice of loss and of the first pull's free set, as a design reading. The build pre-registers its own bars on its own run; the outer validation stays unread by any design choice.
- No result here re-grades the prototype. If every diagnostic is also implausible, the ADR says so.
