---
kind: adr
id: ADR-0002
---
# ADR-0002: Game history ownership

## Status

**proposed** — awaiting ratification by a human. No agent may move this to `accepted`.

This ADR presents a decision; it does not take one. The 2026-07-29 architecture audit named
game-history ownership as the single most expensive-to-reverse decision still unmade, and both
audit agents declined to author it unilaterally. That stance is preserved here: what follows is a
recommendation with its evidence and its confidence, written so a human can ratify, amend, or
reject it in one reading.

Ratified by: `__________________`  on `__________`

## Context

The rules core owns *a position*. It does not own *a game*. Three facts in the merged code say so:

- `makeMove` hands its `UndoRecord` to the caller and keeps no stack (`src/apply.ts:122`).
- `gameStatus` takes an **optional, caller-supplied** `positionCounts?: ReadonlyMap<bigint, number>`
  and silently reports no repetition when it is omitted (`src/gameend.ts:87-90,106`).
- There is no move list anywhere in `src/`.

Four epics need the same history, for four different reasons:

| Epic | Needs | Why it must agree with the others |
|---|---|---|
| `EPIC-002` | last move, two-column SAN move history, material balance | status panel and history display |
| `EPIC-004` | repetition detection *inside* the search tree | a search blind to repetition will happily "win" by repeating |
| `EPIC-005` | the played line, to name the opening and probe the book | book exit must be seamless |
| `EPIC-006` | `undo` = two plies back, **with repetition counts rewound** | its own Risks section predicts exactly this corruption |

`EPIC-002` is next in line (`P0`, undecomposed) and owns the turn loop, so it is the epic that
will invent this first — ad hoc, because it only needs "last move" and "history to display".
`EPIC-004` would then build a second, incompatible notion of the path. `EPIC-006` would discover
the mismatch last. The failure mode is **silent**: a wrong draw verdict does not throw, it just
quietly ends a game that should continue, or fails to end one that should stop.

**The search path is the hard constraint.** `EPIC-004`'s scope includes a transposition table and
`RISK-002` already binds it to time-based iterative deepening. Repetition must be decided at every
node, at depth, where allocating or copying per node is unaffordable. `NFR-005` is currently
**missed** — the audit measured 163k-351k nodes/sec against a 500k target, with no evaluation
running at all — so there is no throughput budget to spend on an elegant-but-allocating history.

Measurements the decision rests on. The audit measured `zobristKey` at **306 ns** and
`legalMoves(kiwipete)` at **5,298 ns**, i.e. one full key costs ~5.8% of the generate-and-filter
work a search node already does; an independent Security/NFR run agreed at 288 ns and 5,263 ns.
Re-measured while writing this ADR (same machine class, Node v24.12.0, darwin/arm64, scratchpad
harness outside the repo, every variant asserted against the published perft counts):

| What | Measured | As a share of a ~5,000 ns search node |
|---|---|---|
| `zobristKey`, `legalMoves(kiwipete)` | 295-302 ns, 5,010 ns | 5.9% — confirms the audit |
| Repetition via a **per-ply key array** + bounded backward scan | **9-23 ns/node** on top of the key | **0.2-0.4%** |
| Repetition via a **shared `Map<bigint,number>`** with increment/decrement | **86-101 ns/node** on top of the key | **1.6-1.9%** |
| Worst-case backward scan (ply 20 / ply 40, clock never resets) | 29 ns / 62 ns | bounded by search depth, not by game length |
| History maintained inside the core's `makeMove`/`unmakeMove` | **4.13x - 4.21x** on `legalMoves` (+16.1 µs/node) | **fatal** |
| Deriving the whole history by **replaying the move list** (120 plies) | **41 µs**; undo = 44.5 µs | 0.089% of the 50 ms `NFR-003` keystroke budget |

Two of those numbers decide this ADR. The 4.2x is why history must not attach to the core's
make/unmake: `legalMoves` plays and takes back **every** pseudo-legal move (48 at kiwipete), so
anything hung on that pair is paid ~48 times per node rather than once. The 41 µs is why the
session layer needs no maintained history at all.

## Decision

**1. The rules core keeps owning a position, not a game.** `makeMove` and `unmakeMove` stay
history-free and `UndoRecord` stays caller-owned. They are the legality filter's inner loop, not
the game's move-application API. No new state is added to `Position`.

**2. One module above the core owns the game, and its authoritative state is the move list.**
A small history module (`src/history.ts`; the name is not the load-bearing part) owns exactly
`{ the initial position, Move[] }`. The undo stack, the key list, and the repetition counts are
**derived by replay, not maintained**. Deriving all of them costs 41 µs at 120 plies — 0.09% of
one keystroke budget — so incremental maintenance would buy nothing and would introduce the one
bug `EPIC-006` already predicts.

**3. The search does not share that structure, deliberately.** `EPIC-004` keeps its own
preallocated array of Zobrist keys indexed by ply, seeded once per search from the history
module, and scans it backwards by 2, bounded by the halfmove clock. Zero allocation per node,
9-23 ns/node. The seeding is once per *move*, not per *node*.

