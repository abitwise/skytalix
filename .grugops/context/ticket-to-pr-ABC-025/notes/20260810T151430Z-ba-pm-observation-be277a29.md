---
id: 20260810T151430Z-ba-pm-observation-be277a29
kind: observation
by: ba-pm
at: 2026-08-10T15:14:30Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - RISK-ABC013-04
  - EPIC-002
  - src/san.ts
  - src/san.test.ts
  - plans/tickets/ABC-025-san-qualifier-minimality-net.md
supersedes: 
---

# The measurements behind `ABC-025` — a SIXTH wrong build, and the obvious fix closes only three of six

Everything here was measured at this hop against `src/san.ts` md5
`cbcc3be37c21414d16e8e6b4d0c68959` (148 lines), on Apple M3 / Node v24.12.0 / darwin arm64. Nothing
is inherited from `ABC-013`'s QE hop; its five survivors were **re-derived on this hop's own
instrument** and the numbers below are this hop's.

**Harness discipline, so a red can be believed.** Mutants applied to a copy of `src/` held outside
the repository with `node_modules` symlinked; every anchor asserted to occur **exactly once** in the
pristine source and the bytes asserted to have changed, or the run is a harness error and never a
survivor; `tsc --noEmit` per mutant (**exit 0 on all 13** — no broken build was ever scored); **one
fresh OS process per tree state**; `src/san.ts` restored from a pristine byte copy and re-hashed to
`cbcc3be3…` after every mutant and against the repository's own copy at the end. **No file under
`src/` in the repository was written and no test row was written.** Baseline in the harness's own
process: **652 passed / 652 on 20 files in 1.44 s**, `tsc --noEmit` exit 0.

## 1 — six wrong builds pass 652 of 652, not five

```
mutant                                              SUITE      INJ    PROP-OLD   PROP-NEW   ROWS
Q33  full origin square when a ROOK has a rival     652/652    pass   FAIL 368   FAIL 412   12 red
Q34  full origin square when a BISHOP has a rival   652/652    pass   PASS **    FAIL  24    8 red
Q35  full origin square on a qualified CAPTURE      652/652    pass   FAIL  92   FAIL 110   18 red
Q27  full origin square when the mover is BLACK     652/652    pass   FAIL 456   FAIL 536   18 red
Q38  full origin square, BLACK on the rank rung     652/652    pass   PASS **    FAIL  30   10 red
Q28' the `x` dropped for a BLACK piece capture      652/652    pass   PASS **    PASS **    12 red
Q13  castle side from the ABSOLUTE destination      651/652    FAIL   pass       pass        1 red
Q14  qualifier skipped on a capture                 651/652    FAIL   FAIL  92   FAIL 116   24 red
Q36  ROOKS under-qualified                          651/652    FAIL   FAIL 368   FAIL 412   12 red
Q22  rivals matched on piece TYPE, not the byte     652/652    pass   pass       pass        0 red
Q24  capture read from the board + the ep flag      652/652    pass   pass       pass        0 red
Q29  castle detected by the king's two-square hop   652/652    pass   pass       pass        0 red
Q40  full origin square for a KING with a rival     652/652    pass   pass       pass        0 red
```

`PROP-OLD` is the minimality property over the corpus `src/san.test.ts` already has; `PROP-NEW` is
the same property over that corpus plus this ticket's 23 positions; `ROWS` is the 63 hand-typed
strings; `INJ` is the existing injectivity property.

**`Q28'` is this hop's, not QE's.** `ABC-013`'s QE hop reported a broader *"the `x` is dropped for
black"* mutant that injectivity killed. This narrower one — the `x` dropped only on **black piece
captures** — passes the suite, passes injectivity, and passes the minimality property **on both
corpora**, because the property computes its expectation from the same rival set the code uses and
this defect is not in the rival set. It dies only on a hand-typed string. That is the whole argument
for keeping hand rows as a criterion in their own right.

