---
id: ABC-023
title: castling precondition net — the destination square, the joint occupant pair, and doubling that varies one axis
status: ready-for-uat
column: Ready for UAT
size: S
priority: P2
epic: EPIC-001
feature: —
---

# ABC-023 — castling precondition net: the destination square, the joint occupant pair, and doubling that varies one axis

> **Cut 2026-08-09 by BA/PM** (task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-a13-verify`,
> Workflow 07), at `ABC-009`'s last verification hop and before `ABC-009` closes — so that three
> measured items stop living only in context notes.
>
> **RE-MEASURED 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-023`, subtask `ticket-to-pr-ABC-023-bapm`,
> Workflow 07) at the `Backlog → Ready` exit. `ABC-022` merged **after** this ticket was cut and
> changed `src/moves.ts`, so every figure below was scored against a tree and a suite that no longer
> exist. **All sixteen mutant verdicts were re-run** — none inherited — and each now carries the suite
> size it was measured against, because the absence of that suite size is what let this ticket rot
> silently.
>
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered code is CORRECT on every item
> below** — `src/moves.ts` at md5 `6335b452fc21ffe2d0f902ecab930840` answers every position in this
> ticket the way the rules require, and each item was measured on that tree. What is missing is
> **test net**, not behaviour. **The expected production diff is zero lines**, exactly as `A11`'s and
> `A13`'s were on `ABC-009`.
>
> **Every figure in this ticket was produced by BA/PM's own instruments** — at the cutting hop
> (2026-08-09, tree `0e247853ab2c05887c76105ff83d8621`, suite 381 on 16 files) and again at the
> re-measurement hop (2026-08-10, tree `6335b452fc21ffe2d0f902ecab930840`, suite **559 on 18 files**,
> skip **0**, lint/typecheck **0**, `PERFT_DEEP=1` **32/32**). Mutants applied to a copy of `src/`
> held **outside** the repository with `node_modules` symlinked, each asserting its anchor unique and
> its bytes changed, each typechecked so a broken build can never be scored a survivor, **one fresh OS
> process per tree state**, and `src/moves.ts` restored and re-hashed after every mutant. **No file
> under `src/` in the repository was modified and no test row was written at either hop.** The
> re-measurement ran **34 mutants — 0 broken builds, 0 harness errors, 0 verdict mismatches against
> the cutting hop.** Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64; the numbers
> here are integer test counts and are machine-independent.

## Problem

*User*: the same downstream consumers `ABC-009` names — the renderer (`EPIC-002`), the input layer
(`EPIC-003`), the search (`EPIC-004`), the session (`EPIC-006`) — plus the next engineer to touch
`addCastlingMoves`, who is the user this ticket actually protects.

*Pain*: `ABC-009` closed the castling preconditions over one dimension at a time and ended by
**counting** the last one (`A13`: a home square holds one byte, `parseFen` writes 13 values, 12 are
wrong, all 12 accounted). That argument is sound and it is **about the occupant byte only**. Three
regions sit outside it, and in each of them a wrong build passes the entire **559-test suite on 18
files** (re-measured 2026-08-10; it was 381 on 16 files when this ticket was cut, and every verdict
below was re-run at 559):

1. **The castle's DESTINATION square is not pinned by anything.** Dropping `kingTo` from an option's
   `kingPath` — so a castle whose landing square is attacked is still offered — survives the full
   suite **and** the standing `PERFT_DEEP=1` 32/32 lane, on **all four options: both colours and
   both sides** (the two black options were `UNKNOWN - verify` at cutting and were measured
   2026-08-10). **This is the only class found across `ABC-009`'s six hops whose position is LEGALLY
   REACHABLE**; every other one needs a semantically-invalid FEN.
2. **The joint occupant PAIR is untested.** Every row on `ABC-009` holds one home square wrong and
   the other one right, on purpose, so that exactly one guard can be the reason. A build that admits
   the castle only when **both** squares hold a specific wrong byte therefore survives 559/559.
3. **The doubling standard varies ONE axis per type, not both.** `A11` and `A13` require each piece
   type in at least two configurations. For 9 of the 13 type/table pairs those two configurations
   differ on only one of (colour to move, castling side), so an admission conditional on the **other**
   axis is never exercised and survives.