**4. `gameStatus`'s `positionCounts` gets exactly one supplier: the history module.** No other
caller constructs that map. The signature does not change.

The contract that binds the four clauses: **undo is one operation on one list.** Dropping two
entries from the move list rewinds the position, the keys and the repetition counts together,
because all three are functions of that list. There is no second thing to remember to rewind.

Deliberately not decided here, and left to `EPIC-002`'s decomposition: the module's exact API,
whether the derived counts are memoized, and where SAN formatting lives (that is a separate seam
the audit named, and it is not this ADR's business).

### Confidence, and what would change my mind

**Confidence: medium-high.** High on the constraints, which are measured and reproducible —
clauses 1 and 3 rest on the 4.2x and the 9-23 ns/node figures. Medium-high on clause 2's
derive-don't-maintain call, which is a judgment about future consumers rather than a measurement.

What would change my mind, stated concretely so a human can check it later:

- **A consumer that needs the derived counts more than a few times per turn.** Replay is 41 µs
  once per turn and unacceptable thousands of times per turn. If one appears, memoize inside the
  module — that is a local change, not a reversal of this ADR. If instead the search itself wants
  `gameStatus` per node, clause 3 is being violated and *that* is the thing to re-open.
- **Replay measured above ~1 ms on target hardware.** It is 41 µs on an M-series machine, so
  there is roughly 25x of margin before this matters. Untested on any other hardware:
  `UNKNOWN - verify`.
- **Games that are not a linear list of moves.** Variations, branching analysis, or loading a
  position whose prior history is unknown all weaken "the move list is the authority". None is in
  any epic's scope today; `EPIC-006` explicitly rules out stored game history.

What would *not* change my mind: the shared-`Map` option being only 1.6-1.9%. That is affordable,
and I am not rejecting it on cost — see Alternatives.

### Stated dependency on ADR-0003 (legality strategy)

`ADR-0003` is being written concurrently and I have not seen it. It decides whether legality stays
make/test/unmake or becomes pin-aware generation. The interaction is real and is named here rather
than assumed away:

- **The 4.2x figure in clause 1 is contingent on make/test/unmake.** It is that large *because*
  `legalMoves` calls `makeMove` ~48 times per node. If `ADR-0003` chooses pin-aware generation,
  `makeMove` is called roughly once per node and the penalty falls to about the cost of one key
  (~6%). **That figure must then be re-measured.**
- **Clause 1 survives either way**, on the weaker but still sufficient ground that make/unmake
  remains the search's descend primitive and that quiescence search and move ordering keep it hot.
- **Clauses 2, 3 and 4 do not depend on `ADR-0003` at all.** Nothing in them is a function of how
  legality is computed.

If `ADR-0003` recommends pin-aware generation, the only edit owed to this ADR is re-measuring the
one number above. If a human reads the two ADRs together and finds a contradiction I could not
see, this section is the seam to cut along.

## Alternatives

**Leave it caller-owned as it is today and write only the contract down.** The honest default, and
the cheapest. Its real cost is not code, it is ownership: a contract with no owner is a comment.
`EPIC-002` still builds the move list inside its render loop because that is where it needs it,
`EPIC-004` still builds a second one, and `EPIC-006` still discovers the mismatch. Rejected — but
only just, and note how little separates it from the Decision. The recommendation above *is* this
option plus a name and a home; it adds no data structure the epics were not already going to
build. If a human prefers to defer even that, the loss is bounded and the ADR is still useful as
the written contract.

**A `Game` type inside the rules core, owning move list, undo stack and repetition map.** The
tidiest to read, and it fixes the `gameStatus` optional-parameter smell at its source. Rejected
for two reasons. First, in its strongest form — where the core's own `makeMove`/`unmakeMove`
maintain the history — it is **measured at 4.13x-4.21x on `legalMoves`**, because those functions
are the legality filter's inner loop; a `Game` with a *separate* apply method avoids that, but
then the core carries two move-application paths and the fast one is the one nobody is pointed at.
Second, it makes the rules core stateful. That core's statelessness is what makes perft a proof of
correctness, and a `Game` there would serve only consumers outside the core, since `EPIC-004`
would not use it.

**One shared repetition structure for both the session and the search.** A single
`Map<bigint,number>` incremented on make and decremented on unmake is *correct* — with that
discipline the map holds exactly the current root-to-node path, and I verified it returns exact
perft counts and empties itself at the end. It costs 86-101 ns/node, about 1.6-1.9% of a search
node. **This is not rejected on cost; it is affordable.** It is rejected because it is the wrong
shape for the consumer that matters: repetition is a property of the path from root to node, and a
map re-derives that property through bookkeeping discipline that one missed decrement silently
breaks. The array *is* the path. It is also 4-10x cheaper, on a metric (`NFR-005`) that is
currently missed.

**Derive everything, own nothing — no module at all.** Recompute the move list's consequences
wherever they are needed, from `{initial position, Move[]}` held by the game loop. Attractive, and
the measurements support the derivation half; this is why clause 2 derives rather than maintains.
Rejected only as an *ownership* answer: something still has to hold the initial position and the
move list and be the single place `positionCounts` comes from. That something is the module in
clause 2, and it is small precisely because this alternative is mostly right.

## Consequences

- `EPIC-002` gets a named home for the move list instead of inventing one inside a renderer, and
  `EPIC-006`'s `undo` becomes a two-element truncation of one list. The corruption `EPIC-006`'s
  Risks section predicts becomes **unrepresentable**, not merely tested for: repetition counts
  cannot fall out of step with the position when both are functions of the same list.
- `EPIC-004` pays 9-23 ns/node for in-tree repetition on top of a key the transposition table
  forces it to compute anyway. Against a missed `NFR-005`, that is the cheapest correct option
  measured.
- `EPIC-005` probes the book against the same derived key list; the played line is the move list.
- The dependency graph stays an acyclic DAG with no upward edge: the new module sits above
  `gameend`, importing `position`, `apply`, `zobrist` and `gameend`. Nothing in the core imports it.

What this **forecloses** — the costs, stated as plainly as the benefits:

- **The rules core can never answer "is this a draw by repetition" on its own.** `gameStatus`
  keeps its optional `positionCounts`, and any caller that omits it keeps getting a silently
  wrong answer. This decision does not fix that trap, it *assigns* it: exactly one supplier, named
  above. Making the parameter required would be a breaking change to merged, `Done`, 100%-covered
  code, and this ADR deliberately does not take it.
- **Two representations of the same truth now exist** — the session's derived key list and the
  search's per-ply array — and the seeding step is the one place they meet. That is where a bug
  will live. It is a deliberate trade: one narrow, testable seam in exchange for a search that
  does not allocate per node.
- **An immutable or persistent `Game` API is foreclosed.** Every move returning a new game value —
  the natural shape for analysis-board time travel or branching variations — is incompatible with
  a mutable `Position` that is never copied (`ADR-0001`, and `memory-bank/30-architecture.md`).
  Anyone wanting that later is reopening make/unmake, not just this ADR.
- **The core stays "a chess position library", not "a chess game library".** If this is ever
  published as a reusable package, callers get positions and must bring their own game.
- **The history module becomes a single point of failure for four epics.** That is the point, but
  it means its tests carry more weight than its line count suggests.

### Out of scope, and deliberately not absorbed: the en-passant hashing defect

`src/zobrist.ts:71` XORs the en-passant file whenever `epSquare` is set, rather than only when an
en-passant capture is actually available. FIDE's "same position" test requires the en-passant
right to be *real*, so two positions FIDE considers identical can hash differently and **threefold
repetition under-detects**. Reproduced concretely while writing this ADR:

```
after 1.e4, no black pawn on d4/f4, so no ep capture exists
  rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1  ->  4366836039462477420
  rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1  ->  18311490354223382796
  legal ep captures available: 0   keys differ: YES   FIDE-identical: YES
```

With a black pawn on d4 the capture is real and the keys *should* differ — they do, so the bug is
confined to the no-capture-available case. Hashing en passant whenever it is set is a common engine
convention and the error direction is the safe one (a legitimate draw is missed, never a false draw
declared).

**This is a separate defect, not part of this decision, and it is not fixed here.** It concerns
what a key *means*, which is a property of `src/zobrist.ts` and is wrong or right regardless of who
owns the history. It has a concrete reproduction and a testable fix, which makes it ticket-shaped
like `ABC-009` and `ABC-010`, not decision-shaped. It is named here for one reason only: this ADR
makes the derived key list the substrate for every repetition verdict in the product, so whatever
inaccuracy the key carries is inherited by all four epics. **Recommend a defect ticket under
`EPIC-001`, sized `S`, priority no higher than `P2`** — it is latent until a game runs long enough
to repeat, which needs `EPIC-002` and `EPIC-006`. I did not cut it; ticketing is BA/PM's.

## Rollback

Cheap now, dear later — and the cost curve is the reason this ADR exists rather than waiting.

Today the decision costs zero lines: `EPIC-002` is undecomposed and `EPIC-004` does not exist, so
reversing it means editing this file. Once `EPIC-002` ships a move list inside its render loop and
`EPIC-004` ships a search around a different one, reversing it means touching the session, the
search and the book at once, against a failure mode that does not announce itself.

The realistic trigger for rollback is the first bullet under *what would change my mind*: a
consumer that needs the derived repetition counts at a frequency replay cannot serve. The response
is to memoize inside the history module and re-measure — clauses 1, 3 and 4 are unaffected, and
only clause 2's "derived, not maintained" wording would need amending.

A rollback of clause 3 — the search sharing the session's structure after all — is the expensive
one, because it is the clause the `NFR-005` deficit binds on. It should not be reversed without a
fresh measurement showing the shared structure's per-node cost against a search node, on the
hardware in question.

The mitigation that makes any of this safe is the same one `ADR-0001` relies on: the perft suite
and the FEN round-trip suite assert behaviour, not structure, and carry over unchanged. Neither
touches game history, so neither constrains this decision — which is also a warning, since it
means **no existing test would catch getting this wrong.** The history module's own tests, and
`EPIC-006`'s "undo rewinds repetition history too" test named in its Test notes, are the only
safety net this decision will ever have.
