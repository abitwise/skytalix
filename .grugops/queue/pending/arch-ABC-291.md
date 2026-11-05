---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T10:21:59Z
subtask: arch-ABC-291
role: architect-design
ref: .grugops/context/arch-ABC-291/
branch: new grugops/arch-ABC-291 from main — worktree .claude/worktrees/arch-ABC-291
width: records only; nothing run. A timing read holds the host: no test, build or engine, no probe.
---
# ADR-0075 for E4b, PROPOSED
Read ABC-291's page, the Orchestrator's latest decision note, ADR-0056 (D2, D6 and their dated lines), ADR-0067's dated blocks, ADR-0070, ADR-0026 d10.
1. Write ADR-0075, form (b), on main's tapered evaluation: the definitions of connected, phalanx and backward; the stated rule and the hand values it gives, fixed before any row or game is read; whether the terms sit in the pawn memo and at what size; the G2 ratio; intent GAIN.
2. Write the premise probe as a specification: what it reads, its bar, its sealed form. Do not run it. It runs on the host after A4. Say what it can change in the ADR and what it cannot.
3. Settle the four carried items, or name who settles each: TUNE_DEEP against a hand-valued term; how ABC-306 reaches a fit; E5 without per-piece mobility at the third-pull door; "no second set of values after a miss".
4. Say which bars this term reads under, with the fault rule's table phrases where a single-part read needs them. Say plainly that a pass means "not seen worse", not "proven better".
5. Reason from code and records only. Mark anything that needs a reading as `UNKNOWN - verify`. Give the owner's question for acceptance in plain words, with your recommendation.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board, src or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-291, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
