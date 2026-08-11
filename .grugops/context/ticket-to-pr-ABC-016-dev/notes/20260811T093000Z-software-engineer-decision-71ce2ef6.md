---
id: 20260811T093000Z-software-engineer-decision-71ce2ef6
kind: decision
by: software-engineer
at: 2026-08-11T09:30:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ADR-0009
  - src/status-panel.ts
supersedes:
---

# The seven implementation decisions `ABC-016` left to the engineer

> **Hand-authored.** `scripts/context-io.ts` — the sanctioned writer Workflow 16 names — does not
> exist in this repo or in the kit, and `mcp__grugops__propose_note` is not among this session's
> tools. The recorded precedent for the same gap is
> `.grugops/queue/done/refinement-ABC-019/claim.md`, which says so plainly rather than pretending.
> **Nothing in this hop is a `finding`** — no verification stamp is issuable to me, so no note here
> claims one.

The ticket pins every cell's text and leaves the layout to the engineer (epic acceptance `4a`:
*"the invariant is the criterion; the exact split is the engineer's"*). These are the choices that
filled that space, each with the alternative it beat.

## 1. The seven items pack into three rows, grouped by what a player reads together

```
White to move  27.  CHECK
last: Nf3  material: +8
thinking...  White may claim: threefold repetition, fifty-move rule
```

Row 1 is whose turn and whether it is urgent; row 2 is what just happened and how the game stands;
row 3 is the two cells the *loop* owns. Cells are joined with two spaces and an empty cell
contributes nothing rather than a double gap. No criterion constrains the grouping — only the total
`STATUS_ROWS`, which is why the total is what the tests assert.

## 2. The thinking cell reserves its WIDTH; nothing else does

`A7` requires an identical widest-row width between the two thinking states, so the idle cell is
`" ".repeat("thinking...".length)` rather than absent. **The other variable cells — check and claim
— are deliberately NOT width-reserved.** Reserving the claim cell would pin every frame at the
53-character width of its longest text and is asked for by no criterion (coding rules 5 and 7);
reserving the check cell buys nothing `A7` measures. The honest consequence, recorded rather than
hidden: the frame's `W` can still change when `CHECK` appears or a claim becomes available, because
`W` is the panel's widest row (`src/frame.ts:179`). `A7` constrains the thinking flag only, and that
is what is implemented.

## 3. The material scan steps 64 squares with `squareAt(file, rank)`, not 128 with `isOnBoard`

Both are correct. `squareAt` over an 8×8 double loop is the form `src/render.ts:133` and
`src/fen.ts:193` already use (coding rule 11), it is literally the "64-square scan" `A13` names, and
it is the only form under which that criterion is *countable*: `squareAt` is called by the scan and
by `parseFen`, and by nothing else in a panel render, so a spy can isolate it. An `isOnBoard` walk
would have been a 128-square scan sharing a primitive with move generation, which no spy could
separate.

## 4. Item 4 replays; it does not reach for the live position

`toSan(history.position, lastMove)` returns the CORRECT string and permanently corrupts the live
board — SAN's suffix makes and unmakes the move on the position it is handed. The panel therefore
replays `parseFen(initialFen)` forward through `moves[0 … n−2]` onto a throwaway `Position` it owns.
`A5`'s `toFen` snapshot, taken BEFORE the first render, is what pins this; a content-only assertion
passes the corrupting build.

**The replay is skipped entirely on an empty history** — there is no last move to name, so there is
no `parseFen` and no `toSan`. That is why the 0-ply cost is 0.57 µs against 5.68 µs at 40 plies.

## 5. `STATUS_ROWS` is exported and the panel returns a three-element array literal

`ADR-0009` clause 1: the producer owns its count. The constant is the export `ABC-018`'s
`frameHeight` consumes as a session constant (`src/frame.ts:84`, `:211`) and `ABC-017`'s `A13` will
read. The count and the literal are tied by `A11`, which imports the constant rather than restating
it — the same relationship `MESSAGE_ROWS` already has with `packRegion` in `src/frame.ts`. **No
runtime assertion of the row count was added**: a `throw` on an impossible branch is coding rule 8.

## 6. No `GlyphMode` parameter, and no frame-level claim anywhere

The panel emits no piece glyph and no box character, so it is ASCII unconditionally and `A12` holds
by construction rather than by vigilance. **It names no other panel's row count in production or in
test** (`ADR-0009` clause 2), asserts nothing about `frameHeight`'s output (clause 4), and does not
touch `src/frame.test.ts` — clause 5 puts the composition fit-check on `ABC-017`, which merges
second. A fourth copy of that assertion is precisely what the ADR rejected.

## 7. `GameHistory` arrives as a type-only import, in the tests as well as in the module

`NFR-002`'s `O(window)` boundary condition was verified STRUCTURALLY at `ABC-012`'s gate on the
ground that nothing pulls the repetition derive into a frame. The panel's `import type` is erased, so
the production runtime importer count of `src/history.ts` stays **zero**. The acceptance test file
holds the same line and builds its fixtures from `parseFen` + `legalMoves` + `makeMove` — the
independent-oracle move `src/history.test.ts` already makes — rather than from `newGame` / `playMove`.
The one deliberate exception is `src/status-panel.nfr.test.ts`, which imports those functions AT
RUNTIME for the sole purpose of asserting the panel calls them **zero** times. Recorded here so the
Security/NFR gate's `grep` meets it as a decision rather than as a surprise.
