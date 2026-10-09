---
task: wave-2026-09-25
subtask: fold-abc086-adr0027
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md (fold an accepted ruling + DoR re-score)
ticket: plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
also: plans/tickets/ABC-087-*.md  plans/tickets/ABC-085-*.md
ref: .grugops/context/fold-abc086-adr0027/
ruling_ref: .grugops/context/ruling-abc086-seed/   (fold list …f3caccd1)
adr_refs: memory-bank/50-decisions/ADR-0027-deterministic-mode-is-the-shipped-engine-on-a-virtual-clock-and-the-seed-does-not-reach-move-selection.md (ACCEPTED 2026-10-09)
enqueued_by: orchestrator
enqueued_at: 2026-10-09T19:16:48Z
branch: grugops/fold-abc086-adr0027
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold `ADR-0027` (accepted) into `ABC-086`, `ABC-087`, `ABC-085`, and re-score `ABC-086`

The owner accepted `ADR-0027` 2026-10-09 (note `…5d2a9c74`). Apply Architect/Design's fold list
`…f3caccd1` exactly: Q1 (b) — the seed leaves `ABC-086` for `ABC-087`; Q2 — deterministic mode is
`createEngine({ budgetMs, now: <virtual clock> })` with the clock in its own production module.
`ABC-086` drops to XS; the title is yours. `ABC-087` gains the seed, `A3`, the seed half of `A6`,
the generator constraints and the open PVS-bound problem for its blunder draw; re-estimate its size.
`ABC-085` `A5` now consumes `ABC-086`'s virtual clock and `ABC-087`'s seed.

Re-score `ABC-086` out of 10 with every ⚠️ named; set `Ready` only if it is. Do not re-score
`ABC-087`/`ABC-085` beyond noting what changed (say if their DoR moved).

## Fences
No `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, ADRs. Never merge; never
push. Own `git worktree` under `.claude/worktrees/`. Commit messages via a scratchpad file and
`git commit -F`. Real UTC stamps (`date -u`).

## Publish
Ticket page edits, one trace row, a `decision` note (DoR) under `ref:`. Queue pending → claimed →
done per Workflow 17. Report: `ABC-086` DoR with each ⚠️, criteria one line each, size/title,
what moved to `ABC-087`/`ABC-085`, branch + sha, numstat.
