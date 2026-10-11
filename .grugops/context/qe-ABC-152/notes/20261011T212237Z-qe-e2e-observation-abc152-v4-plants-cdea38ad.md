---
id: 20261011T212237Z-qe-e2e-observation-abc152-v4-plants-cdea38ad
kind: observation
by: qe-e2e
at: 2026-10-11T21:22:37Z
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
  - QE-152-e
  - QE-152-f
  - QE-152-g
  - QE-152-h
  - ABC-084
  - src/puzzle-suite.test.ts
  - .grugops/context/qe-ABC-152/probe/plants-condensed.txt
  - .grugops/context/qe-ABC-152/probe/v4-results-head.tsv
  - 20261011T203648Z-software-engineer-observation-abc152-v4-plants-99dca079
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-c4-admissibility-screen-blinds-mocks-f80e9eba.md
supersedes:
---

# QE `ABC-152` `V4`: every one of the 20 files in the set has a QE-designed production plant that turns a count or routing guard red at head. A2 is red at head and blind on the old form. Ruling 7: 0 cases. Outside the set, `PUZZLE_DEEP=weakened`'s mock is blind at head (`QE-152-h`), and R2's shape re-arms it

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install. **No timing
was read.** All readings were taken 2026-10-11 on the M3 (Node v26.11.0).

## Method

- **Trees, all outside the repository.**
  - Head is a `git archive a99e9845` pristine copy plus a work copy.
  - The old form is `ccb8f1bd`: runner off, before ruling 3. Its lockfile is byte-equal to head's (`cmp`).
  - Base is `91024242`.
- **`node_modules`.**
  - Head and old-form copies take an APFS clone (`cp -Rc`) of QE's worktree's own `npm ci` tree (4.1.11). They
    are not symlinks.
  - Base ran its own `npm ci` (3.2.7).
