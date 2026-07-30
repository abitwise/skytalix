---
id: 20260730T143000Z-architect-design-observation-57f6f356
kind: observation
by: architect-design
at: 2026-07-30T14:30:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0002
  - ADR-0003
  - NFR-002
  - NFR-003
  - NFR-004
  - src/apply.ts
  - src/fen.ts
  - src/gameend.ts
  - src/legal.ts
  - src/zobrist.ts
  - plans/nfr-catalog.md
  - 20260730T140500Z-orchestrator-observation-c41a7e92
supersedes: 
---

# Measurement record for the three EPIC-002 seams — what replay, repetition counts and SAN actually cost

Subtask `architect-epic002-seams` of task `epic-to-tickets-EPIC-002`. This note holds the numbers
the three `decision` notes rest on, in one place, so each of those can cite rather than repeat.
**It measures; it decides nothing.**

## Provenance — read this before quoting any number here

- **Machine and runtime: Apple M3, Node v24.12.0, darwin/arm64.** Same machine class as `ADR-0002`
  and `ADR-0003`. **`UNKNOWN - verify` on any other hardware** — the spike's 2-3x slower-hardware
  factor has still never been validated against a non-M3 machine.
- **Harness ran OUTSIDE the repo**, in the session scratchpad, importing merged `src/` read-only by
  absolute path. **No file under `src/` was modified, created or read into a repo artifact.** Same
  pattern `ADR-0002` and `ADR-0003` used, and the harness is not a repo artifact.
- **Positions:** a deterministic random-legal game from `startpos` (a small LCG, fixed seed, one game
  per length). Per-ply figures are at a **ply-60 middlegame position** of that game. This is not
  `kiwipete` — the standing benchmark positions in `plans/nfr-catalog.md` exist for the *search*, and
  the quantity here is a *game*, which those single FENs do not have. Any comparison to a search
  figure must not be made across those two denominators.
- **Two full runs**, minutes apart, cold JIT each. Both are shown wherever they differ. Every figure
  is a mean over the stated iteration count after a warm-up of a quarter of it.
- This is an `observation`, **not a `finding`**: no §14 gate exists in this task to stamp one, and no
  agent may self-stamp (per the routing note `…-orchestrator-observation-c41a7e92`).

## Primitives, and the check that the harness is in the right regime

| What | Measured | Cross-check |
|---|---:|---|
| `zobristKey(position)` — position already in hand, startpos | **295 ns** | `ADR-0002`: 295-306 ns; the audit: 306 ns; Security/NFR: 288 ns |
| `zobristKey(position)` — ply-60 middlegame position | **258 ns** | fewer pieces on the board, so fewer XORs |
| `legalMoves(startpos)` | **2.14 µs** | `ADR-0003`: 1,833-2,224 ns at startpos |
| `legalMoves(ply-60 middlegame)` | **3.18 µs** | inside `ADR-0003`'s 2.1-5.4 µs range across positions |
| `parseFen(startpos)` | **1.62 µs** | not previously measured in this repo |
| `makeMove` + manual restore, one ply | **~10 ns** | `ADR-0003`: make/unmake 9.8 ns per pseudo-legal move |
| `gameStatus(startpos, emptyMap)` | **2.52 µs** | dominated by its one `legalMoves` call |

**Four independent reproductions of published figures.** `zobristKey` and `legalMoves` land on the
numbers `ADR-0002` and `ADR-0003` published, from a harness written this session with no reference to
theirs. That is the reason to trust the *new* numbers below, which nothing else has measured.

## Derivation by replay, by game length

`replay position` = `parseFen(initialFen)` then `makeMove` per ply. `replay keys` additionally
computes one `zobristKey` per ply (keys[i] = key after i plies, length = plies + 1). `+ counts` folds
those keys into a `Map<bigint, number>`. Run 1 / run 2:

| Plies | position only | keys | keys + repetition counts |
|---:|---:|---:|---:|
| 40 | 2.18 / 2.30 µs | 15.67 / 16.64 µs | **17.80 / 18.68 µs** |
| 80 | 2.17 / 2.21 µs | 27.99 / 29.06 µs | **32.04 / 33.02 µs** |
| 120 | 2.44 / 2.54 µs | 39.04 / 40.77 µs | **49.73 / 46.32 µs** |
| 200 | 3.22 / 3.15 µs | 60.34 / 62.15 µs | **69.76 / 74.51 µs** |
| 300 | 3.85 / 3.83 µs | 82.98 / 82.94 µs | **97.32 / 102.43 µs** |

