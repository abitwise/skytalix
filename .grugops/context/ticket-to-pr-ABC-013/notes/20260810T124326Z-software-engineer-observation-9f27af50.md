---
id: 20260810T124326Z-software-engineer-observation-9f27af50
kind: observation
by: software-engineer
at: 2026-08-10T12:43:26Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - src/san.ts
  - src/san.test.ts
  - src/san.nfr.test.ts
  - plans/nfr-catalog.md
supersedes: 
---

# Ten self-mutations of `src/san.ts`, all ten dead — and TWO of them are invisible to the entire 52-row table

Run after the build was green, each as a real edit to `src/san.ts` restored from a byte copy before
the next. `src/san.test.ts` and `src/san.nfr.test.ts` were run against each; the killing tests are
listed as the runner named them.

| # | mutation | killed by |
|---|---|---|
| M1 | rivals taken from the **pseudo-legal** list (`generateMoves`) | `A7` + two call-count assertions |
| M2 | **rank before file** in the ladder | `A4` |
| M3 | rivals **not filtered by piece type** | `A1`, `A2`, `A3`, `A8`, `A16`, + the spy control |
| M4 | **no disambiguation at all** | `A4`, `A5`, `A6`, **the injectivity property**, + 2 counts |
| M5 | `#` on "no reply" **without** the check test | `A17` + three call-count assertions |
| M6 | capture decided by `position.board[move.to]` | `A10` |
| M7 | castle **returns before** the suffix | `A16` |
| M8 | **the supplied `legal` list is IGNORED** | **`san.nfr.test.ts` ONLY** |
| M9 | the **mate test runs on every move**, not only on a check | **`san.nfr.test.ts` ONLY** |
| M10 | pawn capture **loses its origin file** (`xd5` for `exd5`) | `A9`, `A10`, `A12`, **injectivity**, **grammar** |

## The two that matter most

**M8 and M9 return byte-identical strings for all 52 rows.** Every acceptance criterion in the
ticket is green on both. M8 throws away the entire justification for the optional `legal` parameter
— `ADR-0004` clause 2's whole argument, and `N1`, `N2` and `NFR-003`'s ~41-move budget with it. M9
pays a second full `legalMoves` on every one of 42 moves instead of on 3.

Neither is a grammar bug, so no string-comparing test can see them. They are exactly the shape
`plans/nfr-catalog.md` records twice under "a measurement is not a guard", and they are why
`san.nfr.test.ts` asserts counts. Without that file, this ticket ships a build that satisfies all 22
criteria and silently misses its primary NFR bar.

## The two the properties caught on their own

M4 and M10 are each killed by table rows AND by the injectivity property, which is the non-vacuity
evidence those properties needed — both were green when written, so neither was a kill at the time.
M10 additionally trips the grammar shape (`xd5` is not a SAN move).

## What this does NOT establish, and it is the important limit

**These are ten mutants chosen by the author of the code under test.** They are drawn from BA/PM's
nine measured wrong builds plus two of my own (M8, M9) aimed at the gap I could see in my own test
set. A mutant set chosen by the implementer is blind in exactly the places the implementer is:

- it contains no mutation of a rule I believe wrongly, because I would not think to write one;
- it contains no mutation in the two places I did not think to guard at all.

On `ABC-023`, QE's independent hop found **fourteen** builds that passed every criterion and the
whole suite after BA/PM had repaired that ticket's criteria. The honest prior here is the same.
**`0 survivors / 10` is a floor on this build's quality, not a ceiling, and it is not a substitute
for QE's mutation hop.**
