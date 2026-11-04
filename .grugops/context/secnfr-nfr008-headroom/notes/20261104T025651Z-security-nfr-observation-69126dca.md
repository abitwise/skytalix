---
id: 20261104T025651Z-security-nfr-observation-69126dca
kind: observation
by: security-nfr
at: 2026-11-04T02:56:51Z
verified_by: 
confidence: medium: paired 7 vs 7, 7/7 negative, scratch copy outside the repo; no twin arm, an estimate for a cut
refs:
  - secnfr-nfr008-headroom
  - NFR-008
  - NFR-010
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - Q-N8H-1
  - QE-280-b
  - QE-279-e
  - ADR-0008
  - ADR-0035
  - ADR-0040
  - ADR-0046
  - T-QEHOP-GROWTH
  - ABC-248
  - ABC-244
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - plans/nfr-catalog.md
  - qe-ABC-280/20261104T024152Z-qe-e2e-observation-29cd8440
  - qe-ABC-279/20261104T003652Z-qe-e2e-observation-c49b050d
  - 08843504
supersedes: 
seal: sha256:01213ef67f3d21e1a081d87d3bb8aa6148117803c435044c34f7c6655a8d7e92
---

# Security/NFR observation, secnfr-nfr008-headroom: a scratch probe with three named rows skipped reads −0.38 s paired median wall (7 of 7 pairs lower) and −1.09 s CPU against main in the same window

A probe, not a change: a `git archive` copy of this branch outside the repository, with three `it(` → `it.skip(` edits (raw `probe.diff`) and nothing else. No test, `src/` or config file in the repository was written. Both arms `npm test` as spelled, inside one host-lock session, order b p p b b p p b b p p b b p p b, first b and first p discarded as warm-up (raw `n8-paired-P.tsv`, script `scripts/paired.sh`). Exit 0 on all 16; probe arm 2 647 passed + 3 skipped.

Rows skipped (each has an existing deep lane in its own file):
1. `src/search.null-move.test.ts`, "QE-208-a — an abort inside a null move's subtree still hands the root back byte-identical" › "position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree" (365 ms) — deep lane `SEARCH_DEEP`.
2. `src/engine.test.ts`, "ABC-230 A3 and A4 — …" › "A4: an empty list is node-equal to an absent one over the endgames and the thirty" (236 ms) — deep lane `ENGINE_DEEP`.
3. `src/levels.test.ts`, "A9 — different seeds actually differ" › "≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences" (135 ms) — deep lane `ENGINE_DEEP`.

Result: base median **9.90 s**, probe median **9.39 s** (max 9.73 s). Paired (adjacent b/p) wall deltas −0.38, −0.51, −0.27, −0.69, −0.26, −0.44, −0.17 s: **median −0.38 s, 7 of 7 negative** (sign p ≈ 0.016). CPU deltas median −1.09 s, 7 of 7 negative. That is ≈ the two-slot arithmetic (736 ms of rows / 2 = 0.37 s). No twin arm, so this is an estimate for a cut, not an `N8-LANE` charge.
