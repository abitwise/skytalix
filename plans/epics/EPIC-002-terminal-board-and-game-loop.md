---
id: EPIC-002
title: Terminal board and game loop
status: done
column: Done
priority: P0
size: XL
owner: BA/PM
tickets: ABC-012, ABC-013, ABC-014, ABC-015, ABC-016, ABC-017, ABC-018, ABC-019, ABC-021
---

# EPIC-002 — Terminal board and game loop

> **AMENDED 2026-07-30 by BA/PM during decomposition (task `epic-to-tickets-EPIC-002`).**
> Wave 1 of this decomposition (Architect/Design + System Analyst) established that **two of the
> four acceptance criteria below could not be met as written** — not "were hard", but had no
> in-process mechanism at all. An acceptance criterion that cannot be tested fails the Definition
> of Ready for every ticket beneath it, so they are amended here rather than left for an engineer
> to guess at. **Criteria #1 and #3 are UNCHANGED** — both were already testable.
>
> Four amendments, each marked in place below and each stating whether a promise was reduced:
>
> | # | What changed | Promise |
> |---|---|---|
> | **A1** | Acceptance **#2** split into `2a` / `2b` and given a named selection table | **REDUCED** — see `2c` |
> | **A2** | Acceptance **#4** split into `4a` / `4b` / `4c`; the live history pane is bounded | **REDUCED** — see `4d` |
> | **A3** | Scope: the turn-loop line was factually wrong (it hardcodes human-plays-white) | corrected, not reduced |
> | **A4** | Scope: `captured/material balance` disambiguated; ANSI colour cut from the MVP | **REDUCED** — see Scope |
>
> **Size corrected `M` → `XL` on 2026-07-30.** The indicative `M` (3 points) set at
> idea-to-epics time was wrong by ~8x: decomposition comes to 8 tickets totalling **23 points**.
> Recording the correction rather than leaving a stale estimate, exactly as `EPIC-001` did on
> 2026-07-22. The Orchestrator's no-XL-into-dev rule applies to **tickets**, not epics — this epic
> is split into ABC-012..ABC-019, the largest of which is `L`, so the rule is satisfied and there
> is **no `SPLIT_REQUIRED`**.
>
> **Awaiting a named human on one point (A1).** Amendments A2/A3/A4 are product and scope calls
> that BA/PM owns outright. A1 reduces a *user-facing promise* ("no replacement glyphs appear"),
> and this repo's standing convention is that a material promise change is ratified by a named
> human — `ADR-0002`, `ADR-0003` and `NFR-005`'s amendment all were. **It does not block ticket
> cutting or development**, because the amended criterion is testable either way; it is flagged so
> a human can reverse exactly one choice (see `2c`). Same posture `ADR-0004` carries.

## User value

The game must *feel* like a console chess game — you glance at the terminal and instantly
read the position. This is the whole "console-based chess game, but in CLI" requirement.

## Scope

- Board rendering: 8x8 grid with rank/file labels, light/dark square shading, pieces.
  **[A4] Shading is by CHARACTER, not by ANSI background colour.** A character survives a
  pipe, a snapshot test and a colour-blind terminal; an ANSI background does not, and
  `EPIC-006`'s end-to-end test drives stdout as a **pipe**. ANSI colour is **cut from the MVP**
  and moved to `## Out of scope` — deferred, not deleted. This also disposes of the `NO_COLOR`
  question, which the record never answered.
- Piece display with a portability fallback: Unicode figurines (♔♕♖♗♘♙) by default,
  ASCII letters (KQRBNP, case = colour) when the terminal cannot render them or when
  `--ascii` is passed. **[A1] `--unicode` is added** as the force-on counterpart: under any
  automatic rule a wrong detection needs an override, and today only the ASCII direction has
  one. The two flags are mutually exclusive. **The flag *surface* is `EPIC-006`'s argv scope**;
  this epic owns the selection rule and consumes the answer (see `2b`).
- Board orientation follows the human player's colour (your pieces at the bottom). Both axes
  rotate together — flipping one axis alone yields a left-right mirror in which the king and
  queen swap files, which looks plausible and is wrong.
- Status panel: side to move, check indicator, **material balance**, move number,
  last move played (in SAN), engine thinking indicator (**static** — see Out of scope).
  **[A4] `captured/material balance` is disambiguated to material balance only.** The slash hid
  two different quantities with two different correct derivations: the balance is a 64-square
  board scan (correct after promotion, correct from a loaded FEN, correct with no history);
  the captured-piece *list* must come from the move list and carries two traps (a board diff
  is wrong after any promotion; en passant does not put the captured pawn on the destination
  square). The balance is the number a player reads at a glance. **The captured-piece list is
  deferred** — revisit if play-testing asks for it.
