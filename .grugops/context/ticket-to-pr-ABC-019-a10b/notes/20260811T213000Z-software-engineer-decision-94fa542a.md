---
id: 20260811T213000Z-software-engineer-decision-94fa542a
kind: decision
by: software-engineer
at: 2026-08-11T21:30:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-027
  - ADR-0010
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# `A10b` built as ONE shared membership check plus a throw — the four implementation choices the ticket left to me

> **Hand-authored, and saying so is part of the note.** `scripts/context-io.ts` — the sanctioned
> writer Workflow 16 names — does not exist in this repo or in the kit, and
> `mcp__grugops__propose_note` is not among this session's tools. The recorded precedent for the same
> gap is `.grugops/queue/done/refinement-ABC-019/claim.md` and the three previous hops' notes.
> **Nothing in this hop is a `finding`**: `05-pr-quality-gate.md`'s §14 machinery does not exist in
> this repo, so no verification stamp is issuable to this role, and none is claimed or self-attested.

## The one production change, and it stayed one

`A10` named the engine seam and nothing else, so the delivered loop played a move from the input seam
that no generator produced. The guard is now on both seams.

**The ticket explicitly left four things to the Engineer. Each was decided and each is recorded here
rather than left to be re-derived from the diff:**

1. **SHARED, not written twice.** `## Acceptance` said *"whether the comparison is shared between
   the two call sites or written twice is the Engineer's call and this ticket does not design it."*
   The six-field comparison moved out of the engine branch into a module-local `wasGenerated(history,
   move)` and both sites call it. Two copies of a six-field predicate is two things to get wrong, and
   the question genuinely is identical on both sides — what differs is only the answer to a false.
   **This is a move, not an addition: the engine site lost nine lines and gained one.**

2. **A plain `Error`, and NOT a module constant.** `A9b`'s `PARSER_EXPLODED` is a *test* constant
   whose identity the test asserts, because there the seam throws and the loop must not substitute
   its own exception. Here the loop is the thrower, so there is nothing to preserve the identity of.
   `INPUT_ENDED_NOTICE`'s precedent (exported so a caller asserts the line rather than restating it)
   was considered and NOT followed: exporting a message would add public API surface for a string no
   criterion names. The test asserts the type and a distinctive substring instead.

3. **No `takeBack` on this path, deliberately.** `A9b`'s repair exists because a throw *mid-filter*
   leaves the live object a ply ahead. Here the seam **returned normally**, so `legalMoves`'
   `makeMove`/`unmakeMove` bracket already closed and the position is intact — verified by the test,
   which asserts `toFen(position)` byte-identical to `START_FEN` after the throw. Adding a defensive
   repair would have been production scope beyond the one guard the ticket sized, for a corruption
   that cannot occur on this edge.

4. **Row 17 is NOT a `TABLE` row**, on row 14's established precedent: the loop rethrows, so there is
   no `LoopOutcome` to put in a `result` / `reason` column, and inventing those columns would be
   fields no assertion reads. Rows 15 and 16 ARE table rows and are **appended, never inserted** —
   `A12`'s enumeration guard reads `TABLE.slice(0, 5)`, so the five named automatic fixtures must
   stay at the front. Row 16 is a **second** `insufficient-material` row and takes nothing from row 3.

## The three declined options were NOT re-opened

No tenth `A14` value, `engine-failure` not reused, and `rejected` not used — a `{kind:"move"}` that
is not legal is a **parser bug, not a typo**. All three are recorded in the code comment at the guard
so the next reader inherits the reasoning and not just the branch. **`src/gameend.ts` is untouched
and `A14`'s enumeration is asserted unchanged at 10 by two tests.**

## THE SIZING TRIPWIRE WAS NOT TRIGGERED, and I checked rather than assumed

BA/PM recorded, and the Orchestrator adopted, that **a fifth hop adding production scope beyond one
guard must re-derive against `SPLIT_REQUIRED` rather than by precedent.** The delivered change is
**one membership check and one throw** — the exact cost BA/PM measured. Zero new modules, zero new
imports, zero new terminal-reason values, no signature change, **no new test FILE so `N8-LANE` does
not move**. Nothing was absorbed, so there was nothing to stop for.

## `A20` was NOT built, and that is the ticket's instruction rather than an omission

`A20` and `## Test notes` row 18 state **in their own words** that they cannot be satisfied until
`ABC-027` merges, because `ADR-0010` clause 1 puts the production change in `src/frame.ts`'s in-place
writer. **`src/frame.ts` was not opened.** Writing the assertion now would turn this branch's gate
red for a defect in another ticket's module; writing it as a **skipped** test would breach the
zero-skip gate. **Neither was done, and the deferral is written into the test file as a comment at
the point row 18 would sit**, so the next hop finds it where it will be working rather than only in a
note. **No constant-frame-width criterion or assertion was added** — the prohibition is in the ticket
and `W` is a per-frame max varying by design.
