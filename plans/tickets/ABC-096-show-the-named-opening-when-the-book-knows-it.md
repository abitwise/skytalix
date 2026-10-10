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

- **`A1` (the name appears when the book knows it).** **Given** a position the book names, **when**
  a frame is rendered, **then** the frame contains that exact name.
- **`A2` (THE ROW IDENTITY DOES NOT MOVE — this is the load-bearing criterion).** **Given** frames
  rendered with a known name, with no name, and out of book, **then** all three have the **same row
  count**, equal to the frame's row count on `main` before this ticket. *(`ADR-0009` puts a `= 23`
  tripwire and a `≤ 24` requirement on that identity, derived from `renderBoard(...).length`,
  `STATUS_ROWS` and `HISTORY_ROWS`. If the name cannot be fitted into an existing region, **stop and
  raise it with Architect/Design** — do not spend the `≤ 24` headroom on a `P3` cosmetic field on
  this ticket's own authority.)*
- **`A3` (untrusted text is neutralised — the numbers are inherited from the measured bar, not
  invented).** **Given** an opening name containing each of: an ESC byte, a C0 control byte,
  `U+007F`, a code point above `U+007F`, and a newline, **when** the frame is rendered, **then**
  the emitted frame contains **0** ESC bytes from the supplied name, **0** C0 bytes, **0**
  `U+007F`, **0** code points above `U+007F` in ASCII mode, and the row count is **unchanged**.
- **`A4` (the field is bounded, so an absurd name cannot cost the frame budget).** **Given** a name
  of **100,000** characters, **when** the frame is rendered, **then** the rendered name occupies
  **≤ the field's declared width**, the row count is unchanged, and the frame still renders in
  **< 16 ms** (`NFR-002`). *(`plans/nfr-catalog.md` measured an unbounded supplied string at
  **400,000 characters = 14.1–15.8 ms, the WHOLE 16 ms budget**, and 1,000,000 characters at
  1.8–2.6× over. That is why this criterion exists and why the bound is structural, not a comment.)*
- **`A5` (leaving book does not lie).** **Given** a game that leaves the book at ply *n*, **when**
  the frame at ply *n* is rendered, **then** the displayed name is either the last known opening
  name **or** nothing — **and which one it is, is stated in the ticket's delivery note and tested.**
  *(Both are defensible. What is not defensible is it being accidental.)*
- **`A6` (nothing outside the display path moved).** **Given** the delivered diff, **then** the book
  artifact, the compiler and the probe's public behaviour are **unchanged** — 0 lines in
  `ABC-093`'s and `ABC-094`'s deliverables other than, at most, an added read-only accessor.

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
- **`EPIC-004` — NOT a dependency.** The name is a function of the position, not of the engine.
- **`ABC-095` — NOT a dependency.** Recorded explicitly: this ticket is buildable and shippable
  while the engine does not exist, and delivers a real (if small) player-visible feature.

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
  and records the figure with its machine.
- **`ADR-0009` row identity — `= 23` tripwire, `≤ 24` requirement.** `A2`.
- **`NFR-008` (per-ticket ≤ 650 ms CPU).** **Target: ≤ 1 new test file, 0 new spawned processes.**
  `A3`'s adversarial matrix is in-memory strings — cheap.
- **`NFR-006`, `NFR-004`, `NFR-005`, `NFR-007` — not triggered.** No artifact size change, no
  search, no startup path. *(If the name is stored as a per-entry string rather than a side table,
  it does change the artifact's size — that is `ABC-093` `A5`'s bar, not this ticket's.)*
  *(2026-10-10: inline names cost about 144,925 B of the 356,295 B estimate, 211,370 B without them
  (`ADR-0037`), inside that bar.)*

## Test notes

1. **Assert on the emitted frame, not on the accessor.** The security bar is about bytes on the
   wire; a test that checks the sanitizer's return value and never renders proves nothing.
2. **`A4`'s 100,000-character name must be constructed in the test, not stored.** No 100 KB fixture
   file in the repository.
3. **Snapshots: this project has `src/__snapshots__/`.** A new name field will move snapshots. Move
   them deliberately and read the diff — an accepted snapshot is not a test.
4. **Do not widen the frame to fit a name.** Width is a frame contract (`W = 18`, 23 rows, 418
   characters measured); a `P3` cosmetic field does not get to change it.
5. **`A5`'s choice — last-known vs blank — is a product decision this ticket's author may take,
   provided it is written down and tested.** It is small enough not to need a ruling; it is not
   small enough to be left implicit.

## Lane cost — how many test FILES this ticket implies

**One**, or zero if the assertions fit an existing frame/status-panel test file. Per `NFR-008` a
test **file** costs 159–179 ms CPU against 0.35–0.43 ms per assertion — **prefer adding to an
existing file.**

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

## Definition of Ready

**RE-SCORED 2026-10-10 by BA/PM at the fold** (task `wave-2026-09-25`, subtask
`bapm-fold-book-chain-2026-10-10`, at `4768b3b0`; `ADR-0037` folded per `…d06f5ba8`). **Result: 9 of
10, ⚠️x1 (item 10). It stays in `Backlog`.** Readings:
`.grugops/context/bapm-fold-book-chain-2026-10-10/notes/`.

- **Item 5 ⚠️ → ✅.** The format carries the name inline (`ADR-0037` D1(d)).
- **Item 10 ⚠️ STANDS, ordering only.** `ABC-093` and `ABC-094` are unbuilt. **Re-score trigger:
  `ABC-094`'s merge.**
- **Size `S` and `P3` hold.** The promotion trigger does not fire.

**History.** Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 8 of 10 — items 5 and 10 carry a ⚠️; the other eight are MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; the value is honestly described as small and optional |
| 2 | scope and out-of-scope clear | **✅** four in, four out; "no new row" and "do not infer a name" are both boundaries |
| 3 | INVEST-shaped | **✅** independent of `EPIC-004` and of `ABC-095`; small; testable; genuinely droppable, which is what makes it negotiable |
| 4 | acceptance testable and measurable | **✅** six criteria on counts and states: equal row counts across three frames, 0 ESC / 0 C0 / 0 `U+007F` / 0 non-ASCII in ASCII mode, 100,000 characters bounded, < 16 ms, 0 lines changed upstream |
| 5 | dependencies known | **⚠️** all named — but **one is conditional on an unmade decision**: if `ABC-093`'s format omits the name field, this ticket is unbuildable. Flagged on both pages; **it is cheap to include the field now and expensive to retrofit**, which is the whole reason for cutting this ticket at the same time as `ABC-093`. |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` < 16 ms; `ADR-0009` `= 23` / `≤ 24`; the escape-byte bar transcribed with its source and the C1 misreading pre-empted; `NFR-008` ≤ 1 file |
| 7 | test notes present | **✅** five, including "assert on the emitted frame, not the accessor" and the snapshot warning |
| 8 | size assigned | **✅** `S`, with both re-size boundaries named |
| 9 | priority assigned | **✅** `P3`, with a named promotion trigger |
| 10 | no major unresolved blocker | **⚠️ ONE, ordering.** `ABC-093` and `ABC-094` must land first, and `ABC-093`'s format must carry the name. **No `EPIC-004` blocker.** |
