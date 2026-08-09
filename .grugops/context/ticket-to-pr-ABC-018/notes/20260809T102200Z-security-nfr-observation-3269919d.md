---
id: 20260809T102200Z-security-nfr-observation-3269919d
kind: observation
by: security-nfr
at: 2026-08-09T10:22:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-013
  - ABC-016
  - ABC-017
  - EPIC-003
  - EPIC-006
  - NFR-002
  - NFR-007
  - src/frame.ts
  - src/render.ts
  - plans/nfr-catalog.md
  - 20260809T090700Z-software-engineer-observation-6b72e200
  - 20260809T094500Z-qe-e2e-observation-f4e30dbc
supersedes: 
---

# `NFR-002` — both halves re-derived on this gate's own instruments, and the write half's `UNKNOWN - verify` discharged

The Engineer measured; **QE explicitly declined to re-derive and said so**. A number this gate did
not produce is not a number this gate may report as gated, so every figure below was produced here.
The Engineer's note was read only so this gate could say where it agrees and where it does not.

## The instrument

Own harness **outside the repository**, in **its own process**, importing the branch tip's `src/`
directly. Hoisted **out of every timed region**: the game replay, `parseFen`, the stub panels, and —
added here — **the writer itself**, because `beginFrameSession` reads the sink's signals and picks a
strategy once at startup, so building it per iteration would price the session rather than the write.
A **discarded warm-up round**, **11 rounds** per cell, **2,000 iterations** per cell per round,
**cell order rotated every round**, **medians of per-round means**, a **checksum** so nothing can be
optimised away, and **two fully independent samples** (two separate process runs; both quoted below,
never averaged into one).

**Machine: Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. `UNKNOWN - verify` on any
other hardware.**

**Denominator, re-derived rather than copied: a 23-row frame at `W = 18`, 418 characters serialized
— 419 characters and 483 BYTES on the wire in unicode mode, 419 bytes in ASCII mode, 425 characters
in place.** The **byte** figure is new. A character count is not a wire cost when the glyphs are
three bytes each, and every earlier note on this row quoted characters only. The ply counts are real:
a legal knight shuffle played to exactly 40, 120 and 300 plies, so the history region's content and
the position are those of a game of that length.

## The figures — both samples, every cell

| Cell | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| **(a) COMPUTE** — `renderBoard` + `assembleFrame` | **5.998 / 6.031 µs** | **5.978 / 6.015 µs** | **6.137 / 6.046 µs** |
| **(b) WRITE** — serialize into an in-memory sink | **0.638 / 0.644 µs** | **0.636 / 0.635 µs** | **0.648 / 0.644 µs** |
| **(b) WRITE** — `fs.writeSync` to `/dev/null` | **1.670 / 1.666 µs** | **1.660 / 1.650 µs** | **1.674 / 1.672 µs** |
| **(b) WRITE** — `fs.writeSync` to a regular file | **2.733 / 2.772 µs** | **2.714 / 2.733 µs** | **2.711 / 2.768 µs** |
| **(b) WRITE** — `fs.writeSync` to a FIFO with a live `cat` reader | **2.317 / 2.294 µs** | **2.285 / 2.285 µs** | **2.302 µs** |

**THE BAR IS THE SUM AND IT IS MET AT EVERY PLY COUNT ON EVERY DEFINITION: 0.0087–0.0088 ms on the
reading the catalog row now carries, against 16 ms — 0.055% of the budget, about 1,800x headroom.**
The in-memory floor reads 0.0066–0.0068 ms. **Both halves are FLAT across 40 / 120 / 300 plies**,
which is this row's own `O(window)` claim measured at the three ply counts the 2026-07-30 correction
mandates rather than inferred from two.

## THE ENGINEER'S ROUTED QUESTION — which "write" the row means — RULED HERE

Their note said, honestly: *"the gate should re-derive whichever it considers the row's definition;
this note does not pick one and hide the others."* The row reads *"the same frame **serialized and
written to a non-TTY sink**"*.

**RULED: the row's quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`, and the bar
is judged against the MOST EXPENSIVE HONEST READING — the regular file.** The reasoning, so a later
reader does not have to guess:

- **In-memory (0.635–0.648 µs) is a FLOOR, not the row.** It omits the syscall the row's own words
  require. It is worth keeping because it isolates serialization, and because it is the only cell
  that is purely this module's code.
- **`/dev/null` (1.650–1.674 µs) is a real `write(2)` that reaches no storage.** It prices the
  syscall and nothing beyond it.
- **A regular file (2.711–2.772 µs) is the figure the row carries.** It is the most expensive honest
  reading, it is reproducible, and it is a property of this code plus the system rather than of a
  peer process.
- **A FIFO with a live reader (2.285–2.317 µs) is `EPIC-006`'s pipe shape**, and it is recorded
  **beside** the row rather than as it: a pipe write's cost includes the **reader's** scheduling, so
  it is a property of the pair, not of this module. It is quoted because `EPIC-006`'s end-to-end test
  runs in exactly that shape, and because it is a number the Engineer did not produce.

## WHERE THIS GATE DIFFERS FROM THE ENGINEER, STATED RATHER THAN SMOOTHED

