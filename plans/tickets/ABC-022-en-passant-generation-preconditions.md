---
id: ABC-022
title: generateMoves offers en-passant captures its own preconditions forbid
status: in-review
column: In Review
size: S
priority: P1
epic: EPIC-001
feature: —
---

# ABC-022 — `generateMoves` offers en-passant captures its own preconditions forbid

> **Cut 2026-08-04 by BA/PM** (task `refinement-2026-08-04`, Workflow 07), from an item routed to
> this role by **three** separate roles across `ABC-011` and cut by none of them: Architect/Design at
> the second design hop (2026-08-03), the Software Engineer during the fix, and QE/E2E at the second
> review. **Every claim in this ticket was reproduced by BA/PM before it was written**, against
> merged `main`, on a script that copied none of theirs.
>
> **The reproduction found MORE than was routed, and the extra half is the worse half.** What was
> routed is half (a) below. Half (b) — the same six-line branch, the other missing precondition — is
> what makes `legalMoves` **permanently corrupt the position it is handed**. It is in this ticket
> because it is the same `if`, the same fix site and the same test table; splitting it would give two
> tickets editing the same four lines, which is the opposite of independent.

## Problem

*User*: every downstream consumer of the rules core — the renderer (`EPIC-002`), the input layer
(`EPIC-003`), the search (`EPIC-004`), the session (`EPIC-006`). All of them call `generateMoves` or
`legalMoves` and act on what comes back.

*Pain*: `addPawnMoves` (`src/moves.ts:172-197`) emits a `FLAG_EN_PASSANT` move on the single test
`to === position.epSquare`. Its own comment, three lines above, states the precondition it does not
check:

> *"En passant: the target square is empty, but it is this move's `epSquare` and the captured pawn
> sits beside the mover on `to`'s file, one rank back."*

Neither clause of that sentence is enforced. Two distinct defects follow:

- **(a) The target square is not checked to be empty.** The ordinary-capture branch at line 177
  requires `isBlack(target) !== black` and `continue`s. An occupant of the mover's **own** colour
  fails that test, does **not** `continue`, and falls through into the en-passant branch. The
  generator therefore offers **a pawn capturing onto a square occupied by the mover's own piece**,
  and the legality filter passes it through.
- **(b) The captured pawn's presence is not checked.** The move is emitted with
  `captured: PAWN | (black ? 0 : BLACK)` whether or not that pawn is on the board. `applySpecial`
  clears the capture square unconditionally and `undoSpecial` (`src/apply.ts:106-110`) writes
  `move.captured` back unconditionally, so when the board never held that pawn the "restore" is a
  **creation**, and it is permanent.

*Value*: `generateMoves` and `legalMoves` are the two functions that **define** which chess moves
exist in this product. Under the project owner's standing directive of 2026-07-31 —
*"The most important thing is that chess moves are legal according to game rules"* — a generator
that offers a move the rules forbid is the defect class that outranks features. Half (b) additionally
breaks the purity contract `legalMoves`' own doc comment states, in the module every other epic sits
on.

**Perft is silent on this and its silence is not evidence — but NOT for the reason previously
recorded.** The reason given when this was routed was that an over-offered move "the legality filter
later rejects" can still yield exact counts. **Measured here, the legality filter does not reject
it**: `legalMoves` returns the over-offered move on both half-(a) reproductions. Perft is silent
because the **trigger population is empty** — 0 of 518,474 reachable nodes carry an occupied
en-passant target (measured below). That is a stronger statement and it changes what the fix must be
tested with: **no perft depth and no additional perft position can ever reach this defect.** It is
reachable only by a constructed position, so the acceptance below is a constructed table and perft
appears only as a regression guard.

## Source

`.grugops/context/ticket-to-pr-ABC-011/notes/`:

- `20260803T133000Z-architect-design-decision-7c41d0ab` §1 and
  `20260803T133500Z-architect-design-observation-9b2e4f17` §2 — found and routed, with the mechanism
  read out of `src/moves.ts:172-197`.
- `20260803T150500Z-software-engineer-observation-8c4d2a17` §1 — the `GEN` row, re-verified during
  the fix.
- `20260803T160000Z-qe-e2e-decision-69ddf1ff` §4 — re-verified at the second review, and the
  correction this ticket carries (below).

Reproduced independently by BA/PM on 2026-08-04 before this ticket was cut.

## Reproduction (verified 2026-08-04 by BA/PM, on `main`, Apple M3 / Node v24.12.0 / darwin-arm64)

> **RE-VERIFIED 2026-08-09 by BA/PM** (task `ticket-to-pr-ABC-022`), because the 2026-08-04 tables were
> measured on a `main` that has since changed: `ABC-009` merged in `e644039` and it edited
> `src/moves.ts`. **All ten rows below reproduce unchanged on today's `main`** (`src/moves.ts` md5
> `0e247853ab2c05887c76105ff83d8621`), each re-measured on a copy outside the repository with the FEN
> printed and re-parsed before any verdict. **`ABC-009` therefore does not close any part of this
> ticket** — that was an argument on 2026-08-04 and it is a measurement now. Two corrections and one
> addition below carry the date `2026-08-09`.

### Half (a) — an en-passant capture onto the mover's OWN piece

```
FEN                                     generateMoves ep   onto own piece   legalMoves ep
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1     d4e3               YES              1   <- filter passes it
4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1     e5d6               YES              1   <- filter passes it
4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1     d4e3               YES              1   <- NEW, see below
```

**The shape is piece-agnostic, and that is new at this hop.** The two FENs on record both put a
**knight** on the target. The third row above puts a **rook** there and reproduces identically,
because the falling-through test at line 177 reads only the occupant's colour. An acceptance
criterion naming the two recorded FENs would under-specify the defect and could be satisfied by a
knight-shaped fix.

**Playing the over-offered move destroys the mover's own piece**, which is a consequence no prior
note states:

```
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1   --makeMove-->   4k3/8/8/8/8/4p3/8/4K3 w - - 0 2
                                                              ^ the black knight on e3 is GONE
```

One move removes two pieces: the white e4 pawn (legitimately, per the en-passant rule) and the
mover's **own** knight (by overwrite). `makeMove`/`unmakeMove` round-trip **byte-exactly** on this
class, so "pure" is true of the *pair* and says nothing about the *consequence*. Half (a) is a wrong
answer with silent material loss, not merely a wrong answer.

### Half (b) — an en-passant capture with nothing to capture, and `legalMoves` corrupts

```
FEN                                    generateMoves ep   position after ONE legalMoves() call
4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1       b2a3               4k3/8/8/8/8/8/pP6/4K3 w - a3 0 1
                                                                          ^ phantom BLACK pawn a2
4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1       e5d6               4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1
                                                                       ^ phantom BLACK pawn d5
4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1      e5d6               4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1
                                                                       ^ the WHITE d5 pawn turned BLACK
```

**ADDED 2026-08-09 — half (b) reproduces with BLACK to move, and nothing above or in `## Acceptance`
exercised that direction.** All three rows above are white to move. The mirror is live and creates a
phantom **white** pawn:

```
FEN                                    generateMoves ep   position after ONE legalMoves() call
4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1       d4e3               4k3/8/8/8/3pP3/8/8/4K3 b - e3 0 1
                                                                       ^ phantom WHITE pawn e4
4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1       g4h3               4k3/8/8/8/6pP/8/8/4K3 b - h3 0 1
                                                                       ^ phantom WHITE pawn h4, edge file
```

**And a THIRD black-to-move shape that the call-level purity oracle CANNOT SEE — measured, and it
constrains how the table is built.** On `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1` the generator offers
`d4e3` and the make/unmake pair rewrites e4 from a **black** pawn (byte 9) to a **white** pawn
(byte 1) — yet `legalMoves` reads **byte-identical across the call**, because the very next move in
the same pass, `e4e3`, writes `move.piece` back onto e4 and heals the corruption:

```
after d4d3 pair: e4 = 9
after d4e3 pair: e4 = 1   <- EN PASSANT, the corruption
after e4e3 pair: e4 = 9   <- the next move in the SAME pass restores it
...
e4 after the whole pass = 9        legalMoves() purity across the call: reads CLEAN
```

A purity row is therefore only load-bearing when no later move in the same pass writes the corrupted
square. This is a **row-selection rule, not a change to the contract** — see `## Test notes` item 2.

`legalMoves` is documented as leaving its argument unchanged and does not. **This is `ABC-009`'s
symptom by a different route** — that ticket's reproduction is the castling branch
(`addCastlingMoves`); this is the en-passant branch (`addPawnMoves`). See *Dependencies* for why the
two are separate tickets and why `ABC-009` cannot be relied on to close this.

### Controls that must stay green (they already pass today)

```
FEN                                     generateMoves ep   note
4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1     (none)             ENEMY piece on the target — correct today
4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1     (none)             mirror — correct today
4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1       e5d6               valid position — must keep offering it
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1        c5d6 filtered      valid, capturer pinned — legalMoves 0
```

**Correction 2026-08-09:** the last row read `e5d6` and the move is **`c5d6`** — there is no white
pawn on e5 in that FEN; the capturer stands on **c5** and the discovered check runs along the 5th rank
once both the c5 pawn leaves and the d5 pawn is removed. A copy-down from the row above, corrected
here. `A6` states that row by **count** and never by name, so `A6` itself was not wrong.

### Reachability — measured, not argued

Exhaustive walk of `src/perft.test.ts`'s own table at its own `fast` depths, roots and depths **read
out of that file rather than recalled**:

