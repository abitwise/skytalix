---
id: 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
kind: decision
by: software-engineer
at: 2026-10-10T08:53:51Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - ABC-126
  - RISK-003
  - N8-LANE
  - ADR-0026
  - ADR-0027
  - ADR-0028
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - .grugops/context/cut-harder-puzzles/notes/20261010T075901Z-ba-pm-decision-5fefe3f1.md
  - .grugops/context/qe-ABC-084/notes/20261009T215422Z-qe-e2e-observation-abc084-five-focus-readings-17-weakenings-80be6044.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61.md
supersedes:
---

# `ABC-127` build decisions: rows SELECTED by QE's weakenings and ANSWERED by two independent oracles; one budget for all rows; 22 rows

Hand-authored and unsealed (no sanctioned writer on this install; `human_admission` is `off`).
Subtask `ticket-to-pr-ABC-127`, branch `grugops/ABC-127-harder-puzzles` from the wave tip
`4a64dd9` (it descends from the brief's `f9689e7` by one docs-only commit). Readings are in
observation `…eee7be49`; the page is the contract and is not restated.

## D1 — curate against `A3`'s harness first (test note 1), with seeded random placements

- **Choice.** Rows are seeded random placements, kept only when the engine **selects** them and
  an oracle **answers** them. Selection: QE's planted weakenings (the exact edits of
  `qe-ABC-084/probe/weakenings.mjs`, applied to out-of-tree copies of `src/`) play a different
  move from the shipped engine, or the shipped engine needs 4× the readings. Answer: never the
  engine's move. This is the reading the cut states (`…5fefe3f1`, reading 3): selecting rows by
  engine behaviour is allowed, taking answers from it is not.
- **Alternative rejected: hand-built motif rows** (`ABC-084`'s way). A row that turns `W1` red must
  flip on the leaf (test note 3), and a hand guess at which exchange is longer than the depth
  reached is exactly the guess the harness measures instead. Random placement found 43
  `W1`-sensitive win-material candidates in roughly 2 800 scanned seeds (three runs, stopped
  early once the pool was enough). A position is reproducible from the seed in its row's
  `source` (`probe/curation/curate-*.mjs`).
- **Plausibility filter.** At most Q 1, R/B/N 2, P 8 per side, two bishops on opposite colours, no
  pawn on rank 1 or 8, neither king in check, no promotion at the root, castling `-`.
- **The honest cost.** The rows are not named textbook motifs: names carry the seed, side and
  material. QE may read that as weaker breadth than `ABC-084`'s; it is stated, not hidden.

## D2 — two answer oracles, independent of each other and of the engine

- **Curation oracle** (`probe/curation/oracle.mjs`): QE's own 0x88 move generator from
  `indep-oracle.mjs`, imports nothing from `src/`, perft-checked again (start d3/d4, position 3
  d4/d5 all OK).
- **Lane oracle** (`src/puzzle-suite.test.ts`, `PUZZLE_DEEP=1`): `legalMoves` / `makeMove` only,
  no import from `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts` or
  `src/transposition.ts` (`A2`).
- **mate-in-3**: the exhaustive set of first moves that mate in 3, with `matingMoves(fen, 2)`
  empty (so no mate in 1 or 2). The lane reuses `ABC-084`'s `matingMoves` unchanged at `n = 3`.
- **win-material**: `ABC-084`'s definition (P1 N3 B3 R5 Q9, 4 plies full width, then captures to
  8 plies, evasions when in check) as one alpha-beta for the best gain plus a null-window test per
  root move for set membership. It is the same number as the full-window form: the curation
  oracle computes both and they agree on every row. Curation also required gain ≥ 2, every other
  move ≥ 2 pawns behind, and no mate in ≤ 2. The lane asserts set equality and gain > 0.
