---
id: ABC-018
title: Frame output and redraw — in-place on a TTY, append otherwise, constant height
status: backlog
column: Backlog
size: S
priority: P0
epic: EPIC-002
feature: —
---

# ABC-018 — Frame output and redraw: in-place on a TTY, append otherwise, constant height

## Problem

*User*: the player watching the board update after every ply. If the previous frame's rows are
still on screen under the new one, the display is not a board, it is a mess — and the player cannot
tell which board is current.

*Pain*: nothing in this product writes to a terminal. Epic acceptance **#4** is entirely about this
step, and as originally written it presupposed in-place redraw while the epic's own scope contained
an unbounded, growing history pane — the two collided and the criterion became undefined above
roughly move 9.

*Value*: this is the ticket that makes the frame a *display* rather than a log, and it is the one
that finally measures `NFR-002`'s unmeasured half.

## Scope

**A writer that takes one assembled frame value and emits it**, choosing between two strategies
**once at startup** and never re-choosing:

- **In-place** — when stdout is a TTY **and** the TTY reports at least as many rows as the frame:
  return the cursor to the frame origin, write the frame, then **erase from the end of the new
  frame to the end of the screen in one operation**.
- **Append** — when stdout is **not** a TTY, **or** the TTY reports fewer rows than the frame:
  write the frame in full followed by a newline, emitting **no cursor-control sequence at all**.

**Frame assembly**: composes the board (`ABC-014`), status panel (`ABC-016`), move-history pane
(`ABC-017`) and a **message region of a fixed 2 rows** into one frame of constant height.

**The message region is frame-owned.** `EPIC-003` supplies rejection text and ambiguity candidates
as **data**; it does not print beside the frame. A message longer than the region is truncated with
a `(+N more)` marker rather than growing the frame.

**Any supplied string is stripped of control characters before it is placed** — see Security.

## Out of scope

- **Producing any panel's content** — `ABC-014`, `ABC-016`, `ABC-017`.
- **Deciding *when* to render** — `ABC-019` owns the loop and its render triggers.
- **Terminal resize (SIGWINCH).** Cut by epic amendment: the frame is a session constant, so a
  resize changes nothing about what is drawn, and the erase-to-end-of-screen repairs the display on
  the next frame — one ply later. Accepted cosmetic defect, recorded rather than silently omitted.
- **ANSI colour**, and with it `NO_COLOR`. Cut from the MVP by epic amendment `[A4]`.
- **Alternate-screen mode**, scroll regions, and any TUI framework. Explicitly out of the epic.

## Acceptance (Given/When/Then)

