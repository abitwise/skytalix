---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:02:06Z
subtask: secnfr-nfr008-1104
role: security-nfr
ref: .grugops/context/secnfr-nfr008-1104/
branch: new grugops/secnfr-nfr008-1104 from main — worktree .claude/worktrees/secnfr-nfr008-1104
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Timing reads ALONE with twin arms (ADR-0035 D1); record load1 and name the host gate in a PREREG first. ≤ 1 h of runs. Host paths only as placeholders.
---
# NFR-008 after ABC-271 + ABC-283: graded read, R-N8H-1 / Q-N8H-1, and a headroom recommendation
Main now carries ABC-271 and ABC-283 (merge 58e90d07). Readings so far:
- QE graded the bundle alone at 9.60 s (qe-ABC-283 …d15c2a10);
- SE read the merged tree at 9.77 s, quiet host, ungraded (se-ABC-283-merge …f7f63e1d).
Both R-N8H-1's (≥ 9.5 s → MEDIUM) and Q-N8H-1's (≥ 9.6 s) triggers fire (rulings …c7609f51 item 3, …2409cec9 item 3).
1. Seal a PREREG, then grade the default lane on main with twin arms. Report the median against 10 s, 9.5 s and 9.6 s.
2. Rule R-N8H-1's level and Q-N8H-1's action. Recommend the headroom work in ABC-281's form (named rows to existing deep lanes; ADR-0046 § Dated 2026-11-04, form S): which rows, about how many seconds, and what must stay in the default lane. W1 (ABC-282) and the second pull will add rows next, so size the target for that too.
3. Update plans/nfr-catalog.md's NFR-008 latest verdict line and the risk register entries.
Fences: plans/nfr-catalog.md, the risk lines, your records. No src, test, ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task secnfr-nfr008-1104, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
