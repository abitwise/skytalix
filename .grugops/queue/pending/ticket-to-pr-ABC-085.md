---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-085
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-085-self-play-ladder.md
ref: .grugops/context/ticket-to-pr-ABC-085/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-085-self-play-ladder
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-085`, the self-play ladder harness. Build only, no verdict run.

M, P1, DoR 10/10. The ticket page is the contract, with `ADR-0038` folded in. Re-verify its premises at the current tip first.

## Stop conditions
- **Build the harness; do NOT run the verdict (A1/A2 at step 4).** The verdict waits for `ABC-083`'s merge, which is `Blocked`, and the
  page's staleness rule applies. Running it now would grade the wrong engine.
- The `LADDER_DEEP` lane adds 0 games and +1 file to the default lane, pinned by count (item 6). If the default lane gains a game, STOP.
- **Short-mode smoke runs (step 120) are allowed** for behaviour: a game completes, claims are recorded, the seed reproduces. **Do not report any
  timing as a grade.** Three other agents run in parallel, and `ABC-144` (lane CPU) is being designed now, so report lane cost as
  "loaded machine, not graded".
- Production lines: if the harness stays in `*.test.ts` and tools, the waiver is measured at exit. Any `src/` production line must be
  named in your report.

## Fences
Never merge or push. Do not touch `plans/board.md`, ADRs or `AGENTS.md`, and do not touch `vitest.config.ts` or `package.json` unless the page's criteria
require it (name it if so). Work in your own worktree, with `node_modules` linked into it only. Use real UTC stamps and quoted heredocs only.
End each commit with a `Co-Authored-By:` trailer naming the model you actually are. In this shell `diff` is a git wrapper; use `/usr/bin/diff`.

## Publish
Publish notes per Workflow 16, a trace row at the END of `plans/traceability.md`, and the ticket's § Delivery. Move the queue file pending → claimed → done by hand,
in the main checkout, uncommitted. Report: gates, per-criterion evidence (and which criteria wait for the verdict), diff names, branch and sha.
