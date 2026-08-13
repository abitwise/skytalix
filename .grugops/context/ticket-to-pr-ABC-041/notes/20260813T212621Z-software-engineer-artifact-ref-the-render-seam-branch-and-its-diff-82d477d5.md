---
id: 20260813T212621Z-software-engineer-artifact-ref-the-render-seam-branch-and-its-diff-82d477d5
kind: artifact-ref
by: software-engineer
at: 2026-08-13T21:26:21Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# `ABC-041` built on `grugops/ticket-to-pr-ABC-041`. Three files, and `A10`'s budget spent exactly.

**Branch `grugops/ticket-to-pr-ABC-041`, off `main` @ `eea6afc`.** The subtask names `032589a` as the
base. `main` moved to `eea6afc` before this hop started, so the branch was cut from current `main`
instead — checked first, not assumed: `git diff --numstat 032589a eea6afc` touches **zero bytes under
`src/`** (it is the board/queue/notes commit for this very pull), so every signature the
`In Development`-entry criteria review re-read out of the tree at `032589a` still holds byte for byte
at `eea6afc`. **Nothing was committed on `main`.**

## The diff, as `A10` asks it to be read

```
git diff --cached --numstat
 1    0   src/history-pane.nfr.test.ts     <- THE ONE PROBE-ROOT LINE
 304  0   src/render-seam.test.ts
 62   0   src/render-seam.ts
 0    0   .grugops/queue/{pending => claimed/ticket-to-pr-ABC-041}/ticket-to-pr-ABC-041.md
```

`git diff --cached --numstat HEAD -- src/frame.ts src/render.ts src/status-panel.ts
src/history-pane.ts src/turn-loop.ts` returns **empty**: all five **byte-identical**, as `A10`
requires. No production file outside the new module is touched.

## What the module is

`src/render-seam.ts` — `makeRenderSeam(mode: GlyphMode, orientation: Orientation): RenderSeam`. One
exported factory, twelve lines of executable code, no state, no async. It returns
`ABC-019`'s published `RenderSeam` **by importing that type**, so the shape is checked by `tsc` at
this file rather than only at the consumer `ABC-042` has not built yet.

## What the test file covers

`src/render-seam.test.ts` — **8 tests**, one per criterion group, no `vi.mock`, no spawn, no TTY.
`A1` runs a four-ply fool's mate (`f2f3 e7e5 g2g4 d8h4`) to `black-wins` / `checkmate` through the
merged `runTurnLoop` with the seam passed unwrapped as `options.render`. `A7` and `A9`'s
*measurement* is the merged probe's, not this file's; what this file adds is the declaration's own
guard.

## The probe-root line

`FRAME_PRODUCERS` in `src/history-pane.nfr.test.ts` gains `"render-seam.ts"` and **`LICENSED_DRIVERS`
is untouched** — the review note's gap 1, followed exactly. That list is now five → six entries.
