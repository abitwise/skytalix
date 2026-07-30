---
kind: adr
id: ADR-0003
---
# ADR-0003: Legality strategy — make / test / unmake

## Status

**accepted** — ratified by a named human on 2026-07-30. No agent may move an ADR to `accepted`; a
human did.

This ADR was written as a proposal: it presented a decision rather than taking one. `src/legal.ts`
deferred this choice in writing to "the EPIC-004 spike"; the 2026-07-29 architecture audit found
`NFR-005` missed and named the deferred decision due as its required fix `RF-2`. What follows is
that recommendation with its evidence, its confidence, and the things that would overturn it — put
to a human to ratify, amend, or reject in one reading, and ruled on in session.

Ratified by: Olger Oeselg  on 2026-07-30

### Ratification record — clauses 1 and 3 as proposed, clause 2 AS AMENDED

The ruling was **"ratify 1 and 3, amend 2"**. The distinction is the point of this record: the
draft of clause 2 was **not** ratified as written, and this file must not be read as if it were.

- **Clause 1 — accepted as proposed.** Make/test/unmake stays; `src/legal.ts` is not changed.
- **Clause 3 — accepted as proposed.** The named trigger and the ordered menu stand as written, and
  still authorize nothing.
- **Clause 2 — accepted only as amended.** Three amendments came out of a review of this ADR, were
  put to the human, and were accepted by the same ruling:
  - **(2a) The positions are named.** "In a middlegame position" is not testable — it is the same
    vagueness this clause corrects `NFR-005` for — so the target now names **kiwipete** and
    **position-6**, the positions this ADR actually measured, as the standing benchmark set.
  - **(2b) Two levels: depth 6 FAILS, depth 7 WARNS.** A bare depth-6 floor needs only ~47k
    nodes/sec against a measured 207k-546k, so it would still read green after a 4x regression.
    Depth 7 needs ~280k, which is where the code actually sits, so it is the level that detects one.
  - **(2c) The depth-7 level is PROVISIONAL.** Every number here is one machine and one Node
    version, and the unvalidated 2-3x slow-hardware factor is named below as this ADR's largest
    single unknown — with depth 7 precisely what a 3x slower machine loses. It stays provisional
    until `EPIC-004`'s spike measures on target hardware. The depth-6 floor is not provisional.

The ratified wording is the amended clause 2 in the Decision section. The draft's own phrasing is
quoted in the three amendments above, so this record can be read without the file's history.

## Context

### What the code does today, and what it bought

`src/legal.ts` is 55 lines. `legalMoves` (lines 42-55) generates pseudo-legal moves, plays each one
on the real board with `makeMove`, asks `isSquareAttackedBy` whether the mover's king is attacked,
and takes it back with `unmakeMove`. The module header states the choice and its reason:
correctness first, and uniform handling of absolute pins, check evasion and the rare en-passant
discovered check "with no special case, because the test runs against the real resulting board".

That purchase was made and it was delivered. **Deep perft is 32/32 exact** across the six standard
positions (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, 38.4 s) — a byte-exact proof that
generation, legality filtering and `unmakeMove` are all correct at depth over tens of millions of
positions. Correctness at this layer is not a claim in this repo; it is measured. **That proof is
the most valuable asset this decision can spend, and it is the only one that cannot be re-earned
cheaply.**

### Why the decision is due now

The audit measured search-shaped throughput at **163k-351k nodes/sec with no evaluation running at
all**, against `NFR-005`'s **>= 500,000 nodes/sec with evaluation running**
(`plans/nfr-catalog.md`, corrected 2026-07-29), and attributed roughly 71% of per-node cost to this
filter. `EPIC-004` is `P0` and undecomposed. Deciding after the search is written is the expensive
order.

### The measured baseline — where the time actually goes

Every number in this ADR was produced this session by a scratchpad harness run **outside the
repo**, read-only against merged `src/`, on Apple M3 / Node v24.12.0 / darwin-arm64. No `src/`
file was modified. The harness builds `legalMoves` up in four stages, so each stage's cost is a
difference rather than an estimate:

