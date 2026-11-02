---
id: 20261102T215541Z-architect-design-decision-d8150777
kind: decision
by: architect-design
at: 2026-11-02T21:55:41Z
verified_by: 
confidence: high on the form choice (pre-registered rule, measured) and on the bars' expected values (B0 pins them); the GAIN intent and Elo figures are estimates; G6 under the default answer carries a named residual risk
refs:
  - arch-E1
  - grugops/arch-E1
  - EPIC-011
  - E1
  - E2
  - E3
  - E4
  - ABC-231
  - ABC-232
  - ABC-239
  - ABC-205
  - ADR-0064
  - ADR-0056
  - ADR-0031
  - ADR-0061
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ADR-0028
  - ADR-0055
  - NFR-005
  - NFR-009
  - Q-3K-4
  - a2b593d5
  - 58fa3eb4
  - b11b802f
  - arch-E1/20261102T214348Z-architect-design-decision-01c2d6a5
  - arch-next-pull/20261102T212832Z-architect-design-decision-4de572aa
  - arch-next-pull/20261102T213500Z-architect-design-observation-d0f1a5fc
  - arch-next-pull/20261102T213500Z-architect-design-decision-7e3ace66
supersedes: 
seal: sha256:3d71d7d325a8202b52246cc7d42f4e228dffcae9e9dab753e484df96998cd57b
---

# arch-E1 decisions: `ADR-0064` (PROPOSED). E1 is one linear phase, with every term a middlegame / endgame pair in one data-only parameter table. Only the king (`ABC-231`) and the passers (`ABC-232`) get endgame halves now, behind a test-only off-door pair. Intent GAIN. Pre-registered play bars, plus `G6` graded per `Q-3K-4`'s answer. `ADR-0056` D2 now has the owed "P1 parked after P3" line. BA/PM's inputs to cut E1 are below

Architect/Design, task `arch-E1`, records only, on `grugops/arch-E1` from `main` `a2b593d5`.
- **Inputs:** the PREREG `…01c2d6a5` and the results note of this task; `arch-next-pull` `…4de572aa`, `…d0f1a5fc`, `…7e3ace66`; `ADR-0056` D2 / D7; `ABC-231`, `ABC-232`, `ABC-205`; the `ADR-0031` addendum; `ADR-0061`; `src/evaluate.ts`.

## 1. The ADR: `ADR-0064` (PROPOSED)
**The design:**
- **Phase:** N 1, B 1, R 2, Q 4, out of 24, gathered in the existing walk. Linear (`PHASE_MG` 24, `PHASE_EG` 0).
- **The blend:** mg + trunc(Δ × (D − w) / D), where Δ sums only the terms whose halves differ. It equals the full blend bit for bit, and it is mirror-exact.
- **Values at E1:** the king's endgame half is 40 − 15 m (the `ADR-0031` addendum's rule). The passers' endgame half is 2 × by rank. Every other term has equal halves.

**The seams:**
- **E2's seam:** one data-only module, `src/evaluate-params.ts`, with about 800 numbers as mg / eg pairs. E2 emits only this file.
- **The pawn memo** stores the passed endgame part (384 → 448 KiB).
- **The doors:** one switch, `taper`, in both recursions; `evaluateWithoutTaper`, `searchWithoutTaper` and `chooseMoveWithoutTaper`. Every older door turns `taper` off.

**Cost, as measured** (node counts only):
- **Tree:** `chooseMove` on the `G6` boards reads 0.96–1.035 × at d8–d10. It is identical at phase 24.
- **Work:** about 30 operations per evaluate call, estimated at 1–2 % of node time (`UNKNOWN - verify`; `G2` reads it).

**The bars, pre-registered:**
- **B0, node identity** with the probe's L counts (kiwipete d8 1 296 788 / d9 2 733 330; position-6 d8 404 930 / d9 926 005 / d10 1 692 669; `search()` d8 839 514 / 1 533 901).
- **B1, relations:**
  - the mirror;
  - identity at phase 24;
  - `evaluateWithoutTaper` = `main`'s evaluation;
  - king-and-pawn endings: centre ≥ corner + 20 cp;
  - passers: ≥ 1.5 × at phase ≤ 6, exact at phase 24, ≤ 1.25 × at phase ≥ 18.
- **B2, the mate floor:** 0 violations, both forms.
- **B3, zugzwang 7 / 7.** Hard.
- **B4, `G1`:** ≥ 54 / 58, with none newly missed.
- **B5, `ADR-0061`'s futility audit** on the build, read by QE.
- **B6, `G2`:** ≤ 1.05 ×.
- **B7, `G6`:** by `Q-3K-4`'s answer, below.
- **B8, the read:** C2′ GAIN ≥ 50.0 / 100, S′, and the Levels deep lane.

**Reports:** drift, reach and the evaluation instrument. None of them is graded.

