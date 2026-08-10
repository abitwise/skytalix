---
id: ABC-025
title: SAN qualifier minimality — the acceptance net is exercised on white knights and white queens only, and six wrong builds pass 652 of 652
status: in-security-nfr
column: In Security/NFR
size: M
priority: P2
epic: EPIC-002
feature: —
---

# ABC-025 — SAN qualifier minimality: the acceptance net is exercised on white knights and white queens only, and six wrong builds pass 652 of 652

> **Cut 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-025`, subtask `ticket-to-pr-ABC-025-bapm`,
> Workflow 07), owed by `RISK-ABC013-04` and named at `ABC-013`'s close.
>
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered code is CORRECT on every item
> below.** `src/san.ts` at md5 `cbcc3be37c21414d16e8e6b4d0c68959` (148 lines, one export `toSan`)
> answers every position in this ticket the way the standard requires — measured here against the
> repo build **and** against an external implementation. What is missing is **acceptance**, not
> behaviour. **The expected production diff is zero lines.** If any row proves the delivered code
> wrong, that is a defect, it gets its own ticket, and it is said out loud rather than folded in.
>
> **Every figure in this ticket was measured by BA/PM at this cutting hop and NOTHING is inherited.**
> `ABC-013`'s QE hop reported **five** wrong builds that pass every criterion; this hop re-derived all
> five on its own instrument and found a **sixth** that the five's own fix does not catch. Mutants
> applied to a copy of `src/` held **outside** the repository with `node_modules` symlinked; every
> anchor asserted to occur **exactly once** in the pristine source and the bytes asserted to have
> changed, or the run is a harness error and never a survivor; `tsc --noEmit` per mutant, so a tree
> that does not build can never be scored a survivor; **one fresh OS process per tree state** for
> every typecheck, every `vitest` run and every property probe; `src/san.ts` restored from a pristine
> byte copy and **re-hashed to `cbcc3be37c21414d16e8e6b4d0c68959` after every single mutant** and
> against the repository's own copy at the end. **No file under `src/` in the repository was written,
> and no test row was written at this hop.**
> **13 mutants, 0 broken builds (tsc exit 0 on all 13), 0 harness errors**, plus 23 candidate
> positions, 63 hand-typed strings and 677 moves cross-checked against `chess.js@1.4.0` installed
> **outside** the repository. Machine: Apple M3 / Node v24.12.0 / darwin arm64; the test counts and
> cell counts are integers and machine-independent, the wall-clock figures are not.
>
> **Baseline measured in the harness's own processes before any mutant:** `npm test`
> **652 passed / 652 on 20 files** in **1.44 s**, `tsc --noEmit` exit **0**.

## Problem

*User*: the next engineer to touch `src/san.ts` — and that is not hypothetical. `EPIC-003` adds
`parseSan` **to this same file, over these same tables** (`ADR-0004` clause 2), and `ABC-016` /
`ABC-017` consume `toSan` to render the status panel and the move-history pane. Behind them stands
the player, who reads the move list: an over-qualified string is not a crash, it is a move list that
quietly stops being standard notation.

*Pain*: **six wrong builds of `toSan` pass all 652 tests on 20 files**, and every one of them emits
strings an external implementation calls wrong. The reason is one sentence, and it is about the
criteria rather than the code:

> **`ABC-013`'s acceptance table exercises the disambiguation ladder on WHITE KNIGHTS and WHITE
> QUEENS, on QUIET moves, and on nothing else. All 18 of its FENs are white to move.**

Re-derived mechanically at this hop rather than quoted: across the 18 acceptance positions there are
**29 qualified moves in total**, and they occupy exactly **five** cells —
`N white quiet file` (4), `N white quiet rank` (4), `Q white quiet file` (15),
`Q white quiet rank` (5), `Q white quiet square` (1). **Zero rooks, zero bishops, zero captures,
zero black.** Of those 29, **nine** are pinned by a criterion (`A4` 4 rows, `A5` 2, `A6` 3).

*Value*: this is the seam three epics share. The failure it prevents is the one `ABC-013`'s own
`## Problem` names — *"the move a player reads on screen and the move their typed string resolves to
simply stop being the same move"* — and the moment of maximum risk is `EPIC-003` editing this file.
A net that cannot see a wrong build is not protection, and this one has been measured, twice, by two
roles that did not share an instrument.

## The gap, in one line, so the ticket is not mis-cut

**The acceptance net is asymmetric in three dimensions — piece type, colour, and capture-ness — and
every measured wrong build lives in one of the three.** That is the class. Five of the six wrong
builds are over-qualification (`Ra1b1` where `Rab1` is right); the sixth is not a qualifier bug at
all. Writing five criteria that re-state the five would close five holes and leave the class open,
which is why the criteria below are derived from the **property** and only then checked against the
mutants.

**The property**, stated as the thing the qualifier is FOR rather than as the procedure that
computes it:

> The qualifier a SAN string carries is the **shortest entry of the ladder**
> `"" → origin file → origin rank → origin square` for which **exactly one** legal move of that
> piece byte reaches that destination.

This is `EPIC-003`'s minimal-unique-qualifier definition, arrived at independently by `ABC-013`'s QE
hop from the PGN export grammar. It is provably the same rule as the delivered code's two
accumulated flags — a file separates the mover exactly when no rival shares it — and it is written
as a **search over the ladder**, which is what makes it a different instrument rather than a second
copy of the code.

