---
id: 20260802T214500Z-architect-design-decision-501d774b
kind: decision
by: architect-design
at: 2026-08-02T21:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-012
  - EPIC-004
  - EPIC-005
  - NFR-005
  - NFR-001
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - src/zobrist.ts
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
supersedes: 
---

# RULED: "available" means a LEGAL en-passant capture — the strict-FIDE reading

Design hop for `ABC-011`, answering the question the ticket assigns to this role by name under
`### Open design question — hand to Architect/Design at the design hop, do not decide in dev`.
Nothing else on the ticket was re-opened: the acceptance criteria, the reproduction FENs, the
`Out of scope` block and the `NFR-005` bar are untouched.

## The ruling in one line

**"An en-passant capture is available to the side to move" means a *legal* one exists** — the
strict-FIDE reading — and the predicate that decides it lives in `src/legal.ts`, the module whose
one job is already "is this legal". `src/zobrist.ts` imports it. It is **not** implemented as
`legalMoves(position).some(...)`, **not** re-implemented inside `src/zobrist.ts`, and **not** homed
in `src/moves.ts`.

Consequences taken with it, each settled below rather than left to dev: the ticket is **re-sized
`S` → `M`** (its own named condition), `ADR-0002` is **extended around and NOT amended** (so no
human ratification is owed for this ticket to proceed), and **`ADR-0005` is written `proposed`** for
the layering change — not on the amendment ground, and it does not block this ticket.

## Why the strict reading, and not the cheap one

**1. It is what the Laws say, and the Laws text is already in this repo's verified context.** BA/PM
retrieved and retained FIDE 9.2.3 during task `refinement-fide-9-6-1`
(`.grugops/context/refinement-fide-9-6-1/notes/20260802T210300Z-ba-pm-observation-2e7edd71.md`):

> 9.2.3 Positions are considered the same if and only if the same player has the move, pieces of the
> same kind and colour occupy the same squares and **the possible moves of all the pieces of both
> players are the same**. Thus positions are not the same if: 9.2.3.1 at the start of the sequence a
> pawn **could have been captured** en passant.

A capture that leaves your own king in check is not a *possible move*, and a pawn that can only be
taken by an illegal move **could not have been captured**. The board-only reading answers a
different question — "is a pawn standing where it could try?" — and the Laws do not ask that one.
This is not my reading of the Laws; it is the reading BA/PM already published against this ticket by
name, and I checked it against the same quoted text rather than re-deriving it.

**2. The ticket's own `## Scope` demands exactness, and board-only cannot reach it.** The Scope
headline is *"`zobristKey` gives two positions the same key **exactly** when FIDE calls them the same
position"*, and the bullet under it says the ep component is included *"only when an en-passant
capture is **actually** available"*. Choosing board-only would leave that headline unreachable and
would quietly narrow a requirement that is not mine to narrow.

**3. Measured, board-only is wrong on 862 real positions and strict is wrong on none.** Driven
read-only against merged `src/` from a scratchpad outside the repo. Over the whole `src/perft.test.ts`
position table, walked exhaustively, **19,667 ep-setting moves** were made and each resulting position
was hashed with its `epSquare` and with `epSquare` cleared, against the ground truth
`legalMoves(position).some(m => m.flags === FLAG_EN_PASSANT)`:

| reading | property violations against the FIDE ground truth |
|---|---|
| board-only (pseudo-legal) | **862** of 19,667 (4.38%) |
| strict (legal) | **0** |

Honest qualifier, because the number flatters my conclusion: **861 of the 862 come from
`position-3`** (`8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1`), a standard perft position built around
exactly the rank-5 king/rook geometry that makes an ep capture illegal. It is a biased population,
not a game frequency. Over all **518,474** nodes visited, the two readings disagree on **862**
(0.166% of nodes; 1.06% of the 81,397 nodes with an ep square set).

**4. The cost of the strict reading was assumed and is not what the ticket feared.** The ticket
prices the strict reading at `legalMoves`'s ~5,300 ns. That price is only paid by the *obvious*
implementation, which this ruling rejects. Measured on Apple M3 / Node v24.12.0 / darwin-arm64
(`UNKNOWN - verify` on any other hardware), 300k iterations per cell, interleaved forward and
backward so drift hits every variant equally:

| position shape | merged | board-only | **strict (minimal)** | strict via `legalMoves` |
|---|---|---|---|---|
| startpos — **no ep square** | 302.7–303.1 ns | 302.4–311.1 | **305.2–318.0** | 303.8–305.9 |
| kiwipete — **no ep square** | 313.7–317.2 ns | 316.6–321.0 | **312.8–334.7** | 313.3–314.9 |
| ep set, no capture at all | 319.8–325.7 ns | 327.2–345.7 | **333.4–351.9** | 2985.4–2989.8 (**9.3x**) |
| ep set, capture available | 315.3–317.2 ns | 321.0–321.3 | **458.6–465.8 (1.45–1.48x)** | 4395.7–4406.0 (**13.9x**) |

