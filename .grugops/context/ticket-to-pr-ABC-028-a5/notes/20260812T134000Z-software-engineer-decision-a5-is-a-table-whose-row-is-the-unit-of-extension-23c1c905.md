---
id: 20260812T134000Z-software-engineer-decision-a5-is-a-table-whose-row-is-the-unit-of-extension-23c1c905
kind: decision
by: software-engineer
at: 2026-08-12T13:40:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - RISK-ABC028-03
  - src/history-pane.test.ts
supersedes:
---

# How `A5` was built: `preservedTail` is the axis coordinate, so a future member is a row of DATA

> Hand-authored `decision`, deliberately **not** a `finding` — see the sibling `observation` for why
> nothing on this hop can carry a stamp.

## The shape

`A5` is one `it.each` table in `src/history-pane.test.ts`. A row is:

```ts
interface EditShape {
  readonly preservedTail: number;                       // the axis coordinate
  readonly replacement: readonly (readonly [from, to])[];
  readonly changes: readonly (readonly [index, before, after])[];   // MEASURED
}
```

and the body is generic over rows:

```
kept = moves.slice(-preservedTail)      // saved BEFORE the edit
takeBack(preservedTail + replacement.length)
play each replacement ply
playMove each kept object, VERBATIM
```

**Length preservation and tail-identity preservation are structural, not asserted into existence:**
`k + n` plies come off, `n` go on, then the same `k` objects go back. That is why the row can be pure
data — the harness cannot build a row that is accidentally not a member of the class.

## Why `preservedTail` and not a fixture per witness

The ticket's own framing is that the class is *any cache keyed on a proper subset of the move list*,
and that the members differ only in **how much of the tail** the key watches. That is a **number**.
A number is a column, not a criterion. `## Test notes` 1 records that `A9` was repaired once per node
of its object graph and that the per-node repair is what guaranteed the next one; a per-witness cache
criterion would do the same thing here — `A5`, then `A6`, then `A7`, one per depth.

**Closing the next member is now a row of data.** I did not merely claim that — see the sibling note
on `WCACHE-LAST2`, where it was exercised.

## The one design decision the measurement forced, and it would not have been obvious from the text

`A1`'s discriminator is its **last row** (`37. Nb1 Nc6` → `37. Nb1 Nf6`), and `A5`'s row 1 has the
same property (`→ 37. Ne4 Nc6`). **Row 2's does not.** Measured: with the last TWO moves preserved,
both renders end `37. Nb1 Nc6` — **byte-identical last rows** — and the change appears at rows 35 and
36, higher up the pane.

**That is a general property of the axis, not a quirk of one fixture: the deeper the preserved tail,
the further UP the pane the discriminator moves,** because the preserved tail *is* the bottom of the
pane. So the criterion asserts `expect(second).not.toEqual(first)` over the **whole pane**, and each
row carries its own measured `changes`. **An `A5` written against `A1`'s last-row clause would have
been structurally incapable of catching `WCACHE-LAST2`** — it would have been a criterion that cannot
fail on a build in its own class, which is the `D22` defect this ticket's parent paid for twice.

## What is context and what reports, stated so a later reader cannot mistake one for the other

**Reports:** `expect(second).not.toEqual(first)`, and the per-row measured `changes`.
**Context only:** the length clause and the tail-identity clauses. Both read **identically** on the
delivered pane and on all three mutants — verified, not assumed — so neither can mask the
discriminator. They are there to state that the edit really was length-preserving and really did put
the tail back by identity; without them a row would silently degenerate into `A1`.

## What I considered and did not do

- **Fold `A5` into `A1`.** Refused: the ticket forbids it and the reason is sound — `A1` pins the
  point where the last move's identity CHANGES and `A5` where it is PRESERVED. Two diagnoses; one
  `it` must not report one verdict for two (`## Test notes` 2). `A1` is untouched and was re-run.
- **Land a mutant in-tree** so the kill is asserted directly. Refused at `A2` as a mutation-testing
  harness this project has never adopted, with unpriced lane cost; nothing changed to reopen it.
  Every mutant here was built and run **out of tree**.
- **Config (b)** — the nfr fixtures rebuilt per test. **Not run, deliberately.** Config (a) is
  strictly stronger for this question: it does not load `src/history-pane.nfr.test.ts` **at all**,
  so the accidental guard is not merely disabled but absent. Running (b) would also have meant
  opening the file this hop is fenced out of, for a weaker result.