Three things follow, and they are the substance of this note:

1. **`ADR-0002`'s 41 µs is independently confirmed.** It measured "deriving the whole history by
   replaying the move list (120 plies)" at 41 µs; this harness measures 39.04 / 40.77 µs for the same
   quantity. Its "undo = 44.5 µs" corresponds to the counts column, 46-50 µs here.
2. **Growth is linear and shallow.** At 300 plies — two and a half times a typical game — the full
   derive is ~0.1 ms. `ADR-0002`'s own stated threshold for reopening clause 2 is replay "above
   ~1 ms on target hardware"; at the longest length measured we are **10x under it**, and at 120
   plies **20x under it**.
3. **Rebuilding only the position is nearly free and nearly flat: 2.2-3.9 µs.** It is dominated by
   the single `parseFen` (1.62 µs), because a `makeMove` is ~10 ns. This is what `EPIC-006`'s `undo`
   costs if it rebuilds the position alone: **2.40 µs at 120 plies**, measured directly. The rest of
   the 46-50 µs is the key list, and only a consumer that needs the counts pays it.

## SAN

A SAN formatter was written **in the harness only** — never in `src/` — to carry the real cost
profile: one `legalMoves` for disambiguation, then `makeMove` + `isInCheck` (+ `legalMoves` again
only when in check) for the `+` / `#` suffix. It handles castling, promotion, pawn captures and
file/rank/square disambiguation. It is a cost model, **not a proposed implementation**, and it is
not correctness-proven — its output was eyeballed (`a3 d5 d4 Bf5 Nc3 b6 a4 f6 Ra2 h6 Qd3 a6`) and no
round-trip test was run.

| What | Measured (run 1 / run 2) |
|---|---:|
| `toSan(position, move)` — computes its own `legalMoves` | **4.31 / 4.45 µs** |
| `toSan(position, move, legal)` — caller supplies the list | **0.10 / 0.11 µs** |
| Full move-history render, 40 plies | **171.32 / 176.19 µs** |
| … 80 plies | 343.24 / 360.35 µs |
| … 120 plies | **516.58 / 533.40 µs** |
| … 200 plies | 875.42 / 962.45 µs |
| … 300 plies | **1,272.12 / 1,317.88 µs** |
| One whole turn at 120 plies: keys + counts + `gameStatus` + full SAN render | **572.06 / 593.67 µs** |

**SAN is ~97% `legalMoves` and ~3% string work.** The 40x gap between the two `toSan` rows is
entirely the disambiguation list. That single ratio is what makes the optional `legal` parameter
worth having and what makes the history panel the most expensive item in a frame.

Against the budgets, stated with their denominators:

- Full history render at 120 plies = **3.3% of `NFR-002`'s 16 ms frame budget**; 1.1% at 40 plies,
  8.2% at 300.
- The whole turn (every derive plus the full SAN render) at 120 plies = **593 µs**, which is **1.2%
  of `NFR-003`'s 50 ms keystroke budget** and **0.02% of `NFR-004`'s 3 s engine budget**.
- None of this is a frame measurement. **No renderer exists**; the board scan, the status panel and
  every byte written to a terminal are outside these numbers. They are a lower bound on a frame and
  the largest item known to be in one.

## Harness self-checks (guards on the harness, not proofs about `src/`)

All true in both runs, at 120 plies:

- `keys.length === plies + 1`, and `keys[last] === zobristKey(final position)`.
- `counts.get(zobristKey(current)) >= 1` — the current position is counted, which is what
  `gameStatus`'s `>= 3` test requires.
- `toFen(position)` is byte-identical before and after a full SAN render and after `legalMoves` —
  the transient-mutation contract holds on a well-formed position. **This says nothing about
  `ABC-009`**, which concerns malformed positions and was not tested here.
- `takeBack(2)` by replay produces the same FEN as applying the same 118 moves forward — the
  forward-apply path and the replay path agree, which is the one property the history module's two
  code paths must have.

## What was NOT measured, and must not be inferred

- **Any renderer, any terminal I/O, any `process.stdout.write`.** `NFR-002`'s write half stays
  `UNKNOWN - verify`.
- **Any non-M3 machine, any other Node version.**
- **Correctness of anything.** The harness SAN formatter has no test; the perft suite was not run;
  no claim here is a verdict about merged code.
- **`kiwipete` or `position-6`.** Those are the standing *search* benchmark positions
  (`NFR-005`); the quantities here are game-shaped and were measured on a game.
