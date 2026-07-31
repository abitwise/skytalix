---
id: 20260730T213000Z-architect-design-decision-0e58477d
kind: decision
by: architect-design
at: 2026-07-30T21:30:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - NFR-002
  - ABC-013
  - ABC-014
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0002
  - ADR-0004
  - plans/nfr-catalog.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - 20260730T143000Z-architect-design-observation-57f6f356
  - 20260730T144200Z-architect-design-decision-63309fd4
  - 20260730T162500Z-ba-pm-decision-b7f20a56
supersedes: 
---

# NFR-002's denominator corrected — O(plies) → O(window). The 16 ms target is untouched, and the bounded pane's cost is `UNKNOWN - verify`

Subtask `architect-nfr002-refresh` of task `epic-to-tickets-EPIC-002`. BA/PM's blocker-2 ruling
(`…-ba-pm-decision-b7f20a56`, epic amendment `[A2]`) bounded the live SAN history pane and correctly
**flagged rather than edited** the `NFR-002` row, because that row is Architect/Design's. This note
records the fix. **Nothing was re-decided**: the bound is BA/PM's product call and it stands as made.

## What the row said, and what was actually invalid in it

The wave-1 row (`…-architect-design-observation-57f6f356` is where its numbers come from) said:

> *"The frame is a function of GAME LENGTH, not only of position — the history panel is O(plies) —
> so a frame measurement that does not state its ply count is not comparable to another one"*

and recorded the compute half as **171–176 / 517–533 / 1,272–1,318 µs** at 40 / 120 / 300 plies.

**Exactly one premise died: the panel renders every ply.** Under `[A2]` it renders the most recent
**8 move pairs = 16 plies**, blank-padded, at any game length. Everything else in the row was
unaffected and is kept: the target, what is in a frame, the compute/write split, the three ply
counts, and the measurement with its machine.

## The correction, in four parts

1. **`O(plies)` → `O(window)`** as the dominant term: a fixed 16 rendered plies.
2. **The ply count stays on every measurement anyway**, and this is the part the arithmetic in
   `[A2]` did not spell out. Two reasons. (i) `GameHistory` holds `initialFen` + `moves` + the live
   position and nothing else (seam 1, `…-architect-design-decision-d7a42f7a`), so there is no O(1)
   route to the position before ply *n−16*; the pane must replay to the window's first ply, which is
   `O(plies)` — one `parseFen` at 1.62 µs plus ~10 ns/ply, measured near-flat at **2.2–3.9 µs from
   40 to 300 plies**. Small, real, linear, and it never reaches zero. (ii) `O(window)` is now a
   **claim under test**; one measurement at one ply count cannot falsify it, and the 40/120/300
   comparison can. That is why `ABC-017`'s **ratio** bar (three figures within 2x) is the load-bearing
   half of its acceptance and the absolute is the machine-dependent half.
3. **The measured figures are retained and RELABELLED as history.** They measured the unbounded panel,
   which will not be built. They survive with two live jobs: an **upper bound** on any bounded pane,
   and the source of the per-item figures the ruling did not touch (`toSan` 4.31–4.45 µs unassisted,
   0.10–0.11 µs when handed a legal list; replay 2.2–3.9 µs).
4. **The write half is unchanged in status and improved in shape.** Still `UNKNOWN - verify`, still
   the half nobody has measured, still `ABC-018`'s — but `4a`'s constant frame height means it now
   has **no ply denominator at all**: one number per machine and sink, not a curve.

## What is marked `UNKNOWN - verify`, and why no number was invented

**The bounded pane's own compute.** BA/PM's ≈ 70 µs is arithmetic over wave 1's per-item figures and
is labelled as such in the epic and on `ABC-017` — *a target, not a result*. It is not promoted to a
measurement here. The row names what would close it: `ABC-017`'s cost test, which cannot run until
`ABC-013` ships `toSan`, which is blocked on `ADR-0004`'s ratification. Also open and unchanged:
board scan (`ABC-014`, ≤ 500 µs), status panel (`ABC-016`, ≤ 250 µs), frame assembly + write
(`ABC-018`), and any non-M3 machine.

**No harness was run, deliberately.** A run today would have had to re-implement the harness-only SAN
formatter wave 1 already wrote, and would then have measured the same superseded quantity — the
bounded pane depends on a `toSan` that is not yet permitted to exist. A smaller honest edit was the
better trade, and the numbers that would matter belong to the tickets that will own them.

## The boundary condition — the one thing that would void this correction

`gameStatus` fed by `repetitionCounts` is `O(plies)`: **46–50 µs @ 120, 97–102 µs @ 300**. After the
pane is bounded it is the **largest length-dependent quantity anywhere near this frame**, and the
`O(window)` statement is only true because the decomposition puts it in the **loop** (`ABC-019`) and
not in a frame — `ABC-016`'s panel calls `isInCheck` directly and reports check, not game over. The
wave-1 row listed `gameStatus` inside frame COMPUTE, which was defensible before the tickets existed
and is not now. **If any renderer computes repetition counts per frame, the frame is `O(plies)` again
and this row is wrong.** Written into the row rather than left implicit, because it is the single
change that would require a third rewrite.

## One thing recorded so it is not "optimized" later

The 40x cheaper `toSan(position, move, legal)` path does **not** help this pane: it has no legal list
in hand and would have to make the same `legalMoves` call to get one. ~70 µs is the honest price of
16 rendered plies, not a lazy implementation. Seam 3 put that parameter in the contract for
`EPIC-003`'s `moves` command, which *does* already hold the list.

## Scope held

**Only `plans/nfr-catalog.md` was edited** — the header provenance line, the `NFR-002` row, and the
`NFR-002` prose section (forward pointer + a `CORRECTED 2026-07-30` block in the same shape the file
already uses for NFR-005's withdrawn "~5x headroom"; the superseded text is kept as history, not
deleted). **No `src/`, no ticket, no board row, no traceability row, no ADR.** The `< 16 ms` target
is byte-identical to what EPIC-002 states.

## Confidence

**High on the correction**, which is a direct consequence of a ruling that is already made and of
measurements already reproduced twice. **High on the residual-replay and boundary-condition clauses**,
which are read off the seam-1 API and the ticket boundaries rather than estimated. **The bounded
pane's cost is not asserted at any confidence — it is `UNKNOWN - verify` and it has a named owner.**