```
startpos     depth 4  nodes 206604       kiwipete     depth 3  nodes  99950
position-3   depth 4  nodes  46256       position-4   depth 3  nodes   9738
position-5   depth 3  nodes  63910       position-6   depth 3  nodes  92016

TOTAL nodes visited                                 : 518474
nodes with epSquare set                             :  81397   (15.70%)
nodes whose ep TARGET is occupied (any piece)       :      0
   ...occupied by the MOVER'S OWN piece             :      0
ep moves offered onto the mover's own piece         :      0
```

**518,474 / 81,397 is now the SEVENTH independent reproduction of that figure on this project**
(design, dev, QE, design-2, dev-2, this ticket's own cut, and **re-derived 2026-08-09 at the
correction hop**, on today's `main`, roots and `fast` depths parsed out of `src/perft.test.ts` by the
harness rather than retyped) — the cross-check that the walk is the same population the prior hops
measured. Every one of the six per-root counts above re-measured **identical**, and all five figures
in the block above re-measured identical (`81,397` = **15.70%**). **The count was `sixth` when this
ticket was cut and is corrected here rather than left to drift.** The defect is **latent**: it needs a
semantically invalid FEN, and no path in the product produces one today.

## Scope

`generateMoves` emits a `FLAG_EN_PASSANT` move only when the preconditions its own comment states
actually hold, for every position it accepts:

- **The en-passant target square is empty.** No en-passant move is offered onto an occupied square,
  **whatever occupies it and whatever colour it is**.
- **The pawn the move claims to capture is on the capture square** — the enemy pawn, one rank behind
  the target on the target's file, relative to the mover's advance.
- **`legalMoves` leaves its argument byte-identical** across a call on every position in the
  reproduction table above — all 128 board bytes and all five scalars.

The mechanism is the engineer's call. The observable contract above is the requirement.

## Out of scope

- **Rejecting the invalid FEN at the boundary** — `ABC-010`. This ticket does not make the input
  legal; it makes the generator honest about what it emits. Same split, for the same reason,
  `ABC-009` was cut separately from `ABC-010`: *"`legalMoves`' contract should not depend on a caller
  having validated its input — that assumption is exactly what failed here."*
- **The castling branch's missing preconditions** — `ABC-009`, deliberately separate. Different
  function (`addCastlingMoves` vs `addPawnMoves`), independently testable, either may ship first.
- **Deleting or relaxing `ABC-011`'s shipped guards in `src/legal.ts`.** They are not a workaround
  for this defect and do not become deletable when it is fixed — see the correction below. **No file
  under `src/legal.ts` or `src/zobrist.ts` is changed by this ticket.**
- **Widening `ABC-010`'s validation to cover the half-(a) trigger.** Named in *Dependencies* as a gap
  in that ticket, flagged rather than edited here — changing `ABC-010`'s acceptance is its own
  refinement, not this one's.
- Pin-aware or incremental generation, king-square caching, any `src/fen.ts` change.

## THE CORRECTION THIS TICKET CARRIES — `ABC-011`'s guard (a) is NOT a workaround for this defect

Recorded because the Software Engineer's original framing was *"guard (a) may become deletable if
BA/PM fixes the `generateMoves` defect"*, QE corrected it at the second review, and **the correction
is what a reader of this ticket must inherit**. BA/PM re-derived it here by mutation rather than
accepting either version, and the result is **stronger than QE's**:

QE's correction was that guard (a) is load-bearing for two classes and only one of them is this
defect. Measured here on a guard-(a)-deleted mutant of `src/legal.ts`:

```
                                                        hasLegalEnPassant with guard (a) DELETED
4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1   own piece         true   (correct answer: false)
4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1   own piece         true   (correct answer: false)
4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1   ENEMY piece       true   (correct answer: false)
4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1   ENEMY piece       true   (correct answer: false)
```

**Guard (a) is needed for BOTH classes, and fixing this ticket changes neither row.**
`hasLegalEnPassant` **synthesises its own probe move and never consults `generateMoves`** — so guard
(a) is a precondition of the predicate, not compensation for the generator. "Deletable once the
generator is fixed" is not merely over-stated; it is false for every class guard (a) covers. Anyone
who deletes it after this ticket lands reopens four assertions in `src/legal.test.ts` and
`src/zobrist.test.ts`.

## Acceptance (Given/When/Then)

`A1`–`A4` are currently-failing tests that must go green. `A5`–`A10` are green on `main` today and are
**gates or regression guards, not new reds** — the preamble previously claimed every criterion was
currently failing "except where marked as a regression guard", and only `A5` and `A6` carried that
marking, so `A7`–`A10` were mis-described; corrected 2026-08-09. `A11` is a documentation criterion.
The parenthetical on each is the measured behaviour on `main` today.

> **`## Acceptance` CORRECTED IN PLACE 2026-08-09 by BA/PM** (task `ticket-to-pr-ABC-022`), against a
> Definition-of-Ready re-check five days after the ticket was cut. **No board move: `ABC-022` stays in
> `Ready`.** Six criteria changed — `A2`, `A3`, `A4`, `A5`, `A11` and this preamble — and the shape
> behind four of them is the same one this board keeps paying for: **a criterion narrower than the
> ticket's own `## Scope`**. `## Scope`, `## Out of scope`, size `S` and priority `P1` are UNCHANGED
> and nothing found here pushes on them. Every claim below was re-derived by measurement on copies
> outside the repository; **no file under `src/` was touched and no test row was written.**

> **`A11` WIDENED IN PLACE 2026-08-09, SECOND BA/PM HOP** (task `ticket-to-pr-ABC-022`), after the
> `In Review` gate found the shipped fix satisfies `A11` while leaving a statement its own change made
> **false** in the same file. **No board move: `ABC-022` stays in `In Review`** — the criterion was not
> unmet, it was **too narrow**, which is a different thing. **`A11` is the only criterion touched;
> `A1`–`A10` are unchanged and were not re-litigated.** The hop was a repo-wide **sweep** for every
> statement this fix falsified, not a patch of the one flagged line: it found **four more**, in two
> further files, and it also found statements that are **still true and must not be rewritten**, one
> statement this fix **repairs**, and one that was **already false before this branch existed** and is
> therefore not `A11`'s. `## Scope`, `## Out of scope`, size `S` and priority `P1` are re-checked and
> **UNCHANGED** — nothing in the sweep pushes on them. **No file under `src/` was touched at this hop
> either**, and every figure below was measured on tree copies outside the repository.

- **A1 (half a, piece-agnostic).** **Given** each FEN in a table that places a piece of the **mover's
  own colour** on the en-passant target — at minimum `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`,
  `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1`, i.e. **at least
  two distinct piece types and both colours to move** — **when** `generateMoves` runs, **then** the
  count of returned moves carrying `FLAG_EN_PASSANT` is **exactly 0** for every row.
  *(Today: exactly 1 for every row.)*
- **A2 (widened 2026-08-09).** **Given** the rows of **`A1` AND of `A3`**, **when** `legalMoves` runs,
  **then** the count of returned moves carrying `FLAG_EN_PASSANT` is **exactly 0** for every row.
  *(Today: exactly 1 for every row of both — the legality filter does not reject either half.)*
  **`A2` previously said "the same table", meaning `A1`'s own-colour table only**, while the measured
  fact it exists to pin — the filter passes the over-offered move through — holds on `A3`'s rows too.
  `legalMoves` is a strict filter over `generateMoves` (`src/legal.ts:42-55`), so this is implied by
  `A1`/`A3` rather than independent of them; it is kept because the pass-through is the surprising
  part and it is cheap to assert.
- **A3 (half b) — WIDENED 2026-08-09 TO BOTH COLOURS TO MOVE.** **Given** each FEN in a table that
  places an en-passant target with **no capturable pawn behind it**, covering **both colours to
  move** — at minimum, white to move: `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`,
  `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1`, `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1`; and black to move:
  `4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1` and `4k3/8/8/8/6p1/8/8/4K3 b - h3 0 1` — **when**
  `generateMoves` runs, **then** the `FLAG_EN_PASSANT` count is **exactly 0** for every row.
  *(Today: exactly 1 each, on all five.)*

  **Why this was a defect and not a nicety.** `A3` named three FENs and **all three were white to
  move**, while `## Scope` bullet 2 requires the precondition "for every position it accepts" and
  `A1` — the sibling half of this same defect — was already written as "both colours to move".
  Measured at this hop: a fix that implements the captured-pawn precondition **for white only**
  (`black || board[to - forward] === capturedPawn`) passes `A1`, `A2`, `A3`, `A4`, `A5` and `A6` **as
  they were written**, typechecks clean, and passes the whole existing suite **381/381** — while
  `4k3/8/8/8/3p4/8/8/4K3 b - e3 0 1` still offers `d4e3` and one `legalMoves` call still creates a
  phantom **white** pawn on e4. Half (b) is the half this ticket calls the worse half, and it was
  unguarded for black.
