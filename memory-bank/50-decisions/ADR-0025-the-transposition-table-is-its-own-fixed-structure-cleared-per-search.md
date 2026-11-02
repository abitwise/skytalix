---
kind: adr
id: ADR-0025
---
# ADR-0025: The transposition table is its own fixed-size structure, keyed from the per-ply array and cleared per search

## Status

*2026-11-02, the owner's answer:* the T2 amendment at the end of this file is **PARKED with `ABC-258`**. His word,
verbatim (`orch-2026-10-30a` `…81ae2db4`): *"B park"*, the Orchestrator's reading "parked with `ABC-258` (larger
table / threads)". It is neither accepted nor declined, and nothing is built for it. Decisions 1–7 stand on `main` as
written, always-replace included. Recorded by Architect/Design (task `arch-owner-answers-1102`, records only, on
`grugops/arch-owner-answers-1102` from `main` `7daf8086`). Details are in that amendment's own status line.
`ADR-0057` (accepted the same day) names amendments to decisions 2 and 4 that the threads strand's shared-table
ticket will bring; they are not written here yet.

*2026-11-02:* the T2 amendment at the end of this file **stays PROPOSED, pending the owner. The Architect recommends
parking it** (task `arch-phase1-replan`, records only). At a depth-8 search on today's 2^18 table, T2 changes nothing
measurable, but on a loaded table it pays. Details are in that amendment's own status line. Decisions 1–7 stand on
`main` as written.

*2026-11-01:* a **PROPOSED** amendment to decision 2's replacement bullet for `ABC-237` (depth-preferred
replacement, T2) is at the end of this file. Acceptance is the owner's. Until he accepts it and `ABC-237` merges,
decision 2's "the replacement policy is the Engineer's" and the delivered always-replace stand on `main`. Written by
Architect/Design (task `arch-epic011-phase1`, records only, at `main` `13627d0f`).

*2026-10-27:* the amendment to decision 4 for `ABC-209` (the table lives one game, held by a game token) at the end
of this file is **accepted, not in force on `main`**. `ABC-209`'s single reading was S1 NOT MET (pooled over 800 games
NEUTRAL +8.69 ± 18.25), so the ticket was not merged. **Decisions 1–7 stand on `main` as written, decision 4's
clear-per-search included.** Recorded by Architect/Design (task `arch-adr0025-not-in-force`, records only, at `main`
`a5306773`), on Orchestrator `…00f47145` and QE `…e32e0ee4`.

Previously (2026-10-26): the amendment **ACCEPTED** by the owner, in force on `main` at `ABC-209`'s merge. Recorded by
Architect/Design (task `arch-accept-adr0025-d4`, records only, at `main` `9857bd1c`).

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

## Proposed amendment 2026-10-26 (`ABC-209`): the table lives one game, held by a game token. ACCEPTED, not in force on `main`

### Status

- **2026-10-27: accepted, not in force on `main`.** `ABC-209`'s one reading (`A6`, D under S1, final under
  `…4c3f7639`) was NOT MET: d1 NEUTRAL −0.9 ± 25.3, the one extension d2 NEUTRAL +18.3 ± 26.3, pooled over 800 games
  NEUTRAL +8.69 ± 18.25 (QE `…e32e0ee4`, failed attempt `…0932c037`, at merge `b5f46e86`). The ticket was not merged
  (Orchestrator `…00f47145`); `grugops/ABC-209` `bb6cf451` is kept unmerged. On `main` (`a5306773`), `src/engine.ts:550`
  still calls `clearTable()` at `chooseMove` entry, and `src/` has no `game` option, `prepareTable` or game tracker.
  **Decision 4's clear-per-search stands on `main`.** `T1` holds by this reading. This line moves no code. Recorded by
  Architect/Design (task `arch-adr0025-not-in-force`), the `ADR-0026` decision 9 form.

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

### Decision 4, as amended (accepted 2026-10-26; not in force on `main`, 2026-10-27: `ABC-209` not merged)

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
| **T1** (re-read) | 4 — per-search lifetime is enough | **this amendment's D reading** (`A6`, S1). Not a GAIN → T1 holds, and the amendment is not in force. *2026-10-27: read NEUTRAL; T1 holds* | `ABC-209` `A6` |
| **T5** | 4 as amended — always-replace is enough across a game | the carried table's root-hit rate or D falling behind a generation-aged A/B | a later ticket; not owed now |

### Rollback

- **Before acceptance** (passed; accepted 2026-10-26): mark this section `withdrawn`. Nothing else was edited.
- **After it ships** (not reached: `ABC-209` was not merged, 2026-10-27; nothing to roll back on `main`): `prepareTable(options.game)` becomes `clearTable()` again, and the two trackers and the
  optional field are deleted. About ten production lines; no data or format is involved.

