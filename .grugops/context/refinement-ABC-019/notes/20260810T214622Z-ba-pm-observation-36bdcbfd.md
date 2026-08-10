---
id: 20260810T214622Z-ba-pm-observation-36bdcbfd
kind: observation
by: ba-pm
at: 2026-08-10T21:46:22Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-020
  - ABC-016
  - src/gameend.ts
  - src/history.ts
  - src/frame.ts
  - NFR-002
  - NFR-008
supersedes:
---

# Six wrong builds run against `ABC-019`'s criteria, and the per-ply cost measured at three ply counts

Recorded as `observation` and **not** as `finding`: every number below is a direct measurement of
merged `src/`, but this hop holds no `§14-gate#<id>` stamp and no `human:<name>` grant, so a
`finding` would be refused and faking one is the thing admission exists to stop.

## What was built, and what was left behind

Four throwaway files were written under `src/`, run, and deleted: a ply loop with both stub seams and
six wrong-build variants, its test file encoding `ABC-019`'s criteria verbatim, a type-level file, and
a stub-claims check. A fifth harness for the timing lives outside the repository.

**`src/` is byte-identical across the hop.** Aggregate md5 of all 36 `src/*.ts` files:
`df71fb293d653eaa5e811986a81e04f7` before and after; per-file md5 list identical;
`git status --short -- src/` empty. Default lane after cleanup: **676/676 on 22 files, 1.49 s wall**.
**Zero production lines.**

## Five criteria a wrong build passes (all constructed and RUN, 17/17 green)

| Wrong build | Criterion it satisfies verbatim | What it actually does |
|---|---|---|
| `humanToMove = ply % 2 === 1` | `A1` — first actor is the engine, zero prompts before it | hands the human's own **White** opening move to the engine; `A2` never asks who acted |
| no frame before the first act | `A2` — "exactly **two** frames" for one full move | **prompts the human before any board is shown**; a CORRECT build renders **3** and FAILS `A2` |
| `gameStatus(position, new Map())` | `A3` — "every `gameStatus` call carries a counts map" | reports `in-progress` on the **fifth** occurrence where `gameStatusOf` reports `{draw, fivefold-repetition}`; also passes `A13` for the wrong reason |
| `blackToMove ? "black-wins" : "white-wins"` | `A7` — "the winner is derived from `position.blackToMove`" | reports the **LOSER** as the winner, with the mated frame, the right reason and exit 0 |
| exit test at the top of the loop | `A7` in full | renders the mated frame, records `checkmate`, then **invokes the engine seam on a checkmated position** where `legalMoves` returns `[]` |
| repairs nothing after a throw | `A9` — `toFen` equals a replay from `{initialFen, moves}` | passes whenever the stub throws **before** mutating; only a throw inside a `makeMove` bracket can fail it |

Fixture for the mate cases: `rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2` then
`d8h4` → `{result:"black-wins", reason:"checkmate"}`, matching `src/gameend.test.ts`'s Fool's-mate row.

## `A4` is unsatisfiable against merged `src/` — measured twice