- **Given** a game played to **80 plies (40 moves)** and on to **300 plies**, **when** each frame is
  assembled, **then** every frame has an **identical row count**. *(Epic acceptance `4a` — the
  criterion the original #4 needed and did not have.)*
- **Given** the message region empty and then holding a 2-line rejection, and **given** the thinking
  flag false and then true, **when** the frames are assembled, **then** all four have the **same row
  count**. *(Height must not vary with message content or thinking state — these are the two
  mechanisms that produce stale rows even under a bounded history.)*
- **Given** an ambiguity list of **6** candidate moves and a 2-row message region, **when** the
  frame is assembled, **then** the region holds as many candidates as fit plus a `(+N more)` marker,
  the row count is unchanged, and **no candidate text escapes the region**.
- **Given** a TTY of 24 rows and a 23-row frame, **when** frame N+1 is written after frame N,
  **then** the emitted stream contains a cursor-home sequence, the frame, and **exactly one**
  erase-to-end-of-screen sequence; **and** a capture of the rendered region after frame N+1 contains
  **zero** rows from frame N. *(Epic acceptance `4b`. Erase-to-end-of-screen, **not**
  cursor-up-by-counted-lines: a counted redraw is correct only while consecutive frames have equal
  height and is the exact mechanism that produces the stale rows this criterion names.)*
- **Given** stdout is **not** a TTY, **when** 80 frames are written, **then** the output contains
  **zero** `\x1b` bytes, every frame appears in full, and none is truncated. *(Epic acceptance `4c`.
  This is the mode `EPIC-006`'s end-to-end test runs in.)*
- **Given** a TTY reporting **10** rows and a 23-row frame, **when** frames are written, **then** the
  append strategy is used and **zero** cursor-control sequences are emitted. *(The frame does not
  fit; in-place redraw is undefined there, so it is not attempted.)*
- **Given** the strategy chosen at startup, **when** `process.stdout.isTTY` changes afterwards,
  **then** the strategy in use is unchanged.
- **Given** a message string containing `\x1b[2J` (or any other CSI sequence), **when** the frame is
  written, **then** the emitted stream contains **zero** `\x1b` bytes originating from that string,
  and the frame's row count is unchanged. *(See Security.)*
- **Given** glyph mode ASCII, **when** any frame is written to a non-TTY sink, **then** the count of
  code points above `U+007F` in the captured output is **exactly 0**. *(Epic acceptance `2a`, over
  the whole emitted stream rather than one panel.)*
- **Given** a full frame at **40, 120 and 300 plies**, **when** compute and write are measured
  separately against a non-TTY sink, **then** each total is **< 16 ms** and the figures are recorded
  with their machine and their ply count. *(`NFR-002`. See below.)*

## Dependencies

- **`ABC-014`** (the board), **`ABC-016`** (the status panel), **`ABC-017`** (the history pane) —
  it assembles all three. It can be **built and tested against stub panels of fixed height**, so it
  is not gated on `ABC-013`/`ADR-0004`; the height invariant is a property of the assembler, not of
  the panels' content.
- **`ABC-019`** depends on this, not the reverse.

## Security / NFR triggers

- **SECURITY — terminal escape-sequence injection into the message region.** This is the epic's one
  real security trigger and it is not inflated. The message region is the only part of the frame
  that carries text this product did not generate: `EPIC-003`'s rejection messages will quote what
  the player typed (*"no piece on that square"* implies echoing the square). A player who types an
  ANSI escape gets it written to their own terminal, where it can move the cursor, clear the screen,
  or corrupt every subsequent in-place redraw. It is self-inflicted rather than cross-user — there
  is no second user and no trust boundary in a single-player CLI game — which is why the disposition
  is *strip on the way in*, not a security architecture.
  **Measurable bar:** any string placed into a frame region has **C0 control characters (< `U+0020`)
  and `U+007F` removed** before placement; given a message containing `\x1b[2J`, the emitted stream
  contains **zero** `\x1b` bytes from that string. The only escape sequences in the output are the
  two this module emits itself (cursor home, erase to end of screen), and in append mode there are
  **zero**.
  ASVS L1 (`security.asvs_level`) output-encoding, applied to a terminal sink rather than to HTML.
- **`NFR-002` — this ticket closes the half of it that nobody has measured.** The catalog row says
  so directly: *"(b) frame WRITE — the same frame serialized and written to a non-TTY sink, which is
  `UNKNOWN - verify` and is the half nobody has measured."* Bar: **full frame compute + write
  < 16 ms** at **40 / 120 / 300 plies**, measured against a non-TTY sink and recorded with its
  machine, exactly as the catalog row prescribes. The compute half is known to be small (wave 1
  measured the largest item in a frame — the SAN history derive — at 171–1,318 µs on Apple M3 /
  Node v24.12.0 / darwin-arm64, and `ABC-017`'s bound cuts that to ~70 µs); **the write half is
  genuinely unknown and no number for it may be quoted from any existing note.**
- `NFR-007` (`npx` to first board < 2 s, `EPIC-006`) — the first frame is written inside that
  window. Nothing here may block on I/O beyond the single write.

## Test notes

- **Test against a captured sink, not a terminal.** Every criterion above is written against the
  emitted byte stream; a writer that can only be exercised through a real TTY makes epic acceptance
  `4c` and `EPIC-006`'s pipe-driven end-to-end test untestable.
- **The "zero rows from frame N" criterion needs a screen model, not a byte assertion.** Apply the
  emitted sequences to a small in-memory grid and assert the resulting rows. Asserting only that an
  erase sequence was emitted proves the sequence was sent, not that the display is clean.
- **Assert the escape-stripping on the emitted stream, not on the sanitized string.** A test that
  checks the sanitizer's return value passes even if the writer bypasses it.
- **The height-invariance test must vary message content and thinking state in the same run**, since
  each alone changes height only in combination with a naive assembler.
- Record both NFR-002 halves separately and with the ply count. A single "frame took X ms" number
  with no denominator is not comparable to the next measurement and the catalog row says so.

## Size and priority rationale

**Size `S` (2).** Two output strategies, one selection, one assembler, one sanitizer — a small
amount of code with sharp tests. The screen model for the redraw criterion is the largest single
piece. Calibrated against `ABC-006` (`S`, a harness with an exact oracle). It is deliberately **not**
folded into `ABC-019`: the loop ticket is already `L`, and adding this would make it `XL` and
trigger `SPLIT_REQUIRED`.

**Priority `P0`.** Epic acceptance #4 lives here in full, nothing is visible to a player without it,
and it is the only place `NFR-002` can be measured.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (buildable against stub panels) · acceptance
measurable ✅ (identical row counts, zero `\x1b` bytes, zero stale rows on a screen model, < 16 ms
at three named ply counts) · dependencies ✅ · security trigger ✅ (named, bounded, with a
measurable bar) · NFR triggers ✅ · test notes ✅ · size `S` ✅ · priority `P0` ✅ · no blocker ✅

Sits in `Backlog` behind `ABC-014`. Promotion to `Ready` is a separate BA/PM step.
