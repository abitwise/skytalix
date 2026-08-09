---
id: ABC-023
title: castling precondition net — the destination square, the joint occupant pair, and doubling that varies one axis
status: backlog
column: Backlog
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
> **THIS IS A HARDENING TICKET, NOT A DEFECT TICKET. The delivered code is CORRECT on every item
> below** — `src/moves.ts` at md5 `0e247853ab2c05887c76105ff83d8621` answers every position in this
> ticket the way the rules require, and each item was measured on that tree before being written
> here. What is missing is **test net**, not behaviour. **The expected production diff is zero
> lines**, exactly as `A11`'s and `A13`'s were on `ABC-009`.
>
> **Every figure in this ticket was produced by BA/PM's own instruments at that hop** — mutants
> applied to a copy of `src/` held **outside** the repository with `node_modules` symlinked, each
> asserting its anchor unique and its bytes changed, each typechecked so a broken build can never be
> scored a survivor, **one fresh OS process per tree state**, and `src/moves.ts` restored and
> re-hashed after every mutant. **No file under `src/` in the repository was modified and no test row
> was written.** Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64; the numbers here
> are integer test counts and are machine-independent.

## Problem

*User*: the same downstream consumers `ABC-009` names — the renderer (`EPIC-002`), the input layer
(`EPIC-003`), the search (`EPIC-004`), the session (`EPIC-006`) — plus the next engineer to touch
`addCastlingMoves`, who is the user this ticket actually protects.

*Pain*: `ABC-009` closed the castling preconditions over one dimension at a time and ended by
**counting** the last one (`A13`: a home square holds one byte, `parseFen` writes 13 values, 12 are
wrong, all 12 accounted). That argument is sound and it is **about the occupant byte only**. Three
regions sit outside it, and in each of them a wrong build passes the entire 381-test suite:

1. **The castle's DESTINATION square is not pinned by anything.** Dropping `kingTo` from an option's
   `kingPath` — so a castle whose landing square is attacked is still offered — survives the full
   suite **and** the standing `PERFT_DEEP=1` 32/32 lane, on both white options. **This is the only
   class found across `ABC-009`'s six hops whose position is LEGALLY REACHABLE**; every other one
   needs a semantically-invalid FEN.
2. **The joint occupant PAIR is untested.** Every row on `ABC-009` holds one home square wrong and
   the other one right, on purpose, so that exactly one guard can be the reason. A build that admits
   the castle only when **both** squares hold a specific wrong byte therefore survives 381/381.
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

## Reproduction (measured 2026-08-09 by BA/PM on the delivered tree, `0e247853ab2c05887c76105ff83d8621`)

**1 — the DESTINATION square. Each of the three `kingPath` squares dropped in turn, both white
options:**

```
mutant                              verdict   default suite   killed by
WK kingPath drops e1 (ORIGIN)       KILLED    379/381         moves.test.ts, perft.test.ts
WK kingPath drops f1 (CROSSED)      KILLED    378/381         moves.test.ts, perft.test.ts
WK kingPath drops g1 (DESTINATION)  SURVIVED  381/381         nothing — and PERFT_DEEP=1 32/32 EXACT
WQ kingPath drops e1 (ORIGIN)       KILLED    380/381         moves.test.ts
WQ kingPath drops d1 (CROSSED)      KILLED    379/381         perft.test.ts
WQ kingPath drops c1 (DESTINATION)  SURVIVED  381/381         nothing — and PERFT_DEEP=1 32/32 EXACT

witness, one fresh process per tree state, the FEN printed on every line:
delivered  4k1r1/8/8/8/8/8/8/4K2R w K - 0 1  gen []      legal []  14 moves   (g1 attacked from g8)
mutant     4k1r1/8/8/8/8/8/8/4K2R w K - 0 1  gen [e1g1]  legal []  14 moves
delivered  2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1  gen []      legal []  15 moves   (c1 attacked from c8)
mutant     2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1  gen [e1c1]  legal []  15 moves
```

