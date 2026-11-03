---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T20:07:55Z
subtask: arch-ABC-270
role: architect-design
ref: .grugops/context/arch-ABC-270/
branch: new grugops/arch-ABC-270 from main — worktree .claude/worktrees/arch-ABC-270
width: wrap EVERY test/build/engine run (every vitest too) in `flock <scratch>/host-test.lock <cmd>`. One core; the lock is shared. Probes small: each run ≤ 30 min, hop total ≤ 2 h; larger → stop and return the question. Host paths only as placeholders in anything committed.
---
# Design ABC-270 (E3a king safety by phase) — owner 2026-11-03 item 8: start now, ahead of ABC-239's build
Read plans/tickets/ABC-270*.md, ADR-0064 (E1 in force; mg/eg pairs), ADR-0067 (ACCEPTED by owner today; the tuner will refit tables — king tables came out ~3× under-weighted in every fit, arch-ABC-239 …48ae6a93), ADR-0031 + addendum (queen scale / shelter gate), ADR-0056 Phase 4 (Q-3K-4 (b): judged on play), the ABC-274 packed blend now on main (src/evaluate.ts).
Decide and write an ADR PROPOSED (next free id after ADR-0067): which king-exposure / shelter / attack terms, their mg/eg halves, the enemy-queen scale, the off-door pair, and — essential — **how E3a and the tuner interact**: does ABC-270 add terms with hand values that ABC-239 then refits (order: 270 build → 239 fit includes them), or does 270 only add the term structure with tuner-owned values? Say which order wins more for less host time, and whether ABC-270's 100-game read happens before or after the tuner.
Pre-register bars and falsifiers (node identity where value-identical, G2, G6, NFR-005 depth floor, per-change 100 games at 100 ms GAIN 50.0). A sealed PREREG before any measured probe.
Fences: memory-bank/50-decisions + your records + scratch (no committed src/tools). Don't edit ADR-0056, ADR-0067, EPIC-011 or ticket pages — list owed lines in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-270, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
