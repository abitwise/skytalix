---
id: 20261104T023519Z-architect-design-observation-c9af6d84
kind: observation
by: architect-design
at: 2026-11-04T02:35:19Z
verified_by: 
confidence: high (every figure read from raw/out as run; I1 exact; the R class's phase-4 cause read from the six printed pairs plus arithmetic, not a separate run)
refs:
  - arch-ABC-271
  - arch-ABC-271/20261104T021559Z-architect-design-decision-eeb25cc6
  - arch-ABC-271/20261104T022829Z-architect-design-decision-3a9eba86
  - ABC-271
  - ABC-239
  - EPIC-011
  - E4a
  - E2
  - ADR-0070
  - ADR-0064
  - ADR-0067
  - ADR-0068
  - ADR-0056
  - ADR-0050
  - ADR-0028
  - G1
  - G2
  - NFR-001
  - NFR-005
  - NFR-009
  - 26d06118
  - 8adb0a18
  - ac55ddf6
  - src/evaluate.ts
  - src/evaluate-params.ts
supersedes: 
seal: sha256:da896426ca8a2932ef26d2db0c02c268b59018df1c4fb0bf11d30c828806d6cb
---

# arch-ABC-271 observation: the E4a probe's readings (batches A, B, D, G, F, C, E)

Architect/Design, task `arch-ABC-271`. The PREREG is `…eeb25cc6` (`029533f0`), and the addendum `…3a9eba86` (`904b3fff`); each was committed before the runs it covers. The runs used scratch copies of `main`'s `src/` `8adb0a18`, under the host lock, one at a time, about 3 min of runs in all. Batch A waited about 10 min for a foreign lock holder. S2 did not run: choice rule 3 did not fire. Raw files: `raw/out/`, `raw/scripts/` (`raw/README.md`).

**A: counts.** **I1 is exact:** BASE equals the unpatched `main` on all seven rows, with the same nodes, score and move.

| row | `main` = BASE | H |
|---|---:|---:|
| `chooseMove` kiwipete d8 / d9 | 766 275 / 1 725 150 | 776 478 / 1 696 188 |
| `chooseMove` position-6 d8 / d9 / d10 | 87 475 / 253 724 / 533 916 | 87 548 / 253 904 / 534 281 |
| `search()` d8 kiwipete / position-6 | 605 117 / 406 787 | 551 487 / 406 807 |

The root move is unchanged on every row.

**B: eligibility (H).**
- **E1, the mirror:** 0 / 226.
- **E2, phase 24:** 0 / 333.
- **E3 (c), the square:** **44 / 404 twin pairs fail**, each reading 365 against U = 400.
- **E3 (d), king distance:** **312 / 2 123 twin pairs fail**.
- **E3 (e), the free path:** 0 / 120.
- **E4, the mate floor:** d4 → d5 0 / 163; d5 → d5 0 / 190.
- **E5, zugzwang:** 7 / 7.
- **E6, `G1`:** 54 / 58, none newly missed.
- **BASE references:** the mirror 0 / 226 and phase 24 0 / 333. Under BASE, (c) fails 404 / 404 (no U), and (d) fails 1 761 / 2 123.

**D: E3's failure classes (the addendum).**
- **(c):** 44 F, 0 P, 0 R. On twins that also share their exposure: 0 / 302.
- **(d):** 196 F, 101 P, 15 R. On twins that also share their exposure and keep both kings off the path: 15 / 1 341, which are exactly the R pairs.
- **What R is:** the six R pairs printed are all passers on their own second rank, at phase 4 (a rook each). E4a's own part reads 0 there: a king step is worth 1 cp of eg, × 20 / 24, and the trunc drops it.
- At phase 0 the eg half is exact, so E4a's own part is ≥ 1 on every off-path pair by arithmetic. That was not run separately.

**G: `G2`, `evaluateAtPhase` per call.** QE's six roots (phases 24, 24, 4, 24, 24, 24):

| session (order) | B ns | C ns | H ns | r_s | c_s |
|---|---:|---:|---:|---:|---:|
| 1 (B, C, H) | 299.58 | 305.53 | 310.11 | 1.0351 | 1.0199 |
| 2 (H, C, B) | 305.95 | 307.24 | 311.63 | 1.0186 | 1.0042 |

- **R = 1.0269 ≤ 1.05: MET.** Both controls lie within 1 ± 0.037.
- **The endgame report set** (six positions by rule from `qe-ABC-279`'s C2′ games, phases 6, 8, 8, 8, 3, 7): r 1.0842 / 1.0862, c 1.0141 / 1.0015.

**F: the firing figure at 100 ms** (27 896 positions, 200 games, 0 failed parses).

| form | ≠ 0 | ≥ 10 cp | ≥ 25 cp | games with ≥ 25 | ≥ 300 cp |
|---|---:|---:|---:|---:|---:|
| H | 45.10 % | 29.75 % | 19.31 % | 87.0 % | 168 positions |
| KD | 43.85 % | 18.21 % | 7.69 % | 69.0 % | 0 |
| FP | 31.29 % | 25.20 % | 16.40 % | 84.5 % | 0 |
| UN | 0.58 % | 0.58 % | 0.58 % | 14.5 % | 161 positions |

29.75 % ≥ 5.0 %, so **the intent is GAIN** by the PREREG.

**C: reports.**
- **`zugzwang.001` at depth 9**, as v(e1f1) / v(e1e5) / gap / played:
  - BASE −390 / −419 / +29 / e1f1;
  - KD −410 / −442 / +32;
  - FP −355 / −442 / +87;
  - UN −305 / −419 / +114;
  - **H −263 / −454 / +191 / e1f1**;
  - CAND (`26d06118`, E4a off) −464 / −445 / −19 / **e1e5**;
  - CAND + H −331 / −481 / +150 / e1f1.
  - CAND + H is not a fit.
- **Reach at 47 000:** BASE 6.716, H 6.679.
- **Drift at d5, H against BASE:** 99.47 % within 25 cp (187 non-mate), max 409 (`pawn-race`, 40 → 449), 0 mate flips, 4 root moves differ.

**E: the default lane** (one worker), `raw/out/E-lane-summary.md`.
- `main`'s copy: 1 red (`ABC-119`, an environment red), plus six suites that cannot load outside the repository (book and PGN data).
- The lane copy with H: **24 reds, 23 of them from H**:
  - memo byte pins ×2 (458 752 → 589 824);
  - `engine` `ABC-249` 441 → 447;
  - `ABC-270` K1 (b) value identity ×3;
  - `ABC-269` B1 (e) phase-18 rows ×9;
  - `ABC-274` A3 formula rows ×5;
  - `ABC-083` A8 isolation rows ×2 (pawn-ending fixtures, one twin's pawn unstoppable);
  - `ABC-269` B1 (a)'s −0-trap check `M-negzero-b` ×1. Its "exactly 0" fixture property is lost; the mirror row itself is green.
- No red is a mirror or identity defect of the prototype.

**Cleanup:** the scratch copies, the `node_modules` symlinks and the outputs outside `raw/` were removed after the reads. Nothing is left running.
