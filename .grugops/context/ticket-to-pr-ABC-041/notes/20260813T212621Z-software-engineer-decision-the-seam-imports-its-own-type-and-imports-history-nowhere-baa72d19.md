---
id: 20260813T212621Z-software-engineer-decision-the-seam-imports-its-own-type-and-imports-history-nowhere-baa72d19
kind: decision
by: software-engineer
at: 2026-08-13T21:26:21Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/turn-loop.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Four implementation decisions on `ABC-041`, and the one that is load-bearing is an IMPORT.

The ticket left no design question open, so these are the choices it did not have to make.

## 1. The module is `src/render-seam.ts`, exporting one factory

`makeRenderSeam(mode, orientation)`. Kebab-case filename and a `make…` verb are both house
precedent (`history-pane.ts`, `status-panel.ts`; `makeMove` in `apply.ts`). Two positional
parameters rather than an options object: the two unions are disjoint, so a caller that swaps them
gets a type error rather than a mirrored board.

## 2. It IMPORTS `RenderSeam` from `src/turn-loop.ts` rather than re-spelling the signature

This is the decision with consequences, and it was checked before it was taken.

**Why.** `A1` says the module *is* `ABC-019`'s published seam. If the signature were re-typed here,
nothing in the tree would notice the two drifting apart until `ABC-042` — which does not exist yet —
tried to pass it. Importing the published type makes `npm run typecheck` the instrument for `A1`'s
type half, on every run, starting now. The parameter types come in with it, so the seam's four
parameters are contextually typed and no second declaration of `GameHistory` or `GameStatus` exists
to drift.

**Why it is safe.** `turn-loop.ts` imports `history.ts` at RUNTIME, so a non-type import here would
put `history.ts` on the frame path and red `A7`. The import is `import type`, `verbatimModuleSyntax`
is on, and Node's type stripping erases it — **measured, not reasoned**: the frame-path probe rooted
at this module reports neither `turn-loop.ts` nor `history.ts` in its closure.

**What holds it.** The mutant that makes the import runtime reds the merged probe. That guard is now
armed for this module precisely because `A9`'s one line declares it a frame producer.

## 3. `src/history.ts` is imported NOWHERE — not even as a type

The criteria review notes the house pattern is a type-only `history.ts` import (`status-panel.ts:42`,
`history-pane.ts:61`), and `A7` is worded around one. This module needs none: `RenderSeam` already
carries `GameHistory` into the closure's parameter list, and the seam only reads `history.position`.
Zero imports is the strongest form of `A7` and it costs nothing, so the house pattern is followed by
being unnecessary rather than by being copied.

## 4. `A9`'s edit adds to `FRAME_PRODUCERS` and NOTHING is added to `LICENSED_DRIVERS`

The review's gap 1, applied as written. The two lists hold different properties over the same set —
clause 2 is the declared frame path, clause 3 is `ADR-0002`'s single-supplier licence — and this
module belongs to exactly one of them.

That correctness is now **mechanical rather than remembered**: `A9`'s test in
`src/render-seam.test.ts` reads the probe's source and asserts `"render-seam.ts"` is in
`FRAME_PRODUCERS` and is **not** in `LICENSED_DRIVERS`. Two lines, and the one-keystroke wrong move
the review predicted now goes red on the next run instead of being caught by a reader.
