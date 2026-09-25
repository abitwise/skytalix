---
task: wave-2026-09-25
subtask: scribe-abc109-restructure
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md (ticket build, Scribe half)
ticket: plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
ref: .grugops/context/scribe-abc109-restructure/
rescore_ref: .grugops/context/rescore-abc109/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T01:20:00Z
branch: grugops/ABC-109-agents-md-cap
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-109`, Scribe half — `A1`–`A4`, `A6`–`A8`

Owner's word, verbatim: *"ABC-109 yes"*. DoR 10/10, P0. The ticket page is the contract; its
§ "Who executes" assigns you `A1`–`A4` and `A6`–`A8`. The Engineer's `A5` (the byte-count guard in
`src/cli.test.ts`) follows on this same branch and needs **your chosen byte-budget constant** —
state it plainly in your note and the ticket's § Delivery.

Raw material the page names: the 16 `<!-- RUN … -->` comment blocks (≈ 4 657 B). Keep every owner
directive and kit-override pointer (`A2`'s enumerated list), every command runnable as written.
Re-measure the base size at pull time (`A1`'s test note). Run every command you keep or move, and
record the readings.

## Stop conditions
- Any owner directive or pointer would be lost or reworded in meaning.
- The fit needs a change outside `AGENTS.md` + the extraction target the ticket allows.

## Fences
No `src/`, `tools/`, `package.json`, `plans/board.md`, `plans/nfr-catalog.md`, ADRs. Never merge;
never push. Own `git worktree` under `.claude/worktrees/ABC-109-agents-md-cap` (symlink
`node_modules`); commit messages via a scratchpad file and `git commit -F`. An Engineer hop on
`ABC-121` runs in parallel on another branch.

## Publish
`decision` + `observation` notes under `ref:`, a trace row, a ticket § Delivery (Scribe half).
Queue pending → claimed → done per Workflow 17. Report: size before/after, headroom in bytes and
in edits, the constant for `A5`, each criterion MET or not, sha, numstat.
