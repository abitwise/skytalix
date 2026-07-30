---
id: 20260730T143800Z-architect-design-decision-38b772b6
kind: decision
by: architect-design
at: 2026-07-30T14:38:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-004
  - EPIC-005
  - EPIC-006
  - ADR-0002
  - NFR-002
  - NFR-003
  - NFR-004
  - src/history.ts
  - plans/nfr-catalog.md
  - 20260730T143000Z-architect-design-observation-57f6f356
  - 20260730T143500Z-architect-design-decision-d7a42f7a
supersedes: 
---

# SEAM 2 CLOSED — the derived counts are NOT memoized

Subtask `architect-epic002-seams`. Second of the three seams `ADR-0002` deferred here. Numbers are
cited from `…-architect-design-observation-57f6f356`.

## The decision

**No memoization. `keyHistory` and `repetitionCounts` recompute by replay on every call.** The
module holds no cache, no version counter and no invalidation logic. The rule stays the one
`ADR-0002` clause 2 ratified, with no exception: **the move list is the authority and everything
above it is derived.**

## The arithmetic that decides it — call frequency against measured cost

`ADR-0002` set the test itself: memoize "if a consumer needs the derived counts more than a few times
per turn". So count the turns.

One turn of `EPIC-002`'s loop (human ply + engine reply) calls a derive:

| Caller | Derive | Times per turn |
|---|---|---:|
| `gameStatusOf` after the human ply | counts | 1 |
| `gameStatusOf` after the engine ply | counts | 1 |
| `EPIC-004` seeding its per-ply key array (clause 3, once per *search*) | keys | 1 |
| `EPIC-005` book probe — can and should reuse the search's seed | keys | 0-1 |
| The renderer, per frame | **none** | **0** |

**Two to four, against a measured 46-50 µs each at 120 plies.** That is **~200 µs per turn at the
worst**, which is:

- **0.4% of `NFR-003`'s 50 ms** keystroke budget,
- **0.007% of `NFR-004`'s 3 s** engine budget,
- and **0% of `NFR-002`'s 16 ms frame budget**, because no frame needs a count at all.

Turned around: at 120 plies you would need **~320 derives in one turn to spend the whole 16 ms frame
budget**, or **~1,000 to spend the 50 ms keystroke budget**. The loop makes two to four. **The margin
is 80x to 300x**, and it is measured rather than argued.

Growth does not threaten it either. Measured 18 / 33 / 46-50 / 70-75 / 97-102 µs at
40 / 80 / 120 / 200 / 300 plies — linear, and **at 300 plies still 10x under `ADR-0002`'s own stated
reopening threshold of ~1 ms**. All figures Apple M3, Node v24.12.0, darwin/arm64;
`UNKNOWN - verify` on any other hardware, and a 3x slower machine is still ~3x under that threshold.

**A cache here would buy ~200 µs per turn and cost the one invariant that makes this design safe.**
That is the trade, stated plainly, and it is not close.

## The response to pressure, in order — so it stays a local change

If a future consumer does push the frequency up, spend the budget in this order and stop as soon as
it is enough. Only the third step touches this decision:

1. **Derive once per turn and pass it.** The two `gameStatusOf` calls and the search seed are three
   derives of the *same* list. Computing `keyHistory` once at the top of a turn and handing it to
   both is a call-site change in `EPIC-002`'s loop with **no change to `history.ts` at all**. Try
   this first; it removes most of the duplication for free.
2. **Ask whether the consumer is violating clause 3.** If it is the *search* that wants
   `gameStatus` or the counts per node, that is not a memoization problem — `ADR-0002` clause 3 says
   in as many words that the search keeps its own preallocated per-ply array and that a search
   wanting `gameStatus` per node "is being violated and *that* is the thing to re-open". Reopening
   clause 3 is an ADR and a human ruling, **not a cache**.
3. **Only then, memoize inside the module.** `ADR-0002` pre-authorized this as a local change:
   "memoize inside the module — that is a local change, not a reversal of this ADR."

### If step 3 ever happens, the shape it must take

Recorded now because the obvious implementation is wrong, and the bug it produces is exactly the one
clause 2 exists to prevent:

- A private `{ version: number; keys: bigint[] } | null`, with a **monotonically increasing
  `version` counter bumped by `playMove` and by `takeBack`.**
- **Do NOT key the cache on `moves.length`.** After `takeBack(2)` followed by two *different* moves,
  the length is identical and the keys are not. A length-keyed memo silently serves the keys of a
  game that is no longer being played — a wrong draw verdict that does not throw, which is the
  precise failure mode `ADR-0002`'s Context describes.
- The memo is invalidated, never patched incrementally. Incremental maintenance of the counts is the
  thing clause 2 ruled out, and a cache that is *updated* rather than *dropped* is that thing wearing
  a different name.
- Re-measure after adding it, on the hardware in question, and record the number with its machine.

## What this decision does not touch

- **The current position is still forward-applied**, not re-derived (seam 1). It is not one of
  clause 2's three derived things and is not a memoization question.
- **SAN caching is a separate question** and is answered separately in seam 3 — it lands in a
  different budget (`NFR-002`'s frame, not the turn) and has a different cost curve.
- **Clause 3's per-ply array in `EPIC-004` is not a memo of anything.** It is a second
  representation, seeded once per search, and `ADR-0002` ratified it as deliberate.

## Confidence

**High.** The decision rests on a call count read off four epics' stated scope and a cost measured
twice, and `ADR-0002` named the threshold in advance so this is a check rather than a judgment.
The residual uncertainty is hardware — every figure is one M3 and one Node version — and the margin
is large enough (80x-300x) that a 3x slower machine does not change the answer.

**No ADR was written for this seam.** `ADR-0002` already decided the rule and pre-authorized the
local change; writing an ADR to say "we did not need the escape hatch yet" would be ceremony. The
trigger and the required shape are recorded above so that whoever does need it later does not have
to rediscover either.