- **A4 (half b, the purity half) — RESTATED 2026-08-09 AGAINST THE STATE, AND WIDENED TO EVERY
  POSITION `## Scope` NAMES.** **Given** **every position in the `## Reproduction` tables above** —
  the half-(a) rows, the half-(b) rows (both colours), and the control rows — **when** `legalMoves` is
  called once, **then** the position is unchanged over **all 128 board bytes AND all five scalars**
  (`blackToMove`, `castling`, `epSquare`, `halfmoveClock`, `fullmoveNumber`), compared field by field
  and **not** through `toFen`. *(Today: a phantom black pawn on a2 / d5, a white d5 pawn rewritten
  black, and a phantom white pawn on e4 / h4; the half-(a) and control rows are clean today and are
  regression guards.)*

  **Two things were wrong with `A4` as written, and the second is not the one the pre-check named.**
  (i) **Coverage.** `## Scope` bullet 3 requires purity "on every position in the reproduction table
  above"; `A4` required it on **three of the ten**. (ii) **Instrument.** `A4` made
  `toFen(position) == input FEN` a co-equal required assertion, which `## Test notes` item 2
  explicitly forbids and gives the reason for. **The pre-check's stated mechanism — "the five scalars
  are absent, so a build that corrupts a scalar and no board byte satisfies `A4`" — is FALSE as a
  behavioural claim and is corrected here rather than inherited:** `toFen` renders all five scalars,
  and all **15** plausible single-scalar corruptions (3 FENs x 5 scalars) are **caught** by it. What
  is true is narrower and uglier: `toFen` is **not injective** on the state. Measured — **28 castling
  bit values** (`16, 32, … , 2^31`) change `position.castling` and leave the rendered field `-`
  because only `K|Q|k|q` are rendered; and `epSquare` **32 (`a3`, on-board) renders identically to 40
  (`0x28`, OFF-BOARD)**, since `squareName` reads `sq & 7` and `sq >> 4` and never tests
  `isOnBoard`. That second alias is the very off-board family `## Test notes` item 2 cites. So `toFen`
  is unfit as the purity oracle **in principle**, even though no realistic broken fix would exercise
  the gap — which is why the repair is to state the requirement against the state, not to argue about
  the instrument.
- **A5 (regression guard — must stay green, and must be present) — WIDENED AND ITS JUSTIFICATION
  REPLACED 2026-08-09.** **Given** each FEN in a table that places a piece of the **enemy** colour on
  the en-passant target, covering **at least two distinct piece types and both colours to move** — at
  minimum `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1`, `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` and a
  non-knight pair such as `4k3/8/8/8/3pP3/4R3/8/4K3 b - e3 0 1` and
  `4k3/8/3r4/3pP3/8/8/8/4K3 w - d6 0 1` — **when** `generateMoves` runs, **then** the
  `FLAG_EN_PASSANT` count is **exactly 0** for every row. *(Today: already 0 on all of them.)*

  **The old justification was false and is retired, not softened.** It read: *"Named so the fix is not
  written as 'reject own-colour occupants', which would leave this passing by accident rather than by
  the rule."* `A5` cannot do that job, and **no criterion can** — proved by exhaustion at this hop
  rather than argued. Control only reaches the en-passant branch when the target is **empty or the
  mover's own colour**, because `src/moves.ts:177` consumes every enemy occupant and `continue`s at
  line 180. At that program point an emptiness test (`target === EMPTY`) and a colour test
  (`!(target !== EMPTY && isBlack(target) === black)`) are therefore **behaviour-equivalent**. Two
  correct fixes differing only in that clause were built, typechecked clean, and run **one OS process
  per tree**: byte-identical output digests over the branch's **entire input domain** (all 256 byte
  values on the target x both colours to move = 512 states, plus all 20 FEN-producible occupants) and
  byte-identical per-root digests of every node's full generated move set over the **whole 518,474-node
  reachable population**. There is no distinguishing position, so `A5` is not the place to look for
  one.

  **`A5` is kept because it kills something else, and that is measured, not assumed.** The dangerous
  shape is not the colour-shaped *clause* — it is the colour-shaped *restructure*: rejecting
  own-colour occupants with a `continue` guard at the top of the loop and, in the same rewrite,
  dropping the ordinary-capture branch's own `continue`. Every enemy occupant then falls through into
  the en-passant branch. That mutant **passes `A1`, `A2`, `A3`, `A4` and `A6`, passes the full suite
  381/381, and passes the deep perft lane 32/32** — perft is blind because an occupied en-passant
  target is unreachable in legal play (0 of 518,474) — and **`A5` is the only thing on this board that
  fails it**, red on both of its original rows. Its output digest over the 512-state domain differs
  from a correct fix's: 257 emitting states against 2. **That is the claim `A5` may make: it is the
  only guard against a rewrite of the ordinary-capture branch that stops consuming enemy occupants.**
  The two extra piece types are required for the same reason `A1` carries them — `## Scope` bullet 1
  says "whatever occupies it and whatever colour it is", and the enemy half of that bullet had one
  piece type where the own-colour half had two.
- **A6 (regression guard — the fix must not over-reject).** **Given**
  `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1`, **then** `generateMoves` returns **exactly 1**
  `FLAG_EN_PASSANT` move (`e5d6`) and `legalMoves` returns **exactly 1**; **and given**
  `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` (capturer pinned), **then** `generateMoves` returns **exactly
  1** and `legalMoves` returns **exactly 0**. *(Today: both hold.)*
- **A7 (the reachable population is unmoved).** **Given** the six positions and `fast` depths in
  `src/perft.test.ts`, **when** each is walked before and after the fix, **then** the node count at
  every root is **identical** (`206604 / 99950 / 46256 / 9738 / 63910 / 92016`, total **518474**),
  and the number of nodes at which an en-passant move is offered onto an occupied square is
  **0 both before and after**. *(Today: 0. This criterion proves the fix is a precondition and not a
  behaviour change, and it fails loudly if the fix over-rejects.)*
- **A8 (the standing oracle).** **Given** `PERFT_DEEP=1`, **when** the deep perft lane runs, **then**
  all **32/32** cases match their published node counts **exactly** — zero tolerance.
- **A9.** **Given** the full suite, **when** it runs after the fix, **then** it is green with a
  **skip count of 0** and **no existing test is modified** — verified at line level, not by
  inspection.
