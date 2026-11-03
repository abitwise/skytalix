---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T12:40:00Z
subtask: scribe-taper-lane
role: agents-md-scribe
ref: .grugops/context/scribe-taper-lane/
branch: grugops/scribe-taper-lane — worktree .claude/worktrees/scribe-taper-lane (from main)
width: wrap any test run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>` (single vitest file needs NODE_OPTIONS=--max-old-space-size=400).
---
# AGENTS.md: the E1 taper deep lane
ABC-269 merged (54dee3f2). Owed lane line (se-ABC-269): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts` (B0 + B2 + phase oracle deep rows; the cut build reports 146 rows in that lane — verify the count).
AGENTS.md has only ~3 B headroom under the byte cap (ABC-109 A5 row): make a value-neutral trim elsewhere so the addition fits; the byte-cap row and cli tests must stay green (run the AGENTS.md/cli test file under the lock).
Fences: AGENTS.md + your records. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task scribe-taper-lane, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.
