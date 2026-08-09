---
id: ABC-018
title: Frame output and redraw — in-place on a TTY, append otherwise, constant height
status: ready-for-uat
column: Ready for UAT
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
  frame to the end of the screen in one operation**. The frame's **last row is the reserved prompt
  row** and carries **no trailing newline**, so the cursor is left at its start and nothing scrolls
  when the TTY reports exactly as many rows as the frame.
- **Append** — when stdout is **not** a TTY, **or** the TTY reports fewer rows than the frame:
  write the frame in full followed by a newline, emitting **no cursor-control sequence at all**.

**Frame assembly**: composes the board (`ABC-014`), status panel (`ABC-016`), move-history pane
(`ABC-017`), a **message region of a fixed 2 rows** and a **reserved prompt row of a fixed 1 row**
into one frame of constant height.

**The frame's height `H` is a session constant known before the first frame** — the panels' constant
heights plus the 3 rows this ticket owns — and that is what makes a strategy chosen *once at startup*
well defined. **`H` is never hardcoded.** The `23`-row frames in the criteria below are the epic's
own reference layout used as a **stub fixture** (`4a`: 9 board + 3 status + 8 history + 2 message +
1 prompt = **23**, *"the invariant is the criterion; the exact split is the engineer's"*).

**The prompt row is RESERVED, not rendered.** *(Added 2026-08-09 — see the correction block under
`## Acceptance`; it was missing, and the omission was a real off-by-one.)* This ticket owns **all
writing** in the epic, and `EPIC-003`'s input surface types into the frame's last row — so that row
is inside `H` and the in-place write leaves the cursor at its start. Reserving it is what makes
*"the TTY reports at least as many rows as the frame"* count **every row that is drawn**; without it
the comparison is short by exactly the row the player types into, and the first keystroke scrolls the
frame origin off the top. This ticket reserves the row and places nothing in it — `EPIC-003` keeps
the prompt surface.

**The message region is frame-owned.** `EPIC-003` supplies rejection text and ambiguity candidates
as **data** — a **list of items** (message lines, candidate moves), never one blob with newlines in
it, since a newline is a C0 character and the sanitizer below removes it. It does not print beside
the frame. Content longer than the region is truncated with a `(+N more)` marker rather than growing
the frame: each item is placed **whole or not at all**, and **`N` is the number of supplied items the
region does not show in full** — a count of the input, not a number the implementation picks. The
marker is present **exactly when `N > 0`**.

**The frame has ONE width `W`, and it is a session constant: the widest row the assembled regions
emit.** `process.stdout.columns` is **not** read — there is no width at all in append mode, which is
the mode `EPIC-006`'s end-to-end test runs in, and the frame is a session constant by the epic's
SIGWINCH ruling. Every emitted row is at most `W`. The message region is where that is enforced: it
is the only region carrying text this product did not generate, and a region row wider than `W`
**wraps in the terminal and adds a screen row** — the one way content can break `4a`'s constant
height.

**Any supplied string is stripped of control characters before it is placed** — see Security.

## Out of scope

- **Producing any panel's content** — `ABC-014`, `ABC-016`, `ABC-017`.
- **The prompt itself** — its text, reading the player's input, and echoing keystrokes are
  `EPIC-003`'s. *(Added 2026-08-09 with the reserved prompt row: this ticket reserves the row and
  leaves the cursor at its start, and that is the whole of its interest in it.)*
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
- **Given** an ambiguity list of **6** candidate moves that **fit** the 2-row message region at the
  frame's width `W` (six 4-character SANs need **29** characters; a 2-row region at `W = 18` holds
  **36**, three to a row), **when** the frame is assembled, **then** the region is **exactly 2 rows**,
  **all 6** candidates appear **in full**, **no** `(+N more)` marker appears, no emitted row exceeds
  `W`, and the frame's row count is unchanged.
- **Given** an ambiguity list that does **not** fit — **10** candidates, needing **49** characters
  against the **36** a 2-row region at `W = 18` holds, and a candidate is never split across rows —
  **when** the frame is assembled, **then** the region is **exactly 2 rows**, every candidate shown
  appears **in full** (never split, never cut mid-token), the last row ends with `(+N more)` where
  **`N` equals the number of supplied candidates not shown in full**, no emitted row exceeds `W`, **no
  candidate text appears outside the region**, and the frame's row count is unchanged. *(Which
  candidates fit is the engineer's packing; `N` is not — it is a count of the input, so two
  implementations that pack differently both pass, and one that invents `N` fails.)*
- **Given** a TTY of 24 rows and a 23-row frame, **when** frame N+1 is written after frame N,
  **then** the emitted stream contains a cursor-home sequence, the frame, and **exactly one**
  erase-to-end-of-screen sequence; **and** a capture of the rendered region after frame N+1 contains
  **zero** rows from frame N. *(Epic acceptance `4b`. Erase-to-end-of-screen, **not**
  cursor-up-by-counted-lines: a counted redraw is correct only while consecutive frames have equal
  height and is the exact mechanism that produces the stale rows this criterion names.)*
- **Given** a TTY reporting **exactly 23** rows and a 23-row frame — the boundary of *"at least as
  many rows as the frame"* — **when** frames N and N+1 are written, **then** the **in-place** strategy
  is used, and on a 23-row screen model the frame's first row is still on **screen row 1** after
  frame N+1 (nothing scrolled) and **zero** rows from frame N remain. *(Added 2026-08-09. Kills two
  mutants, not one: `>` where the rule says `≥`, and a trailing newline after the frame's last row —
  at exactly this size that newline scrolls the origin off the top and every later in-place redraw
  lands one row high.)*
- **Given** an in-place write of a frame of `H` rows, **when** the frame has been written, **then**
  `H` **includes the reserved prompt row** and the emitted stream leaves the cursor at the **start of
  that row**, with no newline after the frame's last row. *(Added 2026-08-09. The row `EPIC-003` types
  into is inside the frame, which is what makes the `R ≥ H` comparison account for every row drawn.)*
