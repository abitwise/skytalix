---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T14:08:04Z
subtask: arch-ABC-303-load
role: architect-design
ref: .grugops/context/arch-ABC-303-load/
branch: new grugops/arch-ABC-303-load from main — worktree .claude/worktrees/arch-ABC-303-load
width: one reading of ADR-0056 D5 (CF10). No src, no test, no run.
---
# How foreign load is read during C2′ and S′
QE stopped before the first game of bundle 1: read qe-ABC-303's …b59650bc and PREREG …53858301 in .claude/worktrees/qe-ABC-303/.grugops/context/qe-ABC-303/notes/. Answer Q1 under CF10: how foreign load during a C2′ or S′ is read, on this read and any later C2′, with options (a) log and report, (b) a sealed void line, (c) an owner-held game window, or a mix.
Facts to weigh: both engines share the one core, so load falls on both, but a candidate loss on time ends the read under CF1, and an unreproducible cause under CF3 is a STOP with no new read. Today's record: five of seven graded lane reads voided by foreign load; both reads held by the owner stood first time. qe-ABC-282's A6 logged and reported. Games take about 44 minutes. A void is not a miss, and nothing may loosen a sealed rule after a result: this comes before any game.
Q2 is ruled, not yours: timing rows P6, P7, R5 run first and games after, B6 as written.
Say whether this is within ADR-0056's accepted form or moves anything the owner accepted; if it moves a bar or the fault rule itself, stop and say so. Dated insertion in ADR-0056 only.
Fences: ADRs and your records only. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
