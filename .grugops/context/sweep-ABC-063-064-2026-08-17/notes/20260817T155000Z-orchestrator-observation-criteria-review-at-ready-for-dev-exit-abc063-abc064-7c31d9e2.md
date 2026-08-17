---
id: 20260817T155000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-abc063-abc064-7c31d9e2
kind: observation
by: orchestrator
at: 2026-08-17T15:50:00Z
verified_by:
confidence: high
refs:
  - ABC-063
  - ABC-064
  - ABC-042
  - ABC-061
  - ABC-062
  - ABC-066
  - src/cli.test.ts
  - plans/board.md
supersedes:
---

# `Ready for Dev` exit criteria review — `ABC-063` and `ABC-064`, cut 2026-08-15, measured against `main` @ `39d3c5b`

Project process rule 1 (`AGENTS.md` § "Process rules"). Both pages were cut **2026-08-15**. Since
then `ABC-061`, `ABC-066`, `ABC-068` and `ABC-062` all landed **in the same file both tickets
target** (`src/cli.test.ts`, now 1211 lines). That is exactly the condition that made `ABC-062` lose
three of six criteria at this same exit. So the review was run against the tree, not against the
pages.

## Result: NO criterion of either ticket is already satisfied. Both are real work.

This is the check rule 1 has twice failed to make (`ABC-061`'s `A4`, `ABC-062`'s `A3`), so it was
made first and explicitly, by measurement:

- **`ABC-063`** — `grep -rn` across `src/` for the six UAT-16 verbs (`--move`, a bare `e4`, `--new`,
  `--undo`, `--resign`, `--quit`) finds **no occurrence of any of them as an argv literal in
  `src/cli.test.ts`**. The `e4` hits are chess-move strings in `moves.test.ts`, `san*.test.ts`,
  `legal.test.ts`, `apply.test.ts`, `history-pane.test.ts`, `zobrist.test.ts` — a different noun.
  **`0 of 6` stands as the page states it.**
- **`ABC-064`** — read first-hand:
  - the byte-exact frame tail and the eight named ranks run on `CHILDREN.npmRun` alone;
  - the append-strategy block (`no ESC [`, exactly one trailing newline) runs on
    `CHILDREN.npmRun.stdout` alone;
  - the per-colour block compares **`boardRegionOf(...)`-length prefixes only** for `white`, `black`
    and `random`.
  **No non-default child has its row count, trailing newline, cursor-control absence or status rows
  asserted anywhere.** `0 of 3` and `0 of 2` stand as the page states them.

## What IS stale on both pages: the line references (`G-5` class, same defect `ABC-062` carried)

Neither page's *substance* drifted; every `:NNN` anchor in both did. Measured against `39d3c5b` by
reading the `it(...)`/`describe(...)` titles at each line:

| page | cites | what it means | anchor today |
| --- | --- | --- | --- |
| `ABC-063` | `:353` | `ACCEPTED_ARGUMENTS` equals the scope table element-for-element, both ways | **`:435`** |
| `ABC-063` | `:372` | the enumeration is the ONLY argv literal in the delivered resolver | **`:525`** |
| `ABC-063` | `:477` | 1000 generated tokens, 250 per shape, every one rejected and named | **`:630`** |
| `ABC-063` | `:780` | the `spawned` budget pin (`toBe(10)`) | **`:933`** |
| `ABC-063` | `:401` | (out-of-scope list; the referent is not unambiguous from the page) | **UNRESOLVED — do not cite it until you have read it** |
| `ABC-064` | `:162` | the byte-exact frame tail + the eight ranks, on `npmRun` | **`:244`** |
| `ABC-064` | `:226` | the append strategy — zero `ESC [`, exactly one trailing newline | **`:308`** |
| `ABC-064` | `:274` | the per-colour board-region comparison for the three children | **`:356`** |
| `ABC-064` | `:186` | (test note 4's "names the child in the assertion message") | the rank loop now at **`:266`–`:270`** |

`:401` is recorded as unresolved rather than guessed. The `ABC-062` hop produced a *wrong* mapping of
a near-miss anchor (`:410` asserted where `:554` was meant) precisely by filling a gap like this one
from memory; that error is on this project's record and is not repeated here.

## The `A5`/`A4` one-path criterion vs. fixing those anchors — the trap, and the ruling

`ABC-063` `A4` and `ABC-064` `A5` each require `git diff --name-only <delivered>~1 <delivered>` to
show **exactly** `src/cli.test.ts`. Editing the ticket page in the same commit BREAKS that criterion.
Both criteria are worded **per delivered commit**, not per branch. So: the anchor corrections go in a
**separate commit** on the same branch, and the delivery commit stays one path. That is a
sequencing constraint on the engineer, not a licence to leave the page stale.

## Neither ticket is re-cut, and why that differs from `ABC-062`

`ABC-062` was re-cut because three of six criteria were **vacuous** — work a merged ticket had
already done. Nothing here is vacuous; only pointers drifted. A BA/PM hop per ticket to renumber
line references would cost more than it returns, so the measured anchors above are handed to the
engineer directly and the page correction rides along as a second commit.

## Scheduling constraint recorded here because it is a measurement, not a preference

**Both tickets write the same file**, and `ABC-064` reads module-scope helpers (`frameOf`,
`boardRegionOf`, `CHILDREN`) that `ABC-063` does not touch but sits beside. They are queued
**sequentially, `ABC-063` then `ABC-064`**, each branching off the `main` that includes its
predecessor. This is a file-collision avoidance, NOT a dependency: both pages state, correctly, that
either order works and neither blocks the other.

## Rule-1 control input (this hop's contribution to the measurement `AGENTS.md` asks for)

Gaps recorded at the `Ready for Dev` exit, this hop: **9 stale line anchors + 1 unresolvable
anchor**, across two tickets. Vacuous criteria found: **0**. Criteria struck: **0**. The rule's
control asks that exit-gaps RISE while QE-gaps fall; this hop contributes to the rising side without
a single backward move.