**Why nothing catches it, which is the whole point:** `legalMoves` filters any move that leaves the
mover's king in check, and a castle landing on an attacked square is exactly that — so the outer
layer removes it and **every count-based oracle, perft included, is blind**. The origin and the
crossed square are *not* masked that way, which is why those four mutants die. What breaks is the
**exported `generateMoves`** and its own documented invariant (`src/moves.ts:306-308`: *"a castle
never appears when the king would start, cross, or land in check"*). `ABC-009`'s `## Scope` already
rules that *"offered"* means offered by `generateMoves` **and** by `legalMoves`; this is that rule
with no test behind it.

**Honest limit:** measured on the two **white** options. The two black options are the same
construction in `BLACK_CASTLES` and were **not** mutated at that hop — `UNKNOWN - verify`, and `A2`
below requires rows for both colours regardless.

**2 — the joint occupant PAIR:**

```
mutant                                                     verdict   suite
admits the castle when BOTH home squares hold an enemy KNIGHT  SURVIVED  381/381
admits the castle when BOTH home squares hold an own QUEEN     SURVIVED  381/381

witness, one fresh process per tree state:
delivered  4k3/8/8/8/8/8/8/K3n2n w K - 0 1  gen []      legal []      3 moves  PURE
mutant     4k3/8/8/8/8/8/8/K3n2n w K - 0 1  gen [e1g1]  legal [e1g1]  4 moves
           -> 4k3/8/8/8/8/8/8/K3K2n w K - 0 1   the BLACK knight on e1 destroyed, a SECOND WHITE
              KING written over it: material loss, a piece-type change AND a colour change
```

For the **delivered** code the joint space adds nothing — `src/moves.ts:326-327` are two
**independent** byte compares, so per-square correctness implies joint correctness by construction.
That argument is exactly what a pair-conditional mutant does not respect, and the two mutants above
are the measurement that turns *"could still survive a finite net"* into *"does"*.

**3 — the doubling varies one axis. Measured on the four tables in
`src/moves.castling.hardening.test.ts` and then on mutants:**

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
king's sq admits enemy KNIGHT only QUEENSIDE                    SURVIVED  381/381
rook's sq admits enemy PAWN only KINGSIDE                       SURVIVED  381/381
king's sq admits own ROOK only QUEENSIDE      (A11's own rows)  SURVIVED  381/381
king's sq admits own BISHOP only QUEENSIDE    (A11's own rows)  SURVIVED  381/381
king's sq admits own KNIGHT only when BLACK   (A11's own rows)  SURVIVED  381/381
rook's sq admits own KNIGHT only when BLACK   (A11's own rows)  SURVIVED  381/381

the control, and it is what proves the added configurations are what kill these:
rook's sq admits own QUEEN only KINGSIDE      (rows carry KQkq)  KILLED   379/381
king's sq admits own ROOK only when BLACK     (rows carry K, k)  KILLED   380/381
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
- **`ABC-022`'s en-passant route** — a different branch (`addPawnMoves`), its own ticket, and no line
  of it is touched here.
- **`ABC-010`'s FEN semantic validation.** Several positions in this ticket are
  grammatical-but-invalid; making them unparseable is `ABC-010`'s question, not this one's.
- **`EPIC-004`'s pin-aware / incremental generation** (the audit's `RF-2`) and any performance work.
  This ticket adds no production line and therefore has no throughput question.
- **Coverage as a criterion.** `ABC-009`'s `## Problem` is the standing reason: `src/legal.ts` shipped
  this project's worst defect at 100% statement/branch/function coverage.

## Acceptance (Given/When/Then)

Every *(Measured today: …)* parenthetical below is the behaviour of the **delivered** tree at
`0e247853ab2c05887c76105ff83d8621` and is evidence, not a target. **Each criterion names the mutant
that must die**, because on this ticket "the rows exist" is not the requirement — "a wrong build
fails" is.

