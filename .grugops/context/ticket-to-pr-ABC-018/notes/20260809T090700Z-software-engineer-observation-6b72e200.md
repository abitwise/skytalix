---
id: 20260809T090700Z-software-engineer-observation-6b72e200
kind: observation
by: software-engineer
at: 2026-08-09T09:07:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-012
  - ABC-013
  - ABC-016
  - ABC-017
  - NFR-002
  - EPIC-002
  - src/frame.ts
  - plans/nfr-catalog.md
  - plans/traceability.md
  - 20260809T084800Z-ba-pm-claim-d45d16a4
supersedes: 
---

# `NFR-002` — both halves measured separately, with the machine and the ply count, and no number taken from any existing note

The catalog row calls the write half *"the half nobody has measured"*. It has now been measured. The
ticket forbids quoting any existing note's number for it, and none was: the 171–1,318 µs SAN-derive
figures on record are a **different measurement of a different quantity** and were not used, not
scaled, and not cited as a bound.

## The instrument

Own harness **outside the repository**, in **its own process**, importing merged `src/` directly. The
game replay, `parseFen` and the stub panel arrays are hoisted **out of every timed region** — that is
this catalog's own standing caution, the one that produced a **2.08x false miss** on `ABC-012` when a
generator call was left inside the clock. A **discarded warm-up round**, then **11 rounds** per cell,
**2,000 iterations** per cell per round, **cell order rotated every round**, **medians of per-round
means**, and **two fully independent samples** (two separate process runs; both are quoted below,
never averaged into one).

**Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. `UNKNOWN - verify` on any other
hardware.**

**Denominator, because a "frame took X ms" number without one is not comparable to the next: a
23-row, 18-column frame, 418 characters serialized**, assembled from the merged `renderBoard` plus
fixed-height stubs for the two unbuilt panels, with a one-item message region. The ply counts are
real: a legal game (a knight shuffle, legal at every ply and never ending) played to exactly 40, 120
and 300 plies, so the history region's content and the position are those of a game of that length.

## The figures — both samples, both halves, at each ply count

| Half | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| **(a) COMPUTE** — `renderBoard` + `assembleFrame` | **5.97 / 6.03 µs** | **6.02 / 6.07 µs** | **6.03 / 6.06 µs** |
| **(b) WRITE** — serialize into an in-memory sink | **0.64 / 0.64 µs** | **0.64 / 0.65 µs** | **0.65 / 0.65 µs** |
| **(b) WRITE** — `fs.writeSync` to `/dev/null` | **1.67 / 1.66 µs** | **1.66 / 1.66 µs** | **1.67 / 1.67 µs** |
| **(b) WRITE** — `fs.writeSync` to a regular file | **2.43 / 2.48 µs** | **2.44 / 2.46 µs** | **2.44 / 2.48 µs** |

**The bar is the SUM — the reading BA/PM's defect 4 corrected the criterion to — and it is MET at
every ply count: 0.0084–0.0092 ms worst case (compute + the file sink) against 16 ms.** About
**0.05%** of the budget, with four orders of magnitude of room.

**Both halves are flat across 40 / 120 / 300 plies**, which is the `O(window)` shape the catalog's
2026-07-30 correction asserts, measured at the three ply counts that correction mandates rather than
inferred from two. The frame's byte count does not depend on the ply count at all, which is exactly
what the correction predicted for the write half: *"a single number per machine and sink rather than
a curve."*

## Three limits travel with these figures and none may be dropped when they are quoted

1. **The compute half is a LOWER BOUND, not the frame's compute.** `ABC-016`'s status panel and
   `ABC-017`'s history pane do not exist and entered as fixed-height stub arrays built **outside** the
   clock; `ABC-013`'s SAN derive — the largest item known to be headed for this frame — is not in it
   at all. What is measured is everything that is BUILT: the merged board render plus this ticket's
   assembly, sanitizing and packing.
2. **"Write" was measured three ways, and all three are reported rather than the flattering one.**
   *"Serialized and written to a non-TTY sink"* honestly means three different things — the string
   build alone (0.64 µs), plus a syscall to `/dev/null` (1.66 µs), plus a syscall that reaches a
   filesystem (2.44 µs). The gate should re-derive whichever it considers the row's definition; this
   note does not pick one and hide the others.
3. **The in-place (TTY) path was NOT timed separately.** The bar names a non-TTY sink, the in-place
   emission differs only by 9 escape bytes, and what a real terminal does with those bytes is not
   observable in-process. Recorded as not measured rather than estimated.

## What this does NOT do

**It does not discharge `plans/nfr-catalog.md`'s row and this note does not edit it.** The catalog is
Architect/Security's and the Security/NFR gate owns the discharge — the same pattern `ABC-011`,
`ABC-012`, `ABC-014` and `ABC-015` all followed, where the gate re-derived the Engineer's numbers on
its own instruments rather than ratifying them. **No wall-clock assertion was added to the suite**:
`src/zobrist.nfr.test.ts:112` states this project's reason in place — such an assertion passes or
fails on the machine that runs it — and the microseconds live in the trace with their machine
instead.
