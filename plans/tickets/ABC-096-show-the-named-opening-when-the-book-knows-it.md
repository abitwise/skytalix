---
id: ABC-096
title: Show the name of the opening being played when the book knows it — inside the existing frame's row identity, and with book-supplied text treated as untrusted
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-005
feature: —
---

# ABC-096 — the one cosmetic bullet in the epic, and the only one that puts third-party text on the terminal

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-005`, Workflow 03) from
> `plans/epics/EPIC-005-opening-book.md` § Scope bullet 5 — *"display which named opening is being
> played, when known"* — the epic's shortest line and its only user-visible-but-not-load-bearing
> one. **It is cut separately and priced `P3` so it can be dropped without touching the rest of
> `EPIC-005`. If the epic has to shed scope, shed this.**

## Problem

*User*: the player who wants to know they are in a Ruy Lopez, and the player learning openings —
`EPIC-005` names them by name (*"Ruy Lopez, Italian, Sicilian, Queen's Gambit"*) because a book move
the player cannot name teaches them nothing.

*Pain*: the book will know the name and throw it away at the frame boundary.

*Value*: small, real and genuinely optional. **What is not optional is the way it is done** — this
is the first time text that **no human in this project typed** reaches the terminal, and this
repository already has a measured security bar about exactly that (`plans/nfr-catalog.md`,
`ABC-018`'s gate: *"0 ESC bytes from supplied data, 0 C0 bytes, 0 `U+007F`, 0 code points above
`U+007F` in ASCII mode, row count constant at 23"*). **That bar was written for player input. A
book-supplied opening name is the same class of input arriving through a new door.**

## Scope

- Read the opening name for the current position from the book (`ABC-093` carries it; `ABC-094`
  exposes it).
- Render it in the existing frame — **without adding a row** (see `A2`).
- Decide and implement what is shown when the name is unknown or the game has left book.
- Sanitize and bound the name before it reaches the frame.

## Out of scope

- **Adding a row, a pane or a panel to the frame.** See `A2` and § Dependencies — `ADR-0009` fences
  the frame's row identity and this ticket is not the place to re-open it.
- **ECO codes, opening statistics, transposition detection, or naming a line the book does not
  name.** If the source has no name for a position, this ticket shows nothing — it does not infer.
- **Anything to do with the engine, the search or `EPIC-004`.** This ticket needs none of them: the
  name is a function of the **current position** and the book, so it works while the human is still
  moving.
- **Changing the book's contents or format.** `ABC-093`'s.

## Acceptance (Given/When/Then)

*Amended 2026-10-17 by BA/PM (subtask `bapm-rescore-ABC-096`) to `ADR-0043`. The criteria below are the contract.
What each one replaced is in § Re-score — 2026-10-17 and in git. "Frame" means rows returned by
`makeRenderSeam(mode, orientation, book)(history, status, thinking, messages)`. "Shown name" means the text in
message row 1, after `sanitize` and padded to `W`. Every display criterion is asserted on the emitted frame, never on a
helper's return value (test note 1).*

- **`A1` (the name appears when the book knows it).** **Given** a position whose book entry carries `n` as a
  non-empty string, **when** a frame is rendered with `messages` = `[]`, **then** message row 1 holds the shown name
  and message row 2 is blank. The shown name is the name's **family**: the text before the first `": "`, or the
  whole name when it has none.
  - A family of **≤ 21** (`HISTORY_COLS`) UTF-16 code units is shown whole.
  - A longer family is shown as its leading whole code points, filling at most **18** code units, followed by
    `...`.
  - An empty family is no name.
  - Examples: key `75a8cd2e62c99edd` shows `Ruy Lopez`. The book's longest families show 21 characters ending in
    `...`, for example `King's Gambit Acce...`.
  - *(2026-10-12: "family", not "exact name". 2026-10-17: the width is counted in code units, the unit
    `src/frame.ts` `packRegion` measures, without splitting a code point. For all 149 families in the shipped book
    this gives the same text as counting code points, because no name holds an astral code point.)*
