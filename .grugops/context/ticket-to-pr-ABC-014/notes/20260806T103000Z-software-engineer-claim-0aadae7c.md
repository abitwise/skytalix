---
id: 20260806T103000Z-software-engineer-claim-0aadae7c
kind: claim
by: software-engineer
at: 2026-08-06T10:30:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - NFR-002
  - EPIC-002
  - plans/nfr-catalog.md
  - src/render.ts
supersedes: 
---

# NFR-002's board-frame bar: MET at 2.070 µs against 500 µs, with its machine

**Recorded as a `claim`, not a `finding`, on purpose.** There is no §14 gate in this install to
issue a `§14-gate#<id>` stamp, and no role may self-stamp. Security/NFR re-measures independently at
its gate and its verdict is the one that counts; this is the Engineer's figure, honestly labelled.
Confidence is `high` for **this machine** and `UNKNOWN - verify` for any other.

## The bar

`ABC-014` `## Security / NFR triggers`: **board-frame compute ≤ 500 µs per frame**, 3% of
`NFR-002`'s 16 ms budget, **measured over the standing perft FENs and recorded with its machine**,
per the convention in `plans/nfr-catalog.md`.

## The result

**Worst cell across two independent samples: 2.070 µs per frame. Bar 500 µs. MET, with ~242x
headroom.**

| | worst | best |
|---|---|---|
| unicode | 2.070 µs | 1.418 µs |
| ascii | 1.129 µs | 0.950 µs |

All 24 cells of (6 standing perft FENs × 2 glyph modes × 2 orientations) are under 2.1 µs. The two
samples agree cell by cell to within ~3%.

Unicode costs roughly **2x** ASCII. That is the multi-byte glyph concatenation and it is not a
problem at this magnitude — it is recorded because it is the only structure visible in the numbers
and because a later change that closes the gap should not be mistaken for a regression in ASCII.

## The machine — the figure is meaningless without it

**Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64.** `UNKNOWN - verify` on any other
hardware.

## The method

Out of tree, in its own process (the harness is throwaway and is not committed):

- 11 rounds plus a **discarded warm-up** round;
- **2,000 iterations** per timed region, `process.hrtime.bigint()` around the region;
- **cell order rotated every round**, so no cell always runs first;
- per-round **means**, then the **median** of those means per cell;
- the whole thing run **twice** as two independent samples;
- **`parseFen` OUTSIDE the timed region** — the bar is the frame compute, not the parse;
- a checksum accumulated from every frame so nothing could be optimised away.

## What this figure is NOT

- **It is not a frame measurement.** It is the BOARD half. `NFR-002`'s frame is board + labels +
  status panel + history pane, and the status panel (`ABC-016`) and history pane (`ABC-017`) are not
  in it.
- **It is not the write half.** `NFR-002`'s terminal-write half is still `UNKNOWN - verify` and is
  `ABC-018`'s to close. `plans/nfr-catalog.md` names that split; nothing here changes it.
- **It is not a ply-count curve.** This module's cost has no ply denominator at all — it reads 64
  board bytes and knows nothing about game length. The 40 / 120 / 300 ply counts the catalog
  requires on every re-measurement do not apply to this module and were not faked to look compliant.

The ticket's own calibration holds: wave 1 measured the SAN history derive at 171–176 µs for 40
plies and predicted a 64-iteration board scan would come in far under it. It did, by ~80x.

## No wall-clock assertion was added to the suite

This project's standing rule, kept by `ABC-011` and `ABC-012` before this. A machine-dependent
number does not belong in a test that runs on unknown hardware.

## `plans/nfr-catalog.md` was NOT edited

That file's rows are Architect/Design's and Security/NFR's. `NFR-002`'s row currently says the
compute half is unmeasured; it is owed the figure above. **Flagged here, not taken** — the same
division `ABC-011` and `ABC-012` kept.