| Stage | kiwipete | share | startpos | share |
|---|---:|---:|---:|---:|
| V0 `generateMoves` only (pseudo-legal) | 924 ns | 19.1% | 390 ns | 21.3% |
| V1 = V0 + `makeMove`/`unmakeMove` per move | +471 ns | 9.7% | +106 ns | 5.8% |
| V2 = V1 + the `kingSquareOf` `indexOf` scan | +600 ns | 12.4% | +248 ns | 13.5% |
| V3 = V2 + `isSquareAttackedBy` = **the real `legalMoves`** | **+2,841 ns** | **58.7%** | **+1,089 ns** | **59.4%** |
| **total `legalMoves`** | **4,837 ns** | | **1,833 ns** | |

Per pseudo-legal move at kiwipete: generation 19.3 ns, make/unmake 9.8 ns, king scan 12.5 ns,
**attack test 59.2 ns**. Standalone: `isSquareAttackedBy` 63.5 ns, `isInCheck` 74.8 ns,
`kingSquareOf` 12.7 ns (white) / 43.1 ns (black). Across four independent runs `legalMoves` measured
4,837-5,358 ns at kiwipete and 1,833-2,224 ns at startpos, agreeing with the audit's 5,263 /
5,298 ns and 2,144 ns.

**The hotspot is the attack test, not the bookkeeping around it: ~59% of `legalMoves` is
`isSquareAttackedBy`, called once per pseudo-legal move.** Generation is only ~19%.

Tree statistics over the full legal tree of all six standard positions to depth 3 (277,955 nodes):

- **40.9 pseudo-legal moves per node**, 39.7 legal — so only **1.2 moves per node are actually
  illegal**, and the filter runs 40.9 attack tests to find them.
- **1.6% of nodes are in check.**
- **8.1% of moves can possibly be illegal at all** (a king move, an en-passant capture, a move by an
  absolutely pinned piece, or any move while in check). The other 91.9% are legal by construction
  and are tested anyway.
- `makeMove` calls per node: **40.9 today.**

### One hypothesis is already dead — do not retry it

The audit recorded a **failed attempt**: hoisting `kingSquareOf`'s `board.indexOf` scan out of the
per-move loop measured **0.99x on white and 1.08x on black**. The table above says why — the scan is
12.4% of `legalMoves`, so deleting it entirely could not have paid. That approach is closed. It is
named here so a future reader does not rediscover it as an idea.

### What `NFR-004` genuinely demands — and why `NFR-005`'s number does not describe this engine

`NFR-005`'s **>= 500,000 nodes/sec** came from the ABC-008 spike, a throwaway benchmark **with no
legality filtering at all** — the catalog now says so in its own correction. It was never a
measurement of this code. Two further facts make the number unusable as written:

**1. "Nodes/sec" is undefined until you say what a node does.** The same merged code, measured
this session:

| Definition of a node | kiwipete | startpos |
|---|---:|---:|
| ABC-008 metric B — every node computes a full legal move list | 207k/sec | 546k/sec |
| Alpha-beta-shaped tree, evaluation at leaves, effective branching 2 | 297k/sec | — |
| Alpha-beta-shaped tree, effective branching 6 | 979k/sec | 1.83M/sec |
| Perft-shaped tree, evaluation at leaves (d4/d5) | 3.37M/sec | 3.88M/sec |
| Classic perft (`npm run perft`, free leaves) | ~6.1M/sec | ~6.1M/sec |

That is a **30x spread on unchanged code**, driven entirely by the definition. Under the audit's own
metric B, startpos already passes 500k and kiwipete does not. A target that a position can pass or
fail without any code changing is not a testable target.

**2. Iterative deepening makes `NFR-004` satisfiable at any node rate.** `RISK-002` already binds
`EPIC-004` non-negotiably to time-based iterative deepening, which returns the best move found so
far when the clock runs out. The wall-clock budget therefore **cannot** be blown by a slow node
rate. What the node rate buys is **depth**, i.e. strength — not latency.

