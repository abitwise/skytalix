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