## Proposed amendment 2026-11-01 (`ABC-237`, T2): a store keeps the deeper entry of another position. PARKED (2026-11-02)

### Status

**PARKED** 2026-11-02 by the owner, with `ABC-258` (*"B park"*, `orch-2026-10-30a` `…81ae2db4`). Recorded by
Architect/Design (task `arch-owner-answers-1102`, records only). Nothing was run.
- **What parked means here:** the text below is kept as written and is not accepted. `ABC-237` is not built. Its
  status stays PROPOSED in form, and it is re-asked only when it is unparked.
- **When it comes back, and with what:** with `ABC-258` (T4, the larger table) or with the threads strand's shared
  table (`ADR-0057`, accepted 2026-11-02), whichever loads the table first. Both raise table pressure, and pressure is
  the only place T2 was measured to pay (0.77× at 2^14, below). Several workers storing into one table multiply the
  stores a search makes. The re-ask brings a fresh measurement on that base. The 2026-11-02 figures below are on a
  single-threaded 2^18 table and do not carry over.
- **The open question at the end of § The read `ABC-237` owes is answered** (*"C yes"*; `ADR-0056` D5 C2′ dated
  line). A change that cannot be seen at 100 ms may be read on the NEUTRAL bar, together with its own measured bar.
  So on unparking, T2's page may name NEUTRAL before its read, with `A3`'s mechanism rows as its own bar.

*2026-11-02:* **still PROPOSED, pending the owner. Recommended: park it with `ABC-258` (T4), and do not build it now.**
Architect/Design, task `arch-phase1-replan`, measured on scratch patches outside the repository.
- **The premise (deeper entries are evicted) does not hold on a lightly loaded table.**
  - Of the probes where a deeper result for the key had been computed earlier in the search, another key evicted 12
    on the 190 at depth 6, and 0–1 per depth-8 search.
  - T2's own drops: 0.3–1.5 % of stores at depth 8, and 1.1 % on the 190 at depth 6.
- **Node ratios at fixed depth 8, against the door:**
  - T2 alone: `search()` 1.0004× / 1.0028×; `chooseMove` 0.9940× / 1.0012× (kiwipete / position-6).
  - T1 + T2: 0.9943× / 0.9950× and 0.9466× / 1.0013×.
  - Across three short games, T2 alone pooled 0.9726× (geometric mean 0.9834×, per-search sd of the log 0.12), which
    is chaos-level noise.
- **The Context's pressure arithmetic overstates the load.** It counts every node as a store. Only 3–5 % of nodes
  store, because quiescence nodes never do.
  - Per search, that is about 2 k stores at 100 ms and about 0.1 M at 4 s, against 262 144 slots. "≤ 91 % at 4 s"
    is about 18 % on the same formula.
  - Real pressure comes at 40/15 (about 0.4–1.0 M stores a search) or with the table kept across moves.
- **Where T2 pays:** on a 2^14 table (about 3 stores a slot a search), T2 alone pooled **0.7712×** and T1 + T2
  **0.7408×** over the same three games. So T2 is a remedy for pressure, and it belongs with the table-size question
  (`ABC-258`) and the kept table (`ABC-257`). It cannot be seen at the 100 ms read.
- **T6 was not run.** No `ABC-237` build exists.

**PROPOSED** 2026-11-01 by Architect/Design. Task `arch-epic011-phase1`, records only, at `main` `13627d0f`. Nothing
was run, built or timed.

- **Acceptance is the owner's.** Changing an accepted ADR is his (2026-10-22 delegation, `…5aaf7cec` item 3).
- **The answer that settles it:** *"accept the ADR-0025 T2 amendment"* or *"decline it"*.
- **Reading (b)**, the `ABC-208` / `ABC-209` precedent:
  - the build of `ABC-237` and its gates may proceed while this amendment is PROPOSED;
  - the read it owes (below) and the merge wait on his acceptance.
- **Default without an answer:** always-replace stands, and `ABC-237` does not merge.
- **If `ABC-237` does not merge,** a dated line here records "accepted, not in force on `main`" (`ADR-0026` decision 9's
  form).
- **What this amendment touches:**
  - **It changes:** decision 2's third bullet only.
  - **Decision 4 is untouched.** The table is still cleared per search. The 2026-10-26 decision 4 amendment stays
    accepted and not in force.
  - **Decisions 1, 3 and 5–7 are untouched.** So are the size (2^18 × 16 B = 4 MiB) and `ADR-0058` (T1, deeper
    cutoffs), which this amendment follows on the shared file.
