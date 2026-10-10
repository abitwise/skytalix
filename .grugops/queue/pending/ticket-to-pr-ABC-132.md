---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-132
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-132-three-production-docblocks-cite-the-deleted-frame-producers-list.md
ref: .grugops/context/ticket-to-pr-ABC-132/
source_refs: .grugops/context/wave-2026-09-25/notes/20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17.md, .grugops/context/qe-ABC-129/ (probe/exit-probe.mjs, controls.mjs — the waiver measures)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:30:14Z
branch: grugops/ABC-132-stale-docblocks
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-132` — three stale production docblocks

The ticket page is the contract. Its pair `ABC-129` just merged (`3730f28e`) and edited comments in some of
the same files — re-verify every site's anchor and wording at the current tip first; if stale, STOP and
report.

## Exit (owner ruling 2026-10-10)
Comment-only production diffs count as zero production lines when BOTH hold (QE-129-b: each alone has a
blind spot): every changed `src/` line is a comment line (use QE-129's parser-based check), AND each changed
production file's `transpileModule` (`removeComments: true`) output is byte-identical at base and tip.
Report both per production file plus a negative control. If either fails, the owner's word is owed.

## Stop conditions
- Any non-comment change to a production file — STOP.
- Test-only bars that read production comments (e.g. `cli.ts` bar 1 in `src/cli.test.ts`) must stay green.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence,
the two exit measurements per production file, `src/` numstat, branch + sha.
