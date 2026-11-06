---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T13:48:53Z
subtask: qe-ABC-303
role: qe-e2e
ref: .grugops/context/qe-ABC-303/
branch: new grugops/qe-ABC-303 from grugops/ABC-303 at 63667fc8 — worktree .claude/worktrees/qe-ABC-303
width: QE's rows on ABC-303's page: ADR-0056 tables 1 to 3, the one sealed C2′, S′, the Levels deep lane, and the verdict. Reads only: no src or test change lands.
---
# Verify bundle 1
Read ABC-303's page, ADR-0056 (bundle read, D5's CF1 to CF10), ADR-0072, ADR-0073, the Orchestrator's notes …f86e0257 and later on this ticket, and se-ABC-303-main2's Result. R1, R2 and A0 stand by its unchanged-source proof; L4 was last read on …bd60978c.
1. Seal a PREREG before any run. It fixes: every row of tables 1 to 3 and its read; one C2′, 100 games at 100 ms, all on against the merge-base, GAIN ≥ 50.0 of 100, 100 of 100 complete; S′ at E 1 810; the Levels deep lane; L4 d8 ≤ 0.89×, reach ≥ door + 0.10, 3 072 bytes; G6 "≥ base"; NFR-008; CF1 to CF10 as written; the stale rule. It sorts every row into game or count reads, and graded timing reads.
2. Read the page's estimate first (C2′ about 0.4 h, S′ and Levels about 10 min each). Your whole lock time must stay under 1 h per stage; if your plan exceeds that, stop and say so before running.
3. Count rows and game reads run now, under the lock, foreign load recorded per the page's method. State in the PREREG, before any game, how foreign load during C2′ is read, from the page and CF rules; if the page leaves that open, stop and ask rather than choosing.
4. Graded timing rows do NOT run in this stage. A timing read needs the owner's word that the whole host is quiet (…43e6d8fd 4). Seal their method, then STOP and report what window you need. The verdict follows that read in a later hop. If a row in step 3 reds or misses, go by § What happens on a miss and stop.
5. L4 or G6 red on an exact build is a STOP. A miss is never re-played; a void is not a miss. Report; do not tune.
Check every output file is non-empty before reading it. Record foreign load; never touch it. Every test, build or engine run goes under the host lock named in your dispatch prompt, one game at a time on one core. Leave nothing running; check with ps, not pgrep -f.
Fences: your records only. No src, test, ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (task qe-ABC-303, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
