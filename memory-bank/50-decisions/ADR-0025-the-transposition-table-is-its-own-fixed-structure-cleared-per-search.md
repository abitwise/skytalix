---
kind: adr
id: ADR-0025
---
# ADR-0025: The transposition table is its own fixed-size structure, keyed from the per-ply array and cleared per search

## Status

*2026-10-26:* the amendment to decision 4 for `ABC-209` (the table lives one game, held by a game token) at the end
of this file is **ACCEPTED** by the owner (§ Proposed amendment 2026-10-26, Status). **It is in force on `main` at
`ABC-209`'s merge.** Until then, decisions 1–7 stand on `main` as written, decision 4's clear-per-search included.
Recorded by Architect/Design (task `arch-accept-adr0025-d4`, records only, at `main` `9857bd1c`).

Previously: a **PROPOSED** amendment, acceptance the owner's. Recorded by Architect/Design (task
`arch-design-ABC-209`).

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

## Proposed amendment 2026-10-26 (`ABC-209`): the table lives one game, held by a game token. ACCEPTED

### Status

**ACCEPTED** 2026-10-26 by Olger Oeselg (owner), verbatim *"1. yes; 2. A;"*, item 1 answering "accept the ADR-0025
amendment" (note `.grugops/context/owner-word-2026-10-26b/notes/20261026T132424Z-orchestrator-decision-2ae5fc12.md`).
He had been given the Orchestrator's forecast and lean to decline before he answered (`…388d6d51`, `…4e166e7b`).
Recorded by Architect/Design (task `arch-accept-adr0025-d4`, records only, at `main` `9857bd1c`).

- **ACCEPTED; in force on `main` at `ABC-209`'s merge.** Until then decision 4's clear-per-search stands on `main`.
  At `9857bd1c`, `src/engine.ts:550` still calls `clearTable()` at `chooseMove` entry, and no `ABC-209` build commit
  is on `main` (the `grugops/ABC-209` branch tip is `9857bd1c` itself). The QE verdict still decides that merge.
- **Reading (b) is met:** the gate on the build, the ALONE reading (`A6`, D) and the merge is the owner's acceptance,
  and he has given it.
- **If `ABC-209` does not merge (S1 NOT MET),** a dated line here records "accepted, not in force on `main`", as
  `ADR-0026` decision 9 does.
- **Drift rows:** this amendment assigns none to Architect/Design, so none are applied. Owed by other roles, listed
  only: the Software Engineer rewrites the source comments named in § Consequences at the build; BA/PM's `ABC-209`
  page `adr:` line, already placed by task `bapm-records-owner-b` (merge `ff9358e4`). The `ADR-0026` d7 sentence and the `ADR-0006` errata stay true; no
  edit. Nothing else in this ADR moves.

Previously **PROPOSED** 2026-10-26 by Architect/Design (task `arch-design-ABC-209`, records plus probes, at `main` `d0b1fff8`).
**Acceptance is the owner's** (`…5aaf7cec` item 3: changing an accepted ADR is his). Under `…7feb0553` item 2 the
work has his go-ahead, and the Orchestrator reports this text to him when it lands. No agent marks it accepted.

- **Reading (b)** (`…e496fc70`, as `…d25ab770` for `ABC-208`): the build may proceed while this is PROPOSED. **The
  ALONE reading (`A6`, D) and the merge both wait on his acceptance.**
- **The answer that settles it:** *"accept the ADR-0025 amendment"* or *"decline it"*.
- **Default without an answer:** decision 4 stands as written, and `ABC-209` is not merged.
- **If D is not a GAIN** (`A6`: one reading, final, `…4c3f7639`): `ABC-209` is not merged. A dated line here then
  records "accepted, not in force", and decision 4 stays in force on `main`.
- **Why an amendment and not a superseding ADR:**
  - one clause of one decision changes. Decisions 1–3 and 5–7 stand, and so do decision 4's allocation and iteration
    bullets;
  - this ADR named the change itself. § Alternatives rejected persistence "now, not forever" and § Rollback priced it
    as "a change of when the table is cleared";
  - every source cite reads "`ADR-0025` Decision 4". A superseding ADR would split one structure's rules across two
    files and leave those cites pointing at a dead decision. The repo's precedents are the same form: `ADR-0026`
    (2026-10-24) and `ADR-0023` (2026-10-26).
- Probes: `.grugops/context/arch-design-ABC-209/notes/` (the observation note). They ran on scratch clones of `main`
  `d0b1fff8`, never on `src/`. **No real-clock search was run, and no timing is quoted.**

