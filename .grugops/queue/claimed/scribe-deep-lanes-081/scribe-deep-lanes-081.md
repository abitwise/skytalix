---
task: wave-2026-09-25
subtask: scribe-deep-lanes-081
role: agents-md-scribe
workflow: agent-factory/workflows/16-context-read-write.md (substrate upkeep)
ref: .grugops/context/scribe-deep-lanes-081/
enqueued_by: orchestrator
enqueued_at: 2026-09-25T19:40:00Z
branch: grugops/scribe-deep-lanes-081
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: `AGENTS.md` — the owed deep-lane lines

Owed from the last wave (board, `ABC-081` / `ABC-079` / `ABC-075` rows):
1. The `transposition.test.ts` deep lane (`ABC-081`; see `.grugops/context/ticket-to-pr-ABC-081/`).
2. `ZOBRIST_DEEP` (`ABC-075`; `src/zobrist.test.ts`).
3. The quiescence deep lane and its `A5` pins (`ABC-079`; `src/quiescence.test.ts`).

Each in the existing shape (`PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP` lines). Verify every command
by running it; record the reading. Read the env-var names from the test files — do not guess.

**Do NOT change the `Test (all)` line** — `ABC-122` (in flight) changes `npm test`; that line is a
later Scribe pass. **Mind `ABC-109`** (`AGENTS.md` near a cap that truncates silently): report the
file size before and after, and compress if needed rather than overflow.

## Fences
No `src/`, `plans/board.md`, `plans/nfr-catalog.md`, ADRs, tickets. Never merge; never push. Own
`git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`.

## Publish
An `observation` note under `ref:` (commands run, readings), a trace row. Queue pending → claimed
→ done per Workflow 17. Report: lines added, size before/after, sha, numstat.
