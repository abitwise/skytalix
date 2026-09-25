---
id: 20260925T103100Z-software-engineer-decision-abc081-exact-depth-cutoff-always-replace-one-key-array-per-search-45dace80
kind: decision
by: software-engineer
at: 2026-09-25T10:31:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ABC-078
  - ABC-077
  - ADR-0025
  - ADR-0002
  - ADR-0006
  - ADR-0020
  - NFR-009
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
  - src/transposition.test.ts
supersedes:
---

# ABC-081 built: a cutoff only at the stored depth, always-replace, one key array per search

Hand-authored per `agent-factory/contracts/context-note.md`. There is no `seal`, which is the
degraded posture `AGENTS.md` records and is not re-derived here. Branch
`grugops/ABC-081-transposition-table`, off `grugops/wave-2026-09-24` @ `6033d05`. The code is at
`318c11a`. Three default-lane rows were added at `0076e6a` (a test file only), where the tests are
final. NOT merged, NOT pushed.

Each decision below is a judgment made at the build, and a reviewer may overturn any of them.

1. **A table entry settles a node ONLY at the depth it was searched to (`stored === needed`), not
   at any deeper one (`stored >= needed`).** `ADR-0025` leaves the probe rule to the build, and
   this is the design call that matters most.
   - Under `===` a cut returns the depth-limited value of that position to exactly that depth.
     `A1`'s "the table changes the work and not the value" is therefore true by construction,
     rather than true on the positions measured.
   - I measured both rules on scratch copies of the tree (`probe/measure.mjs`). They gave
     IDENTICAL nodes, scores and moves at fixed depth 4 (six roots and the `knight-g1` pair),
     fixed depth 5, and iterative depth 5 and 6 on kiwipete and position-6. So nothing is given
     up in the middlegame.
   - `>=` does differ in king endings. It cuts on thousands of cross-ply mate entries
     (`probe/xscan.mjs`), and on `kr-mid` at 80 injected ticks it reaches depth 8 where `===`
     reaches 7. That is a depth lever this build leaves unpulled, named for `NFR-005` below, not
     taken quietly.
   - The consequence for `A4`: under `===` an entry is reused at another ply only across the
     engine's iterations (N−2 → N, ply p → p+2). The ±ply mate adjustment is therefore
     almost dormant in a fixed-depth search, and `A4` is tested in two layers (decision 7).
2. **Replacement policy: always replace.** It is stated in `src/transposition.ts`'s header, as
   the Scope requires. The table lives for one move, so there is no stale generation to age out.
   `ADR-0025` falsifier `T2` is the measurement that would change it.
3. **Layout** (`ADR-0025` Decision 2): `BigUint64Array` keys, a `Uint32Array` packed word
   (move 17 bits | bound 2 | depth 13) and an `Int32Array` score. That is 16 B × 2^18 = 4 MiB,
   allocated lazily once per process, and `clearTable` zeroes the packed words only (a zero word
   is an empty slot). Every stored node has a legal move, so a best move always exists; the hash
   move is looked up in the node's own legal list by from/to/promotion. `MATE_FLOOR = 20 000` is
   declared in the table module, because `search.ts` imports it and a cycle would be needed
   otherwise; a test asserts it sits below every reachable mate score.
4. **The key array** is a `BigUint64Array(KEY_ARRAY_CAPACITY + 1)`, allocated in `searchRoot`
   and in `chooseMove`: once per search, seeded with `zobristKey(root)`. Each child's key is
   `zobristKeyAfterMove(parent)`. `KEY_ARRAY_CAPACITY = 128` is a runaway guard in
   `QUIESCENCE_MAX_PLY`'s shape: a node at that ply is scored as a leaf, and the comment says it
   is not a depth budget. `repeatsInPath` scans back from ply−4 in steps of 2, bounded by the
   halfmove clock. The order at a node is: repetition (exactly 0), then the leaf/capacity check,
   then the table probe, then move generation.
