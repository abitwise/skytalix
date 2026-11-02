---
id: 20261102T222129Z-qe-e2e-observation-34cbabaf
kind: observation
by: qe-e2e
at: 2026-11-02T22:21:29Z
verified_by: 
confidence: high on QE-269-a's arithmetic and on the -0 trap (checked with Object.is); the scope ruling on QE-269-a is the Architect's
refs:
  - qe-ABC-269-freeze
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - E3
  - ADR-0064
  - ABC-082
  - G3
  - B1
  - 58fa3eb4
  - d6a57653
  - src/evaluate.taper-corpus.ts
  - qe-ABC-269-freeze/20261102T222017Z-qe-e2e-decision-1b856350
  - arch-E1/20261102T215541Z-architect-design-decision-d8150777
supersedes: 
seal: sha256:abeddbc623bfd77bf85171f0284e48fd01acc0c872d72acf6270d9223b7d0332
---

# qe-ABC-269-freeze gaps, raised before the build. QE-269-a (MEDIUM, Architect ruling): B1 (d) does not cover the castled corner. With both corner files sheltered and the centre files bare, the design reads +13 (< 20) on 2 of 3 such endings. QE-269-b (LOW, Engineer; INFO, Architect): the full-form blend breaks the mirror by −0, so build d2's delta form. QE-269-c (INFO, Architect): "(≥ 1.75 × by construction)" reads 1.6 × at rank 2. QE-269-d/e (INFO, Engineer): how to read the fixture. None blocks the build start

QE/E2E, task `qe-ABC-269-freeze`. Forecasts: the forecast note of this task. Sets: PREREG `…1b856350`.

## QE-269-a: MEDIUM. Owner: the Architect (a ruling on B1 (d)'s scope)
- **What:** `TAPER_KP_SHELTER_STRESS` S1 (Kh1 behind g2 h2, centre e4) and S2 (Ka8 behind a7 b7, centre d5) forecast **+13 cp**. B1 (d)'s bar is ≥ 20. S3 (Ka1 behind a2 b2, an enemy c-pawn) forecasts +23.
- **Why:**
  - `kingExposure` has equal halves at E1. The centre king pays up to 105 cp (3 files × (15 shelter + 20 open)), and the sheltered corner pays 0.
  - The king's endgame swing is 90 cp (eg) against −40 cp (mg) for an a1 / h1 corner, so the gap is base + 130.
  - `ADR-0064` § Alternatives names the residual ("charges a centre king up to 105 cp against the endgame table's 90 cp range"). It then concludes "the probe's endings still read +44 to +95, so the king walks". All six probe endings put the corner king away from its own pawns. The castled king's ending, the common case, was not in the sample.
- **QE did not decide it.** The 6 graded endings use unsheltered or partly sheltered corners (forecast +34 to +85). S1–S3 are frozen apart as a report.
- **The ruling asked for:**
  - **(i) out of scope for E1:** S1–S3 stay a report, and the ADR's "the king walks" gets a dated line scoping it to a corner king not behind both of its pawns, with E3 as the fix;
  - **(ii) in scope:** S1–S3 join B1 (d) as frozen. E1 then misses B1 (d) on S1 and S2 by its own arithmetic, and a value or scope change re-opens the ADR (tapering shelter is E3's today).
- **Severity MEDIUM:** a real strength hole in the most common king-and-pawn shape. It blocks nothing until the ruling.

## QE-269-b: LOW (Engineer), INFO (Architect)
- **What:** d2 says the full form and the delta form are "the same number, bit for bit". In `Object.is` terms they are not when mg = 0 and |Δ × (D − w)| < D.
  - Math.trunc of a small negative number is −0. The full form returns −0 for the white-to-move side; its mirror returns +0.
  - `M-negzero-a` (phase 23, Δ +5) and `M-negzero-b` (phase 21, Δ −5) are the frozen traps.
- **The Engineer:** build the delta form (d2 already says "Build that form"). B1 (a) over the fixture catches the other.
- **The Architect:** "bit for bit" holds up to the sign of zero, and the negamax `0 − score` does not repair the white-to-move side. An optional dated line.

## QE-269-c: INFO (Architect)
- d8 B1 (e)'s "(by construction ≥ 1.75 ×)" is not exact under trunc:
  - rank 2 reads 1.6 × at phases 5–6 (8 of 5);
  - rank 3 reads 1.7 × at 6 (17 of 10);
  - rank 5 reads 1.743 × at 6 (61 of 35).
- The ≥ 1.5 × bar holds everywhere. The ≤ 1.25 × bar at phase 18 is met at equality on ranks 4, 6 and 7. Wording only.

## QE-269-d: INFO (Engineer), how to read the fixture
- **B1 (c):** compare `evaluateWithoutTaper` against `TAPER_DOOR_CORPUS[i].main` and against `G3_CORPUS_MAIN_EVALUATE[i]` in `buildCorpus()` order. The order depends on `legalMoves`' order, which E1 does not touch.
- **B1 (b):** the rows with `rawPhase >= 24`, plus `G3` rows whose computed phase is ≥ 24.
- **B1 (d):** read from `walkingKing`'s side. `evaluate` is side-to-move relative, so negate when the side to move is the other colour (D2, D4 and S2 differ from the rest).
- **B1 (e):** read each pair as the PREREG states. The kings at a8 / h1 make it exact. Read the array grid from `VALUE_TABLES_FOR_TEST`'s passed mg / eg halves at every phase in `TAPER_PASSER_PHASES`.
- **The A7 guard:** `ABC-082` `A7` text-scans every non-test module under `src/` for the shared mirror corpus's file name. A fixture or helper that names it in a comment goes red, as QE's first lane run did.

## QE-269-e: INFO
- **The forecasts are rule arithmetic.** The build's B1 readings must be its own run. A forecast that differs from the build is explained, not adopted.
- **No coverage claim.** The fixture is imported by no test until the Engineer's B1 rows exist. Its effect on any coverage reading is `UNKNOWN - verify`.
