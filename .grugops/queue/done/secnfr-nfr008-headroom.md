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

## Result
by: security-nfr (claude-opus-5-5), 2026-11-04T02:57:07Z. **PASS_WITH_RISKS.** main (`08843504`) default lane read ALONE under the host lock: session A median **9.77 s** wall (n 8, 9.63–9.94), session P base median **9.90 s** (n 7); 0 of 15 over 10 s; CPU median 32.4 s. Not a graded verdict (no twin). Slowest: `src/cli.test.ts` 4.2–4.4 s slot (3.4 s collect: ~28 sync children + 0.6 s settle sleep), `src/uci-session.test.ts` 1.8 s, `src/search.null-move.test.ts` 1.1 s, `src/engine.test.ts` 0.8 s, `src/levels.test.ts` 0.6 s, `tools/grugops/qe-hop-integrity.test.ts` 0.4 s. **Recommendation (option 1):** move three rows to their own files' existing deep lanes — QE-208-a position-6 sweep (365 ms, SEARCH_DEEP), ABC-230 A4 (236 ms, ENGINE_DEEP), levels A9 (135 ms, ENGINE_DEEP); scratch probe −0.38 s paired median wall (7/7), −1.09 s CPU. Risks R-N8H-1 (MEDIUM, Orchestrator / Architect), R-N8H-2 (LOW, Architect), R-N8H-3 (INFO, BA/PM). Owner question Q-N8H-1 (re-state NFR-008?) framed, recommendation keep 10 s; held, not escalated. Notes `…f925027f` (readings), `…69126dca` (probe), `…8a4fb936` (decision); raw in `.grugops/context/secnfr-nfr008-headroom/raw/`. No test, src or config edited.
