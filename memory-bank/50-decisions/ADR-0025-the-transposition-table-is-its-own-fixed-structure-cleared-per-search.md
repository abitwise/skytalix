---
kind: adr
id: ADR-0025
---
# ADR-0025: The transposition table is its own fixed-size structure, keyed from the per-ply array and cleared per search

## Status

**accepted** 2026-09-25, on the owner's delegated word, verbatim *"ADR-0025 I trust your
judgement there, select best option to move forward."* The Orchestrator selected the option
this ADR already rules (a separate fixed-size table, cleared per search), with no change. The
memory bound is `NFR-009`: the owner approved 16 MiB and licensed up to 128 MiB if needed.

Was **proposed**. Written 2026-09-25 by Architect/Design at task `wave-2026-09-24`, subtask
`ruling-abc080-081` (Workflow 07, a design ruling owed to `ABC-081`'s DoR item 5b).

- It builds on `ADR-0002` clause 3 and `ADR-0020` Decision 3 and amends neither.
- `ADR-0006` is inherited unchanged, with the table consequence recorded in its 2026-09-25
  amendment.
- No code changes because of this ADR. `ABC-081` builds against it.
- The probe numbers are in `.grugops/context/ruling-abc080-081/notes/` and the probe itself in
  `.grugops/context/ruling-abc080-081/probe/`. They are cited, not restated.

## Context

`ABC-081` delivers a transposition table and in-tree repetition off "a preallocated per-ply key
array, seeded once per search" (`ADR-0002` clause 3, verbatim). `ADR-0020` Decision 3 put the
incremental key on that array: `keys[ply + 1] = zobristKeyAfterMove(keys[ply], …)`. BA/PM's
2026-09-25 re-score named the open question: is the table's own storage the same structure as
that array, sharing allocation and seeding, or a second one? And does it live for one search or
persist?

Facts that decide it, measured at this hop:

- **What the two structures are.**
  - The key array is a stack of about a hundred `bigint`s: written at `ply`, read backward by the
    repetition scan, dead when the search returns.
  - The table is random-access by hash and holds tens of thousands of entries. A prototype stored
    39 137 distinct full-width positions on kiwipete to d6 (about 2 s) and 99 063 to d7 (about
    9 s).
- **Where the table's value comes from.**
  - Iterative deepening with the table plus the hash move: cumulative nodes to d5 fall to 63.2%
    (kiwipete) and 49.7% (position-6).
  - The table's own cutoffs without the hash move reach only 82%.
  - The value is therefore **across iterations of one move**: the previous iteration's best move
    tried first.
- **The engine has no depth cap, by design** (`RISK-002`; `ABC-078` `A4` asserts there is no
  depth constant). Any per-ply array therefore needs a capacity that is not a depth budget.
- **Typed arrays are measurable.** A 2^18-entry typed-array table reads exactly 4.00 MiB in
  `process.memoryUsage().arrayBuffers` after `gc()`, and allocating or clearing it costs under
  0.1 ms.

## Decision

1. **Two structures. They share the key VALUE, never storage, seeding or lifetime.**
   - **(a) The key array** belongs to the recursion, per `ADR-0002` clause 3 and `ADR-0020`
     Decision 3. It is seeded `keys[0] = zobristKey(root)` at every search entry and is the
     repetition scan's only substrate.
   - **(b) The table** is its own module (`src/transposition.ts` is the suggested name; the
     Engineer's call). It is probed and stored at the key read from `keys[ply]`.
2. **The table is a fixed-size typed-array structure, not a `Map`.**
   - Each entry holds the full 64-bit key, used to verify a hit (a `BigUint64Array`), plus the
     depth, the bound flag (exact / lower / upper), the score and the best move, packed into
     typed arrays.
   - The design point is 2^18 entries × 16 B = 4 MiB, 2.6x the 9 s occupancy above. The ceiling
     is the proposed `NFR-009` (16 MiB, draft).
   - The replacement policy is the Engineer's, stated in the delivered code comment, as
     `ABC-081`'s scope already says.
3. **Mate scores are stored relative to the node and restored relative to the root.** That is
   `± ply` at store and at probe, the shape `ABC-081` `A4` tests.
4. **Lifetime: one search.**
   - The storage is allocated once per process, lazily on first use, and cleared at every
     `chooseMove` and every `search()` entry.
   - It spans all iterative-deepening iterations of one move.
   - It does not persist across moves.
   - A worker-based engine later gets one table per worker by construction. Threading stays
     `UNKNOWN - verify`, as `ADR-0005` F6 left it; nothing here forecloses it.
5. **Only full-width nodes probe and store.** Quiescence does neither.
6. **Both recursions consume the one module.**
   - `src/engine.ts` is the production path.
   - `src/search.ts`'s `search()` also uses the table, so the identity oracle and the engine run
     one algorithm.
   - `src/search.ts` gains one TEST-ONLY door, `searchWithoutTable`, for `ABC-081` `A1`. That is
     the `ADR-0024` decision 7 precedent, and `ABC-077` `A6`'s export list widens by that one name.
7. **The key array needs a capacity, and the capacity is a runaway guard, not a budget.** It is a
   named constant in `QUIESCENCE_MAX_PLY`'s shape. At capacity the node is scored as a leaf.
   `ABC-078` `A4`'s no-depth-constant criterion is read as forbidding a depth that DRIVES a
   per-move decision, which a capacity guard does not do. The constant's comment must say so.

## Alternatives

- **One structure: the table's storage allocated and seeded together with the key array.**
  Rejected. It couples a 4 MiB random-access structure to a ~100-entry stack with a different
  lifetime and a different reader, and it gains nothing: the only thing the two share is a
  64-bit value, which passes in a register.
- **A `Map` keyed by `bigint`.** This is the prototype's shape, and it is rejected for the
  build. It grows with search time (`ABC-081` `A7` forbids that). Its memory hides in `heapUsed`,
  where `arrayBuffers` cannot see it. And it allocates per entry on the hot path.
- **Persist the table across moves**, with aging or a generation counter. Rejected now, not
  forever:
  - no measurement shows it is needed, because the depth-6 floor is reached without it;
  - `chooseMove(position, budget)` stops being a function of its arguments;
  - `ABC-078`'s identity sweep would compare against state left by an earlier move;
  - the session's history would effectively enter the search, against `ADR-0002` clause 3's
    intent.

  Re-open it with a measurement of depth gained across a real game.
- **Store the table on the `Position`.** Rejected for the reasons `ADR-0020` gave for the key:
  `ADR-0002` clause 1 ("no new state is added to `Position`").
- **The table in the engine only; `search()` table-free.** Rejected. The identity sweep would
  compare two algorithms, and `ABC-081` `A1` would have no fixed-depth table-on search to measure.

## Consequences

- **`ABC-078` `A3` (engine vs `search()`, move AND score).**
  - Scores stay exact: the prototype read 0 of 48 score mismatches at d1–d4 over the six perft
    roots and six engine endgames.
  - The root hash move can pick a different move among EQUALLY scored moves: 1 of 48 in the
    prototype. The move comparison must therefore accept a move whose score equals the
    reference's.
  - The amendment is `ABC-081`'s build hop's to make and BA/PM's to word. The score half is not
    relaxed.
- **`ABC-081` `A3` as written (fixed depth 5, "the same runs") reads 80.4% and 81.2%, and FAILS
  ≤ 70%.**
  - In the engine's own shape (iterative deepening, cumulative to d5, table + hash move vs no
    table) it reads 63.2% and 49.7%.
  - Recommended to BA/PM: re-state `A3` in that shape, and sequence `ABC-080` before `ABC-081` so
    the hash arm is live when `A3` is measured.
- **Graph-history interaction is accepted.** The key excludes the path and the halfmove clock, so
  a score that depends on an in-tree repetition or a 75-move leaf on one path can be reused on
  another. It is the standard accepted inaccuracy. `ABC-081` `A5` asserts its repetition case with
  the table ON.
- **`NFR-005`.** This shape is what the depth readings in the ruling assume. `NFR-009` (draft)
  gets its first consumer.
- **`memory-bank/30-architecture.md`** owes a Key components row for the new module when
  `ABC-081` lands, not now.

## Rollback

Cheap until `ABC-081` lands, and cheap after.

- Persisting across moves is a change of when the table is cleared, plus an aging field.
- Changing the size is one constant, inside `NFR-009`'s ceiling.
- Merging the two structures has no reason to happen.
- Removing the table from `search()` means deleting one call per node and the test-only door.

It gets dearer only once a later ticket (C1, PVS + LMR) comes to rely on the hash move for its
re-search ordering.

## What would falsify this

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **T1** | 4 — per-search lifetime is enough | a measurement across a real game showing a carried table adds ≥ 1 ply at 3 s on kiwipete or position-6 | a later probe or ticket; not owed now |
| **T2** | 2 — 2^18 entries suffice | a 3 s search whose replacement rate costs ≥ 10% nodes against a 2^20 table | `ABC-081` build, one-constant A/B |
| **T3** | 6 — both recursions, one algorithm | an identity-sweep SCORE mismatch between `chooseMove` and `search()` | `ABC-078` `A3`, as amended |
| **T4** | 7 — capacity is not a budget | the capacity guard binding on a benchmark root within 3 s | log the deepest ply reached in `ENGINE_DEEP` |
