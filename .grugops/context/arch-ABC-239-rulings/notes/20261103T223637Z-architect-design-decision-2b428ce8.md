---
id: 20261103T223637Z-architect-design-decision-2b428ce8
kind: decision
by: architect-design
at: 2026-11-03T22:36:37Z
verified_by: 
confidence: high on (c) (Stockfish 19 d26, the ADR-0050 d9 instrument, rule 2 by a wide margin) and (d) (decision 9's text); high on (b)'s math (convex loss, linear model, rounding bound); medium on B1 (e)'s retirement (an Architect reading, flagged)
refs:
  - arch-ABC-239-rulings
  - grugops/arch-ABC-239-rulings
  - ABC-239
  - ABC-270
  - ABC-274
  - ABC-269
  - ABC-083
  - ABC-215
  - EPIC-011
  - ADR-0067
  - ADR-0068
  - ADR-0064
  - ADR-0031
  - ADR-0050
  - ADR-0028
  - B-T1
  - B-T2
  - B-T3
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - F3
  - F4
  - F6
  - Q1
  - se-ABC-239/20261103T220702Z-software-engineer-failed-attempt-f39f6eb5
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - arch-ABC-239-rulings/20261103T222530Z-architect-design-decision-90b469ca
  - da3f8599
  - 03fcaaa0
  - 9eeb0314
  - 77034175
  - 80f128f8
supersedes: 
seal: sha256:9a56393adbbc9f48d5a3e38861177a5aefec4c2fca789015ae843e653babe37a
---

# arch-ABC-239-rulings: the rulings that unblock ABC-239. (b) F3's bound form; (c) zugzwang.001's e1e5 is a safety failure, so the row stays; (d) the 58 probe games enter; two E1 rows retire. No bar moves

Architect/Design, task `arch-ABC-239-rulings`, on `grugops/arch-ABC-239-rulings` from `main` `77034175`. The rulings are dated lines in `ADR-0067`: one block under the bars table, plus pointers in d6, d9 and the decision log. The evidence is PREREG `…90b469ca`, sealed and committed (`80f128f8`) before any run, and the results note of this task.

1. **The fit of record.** `da3f8599` is not it. `ADR-0068` d7 takes the fit on a `main` that contains `ABC-270`. The next hop fits again there, and that fit is F3's "emitted set".
2. **(b) F3's bound** is the red relation row itself, as one linear inequality on the parameters.
   - a = trace(L) − trace(H) under d4's model: per term × w/24 (mg) and × (24 − w)/24 (eg), each position at its own w; Δm on W_mg / W_eg; tied cells summed. Array rows bound the parameters they read. Threshold rows carry their threshold.
   - The margin is ½ ‖a‖₁ (rounding), + 1 per position with 0 < w < 24 (trunc), + 1 for a strict sign. So the integer set holds the row by construction.
   - The solve: projected Newton with active rows as equalities. The KKT / Schur form: v = −H_F⁻¹ g_F, U = H_F⁻¹ A_Fᵀ, μ = (A_F U)⁻¹ (A_F v − r), Δ = v − U μ. A row with μ < 0 leaves, and the box bounds keep their rule. One active row with an unbounded C-F cell may be eliminated instead (a tie). There is no penalty term and no freeze.
   - The procedure, which is the one refit: (1) a box-only fit, emitted to scratch; (2) run the relation rows of `src/evaluate*.test.ts`; (3) each red row is a bound, refit once, and that emission is the candidate; (4) a relation red on the candidate is NOT MET (F3's second red). With no red row at step 2, step 1's set is the candidate.
   - `ABC-083` A2 (b) crosses pawn PST g6 / g2 (tied b6 / b2), `KING_SHELTER_MISSING`, W, and after `ABC-270` the queen-on shelter mg if its twin holds a queen. Its phase-24 twin (`ADR-0068` d5) is forecast red on `da3f8599`'s mg values (`UNKNOWN - verify`).
3. **(c) `zugzwang.001`.** e1e5 is a SAFETY FAILURE (PREREG rule 2). Stockfish 19 at d26 (`ADR-0050` d9's instrument) scores forced e1e5 at −633 and forced e1f1 at mate in 10. The row stays e1f1 at depth 9. There is no accept set, no re-pin and no depth change. The refit's candidate must play e1f1, or F4 applies: a defect check, then NOT MET. No fit on play (F6).
4. **(d) The own-games set.** The 58 `skytalix-a` / `-b` and `sky-a` / `-b` games enter. Decision 9's rule is "both players are this engine", and they are. The prototype's `skytalix` / `base` set was a scratch choice. The player list (six names) goes in the header.
5. **Retired at `ABC-239`, named in `ADR-0067`'s line:**
   - (i) the `differ` assertion of "every pair holds two halves of one shape; only the king's square and the passers differ". E1 structure, made obsolete by `ABC-274`. The shape assertions stay in a renamed row.
   - (ii) `ABC-269` B1 (e), whole: 36 pair rows and "by array". It is E1's passer rule (eg = 2 × mg) read through the blend, the same rule as `ABC-215` A2's rows, which d6 retires. `ABC-274` A3 and `ADR-0064` B1 (b) keep the blend graded.
   - **Flag:** retiring B1 (e) is an Architect reading. If the Orchestrator reads it as a bar, it is an owner question.
   - Kept: B1 (d), a relation, green on `da3f8599`. Its door literal is a pin.
6. **Pointers.** `ADR-0064` d10 and the `ADR-0031` addendum now read that `ADR-0068` is ACCEPTED 2026-11-03 and not in force until `ABC-270` merges. `ADR-0064` B1 (e) gains its retirement line.
7. **The next SE hop, exact steps:**
   0. **Precondition:** `ABC-270` merged on `main`. If it is declined or fails, the fit runs without the queen-on features, and A2 (b) stays the phase-0 row (`ADR-0068` d7).
   1. Rebase (or cherry-pick) `grugops/ABC-239`'s tool commits `9eeb0314`, `03fcaaa0` onto that `main`. Drop `da3f8599`. Nothing is merged into `main`.
   2. One tool commit, `TUNE_DEEP` lane green:
      - the tracer traces the three queen-on features, plus the K1 (c) count row (d5 dated line);
      - the free set gets queen-on mg ≥ 0 and eg held at 0 (d6 dated line);
      - `OWN_PLAYERS` is the six names (d);
      - linear-inequality bounds with the three tool test rows and the FEN source row (b).
   3. `extract | fit | emit` box-only, emitted to scratch, under the host lock, with the four data-stage stops. B-T1 on the full set.
   4. In a scratch tree with that file, run each `src/evaluate*.test.ts` file's relation rows. The red ones are the bound set. Note `zugzwang.001` at d9 there; it is not graded yet.
   5. Refit once with the bound set, if it is non-empty, and emit `src/evaluate-params.ts`. Then: the identity gate re-run on the emitted file (d5 dated line 2); B-T2 < 1.000 ×; B-T3 (two full runs, byte-identical, the bounded refit included). Commit the candidate.
   6. **Fail fast, before any re-pin:** every relation row green (else F3, NOT MET → STOP to Architect), and `zugzwang.001` e1f1 at d9 (else F4 → STOP).
   7. Tests:
      - retire the two named rows, with a dated comment pointing to `ADR-0067`;
      - re-pin every pin per B-T4, in one PR table (file, row, old → new). Quiescence deep pins and `ORACLE_AT_DEPTH_3` are re-pinned only by re-running the oracle;
      - re-find each lost fixture property under `ADR-0028` d2 (king-mobility A4's rig, B1 (a) M-negzero-a, QE-208-a, the ordering / futility / transposition "fixture bites" rows), never loosened;
      - then `npm test`, lint, typecheck, build.
   8. Deep lanes, one at a time under the lock: taper, search, quiescence, transposition (both), futility, null-move (zugzwang 7 / 7, `.004` / `.005` included), PVS/LMR, puzzle (`G1`), engine. Deep pins follow B-T4. B-T5: mate floor 0, `G1` ≥ 54 / 58 with none newly missed, the futility audit. Then B-T4 `G3` / `G2` ≤ 1.02 × and B-T6 `G6`, as the page assigns them.
   9. Hand to QE: B-T5 first. B-T7 / B-T8 run only after Q1 has merged or missed (the freeze rule).
