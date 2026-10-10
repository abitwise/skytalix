---
task: wave-2026-09-25
subtask: qe-ABC-134
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-134-frame-path-probe-prose-claims-more-reach-than-it-has.md
ref: .grugops/context/qe-ABC-134/
source_refs: .grugops/context/ticket-to-pr-ABC-134/notes/ (…1f2b70bf, …d5b9d74c) — on the ticket branch; .grugops/context/qe-ABC-053/, .grugops/context/qe-ABC-057/ (your gap registers the ticket was cut from)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:11:21Z
branch: grugops/ABC-134-frame-probe-prose (tip 4d6b019a)
---

# Subtask: QE `ABC-134` — the frame-path probe's four prose sites now claim only the reach it has

Verify A1–A5 independently, and judge each new sentence against the code it describes (re-measure: the
per-frame draws, the settle depth `turn < 3`, the uncounted import spellings vs ADR-0029's pointer — is
"AT LEAST four" accurate and does anything still over-claim?). Confirm comment-only (code-only hash) and
that ABC-136's pinned literals and ABC-057's spans are unaffected. Note: the `probe-it` span's raw hash
moves because A3's site is inside it — the Orchestrator accepted that; confirm its code-only hash is equal.

## Fences
No `src/` edits unless a sentence is wrong and the fix is comment-only inside the page's four sites (then
say so); no production `src/`. Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own
worktree; link `node_modules` into YOUR worktree only. Commit-message file in a PRIVATE scratchpad
subdirectory. Real UTC stamps. Trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § QE. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: verdict, per-criterion evidence,
gaps with severity, gates, branch + sha.
