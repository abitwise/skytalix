---
id: 20261010T164425Z-qe-e2e-observation-abc010-readings-criteria-mutants-deep-lanes-nfr-d22743e3
kind: observation
by: qe-e2e
at: 2026-10-10T16:44:25Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ADR-0005
  - NFR-001
  - NFR-002
  - N8-LANE
  - src/fen.ts
  - src/fen.test.ts
  - 20261010T164425Z-qe-e2e-decision-abc010-verdict-pass-with-gaps-40ccc992
supersedes:
---

# `ABC-010` QE readings: per-criterion evidence, 30 mutants, fixture review, deep lanes 5/5, `NFR-002` 2.68 µs, `NFR-001` 3.42 M/s

Hand-authored and unsealed. Apple M3, Node v26.11.0. Two other QE agents ran in parallel, so load1 is logged on every
timed row (5.5 → 32.9). Raw files: `../probe/` (`RUN.txt`). Reviewed tip `2344c015`, code `1304cc2c`, base `be37e222`.

## Per criterion

| criterion | evidence (QE's own) | verdict |
|---|---|---|
| row 1 `…/K7 w KQ` | `castling right "K" is inconsistent with the board: no white king on e1` (harness A, exact) | MET |
| row 2 `…/4K3 w K` | `… no white rook on h1` | MET |
| row 3 `4k3/8/4Q3/…` | `side not to move (black) is in check: its king on e8 is attacked` | MET |
| row 4 `…/P3K3` | `pawn on a1: no pawn can stand on rank 1` | MET |
| row 5 en passant | 10 table rows, both sides to move, each of the four faults; fuzz bucket 12,403 | MET |
| row 6 clocks | 400 nines → `"999…" does not round-trip: … "Infinity"`; `1e+21`; also `01`, `0 01`, 2^53+1 | MET |
| row 7 round trip | every accepted FEN: 38,565 fuzz + 69,625 play + 92 corpus + 25 table, `parseFen(toFen(p))` byte-identical, 0 failures | MET |
| row 8 non-string | the five plus `true`, `10n`, `Symbol()`, a function, `new String(…)`, `{ trim() }`, on BOTH entries: 22/22 `instanceof FenError` | MET |
| 9(a) | the six perft roots and every `ABC-001` case go through `parseFen` (`fen.test.ts` imports no other entry); `:29` is the after-`1.e4` FEN and round-trips | MET |
| 9(b) | `git diff -U0 be37e222...1304cc2c` on the six files: exactly one `-`/`+` import line each; suite green | MET |
| 9(c) | `A2`/`A4` assert `FenError` + `/^side not to move \(black\) is in check/`; the 8 others name no `parseFenGrammarOnly` (grep 0 each) | MET |
| 9(d) | `fen-scan.mjs` on the tip: 1,120 literals, 208 rejected, `by file:` names exactly the 11 allowed files; output byte-identical to the SE's | MET |
| 9(e) | out-of-tree plant `export { parseFenGrammarOnly as … }` in `src/history.ts` → guard red "expected [ 'history.ts' ] to deeply equal []"; reverted → green; tree `diff -r` identical | MET |
| 9(f) | `npm test` exit 0, skip 0; the four lanes exit 0 (table below); puzzle 58/62 vs baseline 58/62; baseline and corpus 0 lines in the diff | MET |
| `PERFT_DEEP` | 32/32 exact, exit 0 | MET |
| messages teach | every message checked EXACTLY against an oracle-built expected string, 0 mismatches in 200 k × 2 seeds | MET |

**Differential fuzz (harness C)** — at seed 20261010 and seed 777, over 200,000 random grammatical FENs each:
- `parseFen` accepted exactly the FENs QE's oracle accepts: 38,565 and 38,317. It threw the oracle's exact first
  fault on the rest: castling 37,265, en passant 12,403, in check 19,768, pawn 2,889. 0 disagreements either way.
- Every accepted position equals `parseFenGrammarOnly`'s parse, field by field.
- Grammar faults (89,110) throw the same message from both entries.
- On base the same harness prints 149,924 FAIL lines: it discriminates.

**Positive corpus by play (harness D).** 300 random games from the six perft roots, 69,625 positions (68,494 distinct
boards). 944 have an ep square set, 4,693 hold castling rights, and in 3,997 the side to move is in check. **0
rejected**, and every one round-trips. Nothing `makeMove` produces is refused, so no legal FEN is wrongly rejected.

## Mutants (30, `../probe/mutants-2344c015.tsv`, 16:34:45Z–16:40:49Z, load1 18.8 → 32.9)

Each mutant ran against the whole suite (vitest JSON) and QE's harness.
- **Killed by the suite: 24.** M01–M07, M10, M13–M15, M17 and M19–M30, each red 1–51. M20 (the in-check rule tests
  the side TO move) reds 51 tests. M27/M28 (wrong ep geometry for black to move) red 20 each.
- **Survived the whole suite (red 0): 6.** M08 drop right `Q`, M09 drop right `k`, M11 castling rook of either
  colour, M12 castling king of either colour, M16 ep pushed pawn of either colour, M18 ep rules only when white is
  to move.
- QE's harness kills all six. With QE's new rows they are red 3/3/1/1/1/4 (`../probe/mutants-closed-by-qe-rows.tsv`).
- **Weakly held, still killed:** 12 of the 24 are killed by exactly one row: M02–M05, M13–M15, M17, M21, M26, M29 and
  M30. M03 (the g-file stop) is killed only by the order row's `h1` pawn.
- **Harness blind spot:** M26 (no truncation of a long clock field) survives the harness; the suite kills it.

## Fixture review (9(c), the PR-note table)

- **`SIX_QUEENS_FEN`** — the black king moved from f8 to e5. That makes the row's own comment true for the first
  time ("Both are legal positions": the old board had black in check with white to move).
  - The candidates went from `[…, Q8xd4]` to `[…, Q8xd4#]`, one character wider. Every asserted value holds
    (`ambiguous`, ≥ 2, no `(+`, every candidate present, one render per candidate). "The widest known to fit" is not
    weakened, it is stronger.
  - **One unasserted consequence: `legalMoves` derives per prompt went 6 → 7** (QE-measured,
    `../probe/six-queens-derives.out.txt`). Two comments still say six → `QE-010-b`.
- **`san.parse` `A4`** — the renamed row now asserts what is true (`open()` throws `FenError`, side not to move in
  check). 9(c)'s "keeps its name" is said of "the other eight", so the rename is in bounds. The old name stated a fact
  the boundary can no longer produce. The `coordinate-move` `A2` row kept its name.
- **The others**, each re-checked by reading the board:
  - `PROMOTION_CAPTURE_FEN`: black king f8 → h8; the d8 queen still gives `+` along rank 8.
  - `moves.test.ts:257`: black king h8 → g8, off the h-file; the e8 rook still checks e1.
  - `quiescence` rig: black king h8 → e3, off every queen line; deepest 8 is asserted and the lane is green.
  - `evaluate.pawns`: black king c8 → h8; the d7 pawn's passed status is untouched by the king.
  - `status-panel.nfr` and `levels:351`: the measured replacements from the Architect and BA/PM, green.

  Each keeps its test's name and its point.
- **`memory-bank/30-architecture.md`.** The edit carries exactly what `ADR-0033` § Consequences requires: level 3,
  "grammar and semantics", and `parseFenGrammarOnly`. There is no other `fen.ts` mention in that file. All six
  production importers already sit above `legal.ts`, so no other row's level moves.

## Deep lanes (QE's worktree at `2344c015`, sequential, `../probe/deep-lanes.log`)

| lane | exit | tests | wall | load1 start → end |
|---|---|---|---|---|
| `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | 0 | 17/17, solved 58/62 vs baseline 58/62 | 33 s | 17.84 → 12.62 |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 0 | 32/32 | 40 s | 12.62 → 7.80 |
| `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` | 0 | 37/37 | 3 s | 7.80 → 7.80 |
| `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` | 0 | 33/33 | 37 s | 7.80 → 5.50 |
| `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` | 0 | 28/28 | 210 s | 5.50 → 19.12 |

## NFR (re-read by QE: `plans/nfr-catalog.md` `NFR-002` is the < 16 ms frame; the ticket derives ≤ 10 µs per parse)

The ticket's derivation was re-checked against the source: exactly two `parseFen` calls per frame
(`status-panel.ts:156`, `history-pane.ts:121`). `result-screen.ts:133` is once per result screen, and `history.ts`'s
three calls are per derive, not per frame.

- **`NFR-002`, run 2** (load1 22.95 → 21.75, mutants finished): head **2.677 µs** mean against base 2.476 µs (+0.202
  µs). That is 60 blocks × 20,000 calls per arm, interleaved, over 7 FENs, in one process. It is **MET**, with
  3.7x headroom, and the frame cost is 2 × 2.68 = 5.4 µs, 0.03 % of 16 ms.
- **`NFR-002`, run 1** was taken under 30 parallel mutant builds (load1 29–30): head 5.720 against base 5.495, also
  MET.
- **`NFR-001`:** `npm run perft` reads **3,424,249 nodes/sec** (≥ 1 M) at load1 21.75. Deep perft is 32/32.
- **`N8-LANE`:** QE added 0 files, and 22 `it` rows to an existing file.

## Gates (QE's worktree, final tree with QE's rows, 16:43:59Z, load1 11.38)

- lint, typecheck and build exit 0;
- `npm test` exits 0: 52 files, **1,663 passed** (1,641 + 22 QE rows);
- skip 0, and `test-skip-integrity.js` reports `No findings.`;
- `lane-inventory.js`: 52/52, `No findings.`

At the reviewed tip `2344c015`, before QE's rows: 1,641 passed, skip 0, all gates exit 0 (16:28Z, load1 14.6–16.4).
