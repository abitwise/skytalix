---
id: 20260816T070000Z-ba-pm-observation-three-routed-claims-verified-at-source-two-were-wrong-c41d7a09
kind: observation
by: ba-pm
at: 2026-08-16T07:00:00Z
verified_by:
confidence: high
refs:
  - EPIC-004
  - RISK-002
  - NFR-004
  - NFR-005
  - ABC-008
  - ADR-0003
  - plans/board.md
  - plans/nfr-catalog.md
supersedes:
---

# The three things I was told to verify. One held, two were stale — and the stale halves point opposite ways.

My subtask named three items and told me the sources outrank the routing. I read all three at
source. **Item 2 held exactly. Items 1 and 3 were each half wrong, and correcting them changed the
shape of the decomposition.**

## Item 1 — "`ABC-008` discharged the spike; cut no spike." PARTLY WRONG. I cut the spike.

**What is true:** `plans/board.md:198` — *"[ABC-008] SPIKE — Node search throughput (merged:
2026-07-23, outcome: GO WITH CONSTRAINT, RISK-002 answered)"*. It is in `Done`. `RISK-002`'s
**go/no-go** is answered.

**What was missed:** on **2026-07-30 Olger Oeselg ratified `ADR-0003` clause 2 as amended**, and
amendment **(2c)** re-pointed the mitigation at a **different measurement**:

> *"It stays provisional until `EPIC-004`'s spike measures on target hardware."*

`NFR-005`'s `Verified by` cell carries the obligation so it cannot be lost:

> *"the provisional obligation has a home: `EPIC-004`'s own timeboxed spike (`RISK-002`'s
> mitigation) measures depth-in-budget on non-M3 target hardware, and that spike is the verification
> that LIFTS the PROVISIONAL marker from the depth-7 level."*

`EPIC-004`'s own `## Risks` says the same, and dates the change: *"Until 2026-07-30 this mitigation
read 'measures nodes/sec'; the rate is now a diagnostic, not the target."*

**So there are two spikes, not one.**

| | `ABC-008` (done) | the spike still owed (`ABC-074`) |
|---|---|---|
| metric | nodes/sec | **deepest ply completed in 3 s** |
| positions | throwaway benchmark | **`kiwipete`, `position-6`** |
| code under test | **no legality filtering at all** | the real search |
| machine | Apple M3 | **explicitly a non-M3** |
| what it settles | `RISK-002` go/no-go | **lifts `NFR-005`'s PROVISIONAL marker** |

**`plans/board.md:142` is CORRECT as written** — *"first ticket must be `RISK-002`'s timeboxed spike
— `NFR-005`'s depth-7 level is PROVISIONAL"* — and needs **no correction**. I cut `ABC-074`.

## Item 2 — the time-based constraint. CONFIRMED VERBATIM.

`plans/nfr-catalog.md:536-541` says exactly what I was told it says:

> **Survives:** **RISK-002 = GO WITH CONSTRAINT**, and EPIC-004's per-move budget **must be
> time-based (iterative deepening against a wall clock), not depth-based** — a fixed depth would
> blow NFR-004's 3-second ceiling on exactly the machines least able to absorb it. Inherited by
> EPIC-004 as non-negotiable. The measurement **strengthens** this: the worst-case-slow-machine
> scenario the constraint hedged against has arrived on the fast machine.

Re-stated unchanged in `ADR-0003` § "Unchanged by the ratification" and in `EPIC-004`'s `## Risks`.

**It is also structurally load-bearing, which the routing did not mention.** `ADR-0003`'s reason for
choosing depth over rate *depends* on it: iterative deepening *"returns the best move found so far
when the clock runs out — so the 3 s budget **cannot** be blown by a slow node rate."* **If the
constraint were violated, `NFR-005`'s entire derivation would collapse with it.**

**How I honoured it.** `ABC-077` (negamax) takes a `depth` argument, and I state on that page why
that is not a violation: iterative deepening *is* a loop calling a depth-limited search. What is
forbidden is a **fixed depth being the per-move budget**. So I made it falsifiable rather than
intentional, in two criteria on two tickets:

