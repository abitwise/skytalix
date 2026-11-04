---
id: 20261104T021559Z-architect-design-decision-eeb25cc6
kind: decision
by: architect-design
at: 2026-11-04T02:15:59Z
verified_by: 
confidence: high (pre-registration; nothing measured yet)
refs:
  - arch-ABC-271
  - ABC-271
  - EPIC-011
  - E4a
  - E2
  - ABC-239
  - ADR-0064
  - ADR-0067
  - ADR-0068
  - ADR-0069
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - ADR-0048
  - ABC-215
  - G1
  - G2
  - G3
  - NFR-001
  - NFR-005
  - NFR-009
  - arch-ABC-239-f3f4/20261104T020001Z-architect-design-observation-4eae0fd3
  - arch-ABC-239-f3f4/20261104T020015Z-architect-design-decision-69f22167
  - 26d06118
  - ac55ddf6
  - 8adb0a18
supersedes: 
seal: sha256:a8cf5bf38d13274ee5c3084887baa5652bbb8265d850fb600726e4c4340a6191
---

# arch-ABC-271 PREREG: E4a's probe. Do hand rule values ship on play, or does E4a land as structure for the tuner?

Architect/Design, task `arch-ABC-271`, on `grugops/arch-ABC-271` from `main` `ac55ddf6` (`src/` tree `8adb0a18`: E1 + E2-pre + E3a structure + Q1). This note is sealed and committed **before any measured run**. Before it, one load-only smoke ran: the patched copy evaluated the start position with every term on, and got 0. That value is fixed by symmetry, so it carries no information. Inputs: `arch-ABC-239-f3f4` `…4eae0fd3` (F4's trace) and `…69f22167` (path (iii), "E4a before a second pull"); `ADR-0064`, `ADR-0067`, `ADR-0068`, `ADR-0069`; the `ABC-271` page.

## Instrument
- **Copies.** Each is a scratch `git archive` of `src/` at `8adb0a18`, outside the repository:
  - `main`: unpatched;
  - `main2`: unpatched, the G2 control;
  - `base`: `patch_e4a.py` applied;
  - `cand`: `patch_e4a.py` applied over `26d06118`'s `src/evaluate-params.ts` (reports only).
- **Scripts.** sha256: `patch_e4a.py` `b2f3c9f4…`, `e4aprobe.ts` `81fe7385…`, `g2.ts` `041bbcfd…`, `mainnodes.ts` `998e1a9e…`. Batches: A `212ec330…`, B `a151b52c…`, C `d3c0eb66…`, E `d66f3ea8…`, F `fc643657…`, G `2316edaa…`, S2 `94403222…`.
- **Running.** Every batch runs under the host lock, one at a time, on one core. They are copied to `raw/` afterwards, with host paths as placeholders.
- **Forms.** The probe-only `setE4aForm(kd, fp, un)` picks the form. BASE has every term off. H has all three on and is the candidate. The singles are KD, FP and UN; the pairs are KF, KU and FU.

## The rules (each one this project's own, `ABC-215` / `ADR-0048`; every middlegame half is 0)
R is the passer's own rank index (1 is its start rank, 6 is one step from promotion). Distances are Chebyshev. The queening square is the passer's file on the last rank.
1. **King distance.** eg += `KE[R]` × min(d(enemy king, queening square), 5) − `KO[R]` × min(d(own king, queening square), 5).
   - `KE[R]` = PASSED.eg[R] / 10 = 0, 1, 2, 4, 7, 12, 20.
   - `KO[R]` = floor(PASSED.eg[R] / 20) = 0, 0, 1, 2, 3, 6, 10.
2. **Free path.** eg += `FREE[R]` = PASSED.eg[R] / 2 = 0, 5, 10, 20, 35, 60, 100, when every square ahead of the passer, up to and including the queening square, is empty.
3. **Unstoppable passer.** It applies at phase 0 only, to a passer with a free path. It holds when moves < d(defending king, queening square) − (1 if the defender is to move). Here moves = 5 from the start rank and 7 − R otherwise.
   - Its value is U = 400, once per side. That is Q − (P + PASSED.eg[6] + FREE[6] + 5 × KE[6]) = 900 − 500, so a pawn's score while unstoppable stays at most a queen.
   - When both sides have one, they cancel.
4. **Which passers count.** Each term reads the frontmost passer of each file, per side, from two 24-bit words that the pawn memo stores (3 bits a file), so the memo grows from 448 to 576 KiB.
   - The terms are computed after the walk, outside the memo, and only when w < D and a passer exists. All three are eg-only, so phase 24 is E1 by construction.

## Rows
- **I1, the instrument (else the probe is void: STOP).** BASE equals the unpatched `main` on every count row, with the same nodes, score and move:
  - `chooseMove` on kiwipete at depths 8 and 9, and on position-6 at depths 8, 9 and 10;
  - `search()` at depth 8 on both boards.
- **P0 counts:** H's counts on the same rows. They are the build's expected counts if H is chosen. They are a reading, not a bar.
- **Eligibility. A form is eligible only if every row holds:**
  - **E1, the mirror:** `Object.is` over `G3` + `TAPER_MIRROR_POSITIONS` + 12 new passer positions (`PASSER_SET`), 0 mismatches.
  - **E2, phase 24 is E1:** every position of those sets and of the probe corpus with phase ≥ 24 is `Object.is`-equal to BASE, 0 mismatches.
  - **E3, the relations.** They are generated over every K+P v K placement (and with a rook each, for (d)), with both sides to move. The fixture condition: twin kings share the king's endgame table value and their reach.
    - (c) the square: outside − inside ≥ U on every twin pair;
    - (d) king distance is monotone: the defending king one step nearer the queening square, with the farther distance ≤ 5 and the same unstoppable status, makes the passer side strictly lower;
    - (e) free path: the FP part is present only when the path is empty. That is 0 with a knight on the path, and FREE[R] × 23 / 24 (± 1 for the truncation) with the knight off it.
    - Pairs that break the fixture condition are counted as a report, never graded.
  - **E4, the mate floor on the 287:** BASE's mates at depth 4 against the form at depth 5, 0 violations. Also depth 5 against depth 5, 0 violations.
  - **E5, zugzwang:** `ADR-0050` d9's seven rows at their recorded depths, **7 / 7**. This includes `zugzwang.001` at depth 9 playing e1f1.
  - **E6, `G1`:** at least 54 / 58, with no NEWLY-MISSED line.
  - **E7, `G2`:** H's `evaluateAtPhase` per call ≤ 1.05 × `main`'s, on QE's six roots, in `qe-ABC-274`'s A5 shape.
    - The shape: two sessions in reverse order (B,C,H and H,C,B), 6 rounds with round 1 dropped. R is the mean of r_s.
    - The control c_s must lie within 1 ± 0.037. A session outside that is void, and E7 is then `UNKNOWN`: it moves to the build (`ABC-271` P6 / F5) and does not decide the choice.
    - The endgame set EG, six positions chosen by rule from `qe-ABC-279`'s C2′ games, is a report.
- **The firing figure at 100 ms (decides only the intent).** Static evaluate, form minus BASE, at every position of the 200 C2′ games at 100 ms on record (`qe-ABC-269` b8, `qe-ABC-279` c2).
  - **If the share of positions with |Δ| ≥ 10 cp is below 5.0 %, the intent is named "NEUTRAL (invisible at 100 ms)".** Otherwise it is GAIN.
- **Reports (decide nothing):**
  - `zugzwang.001` at depth 9, v(e1f1) − v(e1e5) by form, in `arch-ABC-239-f3f4` D2's form. This includes CAND (`26d06118`'s table, E4a off) and CAND + H. CAND + H is not a fit, so it only says whether E4a's features move the fitted table's leaf preference.
  - Reach at 47 000 nodes and drift at depth 5.
  - The default vitest lane with H on, against `main`'s copy, to list the migration reds.
  - The singles' firing figures.

