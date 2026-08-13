---
id: 20260813T230500Z-qe-e2e-artifact-ref-the-regate-branch-and-the-out-of-tree-mutation-method-2d1f5db3
kind: artifact-ref
by: qe-e2e
at: 2026-08-13T23:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - plans/traceability.md
supersedes: 
---

# The branch, exactly what is on it, and why `src/render-seam.ts` was never opened for writing.

Branch `grugops/quality-gate-ABC-041-regate`, worktree `../cli-chess-qe041b`, cut from the Engineer's
tip `78a3db8`. **Nothing was committed on `main`, on the ticket branch or on any other agent's branch.
Not merged, not deployed. The ticket page was not opened.**

```
git diff --numstat 78a3db8
 10   19   src/render-seam.test.ts     <- the standalone `A4 (width)` row deleted, its disposal
                                          recorded in the block comment above the surviving rows
 2    1    plans/traceability.md       <- one header line, one cell appended in place
```

Plus five notes under `.grugops/context/quality-gate-ABC-041-regate/notes/`. **Zero production lines
in any file.** `src/render-seam.ts` is absent from the diff, md5 `bc18d0830b84adaff123affce66561c5`,
git blob `51e50a381a5faccc01e11c5ab30727ed4c30e62a` — the same blob as at `ac17fe2`, `8dbe2b4` and
`78a3db8`.

## The mutation method, because it is the reason the hard limit could be honoured literally

The subtask forbids touching `src/render-seam.ts`, and mutation testing is the only way to answer the
questions it asks. Both were satisfied by copying the worktree out of tree
(`tar --exclude=node_modules --exclude=.git`), symlinking `node_modules`, and mutating **only the
copy**. The copy was proved faithful before the first edit — `src/render-seam.ts`
`bc18d083…` and `src/render-seam.test.ts` `f47e6df7…`, the Engineer's own pinned md5s — and it ran
**12 passed** at rest.

Every mutant was applied by an anchored substitution that **refuses to write unless its anchor matches
exactly once**, run, then reverted, with the md5 re-verified before the next one. The final artifact
(11 rows, after the disposal) was copied back into the sandbox and re-armed against `X2`, `X2b`, `X1`
and `X3b` — so the suite that was measured is the suite that is being shipped, not the one it was
derived from.

## The mutants used on this hop

| id | what it does | where it dies on the shipped artifact |
|---|---|---|
| `X2` | the seam pads every board row (nine blanks, digit-free) | `A4` at `:241` |
| `X2b` | the same padding, `black-bottom` only | `A4` at `:241` — and the deleted row was GREEN on it |
| `X1` | the bound orientation ignored, hardcoded `"white-bottom"` | `A4` at `:241` |
| `X3b` | a genuine second board implementation in `src/board-two.ts`, `tsc` 0 | **`A11` only** |
| `X8` | `process.env` read through `globalThis["process"]`, `tsc` 0, lint 0 | **nowhere — 827/827 green** |

`X8` is the one that survives, and it is the whole of the maintained block. Its exact text is in the
`observation` note so the fix hop can rebuild it and watch its own fix go red.

## Queue and hand-off

The claim was taken by hand in the MAIN repo (`mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` of `.grugops/queue/claimed/quality-gate-ABC-041-regate/`) per `AGENTS.md`'s substrate note.
`claim.md` and `done.md` are written into the MAIN repo's working tree and left **untracked**: the
pending subtask file is committed on `main`, which is ahead of this branch's base, and this hop
commits only on its own branch. **The `pending -> done` queue move is owed to the Orchestrator**, as
it was for the two hops before this one.

`plans/board.md` was not opened and `ABC-041` was not moved — it stays `In Review`, which is where a
maintained block leaves it.
