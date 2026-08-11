---
id: 20260812T010100Z-software-engineer-decision-9b4ee1d7
kind: decision
by: software-engineer
at: 2026-08-12T01:01:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - ABC-017
  - ABC-010
  - ADR-0010
  - EPIC-002
  - src/history-pane.ts
supersedes: 
---

# `HISTORY_COLS` is 21, and the pane's layout is `9999. WWWWWWW BBBBBBB`

> Hand-authored; `scripts/context-io.ts` is absent. Not a `finding`.

Epic acceptance `4a` leaves the split to the engineer — *"the invariant is the criterion; the exact
split is the engineer's"* — subject to the one requirement `ABC-017`'s `## Scope` states: the width
must hold a **4-digit move number** and **two 7-character SAN strings** with no truncation.

## The layout, and why the cells are fixed columns rather than a joined string

```
  10. Ba3     Be6
9999. dxc8=Q+ Kf5
  27.         Nc6      <- a LEADING half-row: the white cell is empty, not absent
```

Four right-aligned digits, `.`, a space, a 7-character white cell, a space, a 7-character black
cell. **4 + 1 + 1 + 7 + 1 + 7 = 21.**

The cells are FIXED COLUMNS because three criteria read them positionally and cannot be expressed
any other way. `A6`'s third anchor requires that the first row's *white cell is empty and its black
cell holds the first ply* — whitespace-normalised, that row and a white-only row are the same
string, `27. Nc6`. A joined-and-trimmed layout makes `A6` unassertable and `A4`'s "no black ply in a
white cell" unassertable with it.

## Why 21 and not 24

`ADR-0010` clause 2: **no panel reserves, pads or declares a FRAME width.** 21 is the stated
requirement exactly and nothing more, so the pane buys no column it does not use.

The alternative was measured by `ADR-0010` rather than by me and it argues against 24 directly: at
`HISTORY_COLS` = 24 the quiet 20-ply line shows **0/20 stale frames** while the status panel
underneath is still swinging 17 → 24 every ply, and at 21 the same game with the same panels shows
**8/20**. A wider pane does not fix the status panel's defect — it **masks** it, and it un-masks it
by a constant changing in a different ticket. Under clause 1 the writer's per-row erase is what
fixes it, and `ABC-027` carries that change and merges before this one. **Choosing 21 leaves the
defect visible to the ticket that owns it.**

21 also clears the one relation `ABC-014`'s dependency line keeps: it exceeds `renderBoard`'s 18. It
does **not** make this pane the frame's `W` — `ADR-0010` cl. 6 struck that claim as measured false
and it is not reintroduced here or anywhere in the code.

## What is deliberately not handled

A loaded FEN whose `fullmoveNumber` exceeds 9,999 renders a row **wider** than `HISTORY_COLS`.
`padStart` never truncates and neither does `padEnd`, so the number stays right and the row gets
wide. That is the ticket's own accepted limitation pointing at `ABC-010`, and the alternative —
truncating — would put a **wrong move number** on screen to preserve a width promise. Stated in the
module header rather than silently handled.
