---
id: ABC-041
title: The render-seam closure — four merged modules become one `RenderSeam`, and three modules that only tests can reach get a production importer
status: in-review
column: In Review
size: S
priority: P0
epic: EPIC-006
feature: —
---

# ABC-041 — the render-seam closure: `renderBoard` + `renderStatusPanel` + `renderHistory` → `assembleFrame` → rows

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition. This is item 1 of the three the epic's page named in
> prose on 2026-08-12: *"the single highest-value ticket on this board that nobody has cut"*.

## Problem

*User*: every player — this is the ticket after which the board they are supposed to look at can be
produced at all.

*Pain*: **four merged modules compose into a frame today only inside test files.** Measured on `main`
by reading the import graph (`grep` over non-`.test.ts` files under `src/`, 2026-08-12 and re-checked
2026-08-13):

```
src/status-panel.ts   production importers: 0   (only *.test.ts import it)
src/history-pane.ts   production importers: 0   (only *.test.ts import it)
src/render.ts         production importers: 2, BOTH `import type { GlyphMode }`
                      (src/frame.ts:42, src/glyph-mode.ts:42) -> renderBoard has 0 runtime consumers
```

`ADR-0009` clause 9b puts frame composition **entirely behind one render seam**, and `ABC-019`
published that seam's exact type in merged code (`src/turn-loop.ts:97-102`) with no production
implementation of it.

*Value*: **this ticket, alone, moves three of the four zero-importer production modules to one or more
production importers** — the measurement `EPIC-006` was raised `P2` → `P1` on. It is a pure function
of injected values, it needs no terminal, no argv and no entry point, and every input it composes is
merged.

## Scope

**One new module, flat in `src/`, that builds a `RenderSeam` and nothing else.**

- **It IS `ABC-019`'s published `RenderSeam`**, exactly:
  `(history: GameHistory, status: GameStatus, thinking: boolean, messages: readonly string[]) => readonly string[]`
  (`src/turn-loop.ts:97-102`). `EPIC-006`'s entry point passes the result as `runTurnLoop({ render })`
  with no adapter.
