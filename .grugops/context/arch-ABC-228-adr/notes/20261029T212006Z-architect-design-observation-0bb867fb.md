---
id: 20261029T212006Z-architect-design-observation-0bb867fb
kind: observation
by: architect-design
at: 2026-10-29T21:20:06Z
verified_by: 
confidence: high on the node counts, mate floor and pins (deterministic); medium on the G6 forecast (one QE session's node budget, indicative CPU per node)
refs:
  - arch-ABC-228-adr
  - ABC-228
  - ABC-229
  - EPIC-010
  - ADR-0053
  - ADR-0024
  - ADR-0026
  - ADR-0050
  - ADR-0051
  - ABC-079
  - ABC-210
  - ABC-235
  - NFR-005
  - NFR-004
  - NFR-008
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - qe-epic008-close/20261029T063012Z-qe-e2e-observation-ffb593fe
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - .grugops/context/arch-ABC-228-adr/raw/
  - main 95f7369e (src = 38536a34)
supersedes: 
seal: sha256:961c8399004bb780b35a51488f1544c56a9b4e54608d92738a0af3ddaeb849b3
---

# Probe readings for ADR-0053: evasions in check and quiet queen promotions inside quiescence

Eight single-process probes, each under 5 min CPU (264 s total), on scratch copies of `main` `95f7369e`'s `src/`
(equal to `38536a34`'s). `pgrep -x cutechess-cli` was empty before each; load1 4–10 (two sibling builds live). All
counts are deterministic (fixed depth, or `chooseMove` on a frozen clock with `maxDepth`). CPU seconds are indicative.
Scripts, outputs and the instrumentation diff: `.grugops/context/arch-ABC-228-adr/raw/`.

- **Door identity:** the instrumented copy with every knob off equals base, 10 of 10 searches node- and score-equal.
- **SA rows:** Q1 78 → 29 999 (mate); Q2 −548 → −536; Q3 212 → 977 with quiet queen promotions.
- **Nodes, `search(…, 6)`, against base (kiwipete / position-6):** full evasions, cap 8: 1.368× / 1.405×. Ply 0 only:
  1.054× / 1.013×, which is `ABC-210`'s figure (1.054× / 1.007×). Ply ≥ 1 only: 1.283× / 1.416×. Evasions below ply 2,
  then a mate test: 1.171× / 1.183×. Mate test only: 0.999× / 1.000×. Quiet queen promotions: 1.014× / 1.000×; ordered
  after captures 1.005×; every piece 1.032×. Both: 1.394× / 1.405×.
- **Cap:** with evasions, cap 8 / 16 / 64 read 324 162 / 431 201 / 438 961 (kiwipete), 154 464 / 162 323 / 162 348
  (position-6). The tree converges, so the cap stays a guard.
- **`G6` forecast, `chooseMove` frozen clock:** kiwipete to 8: base 1 259 463, evasions 1 543 477 (1.226×).
  Position-6 to 10: base 1 765 861, evasions 2 340 431 (1.325×). QE's 3 s node medians on this `src/`
  (`qe-epic008-close/…ffb593fe`) are 1 810 285 and 1 878 626. So the design needs 85 % and 125 % of base's 3 s nodes.
  CPU per node rises about 9 %. Position-6 is forecast at depth 9 against base's 10. The capped form needs 112 %, and
  the mate-test-only form 94 %.
- **Oracle on `search()`:** evasions against the door, d5 on the 190: 89.30 % within 25 cp, maximum 118 cp
  (position-4/f1f2, 708 → 826), 0 flips. Mate floor on the 287 at d5: 189 of 189 held, 0 longer, 0 new. Promotions over
  evasions: 100 %, maximum 8 cp.
- **Pins:** `ABC-081` `A5` depth 3 reads −392 (was −485); depths 2 and 4 unchanged. `ADR-0050` decision 9's seven
  zugzwang rows all hold at their depths. `kpk-b6c6` scores 186 → 902 with promotions (move unchanged).
- **Not measured:** `chooseMove`'s d5 drift pair, `G1`, the default lane's other pins, any real-clock reading.