### Decision 4, as amended (accepted 2026-10-26; in force on `main` at `ABC-209`'s merge)

4. **Lifetime: one game, held by a game token.**
   - The storage is allocated once per process, lazily on first use. *(Unchanged.)*
   - It spans all iterative-deepening iterations of one move. *(Unchanged.)*
   - **It persists across the moves of one game, and only while the caller says the game continues.**
     - **(a) The token.** `EngineOptions` gains one optional field, `game?: object`. It is an opaque identity that the
       search never reads. At entry, `chooseMove` and its three test-only doors call `prepareTable(options.game)`.
       That call clears the table unless `game` is present and is the table's current holder. The table then holds
       `game`.
     - **(b) Without a token, nothing changes.** The table is cleared at every `chooseMove` entry, as before this
       amendment. This is the clear door that `ABC-209` Scope 2 asks for, and it adds no new export.
     - **(c) `search()` keeps its clear at every entry.** That clear also releases the holder, so the next tokened
       call clears too.
     - **(d) One owner per game. The rule lives in one place, `src/transposition.ts`:** the holder,
       `prepareTable`, and `createGameTracker()`.
       - The CLI's level seam (`src/level-seam.ts`) holds one tracker for its session.
       - The UCI session (`src/uci-session.ts`) holds one tracker, and replaces it at `ucinewgame`.
       - `createLevel` passes the token to `chooseMove` on its engine path only. A blunder's children never carry it.
       - Nothing else passes a token.
   - **The continuation rule.** A tracker returns the same token while each search continues the game. A search
     continues the game when **its start position equals the previous search's, and the previous search's moves are a
     strict prefix of its own.** Otherwise the tracker returns a new token, and the table is cleared. This is the
     "non-continuing `position`" rule. It errs towards clearing: a clear is never wrong, only slower.
   - A worker-based engine later gets one table per worker by construction. *(Unchanged.)*

**The clear points that follow** (every other search keeps the table):

| path | event | table |
|---|---|---|
| any | a call with no token: every test, every door, the ladder, `createEngine`, a blunder's children | cleared, as today |
| any | `search()` | cleared, as today; holder released |
| CLI | the process starts | empty (unallocated) |
| CLI | `new` (`ABC-046`: a take-back to the start) | cleared: the move list is shorter |
| CLI | `undo` (two plies back, then a move) | cleared: the list is no longer longer than the previous search's |
| CLI / UCI | a book move between two searches | kept: the searched lines still extend |
| UCI | `ucinewgame` | cleared: a new tracker |
| UCI | `position` from another start, a take-back, an unrelated line, or `position fen` sent each move | cleared |
| UCI | the same position searched again | cleared: equal lists are not a strict prefix |

### Answers to § Alternatives' objections

- **"No measurement shows it is needed."** None does yet. D under ship rule S1 (`A6`) is the measurement, and the
  ticket merges only on a GAIN. A record from this hop, not a reading: at a fixed depth (d7, frozen clock), the
  one-sided games read 0.94, 0.96 and 0.97 of fresh nodes on moves 2–8. The expected gain is small
  (`UNKNOWN - verify`).
- **"`chooseMove(position, budget)` stops being a function of its arguments."** Without a token it still is. With a
  token, it is a function of its arguments and of the game that the token names. The caller says which game it
  continues; the engine never guesses.
- **"`ABC-078`'s identity sweep would compare against state left by an earlier move."** The sweep passes no token, so
  both sides start from an empty table (`T3` is untouched).
- **"The session's history would effectively enter the search, against `ADR-0002` clause 3's intent."** It does not
  enter the search. The search reads no session structure, and the per-ply key array is still seeded once per search.
  Only the seam reads the move list, and only to choose the token. What carries over is table entries, each verified
  against its full 64-bit key.

### Replacement and size

- **Always replace, unchanged. No generation, no ageing.**
  - A store overwrites its slot, so a stale entry lasts only until its slot is wanted.
  - An entry cuts only at its exact stored depth, verified against its full key. A stale entry is therefore never
    wrong, only possibly useless.
  - A generation needs bits the packed word lacks (17 + 2 + 13 = 32), or a new array. A new array changes
    `tableByteLength()`, which `A4` forbids.
  - `T2` stays the falsifier for the policy. `T5` below is new.
- **2^18 × 16 B = 4 MiB, unchanged.** No typed array is added. `tableByteLength()` stays 4 194 304. The holder is one
  reference.

### Consequences