*Value*: `EPIC-004` will rewrite this hot path (pin-aware / incremental generation, the audit's
`RF-2`), and `ABC-009`'s own `A7` note is the standing lesson — **a green signal was read as
protection without anyone asking what it could fail on**, twice on this board (the 100% coverage
number in `ABC-009`'s `## Problem`, and `A7` itself). These three holes are the same shape: today's
green says nothing about them. Closing them costs test rows and no production risk.

## Source

`ABC-009`, task `ticket-to-pr-ABC-009`. Three items were routed here by name rather than fixed there,
under the stopping rule the Orchestrator recorded (*"if that verification finds anything new, it is
named and routed to the follow-up ticket, not fixed inside `ABC-009`"*):

- `A13`'s own *"What `A13` does NOT claim"* regions **(ii)** the joint 13×13 pair space and **(iii)**
  the constants no criterion on that ticket varies — both named by BA/PM at the fourth hop.
- QE's third-hop residual — a side-conditional single-type admission survives, **measured on `A11`'s
  own rows too**, so it is inherited from the doubling standard rather than introduced by `A13`.
- The destination-square hole and the colour-axis half of the doubling gap — measured by BA/PM at the
  fifth hop while sizing this ticket, named there and routed here.

**`ABC-009` is not reopened by any of this.** `A1`–`A13` are green and their verdicts stand; every
item here is outside their stated dimensions.

## Reproduction (re-measured 2026-08-10 by BA/PM on the delivered tree, `6335b452fc21ffe2d0f902ecab930840`, suite 559/559 on 18 files)

**1 — the DESTINATION square. Each of the three `kingPath` squares dropped in turn, on all four
options.** The `at cut` column is the 2026-08-09 verdict against the 381-test suite, kept so the two
hops can be compared rather than silently overwritten:

```
mutant                              verdict   suite @559   at cut @381   killed by
WK kingPath drops e1 (ORIGIN)       KILLED    557/559      379/381       moves.test.ts, perft.test.ts
WK kingPath drops f1 (CROSSED)      KILLED    556/559      378/381       moves.test.ts, perft.test.ts
WK kingPath drops g1 (DESTINATION)  SURVIVED  559/559      381/381       nothing — PERFT_DEEP=1 32/32 EXACT
WQ kingPath drops e1 (ORIGIN)       KILLED    558/559      380/381       moves.test.ts
WQ kingPath drops d1 (CROSSED)      KILLED    557/559      379/381       perft.test.ts
WQ kingPath drops c1 (DESTINATION)  SURVIVED  559/559      381/381       nothing — PERFT_DEEP=1 32/32 EXACT
BK kingPath drops g8 (DESTINATION)  SURVIVED  559/559      not measured  nothing — PERFT_DEEP=1 32/32 EXACT
BQ kingPath drops c8 (DESTINATION)  SURVIVED  559/559      not measured  nothing — PERFT_DEEP=1 32/32 EXACT

witness, one fresh process per tree state, the FEN printed and RE-PARSED on every line
(round-trip through toFen asserted identical to the input on all eight):
delivered  4k1r1/8/8/8/8/8/8/4K2R w K - 0 1  gen []      legal []  14 moves   (g1 attacked from g8)
mutant     4k1r1/8/8/8/8/8/8/4K2R w K - 0 1  gen [e1g1]  legal []  14 moves
delivered  2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1  gen []      legal []  15 moves   (c1 attacked from c8)
mutant     2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1  gen [e1c1]  legal []  15 moves
delivered  4k2r/8/8/8/8/8/8/4K1R1 b k - 0 1  gen []      legal []  14 moves   (g8 attacked from g1)
mutant     4k2r/8/8/8/8/8/8/4K1R1 b k - 0 1  gen [e8g8]  legal []  14 moves
delivered  r3k3/8/8/8/8/8/8/2R1K3 b q - 0 1  gen []      legal []  15 moves   (c8 attacked from c1)
mutant     r3k3/8/8/8/8/8/8/2R1K3 b q - 0 1  gen [e8c8]  legal []  15 moves
```

**Why nothing catches it, which is the whole point:** `legalMoves` filters any move that leaves the
mover's king in check, and a castle landing on an attacked square is exactly that — so the outer
layer removes it and **every count-based oracle, perft included, is blind**. The origin and the
crossed square are *not* masked that way, which is why those four mutants die. What breaks is the
**exported `generateMoves`** and its own documented invariant (`src/moves.ts:306-308`: *"a castle
never appears when the king would start, cross, or land in check"*). `ABC-009`'s `## Scope` already
rules that *"offered"* means offered by `generateMoves` **and** by `legalMoves`; this is that rule
with no test behind it.

**The `UNKNOWN - verify` on the black options is CLOSED.** At cutting only the two white options were
mutated. Both black options were mutated 2026-08-10 and behave identically — the same construction in
`BLACK_CASTLES`, the same survival, the same clean deep lane. `A2` still requires rows for both
colours; it now does so because all four mutants are **measured** survivors, not because two of them
were unknown.

**2 — the joint occupant PAIR:**

```
mutant                                                         verdict   suite @559  at cut @381
admits the castle when BOTH home squares hold an enemy KNIGHT  SURVIVED  559/559     381/381
admits the castle when BOTH home squares hold an own QUEEN     SURVIVED  559/559     381/381
the same enemy-KNIGHT pair, additionally conditional on the
  castling SIDE (queenside only)                               SURVIVED  559/559     not measured

witness, one fresh process per tree state, FEN printed and re-parsed:
delivered  4k3/8/8/8/8/8/8/K3n2n w K - 0 1  gen []      legal []      3 moves  PURE
mutant     4k3/8/8/8/8/8/8/K3n2n w K - 0 1  gen [e1g1]  legal [e1g1]  4 moves
           -> after ONE legalMoves call the position is 4k3/8/8/8/8/8/8/K3K2n w K - 0 1: the BLACK
              knight on e1 destroyed, a SECOND WHITE KING written over it — material loss, a
              piece-type change AND a colour change (re-measured 2026-08-10, byte-for-byte)
delivered  4k3/8/8/8/8/8/8/K3Q2Q w K - 0 1  gen []      legal []     38 moves  PURE
mutant     4k3/8/8/8/8/8/8/K3Q2Q w K - 0 1  gen [e1g1]  legal [e1g1] 39 moves
           -> residue 4k3/8/8/8/8/8/8/K3K2Q w K - 0 1
```

**The third row is why `A1`'s rows must vary the castling side too.** A pair admission that ALSO keys
on the side is still "admits only when a specific pair co-occurs", and it survives the suite exactly
as the plain pair mutant does — so a four-row set that varies only the colour to move would be blind
to it in precisely the way `## Reproduction` 3 below describes. `A1` carries that requirement at no
extra row cost.

For the **delivered** code the joint space adds nothing — `src/moves.ts:326-327` are two
**independent** byte compares, so per-square correctness implies joint correctness by construction.
That argument is exactly what a pair-conditional mutant does not respect, and the two mutants above
are the measurement that turns *"could still survive a finite net"* into *"does"*.

**3 — the doubling varies one axis. Re-derived 2026-08-10 by parsing the four tables out of
`src/moves.castling.hardening.test.ts` and reading each row's side-to-move and castling-rights field
mechanically — no cell below was read by eye. 30 rows, 13 type/table pairs, 9 gapped:**

```
table                     type    rights  movers  sides varied         gap
IMPOSTOR_ON_KING_SQUARE   QUEEN   KQkq    wb      king+queen           none
                          ROOK    Kk      wb      kingside only        COLOUR-only doubling
                          BISHOP  Kk      wb      kingside only        COLOUR-only doubling
                          KNIGHT  KQ      w       king+queen           SIDE-only doubling
                          PAWN    Kq      wb      king+queen           none
IMPOSTOR_ON_ROOK_SQUARE   QUEEN   KQkq    wb      king+queen           none
                          BISHOP  Kk      wb      kingside only        COLOUR-only doubling
                          KNIGHT  KQ      w       king+queen           SIDE-only doubling
                          PAWN    Kq      wb      king+queen           none
ENEMY_ON_KING_SQUARE      KNIGHT  Kk      wb      kingside only        COLOUR-only doubling
                          PAWN    Qq      wb      queenside only       COLOUR-only doubling
ENEMY_ON_ROOK_SQUARE      KNIGHT  Kk      wb      kingside only        COLOUR-only doubling
                          PAWN    Qq      wb      queenside only       COLOUR-only doubling
                                          9 of 13 type/table pairs vary ONE axis

single-type admission made conditional on the axis its rows do NOT vary:
                                                               verdict   suite @559  at cut @381
king's sq admits enemy KNIGHT only QUEENSIDE                   SURVIVED  559/559     381/381
rook's sq admits enemy PAWN only KINGSIDE                      SURVIVED  559/559     381/381
king's sq admits own ROOK only QUEENSIDE     (A11's own rows)  SURVIVED  559/559     381/381
king's sq admits own BISHOP only QUEENSIDE   (A11's own rows)  SURVIVED  559/559     381/381
king's sq admits own KNIGHT only when BLACK  (A11's own rows)  SURVIVED  559/559     381/381
rook's sq admits own KNIGHT only when BLACK  (A11's own rows)  SURVIVED  559/559     381/381

the control, and it is what proves the added configurations are what kill these:
rook's sq admits own QUEEN only KINGSIDE   (rows carry KQkq)   KILLED    557/559     379/381
king's sq admits own ROOK only when BLACK  (rows carry K, k)   KILLED    558/559     380/381
   both controls die inside moves.castling.hardening.test.ts, 2 and 1 rows respectively —
   the same failure counts as at cutting, so only the suite size moved
```

**The gap is symmetric and that is the part nobody had stated:** a type whose two configurations vary
only COLOUR is blind to a SIDE-conditional admission (QE's residual), and a type whose two vary only
SIDE is blind to a COLOUR-conditional one. **One added configuration per gapped pair closes both
axes** — nine rows. **This is inherited from the doubling standard, not introduced by `A13`**: it is
measured live on `A11`'s own rows, and neither criterion is in shortfall, because both require ≥ 2
configurations per type and both have that.

## Scope

`src/moves.castling.hardening.test.ts` — the existing table-driven hardening file — gains rows and
quantifier tests so that each of the three classes above **fails at least one row**. Concretely:

- The castle's **destination** square is pinned **at the `generateMoves` layer**, both options, both
  colours.
- At least one row per class holds **both** home squares wrong **at once**, with the occupant byte
  asserted on **both**.
- Every type in every table appears in configurations that vary **both** colour to move **and**
  castling side.

**No production change is expected.** If a row proves the delivered code wrong, that is a defect and
gets its own ticket rather than being folded in here — say so out loud rather than quietly editing
`src/moves.ts` under a hardening ticket.

## Out of scope

- **`ABC-009`'s criteria `A1`–`A13`.** Not reopened, not re-measured, no verdict changed. Its
  `A11`/`A13` tables are extended by `A3` below; their existing rows, counts and verdicts are not
  edited.
- **The 243 byte values a `Uint8Array` square can hold that `parseFen` never writes** (`7`, `8`, `15`
  and everything `≥ 16`) — `A13` region (i). No FEN produces them, so no `Given` clause can reach
  them and a criterion over them would be unfalsifiable. Named here so the omission stays deliberate.
- **An enumeration of the 169-combination joint pair space.** `A1` pins the **class**, with a bounded
  row count. Enumerating the space would make this ticket `L` and it would buy nothing the class
  does not — see `## Size and priority rationale`.
- **`ABC-022`'s en-passant route** — a different function (`addPawnMoves`), its own ticket, **merged
  to `main` 2026-08-09**, and no line of it is touched here. Its merge is the reason this ticket's
  evidence was re-measured; that is a re-pin of this ticket's own figures, not a reopening of that
  one. See `## Dependencies`.
- **`ABC-010`'s FEN semantic validation.** Several positions in this ticket are
  grammatical-but-invalid; making them unparseable is `ABC-010`'s question, not this one's.
- **`EPIC-004`'s pin-aware / incremental generation** (the audit's `RF-2`) and any performance work.
  This ticket adds no production line and therefore has no throughput question.
- **Coverage as a criterion.** `ABC-009`'s `## Problem` is the standing reason: `src/legal.ts` shipped
  this project's worst defect at 100% statement/branch/function coverage.

## Acceptance (Given/When/Then)

Every *(Measured …)* parenthetical below is the behaviour of the **delivered** tree at
`6335b452fc21ffe2d0f902ecab930840` against the **559-test suite on 18 files**, and is evidence, not a
target. **Every parenthetical names the suite size it was measured against** — a figure without one
is what let this ticket go stale between `ABC-022`'s merge and this hop. **Each criterion names the
mutant that must die**, because on this ticket "the rows exist" is not the requirement — "a wrong
build fails" is.

- **`A1` (the joint occupant PAIR — both home squares wrong at once).** **Given** a castling option
  whose right is held and **both** its home squares holding a wrong byte **simultaneously**, **when**
  `generateMoves` runs **and when** `legalMoves` runs, **then** the `FLAG_CASTLE` count is **exactly
  0** in **both**, the `legalMoves` count is exact, and the position is byte-identical across the call
  over all 128 board bytes and all five scalars. **At least four rows** — an enemy/enemy pair and an
  own/own pair, **two rows each**: within a family the two rows differ in **both** the colour to move
  **and** the castling side, so the four rows together cover both colours and both sides while
  staying at four. **This is `A3`'s doubling standard applied to `A1`'s own rows, and it adds no
  row** — the requirement is that neither axis is held constant within a family, not that every
  combination is enumerated (the enumeration is the `L` trap named under `## Size and priority
  rationale`). Each row asserts the occupant byte (type **and** colour) on **both** squares and is
  asserted non-inert. **The
  discriminating requirement:** a build that admits the castle **only** when a specific pair
  co-occurs must fail at least one row, **including one whose admission is additionally conditional
  on the castling side**.
  *(Measured 2026-08-10 at 559: `4k3/8/8/8/8/8/8/K3n2n w K - 0 1` returns **3** moves, 0 castles,
  pure, and `4k3/8/8/8/8/8/8/K3Q2Q w K - 0 1` returns **38**, 0 castles, pure; the enemy-KNIGHT pair
  mutant, the own-QUEEN pair mutant **and the queenside-only enemy-KNIGHT pair mutant** each survive
  **559/559**, and the first leaves `4k3/8/8/8/8/8/8/K3K2n w K - 0 1` on one `legalMoves` call. The
  side-conditional survivor is why the four rows must cover both sides; it costs no extra row.)*

- **`A2` (the castle's DESTINATION square, pinned at the `generateMoves` layer).** **Given** a
  position in which the castle's **landing** square is attacked while its origin and crossed squares
  are **not**, **when** `generateMoves` runs, **then** the `FLAG_CASTLE` count is **exactly 0** — and
  the assertion must be made **on `generateMoves`**, because `legalMoves` refuses the move for a
  different reason and cannot witness this. **Four rows: both castling sides × both colours to move**,
  each asserting (a) the landing square **is** attacked and (b) the origin and crossed squares are
  **not**, through `isSquareAttackedBy` **polarity-checked before its verdicts are read**. **The
  discriminating requirement:** dropping the landing square from an option's `kingPath` must fail at
  least one row.
  *(Measured 2026-08-10 at 559, all four options: `4k1r1/8/8/8/8/8/8/4K2R w K - 0 1` → `generateMoves`
  0 castles, `legalMoves` 0 castles, **14** moves; `2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1` → 0 castles,
  **15** moves; `4k2r/8/8/8/8/8/8/4K1R1 b k - 0 1` → 0 castles, **14** moves;
  `r3k3/8/8/8/8/8/8/2R1K3 b q - 0 1` → 0 castles, **15** moves. **All four** destination mutants
  survive the full suite **559/559** and the `PERFT_DEEP=1` lane **32/32** — the two black ones were
  `UNKNOWN - verify` at cutting and are now measured, so this criterion's four rows rest on four
  measured survivors rather than on two measured and two assumed.)*

- **`A3` (the doubling varies BOTH axes).** **Given** each of the four impostor tables in
  `src/moves.castling.hardening.test.ts`, **when** the rows of each piece type are read, **then**
  every type appears in configurations that vary **both** the colour to move **and** the castling
  side — asserted as a **test over the tables**, in the shape `A11` and `A13` already use, so a future
  row that re-narrows a type goes red. **The discriminating requirement:** an admission of a **single
  type** made conditional on colour, or on side, must fail at least one row — on **both** the `A11`
  and the `A13` tables.
  *(Re-derived 2026-08-10 by parsing the tables mechanically: **30 rows, 13 type/table pairs, 9 of 13
  vary one axis only** — unchanged from cutting — and one added configuration per gapped pair
  — **nine rows** — closes both. Six such single-type conditional mutants survive **559/559** and two
  die (**557/559** and **558/559**); the two that die are exactly the types whose rows already vary
  the axis in question, which is what makes this criterion falsifiable rather than decorative.)*

- **`A4` (no production change, and no existing test row modified).** **Given** the delivered tree,
  **when** this ticket's rows land, **then** `src/moves.ts` still hashes
  **`6335b452fc21ffe2d0f902ecab930840`**, **no existing test row is modified or deleted in any file
  — the diff to `src/moves.castling.hardening.test.ts` is ADDITIONS ONLY and no other test file is
  touched at all** — verified at line level, not by inspection — the full suite is green (**559
  before this ticket's rows**, plus them) with a **skip count of 0**, and the `PERFT_DEEP=1` lane is
  **32/32** exact. *(The hash is `src/moves.ts` on `main`, re-measured 2026-08-10 with `md5 -q`.
  `ABC-022` landed two guard conditions and a local const in `addPawnMoves` in that file after this
  ticket was cut, which is why the pin moved from `0e247853ab2c05887c76105ff83d8621`; as written with
  the old pin this criterion was unsatisfiable by any correct implementation. The additions-only
  clause replaces "no existing test file is modified", which contradicted this ticket's own
  `## Scope` — the scope says that file GAINS rows, so the old wording could not be met either.
  If any row proves the delivered code wrong, this criterion FAILS by design and the defect is cut as
  its own ticket. The expectation is that none does: all three classes were re-measured 2026-08-10
  against a tree that answers every one of them correctly.)*

- **`A5` (the added rows are load-bearing, proved by mutation and not by count).** **Given** the rows
  from `A1`–`A3`, **when** each criterion's named discriminating mutant is run against the suite,
  **then** each **dies**, and **when** the **fifteen** behaviour-equivalent controls `ABC-009`
  established are run — **all fifteen named, because the earlier wording enumerated only thirteen
  while requiring fifteen**:

  1. the enemy `KING` admission on the king's square; 2. enemy `QUEEN` on the king's square;
  3. enemy `ROOK` on the king's square; 4. enemy `KING` on the rook's square; 5. enemy `QUEEN` on
  the rook's square; 6. enemy `ROOK` on the rook's square; 7. colour-blind on the king's square;
  8. colour-blind on the rook's square; **9. colour-blind on BOTH squares**; 10. the king guard's
  `continue` → `break`; 11. the king guard's `continue` → `return`; 12. both guards below the
  emptiness test; 13. both guards below the through-check test; 14. both guards above the right
  test; **15. an extra "rook square non-`EMPTY`" condition**

  — **then all fifteen still SURVIVE**, killed count **zero**. *(That second half is the half that
  matters: a row killing an equivalent mutant pins implementation shape instead of behaviour.
  `ABC-009` measured fifteen survivors at 381/381; **all fifteen were re-run 2026-08-10 and all
  fifteen still survive at 559/559, killed count zero** — so the bar this criterion sets is a
  measured starting state on today's tree, not an inherited one. Items 9 and 15 are the two the
  earlier enumeration omitted; they are named in `ABC-009`'s own mutation record and are restored
  here rather than dropped to make the count fit.)*

## Dependencies

- **`ABC-009` must be merged first — SATISFIED 2026-08-09** (fast-forward `aad6d48` → `5ee84e8`). Its
  branch delivers both files this ticket edits (`src/moves.castling.hardening.test.ts` and
  `src/moves.castling.test.ts`); both are on `main`, with the four impostor tables and the
  `expectImpostorSetup` helper present and green. This was a true ordering dependency, not a
  preference, and it is now discharged.
- **`ABC-022` was NOT independent of this ticket, and "either order works" was wrong.** The original
  wording grouped `ABC-022` with `ABC-010` and `ABC-011` as *"different modules or different
  branches, and either order works"*. `ABC-022` merged to `main` on 2026-08-09 **after** this ticket
  was cut, and it changed `src/moves.ts` (two guard conditions and a local const in `addPawnMoves`) —
  which invalidated `A4`'s hash pin and re-scoped every mutant verdict here from a 381-test suite to
  a 559-test one. The direction of the dependency is one-way: a change to `src/moves.ts` from **any**
  ticket invalidates this ticket's acceptance until it is re-measured, while nothing here can affect
  that ticket, because this one adds zero production lines. **Any future ticket that touches
  `src/moves.ts` before this one is built re-triggers that same re-measurement.**
- **Independent of `ABC-010` and `ABC-011`** — different modules, and either order works. That claim
  is unchanged and is not extended to any ticket that edits `src/moves.ts`.
- **`EPIC-004` is the reason this has a deadline shape rather than a date**: it rewrites the castling
  hot path, and rows that do not exist before that rewrite cannot protect it.

## Security / NFR triggers

**None, and the reason is structural rather than a judgement.** This ticket adds **no production
line**, so it changes no code path, no allocation and no branch in the search's inner loop —
`NFR-001`'s count-based discharge on `ABC-009` (the two added byte compares execute 198,175 times each
over the perft population and reject nothing) is untouched by a test-only change. `NFR-005` is not
triggered for the same reason. That `198,175` count is **cited from `ABC-009` and was re-derived by
neither hop here.** **No throughput figure appears in this ticket and `npm run perft` was run by
NEITHER hop** — not by the role that wrote it, not by the role that re-measured it. The standing bars
still apply through `A4` and both were re-measured on the delivered tree 2026-08-10: deep perft
**32/32** exact, skip count **0**. No security trigger — this is reliability, not security, and the input class
is unreachable from any user surface today (there is no CLI entry point until `EPIC-006`).

## Test notes

1. **Assert the setup before the outcome.** Every row asserts the occupant byte on the square under
   test in **type and colour**, the other precondition, and exactly the one right — `ABC-009`'s
   `expectImpostorSetup`, which has already caught two lying labels. On `A1`'s rows that assertion is
   owed on **both** squares.
2. **Assert non-inertness.** A row whose castle is refused by the emptiness or through-check test
   proves nothing about the guard under test. `A2` inverts this deliberately — its rows require the
   through-check test to be the mechanism, on the **landing** square specifically.
3. **Polarity-check `isSquareAttackedBy` before reading its verdicts** (`ABC-009`'s standing rule: a
   predicate that answers one way for everything fabricates a clean table either way).
4. **One OS process per tree state** in any mutation run. Node's module cache served a pristine
   `moves.ts` to four tree states in one process on `ABC-009` and produced a false *"the harm does not
   reproduce"*.
5. **Verify the instrument before believing a red.** Three controls on `ABC-009` did not compile under
   `noUncheckedIndexedAccess` and were correctly scored `BROKEN-BUILD` rather than read as dead
   controls; a non-compiling control there also produced 147 failures nearly read as *"the rows
   over-fit"*.
6. **Design the trap out rather than remembering it.** The 11-vs-13 probe trap caught two roles on
   `ABC-009` and was then made structurally impossible (king parking varied per attempt, the FEN
   printed for every witness). Any probe this ticket writes is held to that standard.
7. **Print the input, not the verdict.** Every measurement in this ticket prints the FEN it used.

## Size and priority rationale

**Size `S` (2 points), and it is the top of `S` — re-checked 2026-08-10 and UNCHANGED.** Measured
content: **4** rows for `A1`, **4** for `A2`, **9** for `A3`, plus **two** quantifier tests over the
tables — **17 rows and 19 tests**, all in **one existing table-driven file**, with **zero production
lines** expected. The `A3` figure is the one that could have moved the size, and it did not: the
gapped-pair count was re-derived mechanically from the live tables at this hop and is still **9 of
13**, so the nine rows still close both axes. `A1`'s new both-sides requirement is satisfied inside
its existing four rows and adds none. It is `S` on this
board's own calibration because there is **no new module, no new export, no new dependency edge and
no design decision** — the same test `ABC-009` applied to itself when it re-checked `S` at two
guarded conditions plus a twelve-row table.

**The one thing that would make it `L`, named so nobody does it:** writing `A1` as an enumeration of
the 169-combination joint space per option rather than as the class. That is why `A1` is bounded to
four rows and a discriminating mutant. **If the enumeration is ever wanted, split it — do not grow
this ticket into it.**

**Priority `P2`.** It is **not** `P1`: nothing is wrong in the delivered code, no user is affected,
and there is no user surface at all until `EPIC-006` — this board's `P1` is for real defects and for
the owner's legality-first directive, and a test-net hole is neither. It is **not** `P3`: one of the
three classes (`A2`) is the first on this board whose leaking position is **legally reachable**, and
`EPIC-004` is a named, planned rewrite of exactly this code with no net under it.

**Escalation trigger, stated so it can actually fire:** promote to `P1` when any ticket proposes to
change `addCastlingMoves`, the `CastleOption` tables, or the through-check loop — including
`EPIC-004`'s `RF-2` work. At that moment the missing rows stop being hardening and become the only
thing standing between a rewrite and a silent legality regression. **The trigger had NOT fired at
cutting time** (2026-08-09) and **has STILL not fired at the promotion hop** (2026-08-10) — checked,
not assumed: the only ticket in `Ready` or beyond is `ABC-013`, which creates `src/san.ts` with
`toSan` only, imports `moves.ts` without changing it, and puts *"any change to `src/legal.ts` or the
rules core"* in its own `## Out of scope`; `EPIC-004` is still in `Backlog`. Saying so plainly
matters, because a trigger treated as fired when it has not is a trigger nobody trusts again.
**`ABC-022` did not fire it either** — it changed `addPawnMoves`, not `addCastlingMoves`, the
`CastleOption` tables or the through-check loop. It is nevertheless the event that invalidated this
ticket's evidence, which is a different relationship and is recorded under `## Dependencies`.

## Definition of Ready

Re-assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the promotion hop,
**2026-08-10**. The cutting-time assessment (2026-08-09) is superseded: it was honest on the day it
was written and two of its rows went stale when `ABC-022` merged.

- **problem clear — user, pain, value stated** ✅ — `## Problem`, with the user named and the
  `EPIC-004` reason for doing it before that rewrite.
- **scope and out-of-scope clear** ✅ — `## Scope` is three observable requirements; `## Out of scope`
  draws seven fences, each with its owner. `A4` no longer contradicts `## Scope`.
- **INVEST-shaped** ✅ with one qualification recorded rather than hidden: it is **independent**
  (one file, no other ticket's acceptance), **valuable** (`EPIC-004` protection), **estimable**
  (17 rows, re-derived at this hop rather than carried), **small** (`S`) and **testable** (each
  criterion names the mutant that must die). The qualification is **negotiable**: `A2` cannot be
  dropped without dropping the only legally-reachable class, so the negotiation is over row counts,
  not over which classes.
- **acceptance criteria clear, testable and measurable** ✅ — five Given/When/Then criteria, each with
  exact counts, exact FENs and a **named discriminating mutant**, and each parenthetical now names
  **the suite size it was measured against (559 on 18 files)**. No criterion says "works" or
  "is hardened". **`A4`'s hash pin is a hash produced at this hop**, not an inherited one.
- **dependencies known** ✅ — `ABC-009` merged 2026-08-09 and the ordering dependency is discharged;
  the `ABC-022` relationship is stated in the direction it actually ran, and the general rule
  ("any ticket that edits `src/moves.ts` re-triggers re-measurement") is written down.
- **security/NFR triggers marked, each with a measurable target** ✅ — **none triggered**, with the
  structural reason (zero production lines), and the two standing bars `A4` still carries are numbers
  re-measured at this hop: deep perft **32/32** exact, skip count **0**.
- **test notes present** ✅ — seven, all of them lessons this board paid for.
- **size assigned** ✅ — `S` (2), re-checked at this hop against the re-derived row count, with the
  condition that would make it `L` named.
- **priority assigned** ✅ — `P2`, with an escalation trigger re-checked at this hop and still
  **not fired**.
- **no major unresolved blocker** ✅ — the one ordering dependency that held this ticket in `Backlog`
  is **satisfied**: `ABC-009` merged 2026-08-09 (`aad6d48` → `5ee84e8`) and both files this ticket
  edits are on `main` with their tables and helper intact. Nothing is unresolved and nobody is
  waiting on a decision.

**Promoted `Backlog` → `Ready` on 2026-08-10 by BA/PM** (task `ticket-to-pr-ABC-023`, Workflow 07),
which is this role's own exit. Both reasons the cutting hop gave for holding it are now spent:
(a) the `ABC-009` dependency is merged, so this board's `Ready` test — *"no unbuilt dependency"* — is
met; (b) the competition for `Ready` the cutting hop deferred to a refinement pass has been resolved
by the owner naming this ticket directly. `Ready` goes **1/8 → 2/8**, inside the limit.

**What `Ready` here does and does not mean.** It means the Definition of Ready is met against a
tree and a suite measured today. It does **not** carry any verdict about the ticket's own three
classes: those are still open holes in the net, which is the whole point of building it. **This
ticket goes stale again the moment `src/moves.ts` changes** — if that happens before it is built, the
sixteen verdicts and the `A4` hash must be re-measured again, exactly as they were here. The
Orchestrator owns `Ready → Ready for Dev → In Development` and re-runs the Definition-of-Ready gate
against this corrected text.