- **Compute reproduces.** Their 5.97–6.07 µs against this gate's 5.978–6.137 µs: the two sets
  overlap at every ply count.
- **The in-memory sink reproduces** (0.64–0.65 against 0.635–0.648 µs) and **`/dev/null` reproduces**
  (1.66–1.67 against 1.650–1.674 µs).
- **The regular-file cell does NOT.** They read **2.43–2.48 µs**; this gate reads **2.711–2.772 µs**
  — about **11% higher**, and **this gate CANNOT attribute it**: their note does not record the file
  target or the filesystem in enough detail to reproduce, and this gate's file was opened under
  `TMPDIR`. Both are more than 1,800x under the bar, so it moves nothing — but a difference this gate
  cannot explain is reported as one.
- **QE's coarse sanity check is treated as what QE labelled it.** Their 0.0071 ms single-sample
  figure is not quoted here as a measurement and was not used.

## THE IN-PLACE PATH, WHICH THE ENGINEER RECORDED AS NOT TIMED, IS NOW TIMED

Same protocol, its own two samples, both writers pointed at the same `/dev/null` fd so only the
emitted bytes differ:

| | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| in place (425 characters) | 1.674 / 1.661 µs | 1.669 / 1.650 µs | 1.690 / 1.677 µs |
| append (419 characters) | 1.655 / 1.643 µs | 1.650 / 1.643 µs | 1.671 / 1.660 µs |

**The 7 extra characters of cursor-home and erase cost less than this instrument can resolve** — the
delta sits inside the cell-to-cell spread. So half of the Engineer's third limit is closed and half
is not: **what a real TERMINAL does with those two sequences is still `UNKNOWN - verify`**, is not
observable in-process, and is not claimed.

## THE LIMIT THAT MUST TRAVEL WITH THE COMPUTE HALF, CARRIED NOT DROPPED

**The compute half is a LOWER BOUND.** `ABC-016`'s status panel and `ABC-017`'s history pane do not
exist and entered as fixed-height stub arrays built **outside** the clock; `ABC-013`'s SAN derive —
the largest item known to be headed for this frame, and the thing wave 1 measured at 171–1,318 µs —
is not in it at all. What is measured is everything that is **built**.

## THE ONE WAY THIS BAR CAN BE BUSTED TODAY, MEASURED RATHER THAN LEFT AS A WORRY

`assembleFrame` places **no bound on a supplied item's length**, and `layoutMessageRegion`'s search
is **quadratic in the item count**. Measured **COLD — first frame, own process** — because a frame is
assembled once per ply, not in a hot loop:

| one supplied item | cold, three independent processes |
|---|---|
| a short message | 0.16 / 0.17 / 0.20 ms |
| 10,000 characters | 0.54 / 0.56 / 0.57 ms |
| 100,000 characters | 3.62 / 3.88 / 4.28 ms |
| **400,000 characters** | **15.81 / 14.14 / 15.47 ms — the WHOLE 16 ms budget** |
| **1,000,000 characters** | **32.70 / 41.86 / 28.41 ms — 1.8x–2.6x OVER** |

Item **count** (warm median of 9, which is the right instrument for a count sweep because the cost
is in-loop): 218 items → 0.127 ms, 1,000 → 0.409, 4,000 → 2.439, 8,000 → 6.720, **12,000 → 14.246**,
16,000 → 22.118. **The crossing is about 13,000 items.** An ambiguity list is bounded by the ~218
legal moves of a position, so the count half is not the exposure; **the length half is**, because
`EPIC-003`'s rejection text quotes back what the player typed and a terminal paste is a single line
of arbitrary length.

**INSTRUMENT-LIMIT CORRECTION, the ninth on this project's record.** The warm median-of-9 instrument
reads **2.985 ms at 400,000 characters and 6.801 ms at 1,000,000** — about **5x lower** than the cold
reading — and it is the **wrong instrument for this question**. No number is claimed from it. The
first single-sample cold reading (40.9 ms at 1,000,000) is also not claimed on its own; the three
independent cold processes are.

**No bound is asked for on `ABC-018`.** Nothing supplies this input until `EPIC-003`, truncating an
item is exactly what the ticket's *"whole or not at all"* rule forbids, and inventing a limit here is
the unrequested flexibility `AGENTS.md` rule 7 forbids. The **number** is handed forward so that
ticket has a bar rather than a feeling.

## `NFR-007`'s single-write clause, verified rather than read

*"Nothing here may block on I/O beyond the single write."* Counted on this gate's own sink across the
security campaign: **84 frames, 84 `write` calls — exactly one per frame**, in both strategies and
both glyph modes.

## What this note does and does not do

It **discharges** `plans/nfr-catalog.md`'s `NFR-002` write half — the catalog row is edited by this
gate, and no target moved. It does **not** touch the bounded-pane compute (`ABC-017`, gated on
`ABC-013`/`ADR-0004`) or the status-panel compute (`ABC-016`), both of which remain unmeasured.
**No wall-clock assertion was added to the suite** — `src/zobrist.nfr.test.ts:112` states this
project's reason in place, and the microseconds live in the catalog with their machine.
