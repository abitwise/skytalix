---
id: 20260814T171719Z-orchestrator-observation-b2f6f09b
kind: observation
by: orchestrator
at: 2026-08-14T17:17:19Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/frame.ts
  - src/render-seam.ts
supersedes: 
---

# `ABC-042`'s citations re-measured against HEAD, at the `Ready for Dev` exit

`AGENTS.md` § Process rules, rule 1: this ticket's acceptance criteria are re-read against the
**built tree**, not the tree it was cut against. `ABC-042` was cut 2026-08-13 at `EPIC-006`'s
decomposition, **before `ABC-041` was built**. `ABC-041` merged the same day. What follows was
measured by `grep` at HEAD (`eefc217`), not inferred.

## Citations that still resolve

| cited | at HEAD | verdict |
|---|---|---|
| `selectGlyphMode` `src/glyph-mode.ts:81` | `:81` | ✅ exact |
| `beginGlyphModeSession` `src/glyph-mode.ts:113` | `:113` | ✅ exact |
| `newGame` `src/history.ts:73` | `:73` | ✅ exact |
| `STATUS_ROWS` | `src/status-panel.ts:71`, exported, `= 3` | ✅ exists |
| `HISTORY_ROWS` | `src/history-pane.ts:70`, exported, `= 8` | ✅ exists |

## Citation that is INVERTED

`## Dependencies` reads *"`beginFrameSession` and `frameHeight` (`src/frame.ts:106,233`)"* — i.e.
`beginFrameSession`@106, `frameHeight`@233. **Measured at HEAD the two are the other way round:**

- `src/frame.ts:106` — `export function frameHeight(panelRows: {`
- `src/frame.ts:233` — `export function beginFrameSession(sink: FrameSink, height: number): FrameWriter`

Both symbols exist and both signatures are usable, so no criterion is unsatisfiable because of
this. It is a stale pointer, not a broken contract — recorded so the engineer does not open
`:106` expecting the session constructor.

## The seam `A1` composes did not exist when `A1` was written

`ABC-041` merged `src/render-seam.ts`. Its **entire** public surface at HEAD is one function:

```
src/render-seam.ts:51: export function makeRenderSeam(mode: GlyphMode, orientation: Orientation): RenderSeam
```

`ABC-042` § Scope says the entry point *"builds `ABC-041`'s seam"* and names no constructor —
it could not, it predates the build. The ticket therefore carries **no citation for the one
call that is the reason this ticket waited on `ABC-041`**. `A1` also asserts a frame of exactly
`frameHeight({ board, status: STATUS_ROWS, history: HISTORY_ROWS })` rows; the `board` field of
that object literal is **not** sourced to anything, and whether `RenderSeam` supplies it, or
`frameHeight`'s parameter shape still uses those three keys, is unverified here.

Owner: BA/PM, at the criteria repair. This is the single largest piece of `Ready for Dev`
drift on the page and it is exactly the drift rule 1 exists to catch.