So the honest question is not "does the engine hit 500k nodes/sec" but **"what depth does it reach
inside 3 seconds, and is that depth enough for 1400-1700 Elo?"** Measured — iterative-deepening
cumulative wall clock, today's design, alpha-beta modelled with effective branching factor 6,
leaves evaluated and not generated:

| Position | leaf eval | depth 6 | depth 7 | depth 8 | depth 9 |
|---|---|---:|---:|---:|---:|
| kiwipete | 134 ns (material) | 90 ms | 390 ms | 2.46 s | 12.3 s |
| kiwipete | 543 ns | 94 ms | 484 ms | 3.17 s | 17.0 s |
| kiwipete | 1,097 ns | 127 ms | 677 ms | 4.41 s | 22.8 s |
| position-6 | 1,097 ns | 116 ms | 644 ms | 4.01 s | 23.8 s |
| startpos | 134 ns | 42 ms | 226 ms | 1.60 s | 8.6 s |

**Today's design reaches depth 7 in 0.39-0.68 s and depth 8 inside the 5 s hard ceiling, at every
leaf-evaluation cost tested up to 1.1 µs.** The corresponding required rate, derived the other way
(EBF 6, iterative-deepening overhead 1.2x, quiescence factor 2.5, 3 s budget): depth 6 needs
**~47k nodes/sec**, depth 7 needs **~280k**, depth 8 needs **~1.68M**. The measured rate clears the
depth-6 requirement by 4-20x and sits at or above the depth-7 requirement.

And the exchange rate is brutal: at EBF 6, **a 3x speedup buys 0.61 ply**; 5x buys 0.90 ply.

## Decision

**Ratified: keep make / test / unmake. Change the target, not the code** — clauses 1 and 3 as
proposed, clause 2 as amended (see the ratification record in Status). Concretely, three clauses:

**1. `src/legal.ts` is not changed.** Make/test/unmake stays the legality strategy. It is
proven-correct at depth, it is 55 lines, and the measurements above say the throughput it costs is
not the binding constraint on anything this product has promised.

**2. `NFR-005` is re-derived from `NFR-004` rather than inherited from the spike.** Its
`>= 500,000 nodes/sec` was derived from an invalid proxy and is not testable as written. The
replacement target is **depth-in-budget on named positions, gated at two levels**: *at default
difficulty, on **kiwipete** and **position-6**, the search completes at least **depth 6** within the
3 s budget and never exceeds the 5 s ceiling — below depth 6 is a **FAIL** — and reaches **depth 7**
within that same 3 s budget, below which is a **WARN**.* The node-rate figure is demoted to a
diagnostic that always carries its node definition, its position, and its machine. `NFR-004` stays
the requirement it always was; `EPIC-004`'s puzzle suite and self-play ladder stay the only real
verdict on strength.

*Amended on ratification, 2026-07-30 — see the Status record. The three amendments are part of what
was accepted, and their reasoning belongs with the clause:*

- **(2a) The positions are named, because "a middlegame position" was not testable.** The draft
  target said exactly that, which is the same vagueness this clause corrects `NFR-005` for: a target
  whose position is unspecified can be passed by choosing a position, and the 30x spread above is
  what that costs. **kiwipete** and **position-6** are the standing benchmark set — the two positions
  this ADR measured across every leaf-evaluation cost in the depth table (kiwipete at 134 / 543 /
  1,097 ns, position-6 at 1,097 ns), both already encoded with their published perft counts in
  `src/perft.test.ts`, and both move-rich, with kiwipete the slowest position measured here. The same
  two positions on every re-measurement, or the numbers are not comparable.

