---
kind: adr
id: ADR-0005
---
# ADR-0005: En-passant availability is a legality question, and the hash module asks the rules

## Status

**accepted** — 2026-08-03 by Architect/Design at `ABC-011`'s **second** design hop (task
`ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`), **with the
amendment recorded below**. Proposed 2026-08-02 by the same role at the first design hop.

**Scope of this ADR, stated because it was read wider than it is.** It decides how the **en-passant**
component of the Zobrist key is computed. It does **not** decide anything about the castling
component, and the inference "if en-passant availability is a legality question then castling must be
too" does not follow from it — see **`ADR-0006`**, which answers that question separately and
reaches the opposite conclusion for reasons in the Laws' own wording.

### The authority for ratification

The standing rule *"no agent may mark an ADR `accepted`; a human must"* was **retired by the project
owner on 2026-08-03**, quoted verbatim and read out in full in `memory-bank/60-progress.md` under
**"Standing directive — who decides"**. The owner's stated reason is verifiability: a decision goes
to the role that can actually check it, and they decline to rubber-stamp technical content they
cannot. Architecture decisions, including ADR ratification, are Architect/Design's. `ADR-0004` stops
being the recorded exception and becomes the ordinary case.

**Ratifying carries owning.** The falsifiers below are part of the ratification, not decoration:
each clause names the observation that would overturn it, and every one of them is checkable by a
later reader without trusting this file.

### This is a ratification WITH an amendment, and the amendment matters

One statement in this ADR was **false as written**. Its Consequences described a predicate that
"plays a move and takes it back" — implying restoration — and the shipped implementation of clause 3
does not restore on every input. QE found it at the `In Review` gate; Security/NFR sized it MEDIUM
and non-blocking. Accepting the file unchanged would have ratified a false sentence. So:

