---
task: wave-2026-09-25
subtask: scribe-test-line-122
role: agents-md-scribe
workflow: agent-factory/workflows/16-context-read-write.md (substrate upkeep)
ref: .grugops/context/scribe-test-line-122/
source_refs: .grugops/context/ticket-to-pr-ABC-122/  .grugops/context/secnfr-ABC-122/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T23:50:00Z
branch: grugops/scribe-test-line-122
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: `AGENTS.md` — the `Test (all)` line after `ABC-122`

`ABC-122` is Done: `npm test` = `node tools/grugops/run-bounded.js 60000 vitest run`. Update the
`Test (all)` line so it is true, and say in the fewest bytes:
- a hung lane exits 124 within 60 s (the bound); stop it with Ctrl-C/SIGTERM, not SIGKILL (owner-
  accepted R1: a SIGKILL/SIGHUP can orphan a hung `vitest`);
- the `*_DEEP` lanes run via `npx vitest run …` directly, never through `npm test` (`ENGINE_DEEP`
  ≈ 99 s exceeds the bound);
- the wrapper's own proof: `node tools/grugops/run-bounded.proof.js`.

Run `npm test` and the proof before recording; record the readings. **`AGENTS.md` is 32 062 B
against `ABC-109`'s 32 768 B cap** — stay under it; compress neighbouring comment text if needed
and report size before/after.

## Fences
Only `AGENTS.md`, a trace row, notes. No `src/`, `tools/`, `plans/board.md`, tickets, ADRs. Never
merge; never push. Own `git worktree` under `.claude/worktrees/` (symlink `node_modules`); commit
messages via a scratchpad file and `git commit -F`.

## Publish
An `observation` note under `ref:`, a trace row. Queue pending → claimed → done per Workflow 17.
Report: lines changed verbatim, readings, size before/after, sha, numstat.
