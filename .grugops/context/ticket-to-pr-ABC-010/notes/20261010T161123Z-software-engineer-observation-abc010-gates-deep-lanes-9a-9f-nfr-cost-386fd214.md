---
id: 20261010T161123Z-software-engineer-observation-abc010-gates-deep-lanes-9a-9f-nfr-cost-386fd214
kind: observation
by: software-engineer
at: 2026-10-10T16:11:23Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ADR-0035
  - ADR-0036
  - NFR-001
  - NFR-002
  - N8-LANE
  - src/fen.ts
  - 20261010T161123Z-software-engineer-decision-abc010-two-entries-rule-order-fixtures-re-authored-5b986289
supersedes:
---

# `ABC-010` readings: premise held at `be37e222`; gates green, 1,641 tests, skip 0; 9(a)–(f) met; deep lanes 5/5 exit 0; `NFR-002` 2.45 µs; `NFR-001` 3.60 M/s; cost admissible on all 4 sets, `N8-LANE` UNRESOLVED on the 50-file set

This note is hand-authored and unsealed. Branch `grugops/ABC-010-fen-semantic-validation`, from `be37e222`; code commit
`1304cc2c`. Not merged, not pushed. Apple M3, Node v26.11.0. Load1 ran 8 to 51 throughout, with other agents' lanes
in parallel; load was logged, not gated. The raw files are in `../probe/` (`RUN.txt`). The committed probe scripts
ran without a permission refusal.

**The premise was re-verified at `be37e222` before any edit.**
- The Architect's corpus scan reads 1,099 literals, with 143 distinct (185 occurrences) rejected. That output is
  **byte-identical** to BA/PM's `b98fb419` reading.
- The 9(d) scan rejects the same 15 grammar faults.
- `src/` drift since `b98fb419` is `cli.ts`, `render-seam.ts` and `result-screen.ts`, none of them in the fence.
- Every cited line anchor holds (`quiescence.test.ts:329`, `levels.test.ts:351` and the others).
- The 9(d) stop rule did not fire. The fence is exactly the 16 files (`git diff --name-only be37e222 1304cc2c`).

**Gates** (worktree, `1304cc2c`; load1 22.6 at the start):
- lint, typecheck and build exit 0;
- `npm test` exits 0: 52 files, **1,641 passed** (1,608 + 33 new rows in `src/fen.test.ts`), 13.5 s;
- skip count 0, and integrity reports `No findings.`;
- `lane-inventory.js`: "52 test files; git tracks 52. No findings."

**Criteria:**
- **(rows 1–8, the rejections) MET.** All are in `src/fen.test.ts`. 20 rows were red before `fen.ts` changed: the
  14-row semantic table, the order row and the 5 non-string rows. All are green after. Each row asserts
  `toThrow(FenError)` and an anchored message regex. The 5 non-string rows assert `instanceof FenError` explicitly.
- **(round trip) MET.** `parseFen(toFen(p))` does not throw, and the re-serialisation is byte-identical, over 11 FENs
  (the 6 perft roots, the after-`1.e4` FEN and 4 others, including `MAX_SAFE_INTEGER` clocks).
- **9(a) MET.** The 6 perft roots and every `ABC-001` case parse through `parseFen`. `:29` was re-authored to the
  ticket's FEN and still round-trips.
- **9(b) MET.** In each of the six swap files, `git diff -U0` changes one import line (`-1/+1`), and every test passes
  unedited: 384/384.
- **9(c) MET.** `A2` and `A4` assert the `FenError`. The other 8 were re-authored. The PR-note table is in the
  decision note `…5b986289`.
- **9(d) MET.** At the branch tree, `fen-scan.mjs` reads 1,120 literals and rejects 208. The `by file:` lines name
  exactly: `fen.test` (24), the 6 swaps (11/94/14/36/15/10 = 180), `coordinate-move` (1), `san.parse` (1),
  `history-pane` (1) and `render` (1). No other file appears. The full suite is green, so no FEN built at run time is
  rejected either.
