---
id: 20260809T232400Z-security-nfr-observation-ade98f88
kind: observation
by: security-nfr
at: 2026-08-09T23:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - NFR-002
  - NFR-003
  - NFR-005
  - src/zobrist.ts
  - src/legal.ts
  - src/history.ts
  - plans/nfr-catalog.md
supersedes: 
---

# `NFR-005`'s exclusion verified TWO ways rather than accepted — and the other five NFR rows checked instead of assumed

The ticket says to state `NFR-005` structurally and **not** to re-run the key benchmark to "confirm"
a structural zero. That instruction was followed: **no `NFR-005` figure is reported here, because
none was measured.** But "structural" is a premise, and the premise was verified.

## 1. By bytes

```
src/zobrist.ts        md5 630fceddcd6af786e73ebdf1f65afa58 on the tip
src/zobrist.ts        md5 630fceddcd6af786e73ebdf1f65afa58 on main          IDENTICAL
git diff --stat main -- src/zobrist.ts src/zobrist.test.ts src/zobrist.nfr.test.ts   EMPTY

comment- and blank-stripped, cmp against main:
  src/legal.ts         49 code lines   IDENTICAL
  src/legal.test.ts   236 code lines   IDENTICAL
```

No executable line entered either file. This reproduces the Orchestrator's and QE's `A9` result on a
third instrument, and it is the premise `NFR-005`'s exclusion rests on.

## 2. By the call graph — the stronger of the two, and it is new here

A byte comparison shows the Zobrist code did not change. It does **not**, on its own, show that the
Zobrist path is unaffected by a change **elsewhere** — that requires knowing whether the path reaches
`generateMoves`. Checked at the source:

**`hasLegalEnPassant` — the one thing `src/zobrist.ts` imports from `src/legal.ts` — calls only
`isBlack`, `isOnBoard`, `isSquareAttackedBy`, `kingSquareOf`, `makeMove` and `unmakeMove`. It never
calls `generateMoves` or `legalMoves` at all.** It synthesises its own probe move, which is exactly
what `ADR-0005` and this ticket's `## THE CORRECTION THIS TICKET CARRIES` say of it.

So the per-node key cost is untouched **on two independent grounds**: the code did not change, and
the code does not reach the code that did. The exclusion does not rest on the byte comparison alone.

## The other five rows, checked rather than assumed

The ticket's trigger block names `NFR-001` and excludes `NFR-005`. Every other row was checked
against the change's actual downstream set rather than left silent.

**The downstream set of `generateMoves`, read out of the imports:**

```
generateMoves            only non-test caller: src/legal.ts:46 (legalMoves)
  legalMoves             non-test callers: src/gameend.ts:137 (gameStatus), src/perft.ts:26/65
    gameStatus           non-test caller: src/history.ts:153 (gameStatusOf)
  hasLegalEnPassant      NOT downstream — synthesises its own probe (above)
```

- **`NFR-002`** (full frame of the terminal renderer, `EPIC-002`) — **structurally untouched.**
  `src/frame.ts`, `src/render.ts` and `src/glyph-mode.ts` import nothing that reaches the generator;
  checked at the import graph rather than assumed. `src/frame.ts` imports one type from
  `src/render.ts` and nothing else.
- **`NFR-003`** — **its second component IS downstream, and the ticket's trigger block does not name
  it.** The row's "second component, added 2026-08-04" is `ABC-012`'s game-history derives, and
  `src/history.ts:gameStatusOf` -> `gameStatus` -> `legalMoves` -> `generateMoves` is a live path to
  the changed function. This is measured rather than left as a worry: the **per-call bound of at most
  1 evaluation per `generateMoves` call** makes the delta structurally negligible against a quantity
  the catalog measures in tens of microseconds (`gameStatusOf` 47.75 / 47.59 µs @ 120 plies), and it
  is **0** whenever `epSquare` is unset. **`NFR-003` is untouched** — but the trigger block should
  say so, and it is recorded as an owned risk rather than absorbed.
- **`NFR-004`** (engine move search, `EPIC-004`), **`NFR-005`** (engine search loop, `EPIC-004`),
  **`NFR-006`** (opening book artifact, `EPIC-005`), **`NFR-007`** (CLI cold start, `EPIC-006`) — all
  four belong to epics that are not built. Nothing on this branch reaches any of them.

## What this note does NOT establish

That `NFR-003`'s bar itself was re-measured — it was not, and it did not need to be: the argument is
the measured per-call bound plus the catalog's own figure for the quantity, not a fresh timing run.
And no `NFR-005` benchmark was run, deliberately, because a structural zero re-measured is a number
that invites being quoted as a measurement of something.
