---
id: 20260813T210800Z-orchestrator-observation-criteria-review-at-the-in-development-entry-f060ca1f
kind: observation
by: orchestrator
at: 2026-08-13T21:08:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/turn-loop.ts
  - src/render.ts
  - src/status-panel.ts
  - src/history-pane.ts
  - src/frame.ts
  - src/history-pane.nfr.test.ts
  - AGENTS.md
supersedes: 
---

# ABC-041's criteria, re-read against the BUILT TREE. Ten criteria hold. TWO GAPS, both non-blocking.

`AGENTS.md` § Process rules, rule 1: criteria review happens at the `Ready for Dev` exit, before a
ticket enters `In Development`, and the reviewer must not be the author. **Author: BA/PM. Reviewer:
Orchestrator.** This is not a DoR re-run — DoR asks whether criteria are *well formed*; this asks
whether they still *match what exists*. Every line below was read out of the tree at `032589a`, not
out of the ticket.

## What was re-read, and what it says today

| ticket claim | tree at `032589a` | verdict |
|---|---|---|
| `RenderSeam` published at `src/turn-loop.ts:97-102` | `export type RenderSeam` at **97–102**, four params, `=> readonly string[]` | **exact** |
| `renderBoard(position, mode, orientation)` | `src/render.ts:113` — `Position, GlyphMode, Orientation` | **exact** |
| `renderStatusPanel(history, status, thinking)` | `src/status-panel.ts:187` | **exact** |
| `renderHistory(history)` | `src/history-pane.ts:118` | **exact** |
| `assembleFrame(parts, mode)` | `src/frame.ts:194`, `FrameParts` exported at `86` | **exact** |
| `frameHeight`, `STATUS_ROWS`, `HISTORY_ROWS` exported (`A3`) | `frame.ts:106`, `status-panel.ts:71` (**3**), `history-pane.ts:70` (**8**) | **exact** |
| `Orientation` is `"white-bottom" \| "black-bottom"` (`A4`) | `src/render.ts:68` | **exact** |
| `gameStatus` / `gameStatusOf` / `legalMoves` spyable (`A2`) | `gameend.ts:133`, `history.ts:152`, `legal.ts:42` — all named exports | **exact** |
| a type-only `history.ts` import is the house pattern (`A7`) | `status-panel.ts:42` and `history-pane.ts:61` both `import type { GameHistory }` | **precedent exists** |
| the probe's declared root list (`A9`) | `FRAME_PRODUCERS` at `src/history-pane.nfr.test.ts:187-193`, **five** entries | **exists, 5 → 6** |

### `A8`, the headline, RE-MEASURED TODAY — not copied forward

The ticket measured 2026-08-12 and re-checked 2026-08-13. Re-run at this exit over non-`.test.ts`
files under `src/`:

```
src/status-panel.ts   0 production importers
src/history-pane.ts   0 production importers
src/render.ts         2, BOTH `import type { GlyphMode }` (frame.ts:42, glyph-mode.ts:42)
                      -> renderBoard has 0 runtime consumers
```

**Unchanged. `0 / 0 / 0` still stands, so `A8` is still falsifiable and still worth asserting.** The
fourth zero-importer module, `src/turn-loop.ts`, is also still **0** — it is `ABC-042`'s to close, and
`ABC-041` correctly does not claim it.

## GAP 1 — `A9` names ONE of the probe's TWO declared lists, and `A10` silently forbids touching the other

`src/history-pane.nfr.test.ts` declares two sets, not one:

- `FRAME_PRODUCERS` (`:187`) — the **frame-path roots**, `ADR-0011` clause 2. `A9` says this one gains
  the module. Correct.
- `LICENSED_DRIVERS` (`:212`) — `["turn-loop.ts"]`, `ADR-0011` clause **3**, the regex guard over which
  production modules may hold a **runtime** import of `history.ts`.

The ticket never mentions the second list. It does not have to be edited — `A7` requires the new
module's `history.ts` import to be **type-only**, and the licence guard is about runtime imports — but
**the failure mode is one keystroke wide**: an engineer whose module trips that guard has an obvious
wrong move (add itself to `LICENSED_DRIVERS`) which would satisfy the guard, quietly widen `ADR-0011`
clause 3 from one licensed driver to two, and blow `A10`'s "the one probe-root line" budget in a way
`A10` states only by omission.

**Correct action, stated so nobody derives it under pressure: add to `FRAME_PRODUCERS`, do NOT add to
`LICENSED_DRIVERS`.** If the licence guard fires, the module has a runtime `history.ts` import and
`A7` is already red — fix the import, never the list.

## GAP 2 — `A1` needs an `EngineSeam` and an `InputSeam`, and the board says one of those "exists nowhere"

`A1` requires a scripted game of ≥ 4 plies run **through `runTurnLoop`**. `TurnLoopOptions`
(`src/turn-loop.ts:140-153`) requires **six** fields, including `input: InputSeam` (`:135`) and
`engine: EngineSeam` (`:138`). The board's `ABC-043` row carries a DoR blocker reading **"no
`EngineSeam` exists anywhere"**, and `ABC-037` (the real `InputSeam`) is open. `ABC-041`'s
Dependencies section says "**Nothing this ticket needs is open**".

Both are true at once, and the ticket never says why: `A1`'s input and engine are **test stubs**;
only the *render* seam is real. **Verified, not assumed** — `src/turn-loop.test.ts` already calls
`runTurnLoop` twice today with exactly that shape. So `A1` is achievable at `032589a`, and neither
`ABC-037` nor `ABC-043` blocks it.

Recorded because a reader who checks the board before the tree reaches the opposite conclusion and
stops.

## Rule 1's control, honestly reported

The control is that gaps found at QE fall while gaps recorded **at this exit rise**. This exit
recorded **2** on `ABC-041`. Both are specification gaps in a 10/10 ticket — neither is a defect in
the ticket's *judgement*, and neither changes a criterion. **No criterion was rewritten by this
review, and none was waived.** If the review had produced 0 on a ticket this dense, the honest reading
would have been that it was not run.
