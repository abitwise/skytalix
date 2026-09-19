---
id: 20260919T231000Z-software-engineer-decision-seam-built-as-ruled-lands-read-off-the-board-rook-leg-rederived-deep-lane-is-zobrist-deep-7b3e9a21
kind: decision
by: software-engineer
at: 2026-09-19T23:10:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ABC-081
  - ADR-0020
  - ADR-0006
  - ADR-0002
  - NFR-005
  - N8-LANE
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - .grugops/context/ruling-abc075-ep-square/notes/20260919T114000Z-architect-design-observation-apply-sets-ep-on-every-double-push-and-which-tests-flip-4c7a8f13.md
supersedes:
---

# `ABC-075` — implementation decisions inside ADR-0020's fixed seam, and the one place the ruling's test enumeration was short

**NOT A STAMP.** Hand-authored `decision`; `human_admission` is `off`. The seam signature, the ep
rule and the threading are ADR-0020's and were NOT re-decided here. What follows is the engineer's
choices inside that shape, each small enough to reverse in one hunk.

## 1. The seam, exactly as ruled

`zobristKeyAfterMove(keyBefore: bigint, position: Position, move: Move, undo: UndoRecord): bigint`
in `src/zobrist.ts` beside `zobristKey`. `Move` and `UndoRecord` are `import type` — the graph is
`{position, moves} ← apply ← zobrist`, verified by `grep zobrist src/apply.ts src/moves.ts
src/position.ts` → 0 hits (ADR-0020 `F6`). `zobristKey`'s ep clause is the bare
`epSquare !== NO_SQUARE` test; `import { hasLegalEnPassant } from "./legal.ts"` is gone and
`grep -rn hasLegalEnPassant src --include=*.ts | grep -v test` returns only its definition at
`src/legal.ts:90`. `src/legal.ts`, `src/apply.ts`, `src/position.ts`, `src/search.ts` untouched.

## 2. The landed piece is READ OFF THE BOARD, not re-derived

After `makeMove`, `position.board[move.to]` IS the piece that landed — the promoted piece on a
promotion, the mover otherwise — so the delta XORs `PIECE_SQUARE[board[to] << 7 | to]` and never
re-computes `move.promotion | colour`. One board read replaces a branch, and it cannot disagree
with `apply.ts` because it reads what `apply.ts` wrote. The ep-captured pawn uses `move.captured`
(the enemy pawn, per `moves.ts`'s contract) at `to ± 16`, mirroring `apply.ts`'s
`enPassantCaptureSquare` — the one helper duplicated, three tokens long, because importing it
would mean exporting a private of `apply.ts` (fenced).

## 3. The rook's leg is re-derived from the king's `to`, not imported

`apply.ts`'s `CASTLE_ROOK_MOVE` table is private. The delta uses `fileOf(move.to) === 6` (kingside)
to place the rook at `to+1 → to−1`, else `to−2 → to+1`, and reads the rook piece off `board[rookTo]`.
Same reasoning as § 2: exporting the table would widen `apply.ts`'s surface for one consumer.

## 4. Castling flags: XOR the CHANGED set, gated on `!== 0`

`undo.castling ^ position.castling` is zero on the overwhelming majority of moves, so the
four-flag loop runs only when a right actually moved. ADR-0006 inherited unchanged: rights, not
availability — `A4` asserts it directly and through the delta.

## 5. The oracle walk feeds the INCREMENTAL key to its children

`walkOracle` recurses with `key` (the delta's answer), not with a fresh `zobristKey(position)`. That
is the array shape `ABC-081` will run (`keys[ply+1] = zobristKeyAfterMove(keys[ply], …)`), and it
means any wrong component compounds into the whole subtree below it instead of being masked at
the next node. `A2` (drift) is checked against `keyBefore` after every unmake.

## 6. The depth-4 walk is behind `ZOBRIST_DEEP=1`; depth 2 is the default-lane row

Kiwipete alone is 4.1 M nodes at depth 4; the whole six-position walk is **11,024,485 nodes and
40 s** — 60x `N8-LANE`'s whole 650 ms budget. The default lane walks depth 2 over the six perft
positions plus six hand-picked `A3`/`A4` positions; `ZOBRIST_DEEP=1` registers the depth-4 case in
the `PERFT_DEEP` shape (not defined when unset, never skipped, skip count stays 0). **The ticket
named no lane** ("the lane the ticket names" in the subtask has no referent), so a new env var was
chosen over overloading `PERFT_DEEP` — a perft-deep run should not silently grow a 40 s zobrist
walk. **`AGENTS.md` is fenced for this hop, so the command line is NOT recorded there yet** — the
Orchestrator owes one line under `### Test`:
`ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` (RUN 2026-09-19, exit 0, 33 passed, 40.2 s).

## 7. The ten `it.each` rows at `zobrist.test.ts:276`/`:308` go RED under Decision 1 — the ruling's enumeration missed them, and they were RE-POINTED, not deleted

The subtask says any red outside the named assertions is a defect to stop on. These ten are not
a defect in the delta — they never call `zobristKeyAfterMove` — they are Decision 1 acting on
`zobristKey` verbatim: each asserts `zobristKey(position) === keyWithoutEpSquare(position)` on a
FEN that CARRIES an ep square the board contradicts, and `parseFen` keeps such a square (ADR-0005
rejected upstream normalisation; ADR-0020 leaves that in place and says so). The Architect's
observation note listed `:276`/`:308` as "stay green, stay" — true of the purity half (which does
stay green), false of the key half. Re-pointed: `toBe(reference)` → `not.toBe(reference)`, titles
"omits" → "carries", block comments cite Decision 1's sentence and name the enumeration gap. The
purity assertion on every row is unchanged. **Flagged as an interpretation for the Orchestrator and
QE, not silently absorbed.** Watched RED first (10 failed / 13 passed at the probe run, every
failure at `:288:41`, the key line) and green after.

## 8. `zobrist.nfr.test.ts`: two spy rows became one structural row; the `vi.mock` stays

"Never asks when there is no ep square" (vacuous now) and "asks exactly once when set" (RED: 0 not
1) were replaced by one row asserting `hasLegalEnPassant` is called **0 times on all seven
positions, ep square or not** — the ADR's "keep as a structural guard" option, chosen over
retiring the spy entirely because it is the only assertion in the repo that fails if someone
re-introduces a probe move into the hash. The `hasLegalEnPassant` NO_SQUARE-guard block below it is
untouched. `vitest.config.ts`'s comment naming this file's `hasLegalEnPassant` spy as a
`--no-isolate` casualty is still true (the spy still exists) and was not edited.

## Not done, on purpose

- No `keys[]` array, no seeding, no consumer — `ABC-081`'s (ADR-0020 "Who owns what").
- No `position.key` field; `makeMove`/`unmakeMove` untouched (ADR-0020 `F4`).
- No edit to `plans/nfr-catalog.md` (no target moves), `AGENTS.md`, `plans/board.md`.
- Two stale comments left in place and flagged rather than tidied (rule 9): `zobrist.test.ts`'s
  purity walk (`withEpComponent` comment still says "hasLegalEnPassant returned true") and
  `zobrist.nfr.test.ts`'s NO_SQUARE-guard block ("`zobristKey` is the only production caller of
  this predicate") — both now describe the pre-ADR-0020 tree.