`gameStatusOf` on the knight-cycle line (`src/gameend.test.ts`'s shape, en-passant-free):

- **3 occurrences** → `{result:"in-progress", reason:null, claimable:{by:"white", draws:["threefold-repetition"]}}`
- **5 occurrences** → `{result:"draw", reason:"fivefold-repetition"}`

`A4` demanded `{result:"draw", reason:"threefold-repetition"}`. `tsc --noEmit` exits **0** with
`// @ts-expect-error` on `const r: EndReason = "threefold-repetition"` — i.e. the assignment IS a type
error. `ABC-020` merged 2026-08-02 and made that value a `ClaimableDraw`, **disjoint from `EndReason`
by construction** (`src/gameend.ts:47-48`). The criterion also contradicted `A13`, which the same
2026-07-31 amendment added.

Same instrument on the terminal-reason type: `type X = EndReason | "resignation"` satisfies `A14` as
written and **cannot** represent `A10`'s engine-failure reason, `A9`'s reason after a throw, or either
of `ABC-021`'s claimed reasons — four `@ts-expect-error` markers, all real errors.

## Per-ply loop overhead, 40 / 120 / 300 plies

Own harness **outside the repository**, its own process, warm-up round discarded, **8 usable rounds ×
400 iterations**, cell order rotated every round, medians of per-round means, game built by
`src/history.test.ts:81-89`'s LCG so a ply count means the same thing here and in the suite, every
game's length asserted. **Apple M3 / Node v24.12.0 / darwin-arm64. `UNKNOWN - verify` elsewhere.**

| plies | 1 derive/ply | 2 derives/ply | 3 derives/ply | `gameStatusOf` | `repetitionCounts` |
|---|---|---|---|---|---|
| 40 | 20.71 µs | 38.81 µs | 56.19 µs | 20.62 µs | 17.67 µs |
| 120 | **48.34 µs (0.48x)** | **93.58 µs (0.94x — MET)** | 137.13 µs (1.37x) | 48.06 µs | 44.89 µs |
| 300 | **96.88 µs (0.97x)** | 187.43 µs | 277.56 µs | 94.43 µs | 91.42 µs |

Two facts about the ticket's `≤ 100 µs at 120 plies` bar follow from that table and neither is an
opinion:

1. **A two-derives-per-ply build passes it** at 0.94x. The bar's own stated purpose is to forbid
   deriving "once per call site"; it only bites at three derives.
2. **The correct build is at 0.97x at 300 plies** — and `plans/nfr-catalog.md`'s `NFR-002` boundary
   block independently records this same quantity at *97–102 µs @ 300*, which with `gameStatus`'s
   2.52 µs is 99.5–104.5 µs, i.e. **at or over a bar the row sits beside**. The `NFR-008` row documents
   ±22% thermal drift on this machine within one hour.

**Instrument sanity:** `gameStatusOf` reads 20.62 / 48.06 / 94.43 µs here against `ABC-016`'s hop's
independently-measured 21.06 / 47.93 / 95.64 — agreement within **1.3%**, two harnesses written a day
apart by different roles.

## Merged-code facts the ticket cited wrongly, or did not cite at all

- The string `counts.get(zobristKey(position)) >= 3` appears **nowhere in `src/gameend.ts`**. It is
  `src/history.ts:130`. `gameend.ts:106` (the ticket's citation) is inside `isInsufficientMaterial`'s
  board scan; the real test is `occurrences >= THREEFOLD_OCCURRENCES` at `:162` and it no longer ends a
  game. `EndReason` is `:40-45`, not the cited `:28-34` (import specifiers).
- **`takeBack(history, 0)` IS the rebuild-by-replay the ticket describes without naming**
  (`src/history.ts:99-105`): `splice(Math.max(0, len - 0))` removes nothing, then `resetTo(initialFen)`
  and replay. Run against a stub that throws mid-`makeMove`: the live object was one ply ahead and
  `takeBack(history, 0)` restored it byte-identical by `toFen` with `moves.length` unchanged.
- **Both stub claims hold.** On `7k/4P3/8/8/8/8/8/K7 w - - 0 1`, the token `e7e8` yields **exactly 4**
  candidates with identical `from`/`to` (`addPromotions`, `src/moves.ts:88-98` — that citation is
  correct), so `ambiguous` is reached for free; an unmatched token yields `rejected`. Coordinate reader
  **11 lines**, engine stub **9 lines**, over `legalMoves` + `squareName` (`src/position.ts:60` —
  also correct).
- **Every hard dependency is merged**: `ABC-012` `status: done` (2026-08-06), `ABC-014` (2026-08-08),
  `ABC-018` (2026-08-09), `ABC-020` (2026-08-02). `ABC-016` and `ABC-017` are `status: ready`,
  unmerged. Read from ticket front matter and `plans/board.md`, not assumed.
- The frame's message region is part of the frame (`src/frame.ts:172-185`), so a rejection line and an
  ambiguity list have **no output channel other than a frame** — which is why every non-advancing
  prompt outcome must re-emit one, and why "one render per ply" cannot be true.