- **`A1` (the joint occupant PAIR — both home squares wrong at once).** **Given** a castling option
  whose right is held and **both** its home squares holding a wrong byte **simultaneously**, **when**
  `generateMoves` runs **and when** `legalMoves` runs, **then** the `FLAG_CASTLE` count is **exactly
  0** in **both**, the `legalMoves` count is exact, and the position is byte-identical across the call
  over all 128 board bytes and all five scalars. **At least four rows**: an enemy/enemy pair and an
  own/own pair, each in both colours to move, with the occupant byte (type **and** colour) asserted on
  **both** squares and the row asserted non-inert. **The discriminating requirement:** a build that
  admits the castle **only** when a specific pair co-occurs must fail at least one row.
  *(Measured today: `4k3/8/8/8/8/8/8/K3n2n w K - 0 1` returns **3** moves, 0 castles, pure; the
  enemy-KNIGHT pair mutant and the own-QUEEN pair mutant each survive **381/381**, and the first
  leaves `4k3/8/8/8/8/8/8/K3K2n w K - 0 1` on one `legalMoves` call.)*

- **`A2` (the castle's DESTINATION square, pinned at the `generateMoves` layer).** **Given** a
  position in which the castle's **landing** square is attacked while its origin and crossed squares
  are **not**, **when** `generateMoves` runs, **then** the `FLAG_CASTLE` count is **exactly 0** — and
  the assertion must be made **on `generateMoves`**, because `legalMoves` refuses the move for a
  different reason and cannot witness this. **Four rows: both castling sides × both colours to move**,
  each asserting (a) the landing square **is** attacked and (b) the origin and crossed squares are
  **not**, through `isSquareAttackedBy` **polarity-checked before its verdicts are read**. **The
  discriminating requirement:** dropping the landing square from an option's `kingPath` must fail at
  least one row.
  *(Measured today: `4k1r1/8/8/8/8/8/8/4K2R w K - 0 1` → `generateMoves` 0 castles, `legalMoves` 0
  castles, **14** moves; `2r1k3/8/8/8/8/8/8/R3K3 w Q - 0 1` → 0 castles, **15** moves. Both
  destination mutants survive the full suite **381/381** and the `PERFT_DEEP=1` lane **32/32**. The
  black-side mutants are `UNKNOWN - verify` — not measured — which is why this criterion requires the
  rows rather than inheriting the white result.)*

- **`A3` (the doubling varies BOTH axes).** **Given** each of the four impostor tables in
  `src/moves.castling.hardening.test.ts`, **when** the rows of each piece type are read, **then**
  every type appears in configurations that vary **both** the colour to move **and** the castling
  side — asserted as a **test over the tables**, in the shape `A11` and `A13` already use, so a future
  row that re-narrows a type goes red. **The discriminating requirement:** an admission of a **single
  type** made conditional on colour, or on side, must fail at least one row — on **both** the `A11`
  and the `A13` tables.
  *(Measured today: **9 of 13** type/table pairs vary one axis only, and one added configuration per
  pair — **nine rows** — closes both. Six such single-type conditional mutants survive 381/381 and two
  die; the two that die are exactly the types whose rows already vary the axis in question, which is
  what makes this criterion falsifiable rather than decorative.)*

- **`A4` (no production change, and no existing test modified).** **Given** the delivered tree,
  **when** this ticket's rows land, **then** `src/moves.ts` still hashes
  `0e247853ab2c05887c76105ff83d8621`, **no existing test file is modified** — verified at line level,
  not by inspection — the full suite is green with a **skip count of 0**, and the `PERFT_DEEP=1` lane
  is **32/32** exact. *(If any row proves the delivered code wrong, this criterion FAILS by design and
  the defect is cut as its own ticket. The expectation is that none does: all three classes were
  measured against a tree that answers every one of them correctly.)*

- **`A5` (the added rows are load-bearing, proved by mutation and not by count).** **Given** the rows
  from `A1`–`A3`, **when** each criterion's named discriminating mutant is run against the suite,
  **then** each **dies**, and **when** the behaviour-equivalent controls `ABC-009` established are run
  — colour-blind on either square, the king guard's `continue` → `break` / `return`, both guards below
  the emptiness test, below the through-check test, above the right test, and the enemy
  `KING`/`QUEEN`/`ROOK` admissions on both squares — **then all of them still SURVIVE**, killed count
  **zero**. *(That second half is the half that matters: a row killing an equivalent mutant pins
  implementation shape instead of behaviour. `ABC-009` measured fifteen such survivors at 381/381 and
  this ticket must not lose one.)*

## Dependencies

- **`ABC-009` must be merged first.** Its branch delivers both files this ticket edits
  (`src/moves.castling.hardening.test.ts` and `src/moves.castling.test.ts`), so there is nothing to
  extend until it lands. This is a true ordering dependency, not a preference.
- **Independent of `ABC-010`, `ABC-011` and `ABC-022`** — different modules or different branches, and
  either order works.
- **`EPIC-004` is the reason this has a deadline shape rather than a date**: it rewrites the castling
  hot path, and rows that do not exist before that rewrite cannot protect it.

## Security / NFR triggers

**None, and the reason is structural rather than a judgement.** This ticket adds **no production
line**, so it changes no code path, no allocation and no branch in the search's inner loop —
`NFR-001`'s count-based discharge on `ABC-009` (the two added byte compares execute 198,175 times each
over the perft population and reject nothing) is untouched by a test-only change. `NFR-005` is not
triggered for the same reason. **No throughput figure appears in this ticket and `npm run perft` was
not run by the role that wrote it.** The standing bars still apply through `A4`: deep perft **32/32**
exact, skip count **0**. No security trigger — this is reliability, not security, and the input class
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

