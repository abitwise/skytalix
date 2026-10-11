---
id: 20261011T203648Z-software-engineer-observation-abc152-v4-plants-99dca079
kind: observation
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0041
  - NFR-001
  - NFR-005
  - NFR-007
  - ABC-025
  - RISK-ABC152-A2-GRAPH
  - .grugops/context/ticket-to-pr-ABC-152/probe/plant.py
  - .grugops/context/ticket-to-pr-ABC-152/probe/specs/
  - .grugops/context/ticket-to-pr-ABC-152/probe/plants.out.txt
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-c4-admissibility-screen-blinds-mocks-f80e9eba.md
supersedes:
---

# SE `ABC-152` `V4`: 30 plants on 20 files. 28 behaved as armed requires (red where it must be, and the old A2 form blind as ruling 3 predicts). 1 add-plant stayed green, on a `>= 1` guard that is equally blind on base. Ruling 7: 0

This note is hand-authored and unsealed. **No timing was read.**

## Method

- **Copies.** `probe/mkcopy.sh` writes one `git archive` of the branch tip (`23c5521a`) per plant, into the session
  scratchpad outside the repository.
  - `node_modules` is a symlink to the **worktree's** (vitest 4.1.11), never the main checkout's.
  - The A2 old-form arm is archived at `ccb8f1bd`: runner off, before ruling 3.
- **Plants.** `probe/plant.py` applies one spec from `probe/specs/`. Each spec edits only production code (`src/*.ts`
  or non-test `tools/**`), except the two R2 arms, which the ruling 1 table defines as test-side, and the A2
  old-form arm, which is the old test at `ccb8f1bd`.
  - Every anchor must match exactly once.
  - It records the diff, made with `/usr/bin/diff -u` against the worktree file, plus the command, the red message
    and the exit.
- **Raw output:** `probe/plants.out.txt` (a 40-line excerpt per plant).

## The set: `A2`'s 13 files, `src/book.test.ts`, and C4's set (`…f80e9eba`)