- **(2b) Two levels, because a depth-6 floor alone would pass a 4x regression.** By this ADR's own
  arithmetic depth 6 needs **~47k nodes/sec**, while the code measures **207k-546k** under metric B —
  so the engine could lose three quarters of its speed and a depth-6-only gate would still read
  green. Depth 7 needs **~280k**, which is where the code actually sits: the measured wall clock
  reaches depth 7 at kiwipete in 0.39-0.68 s and at position-6 in 0.644 s, well inside the 3 s
  budget. So depth 7 is the level that detects a regression instead of rubber-stamping one. Both
  levels are recorded because they answer different questions — **depth 6 FAILS** because it is the
  level `NFR-004`'s promise and the 1400-1700 strength target rest on, and **depth 7 WARNS** because
  missing it means the engine got materially slower without yet breaking a promise.

- **(2c) The depth-7 level is PROVISIONAL until non-M3 hardware is measured; the depth-6 floor is
  not.** Every number in this ADR is one machine and one Node version, and the unvalidated 2-3x
  slow-hardware factor is named below as its largest single unknown — including the observation that
  a 3x slower machine still clears depth 6 by ~1.5x and loses **precisely depth 7**. The depth-7
  level is therefore marked provisional pending `EPIC-004`'s own spike measuring depth-in-budget on
  target hardware; that spike either confirms the level or re-derives it, and until it reports, a
  depth-7 WARN on slower hardware may be the machine rather than a regression and must be read that
  way. The depth-6 floor carries no such marker: it is the level the arithmetic says survives the
  worst hardware factor on the table.

**3. The named trigger, and the ordered menu if it fires.** If `EPIC-004`'s own spike measures the
depth floor in clause 2 missed on target hardware, spend the budget in this order — cheapest and
safest first, and only as far as needed:

- **(c1) Pseudo-legal search.** A search-design choice inside `EPIC-004`. Zero change to
  `src/legal.ts`. Measured **2.6x-5.1x** on the alpha-beta-shaped model.
- **(c2) Lazy legality behind the unchanged `legalMoves` signature.** Measured **3.2x-4.4x** per
  call in open positions, **0.97x-1.2x** when in check. The existing make/test/unmake test is kept
  as the fallback for the 8.1% of moves that need it, so the proven algorithm is preserved, not
  replaced.
- **(b) Full pin-aware generation, last.** Its ceiling over (c2) is bounded by measurement at
  ~1.5x, for the largest correctness risk on the board.

This ADR authorizes none of the three. It records which one to reach for, in what order, and on
what evidence — so the choice is not made under time pressure mid-`EPIC-004`.

**The follow-up this ADR held back — taken on ratification:** `plans/nfr-catalog.md`'s `NFR-005` row
needed the clause-2 correction, and this ADR deliberately did not edit it while `proposed`. That edit
belonged to whoever ratified, and it was made on 2026-07-30 against the **amended** clause 2: the
named positions, the two levels, and the provisional marker on depth 7 — with the node-rate figure
demoted to a diagnostic and the measured 163k-351k and the ABC-008 2,639,455 proxy kept visible as
history.

### Confidence, and what would change my mind

**Confidence: high on the code measurements, medium on the re-derived target.**

High on the baseline decomposition, the tree statistics, and the option speedups: those are direct
measurements, repeated, and the option prototypes were differentially verified move-for-move
against `legalMoves` (below). Medium on clause 2, because three of its inputs are **literature
assumptions, not measurements**, and are marked as such: the effective branching factor of 6, the
quiescence factor of 2.5, and "depth 6-7 is enough for 1400-1700 Elo". One machine, one Node
version. `UNKNOWN - verify` on any other hardware.

What would change my mind, stated so a human can check it later:

- **`EPIC-004`'s puzzle suite or self-play ladder missing the strength target at the depth today's
  rate reaches.** This is the only real verdict, and it outranks every number above. If it fires,
  clause 3 is the response — starting at (c1), which touches no merged code.
- **A measured effective branching factor materially above 8**, or a real evaluation materially
  above ~1.1 µs per leaf. Either pushes depth 7 toward the ceiling and makes clause 3 live. The
  1.1 µs case is already in the table and still clears depth 7 in 0.68 s, so this needs to be a
  large miss, not a small one.