- **Given** stdout is **not** a TTY, **when** 80 frames are written, **then** the output contains
  **zero** `\x1b` bytes, every frame appears in full, and none is truncated. *(Epic acceptance `4c`.
  This is the mode `EPIC-006`'s end-to-end test runs in.)*
- **Given** a TTY reporting **10** rows and a 23-row frame, **when** frames are written, **then** the
  append strategy is used and **zero** cursor-control sequences are emitted. *(The frame does not
  fit; in-place redraw is undefined there, so it is not attempted.)*
- **Given** a writer constructed against a sink reporting **TTY and 24 rows**, **when** the sink's
  `isTTY` is set **false** and its row count to **10** *after* construction and two further frames are
  written, **then** both are written **in place** — each emits a cursor-home sequence and **exactly
  one** erase-to-end-of-screen. *(Replaces, 2026-08-09, the criterion this ticket carried until then:
  "when `process.stdout.isTTY` changes afterwards, the strategy in use is unchanged". The signals
  reach the writer at construction — the `## Test notes` **require** a captured sink — so a criterion
  phrased against the ambient `process.stdout` cannot be tested against the design this ticket
  mandates, and passes for every implementation including one that re-decides on every write. This
  form kills that one.)*
- **Given** a message string containing `\x1b[2J` (or any other CSI sequence), **when** the frame is
  written, **then** the emitted stream contains **zero** `\x1b` bytes originating from that string,
  and the frame's row count is unchanged. *(See Security.)*
- **Given** glyph mode ASCII **and a supplied message containing `é` and `♞`**, **when** any frame is
  written to a non-TTY sink, **then** the count of code points above `U+007F` in the captured output
  is **exactly 0**. *(Epic acceptance `2a`, over the whole emitted stream rather than one panel —
  including the one region carrying text this product did not generate. The two inputs were added
  2026-08-09: without them this criterion and the sanitizer's bar contradicted each other the moment
  a player typed a non-ASCII character. See Security.)*
- **Given** a full frame at **40, 120 and 300 plies**, **when** compute and write are measured
  separately against a non-TTY sink, **then** at each ply count **compute + write SUMMED is < 16 ms**
  — the bar is the sum, not each half — and **both halves are recorded separately**, each with its
  machine and its ply count. *(`NFR-002`. See below. Amended 2026-08-09: "each total is < 16 ms" read
  two ways, and the loose reading passed a 31 ms frame against a 16 ms bar. The target did not
  move — it is `EPIC-002`'s.)*

> ### CORRECTED IN PLACE 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-018`, subtask `bapm-abc018-promote`, Workflow 07)
>
> **Five acceptance defects were fixed at the `Backlog → Ready` exit, before promotion, not after.**
> This ticket's own `## Definition of Ready` block ticked *acceptance measurable* ✅ on 2026-07-30 and
> nothing re-checked it until today; the Orchestrator's pre-check left the row **amber** with three
> named specifics rather than green. **The row is a FAIL, not an amber** — it is met only after the
> corrections below. **Nothing else moved**: size `S`, priority `P0`, the two strategies, the
> `## Out of scope` list, the dependencies, `RISK-005`'s merge-order constraint and the security
> disposition are untouched, and `EPIC-002`, `ABC-016`, `ABC-017` and `ABC-019` are **not edited**.
>
> **1 — `(+N more)` had no defined `N`, and the input named did not necessarily produce the marker it
> asserts.** *(Orchestrator item 1 — AGREED, and it is worse than the pre-check said.)* *"As many
> candidates as fit"* needs a width, and this system has none: `git grep -E "columns|COLUMNS|width"`
> over non-test `src/` on merged `main` returns **zero**, nothing here supplied one, and **in append
> mode there is no width at all**. The pre-check stopped there. Carrying it one step further: with any
> plausible width the criterion's own example is **self-defeating** — six 4-character SANs need 29
> characters and a 2-row region at `W = 18` holds 36, so a correct implementation shows all six, emits
> **no** marker, and **fails the criterion as literally written**; a one-candidate-per-row
> implementation answers `N = 5`. Two correct implementations disagree and one of them makes the
> criterion vacuous — the same class as `ABC-015`'s defect 1, an input tuple with no stated output.
> **Ruled:** the frame has one width `W`, a session constant (see `## Scope`); the region takes a
> **list of items**, each placed whole or not at all; and **`N` is defined relationally** — the count
> of supplied items the region does not show in full. Split into a *fits* case and a *does not fit*
> case, both with the arithmetic in them. **Packing stays the engineer's**; only `N` is pinned.
> *(This also disposes of a smaller wrinkle: a newline is a C0 character, so the sanitizer removes it —
> a "2-line rejection" was never one string with a `\n` in it, and the region's input is a list.)*
>
> **2 — A frame row that no ticket owned.** *(Orchestrator item 2 — the substance is AGREED, the
> diagnosis is CORRECTED.)* The pre-check said *"23 appears nowhere else and nothing defines the
> assembled height"*. **`23` does have a source**: it is `EPIC-002` `4a`'s reference layout, 9 board +
> 3 status + 8 history + 2 message + **1 prompt** = 23. The real fault is one row down. **This
> ticket's `## Scope` assembled only four of those five regions and sums to 22**, while its criteria
> are written against a 23-row frame. Checked across every ticket in the epic — `ABC-014`, `ABC-016`,
> `ABC-017`, `ABC-019`, `ABC-021` and `EPIC-003` — **no ticket owned the prompt row**, and
> `ABC-016` records that this ticket owns *"all writing"*. So the row the player types into was inside
> the epic's frame, outside this ticket's frame, and owned by nobody. **The consequence is exactly the
> failure `4b` names**: *"at least as many rows as the frame"* would be short by one, and the first
> keystroke scrolls the frame origin off the top. **Ruled:** the frame **reserves** a 1-row prompt row
> as its last row, inside `H`; the in-place write leaves the cursor at its start with no trailing
> newline; `EPIC-003` keeps the prompt surface and this ticket renders nothing into the row.
> **The alternative was considered and rejected, rather than picked silently:** leave the frame at 22
> and require `R ≥ H + 1`. That fixes this ticket's omission by **amending the epic's own rule**
> (`4b`/`4c` say *"as many rows as the frame"*) and by pushing the accounting into `ABC-019`, which
> does not write. Reserving the row ratifies the epic's layout instead of editing it, and it is why
> `H` is now stated as a session constant rather than left to be inferred.
>
> **3 — The equality boundary was untested.** *(Orchestrator item 3 — AGREED.)* The rule is *"at least
> as many rows"*, and the tested cases were 24/23 and 10/23. Added a **23/23** criterion asserted on
> the screen model. It kills **two** named mutants, not one: `>` where the rule says `≥`, and a
> trailing newline after the frame's last row — at exactly this size that newline scrolls the origin
> off the top and every later redraw lands one row high.
>
> **4 — The `NFR-002` bar was ambiguous by 2x. Named by no pre-check.** *"When compute and write are
> measured separately … then **each total** is < 16 ms"* reads as *each half* < 16 ms, which passes a
> 31 ms frame against a 16 ms bar. This ticket's own `## Security / NFR triggers` says *"compute +
> write < 16 ms"* and `plans/traceability.md`'s `ABC-018` row says the same, so the criterion
> contradicted its own ticket. **Rewritten to the sum at each ply count, both halves still recorded
> separately. No target moved** — the 16 ms is `EPIC-002`'s.
>
> **5 — A criterion that could not fail. Named by no pre-check, and it is the `ABC-015` defect-2 shape
> again.** The old criterion read *"when `process.stdout.isTTY` changes afterwards, then the strategy
> in use is unchanged"*. It names an **ambient global that the design this ticket's own `## Test
> notes` mandate never reads** — the writer is exercised against a captured sink — so mutating
> `process.stdout` proves nothing and the criterion passes for **every** implementation, including one
> that re-decides the strategy on every write. **Restated against the injected sink**: mutate its
> `isTTY` and rows *after* construction, write two more frames, both must still be in place. That
> kills the live mutant, which is a real one here — unlike `ABC-015`, the signals live on a **stateful
> object the writer holds**, so re-reading them per write is a plausible implementation.
>
> **One further collision closed while there, folded into the Security bar rather than counted as a
> sixth defect.** Acceptance `2a` asserts **zero** code points above `U+007F` over the **whole**
> emitted stream in ASCII mode, while the sanitizer removed only C0 and `U+007F`. `EPIC-003` will echo
> what the player typed, so a player who types `é` makes two of this ticket's own criteria contradict
> each other — constructible input, no stated output, the same shape as defect 1. **Ruled:** in **ASCII
> mode only**, the sanitizer removes code points above `U+007F` from supplied strings too; in Unicode
> mode they survive, because a UTF-8 terminal can draw them. ASCII mode exists precisely for the
> terminal that cannot.
>
> **Adjudicated and deliberately NOT changed, so the silence is not mistaken for an oversight.**
> The first criterion (*identical row count at 80 and 300 plies*) is **near-vacuous under the stub
> panels this ticket is built against** — a constant-height stub makes any assembler pass. It is left
> exactly as it is: it is epic `4a` verbatim, it becomes falsifiable at integration (`ABC-019`,
> `EPIC-006`), and under stubs the falsifiable weight is carried by the criterion beneath it, which
> varies message content and thinking state. **No statistic (median / p95) was added to the `NFR-002`
> criterion** either: this repo has no in-repo wall-clock bars by convention — `src/zobrist.nfr.test.ts`
> states the reason at line 112 — and the figures are re-derived out-of-tree at the Security/NFR gate.
>
> **Size re-checked, not assumed: still `S` (2).** The corrections add one reserved row placed by the
> same mechanism as the message region, one width constant, one sanitizer clause and four tests. No
> argv, no I/O, no new module.

## Dependencies

- **`ABC-014`** (the board), **`ABC-016`** (the status panel), **`ABC-017`** (the history pane) —
  it assembles all three. It can be **built and tested against stub panels of fixed height**, so it
  is not gated on `ABC-013`/`ADR-0004`; the height invariant is a property of the assembler, not of
  the panels' content.
- **`ABC-019`** depends on this, not the reverse.
- **`ABC-015` merges with or before this ticket — `RISK-005`'s merge-order constraint binds HERE.**
  Added 2026-08-04 by BA/PM (task `refinement-2026-08-04`, Workflow 07), untying a contradiction
  between `ABC-015`, `ABC-014` and `RISK-005` that had been flagged twice and untied zero times; the
  full reasoning is in `ABC-015`'s `## Dependencies`. **This ticket is the first thing in `EPIC-002`
  a player can see** — it is what makes the frame a display rather than a value — so it is the first
  point at which `RISK-005`'s *"built in from the start rather than retrofitted"* can be violated: a
  writer that emits a board while the glyph mode is hardcoded **is** the retrofit that wording rules
  out. The constraint was previously written against `ABC-014`, which merges nothing user-visible
  and takes the mode as a parameter it does not choose.
  **Consequence for this ticket, and it is a real one:** whoever builds it takes the glyph mode as an
  argument from `ABC-015`'s selection function. It must not default the mode, hardcode it, or
  re-derive it from the environment — `ABC-015` owns that rule and runs it once at startup.
  *(Not a build dependency: this ticket can still be built and tested against a stub mode, exactly as
  it is against stub panels. It is a merge-order constraint.)*

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
  and `U+007F` removed** before placement — **and, in ASCII glyph mode only, every code point above
  `U+007F` as well** *(added 2026-08-09: acceptance `2a` asserts zero of those over the **whole**
  emitted stream, and the message region is the one part of that stream carrying text this product
  did not generate, so a player typing `é` otherwise made two of this ticket's criteria contradict
  each other; in Unicode mode supplied non-ASCII survives, because a UTF-8 terminal can draw it)*;
  given a message containing `\x1b[2J`, the emitted stream contains **zero** `\x1b` bytes from that
  string. The only escape sequences in the output are the
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
- **The region tests assert against the frame's width `W`, never the terminal's** — `process.stdout.columns`
  is not read and in append mode it does not exist. **The strategy tests mutate the sink handed to the
  writer, never `process.stdout`.** *(Both added 2026-08-09 with the corrections above.)*
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

**Re-derived 2026-08-09 at the `Backlog → Ready` exit.** The block below was written 2026-07-30 by
the decomposition and was **never re-checked** until today; it is restated rather than left standing,
because one of its ticks was wrong.

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (buildable against stub panels — re-asked and it
holds: the height invariant is the assembler's, and the two unbuilt panels enter as fixed-height
stubs) · **acceptance measurable — was ❌, now ✅ AFTER FIVE CORRECTIONS** (`N` defined relationally
against a session-constant width, the reserved prompt row inside `H`, the `R = H` boundary on a screen
model, `NFR-002` as the sum rather than per half, the strategy criterion restated against the injected
sink — see the correction block under `## Acceptance`) · dependencies ✅ (both discharged and
re-verified at the source: `ABC-014` merged and `renderBoard` is on `main`; `ABC-015` merged
`f1743a3 → f4d5d31`, so `RISK-005`'s merge-order constraint is satisfied **before** this ticket
starts, and what survives it is the build obligation in `## Dependencies`) · security trigger ✅
(named, bounded, measurable bar — widened 2026-08-09 for ASCII mode) · NFR triggers ✅ (`< 16 ms`
summed at 40/120/300 plies, recorded with its machine; `NFR-007`) · test notes ✅ · size `S` ✅ ·
priority `P0` ✅ · no blocker ✅ (`Blocked` column empty)

*(The line this block carried until 2026-08-09 read "acceptance measurable ✅ (identical row counts,
zero `\x1b` bytes, zero stale rows on a screen model, < 16 ms at three named ply counts)". Every item
in that list was true and the tick was still wrong — the defects were in criteria the list did not
mention.)*

**PROMOTED `Backlog → Ready` 2026-08-09 by BA/PM** (task `ticket-to-pr-ABC-018`, subtask
`bapm-abc018-promote`, Workflow 07) — the `Backlog` exit this role owns. `Ready` 3/8 → 4/8; no limit
approached and no override taken. *(This line replaced "Sits in `Backlog` behind `ABC-014`. Promotion
to `Ready` is a separate BA/PM step." — that step is this one.)*

**It was not promoted as it stood.** Five acceptance defects were found at this exit and fixed in
place first; three of them were the Orchestrator's three flagged items, and **two were named by no
pre-check**. The Definition of Ready is met **after** those corrections, which is what refinement is
for.

**This is not the pull gate.** The Definition of Ready is applied again by the Orchestrator at
`Ready → In Development` (Workflow 04 step 1); promotion makes this ticket pullable, nothing more.

## Implementation

**IMPLEMENTED `In Development → In Review` 2026-08-09 by the Software Engineer** (task
`ticket-to-pr-ABC-018`, subtask `engineer-abc018-implement`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-018`. `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; no limit
approached, no override taken, no written reason owed. **Nothing merged and nothing deployed — a
human holds both.**

**Two new files, and no existing file under `src/` was touched.** Verified rather than asserted:
`git diff --numstat main -- src/` is **empty**, and the only entries `git status --short -- src/`
reports are the two new files.

- `src/frame.ts` — 222 lines, **94 of them code**. `assembleFrame(parts, mode): string[]` is the
  VALUE (it writes nothing and reads nothing ambient); `beginFrameSession(sink, height):
  FrameWriter` is the SESSION (it reads the sink's two signals once, picks a strategy, and holds
  it); `frameHeight({board, status, history})` is the one place the `+3` lives, so `H` is never
  hardcoded.
- `src/frame.test.ts` — the twelve acceptance criteria, one test each in this ticket's order, plus
  eight that pin what the criteria do not reach, and the in-memory screen model the `## Test notes`
  require.

### `RISK-005`'s build obligation — discharged, and checked mechanically rather than asserted

The mode is a **required parameter of `assembleFrame` with no default**. `src/frame.ts` imports
exactly one thing — `import type { GlyphMode } from "./render.ts"`, a type-only import that is erased
at runtime — so it cannot default the mode, cannot hardcode one (its only mode literal is the
`mode === "ascii"` comparison inside the sanitizer), and cannot re-derive one: `grep` for `process.`
finds it only in prose, and the only `isTTY` / `rows` reads in the file are of the **injected sink**.
`ABC-015` owns the rule and runs it once; its answer reaches this module the same way it reaches
`renderBoard`.

### The structural choices this ticket left open, decided here

1. **`W` is derived from the PANEL rows only, not from all assembled rows.** The ticket defines `W`
   as "the widest row the assembled regions emit", which is circular if the message region is inside
   the maximum: one long rejection would widen the frame, which is the one way content can break
   `4a`'s constant geometry. The panels set `W`; the message region is bounded **by** it. A mutant
   that takes `W` over the message rows too is killed by two tests.
2. **Every row except the reserved prompt row is padded to exactly `W`.** This is what makes the
   in-place redraw leave **no character** of the previous frame behind: `ED(0)` clears from the
   cursor down, but a row SHORTER than the row it overwrites leaves the old tail on screen to its
   right, and the Security bar allows only the two escape sequences this module emits — so a per-row
   erase-to-end-of-line was not available and padding is the mechanism. The prompt row is
   deliberately **not** padded: padding it would leave the cursor at column `W` instead of at the
   row's start.
3. **The packing search runs downward, because `N` and the marker are coupled.** Dropping an item
   raises `N`, which can lengthen `(+N more)`, which can drop another item. The implementation takes
   the largest number of items that fits **together with** the marker its own absence implies, so
   `N` is always the count of supplied items not shown in full — never a number the implementation
   picked.
4. **The sanitizer runs over every string placed into the frame, panel rows included** — the ticket's
   words are "any supplied string … before it is placed", and from the assembler every row is
   supplied. It costs one pass over ~22 short rows and makes acceptance `2a` hold over the **whole**
   emitted stream by construction rather than by trusting three panels to be pure.
5. **Widths are counted in UTF-16 units.** They equal code points for everything this frame can
   carry (ASCII mode strips above `U+007F`; the Unicode glyphs are `U+2654`–`U+265F`). A terminal's
   DISPLAY columns are a third quantity and nothing in this epic supplies one — stated in the
   module header rather than left to be discovered.

### `NFR-002` — BOTH HALVES MEASURED, separately, with the machine and the ply count

Measured **out of tree** (own harness outside the repository, its own process, the game replay and
`parseFen` hoisted out of every timed region — the catalog's own caution, which produced a 2.08x
false miss on `ABC-012`), a discarded warm-up round, **11 rounds** per cell, cell order rotated every
round, medians of per-round means, and **two fully independent samples**. Machine: **Apple M3
(Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64**, and **`UNKNOWN - verify` on any other hardware**.
Denominator: a **23-row, 18-column frame, 418 characters serialized**.

| Half | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| **(a) COMPUTE** — `renderBoard` + `assembleFrame` | **5.97 / 6.03 µs** | **6.02 / 6.07 µs** | **6.03 / 6.06 µs** |
| **(b) WRITE** — serialize into an in-memory sink | **0.64 / 0.64 µs** | **0.64 / 0.65 µs** | **0.65 / 0.65 µs** |
| **(b) WRITE** — `fs.writeSync` to `/dev/null` | **1.67 / 1.66 µs** | **1.66 / 1.66 µs** | **1.67 / 1.67 µs** |
| **(b) WRITE** — `fs.writeSync` to a regular file | **2.43 / 2.48 µs** | **2.44 / 2.46 µs** | **2.44 / 2.48 µs** |

**The bar is the SUM and it is MET at every ply count with four orders of magnitude of room:
0.0084–0.0092 ms** (worst case: compute + the file sink), against **16 ms**. Roughly **0.05%** of the
budget. **No number here is quoted from any existing note** — the write half was `UNKNOWN - verify`
and this is its first measurement; the 171–1,318 µs SAN-derive figures on record are a **different
measurement** of a **different quantity** and were deliberately not used.

**Three limits travel with these figures and none of them may be dropped when they are quoted.**
First, **the compute half is a LOWER BOUND**: `ABC-016`'s status panel and `ABC-017`'s history pane
do not exist, so they entered as fixed-height stub arrays built OUTSIDE the clock, and `ABC-013`'s
SAN derive is not in it at all. Second, **"write" was measured three ways because "written to a
non-TTY sink" honestly means three different things** — serialization alone, serialization plus a
syscall to `/dev/null`, and serialization plus a syscall that reaches a filesystem; all three are
reported rather than the flattering one. Third, **the in-place (TTY) path was NOT timed separately**:
this ticket's bar names a non-TTY sink, and what a real terminal does with the bytes is not
observable in-process. **No wall-clock assertion was added to the suite** — this project's standing
rule (`src/zobrist.nfr.test.ts:112`); the microseconds live here with their machine, and
Security/NFR re-derives them on its own instruments.

### Gates, reported exactly as they ran

`npm install` exit 0 (no dependency change; `package-lock.json` untouched) · `npm run lint` exit 0
**after ONE safe autofix pass** (`npx biome check --write src/frame.test.ts` — import ORDER and
formatting only, `lint.autofix` is `true`, self-fix attempt **1 of 2**) · `npm run typecheck` exit 0 ·
`npm test` **297 passed / 297 on 14 files** (**277 on 13 before**, measured by running the suite
without this file rather than by subtraction) · `npm run build` exit 0. **Skipped-test count 0**,
captured with the `AGENTS.md` command. `src/frame.ts` is at **100% statements / branches / functions
/ lines**. **E2E: `UNKNOWN - verify`** — the `AGENTS.md` slot is unknown, there is no UI surface and
no runnable game until `EPIC-006`. **Test-integrity checker: exit 2** (`node
tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → "cannot read the
registry file") — that is "the checker could not run", **recorded as an error and NOT as a pass**,
and **no registry file was created**: an agent may not self-author a justification to clear its own
gate. The skip count is 0, so nothing is owed a justification. **Auto-UAT oracles: `UNKNOWN - verify`**
— `scripts/check-uat-oracles.js` does not exist in this install (non-blocking, per Workflow 05).
The two lint **infos** are pre-existing `biome.json` schema/deprecation notices, unrelated to this
ticket and deliberately not touched.

### 18 mutants run against the module, all 18 killed — including the two the ticket names

Each was applied to `src/frame.ts`, the suite run, and the file restored; the tree is byte-identical
after the campaign (`md5` `bb827f52fe537817e40020a29dfa0e6d` before and after). The two the
corrections were written for both die: **`>` where the rule says `≥`** (1 test) and **a trailing
newline after the frame's last row** (2 tests), and so does the live one defect 5 names — **a writer
that re-decides the strategy on every write** (1 test). Also dead: no padding (4), `N` invented (1),
`W` taken over the message rows (2), an item split across rows (1), the marker emitted when nothing
is hidden (2), a per-row erase-to-end-of-line instead of one erase-to-end-of-screen (4), a cursor
sequence in append mode (3), the C0 strip removed (2), the ASCII strip removed (1), the prompt row
not reserved (11), the message region grown to fit (8), two erases (3), an absent `rows` read as
unlimited (1) and an absent `isTTY` read as a terminal (1).

**TWO of them survived the suite as first written and the SUITE was fixed, not the record.** Both are
the same shape and both are `ABC-015`'s QE finding a second time: **no acceptance criterion
constructs a sink whose `isTTY` or `rows` is ABSENT**, which is the real shape Node presents on a
pipe — every criterion names a row count. A writer reading an absent row count as unlimited, and one
reading an absent `isTTY` as a terminal, therefore passed all twelve criteria. A test now writes to
three sinks with missing signals. **That is a gap in the criteria, not in the code, and it is handed
to QE and BA/PM rather than closed here.**

### Handed over named, rather than left to be discovered

1. **Acceptance criterion 1 is near-vacuous under stubs and the test says so in place.** BA/PM ruled
   it left alone knowingly. It is implemented as strongly as stubs allow — a frame is assembled at
   **every ply of a real 300-ply game** (a legal knight shuffle, so the ply count is real rather than
   a position that merely looks like one) and every row count must be identical — but a fixed-height
   stub makes any assembler pass. It becomes falsifiable at `ABC-019` / `EPIC-006`.
2. **`W = 18` is a stub fixture and the suite derives it rather than asserting it into existence.**
   It falls out of the merged `renderBoard`, which is the widest real panel that exists. When
   `ABC-016` and `ABC-017` ship, `W` becomes whatever the widest of the three emits — one test
   already pins that by handing in a 24-wide status stub.
3. **The reserved prompt row's contract still has only one side written down.** This ticket reserves
   the row, renders nothing into it and leaves the cursor at its start; `EPIC-003` and `ABC-019` have
   not been told. That obligation is the Orchestrator's open item, not discharged here.

**Not done, deliberately.** No panel content (`ABC-014` / `ABC-016` / `ABC-017`), no render trigger
(`ABC-019`), no prompt text or input (`EPIC-003`), no argv (`EPIC-006`), no resize handling, no
colour, no alternate screen, no edit to any existing `src/` file, no edit to `plans/nfr-catalog.md`
(the catalog row is Architect/Security's and the Security/NFR gate owns the discharge), and no wall-
clock assertion anywhere in the suite.

## QE

**QE VERDICT: PASS. `In Review → In Security/NFR` 2026-08-09 by QE/E2E** (task
`ticket-to-pr-ABC-018`, subtask `qe-abc018-review`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-018`. `In Review` 1/3 → 0/3, `In Security/NFR` 0/2 → 1/2; no limit
approached, no override taken. **Nothing merged and nothing deployed — a human holds both.**

**All twelve testable acceptance criteria are implemented, covered and passing, and NO PRODUCTION
DEFECT WAS FOUND.** `src/frame.ts` is **byte-identical to the Engineer's commit `d88a1f0`**
(`md5 bb827f52fe537817e40020a29dfa0e6d`, the digest they published) after **75 mutate-and-restore
cycles** over **56 distinct mutants**; `git diff --stat d88a1f0 -- src/frame.ts` is empty. Everything
below is a change to **tests only**.

**The four mandatory gates were re-run on the tip by this role rather than inherited**, before and
after the added tests: `npm run lint` exit 0 (the 2 infos are the pre-existing `biome.json` schema
and deprecation notices), `npm run typecheck` exit 0, `npm run build` exit 0, `npm test`
**297/297 then 304/304 on 14 files**, skip count **0** both times by the `AGENTS.md` command,
`src/frame.ts` **100% statements / branches / functions / lines** against the `0.8` threshold. The
**277-on-13 baseline was re-derived by running the suite without this file**, not by subtraction.
The Engineer's figures reproduce exactly. One autofix pass was needed on QE's own new test code —
**formatting only**, `lint.autofix` is `true`, self-fix **1 of 2** — and is reported rather than
smoothed. **Test-integrity checker: exit 2** (`.grugops/test-skips.md` absent), recorded as an error
and **not** as a pass; no registry file was created. **E2E `UNKNOWN - verify`.** Five shuffled
full-suite runs were clean.

**BOTH FAKES THIS TICKET'S `## Test notes` NAME WERE CHECKED BY CONSTRUCTION, AND NEITHER IS
PRESENT.** A byte-only rewrite of criteria 5 and 6 — home prefix, frame present, exactly one erase,
exactly two `\x1b` — **passes** the no-padding mutant that the **delivered forms kill**: the screen
model is load-bearing, not decoration. And the mutant that is exactly the second fake — `sanitize()`
left entirely correct while the writer bypasses it — dies to criteria 11 and 12, because both assert
on the **captured stream**.

**THE THREE CRITERIA BA/PM CORRECTED AT THE `Backlog` EXIT ALL DID THE JOB THEY WERE MADE FOR, and
each is the SOLE killer of its mutant:** the `23/23` boundary alone kills `>` where the rule says
`≥`; the injected-sink restatement alone kills the writer that re-decides its strategy on every
write; and the relational `N` alone kills an invented `N`, a marker with no room reserved, and a
marker on the wrong row. **The corrections were not ceremony.**

**SIX MUTANTS PASSED ALL TWELVE CRITERIA AND ALL 297 DELIVERED TESTS. All six are now dead, each to
exactly one added test, and NOT ONE of them was a defect in the delivered code:**

1. **`SEPARATOR = ""`** — items run together into one unreadable token. `"Nbd2Nfd2Rae1"` still
   contains every candidate and still ends with the marker, so both region criteria pass. The
   separator is load-bearing in **this ticket's own arithmetic** — *"six 4-character SANs need 29
   characters"* is 6×4 **+ 5 separators** — and nothing asserted it.
2. **The sanitizer skipped over the PANEL rows.** The Engineer recorded that the narrower reading
   *"would pass every test in this suite, because the stub panels are ASCII"*. It did. Acceptance
   `2a` is a claim about the **whole** emitted stream, and `ABC-016` / `ABC-017` are unbuilt.
3. **No `(+N more)` when NOT ONE supplied item fits** — the `shown === 0` fall-through. Every
   delivered case leaves an item showing, so a build that dropped the marker there went green while
   the region **went silently blank**. `## Scope` says the marker is present exactly when `N > 0`.
4. **A TTY exactly ONE row SHORT of the frame still redrawing in place — the other side of the `≥`
   boundary.** The correction added `23/23`; the **exclusive** side stayed open, because the only
   "too short" case in the criteria is **10 rows against 23**, thirteen rows short, which a
   `>= H − 1` slip clears easily. It is **the exact failure `4b` exists to prevent**.
5. **`U+0000` surviving the C0 strip.** The sanitizer criteria supply `\x1b`, `U+0007` and `U+007F`;
   the measurable bar is a **RANGE** (`< U+0020` and `U+007F`) and the range was never asserted.
6. **The C1 block (`U+0080`–`U+009F`) — CHARACTERIZED, NOT DECIDED.** The module matches the bar
   exactly, which names C0 and `U+007F` only. `U+009B` is 8-bit CSI and a UTF-8 terminal does not
   honour it, so keeping it is defensible — but the criteria are silent and the two builds were
   indistinguishable. **Routed to the Security/NFR gate.**

**FOUR MUTANTS SURVIVE AND ALL FOUR ARE REPORTED.** Three are **proven equivalent** — `?? -1` for
`?? 0` on an absent row count (`H ≥ 3` on every reachable input), `sink.isTTY === true` for
`Boolean(sink.isTTY)` over the declared type (**`ABC-015`'s surviving mutant a second time, on the
same coercion**), and `+ 1` for `+ SEPARATOR.length`. The fourth reserves marker room on every region
row rather than the last: it shows fewer items with a larger `N`, `N` stays a count of the input, and
it is therefore **a conforming alternative packing, not a defect** — which is what this ticket
intends by leaving packing to the engineer.

**ONE PRODUCTION-SHAPED RISK IS NAMED AND IT IS STILL A PASS.** **`W` is recomputed inside
`assembleFrame` on every frame**, while `## Scope` calls it *"a session constant"*; `beginFrameSession`
takes `H` and not `W`, so nothing holds a width across frames. Demonstrated on the screen model: a
24-wide frame followed by an 18-wide one **leaves the wider frame's tail on screen**, because `ED(0)`
cannot reach what sits to the right of a row overwritten by a shorter one — the same class the
padding decision prevents, one level up. It **breaks no criterion**, it **cannot fire today** (the
only real panel is `renderBoard`, always 9×18; the other two are fixed-height stubs; there is no
runtime importer), and the fix is an API change whose shape depends on `ABC-016` and `ABC-017`. It is
pinned by a **characterization test** and handed to those tickets.

**CRITERION 2 IS WEAKER THAN IT WAS RULED TO BE, and this is measured rather than argued.** BA/PM
left criterion 1 near-vacuous **knowingly**, on the reasoning that criterion 2 carries the falsifiable
weight. Criterion 2 does **not** kill the grown-message-region mutant its own rationale names, because
its two-item rejection never needs a third row. The suite is not blind to it — the pin that hands in
seven items kills it — but the **criterion** is. **A third item fixes it, and QE did not amend it:
amending a criterion is the `Backlog` exit.** Criterion 1 remains an integration obligation for
`ABC-019` / `EPIC-006`, exactly as ruled.

**THE ENGINEER'S HANDED-OVER GAP IS CONFIRMED INDEPENDENTLY AND IS STILL OPEN AT THE CRITERIA
LEVEL.** No criterion constructs a sink whose `isTTY` or `rows` is **ABSENT** — the shape Node
presents on a pipe — and both mutants die to the Engineer's own added pin and to nothing else. This
is the **third consecutive ticket** on this board whose acceptance set is written entirely over
signals that agree.

**`NFR-002` WAS NOT RE-DERIVED HERE and no figure of this role's may be quoted as a measurement.**
The Security/NFR gate owns it and re-derives on its own instruments. One coarse single-sample
order-of-magnitude sanity check agrees with the Engineer's in-memory pair (0.0071 ms against
0.0067 ms per frame, Apple M3 / Node v24.12.0 / darwin arm64) — it exists so this role did not relay
a four-orders-of-magnitude claim unlooked-at, and it is **not** a measurement.

**NO E2E WAS WRITTEN AND NONE COULD BE.** No CLI entry point until `EPIC-006`, zero runtime importers
of `src/frame.ts`, `AGENTS.md`'s E2E slot `UNKNOWN - verify`, and no UI surface against
`quality.ui_e2e: ui-or-critical-path`. Reported as a gap rather than filled with a fake.

**Seven tests added, in one block at the end of `src/frame.test.ts` (line 651), NO production line
changed, and no criterion amended.** `git diff --numstat d88a1f0 -- src/` reports exactly one file.
Full detail — the per-criterion table with sole-killer counts, every mutant and its disposition, and
what this gate does **not** establish — is in `.grugops/context/ticket-to-pr-ABC-018/notes/` and is
not restated here. **No `finding` was written**: none is admissible on this task (no §14 gate to issue
a stamp, `context.human_admission` is `off`). Nothing is self-stamped.

## Security / NFR

**VERDICT: `PASS_WITH_RISKS`. `In Security/NFR → Ready for UAT` 2026-08-09 by Security/NFR** (task
`ticket-to-pr-ABC-018`, subtask `security-nfr-abc018-gate`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-018` at `a446297`. `In Security/NFR` 1/2 → 0/2, `Ready for UAT` 0/4 → 1/4;
no limit approached, no override taken. Gated against `security.asvs_level: L1` and
`security.block_on: high`; `compliance_regime` is `[]`, so **no Compliance Officer hand-off is
owed** — recorded rather than silently omitted. **NO REQUIRED FIX IS OUTSTANDING and no
high-severity item exists to block on. Five accepted risks, each with a severity, a NAMED OWNER and
a place.** **Nothing merged and nothing deployed — a human holds both.**

**NOT ONE FIGURE IS INHERITED.** The Engineer measured and QE explicitly declined to re-derive, so
both bars were re-derived here, on instruments written outside the repository. Where this gate
agrees with the Engineer it says so; where it does not, it says that too.

### The measurable SECURITY bar — re-derived on the EMITTED STREAM, at byte level, and MET

21 adversarial strings — every C0 code point in one string, `U+007F`, `ESC[2J`, OSC-0 and OSC-8,
DCS passthrough, **DSR (the sequence that makes a terminal write back)**, alternate screen, 8-bit
CSI and OSC, both ends of the C1 block, a NUL run, CR overstrike, an RTL override, ZWSP and BOM,
combining marks, an astral pair, and the epic's own example rejection text — × **2 glyph modes** ×
**2 strategies**, placed in the **message region** and in a **panel row**:

**0 ESC bytes from supplied data · 0 C0 bytes · 0 `U+007F` · 0 code points above `U+007F` in ASCII
mode · row count CONSTANT at 23 · exactly ONE `write` call per frame (84 frames, 84 writes) ·
exactly the module's own two sequences in place (`ESC[H`, `ESC[0J`) and ZERO in append.**

The whole campaign was re-run under **Node's permission model**, proved **ARMED first** by three
positive controls (fs write, fs read outside the allowlist, child process — all
`ERR_ACCESS_DENIED`), and still completes: the module performs no filesystem operation and spawns
no process while assembling and emitting, so `V1.2.5` and `V1.3.2` pass **on evidence** rather than
on a grep.

**Two instrument faults are recorded rather than buried, and both were in the INSTRUMENT.** The
first run read 42 surviving C0 bytes over 21 in-place frames — ESC is itself a C0 byte and those are
exactly the module's own 2 per frame; append mode read 0 and gave it away. A retyped C1 payload lost
its C1 code point in the editor and measured `"2J"`; the corpus is now referenced by index.

### The C1 question QE routed here — DECIDED, and the answer is that stripping C1 would be theatre

A clean unicode frame with **no supplied text at all** already carries **64 C1-range bytes**, and
the board alone accounts for all 64. **The single 8-bit CSI byte `0x9B` is the black queen** —
`U+265B` encodes as `E2 99 9B`. The whole adversarial C1 payload adds 5 more. Stripping C1 from
supplied strings would remove 5 of 69 and leave 64. **The control that makes unicode mode safe is
the terminal being UTF-8, which is a property of mode selection (`ABC-015`), not of sanitization.**
The measurable bar stays exactly as written; the residual is accepted risk 4.

### `NFR-002` — both halves re-derived, and the WRITE half's `UNKNOWN - verify` is DISCHARGED

Own harness outside the repository, own process, replay and `parseFen` hoisted out of every clock,
the writer built once outside it, a discarded warm-up round, **11 rounds × 2,000 iterations** per
cell, cell order rotated every round, medians of per-round means, a checksum against elision, and
**two fully independent samples**. **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64;
`UNKNOWN - verify` on any other hardware.** Denominator re-derived: a **23-row frame at `W = 18`,
418 characters serialized — 419 characters / 483 BYTES on the wire in unicode, 419 bytes in ASCII,
425 characters in place.**

| Cell | 40 plies | 120 plies | 300 plies |
|---|---|---|---|
| compute (`renderBoard` + `assembleFrame`) | 5.998 / 6.031 µs | 5.978 / 6.015 µs | 6.137 / 6.046 µs |
| write — in memory (a floor: no syscall) | 0.638 / 0.644 µs | 0.636 / 0.635 µs | 0.648 / 0.644 µs |
| write — `fs.writeSync` to `/dev/null` | 1.670 / 1.666 µs | 1.660 / 1.650 µs | 1.674 / 1.672 µs |
| **write — `fs.writeSync` to a regular file** | **2.733 / 2.772 µs** | **2.714 / 2.733 µs** | **2.711 / 2.768 µs** |
| write — `fs.writeSync` to a FIFO with a live reader | 2.317 / 2.294 µs | 2.285 / 2.285 µs | 2.302 µs |

**SUM 0.0087–0.0088 ms against 16 ms — 0.055% of the budget, ~1,800x headroom, MET at every ply
count on every definition; both halves FLAT across 40/120/300**, which is the catalog's `O(window)`
claim measured rather than inferred.

**The Engineer's second routed question is answered: which "write" the row means.** **Ruled — the
row's quantity is `serialize + exactly ONE write(2) to a real non-TTY fd`, judged against the most
expensive honest reading (the regular file).** In-memory omits the syscall the row's own words
require. The FIFO is `EPIC-006`'s pipe shape and is recorded **beside** the row rather than as it,
because a pipe write's cost includes the reader's scheduling and is a property of the pair.

**Where this gate differs from the Engineer it is stated, not smoothed:** compute, the in-memory
sink and `/dev/null` all reproduce inside this gate's two samples; the **regular-file cell reads
~11% higher (2.711–2.772 against 2.43–2.48 µs) and this gate CANNOT attribute it**. **The in-place
path, which the Engineer recorded as NOT timed, is now timed and costs the same** — 1.650–1.690 µs
against append's 1.643–1.671 µs to the same fd, so the 7 extra escape characters are below
instrument resolution. What a real **terminal** does with them stays `UNKNOWN - verify`.

**The one way this bar can be busted today is measured rather than left as a worry.** Cold, first
frame, own process — the shape of a frame assembled once per ply — a short message costs
0.16–0.20 ms, 100,000 characters 3.6–4.3 ms, **400,000 characters 14.1–15.8 ms (the whole budget)**
and 1,000,000 characters **28.4–41.9 ms (1.8x–2.6x over)**. The item count crosses at ~13,000; an
ambiguity list is bounded by the ~218 legal moves of a position and costs 0.13 ms. **A warm
micro-benchmark median reads ~5x lower on that cell and is the wrong instrument for a once-per-ply
frame — recorded as an instrument-limit correction, and no number is claimed from it.**

### The five accepted risks, none unowned, none high

1. **The control sits in the assembler, not in the writer.** A raw row handed straight to the
   writer emits 1 ESC byte; the same payload through `assembleFrame` emits 0. **LOW** — no
   untrusted consumer in-process, zero runtime importers. **No change asked for**: the split is
   this ticket's own VALUE/SESSION design. Owner **`ABC-019`** (the only future call site).
2. **No bound on a supplied item's length** — the 400,000-character measurement above. **MEDIUM**
   (`V2.2.1` by analogue; not a live L1 failure, because nothing supplies this input yet). Owner
   **BA/PM at `EPIC-003`**. Inventing a bound here is the unrequested flexibility rule 7 forbids.
3. **`mode` is an unchecked erased union and it fails OPEN.** `"ascii"` gives 0 code points above
   `U+007F`; `"unicode"`, `"ASCII"`, `""`, `undefined`, `null`, `0` and a plain object all give 34.
   `selectGlyphMode` fails **safe** to ASCII on ambiguity; `assembleFrame` fails **open**. Third
   appearance of this class on this board. **LOW** — the only producer is `ABC-015`'s closed
   two-literal domain. Owner **`EPIC-006`**.
4. **A forced `--unicode` on a terminal that is not UTF-8.** `ABC-015`'s rule row 2 lets the flag
   beat the locale, so the mismatch is constructible, and the frame then carries 64 C1-range bytes
   from its own glyph table. **LOW**, and **not fixable in this module**. Owner **`EPIC-006`**.
5. **The message region cannot display the epic's own example rejection text.** At the real
   `W = 18`, `["no piece on that square"]` renders as `["", "(+1 more)"]` — the player is told
   something was withheld and never what. `"illegal move"` and `"e2e4 is illegal"` do fit. This
   conforms to every criterion and to `## Scope`, so it is a **design** gap, not a defect — and it
   is the diagnosability shape a risk gate is required to look for. **MEDIUM, and the severity is
   explicitly NOT an ASVS-derived one; no ASVS default severity was overridden in either
   direction.** Owner **BA/PM**, place `ABC-016`/`ABC-017` (which set `W`) and `EPIC-003`.

### A boundary found, located exactly, and shown to be unreachable

*"No emitted row exceeds `W`"* is a display invariant. The `(+N more)` marker is emitted unpadded
and untruncated, so at `W ≤ 8` the region row exceeds `W`. It cannot fire while the merged
`renderBoard` is in the frame — `W` is the max over panel rows and `renderBoard` is always 18 wide,
and the marker reaches 19 characters only at `N ≥ 10^10` supplied items. **A fence, not a risk, and
no change is asked for.**

### ASVS L1, counted at the source

**70 active requirements; `V16` and `V17` carry no L1 requirement at all — checked, not assumed.**
`V1.2.1` **PASS by analogue on evidence** (the terminal-sink bar above — this change's one real
engagement) · `V1.2.5`, `V1.3.2` **PASS on evidence** under the permission model · `V2.1.1` **PASS**
(this ticket's `## Scope` and `## Security / NFR triggers` *are* the documented input-validation
rule, with a measurable bar) · `V2.2.1` **PASS** on the message text, with risks 2 and 3 recorded
rather than waived · `V2.2.2` **PASS by analogue** with risk 1 named · `V15.3.1` **PASS by
analogue** · `V1.2.2`/`V1.2.3`/`V1.2.4`/`V1.3.1`/`V1.5.1` **not engaged** · `V13.4.1` **DEFERRED**,
unchanged and not relaxed · `V15.1.1`/`V15.2.1` **NOT MET**, the carried `high → low` override
restated with its evidence re-checked here (`dependencies` is `{}`, `package.json` untouched on
this branch), owner Architect/Design at `EPIC-006` · the remaining chapters structurally N/A. **`V7`
Session Management is N/A and is named rather than skipped because the keyword matches:**
`beginFrameSession` is a process-lifetime strategy constant; ASVS "session" means an authentication
session with a token.

### Two probes that produced bounds rather than risks

**The prototype-chain gadget, with a live null control in both directions** (the third on this
board): unpolluted with `messages` genuinely absent, `assembleFrame` **throws**; with
`Object.prototype.messages` polluted it assembles and displays the attacker's text; with the
pollution deleted it throws again. So pollution turns a loud crash into a silent success — and it is
**bounded**: the sanitizer runs over whatever the property yields, so the emitted stream still
carries **zero** ESC bytes. **Pollution can inject text, never an escape**, and there is no sink —
every computed-key write in non-test `src/` is a numeric array index, with no `__proto__`, no
`Object.assign`, no `JSON.parse` and no merge anywhere.

**Failure modes and logging.** This module logs nothing and there is no logging anywhere in this
project. It throws `TypeError` on a missing panel, a non-array `messages` and a non-string row or
item; a sink whose `write()` throws (**EPIPE — a reader that closed early, which is exactly
`EPIC-006`'s pipe shape**) propagates uncaught. **No error handling is asked for here** — guarding
calls that cannot fail through the only future caller is the impossible-scenario handling rule 8
forbids — but `ABC-019` and `EPIC-006` own the enclosing loop and should know the frame write is a
throw site. **One fail direction is a positive:** a nonsense height makes `(sink.rows ?? 0) >= h`
false, so the writer **appends** and emits zero cursor control. The strategy choice fails safe.

### Gates, re-run on the tip by this role

`npm run lint` exit **0** (the 2 infos are the pre-existing `biome.json` notices, untouched) ·
`npm run typecheck` exit **0** · `npm run build` exit **0** · `npm test` exit **0**,
**304/304 on 14 files** · skip count **0** by the `AGENTS.md` command · **test-integrity checker
exit 2** (`.grugops/test-skips.md` absent) — the checker *could not run*, recorded as an error and
**not** as a pass, and **no registry file was created** · **E2E and auto-UAT oracles
`UNKNOWN - verify`**. **No `--coverage` run was made**, so the tracked `coverage/` hazard never
arose and the 100% figure stays QE's rather than being restated as this gate's.

**NO PRODUCTION CODE AND NO TEST WAS CHANGED.** `git diff --stat -- src/` is empty and
`src/frame.ts` still hashes **`bb827f52fe537817e40020a29dfa0e6d`** — the Engineer's first-commit
digest this board's merge record checks. Repairing the implementation to make this gate's own
verdict come out green is not this role's, and there was nothing to repair.

**UAT is DEFERRED to `EPIC-006` and explicitly NOT passed** — zero runtime importers (verified
here), no `bin`/`main`/`exports`/`start`, no CLI entry point, so there is no surface a human can
exercise. **This gate attached no terminal and claims none.** No acceptance criterion was amended —
that is the `Backlog` exit — and no ticket other than this one was touched. **No `finding` was
written**: none is admissible on this task. Nothing is self-stamped, and no `index.md` /
`index.jsonl` was hand-faked.