- **`A2` (THE ROW IDENTITY DOES NOT MOVE — the load-bearing criterion).** **Given** frames rendered with a known
  name, with no name, and out of book, **then** all three have the **same row count**, equal to the frame's row
  count on `main` before this ticket (**23**). *(`ADR-0009` `= 23` tripwire, `≤ 24` requirement. The name uses the
  existing 2-row message region (`ADR-0043` D4), so no row is added.)*
- **`A3` (untrusted text is neutralised; the numbers are inherited from the measured bar, not invented).**
  **Given** a book double whose name contains each of these: an ESC byte, a C0 control byte, `U+007F`, a code
  point above `U+007F`, and a newline, **when** the frame is rendered, **then** the emitted frame contains **0**
  ESC bytes from the name, **0** C0 bytes, **0** `U+007F`, **0** code points above `U+007F` in ASCII mode, and the
  row count is **unchanged**.
- **`A4` (the field is bounded, so an absurd name cannot cost the frame budget).** **Given** a name of
  **100,000** characters, built in the test, **when** the frame is rendered in each mode, **then**:
  - the shown name is **≤ 21** code units;
  - the frame's `W` is the same with and without the name;
  - the row count is unchanged;
  - the frame renders in **< 16 ms** (`NFR-002`).
  - **The same holds for a name built of code points above `U+FFFF` in unicode mode. In that case the message
    region also carries no `(+N more)` marker, and no row holds a lone surrogate.** *(Added 2026-10-17. Measured
    at `8ed9ba2b`: an item of 21 astral code points is 42 code units. In unicode mode `packRegion` drops it and
    prints `(+1 more)`, which says a message is hidden when none is. `ADR-0043` Alternative 4 rejects exactly
    that.)* *(`plans/nfr-catalog.md`: an unbounded 400,000-character string costs the whole 16 ms budget.)*
- **`A5` (leaving book does not lie). DECIDED 2026-10-17: the shown name belongs to the current position, or there
  is none.** "Last known" is not buildable at `S` (`ADR-0043` D5).
  - **Given** a game that leaves the book at ply *n*, **when** the frame for each ply is rendered with
    `messages` = `[]`, **then** it shows a name exactly when the book names the position on the board:
    - the last named position of a line shows its name, including an entry whose `m` is empty;
    - from the first position the book does not name, the message region is blank.
  - **Given** a frame of a named position, then a `takeBack` (or a new game) back to a position the book does not
    name, **then** that frame shows nothing. Back on a named position, its own name shows again. The seam keeps
    no state between frames.
- **`A6` (nothing outside the display path moved).** **Given** the delivered diff, **then**:
  - `data/opening-book/` and `tools/` are byte-identical;
  - `src/book.test.ts` runs **unmodified** and green;
  - `inBook` and `bookMove` return the same results;
  - the warning count is unchanged.
  - `src/book.ts` may change only to keep `n` and to add `openingName(position): string | undefined`.
    `openingName` also reads names on the **1,764** entries whose `m` is empty. Those positions stay out of book:
    `inBook` is still `false` and `bookMove` still returns no move.
  - Framing calls `random` **0** times. Test it with a counting `random` double over a run of frames.
  - *(2026-10-12: `src/book.ts` may keep `n`. 2026-10-17: names on entries with an empty `m`, and no draws from
    `random`, both per `ADR-0043` D2.)*
- **`A7` (a name that is not a string is no name).** **Given** an artifact whose entry carries `n` as a number,
  an object, or an empty string, **when** that position is framed, **then** no name is shown, its book moves are
  still served, and **0** additional warnings are emitted. The artifact is not refused because of a bad `n`.