- **A10.** **Given** the bar in *Security / NFR triggers*, **when** measured, **then** it holds.
- **A11 (documentation) — CITATION AND EXPECTED OUTCOME CORRECTED 2026-08-09; WIDENED TO THE FULL
  FALSIFIED SET 2026-08-09 (second hop).** **Given** the tree after the fix, **then** **no comment or
  doc comment anywhere under `src/` states, as current behaviour, anything about `generateMoves`'s
  en-passant branch that this fix has made false.** The sites are enumerated below and the list is
  **closed by a repo-wide sweep**, not by sampling; each is a **comment-only** edit and **no executable
  line and no test row changes anywhere.**

  | # | site | the false statement | status |
  | --- | --- | --- | --- |
  | 1 | `src/moves.ts` **183-195** | the ep comment must state preconditions the code below it enforces | **already satisfied** by the delivered fix (past tense throughout) |
  | 2 | `src/legal.ts` **102-107** | *"with the target occupied, `generateMoves` reads the square as an ordinary capture and never offers the ep move"* | **already satisfied** by the delivered fix |
  | 3 | `src/legal.ts` **69-70** | *"Outside it the oracle is unsound — `generateMoves` offers en-passant captures onto squares occupied by the mover's OWN piece"* | **OPEN — the trigger for this hop** |
  | 4 | `src/legal.test.ts` **268-269** | *"because `generateMoves` is itself unsound there and the oracle cannot be the authority on a class it gets wrong"* | **OPEN — found by the sweep** |
  | 5 | `src/legal.test.ts` **368-371** | *"the one where `generateMoves` offers an en-passant capture onto the mover's OWN piece"*, and *"the oracle agreeing with the relaxed guard is not a defence"* | **OPEN — found by the sweep** |
  | 6 | `src/legal.test.ts` **373-374** | *"The oracle answers `true` on all four … off-domain the oracle is unsound"* | **OPEN — found by the sweep** |
  | 7 | `src/moves.enpassant.test.ts` **4-9, 27-28** | the header's present-tense *"the generator offers a capture onto the mover's own piece"* and *"a board the generator provably corrupts"* | **OPEN — found by the sweep, lowest severity** |

  **Sites 3-7 are one defect, not five.** Every one of them rests on a single premise — *the generator
  is unsound outside the domain* — and this fix removed that premise. **`src/legal.ts` currently
  contradicts itself 33 lines apart:** 69-70 says the generator offers the capture, while the
  A11-corrected 102-107 says it does not and explains why. Shipping either alone would be worse than
  shipping neither.

  **The premise is not weakened, it is GONE, and that is measured over the guards' whole input
  domain.** The en-passant branch's preconditions read exactly two board bytes (the ep **target** and
  the square one rank back) plus the side to move, so `256 x 256 x 2 = 131,072` states **exhaust**
  them. Swept on full tree copies, **one OS process per tree**, base FENs printed and re-parsed,
  `tsc --noEmit` exit 0 on every tree before any result was believed. `30,271` states carry a byte that
  is not a valid piece code and make the generator throw — the throw is captured as the observable and
  the count is **identical on every tree**, so it is an instrument limit of direct board writes, not a
  verdict — leaving **100,801** scored:

  ```
  tree                            moves.ts md5   ORACLE vs hasLegalEnPassant   legalMoves
                                                 DISAGREEMENTS / 100,801        IMPURE
  t-pristine  (main)              0e247853…              43,200                 35,583
  t-fix       (branch tip)        6335b452…                   0                      0
  t-fix       + guard (a) deleted 6335b452…                 447                      0
  t-pristine  + guard (a) deleted 0e247853…               8,031                 35,583
  ```

  where the oracle is `legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)`. **On the delivered
  tree the oracle disagrees with `hasLegalEnPassant` on ZERO of 100,801 states and `legalMoves` is pure
  on all of them.** The two `true` answers left on `t-fix` are the two genuinely in-domain states, and
  the oracle and the predicate return them together.

  **The second question, and it is settled rather than hedged: the reason has not partly evaporated,
  it has entirely evaporated — but the guards' justification INVERTS rather than weakens.** Read the
  last two rows of the table: **before** the fix, deleting guard (a) took disagreement *down* from
  43,200 to 8,031, so guard (a) was a **source** of disagreement — it made the predicate deviate from
  an unsound oracle. **After** the fix, deleting guard (a) takes disagreement *up* from 0 to 447, so
  guard (a) is now the **reason the two agree**. On this ticket's own four
  `## THE CORRECTION THIS TICKET CARRIES` rows the inversion is visible one row at a time: the two
  own-piece rows read `hasLEP=false / oracle=true` on `main` and `hasLEP=false / oracle=false` on the
  delivered tree. **`ADR-0005` clause 6's *"(a) buys agreement with the oracle"* was loose-to-false as
  written and this fix makes it exactly true** — a statement the fix **repairs**, recorded because a
  sweep that only reports damage is not a sweep.

  **What the corrected `src/legal.ts` paragraph must and must not say.** It must (i) **delete the
  unsoundness premise and its mechanism clause outright** rather than soften them; (ii) **keep the
  conclusion** — the answer off-domain is still **SPECIFIED rather than derived**, still `false`, and
  lines 70-72 from *"so the answer there is SPECIFIED…"* onward are **still true** and may stand;
  (iii) give the reason that actually holds, which is **not** about the generator being wrong but about
  the predicate **never consulting the generator at all** — running it costs ~14x a bare key on the
  nodes that reach it (`ADR-0005`), so `hasLegalEnPassant` synthesises its own probe and must establish
  its own preconditions, and specifying rather than deriving is what keeps the hash independent of the
  generator; and (iv) **not** say "the oracle is sound now, so we agree with it", because that reads as
  making the guards optional and the measurement says the opposite — the agreement is **bought by guard
  (a)**, not inherited from the generator. Cite `ABC-022` the way 102-107 already does.

  **What must NOT be rewritten — the 104-105 trap, and the sweep found three more of it.** Each was
  re-measured at this hop and each is **TRUE on the delivered tree**:

  - `src/legal.ts` **108-109**, *"Purity does NOT need it — make/unmake round-trips exactly when the
    captured pawn is genuinely there"*. Confirmed: with guard (a) deleted, `hasLegalEnPassant` stayed
    **pure on all 100,801 scored states**; with guard (b) deleted it is impure on the **first** state
    swept. Guard (b)'s justification is untouched by this ticket — it is about the predicate's own
    synthesised probe and has nothing to do with `generateMoves`.
  - `src/legal.test.ts` **286-289**, *"`generateMoves` reads an occupied ep target as an ordinary
    capture and never offers the ep move"*. **Still true, because those two rows carry ENEMY
    occupants**, which the ordinary-capture branch consumes and `continue`s past exactly as before.
    This sentence is one word away from site 4 and must survive it.
  - `src/legal.test.ts` **279-280**, *"Each one corrupts without it, permanently"* — a claim about the
    predicate without guard (b), measured true.
  - `src/zobrist.ts` **11-18** and this ticket's `## THE CORRECTION THIS TICKET CARRIES` — both
    re-derived at this hop and both intact; the four-row table there is unchanged by the fix, which is
    what it claims of itself.

  **The `A9` interaction, and `A9` does NOT move.** Site 4-6 land in `src/legal.test.ts`, an **existing**
  test file, so the engineer's chosen instrument — `git diff --name-only --diff-filter=M main --
  'src/*.test.ts'` being empty — **will go non-empty and must not be read as `A9` failing.** `A9`
  requires that *"no existing test is modified — verified at line level"*, and a comment-only edit
  modifies no test. **`A9`'s text is unchanged and is not re-litigated**; what changes is only the
  instrument, and the replacement is the one the engineer **already** applied to `src/legal.ts` at the
  first hop: every `+`/`-` line of `git diff main -- src/legal.test.ts`, stripped of its diff marker,
  must begin with optional whitespace and `//`. In addition the file's executable content must be
  **byte-identical**: no `it`, `describe`, `expect`, FEN string or table entry may change, and the
  suite's test count must stay at **439**. If any of that cannot be met, **stop and hand back** rather
  than widen `A9`.

  **Two corrections from the first hop, retained.** (i) The citation was `src/legal.ts:102-104`. The
  false claim occupied **102-103**; **104-105** is a **separate and TRUE** sentence and must not be
  rewritten — pointing the engineer at 104 invites an edit to a correct line. (ii) The criterion said
  the false claim *"will become true only when this ticket lands"*. Only its **conclusion** does. The
  **mechanism** clause stayed false after the fix: an own-colour occupant is never read "as an ordinary
  capture", because `src/moves.ts:177` requires `isBlack(target) !== black` and an own-colour occupant
  fails that test both before and after; the generator now rejects it as a **precondition violation** —
  a different reason. Both were satisfied by the delivered edit and are recorded so the reasoning is
  not lost.

  **Found by the sweep and deliberately FENCED, not folded in.** Naming these is part of the criterion;
  editing them is not, and none of them blocks `ABC-022`:

  - **`memory-bank/50-decisions/ADR-0005-…md` lines 133-138** carry the same falsified premise with two
    named witnesses — *"on `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` it corrupts the position it is asked
    about, and on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` `generateMoves` offers a pawn capturing onto a
    square occupied by the mover's own knight"*. **Both witnesses measured FALSE on the delivered
    tree** (first: `legalMoves` pure; second: zero ep moves offered). `ADR-0005` is **`accepted`**, and
    amending an accepted ADR is an **Architect** ruling on this board's own precedent — not BA/PM's,
    and not a comment's. **Flagged, unowned by this ticket, and `ADR-0005` is not reopened by it.**
  - **`plans/tickets/ABC-011-…md` lines 418-422, 522, 931 and 1147** carry the same premise. `ABC-011`
    is out of bounds for this ticket by the reciprocal-fence shape already used for the `ABC-010`
    half-(a) gap; **named here, edited nowhere.**
  - **`plans/board.md` (683-685, 743-744, 2431) and `memory-bank/60-progress.md` (275, 293, 314)** are
    **dated historical records** and describe `main`, where the defect is still live. They are not
    falsehoods today and they are the **merge/close hop's** to advance, not this one's.
  - **`src/legal.test.ts` line 202** — *"`legalMoves(...).some(...)` fails this on the second FEN
    (ABC-009)"* — is **false, but NOT falsified by this fix**: that FEN reads **PURE on `main` as
    well**, so the statement was already stale before this branch existed. Its label attributes it to
    `ABC-009`'s merge, which is an inference from the comment's own text and not something this hop
    verified against a commit. **Out of `A11`'s remit by construction; recorded so the next sweep does
    not re-find it and mis-attribute it.**

  **What this criterion does NOT claim.** That the falsified set is complete. It is a sweep of every
  comment and doc comment under `src/`, `plans/tickets/`, `plans/nfr-catalog.md`, `plans/board.md`,
  `memory-bank/` and `memory-bank/50-decisions/`, closed by `git grep` on the premise's own vocabulary
  and by reading each hit — but on this ticket every count so far has been a floor (pre-check 2, first
  BA/PM hop 7, engineer 8, this hop 11), and a sweep is not a proof.

## Dependencies

- **No blocking dependency.** The defective code is merged on `main` (`ABC-002`, `ABC-004`).
- **Not dependent on `ABC-009`**, and `ABC-009` does not close this. `ABC-009`'s `## Scope` bullet 1
  is written broadly — *"the position is byte-identical on return … for every position it accepts"* —
  but **every one of its acceptance criteria is a castling FEN**, so an engineer who builds `ABC-009`
  to its acceptance fixes `addCastlingMoves` and leaves half (b) live, with a green gate.
  **Updated 2026-08-09: `ABC-009` has now MERGED (`e644039`) and this is no longer a prediction.** All
  ten `## Reproduction` rows were re-measured on today's `main` after that merge and every one
  reproduces unchanged, so `ABC-009` closed no part of this ticket, exactly as written. The sentence
  "either may ship first" is spent; the remaining order-independence claim is unaffected.
- **Not dependent on `ABC-010`, and `ABC-010` as written does not fully gate this.** `ABC-010`'s
  scope rejects *"an en-passant square with no pawn that could have made the double push"*, which
  closes half **(b)**'s trigger at the boundary. It does **not** close half **(a)**'s: on
  `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` the double-push pawn (white, e4) **is** present and
  `ABC-010`'s stated check accepts the FEN. **Flagged for `ABC-010`'s refinement, not edited here.**
- **Not dependent on `ABC-011`**, which is merged. `ABC-011` made the **hash** immune to this class;
  it did not clean the generator, and its guards stay (see the correction above).
- **No sequencing constraint against `ABC-012` or any `EPIC-002` ticket.** Checked rather than
  assumed: `ABC-012`'s `## Dependencies` names `ABC-011` alone, its positions come from
  `newGame(initialFen)` supplied from inside the product, and nothing in its test notes is shaped
  around this defect.

## Security / NFR triggers

