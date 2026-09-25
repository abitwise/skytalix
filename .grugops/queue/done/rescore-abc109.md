---
task: wave-2026-09-25
subtask: rescore-abc109
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (re-score against today's facts)
ticket: plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
ref: .grugops/context/rescore-abc109/
source_refs: .grugops/context/scribe-test-line-122/  .grugops/context/scribe-deep-lanes-081/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T00:40:00Z
branch: grugops/rescore-abc109
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-score `ABC-109` — `AGENTS.md` is 203 B from its cap

Owner's word, verbatim: *"1. yes"* (to building `ABC-121` with `ABC-109` re-scored in parallel).

Fact today: `AGENTS.md` is 32 565 B against the 32 768 B cap that truncates silently (203 B
headroom). `ABC-121` will owe the Scribe a deep-lane line that will not fit. Re-read the ticket
against that fact: is its problem, scope and acceptance still right? The Orchestrator's
recommended direction to weigh (not to impose): move the long per-command `<!-- RUN … -->`
provenance comments out of `AGENTS.md` into a linked file, keep each command line one line, and a
guard that reds when `AGENTS.md` crosses a set margin under the cap. Say who executes (Scribe vs
Engineer for any guard test) and whether it is one ticket or two.

Score DoR out of 10 with every ⚠️ named.

## Fences
No `src/`, `AGENTS.md`, `plans/board.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never push.
Own `git worktree` under `.claude/worktrees/`; commit messages via a scratchpad file and
`git commit -F`. An Engineer hop on `ABC-121` runs in parallel on another branch.

## Publish
Ticket edits, a trace row, a `decision` note (DoR) under `ref:`. Queue pending → claimed → done per
Workflow 17. Report: DoR with each ⚠️, criteria one line each, executor(s), size, sha, numstat.