- Move history display in two-column SAN, **[A2] bounded to the most recent 8 move pairs** and
  blank-padded to a constant row count. The full move list is `EPIC-006`'s game-end screen,
  which already promises it.
- **[A3]** The turn loop itself: **a ply loop that dispatches on side-to-move**, not a
  human-turn loop with an engine tail —
  `evaluate → render → (human if side-to-move is the human's colour, else engine) → apply`.
  *The original line read "render → prompt human → apply → render → engine moves → repeat".
  That is a correct description of the steady state when the human plays white and it is wrong
  for half the sessions this product promises:* `EPIC-006`'s own acceptance requires that under
  `--colour black` **the engine opens as white and no prompt appears first**. Corrected, not
  reduced.

## Out of scope

- Move *input parsing* — EPIC-003. This epic owns output only, plus the loop skeleton.
- `parseSan` — EPIC-003 adds it to the same `src/san.ts` this epic creates. This epic ships
  `toSan` only and no second grammar (`ADR-0004` — **ratified 2026-07-31**; clauses 1 and 3 as
  proposed, clause 2 **as amended**, and the amendment lands on EPIC-003's `parseSan`, not on this
  epic's `toSan`. Corrected here — this line read "proposed").
- Animations, mouse support, split-pane TUI framework.
- **[A4] ANSI colour**, and with it the `NO_COLOR` convention. Deferred to a later slice;
  shading is delivered by character instead. Not deleted — `RISK-005` names colour and it
  stays named.
- **An *animating* engine-thinking indicator.** The indicator is **static**: shown on entering
  the thinking state, cleared on leaving, its row always present. Node is single-threaded, so
  an updating indicator would require `EPIC-004` either to yield to the event loop once per
  iterative-deepening iteration or to run in a worker — a requirement on an epic that is not
  yet decomposed. **This epic does not impose that requirement**, and the consequence is
  recorded for `EPIC-004`'s decomposition rather than assumed away.
- **Terminal resize (SIGWINCH) handling.** No epic ever scoped it. Under this epic's amended
  redraw model the frame is a session constant, so a resize does not change what is drawn, and
  `4b`'s erase-to-end-of-screen repairs the display on the next frame — one ply later. That is
  an **accepted cosmetic defect**, recorded rather than silently omitted. Revisit if
  play-testing shows it matters.
- **The captured-piece list** (see Scope). Deferred.

## Acceptance (epic level)

**#1 — unamended.**

- **Given** any legal position, **when** the board renders, **then** all 64 squares plus
  file letters `a-h` and rank numbers `1-8` are shown, oriented to the human's colour.

---

**#2 — AMENDED [A1]. The original read:**

> ~~**Given** a terminal without Unicode support (or `--ascii`), **when** the board renders,
> **then** the ASCII fallback is used and no replacement glyphs (`?`/`�`) appear.~~

**Why it could not be met as written.** "A terminal without Unicode support" is not observable
from inside the process. A process can read whether stdout is a TTY, what the locale claims, and
the platform. It **cannot** read whether the installed font has glyphs for `U+2654`–`U+265F` — a
terminal can be UTF-8-clean, report everything correctly, and still draw tofu — and it cannot
observe what was drawn. So the criterion asserts a property of the *rendered pixels*, which no
in-process test can ever assert. It is replaced by two criteria that assert the two things a
process genuinely controls: **what it emits**, and **which mode it chose**.

- **#2a — Given** the glyph mode is ASCII, **when** any frame renders, **then** the number of
  code points above `U+007F` in the emitted frame is exactly **0**. *(A terminal cannot
  substitute a glyph it was never sent, so an all-ASCII stream cannot produce a `?` or `�`.
  This half is a strengthening, not a softening: it is decidable, byte-exact, and directly
  assertable by the snapshot tests this epic's `## Test notes` already call for.)*
- **#2b — Given** each row of the table below, **when** the session starts, **then** the glyph
  mode is the stated value; it is decided **exactly once, before the first frame**; and it does
  not change for the remainder of the session.

  | # | Input | Mode |
  |---|---|---|
  | 1 | `--ascii` passed | **ASCII** |
  | 2 | `--unicode` passed | **Unicode** |
  | 3 | no flag, and `process.stdout.isTTY` is falsy | **ASCII** |
  | 4 | no flag, a TTY, and the first set of `LC_ALL` / `LC_CTYPE` / `LANG` does **not** match `/utf-?8/i` | **ASCII** |
  | 5 | no flag, a TTY, and the locale is unset or matches `/utf-?8/i` | **Unicode** |

  Precedence is **explicit flag > signal > default**, and the default is Unicode.
  **`process.platform` is deliberately NOT a signal** — "Windows" is a proxy for "legacy
  conhost", and Windows Terminal (the default on Windows 11) renders the figurines correctly,
  so the proxy is wrong on the majority of Windows machines. Row 4 tests *set and not UTF-8*,
  never *unset*, because unset is the normal Windows case and means nothing.

- **#2c — REDUCED PROMISE, stated rather than hidden.** The product **no longer promises that a
  replacement glyph never appears.** On a UTF-8 TTY whose font lacks the chess figurines,
  Unicode mode draws tofu, and no in-process signal predicts it. The remedy is one documented
  flag, `--ascii`, named in `--help` (an `EPIC-006` surface — deliberately not a row in the
  frame, which would break `4a`'s constant height).

  **The one option that would have kept the original promise was rejected on product grounds**,
  and this is the single choice a human can reverse: *ask the player once on first run ("do
  these look like chess pieces?") and remember the answer.* It is the only approach that
  observes what the terminal actually drew. It is rejected because it puts a prompt in front of
  a product whose value is "one command, five seconds, and you are playing", and because
  remembering the answer needs a persistence surface this product does not otherwise have.

---

**#3 — unamended.**

- **Given** the side to move is in check, **when** the board renders, **then** the status
  line states it explicitly.

---

**#4 — AMENDED [A2]. The original read:**

> ~~**Given** a 40-move game, **when** rendering after each move, **then** the board redraws
> without leaving stale rows from the previous frame.~~

**Why it could not be met as written.** "Stale rows" is a failure mode of **in-place redraw into
a fixed region**, so the criterion presupposes in-place redraw. But this epic's scope also
contained an *unbounded* two-column SAN history, which grows one row per move pair, and the two
collide inside one frame. With the board and labels at ~10 rows, the status panel at ~3 and the
message region at 2, a conventional 24-row terminal leaves ~8 rows for history — so an unbounded
history **overflows the viewport at roughly move 9, before the opening is over**, and at the
criterion's own move 40 the frame is ~56 rows, more than twice the viewport. Above that point
"redraws without leaving stale rows" is not merely hard, it is **undefined**: the frame does not
fit the region it is being redrawn into. Bounding the history pane is what makes the criterion
mean something, at any game length.

- **#4a — Given** a game played to **80 plies (40 moves)** and on to **300 plies**, **when** each
  frame is rendered, **then** every frame has an **identical row count**, and that count does not
  vary with move number, message content, or engine-thinking state. *(Reference layout: 8 board
  rows + 1 file-label row + 3 status rows + 8 history rows + 2 message rows + 1 prompt row =
  **23 rows**, which fits a 24-row terminal. The invariant is the criterion; the exact split is
  the engineer's.)*
- **#4b — Given** a TTY with at least as many rows as the frame, **when** frame N+1 is written
  after frame N, **then** the emitted stream returns the cursor to the frame origin and erases
  from the end of the new frame to the end of the screen **in one operation**, and a capture of
  the rendered region after frame N+1 contains **zero** rows from frame N. *(Erase-to-end-of-screen,
  not cursor-up-by-counted-lines: a counted redraw is correct only while consecutive frames have
  equal height, and it is the exact mechanism that produces the stale rows this criterion names.)*
- **#4c — Given** stdout is not a TTY, **or** the TTY reports fewer rows than the frame, **when**
  frames are written, **then** each frame is appended in full with **no cursor-control sequence
  emitted**, and no frame is truncated. *(Stale rows cannot occur in this mode. This is not a
  degraded fallback — it is the mode `EPIC-006`'s end-to-end test runs in, since that test drives
  the real stdout as a pipe.)*
- **#4d — REDUCED SCOPE, stated rather than hidden.** The live frame **no longer shows the whole
  move list**. It shows the most recent 8 move pairs. The full list is `EPIC-006`'s game-end
  screen, which already promises "the full move list", so the information is not lost from the
  product — only from the live frame.

## Dependencies

- `EPIC-001` — needs position state and check status to render.
- **`EPIC-006` — added 2026-07-30.** Two inputs this epic cannot discover for itself and does not
  default: **the human's colour** (which fixes board orientation; colour selection including
  `random` is `EPIC-006`'s startup scope) and **the argv surface** for `--ascii` / `--unicode`.
  Both are values handed *in*; this epic owns the orientation rule and the glyph-mode selection
  rule, `EPIC-006` owns the wiring. Recorded because the original dependency list named only
  `EPIC-001` and the gap was real.
- **`ADR-0004` — `accepted` 2026-07-31. The merge block is LIFTED.** *(Corrected 2026-07-31; this
  line read "`proposed`, NOT ratified … Carried as a named human dependency on `ABC-013`, which sits
  in `Blocked` for exactly that reason." `ABC-013` left `Blocked` for `Ready` on 2026-07-31 after one
  day, below the two-day escalation threshold, and `Blocked` is empty.)* Clauses 1 and 3 landed as
  proposed; clause 2 was **amended**, and the amendment changes `EPIC-003`'s `parseSan` contract, not
  `ABC-013`'s `toSan`, so nothing in this epic's scope moved. **Read that ADR's Status section before
  citing it:** the ruling was made by the **Orchestrator under a named, quoted delegation from
  Olger Oeselg** dated 2026-07-31 — the first ADR in this project not ratified by a human directly,
  and **explicitly not precedent**. The standing rule that no agent may mark an ADR `accepted` is
  unchanged for every other ADR.
- **`ABC-020` — added 2026-07-31, and it is a merge-order dependency for three of this epic's
  tickets.** The rules core stops applying FIDE 9.2/9.3 automatically and starts applying FIDE 9.6
  automatically, which changes what the loop must stop on (`ABC-019`), gives the status panel a new
  cell (`ABC-016`) and creates `ABC-021`. It is `EPIC-001`'s ticket and it is `P0`; this epic
  consumes it and does not own it.

## Risks

- `RISK-005` Terminal portability — Unicode chess glyphs and colour behave differently
  across Windows Terminal, iTerm2, tmux, and CI. Mitigated by the ASCII fallback being
  built in from the start rather than retrofitted. **The "built in from the start" clause is
  why `ABC-015` carries a sequencing constraint: it merges with or before `ABC-018`, never
  after.** The colour half of this risk is disposed of by [A4] — there is no colour to be
  portable about in the MVP.

  > **CORRECTED 2026-08-04 by BA/PM** (task `refinement-2026-08-04`, Workflow 07). The bolded clause
  > previously named **`ABC-014`** and that was wrong — it made a cycle with `ABC-015`'s own
  > `blocked-until: ABC-014` (`ABC-015` cannot be written until `ABC-014` declares `GlyphMode`), and
  > it stopped a `P0` lane twice. **The constraint binds at `ABC-018`, the first ticket in this epic
  > that puts a board in front of a player.** `ABC-014` returns a frame as a value, writes nothing,
  > and takes the glyph mode as a parameter — so merging it cannot produce the hardcoded-mode build
  > this risk's mitigation rules out. **Only the event the constraint binds to moved. The risk's
  > severity and its mitigation strategy are unchanged**, and if a later reader thinks the
  > *mitigation* needs revisiting, that is Security/NFR's call and not BA/PM's. Full reasoning on
  > `ABC-015`; `ABC-014` and `ABC-018` carry the matching clauses.

## NFR triggers

- `NFR-002` Render latency — a full board redraw completes in **< 16 ms**, so a redraw is
  never perceptible as a stall. Row seeded in `plans/nfr-catalog.md`; **target unchanged**.
- **[A2] changes the shape of that row's denominator, and the catalog is owed an update.** The
  NFR-002 row currently records that "the frame is a function of GAME LENGTH, not only of
  position — the history panel is O(plies)", which was true of the unbounded model. Bounding the
  pane to 8 move pairs makes the frame **O(window)**: replay to the window's first ply plus a
  fixed 16 rows of SAN. Arithmetic on wave 1's measured per-row figures (2.2–3.9 µs replay,
  4.31–4.45 µs per `toSan` that computes its own legal list) puts the pane at **≈ 70 µs at any
  game length** rather than 171 µs / 533 µs / 1,300 µs at 40 / 120 / 300 plies — Apple M3,
  Node v24.12.0, darwin/arm64, `UNKNOWN - verify` on other hardware. **This is BA/PM arithmetic
  over someone else's measurement, not a new measurement.** `ABC-017` owns proving it and
  `ABC-018` owns closing NFR-002's genuinely unmeasured half, the terminal write. **The catalog
  row is Architect/Design's to rewrite — flagged here, not edited.**

## Test notes

Snapshot-test the rendered board for a set of known FENs, in both Unicode and ASCII modes.
Snapshots make rendering regressions obvious in a diff.

**The frame must be producible and assertable as a value, with no TTY attached.** Every criterion
above is written against the emitted frame rather than against a terminal, and `EPIC-006`'s
end-to-end test drives stdout as a pipe. A renderer that can only be exercised through a real
terminal cannot satisfy `2a`, `4a` or `4c`.