- **`NFR-001` — move generation throughput.** The fix lands inside `addPawnMoves`' capture loop,
  which runs for every pawn on every node — the search hot path, and a hotter path than `ABC-011`'s
  fix, which sat behind a caller's short-circuit. Measurable bar: `npm run perft` reports
  **≥ 1,000,000 nodes/sec** after the change and does not regress materially against the standing
  baseline of **6.04M–6.21M nodes/sec** (Apple M3, Node v24.12.0, darwin-arm64 — `UNKNOWN - verify`
  on any other hardware); the machine-independent quantity to report is the **ratio to the same
  measurement on the pre-fix tree in the same process**, which must be **≥ 0.98**. Deep perft stays
  **32/32 exact** (A8).

  **AMENDED 2026-08-09 — the METHOD is stale, not the target, and NO TARGET MOVES HERE.**
  `plans/nfr-catalog.md` was updated **on 2026-08-09**, five days after this ticket was cut, at
  `ABC-009`'s Security/NFR gate, carrying its **tenth instrument-limit correction**: the perft
  harness's **per-cell floor is ±2.0%** — not the ~±1% previously recorded — and the aggregate floor
  (~±1%) had never been characterised at all. A **per-cell** ratio bar of ≥ 0.98 therefore sits at
  roughly **half the instrument's resolution** and cannot carry a verdict on its own. The catalog's
  own resolution is to move the question **off the clock and onto a count**, the same move it had
  already made for `NFR-005`'s call-count sub-bar. This ticket adopts that route as the primary
  evidence and keeps the clock as a floor:
  - **Primary — a COUNT, not a clock.** Report how many times the added preconditions are
    **evaluated** and how many times they **reject** anything, then price the change by arithmetic and
    label it as arithmetic. **Measured at the correction hop on a copy outside the repository, over
    the standing 518,474-node walk: the added conditions are evaluated 331 times when they sit AFTER
    the `to === position.epSquare` test, and 216,269 times if placed before it — a ~650x difference
    that is the engineer's ordering choice to make deliberately — and they reject 0.** Zero rejections
    is expected by construction: 0 of 518,474 reachable nodes carry an occupied en-passant target.
  - **Floor — clock.** `npm run perft` **≥ 1,000,000 nodes/sec** still applies, and is ~6x clear.
  - **Ratio — clock, secondary.** The **aggregate** ratio ≥ 0.98 is kept. **No per-cell ratio claim is
    admissible**, and a single cell reading below 0.98 is not by itself a regression. If it is
    measured at all, the catalog's standing method applies: a `cmp`-verified byte-identical twin as a
    null control by identity, rotated cell and tree order, and a structurally-zero cell read first.
  - **Provenance of the baseline.** The **6.04M–6.21M** band is transcribed from
    `plans/nfr-catalog.md`'s `NFR-001` row and is still what that row says. **No throughput figure in
    this ticket is BA/PM's own — `npm run perft` has not been run by this role at any hop.** Note only
    that the catalog's 2026-08-09 header records a measured floor of **6,030,518 nodes/sec**,
    marginally below the bottom of that band, so a post-fix reading a little under 6.04M is inside
    recorded instrument behaviour and is not evidence of a regression. **`plans/nfr-catalog.md` is NOT
    edited by this ticket.**
- **No `NFR-005` trigger.** `src/zobrist.ts` and `src/legal.ts` gain no executable line, so the
  per-node key cost is untouched by construction. State that structurally; do not re-run the key
  benchmark to "confirm" it. *(Read `plans/nfr-catalog.md`'s standing caution before benchmarking
  anything here: carry a byte-identical twin as a null control, give the timing run its own process,
  and check a cell where the delta is structurally zero before believing the cell you care about.)*
- **No security trigger.** No user-supplied string reaches this module and there is no sink, no I/O
  and no trust boundary in `src/moves.ts`. The consequence is a wrong chess answer and a corrupted
  in-memory board — reliability, not security. Do not inflate it. *(Same classification the
  2026-07-29 architecture audit gave `ABC-009`.)*

## Test notes

The reproduction tables above are the tests. Four shapes, and they are not interchangeable:

1. **A table keyed on what is PRESENT on the target, not on what is missing.** This is QE's
   2026-08-03 lesson, earned on this exact code: two mutants survived 206 tests because the delivered
   table classified boards by what was *absent*. Include **at least two piece types and both
   colours to move** on the own-colour rows (A1), and **the same two axes on the enemy-occupant rows**
   (A5) beside them.
   **Corrected 2026-08-09:** this item used to close *"a table with only own-colour rows is passed by
   a fix that tests colour instead of emptiness."* **That is the same false claim `A5`'s old
   parenthetical carried, and it is retired for the same measured reason** — at the en-passant branch
   an emptiness test and a colour test are behaviour-equivalent (the ordinary-capture branch consumes
   every enemy occupant first), verified by exhaustion over the branch's whole input domain and over
   all 518,474 reachable nodes. The enemy rows earn their place against a different mutant, named in
   `A5`. Fixing `A5` alone would have left the false sentence sitting here.
2. **Purity asserted over the FULL position state** — all 128 board bytes and all five scalars —
   **not** via `toFen`. `toFen` cannot see an off-board square, and this project has already had one
   defect (a stray write to square 15) that `toFen` was blind to. Measured 2026-08-09, so this is now
   a fact rather than a caution: `toFen` also renders `epSquare` **32 (`a3`) and 40 (`0x28`,
   off-board) identically**, and hides **28 distinct `castling` bit values**.
   **Added 2026-08-09 — a purity row must not be SELF-MASKING.** The contract is stated across one
   whole `legalMoves()` call, and a corruption made by one move in that pass can be **healed by a
   later move in the same pass** that writes the same square. Measured on
   `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`: `d4e3` rewrites e4 from a black pawn to a white pawn, and the
   next move, `e4e3`, restores it, so the call-level oracle reads CLEAN on a position the generator
   provably corrupts. Choose rows where no other legal move touches the capture square, or assert per
   make/unmake pair as well. **All five rows named in `A3` were checked against this at the correction
   hop and none of them self-masks** — every one reads DIRTY across the call today. The `A1`, `A5` and
   `A6` rows in `A4`'s widened set are clean today and are regression guards, so whether a *future*
   corruption on one of them could be masked is **`UNKNOWN - verify`** and was not measured.
   **This does not widen `## Scope`**: the contract is still "byte-identical across a call"; this is
   how the table must be built to test it honestly.
3. **Prove each new assertion RED before the fix exists**, and prove each half load-bearing by
   deleting it: the empty-target condition alone and the captured-pawn condition alone should fail
   **disjoint** named sets. If deleting one fails nothing, the other is subsuming it and one of the
   two conditions is not the condition it claims to be.
4. **A regression walk, not a new perft position.** A7 is a walk of the existing table. **Do not add
   a perft position hoping to catch this** — perft provably cannot reach it (0 of 518,474 nodes), and
   a new perft case would cost minutes of CI for zero coverage of this defect.

Run the deep perft lane (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, ~38 s) **before** review,
not after: this ticket edits the generator, and 32/32 is the only exhaustive oracle that the change
is invisible to legal play.

## Size and priority rationale

**Size `S` (2).** Two conditions in one branch of one function (`addPawnMoves`), one test table, one
regression walk, and two comment corrections. No new module, no new export, no new dependency edge,
no design decision — the fix site, the preconditions and the oracle are all named above. Calibrated
against `ABC-009` (*"one guarded condition plus two test shapes"*, `S`) and against `ABC-011`'s
second hop, which Architect/Design sized as *"smaller than the delta that took it `S` → `M`"* for the
identical shape — two guard conditions plus six test cases plus two doc corrections. **Not `M`:**
this ticket has no design question, whereas what took `ABC-011` to `M` was a new exported predicate
and a ratified reading. **Not `XS`:** two independent preconditions with disjoint failure modes, in
the search hot path, with a mutation-hardened test table, is real work with real regression risk.

**Priority `P1`, and this is the ranking the Orchestrator's note left open.** Applying **this
board's own established `P0` test**, written by BA/PM on 2026-07-31 under the owner's legality-first
directive and never overturned — *"`P0` on this board now means the owner's directive applies **and**
the fault is reachable"*:

- **The directive applies.** This is a move-legality defect in `generateMoves`, the query that
  defines which chess moves exist. Not by analogy — the generator emits a capture onto the mover's
  own piece, and `legalMoves` passes it through.
- **The fault is NOT reachable.** Measured: **0 of 518,474 reachable nodes**. It needs a semantically
  invalid FEN, and no path in the product produces one today — `EPIC-003` is unbuilt and the only
  position any epic accepts is `ABC-012`'s `newGame(initialFen)`, supplied from inside the product.

**So this is `P1`, exactly where `ABC-009` landed on the same test on the same day, for the same
reason** — and ruling it `P0` would rank it *above* `ABC-009`, which is not defensible: `ABC-009`
corrupts through the castling route and `gameStatus` calls `legalMoves` on its first line every ply,
which is a strictly wider reachable surface than this one has. It sits **beside** `ABC-009` and
`ABC-010` — the three latent invalid-FEN defects in merged, `Done` code — not above them.

**It therefore does NOT go ahead of `ABC-012`**, which is `P0` and reachable. Said plainly because
the Orchestrator's routing note left that conditional open, and the honest answer to it is "no".

**Escalation trigger (do not leave this to judgment later).** ABC-022 rises to `P0` if **any** of
these fires:

- `EPIC-003` begins accepting a position from outside the rules core before this ticket or `ABC-010`
  lands — the same trigger `ABC-009` carries, unspent, for the same reason;
- `ABC-010` is deferred or descoped;
- any position reachable by legal play is shown to carry an occupied en-passant target — which would
  falsify the 0/518,474 measurement above and make this live rather than latent.

*Trigger status, 2026-08-04: **NOT fired.** `ABC-010` is neither deferred nor descoped, `EPIC-003` is
undecomposed, and the reachability walk reads 0.*

*Trigger status **RE-CHECKED 2026-08-09** at the correction hop, each clause against its own source
rather than against the line above: **still NOT fired.** `ABC-010` is in `Backlog` with
`status: backlog` / `priority: P1` — neither deferred nor descoped. `EPIC-003` has exactly one ticket
cut from it (`ABC-010`, the validation ticket) and nothing in it accepts a position from outside the
rules core. The reachability walk was re-run on today's `main` and still reads **0 of 518,474**.
`ABC-009`'s merge is **not** a trigger and does not fire one.*

## Definition of Ready