- **Decision clause 6 is NEW** (the probe's precondition), and it is **decided but not yet built** —
  `ABC-011` carries the build, exactly as `ADR-0002` clause 2 was ratified ahead of its history
  module.
- The Consequences section gains **"The precondition, and the defect that produced it"**.
- Clauses 1–5 are accepted unchanged, on evidence three delivery gates established and the second
  design hop re-derived independently.

**`ABC-011` was never blocked on this ADR** and is not blocked now: the authority for the ruling is
the ticket's own delegation of the question to Architect/Design by name. If this is later amended or
rejected, see **Rollback** — the reversal is one condition in one function, one import, and one
predicate.

## Context

`src/zobrist.ts:71` XORs the en-passant file whenever `epSquare` is set. FIDE's test for "the same
position" is not "an ep square is written down" — it is whether the *possible moves* are the same.
The Laws text, retrieved and retained in this repo's shared context by BA/PM during task
`refinement-fide-9-6-1`:

> **9.2.3** Positions are considered the same if and only if the same player has the move, pieces of
> the same kind and colour occupy the same squares and **the possible moves of all the pieces of both
> players are the same**. Thus positions are not the same if: **9.2.3.1** at the start of the sequence
> a pawn **could have been captured** en passant.

`ABC-011` fixes that, and `ADR-0002` clause 2 (ratified 2026-07-30) makes the resulting key list the
substrate for **every repetition verdict in the product** — `EPIC-002`'s history, `EPIC-004`'s in-tree
repetition and transposition table, `EPIC-005`'s book probes, `EPIC-006`'s undo. So the key's
definition of "same position" is inherited by four epics, none of which is built yet.

`ABC-011` left one question open and assigned it here: **"available" has a board-only (pseudo-legal)
reading and a strict-FIDE (legal) reading, and they disagree on real positions.** `7k/8/8/K1Pp3r/8/8/8/8
w - d6 0 1` has 1 pseudo-legal ep capture and 0 legal ones — `cxd6` clears both c5 and d5 and exposes
the a5 king to the h5 rook along rank 5.

The question is architectural rather than incidental because of where the answer has to be computed.
`src/zobrist.ts` is a level-2 leaf importing only `src/position.ts`, and `ADR-0002` clause 3 has
`EPIC-004`'s transposition table computing a key **per node**. Deciding legality inside that function
changes both the module graph and the search's per-node cost.

## Decision

**1. "Available" means a LEGAL en-passant capture exists for the side to move.** The en-passant
component enters the key if and only if the side to move has a legal en-passant capture. This is the
FIDE reading, and it is what `ABC-011`'s own `## Scope` demands ("the same key **exactly** when FIDE
calls them the same position").

**2. The predicate lives in `src/legal.ts`, the module that already owns "is this legal", and
`src/zobrist.ts` imports it.** The hashing module asks the rules module a rules question; it does not
answer one itself. The defect being fixed is that `src/zobrist.ts` held a private and wrong notion of
a rules concept, and a second private notion — attack detection after a simulated capture — would
repeat that mistake in a subtler form.

**3. It is NOT implemented as `legalMoves(position).some(...)`.** The predicate examines at most the
two candidate from-squares. Measured, the `legalMoves` shape costs **1.98x per node amortized** and
**inherits `ABC-009`**: on `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` hashing corrupts the position it is
hashing, leaving a phantom white king on e1.

**4. It is NOT homed in `src/moves.ts`.** `isSquareAttackedBy` lives there and looks like the natural
home, but the predicate needs `makeMove`/`unmakeMove` and `src/apply.ts` already imports
`src/moves.ts`, so that home creates **this project's first dependency cycle** (`apply -> moves ->
apply`), verified by rebuilding the graph.

**5. The no-ep-square guard is short-circuit and comes first.** `zobristKey` tests
`epSquare !== NO_SQUARE` before asking anything, so the overwhelming majority of nodes execute exactly
what they execute today. This is load-bearing for `ABC-011`'s `NFR-005` bar, which requires the no-ep
path not be made slower **at all**.

**6. The probe move's precondition is checked BEFORE it is played.** *(Added 2026-08-03 at the
second design hop; decided, not yet built — `ABC-011` carries it.)* The predicate synthesises a
`Move` rather than taking one from the generator, so nothing else establishes that the move is
well-formed for this board. `unmakeMove` is an exact inverse only for a well-formed move —
`undoSpecial` writes `move.captured` back onto the capture square unconditionally, so if the board
never held that piece the write creates one, permanently. Before calling `makeMove` the predicate
must establish both:

- **(a)** the en-passant target square is empty, and
- **(b)** the square immediately behind it, on the mover's advance, holds exactly the enemy pawn the
  probe claims to capture.

When either fails, the position's en-passant square contradicts its own board, no en-passant capture
exists on that board, and the predicate returns **`false`** and touches nothing. **Purity is
unconditional** — it carries no domain qualifier, because a query that damages its argument is broken
whatever the argument means — while the *answer* is exact on the domain named in the Decision above.
The two conditions are not one guard: **(b)** buys purity, **(a)** buys agreement with the oracle,
and each is falsified by positions the other does not reach.

Deliberately not decided here, and left to the engineer: the predicate's exact name, its internals,
and whether it takes the ep square as a parameter.

### The domain of the oracle, made explicit

Clause 1's *"the FIDE reading"* and clause 3's oracle
`legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)` are exact **on positions whose
en-passant square the board does not contradict**. That domain contains every position `makeMove`
can produce and therefore everything reachable by play. **Outside it the oracle is not the
authority**, and this is measured rather than conceded: on
`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` it corrupts the position it is asked about, and on
`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` `generateMoves` offers a pawn capturing onto a square occupied
by the **mover's own** knight. Making the predicate track the oracle there would import a generator
defect into the hash; clause 6 specifies the behaviour instead.

## Alternatives

**Board-only (pseudo-legal) availability — cheapest, and the one this rejects.** "Is a pawn of the
side to move standing on a square from which the ep capture could be played?" Local to
`src/zobrist.ts`, no new dependency edge, `0.996–1.004x` amortized — free. It resolves `ABC-011`'s
headline reproduction identically, so it was a real candidate and not a straw man. Rejected on two
grounds. First, it is not the Laws: 9.2.3.1 says the pawn **could have been captured**, and a pawn
takeable only by an illegal move could not have been. Measured over the `src/perft.test.ts` table,
19,667 ep-setting moves, it violates the FIDE ground truth **862 times**; the strict reading violates
it **0 times**. Second and heavier: `ABC-011` was pulled ahead of `ABC-012` precisely to stop a wrong
definition of "same position" being encoded into a consumer's tests, and choosing this reading would
encode a *different* wrong definition into `ABC-011`'s own property test — spending the sequencing
win on a definition that is still not FIDE's.

**Strict, via the full legality filter.** One line, obviously correct, and disqualified twice over:
1.979x per node amortized (9.3x on the ep-set-no-capture shape, 13.9x when a capture is available),
which breaks the 1.5x bar outright; and it inherits `ABC-009`, so hashing mutates. Rejected on
measurement, not on taste.

**Strict, re-implemented inside `src/zobrist.ts`** (its own make/test/unmake, or a bespoke ray scan
for the two-pawns-leaving-one-rank case). One layer shallower — `zobrist` would sit at level 4 rather
than 5 — and it avoids the `legal.ts` edge. Rejected: it puts a second definition of legality in the
codebase, in the module whose first private definition is the defect. `ADR-0002` already names "two
representations of the same truth" as the place a bug will live.

**Normalize `epSquare` upstream** — clear it in `parseFen`/`makeMove` when no capture is available, as
several engines do, leaving `zobristKey` untouched and the graph unchanged. Genuinely attractive, and
rejected on a concrete consequence: `toFen` would then emit `-` where the FEN said `e3`, breaking the
byte-identical FEN round trip that `ABC-011`'s reproduction asserts and `src/fen.test.ts` covers. It
also changes `src/apply.ts`, which `ABC-011` puts out of scope.

**Widen `zobristKey`'s signature** so availability is the caller's problem. Forbidden by `ABC-011`'s
`## Scope`, and it pushes the question onto every caller including `EPIC-004`'s per-node one.

