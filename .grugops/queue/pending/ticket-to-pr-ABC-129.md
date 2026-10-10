---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-129
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-129-cite-turn-loop-by-symbol-not-by-line.md
ref: .grugops/context/ticket-to-pr-ABC-129/
source_refs: .grugops/context/bapm-owed-batch-2026-10-10/notes/ (…26ea8322 item 2 re-score), .grugops/context/wave-2026-09-25/notes/20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17.md
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:03:50Z
branch: grugops/ABC-129-turn-loop-cites-by-symbol
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-129` — cite `turn-loop.ts` by symbol, not by line

DoR 10/10, XS, P3. The ticket page is the contract. Several files changed since the re-score (ABC-133 on
`src/cli.test.ts`, ABC-087/126/131 elsewhere) — re-verify every cite's anchor and the A3 "seven tokens"
comment at the current tip first; if the premise is stale, STOP and report.

## Exit (owner ruling 2026-10-10, note above)
Comment-only production diffs count as zero production lines when BOTH hold: every changed `src/` line is a
comment line, AND each changed production file's comment-stripped compile output (`transpileModule`,
`removeComments: true`) is byte-identical at base and tip. Report both measurements per production file.
If either fails, say so — the owner's word is then owed.

## Stop conditions
- Any non-comment change to a production file — STOP.
- `ABC-132` follows on overlapping files — don't touch its scope.
- Test-page note 4: `cli.ts` bar 1 reads comments — a cite word like "evaluated" would red it; run it.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence,
the two exit measurements per production file, `src/` numstat, branch + sha.
