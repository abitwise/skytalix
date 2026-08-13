---
id: 20260813T161000Z-ba-pm-observation-four-things-i-checked-that-did-not-survive-checking-6d2f8b41
kind: observation
by: ba-pm
at: 2026-08-13T16:10:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - ABC-019
  - ABC-029
  - ABC-041
  - ABC-042
  - ABC-046
  - ADR-0009
  - ADR-0011
  - src/glyph-mode.ts
  - src/turn-loop.ts
  - src/status-panel.ts
  - arch-audit-2026-08-12
supersedes:
---

# The brief said "check me". Four things did not survive checking — one in the audit's proposed rule, three in the merged contracts the tickets have to fit

> **Hand-authored, no stamp.** Every claim below is a `grep` or a read of merged source on this
> worktree's `HEAD` (`6375fae`), named with line numbers so it is re-checkable rather than trusted.
> **None of these is a defect in merged code.** Three are gaps between what a ticket would need and
> what exists; one is a wording problem in a rule that has not been written down anywhere binding yet.

## 1. The audit's one-sentence `process.stdout` rule is already false as literally worded

The architecture audit proposed *"the entry point is the only module that may name `process.stdout`"*
as the sentence that must survive decomposition. **Measured, `grep` over non-`.test.ts` files under
`src/`:**

```
src/glyph-mode.ts:117      isTTY: Boolean(process.stdout.isTTY),     <- executable
src/glyph-mode.ts:118      env: process.env,                          <- executable
src/frame.ts:21,25,209     comments only
src/render.ts:7            comment only
src/status-panel.ts:6      comment only
src/turn-loop.ts:151       comment only
```

**A criterion written from that sentence word for word would fail on green code.** The audit's own
body already says why — *"`glyph-mode.ts` is the only module that reads ambient terminal signals
(`isTTY`, `env`), and it reads them **once**, inside `beginGlyphModeSession`"* — so this is a wording
correction, not a disagreement, and the audit's ruling is adopted whole. The precise form, on
`ABC-042` as `A9`:

> **The entry point is the only module that may acquire `process.stdout` as a WRITABLE HANDLE, and it
> may only pass it as the injected `FrameSink`. `beginGlyphModeSession` is the one merged exception
> and it READS ambient signals once; no module below the entry point acquires an I/O handle or
> writes.**

**Why this mattered enough to write down:** this is exactly the criterion-gap class the delivery audit
measured — a criterion that is right in spirit, wrong against the built tree, and green on every
build that ignores it.

## 2. `quit` has no representable outcome in the merged loop, and `ABC-019` is `Done`

`PromptOutcome`'s terminal arm is `{ kind: "game-over"; result: FinalResult; reason: TerminalReason }`
and `FinalResult = Exclude<GameResult, "in-progress">` (`src/turn-loop.ts:57,132`) — **every
`game-over` carries a win or a draw.** Quitting is neither. The only no-result exit is
`{ kind: "eof" }`, and the loop answers it by writing `INPUT_ENDED_NOTICE`, the literal string
`"input ended"` (`src/turn-loop.ts:176,313`).

**So a player who types `quit` is told `input ended`, or is recorded as having lost, or the merged
loop gains an arm.** Three shapes, priced on `ABC-046`, **none adopted** — the product half (quitting
records no result) is mine and is ruled; the contract half is Architect/Design's. **This is the only
ticket in the epic blocked by a decision rather than an ordering.**

## 3. `new` leaves exactly one frame with a stale draw-claim cell, and it is structural

The reset is clean: `takeBack(history, history.moves.length)` replays from `initialFen`, so position,
Zobrist keys and repetition counts rewind **together** — `ADR-0002`'s contract, and the structural
answer to this epic's own stated `undo` risk.

The frame after it is not. `new` must return a non-advancing outcome, and **the loop deliberately does
not re-evaluate `GameStatus` on one**: transitions 7/8/9 return straight to `rendering`
(`src/turn-loop.ts:342-346`), because that is what makes `ABC-019`'s `A5`/`A6` *"not re-evaluated"* a
property of the machine rather than of a spy. `renderStatusPanel` reads side-to-move, move number,
check, material and last move **live** from `history.position`, and reads the draw-claim cell from the
passed `status` (`src/status-panel.ts:187-216`).

**Net: for exactly one frame after `new`, a reset board can display a draw claim from the game that
was just discarded.** Narrow, cosmetic, and unavoidable inside merged code — which is why it shares
`ABC-046`'s ruling with `quit`.

## 4. The frame-path probe's declared root list does not know about new frame producers

`ADR-0011` clause 2: the frame path is **DECLARED, not derived** — *"the composition is by injection,
so frame membership is not derivable from the module graph"* — and the declaration is the probe's own
enumeration of the five frame producers, at the probe's site in `src/history-pane.nfr.test.ts`.

**`ABC-041` is the first new frame producer since that declaration was written.** A producer nobody
declares is a producer the guard silently stops covering: the probe would keep passing, on a smaller
subject than the property. So `ABC-041` `A9` requires the root list to gain it **and** requires the
probe to be shown still armed (rooted at `turn-loop.ts` it must still report `history.ts`). It costs
one line and no new file. `ABC-044` carries the same statement in the other direction — the result
screen is **not** a frame producer and must **not** be added — so the count moves deliberately both
ways.

## What I checked that DID survive

- `EPIC-006` was genuinely undecomposed: **zero** ticket files carried `epic: EPIC-006` before this
  hop (`grep -l '^epic: EPIC-006' plans/tickets/*.md` — empty).
- **28 test files, 17 production modules** under `src/`, both counted. **816/816 was NOT re-run** —
  two other agents are live on this machine, the lane is contended, `ABC-026`'s restatement rule is
  *restate by arithmetic, never re-measure*, and this hop wrote no code. The figure is taken from
  `plans/board.md`'s `ABC-021` row.
- `EPIC-003`'s eight tickets: **7–8 new test files**, read off all eight `## Lane cost` sections
  (seven say "one"; `ABC-032` says "one expected; zero is achievable").
- `ABC-035`'s `## Out of scope` does hand `undo` / `resign` / `new` to this epic by name, tokens
  included — so `ABC-045`/`ABC-046` own the grammar as well as the effect.
- There is **no exported start-position constant** under `src/`: every test file defines its own
  `START_FEN`. The entry point must hold the literal, and promoting it is not `ABC-042`'s.

## One thing in the brief that is understated rather than wrong

The brief says `pool: "threads"` means *"the true headroom is somewhat better than `~7`"*. **The
record already publishes how much better and does not need re-deriving:** `plans/nfr-catalog.md`
item 8 states *"the planning number moves from ~7 to ~10, and the ceiling from ~16 to ~25"*. The
arithmetic note in this folder uses **~10 / ~25** and shows where both come from.
