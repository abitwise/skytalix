---
id: 20261029T195200Z-architect-design-decision-0c5d62f4
kind: decision
by: architect-design
at: 2026-10-29T19:52:00Z
verified_by: 
confidence: medium: ranking from records only; the next step is a proposal for the owner
refs:
  - arch-epic008-rd
  - EPIC-008
  - M1
  - RISK-EPIC008-03
  - ABC-208
  - ABC-215
  - ADR-0050
  - ADR-0048
  - 3497aad2
  - ba74b71d
  - b5c67ab7
  - orch-2026-10-29g/…517260b8
  - orch-2026-10-29g/…ef6ab697
  - qe-epic008-q4c/…8d08e519
  - qe-epic008-q4c/…83be15a1
  - qe-epic008-q4c/…311eb14b
  - qe-epic008-q4c/…172ff9be
  - qe-epic008-close/…f361ab33
  - qe-epic008-close/…e8d5c13a
  - qe-epic008-close/…bdbccbbf
  - bapm-close-EPIC-008/…e53131ba
  - qe-ABC-208/…0477ac64
  - qe-ABC-215/…c2c3540f
  - ADR-0049
supersedes: 
seal: sha256:76ac541f2cbf5bb8352f89469826ce7d7284496cb7611fcb48f2732ab759d4d3
---

# Architect decision, arch-epic008-rd: the R/D split is most likely real non-transfer of the shipped changes from self-play to Stockfish, with R's size probably inflated by chance; host, build and openings are ruled out. Next step proposed to the owner: a three-sha R gauntlet that splits ABC-215 from ABC-208 (about 13.5 h at width 2)

The evidence and its counts are in the observation note sealed with this one (task `arch-epic008-rd`). Records only. This note does not re-grade `M1` and does not edit the EPIC-008 page; both stay with BA/PM on the owner's word.

## The ranking (most likely first)
1. **Opponent dependence: the shipped changes do not transfer from self-play to Stockfish.** `RISK-EPIC008-03` in its strong form.
   - D is replicated at about +50: `ABC-208` + `ABC-215` = +54.0 ± 33.3 on the previous host, and the look reads +52.5 ± 46.8 here.
   - R's drop shows on both halves of the openings and on both colours.
   - R2's extra losses turn in the middlegame (16 → 35 lost games), which is where both changes act.
   - **What the records cannot separate:** this explanation from explanation 3 (time per move), and `ABC-215`'s share from `ABC-208`'s.
2. **Chance in R, on the size and not the sign.**
   - If the true effect were 0, R would read ≤ −82.9 with p = 0.6–1.4 % (one-sided).
   - If R and D measured the same quantity, a split this large would have a joint p of 0.001–0.002. So chance alone is unlikely to explain the opposite signs.
   - R is a single pair of runs with Y = 73.8, so its −82.9 may overstate the size. The opening-paired re-analysis gives −82.9 ± 64.3, interval [−147.2, −18.6]. That is information only; the graded figure stays the tool's.
3. **Time per move (3 s against 1.5 s).**
   - It cannot be separated from explanation 1: no record has the same opponent at both budgets.
   - Nothing in the records points to it. The close gains about the same depth at both budgets (+0.96 and +0.74 ply). The prior (null move gains more with time) points the other way.
4. **Host load, heat and order: disfavoured.**
   - Stockfish's nps, the same binary in both readings, is 1.643 M in R1 and 1.623 M in R2 (−1.2 %), and flat by quarter.
   - skytalix's speed in R relative to its own D speed is 96.2 % for the baseline and 97.9 % for the close.
   - R has no frequency log, so throttling is not excluded outright. Any effect is small and falls on both readings.
5. **The opening set and colours: excluded.** R2 − R1 is −71.7 on D's openings (1–50) and −93.8 on 51–100. By colour it is −84.1 as White and −81.7 as Black.
6. **The artifact and the build: excluded.** D's two `dist/` trees are byte-equal to R1's and R2's (`726e5225…1ce4`, `a4cba481…e2a2`). R1's and R2's trees differ in exactly the 6 non-test source files of `3497aad2..b5c67ab7`.

