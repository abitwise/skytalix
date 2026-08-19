---
kind: observation
role: orchestrator
task: cut-nfr008-wall-2026-08-20
at: 2026-08-20T17:30:00Z
id: d4e5f6a7
---

# Wave swept: both claims drained, and the two things I am NOT doing

## Sweep

Both subtasks are `done/`. The `claimed/nfr008-wall-cut/` directory was empty — BA/PM had drained it
and left the registry release for me because the file move showed up in another agent's working tree.
I removed the directory. `claimed/` is now empty. No claim went stale; nothing was reclaimed by TTL.

**The QE agent did NOT sweep BA/PM's uncommitted queue move into its own commits** — I checked before
touching anything. `729e1d2` and `17880ce` are clean.

## I am committing the queue sweep on QE's branch, and that is a consequence of my error, not a design

The two `pending/` files are tracked only on `grugops/abc110-a1a4-measure`, because that is where my
enqueue commit landed when I failed to run the branch guard (recorded at `c3d4e5f6`). Putting their
`done/` move anywhere else would create a branch where a subtask is `done` having never been
`pending`. **So the queue history stays coherent by staying on the branch my mistake put it on.**
Named as containment of an error, so nobody reads it later as a convention.

## I am NOT moving `ABC-110`'s board column, and I am NOT merging

Two branches are unmerged and **both write `plans/board.md`** — BA/PM's adds `ABC-111`'s Backlog row,
and my column move would touch the same file. Making that move now on a third branch manufactures a
three-way conflict in the single source of WIP truth to save nobody anything. **`ABC-110` stays in
`Backlog` and the board still does not show that `A1`–`A4` ran.** That is a real gap in the board's
accuracy and I am recording it rather than papering it with a move that conflicts.

**Merge is the owner's.** `ABC-110` `A5` is a fence on his decision and the measurement exists to let
him take it; merging the measurement branch myself would not advance that by one step.

## What the next hop must carry, and must not

- **`ABC-110`'s `A3` arithmetic is WRONG on the page** and QE proved it: *"the entire 30% is smaller
  than twice the deficit"* is false (2.960 s vs a measured 4.552 s in-worker sum). The rejection
  stands on stronger measured ground. **That sentence must not be carried into `A6`–`A9`.**
- **`A7`'s hash `63f66795…ca31` has no defined byte range** and QE could not reproduce it, so it
  verified the stronger whole-file property instead. `A7` is not verifiable as written.
- **`ABC-006` has no criterion ids at all**; QE's `AC1`–`AC5` are its own invention and are labelled
  as such. `A4`'s "by id, never by adjective" cannot be met for that file until someone cuts them.

Three defects in the inputs, found by doing the work. None is smoothed and none is fixed here.
