---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T22:19:56Z
subtask: se-ABC-303
role: software-engineer
ref: .grugops/context/se-ABC-303/
branch: new grugops/ABC-303 from main — worktree .claude/worktrees/se-ABC-303
width: src/ and rows named by the ticket, your records.
---
# Build bundle 1 (ABC-303): code only, no game
Read ABC-303 whole, then ADR-0072, ADR-0073, ADR-0056 D5's dated block and tables 1–3, Architect decisions …88ca95bd and …d776c0f0. ABC-286 and ABC-288 are the design pages.
1. Build Scope 1–5 exactly as the ADRs state: forms M3 and C1, nothing tuned. All-off door node-identical to the merge-base, older doors turning both parts off.
2. Run the ticket's R1 and R2 on the build, and the rows the block gives the engineer. A wrong all-off count is a wiring defect: fix the wiring, never the count. A pin moves old → new only under ruling …42c82347, listed in the Result. Zugzwang, mate floor, G1, identity and relation rows are never re-pinned.
3. Rows go in src/search.bundle.test.ts; none in src/cli.test.ts, no new default-lane file; a row ≥ 50 ms goes deep. Lane budget for the whole bundle: ≤ +0.10 s head-minus-base median wall, aim ≤ 90 ms in-thread. Report it ungraded.
4. STOP before any game, S′ or Levels read. Those are QE's, after ABC-282 and ABC-301 settle and main is merged in. Do not take main in beyond your branch point unless told.
5. A red on a safety row or on L4, or a part that cannot be built as written: stop and report it. No tuning, no form change.
Every test, build or engine run goes under the host lock named in your dispatch prompt, one core; other agents share it, so hold it no longer than each run needs, and never touch a process that is not yours.
Fences: no ADR, ticket, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-303, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
