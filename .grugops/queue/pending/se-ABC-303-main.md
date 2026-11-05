---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T11:49:20Z
subtask: se-ABC-303-main
role: software-engineer
ref: .grugops/context/se-ABC-303-main/
branch: existing grugops/ABC-303 — worktree .claude/worktrees/se-ABC-303
width: code and tests on ABC-303's branch; no game, no C2′, no graded timing.
---
# Bring bundle 1 onto main with W1 in
Read ABC-303's page, ADR-0056's bundle tables, ADR-0072, ADR-0073, and the Orchestrator's latest decision note.
1. Merge main into grugops/ABC-303 with `git merge`. No rewrite of any kind.
2. Re-read on the moved base: R1 and R2 with P3, P4 and b = 2.3, and A0's counts. Report each beside the old figures: R1 93.58 %, 80 cp / 94.12 %, 79 cp; R2 288/1 886 = 15.27 %, 29/9/0 errors. Do not judge "materially worse"; report the numbers.
3. QE-304-a's line: A4 (b)'s head side to `chooseMoveWithoutBundle`.
4. The countermove term in NFR-009's sum.
5. The A3 (a) comment correction.
6. Gates: typecheck, lint, npm test, and the deep lane of every test file arriving from main (engine, uci-session, evaluate.passer, see, transposition both flags, per AGENTS.md).
STOP and report, with nothing tuned: any bar in ADR-0056's tables 1–3 red, L4 or G6 red, or a conflict you would have to settle by moving a value or a pin. Move no expectation not named here. Check every output file is non-empty before reading it.
Every test, build or engine run goes under the host lock named in your dispatch prompt, one at a time.
Fences: ABC-303's code and tests, your records. No ticket, ADR, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-303-main, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