Problem ✅ (user, pain, value, with the mechanism read out of the source) · scope + out-of-scope ✅ ·
INVEST ✅ (independent — no unbuilt dependency, defective code merged on `main`; small — one branch of
one function) · acceptance measurable ✅ (exact `FLAG_EN_PASSANT` counts per named FEN on **both
colours to move**, byte-identical comparison over **128 board bytes and five scalars**, exact per-root
node counts, 32/32 zero tolerance, skip count 0) ·
dependencies ✅ (none blocking; the `ABC-009` / `ABC-010` overlaps named and bounded) · NFR triggers ✅
(`NFR-001`, an evaluation **count** with a named denominator plus a numeric floor, an aggregate ratio
and a named machine; `NFR-005` excluded structurally with the reason; no security trigger, with the
reason) · test notes ✅ · size `S` ✅ · priority `P1` ✅ ·
no blocker ✅

**Cut straight to `Ready` 2026-08-04 by BA/PM.** It qualifies on this board's own `Ready` test rather
than on its priority: it has **no unbuilt dependency at all** — the defective code is merged on
`main` — which is the exact criterion that keeps `ABC-015`..`ABC-019` and `ABC-021` in `Backlog`.

**AMENDED 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-022`) — the block above was dated 2026-08-04 and
nothing had re-checked it in five days. NO TICK IS FLIPPED**, and the amendment exists so the next
reader does not inherit an unaudited green. The re-check found **seven** corrections, **five of which
no pre-check had named**, and they are recorded where they live rather than summarised here:

- `acceptance measurable` was the row at risk and it now holds on stronger ground: `A2` widened to
  both halves; `A3` widened to **both colours to move**; `A4` restated against the state (128 bytes +
  five scalars) over **all ten** reproduction positions instead of three, with `toFen` removed as the
  oracle; `A5` widened to two piece types on both colours and its **false justification replaced** by
  the mutant it is measured to kill; `A11`'s line citation and expected outcome corrected; the
  `## Acceptance` preamble corrected. **Four of the seven are the same shape — a criterion narrower
  than this ticket's own `## Scope` — which is this board's recurring defect.**
- `test notes` amended: item 1's justification was the same false claim as `A5`'s and is retired;
  item 2 gains the measured `toFen` aliases and the **self-masking** row-selection rule.
- `security/NFR triggers` amended in **method only**: `NFR-001` predates `plans/nfr-catalog.md`'s
  2026-08-09 instrument-limit correction, so the per-cell ratio bar is demoted and a **count** is made
  the primary evidence. **No target moved and the catalog was not edited.**
- `dependencies` amended: `ABC-009` has merged and the reproduction was re-measured after it.
- **`problem clear`, `scope and out-of-scope clear`, `INVEST`, `size S`, `priority P1` and
  `no blocker` were re-checked and are unchanged.** Nothing found here pushes on scope, size or
  priority: the widened criteria bring the acceptance **up to** `## Scope`, they do not widen it, and
  the added rows are more rows in one existing table — the same calibration that made this `S`.
- Verified structurally at the correction hop: `src/moves.ts` md5 `0e247853ab2c05887c76105ff83d8621`
  unchanged, `git status --short -- src/` empty, `npm test` **381/381 on 16 files**, skip count **0**
  by the AGENTS.md command, perft fast lane **24/24**. **No `src/` file was edited, no test row was
  written, and no board column moved — `ABC-022` stays in `Ready`.**

## Implementation

**IMPLEMENTED `In Development → In Review` 2026-08-09 by the Software Engineer** (task
`ticket-to-pr-ABC-022`, subtask `engineer-abc022-implement`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-022`. `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; no limit
approached, no override taken, no written reason owed. **Nothing merged and nothing deployed — a
human holds both.**

**Nothing above this section was edited.** `## Acceptance` and its 2026-08-09 correction block,
`## Scope`, `## Out of scope`, `## Reproduction`, `## Dependencies`, the `NFR-001` bar, the
escalation block, `## Test notes` and the `## Definition of Ready` block all stand exactly as they
did at the pull. Every criterion was met as written; **nothing was bent in either direction — no
test was shaped to the code and no criterion was edited.**

### One production file changed, one comment-only file, one test file added, no existing test touched

`git status --short -- src/` reports exactly ` M src/legal.ts`, ` M src/moves.ts` and
`?? src/moves.enpassant.test.ts`. `git diff --name-only main -- 'src/*.test.ts'` is **empty** —
which is `A9`'s *"no existing test is modified, verified at line level, not by inspection"*, made
mechanical rather than argued. The new tests went into a **new** file for exactly that reason.

- **`src/moves.ts`** — `+24 −12`. The executable change is two conditions and one local `const` in
  the en-passant branch of `addPawnMoves`; the remaining lines are the comment at 183-186, rewritten
  for `A11`. md5 `0e247853ab2c05887c76105ff83d8621` → **`6335b452fc21ffe2d0f902ecab930840`**.
- **`src/legal.ts`** — `+6 −2`, **comment-only**, `A11`'s second half. Lines 102-103 corrected;
  **104-105 left byte-for-byte**. That no executable line changed was verified by filtering the diff
  for non-comment lines, not by reading it.
- **`src/moves.enpassant.test.ts`** — NEW, 208 lines, **58 tests**: `A1` (4 rows), `A3` (6), `A2`
  (10, the union of both tables), `A4` (32 — every position the file uses, asserted twice: across the
  call and per make/unmake pair), `A5` (4), `A6` (2).

### The fix

```ts
if (to === position.epSquare) {
  const capturedPawn = PAWN | (black ? 0 : BLACK);
  if (target === EMPTY && position.board[to - forward] === capturedPawn) {
    moves.push({ from, to, piece, captured: capturedPawn, flags: FLAG_EN_PASSANT, promotion: EMPTY });
  }
}
```

`to - forward` is the **same square `apply.ts`'s `enPassantCaptureSquare` derives** —
`move.to + (isBlack(move.piece) ? 16 : -16)` — read out of that file rather than re-derived, so the
generator and the applier cannot disagree about which pawn is being captured. `capturedPawn` is
hoisted into the local that the pushed move already used, so the byte the guard tests and the byte
the move claims are the same expression, not two expressions that happen to agree.

The clause is written as an **emptiness** test rather than a colour test. `A5`'s corrected text
already records that the two are behaviour-equivalent at this program point, so this is a
readability choice and not a behavioural one, and no criterion was asked to discriminate them.

### The ordering choice, made deliberately, with the alternative it rejected

The two conditions sit **AFTER** the `to === position.epSquare` test. Re-derived on this build with
counters at the guard site rather than inherited from the bar above:

```
conditions evaluated, shipped placement (after the epSquare test)  :     331
conditions evaluated, rejected alternative (before that test)      : 216,269   (653x)
times the two conditions rejected anything                         :       0
```

Both placements return an identical answer on every position, so this is purely cost and the cheap
one was taken. The figures reproduce this ticket's `NFR-001` numbers **exactly**, which makes them a
second independent derivation rather than a restatement.

**A measurement trap was caught mid-hop and is recorded rather than quietly corrected.** The first
counter run read `4,720 / 6,334,977` because the instrumented walk called `generateMoves` an extra
time at every node for its own diagnostic. The residual `4,720 − 4,389 = 331` is exactly the
ticket's figure; re-running on a plain `legalMoves`-driven walk reproduced `331 / 216,269 / 0`
directly. The instrument was inflating the denominator, not the code.

### Red before green, and each half proved load-bearing on disjoint named sets

`## Test notes` item 3 is discharged by measurement. **One OS process per tree state** (this board's
recorded `ABC-009` trap), every anchor asserted unique before writing, and **`tsc --noEmit` exit 0
on every tree before any red was believed** — including the unfixed control.

| tree | `src/moves.ts` md5 | tests failed |
| --- | --- | --- |
| unfixed control | `0e247853ab2c05887c76105ff83d8621` | **31** of 58 |
| delivered fix | `6335b452fc21ffe2d0f902ecab930840` | **0** |
| empty-target condition deleted | `6762b334bd096f8b1d072cb68478786d` | **8** — `A1`, `A2` |
| captured-pawn condition deleted | `2f19080b1bf32fc1f72bd063f48ea3f3` | **23** — `A3`, `A2`, `A4` |
| colour-shaped restructure | `dd5b7ab68fe2a7f2a1ec2cd80740c251` | **4** — `A5` only |

The intersection of the two half-deletion sets is **EMPTY** and their union is **exactly** the 31
reds, byte-compared. Neither condition subsumes the other. `A2` is reached by both halves but never
on the same row, so disjointness holds at the level the ticket asks for — named tests, not criteria.

The 27 tests that passed on the unfixed control are exactly `A5`'s four rows, `A6`'s two controls
and the purity rows that are clean today, which confirms **on the tip** that `A5`–`A6` are
regression guards rather than reds, as the corrected preamble says.

### `A5` re-verified against the delivered table rather than inherited

The colour-shaped restructure was rebuilt here against this file — own-colour rejected at the top of
the loop, the ordinary-capture `continue` dropped, so every enemy occupant falls into the en-passant
branch. It typechecks clean, passes `A1`, `A2`, `A3`, `A4` and `A6`, passes the **whole existing
suite 381/381** — and fails **only** `A5`, on **all four** rows. The widened piece types and colours
are doing work; `A5` is not inert and was not deleted.

### `A7`, walked before and after

One process per tree, roots and `fast` depths **parsed out of `src/perft.test.ts`** rather than
retyped, every FEN printed and re-parsed before any verdict:

```
startpos    206604   kiwipete     99950   position-3  46256
position-4    9738   position-5   63910   position-6  92016     TOTAL 518474
ep offered onto an occupied square : 0 BEFORE and 0 AFTER
ep moves offered anywhere          : 4389 BEFORE and 4389 AFTER
```

Every per-root count is identical. The second line is stronger than the criterion asks for: the
en-passant move set itself is unchanged, so the fix rejects nothing reachable by legal play.

### `A4`, and the self-masking row

Purity is asserted over **all 128 board bytes and all five scalars, field by field**, never through
`toFen`, over **every position this file uses** — a strict superset of the `## Reproduction` tables.
It is **also** asserted per make/unmake **pair**, which is what catches the self-masking witness
`4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`: on the unfixed tree that row reads **GREEN across the whole
call and RED per pair**. `## Test notes` item 2's row-selection rule is therefore satisfied by
instrument as well as by row choice, and BA/PM's self-masking measurement is reproduced on a second,
independently built oracle.

### Gates, as they ran

Lint exit 0 after **one** autofix pass on this role's own new file (1 of 2 `self_fix_attempts`
spent); the two remaining `infos` are `biome.json`'s schema-version and deprecated `recommended`
field, **pre-existing and identical on `main`** — verified by stashing this work and re-running,
not assumed. Typecheck exit 0. `npm test` **439/439 on 17 files** (381/381 on 16 before, measured by
running the suite on the tip rather than by subtraction). Skip count **0** by the AGENTS.md command.
Perft fast lane **24/24**. `PERFT_DEEP=1 npx vitest run src/perft.test.ts` **32/32 exact in 36.55 s**,
run **before** hand-back as `## Test notes` requires. E2E `UNKNOWN - verify` — no UI surface until
`EPIC-006`.

