---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-134
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-134-frame-path-probe-prose-claims-more-reach-than-it-has.md
ref: .grugops/context/ticket-to-pr-ABC-134/
source_refs: .grugops/context/bapm-owed-batch-2026-10-10/notes/ (…26ea8322), .grugops/context/qe-ABC-053/notes/ (…a4b293d2), .grugops/context/qe-ABC-057/notes/ (…a331f012)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T15:05:47Z
branch: grugops/ABC-134-frame-probe-prose
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-134` — the frame-path probe's prose claims more reach than the probe has

DoR 10/10, XS, P3. The ticket page is the contract: four wording sites in `src/history-pane.nfr.test.ts`,
comments only. `ABC-136` just merged into the same file (`f87f0b6f`: two framed `toContain` pins and a
rewritten tripwire comment) — re-verify every site's anchor and wording at the current tip first; if the
premise is stale, STOP and report. ADR-0029's 2026-10-10 pointer lists the same spellings: the docblock
count must agree with it.

## Stop conditions
- Any non-comment line, or any other file under `src/` — STOP.
- ABC-136's pinned literals and ABC-057's seven spans must stay byte-identical (`spansqe.py` from
  `.grugops/context/qe-ABC-057/probe/`); a comment inside a pinned frame would break a pin — check.
- An Architect hop (`design-F-072-1`) is ruling QE-136-a/b on this file in parallel — docs only, no `src/`.

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `AGENTS.md`. Own worktree; link `node_modules` into
YOUR worktree only. Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done (by hand, main checkout, uncommitted). Report: gates, per-criterion evidence,
comment-only proof, `src/` numstat, branch + sha.