- **Target hardware measuring 3x slower than this M3 *and* the depth-6 floor then missed.** The
  spike's 2-3x hardware factor has never been validated on a non-M3 machine — that gap is the
  largest single unknown in this ADR. Note that 3x slower still clears depth 6 by ~1.5x on the
  arithmetic above; it is depth 7 that would be lost. Clause 2's amendment (2c) prices this in: the
  depth-7 level is provisional for exactly this reason, and the depth-6 floor is not.
- **A consumer other than the search needing `legalMoves` thousands of times per second.** At
  2.1-5.4 µs per call it is ~19,000x under `NFR-003`'s 100 ms budget for the `moves` command, so no
  such consumer exists today.

What would **not** change my mind: the 163k-351k figure itself. It is real, it is correctly
measured, and I reproduced it (207k/sec at kiwipete by the reciprocal of one `legalMoves` call). It
is simply measured against a target that was never derived from this code, under a node definition
no real search uses — a real search does not compute a legal move list at a leaf.

### Stated dependency on ADR-0002 (game history ownership) — answered with measurement

`ADR-0002` names this ADR as a dependency and asks a specific question: its clause 1 rests on
maintaining game history inside the core's `makeMove`/`unmakeMove` costing **4.13x-4.21x** on
`legalMoves` (+16.1 µs/node at kiwipete), and it predicts that if this ADR chose pin-aware
generation, `makeMove` would fall to "roughly once per node" and the penalty to "about the cost of
one key (~6%)", which "must then be re-measured". Three answers:

**1. The 4.2x is confirmed independently.** Reproducing that shape — one `zobristKey` after every
`makeMove` inside the filter — measured **4.48x at kiwipete (+16.9 µs/node)** and **4.60x at
startpos (+6.9 µs/node)**, against `ADR-0002`'s 4.13x-4.21x and +16.1 µs. Same mechanism, same
magnitude, reached separately. `zobristKey` alone is 295-304 ns, which is exactly where the +16.9 µs
comes from: 40.9 make calls per node, each followed by a full key recompute.

**2. The prediction's premise does not hold, and its conclusion holds anyway — more strongly.**
Measured, `makeMove` calls per node fall from **40.9 to 3.3** under lazy legality — a 12x reduction,
not to ~1. The penalty for maintaining history inside make/unmake then measures **1.93x at kiwipete
and 0.99x at startpos**, not ~1.06x. And under pseudo-legal search the *relative* penalty gets
**worse**, not better, because the node becomes ~12x cheaper while still making one `makeMove` per
move searched. So `ADR-0002` clause 1 — history must not attach to the core's make/unmake — survives
under every option in this ADR, and needs no weakening.

**3. Because clause 1 of *this* ADR keeps make/test/unmake, `ADR-0002` needs no edit at all.** Its
4.2x figure remains valid exactly as written. The re-measurement it asks for becomes owed only if a
human ratifies clause 3's (c1) or (c2), and the numbers above are what it should be re-measured
against. `ADR-0002`'s clauses 2, 3 and 4 are untouched by this ADR, as it says.

I read `ADR-0002` from disk; nothing was relayed to me. I found no contradiction between the two
ADRs.

## Alternatives

Three genuine option families. All three were prototyped or bounded by measurement before being
ranked; none was ranked first and measured second.

### (a) Keep make/test/unmake and change what `NFR-005` asks — **recommended, clauses 1 and 2**

- **Cost:** zero lines of code. The cost is honesty work: a catalog correction and the admission
  that a seeded target was wrong.
- **Expected speedup: 1.0x.** None. That is the point.
- **Benefit:** the perft 32/32 proof is untouched, `src/legal.ts` stays 55 readable lines, and no
  correctness risk is taken for 0.61 ply. Under `AGENTS.md` rules 5, 7 and 10 — only requested
  features, no unrequested flexibility, don't refactor working code — this is the default that has
  to be argued *out of*, not into. Optimising a proven-correct generator against a target derived
  from a benchmark that did not run the code is exactly the trap those rules name.