- **The glyph mode and the board orientation are bound ONCE, at construction, as VALUES**
  (`ABC-019` `[D30]`: *"`EPIC-006` binds the mode into the seam closure exactly as it binds it into
  `renderBoard` and `assembleFrame`"*). The seam reads no ambient signal and derives neither.
- **The composition is exactly the merged four**: `renderBoard(history.position, mode, orientation)`,
  `renderStatusPanel(history, status, thinking)`, `renderHistory(history)`, then
  `assembleFrame({ board, status, history, messages }, mode)`. Every panel is called, none is
  re-implemented.
- **It derives nothing.** `status` and `thinking` arrive as arguments and are passed through verbatim
  — the property `ABC-019`'s `A5`/`A6` and `NFR-002`'s `O(window)` statement both rest on.
- **The board orientation follows the human's colour** — see the ruling below. Which colour is the
  human's is the caller's; this module takes the resolved orientation.
- **It updates the declared frame-path root list** in the merged probe (`ADR-0011` clause 2: the frame
  path is *DECLARED, not derived*) — see `A9`. This is an edit to an existing test file and adds no
  file.

## The ruling this ticket had to make: the board is drawn from the human's side

**BA/PM, 2026-08-13. `--colour white` → `white-bottom`; `--colour black` → `black-bottom`.**

`renderBoard` has taken an `Orientation` since `ABC-014` and **nothing on this board has ever said
which one a session picks.** Two readings existed — always `white-bottom` (a fixed diagram), or the
player's own side at the bottom — and leaving it to the engineer would have made it a silent default.
The player's side wins: a chess player reads their own pieces from the bottom, and the alternative
makes `--colour black` produce a board the player has to mentally invert on every move. It costs one
argument and no code branch. **Recorded here rather than in the entry point because the orientation is
bound into the seam, exactly where clause 9b puts the mode.**

## Out of scope

- **Reading argv, resolving `random`, or choosing the mode** — `ABC-042`. This module takes a
  `GlyphMode` and an `Orientation` as values.
- **Calling `runTurnLoop`, writing anything, or naming `process.stdout`** — `ABC-042` / `ABC-043`.
- **The result screen** — `ABC-044`. This seam produces *frames*; the end screen is not a frame.
- **Changing any of the four merged modules.** All four ship the behaviour this composes.
- **Deciding the frame's height, or padding/truncating rows** — `assembleFrame` and `ADR-0009`
  clause 9 own both; this module names no row count.

## Acceptance (Given/When/Then)

Every criterion is provable as a value with **no TTY and no child process** — the mode `EPIC-002`
`4c` and this epic's end-to-end test both run in.

- **`A1` (it is the seam, by type and by use).** **Given** merged `runTurnLoop`, **when** this
  module's result is passed as `options.render`, **then** it typechecks with **no adapter and no
  cast**, and a scripted game of ≥ 4 plies runs to a terminal result through it with all four real
  panels in place. **And given** a one-item `messages` list, **then** that item's text appears in the
  returned frame. *(The fourth parameter is the loop's only channel for a rejection line or an
  ambiguity list. A seam that hardcodes `messages: []` is green on every other criterion on this
  page — measured, not feared.)*
- **`A2` (it derives nothing — spied, not asserted by reading).** **Given** three consecutive seam
  calls, **then** `gameStatus`, `gameStatusOf` and `legalMoves` are called **exactly 0** times inside
  the seam, and the `GameStatus` object reaching `renderStatusPanel` is **reference-identical** to the
  one the caller passed. *(Reference identity is the discriminator: a build that re-derives an equal
  status passes every content assertion and fails this one.)* **And given** `thinking: true` and then
  `thinking: false`, **then** `renderStatusPanel`'s third argument is `true` and then `false` —
  `## Scope` requires `thinking` to pass through verbatim too, and a seam that hardcodes `false` is
  otherwise green.
- **`A3` (constant height, and no row count is named).** **Given** message lists of **0, 1, 4 and 200**
  items and one **100,000-character** item, at **both** glyph modes, **then** the returned row count is
  a **single distinct value** across all ten cases, and it equals
  `frameHeight({ board: <renderBoard's own length>, status: STATUS_ROWS, history: HISTORY_ROWS })`
  computed from the merged exports. **And the delivered module's executable text — `src/render-seam.ts`
  with comments stripped — contains no digit character at all**, so no row count can be written there
  to drift from `frameHeight`'s (`ADR-0009` clause 9). *(Scope is **this module's source**, which is
  what the instrument reads; the fence that keeps the count out of a sibling file is `A10`, not this
  clause. **Known blind spot, stated rather than implied**: a height spelled without digits — a
  string's `.length`, say — is not caught here, and is invisible to the behavioural half as well
  because `frameHeight` returns the same value for every input this module can be given.)*
- **`A4` (orientation is passed through, not re-implemented).** **Given** the start position, **when**
  the seam is built `white-bottom` and again `black-bottom`, **then** for the matching orientation
  the frame's board region equals `renderBoard(position, mode, orientation)`'s rows each padded with
  trailing blanks to **the width `assembleFrame` derives from the panels** — the widest row of
  `renderBoard` / `renderStatusPanel` / `renderHistory` (`src/frame.ts:194-208`), computed from those
  three and **never read off the frame or off the board region** — and the two orientations' board
  regions differ. *(Two things this catches, both measured as surviving mutants of the weaker forms:
  a seam that ignores the bound orientation, and a seam that pads the board itself — reading the
  width off `frame[0]`, which **is** a board row, makes the seam and the assertion draw the number
  from the same place and the padding mutant walks through. **What it does not catch is a second
  board implementation**: a copy that renders the same bytes is invisible to every byte comparison,
  measured. That property is `A11`'s inside this seam and `ABC-054`'s across the repository.)*
