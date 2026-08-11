---
id: 20260811T190500Z-ba-pm-observation-b6ae91e2
kind: observation
by: ba-pm
at: 2026-08-11T19:05:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - src/turn-loop.ts
  - src/gameend.ts
  - src/frame.ts
  - src/turn-loop.test.ts
supersedes:
---

# All EIGHT gaps re-verified against the delivered build before any was accepted — and one residue differs from QE's

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`**, and no
> gate verdict is self-attested: `05-pr-quality-gate.md`'s §14 machinery does not exist in this repo.

**The brief said "verify each before accepting it", so none was accepted from the report.** Six were
re-measured by an out-of-tree probe driving the delivered `runTurnLoop`; two were verified by reading
source and types at the exact lines. **All eight hold. Nothing QE reported was overturned.**

## Worktree state, verified at the start rather than taken from the brief

| check | result |
|---|---|
| branch | `grugops/ABC-019-turn-loop-skeleton` |
| `git rev-list --count HEAD..main` | **0 behind** |
| `md5 src/turn-loop.ts` | **`c92a1776e34b94cb3d9087dc3510e507`** — matches |
| `npm test` | **717/717 on 24 files** |
| lint / typecheck | **0 / 0** |

Re-run at hand-back: identical, and `git diff --stat -- src/` **empty**.

## The six measured on the delivered build

| gap | what the DELIVERED build does | verdict |
|---|---|---|
| `G-5` | from `1k6/8/8/8/8/8/1K6/2n5 w - - 0 1`: `gameStatusOf` at start = `{draw, insufficient-material}`, **six legal moves available**, **1 frame, 0 plies, 0 input calls, 0 engine calls** | **CONFIRMED** — the witness `[D32]` claimed exists as a position and **not as a row of the fourteen** |
| `G-2` | seam returns `{draw, resignation}` → outcome `{result:"draw", reason:"resignation", exitCode:0}`, **1 frame**, 1 input call, 0 engine calls; the only frame reads `status in-progress` | **CONFIRMED** — build correct on all four clauses `A8b` now states; `grep game-over src/turn-loop.test.ts` still returns **nothing** |
| `G-4` | input seam handed a move **not in `legalMoves`** → **APPLIED**. `moves.length` 1; FEN `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1` | **CONFIRMED — see the divergence below** |
| `G-1` | script `["zzzz","g1f3","g8f6"]` → message regions `[] / [not a move: zzzz] / [] / [] / [not a move: g8f6]` | **CONFIRMED** — build correct, and **no criterion protects it** |
| `G-6` | transition 13 (engine returns a foreign move, human black) → `{null, "engine-failure", 0}`, **1 frame**, that frame reads `status in-progress ... thinking true`, **0 sink writes beyond it** | **CONFIRMED** |
| `G-3` | input catch is `takeBack(history, 0);` at `:230` immediately followed by `throw error;` at `:231`, nothing between | **CONFIRMED** — build correct, criterion silent |

## The divergence, recorded because it is the more useful artifact

**On `G-4` my residue is NOT QE's, and both are corruption.** QE recorded
`Rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR b Kk - 0 1` — the white rook *arriving* on a8 and
capturing Black's. I measured
`rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1` — **the white a1 rook gone from the board
entirely, White's queenside castling right lost, halfmove clock advanced, Black's a8 rook untouched.**

**The difference is ours, not the loop's.** QE built its `Move` from the named piece constants; I
hand-coded the six fields and my `piece`/`captured`/`to` codes differ. **Every load-bearing fact
agrees across both instruments:** the move is **not** in `legalMoves`, it is **applied anyway**, the
ply is **counted**, and the resulting position is **unreachable from the start by any legal move**.
The ruling rests only on the facts that agree.

## The two verified by reading types, which is what makes `[D38]` a ruling and not a preference

- **`src/gameend.ts:57-69`** — `GameStatus`'s terminal arm is
  `{ result: "white-wins" | "black-wins" | "draw"; reason: EndReason }`, and **`EndReason` is exactly
  the five automatic values** (`:40-45`). **`resignation`, `engine-failure` and `engine-threw` are
  members of this loop's `TerminalReason` and of no `GameStatus`.** So a terminal frame on transitions
  12, 13 and the prompt-driven `game-over` is **not constructible**, not merely undesirable — the
  render seam takes a `GameStatus`. That is what decided `G-6` one way.
- **`src/frame.ts:176-179`** — `W` is `panels.reduce(max)` over the **panel** rows only, and the
  module's own comment says *"`W` cannot be taken over the message rows too: a long rejection would
  then widen the frame."* Two consequences written into the ticket: `A20`'s narrowing fixture **must**
  come from a panel row (a `messages`-driven fixture narrows nothing and passes vacuously), and the
  `ADR-0010` prohibition's premise — `W` is a per-frame max — is confirmed at source.

## Two smaller facts checked so a later hop does not re-derive them

- **Merged `src/frame.test.ts`'s `createScreen` is NOT exported** (`:190`), so `A20`'s screen model is
  written locally in this ticket's own test file on `ADR-0009` clause 9c's precedent. **That file is
  not touched by this ticket**, and the `\x1b[K` case it must learn is `ABC-027`'s.
- **`A12`'s enumeration guard is an EXISTENCE check over declarations, not a uniqueness check.**
  Adding row 16 as a second `insufficient-material` row therefore disturbs nothing — but a later hop
  rewriting that guard as *"exactly one row per value"* would break it, so the ticket now says so.

## What this hop did NOT do

- **No byte under `src/` changed** — `md5 c92a1776…` before and after, `git diff --stat -- src/`
  empty. All probing was out of tree, outside the repo, not named `*.test.ts`; the lane is 24 files /
  717 tests before and after.
- **`plans/board.md` was not opened for edit.** **`memory-bank/` was not edited** — `ADR-0009` and
  `ADR-0010` read only, neither re-opened. **`plans/traceability.md` was not edited**: this hop
  produced no code, no test and no new ticket, so it has no row to append; QE updated `ABC-019`'s row
  at the previous hop.
- **`ABC-016`, `ABC-017` and `ABC-027` were NOT opened** — agents are live on them. `ABC-027`'s
  merge-order position and status were read from `plans/board.md`'s own row and from `ADR-0010`; no
  queue item or note belonging to another hop was read or written. **No message passed to any hop; the
  on-disk substrate was the only channel.**
- **No merge, no push, no deploy, no `git checkout main`, no rebase, no dependency change.**
