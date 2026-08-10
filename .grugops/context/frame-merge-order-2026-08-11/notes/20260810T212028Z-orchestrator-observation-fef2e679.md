---
id: 20260810T212028Z-orchestrator-observation-fef2e679
kind: observation
by: orchestrator
at: 2026-08-10T21:20:28Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - src/frame.ts
supersedes:
---

# Two measured facts about the frame tickets, before any routing

Recorded as `observation` and NOT as `finding`: both are direct reads of the tree, but this hop
holds no `§14-gate#<id>` stamp and no `human:<name>` grant, so a `finding` would be refused and
faking one is the thing admission exists to stop.

## Fact 1 — `ABC-018` is already merged, so it cannot be in a merge order

`plans/tickets/ABC-018-frame-output-and-redraw.md` front matter reads `status: done` / `column: Done`,
and `plans/board.md` records the merge: fast-forward `7e0923c` → `364928b`, 2026-08-09. The request
asked for a merge order over four tickets including this one. **Three of the four are unmerged.**
`ABC-018` is not a slot in the order — it is the substrate the other three consume: `frameHeight`
(`src/frame.ts:84`), `FrameParts` (`:64`), `assembleFrame` (`:172`) and the widest-panel `W` rule
(`:179`).

## Fact 2 — `STATUS_ROWS` and `HISTORY_ROWS` do not exist in merged `src/`

```
grep -rn "STATUS_ROWS\|HISTORY_ROWS\|frameHeight\|FrameParts" src/ --include=*.ts | grep -v test
src/frame.ts:64:export interface FrameParts {
src/frame.ts:84:export function frameHeight(panelRows: {
src/frame.ts:169: * One frame of `frameHeight(...)` rows: board, status, history, ...
src/frame.ts:172:export function assembleFrame(parts: FrameParts, mode: GlyphMode): string[] {
```

Neither constant is present. `frameHeight` takes a plain `panelRows` object. Therefore:

- `ABC-016` **creates** `STATUS_ROWS`. Its `A11` asserts
  `frameHeight({ board: 9, status: STATUS_ROWS, history: 8 })` is 23 — `history` is the **literal 8**,
  so `A11` needs nothing from `ABC-017`.
- `ABC-017` **creates** `HISTORY_ROWS`. Its `A1` asserts
  `frameHeight({ board: 9, status: STATUS_ROWS, history: HISTORY_ROWS })` is 23 — and it names
  `STATUS_ROWS`, a symbol that exists nowhere in merged `src/` and that only `ABC-016` produces.

**The edge is one-directional: `ABC-017`'s own `A1` cannot be evaluated before `ABC-016` lands, and
`ABC-016` can go green alone.** That asymmetry is what the merge order and the branch decision both
turn on, and it is why this was measured before anything was routed.

## The contradiction this exposes inside `ABC-017`, which is sitting in `Ready`

`ABC-017`'s Dependencies block says of `ABC-016` (line 345): *"Not a code dependency — no import edge
either way — but its promoted criterion `A11` hardcodes `history: 8`, so the two tickets share a
number and `A1` is where they are tied."*

That sentence and `A1` cannot both be right as written. Either `A1` imports `STATUS_ROWS` — in which
case there **is** an import edge and the block is wrong — or `A1` hardcodes `status: 3`, in which case
it mirrors the exact defect (`D13`) that `ABC-017`'s own refinement hop was run to fix, from the other
side. This is a Definition-of-Ready item-5 (*dependencies known*) failure on a ticket the board
already shows as `Ready`.

Naming ONE structural item deliberately. This project has twice recorded that the Orchestrator's
short pre-check lists function as anchors for the role that follows (`ABC-016`'s hop was
right-for-the-wrong-reason on 2 of 16; the `ABC-017` hop named zero and found 18). No list of
candidate defects is handed to either scheduled agent.
