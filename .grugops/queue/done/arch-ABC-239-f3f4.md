---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T01:42:34Z
subtask: arch-ABC-239-f3f4
role: architect-design
ref: .grugops/context/arch-ABC-239-f3f4/
branch: new grugops/arch-ABC-239-f3f4 from main — worktree .claude/worktrees/arch-ABC-239-f3f4
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Diagnostics small: each run ≤ 30 min, hop ≤ 1.5 h; no games. Seal a PREREG before any measured diagnostic. Read candidates via scratch worktrees of grugops/ABC-239b (never edit that branch). Host paths only as placeholders.
---
# ABC-239 step-6 fail-fast: F3 and F4 NOT MET on the fit of record (se-ABC-239b failed-attempt …c3f94eab)
Facts (se-ABC-239b, candidate 26d06118, emitted sha256 10581fb5…95af): B-T1/B-T2 (0.9905×)/B-T3 MET; bound set = 1 row (king-mobility A2 (b) phase-24 twin, +46 → −3). F3: evaluate.pawns.test.ts A2 doubled-pawn gap 53 vs bar ≤ 50 (base 33, box-only 49). F4: zugzwang.001 plays e1e5 at d9–11 (e1f1 at d12) — second fitted set in a row (da3f8599 same). Stockfish d26: e1e5 −633, e1f1 mate in 10.
Diagnose and rule, as dated lines in ADR-0067 (no bar moves; a bar move or a method change is an owner question — frame it with a recommendation):
1. F4 root cause: which parameters drive e1e5 over e1f1 in zugzwang.001 (trace the leaf evals along both lines on base vs candidate; null move cannot fire there). Is there a relation (a position-pair inequality the bound machinery can carry) that encodes the defect without being a re-pin of the row? Or is it outside what a linear eval fit can hold at this data (then say so)?
2. F3 (a): may a relation green on the box-only fit by less than its own margin join the bound set (all relation rows bounded at once, with margins)? Rule it — it changes the procedure "one refit", so it is a re-open with its own PREREG and must be said so plainly.
3. (c) how the queen-on K1 (c) rows are re-found at step 7 if a candidate gets there.
4. Recommend one path, with host cost: (i) re-open with all relations bounded + an F4 relation, one more refit; (ii) narrower free set (e.g. freeze the terms the F4 trace implicates) ; (iii) close ABC-239 NOT MET under its miss rule and keep E1's table; (iv) other. State which needs the owner.
Fences: memory-bank/50-decisions, your records, scratch. No committed src/tools; no ticket/EPIC edits (list owed lines). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-239-f3f4, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T02:01:26Z. PREREG `…9427005b` (`dcd4be1c`) and its addendum `…80a5bd21` (`f4febc1c`) were sealed and committed before the runs they cover. The reads ran on a scratch worktree of `26d06118` under the host lock, about 4 min of host time. `grugops/ABC-239b` was not touched; the scratch worktree and the symlink were removed.
- **F4's root cause:** joint, in the fitted endgame halves. No single family drives e1e5. Four driver pairs do, each through their eg halves: {P, R}, {P, K}, {P, PASS} and {K, PASS}.
  - The base passes depth 9 by 29 cp of evaluation preference (−390 against −419). Neither table scores White's win at any depth up to 16; both read e1f1 as 0 from depth 14.
  - The king's eg table is now rank-asymmetric and supplies most of the gap between the lines.
  - R1 (the king's centralization is rank-symmetric, CPW) qualifies: base 0, candidate −54. But it binds K only, and reverting K alone keeps e1e5.
  - No passer relation exists on today's features: the h-pawns are frozen by the enemy king's reach, which no term reads. So the row is outside what a linear fit on this feature set can hold. E4a's free path and king distance are the missing class.
- **F3 (a):** NOT MET as written. A row green by less than its margin cannot join the bound set under d6's procedure. The margin-aware form (every relation bounded at once, one fit) is recommended for any later pull. That is a re-open plus a d6 amendment, so it is the owner's word.
- **K1 (c):** form (A). The rows run inside `withParametersForTest` at the frozen king-file pairs, with literals unchanged: 5 / 5 green on both tables. QE checks the bite.
- **Path:** (iii), recommended. Close the first pull NOT MET; `main` keeps E1; host cost 0 now; it does not need the owner (he is notified). (i) is the owner's, about 1–2 h of engineer time plus about 20 min of host to step 6, and F4 is forecast to re-fire. (ii) is a fit chosen on the row, rejected. (iv) moves a bar after a miss, the owner's, not recommended. E4a comes before a second pull.
- **No bar moved.** Records: the `ADR-0067` dated block and log row; notes `…9427005b`, `…80a5bd21`, `…4eae0fd3` (results) and `…69f22167` (rulings, path, owed lines).
- **Owed lines** (not edited here): the `ABC-239` page, `EPIC-011` (E2, and the order E4a → second pull), the `ABC-271` dependency line, `ADR-0056` E2 status, and the board.
