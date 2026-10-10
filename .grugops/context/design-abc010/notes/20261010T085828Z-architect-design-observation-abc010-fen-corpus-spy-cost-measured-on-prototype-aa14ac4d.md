---
id: 20261010T085828Z-architect-design-observation-abc010-fen-corpus-spy-cost-measured-on-prototype-aa14ac4d
kind: observation
by: architect-design
at: 2026-10-10T08:58:28Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ABC-016
  - NFR-002
  - NFR-001
  - N8-LANE
  - .grugops/context/design-abc010/probe/RUN.txt
  - .grugops/context/rescore-batch-2026-10-10/probe/RUN.txt
supersedes:
---

# `ABC-010` design hop measurements: the graph, the A13 spy, the positive corpus, cost

This note is hand-authored (no sanctioned writer on this install, `AGENTS.md`). The raw outputs are under
`../probe/`, and `RUN.txt` there gives the commands. All runs were out of tree, on an rsync copy of
`6ade041`, on an Apple M3 with Node v26.11.0. load1 was 8.3–12.1 because other hops were running.

## Graph (`closure.out.txt`)

The runtime graph has 35 production modules and 90 edges. An inline all-type import counts as an edge
(`ADR-0030`). Either candidate edge leaves the graph acyclic, and the maximum depth stays 10.

- `fen.ts → legal.ts` grows `fen.ts`'s closure from 1 module to 4.
- `fen.ts → moves.ts` grows it from 1 to 2.

All six `fen.ts` importers (`evaluate.mirror-corpus`, `history`, `history-pane`, `perft-bench`,
`result-screen`, `status-panel`) already reach `legal.ts`, so neither edge changes their closures.

## The `A13` spy (variant A against variant B)

Variant A routes the check through `legal.ts` `isInCheck`, flipping the side to move. Variant B uses
`moves.ts` `isSquareAttackedBy` on the king squares the existing scan returns. Both were run on
`src/status-panel.nfr.test.ts` and `src/history-pane.nfr.test.ts`. `SPARSE_FEN` was made legal for the
measurement only.

- **Variant A:** 16/17. `asks isInCheck exactly once ITSELF` fails with **"expected 2 to be 1"**.
- **Variant B:** 17/17.

The `squareAt` count clauses are green in both variants, because the semantic checks use 0x88 arithmetic,
not `squareAt`.

## Positive corpus (`fen-corpus.out.txt`, `run-B-*.out.txt`)

There are 1,049 FEN-shaped literals in `src/` and `spike/`. 1,034 of them parse today, 732 of those
distinct. The prototype rejects **144 distinct, 186 occurrences**:

| rule | occurrences |
|---|---|
| castling | 85 |
| en passant | 73 |
| pawn on rank 1 or 8 | 17 |
| side not to move in check | 11 |

By file: `moves.castling.hardening` 89, `moves.enpassant.hardening` 36, `moves.enpassant` 15,
`moves.castling` 14, `legal` 11, `zobrist` 10. Then 1 or 2 each in `coordinate-move`, `evaluate.pawns`,
`fen`, `move-input` (2), `moves`, `quiescence`, `san.parse`, `status-panel.nfr` and `puzzle-corpus` (2).

- **Variant B with tests untouched:** 325 failed of 1,503, in 15 files.
- **The same, with the six off-domain files importing the grammar-only entry:** 17 failed, plus 1 suite
  error (`evaluate.pawns`), in 9 files. The six swapped files are fully green.

The remaining failures:

- `coordinate-move` `A2` and `san.parse` `A4`. Both pin a printed FEN as defective: the kings are adjacent.
- `fen.test.ts:29`: `e3` with white to move. The legal form is
  `rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1`, verified to round-trip.
- `move-input`: 2 fixtures, 7 tests.
- `moves.test.ts:257`: `Rh1` checks `h8`.
- `quiescence.test.ts:327`: the runaway-cap position.
- `evaluate.pawns.test.ts:121`: the `d7` pawn checks `c8`.
- `status-panel.nfr.test.ts:64` (`SPARSE_FEN`: `Re1` checks `e8`). A legal 3-piece anchor kept 17/17:
  `4k3/8/8/8/8/8/8/R5K1 w - - 0 1` with plies `a1a2 e8d8` and `a1a2 e8d8 a2a4 d8c8`.
- `puzzle-suite` `A6`, through `src/puzzle-corpus.ts`. The "pin: Re1" row has a black pawn on h8. In the
  "discovered check" row, `Bd4` checks `g7` with white to move.

Acceptance and round trip (`fen-accept-b.out.txt`):

- Every page row throws `FenError` naming its fault. That includes `"00"`, rejected under the
  byte-identity rule.
- All five non-string inputs give `instanceof FenError === true`.
- The round trip `toFen(parseFen(toFen(p)))` holds on all 589 distinct accepted repo FENs, with 0
  failures.

## Cost (`fen-cost-ab.out.txt`, `perft-*.out.txt`)

| measurement | base | validated / variant B |
|---|---|---|
| `parseFen` mean (one process, 9 interleaved rounds, 4 FENs, load1 9.45) | 2,501 ns | 2,967 ns |
| `parseFen` median | 2,030 ns | 2,251 ns |
| `npm run perft`, back to back | 5.04 M nodes/sec | 4.96 M nodes/sec |

- The validated parse is +466 ns (+18.6%) against the 10,000 ns bar, which leaves 3.4x headroom.
- Both perft readings are ≥ 1 M nodes/sec. The ~1.5% gap is noise: perft parses once per position.
- `PERFT_DEEP=1`: 32/32, exit 0, 38.7 s.

## Not measured

- The deep lanes other than perft: `SEARCH_DEEP`, `ENGINE_DEEP`, `ZOBRIST_DEEP` and `PUZZLE_DEEP`.
  A FEN built at run time inside a deep-only test would not show up in the literal scan. `UNKNOWN - verify`
  at the build hop.
- `npm run lint` and `npm run typecheck` on the prototype. `tsc --noEmit` was clean; lint was not run. The
  prototype is not the build.