| file (form) | plant (production unless noted) | result |
|---|---|---|
| `cli` (R1) | `cli-options.ts` `resolveOptions` imports and calls `selectGlyphMode` (the guard expects 0) | **red**: `expected "vi.fn()" to be called +0 times, but got 1 times` |
| `render-seam` (R1) | `render-seam.ts` calls `legalMoves` (`A2` expects 0) | **red**: `+0 times, but got 3 times` |
| `render-seam` (R1) | `renderBoard` called twice (`A11` expects 1) | **red**: `renderBoard: … called 1 times, but got 2 times` |
| `command-input` (R3) | `command-input.ts` `movesMessages` calls `derive` once more | **red**, 9 tests: `called 1 times, but got 2 times`. Also red: "the PRODUCTION path … one module-level legalMoves" reads `expected 2 to be 1`, so the `{ spy: true }` `legal.ts` spy (R5) sees command-input's direct import |
| `command-input` (R5) | `move-input.ts:108` `PRODUCTION_DEPS.legalMoves` calls `legalMoves` twice (**add**) | **green**, 188 passed. See below |
| `command-input` (R5) | `PRODUCTION_DEPS.legalMoves: () => []` (**remove** the call on the deps path) | **red**: "A2 control" `expected 0 to be greater than or equal to 1`, plus 3 behaviour reds |
| `san` (ruling 2) | `export const PLANT = 1` in `san.ts` | **red**: `[ 'PLANT', 'parseSan', 'toSan' ]` |
| `san` (ruling 2) | `export { toSan as toSanX }` | **red**: `[ 'parseSan', 'toSan', 'toSanX' ]` |
| `tools/opening-book/book` (R2) | (a), test side: delete `mockImplementation` | **red**: `expected [Function] to throw an error` |
| `tools/opening-book/book` (R2) | (b), test side: delete the `finally` `mockReset()` | **red**, 5 later tests read the stubbed key: A8 rows `got 'a.tsv:2: key 0000000000000000 carries…'`, A4 `expected 0 to be >= 3`. **A leak reader exists** |
| `tools/opening-book/book` (R2) | `compile.ts` `keyOf` stops calling `zobristKey` (a routing plant) | **red**: D1(f) `expected [Function] to throw an error` |
| `src/book.test.ts` A2 (ruling 3) | `book.ts` load-time `Math.random()` salt (the `a2-plant-book.diff` shape), **at head** | **red**: `expected [ 'c2c4', 'e2e4', … ] to deeply equal [ 'd2d4', 'b2b4', … ]` |
| `src/book.test.ts` A2, **old form** at `ccb8f1bd` | the same salt | **green, so blind**, as ruling 3 says |
| `gameend.nfr` (R4, `NFR-001`) | `gameStatus` calls `legalMoves` once more | **red**: `bare, in progress: … called 1 times, but got 2 times` |
| `gameend.nfr` (R4, `NFR-001`) | `gameStatus` reads `zobristKey` first (an expected-0 read added) | **red**, 2 tests: `+0 times, but got 1 times` (NOT AT ALL) and `1 times, but got 2` (exactly ONCE) |
| `zobrist.nfr` (R4, `NFR-005`) | `zobrist.ts` imports and calls `hasLegalEnPassant` (expected 0) | **red**: `startpos: … +0 times, but got 1 times` |
| `san.nfr` (R4, `ABC-025` `N1`) | `toSan` calls `legalMoves` first | **red**, 4 of 5: `pawn move, list supplied: +0 times, but got 1 times` … |
| `turn-loop` + `turn-loop.nfr` (R4) | `turn-loop.ts` calls `gameStatusOf` once more before the first frame | **red** in both files: 16 failed / 51 passed. nfr `called 41 times, but got 42`; turn-loop's `gameStatusOf` / `gameStatus` counts |
| `history-pane.nfr` (R4) | `history-pane.ts` imports and calls `gameStatusOf` (expected 0) | **red**: `gameStatusOf at 40: +0 times, but got 1 times`, plus `parseFen ≤ 1` and two import-graph guards |
| `status-panel.nfr` (R5 + R4) | `status-panel.ts` calls `squareAt(0, 0)` once more | **red**, 3 tests: `called 96 times, but got 97` … |
| `status-panel.nfr` (R5 + R4) | one more `isInCheck` | **red**: `called 1 times, but got 2 times` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:fs` `existsSync` in `selectGlyphMode` | **red**: `existsSync: … +0 times, but got 9 times` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:fs/promises` `access` | **red**: `fs/promises access: … +0 times, but got 9 times` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:child_process` `spawnSync` | **red**: `spawnSync: … +0 times, but got 9 times` |
| `levels` (C4) | `levels.ts` calls `chooseMove` once more on the engine path | **red**: `expected [ … ] to have a length of 1 but got 2` |
| `search.ordering` (C4) | `search.ts`: one `makeMove` / `unmakeMove` pair around `killers.record` | **red**: `expected [ …(212) ] to deeply equal []` (the stray-offer list, from the mocked `makeMove` count) |
| `engine.capacity` (C4) | `engine.ts` calls `zobristKeyAfterMove` once more | **red**: `expected 255 to be 128` |
| `search.capacity` (C4) | `search.ts` calls `zobristKeyAfterMove` once more | **red**: `expected 255 to be 128` |
| `search.pvs-lmr` (C4) | the node `storeEntry` call removed in `search.ts` | **red**: `no reduced fail-high was re-searched …: expected 0 to be greater than 0` |
| `transposition` (C4) | the node `probeTable` call removed in `search.ts` | **red**: `expected 0 to be greater than or equal to 0.1` |

So every file in the set has at least one call-count or mock-routing guard shown red by a production plant. For
`book.test.ts` A2 the plant is the load-time salt that ruling 3 names. `glyph-mode.nfr` has one red plant per spied
module. `NFR-001`, `NFR-005` and `N1` are each red.

## The one green plant, with its reading (not a ruling 7 case)

- **What:** R5 in `command-input`, an **added** call inside `PRODUCTION_DEPS.legalMoves` (`src/move-input.ts:108`).
  Result: 188 passed.
- **Why it is green:** the only guard that counts the module-level `legalMoves` on a `resolveMoveInput` call with
  production deps is "A2 control — the same legalMoves spy DOES count a real call on a line that is a move",
  which asserts `legalCalls() - before >= 1`. An added call cannot break `>= 1`.
- **It is not a blinding by this ticket.** The same add-plant on a **base** tree (`git archive main`, its own
  `npm ci`, vitest 3.2.7, `src/move-input.ts` planted identically) is also green, with 188 passed.
- **The guard is armed.** The **removal** plant on the same path turns it red (`expected 0 to be greater than or
  equal to 1`). The ruling defines "armed" as "adds or removes one call", and for a `>= 1` guard the removal is the
  plant that can turn it. With the runner off, the mock reaches `PRODUCTION_DEPS`' load-time capture. That was
  the `A2` arm's 13-red cause (`deps.legalMoves is not a function`).
- **Not ruled here:** whether that path *should* have an exact-count guard. That is a test gap that exists on base
  too, and it is QE's to grade. No test was added, because `V5` admits none.

## Ruling 7

**0 cases.** No guard stayed green under every admitted form. No test needed a delete, skip, move, merge or
weakened assertion.