Amortized over a **120,000-node pool** collected from the same table at its natural en-passant
frequency (6.42% of nodes carry an ep square; 2.07% have a pseudo-legal ep capture — the only nodes
the strict predicate pays anything extra on; 1.87% have a legal one):

| reading | amortized per node | vs merged |
|---|---|---|
| merged `src/zobrist.ts` | 317.2–317.3 ns | 1.000 |
| board-only | 316.0–318.6 ns | 0.996–1.004 |
| **strict (minimal)** | **321.5–324.1 ns** | **1.014–1.022** |
| strict via `legalMoves` | 627.6–627.8 ns | 1.979 |

**`ADR-0002` clause 3 has `EPIC-004`'s transposition table computing a key per node, so the amortized
row is the row that matters there: the ruling costs 1.4–2.2% per node.** `NFR-005`'s bar in this
ticket is anchored at `kiwipete` / startpos — **both of which have no ep square** — where the ruling
measures 1.00–1.07x, inside noise and structurally free (the `epSquare !== NO_SQUARE` guard
short-circuits first, so the majority path executes exactly what it executes today). The
**1.45–1.48x** figure is the worst-case per-call *shape*, recorded here so the Security/NFR gate has
it in advance and does not have to discover it.

**5. The `legalMoves`-based implementation is disqualified on a ground beyond cost, and it is
measured.** On `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` — castling rights with no rook, plus an ep square
so the ep path actually reaches the filter — hashing through `legalMoves` **corrupts the position it
is hashing**, inheriting `ABC-009` in full:

```
before:  4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1
after:   4k3/8/8/3pP3/8/8/8/K3K3 w KQ d6 0 1     <- a phantom white king on e1
```

merged `zobristKey`, the board-only variant and the minimal strict predicate all leave that position
byte-identical (checked by `toFen` before and after). A hash function that alters what it hashes is
not a hash function; that is the second, independent reason the shape is ruled out rather than merely
priced.

## Why the predicate is homed in `src/legal.ts`

The dependency graph was rebuilt from the merged files rather than read off the audit, and each
candidate home was analysed:

| graph | cycles | max depth | `zobrist` level |
|---|---|---|---|
| today (merged `main`) | none | 6 | 2 |
| **RULED — predicate in `legal.ts`, `zobrist` imports `legal`** | **none** | **6** | **2 → 5** (`gameend` 5 → 6) |
| alt — `zobrist` does make/test/unmake itself (imports `apply` + `moves`) | none | 6 | 2 → 4 |
| rejected — predicate in `moves.ts` | **`apply -> moves -> apply`** | — | — |

Three things this settles that the ticket left open:

- **The DAG stays acyclic and stays exactly as deep.** The ticket says the module "moves down a
  layering the audit recorded as a clean acyclic DAG". True — and the layering stays clean: no cycle,
  max depth unchanged at 6. What changes is `src/zobrist.ts`'s own level, 2 → 5, and `src/gameend.ts`
  follows it, 5 → 6. `memory-bank/30-architecture.md`'s line
  `position ← {fen, moves, zobrist} ← apply ← legal` becomes **false** and is owed an edit at the dev
  hop.
- **`src/moves.ts` is a trap and is named so nobody walks into it.** `isSquareAttackedBy` lives there
  and looks like the natural home, but the predicate needs `makeMove`/`unmakeMove`, and `apply.ts`
  already imports `moves.ts` — so that home creates **this project's first dependency cycle**.
- **`legal.ts` over doing it inline in `zobrist.ts`,** even though inline is one level shallower.
  The defect being fixed is that the hashing module held its own private, wrong notion of a rules
  concept. Fixing it by giving the hashing module a second private notion of a rules concept — this
  time attack detection after a simulated capture — repeats the mistake in a subtler form. One home
  for "legal", and the hash asks it.

The price, stated plainly because it is the thing I would most regret: **`zobristKey` stops being a
pure read of the board.** It joins `legalMoves`, `gameStatus` and `perft` under
`memory-bank/30-architecture.md`'s "transient mutation behind pure-looking queries" pattern — it
plays a move and takes it back, on at most 2.07% of nodes. What that forecloses: hashing a `Position`
you are not permitted to write to, and hashing one from two threads at once. Neither is in any epic's
scope today (`UNKNOWN - verify` for `EPIC-004`, which has no threading decision on record), and both
belong on the record before someone assumes otherwise.

Allocation, since `ADR-0002` clause 3 talks about per-node allocation: measured at **+2.3 B/call and
confined to ep-capture-available nodes** (2.7 vs 0.4 B/call there; identical on every other shape).
That is noise against what `zobristKey` already allocates — every `key ^= …` allocates a `bigint`,
measured at ~5 B/call at kiwipete on merged code today.

## Alternatives rejected, each with the measurement that killed it

- **Board-only (pseudo-legal).** Cheapest (0.996–1.004x amortized), no new edge, keeps `S`. Rejected:
  862 FIDE misses over the perft table, and it would encode a non-FIDE definition of "same position"
  into `ABC-011`'s **own property test** — which is the exact failure mode this ticket's escalation
  trigger exists to prevent ("the defect stops being a bug and becomes an encoded assumption"). The
  ticket was pulled ahead of `ABC-012` for that reason; choosing board-only would spend that
  sequencing win on a definition that is still wrong.