Per game phase and result type, which the brief asked to cover, is the mechanism side of explanation 1, not a separate cause. R2's extra losses are mid-length (61–120 plies: 20 → 35). Their turning points move from ply 101 to 73.5 (medians). The rate of single-move "unseen" errors does not clearly rise (71 → 75).

## What each would mean for M1 and for the method
- **For `M1`'s grade, under every explanation:**
  - Clause 1 (≥ +100) fails even on D's own number: +52.5, upper limit +99.3. So NOT MET does not hang on this question.
  - What does hang on it is clause 2 (interval above 0) and the sentence "main is weaker than `3497aad2`".
- **If explanation 1 holds:**
  - The sentence is true on the measure the epic chose, at the product's own level-5 budget.
  - At least one shipped change costs strength against an outside opponent.
  - S1 and S3 shipped on D, so `RISK-EPIC008-03`'s mitigation ("`M1` is R") caught the problem only at the close, after the merges.
  - Method: a change that alters values should not ship on self-play alone. Its ship rule needs an outside-opponent reading at the product budget, before merge. That is a question for BA/PM and the owner, for any later strength epic.
- **If explanation 2 holds:**
  - The drop's size is overstated. Its sign is still more likely ≤ 0 than not, given the p-values above.
  - Method: report R differences with opening-paired (pentanomial) errors next to the tool's Y. Replicate R before a grade rests on one pair of runs.
- **If explanation 3 holds:**
  - R at 3 s is the owner's real level-5 budget, so R is still the measure that matters to him.
  - Method: D at 1 500 ms (frozen at `A6` for wall time only) is not a stand-in for 3 s.
- **If explanation 4 held** (disfavoured), both readings would carry the same error and would not be voided.
  - Method: measure host speed with the opponent's nps, which the `-debug all` log already records, and not with skytalix's depth. A pruning change makes depth incomparable across builds.
- **Explanations 5 and 6** are excluded and have no consequence.

## The one recommended next step: a proposal for the owner (needs games; nothing is queued by this note)
**A three-sha R gauntlet, information only unless the owner says it counts.**
- **The shas:** `3497aad2` (the baseline), `ba74b71d` (`ABC-215` only), and main (src/data = `b5c67ab7`).
- **The protocol:** each read by the existing `rating.ts r` shape: Stockfish 19 at E = 1 910, skytalix at 3 000 ms, 200 games (100 openings, both colours), width 2. The pins are unchanged, and no `tools/` change is needed.
- **The order:** `ba74b71d`, then main, then `3497aad2`, the reverse of last time for the two that are re-read. Host speed is checked from Stockfish's nps in each `-debug all` log, and QE's Q4 (c) frequency sampler runs beside it.
- **What it answers:**
  - Whether R's drop replicates (explanation 2), on both endpoints.
  - How much of it is `ABC-215` (`ba74b71d` − `3497aad2`) and how much is `ABC-208` (main − `ba74b71d`).
  - That attribution is what the owner needs to decide whether to keep main or take one change back out.
  - It does not split opponent from time, and the product decision does not need that, because the owner plays at 3 s.
- **Cost:** 600 games at this host's R rate of 44–46 games/h (`A6`: 4.34 h and 4.52 h per 200) is **about 13.5 h, plus about 1 h for QE**. It runs ALONE, whenever the board is idle (Q2), and can be split into three self-contained runs of about 4.5 h each on separate idle windows.
- **Heat:** R at width 2 ran at a Tctl median of 82–83 °C and a max of 84–87 °C for 4.3–4.5 h per reading. Expect the same per run. Width 1 still reached 95.5 °C under foreign load (`…311eb14b`). A width-1 version would take about twice as long and would not be comparable to R1 and R2.
- **A cheaper cut, if the owner wants one:** drop the `3497aad2` re-read (about 9 h + 1 h). That loses the re-test of R1, which sat 0.25 points inside the band.

## STOP
None. No board edits, no `src/`, `data/` or `tools/` edits, no games and no engine probes.
