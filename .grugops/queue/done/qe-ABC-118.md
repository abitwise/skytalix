---
task: wave-2026-09-24
subtask: qe-ABC-118
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md
ref: .grugops/context/qe-ABC-118/
build_ref: .grugops/context/ticket-to-pr-ABC-118/
enqueued_by: orchestrator
enqueued_at: 2026-09-24T09:00:00Z
branch: grugops/qe-ABC-118
base: grugops/wave-2026-09-24 (build 1d0ce2a / 75e7357 merged at d36e8d6)
---

# Subtask: QE `ABC-118` — break the lane-inventory instrument

The build is on the base: `tools/grugops/lane-inventory.js`, which lives outside the lane and
compares the collected set with the git-tracked set. Read the Engineer's five notes in
`build_ref:` (the `decision` first, then the probe `observation`), then the ticket's criteria and
§ Delivery, then the code.

## Rule
- Is every acceptance criterion met as written? Name each one: MET, MET-AS-READ, or FAILED.
- The Engineer's claim that the guard is "unreachable" from the lane: is that a property the
  ticket wanted, or a gap? Who runs this instrument, and when? If nothing runs it, say so.

## Then break it
- Re-run the four gates and the instrument at the base tip; record counts.
- Reproduce the Engineer's five rounds in a copy outside the repository, then add your own:
  an `exclude` glob that removes exactly one file; a glob that ADDS a file outside `src/`; a
  renamed test file; an untracked test file; a `.skip`-only file. Each: RED or NONE, with the
  raw output. Revert and confirm the tree is clean.
- Check for false sentences in the instrument's header and in the ticket's § Delivery
  (`ABC-114` standard).

## Do not
- Do not fix the build. Do not touch `src/search.*`, `src/quiescence.*`, `src/engine.*`
  (`ABC-079` is live on its own branch). Do not open `plans/board.md`, `AGENTS.md`, or
  `plans/nfr-catalog.md`. Do not rule NFR-008.
- Do not merge or deploy. Work in your own `git worktree`. Write commit messages to a
  uniquely named scratchpad file and use `git commit -F`.

## Publish
PASS or FAIL as a `decision` note, probes as `observation` notes with raw output, a trace row, and
a ticket § QE section. Claim by hand per Workflow 17: `mkdir .grugops/queue/claimed/qe-ABC-118`,
move this file in, then out to `done/`. Report: the verdict, the criteria table, the probe table,
the gate numbers, the sha and the numstat.
