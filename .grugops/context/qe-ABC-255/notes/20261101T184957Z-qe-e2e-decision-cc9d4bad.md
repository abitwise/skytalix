---
id: 20261101T184957Z-qe-e2e-decision-cc9d4bad
kind: decision
by: qe-e2e
at: 2026-11-01T18:49:57Z
verified_by: 
confidence: high
refs:
  - ABC-255
  - EPIC-011
  - EPIC-010
  - ADR-0056
  - grugops/qe-ABC-255
  - grugops/ABC-255
  - 78cd2415
  - a08ba9be
  - 8f2fc9b5
  - becf571a
  - b5c67ab7
  - 12270c02
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - C2′
  - C3″
  - S′
  - R-TC
  - NFR-008
supersedes: 
seal: sha256:145ab03c9b13ff6d324ffa72f0ce3b5eb101b32d6a0a341664a187b77e4a84a5
---

# QE decision, qe-ABC-255: PASS_WITH_GAPS. QE-255-a is LOW; QE-255-b, c, d and e are INFO; none blocks

The PREREG is `raw/PREREG.txt` (`28b800cc`; note `…1a15c163`), sealed before any real read. Graded against the ABC-255 page's A1–A8:

- **A1 MET.** The d@100 vectors at 50 and 200 rounds are exact. The default and the 3 000–1 000 budgets are byte-equal to base.
- **A2 MET.** The r@500 vector is exact. 4 `r` shapes and 4 `rpair` shapes are byte-equal to base. `r` refuses every other budget with exit 1.
- **A3 reported, not graded.** `b5c67ab7` against `12270c02` reads 30/26/44, **52.0 of 100**, +13.9 ± 51.3, draws 44 %. **The GAIN bar is met.** 0 faults, 0 time losses, max overshoot 5 ms, 334.0 games/h. The host was ALONE.
- **A4 MET** on its checked items: 100/100 games, 0 faults, 0 time losses.
  - The score is 29/38/33, **45.5 of 100**, −31.4 ± 56.3: near 50 %, and the interval covers 0.
  - Draw ratio **33.0 %**, **253.3 games/h**, max overshoot 5 ms. The host was SHARED by rule.
- **A5 MET** on its checked items: 10/10 games, 0 faults, 0 time losses.
  - W/L/D **9/1/0**, score 0.900. **94.2 games/h.** Stockfish's depth per move has a median of 17.
  - **skytalix's largest overshoot over 500 ms is 3 ms**, under the 12 ms flag, so no margin re-set is triggered.
  - The host was SHARED: the start came at the end of the 20 min cap.
- **A6 MET.** The `src/` and `data/` diff is 0 lines. The control reaches skytalix only as `st=` and `timemargin=`.
- **A7 MET.**
  - lint, typecheck and build: rc 0.
  - npm test: 2 362/2 362, 0 skipped. skip-integrity and lane-inventory: no findings.
  - pair-check: 32/32. Mutants M1–M7 are killed. M8 survives, as pre-registered (QE-255-a).
  - 0 new lane rows.
- **A8:** the `## Reading` section is written on the page, and these notes are sealed.
- **Merge validity:** tools/ and the package files are equal from `8f2fc9b5` to main `ab9f4803`, and `git merge-tree` against main is clean.
- **UAT:** none (tools only, the page's Test notes 3). The QE verdict closes the gate. Nothing pushed or merged, and nothing left running.
