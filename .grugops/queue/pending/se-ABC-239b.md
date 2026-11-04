---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T01:04:18Z
subtask: se-ABC-239b
role: software-engineer
ref: .grugops/context/se-ABC-239b/
branch: new grugops/ABC-239b from main (has ABC-270 a81a6c7d and ABC-279 7b70e268) — worktree .claude/worktrees/se-ABC-239b
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Each fit ≤ 30 min; hop host ≤ 2 h without asking. The verified Lichess file is at <scratch>/lichess/ (sha256-check it again before use). No game reads (B-T7/B-T8 are QE's). Host paths only as placeholders.
---
# ABC-239 redo: the fit of record on a main with ABC-270 and Q1, per ADR-0067 steps 0–9
Read plans/tickets/ABC-239*.md (top blocks, A1–A6, test notes 1–8, § Dependencies steps 0–9, § What happens on a miss), ADR-0067 (all dated lines incl. arch-ABC-239-rulings: F3 linear-inequality bounds + one refit, zugzwang.001 graded as written, six player names, retired rows), the Orchestrator rulings …42c82347 (B-T4 pins vs bars), …912ba57d (B1 (e) retires whole), …d7605102 (QE-270-e), se-ABC-239's notes (…f39f6eb5 and its raw/out), grugops/ABC-239 commits 9eeb0314 and 03fcaaa0 (the tool; cherry-pick them; drop da3f8599).
- Step 0 is met: ABC-270 merged (a81a6c7d); Q1 merged (7b70e268). The quiet filter names its rules record explicitly — re-check it is still the record it names after Q1 (Q1's seePruning is opt-in; a caller-built record does not opt in).
- QE-270-e (test-only, before the relation step): in the two ABC-270 "red with its term zeroed" rows, zero the base pair and its queen-on pair together.
- Follow the steps exactly; step 6 fail-fast (all relations green, zugzwang.001 e1f1 at d9) before any re-pin, else STOP to the Architect. Re-pins only per B-T4, one table in the Result (file, row, old, new). Gates + deep lanes; B-T5, B-T4 G3/G2, B-T6 as the ADR lists.
- Hand QE a frozen candidate sha for B-T5 first, then B-T7 (100 games at 100 ms + S′ + Levels) and B-T8 (one rpair, 200+200, owner-approved ~5 h).
## Fences
src/evaluate-params.ts, tools/tune/**, tsconfig/biome entries for tools/tune, tests (re-pins/retirements only as ruled), your records. No other src edits (ask). No push, force, amend, rebase of main, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-239b, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0. Do not edit plans/board.md.
