---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:13:01Z
subtask: bapm-ABC-301-cut
role: ba-pm
ref: .grugops/context/bapm-ABC-301-cut/
branch: new grugops/bapm-ABC-301-cut from main — worktree .claude/worktrees/bapm-ABC-301-cut
width: records only; nothing run.
---
# Cut ABC-301: the second tuning pull
Write the page from the Architect's note arch-second-pull-1104 …4917f0f7 § 5 exactly:
- L, P2, intent GAIN; adr ADR-0067 (d6 amendment adopted) and ADR-0070 d7; DoR row 10 met.
- Scope 0: the four preconditions (QE-271-h hot-path row, QE-271-g guard row, QE-271-i emitter 13 → 17 exports plus the tracer, QE-271-f endgame G2 row in the PREREG).
- Scopes 1–5.
- Bars B-T0–B-T8 carried, with F3's new form, the endgame G2 row and B-T8 re-confirmed (~5 h, owner …dda43b71); ADR-0070 F4/F5.
- Out of scope.
- Dependencies (ABC-271, ABC-280 and ABC-283 merged).
- The NFR-008 flag: point at secnfr-nfr008-1104, in flight.
Also in EPIC-011, from …4917f0f7 and …a5d74f70:
- the E2 row;
- § Owner questions: d6 and B-T8 answered; add Q-3K-11, the bundle-read rule;
- § Tickets row for ABC-301;
- § Dependencies;
- one per-change-rule pointer to ADR-0056's PROPOSED "bundle read" section.
Fences: plans/tickets, plans/epics/EPIC-011, your records. No board, ADR or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-ABC-301-cut, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
