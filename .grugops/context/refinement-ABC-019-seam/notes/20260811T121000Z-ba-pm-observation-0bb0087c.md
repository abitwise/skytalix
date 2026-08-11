---
id: 20260811T121000Z-ba-pm-observation-0bb0087c
kind: observation
by: ba-pm
at: 2026-08-11T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-016
  - ABC-021
  - ADR-0009
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# The SIX defects the review did not name, found by checking the other sixteen criteria

> **Hand-authored** — see the `decision` note of this hop for why (`scripts/context-io.ts` absent,
> `mcp__grugops__propose_note` unavailable). **Nothing here is a `finding`.**

**Three known defects was not evidence the other sixteen were sound.** It was not. Six more were found
by reading every criterion against the delivered build and against merged `src/`. **None of them
changes the code.**

## 1. `A2`'s cadence formula OVER-COUNTS on every run that ends at end-of-input. `[D29]`

The formula read **`1 + plies + non-advancing prompt outcomes`**. `## Problem` calls out *"the four
ways a prompt returns without advancing a ply"*, and the transition table sends **7, 8, 9** to
`rendering` and **10 (EOF)** to `exiting`. **Four outcomes are non-advancing; only three emit a
frame.**

Checked against the ticket's own `## Test notes` table and the delivered suite:

| row | script | actual frames | old formula predicts |
|---|---|---|---|
| 11 — EOF | `[]` | **1** | 2 |
| 8 — rejected | `["zzzz"]` | **2** | 3 |
| 9 — ambiguous | `["e7e8"]` | **2** | 3 |
| 10 — `board` | `["board"]` | **2** | 3 |
| 6 — third repetition, play on | `cycles(2)` | **9** | 10 |

**Five of the thirteen rows disagreed with the sentence that is supposed to generate them**, and the
table was green only because its counts were written from runs rather than from the formula.

**This is not bookkeeping. The old formula is SATISFIED by a build that emits a frame on
end-of-input, and `A8` does not forbid one** — so the ticket admitted a build its own state machine
forbids. Corrected formula: **`1 + plies + RE-EMITTING non-advancing outcomes`** (exactly `rejected`,
`ambiguous`, the non-mutating command), with an explicit negative clause that **end-of-input adds no
frame**, and the same for a prompt-driven `game-over`.

## 2. The glyph mode is NOT a loop parameter — clause 9 had already made it impossible. `[D30]`

`## Scope` read *"`--ascii` / `--unicode` and the human's colour are parameters"*. Under `ADR-0009`
clause 9b frame composition lives **entirely behind the render seam**, and `## Out of scope` says the
loop composes no frame — so the only consumer of the mode is `assembleFrame(parts, mode)`, on the far
side of the seam. **A `mode` parameter the loop never reads is dead code the day it is written**
(coding rules 5 and 7), and passing it through would make the seam five arguments to carry a value
neither the loop nor the panels use.

**Why this survived two refinements: it is the one `## Scope` sentence with no acceptance criterion
under it.** The half that binds — *"the loop discovers neither and defaults neither"* — is unchanged
and is now stated as the assertion it always was. The delivered build is already right (it reads no
`process.env` and no `process.stdout`, and has no `mode` parameter).

## 3. The `NFR-002` per-ply derivation is missing `A10`'s `legalMoves` term. NO BAR MOVES. `[D36]`

The derivation read *"one `repetitionCounts` + one `gameStatus` + one `playMove`"* and omits the
`legalMoves(history.position)` call **`A10`'s legality check forces on every engine ply**. The
engineer's out-of-tree marginal readings are **27.23 / 58.79 / 112.86 µs** at 40 / 120 / 300 plies
against this ticket's one-derive-per-ply figures of 20.71 / 48.34 / 96.88 — a gap of roughly
**6.5 / 10.5 / 16 µs**, about half a ply's worth amortised, **with that missing term as its named
cause.**

**No bar moves and none is proposed.** The marginal readings are **0.61x / 0.59x / 0.56x** of
`≤ 45 / ≤ 100 / ≤ 200`. What was wrong is the derivation's completeness, not its conclusion.
`MET`/`MISS` is Security/NFR's at the gate.

## 4 and 5. `A12` and `A17` are met in FULL, not "in part" — the criteria were under-specified, not the build. `[D33]`, `[D34]`

The build honestly reported both as met in part. Ruling: **the shortfall was in the criteria's
wording, and both are met in full.**

