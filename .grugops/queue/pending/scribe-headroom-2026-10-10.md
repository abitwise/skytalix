---
task: wave-2026-09-25
subtask: scribe-headroom-2026-10-10
role: agents-md-scribe
workflow: agent-factory/roles/agents-md-scribe.md (maintenance)
ref: .grugops/context/scribe-headroom-2026-10-10/
source_refs:
  - .grugops/context/scribe-command-log-2026-10-10/notes/ (…a023cfcd: ranked headroom proposal)
  - .grugops/context/qe-ABC-131/notes/ (QE-131-c, on branch grugops/ABC-131-drop-edge-puzzles — NOT merged)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:28:13Z
branch: grugops/scribe-headroom-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: Scribe — AGENTS.md headroom (ranks 1–2 only) and stale receipts, after ABC-087 merged

`ABC-087` is merged (AGENTS.md 24,162 B; ABC-109 cap 24,576 B). Apply your own proposal's **ranks 1 and 2
only** (provenance paragraph; duplicated Kit-vs-state blockquote). **Rank 3 is held**: it rewrites the
owner's 2026-08-15 wording and the owner has not answered. Ranks 4–5 stay in reserve.

Also fix stale receipts, re-measured at the current wave tip yourself: "Test (all)" (expect 52 files /
1608), `ENGINE_DEEP` engine lane (expect 46), ABC-087's "Levels deep lane" line (add its log entry).
Do NOT apply ABC-131's figures (`PUZZLE_DEEP` 54/58, 18 passed; levels 242 moves / 35 vs 54 of 58): ABC-131
is awaiting the owner's UAT word and is not merged — note them as owed in your decision note.

Log every change in `memory-bank/90-agents-md-command-log.md`. `src/cli.test.ts` (ABC-109 byte cap,
ABC-059 runnability guard, ABC-065/069 slot rules) must stay green.

## Fences
`AGENTS.md`, `memory-bank/90-agents-md-command-log.md`, your notes, one trace row. No `src/`, `plans/board.md`,
ADRs. Never merge; never push. Own worktree. Commit-message file in a PRIVATE scratchpad subdirectory. Real
UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by
hand, main checkout, uncommitted). Report: bytes before → after, each change, receipts re-measured, gates
(lint + test), branch + sha + numstat.