- **Verification:** nothing changes, so the existing oracle stands as-is — 143/143 unit tests, deep
  perft 32/32 exact, `npm run perft` >= 1M nodes/sec.
- **Risk:** if the depth floor really is missed later, this option has spent time rather than
  bought speed. Clause 3 is the mitigation, and (c1) — the first step — needs no core change.

### (b) Pin-aware / incremental legal generation — **rejected today; last resort in clause 3**

Generate only legal moves: find the king, compute the checker set and the absolutely-pinned set,
then generate check evasions when in check and pin-restricted moves otherwise, with en passant
special-cased.

- **Expected speedup: bounded by measurement at ~5.4x-7.6x over today's `legalMoves`, and at only
  ~1.5x over option (c2).** The bound is real, not a guess: `generateMoves` with *no legality work
  at all* costs 989 ns at kiwipete against (c2)'s 1,486-1,583 ns, and nothing that still has to
  produce legal moves can be faster than producing pseudo-legal ones. Published gains for this
  change are usually quoted at 2-4x, which sits inside that bound.
- **Cost:** it deletes the uniformly-correct test and replaces it with case analysis. It is the
  classic source of subtle rule bugs — double check where only king moves are legal, a pinned piece
  capturing its pinner, the en-passant discovered check where two pawns leave one rank at once, and
  castling through a square attacked by a piece the evasion logic forgot. `src/legal.ts` grows from
  55 lines of one idea into several hundred lines of special cases, and it is the module every other
  epic sits on.
- **Verification:** deep perft 32/32 exact is necessary but **not sufficient** — it would also need
  a node-by-node differential against today's filter over the full tree of all six positions, plus
  named tests for each case above. That is a large, expensive test surface, and it exists precisely
  because the correctness this option risks is currently *proven*.
- **Rejected because** the measured ceiling over the far safer (c2) is ~1.5x — worth about 0.2 ply
  at EBF 6 — for the largest correctness risk available. This is the option the audit named
  (`RF-2`, "the named fix", confidence medium) and the measurements do not support it as a first
  move.

### (c) Targeted wins that preserve the current algorithm — **rejected today; the menu in clause 3**

Four candidates were measured. Two are worth having and two are not.

**(c1) Pseudo-legal search — a change to the search, not to the rules core.** Today a searched move
is made **twice**: once inside `legalMoves` to test its legality, and again by the search to descend
into it. Worse, alpha-beta with good move ordering searches only a handful of a node's ~41 moves,
yet `legalMoves` tests all 41. A pseudo-legal search calls `generateMoves`, then lets the make it
performs anyway serve as the legality test at the child.

Measured on the alpha-beta-shaped model (nodes/sec; effective branching in brackets):

| Model | today | pseudo-legal | gain |
|---|---:|---:|---:|
| kiwipete, EBF 6 | 979k | 2.51M | **2.6x** |
| kiwipete, EBF 3 | 496k | 1.92M | **3.9x** |
| kiwipete, EBF 2 | 297k | 1.51M | **5.1x** |
| startpos, EBF 6 | 1.83M | 3.41M | 1.9x |
| position-6, EBF 6 | 1.10M | 2.99M | 2.7x |

The gain grows as pruning gets better, which is the opposite of the usual optimisation story and is
why this is the first item on the menu. **Cost:** the search must track mate and stalemate itself
(no legal move ever succeeded), and move ordering runs over pseudo-legal moves. `src/legal.ts` is
not touched, so `legalMoves` stays the API for the UI, the `moves` command, and `gameStatus`.
**Verification:** perft 32/32 stays valid because the filter is unchanged; the equivalence itself is
already evidenced — all nine model configurations visited **identical node counts** under both
walks (4,185,553 / 5,072,213 / 293,696 / 224,478 / 129,337 / 335,916 / 265,678 / 316,423 /
265,720), with the root position byte-identical afterwards in every case.

**(c2) Lazy legality behind the unchanged `legalMoves` signature.** Compute the king square, the
check status and the pinned set **once per node**, then run the existing make/test/unmake only for
the moves that can possibly be illegal — king moves, en-passant captures, moves by a pinned piece,
and every move while in check. Measured 8.1% of moves across the standard tree.