**All four behaviour-equivalent controls survive every new lane, killed count zero.** A row that
kills an equivalent mutant pins implementation shape rather than behaviour (`ABC-009`'s lesson,
`ABC-024`'s `A5`), and that was measured here rather than hoped for.

## 2 — the property is necessary and NOT sufficient: the corpus census

Every qualified move falls in one cell of **piece type × colour × capture-ness × rung**. King is
excluded by construction (no same-type rival — that is what makes `Q40` equivalent), leaving 48
cells of which **44 are reachable**.

```
corpus                                             positions   legal moves   qualified   cells of 44
src/san.test.ts corpus() as it stands (1 ply)            184         6,637         466      5
the same six perft FENs expanded TWO plies             6,639       277,772      15,930      9
this ticket's 23 positions alone                          23           677          82     44
corpus() + this ticket's 23 positions                    207         7,314         548     44
```

The five cells filled today: `N black capture file` 92, `N black quiet file` 4, `N white quiet file`
2, `R black quiet file` 360, `R white quiet file` 8. **Mechanical widening does not fix it**: 39x the
positions buy four cells, because derived play is overwhelmingly file-rung rooks and knights. At two
plies there is still no square rung anywhere, no black bishop, no black queen and no white capture at
the rank or square rung.

**A rook can never require the full-square rung** — a theorem, and the reason the 4 rook-square cells
are unreachable. A rook at `(f,r)` reaching `(F,R)` has `f == F` or `r == R`; if it stands on file
`F`, every rival that also reaches `(F,R)` either shares that file or lies on rank `R`, and a rival on
rank `R` shares neither the mover's file nor its rank, so `sharesFile` and `sharesRank` can never both
be true. Measured: **zero** two-character rook qualifiers over 7,314 and over 277,772 renders.

## 3 — `ABC-013`'s own table, re-derived mechanically

Across its 18 acceptance FENs there are **29 qualified moves**, in exactly five cells —
`N white quiet file` 4, `N white quiet rank` 4, `Q white quiet file` 15, `Q white quiet rank` 5,
`Q white quiet square` 1. **Zero rooks, zero bishops, zero captures, zero black**; black-to-move FEN
count **0 of 18**. Nine of the 29 are pinned by a criterion (`A4` 4 rows, `A5` 2, `A6` 3). This
confirms QE's sentence independently rather than quoting it.

## 4 — the injectivity property is the sole guard on three wrong builds and no criterion owns it

`Q13`, `Q14` and `Q36` each fail **exactly one test of the 652**, and it is
`toSan — the logic beneath the table > gives every legal move of a position a DISTINCT string`
(`src/san.test.ts:347`). No criterion of `ABC-013` names it: `A1`–`A22` never mention it, and `A22`
(*"no existing test is modified"*) was that ticket's own dev-hop criterion and is closed. **Deleting
that test today turns nothing red.** `ABC-025` `A4` gives it an owner in this ticket's own rows.

**The SAN-shape property (`src/san.test.ts:344`) is blind to all six wrong builds** — measured, all
six PASS it over 7,314 strings, because `[a-h]?[1-8]?` admits a full origin square and `Nd5` is as
grammatical as `Nxd5`. It is therefore deliberately NOT promoted to a criterion.

## 5 — the 63 strings, checked against something that is not this repository

`chess.js@1.4.0` installed with `npm install` in this session's scratchpad **outside** the
repository — the instrument `ABC-013`'s QE hop found after three hops had recorded that none existed.

```
positions offered to chess.js          23      refused                  0
hand-typed strings checked             63      DISPUTED                 0
legal moves compared move-for-move    677      MISMATCHES               0
repository dependency added             0      package.json / package-lock.json untouched
```

Against the repo build as well: all 23 FENs round-trip through `toFen` byte-identically, in all 23
the side not to move is not in check, every named `(from, to, promotion)` triple names exactly one
legal move, purity and the `legal`-argument equivalence hold over every legal move in both call
forms, and the minimality property holds on all 82 qualified moves. **Zero failures.**

## 6 — what this ticket would cost the default lane

207 positions and 7,314 renders: **6.3 / 7.5 / 16.8 ms** over three runs, against **1.44 s** for the
652-test suite — **0.4–1.2%**. Recorded as a ratio rather than a clock, because a clock bar does not
survive a hardware change (`ABC-013`'s `N1` lesson).

## What these figures do NOT establish

**Not that six is the complete set.** The mutants were chosen by reading `ABC-013`'s criteria and
QE's five; a defect class nobody has asked about would not appear here. `ABC-023`'s QE hop found
fourteen where its ticket predicted two, and that is the honest prior.
**Not conformance to the PGN specification text** — `chess.js` is a widely-used implementation, not
the standard, and where it and this repository could both be wrong in the same way this check is
blind.
**Not that `src/san.ts` is correct beyond these instruments.** It answered all 677 moves and all 82
qualified moves correctly here; that is agreement over a small corpus, on top of QE's 649,556-string
agreement, not proof.
