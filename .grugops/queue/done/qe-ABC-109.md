---
task: wave-2026-09-25
subtask: qe-ABC-109
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
ref: .grugops/context/qe-ABC-109/
build_refs: .grugops/context/scribe-abc109-restructure/  .grugops/context/ticket-to-pr-ABC-109-a5/
enqueued_by: orchestrator
enqueued_at: 2026-09-26T04:20:00Z
branch: grugops/qe-ABC-109
base: grugops/ABC-109-agents-md-cap (tip after this enqueue)
diff_under_review: 0bf562f...HEAD
---

# Subtask: QE gate for `ABC-109` (`AGENTS.md` restructure + byte guard)

Reproduce `A1`–`A8` independently. Focus:
1. **Meaning preserved (the main risk).** The Scribe condensed six directive sections in place
   (Process rules, Branching model, Test and UAT authority, QE validation authority, Deployment
   posture, …) to pointers at `memory-bank/60-progress.md` / `ADR-0007`. For every owner directive
   and every rule a role acts on, diff old vs new `AGENTS.md` and confirm the rule is either still
   in `AGENTS.md` or verbatim-equivalent at the pointer target — list any that lost a condition,
   an exception, a number or a named owner. Include the standing owner instructions recorded this
   wave (e.g. never merge/push; humans hold merge; SIGTERM not SIGKILL for `npm test`).
2. **Every command still runnable** as written in the new `AGENTS.md` — run each default-lane one;
   spot-check two deep lanes.
3. **`A5` deviation — rule it.** The ticket asks the failing path be shown on an in-memory number
   without writing the real file; the Orchestrator's queue task limited the Engineer to one
   assertion, so the red was watched by padding the real file (sha256 restored). Is `A5` MET as
   worded? If not, name the one extra row that closes it.
4. The byte guard: confirm it counts bytes, not characters (a multi-byte character case).

## Fences
Zero lines under `src/`, `AGENTS.md`, `memory-bank/`. No `plans/board.md`, `plans/nfr-catalog.md`,
ADRs. Never merge; never push. Own `git worktree` under `.claude/worktrees/qe-ABC-109` (symlink
`node_modules`); commit messages via a task-unique scratchpad file and `git commit -F`.

## Publish
`decision` (PASS / PASS WITH FINDINGS / FAIL) + `observation` notes under `ref:`, a trace row, a
ticket § QE section. Queue pending → claimed → done per Workflow 17. Report: verdict, each
criterion, every directive whose meaning changed (or none), the `A5` ruling, gaps, sha, numstat.
