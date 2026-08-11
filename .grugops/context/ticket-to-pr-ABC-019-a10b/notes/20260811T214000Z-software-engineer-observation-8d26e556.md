---
id: 20260811T214000Z-software-engineer-observation-8d26e556
kind: observation
by: software-engineer
at: 2026-08-11T21:40:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-021
  - ABC-027
  - ADR-0009
  - ADR-0010
  - EPIC-006
  - plans/board.md
supersedes:
---

# Criterion-by-criterion state: TWENTY-SIX of twenty-seven met, `A20` expected-red, and the board move REQUESTED not taken

> **Hand-authored** — see this hop's `decision` note. **Nothing here is a `finding`.**

## The count, stated so it can be checked rather than trusted

**26 of 27 met. One expected-red.** No criterion was renumbered, deleted or weakened, and none was
reported met that is not asserted somewhere in the lane.

| criterion | state at this hop |
|---|---|
| `A1`, `A1b`, `A2`, `A3`, `A4`, `A5`, `A7`, `A7b`, `A8`, `A9`, `A10`, `A12`, `A13`, `A14`, `A15`, `A16`, `A18`, `A19` | **met, unchanged by this hop** |
| **`A3b`** | **met, and its `+ 1` now HAS the witness it claimed** — row 16, an already-terminal start at `N = 0` |
| **`A5b`** | **MET — new.** All three item-carrying outcomes, each over a tail of at least two further frames |
| **`A6`** | **met, and now in full** — the `board` command's items are asserted to reach the message region |
| **`A8b`** | **MET — new.** All four clauses, clause (i) over two distinct `(result, reason)` pairs |
| **`A9b`** | **met, and now in full** — clause (iv)'s zero renders and zero sink writes are asserted |
| **`A10b`** | **MET — new, and the only one that changed production code** |
| **`A11`** | **met in FULL rather than in part** — the negative half now reaches a TERMINAL frame |
| **`A17`** | **met in the two places it names** — `A3b`'s spied counts green in-lane at 40/120/300. **Its out-of-tree timing half was NOT re-measured at this hop**; the Engineer's first-hop figures remain the record, and I do not restate them as mine |
| **`A20`** | **EXPECTED-RED — deferred, by the criterion's own words. NOT a build failure** |

## `A20` — expected-red, and why the gate is nonetheless green

`A20` states in its own words that it **cannot be satisfied until `ABC-027` merges**: `ADR-0010`
clause 1 puts the production change in `src/frame.ts`'s in-place writer, and this ticket does not open
that module. So the honest report is precise: **the criterion is unmet and deferred; there is no
failing test, because `## Test notes` row 18 was deliberately not written.** A skipped test would have
breached the zero-skip gate, and a live one would have turned this branch's gate red for a defect in
another ticket's module. **Both were declined, and the deferral is recorded as a comment at the exact
place in the test file where row 18 will sit**, so the rebase hop finds it in its working set.

**`A20` costs ZERO production lines here, and `src/frame.ts` was not opened.** QE is live on
`ABC-027`; nothing of its was read or written and no message passed to it.

## The prohibition held

**No constant-frame-width criterion or assertion was added, proposed or implied.** Nothing in this
hop's diff or notes asserts, measures or mentions frame width. `A5b` is a message-region **content**
clause — the region's row count is fixed and its width is neither asserted nor touched.

## Flagged, NOT taken

1. **`A17`'s out-of-tree timing half was not re-run.** No criterion required it at this hop and
   nothing I changed is on the per-ply path — the `A10b` guard runs once per human ply on a
   `legalMoves` call the input seam has already made. **But I did not measure that claim, so it is
   `UNKNOWN - verify`, and Security/NFR owns `MET`/`MISS` at the gate regardless.**
2. **The duplicate `## Test notes` bullet is still present and still not deleted** — *"Do not test the
   real engine's timing here"* appears twice, at two places in that section. Verified still present at
   this hop. Removing it needs a mandate no hop has had, and it is BA/PM's file.
3. **`EPIC-006` still inherits the `[D38]` residue** (ticket flag 12): on transitions 12/13 the last
   frame the player sees carries `status in-progress` with the thinking indicator lit, because no
   terminal `GameStatus` exists on those edges. Restated, **not re-verified here**.
4. **`ABC-021` still needs the matching half of `[D12]`.** Restated, not re-verified; that ticket was
   not opened.
5. **`ADR-0009` is still owed two narrow items by Architect/Design** (clause 9e's wording; clause 9b +
   evidence (vii)'s stale seam signature). Restated, neither re-verified here.
6. **`G-9`/`Q12` is NOT closed and is not claimed closed** — `[D45]` ruled it deliberately not bought,
   and closing it would need a variable-height stub against which the *correct* loop fails clause (d).

## Owed at the rebase, and it is one hop rather than three

`ABC-027` merges → **`A20` + row 18 written**, riding with `ADR-0009` clause 9f's real-panel re-gate,
against merged `ABC-016`/`ABC-017`. Merge order is `ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`.
Nothing else is owed on this ticket that I can see.

## Board move — REQUESTED, NOT TAKEN. `plans/board.md` was not opened for edit

**Requested: `ABC-019` `In Development` → `In Review`.**

The Software Engineer owns that transition and this is it being taken on its own terms: the one
production change is built, the six test-only closes are landed, every new assertion is proved
falsifiable by a wrong build that is red at it, and the blocking gates are green — **723/723 on 24
files, lint 0, typecheck 0, build 0, skips 0, 0 behind `main`**. `In Development` would go 2/3 → 1/3
(`ABC-016`), `In Review` 1/3 → 2/3 (`ABC-027`, `ABC-019`) on the counts recorded at this hop's start;
**the Orchestrator should re-read the row rather than take those numbers from me, since `ABC-016` and
`ABC-027` are live and I did not open them.**

**Front matter on the ticket was left at its existing value** on the same precedent the previous three
hops set: the board is the authority, and moving the ticket's own header first puts the two out of
step.
