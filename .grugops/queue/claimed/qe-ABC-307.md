---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T14:13:18Z
subtask: qe-ABC-307
role: qe-e2e
ref: .grugops/context/qe-ABC-307/
branch: new grugops/qe-ABC-307 from grugops/ABC-307 at 797bb1a5 — worktree .claude/worktrees/qe-ABC-307
width: QE's rows on ABC-307's page, A7 to A9. Reads only: no src or test change lands.
---
# Verify ABC-307
Read ABC-307's page, se-ABC-307's notes …49e3755f, …dba5335f, …045800a8, Architect decision …727e0d0c, and the Orchestrator's decisions …db111535 and …ad217a34.
1. Seal a PREREG before any run. It fixes A7's list, the order-independent MC1 read at base and tip with its form, F3's three random-half plants, and A9's method. Its void rule: rounds flagged for foreign load void the read; one re-read is allowed on a void, in a new output directory; a second void stops the hop. A void is not a miss.
2. A7 and the rest first, then A9 graded last, ALONE in one lock hold. A5's sentinel repeated. A miss on MC1's new read is a STOP.
3. Report H − B and the lane figure, against the −0.215 s target and 9.6 s. Do not judge past the page's rule.
4. Verdict. UAT is waived or signed as the page says.
Check every output file is non-empty before reading it. Record foreign load; never touch it. A grade script's MET line on flagged rounds is void.
Every test, build or engine run goes under the host lock named in your dispatch prompt.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-307, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