## Source

`RISK-ABC013-04`, owned by BA/PM, raised at `ABC-013`'s close
(`.grugops/context/ticket-to-pr-ABC-013/notes/20260810T150000Z-orchestrator-decision-9e2b04d5.md`),
from `ABC-013`'s QE hop
(`20260810T132221Z-qe-e2e-observation-02011fcc`, `20260810T132222Z-qe-e2e-observation-d99902de`,
`20260810T132220Z-qe-e2e-observation-76af618a`).

**The five gaps are open because of the Orchestrator's own over-tight QE scoping — QE proved all
five and was told to hold the delivered diff at three files — and that is recorded there, by the
role that did it.** It is repeated here only so nobody re-reads this ticket as a QE miss.

**`ABC-013` is not re-opened by any of this.** `A1`–`A22` are green, their verdicts stand, no
existing row, count or verdict is edited, and `ADR-0004` and `EPIC-003`'s `parseSan` contract are
untouched. This ticket adds a net around a merged module in exactly the way `ABC-023` and `ABC-024`
add one around `src/moves.ts`.

## Reproduction (measured 2026-08-10 by BA/PM against `cbcc3be37c21414d16e8e6b4d0c68959`, baseline 652/652 on 20 files)

### 1 — the wrong builds

`SUITE` is the whole default `npm test`. `INJ` is the existing table-free injectivity property
(`src/san.test.ts:347`, *"gives every legal move of a position a DISTINCT string"*) — a test **no
`ABC-013` criterion requires**. `PROP-OLD` is this ticket's minimality property over the corpus that
`src/san.test.ts` **already has** (the six perft FENs and their one-ply children); `PROP-NEW` is the
same property over that corpus **plus this ticket's 23 positions**; `ROWS` is this ticket's 63
hand-typed strings.

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
Q36  ROOKS under-qualified (the control direction)  651/652    FAIL   FAIL 368   FAIL 412   12 red

CONTROLS — behaviour-equivalent, and they MUST stay alive
Q22  rivals matched on piece TYPE, not the byte     652/652    pass   pass       pass        0 red
Q24  capture read from the board + the ep flag      652/652    pass   pass       pass        0 red
Q29  castle detected by the king's two-square hop   652/652    pass   pass       pass        0 red
Q40  full origin square for a KING with a rival     652/652    pass   pass       pass        0 red
```

**Three readings this table forces, and each one changes the shape of the fix.**

1. **`Q28'` is a SIXTH wrong build and it is not a qualifier bug.** It emits `Nd5` where the standard
   requires `Nxd5`, for black piece captures only. It passes the suite, it passes injectivity, and it
   passes the minimality property **on both corpora** — because the property computes its expectation
   from the same rival set the code uses, and this defect is not in the rival set. It dies **only** on
   a hand-typed string. *(`ABC-013`'s QE hop reported a broader "x dropped for black" mutant that
   injectivity killed. This narrower one is this hop's, is measured here, and is the reason `A3`
   exists as a criterion in its own right rather than as decoration on `A1`.)*
2. **The property alone is NOT enough, because the corpus it runs over is not rich enough** — `Q34`
   and `Q38` survive it. That is the `**` in the table, and it is the single most important
   measurement on this ticket: a criterion reading *"add the minimality property"* would close three
   of the six holes and read as though it had closed five.
3. **All four equivalent controls survive every new lane, killed count zero.** A row that kills an
   equivalent mutant pins implementation shape instead of behaviour; this is `ABC-009`'s standing
   lesson and `ABC-024`'s `A5`, and it is measured here rather than hoped for.

### 2 — why the corpus is not rich enough: the census

Every qualified move can be placed in one cell of the grid **piece type × colour × capture-ness ×
rung**. King is excluded by construction (a king never has a same-type rival — that is what makes
`Q40` an equivalent control), leaving **4 × 2 × 2 × 3 = 48** cells, of which **44 are reachable**:

> **A ROOK can never require the full-square rung, and this is a theorem, not an observation.** A
> rook at `(f,r)` reaching `(F,R)` has `f == F` or `r == R`. If it stands on file `F`, every rival
> that also reaches `(F,R)` either shares that file or lies on rank `R` — and a rival on rank `R`
> shares neither the mover's file nor its rank. So `sharesFile` and `sharesRank` can never both be
> true for a rook. Measured, not merely argued: over the 7,314 renders of the widened corpus and the
> 277,772 renders of a two-ply expansion, **zero** rook strings carry a two-character qualifier.

```
corpus                                             positions   legal moves   qualified   cells of 44
src/san.test.ts corpus() as it stands (1 ply)            184         6,637         466      5
the same six FENs expanded TWO plies                   6,639       277,772      15,930      9
this ticket's 23 positions alone                          23           677          82     44
corpus() + this ticket's 23 positions                    207         7,314         548     44
```

**Mechanical widening does not fix it.** Thirty-nine times more positions and forty-two times more
strings buy **four** additional cells: derived play from the perft positions is overwhelmingly
file-rung rooks and knights. At two plies there is still **no square rung anywhere, no black bishop,
no black queen and no white capture at the rank or square rung**. The cells have to be built.

