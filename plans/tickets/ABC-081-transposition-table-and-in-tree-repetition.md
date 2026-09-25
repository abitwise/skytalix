---
id: ABC-081
title: Transposition table and in-tree repetition detection
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-081 — one key array, two consumers. `ADR-0002` clause 3 built.

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **The table and in-tree repetition are ONE ticket, not two, and that is `ADR-0002`'s ruling, not a
> convenience.** Clause 3 has the search keeping **its own preallocated per-ply key array**, seeded
> once per search, deliberately **not** sharing the session's structure — and `ADR-0002` prices the
> repetition consumer at *"9–23 ns/node on top of a key the transposition table already needs"*.
> **Two tickets would each build a key array and the second would discover the first's.** That is
> the failure `ADR-0002` exists to prevent: *"`EPIC-004` would then build a second, incompatible
> notion of the path."*

## Problem

*User*: the player who does not want to wait, and who does not want to be "beaten" by repetition.

*Pain*: **(a)** chess transposes constantly; without a table the search re-searches the same
positions along different move orders, which is a straight multiplier on the node count `NFR-005`
converts into depth. **(b)** `ADR-0002` names the second half plainly: *"a search blind to repetition
will happily 'win' by repeating"* — it will evaluate a drawn repetition as a winning line.

*Value*: depth, and a search that knows a draw is a draw.

## Scope

- A **transposition table** keyed on the Zobrist key, storing depth, score, a bound flag
  (exact / lower / upper) and the best move (which `ABC-080` consumes as its hash move).
- Replacement policy, stated explicitly in the ticket's delivered code comment.
- A **preallocated per-ply key array**, seeded once per search — `ADR-0002` clause 3, verbatim.
- **In-tree repetition detection** off that same array: a position repeating within the search path
  scores as a draw.

## Out of scope

- **The incremental key itself** — `ABC-075`. This ticket **consumes** it.
- **The session's repetition history and threefold draw claim** — `EPIC-002`/`src/history.ts`,
  merged. `ADR-0002` clause 3 says the search **does not share that structure, deliberately**. **Do
  not import `history.ts` into the search.**
- **What the key hashes.** `ADR-0005` and `ADR-0006` are ratified.
- **Multi-threaded table access.** Threading is `UNKNOWN - verify` and Architect/Design's.

## The inherited caveat, named because `ADR-0006` says it will be asked again

`ADR-0006` records that the key hashes castling **rights**, not availability, and that
**`EPIC-004` inherits this**: *"a transposition table keyed on this hash will treat two placements
alike"* under that rule. The ADR also says the question *"will be asked again by whoever builds
`EPIC-004`'s transposition table."* **I am asking it and I am not answering it.** **Owner:
Architect/Design.** If the answer is "unchanged", this ticket proceeds as written; if the hash
changes, `ABC-075` changes with it. **A ratified ADR is not re-opened by a ticket.**

## Acceptance (Given/When/Then)

- **`A1` (the table changes work, not value).** **Given** the perft corpus at depth 4, **when**
  searched with the table enabled and disabled, **then** the returned **scores are identical** in
  every case. *(The single most dangerous class of TT bug is a bound flag applied at the wrong depth
  or window, and it shows up only as a wrong score.)*
- **`A2` (it hits, and the hit rate is reported).** **Given** `kiwipete` and `position-6` at depth 5,
  **then** the table hit rate is reported and is **≥ 15%**. *(A table that never hits is a
  memory leak with a lookup.)*
- **`A3` (node count falls).** **Given** the same runs, **then** node count is **≤ 70%** of the
  no-table build's. Report the actual figure.
- **`A4` (mate scores are stored correctly relative to the root).** **Given** a mate-in-2 position
  reached at two different plies of the same search, **then** the reported mate distance is correct
  at **both**. *(Storing a root-relative mate score in a depth-relative table is the classic TT bug
  and it makes the engine claim mates that are not there.)*
- **`A5` (in-tree repetition scores as a draw).** **Given** a position from which the only
  non-losing continuation repeats, **then** the search scores the repetition **exactly 0** and does
  not report it as a win for either side.
