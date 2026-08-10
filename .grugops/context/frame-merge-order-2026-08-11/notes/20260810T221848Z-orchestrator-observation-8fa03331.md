---
id: 20260810T221848Z-orchestrator-observation-8fa03331
kind: observation
by: orchestrator
at: 2026-08-10T22:18:48Z
verified_by:
confidence: high
refs:
  - src/frame.test.ts
  - ADR-0009
  - ABC-016
  - ABC-017
  - plans/board.md
supersedes:
---

# CORRECTION — the Orchestrator over-claimed the tautology, having read the lines and still under-read them

Does not supersede `20260810T214235Z-orchestrator-decision-ea14a979`; it corrects ONE sentence in it and
the matching sentence in the board header committed at `55d9ef6`. Recorded as a separate `observation`
rather than a supersession because the decision's substance — the merge order, the branch shape, the
owner directive — is unaffected, and a supersession would fold the whole note out of replay for a
single-clause error. (The earlier chain error, where prose-scoped supersession silently deleted content,
is recorded in `ea14a979` itself.)

## What the Orchestrator wrote

In `ea14a979`: *"asserts the composition identity at `:632` from three local literals … It is arithmetic
on literals and **never reads what the panels ship**, so it **cannot fail on a panel that changes its row
count** — the Architect's 'tautology' characterisation is correct as measured."*

And in the board header at `55d9ef6`: *"the composition identity already exists in merged
`src/frame.test.ts:632` — as a TAUTOLOGY over three local literals that **cannot fail on a panel that
changes its row count**."*

## What is actually true

The test `it("derives H from the panels' constant heights …")` has **three** assertions, not one:

- `:633` — `frameHeight({ board: BOARD_ROWS, status: STATUS_ROWS, history: HISTORY_ROWS })` → `23`.
  All three terms are locals declared at `:37-43`. **A tautology. The Orchestrator's claim holds here.**
- `:634` — `frameHeight({ board: 9, status: 4, history: 8 })` → `24`. Literals. Also a tautology.
- `:635-637` — `assembleFrame(partsFor(playTo(4), { status: [4 rows] }), "unicode")` → length `24`.
  **Not a tautology.** `partsFor` (`:119-127`) sets `board: renderBoard(game.position, …)` — the REAL
  `renderBoard`. This assertion exercises delivered board geometry.

**So the claim is true of the first assertion and FALSE of the test.** The test does fail a panel that
changes its row count, when that panel is the board: it catches M4 (board ships 10) and M5 (board 10 +
history 9). It passes M3 (history ships 10) because `partsFor`'s `history` term is `historyStub`, a
test-local stub — and M3 is a `4b`-breaker.

BA/PM found this at `repair-panel-tickets` and is right. The Orchestrator verified independently and
still got it wrong: it ran `sed -n '630,640p'`, **had the `assembleFrame` line on screen**, and reported
the test as literals-only anyway — carrying forward the Architect's compressed "passes all six" instead
of reading what it had just printed. The failure was not a missing check; it was reading the output to
confirm an expectation. Worse than the `ABC-009` class it resembles, because the evidence was already in
hand.

## What the corrected position is, and what it does NOT change

`ADR-0009`'s ruling stands: the producer owns its count, the `frameHeight(...)` clause comes out of both
`A1` and `A11`, and the composition identity gets one home in `src/frame.test.ts` read from delivered
geometry. **The reason it is needed is narrower than recorded and still sufficient** — the merged test's
hole is M3 rather than all six, and M3 alone kills epic `4b`. `ADR-0009`'s own table carries the same
error in one cell pair, flagged for Architect/Design by BA/PM and not edited by either.

The board header is corrected in the same commit as this note.

## Second correction, from the same hop — item 2 was not fully satisfiable

The Orchestrator's wave-2 instruction told BA/PM to repair `A11` so it "can fail on the cases it exists
to catch." **That was not achievable on `ABC-016` and BA/PM was right to refuse it.** M3 and M5 both move
`history`, a term `ADR-0009` cl. 2 forbids `A11` from naming and which `ABC-016` cannot read because it
merges first; the shadow form that could read it passes all six (rejected by measurement as Alternative
B). BA/PM narrowed `A11` to the truth — it protects `4b` against **this panel's own** count only — and
retracted `D8`'s wider claim in writing. That is the honest outcome and it is accepted.

Consequence the Orchestrator carries: **`4b`'s cross-panel guard now lives on `ABC-017`, a `P2` that
describes itself as the first thing to drop.** If `ABC-017` is dropped or resequenced, the guard needs a
new home. Recorded as a live re-homing trigger, not a resolved item.
