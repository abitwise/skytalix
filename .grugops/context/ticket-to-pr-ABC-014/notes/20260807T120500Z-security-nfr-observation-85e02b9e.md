---
id: 20260807T120500Z-security-nfr-observation-85e02b9e
kind: observation
by: security-nfr
at: 2026-08-07T12:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-016
  - ABC-017
  - ABC-018
  - NFR-002
  - plans/nfr-catalog.md
  - src/render.ts
  - src/perft.test.ts
  - 20260806T103000Z-software-engineer-claim-0aadae7c
supersedes: 
---

# NFR-002's board-frame bar RE-MEASURED on this gate's own harness: 2.092 / 2.056 µs against 500 µs

**The Engineer's figure was not inherited.** This board's standing practice is that this column
re-measures rather than carries a number forward, and the Engineer's own note asked for exactly that
(*"Security/NFR re-measures independently at its gate and its verdict is the one that counts"*). A
prior measurement in the context is a claim to be reproduced. It reproduced.

## The bar, read at the source

`ABC-014` `## Security / NFR triggers`: **board-frame compute ≤ 500 µs per frame**, 3% of
`NFR-002`'s 16 ms budget, measured over the standing perft FENs and **recorded with its machine**,
per the convention in `plans/nfr-catalog.md`.

## The result

| | worst | best |
|---|---|---|
| **sample 1** | **2.092 µs** | 0.955 µs |
| **sample 2** | **2.056 µs** | 0.980 µs |

**Bar 500 µs. MET at 0.0042x — about 240x headroom.** All 24 bar cells are under 2.1 µs. The two
samples agree to **1.7%** on the worst cell and select the **same** worst cell
(`kiwipete | unicode | black-bottom`) and the **same** best cell
(`position-3 | ascii | white-bottom`).

**The Engineer's 2.070 µs is BRACKETED by this gate's two samples.** That is the strongest thing a
re-measurement can say, and it is said that way rather than smoothed into a single agreed number.

## The machine — the figure is meaningless without it

**Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64.** `UNKNOWN - verify` on any other
hardware. Same machine as every prior measurement on this board, which is why the figures are
comparable and also why they are all one machine's.

## The method

Own harness, outside the repository, in its own process doing nothing else:

- **11 rounds plus a discarded warm-up round**;
- **2,000 iterations** per timed region, `process.hrtime.bigint()` around the region;
- **cell order rotated every round**, so no cell always runs first;
- per-round **means**, then the **median** of those means per cell;
- the whole thing run **twice, as two independent process invocations**;
- **`parseFen` OUTSIDE the timed region** — the bar is the frame compute, not the parse. This
  project has recorded **seven** instrument-limit corrections, most of them a parser or a generator
  left inside the clock, and the seventh produced a 2.08x FALSE MISS on `ABC-012`;
- a **checksum** accumulated from every frame so nothing could be optimised away.

**No null control by identity was carried, and that is a decision with a reason rather than an
omission.** The catalog's standing caution asks for one when measuring a *delta* between two trees.
This is an *absolute* against a bar 240x away; an identity twin would resolve nothing the reading
does not already settle by two orders of magnitude.

## THE BAR'S OWN POPULATION DOES NOT CONTAIN THIS MODULE'S WORST CASE

Stated rather than banked, because the bar names the standing perft FENs and those are all
FEN-legal positions. Two fences were measured — **they are fences, not the result**:

| population | worst | vs bar |
|---|---|---|
| **fully-occupied 64-piece board** — no empty-square short-circuit anywhere, and **unreachable through `parseFen`**, which requires one king per side | **2.322 / 2.342 µs** | 0.0047x |
| **empty board** — 64 short-circuits, zero glyph lookups; the true best case | 0.910 / 1.051 µs | 0.0021x |

So the module's true worst case is ~12% above its worst bar cell and still **0.47% of the bar**.

## The 40 / 120 / 300 ply counts DO NOT APPLY, and none was invented to look compliant

`plans/nfr-catalog.md` mandates those three ply counts on every `NFR-002` re-measurement. They do
not apply to this module, the absence is **structural**, and it was **measured rather than
assumed**: `renderBoard(position, mode, orientation)` takes a `Position`, which carries no move
list at all, and this gate verified that **castling, the en-passant square, both clocks and the side
to move influence ZERO frame bytes**. A frame is a pure projection of the 64 on-board squares and
has no game-length denominator to carry. The Engineer's framing of this was correct and is
confirmed independently, not repeated.

## Two structures in the numbers, one of them ATTRIBUTED rather than guessed at

- **Unicode costs 1.80–1.83x ASCII.** The Engineer said "roughly 2x". This gate reads slightly
  lower and says so rather than quoting the Engineer's ratio.
- **Black-bottom costs ~0.10–0.13 µs more than white-bottom on EVERY cell.** That is not noise, and
  it is not left as an unexplained pattern: measured in isolation, `src/render.ts:146`'s
  `[...FILE_LETTERS].reverse().join("")` on the black-bottom path costs **+0.112 µs/frame** against
  the bare constant — essentially the whole delta. It is **0.02% of the bar**, **no change is asked
  for** (AGENTS.md rules 5 and 10), and it is recorded only so a later reader does not mistake it
  for a regression.

## What this figure is NOT

- **It is not a frame measurement.** It is the BOARD half. `NFR-002`'s frame is board + labels +
  status panel + bounded history pane + message region; `ABC-016` and `ABC-017` are not in it.
- **It is not the write half.** `NFR-002`'s terminal-write half is still `UNKNOWN - verify`, is
  still the half nobody has measured, and is still `ABC-018`'s. Nothing here changes that split.
- **It is not a claim about any other machine.**

A board scan at ~2 µs is **0.013% of the 16 ms budget**. As on `NFR-003`, compute is not the risk
on this row — the unmeasured terminal-I/O half is.

## No wall-clock assertion was added to the suite

This project's standing rule, kept by `ABC-011`, `ABC-012` and the Engineer on this ticket before
this gate. A machine-dependent number does not belong in a test that runs on unknown hardware. The
microseconds live in `plans/nfr-catalog.md`, with their machine.