- **Harness.** `probe/plant.mjs` applies each edit only if its anchor hits exactly once, and runs `vitest run
  <files> --reporter=json`. It records the diff (`/usr/bin/diff -u`), the reds and the exit. It then restores the
  files and checks with `/usr/bin/diff -rq` that the work copy equals the pristine copy again.
  - The exactly-once rule refused two anchors that hit twice (`vitest.config.ts`'s header and `zobrist.ts`).
    Both were widened and re-run. No plant ran on a double hit.
- **Plants are production-side** (`src/*.ts`, or non-test `tools/**`). The exceptions are R2's (a)/(b), which
  ruling 1 defines as test-side.
- **QE's own sites.** Each plant differs from the SE's (`…99dca079`) in the function or site it touches. The
  exceptions are the plants the ticket names: A20's two, R2 (a)/(b) and the A2 salt shape. QE also re-ran the
  SE's `PRODUCTION_DEPS` pair, in order to grade it.
- **Control.** All 20 files unplanted: 537 passed, 0 failed.
- **Raw output:** `probe/plants-condensed.txt` (each plant's diff and first reds) and `probe/v4-results-*.tsv`.

## The set: `D3`'s 13 files, `src/book.test.ts`, and C4's 17 (`…f80e9eba`); 20 distinct files

| file (form) | QE plant (production) | result at head `a99e9845` |
|---|---|---|
| `cli` (R1) | `cli-options.ts`'s refusal helper `reject` calls `selectGlyphMode` (A5 expects 0) | **red**: `called +0 times, but got 1 times` |
| `render-seam` (R1) | the seam calls `gameStatusOf` (`A2` expects 0) | **red**: `+0 times, but got 3 times` |
| `render-seam` (R1) | `renderHistory` twice (`A11` expects 1) | **red**: `renderHistory: … called 1 times, but got 2 times` |
| `command-input` (R3, `movesSpied` site) | `resolvePromptLine` resolves `moves` twice | **red**, 15 tests. 8 read `called 1 times, but got 2 times` (`ABC-036 A4`) |
| `command-input` (R3, clause-6 site) | the `quit` arm calls `deps.legalMoves` | **red**, 5: `expected 1 to be +0` |
| `command-input` (R5, `history.ts`) | the `help` arm calls `repetitionCounts` (`A6` expects 0) | **red**, 5: `expected 1 to be +0` |
| `command-input` (R5, `legal.ts`) | the `resign` arm calls `legalMoves` (0 after the outcome) | **red**: `expected 1 to be +0` |
| `command-input` (R5, `PRODUCTION_DEPS`, `src/move-input.ts:108`) | the deps path imports `legal.ts` by another URL (`?qe152`) | **red**: "A2 control" `expected 0 to be >= 1` |
| `san` A20 (ruling 2) | `export const PLANT = 1` (ticket) | **red**: `[ 'PLANT', 'parseSan', 'toSan' ]` |
| `san` A20 (ruling 2) | `export { toSan as toSanX }` (ticket) | **red**: `[ 'parseSan', 'toSan', 'toSanX' ]` |
| `san` A20 (QE extra) | `export default 0` | **red**: `[ 'default', 'parseSan', 'toSan' ]` |
| `san` A20 (QE extra) | `export type QePlant = number` | **green, correctly**: a type export is erased and is not run-time surface |
| `tools/opening-book/book` (R2 (a), test side) | delete `mockImplementation` | **red**: `expected [Function] to throw an error` |
| `tools/opening-book/book` (R2 (b), test side) | delete the `finally` `mockReset()` | **red**, 5 later tests read the stub: A8 `got 'a.tsv:2: key 0000000000000000 carries…'`. **A leak reader exists** |
| `tools/opening-book/book` (R2, QE production) | `compile.ts` imports `zobrist.ts?qe152` | **red**: D1(f) `expected [Function] to throw` |
| `gameend.nfr` (R4, `NFR-001`) | `zobristKey` read twice where the counts map is read | **red**: `called 1 times, but got 2 times` (exactly ONCE); the NOT AT ALL rows stay green |
| `zobrist.nfr` (R4, `NFR-005`) | `hasLegalEnPassant` asked only when an ep square is set (`ADR-0005`'s superseded rule) | **red**: `ep set, no capture at all: … +0 times, but got 1 times` |
| `san.nfr` (R4, `ABC-025` `N1`) | the mate test generates twice on a checking move | **red**: `checking move, list supplied: … called 1 times, but got 2 times` |
| `turn-loop.nfr` (R4) | `keyHistory` once before the first frame | **red**: `+0 times, but got 1 times` (8 failed across both turn-loop files) |
| `turn-loop` (R4) | a second `beginFrameSession` on the first frame | **red**, 4: `called 1 times, but got 2 times` (A19) |
| `history-pane.nfr` (R4) | `parseFen` twice per render | **red**: `parseFen at 0: expected 2 to be ≤ 1` |
| `status-panel.nfr` (R5 + R4) | the last-move line's `toSan` twice | **red**, 2: `called 1 times, but got 2 times` |
| `status-panel.nfr` (R5 + R4) | the panel calls `keyHistory` | **red**, 3: `one ply: … +0 times, but got 1 times` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:fs` `readFileSync` in the session | **red**: `readFileSync: … +0 times, but got 1 times` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:fs/promises` `readdir` in the session | **red**: `fs/promises readdir: … +0 …, got 1` |
| `glyph-mode.nfr` (R4, `NFR-007`) | `node:child_process` `execFileSync` in the session | **red**: `execFileSync: … +0 …, got 1` |
| `src/book.test.ts` A2 (ruling 3) | a deterministic load-time salt: a per-evaluation ordinal on `globalThis` rotates the candidates | **red at head** (`-t "ABC-094 A2"`) |
| `src/book.test.ts` A2, **old form** at `ccb8f1bd` | the same salt | **green, so blind** (`-t "ABC-094 A2"`), as ruling 3 says |
| `levels` (C4) | the blunder path skips the engine for its first child (one call removed) | **red**: `expected [ … ] to have a length of 7 but got 6` |
| `search.ordering` (C4) | one balanced make/unmake pair around the killer **offer** (the SE's was around the record) | **red**: stray-offer list of 244 |
| `engine.capacity` (C4) | the engine's **root** key write doubled (the SE doubled the inner one) | **red**: `expected 129 to be 128` |
| `search.capacity` (C4) | `search.ts`'s root key write leaves the mocked `zobristKeyAfterMove` | **red**: `expected 127 to be 128` |
| `search.pvs-lmr` (C4) | the **engine's** node `storeEntry` removed (the SE removed `search.ts`'s) | **red**: `no reduced fail-high was re-searched … expected 0 to be > 0` |
| `transposition` (C4) | the **engine's** node `probeTable` removed (the SE removed `search.ts`'s) | **red**: `A3 … expected 1 to be ≤ 0.7` |

**So every file in the set has a call-count or mock-routing guard shown red by a QE plant.** That includes:
- `NFR-001`, `NFR-005` and `N1`;
- `NFR-007`, once per spied module;
- A20, on both of the ticket's plants;
- R2 (a) and (b);
- R3's `called 1 times, but got 2`;
- an R5 plant inside the `PRODUCTION_DEPS` deps path.

The 34 rows cover 20 distinct files.

## The three plants that did not go red, each explained (none is a ruling 7 case)

1. **`so-root-make-routes-around-mock` (green).** QE routed `searchRoot`'s make/unmake through `./apply.ts?qe152`,
   expecting the factory mock to lose them. A scratch probe shows that it does not
   (`probe/query-url-probe/`):
   - **a factory `vi.mock` covers a query-string URL of the same file** (static 1, dynamic 1, query 1);
   - **a `{ spy: true }` automock does not** (static 1, query 0).

   So the plant never left the mock's view. It was a QE design miss, not a blind guard. Its replacement,
   `so-offer-made-one-ply-deep`, is red. The asymmetry is recorded as `QE-152-f`.
2. **`ec-root-key-not-via-mock` (green at head, and green at base 3.2.7 too).** `writesPerIteration()` pads the
   last iteration with `+ 1`, so a missing root write still reads a maximum of 128. This is pre-existing and not
   this ticket's (`QE-152-g`). The guard is armed by an add-plant on either key write: the SE's inner one and
   QE's root one (`expected 129 to be 128`).
3. **`ci-pd-add-SE`, the SE's add-plant on `PRODUCTION_DEPS` (green at head, and green at base).** It is graded
   below.

Two side effects, recorded:
- The salt plant also turns `ABC-094 A4` red at head **and** on the old form. A4 pins exact pick counts for one
  instance, and the rotation moves them. **A2 is graded on `-t "ABC-094 A2"` alone.**
- The extra `so-killer-recorded-one-ply-deep-QE` (an argument plant, not a call plant) is red too, on `A4`'s node
  count (`expected 4419 to be 3871`).

## Grading the SE's green add-plant on `PRODUCTION_DEPS` (`src/move-input.ts:108`)

- **Re-run by QE: the SE's reading is confirmed.**
  - The add-plant is green at head (188 passed) and green on base 3.2.7 (188 passed).
  - The removal plant is red at head and at base (`expected 0 to be greater than or equal to 1`, 4 failed).
- **QE's own plant on the same path is red.** The deps path imports `legal.ts` by another URL, and "A2 control"
  drops to 0.
  - So the `{ spy: true }` spy really does reach `PRODUCTION_DEPS`' load-time capture at head.
  - An extra call is counted. Nothing bounds it from above.
- **Grade: armed under ruling 1** ("adds **or removes** one call"), because for a `>= 1` guard the removal is
  the plant that can turn it.
  - **Not a ruling 7 case.** No admitted form left the guard green under every plant, and the blindness to an
    extra call is identical on base.
  - **The test gap is real and pre-existing:** no assertion in `command-input.test.ts` bounds the production
    path's `legalMoves` count from above.
  - Adding one is test content outside `V5`'s admitted forms, so it belongs to a follow-up, not to this ticket
    (`QE-152-e`).

## Beyond the set: one mock this ticket blinds that `V4`'s set does not hold (`QE-152-h`, HIGH)

- **QE searched every test file for the forms that went blind** (`vi.doMock`, `vi.resetModules`, namespace
  `vi.spyOn`, and a dynamic `import()` after a mock):
  - **one site remains:** `src/puzzle-suite.test.ts:368-374`, `PUZZLE_DEEP=weakened`'s `vi.doMock("./evaluate.ts",
    … evaluate: () => 0)` followed by `await import("./engine.ts")`;
  - the other dynamic imports are data corpora (`levels`' deep block), a child-process script (`transposition`),
    or already ruled (`san` A20, R2, ruling 3);
  - the `vi.spyOn` targets are `process.stdout` / `process.stderr`, `console` and `KillerTable.prototype`. A
    prototype spy works natively, which `search.ordering`'s red plants show.
- **The puzzle site is blind at head.** The weakened engine solves **54/58** at head against **15/58** at base
  3.2.7, so the gate row stays green. The run still exits 1, but only because A3 ("solves FEWER") fails.
  Details are in the readings note (`…469a3462`) and `probe/puzzle-weakened/`.
- **This is `ABC-084` A3's red demonstration of the puzzle gate.** `AGENTS.md` cites it as the "red demonstration"
  that "exits 1 by design".
  - It is the guard that proves the strength gate can go red. It is not the gate itself: `PUZZLE_DEEP=1` still
    reads 54/58 and still guards.
  - It escaped `V4`'s set because `D3`'s screen ran the default lane only. The SE's hand-off named it as owed and
    did not run it (`…4567b6b5`).
- **Armed by an admitted form, so this is not a ruling 7 case.** R2's shape (`vi.mock(p, { spy: true })` at file
  top, plus `vi.mocked(evaluate).mockImplementation(() => 0)`) turns the **gate row** red at 15/58 on a scratch
  copy. `PUZZLE_DEEP=1` stays 18/18 and the default lane 12/12, and the `expect(` count is unchanged
  (`probe/puzzle-weakened-results.tsv`).
  - R2's "reset in `finally`" has no reader here, because the weakened mode is the whole process. By ruling 1's
    own wording, a repair records "no leak reader".
  - Whether R2's "where" column stretches to this site is the Architect's to confirm. The form is not new.

## Ruling 7

**0 cases.**
- Every file in the set has a red plant under its admitted form.
- No test needed a deletion, a skip, a move, a merge or a weaker assertion.
- The three greens above are a plant miss, a pre-existing measure, and a pre-existing `>= 1` guard. Each one is
  shown the same on base, or is replaced by a red plant on the same guard.