- **Strict via `legalMoves(position).some(...)`.** Rejected twice over: **1.979x amortized** (breaks
  the 1.5x bar outright) and it inherits `ABC-009`'s corruption, reproduced above.
- **Strict re-implemented inside `src/zobrist.ts`** (bespoke ray scan or its own make/test/unmake).
  One level shallower, no `legal.ts` edge. Rejected: a second, subtly different definition of legality
  in the module whose wrong private definition is the defect.
- **Normalize `epSquare` upstream** — clear it in `parseFen`/`makeMove` when no capture is available,
  the way several engines do, leaving `zobristKey` untouched. Rejected on a measured ground:
  `toFen` would then emit `-` where the FEN said `e3`, breaking the byte-identical FEN round trip
  that this ticket's own reproduction asserts and that `src/fen.test.ts` covers. It is also outside
  the ticket's scope for `src/apply.ts`.
- **Widen `zobristKey`'s signature** to take availability as an argument. Forbidden by the ticket's
  `## Scope` ("`zobristKey`'s signature does not change"), and it would push the question onto every
  caller, including `EPIC-004`'s per-node one.

## `ADR-0002`: extended around, NOT amended — so no human ruling is owed

Checked clause by clause against the ratified text, not against a summary of it:

- **Clause 1** — core owns a position not a game; `makeMove`/`unmakeMove` stay history-free;
  `UndoRecord` stays caller-owned; **no new state on `Position`**. Untouched: no field is added, no
  signature changes, and the predicate is a query that leaves the position as it found it.
- **Clause 2** — one module owns `{initial position, Move[]}`, derived by replay. Untouched: this
  ticket builds no history module and changes no derivation.
- **Clause 3** — the search keeps its own preallocated per-ply key array, seeded once per search,
  scanned backwards by 2. Untouched. The clause's numbers are about the *repetition mechanism on top
  of the key* (9–23 ns/node), and that figure does not move. The key itself gets 1.4–2.2% more
  expensive amortized, but ~300 ns is a figure quoted in the ADR's **Context table**, not a clause
  proposition, and the ADR's conclusion ("cheaper is still better, in the same order") is untouched
  because every option in its ranking is measured *on top of the same key*.
- **Clause 4** — `positionCounts` has exactly one supplier and the signature does not change.
  Untouched: no new caller and no new sink for that map.

**The falsifier, stated in one sentence so a later reader can check it rather than trust it:** if
clause 3's "Zero allocation per node" is read as a proposition about `zobristKey` rather than about
the per-ply array, the measured +2.3 B/call on ep-available nodes brushes it and this ruling becomes
an amendment — but the clause's own sentence has the array as its subject, and merged `zobristKey`
already allocates ~5 B/call, so no reading of clause 3 that binds `zobristKey` was ever true.

Same disposition and same reasoning shape the `ABC-020` design hop used for clause 4 on 2026-07-31.
**No ADR is owed on the amendment ground, and no agent marked anything `accepted`.**

## `ADR-0005` is written anyway, and it is NOT a ratification blocker

`memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md`, status
**`proposed`**. Written because the *recorded architecture* changes: a maintainer reading
`memory-bank/30-architecture.md` will find the hash module listed as a leaf beside `moves.ts` and
will ask why it now imports the legality filter. That "why" needs a home outside a ticket, and the
choice forecloses things (a pure hash; hashing a position you may not write to), which is what a
Consequences section is for.

**No agent may mark it `accepted`, and this one did not.** `ADR-0004`'s delegated ratification is
explicitly not precedent and was not leaned on. **`ABC-011` is not blocked on it**, because the
authority for this ruling is the ticket itself — it assigns the question to Architect/Design by name
and says it is answered at the design hop — not the ADR, which records the same ruling for
durability. If a human amends or rejects it, the reversal is one condition in one function, one
import, and one predicate.

## Re-size: `S` → `M`, which is the ticket's own named condition

The ticket says: *"if the design hop takes the strict-FIDE reading of 'available', this ticket gains a
dependency edge and a per-call cost question on a function the search calls per node, and it should be
re-sized at that hop — at most `M`, and never split."* Taken exactly as written: **`M`, not split.**
It is still one condition in one function, but it now also carries a new exported predicate in a
second module, a new dependency edge, doc-comment corrections in two files, an edit to
`memory-bank/30-architecture.md`'s layering line, and one more test shape than the two the ticket
names. Calibrated below `ABC-005` (legality filtering, `M`) and above `ABC-009` (one guarded condition
plus two test shapes, `S`).

## What I could not settle, recorded rather than smoothed over

Carried into the `claim` note beside this one: every figure here is one machine; the ep-square
frequency in a real alpha-beta search is not the frequency in a perft walk; and the divergence
population is dominated by one deliberately-pathological position.