**The falsifiers F1–F6:**
- F3, the cost premise, allows one value-identical cost cut: O1-e-style incremental phase, or a packed score. After that comes one new `G6` reading. Then STOP, and `Q-3K-4` goes to the owner.
- F6: if C2′ misses, the structure may be re-offered value-identical to `main` as E2's base. That is E2's ADR's call.

## 2. Both `Q-3K-4` outcomes
- **The default, "≥ base" binds:**
  - The real-clock `G6` runs at 4 000 ms by `ABC-205`'s reading rule. Medians must be ≥ base on both boards.
  - B0 pins the tree shape in advance.
  - Per-node cost is near zero by construction: one walk, the delta-only blend, no new loop.
  - **The residual risk is named:** a board sitting on a depth edge can flip its median on 1–4 %. No value-changing evaluation can promise otherwise.
- **The alternative, judged on play:** `NFR-005` only (every run ≥ 6; depth 7 is a WARN). "≥ base" is reported, and C2′ decides.
- **The plateau form (P)** read better on the evaluation instrument (39 errors against 49). That reading was information only, and the pre-registered rule chose L on the `G6` shape. P is two parameters in the table, so E2's tuner owns them. No re-read here.

## 3. Owed line, fixed
- **`ADR-0056` D2** has a dated line: row P1 parked after P3 (`arch-post-268`'s three misses: 0.8528, 63 cp, `zugzwang.004`). It did not re-open at the joint probe.
- **Also dated:**
  - `ADR-0056` D2, row E1 → `ADR-0064`;
  - `ADR-0031` addendum status: the taper half is carried by `ADR-0064`; the queen scale and gate are E3's input;
  - `ADR-0061` § Consequences: E1's scale re-read clean (drift 100 %, max 0; mate 0 / 190); the audit is owed by the build.

## 4. What BA/PM needs to cut E1 (`ABC-231` and `ABC-232` folded)
1. **The page:**
   - E1 in `EPIC-011` Phase 4, pulled forward (D6 allows it). Size **M**. Priority is BA/PM's (both folded pages were P3; E1 is the next pull).
   - `ABC-231` closes as merged into E1. `ABC-232` closes as merged into E1 (phase scaling) and E4 (any other passer term). `ABC-205` stays dropped.
2. **Scope:** `ADR-0064` decisions 1–7 (phase, blend, two value changes, the params module, the memo's third part, the switch and doors).
   - **Out of scope:** king safety (E3), new passer terms (E4), tuning (E2), and any other endgame half.
3. **Acceptance:** one row per bar, B0–B8, with the probe figures as the expected values.
   - **What changes from the folded pages:**
     - `ABC-231` A1 (the `G6` replay) becomes B7, graded per `Q-3K-4`;
     - `ABC-231` A2's "within 2 cp" becomes "exactly equal at phase 24", which is stronger;
     - `ABC-231` A4 and `ABC-232` A3 become one `G2` row at ≤ 1.05 ×;
     - `ABC-232` A1's "within 5 cp at phase ≥ 0.75" becomes B1 (e), because the old clause is false by construction for an advanced passer;
     - A5 and A6 (C2′, S′ at E 1 810, the Levels lane) carry over unchanged by reference.
4. **QE freezes before the build:** the 6 king-and-pawn endings and the passer pairs for B1 (d) and (e); the ≥ 15 new mirror positions at phases 0–24.
5. **Migration for sizing:**
   - The lane probe gives an upper bound of 40 pinned or fixture rows in 7 files (`raw/probe/out/E-lane-reds.txt`), classed by `ADR-0064` d7 / `ADR-0028`.
   - The deep lanes are owed. Note `quiescence.test.ts`'s oracle rule.
   - The pawn memo's byte row re-pins 384 → 448 KiB.
6. **Dependencies:**
   - `ADR-0064` acceptance before the read and the merge (reading (b): the build may start).
   - `Q-3K-4` answered before `G6` is graded (the build does not wait).
   - If `main`'s `src/` moves first, B0's counts are re-derived with `patch_e1.py`.
7. **NFR triggers:** `NFR-005` (B7), `NFR-009` (memo +64 KiB), `G2` (B6), `NFR-008` (where the rows go). Security: none (no `ADR-0036` limb).
8. **UAT is owed.** The QE verdict signs it.

## Questions
- **Owner:**
  1. **`Q-3K-4`**, live now and recommended to ask now. Keep `G6` "≥ base" for evaluation tickets, or judge them on play with `NFR-005`'s depth-6 floor? E1 is designed for both. **Architect's recommendation: judge on play**, with the floor fixed. This task measured E1's tree at 0.96–1.035 × on the `G6` boards: a "≥ base" median on a board at its depth edge would grade that noise, not the evaluation.
  2. *"accept ADR-0064"* or *"decline it"*. The default is no taper.
- **Orchestrator:**
  1. Merge this records branch.
  2. Dispatch BA/PM to cut E1 from § 4.
  3. Put `Q-3K-4` and `ADR-0064` to the owner together.
