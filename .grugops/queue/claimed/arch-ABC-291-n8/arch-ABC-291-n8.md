---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T22:30:13Z
subtask: arch-ABC-291-n8
role: architect-design
ref: .grugops/context/arch-ABC-291-n8/
branch: new grugops/arch-ABC-291-n8 from main — worktree .claude/worktrees/arch-ABC-291-n8
width: the route for NFR-008 UNRESOLVED on ABC-291. No src, no test, no run: QE's raw files are enough.
---
# NFR-008 on ABC-291: H − B +0.155 s against ≤ +0.10 s
Read qe-ABC-291's …024bbd63, …5826dcf6, raw/out/read-a1/n8 (worktree .claude/worktrees/qe-ABC-291, read only), …b9038a14, …f30bd604, …f40ce634, ABC-307's rows and records. Not a void, not a miss, so no re-read of this lane as it stands. K4 is spent, met by 0.0033. Production files do not move.
My route, unless you find it wrong: a row move first, the standing rule's first step, then a new graded read under a new note. No bar moves, and I am not waiving a sealed rule on a close figure (…f40ce634 1).
1. Where the wall goes: the added rows cost 34 ms, shared rows about +100 ms in-thread, uci-session +83 ms, CPU +0.76 s. Is it the term's tree (more nodes), the build, or noise? Say what the evidence supports and what stays `UNKNOWN - verify`.
2. Row supply: name candidate rows that can leave the default lane, with their remnants and mutant reads, as in ABC-307, and how much they buy. Aim: H − B at most +0.10 s with margin, not at the edge. If the supply cannot buy that, say so plainly: that goes to the owner, as a named moved bar, with the cost to later terms (ABC-290, ABC-292, ABC-293) stated.
3. Does this row move ride on ABC-291's branch, or is it its own ticket as ABC-307 was?
4. What carries to the new read: may K4, K5 and K0–K3, K7 carry by production-file identity, as …9e2facfa carried P6 and P7? Row-move test changes only.
5. n8-grade.py prints "NFR-008 MET, graded" from three legs while its budget line prints OVER. Name the correction for the new read's PREREG.
If an item would move a bar, stop and say so. Fences: ADRs and your records. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
