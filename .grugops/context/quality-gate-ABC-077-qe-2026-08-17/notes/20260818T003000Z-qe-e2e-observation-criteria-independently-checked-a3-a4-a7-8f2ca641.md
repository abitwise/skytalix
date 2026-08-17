---
id: 20260818T003000Z-qe-e2e-observation-criteria-independently-checked-a3-a4-a7-8f2ca641
kind: observation
by: qe-e2e
at: 2026-08-18T00:30:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - ABC-081
  - src/search.ts
  - src/search.test.ts
  - plans/tickets/ABC-077-negamax-alpha-beta-core.md
supersedes:
---

# `A3`, `A4`, `A7` checked against an independent oracle — plus one wrong number and two flags

I did not re-run the engineer's assertions and agree with them. Where a claim had an oracle outside `src/search.ts`, I built one.

## `A3` — the depth-7 mate claim: **CONFIRMED independently**

He claims that in `7k/8/5K2/8/8/8/8/R7 w - - 0 1`, four moves force mate in 4 (7 plies), ten force mate in 3, only `Kf7`/`Kg6` mate in 2, and the search still returns mate in 2 at depth 7.

I wrote a **pure mate-distance minimax that never calls `search`, `negamax` or `evaluate`** — it scores only "who is mated in how many plies" — and enumerated every root move at depth 7:

```
a1a6  mate in 4 (7 plies)      a1a2 a1a3 a1a4 a1a5 a1a8  mate in 3 (5 plies)
a1a7  mate in 4 (7 plies)      a1b1 a1c1 a1d1 a1e1 a1h1  mate in 3 (5 plies)
a1f1  mate in 4 (7 plies)      f6f7  mate in 2 (3 plies)
a1g1  mate in 4 (7 plies)      f6g6  mate in 2 (3 plies)
f6e5 f6e6 f6e7 f6f5 f6g5  no forced mate
```

**Exactly four mate-in-4s, ten mate-in-3s, two mate-in-2s.** The claim is true and the fixture is what he says it is. `A3` at depth 7 returns `MATE_SCORE - 3` and one of `f6f7`/`f6g6`, green here under `SEARCH_DEEP=1`.

## `A7` — byte-identical: **the assertion is COMPLETE, which is rarer than it sounds**

`Position` (`src/position.ts:30-42`) has exactly six fields: `board`, `blackToMove`, `castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber`. The test's `snapshot`/`matchesSnapshot` compare **all 128 board bytes and all five scalars** — every field the type has. There is no hidden key, no cached hash and no king-square array that could drift unobserved. `A7`'s "byte-identical" means what it says.

Its **coverage** is the weaker part (`G4`): the default-lane corpus runs at depth 1, which never enters `negamax`'s move loop, so interior make/unmake rests on the single retained `position-3` depth-3 pair. Verified load-bearing by mutant `Q14`.

## `A4` — the corpus, and **one number that is wrong**

`A4` asks for ≥ 200 positions. **The default corpus is 231 — confirmed** two ways (my own reconstruction of `defaultCorpus()`, and instrumenting the delivered test, which reported 231).

**The broad corpus is 184, not 204.** Also confirmed two ways:

- arithmetic — 6 roots plus perft(1) from each: 20 + 48 + 14 + 6 + 44 + 46 = 178, plus 6 = **184**;
- instrumented — the delivered `corpusRun("broad", 1).size` asserted against a wrong value reports **`expected 184`**.

The figure **204** appears in four places: `src/search.test.ts:20`, and three lines of the engineer's notes — including *"204/204 on the broad corpus"* in the `A4` verdict row and *"204/204 broad corpus unchanged"* in the `A7` row. **Those are pass counts for a run that never happened at that size.**

**No criterion turns on it.** `A4`'s ≥ 200 is met by the 231-position default corpus, and the broad-corpus test only asserts `>= 100`. This is a record-accuracy defect, not a coverage one: severity LOW-MEDIUM (`G5`). Corrected in the `ABC-077` row of `plans/traceability.md` at this hop; the source comment and the engineer's notes are their authors' to supersede, and notes are append-only.

## Two flags, neither a criterion

- **`G6` — interior nodes never consult `gameStatus`.** `leafScore` calls it at depth-0 leaves, so dead position and the seventy-five-move rule are caught there; `negamax`'s interior no-moves branch decides mate-or-stalemate from `isInCheck` alone, and an interior node **with** legal moves that is already drawn by the seventy-five-move rule is searched on regardless. Consistent with `ADR-0002` and with repetition being `ABC-081`'s, and no criterion asks about it. Flagged for `ABC-081`, not fixed — QE does not change production code.
- **`G7` — the ticket page's § Dependencies still says `ABC-076` is OPEN.** It is merged. The engineer flagged it and correctly did not edit the page. It is the page-owner's.