- **`A8` (one probe per process).**
  - **Given** the artifact absent, **when** a real session runs from launch to `quit`, **then** stderr carries the
    book warning **exactly once**.
  - **Given** `src/cli.ts`, **then** it contains exactly **one** `createBookProbe(` call, and its `render:` line is
    `render: makeRenderSeam(mode, orientation, book)`, with the same `book` binding the engine decorator gets.
    `ABC-043` `A1`'s pin moves to that text and stays free of `=>`.
  - **Given** `src/render-seam.ts`, **then** the third parameter is **required** and typed
    `Pick<BookProbe, "openingName">`, and `BookProbe` is imported with `import type` only.
- **`A9` (the player's own feedback wins the message region)** *(added 2026-10-17, `ADR-0043` D4)*. **Given** a
  position the book names, **when** a frame is rendered with one or more message items (a rejection line, an
  ambiguity list, command output, a take-back line, the claim shortfall), **then**:
  - the frame is **byte-identical** to the frame the same call produces with a book that names nothing;
  - `openingName` is called **0** times for that frame.
  - **When** `messages` is `[]`, `openingName` is called **once** per frame, and the region holds the shown name
    and no `(+N more)` marker.
- **`A10` (the frame-path guard sees the lookup)** *(added 2026-10-17, `ADR-0043` D6)*. **Given** the per-frame
  phase of `src/history-pane.nfr.test.ts`, **then**:
  - its seam is built with a **real** `createBookProbe` over **in-memory** bytes;
  - those bytes name at least one position that phase frames, for example the start position's key;
  - `book.ts` is imported before the recorder clears;
  - a positive control asserts that at least one of the phase's frames carries that name;
  - the probe child reads no file, no new spawn is added, and the guard stays green.

## Dependencies

- **`ABC-093` — HARD BLOCKER.** The name must be in the artifact. **If `ABC-093`'s format decision
  omits the name field, this ticket is unbuildable** — flagged there in its § Dependencies.
  *(2026-10-10: discharged. `ADR-0037` D1(d) carries the name inline as `n`, on the entry where a
  source line ends, at ≤ 12 plies. 1,012 of 3,865 source names belong to lines past 12 plies and are
  not in the artifact. This page's "does not infer" rule already shows nothing there.)*
- **`ABC-094` — HARD BLOCKER.** The lookup path.
- **`ABC-092` — transitive**, and with an extra edge: **opening names may themselves be part of what
  the source licence covers.** Named here so it is not discovered at the gate.
- **The frame path — `src/frame.ts`, `src/render.ts`, `src/status-panel.ts` on `main`** (read at
  this hop). **`ADR-0009`'s row identity is the constraint**, and `src/frame.ts` imports nothing —
  a frame is composed by **injection**, so frame membership is not derivable from the module graph
  (`plans/nfr-catalog.md`, `NFR-002` section). Whoever builds this reads that section first.
  *(2026-10-17: ruled by `ADR-0043`. The name enters through `src/render-seam.ts` as an injected probe. See
  § Build contract.)*
- **`EPIC-004` — NOT a dependency.** The name is a function of the position, not of the engine.
- **`ABC-095` — NOT a dependency.** Recorded explicitly: this ticket is buildable and shippable
  while the engine does not exist, and delivers a real (if small) player-visible feature.
  *(2026-10-17: `ABC-095` has landed. The build reuses its one `const book = createBookProbe({…})` in
  `src/cli.ts` (`A8`). That is a code fact, not an ordering blocker.)*

## Security / NFR triggers

- **Terminal-escape injection from third-party data — the reason this ticket is not `XS`.** `A3`'s
  bar is transcribed from the measured bar in `plans/nfr-catalog.md`'s `NFR-002` section, not
  invented. **The C1 finding recorded there applies and must not be misread**: a clean unicode frame
  already carries 64 C1-range bytes from the module's own glyph table, so **do not "fix" C1 by
  stripping it** — that ruling calls it theatre, and the control that makes unicode mode safe is
  mode selection (`src/glyph-mode.ts`), not sanitization. *(2026-10-10: `ADR-0037` D1(f)'s compiler
  refuses a C0, DEL or ESC byte in a name. That is defence in depth only; `A3` still binds here.)*
- **`NFR-002` — < 16 ms per full frame. TRIGGERED.** This ticket adds text to the frame path.
  `A4`'s bound is what keeps it met; the delivering hop measures the frame with the name present
  and records the figure with its machine. *(2026-10-17, `ADR-0043` D7: the lookup costs about +0.33 µs on an
  8.25 µs frame and is `O(1)` in plies. `NFR-002`'s `O(window)` statement stands. `A10` keeps the lookup inside
  the frame-path guard.)*
- **`ADR-0009` row identity — `= 23` tripwire, `≤ 24` requirement.** `A2`.
- **`NFR-008` (per-ticket ≤ 650 ms CPU).** **Target: ~~≤ 1~~ 0 new test files** *(2026-10-17, `ADR-0043`)*,
  **0 new spawned processes.** `A3`'s adversarial matrix is in-memory strings — cheap.
- **`NFR-007` (`npm run chess` to the first rendered board in < 2 s) — TOUCHED** *(2026-10-17, `ADR-0043`
  D7; was "not triggered", which is wrong under this design)*.
  - The probe's one lazy parse moves from the engine's first ply to just before frame 0. The Architect measured
    **+6.4–6.9 ms** in a fresh process, and **24.4 ms** on one run with a cold disk cache. That is
    `UNKNOWN - verify` on any other machine.
  - **Target:** the probe's first call, now made before frame 0, stays within `ABC-095` `A2`'s existing bar of
    **≤ 30 ms cold**. `NFR-007`'s `< 2 s` does not move.
  - **Security/NFR measures it on the delivered build**, outside the suite, and records the figure and the
    machine in notes.
  - A reading over 30 ms is raised to Architect/Design. It is grounds to re-open `ADR-0043` D1 (its § Rollback),
    and it is not to be absorbed silently.
- **`NFR-006`, `NFR-004`, `NFR-005` — not triggered.** No artifact size change, and no
  search. *(If the name is stored as a per-entry string rather than a side table,
  it does change the artifact's size — that is `ABC-093` `A5`'s bar, not this ticket's.)*
  *(2026-10-10: inline names cost about 144,925 B of the 356,295 B estimate, 211,370 B without them
  (`ADR-0037`), inside that bar.)*

## Test notes

1. **Assert on the emitted frame, not on the accessor.** The security bar is about bytes on the
   wire; a test that checks the sanitizer's return value and never renders proves nothing.
2. **`A4`'s 100,000-character name must be constructed in the test, not stored.** No 100 KB fixture
   file in the repository.
3. **Snapshots: this project has `src/__snapshots__/`.** A new name field will move snapshots. Move
   them deliberately and read the diff — an accepted snapshot is not a test. *(2026-10-17: none should move.
   `src/__snapshots__/` holds only the board and status-panel snapshots (`ADR-0043`). A moved snapshot is a red
   to explain, not to accept.)*
4. **Do not widen the frame to fit a name.** Width is a frame contract (`W = 18`, 23 rows, 418
   characters measured); a `P3` cosmetic field does not get to change it. *(2026-10-12: 18 is the
   board's width. The frame's `W` at the start position is **21**, set by `HISTORY_COLS`, measured at
   `1eb2edbc`.)*
5. ~~**`A5`'s choice — last-known vs blank — is a product decision this ticket's author may take,
   provided it is written down and tested.**~~ **Decided 2026-10-17: the current position's name, or nothing**
   (`A5`, `ADR-0043` D5). The Engineer does not re-open it.
6. **Traps the build will hit** *(2026-10-17)*. All of them were read at `8ed9ba2b`.
   - **The digit pin.** `src/render-seam.ts`'s executable text, with comments removed, may hold no digit
     (`src/render-seam.test.ts`, `ADR-0009` clause 9). So the cut is written as
     `HISTORY_COLS - ELLIPSIS.length`, with `ELLIPSIS = "..."` declared in the seam.
   - **The source-text bans.** `src/cli.ts` is scanned with its comments included (`src/cli.test.ts`,
     "bar 1"). The corrected comment at lines 173–176 must not contain `eval` (so not "evaluate"), `Function(`,
     `child_process`, `import(`, `fetch`, `WebSocket` or `XMLHttpRequest`.
   - **Test frames.** Test call sites pass a one-method double, for example `{ openingName: () => undefined }`.
     The helper at `src/cli.test.ts:196` that renders an expected CLI frame needs a double that agrees with
     what the spawned child shows.
   - **Spawned CLI children.** A child that reaches a named position with an empty message region now shows a
     name in message row 1. The `ABC-119` `CLI_DEEP` lane runs on a copy without the book, so it should show
     none. Run the full lane and `CLI_DEEP=1`, and read every red.

## Lane cost — how many test FILES this ticket implies

~~**One**, or zero~~ **Zero new files** *(2026-10-17, `ADR-0043`)*. Four existing files are edited (§ Build
contract). Per `NFR-008` a test **file** costs 159–179 ms CPU against 0.35–0.43 ms per assertion.

## Build contract — `ADR-0043`, and the code fence

*Added 2026-10-17. `ADR-0043` D1–D7 is the authority. This section is its build checklist, not a second
design.*

**The seam.**
- `makeRenderSeam(mode, orientation, book)`, with `book: Pick<BookProbe, "openingName">`, required.
- `RenderSeam`'s type does not change, and `src/turn-loop.ts` does not change.
- **Precedence:** if `messages` is non-empty, it passes through unchanged, and no lookup is made (`A9`).
  Otherwise the seam passes `[shownName]`, or `[]` when the position has no name.
- **The shown name** is the family, cut per `A1`. Digit-free (test note 6). It is neutralised only by
  `assembleFrame`'s existing `sanitize`. **No second sanitizer is written.**
- **No state** is held between frames (`A5`).
- **The header.** The "IT DERIVES NOTHING" paragraph gains one sentence: the seam derives nothing from the
  game's history, and makes one constant-cost lookup through the probe it was given.

**The probe.** `BookProbe` gains `openingName(position): string | undefined` (`A6`, `A7`).
- It returns `n` only when `n` is a non-empty string, and emits no warning otherwise.
- It reads names on entries whose `m` is empty.
- It shares the one lazy load, and it calls neither `legalMoves` nor `random`.

**The root.** In `src/cli.ts`, the `render:` line becomes `makeRenderSeam(mode, orientation, book)` (`A8`), and
the comment at lines 173–176 ("Nothing is read until the engine's first ply asks") is corrected.

**Code fence: the files a build may touch** (`ADR-0043` § Consequences).

| file | what changes |
|---|---|
| `src/book.ts` | keep `n`; add `openingName` |
| `src/render-seam.ts` | third parameter, precedence, family and cut, header sentence |
| `src/cli.ts` | the `render:` line, the stale comment |
| `src/render-seam.test.ts` | `A1`–`A5`, `A7`, `A9` on emitted frames; 2 call sites |
| `src/history-pane.nfr.test.ts` | the per-frame seam over a real probe (`A10`) |
| `src/cli.test.ts` | the `ABC-043` `A1` pin and `A8`; 3 call sites |
| `src/book-engine.test.ts` | 1 call site |
| this page, `plans/traceability.md`, `.grugops/context/<task>/notes/` | delivery records |

- **Must not change:** `src/frame.ts`, `src/turn-loop.ts`, `src/book.test.ts`, `src/book-file.ts`,
  `src/book-engine.ts`, `src/__snapshots__/`, `data/opening-book/`, `tools/`.
- **No new file**, no new dependency and no new spawn.
- **If a red can only be fixed outside this fence, stop and raise it with the Orchestrator.** Do not widen the
  fence on the build's own authority.

## UAT observations for the owner

*Added 2026-10-17. UAT is NOT waived: this ticket writes production lines, and the owner accepts it by trying it.
The Orchestrator accepted effects 1 and 2 under the owner's delegation (`…abc096-product-calls-21ce2dfa`).
They are written here so the owner sees them at UAT rather than discovering them.*

1. **The name flickers. Accepted.** Only named positions show a name, which is 62.6 % of in-book positions. So in
   a book game the name appears and disappears about **3 times** (`ADR-0043` D5).
   - **Observe:** as White, play `1. e4 e5 2. Nf3 Nc6 3. Bb5`. The engine's replies are weighted book draws, so
     reaching this line may take more than one game. The name runs `King's Pawn Game`, then
     `King's Knight Opening`, then `Ruy Lopez` (checked against the book at `8ed9ba2b`).
   - **Observe:** a rejected move replaces the name with the rejection line for one frame. The name comes back on
     the next frame that carries no message (`A9`).
   - If the owner finds the flicker unacceptable, that is a **new ticket** (`M`, "last known"), not a re-open.
2. **The missing-book warning is overdrawn by frame 0 on an in-place terminal. Accepted.** It is now written just
   before frame 0, and frame 0's cursor-home and per-row erase overwrite it. This was derived, never run on a real
   terminal (`UNKNOWN - verify`).
   - **Observe:** move `data/opening-book/book.json` aside, run `npm run chess`, and confirm whether the warning
     is visible. Then run `npm run chess 2>warn.txt`: `warn.txt` holds the warning **exactly once** (`A8`,
     `ABC-095` `A5`).
   - Restore the file afterwards.
3. **ASCII mode drops accented letters. Accepted 2026-10-12 by BA/PM.** `sanitize` removes code points above
   `U+007F`, so `Grünfeld Defense` shows as `Grnfeld Defense`. That affects 5 of the 149 families. It is safe
   (`A3`), and transliteration is out of scope.
   - **Observe:** `npm run chess -- --ascii` as White, `1. d4 Nf6 2. c4 g6 3. Nc3 d5`. The book names this position
     `Grünfeld Defense`.

## Size and priority rationale

**Size `S`.** One display field. **Not `XS`**: it touches the frame path, which in this repository
carries `NFR-002`, `ADR-0009`'s row identity, a snapshot suite and a measured escape-sequence
security bar — four fences around one string. **Not `M`**: no new module, no new data, no new
dependency, and the fences are all documented and testable.

**Priority `P3`.** It is a label on a feature that works without it; every acceptance clause of
`EPIC-005` except the scope bullet itself passes with this ticket dropped. **Not `P2`**: nothing
downstream waits on it. **Promote to `P2` if `ABC-093`'s format decision would have to be re-opened
to add the name later** — retrofitting a field into a shipped artifact format is the one thing that
makes this expensive, and that trigger is the reason it is cut now rather than later.
*(2026-10-10: the trigger does not fire. The format carries the name (`ADR-0037` D1(d)). `P3`
holds.)*

*(2026-10-17: **`S` holds** under `ADR-0043`. `RenderSeam`'s type and `src/turn-loop.ts` are unchanged; the build
touches 3 production files, edits 4 test files and creates none. **`P3` holds.** Nothing downstream waits on
it, and it is still the epic's droppable bullet.)*

## Definition of Ready

**History**, scored against `agent-factory/checklists/definition-of-ready.md`. The full text of each earlier
re-score is in git at `8ed9ba2b` and in its notes. *Folded here 2026-10-17 under the ticket-prose budget
(`AGENTS.md` process rule 2).*

| date | hop | score | open item | readings |
|---|---|---|---|---|
| 2026-08-16 | BA/PM cut (`epic-to-tickets-EPIC-005`) | 8/10 | 5: format must carry the name; 10: ordering on `ABC-093`/`ABC-094` | this page at cut |
| 2026-10-10 | BA/PM fold (`bapm-fold-book-chain-2026-10-10`, `4768b3b0`) | 9/10 | 10: ordering | `.grugops/context/bapm-fold-book-chain-2026-10-10/notes/` |
| 2026-10-12 | BA/PM re-score (`bapm-rescore-backlog-product`, `1eb2edbc`) | 9/10 | 10: the Architect/Design seam question. Added the family cut, `A7`, `A8` | `.grugops/context/bapm-rescore-backlog-product/notes/` (`…4f1a9c27`, `…8b3e60d1`) |
| **2026-10-17** | **BA/PM re-score (`bapm-rescore-ABC-096`, `8ed9ba2b`)** | **10/10** | **none** | `.grugops/context/bapm-rescore-ABC-096/notes/` |

## Re-score — 2026-10-17

BA/PM (task `wave-2026-09-25`, subtask `bapm-rescore-ABC-096`, Workflow 07), at `main` `8ed9ba2b`, against
`ADR-0043` and the Orchestrator's product calls (`…abc096-product-calls-21ce2dfa`, made under the owner's delegation
`…a793f166`). **Result: 10 of 10. `S` and `P3` hold.** The column move is the Orchestrator's.

**What was re-measured at `8ed9ba2b`**, by scratch scripts outside the repository, reading `src/` and the book read-only
(note `…observation`):
- The book counts all equal `ADR-0043`'s:
  - 5,390 entries, 2,853 named, 1,764 with an empty `m` (all of them named);
  - 149 families: 31 longer than 21 characters, 5 holding a code point above `U+007F`, 0 holding an astral code
    point;
  - key `75a8cd2e62c99edd` is `Ruy Lopez`.
- The frame is 23 rows with `W` = 21 in both modes.
- `makeRenderSeam` has 6 test call sites. The `ABC-043` `A1` regex does not match a three-argument call, so the
  pin must move.
- **NEW: an item of 21 astral code points is dropped in unicode mode, and the region prints `(+1 more)`.**

**What changed on this page:**
- `A1`: the cut is counted in code units.
- `A2`: the message region named.
- `A4`: the astral case, with no false marker.
- `A5`: decided as "current position's name or nothing".
- `A6`: names on entries with an empty `m`, and 0 draws from `random`.
- `A8`: the wiring line and the type.
- New `A9` (precedence) and `A10` (frame-path guard).
- `NFR-007` is now touched, with a ≤ 30 ms target.
- `NFR-008`: 0 new files.
- Test notes 3, 5 and 6.
- § Build contract with the code fence.
- § UAT observations.
- The older DoR narration is folded into the history table.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ the code fence names what must not change |
| 3 | INVEST-shaped | ✅ still independent and droppable; `ABC-095` has landed and is reused, not waited on |
| 4 | acceptance testable and measurable | ✅ `A1`–`A10` on emitted frames: counts (21 units, 23 rows, 0 calls, 1 warning), byte identity, < 16 ms |
| 5 | dependencies known | ✅ `ADR-0043`; `ABC-093`/`094`/`095` merged |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-002` < 16 ms; `NFR-007` touched, ≤ 30 ms first call, < 2 s; `ADR-0009` = 23; the escape bar; `NFR-008` 0 files |
| 7 | test notes present | ✅ six, including the traps |
| 8 | size assigned | ✅ `S`; the re-size trigger did not fire (`ADR-0043` D1) |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ✅ **item 10 discharged by `ADR-0043`**. The astral gap is closed in `A1`/`A4` by `ADR-0043`'s own stated intent (D3: "an item that fits is never dropped"); see the note |

**Recommendation:** `In Design` → `Ready for Dev` (0/6), after the Orchestrator's `Ready for Dev`-exit criteria
re-read (`AGENTS.md` process rule 1). The page is also still the epic's droppable bullet.
