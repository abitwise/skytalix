---
id: 20260812T101000Z-qe-e2e-observation-criteria-gaps-3d81f6a4
kind: observation
by: qe-e2e
at: 2026-08-12T10:10:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-017-qe
  - ABC-017
  - ABC-019
  - EPIC-002
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history-pane.ts
  - src/history-pane.test.ts
supersedes:
---

# FIVE CRITERIA GAPS — for BA/PM, not the Engineer. Zero CODE defects found.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> Reported separately from code defects as the brief requires. **Every one of these is a gap in
> what the ticket ASKS FOR, not in what the Engineer BUILT.** I found **no defect in
> `src/history-pane.ts`** — the delivered pane is correct on every input I could construct,
> including the three the criteria never reach.

## G1 ⭐ — no criterion combines a BLACK-TO-MOVE anchor with a game long enough for the window to SLIDE

**The gap.** `A6` is the only criterion that states a black-to-move anchor and its history is
**five plies** — three rows, in a pane of eight, so the window never slides. `A1`'s ten lengths
(0, 1, 3, 19, 20, 40, 80, 120, 300, 2,000) are **all** anchored at the white-to-move start FEN.
`A2`'s wide-cell case is a black anchor of **one** ply. So the pane's leading-half-row correction —
the `+ leadingHalfRow` / `- leadingHalfRow` terms in `firstVisiblePly` — is **exercised by nothing
where it can matter**, because both terms are no-ops until `rowsInGame` exceeds `HISTORY_ROWS`.

**What passes.** Three wrong builds, all 734/734 and all 740/740 on the merged tree. One of them
(`WLEAD-A`) **returns nine rows**; another (`WLEAD-B`) puts a phantom empty white cell at the top of
every slid black-anchored pane.

**Why it matters beyond this ticket.** A nine-row pane breaks the frame's height contract, which is
the entire point of `ABC-017`, and `A13` cannot see it — `A13` composes the exported **constant**,
never the pane's output. `ABC-019`'s clause-9 session-height assertion would be the first thing to
fire, at runtime, in the consumer's suite, naming the wrong subsystem.

**Reachability, checked rather than assumed.** `EPIC-006` owns startup and supplies the anchor;
`parseFen` accepts a black-to-move FEN and any `fullmoveNumber >= 1` — the ticket's own `## Scope`
says so, and `D5` was raised precisely because that path is real. A loaded black-to-move position
plus nine moves reaches this state.

**The cheapest shape that closes it** (BA/PM's call, not mine): one more row in `A6`'s anchor table
— the black-to-move anchor with a history long enough to slide — asserting the row COUNT, the eight
move numbers, and that the first row's white cell is **not** empty. That is one fixture and three
assertions; it kills all three survivors.

## G2 ⭐ — nothing requires the caller to still be USABLE after a render, or the pane to be FRESH

**The gap.** `A9` is the criterion that owns non-mutation and it is a **before/after snapshot of two
scalars**. Nothing in the ticket ever *uses* a `GameHistory` after rendering it. Two consequences,
both measured:

- `WFREEZE` — the pane freezes the caller's `moves` array. `A9`'s two clauses are satisfied exactly
  (position unchanged, length unchanged) and the caller can never play another move. **SURVIVED.**
- `WSPLICE` — the pane splices the caller's array and restores it. **SURVIVED**, and it is the
  build the ticket believes `A11` catches: `A11` spies `takeBack` / `playMove`, and raw array ops
  are neither.
- `WCACHE` — a memoising pane. **Killed only by fixture sharing in `A11`'s file**; give `A11` the
  per-test fixtures D23 just gave `A9` and it survives 734/734. Measured both ways, with a green
  control.

**The freshness half is the one with a live consumer.** `playMove` mutates the `GameHistory` in
place (`src/history.ts:85-88`), so `ABC-019`'s loop hands the **same object** to `renderHistory`
every frame. A cached pane shows move 1 forever. `A9` requires **determinism**, which a cache
satisfies perfectly; **freshness is a different property and no criterion states it.**

**The tension is worth writing down on the ticket even if no criterion changes**: the D23 remedy
(build fixtures inside the criterion) and the only existing catcher for a caching pane (fixtures
shared across tests) point in opposite directions, and the next person to tidy `A11` will remove a
guard without knowing it.

## G3 — `A9` names two of `GameHistory`'s three fields

`GameHistory` is `{ initialFen, moves, position }`. `A9` snapshots `toFen(history.position)` and
`history.moves.length`. **`initialFen` is unguarded** — `WFENSET` rewrites the caller's anchor on
every render and **SURVIVED**. It is also the field this pane's correctness rests on: `A6`, `D4` and
`D5` are all about the anchor. `moves`'s *contents* are likewise unguarded (only its length is
read), which is what `WSPLICE` walks through.

## G4 — `A11`'s clause says "zero runtime importers"; the guard implements "zero static value importers"

**Confirming BA/PM's measurement independently on delivered code, and adding one they did not
have.** `WDYNIMP` (`void import("./history.ts")`) **SURVIVED** — exactly as recorded.
`WBAREIMP` (a bare `import "./history.ts";`) **also SURVIVED**, and that one is **not on the
record**: the guard's regex requires a `from` clause. Both are genuine runtime pulls.

Checked and HEALTHY in the same regex, recorded so it is not re-swept: multi-line `import { … }`
blocks and `import * as ns from …` **are** matched.

**I agree with BA/PM that the criterion is right and should not change.** The gap is in the guard's
reach and the realistic regression is caught. Named so the choice is deliberate.

## G5 — `A2`'s width clauses cannot fail a build that changes the width

Documented by BA/PM as an exposure; my measurement **narrows the recorded catcher**. Detail in the
record-corrections note. **No criterion proposed, `HISTORY_COLS` not proposed for widening, and
`A2` not proposed for edit** — the restraint is cross-ticket and belongs to `ABC-027`, exactly as
ruled.

## What I checked and found HEALTHY, so it is not re-swept

- **The delivered pane is correct on every black-anchored length I probed** (15, 16, 17, 30, 31, 40,
  41, 100, 101 plies): eight rows, white plies in white cells, consecutive numbers, leading
  half-row present at 15 and correctly **absent** once the window slides. G1 is a gap in the
  criteria, not a bug.
- **D23 is genuinely closed.** `WPOS` — the survivor that passed 732/732 with zero catchers — now
  dies on exactly one test, `A9 — neither render touches the caller's position or its move count`,
  and `W9ONCE` dies on nine. Re-run, not inherited.
- **`A2`'s wide-cell test earns its place twice over.** It is the sole catcher for `WALIAS` (a
  shared module-level rows buffer) and one of two for `W2-index`.
- **`A4`'s positional clauses, `A5`, `A8`'s `every(isBlank)`** — all confirmed live by the kills.
- **The `A1` split works**: `WROWS9` fails both `A1` tests and `A13`'s `= 23`, three independent
  diagnoses.
- **`A10`, `A7`, `A3`'s sixteen-cell read** — all live; `WNOPARSE`, `WWINDOW7` and `WPOP` die on
  them.
