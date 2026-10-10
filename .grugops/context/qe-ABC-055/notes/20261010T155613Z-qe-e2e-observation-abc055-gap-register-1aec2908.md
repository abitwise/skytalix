---
id: 20261010T155613Z-qe-e2e-observation-abc055-gap-register-1aec2908
kind: observation
by: qe-e2e
at: 2026-10-10T15:56:13Z
verified_by:
confidence: high
refs:
  - ABC-055
  - ABC-010
  - ABC-137
  - ABC-138
  - plans/board.md
  - AGENTS.md
  - 20261010T155613Z-qe-e2e-observation-abc055-post-merge-invariants-594edd4b
supersedes:
---

# QE `ABC-055`: gap register

This note is hand-authored and unsealed. No gap fails an `A` criterion. The fence allows docs fixes
only when a criterion fails, so QE fixed nothing on the branch.

## `QE-055-a`: HIGH, at merge time (not a defect in the branch)

**The merge has two board conflicts, not one. One resolution silently drops a ticket and passes
`A1`–`A3`.**

Why the second conflict exists:
- `ABC-055` § Dependencies (ii) says "merge before the next board move", and states that "only the
  prepend can conflict".
- The wave wrote the board before this merged. At `2946e22a`, `ABC-010` went to
  `## Ready for Dev (WIP 1/6)`, which sits next to the inserted headings.

`git merge-tree --write-tree 2946e22a grugops/ABC-055-board-headings` exits 1 with these conflicts:
- `plans/board.md`, hunk 1: the prepended `_Updated:` lines.
- `plans/board.md`, hunk 2: the wave's `## Ready for Dev (WIP 1/6)` plus the `ABC-010` row, against
  the branch's two headings plus `## Ready for Dev (WIP 0/6)`.
- `plans/traceability.md`: appended rows on both sides.

The three resolutions, simulated and run through the probe with `<ref-rev>` = `2946e22a`:

| resolution | `A1` | `A2`/`A3` | REF rows | REF `_Updated:` | exit |
|---|---|---|---|---|---|
| branch side ("theirs") | PASS | PASS (`Ready for Dev` 0/6, 0 rows) | **1 missing (`ABC-010`)** | **2 missing** | 1 |
| wave side ("ours") | FAIL (11 ≠ 13) | PASS | 0 | 0 | 1 |
| union | PASS | PASS (`Ready for Dev` 1/6) | 0 | 0 | 0 |

**The branch-side resolution is self-consistent, and `A1`–`A3` cannot see that it lost a ticket.**
Only the REF check catches it. The binding checks are in `…594edd4b`.

## `QE-055-b`: MEDIUM. The skip list omits `In UAT`, and "stated here, and only here" is not true

The new FORMAT text says four columns may be skipped and that this is stated "here, and only here".
AGENTS.md § Test and UAT authority carries a standing rule that skips a fifth:
- The zero-production-lines waiver (kit override 3) moves a ticket `Ready for UAT` → `Done`, with
  no UAT run.
- That skips `In UAT` (and `Ready to Release`, which is listed).
- `ABC-132` took that path today, and `ABC-055` will take it too.

A reader of the board alone would conclude that `In UAT` may not be skipped. That is the mistake
this ticket was cut to stop: an absent statement read as a statement.

Suggested fix: the Orchestrator's, in its own file. Either one clause in the merge resolution or a
follow-up cut. For example: "`In UAT` is skipped by a ticket under AGENTS.md's zero-production-lines
UAT waiver (`Ready for UAT` → `Done`)". Also drop "and only here", or point it at AGENTS.md.

## `QE-055-c`: MEDIUM. `Ready for Dev` is correctly left off, but the wave's practice already contradicts that

By the kit, `Ready for Dev` is not skippable:
- Workflow 04's path starts there.
- The Orchestrator owns its exit.
- AGENTS.md rule 1 puts the criteria review there.

On the wave, it is already skipped:
- At `2946e22a`, `ABC-137` and `ABC-138` went `Ready` → pulled → `In Development` in one hop. The
  board's own `_Updated:` line says so.
- At `764454b5`, `ABC-055` itself was pulled straight to `In Development`.

There are two readings, and QE picks neither; this is the Orchestrator's or owner's call:
- **R1:** a ticket must sit in `Ready for Dev`, so the practice deviates.
- **R2:** a ticket may pass through it in one hop when the Orchestrator does the rule-1 re-read at
  the pull. `ABC-055`'s own Problem section calls that "honest under rule 1". If R2 is chosen, the
  board should say so next to the skip list.

## `QE-055-d`: LOW. `A1`'s literal wording counts 15 headings

Test note 1's `grep '^## '` returns 15, including `## Columns (spec §6.1)` and `## Conventions`.
- `A1` means column headings. The new INVARIANT line says "column H2 headings", which settles the
  meaning.
- The probe excludes the two by name. A third non-column H2 added later would be read as a column,
  and the probe would report an `A1` FAIL. That fails safe.

## `QE-055-e`: LOW. `ABC-055`'s own board row is stale

The row still reads "renders 10", "S, P2", "three WIP limits — 2, 2, 6". `A4` rightly forbade
editing it. Updating it is the Orchestrator's, at close-out.

## `QE-055-f`: INFO. The invariant is held by hand

No board validator exists, by design (test note 2). The invariant line promises none. The
pre-existing line "The validator can check the two for drift" (BOARD ↔ TICKET CONTRACT) still names
a tool that does not exist. It was not in this diff, and it is recorded, not acted on.

## Closed at QE

- The SE's clause (b) `UNKNOWN - verify` is closed: the probe reads 0/0/0 (`…7e5f486a`).

## Counts for AGENTS.md rule 1's control

- Gaps at QE: **5 actionable** (`a`–`e`) plus 1 INFO. Only `a` binds the merge.
- Backward moves caused: **0**.
