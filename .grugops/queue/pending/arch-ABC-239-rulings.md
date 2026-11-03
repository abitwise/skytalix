---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:16:07Z
subtask: arch-ABC-239-rulings
role: architect-design
ref: .grugops/context/arch-ABC-239-rulings/
branch: new grugops/arch-ABC-239-rulings from main — worktree .claude/worktrees/arch-ABC-239-rulings
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Small reads only (each ≤ 30 min, hop ≤ 1 h); no games. Host paths only as placeholders.
---
# Rulings that unblock ABC-239 (se-ABC-239 failed-attempt …f39f6eb5)
Read se-ABC-239's notes (.grugops/context/se-ABC-239/notes/, raw/out/candidate-npm-test-failures.txt) on branch grugops/ABC-239 (candidate da3f8599, tool tip 03fcaaa0) — read via `git show`/`git worktree`, don't edit that branch. Read the Orchestrator's B-T4 ruling …42c82347 (pins re-pinned old → new; relations/zugzwang/mate floor/G1/identity never re-pinned) and ADR-0067 as merged (B-T4 re-pin rule, B-T5, F3, F4).
Rule, as dated lines in ADR-0067 (no bar moves; if one must, say so as an owner question):
- (b) F3: the king-mobility A2 relation ("g6 instead of g2 scores lower at equal material", tuned +8). Which parameters it crosses, and the bound form the one allowed refit uses (the tool has per-parameter ≥ 0 bounds only — specify a linear-inequality or tie form the SE can implement, or a parameter freeze).
- (c) F4: zugzwang.001 plays e1e5 instead of e1f1 at d9 on the candidate. Decide by evidence (a small read is allowed: e.g. both moves' outcomes by deeper search / tablebase-style reasoning / the row's own source) whether e1e5 is a safety failure or a second sound move; if sound, say how the row is amended without weakening it (accept-set), as an Architect ruling, not a re-pin.
- (d) own-games player set: whether the 58 `sky-a` / `skytalix-a` probe games enter; rule it.
- Retire-or-keep: name the obsolete E1 structural row(s) (ABC-274 made "only the king's square and the passers differ" obsolete) to retire.
- Also: ADR-0064 d10 and the ADR-0031 addendum "ADR-0068 (PROPOSED)" → ACCEPTED 2026-11-03.
- State the next SE hop's exact steps: rebase onto main with ABC-270 merged (ADR-0068; the fit must include the queen-on pairs), refit once, re-pin per B-T4, deep lanes, then QE.
## Fences
memory-bank/50-decisions, your records, scratch (no committed src/tools). Don't edit ticket pages/EPIC-011 — list owed lines. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task arch-ABC-239-rulings, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
