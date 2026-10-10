---
id: 20261010T154703Z-ba-pm-observation-abc010-tip-scan-abc131-levels-qe129a-readings-9c2f50e8
kind: observation
by: ba-pm
at: 2026-10-10T15:47:03Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-131
  - ABC-087
  - ABC-126
  - QE-129-a
  - ADR-0033
  - src/levels.test.ts
  - src/quiescence.test.ts
  - src/command-input.test.ts
  - src/turn-loop.ts
  - .grugops/context/bapm-abc010-qe129a-2026-10-10/probe/RUN.txt
  - .grugops/context/recut-abc010/probe/fen-corpus.980890f.out.txt
supersedes:
---

# Readings at `b98fb419`: the reject list moved by −2 corpus rows and +1 `levels.test.ts` row; `ABC-131`'s tip gives the identical list; `QE-129-a`'s formula predicts 5, not 4

This note is hand-authored and unsealed (degraded posture, `AGENTS.md`). The raw outputs and commands
are in `../probe/` (`RUN.txt`). Apple M3, Node v26.11.0, load1 about 4–6. Every script reads `src/`
only.

## 1. Architect's scan + `ADR-0033` prototype rules at the tip (`fen-corpus.b98fb419.out.txt`)

| | `980890f` (recut) | `b98fb419` |
|---|---|---|
| literals | 1,049 | 1,099 |
| distinct rejected | 144 | 143 |
| occurrences rejected | 186 | 185 |

With line numbers stripped, the diff against `980890f`'s list has exactly three lines:
- **−** `src/puzzle-corpus.ts` "pawn on rank 8 (h8)" and "side not to move (black) is in check", both
  re-found by `ABC-126`;
- **+** `src/levels.test.ts` `7k/8/5QK1/8/8/8/8/8 w - - 0 1`, "side not to move (black) is in check".
  `git log -S` puts it at `659215a3` (`ABC-087`).

Per file at the tip: the six swap files hold 175 (castling.hardening 89, enpassant.hardening 36,
enpassant 15, castling 14, legal 11, zobrist 10). The 10 incidental occurrences are in 9 files:
coordinate-move, evaluate.pawns, fen.test, levels, move-input ×2, moves, quiescence, san.parse and
status-panel.nfr.

**Cited lines at the tip:** `fen.test.ts:29`, `coordinate-move.test.ts:17`, `san.parse.test.ts:44`,
`move-input.test.ts:30`/`:51`, `moves.test.ts:257`, `evaluate.pawns.test.ts:121` and
`status-panel.nfr.test.ts:64` all hold. **`quiescence.test.ts:327` is now `:329`.** The six import
lines are unchanged. `git diff --stat 980890f b98fb419` over the 15 fence files plus
`legal.ts`/`moves.ts`/`apply.ts` shows only `src/quiescence.test.ts` (+4/−2).

## 2. Criterion 9(d)'s instrument at the tip (`fen-scan.b98fb419.out.txt`)

It rejects 15, all grammar faults, the same set as at `980890f`: `fen.test.ts` 8,
`moves.castling.hardening.test.ts` 5, `history-pane.test.ts:860` 1 and `render.test.ts:479` 1.

## 3. `ABC-131`'s tip `677b8b09` (`fen-corpus.abc131-677b8b09.out.txt`)

It has 1,095 literals and a reject list **identical** to `b98fb419`'s. The four rows it drops (seeds
1008, 1075, 1424 and 1982) are all accepted. Its `src/` diff is `puzzle-corpus.ts`,
`puzzle-suite.baseline.json` and `puzzle-suite.test.ts`, none of which is in `ABC-010`'s fence.

## 4. `src/levels.test.ts:351` and a replacement (`levels-stalemate.out.txt`)

| FEN | rules | legal | stalemating move → replies, in check | row's `play` score |
|---|---|---|---|---|
| shipped `7k/8/5QK1/8/8/8/8/8 w - - 0 1` | rejected (black in check) | 28, **incl. `f6h8`** | `f6f7` → 0, false | 0 |
| candidate `7k/8/6K1/5Q2/8/8/8/8 w - - 0 1` | accepted | 28 | `f5f7` → 0, false | 0 |

The row is "scores a stalemating child 0" in "the blunder path's edge cases". It runs on the default
lane: `vitest list` shows 22 default and 28 under `ENGINE_DEEP=1`. The candidate was measured with
the row's own `createLevel({ budgetMs: 100, blunderRate: 0.999_999 }, { seed: 1, now: virtualClock(100) })`
in plain `node`, not inside vitest.

## 5. `QE-129-a` re-read at the tip

- `src/command-input.test.ts:412` quotes `` `1 + one per non-advancing outcome` ``.
  `src/turn-loop.ts:279` reads `` `1 + plies + take-backs + RE-EMITTING non-mutating outcomes` ``,
  and `:284-286` disowns the count-every-outcome form.
- `runLines` (`:353`) answers `{ kind: "eof" }` once the lines run out (`:369`).
  `src/turn-loop.ts:105-106` lists `eof` among the SEVEN non-advancing outcomes.
- **So, for `["board", "board", "board"]`:** the quoted formula gives 1 + 4 = 5, and the docblock's
  gives 1 + 0 + 0 + 3 = 4. The assertion is 4. QE's "both give 4" holds only if `eof` is left out.
- No open ticket names `src/command-input.test.ts`. The seven pages that do are `done` (6) or
  `dropped` (1).

## Not measured

- No `ABC-010` code exists, so 9(d)'s "a correct build rejects only in the allowed files" is
  inferred from §1. The build's own scan is the check that counts.
- `ENGINE_DEEP` / `PUZZLE_DEEP` lanes were not run; nothing in `src/` changed in this hop.