## Consequences

**The module graph.** `src/zobrist.ts` moves from level 2 to level 5 and `src/gameend.ts` from 5 to 6.
Verified by rebuilding the graph from `src/*.ts`: it **stays acyclic and stays exactly as deep**
(max depth 6, unchanged). `memory-bank/30-architecture.md`'s line
`position ← {fen, moves, zobrist} ← apply ← legal ← {gameend, perft} ← perft-bench` becomes **false**
and is owed an edit when the change lands, along with the Key-components table row that calls
`zobrist.ts` a hash of the board.

**`zobristKey` stops being a pure read of the board.** It joins `legalMoves`, `gameStatus` and `perft`
under the architecture's "transient mutation behind pure-looking queries" pattern: on the ~2% of nodes
that have a candidate ep capture it plays a move and takes it back. What that **forecloses**:

- hashing a `Position` you are not permitted to write to (a frozen, shared or borrowed one);
- hashing the same `Position` from two threads at once, which forecloses one shape of parallel search
  (`EPIC-004` has no threading decision on record — `UNKNOWN - verify`);
- reading `zobristKey` as evidence that a code path does not touch the board.

**Cost.** Measured on Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere,
interleaved against merged code in the same process: **1.014–1.022x per node amortized** over a
120,000-node pool at the perft table's natural ep frequency; **1.00–1.07x at `kiwipete` and startpos**,
the two positions `NFR-005`'s bar is anchored on, both of which have no ep square; **1.45–1.48x** on
the worst-case shape (an ep square with a capture actually available, 1.87% of pooled nodes).
Allocation **+2.3 B/call confined to that shape**, against the ~5 B/call of `bigint` intermediates
merged `zobristKey` already allocates. Under `NFR-005` as ratified — depth-in-budget — a cheaper node
buys depth, and this is 1.4–2.2% dearer per node in exchange for a key that means what the Laws say.

**`ADR-0002` is extended around, not amended.** Clause 1 (no new state on `Position`, make/unmake
history-free), clause 2 (the move list is the authority), clause 3 (the search keeps its own per-ply
key array, seeded once per search) and clause 4 (`positionCounts` has exactly one supplier and the
signature does not change) are all untouched — checked against the ratified text clause by clause at
the design hop. Clause 3's `9–23 ns/node` is the repetition scan *on top of* the key and does not
move; the ~300 ns key cost is a Context-table figure, not a clause proposition, and the ADR's ranking
of alternatives is unaffected because every option in it is measured on top of the same key.
**Therefore no human ratification was owed for `ABC-011` to proceed, and none was taken.** The
falsifier: if clause 3's "Zero allocation per node" is read as binding `zobristKey` rather than the
per-ply array, the +2.3 B/call brushes it — but the clause's subject is the array, and merged
`zobristKey` already allocates, so no such reading was ever true.

