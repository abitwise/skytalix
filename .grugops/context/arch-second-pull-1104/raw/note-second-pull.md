# arch-second-pull-1104 decision: the ADR-0067 d6 amendment is ADOPTED (every relation bounded at once from the first fit, margin-aware, no refit), B-T8 is re-confirmed for the second pull, QE-271-f/-g/-h/-i are written as four preconditions, and the owed ABC-301 lines for BA/PM

Architect/Design, task `arch-second-pull-1104`, records only, on `grugops/arch-second-pull-1104` from `main` `fad72f17`. Nothing was run. Inputs: the owner's word `orch-2026-10-30a` `…dda43b71` ("1. yes; 2. yes"), the Orchestrator's dispositions `…264e420e`, QE's `qe-ABC-271` notes (`…74da20bf`, `…d0f7af61`, `…78f353e7`, `…2608eabc`, `…fa3054e5`, `…c55891e0`), `ADR-0067`, `ADR-0070`, and `arch-ABC-239-f3f4`'s dated line.

## 1. ADR-0067: the d6 amendment (owner item 1)
- **Adopted for the second pull and every later pull.** Every relation row of `src/evaluate*.test.ts` is a bound from the first fit, with ruling (b)'s margin (½ ‖a‖₁, plus 1 per position with 0 < w < 24, plus 1 for a strict sign). There is one fit and no refit step.
- **F3 now reads:** a relation red on the emitted set is a defect, as F1 is. It is fixed, and the same procedure re-runs on the fixed tool. An infeasible bound set is a STOP to Architect/Design. The old "one refit; a second red: NOT MET" is the first pull's history.
- **The second pull's step list changes as follows:**
  1. The bound set is listed in the PREREG before any fit. That means every relation row (file, row, a's non-zero terms, right side) and the count. E4a's weights enter each row's a by d6's 2026-11-04 rule. A non-linear relation row is a STOP here.
  2. One fit with box, sign and relation bounds. Its emission is the candidate. There is no box-only scratch fit.
  3. The relation rows are run on the emission. A red is a defect.
  4. Infeasible means STOP. No row is dropped.
  5. The gates follow in their written order, unchanged.
- **What it replaces:** d6's "becomes a bound and the fit runs once more", B-T4's "a bound and one refit", the procedure "the one refit" (steps 1–4), and the "enters the bound set only if red at step 2" line.
- **What stays:**
  - `zugzwang.001` stays a B-T5 / F4 safety row and is not bounded.
  - R1 (the king's rank symmetry) is not a test row. The PREREG may add it, but only before any fit.

## 2. ADR-0067: B-T8 (owner item 2)
- Re-confirmed for the second pull: the 200 + 200 outside pair at 0.5 s against Stockfish, about 5 h, before it merges. His approval covers this run over 1 h. The bar is unchanged: point estimate ≥ 0.

## 3. ADR-0070 d3: the endgame cost restated (QE-271-f)
- About **1.12 × per call** on the endgame report set (1.1246 / 1.1169, mean 1.1207, host gated at 60 °C), against d3's "about 1.085 ×" (the probe's 1.084 / 1.086).
- In search, ns per node is 1.021 / 1.037 × at depth 9.
- K3's graded set never enters the loop: five roots are at phase 24, and the sixth has no passer.
- **The second pull's PREREG grades an endgame cost row.** `ADR-0067` B-T4 gains the endgame `G2` on that six-position set at B-T4's own level, ≤ 1.02 ×, with the A5 instrument. The pull is constants-only, and the loop does the same work at any value, so the row should read about 1.00. It grades that the pull adds no cost where the loop runs.
- E4a's own 1.12 × is not graded again. It is on `main`, accepted under K3, and B-T7 is played on the clock, so its score already prices that cost in.
- F2's named cut stays a possible value-identical speed ticket. It is not a precondition.

## 4. ADR-0070 d4: QE-271-g and QE-271-h
- **`pawnStructureForTest` is accepted** as a second test-only seam (the Engineer's flagged reading 4). Owed: its caller guard, one more filter in the "test files only" source row.
- **The hot-path row is owed.** On QE's 44 frozen fixtures, at the probed values inside `withParametersForTest`, the white-POV `evaluateAtPhase(p, 0)` minus the same at the shipped values equals the seam's white (kd + free + un) minus its black. The equality is exact at phase 0. The row kills E14–E16 and goes in the default lane.

## 5. Owed lines, BA/PM: the second-pull ticket (next id `ABC-301`)
- **Title (suggested):** "E2's second pull: the tuner refits on a `main` with E4a's structure. Every relation is bounded at once (`ADR-0067` d6 amendment). King distance and free path are freed (eg ≥ 0, mg 0), and U is held at 0. One read judges both (B-T7, B-T8)".
- **adr:** `ADR-0067` (accepted; the d6 amendment adopted, `…dda43b71`) and `ADR-0070` (accepted in form (a); d7). DoR row 10 is met.
- **Size L, priority P2** (recommended; the sizing is BA/PM's). The work is the tool change (the bound-set enumeration, the four exports, the tracer's E4a features), one fit, the re-pins and the reads, including about 5 h of B-T8.
- **Intent: GAIN** (C2′ ≥ 50.0).
- **Preconditions (scope 0), each met and read green before the fit is taken:**
  1. `QE-271-h`: the hot-path row (`ADR-0070` d4's dated line). Test-only, default lane.
  2. `QE-271-g`: the caller-guard row for `pawnStructureForTest`. Same SE hop.
  3. `QE-271-i`: `tools/tune`'s emitter writes the four E4a exports (13 → 17 exports; U written at its held 0). The tracer traces E4a's features (`ADR-0067` d5's 2026-11-04 line), with its tracer row. B-T1 holds at the base values. A tool row: an emission at the base values gives exports equal to `main`'s value for value, and typecheck passes.
  4. `QE-271-f`: the endgame `G2` row, written into the PREREG.
- **Scope:**
  1. The `tools/tune` changes above, plus the bound-set enumeration: every relation row's FEN as a constant, and the source row that checks each FEN appears literally in its test file.
  2. The PREREG, sealed first. It lists the bound set and its count, the free set, data and player names, the base SHA, the bars and the endgame `G2` row.
  3. One fit and the emission of `src/evaluate-params.ts`.
  4. B-T4's re-pins, old → new, in one PR table, plus the rows retired at `ABC-239`, which now retire here.
  5. The reads.
- **Bars:** B-T0–B-T8 by reference, at their levels (`ADR-0067`'s bars table and its 2026-11-04 dated line under it). What changes:
  - F3's form (section 1 above);
  - B-T4's endgame `G2` row at ≤ 1.02 ×;
  - B-T8 re-confirmed.
  - Falsifiers: `ADR-0067` F1–F8, with F3 restated. `ADR-0070` F4: every E4a eg half left at its 0 bound is recorded as dead weight. `ADR-0070` F5: a NOT MET read means not merged, the structure stays, and nothing is re-fitted on play.
- **Out of scope:**
  - U freed or valued;
  - E4a's mg halves;
  - material;
  - R1, unless the PREREG adds it before the fit;
  - any `src/` change beyond `src/evaluate-params.ts`, the B-T4 re-pins and the replacement provenance row;
  - `ABC-272`, which goes one at a time on the evaluation files.
- **NFR lines:**
  - `NFR-001` / `G2`: B-T4, two sets.
  - `NFR-005`: B-T6 (`Q-3K-4` (b)).
  - `NFR-008`: the precondition rows are units in the default lane, and the tool's tests stay outside it. **Flag:** on `ABC-283`'s branch the lane median read 9.60 s (`QE-283-a`, `R-N8H-1` MEDIUM, `Q-N8H-1`'s trigger fired). The merged tree's headroom is `UNKNOWN - verify` until the Security/NFR hop after `ABC-283`'s merge.
  - `NFR-009`: unchanged.
- **Dependencies:**
  - `ABC-271` (merged `872e5ffc`) and `ABC-280` (the tool, merged `0c8b385a`).
  - `ABC-283` lands before the candidate freeze. A value-changing merge after the freeze makes B-T7 stale (C2′'s rule).
- **Host time:** the fit takes minutes; B-T7 about 0.7 h; B-T8 about 5 h, owner-approved.
- **EPIC-011 lines:**
  - § Phases, row E2: the second pull is cut as `ABC-301`.
  - § Owner questions: the d6 amendment and B-T8 answered yes (`…dda43b71`).
  - § Tickets: a new row for `ABC-301`, and the ids line.
  - § Dependencies: `ABC-271` → `ABC-301`, one read judging both.