| Position | `legalMoves` | lazy | gain |
|---|---:|---:|---:|
| startpos | 2,224 ns | 649 ns | 3.43x |
| kiwipete | 5,358 ns | 1,583 ns | 3.39x |
| position-3 | 2,064 ns | 700 ns | 2.95x |
| position-4 (in check) | 3,280 ns | 2,705 ns | **1.21x** |
| position-5 | 5,030 ns | 1,379 ns | 3.65x |
| position-6 | 4,387 ns | 1,002 ns | 4.38x |
| kiwipete, EBF 6 search model | 979k/sec | 2.65M/sec | 2.7x |

**The gain vanishes in check** — position-4 is in check and pays 1.21x, and a screening variant
without the cheaper board-only test measured **0.97x** there, i.e. a small loss. In-check nodes are
1.6% of the standard tree, so the aggregate holds, but a check-heavy search with check extensions
would see less than the table suggests. **Verification:** the prototype was differentially verified
against `legalMoves` node-by-node — **518,474 nodes across all six standard positions, 0 move-list
mismatches, 0 position mutations, 6/6 perft counts exact** (plus an earlier 277,955-node run, also
clean). This is the property that makes (c2) categorically safer than (b): the proven test is kept
as the fallback, so the differential can use it as the oracle.

**(c3) Avoiding a full `apply` for the legality test — measured, and not worth having alone.**
`isSquareAttackedBy` reads only the board, so the legality test does not need `makeMove`'s castling,
en-passant, clock, fullmove and side-to-move bookkeeping. A board-only make/test/unmake measured
**1.23x-1.41x** on its own. The baseline table says why it cannot do better: make/unmake is 9.7% of
`legalMoves` and the king scan 12.4%. It is worth folding into (c2), where it lifted kiwipete from
3.19x to 3.39x and position-3 from 2.47x to 2.95x; it is not worth doing by itself.

**(c4) Reducing per-move allocation — measured, and not the problem.** `Move` is a heap object
literal and `generateMoves` returns a fresh array per call. Generation *in total* is only 19.1% of
`legalMoves` (924 ns for ~41 moves = 19.3 ns per move, allocation included), so even a
zero-allocation generator could not reach 1.24x. The audit already recorded that the pull to pack
`Move` into an integer will be strong during `EPIC-004`; the measurement says no throughput argument
supports it. `Move` is the widest-reach type in the codebase — `moves.ts`, `apply.ts`, `legal.ts`,
`perft.ts` today and SAN, move ordering and the book next — so changing it is expensive and buys
under 24% in the best case.

## Consequences

- **Nothing in `src/` changes and no ticket is owed by this ADR.** The 55-line `legal.ts`, the
  perft 32/32 proof, and the 143/143 suite all stand exactly as merged.
- **The nodes/sec figure stops being the gate and becomes a diagnostic; `NFR-005` itself stays
  pass/fail, on depth.** That is still a real loss: the project gives up a single crisp number in
  exchange for a target that can actually be tested, and as amended it gives up one threshold for
  two — a depth-6 FAIL floor and a provisional depth-7 WARN. Every future quote of a nodes/sec figure
  must carry its node definition, its position and its machine, or it repeats the mistake this ADR is
  correcting.
- **`EPIC-004` inherits a decision it can act on rather than an open question.** The spike it must
  run is no longer "how fast is the generator" (answered here) but "does the search reach depth 6-7
  in budget on target hardware, and does the puzzle suite pass at that depth". That spike now also
  owns lifting clause 2's provisional marker on the depth-7 level — it is the named verification for
  it, and `plans/nfr-catalog.md`'s `NFR-005` row says so.
- **The audit's `RF-2` is answered, but not in the direction it expected.** `RF-2` named pin-aware
  generation as "the named fix" at confidence medium. Measured, its ceiling over the much safer
  lazy-legality option is ~1.5x. Recording the disagreement explicitly, because `RF-2` is a
  published recommendation and a future reader will find it.