**Size `S` (2 points), and it is the top of `S`.** Measured content: **4** rows for `A1`, **4** for
`A2`, **9** for `A3`, plus **two** quantifier tests over the tables — about **17 rows and 19 tests**,
all in **one existing table-driven file**, with **zero production lines** expected. It is `S` on this
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
thing standing between a rewrite and a silent legality regression. **The trigger has NOT fired at
cutting time** (2026-08-09) — no such ticket is in `Ready` or beyond — and saying so plainly matters,
because a trigger treated as fired when it has not is a trigger nobody trusts again.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at cutting, 2026-08-09.

- **problem clear — user, pain, value stated** ✅ — `## Problem`, with the user named and the
  `EPIC-004` reason for doing it before that rewrite.
- **scope and out-of-scope clear** ✅ — `## Scope` is three observable requirements; `## Out of scope`
  draws seven fences, each with its owner.
- **INVEST-shaped** ✅ with one qualification recorded rather than hidden: it is **independent**
  (one file, no other ticket's acceptance), **valuable** (`EPIC-004` protection), **estimable**
  (17 rows measured, not guessed), **small** (`S`) and **testable** (each criterion names the mutant
  that must die). The qualification is **negotiable**: `A2` cannot be dropped without dropping the
  only legally-reachable class, so the negotiation is over row counts, not over which classes.
- **acceptance criteria clear, testable and measurable** ✅ — five Given/When/Then criteria, each with
  exact counts, exact FENs and a **named discriminating mutant**. No criterion says "works" or
  "is hardened".
- **dependencies known** ✅ — `ABC-009` must merge first (a true ordering dependency, stated with its
  reason); independent of `ABC-010`, `ABC-011`, `ABC-022`.
- **security/NFR triggers marked, each with a measurable target** ✅ — **none triggered**, with the
  structural reason (zero production lines), and the two standing bars `A4` still carries are numbers:
  deep perft **32/32** exact, skip count **0**.
- **test notes present** ✅ — seven, all of them lessons this board paid for.
- **size assigned** ✅ — `S` (2), with the condition that would make it `L` named.
- **priority assigned** ✅ — `P2`, with a stated and explicitly unfired escalation trigger.
- **no major unresolved blocker** ⚠️ — one **ordering** dependency is open: `ABC-009` is in
  `Ready for UAT` and not merged. Not a blocker in the `Blocked`-column sense (nothing is unresolved
  and nobody is waiting on a decision), but it is the reason this row is not ✅ and the reason the
  ticket sits in `Backlog`.

**Sits in `Backlog`, and the promotion to `Ready` is deliberately NOT taken here.** Two honest
reasons rather than one: (a) its only dependency — `ABC-009` merging — is not satisfied at cutting
time, and this board's `Ready` test is *"no unbuilt dependency"*; (b) `Ready` is the queue the
Orchestrator pulls from, and a `P2` hardening ticket should compete for it at a refinement pass
against `ABC-019`/`ABC-020`/`ABC-021`, not be slipped in by the hop that wrote it. **The
`Backlog → Ready` exit is BA/PM's and stays available the moment `ABC-009` is merged.**