**The precondition, and the defect that produced it.** *(Added 2026-08-03.)* The first cut of clause
3's implementation synthesised its probe move without checking that the board agreed with the
en-passant square, and on that class `zobristKey` **permanently** mutated the position it was
handed — `4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gained a phantom black pawn on d5. Found by QE at the
`In Review` gate, sized MEDIUM and non-blocking by Security/NFR, and routed back here because
guarding it changes what the predicate *means* on that class rather than how it computes. Clause 6
is the ruling. Three things follow and are recorded so the cost of this ADR is not understated:

- **The claim "it plays a move and takes it back" is true only under clause 6.** Before it, the
  claim was false on positions whose en-passant square the board contradicts, and this ADR asserted
  it without qualification. That is the amendment.
- **The precondition is free where it matters and cheap where it does not.** Measured at the second
  design hop (Apple M3 / Node v24.12.0 / darwin-arm64, `UNKNOWN - verify` elsewhere): **zero** cost
  on the no-ep path and at both `NFR-005` anchor positions, because the caller's short-circuit never
  enters the predicate; **+0.9 to +3.0 ns per call** on the 15.70% of nodes carrying an ep square,
  which is **≤ +0.5 ns amortized per node**, under 0.15% of a ~317 ns key and below the resolution
  of a whole-key benchmark; and **20–27x cheaper** on the invalid class, where it returns before the
  make/unmake. **No `NFR-005` target moves.**
- **It changes nothing reachable.** Over an exhaustive 518,474-node walk of the `src/perft.test.ts`
  table (81,397 nodes with an ep square), neither condition fires once, no answer changes and no key
  changes.

**`ABC-011` is re-sized `S` → `M` and not split**, which is the re-size condition the ticket names for
exactly this branch of the decision. Clause 6 does **not** re-size it again: two conditions in the
same function, six test cases and two doc corrections sit inside the same `M`.

**What this does NOT change.** `zobristKey`'s signature; `Position`; determinism (the key is still a
pure function of the position, fixed seed, same value within and across runs); the make/unmake
round-trip property; `src/zobrist.test.ts:33-37`, whose fixture has a genuinely legal ep capture and
still asserts a true inequality unmodified; and `ABC-009`/`ABC-010`, which stay carried, are not made
worse, and are not fixed here.

## Rollback

Cheap now and it stays cheap, which is the honest reason this ADR is short.

The reversal to the board-only reading is: one condition in `src/zobrist.ts`, one import, and one
predicate deleted from `src/legal.ts`. The module graph returns to the recorded one. Both readings
satisfy `ABC-011`'s headline acceptance criterion and both regression guards, so a reversal costs the
ticket nothing except the 862 measured FIDE misses and the property test's oracle, which would have to
be re-pointed at `generateMoves`.

It gets dearer at exactly one moment: when the first consumer of the key list ships tests written
against this definition. `ABC-012` is that consumer and it is next in `Ready`. After it merges, a
reversal touches the history module's tests too — which is the same cost curve `ABC-011`'s own
escalation trigger was written about.

The trigger for reconsidering: a measurement on non-M3 hardware showing the per-node cost outside the
`NFR-005` budget, or `EPIC-004` choosing a parallel search shape that needs a hash function which does
not write to the board. Either one re-opens the *implementation* (a non-mutating attack test, at the
price of a second legality definition) before it re-opens the *reading*, because the reading is the
Laws and the Laws are not a performance decision.

## What would falsify this — the ratification's own terms

*(Recorded 2026-08-03. Ratifying carries owning: each clause names the observation that overturns it,
and every one is checkable by a later reader without trusting this file.)*

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **F1** | 1 — "available" means a LEGAL capture | a FIDE edition later than `E012023` that rewords 9.2.3.1 away from *"could have been captured"*, or an arbiter ruling that it means *"a double push had just occurred"* | re-fetch `handbook.fide.com/chapter/E012023` and diff against sha256 `e0c8bee28c2dee07b724357b9802fee8591e9d11efd2a910b38e9bd21d3c7643`, retained under task `refinement-fide-9-6-1`; and re-read the handbook index for a chapter after `E012023` |
| **F2** | 2, 4 — the predicate's home | any import path from `src/legal.ts` back to `src/zobrist.ts`, which would make the graph cyclic; or the max depth rising above 6 | rebuild the `from "./x.ts"` graph from `src/*.ts` and run cycle detection — done four times to date, acyclic at depth 6 every time |
| **F3** | 3 — not `legalMoves(...).some(...)` | **both** of its grounds falling together: a machine where the minimal predicate is not cheaper than the filter, **and** `ABC-009` fixed so the filter no longer corrupts. Either alone leaves the clause standing | re-run the per-call benchmark on that machine; `git log` for `ABC-009` |
| **F4** | 5 — the short-circuit comes first | `src/zobrist.nfr.test.ts`'s "zero `hasLegalEnPassant` calls on a no-ep position" assertion going red | `npm test` |
| **F5** | 6 — the precondition | a position **reachable by play** on which either condition fires. Measured at 0 over 81,397 ep-set nodes; if it is ever non-zero, the conditions are a behaviour change rather than a precondition and clause 6 is wrong as stated | walk the `src/perft.test.ts` table and count firings |
| **F6** | the whole ADR | `EPIC-004` choosing a parallel or frozen-position search shape that needs a hash which never writes to the board | `EPIC-004`'s threading decision, which does not exist yet (`UNKNOWN - verify`) |

**The falsifier this ADR already tripped once**, kept visible rather than tidied away: its
Consequences asserted restoration without a precondition, and QE's reproduction falsified it. That is
what the amendment is. An ADR that has been falsified once and corrected is worth more than one that
never named a way to be wrong.
