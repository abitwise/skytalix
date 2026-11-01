---
id: 20261101T233711Z-software-engineer-decision-50682dc7
kind: decision
by: software-engineer
at: 2026-11-01T23:37:11Z
verified_by: 
confidence: high: as committed in 3abaefdd; the design is ADR-0058 d1-d5 as written
refs:
  - se-ABC-238
  - ABC-238
  - ADR-0058
  - ABC-081
  - EPIC-011
  - ADR-0056
  - ADR-0026
  - ADR-0025
  - ABC-229
  - ABC-249
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-238
  - 3abaefdd
  - b19af469
supersedes: 
seal: sha256:4db827d8e499b3d2309abefd43d836f0415437258725668b1b48193683a40afe
---

# se-ABC-238 design: one `deeper` argument on `tableCutoff`, one `deeperCutoffs` switch per recursion, two test-only doors (ADR-0058 d1-d4, as written)

- **The rule (d1).** `src/transposition.ts` `tableCutoff(slot, depth, alpha, beta, ply, deeper)`. With `deeper`, an entry settles the node when `entryDepth >= depth`; without it, only when `entryDepth === depth` (today's rule). The bound rules are untouched: exact returns; lower >= beta; upper <= alpha; the stored score restored to `ply`, fail-soft and never clamped. A shallower entry never settles. `storeEntry`, the packing and quiescence are untouched. The doc comment is rewritten (it drops "never a deeper one").
- **The switch (d2).** `deeperCutoffs` is in `src/search.ts` `Switches` and `src/engine.ts` `Heuristics`. It is passed as an argument: `switches.deeperCutoffs` / `budget.deeperCutoffs`. There is no module state, no `EngineOptions` field and no option on `search()`. It is true only in `search()` and `chooseMove`.
- **The doors (d3).** `searchWithoutDeeperCutoffs(position, depth)` and `chooseMoveWithoutDeeperCutoffs(position, options)` are the shipped literal with `deeperCutoffs: false`, everything else on, `priorKeys` included on the engine side. Each takes no extra parameter (`length` 2).
- **The ladder (d4).** Every older door literal (12 in search.ts, 6 in engine.ts) passes `deeperCutoffs: false`.
- **The order of authority is unchanged in both `negamax`s (F3, read at review).** The order is: the in-path repetition (engine: then the pre-root repetition), then the leaf/capacity guard, then the probe. The root still probes for the hash move only.
- **R-TC part 1 item 2:** the diff adds no read of the budget, deadline, movetime or environment.
- **Rows re-pointed (d5):**
  - `src/quiescence.test.ts` `ABC-229 A3` (both boards): the shipped side is now `searchWithoutDeeperCutoffs`;
  - `ABC-229` drift d5: `searchWithoutDeeperCutoffs` and `chooseMoveWithoutDeeperCutoffs` on the shipped side.
- **Source rows re-pinned (d5)** (the new doors keep those switches on):
  - the `quiescenceEvasions` literal row: true set + the new door;
  - the `quietPromotions` literal row: true set + the new door;
  - `QE-208-c` `nullMove` map in `src/search.null-move.test.ts`: + the two doors, "true".
- **Export lists:** `ABC-077 A6` (`src/search.test.ts`) and `ABC-078 A4` (`src/engine.test.ts`) each grow by one name, with an arity row.
- **No value row moved:**
  - `ABC-249` (`src/engine.test.ts`, Ke1 404 / Kg1 497) reads unchanged. Test note 2 is not triggered: no re-pin, and the with-keys move still differs from the withheld one.
  - The other shipped-path value rows also read unchanged: kpk-b6c6 902, the -29 992 mate at 160 ticks, and the transposition perpetual rows.
- **Rows added:**
  - `src/transposition.test.ts`, default lane: the A2 predicate and each bound against each side of the window, with the switch on and off; a shallower entry never cuts; the two rules agree at equal depth; a deeper mate is restored to the probing ply; the `deeperCutoffs` literal rows; and a liveness row (position-3 d5: both recursions cut on a deeper entry, the doors cut on none).
  - `SEARCH_DEEP`: the A3 drift in both recursions; the 287 sign floor; the A4 report; the firing rate at d6.
  - The instrument is a call-through `tableCutoff` wrap in the existing `vi.mock`. It is a test-side count, not a production counter.
- **Fence slip (recorded, not hidden):**
  - The first typecheck, transposition-file runs and one SEARCH_DEEP transposition run used `npx vitest` / `npx biome`, which the brief fences out.
  - Every result reported as evidence was re-run with the local binary (`node ./node_modules/vitest/vitest.mjs`, se-ABC-228/229 precedent) or an npm script. No result depends on the npx runs.
