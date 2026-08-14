---
id: 20260814T175800Z-ba-pm-observation-bbf7add6
kind: observation
by: ba-pm
at: 2026-08-14T17:58:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A1
  - src/frame.ts
  - src/render-seam.ts
  - src/glyph-mode.ts
  - src/history.ts
  - src/turn-loop.ts
supersedes: 
---

# Citation drift re-measured MYSELF at HEAD `eefc217` — the Orchestrator was right about one inversion, missed a second, and `A1`'s keys turn out to be CORRECT

I did not accept the ticket's citations or the Orchestrator's. Every line below was read at source
2026-08-14 on branch `grugops/readyfordev-ABC-042` at HEAD `eefc217`.

## The inversions

| ticket said | measured at HEAD | verdict |
|---|---|---|
| *"`beginFrameSession` and `frameHeight` (`src/frame.ts:106,233`)"* | `:106` = `export function frameHeight(panelRows: {`; `:233` = `export function beginFrameSession(sink: FrameSink, height: number)` | **INVERTED — confirmed.** The Orchestrator's observation is correct |
| *"`beginGlyphModeSession` / `selectGlyphMode` (`src/glyph-mode.ts:81,113`)"* | `:81` = `export function selectGlyphMode(signals: GlyphSignals)`; `:113` = `export function beginGlyphModeSession(flags: GlyphFlags)` | **INVERTED — a SECOND pair, not reported by anyone.** Found by re-measuring rather than by trusting the drift note's list |

Both are corrected in `## Dependencies`, each symbol now carrying its own line number rather than a
comma-pair whose order a reader must guess.

## The missing citation — `makeRenderSeam`

`src/render-seam.ts` has **exactly one** export at HEAD:

```
src/render-seam.ts:51: export function makeRenderSeam(mode: GlyphMode, orientation: Orientation): RenderSeam
```

The ticket said the entry point *"builds `ABC-041`'s seam"* and named no constructor — it could not, it was
cut before `ABC-041` was built. **It is now cited**, with the returned type read from source:
`RenderSeam = (history, status, thinking, messages) => readonly string[]` (`src/turn-loop.ts:97-102`).

## `A1`'s `frameHeight` keys — MEASURED, and the ticket was RIGHT

The Orchestrator flagged the object literal `{ board, status: STATUS_ROWS, history: HISTORY_ROWS }` as
unverified. Measured at `src/frame.ts:106-110`:

```
export function frameHeight(panelRows: {
  readonly board: number;
  readonly status: number;
  readonly history: number;
}): number
```

**The three key names match exactly. No repair was owed to `A1`'s keys, and I did not invent one.**

## What WAS wrong in `A1` — the `board` term had no source

There is **no exported board-row constant anywhere under `src/`** — measured: the only exported row counts
are `MESSAGE_ROWS` (`frame.ts:45`), `PROMPT_ROWS` (`frame.ts:53`), `HISTORY_ROWS` (`history-pane.ts:70`)
and `STATUS_ROWS` (`status-panel.ts:71`). So `board` cannot be a named import and must be derived. `A1` now
reads `board: renderBoard(<start position>, mode, orientation).length`.

**Run, not reasoned** — `node --experimental-strip-types` against merged `src/` at HEAD:

```
renderBoard(startpos, "unicode", "white-bottom").length = 9
STATUS_ROWS = 3   HISTORY_ROWS = 8
frameHeight({board:9, status:3, history:8}) = 23
makeRenderSeam("unicode","white-bottom")(newGame(START), gameStatusOf(g), false, []).length = 23
```

**The seam's frame length equals `frameHeight`'s answer** — so `A1`'s assertion is satisfiable by the
delivered composition, and it is expressed with no numeric literal (`A8`). **The figure 23 is deliberately
NOT written into the ticket:** it is a measurement, it belongs here, and a number on the page goes stale
the day a panel's height changes — which is the drift rule 1 exists to catch.

## One more measured fact the repair rests on

`gameStatusOf` is at **`src/history.ts:152`**, exported (Architect/Design's ruling requires the entry point
to call it rather than construct a `GameStatus` literal). It was not cited by the ticket at all; it is now.