### `NFR-001` / `A10` — met on every clause

The first throughput figures any role has taken on **this** ticket.

- **Primary, a count.** 331 evaluations, **0** rejections, denominator above.
- **Floor, clock.** `npm run perft` reads **6,393,713 nodes/sec** against ≥ 1,000,000 — ~6.4x clear.
- **Aggregate ratio.** **0.9926** against ≥ 0.98. Three trees, one OS process each, tree order
  rotated across three rounds, node count checksummed identical at 11,377,922 on every tree and
  round.
- **Why no per-cell and no per-run cost is claimed.** A `cmp`-verified **byte-identical twin** of the
  fixed tree read **0.9883** against the same pre-fix baseline and **0.9956** against the tree it is
  identical to. That deviation is 100% instrument, and it **exceeds** the 0.74% apparent cost of the
  change. The catalog's standing caution held again.
- `NFR-005` **not** measured — the exclusion is structural and this ticket says not to re-run the key
  benchmark to "confirm" it. `plans/nfr-catalog.md` **not** edited and no target moved.

Figures are Apple M3 / Node v24.12.0 / darwin-arm64 and `UNKNOWN - verify` on any other hardware.

### What was deliberately not touched

`src/legal.ts`'s two guards and `src/zobrist.ts` — untouched, and `## Out of scope`'s reasoning
stands. No perft position added (`## Test notes` item 4). `plans/nfr-catalog.md`, `ABC-010`,
`ABC-011`, `ABC-013` — untouched. **`ABC-023` — not edited and not re-pinned:** `src/moves.ts` moves
to `6335b452fc21ffe2d0f902ecab930840`, invalidating its `A4` hash exactly as the Orchestrator
recorded, and that is deferred by design to `ABC-023`'s own promotion hop. `## Scope`,
`## Out of scope`, size `S` and priority `P1` did **not** move and nothing in implementation pushed
on them.

### One item routed rather than absorbed — a candidate EIGHTH correction

`src/legal.ts` **lines 69-71** state: *"Outside it the oracle is unsound — `generateMoves` offers
en-passant captures onto squares occupied by the mover's OWN piece — so the answer there is
SPECIFIED rather than derived."* That is the **same class of false claim `A11` was cut for, in the
same file**, and **this fix makes it false**: after this ticket the generator enforces both
preconditions, so it no longer offers that capture and the sentence's mechanism clause no longer
holds.

It sits **outside `A11`'s cited 102-103** and outside this subtask's named boundary, which said
`src/legal.ts` gets a comment-only edit **for `A11`**. It was therefore **flagged rather than
silently rewritten** — but it should not ship as it stands, and it belongs to BA/PM as an eighth
correction or to a follow-up ticket. Flagging it is a judgement about scope, not a measurement:
the falsity is measured, the decision to leave it is not.

### SECOND ENGINEER HOP 2026-08-09 — the widened `A11` applied, sites 3-6, comment-only

Subtask `engineer-abc022-a11-apply`, same branch. **No board move: `ABC-022` stays in `In Review`
(1/3).** `## Acceptance` was **not** edited — `A11` is BA/PM's and this hop implements it. `A1`–`A10`
were not re-derived and `NFR-001` was not re-measured: a comment-only change cannot move throughput,
and saying so structurally is the honest move rather than re-running a lane to restate a number.

**Not one executable line changed, in any file.** `src/moves.ts` is byte-unchanged at md5
`6335b452fc21ffe2d0f902ecab930840`. Two files were touched, both comment text only:

- **`src/legal.ts` 68-72 (site 3)** — the unsoundness premise and its mechanism clause **deleted, not
  softened**; the *SPECIFIED rather than derived* conclusion **kept**; the reason that actually holds
  put in its place — the predicate **never consults `generateMoves`**, so it owns its own
  preconditions and the key stays independent of the generator. It explicitly does **not** say "the
  oracle is sound now, so we agree with it": the paragraph records that the off-domain agreement is
  **bought by guard (a)**. md5 `aa645c6964ed902489425150e3879fd8` → `7be9fc8c1c313bdbc4c582040965c2eb`.
- **`src/legal.test.ts` 268-269, 368-371, 373-374 (sites 4-6)** — the same premise removed at all
  three, each rewritten to the measured post-fix picture. md5
  `424cbd57dde9232749eb9247f5e627b5` → `72fa550c347510c506f174693358314a`.

**`A9` on the replacement instrument.** The file-level filter now goes non-empty by design
(`--diff-filter=M main -- 'src/*.test.ts'` = `src/legal.test.ts`), which is the collision `A11`
predicted and not a breach. The line-level filter replaces it: all **21** changed lines of
`src/legal.test.ts`, stripped of the diff marker, begin with optional whitespace and `//` — **0**
exceptions — and the file's executable content is **byte-identical to `main`** (`cmp` on the
comment-stripped file, 292 lines; `it` 21, `it.each` 2, `describe` 7, `expect` 40, every FEN and
table entry unchanged). The same filter over the whole branch diff of `src/legal.ts` is 21 changed
lines, **0** non-comment, and its executable content is byte-identical to `main` at 64 lines.
`npx vitest run src/legal.test.ts` is **31/31 green unmodified before and 31/31 after**.

**The four fenced-TRUE statements survived**, asserted mechanically rather than by reading:
`src/legal.ts` 108-109, `src/legal.test.ts` 286-289 (the ENEMY-occupant rows) and 279-280 are each
present once, identical to `main`, and appear in **no** changed line; `src/legal.test.ts` 202 —
false but already false on `main` — was likewise left alone.

**Re-measured at this hop, not inherited.** Three tree copies (`main`, the branch tip, and the tip
with guard (a) deleted), one OS process each, `tsc --noEmit` exit 0 on all three before any result
was believed, every FEN printed and re-parsed. The oracle
`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)` answers **`true` on all four**
`EP_CONTRADICTED_BY_THE_WRONG_PIECE` rows on `main` and **`false` on all four** on the tip, which is
what makes sites 5 and 6 false. Deleting guard (a) from the fixed tree — `src/legal.ts` md5
`450cd8cd839a0d3514395512c743e05c`, **byte-equal to BA/PM's own mutant** — puts the predicate back at
`true` on exactly the boards where the oracle says `false`, so the agreement is bought by guard (a)
and not inherited. The 131,072-state exhaustion behind the 447 figure was **not** re-derived and is
carried as BA/PM's.

**Line citations drift, and it is named rather than left to be re-found.** The corrected paragraphs
are longer than the ones they replace, so every `A11` citation below the edits moves. `A11` is BA/PM's
and was not edited to follow them; the map as of this hop is: `src/legal.ts` site 3 was 69-70 and is
now the paragraph at **68-77**; the already-satisfied site 2 comment starts at 102 → **107**; the
fenced *"Purity does NOT need it"* was 108-109 → **113-114**. `src/legal.test.ts` site 4 was 268-269 →
**267-272**, site 5 was 368-371 → **370-375**, site 6 was 373-374 → **377-379**; the fenced *"Each one
corrupts without it, permanently"* was 279-280 → **282-283** and *"reads an occupied ep target as an
ordinary capture"* was 286-289 → **289-292**. The out-of-remit line 202 does not move.

**Gate:** full suite **439/439 on 17 files**, skip count **0**, lint / typecheck / build exit 0.
`PERFT_DEEP=1` was **not** run and no throughput figure was taken — `src/moves.ts` is byte-identical
to the tree hop one measured, so `A8` and `A10` cannot have moved, and no number is reported here
that this hop did not measure.

### `A11` IS NOT FULLY DISCHARGED — site 7 is blocked by this subtask's own boundary

