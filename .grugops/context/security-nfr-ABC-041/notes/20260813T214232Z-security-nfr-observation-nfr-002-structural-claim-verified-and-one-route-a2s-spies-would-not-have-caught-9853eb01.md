---
id: 20260813T214232Z-security-nfr-observation-nfr-002-structural-claim-verified-and-one-route-a2s-spies-would-not-have-caught-9853eb01
kind: observation
by: security-nfr
at: 2026-08-13T21:42:32Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - NFR-002
  - N8-LANE
  - src/render-seam.ts
  - src/status-panel.ts
  - src/history-pane.ts
  - src/legal.ts
  - plans/nfr-catalog.md
supersedes: 
---

# `NFR-002`'s structural claim HOLDS, and it holds for a reason `A2`'s spies alone do not prove. Checked because this NFR is mine.

The subtask asks for this specifically: *"`NFR-002`'s structural claim — the seam is asserted to add
**zero** derives per frame — since that is an NFR you own and it is carried as a count, not a wall
clock."*

## The claim, and the instrument the ticket carries it on

`ABC-041` § Security / NFR triggers: *"the seam adds **zero** derives per frame (`A2`'s spied 0) —
the structural claim the catalog row's `O(window)` statement rests on."* The instrument is `A2`:
`gameStatus`, `gameStatusOf` and `legalMoves` called **exactly 0** over three seam calls, plus the
`GameStatus` reaching `renderStatusPanel` being **reference-identical** to the one passed in.

Run here as my own evidence rather than inherited: `npx vitest run src/render-seam.test.ts` →
**8 passed / 8, 16 ms**.

## Why the spied 0 is not, by itself, enough — and why the claim survives anyway

`A2`'s spies are `vi.spyOn` over **module namespace objects**. An *intra-module* call — a function in
`legal.ts` calling another function in `legal.ts` through its local binding — does not pass through
the spied export and **would not be counted**. So a derive reached indirectly could sit on the frame
path with `A2` still reading 0. That is a real hole in the instrument, and it is worth naming because
the ticket rests `NFR-002` on this count.

**Checked directly against the source, and the hole is empty.** The seam's per-frame path is exactly
`renderBoard` → `renderStatusPanel` → `renderHistory` → `assembleFrame`. Grepping all five modules
for `gameStatusOf|gameStatus(|legalMoves|isCheck|generateMoves`:

- `render.ts`, `frame.ts`, `render-seam.ts` — **no match in executable code** (the only hits anywhere
  are inside docblocks).
- `status-panel.ts` — imports `isInCheck` from `legal.ts` (`:43`), calls it once (`:206`).
- `history-pane.ts` — imports only `makeMove`, `parseFen`, `toSan` and a type.

**`isInCheck` is the one candidate indirect route, and it does not take it.** `src/legal.ts:32-35`:

```ts
export function isInCheck(position: Position): boolean {
  const black = position.blackToMove;
  return isSquareAttackedBy(position, kingSquareOf(position, black), !black);
}
```

It calls `isSquareAttackedBy` directly. It does **not** call `legalMoves`. So there is no path by
which a spied-0 could be a false 0 on this frame path. **The structural claim holds, on the source
and not only on the count.**

## What "zero derives" does and does not mean, since a later reader will need the fence

It means **the seam adds none** — the `gameStatusOf` / `gameStatus` / `repetitionCounts` replay stays
in the loop, called once per ply, where `plans/nfr-catalog.md`'s `NFR-002` row already books it as
the **`O(plies)` boundary condition** (measured merged at 20.8 / 48.3 / 95.3 µs at 40 / 120 / 300
plies, M3 / Node v24.12.0).

It does **not** mean a frame is free. The panels do real per-frame work the seam inherits and does
not add to: `history-pane.ts` and `status-panel.ts` both replay forward with `makeMove` / `parseFen`
/ `toSan`. The catalog already states this precisely — *"the pane replays from `initialFen` to the
window's first ply, which is `O(plies)` (one `parseFen` plus ~10 ns/ply; measured near-flat at
2.2–3.9 µs across 40–300 plies)"* — and the dominant term is `O(window)` at a fixed 16 rendered
plies. **The seam introduces no new term into that expression.** Verified from its 16 lines of
executable text: it calls the four, passes `status` and `thinking` through verbatim, and derives
nothing.

**The wall clock stays where the ticket put it — a catalog reading with its machine.** This suite
asserts no wall clock, and I am not manufacturing one. The `< 16 ms` target is still **`UNKNOWN -
verify` as a whole-frame measurement**: the catalog records frame COMPUTE partly measured and frame
WRITE as *"still `UNKNOWN - verify` and still the half nobody has measured"*. `ABC-041` does not
change that and does not claim to. **`NFR-002` is not breached by this change; it is also not closed
by it.**

## `N8-LANE` — checked, does not fire, and the Engineer's own honesty about it is right

`N8-LANE` is ≤ **650 ms CPU**, scope = every file the branch adds under `src/`. This branch adds
**exactly 1** file. Measured directly: `src/render-seam.test.ts` runs **8 tests in 16 ms** of test
time (13 ms on the Engineer's run), against QE's published per-file median of **94.2 ms**. It is well
below median weight — pure functions, no corpus, no spawn, no perft, no `vi.mock`.

The Engineer's paired-delta note (`…-claim-the-lane-cost-…-9a602a43`, `confidence: medium`) reports a
median 170 ms with an identity null control spreading ±50–180 ms and one pair missing the method's
own 1.5% bar, and **declines to call 170 ms a measurement**. That is the correct call and I am not
overturning it: at n = 7 on that machine the instrument cannot resolve one light file's marginal
cost. The axes that ARE resolvable — file count (1, allotted 1) and the file's own test time (16 ms)
— both clear comfortably. **`N8-LANE` does not fire.**
