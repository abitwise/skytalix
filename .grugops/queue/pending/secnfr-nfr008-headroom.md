---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:44:26Z
subtask: secnfr-nfr008-headroom
role: security-nfr
ref: .grugops/context/secnfr-nfr008-headroom/
branch: new grugops/secnfr-nfr008-headroom from main — worktree .claude/worktrees/secnfr-nfr008-headroom
width: wrap EVERY run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Timing reads ALONE (each session in one flock), ≤ 30 min total. No games. Host paths only as placeholders.
---
# NFR-008 (default npm test ≤ 10 s) has ~0 headroom — review and recommend
Facts: QE-279-e (head median 9.42 s), QE-280-b (main median 9.73 s, tip 9.82 s; two tip reads 10.04 / 10.05 s over 8 interleaved rounds). Read plans/nfr-catalog.md (NFR-008, NFR-010), ADR-0008 + addendum (executor caps), AGENTS.md lanes.
Measure main's default lane ALONE (≥ 8 runs), find the slowest files/rows, and recommend one of: move named slow rows to an existing deep lane (which rows, which lane, what coverage moves), a test-only speed fix, or an NFR-008 re-statement (that last is the owner's — frame it as a question with a recommendation). Record risk ids. Do not change tests or config yourself.
## Fences
Your records only. No src/tests/config edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task secnfr-nfr008-headroom, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
