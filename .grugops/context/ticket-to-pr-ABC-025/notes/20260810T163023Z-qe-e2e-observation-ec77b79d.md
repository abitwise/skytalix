---
id: 20260810T163023Z-qe-e2e-observation-ec77b79d
kind: observation
by: qe-e2e
at: 2026-08-10T16:30:23Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - RISK-ABC013-04
  - src/san.ts
  - src/san.qualifier.hardening.test.ts
  - src/san.suffix.hardening.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# 49 mutants over two tree states: the delivered net has FOUR blind spots, all one class, and the class is one nobody had asked about — the qualifier and the suffix on the same string

Measured at this hop against `src/san.ts` md5 `cbcc3be37c21414d16e8e6b4d0c68959` (148 lines), Apple
M3 / Node v24.12.0 / darwin arm64, vitest 3.2.7. Nothing is inherited: the ticket's 13 were
**re-specified from `## Reproduction 1`'s descriptions** on this hop's own instrument, and the other
36 are this hop's.

**Harness discipline.** Mutants applied to a copy of `src/` held **outside** the repository with
`node_modules` symlinked; every anchor asserted to occur **exactly once** in the pristine source and
the bytes asserted to have changed, or the run is a harness error and never a survivor; `tsc
--noEmit` per mutant (**exit 0 on all 49, both passes** — no broken build was ever scored); **one
fresh OS process per tree state** for every typecheck and every suite run; `src/san.ts` restored
from a pristine byte copy and re-hashed to `cbcc3be3…` after every single mutant. **No file under
`src/` in the repository was written by the harness.** Baselines in the harness's own process:
**672/672** before this hop's rows, **676/676** after.

## 1 — how this set was chosen, and why it is not the prior hops' set with more entries

BA/PM and the Engineer agree exactly on 13 mutants. That agreement is real and it is also the most
likely place for a shared blind spot: **both derived their set the same way** — by reading
`ABC-013`'s criteria and `ABC-013`'s QE hop's five survivors. One instrument used twice.

This set was derived by two different routes:

1. **a per-token operator sweep** — every decision point, constant, comparison and concatenation in
   `src/san.ts` mutated in turn (`T01`–`T20`, `T14b`), which reaches code the criteria never talk
   about: the piece-letter table, the promotion letter, the pawn-capture file, the suffix's
   make/ask/unmake, the pseudo-legal-vs-legal rival rule;
2. **interaction classes a per-token sweep cannot reach**, because they are wrong only where **two**
   features meet: qualifier × suffix (`QS1`–`QS6`), and call form (`CF1`–`CF4`);
3. **five equivalence controls of my own** (`EQ1`–`EQ5`) on top of the ticket's four, so "the rows
   pin behaviour and not shape" is tested against nine equivalent builds rather than four.

## 2 — the ticket's 13, re-specified: every verdict and every internal count reproduces

```
mutant  suite(before)  killed by                         A1 mismatches   injectivity positions
Q33      669/672       A1, A3 x2                         412             -
Q34      669/672       A1, A3 x2                          24             -
Q35      663/672       A1, A3 x8                         110             -
Q27      667/672       A1, A3 x4                         536             -
Q38      667/672       A1, A3 x4                          30             -
Q28'     668/672       A3 x4   (A1 GREEN, as the ticket says)  -          -
Q13      669/672       A3, A4, INJ                         -             44
Q14      661/672       A1, A3 x8, A4, INJ                116             53
Q36      667/672       A1, A3 x2, A4, INJ                412             50
Q22 Q24 Q29 Q40  672/672 SURVIVED — the four behaviour-equivalent controls, killed count ZERO
```

`412 / 24 / 110 / 536 / 30 / 116 / 412` and `44 / 53 / 50` are BA/PM's integers and the Engineer's
integers, now produced by a **third** instrument that shares code with neither. Three independent
harnesses agreeing on integers is as strong as this kind of evidence gets.

## 3 — the four wrong builds the delivered net could NOT see

```
mutant                                                        suite BEFORE   suite AFTER this hop
QS2  the check/mate suffix dropped when a qualifier is emitted   672/672 SURVIVED   673/676 killed (QE x3)
QS3  a MATE by a qualified move loses its `#`                    672/672 SURVIVED   675/676 killed (QE)
QS4  the suffix dropped only on the SQUARE rung                  672/672 SURVIVED   675/676 killed (QE)
QS6  the qualifier dropped on a MATE only                        672/672 SURVIVED   675/676 killed (QE)
```

**Why the delivered net is blind, measured rather than argued:**

```
hand-typed rows in the whole repository (src/san.test.ts 52 + san.qualifier.hardening.test.ts 63)  111
of those, rows carrying BOTH a qualifier and a `+`/`#`                                               0
qualified MOVES in ABC-025's 207-position corpus that also give check                               32
qualified MOVES in that corpus that also give MATE                                                   0
```

`A1` strips a trailing `+`/`#` before it reads the qualifier back out — it must, it is a qualifier
property — so it is blind to the suffix **by construction**. `A4`/injectivity does not see a dropped
suffix either: two rivals that both check still carry different qualifiers, so the strings stay
distinct. The SAN-shape property accepts a suffix-free string. Nothing else looks.

