---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T13:27:26Z
subtask: se-ABC-303-main2
role: software-engineer
ref: .grugops/context/se-ABC-303-main2/
branch: continue grugops/ABC-303 at 80bc0711 — worktree .claude/worktrees/se-ABC-303 (its last agent reported; it is yours)
width: main into ABC-303 and its gates. No game, no C2′, no graded timing.
---
# Bring bundle 1 onto main with ABC-307 and ABC-305 in
ABC-307 merged at bce24018, ABC-305 at d00164ce: test rows and tools only, no production line. Read se-ABC-303-main's Result, se-ABC-303-rows' Result, and ABC-303's page.
1. Merge main into grugops/ABC-303 with `git merge`. No rewrite of any kind. Expected conflict: plans/traceability.md only (rows kept). Anything else, read it fresh.
2. Show that non-test src and data on main are unchanged since your last merge base, so R1, R2 and A0's counts need no re-read. If they differ, re-read and report them as se-ABC-303-main did.
3. Gates at the merged tip: typecheck, lint, build, npm test, skip capture. Deep lanes, read by count, "no tests" a failure: every lane of a file arriving from main (src/uci-session.test.ts, src/book.test.ts, tools/grugops/qe-hop-integrity.test.ts, src/evaluate.passer.test.ts, TUNE_DEEP tools/tune), plus the page's Levels lane. src/cli.test.ts has no deep lane. tools/tune's bounds now meet bundle 1's parameters for the first time: read those rows, not only the count.
4. Report the expected test count against main's 2 710 plus the bundle's rows.
STOP and report, with nothing tuned: any bar in ADR-0056's tables 1 to 3 red, L4 or G6 red, or a conflict you would have to settle by moving a value or a pin. Move no expectation not named here. If tools/tune needs a change for the bundle's parameters, STOP and name it: the page does not cover it. Check every output file is non-empty before reading it.
Every test, build or engine run goes under the host lock named in your dispatch prompt, one at a time. Leave nothing running; check with ps, not pgrep -f.
Fences: ABC-303's code and tests, your records. No ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (task se-ABC-303-main2, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
