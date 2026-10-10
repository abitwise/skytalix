---
kind: adr
id: ADR-0029
---
# ADR-0029: The frame-path guard measures at LOAD and PER FRAME, both by module loads, from ONE declared composition root whose closure is derived

## Status

**accepted** 2026-10-10 by the owner. Owner (Olger Oeselg), 2026-10-10, verbatim: *"Accept ABC-036, ABC-051, ABC-127; accept ADR-0029, ADR-0033 ; Explain R4 ; R2 - keep depth 7 ; ABC-074 - rule the test out ; Worktree cleanup - yes"*

Was: **proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `ruling-abc053-abc054`), ruling
`ABC-053`. **Owner acceptance owed.**

`ADR-0011` makes Architect/Design the owner of this question (`R1`), and it says no owner ratification is
owed where no target or level moves. Both hold here: `NFR-002`'s `< 16 ms` target and its catalog row do not
move. **This is still left `proposed`.** The ruling changes which builds the guard kills. It gains six kills
and loses one (`WGLYPH-DYN`, below), and the owner decides whether that trade stands.

On acceptance this ADR **supersedes `ADR-0011` clause 2 in part** (*"the frame path is DECLARED, not
derived"*) and **discharges `ADR-0011` `R1`**, including its dated expiry. `ADR-0011` is not edited by this
hop. A one-line pointer in `ADR-0011` is owed at acceptance.

**Zero production lines.** The guard change goes to the Engineer. This ADR rules it and does not write it.

**POINTERS 2026-10-10 (`design-owed-rulings-2026-10-10`).**
- The owed `ADR-0011` pointer is written: `ADR-0011` § "Pointers 2026-10-10", P1–P3.
- A pointer under decision 2 records that the borrowed `ADR-0030` definition fails OPEN for this
  equality, and gives the pre-ruled fix for `AR-053-COMPOSER`'s trigger.
- No decision changes.

## Context

`NFR-002`'s structural premise, in the catalog's words: *"If a renderer ever pulls the repetition derive
into a frame, the frame is `O(plies)` again."* `ADR-0011` clause 2 turns that into a property the probe in
`src/history-pane.nfr.test.ts` can measure: **`src/history.ts`'s module body is never evaluated in the frame
path.**

The probe measures that property **only at load.** A child process imports the declared roots
(`FRAME_PRODUCERS`, six names today), records every module that loads, and stops. **No frame is ever
called.** `ABC-041` made the frame path a function call (`makeRenderSeam(mode, orientation)` returns the
seam that `runTurnLoop` calls once per ply), so an edge inside the returned closure is invisible to it.

**`ABC-053`'s premises, re-checked on `46b6a0f` (the ticket was cut 2026-08-13):**

| premise | today |
|---|---|
| `X5b` — `void import("./history.ts").then((m) => m.gameStatusOf(history))` inside the returned closure — is green past every guard | **HOLDS.** Rebuilt out of tree: **22/22 green** across `src/render-seam.test.ts` and `src/history-pane.nfr.test.ts` (19/19 at the cut; tests have been added since) |
| `src/render-seam.ts` is the first module to import all four frame producers, so `closure("render-seam.ts")` is derivable | **HOLDS.** `render-seam.ts` is now itself declared (6 entries). Its load closure is 11 modules and covers **5 of the 6** declared roots. The sixth is `glyph-mode.ts` |
| `glyph-mode.ts` is reachable from no frame producer | **HOLDS.** Its only production value-importer is `src/cli.ts`, which calls `beginGlyphModeSession(flags)()` **once, before `runTurnLoop`**. The mode reaches the seam as a value (`ABC-019` `[D30]`) |
| `ADR-0011` `R1`'s expiry fires at `EPIC-006`, "where the entry point assembles a frame" | **Fired early, at a different module.** The entry point never assembles a frame and can never be a root (`ADR-0011` clause 4: it exports nothing). The importable assembly module is `render-seam.ts`, which `ABC-041` delivered. The 2026-08-14 Architect note `…c1db3459` recorded this |

**Why a spy guard was measured and rejected.** The obvious per-frame guard runs in-process. It calls the seam,
waits, and asserts the file's existing `vi.mock` spies on `gameStatusOf`, `repetitionCounts` and the rest stay
at 0. It does go RED on `X5b`, but it **observed 1 derive call for 3 frames.** A diagnostic showed why: of
three concurrent `import("./history.ts")` calls, **only the first resolved to the mocked (spied) module.**
The second and third got an unspied instance (`mock` property absent). So a spy guard's arming depends on
how vitest resolves mocks for concurrent dynamic imports, which this project does not control. It is also
blind to a specifier the mock does not match, such as `?v=2`.

## Decision

### 1. What the probe measures: BOTH phases, as two named assertions in the ONE existing child

The frame path is **the load closure of the composition root, plus every module that a call of the root's
seam loads.** The property stays `ADR-0011` clause 2's own: `history.ts`'s module body is never evaluated
there. It is measured in two phases, each with its own assertion message:

- **at load:** `history.ts` is not among the modules loaded when the composition root is imported. This is
  today's measurement, unchanged.
- **per frame:** `history.ts` is not among the modules loaded while the seam's frames run. After the load
  phase the child builds a seam, **clears the recorder**, calls frames, settles, and reads the recorder
  again.

**The instrument observes module LOADS, not derive CALLS.** That makes it independent of vitest's mock
resolution and of the specifier's spelling, and it sees an evaluation that calls nothing. It also removes
`ABC-053` test note 4's microtask problem. The load hook fires when the import is issued, not when its
`.then` runs. Measured on Node v26.11.0: `X5b` is still RED with **zero** settle turns (3 of 3). The settle
stays because `package.json` admits Node `>= 22` and loader timing is not promised across versions. It is
a bounded number of macrotask turns and **no wall-clock assertion.**

**The game the frames draw is built from a distinct module instance, `history.ts?fixture`.** This is the
`?arming` technique the probe already uses. The real `newGame` / `gameStatusOf` build the fixture, so the
probe holds **no copy of `GameHistory`'s shape**. The plain `history.ts` URL stays unloaded, so a frame that
loads it produces a fresh load event.

**No new spawn and no new file.** Both phases run in the existing `spawnSync` child, and the existing arming
phase runs after both on the same recorder.

**Required controls (the Engineer builds them; the names are the Engineer's):**

- the per-frame phase reports how many rows each frame returned, and the parent asserts it is non-zero, so
  a child that never drew a frame cannot pass;
- the frames cover **at least two states**: the empty game, and a game **longer than the history window
  (> 16 plies)**, played with the fixture instance's own `playMove`. The pane's windowing branches at 16
  plies, and a lazy edge behind that branch would not fire on an empty game. Measured: `X5b-CONDITIONAL`
  (the edge only when `moves.length > 16`) is **green with the empty game alone** and **RED once a 40-ply
  game is framed**. Both frames return 23 rows on BASE;
- the arming phase stays last, so the recorder is shown live after the per-frame phase.

### 2. Declared vs derived: ONE declared root, and the producer list is DERIVED and DELETED

`FRAME_PRODUCERS` (six names) is **deleted.** It is replaced by **one declared composition root,
`render-seam.ts`**, cited to `ADR-0009` clause 9b (*frame composition lives entirely behind the one render
seam*). The frame path is that root's load closure. **No list of producers is maintained by hand any more.**
A new panel reaches a frame only by being imported by the seam, and that puts it in the closure
automatically.

**`R1`'s fail-open becomes fail-closed with one tripwire.** The set of production modules holding a
**value-binding import** of `assembleFrame` from `./frame.ts` must **equal** `[<the composition root>]`.
"Value-binding import" is defined in `ADR-0030` decision 2. A second module that composes frames reds
it, and the message says to root it. A root that stops composing reds it too. Measured: `SECOND-COMPOSER`
(`cli-options.ts` gains a value import of `assembleFrame`) is green under today's probe and RED under the
tripwire. **Bound, stated:** a module that writes frame rows without calling `assembleFrame` is not seen.
That module would itself breach `ADR-0009` 9b.

**`ADR-0011` `R1`'s dated expiry is DISCHARGED**, not re-dated. Its trigger was *"the composition becomes an
import"*, and `ABC-041` made it one.

> **[POINTER 2026-10-10 at task `wave-2026-09-25`, subtask `design-owed-rulings-2026-10-10`: the BORROWED
> definition fails OPEN in this tripwire. The borrowing is kept. No decision above changes.]**
>
> - **Where the borrowed argument stops holding.** `ADR-0030` decision 2 excludes `export … from`
>   re-exports from its definition, and a dynamic `import()` binds nothing. It argues that "an
>   under-count … fails safe". That is true for `A8`'s claim, which is "at least one consumer": an
>   under-count reds it. **It inverts for this tripwire, which is an EQUALITY against a one-member set:**
>   - under-counting the root gives `[]`, which is RED (safe);
>   - under-counting a **second** composer leaves `[root]`, which is GREEN (open).
> - **Measured.** Security/NFR at `ABC-053` (`secnfr-ABC-053` `…91ac4dd3`, R3) placed a re-export
>   hop, then a dynamic `import("./frame.ts")`, in `result-screen.ts`. Each one passed lint,
>   typecheck and the full lane.
> - **Four static spellings that the reader also misses:** a comment ahead of the name; a default
>   binding (`QE-054-b`); a string-named specifier; a comment that holds `;` (`QE-057-b`).
> - **So decision 2's "A second module that composes frames reds it" reads:** *a second module that
>   binds `assembleFrame` by a static value import the tripwire reads, reds it.* The probe's
>   docblock already says this (`ABC-054` `A6`, narrowed again by `ABC-057`).
>
> **Ruled: the definition is NOT widened now.**
> - The reach is bounded. A second composer reaches the live loop only through the pinned wiring
>   line in `src/cli.ts` (`ABC-043` `A1`; `S-WRAP-CLI` is RED) or through `turn-loop.ts`, which is a
>   licensed driver.
> - Production holds 0 such spellings at `37ca6ae2`.
> - `ABC-054` declined option 1 by name.
> - The risk stays `AR-053-COMPOSER` (LOW, owner BA/PM).
>
> **Pre-ruled for that risk's promotion trigger.** The trigger is a non-empty promotion grep
> (`secnfr-ABC-053` `…8deff3d6`, Ruling 3), or an edit of the pinned `render:` line. When it fires:
> - the fix is **option 1**: the tripwire counts a re-export of `assembleFrame` from `./frame.ts` one
>   hop deep, and counts `import("./frame.ts")`;
> - it lands in or before that diff, and it needs no new ADR.
>
> The same production `import(` also fires `ADR-0011` `R4` (`ADR-0011` P3).
>
> **For the next borrower:** a definition built for an at-least-one claim can be borrowed by an
> equality only if the forms it excludes are listed as fail-open, as they are here. `ADR-0030` carries
> the same line beside `C2`.

### 3. `glyph-mode.ts` is NOT on the frame path, and the membership rule says why

**Membership rule:** a module is on the frame path if and only if it is in the composition root's load closure
or is loaded by a frame call. `glyph-mode.ts` is neither. Its function runs once per session, in the entry
point, before the loop, and its result reaches the seam as a value. **It leaves the root set.**

### 4. Where the answer is read (`ABC-053` `A2`)

The probe's docblock names both phases, says the frame path is derived from one declared root, and states
in words what neither phase covers (below). This is the Engineer's prose. It replaces the `FRAME_PRODUCERS`
docblock and its dated-expiry paragraph.

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | **Keep load-time only and say so in the docblock** (`A3`'s "say in words" branch) | **Rejected.** The measured guard is cheap and fires on four spellings of the edge. Saying "not covered" would be a choice to stay blind, not a limit of what can be built |
| 2 | **In-process per-frame spy guard** (`vi.mock` spies, settle, assert 0 derive calls) | **Measured and rejected.** RED on `X5b`, but only the first of three concurrent dynamic imports reached the spied module, so the arming rests on how vitest resolves mocks. Expected blind to `?query` (not separately measured). Blind to evaluate-only |
| 3 | **Per-frame phase with a hand-built `GameHistory` literal** instead of `history.ts?fixture` | **Rejected.** A copy of the type's shape inside a string the typechecker never reads goes stale silently. That is the "copy worse than no witness" defect this file already names |
| 4 | **Derive the root mechanically too** (root = every value-importer of `assembleFrame`, no name declared) | **Rejected, narrowly.** The per-frame phase must call a known factory (`makeRenderSeam`), so a name is needed anyway. One declared name plus the equality tripwire gives the same fail-closed reach with one name, not zero |
| 5 | **Keep `glyph-mode.ts` as an extra root** to keep its probe coverage | **Rejected.** It is a root the membership rule says is off the path. That is the "list nobody can re-derive" `A4` forbids, kept for one kill that is not an `NFR-002` breach |
| 6 | **A second probe file** for the per-frame phase | **Rejected.** A new file re-sizes `ABC-053` to `M`, and a second spawn fires `ABC-053`'s security clause (c). The existing child already has the recorder |

## Consequences

### The kill ledger, measured on 10 builds, both instruments (out of tree on a replica of `46b6a0f`)

| build | today's probe + regex | **ruled** |
|---|---|---|
| BASE | green | **green** (closure 11 modules, per-frame set empty) |
| `X5b`: literal dynamic import + derive in the returned closure | green | **RED** (per frame), 5/5 runs |
| `X5b-CONDITIONAL`: the same edge only when `moves.length > 16` | green | **RED** (per frame, on the > 16-ply state only) |
| `X5b-query`: same, `"./history.ts?v=2"` | green | **RED** (per frame) |
| `X5b-computed`: specifier built from a string expression | green | **RED** (per frame) |
| `X5c`: evaluate-only `void import("./history.ts")` in the closure | green | **RED** (per frame) |
| `WDYNIMP`: module-scope dynamic import in `history-pane.ts` | RED (load) | **RED** (load) |
| `WINDIRECT`: bare `import "./history.ts";` in `glyph-mode.ts` | RED (regex + load) | **RED** (regex only) |
| **`WGLYPH-DYN`**: module-scope `void import("./history.ts")` in `glyph-mode.ts` | RED (load) | **green: THE ONE LOSS** |
| `INLINE-TYPE`: pane's `import type` changed to `import { type GameHistory }` | RED (regex + load) | **RED** (regex + load) |
| `SECOND-COMPOSER`: `cli-options.ts` gains a value import of `assembleFrame` | green | **RED** (tripwire) |

**Gained: 6. Lost: 1.** `WGLYPH-DYN` evaluates `history.ts` once per session at startup, off the frame path,
and calls no derive. That makes it an `ADR-0011` `R4`-class build (a dynamic form in an unlicensed,
off-frame-path module), the same class `WPERFT-DYN` was ruled not a breach in. **It is recorded as a loss,
not hidden.**

### What neither phase covers (for the docblock, in words)

- a derive that is **deferred** past the settle, for example by a timer;
- a lazy load **conditional on a game state the probe's frames do not reach** (the two required states
  bound this but do not close it);
- a renderer that rebuilds the derive from modules **other than** `history.ts` (`gameend.ts` plus its own
  counts). The property's proxy is `history.ts` evaluation. That build is seen only by `ABC-041` `A2`'s
  synchronous spies. This is a **pre-existing** limit, named here and not introduced;
- a second composer that never calls `assembleFrame`.

### Cost

Measured on the probe test alone, 5 runs per arm on a loaded machine: **median 245 ms ruled against 214 ms
today, about +30 ms, noisy.** No new spawn and no new file, so `N8-LANE` (scoped to files the branch adds
under `src/`) has nothing in scope. **No `NFR-008` verdict is claimed.** That is Security/NFR's, against
`ADR-0019`'s level.

### Files the build touches, named BEFORE code lands (`ABC-053` `A5`)

- `src/history-pane.nfr.test.ts`: the probe, its docblock, and the deleted `FRAME_PRODUCERS`;
- **`src/render-seam.test.ts`**: `A9`'s first assertion parses the `FRAME_PRODUCERS` literal and must be
  re-pointed to the composition root. This is a **second test file**, so `ABC-053`'s security clause (d)
  fires and the gate resolves it. **Still 0 new files**;
- **zero production lines.** Three production docblocks name the deleted identifier:
  `src/render-seam.ts:34-35`, `src/result-screen.ts:13-14` and `src/cli.ts:8` (a census line). **They go
  stale on landing.** Fixing them is comment-only, but any non-`.test.ts` path under `src/` takes the ticket
  off the zero-production-lines UAT waiver. So whether to fold them into `ABC-053` or cut an `XS` follow-up
  is **BA/PM's call**. Architect/Design recommends the follow-up.

### What this changes elsewhere

- **`plans/nfr-catalog.md`: NOT opened, by decision.** `NFR-002`'s target, bar and row text do not move.
  The row already scopes its void-condition to *"a renderer"* and *"a frame"*. This ruling makes the guard
  measure what that row says.
- **`ADR-0011`: not edited.** On acceptance: clause 2's "declared, not derived" is superseded in part, `R1`
  is discharged, and `R4` gains `WGLYPH-DYN` as a named member. Pointer owed at acceptance.
- **`ABC-057`** edits the same file (the licence docblock and comparator). That edit is orthogonal to this
  one, but the two hops must be sequenced, not run in parallel.

## Rollback

One revert of the Engineer's commit restores the six-name list and the load-only probe, and `X5b` goes back to
green. No production line, data shape or dependency is introduced. **If the per-frame phase ever flakes,
revisit the settle first.** It is the only timing-shaped part, and it was measured as not load-bearing on
Node v26.11.0.