- **9(e) MET.** A planted `// plant: parseFenGrammarOnly` in `src/status-panel.ts` turned the guard red
  ("expected [ 'status-panel.ts' ] to deeply equal []"). After the revert it is green, and
  `git status --porcelain src` was identical before and after.
- **9(f) MET.** `npm test` is green with skip 0. The deep lanes ran sequentially:

  | lane | exit | tests | wall | load1 at start |
  |---|---|---|---|---|
  | `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` | 0 | 37/37 | 3 s | 32.4 |
  | `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` | 0 | 33/33 | 49 s | 30.1 |
  | `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | 0 | 17/17 | 61 s | 17.4 |
  | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 0 | 32/32 | 53 s | 27.4 |
  | `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` | 0 | 28/28 | 230 s | 14.7 |

  Puzzle suite: **solved 58/62 against the base baseline of 58/62**. The 4 MISSED rows are the baseline's 4
  `unsolved` rows. `src/puzzle-suite.baseline.json` and `src/puzzle-corpus.ts` are untouched (0 lines in the diff).
- **(PERFT_DEEP) MET.** 32/32 exact.
- **(messages teach) MET.** Every message names the rule and the right, square or field, with the why. See the
  decision note.

**NFR:**
- **`NFR-002`: MET.** Validated `parseFen` reads **2.446 µs mean** per call (median of blocks 2.485), against base
  2.287 µs, a delta of +0.159 µs. The bar is ≤ 10 µs. The reading is one process, interleaved, 30 blocks × 20,000 calls
  per arm, over 7 FENs, at load1 23.9.
- **`NFR-001`: MET.** `npm run perft` reads 3,601,277 nodes/sec (≥ 1,000,000) at load1 23.9. Deep perft is 32/32.

**`ADR-0036` clause (b) does not fire.**
- (b1): the `src/fen.ts` `+` lines hold no Node-builtin import, no `process.`, and no
  `spawn`/`exec`/`fetch`/`eval`/`new Function`.
- (b2): the one new edge is `fen.ts → moves.ts`. `moves.ts` imports only `position.ts`, and neither holds a limb.

No production capability line changed.

**Cost (`ADR-0035`, proposed).** Each set was read on base, head and an identity twin: 9 rotated rounds, round 0
dropped, CPU = user + sys, with the counts asserted per arm.

| set | load1 median | base CPU | twin − base (R) | admissible | head − base median, interval | vs `N8-LANE` 0.650 s |
|---|---|---|---|---|---|---|
| `g1` `fen.test.ts` | 17.3 | 1.545 s | +0.005 s, +0.32 % (R 0.100) | yes | +0.015 s, −0.060..+0.060 | MET |
| `g2` 6 import swaps | 22.1 | 3.430 s | −0.030 s, −0.87 % (R 0.200) | yes | −0.060 s, −0.140..−0.030 | MET |
| `g3` 8 fixture files | 22.4 | 4.520 s | 0.000 s (R 0.150) | yes | −0.005 s, −0.100..+0.260 | MET |
| `g0` `ADR-0035` narrow set (50 of 52 files) | 33.9 | 36.09 s | −0.380 s, −1.05 % (R 1.030) | yes | +0.025 s, −0.630..+0.880 | **UNRESOLVED** (R > b): at most +0.880 s |

`vitest related --run src/fen.ts` runs 50 of the 52 files, so `ADR-0035`'s narrow set is the lane itself. Its R
(1.03 s) does not resolve 0.650 s, and the line is written UNRESOLVED, not MET. The floor account is 0 files added,
so 0 ms is charged. The content adds 33 `it` rows to an existing file.

**Remaining work, not mine:**
- QE hop (Workflow 04 review exit).
- The board move to `In Review`, which is the Orchestrator's.
- The owner's UAT word: `src/fen.ts` is a production file, so there is no waiver.
- `ABC-083` shares `src/quiescence.test.ts` and `src/evaluate.pawns.test.ts`; the second to land rebases (ticket
  § Dependencies).
- The `san.parse` `A4` row was renamed (see the decision note).
