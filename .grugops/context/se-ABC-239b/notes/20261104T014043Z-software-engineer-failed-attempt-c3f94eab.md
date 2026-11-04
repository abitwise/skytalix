---
id: 20261104T014043Z-software-engineer-failed-attempt-c3f94eab
kind: failed-attempt
by: software-engineer
at: 2026-11-04T01:40:43Z
verified_by: 
confidence: high (both reds read twice: the test file and the tracer's integer blend / chooseMove at depths 9-12); the class labels of the non-bar reds by reading each failure, not acted on
refs:
  - se-ABC-239b
  - grugops/ABC-239b
  - ABC-239
  - ABC-270
  - ABC-279
  - EPIC-011
  - E2
  - ADR-0067
  - ADR-0068
  - ADR-0069
  - ADR-0048
  - ADR-0028
  - B-T0
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - F3
  - F4
  - QE-270-e
  - NFR-008
  - a8fbade5
  - 625b75fe
  - 5ce4f870
  - def26997
  - 954d44fb
  - 8c03b713
  - 26d06118
  - arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261103T223750Z-orchestrator-decision-912ba57d
  - orch-2026-10-30a/20261104T010343Z-orchestrator-decision-d7605102
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - tools/tune/tune.ts
  - tools/tune/tracer.ts
  - tools/tune/bounds.ts
  - tools/tune/tune.test.ts
  - src/evaluate-params.ts
  - src/evaluate.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - src/evaluate.pawns.test.ts
  - src/search.null-move.test.ts
supersedes: 
seal: sha256:68db5d5a73512dbe234f77583a08d59a92a1d019a489136c9cecd5cdf5bad791
---

Cause: engineer

# se-ABC-239b STOPPED at step 6, before any re-pin: F3 (a relation red on the candidate, the second red) and F4 (`zugzwang.001` plays e1e5 at depth 9). The candidate is NOT MET under `ADR-0067` § What happens on a miss. STOP to Architect/Design

Software Engineer, task `se-ABC-239b`. Candidate `26d06118` on `grugops/ABC-239b`, `src/evaluate-params.ts` sha256 `10581fb5…95af`. B-T1, B-T2 (0.9905 ×) and B-T3 are MET (data note). Step 6 is the fail-fast, and both of its reads failed. Per the brief, nothing was tuned around them. No tool defect was found: the gate on the emitted file and B-T3 are clean, so the misses are the method's and the data's, not the code's. No re-pin, no retirement beyond d6's provenance swap, no deep lane, no second refit and no game.

**1. F3: `src/evaluate.pawns.test.ts`, "A2 — doubled pawns score lower, by no more than 50 centipawns" / "c3/c4 scores strictly lower than c3/d3 for white, and the gap is <= 50".** This is a threshold relation (B-T4's relation class).
- The gap score(c3/d3) − score(c3/c4) on positions `7k/2pp4/8/8/8/2PP4/8/7K w - - 0 1` and `7k/2pp4/8/8/2P5/2P5/8/7K w - - 0 1`, both at phase 0:
  - **base table 33; box-only set 49 (green, 1 cp inside the bar); candidate 53 (red, bar ≤ 50)**.
  - `evaluate` on the committed file reads 53; the tracer's integer blend reads 53 as well.
- As a row: a = trace(c3/c4) − trace(c3/d3) = PST pawn c4 eg +1, DOUBLED eg −1, ISOLATED eg −2, pawn d3 eg −1 (w = 0). The upper bar reads −aᵀθ ≤ 50.
- **Why it turned red:** the one refit moved the eg values to hold the one bound (A2 (b)'s twin). This row was green on the box-only fit with less slack than its own rounding margin (½ × 5 = 2.5), so it was never a bound. Ruling (b)'s procedure bounds only the rows red at step 2, and step 4 makes any relation red on the candidate NOT MET, with no second refit. The procedure's text has no row for "green at step 2 by less than its margin". That is the Architect's to rule, not mine. Reported, not acted on.

**2. F4: `src/search.null-move.test.ts` A2, `zugzwang.001` (`8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1`).** The shipped `chooseMove`, on a frozen clock, plays:
- **depth 9: e1e5** (score −421); depth 10: e1e5 (−428); depth 11: e1e5 (−442); depth 12: e1f1 (−430).
- The box-only set also played e1e5 at depth 9 (step 4's note). This is the same pattern `da3f8599` showed (ruling (c)): e1f1 three plies late.
- **Defect check first (F4's rule):** the identity gate on the emitted file found 0 misses over 1 212 172 rows (queen-on features live), and B-T3 is byte-identical. No tool defect was found, so the miss is real: **NOT MET**. No set is re-fitted to pass it (F6).

**Also red on the candidate, none of them bars and none acted on (step 7's work, not reached).** The list is `.grugops/context/se-ABC-239b/raw/out/step6-candidate-evaluate-files.txt`:
- **Retirements:** B1 (e) ×37 and the `differ` row.
- **Pins:** B1 (c) ×2, B1 (d)'s door literal ×6 (their ≥ 20 cp relations hold at 103–213), queen-on K1 (b) ×3 and the "{ 0, 0 }" row, A9 K1 (d)'s literal 16 474 → 16 390.
- **Lost fixture premises:** king-mobility A4's rig (`evaluateWithoutMobility` reads −2; its relation holds at +90 / −90), B1 (a) M-negzero-a, QE-208-a (1 abort inside a null subtree, not ≥ 3), and queen-on K1 (c) ×5. Those rows were written against E1's base king-file pairs; under the tuned pairs their {mg: cp, eg: cp} form cannot be re-pinned literal for literal and needs an `ADR-0028` d2 re-find.

**For the Architect (each a ruling; none was taken here):**
- (a) F3 on pawns A2: NOT MET as written. If a re-open is wanted, does a relation that is green at step 2 by less than its own margin join the bound set? That would make the procedure margin-aware, and it is a new pre-registration (F6 forbids fitting on play, not this).
- (b) F4 on `zugzwang.001`: NOT MET, on two fitted sets in a row (`da3f8599` and this one), both through the search and not the tool. Whether a re-open names a relation row that guards this position (a structural fix such as `ABC-272`), or leaves the row as the falsifier, is yours.
- (c) The K1 (c) rows' re-find form (pin E1's king-file pairs inside their seam, or re-pin by halves), if a later candidate gets to step 7.
