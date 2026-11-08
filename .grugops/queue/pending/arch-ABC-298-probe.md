---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T20:12:34Z
subtask: arch-ABC-298-probe
role: architect-design
ref: .grugops/context/arch-ABC-298-probe/
branch: new grugops/arch-ABC-298-probe from main (after bapm-ABC-298-accept merges) — worktree .claude/worktrees/arch-ABC-298-probe
width: ADR-0077 d9 step 3, the count probe. Untimed. Scratch instrument only; no src/ commit, no build, no timing, no games.
---
# ABC-298: the count probe
ADR-0077 is ACCEPTED (…44810861, arch-ABC-298-accept …e16aec37); step 2's records are merged. Run d9 step 3 exactly as ADR-0077 writes it: G (full-width nodes that reach legalMoves) and C (gated depth-1–2 nodes where the hash move cuts off), s = C ÷ G per board; STOP if s < 0.048 on at least two of the three boards, else GO.
1. Seal the plan as a decision note, committed before any measured run: main's tip and src/ tree, the instrument's sha256s, the boards and depths/budgets as ADR-0077 names them, the rule word for word.
2. Instrument: a scratch `git archive` copy of src/ outside the repository, counters only, value-identical (node counts equal to main's on every board, checked and reported). No timing figure is taken or reported.
3. One results note: G, C, s per board, GO or STOP by the sealed rule. No re-run after a reading; an instrument defect gets one fix under a sealed addendum.
Lock: every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. No held host is needed or to be taken. Fences: your task records, scratch, and one dated line in ADR-0077 d9 with the outcome. No src/, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