The five cells `corpus()` fills today: `N black capture file` 92, `N black quiet file` 4,
`N white quiet file` 2, `R black quiet file` 360, `R white quiet file` 8.

### 3 — the 63 strings, checked against something that is not this repository

Every expected string below was typed by hand from its FEN's geometry and then put to
**`chess.js@1.4.0`**, installed with `npm install` run in this session's scratchpad **outside** the
repository — the instrument `ABC-013`'s QE hop found after three hops had recorded that no external
oracle existed.

```
positions offered to chess.js          23      refused                  0
hand-typed strings checked             63      DISPUTED                 0
legal moves compared move-for-move    677      MISMATCHES               0
repository dependency added             0      (package.json / package-lock.json untouched)
```

Checked against the repo build as well: all 23 FENs round-trip through `toFen` byte-identically, in
all 23 the side not to move is not in check, every named `(from, to, promotion)` triple names
**exactly one** legal move, purity (`toFen` byte-identical across every call) and the
`legal`-argument equivalence hold over every legal move of every position in **both** call forms,
and the minimality property holds on all 82 qualified moves. **Zero failures.**

## Scope

Test-only work over `toSan`'s acceptance net. Three things, each observable:

- **The minimality property** — the ladder search — asserted over a corpus, table-free.
- **The corpus is made rich enough for that property to be discriminating, and the richness is
  itself asserted** as a census, so it cannot silently regrow thin.
- **Hand-typed strings** at the cells the property cannot see, and at the black-side corners of every
  colour-sensitive `ABC-013` criterion.

**No production change is expected**, and `A6` pins it. Where the rows and the corpus live is the
writing role's call — one new test file, or new tables in `src/san.test.ts` — subject to the
mechanical constraint in `## Test notes` note 1, which is a criteria-conflict rule and not a
preference.

## Out of scope

- **`ABC-013`'s criteria `A1`–`A22` and its rows.** Not re-opened, not re-measured, no verdict
  changed, no existing row edited. This ticket writes new rows beside them.
- **`ADR-0004` and `EPIC-003`'s `parseSan` contract.** `src/san.ts` is merged, its md5 is on the
  record, and nothing here touches the amended signature, the `SanParseResult` shape or the
  move-identity invariant.
- **The round-trip identity `parseSan(toSan(m)) === m`.** It is `EPIC-003`'s, it needs the parser,
  and `ABC-013`'s QE hop already ran a scratchpad approximation of it. Writing a SAN *matcher* into
  this repository to get it early would be a second grammar in the codebase — the exact failure
  `ADR-0004` exists to prevent.
- **The SAN-shape property** (`src/san.test.ts:344`) is **not** promoted to a criterion, and the
  reason is a measurement rather than a taste: it is **blind to all six wrong builds** — all six pass
  it over 7,314 strings, because `[a-h]?[1-8]?` admits a full origin square and `Nd5` is as
  grammatical as `Nxd5`. It stays where it is; nothing here asserts it.
- **Adding `chess.js` (or any oracle) as a repository dependency.** A QE instrument does not belong
  in the shipped dependency set — `ABC-013`'s QE hop's ruling, and this hop kept to it.
- **Enumerating every occupant piece type on a capture destination.** `move.captured !== EMPTY` is
  type-blind by construction; a second byte on the destination pins nothing new. This is the `L` trap
  — if it is ever wanted, split it, do not grow this ticket.
- **Coverage as a criterion.** The board's standing reason: `src/legal.ts` shipped this project's
  worst defect at 100% statement/branch/function coverage.
- **Any change to the rules core**, to `src/legal.ts`, or to the `PERFT_DEEP=1` lane's membership of
  `quality.mandatory_gates` (`ABC-024` considered and rejected that; it is not re-opened here).

## Acceptance (Given/When/Then)

Every *(Measured …)* parenthetical is the behaviour of the **delivered** tree at
`cbcc3be37c21414d16e8e6b4d0c68959` against the **652-test suite on 20 files**, and is evidence, not a
target. **Each criterion names the mutant that must die**, because "the property exists" is not the
requirement.

- **`A1` (the minimality property, written as a LADDER SEARCH).** **Given** every position of this
  ticket's corpus and every legal move of each that is neither a pawn move nor a castle, **when**
  `toSan` renders it in both call forms, **then** the qualifier the string carries is exactly the
  **first** entry of `["", origin file, origin rank, origin square]` for which **exactly one** legal
  move of the **same piece byte** (type *and* colour) reaches that destination. **The expectation is
  computed by searching that ladder, not by re-implementing the two accumulated flags** — the
  criterion is about the qualifier's purpose, and a second copy of the procedure would agree with the
  code by construction. **The discriminating requirement:** `Q33`, `Q34`, `Q35`, `Q27` and `Q38` must
  each turn this criterion red, and the four equivalent controls `Q22`, `Q24`, `Q29`, `Q40` must
  leave it green.
  *(Measured 2026-08-10 at 652: green on the delivered build over 7,314 renders in 6.3–16.8 ms.
  `Q33` FAIL 412, `Q34` FAIL 24, `Q35` FAIL 110, `Q27` FAIL 536, `Q38` FAIL 30; all four controls
  PASS, killed count **zero**. Over the corpus `src/san.test.ts` has TODAY, `Q34` and `Q38` both
  **survive** this criterion — which is what `A2` exists to prevent.)*

