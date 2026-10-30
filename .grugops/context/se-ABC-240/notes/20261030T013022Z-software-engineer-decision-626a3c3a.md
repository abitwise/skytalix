---
id: 20261030T013022Z-software-engineer-decision-626a3c3a
kind: decision
by: software-engineer
at: 2026-10-30T01:30:22Z
verified_by: 
confidence: high (built to the ruling; deviations stated)
refs:
  - ABC-240
  - EPIC-010
  - ABC-235
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - bapm-ABC-235-split
  - grugops/ABC-240
  - 0e0ef856
  - 69e19fc4
  - 7913499d
  - src/search.ts
  - src/quiescence.ts
  - ADR-0024
  - ABC-080
  - ABC-228
  - ABC-229
  - ABC-233
  - ABC-234
supersedes: 
seal: sha256:e6352fafa96623afa28c2d8a18bcd7eafdc7412ba1b2a59449f1407ef97651fc
---

# Software Engineer decision, se-ABC-240: cut 6 built to `arch-ABC-235`, two commits (item 1, item 2), no ADR

Branch `grugops/ABC-240` from `main` `0e0ef856` (the merge base; it holds ABC-235 at `baf99a7c`), its own `npm ci --ignore-scripts`. Built to the ruling `arch-ABC-235/…7fc1b90c` § Cut 6 and the gate set `…eebca902`. `orderKey`, its tiers and `mvvLvaKey` are untouched.

## Commits
1. `69e19fc4`, item 1 (`src/search.ts`). `orderMoves` copies the input once (`moves.slice()`, the one fresh array the "returns a NEW array" contract names), computes each `orderKey` once into `ORDER_KEYS`, a fixed 256-slot `Float64Array` module scratch, and insertion-sorts the copy beside it. An entry moves only past a STRICTLY smaller key.
   - C1: stable by construction (strict `<`), so equal keys keep input order, as `Array.prototype.sort` with `b.key - a.key` does. For finite doubles the sign of `b - a` is the sign of the comparison, so the two orders agree.
   - C2: keys stay float64.
   - C3: the input is only read.
   - C4: the scratch is shared between plies, which is safe because the sort ends before the caller recurses. The output array is fresh per call.
   - A list longer than 256 (no legal position has one; the maximum is 218) gets its own `Float64Array`, so the function is total.
   - The per-move wrapper objects and two of the three arrays are gone.
   - New export `orderScratchByteLength()` for `NFR-009` (a). The search module's export inventory (`src/search.test.ts` A6) names it, with a comment saying it picks nothing.
2. `7913499d`, item 2 (`src/quiescence.ts`). `quiesce`'s `captures.sort((a, b) => mvvLvaKey(b) - mvvLvaKey(a))` becomes `orderCaptures(captures)`. It does the same insertion sort IN PLACE on the frame's own array (`legalCaptures` returns a fresh one), with each `mvvLvaKey` computed once into `CAPTURE_KEYS`, a fixed 256-slot `Float64Array`. Ordering only; nothing else in quiescence changes (the ABC-228/229 fence).
   - New exports: `orderCaptures` (for the P2 oracle) and `captureScratchByteLength()` (for `NFR-009` (a)).

## Why insertion sort
The ruling names it ("insertion sort that moves only on strict `<`"). Its cost is the number of inversions. At a full-width node that is roughly the tactical moves times the quiet moves ahead of them, and in quiescence the lists are short. No new module and no shared helper: the two 10-line loops sit in their own files, because `src/quiescence.ts` cannot import `src/search.ts` (that would be a cycle).

## Deviations, stated
- **Tests outside the two named files.** The G7 (a) byte sum is in `src/transposition.test.ts`, the existing `NFR-009` row, which now adds both scratches (2 × 2 KiB). The export inventory is in `src/search.test.ts`. The A2 rows themselves are in `src/search.ordering.test.ts` and `src/quiescence.test.ts`, as the ticket says.
- **The deep walk's env.** Both files gate their older deep rows on `SEARCH_DEEP`. The ticket puts this walk under `ENGINE_DEEP=1`, so each file adds a separate `RUN_ENGINE_DEEP` for the new rows only.
