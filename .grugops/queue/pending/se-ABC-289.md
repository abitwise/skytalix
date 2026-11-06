---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T18:28:05Z
subtask: se-ABC-289
role: software-engineer
ref: .grugops/context/se-ABC-289/
branch: new grugops/ABC-289 from main — worktree .claude/worktrees/se-ABC-289
width: ABC-289's scope, to Result. No game, no C2′, no graded timing, no landing.
---
# Build ABC-289
Read ABC-289's page, ADR-0074, ADR-0024 d4, and the Orchestrator's latest decision notes. Bundle 1 is merged (434fa171): your base has P4 and the countermove in.
Do the page's scope. Run gates and the page's deep lanes, each read by count: "no tests" is a failure. Report every door, count and pin the page names, and what the build costs the default lane in rows, against NFR-008's budget on the page. Graded timing needs an owner-held host: say what it will need, do not run it.
Old-table values are pins, re-pinned old to new and listed; zugzwang, mate floor, G1, identity and relation rows are never re-pinned. STOP and report anything the page does not cover, any bar red, or a conflict you would settle by moving a value or a pin. Check every output file is non-empty before reading it. /tmp has a 12.36 GB user quota.
Every test, build or engine run goes under the host lock named in your dispatch prompt, one at a time. Leave nothing running; check with ps, not pgrep -f.
Fences: ABC-289's code and tests, your records. No ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (task se-ABC-289, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
