---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:30:14Z
subtask: qe-ABC-265
role: qe-e2e
ref: .grugops/context/qe-ABC-265/
branch: new grugops/qe-ABC-265 from grugops/ABC-265 (head cad6ae13; code e5694864; base 94be445f = main engine) — worktree .claude/worktrees/qe-ABC-265
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# QE: grade ABC-265 (TH-1, shared table; identity ticket, no game read)
## Read
plans/tickets/ABC-265*.md (DoR 10/10 (b)), ADR-0025 shared-table amendment (PROPOSED; T8–T10, verified-copy rule), se-ABC-265 notes (…97c4e2e8, …df9a3b3a, …e94151a6, …d74ae4b4), Orchestrator ruling …d39f74ef (no S2 read; no game read).
## Do
- Re-read every acceptance row; A3 identity out of tree vs base on your own sample (incl. doors and tick-clock rows); plant at least 3 defects of your own (incl. one the engineer did not: e.g. clear not zeroing, wrong slot index, hit on zero data word).
- Gates: G1, G5, graded G6 interleaved vs base (fallback F2 fires if below base), G7, G8, G9, G11, lint/typecheck/build, npm test ×3 (expect 2 387), skip-integrity, lane inventory. Review the profile (reported, not graded).
- Verdict: PASS / PASS_WITH_GAPS / FAIL with gap ids. Merge waits the owner's acceptance of the ADR-0025 amendment either way.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-265, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
