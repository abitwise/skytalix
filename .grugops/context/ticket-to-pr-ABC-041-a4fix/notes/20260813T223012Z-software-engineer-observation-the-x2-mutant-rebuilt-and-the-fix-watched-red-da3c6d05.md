---
id: 20260813T223012Z-software-engineer-observation-the-x2-mutant-rebuilt-and-the-fix-watched-red-da3c6d05
kind: observation
by: software-engineer
at: 2026-08-13T22:30:12Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/render-seam.test.ts
  - 20260813T215008Z-qe-e2e-decision-95533fe2
supersedes: 
---

# `X2` rebuilt, not read. The new width assertion goes RED on it; the old one goes GREEN in the same condition.

A fix nobody watched fail is not a fix, so the padding mutant was **built here, run, and reverted**,
and the module was md5-pinned on both sides of it.

## The mutant

QE's `X2`: the seam pads the board itself. One line in `src/render-seam.ts`, applied by script so the
blank count is exact and the revert is a byte copy:

```ts
board: renderBoard(history.position, mode, orientation).map((row) => row + "         "),
```

Nine blanks, **digit-free**, so `A3`'s no-digit clause cannot claim the kill. The frame inflates from
21 columns to 27.

## Three runs, and the middle one is the whole point

| run | module | `A4`'s width line | whole-frame equality | result |
|---|---|---|---|---|
| **A** | `X2` applied | derived from the panels | present | **`A4` RED at `src/render-seam.test.ts:241` — the width line, before the whole-frame check runs.** `A4 (width)` also red at `:368`. `10 passed / 2 failed (12)` |
| **B** | `X2` applied | derived from the panels | **removed** | **`A4` RED.** `1 failed / 11 skipped (12)`, filtered to the `A4` row alone |
| **C** | `X2` applied | **the old `(frame[0] as string).length`** | **removed** | **`A4` GREEN.** `1 passed / 11 skipped (12)` — QE's result reproduced by my own hand |

**B against C is the measurement.** Same mutant, same file, same missing "plus" — the only difference
is where the width comes from. QE's finding was that the whole-frame equality was doing all the work
and the named repair was decorative; **run B says the width line now catches `X2` on its own**, and
run C says it demonstrably did not before. The assertion message is the visible discriminator: the
frame's board region reads `'8 .♜:♞.♝:♛.♚:♝.♞:♜         '` (27 columns) against the expected
`'8 .♜:♞.♝:♛.♚:♝.♞:♜   '` (21) — a comparison that no longer moves when the seam moves.

## The revert, verified rather than assumed

`src/render-seam.ts` md5 **`bc18d0830b84adaff123affce66561c5`** before the mutant and after the
revert. `git diff --numstat 8dbe2b4 -- src/` reports **only `src/render-seam.test.ts`** — the
production module is absent from the diff entirely, which is the strongest form of "byte-identical".
The test file was restored from a pinned copy too (`f47e6df7916bf38cf33334175b338f26`), so the
temporary "whole-frame equality removed" shape used in runs B and C left nothing behind. Suite green
again at **12 passed** after the revert.

## One thing this does not prove

That the whole-frame equality is now redundant. It is not: it reaches every region, not just the
board, and it stays. What changed is that it is no longer the **only** thing standing between `X2`
and a green suite.