- **`A6` (the key array is the search's own).** **Then** grep of the delivered search modules finds
  **no import of `src/history.ts`** — `ADR-0002` clause 3 as a criterion, not a comment. And the
  array is allocated **once per search**, not per node (asserted by an allocation spy or by a
  size-invariance check).
- **`A7` (bounded memory).** **Given** a 3 s search, **then** table memory stays within a stated
  fixed bound and does not grow with search time — a fixed-size table, not a growing `Map`.
- **`A8` (nothing else moved).** **Then** `src/history.ts`, `src/legal.ts` and `src/turn-loop.ts`
  are **byte-identical**; suite green; skip **0**.

## Dependencies

- **`ABC-075` must land first — OPEN and itself blocked** on Architect/Design's ep ruling. **A
  per-node full-scan key at ~295–304 ns would make this table cost more than it saves.**
- **`ABC-077` must land first — OPEN.**
- **`ABC-080` is NOT a blocker** in either direction; the two are complementary and `ABC-080`'s
  `A5` makes the empty-table case a criterion.
- **Architect/Design's ruling on `ADR-0006`'s inherited caveat — OPEN**, named above.

## Security / NFR triggers

- **`NFR-005`** — `A3`'s **≤ 70%** node count and `A2`'s **≥ 15%** hit rate are this ticket's
  contribution to depth-in-budget. Figures carry node definition, position and machine.
- **`NFR-001`** — `A8`'s byte-identical `src/legal.ts` and the existing call-count guards.
- **`N8-LANE` — ≤ 650 ms CPU.** ⚠️ Depth-4/5 sweeps do not fit; **opt-in env flag** for the sweeps,
  a shallow subset in the default lane. Same shape as `ABC-077` and `ABC-080`.
- **Memory — `A7`'s stated fixed bound.** This is the first component in the project that holds
  meaningful memory, and there is **no memory NFR row in `plans/nfr-catalog.md`**. *(Recorded as a
  gap; setting one is Architect/Design's and Security/NFR's, not BA/PM's. `A7` binds the ticket to a
  stated bound regardless.)*
- **Security — not triggered.** No input surface.

## Test notes

1. **`A4` first.** Mate-score storage is the bug that survives every other test and makes the engine
   lie about mates.
2. **`A1` needs a table-disabled mode**, test-only, like `ABC-077`'s and `ABC-080`'s switches.
3. **`A5`'s position must be constructed, not found.** Write the repetition line explicitly.
4. **Do not test the session's threefold rule here.** `src/gameend.ts` owns it and `A6` forbids the
   import.

## Size and priority rationale

**Size `M` (3).** A fixed-size array-backed table, an entry encoding, a replacement rule, a per-ply
key array and a repetition check that is a scan over that array. **Not `L`:** the key it depends on
is `ABC-075`'s and the ordering that consumes it is `ABC-080`'s.

**Not `XL`. No `SPLIT_REQUIRED`** — and it is deliberately not split into "table" and "repetition"
because `ADR-0002` clause 3 makes them one structure.

**Priority `P0`.** `ADR-0002` names in-tree repetition as a correctness requirement, not an
optimisation, and the table is the second-largest depth lever after ordering.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two pains, the second quoted from `ADR-0002` as a correctness issue |
| 2 | scope and out-of-scope clear | **✅** four fences, one of them a ratified prohibition made into `A6` |
| 3 | INVEST-shaped | **⚠️** **not independent** — sits behind `ABC-075`, which is itself blocked |
| 4 | acceptance testable and measurable | **✅** eight: identical scores, **≥ 15%** hits, **≤ 70%** nodes, mate distance correct at two plies, exact-0 repetition, a grep-level import prohibition, a stated memory bound, three byte-identical files |
| 5 | dependencies known | **⚠️** **`ADR-0006`'s inherited caveat is OPEN** and is Architect/Design's. Named, asked, and deliberately unanswered here |
| 6 | security/NFR triggers with a measurable target | **✅** hit rate, node ratio, lane bar — **but see 10** |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **there is no memory NFR row in `plans/nfr-catalog.md`** and this is the first component that needs one. `A7` binds the ticket to a stated bound, but **no project-level bar exists to check it against.** Owner: Architect/Design + Security/NFR. Not BA/PM's, and not edited |

## § DoR re-score — 2026-09-25 (BA/PM, task `rescore-abc080-081`, Workflow 07)

**8 of 10 clean, 2 ⚠️ — still NOT met; stays in `Backlog`.** Re-scored against the CURRENT wave
tree (`grugops/wave-2026-09-24` @ `e12452e`), not the page. Full reasoning and the `NFR-005`
depth-6 arithmetic are in `.grugops/context/rescore-abc080-081/notes/` — not restated here.

- **Item 3 (INVEST-shaped) flips ⚠️ → ✅.** `ABC-075` (the incremental key this ticket
  consumes) and `ABC-077` are both `Done`. `ABC-080` remains not a blocker in either direction.
- **Item 5 (dependencies known) stays ⚠️, and a second open ruling is named.** `ADR-0006`'s
  inherited caveat (castling rights vs. availability in the hash) is re-checked and still
  open — no note answers it for `EPIC-004`. **New, previously implicit in the ticket's own
  scope prose, now named as its own open item:** whether the TT's own storage shares
  allocation/seeding with the `ADR-0020` per-ply key array, or is a second, independently
  persisted structure. Both are Architect/Design's; neither ruled here.
- **Item 10 stays ⚠️, unchanged.** `plans/nfr-catalog.md` re-checked directly (`NFR-001`–
  `NFR-008`, none a memory bound) — the gap is unchanged since 2026-08-16.
- **The owner's word (2026-09-25) keeps the `NFR-005` depth-6 floor; not re-leveled here.**
  `A2`/`A3` as written are hit-rate/ratio claims, not depth claims. Combined with `ABC-080`'s
  own bars, the two tickets' written criteria commit to roughly a 3.6x node-count reduction at
  a fixed depth — short of what three additional plies (depth 3 → 6) plausibly cost. Named
  plainly for the owner; no criterion re-leveled.

**Pullable today: NO.** Size `M`, priority `P0`, unchanged. **Recommended routing: send the two
open Architect/Design rulings ahead of a pull, in parallel with (not blocking) `ABC-080`'s own
path forward.**