- **`A5` (one mode, bound once, reaching both consumers).** **Given** `mode: "ascii"`, **then** the
  whole returned frame carries **zero** code points above `U+007F`, including in the message region
  fed a `♞` (proving the mode reached `assembleFrame`'s sanitizer as well as `renderBoard`);
  **given** `mode: "unicode"`, **then** the board region carries **at least one** code point in
  `U+2654`–`U+265F`. *(`EPIC-002` `2a`, re-asserted through the closure.)*
- **`A6` (no ambient reads).** The delivered module's source — `src/render-seam.ts`, comments
  included — contains **zero** occurrences of `process.`, of the bare word `process`, of
  `globalThis` and of `import.meta`, and **zero** imports from `glyph-mode.ts`; asserted textually,
  not by inspection. *(Scope is **this module's source**, which is what the instrument reads. The
  three added spellings are not decoration: a substring check for `process.` alone is one keystroke
  wide and an ambient read via `globalThis["process"]` was measured green against it. **Known blind
  spot**: any grep loses to the next spelling, so this clause guards the module's *text*, not the
  repository's capability — the capability property is the firing threshold's clause (b) below.)*
- **`A7` (`history.ts` is a TYPE import only — `NFR-002`'s structural premise).** **Given** the merged
  frame-path probe rooted at this module, **then** `src/history.ts` is **absent** from the reported
  closure. *(The seam takes `GameHistory` and reads `history.position`; it needs no runtime binding
  from that module. A build that imports `newGame`/`gameStatusOf` at runtime passes every content
  criterion and reds `NFR-002`'s premise.)*
- **`A8` (the headline measurement, falsifiable).** **After** this ticket merges, `src/render.ts`,
  `src/status-panel.ts` and `src/history-pane.ts` each have **≥ 1 production (non-`.test.ts`)
  importer** — measured by the same `grep` the epic's raise used, which read **0 / 0 / 0** (plus two
  `import type`) before.
- **`A9` (the new frame producer is DECLARED).** The merged probe's declared frame-path root list
  gains this module. **Given** the probe after the edit, **then** it reports a closure that includes
  this module, and it remains **armed** (rooted at `src/turn-loop.ts` it still reports `history.ts`).
  *(`ADR-0011` clause 2: the frame path is declared, not derived — so a frame producer nobody declares
  is a producer the guard silently stops covering. This is the first new frame producer since the
  probe was written.)*
- **`A10` (no production change outside this module).** `git diff --numstat` shows this module and its
  test file, plus the one probe-root line `A9` requires, and **nothing else** — `src/frame.ts`,
  `src/render.ts`, `src/status-panel.ts`, `src/history-pane.ts` and `src/turn-loop.ts`
  **byte-identical**. Suite green, skip **0**. *(This is the only diff-scoped criterion on the page,
  and it is the fence `A3` and `A6` rest on: their instruments read one file, and what stops a
  literal or an ambient read being moved one module away is that a second module cannot be added at
  all. It is checked by reading the diff, not by an assertion in the suite.)*
- **`A11` (the merged four are CALLED, not re-implemented).** **Given** one seam call, **then**
  `renderBoard`, `renderStatusPanel`, `renderHistory` and `assembleFrame` are each called **exactly
  once** — a call count, not a comparison. *(This is `## Scope`'s own "every panel is called, none is
  re-implemented", which until now no criterion asserted. **Its reach, stated honestly**: it forbids
  **this seam** from rendering a region itself, and it is the assertion — not `A4` — that a
  byte-identical copy of `renderBoard` in its own module fails. It does **not** forbid the repository
  from containing a second board implementation, and no ticket-local criterion can: a seam could call
  the merged four for the count and render from a copy, and both would be byte-equal. The repo-wide
  property needs an instrument that measures **consumers**, and that is `ABC-054`.)*

## Criterion repair — 2026-08-13, BA/PM, after the QE gate

**The code was never wrong; four criteria were.** `A4` as originally written (*"the frame's board
region is byte-identical to `renderBoard(...)`"*) is satisfiable by **no** build on this tree —
`assembleFrame` pads every panel row to the widest panel, which is never the board's — and its stated
purpose (*"byte-equality … is what forbids a second board implementation"*) is **false**: a copy of
`renderBoard` in its own module ships green against every byte comparison here. `A4` above now says
what byte-equality does measure; `A11` carries the call-count property that actually forbids a
re-implemented region **inside this seam**; `A3` and `A6` now name the instrument they are read by,
the file it reads, and the blind spot each carries. **Nothing here relaxes a criterion to fit the
delivered build, and the delivered `src/render-seam.ts` satisfies every clause above unchanged.**

The measurements, the refuted characterisation and the mutants behind each line live in
`.grugops/context/refinement-ABC-041-a4/notes/` and `quality-gate-ABC-041/notes/`, not here.

## Dependencies

- **All four composed modules are MERGED** — `render.ts` (`ABC-014`), `status-panel.ts` (`ABC-016`),
  `history-pane.ts` (`ABC-017`), `frame.ts` (`ABC-018`) — and `RenderSeam` is published in merged code
  (`ABC-019`). **Nothing this ticket needs is open.**
- **`ABC-042` is the consumer and is NOT a dependency.** This module can be built, tested and merged
  with no entry point in existence. **It should not sit merged and unconsumed for long**: a module with
  no production importer is the exact pathology this epic exists to end, and `ABC-042` is the very
  next pull.
- **`ADR-0009` clause 9/9b and `ADR-0011` clause 2 bind and are not re-decided here.**

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms
  per test file added, scope = every file the branch adds under `src/`.
- **`NFR-002` (render latency < 16 ms) FIRES, and this ticket is where it first becomes a real path.**
  Measurable form: the seam adds **zero** derives per frame (`A2`'s spied 0) — the structural claim the
  catalog row's `O(window)` statement rests on. The wall-clock reading stays a catalog reading with its
  machine; this suite asserts no wall clock (`src/gameend.nfr.test.ts:16-17`).
- **`NFR-002` module scope: this adds a production module AND a frame producer.** `A7` and `A9` are the
  two measurable consequences. The `ADR-0011` census moves by one **deliberately**, not by discovery.
- **Security: not triggered.** This module reads no input from outside the process, spawns nothing,
  opens nothing and writes nothing. **Firing threshold, falsifiable — four clauses, each with its own
  stated subject** (repaired 2026-08-13; the one-subject form it replaces fired on a property the
  tree had already abandoned two tickets earlier, so it measured the repo rather than the change):
  - **(a) Runtime dependency.** Fires if `package.json` gains a `dependencies` key, or if
    `package.json` / `package-lock.json` is touched at all. *(`git diff --numstat <base> HEAD --
    package.json package-lock.json` non-empty, or `jq 'has("dependencies")' package.json` true.)*
  - **(b) Production capability.** Fires if **any non-`.test.ts` file under `src/`** — this module or
    any module in its runtime closure — imports a Node builtin, reads `process.`, or calls
    `spawn` / `exec` / `fetch` / `eval` / `new Function`. *(`grep -rlE 'from "node:' src/ | grep -v
    '\.test\.ts'` empty. It is empty today across 47 files — a real invariant with a real baseline of
    zero, and **`ABC-042` is the hop that ends it**, deliberately rather than by surprise.)*
  - **(c) Test-lane capability beyond existing precedent.** Fires if a **test** file in the diff
    introduces a capability this lane does not already hold: network, a filesystem write outside a
    temp dir, or a new `child_process` spawn. Read-only `node:fs` over the repository's own source is
    **explicit precedent** (`src/san.test.ts`, `src/history-pane.nfr.test.ts`) and does not fire.
  - **(d) Blast radius.** Fires if the diff touches any file under `src/` other than this module, its
    test file and the one probe-root line. *(This is `A10`, unchanged.)*
  **Whichever way a reading is disputed, it fires and the gate resolves it** — the implementer is
  structurally the wrong decider of a threshold whose answer decides whether their own work is
  reviewed.

## Test notes

1. **Assert reference identity, not equality, for the passed-through `GameStatus`** (`A2`). An equal
   copy is what a re-deriving build produces.
2. **Derive `A4`'s padding width from the panels, never from the frame** — `frame[0]` is a board row,
   so a width read off it lets a seam that pads the board inflate both sides of the assertion at
   once. **`A4` catches a wrong board, not a second implementation**; `A11`'s call count is what
   catches a re-implemented region, and neither reaches across the repository.
3. **The 100,000-character message item is `ADR-0009`'s own probe** and it is cheap — height
   invariance under the message region is already measured merged code; this re-asserts it through the
   closure.
4. **Run the merged probe both ways** (`A9`): rooted at this module (must be green) and rooted at
   `src/turn-loop.ts` (must still be RED). A probe that cannot go red proves nothing.
5. **No TTY, no spawn, no `vi.mock`.** The spies in `A2` are `vi.spyOn` over imported functions.

## Lane cost — how many test FILES this ticket implies

**One, median-weight.** A single `*.test.ts` beside the new module; the probe edit in `A9` goes in the
**existing** `src/history-pane.nfr.test.ts` and adds no file. No `vi.mock`, so **no `*.nfr.test.ts`**.
≈ **160 ms CPU** at the published floor, **≈ 1.2% of the 13 s clause** (arithmetic over
`plans/nfr-catalog.md`, not a new measurement).

**File WEIGHT, stated because QE routed that gap to BA/PM at the next cut** (mean 309 ms vs median
94.2 ms per file, one file at 25.7% of all file time): **this is a median-weight file or lighter** —
pure functions, no corpus, no spawn, no perft, ~10 cases of ten rows each. It is nothing like
`perft.test.ts`.

## Size and priority rationale

**Size `S` (2).** One function, four merged calls, two bound values, no state, no async, no new
dependency edge, no design decision left open. The work that is not trivial is the *guard* work —
`A7`'s type-only import and `A9`'s probe declaration — and both are one line each. Calibrated against
`ABC-015` (`S` — a selection rule plus a session) and `ABC-031` (`S`).

**Not `XL`, and the split line if it ever moves:** (a) the composition — `A1`–`A6`; (b) the guard
work — `A7`, `A9`. Part (a) is `XS` and ships alone.

**Priority `P0`.** It is the first half of the render-seam closure `ADR-0009` clause 9b and
`ABC-019` `[D30]` both assign to this epic, it is buildable today with zero open dependencies, and
`ABC-042` — the ticket the owner is waiting for — cannot start without it.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** every player; three modules with a measured **0** production importers; the seam is published in merged code with no implementation |
| 2 | scope and out-of-scope clear | **✅** one module, the exact published signature, two bound values; five fences |
| 3 | INVEST-shaped | **✅** independent (every input merged; `ABC-042` is a consumer, not a dependency), negotiable, valuable, estimable, small, testable |
| 4 | acceptance testable and measurable | **✅** ten criteria: reference identity, byte-equality against the merged renderer, a single distinct height over ten cases, **zero** code points above `U+007F`, **zero** `process.` occurrences, a probe closure without `history.ts`, and a before/after importer count of 0 → ≥ 1 |
| 5 | dependencies known | **✅** four merged modules named with their tickets; two ADR clauses named; the consumer named as not-a-dependency |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` carried as a spied **0** derives; security not triggered with a falsifiable firing threshold |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` (2), calibrated, with the split line named |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** nothing this ticket needs is open. The one decision it required — board orientation — is **ruled on this page**, not deferred |

**This table is the score taken at the cut and is NOT re-scored here** — `ABC-041` is in flight, not
being pulled, and DoR asks whether criteria are *well formed*, which is a different question from the
one the gate answered. Read items **4** and **6** as historical: item 4's evidence cell cites
*"byte-equality against the merged renderer"* and item 6 cites the single-subject firing threshold,
and **both of those phrases were refuted by measurement and are replaced above**. A 10/10 at the cut
that survived a gate refutation is exactly what a well-formed-but-wrong criterion looks like; the
control it feeds is `AGENTS.md` § Process rules, rule 1, and it is honest only if it is left standing.