- `ABC-077` `A6` — the module exports **no move-selecting function without a caller-supplied depth**,
  and **no default value for `depth` exists anywhere in it**. *A default depth is a fixed-depth
  budget wearing a parameter's name.*
- `ABC-078` `A4` — the engine entry point takes a **time budget** and **no depth argument or
  default**; grep of the delivered diff finds **no depth constant** driving a per-move decision.

Both are asserted against delivered signatures in a test, not left to review.

## Item 3 — the "163k–351k nodes/sec shortfall". FIGURES RIGHT, FRAMING RETIRED. No performance ticket first.

**The figures are real and current.** `plans/nfr-catalog.md:596-601`: 163,042/sec (kiwipete d3),
186,843/sec (kiwipete d4), 346,449/sec (startpos d4), ABC-008 metric B, M3, 2026-07-29, reached
independently by two agents.

**The shortfall is against a target a human deleted.** The block those figures live in is headed
*"CORRECTED 2026-07-29 … Kept as history"*, and carries its own retirement note: *"only the ≥ 500k
**target** they were measured against was retired on 2026-07-30."* The row itself is explicit —
**"Node rate is a diagnostic, not the target"** — and `ADR-0003` gives two reasons the owner
accepted: the 500k came from a spike that ran **no legality filtering at all**, and the same merged
code measures **207k to ~6.1M nodes/sec on the node definition alone**, a **30x spread with no code
change**, under which `startpos` passes 500k and `kiwipete` does not. *"A target a position can pass
or fail with no code changing is not testable."*

**Against the LIVE target there is no shortfall to decompose around.** `ADR-0003` derives the rate
each depth needs: **depth 6 ≈ 47k/sec, depth 7 ≈ 280k/sec, depth 8 ≈ 1.68M/sec** — against a
measured **207k–546k**. So:

- the **depth-6 FAIL floor** clears with roughly **4x margin**;
- the **depth-7 WARN level** is **where the code actually sits** — by design, since `ADR-0003`
  amendment (2b) chose depth 7 *because* it is the level that detects a regression;
- the honest statement is **marginal at the WARN level, comfortable at the FAIL floor** — not a
  1.4x–3.1x shortfall.

**Decision (my subtask asked me to decide and record this): NO performance ticket is the first real
ticket of this epic.** Three reasons:

1. It would be work sized against a **retired** number. `plans/nfr-catalog.md` says what the real
   lever is and it is **not rate**: *"pruning, a transposition table and move ordering reduce the
   number of nodes needed to reach a depth, they do not make a node cheaper."* Rate buys **depth**;
   depth is the target; the depth levers are `ABC-080` (ordering) and `ABC-081` (table), and both
   are cut as `P0`.
2. **`ADR-0003` clause 3 pre-orders the escape hatches and authorizes none of them.** The
   architecture audit calls that out approvingly — *"the choice is pre-made but not pre-spent."*
   Cutting a performance ticket now spends an option a human deliberately left unspent, and the
   clause has a **named trigger**: the depth-6 floor being missed **on target hardware**. That
   trigger is `ABC-074`'s to fire, and it has not fired.
3. About **71% of per-node cost is the make/test/unmake legality filter in `src/legal.ts`**, and
   `ADR-0003` clause 1 ratified that file **unchanged**. A performance ticket that cannot touch the
   thing that costs 71% is not a performance ticket.

**What I cut instead as the first real ticket:** `ABC-075`, the incremental Zobrist key — a per-node
cost the architecture audit measured (**~295–304 ns full scan, allocating `bigint`s, and on ep
positions it calls into `legal.ts` and plays a move**) and named as *"the one place the current
shape does not simply extend."* That is a real, measured, unretired cost with a named consumer.

## The pattern in items 1 and 3

Both stale halves trace to the **same event** — the owner's 2026-07-30 ratification of `ADR-0003`
clause 2 as amended — and they point **opposite ways**: it created an obligation the routing thought
was discharged (the spike), and retired one the routing thought was live (the 500k shortfall). A
reader who applied only one correction would have got the epic wrong in either direction.
