---
id: 20261104T020015Z-architect-design-decision-69f22167
kind: decision
by: architect-design
at: 2026-11-04T02:00:15Z
verified_by: 
confidence: high on F3 / F4 as written and on the measured root cause (D1-D3); medium on the forecasts (R1 insufficient alone, a re-open re-failing F4, E4a supplying the missing feature): each UNKNOWN - verify, not read
refs:
  - arch-ABC-239-f3f4
  - arch-ABC-239-f3f4/20261104T014925Z-architect-design-decision-9427005b
  - arch-ABC-239-f3f4/20261104T015612Z-architect-design-decision-80a5bd21
  - arch-ABC-239-f3f4/20261104T020001Z-architect-design-observation-4eae0fd3
  - ABC-239
  - ABC-271
  - ABC-274
  - EPIC-011
  - E2
  - E4a
  - ADR-0067
  - ADR-0050
  - ADR-0051
  - ADR-0056
  - ADR-0028
  - B-T2
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - F1
  - F3
  - F4
  - F6
  - K1 (c)
  - 26d06118
  - da3f8599
  - grugops/ABC-239b
  - se-ABC-239b/20261104T014043Z-software-engineer-failed-attempt-c3f94eab
  - se-ABC-239b/20261104T014043Z-software-engineer-decision-3a752adc
  - se-ABC-239b/20261104T014043Z-software-engineer-observation-e3751084
  - arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - memory-bank/50-decisions/ADR-0067-evaluation-weights-tuned-offline-by-a-logistic-fit-of-game-results-newton-on-cross-entropy-material-frozen-at-the-first-pull-and-a-value-identical-blend-of-every-half-first.md
supersedes: 
seal: sha256:c2fa8496d68ce3bbb56b15fbab4429070a0243318f886fb04dfc0e537942a4c0
---

# arch-ABC-239-f3f4 decision: F3 and F4 rulings on `26d06118`, the K1 (c) re-find form, and the recommended path. No bar moves

Architect/Design, task `arch-ABC-239-f3f4`, on `grugops/arch-ABC-239-f3f4` from `main` `232f234f`. Evidence: observation `…4eae0fd3` of this task (S0, D1–D5), under the PREREG `…9427005b` and its addendum `…80a5bd21`. The inputs are `se-ABC-239b` `…c3f94eab` (the failed attempt), `…3a752adc` and `…e3751084`. This hop writes only records: the dated lines in `ADR-0067` and these notes.

## 1. F4: the root cause of e1e5 in `zugzwang.001`
- **The disposition stands as written: F4 fires and the candidate is NOT MET.**
  - The defect check is clean: the identity gate on the emitted file found 0 misses, and B-T3 is byte-identical (`se-ABC-239b`).
  - There is no re-pin and no change of depth.
- **The root cause is joint.** The fitted endgame halves of the pawn table, the passer bonus and the king table move the e1f1 pawn ending down by 59 cp. They move the e1e5 rook ending down by 26 cp. The base preferred e1f1 by only 29 cp.
  - D3 found no single family that drives the move. It found four driver pairs, {P, R}, {P, K}, {P, PASS} and {K, PASS}, each through their eg halves.
  - The king's table carries the largest share of the gap between the two lines. At the base's own leaves the gap moves by −33: K −44.5, and the other families together +11.5. The table is now rank-asymmetric: a king on its own back rank is charged far more than one on the enemy's.
- **What the row measures at depth 9.**
  - Neither table scores White's win at any depth up to 16. Both score e1f1 at 0 from depth 14 (D1).
  - So at depth 9 the base plays e1f1 by an evaluation preference of 29 cp. It has not solved the zugzwang.
  - The row stays a B-T5 bar as `ADR-0050` d9 and ruling (c) set it, and e1e5 really does lose (Stockfish −633).
  - The finding is about what the bar can tell apart: any fit that moves the endgame halves of P, PASS or K is likely to flip it.
- **Is there a relation that carries it? Only in part, and that part is not enough.**
  - R1, the rank symmetry of the king's centralization (CPW), meets q1–q4: base 0, candidate −54.
  - R1 binds only K, and reverting K alone keeps e1e5 (D3). So R1 alone is forecast not to hold the row (`UNKNOWN - verify`, not read).
  - The passer part has no relation on today's features. Black's h-pawns are frozen only because White's king covers g1 and g2. `passed` reads enemy pawns only, and mobility does not ask whether a square is attacked.
  - Any pair that charged those passers would charge every advanced passer of that rank, and its principle would be false.
- **So the row is outside what a linear fit on this feature set can hold at this data.** The exception would be to restrict the eg halves the row implicates (freeze or bound P, PASS or K). That is choosing the fit on the row, which ruling (c) and F6 forbid.
- **The missing feature class is `ABC-271` (E4a)'s:** free path ("whether its path is blocked") and king distance.
  - All three h-passers here have blocked paths: h1 holds Black's king, and h2 and h3 hold Black's own pawns.
  - Whether a fit over E4a holds the row is `UNKNOWN - verify`.