5. **Export lists and doors.**
   - `search.ts` exports THREE new names, not the one `ADR-0025` foresaw:
     - `searchWithoutTable`, the door the ADR names;
     - `KEY_ARRAY_CAPACITY` and `repeatsInPath`, so `engine.ts` shares the guard and the scan
       instead of duplicating them.
   - The table helpers (`tableCutoff`, `boundOf`) live in `transposition.ts`, not `search.ts`.
   - `ABC-077` `A6`'s export list is widened by the three, with the reason in the test comment.
   - Which doors have the table:
     - The two UNPRUNED doors have the table OFF, because a table cutoff is a main-tree cutoff
       and they decline cutoffs.
     - `ABC-080`'s two ordering doors (`searchWithoutOrdering`, `searchWithoutKillers`) have the
       table OFF too, so `ABC-080` `A4`'s ladder stays one lever per rung: none → MVV-LVA →
       + killers (`searchWithoutTable`) → + hash move (`search`). Its recorded numbers reproduce
       to the node.
     - `searchWithoutQuiescence` has the table ON: it is one switch from `search`, as
       `ABC-080` decision 5 requires.
6. **Two changes to lines outside the table, each forced by it, flagged here rather than
   hidden.**
   - (a) `searchRoot`'s `depth < 1` is now `!(depth >= 1)`. A depth-less call's `NaN` used to
     recurse until the stack overflowed, and that throw is what `search.qe.test.ts` `QE-G1`
     counted as "no move". The capacity guard turned that into a depth-128 search that never
     finished; the suite hung until this change.
   - (b) `engine.ts`'s `import type { GameHistory } from "./history.ts"` became
     `Parameters<EngineSeam>[0]`, so `A6`'s grep ("no search module imports `history.ts`") holds
     literally. It was a type-only import, erased at runtime.
7. **Tests.**
   - `A4` is tested at the table: a mate-in-2 stored at ply 1 and read at plies 1 and 3, and a
     mated-in-2 at plies 2 and 4. It is also tested in the search: `SEARCH_DEEP` `chooseMove` on
     `k7/8/8/K7/8/8/8/1R6 b`, the ONE case in a 182-position scan where dropping the adjustment
     changed a root score. There the reused entry is a mate-in-ONE position at plies 5 and 9.
   - `A5`'s position was CONSTRUCTED by a generator filtered by the search
     (`probe/gen.mjs`): White a rook down, and the only non-losing move, Qf8+, repeats at ply 5.
     It is asserted with the table ON, and its colour-flipped twin covers "either side". Its
     in-cycle sibling (queen already on f7) repeats at ply 4. That sibling carries the default
     lane at `0076e6a`: `search()` at depth 4 scores 0 in 7 241 nodes, and `chooseMove` at 6
     ticks reaches depth 4 with score 0. It was added because the first mutant pass left R2, S1
     and S3 alive in the default lane.
   - `A2`/`A3` count through a `vi.mock` wrap of `probeTable`/`storeEntry`, the same pattern as
     `ABC-080` `A6`'s `apply.ts` wrap. `A3`'s engine-shaped reading stops `chooseMove` exactly
     when a chosen iteration's root is stored.
   - `A7`'s `NFR-009` reading runs in a CHILD `node --expose-gc`, so no flag is needed on the
     runner.
8. **Re-pins, each re-measured and none taken from a failure message.**
   - `ABC-080` G4 275 → 261: bxa8=Q/R/B/N then ...Qxa8 reach one position four ways; this was
     found by listing ply-2 keys.
   - `ABC-078` `A3` fixture budget 4 → 3: the engine now completes depth 3 at 4.
   - `ABC-078` `A3` identity sweep: a different root move is accepted only when its OWN score at
     that depth equals `search()`'s score (test note 6). The score half is untouched.
9. **QE `ABC-080` `G1` closed** with one exact `chooseMove` pin: position-3 at 3 ticks, depth 3
   in 358 nodes. Mutant N3 reads 355.