- **Why an amendment and not a new ADR.** This ADR named the policy as its own open slot ("the replacement policy is
  the Engineer's") and named its falsifier (`T2`). Every source cite of the policy reads "`ADR-0025`", as the
  2026-10-26 amendment argued for decision 4.

### Context

- **Today.** `storeEntry` overwrites its slot whatever the slot held (`src/transposition.ts:22-26`, `:136-148`). A
  shallow store of position B evicts a deep entry of position A, which cost far more to compute (SA `…306a4012`
  row 9b).
- **Under `ADR-0058`, a deep entry is worth more.** It now settles shallower probes, where before it only supplied a
  hash move. That is why `ADR-0056` D6 orders T1 before T2.
- **Table pressure, by arithmetic from `qe-tc-depth-probe` `…1889e3b0` R1** (median nodes per search: 47 131 at
  100 ms, 317 555 at 500 ms, 2 806 820 at 4 000 ms; 262 144 slots):
  - Storing `n` keys at random into `m` slots, the expected share of stores that land on an occupied slot is
    `1 − (m / n)(1 − e^(−n/m))`.
  - That gives **≤ 8.5 % at 100 ms, ≤ 42 % at 500 ms and ≤ 91 % at 4 s.**
  - These are upper bounds. Quiescence nodes are counted but never stored, and a re-store of the same key evicts
    nothing.
  - **So T2 acts in proportion to table pressure, not to depth.** It barely fires at 100 ms, and it fires on nearly
    every store at the shipped 4 s.

### Decision 2, third bullet, as amended

- **The replacement policy is depth-preferred.** A store writes its slot when any one of these holds:
  - **(a)** the slot is empty;
  - **(b)** the slot holds the same position (the full 64-bit key is equal);
  - **(c)** the slot holds another position whose stored depth is **no greater than** the new depth.

  Otherwise the store is dropped, and the slot keeps the deeper entry of the other position. The rule is stated in
  the delivered code comment, as before.
- **Why (b), the same key always replaces.** A node is searched, and so stores, only when its own entry did not settle
  it. Its new result, window and best move are what the next identical probe wants, and the newest hash move is the
  one the next iteration tries first (this ADR's Context: the table's value is "across iterations of one move").
- **Why "no greater than" in (c), and not "less than".** At equal depth the newer entry wins, as today.
- **The root's store always lands.** The root stores at the iteration's depth `d`. Every other entry in a table cleared
  per search holds remaining depth ≤ `d − 1` (children of this iteration's root, or earlier iterations). So the root's
  hash move for the next iteration is never blocked.
- **One switch, `depthPreferred`, in BOTH recursions,** passed to `storeEntry` as an argument. That means no
  module-level state and no option (`ADR-0026` decision 2). The name is the Engineer's.
- **Two TEST-ONLY doors,** one per recursion. Each is the shipped path with `depthPreferred` off and everything else
  on: the pre-`ABC-237` `search()` and `chooseMove`, node for node (`ABC-237` `A1`). The names are the Engineer's, in
  the `…Without…` form.
- **Every door that exists before `ABC-237` turns `depthPreferred` off,** by the ladder rule (`ADR-0026` decision 3).
  - If `ABC-238` merged first, `ADR-0058`'s two doors are among them. Each then turns T1 and T2 off and still
    reproduces the pre-`ABC-238` search.
  - Rows re-point as `ADR-0058` decision 5 says, now to the T2 door.
  - If `ABC-238` closed unmerged, the same holds without the T1 doors.
- **No bits and no arrays are added.** The packed word stays 17 + 2 + 13 bits, and `tableByteLength()` stays
  4 194 304. **No generation or age.** In a table cleared per search, every entry is from this move.

### The bounded oracle and the rule's rows

- **The rule's rows (`ABC-237` `A2`, worded for BA/PM).** Two DIFFERENT keys that share one slot:
  - store depth 6 then depth 2: the depth-6 entry remains;
  - store depth 2 then depth 6: it is replaced;
  - store depth 4 then depth 4: it is replaced.

  One key, stored at depth 6 then at depth 2: replaced, by (b). With the switch off, every case replaces.
- **Drift, the regression net.** At depth 5 on `ABC-121`'s 190, in both recursions, against the T2 door: at least 95 %
  of non-mate positions within 25 cp, and 0 mate scores change sign (`ADR-0058` decision 6's bars).
  - At depth 5 the table is barely loaded, so a correct T2 reads close to identity. The test reports the count of
    identical scores.
  - A rule wired to drop same-key stores, or to compare the wrong way, is what this row is for.
  - It is not a proof. The rows above are.

### The read `ABC-237` owes (`ADR-0056` D5, as folded)

- **Intent: GAIN.** T2 is meant to make the engine stronger. C2′ reserves NEUTRAL for correctness fixes and
  simplifications, and the Architect does not re-class a strength change to soften its bar.
- **C2′:** 100 games at 100 ms against the merge-base, ≥ 50.0 of 100, with 0 faults and 0 losses on time.
- **S′:** 10 games at 0.5 s against Stockfish 19 at E 1 650, ≥ 3.0 of 10 (below that, ≥ 7.0 of 20).
- **The Levels deep lane:** exit 0, every test passed. QE counts its own run; `EPIC-010`'s close read 57/57.
- **R-TC item 2 at review.** T2 is keyed on table state only.
- **What 100 ms can see: almost nothing of the gain.** At most 8.5 % of stores meet another position's entry at
  100 ms (Context). So the 100-game read guards against breakage, and its score sits near a coin flip for an effect
  this small. QE reports it with that limit stated, as `ABC-258` `A4`'s note does for size.
- **What sees the mechanism:** `ABC-237` `A3`.
  - The 3 000 ms median completed depth, over 5 interleaved runs per build.
  - Fixed-depth-8 nodes on kiwipete and position-6. An inference from R1, not a measurement: kiwipete reaches depth 8
    only at 4 s, where the median search visits about 10× the slot count.
- **A longer-control read is not recommended.** 100 games at 500 ms (≈ 2.3 h, `ADR-0056` C2′) is an other run over
  1 h, so it is the owner's to allow. At the +5–15 estimate (`ADR-0056` D2), 100 games cannot resolve the effect at
  any control (C2′'s table: P(pass | +10) = 0.66).
- **Open question for the Orchestrator** (a C2′ change, so the owner's if asked): may a mechanism that cannot fire at
  the read's control be read on the NEUTRAL bar, with its gain shown by its own mechanism rows? This applies to T2
  and T4 (`ABC-258`) alike. Without an answer, the GAIN bar applies as above.
  - *Answered 2026-11-02 (owner, "C yes"; this amendment's status line and `ADR-0056` D5 C2′'s dated line): yes.*

### Falsifiers added or re-read

| # | clause | what would falsify it | how to check |
|---|---|---|---|
| **T2** (re-read) | 2 — 2^18 entries suffice | unchanged: a 3 s search whose replacement costs ≥ 10 % nodes against a 2^20 table. Still `ABC-258`'s question, not this amendment's | `ABC-258` |
| **T5** (re-read) | 4 as amended 2026-10-26 — always-replace is enough across a game | moot while decision 4's amendment is not in force; `ABC-257` re-reads it against this policy | `ABC-257` |
| **T6** | 2 as amended here — depth-preferred pays at 2^18 | `ABC-237` `A3` missed: head's median completed depth at 3 000 ms below base's on kiwipete or position-6, or fixed-depth-8 nodes above **0.97 ×** the door's on both; or C2′ NOT MET | `ABC-237` `A3`, `A6` |
| **T7** | 2 as amended here — the rule is wired as written | any `A2` case wrong, or the drift row red | `ABC-237` `A2`; the drift row above |

If T6 fires, `ABC-237` is not merged and this amendment is "accepted, not in force". If T7 fires, it is a defect,
back to the Engineer.

### Consequences

- **`NFR-009`:** unchanged (`A4`'s 16 MiB and its growth clause still bite). **`NFR-005`:** `A3`. No new NFR file.
- **Source comments to rewrite in the build:**
  - `src/transposition.ts:22-26`, the "always replace" header;
  - the `storeEntry` doc at `:132-135`;
  - the `describe` title at `src/transposition.test.ts:239` and its "always replaces" row (`:252`). That row stays,
    as the door's behaviour.
- **`ADR-0057` coupling (named, not decided).**
  - The rule is layout-neutral. Word 2 of `ADR-0057` D2.3 keeps today's packing.
  - Under a lockless shared table, depth-preferred replacement is a read, a compare and a write, with no lock. A lost
    race costs only a replacement decision, never correctness, because the XOR check still guards every hit.
  - If `ABC-257` needs an age field, the 13-bit depth field is the only donor that does not grow the entry. That
    trade is a layout question for `ADR-0057`, not this amendment.
- **`ABC-257` coupling.** With the table kept across moves, depth-preferred replacement with no age lets deep entries
  from earlier moves hold their slots for the rest of the game. `ABC-257`'s design owes an age rule, or a measured
  statement that none is needed.
- **Migration:** none.

### Rollback

- **Before acceptance:** mark this section `withdrawn`. The status line at the top goes with it.
- **After it ships:** set `depthPreferred` to false in `search()` and `chooseMove`, two booleans. The shipped path is
  then the door, node for node. Removing the switch, the doors and the re-points afterwards is a revert of one ticket.
