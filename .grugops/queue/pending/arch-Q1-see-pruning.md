---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T20:07:55Z
subtask: arch-Q1-see-pruning
role: architect-design
ref: .grugops/context/arch-Q1-see-pruning/
branch: new grugops/arch-Q1-see-pruning from main — worktree .claude/worktrees/arch-Q1-see-pruning
width: wrap EVERY test/build/engine run (every vitest too) in `flock <scratch>/host-test.lock <cmd>`. One core; the lock is shared. Probes small: each run ≤ 30 min, hop total ≤ 2 h; larger → stop and return the question. Host paths only as placeholders in anything committed.
---
# Design Q1 (SEE pruning of losing captures, quiescence and main search) — owner Q-3K-9 YES 2026-11-03 opens ADR-0024 d4 for design
Read ADR-0056 row Q1 (+20–50 forecast; arch-ABC-234 diagnostic +0.88 ply reach, d8 0.22–0.68×, not pre-registered), ADR-0065 (SEE ordering, premise not met — decision 2 'carrying see'), ADR-0024 (quiescence; d4 now open for design by owner word), the current search on main (E1 + ABC-274 packed eval merged).
Decide and write an ADR PROPOSED (next free id; coordinate: arch-ABC-270 is also writing one — take the id after it if both are free, and say so in your note): SEE implementation (cost, where computed), pruning rule in quiescence and in main search (threshold, depth limits, check / promotion exemptions), interaction with existing ordering and TT. Pre-register premise (node / reach) and bars: correctness rows (tactics/mate floors, G1), G2, G6, NFR-005 depth floor, then per-change 100 games at 100 ms GAIN 50.0. Seal a PREREG before any measured probe; a miss is never re-played. If the premise fails, say premise-not-met as ADR-0065/0066 did.
Recommend the slot vs ABC-239 / ABC-270 (Orchestrator's standing slot: before ABC-239's merge-read; the tuner is evaluation-side, Q1 search-side).
Fences: memory-bank/50-decisions + your records + scratch (no committed src/tools). Don't edit ADR-0056, ADR-0024, EPIC-011 or ticket pages — list owed lines (and a BA/PM ticket cut) in a note. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-Q1-see-pruning, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
