---
id: ABC-022
title: generateMoves offers en-passant captures its own preconditions forbid
status: ready
column: Ready
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
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1        e5d6 filtered      valid, capturer pinned — legalMoves 0
```

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

**518,474 / 81,397 is the sixth independent reproduction of that figure on this project** (design,
dev, QE, design-2, dev-2, and now this) — the cross-check that the walk is the same population the
prior hops measured. The defect is **latent**: it needs a semantically invalid FEN, and no path in
the product produces one today.

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

Each criterion is a currently-failing test that must go green, except where marked as a regression
guard. The parenthetical is the measured behaviour on `main` today.

- **A1 (half a, piece-agnostic).** **Given** each FEN in a table that places a piece of the **mover's
  own colour** on the en-passant target — at minimum `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`,
  `4k3/8/3N4/3pP3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1`, i.e. **at least
  two distinct piece types and both colours to move** — **when** `generateMoves` runs, **then** the
  count of returned moves carrying `FLAG_EN_PASSANT` is **exactly 0** for every row.
  *(Today: exactly 1 for every row.)*
- **A2.** **Given** the same table, **when** `legalMoves` runs, **then** the count of returned moves
  carrying `FLAG_EN_PASSANT` is **exactly 0** for every row. *(Today: exactly 1 for every row — the
  legality filter does not reject it.)*
- **A3 (half b).** **Given** each of `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`,
  `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` and `4k3/8/8/3PP3/8/8/8/4K3 w - d6 0 1`, **when**
  `generateMoves` runs, **then** the `FLAG_EN_PASSANT` count is **exactly 0**. *(Today: exactly 1
  each.)*
- **A4 (half b, the purity half).** **Given** those same three FENs, **when** `legalMoves` is called
  once, **then** `toFen(position)` afterwards equals the input FEN **byte-for-byte** and all 128
  board bytes are unchanged. *(Today: a phantom black pawn on a2 / d5, and a white d5 pawn rewritten
  black.)*
- **A5 (regression guard — must stay green, and must be present).** **Given**
  `4k3/8/8/8/3pP3/4N3/8/4K3 b - e3 0 1` and `4k3/8/3n4/3pP3/8/8/8/4K3 w - d6 0 1` — an **enemy**
  piece on the target — **when** `generateMoves` runs, **then** the `FLAG_EN_PASSANT` count is
  **exactly 0**. *(Today: already 0. Named so the fix is not written as "reject own-colour
  occupants", which would leave this passing by accident rather than by the rule.)*
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
- **A11 (documentation).** **Given** `src/moves.ts` after the fix, **then** the en-passant comment at
  lines 183-186 states preconditions the code below it actually enforces; **and given**
  `src/legal.ts:102-104`, **then** its claim that *"with the target occupied, `generateMoves` reads
  the square as an ordinary capture and never offers the ep move"* is corrected — it is false today
  for an own-colour occupant, which is precisely half (a), and it will become true only when this
  ticket lands. *(A comment-only edit to `src/legal.ts`; no executable line there changes.)*

## Dependencies

- **No blocking dependency.** The defective code is merged on `main` (`ABC-002`, `ABC-004`).
- **Not dependent on `ABC-009`**, and `ABC-009` does not close this. `ABC-009`'s `## Scope` bullet 1
  is written broadly — *"the position is byte-identical on return … for every position it accepts"* —
  but **every one of its acceptance criteria is a castling FEN**, so an engineer who builds `ABC-009`
  to its acceptance fixes `addCastlingMoves` and leaves half (b) live, with a green gate. The two
  tickets touch different functions and either may ship first.
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
   colours to move** on the own-colour rows, and keep the enemy-occupant rows (A5) beside them — a
   table with only own-colour rows is passed by a fix that tests colour instead of emptiness.
2. **Purity asserted over the FULL position state** — all 128 board bytes and all five scalars —
   **not** via `toFen`. `toFen` cannot see an off-board square, and this project has already had one
   defect (a stray write to square 15) that `toFen` was blind to.
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

## Definition of Ready

Problem ✅ (user, pain, value, with the mechanism read out of the source) · scope + out-of-scope ✅ ·
INVEST ✅ (independent — no unbuilt dependency, defective code merged on `main`; small — one branch of
one function) · acceptance measurable ✅ (exact `FLAG_EN_PASSANT` counts per named FEN, byte-identical
128-byte board comparison, exact per-root node counts, 32/32 zero tolerance, skip count 0) ·
dependencies ✅ (none blocking; the `ABC-009` / `ABC-010` overlaps named and bounded) · NFR triggers ✅
(`NFR-001`, numeric bar with a ratio and a named machine; `NFR-005` excluded structurally with the
reason; no security trigger, with the reason) · test notes ✅ · size `S` ✅ · priority `P1` ✅ ·
no blocker ✅

**Cut straight to `Ready` 2026-08-04 by BA/PM.** It qualifies on this board's own `Ready` test rather
than on its priority: it has **no unbuilt dependency at all** — the defective code is merged on
`main` — which is the exact criterion that keeps `ABC-015`..`ABC-019` and `ABC-021` in `Backlog`.