**Site 7 (`src/moves.enpassant.test.ts` 4-9 / 27-28) was NOT applied.** `A11`'s enumeration is closed
at five open sites and this subtask's brief bounds the hop to *"comment text only, in `src/legal.ts`
and `src/legal.test.ts`. No other file under `src/`"*, naming `src/moves.enpassant.test.ts`
explicitly as not to be touched. Those two instructions cannot both be satisfied. The specific
boundary was obeyed and the conflict is **escalated rather than absorbed or worked around**: the
Orchestrator either lifts the boundary for that one comment-only edit, or BA/PM drops site 7 — which
BA/PM already recorded as cheap to overrule, site 7 being a judgement about tense in a
red-before-green header rather than a doc comment describing shipped design. Sites 3-6 are the ones
that made `src/legal.ts` contradict itself 33 lines apart, and that contradiction is now gone.

### THIRD ENGINEER HOP 2026-08-09 — site 7 applied, and `A11` IS NOW FULLY DISCHARGED

Subtask `engineer-abc022-site7`, same branch. **No board move: `ABC-022` stays in `In Review` (1/3).**
`## Acceptance` was **not** edited — `A11` stands exactly as BA/PM wrote it, and it was not reduced.
The Orchestrator lifted the file boundary the hop above escalated; **the section above stays as the
record of that hop and is superseded on its one open point only.**

**One file, comment text only: `src/moves.enpassant.test.ts`.** md5
`825d079d8508ec01832e3b553b706e16` → **`90b45c567cafadd620599b7acaf5bec1`**. `src/moves.ts` is
byte-unchanged at **`6335b452fc21ffe2d0f902ecab930840`**, and `src/legal.ts`
(`7be9fc8c1c313bdbc4c582040965c2eb`) and `src/legal.test.ts` (`72fa550c347510c506f174693358314a`)
are byte-unchanged from the hop above — the settled work was not revisited.

**Site 7, the way `A11` asked and not by deletion.** The header's defect description is the file's
rationale and the reason its tables are shaped as they are, so it was kept and put in the **past
tense** — the tense `src/moves.ts` 183-195 already uses, by the same role at the same hop, which
makes the standard the project's own rather than this hop's. *"the generator offers a capture onto
the mover's own piece"* → *"offered"*; the half-(b) *"the move is emitted … the 'restore' CREATES
one"* → *"was emitted … CREATED one"*; *"the call reads CLEAN on a board the generator provably
corrupts"* → *"read CLEAN on a board the generator was provably corrupting"*.

**And it does not swing the other way.** A six-line paragraph was added saying the generator CHECKS
both preconditions now — *"which is these tables' job and not a reason to retire them"* — with the
mutant counts that prove the tables still bite, and the pair-level oracle is explicitly kept
(*"the one that saw it, and it stays for the same reason the tables do"*).

**TWO FURTHER SITES IN THE SAME FILE, not in `A11`'s table, found by reading it line by line.**
Both are present-tense claims about the generator that this fix falsified, so both fall under
`A11`'s binding clause — *no comment under `src/` states, as current behaviour, anything about
`generateMoves`'s en-passant branch that this fix has made false* — even though the sweep's citation
table lists only 4-9 / 27-28:

- **82-83** (the `A1` table comment) — *"**Today** every row offers the capture and `legalMoves`
  passes it through"*. Measured 1/1 before the fix and **0/0 after**, on all four rows.
- **95-97** (the `A3` table comment) — *"the black-to-move mirror that **creates** a phantom WHITE
  pawn"* and *"the self-masking witness whose corruption **is healed** later in the same pass"*.

Both were past-tensed and nothing else about them changed. They are inside this hop's stated
boundary (comment text in this file) and are named here rather than absorbed silently: a reviewer
who reads `A11`'s table as exhaustive can revert two sentences at no cost.

**Re-measured at this hop, not inherited.** Four tree copies outside the repository, **one OS
process per tree**, `tsc --noEmit` **exit 0 on every tree before any result was believed**, every FEN
printed and **re-parsed** (a FEN that does not render back identically aborts the probe):

```
tree                         moves.ts md5                        what it is
t-pristine  (main)           0e247853ab2c05887c76105ff83d8621    git archive main src
t-fix       (branch tip)     6335b452fc21ffe2d0f902ecab930840    git archive HEAD src, diff-verified
t-fix-noEmpty                6762b334bd096f8b1d072cb68478786d    empty-target condition deleted
t-fix-noPawn                 2f19080b1bf32fc1f72bd063f48ea3f3    captured-pawn condition deleted
```

| rows | `main` | branch tip |
| --- | --- | --- |
| the four own-colour-occupant rows | `gen_ep=1 legal_ep=1` each | **`gen_ep=0 legal_ep=0`** each |
| the six no-captured-pawn rows | `gen_ep=1`, impure across the call on 5 of 6, **1 dirty make/unmake pair each** | **`gen_ep=0`, pure, 0 dirty pairs** |
| the four ENEMY-occupant rows | `gen_ep=0` | `gen_ep=0` — unmoved, so *"Already 0 today"* at 109 stays TRUE and was not rewritten |
| the two `A6` controls | `1/1` and `1/0` | `1/1` and `1/0` — the fix still does not over-reject |

The self-masking sentence was traced move by move on `main`: e4 holds byte `9` (black pawn), **move
#2 is the en-passant move and leaves e4 at `1`** (white pawn) after its unmake, **move #3 — literally
the next move in the same pass — restores `9`**, and the pass ends clean. That is why the corrected
sentence still says *"the very next move"*. Half (b) was traced the same way on
`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1`: d5 is empty, and after the ep make/unmake pair d5 holds `9` — the
restore **created** a pawn. On the tip that row offers no ep move at all.

**The two mutant counts in the new paragraph are this hop's own**, taken because a comment that
carries a number is a number this role owns. Each mutant was an **anchored single edit** asserting
`count == 1` before writing and asserting the file changed after; both mutant md5s came out
**byte-equal to the first engineer hop's**, which corroborates that hop rather than restating it.
`npx vitest run src/moves.enpassant.test.ts`: **58/58 on the fix**, **8 failed** on `t-fix-noEmpty`
(A1 x4, A2 x4) and **23 failed** on `t-fix-noPawn` (A2 x6, A3 x6, **A4 x11**). The A4 rows are why
the paragraph can say `undoSpecial` is the unguarded half: `undoSpecial` (`src/apply.ts` 106-111) is
untouched by `ABC-022` and still writes `move.captured` back on any `FLAG_EN_PASSANT` move, so when
the generator emits one the purity rows are what notice.

**`A9` on the line-level filter, and this file's claim is the stronger one.** At **file** level
`src/moves.enpassant.test.ts` is still an ADDITION relative to `main`
(`git diff --name-only --diff-filter=A main -- 'src/*.test.ts'`), so it modifies no existing test at
all; `--diff-filter=M` returns only `src/legal.test.ts`, the collision `A11` predicted. At **line**
level, against the pre-hop file: **37 changed lines, 0 that are not comment lines**; comment-stripped
content **`cmp`-IDENTICAL at 138 lines**; `it(` 2, `it.each` 6, `describe(` 6, `expect(` 14, `toBe(`
13, `4k3/` 16, ` w - ` 9, ` b - ` 8 — every count identical before and after. No FEN, no table entry
and no expected number moved.

**Citation drift, this hop's shifts.** `A11`'s `src/legal.ts` and `src/legal.test.ts` citations do
**not** move — that file pair was not touched. Inside `src/moves.enpassant.test.ts`, everything from
old line 34 down is **+9**. Site 7's own two ranges: **4-9 → 4-10** (half (a)) with half (b)
**10-13 → 11-14**, and **25-28 → 33-37**; the added paragraph is **16-21**. The two extra sites:
**82-83 → 91-92** and **95-97 → 104-106**. The `A5` comment is **108-119 → 117-128** and its fenced
*"Already 0 today"* is **109 → 118**. `A11` was **not** re-pinned to any of this: its quoted
sentences are the stable key and the line numbers are the fragile part.

**Gate:** full suite **439/439 on 17 files**, skip count **0** by the AGENTS.md command, lint /
typecheck / build exit **0** (lint's 2 infos are the pre-existing `biome.json` ones; **no autofix
pass was needed or run**, so 0 of 2 `self_fix_attempts` were spent). `PERFT_DEEP` was **not** run and
**no perft or throughput figure is reported** — not one executable line changed in any file and
`src/moves.ts` is byte-identical to the tree `A8` and `A10` were measured on, so neither can have
moved; running the deep lane would have bought a restatement of an earlier hop's number, and
reporting that number as this hop's would be worse.

**One item flagged and deliberately NOT fixed (rules 9 and 12).** `src/moves.castling.test.ts` **7-10**
says, in the present tense, *"`generateMoves` offers a `FLAG_CASTLE` move the rules forbid, and
`legalMoves` … writes a king onto a square that never held one"*, and **98-99** says *"**Today** one
`legalMoves` call DESTROYS the occupant and writes a king of the moving side over it"*. Measured on
the delivered tree: `4k3/8/8/8/8/8/8/K6R w K - 0 1`, `4k3/8/8/8/8/8/8/K3B2R w K - 0 1` and
`4k3/8/8/8/8/8/8/K3b2R w K - 0 1` all give **0 castles offered and a pure `legalMoves` call**, so both
sentences are false. **They are out of `A11`'s remit by construction** — `ABC-009`'s fix falsified
them, not this one — exactly as `src/legal.test.ts` 202 was fenced, and out of this hop's boundary.
**Not edited.** The pattern behind all three is worth a retro rather than a ticket: a red-before-green
test header written in the present tense and never re-tensed when it went green.

## Board history

Every `plans/board.md` entry ever written about this ticket — column entries and exits, the WIP
counts at each move, and what each gate recorded — is in
[`history/ABC-022-board-history.md`](history/ABC-022-board-history.md) (20,896 bytes), moved there **verbatim** on 2026-08-10 when the board
was tidied. It is not duplicated on the board and nothing was summarised or dropped.