**This is the same species of hole `ABC-025` was cut for, one axis further out.** `ABC-013`'s table
exercised the ladder on one cell of (type × colour × capture-ness); `ABC-025` built the missing 44
cells and then exercised the ladder on one value of a fifth axis — no suffix. `QS1` (the qualifier
dropped on *check*) **does** die, on `A1` at 32 mismatches and on injectivity at 8 positions, because
this ticket's own positions happen to produce 32 qualified checks; `QS3`/`QS6` survive because they
produce **zero** qualified mates.

**Closed at this hop** by `src/san.suffix.hardening.test.ts` — 5 positions, 11 hand-typed rows, 4
tests: a qualified check at all three rungs, a qualified capture that checks, and the only qualified
**mate** in the repository, plus a non-vacuity row that asserts every row really does carry both
parts at every rung. All 11 strings were typed by hand from board geometry and then put to
`chess.js@1.4.0` installed **outside** the repository: **5 positions offered / 0 refused, 11 strings
/ 0 DISPUTED, 115 legal moves compared move-for-move / 0 MISMATCHES**, `package.json` and
`package-lock.json` md5-identical before and after and `chess.js` absent from the repository's
`node_modules`.

## 4 — the other 36, and what they say about the whole net

Everything else died. The killers are worth recording because they are not always the rows anyone
would predict:

- `T08` (the KING's letter lower-cased) is invisible to every `ABC-025` row — **no `ABC-025` row
  renders a king move** — and dies on `ABC-013`'s `A2` (`Kf2`) and the shape property. `A1`'s string
  reader (`slice(1, -2)`) is blind to the piece letter itself whenever the qualifier is unaffected.
- `T19` (rivals taken from `generateMoves`, so a pinned rival still qualifies the mover) dies on
  `ABC-013`'s `A7` alone among the behaviour rows. `ABC-025`'s corpus does not settle the
  legal-vs-pseudo-legal rule; `ABC-013`'s `P-PIN` row does.
- `T15`/`T17`/`T18` (suffix asked before the move; `#`/`+` swapped; suffix emitted first) die widely,
  including on this hop's rows.
- `T16` (the position left mutated) dies on `A5` and `ABC-013`'s `A18` — purity is well guarded.

**`A2` was red for NO mutant across all 49**, exactly as the ticket says of it: it is computed from
the legal move list and not from `toSan`, so no wrong build can witness it.

## 5 — the equivalence question, answered on nine controls rather than four

```
Q22 Q24 Q29 Q40   the ticket's four            SURVIVED both before and after this hop — killed count ZERO
EQ3  the full-square rung rebuilt from its two characters      SURVIVED
EQ4  the unreachable piece-letter default becomes "?"          SURVIVED
EQ5  the castle branch tested after the pawn branch            SURVIVED
EQ1  the `check &&` short-circuit dropped from the mate test   KILLED — by san.nfr.test.ts `N1` only
EQ2  the caller's legal list ignored and regenerated           KILLED — by san.nfr.test.ts `N1` only
```

**No behaviour row in `ABC-013`, `ABC-025` or this hop kills any behaviour-equivalent mutant.** The
only rows that kill one are `san.nfr.test.ts`'s `N1` call-count assertions, and pinning the
generation count is precisely what `N1` exists to do — it is a cost criterion, not a behaviour one.
Recorded because it has a consequence: **a sanctioned optimisation of `toSan`'s generation strategy
will turn `N1` red**, and the next engineer must be told that is `N1` working, not a regression.

## 6 — two errors of mine, recorded rather than smoothed

1. **`T14` is a null mutation and I scored it as a survivor before noticing.** I wrote "mate reported
   without the check test" as an edit to `if (!check) return ""` while leaving `const mate = check &&
   …` intact, so the mutated tree computes exactly the same strings. It "survives" 676/676 because it
   is behaviourally identical to the delivered build, not because the net is blind. Re-specified as
   `T14b` (both edits), which dies on `ABC-025`'s `A3` stalemate row, `ABC-013`'s `A17` and three
   `san.nfr.test.ts` rows. **`T14` stays in the table as a survivor with its cause named**, because
   deleting a mutant that embarrassed the harness is how a mutation score gets quietly inflated.
2. **My first `N5` instrument was too noisy to carry a verdict** and I published nothing from it —
   see the `observation` note beside this one.