- **`A12`.** All five automatic fixtures RUN and each stops with its own reason and that reason only
  (exact-object assertions on rows 1–5). The separate assertion reads the **table's declarations** —
  which is precisely what `[D25]` asked for (*"a table whose rows are not enumerated can be one row
  short and still green"*) — and the criterion never said so, so a correct build could only hedge.
  **It is not a tautology:** delete row 5 and it fails. The enumeration guard is now a stated clause.
- **`A17`.** Its timing half **cannot** be asserted in the suite, and that is correct rather than a
  gap: the criterion names an out-of-tree instrument (own process, discarded warm-up, rotated cell
  order, medians of per-round means, recorded with its machine), and **a number produced inside
  `vitest` would be a different measurement wearing that one's name.** Merged
  `src/gameend.nfr.test.ts:16-17` states the same rule for its own bars — *"wall-clock cost is not
  asserted anywhere in this suite"* — and `src/turn-loop.nfr.test.ts:11-15` follows it. The criterion
  now says **where each half is asserted**: `A3b`'s counts in the lane at all three ply counts, the
  timing out of tree as evidence for Security/NFR. **No bar moves. `MET`/`MISS` stays Security/NFR's.**

Left alone deliberately: leaving these as "met in part" would hand QE and every later hop a permanent
phantom debt against a build that owes nothing.

## 6. `## Test notes` row 3's obvious fixture is a TRAP, and the test note now says so. `[D35]`

The build flagged it; **re-verified at source here rather than transcribed.** The obvious line is
*"White captures the last black piece, leaving K vs K"* — but the position **before** the capture is
then K+N vs K, which is **already** a dead position: `isInsufficientMaterial` returns true at
`minors <= 1` (`src/gameend.ts:98-119`, read at source; one knight is one minor). The loop correctly
stops on the **initial** evaluation, renders **one** frame, and **the ply is never played** — a row
that passes its reason assertion while testing nothing.

Give Black **two** knights (the delivered fixture is `1k6/8/8/8/8/8/1K6/2n4n w - - 0 1`) so the capture
is the ply that makes the position dead. **The frame count is the clause that tells the two apart — 2,
not 1.** This is a trap *under* the ticket rather than a defect *in* it, and it is now written down.

**It is also the fixture that makes ruling 2's `+ 1` load-bearing:** a loop that skips the initial
evaluation never sees an already-dead starting position.

## The gate, re-verified independently rather than taken on report

Re-run by me in this worktree, not transcribed from the Orchestrator's note:

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit **0** |
| typecheck | `npm run typecheck` | exit **0** |
| build | `npm run build` | exit **0** |
| unit | `npm test` | **715 / 715 on 24 files** |
| skip count | `AGENTS.md` § Test integrity (`vitest --reporter=json` \| `jq`) | **0** |
| sync | `git rev-list --left-right --count main...HEAD` | **0 behind**, 2 ahead |

## Carried flags — CHECKED OFF or RESTATED, not left to decay

- **`ABC-021` — RESTATED, still owed, and cheaper now than when it was raised.** Verified at source:
  the ticket is still `status: backlog` / `column: Backlog`; `## Scope:67` still reads *"A fifth prompt
  outcome, `claim`, alongside `ABC-019`'s four non-advancing outcomes"* and its size rationale`:192`
  still reads *"One new prompt outcome, **one terminal transition**"*. **Those sentences are not wrong
  under the settled split** — `ABC-021` owns transition 16, `ABC-019` owns only that `game-over` is
  reachable from `awaiting-human` at all — **but `ABC-021` never says so in its own words, so a reader
  of that ticket alone cannot tell which of the two owns the transition it names.** What is owed: one
  sentence recording the split, and an acceptance criterion for transition 16. **Read only; nothing in
  `ABC-021` was edited.** It is in `Backlog`, so the fix costs nothing today.
- **`ABC-016` — the dependency is now cited BY CLAUSE CONTENT, not only by criterion number. `[D37]`**
  `ABC-019` cited `ABC-016`'s `A13` by number in three places. A concurrent BA/PM hop
  (`refinement-ABC-016-a13`) is ruling on that criterion because its `isInCheck` / `toSan` call-count
  clauses are reported unsatisfiable. **The clause `ABC-019` depends on is a different clause of the
  same criterion** — the four derive spies at 0 — and nothing in the other hop's brief touches it, but
  `A13` may be split or renumbered. The citation now names the content and gives the number as a
  locator. **Nothing in `ABC-016` was read for a ruling, inferred, or edited by this hop, and no
  message passed between the two hops: the on-disk context was the only channel.** Flagged for the
  Orchestrator to re-check after both hops land.
- **`plans/nfr-catalog.md`'s `NFR-002` row — already DISCHARGED** by Architect/Design at
  `design-stub-seam-and-nfr002`. Not re-opened here.
- **`ADR-0009` clause 9e's wording — RESTATED, unchanged.** Not re-verified at this hop and not claimed
  to be.
- **The duplicate `## Test notes` bullet — still flagged, still NOT deleted** (coding rule 12). *"Do not
  test the real engine's timing here"* appears twice. It predates every recent hop and removing it is
  an unrelated edit.

## What this hop did NOT do

- **No byte under `src/` was written.** `A9b`'s handler is the Engineer's.
- **`plans/board.md` was not opened.** The move is requested, not taken.
- **`memory-bank/50-decisions/` was not edited**, and `ADR-0009` was not re-opened. The follow-up this
  hop decided IS owed is flagged for the Orchestrator to route.
- **`plans/tickets/ABC-016-status-panel.md` was not touched** — it was read, once, to confirm which
  clause of `A13` this ticket depends on.
- **The ticket's front matter was left at `in-review`**, on the delivering engineer's own precedent:
  the board is the authority, and moving the ticket first would put the two out of step.
- Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.