- **`A1`.** A call without a token, and the first call with a new token, start from a cleared table. A cleared table
  equals a fresh process's, because a zero word is an empty slot.
  - Frozen-clock d7/d8 on kiwipete and position-6 read 8 of 8 equal, base against the design, with or without a
    first token.
  - `A2`'s paths read equal to a fresh process: `ucinewgame`, a non-continuing `position`, a re-searched position,
    and the CLI's `new`.
- **`A3`.** In the one-sided probe games the root was already in the table 19 times out of 21 (kiwipete 7/7,
  position-6 5/7, start 7/7). QE picks a pair whose reply is the stored hash move.
- **Test note 2 (`ADR-0032`).** The blunder path does not share the table. Its children are searched without a token,
  so each child's score is a function of that child alone, as `ADR-0032` decision 1 has it. The clear releases the
  holder, so after a blunder the game's next engine search starts fresh. This applies at levels 1–4 only; levels 5–7
  have rate 0.
- **The self-play ladder (`ADR-0038`)** drives two `createLevel` instances in one process with no token. Every call
  clears, so the ladder reads exactly as before. A shared table between two sides of one game was the reason a plain
  "keep" flag was rejected (below).
- **Texts that rely on per-search clearing stay true as written.** These are `ADR-0026` decision 7's 2026-09-26
  sentence and `ADR-0006`'s two 2026-09-26 errata: every row they cover runs without a token, and `search()` still
  clears. No edit is owed. `ADR-0050`'s "a null cutoff stores no table entry" is untouched.
- **`ADR-0027`.** The same sequence of calls gives the same moves. The token's state is a function of the call
  sequence, and the seed does not reach it.
- **Graph-history interaction (above).** This was accepted within one search. It now reaches across the moves of one
  game: a score that depended on an earlier path can be reused later. The key never held the game's history, so this
  is the same accepted inaccuracy over a longer span. `ABC-081` `A5` stays green.
- **`NFR-009`.** The size, the total and the "allocated once per process" half of decision 4 are unchanged. The growth
  clause (b)/(c) still bites.
  - The `A4` 40-move check is QE's: under `--expose-gc`, one game of 40 engine searches through one token, reading
    `heapUsed` and `arrayBuffers` after `gc()` at search 1 and search 40.
  - **Over 1 MiB in either field is a STOP.** A re-level is the owner's.
  - Design-hop record (frozen clock, d6): `heapUsed` Δ 41 024 B, `arrayBuffers` Δ 0 B, table 4 194 304 B before and
    after.
- **`G6` is blind to this change.** Each run is a fresh process, so its pre-check counts equal base's. Any difference
  is an `A1` red.
- **Source comments to rewrite in the build:**
  - `src/transposition.ts:17-20`, `:22-26` and `:75-77`;
  - `src/engine.ts:57-62`.
  - `src/search.ts:24-26`, `:149` and `:594-597`, and `src/engine.ts:420`, stay true, because they describe
    `search()` and token-less calls.

### Alternatives considered at this hop

- **The shipped `chooseMove` always keeps the table, and only a test door clears it.** Rejected.
  - Test results would depend on test order within a file.
  - Every existing door shares `deepen`, so each would either keep the table as well or need a pair.
  - The `G1` harness would carry entries from one puzzle into the next.
  - The ladder would share one table between its two sides.
- **A plain `keepTable: boolean`, with explicit `clearTable()` calls at new-game points.** Rejected.
  - The ladder's two in-process instances would share one table.
  - The CLI's `new` reuses the same seam and level instance, so a missed clear point would be silent.
- **One table per game owner.** Rejected: 4 MiB per owner breaks "size unchanged" and squeezes `NFR-009`'s total.
- **A generation or depth-preferred replacement.** Rejected now: there are no free bits, and no measurement asks for
  it (`T5`).
- **The engine guessing continuation from positions (for example, root-key lineage).** Rejected: it is a heuristic in
  the hot path, and the caller already knows.

### Falsifiers added or re-read

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **T1** (re-read) | 4 — per-search lifetime is enough | **this amendment's D reading** (`A6`, S1). Not a GAIN → T1 holds, and the amendment is not in force | `ABC-209` `A6` |
| **T5** | 4 as amended — always-replace is enough across a game | the carried table's root-hit rate or D falling behind a generation-aged A/B | a later ticket; not owed now |

### Rollback

- **Before acceptance** (passed; accepted 2026-10-26): mark this section `withdrawn`. Nothing else was edited.
- **After it ships:** `prepareTable(options.game)` becomes `clearTable()` again, and the two trackers and the
  optional field are deleted. About ten production lines; no data or format is involved.