- **What this forecloses.** A pseudo-legal search (c1) would mean the search calls `generateMoves`
  directly, so any generation defect becomes reachable without passing through `legalMoves` — see
  the `ABC-009` note below. And clause 2 means nobody can point at a nodes/sec figure as evidence the
  engine is fast enough; only the depth-in-budget measurement on the named positions and the strength
  suite can say that — and while the depth-7 level is provisional, a green row measured on this M3 is
  not evidence about target hardware.
- **`ADR-0002` needs no edit** — see the dependency section above.

### Interaction with `ABC-009` (`legalMoves` mutates the position it documents as unchanged)

`ABC-009` is not edited, re-cut or re-scoped by this ADR. Its own Out-of-scope section already
excludes this decision, correctly. The interaction, per option:

| Option | Effect on `ABC-009` |
|---|---|
| (a) keep + re-derive the target | **Neutral.** Nothing moves. The fix stays a guard on castle generation, exactly as the ticket scopes it. |
| (c1) pseudo-legal search | **Slightly harder, and an argument for shipping `ABC-009` first.** `legalMoves` is untouched, but the search would reach `generateMoves` directly, so a phantom castle offered from an empty e1 would be reachable from the search path and not only through `legalMoves`. |
| (c2) lazy legality | **Easier, in test infrastructure only.** Its differential harness *is* the purity property test `ABC-009` asks for in its Test notes — the same "for every standard position, assert `toFen` is stable across two calls" guard, which I ran at 518,474 nodes with zero mutations. It does not fix the defect: a castle is a king move, so it still takes the full make/test/unmake path and still corrupts a malformed position. |
| (b) pin-aware generation | **Harder.** It rewrites the code `ABC-009`'s acceptance criteria assert against (exact move counts, zero `FLAG_CASTLE` moves from the given FENs), so whichever lands second re-does the other's test surface. It also removes the make/test/unmake path that currently *contains* the corruption, which changes the failure mode instead of fixing it. |

My prototypes were run only on well-formed positions, which is consistent with the ticket's own
finding that a well-formed position is unaffected. **I did not test any invalid position and I have
no new information about `ABC-009`.**

## Rollback

Clauses 1 and 3 cost zero lines, so reversing them means editing this file — cheap now, cheap
later, because nothing is built on them. Clause 2 is the one with a cost curve: once `EPIC-004` is
decomposed against a depth-in-budget target, reverting to a nodes/sec target means re-deciding what
a node is, which is the ambiguity that produced this ADR. As amended, its two levels have different
curves: the **depth-6 floor** is what `EPIC-004`'s decomposition binds on and is the expensive one to
revert, while the **depth-7 level is explicitly provisional** and is *meant* to be re-derived by
`EPIC-004`'s spike on target hardware — revising that level is the discharge of this ADR's own
obligation, not a rollback of it.

The realistic trigger for rollback is the first bullet under *what would change my mind*:
`EPIC-004`'s puzzle suite or self-play ladder missing the strength target at the depth today's rate
reaches. The response is clause 3, in the order given, stopping as soon as the floor is met.

The mitigation that makes any of this safe is the same one `ADR-0001` and `ADR-0002` rely on, and
here it is unusually strong: **the deep perft suite asserts behaviour and is a byte-exact oracle for
exactly the thing every option in clause 3 risks.** It carries over unchanged under (a), (c1) and
(c3); under (c2) it is joined by the move-for-move differential against today's filter, which is why
(c2) outranks (b) despite (b)'s higher ceiling. Under (b) alone, perft is necessary and not
sufficient, and that gap is the reason (b) is last.

One honest limit on all of it: every number in this ADR is **one machine, one Node version** (Apple
M3, Node v24.12.0, darwin-arm64), and the spike's 2-3x slower-hardware factor has never been
validated. `UNKNOWN - verify` elsewhere. These are measurements recorded in a decision record a human
ratified, not gate-verified findings — ratification settled what the target is, and measured nothing.