## Choice rule (fixed now)
1. **H is eligible:** `ABC-271` ships H's rule values, judged on play (`ABC-271` P8: C2′ 100 games at 100 ms on the named intent, plus S′ and the Levels lane). The order is **values → second pull**, and the second pull fits KD and FP from these starts. UN stays a rule (`ADR-0067` § Consequences 5).
2. **H fails E1 or E2:** that is a defect in the prototype. It gets one fix under a sealed addendum, and then every row is re-read. **H fails E3 on twin pairs:** that is a defect in the rule. STOP; the ADR restates the rule, and no value is tuned to pass.
3. **H fails E4, E5 or E6:** batch S2 reads the six subsets on E1–E6. The eligible subset with the most terms is shipped on play, with ties broken in the order KF, KU, FU, KD, FP, UN. The terms left off land as structure at 0 for the tuner (`ADR-0068` form).
4. **No subset is eligible:** E4a lands as **structure only**, all at 0, value-identical, with no switch, no doors and no games (`ADR-0068` form). The tuner fits KD and FP. The order is **structure → second pull**.
5. **E7 > 1.05 on an otherwise eligible form:** the choice holds. The ADR names one value-identical cost cut (`ABC-271` F5), and QE reads `G2` on the build.
- A miss is not re-played. No bar moves after a reading. Batches run in the order A, B, then S2 only under rule 3, then G, F, C, E.