- **`A2` (the census — `A1` is not allowed to be vacuous).** **Given** the corpus of `A1`, **when**
  its qualified moves are counted into the grid **piece type × colour × capture-ness × rung**,
  **then** each of the **44 reachable** cells holds **at least one** move, and each of the **four**
  `ROOK … square` cells holds **exactly zero** — the geometric theorem in `## Reproduction 2`, so the
  test asserts both directions and cannot pass by having nothing to say. **This criterion cannot be
  witnessed by a wrong build, and that is stated rather than glossed:** no mutation of `src/san.ts`
  can turn it red, because it is computed from the legal move list and not from `toSan`. Its witness
  is a **narrowed corpus**. **The discriminating requirement:** removing this ticket's positions from
  the corpus must leave **at least 35 of the 44 cells empty**, and deleting any single ladder
  position must turn at least one cell red.
  *(Measured 2026-08-10: `corpus()` as it stands fills **5** of 44; the same six FENs expanded two
  plies fill **9** of 44; this ticket's 23 positions fill **44** of 44 and leave exactly the four
  rook-square cells empty. Over 7,314 renders of the widened corpus and 277,772 of the two-ply
  expansion, zero rook strings carry a two-character qualifier.)*

- **`A3` (hand-typed strings — the instrument `A1` cannot be).** **Given** each of the **63** rows of
  `## The positions and the strings`, **when** the move named by `(from, to, promotion)` — obtained
  from `legalMoves(position)` and selected by that triple, **never** a hand-built `Move` object
  literal (`ADR-0004` clause 2b, `ABC-013`'s rule 1) — is rendered, **then** the string is **exactly**
  the expected one. **Why this is not redundant with `A1`, measured rather than argued:** `A1`
  computes its expectation from the same rival set the code uses, so a wrong build whose defect is
  not in the rival set is invisible to it. **The discriminating requirement:** `Q28'` — which passes
  the suite, injectivity **and** `A1` on both corpora — must turn this criterion red, and so must
  `Q33`, `Q34`, `Q35`, `Q27`, `Q38`, `Q13`, `Q14` and `Q36`.
  *(Measured 2026-08-10 at 652: green on the delivered build, all 63; `Q28'` 12 rows red, `Q33` 12,
  `Q34` 8, `Q35` 18, `Q27` 18, `Q38` 10, `Q13` **1** (black `O-O`, which it renders `O-O-O`), `Q14`
  24, `Q36` 12; all four equivalent controls **0** rows red. All 63 strings were typed by hand from
  their FEN and then confirmed by `chess.js@1.4.0` outside the repository: **0 disputed**, and 677
  moves over the same 23 positions compared move-for-move with **0 mismatches**.)*

- **`A4` (injectivity gets an owner).** **Given** the corpus of `A1`, **when** every legal move of a
  position is rendered with one shared legal list, **then** the strings of that position are
  **pairwise distinct** — as many distinct strings as there are legal moves. Asserted **in this
  ticket's own rows**, so the guard survives independently of `src/san.test.ts`'s copy, which is not
  edited. **Why it is owed a criterion:** this property is the **sole** guard on three wrong builds,
  and **no criterion of `ABC-013` requires it** — `A1`–`A22` never name it, so deleting it today
  turns nothing red. **The discriminating requirement:** `Q13`, `Q14` and `Q36` must each turn this
  criterion red.
  *(Measured 2026-08-10 at 652: `Q13`, `Q14` and `Q36` each fail **exactly one test of the 652**, and
  it is `toSan — the logic beneath the table > gives every legal move of a position a DISTINCT
  string`. `Q13` FAIL 44 positions of 207, `Q14` FAIL 53, `Q36` FAIL 50; the delivered build and all
  four controls PASS.)*

- **`A5` (purity and the `legal` argument, extended to the positions `ABC-013` could not reach).**
  **Given** each of this ticket's 23 positions, **when** every legal move is rendered **both** with
  and without the `legal` argument, **then** `toFen(position)` is **byte-identical** to its value
  before every call, and the two strings are **identical** for every move. This is `ABC-013`'s `A18`
  and `A19` over **black-to-move** positions — black castling, black en passant and black promotion
  make and unmake moves that no `ABC-013` witness ever exercised, because all 18 of its FENs are
  white to move. `ABC-013`'s rows and its `POSITIONS` map are **not** touched (see `## Test notes`
  note 1).
  *(Measured 2026-08-10 at 652: green on the delivered build over all 23 positions, both call forms,
  **0** purity failures and **0** equivalence failures. This criterion is corroboration, not a
  mutant-killer, and it is recorded as such: no mutant in this hop's set turns it red.)*

- **`A6` (no production change, and no existing test row modified).** **Given** the delivered tree,
  **when** this ticket's rows land, **then** `src/san.ts` still hashes
  **`cbcc3be37c21414d16e8e6b4d0c68959`**, **no file under `src/` other than a `*.test.ts` file is
  touched and no existing test row is modified or deleted in any file — the diff is ADDITIONS ONLY**,
  verified at line level with `git diff -U0` and not by inspection; the full suite is green (**652
  before this ticket's rows**, plus them) with a **skip count of 0**; `npm run lint`, `npm run
  typecheck` and `npm run build` exit **0**; and the `PERFT_DEEP=1` lane is **32/32** exact.
  *(The hash is `src/san.ts` on `main`, measured with `md5 -q` at this hop, re-asserted after every
  one of this hop's 13 mutants and against the repository's own copy at the end. **It goes stale the
  moment any ticket changes `src/san.ts`** — that is what happened to `ABC-023` when `ABC-022` merged,
  and the rule is under `## Dependencies`. If any row proves the delivered code wrong, this criterion
  FAILS by design and the defect is cut as its own ticket; the expectation is that none does, since
  every string here was confirmed by an external implementation against a tree that answers all 677
  moves correctly. The deep lane is required for the same reason `ABC-024` requires it — it is the
  check that the rules core is undisturbed — and it is a standing number, not a new bar.)*

## The positions and the strings

All 23 positions and all 63 strings, verified at this hop as described in `## Reproduction 3`. They
are supplied because deriving them is the expensive half of this ticket and it has been done — the
same reason `ABC-013`'s repair supplied its 18 FENs. **They are material, not a bar:** any set that
satisfies `A2`'s census and `A3`'s discriminating requirement is acceptable, and this one is known to.

| id | FEN | rows |
|---|---|---|
| `L-N-W` | `4k3/8/8/1N3N2/8/1N6/8/4K3 w - - 0 1` | b3-d4 `N3d4`, b5-d4 `Nb5d4`, f5-d4 `Nfd4` |
| `L-N-W-X` | `4k3/8/8/1N3N2/3p4/1N6/8/4K3 w - - 0 1` | b3-d4 `N3xd4`, b5-d4 `Nb5xd4`, f5-d4 `Nfxd4` |
| `L-N-B` | `4k3/8/1n6/8/1n3n2/8/8/4K3 b - - 0 1` | b6-d5 `N6d5`, b4-d5 `Nb4d5`, f4-d5 `Nfd5` |
| `L-N-B-X` | `4k3/8/1n6/3P4/1n3n2/8/8/4K3 b - - 0 1` | b6-d5 `N6xd5`, b4-d5 `Nb4xd5`, f4-d5 `Nfxd5` |
| `L-B-W` | `4k3/8/8/4B3/8/2B1B3/8/4K3 w - - 0 1` | c3-d4 `Bcd4`, e3-d4 `Be3d4`, e5-d4 `B5d4` |
| `L-B-W-X` | `4k3/8/8/4B3/3p4/2B1B3/8/4K3 w - - 0 1` | c3-d4 `Bcxd4`, e3-d4 `Be3xd4`, e5-d4 `B5xd4` |
| `L-B-B` | `4k3/8/2b1b3/8/4b3/8/8/4K3 b - - 0 1` | c6-d5 `Bcd5`, e6-d5 `Be6d5`, e4-d5 `B4d5` |
| `L-B-B-X` | `4k3/8/2b1b3/3P4/4b3/8/8/4K3 b - - 0 1` | c6-d5 `Bcxd5`, e6-d5 `Be6xd5`, e4-d5 `B4xd5` |
| `L-R-W` | `4k3/3R4/8/8/R7/8/8/3RK3 w - - 0 1` | d1-d4 `R1d4`, d7-d4 `R7d4`, a4-d4 `Rad4` |
| `L-R-W-X` | `4k3/3R4/8/8/R2p4/8/8/3RK3 w - - 0 1` | d1-d4 `R1xd4`, d7-d4 `R7xd4`, a4-d4 `Raxd4` |
| `L-R-B` | `3rk3/8/8/r7/8/8/3r4/4K3 b - - 0 1` | d8-d5 `R8d5`, d2-d5 `R2d5`, a5-d5 `Rad5` |
| `L-R-B-X` | `3rk3/8/8/r2P4/8/8/3r4/4K3 b - - 0 1` | d8-d5 `R8xd5`, d2-d5 `R2xd5`, a5-d5 `Raxd5` |
| `L-Q-W` | `6k1/8/8/8/4Q2Q/8/8/K6Q w - - 0 1` | e4-e1 `Qee1`, h1-e1 `Q1e1`, h4-e1 `Qh4e1` |
| `L-Q-W-X` | `6k1/8/8/8/4Q2Q/8/8/K3n2Q w - - 0 1` | e4-e1 `Qexe1`, h1-e1 `Q1xe1`, h4-e1 `Qh4xe1` |
| `L-Q-B` | `k6q/8/8/4q2q/8/8/8/6K1 b - - 0 1` | e5-e8 `Qee8`, h8-e8 `Q8e8`, h5-e8 `Qh5e8` |
| `L-Q-B-X` | `k3N2q/8/8/4q2q/8/8/8/6K1 b - - 0 1` | e5-e8 `Qexe8`, h8-e8 `Q8xe8`, h5-e8 `Qh5xe8` |
| `L-BK-CASTLE` | `r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1` | e8-g8 `O-O`, e8-c8 `O-O-O`, h8-f8 `Rf8`, a8-d8 `Rd8` |
| `L-BK-PAWN` | `4k3/8/8/8/8/4p3/3P4/6K1 b - - 0 1` | e3-d2 `exd2`, e3-e2 `e2` |
| `L-BK-EP` | `4k3/8/8/8/3Pp3/8/8/4K3 b - d3 0 1` | e4-d3 `exd3`, e4-e3 `e3` |
| `L-BK-PROMO` | `4k3/8/8/8/8/8/4p3/3R3K b - - 0 1` | e2-d1=Q `exd1=Q+`, e2-e1=Q `e1=Q+`, e2-e1=N `e1=N` |
| `L-BK-CHECK` | `r3k3/8/8/8/8/8/8/4K3 b - - 0 1` | a8-a1 `Ra1+` |
| `L-BK-MATE` | `r5k1/8/8/8/8/8/5PPP/6K1 b - - 0 1` | a8-a1 `Ra1#` |
| `L-BK-STALE` | `k7/8/8/6q1/8/8/8/7K b - - 0 1` | g5-g3 `Qg3`, g5-g2 `Qg2+` |

**How to read the set.** The sixteen `L-<type>-<colour>[-X]` positions are one ladder per
(piece type × colour), each carrying **every rung that piece can require** in a single FEN, and each
paired with a capture variant that is the same arrangement with an enemy piece on the destination —
which is how 44 cells cost 16 positions instead of 44. The three-bishop and three-queen arrangements
are legal by promotion and `chess.js` accepted all 23 FENs without complaint. `L-Q-W` **is**
`ABC-013`'s own `P-QUEENS`, reused rather than re-invented, and its three strings are `A6`'s.
The seven `L-BK-*` positions are the black-side mirror of every colour-sensitive `ABC-013` criterion:
castling (`A3`), pawn capture and push (`A9`), en passant (`A10`), promotion (`A12`), check (`A13`),
mate (`A14`) and stalemate (`A17`) — **none of which has a black witness anywhere in the repository**,
because all 18 acceptance FENs are white to move.

## Dependencies

- **None open.** `ABC-013` is merged on `main` (fast-forward `eb706f9` → `8dd8d22`, 2026-08-10) and
  `src/san.ts` is present at the hash this ticket pins. No ticket is in flight, every working column
  is empty, and no other ticket touches `src/san.ts` or its tests.
- **Any ticket that changes `src/san.ts` invalidates every verdict here until it is re-measured.**
  `A6`'s hash pin, all 13 mutant verdicts, the census and all 63 strings were scored against
  `cbcc3be37c21414d16e8e6b4d0c68959`. `ABC-023` learned this the expensive way when `ABC-022` merged
  after it was cut. The direction is one-way: this ticket adds zero production lines, so nothing here
  can invalidate another ticket.
- **`EPIC-003` is the reason this has a deadline shape rather than a date.** It adds `parseSan` to
  **this same file over these same tables** (`ADR-0004` clause 2), and rows that do not exist before
  that edit cannot protect it. `EPIC-003` is in `Backlog` and not yet decomposed into tickets.
- **`ABC-016` and `ABC-017` consume `toSan`** and became unblocked at `ABC-013`'s merge today. They do
  not modify `src/san.ts`, so they do not invalidate anything here; they are the second half of
  `RISK-ABC013-04`'s trigger and are tracked under `## Size and priority rationale`.

## Security / NFR triggers

**NFR: one trigger, and it is this ticket's own cost.** This ticket adds **no production line**, so
no code path, allocation or branch changes and `NFR-002` (16 ms frame) and `NFR-003` (`moves` under
100 ms) are untouched by it — `ABC-013`'s `N1`–`N4` were re-derived and MET at its Security/NFR gate
and no bar of theirs is re-opened, moved or re-measured here. What this ticket *can* damage is the
inner-loop signal every engineer on this board depends on: the default `npm test` lane, which is
**1.44 s** today and is the reason `ABC-024` refused to put a 36–40 s lane in front of a guard.

| id | bar | measured at this hop |
|---|---|---|
| `N5` | **the tests this ticket adds cost ≤ 5% of the default `npm test` wall clock** — a ratio, so it survives a hardware change, which is `ABC-013`'s `N1` lesson applied | **0.4–1.2%** (6.3 / 7.5 / 16.8 ms over three runs, against 1.44 s for 652 tests on 20 files) |
| `N6` | the `PERFT_DEEP=1` lane stays **32/32 exact** and the skip count stays **0** | standing numbers, carried by `A6` |

`N5` is the primary bar and the only one this ticket can move. **`npm run perft` was NOT run at this
hop** and no throughput figure appears in this ticket — said plainly rather than implied.

**Security: NOT pre-waived, and the threshold is named up front.** `ABC-023` wrote "none,
structural" against an expected 17-row diff and delivered **+749 lines written by two agents**; the
Orchestrator had to over-rule that line. The lesson is applied here as a measurable trigger rather
than a word: **the security half fires if the delivered diff exceeds +900 lines, or touches any file
that is not a `*.test.ts` file under `src/`.** The prediction it is set against is **~+550 lines**
for 23 positions, 63 rows and 6 property/quantifier tests, derived from `ABC-023`'s **measured** +375
for 17 rows and 2 quantifiers. Below the threshold the structural argument holds; above it, the added
lines get read for secrets, spawns, network calls and unbounded loops before the ticket leaves
review. No trigger from the input class itself: `toSan` takes a `Move` from the generator and a
`Position`, no user-supplied string reaches this module, and there is no user surface until
`EPIC-006`.

## Test notes

1. **Do NOT add these positions to `src/san.test.ts`'s `POSITIONS` map.** `ABC-013`'s `A18` and `A19`
   quantify over *"the 18 named positions"* and their tests iterate that map, so widening it silently
   redefines two of `ABC-013`'s criteria and makes this ticket's own `A5` unfalsifiable — the criteria
   would be re-asserting each other. New positions go in a **new table** in a **new `describe`**, and
   `A5` runs its own loop. This is a criteria conflict, not a preference; it is the same mechanical
   rule `ABC-024` note 8 states for `ABC-023`'s tables.
2. **Write `A1` as a SEARCH over the ladder, not as a second copy of the flags.** *"The shortest
   qualifier for which exactly one legal move of this piece byte reaches this square"* encodes the
   qualifier's purpose; `sharesFile`/`sharesRank` encodes its procedure. The second form would agree
   with the code by construction and could not falsify it. This is the difference that made
   `ABC-013`'s QE hop's second oracle worth writing.
3. **Read the qualifier back OUT of the emitted string** for `A1` — strip a trailing `+`/`#`, drop
   the piece letter, drop the two-character destination and a preceding `x` — rather than asking the
   module for it. `toSan` exports one function and nothing else, and `A20` requires that it stay that
   way; nothing in this ticket may widen `src/san.ts`'s surface to make a test easier.
4. **`A2` is the criterion that keeps `A1` honest, and it is the one to write first.** A property over
   a corpus with no qualified bishop is green on a build that mis-qualifies every bishop. Measured:
   that is exactly what happens today for `Q34` and `Q38`.
5. **Assert the setup before the outcome.** Each row should assert its `(from, to, promotion)` triple
   names **exactly one** legal move before reading any string — `ABC-013`'s `moveFor` helper already
   does this, and it is `ABC-009`'s `expectImpostorSetup` lesson, which has caught two lying labels on
   this board.
6. **Do not compute an expected string with the disambiguation logic under test.** `ABC-013`'s
   standing rule, and the reason `A3` and `A1` are separate criteria rather than one.
7. **One OS process per tree state** in any mutation run, and typecheck every mutant. Node's module
   cache served a pristine `moves.ts` to four tree states in one process on `ABC-009` and produced a
   false *"the harm does not reproduce"*; a tree that does not build is a broken build, never a
   survivor.
8. **Verify the four equivalent controls stay alive.** `Q22`, `Q24`, `Q29` and `Q40` are behaviour-
   equivalent to the delivered build; a new row that kills one of them is pinning implementation shape
   rather than behaviour and must be rewritten, not celebrated.
9. **The external oracle is reproducible and is not in the repository.** `npm install chess.js@1.4.0`
   in a scratchpad outside the repo, compare `game.moves({ verbose: true })[i].san`. `package.json`
   and `package-lock.json` must come back byte-identical — checked at this hop, and it is `AGENTS.md`
   § Safety rules.

## Size and priority rationale

**Size `M` (3 points).** Measured content: **23 positions** and **63 hand-typed strings** (all
supplied and externally confirmed above), plus **six** property/quantifier tests — `A1`, `A2`
(both directions), `A4`, `A5` (two loops) — with **zero production lines** expected, in one test
file. It is calibrated directly against this board's own history: `ABC-023` was `S` at 17 rows and 19
tests and `ABC-024` is `S` at 16 rows and 18 tests, which is roughly a quarter of the table here;
`ABC-013` was `M` at 18 positions and 52 strings **plus** a 148-line module. This ticket has more
table than `ABC-013` and no module.

**`S` was considered and rejected on the row count.** The argument for `S` is that every position and
every string is supplied verified, so the build is transcription plus six properties — real, and it is
why this is not `L`. The argument against is that 63 rows is four times either `S` precedent, and
rounding a measured table down to fit a precedent is how a ticket hides work. **`M` is the honest
call and it is deliberately not rounded down.**

**The one thing that would make it `L`, named so nobody does it:** hand-typing a string for **every**
cell of the 44-cell grid (132 rows: three rungs × four types × two colours × two capture states, both
call forms) instead of letting `A1` cover the grid and `A3` cover what `A1` cannot see. If that is
ever wanted, split it; do not grow this ticket into it.

**Priority `P2`.** It is **not** `P1`: nothing is wrong in the delivered code — six wrong builds exist
only as mutants in a scratchpad — no user is affected, and there is no user surface at all until
`EPIC-006`. This board's `P1` is for real defects and for the owner's legality-first directive, and a
hole in a test net is neither. It is **not** `P3`: every one of the six wrong builds is an ordinary
build a competent engineer could write (`Ra1b1` for `Rab1` is the shape of a real bug, not a
contrivance), and the file they live in is the file `EPIC-003` opens next.

**Escalation triggers, stated so they can actually fire — and BOTH checked at the source, not
assumed:**

1. **Promote to `P1` the moment any ticket that proposes to edit `src/san.ts` enters `Ready`** —
   which in practice means `EPIC-003`'s `parseSan` ticket, since `ADR-0004` clause 2 puts it in this
   file. At that moment these rows stop being hardening and become the only thing between an edit to
   `disambiguator` and a silently non-standard move list. **NOT FIRED at 2026-08-10**, checked at the
   source: `EPIC-003` sits in `Backlog` and is not decomposed into tickets; every working column of
   `plans/board.md` is empty.
2. **Promote to `P1` when `ABC-016` or `ABC-017` enters `Ready`** — `RISK-ABC013-04`'s own stated
   trigger is *"before `ABC-016`/`ABC-017` consume `toSan`"*. **NOT FIRED at 2026-08-10, and closer
   than it looks:** both sit in `Backlog`, but their `blocked-until` lists (`ABC-013`, `ABC-014`,
   `ABC-020`) became **fully satisfied today** when `ABC-013` merged, so either can be pulled at the
   next refinement pass. This ticket should be scheduled ahead of both.

Saying "not fired" plainly matters: a trigger treated as fired when it has not is a trigger nobody
trusts again.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-10**. **Result: 10 of 10 clean — the Definition of Ready IS met and this ticket moves
`Backlog` → `Ready`.** Every row below is a claim about this file that the Orchestrator can re-check
against it; the two rows that carry a caveat carry it in the open rather than as a hedge.

- **problem clear — user, pain, value stated** ✅ — `## Problem` names the user (`EPIC-003`'s
  `parseSan` hop, `ABC-016`/`ABC-017`, and behind them the player), the pain as a measured count (six
  wrong builds pass 652/652), and the value as the seam three epics share.
- **scope and out-of-scope clear** ✅ — `## Scope` is three observable requirements; `## Out of scope`
  draws eight fences, each with its owner, including the two most tempting adjacent jobs (the
  round-trip identity, which is `EPIC-003`'s; the shape property, refused **on a measurement**).
- **INVEST-shaped** ✅ — **independent** (nothing is in flight, every working column is empty, no
  ticket touches `src/san.ts` or its tests, `ABC-013` is merged), **negotiable** (the negotiation is
  over which positions fill the census; the census itself is the requirement), **valuable**,
  **estimable** (23 positions and 63 strings measured at this hop, not guessed), **small** (`M`,
  below `ABC-013`), **testable** (each criterion names the mutants that must die and the controls
  that must live).
- **acceptance criteria clear, testable and measurable** ✅ — six Given/When/Then criteria, each with
  exact counts, exact FENs, named discriminating mutants and named controls; every parenthetical
  names the suite size it was measured against (**652 on 20 files**). No criterion says "works" or
  "is hardened". **One caveat stated in the criterion itself rather than here:** `A2` cannot be
  witnessed by a wrong build — no mutation of `src/san.ts` can turn a census of the legal move list
  red — so its discriminating requirement is a narrowed corpus, with the numbers (5 of 44, 9 of 44,
  44 of 44) that make it falsifiable. `A5` is corroboration rather than a mutant-killer and says so.
- **dependencies known** ✅ — **none open**, stated with what was checked; plus the one-way
  re-measurement rule for any `src/san.ts` change, and `EPIC-003` named as the deadline shape.
- **security/NFR triggers marked, each with a measurable target** ✅ — NFR `N5` is a **ratio** bar
  (≤ 5% of the default lane, measured 0.4–1.2%) chosen so it survives a hardware change, plus `N6`
  carrying the two standing numbers; security **not pre-waived**, firing at **+900 lines or any
  non-test file**, set against a measured prediction of ~+550.
- **test notes present** ✅ — nine, of which four are lessons this board has already paid for
  (`ABC-009`'s module cache and setup assertions, `ABC-013`'s generated-expectation rule,
  `ABC-024`'s table-conflict rule) and one is this hop's own (note 1: widening `POSITIONS` would make
  `A5` unfalsifiable).
- **size assigned** ✅ — `M` (3), calibrated against three tickets on this board, with `S` considered
  and **rejected on the measured row count** and the condition that would make it `L` named.
- **priority assigned** ✅ — `P2`, with two escalation triggers, both checked at the source and both
  explicitly **not fired**, one of them recorded as newly reachable today.
- **no major unresolved blocker** ✅ — nothing is open, nothing is waiting on a decision, and no
  question in this ticket is left to the implementer's judgment.

**Promoted to `Ready` on 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-025`, subtask
`ticket-to-pr-ABC-025-bapm`, Workflow 07). `Ready` moves 0/8 → 1/8; no WIP limit is approached.

**What this ticket's figures do and do not mean.** They mean six wrong builds of `toSan` passed 652
of 652 tests on 2026-08-10 against `cbcc3be37c21414d16e8e6b4d0c68959`, and that the six die on the
criteria above. They do **not** mean six is the complete set: this hop's mutants were chosen by
reading `ABC-013`'s criteria and QE's five, so a defect class nobody has asked about would not appear
here — the honest prior, after `ABC-023`'s QE hop found fourteen where the ticket predicted two, is
that more exist. They do **not** establish conformance to the PGN specification text: `chess.js` is a
widely-used implementation, not the standard, and where it and this repository could both be wrong in
the same way this check is blind. And **this ticket goes stale the moment `src/san.ts` changes**: if
that happens before it is built, all thirteen mutant verdicts, the census and the `A6` hash must be
re-measured.