## 2. F3 (a): a relation green on the box-only fit by less than its own margin
- **As written: no.** The procedure (`ADR-0067`, ruling (b)) bounds only the rows that read red at step 2. Its step 4 makes a relation red on the candidate "F3's second red: NOT MET".
- **Applied here:** pawns A2 read green at 49 on the box-only fit, with a slack of 1 against a margin of 2.5. It read red at 53 on the candidate. **F3 fires: NOT MET**, alongside F4.
- **For any later pull, the margin-aware form is the better method, and it is recommended:**
  - every relation row of `src/evaluate*.test.ts` is bounded from the first fit, each with ruling (b)'s margin, in one fit with no refit step;
  - a row the optimum holds with slack ≥ its margin is inactive and changes nothing (tool row (2) shows the output is byte-identical);
  - a red relation on the emitted set then becomes a tool defect (F1's class), because the bounds hold by construction;
  - an infeasible bound set is a STOP to Architect/Design;
  - pawns A2 is feasible at the base table (33 against 50 − 2.5).
- **Said plainly, this is a re-open.** It replaces d6's pre-registered "one refit" after a red was seen. It needs its own PREREG and an amendment of an accepted ADR's decision. **That is the owner's word** (`45-standing-rulings.md`, 2026-10-22: a new or reversed ADR). It is not taken here.

## 3. K1 (c): how the rows are re-found at step 7, if a candidate gets there
- **Form (A).** Each K1 (c) row runs inside `withParametersForTest`, with the six king-file pairs at the values its literals were frozen at:
  - base 15 / 10 / 20 in both halves, written as named constants with "E1's rule values; queen-on 0";
  - the "before" reads run inside the same seam;
  - every expectation literal and the assertion form are unchanged.
- **D5:** 5 / 5 green on the candidate, and 5 / 5 green on the base.
- **Conditions, checked by QE, together the `ADR-0028` d2 re-find:**
  1. With the queen-on term zeroed in `src/evaluate.ts`, each row turns red (its bite).
  2. The seam is only called from test files (`ABC-274` S3).
  3. The data row "each pair is { 0, 0 }" is a pin of the old table. It is re-pinned old → new under B-T4, or covered by the provenance row, and it is listed in the re-pin table.
- **Re-pinning by halves (form B) is rejected.** The tuned base shelter and half-open pairs are 0 / 0. So "3 × its queenless exposure, > 0" would lose its bite, and the literals would move with every pull.

## 4. The path: recommended (iii)
| path | what | host cost | forecast | the owner's? |
|---|---|---|---|---|
| (i) | re-open: every relation bounded at once, + R1, one more fit | engineer about 1–2 h (`bounds.ts` gains every relation row, count `UNKNOWN - verify`); about 20 min of host to step 6 (two runs of about 5 min for B-T3, the gate, the reads); if green, step 7 about 1–1.5 h, B-T7 about 0.7 h, B-T8 about 5 h | F3 holds by construction. **F4 forecast to fire again:** R1 binds K only, and the box-only set, `da3f8599` and `26d06118` all play e1e5 | **yes**: d6 amended, and R1 is a new relation row |
| (ii) | narrower free set: freeze the eg halves D3 names (K, PASS or P) | the same as (i) | it may pass F4, but only by choosing the free set on the row, and B-T2 is re-read without the eg signal | rejected: fit chosen on the row (ruling (c), F6) |
| **(iii)** | **close `ABC-239`'s first pull NOT MET under F3 and F4 as written; `main` keeps E1's table** | **0 host now** | — | **no.** It applies pre-registered dispositions (the Orchestrator's, under the 2026-10-22 delegation). The owner is notified |
| (iv) | move `zugzwang.001`'s depth for tuned tables (9 → 12; precedent `zugzwang.005` 12 → 13, `ADR-0051`) | 0 | it passes at 12 | yes, and it is a bar moved after a miss was seen. **Not recommended** |

**Why (iii):**
- Three fitted sets in a row play e1e5: `se-ABC-239`'s `da3f8599`, and `se-ABC-239b`'s box-only set and `26d06118`. They come from two builds, with and without `ABC-270`'s terms, on own-game sets that differ.
- The cause sits in the fit's endgame signal itself, and the feature that would let the fit keep that signal and still hold the row is E4a's.
- Re-opening now buys a likely third F4 miss for about 2 h of engineer time and 20 min of host.

**The follow-ons after (iii)** (each its own hop, named; none is taken here):
1. **BA/PM may cut a tools-only landing of `tools/tune`** from `grugops/ABC-239b`'s tool commits (`625b75fe`, `5ce4f870`, `def26997`, `8c03b713`):
   - no fitted table and no `src/` line, so UAT is waived by the zero-production-lines rule;
   - the next pull then does not rebuild the tool;
   - this is optional, and BA/PM's call.
2. **`ABC-271` (E4a) comes before a second pull.**
   - `ADR-0067` § Consequences item 5 reads "after `ABC-239`". After (iii), the Orchestrator orders it.
   - Its free-path and king-distance terms are the features F4 lacks.
3. **A second pull is a new attempt under F6's rule, with its own PREREG**, on `main` with E4a. It carries:
   - the margin-aware bound set (§ 2), which needs the owner's word then;
   - R1 as a relation row, if the owner adds it.
   - Until then, `main` keeps E1's table.

**If the Orchestrator prefers (i) to (iii),** the question for the owner is: *"amend `ADR-0067` d6 so that every relation row is bounded at once with its margin (one fit, no refit), and add R1 as a relation row, for one more fit of `ABC-239`?"* The recommendation is no, for now: (iii), then E4a.

## Owed lines (not edited here)
- **`ABC-239` page:** step 6's outcome (F3 and F4 NOT MET on `26d06118`, citing these notes) and the disposition the Orchestrator takes. If it closes, the closing line and E1 kept. Step 7's K1 (c) form is (A) (§ 3), for any later candidate.
- **`EPIC-011`:** row E2's status. The order E4a → second pull.
- **`ABC-271` page:** a dependency line saying its free-path and king-distance terms are the features `zugzwang.001`'s F4 needs before a second pull (this decision).
- **`ADR-0056`:** row E2's status line (BA/PM, if E2 closes).
- **`plans/board.md`:** the Orchestrator's.
