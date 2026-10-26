---
subtask: arch-records-arch-snapshot
role: architect-design
ref: .grugops/context/arch-records-arch-snapshot/
branch: new grugops/arch-records-arch-snapshot from main, worktree ../wt-arch-records-arch-snapshot
width: 1 of 3 (records only — no npm, vitest or timing; no src/)
---

# memory-bank/30-architecture.md: snapshot header + the 3 known stale lines (last hop of this kind)

## Do
- Per Orchestrator `orch-2026-10-26l`:
  1. Add one dated header line under the title: the page body is the 2026-08-12 as-built snapshot plus dated corrections, and the current truth for any module, command or count is the code on `main` plus `AGENTS.md`. A full as-built re-pass is planned for EPIC-008 close.
  2. Add dated corrections for the 3 lines your `arch-records-arch-page/…5302a6ba` lists: line 24 "no `main`, `exports` or `bin`"; "Two epics are built and merged"; "Seventeen production modules". Check each against `main` first, by reading files only.
- No other line moves, and there will be no further line-by-line hops.

## Fences
- Only that page, your worktree and `<scratchpad>/arch-snap/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-arch-snapshot). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