- **Both deep rows** carry 300 s hang guards and print their wall (`A7`). The mate-in-2 row stays
  in the default lane (Security/NFR's `ABC-084` ruling).

## D3 — one budget for all rows (25, step 1); no runner budget change

The ticket left it to the Engineer (one budget, or a hard tier). At 25 readings the sparse mate
rows reach d5–d7, enough to separate `W5` (cap 4) from the shipped engine, and the whole lane fits
`A7`. A second budget would be a second dial with nothing to buy, so it was not added (coding
rule 7).

## D4 — what each row is for (`PuzzleTag`), and what the lanes check

- **Tags.** `quiet-key` is structural and checked in the default lane. `depth≥5`, `quiescence`
  and `headroom` are engine measurements recorded with `A3` and never used as answers. A fourth
  tag, `headroom`, is mine: it marks the rows `A4` needs unsolved, so every new row says why it is
  there (`A1`).
- **New rows are the rows with `tags`**, after the 40, which carry none. The default-lane `A1` row
  asserts both of those.
- **Mirror check (default lane):** no new row's placement + side, or its colour mirror, equals
  another corpus row's. Cheap (about 1 ms).
- **The 22:**
  - 12 mate-in-3: 8 solved, 4 `headroom`;
  - 10 win-material, 7 of them black to move.
  - Tag counts: `quiet-key` 14, `depth≥5` 10, `quiescence` 11, `headroom` 4.
  - The selection was scored on the plain-node matrix first (`probe/curation/predicted-a3-plain-node.txt`)
    and the vitest harness then read exactly the predicted numbers.

## D5 — `A5`: per-row lines, gate unchanged

- The baseline file gains `unsolved` (row names).
- The gating run prints `NEWLY-MISSED` / `NEWLY-SOLVED` for every row whose state differs from that
  list.
- The gate is still `solved ≥ baseline` and `total` equals the recorded total.
- The baseline moved in its own commit (`47433c5`), after the rows/runner commit (`e1f5732`). At
  `e1f5732` alone the deep gate row is red on the total (62 against the recorded 40), by test
  note 5's ordering. The default lane is green there.

## D6 — the new rows pass `ADR-0033`'s six `parseFen` rules (the coordinator's mid-task ask)

- **Context.** `ADR-0033` is proposed and was merged on the wave at `5a613d1`. Its rules are the
  ones `ABC-010` lists: non-string input, clock round trip, a pawn on rank 1 or 8, castling rights
  that do not match the board, an en-passant square with no pushing pawn, and the side not to move
  being in check.
- **Result: all 22 new rows pass.**
  - Every new FEN is a string, has castling `-`, en passant `-` and clocks `0 1`.
  - No new row has a pawn on rank 1 or 8.
  - In no new row is the side not to move in check.
  - The generator already filtered on the last two. They are re-checked by
    `probe/adr0033-rows.mjs` (independent move generator) → `probe/adr0033-rows.out.txt`:
    `new rows 22: ALL PASS`.
- **The same probe finds exactly the two existing defects the coordinator named.** It reads
  "pin: Re1 pins the queen to the king" as a pawn on rank 8. It reads "discovered check: the bishop
  moves, Rxd8" as the side not to move in check.
  - Those rows are untouched (`A1`: byte-identical) and routed to BA/PM, not here.
  - **Note for that re-cut:** both are among the 6 win-material rows this build's `A2` oracle row
    now re-proves. Re-authoring them changes that row's input, not its rule.

## Not done, on purpose

- **`W11` (mate score ignores ply) still survives.** No curated mate row flipped it: the hash move
  keeps the shorter mate first at the root. The bar is ≥ 2 of `W2`/`W11`/`W13`/`W14`/`W16`, and 4 of
  the 5 went red, so `W11` was not chased.
- **`W10` survives, as the page intends.**
- **Not touched:** the board, `AGENTS.md` (the line is drafted in claim `…6341cc47`), the NFR
  catalog, ADRs, the trigger list and `HANGING_CORPUS` (`ABC-126`'s pair).
