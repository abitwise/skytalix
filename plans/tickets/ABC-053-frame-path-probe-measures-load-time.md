---
id: ABC-053
title: The frame-path probe measures LOAD-time closure, and `NFR-002`'s premise is the PER-FRAME path — the two stopped matching at `ABC-041`
status: done
column: Done
size: S
priority: P1
epic: —
feature: —
---

# ABC-053 — the probe measures the wrong time, and `ABC-041` is the hop where that became visible

> **Cut 2026-08-13 by BA/PM** (task `gate-abc041-2026-08-13`, subtask `refinement-ABC-041-a4`,
> Workflow 07), out of the QE gate's gap 7 on `ABC-041`. **This ticket is a RULING, not an
> implementation** — what the guard should measure is `ADR-0011`'s own question, and its owner is
> named in that ADR.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `owner-adrs-followups`) on
> [`ADR-0029`](../../memory-bank/50-decisions/ADR-0029-the-frame-path-guard-measures-load-and-per-frame-from-one-composition-root.md),
> **accepted by the owner 2026-10-10**. The ruling is made, so this is now a build ticket: scope,
> `A2`–`A5` and the files are re-cut to the ruling, and `A1` is discharged. Every anchor ADR-0029
> measured on `46b6a0f` is unchanged at wave tip `246ddfc` (no commit since touches the probe, the seam,
> `frame.ts`, `glyph-mode.ts` or `render-seam.test.ts`). **DoR 10/10 → `Ready`.** Reasoning:
> `.grugops/context/owner-adrs-followups/notes/`.

## Problem

*User*: every player, indirectly — `NFR-002` is the render-latency NFR, and this is the guard that is
supposed to hold its structural premise.

*Pain*: **the merged frame-path probe (`src/history-pane.nfr.test.ts`) measures the module closure at
LOAD time. `NFR-002`'s premise is about the PER-FRAME path.** For every module before `ABC-041` those
were the same thing, because the frame path was a module graph. `ABC-041` is the first module where
the frame path is a **function call**, and the probe's reach did not move with it.

Measured at the `ABC-041` gate (QE, `X5b`), not argued: a lazy
`void import("./history.ts").then((m) => m.gameStatusOf(history))` placed **inside the returned
closure** is green on **19/19** across `src/render-seam.test.ts` and `src/history-pane.nfr.test.ts`.
Three guards miss it at once, each for its own reason:

- the `A6`/`A7` text check greps `from "./history.ts"` — a dynamic `import()` has no `from`;
- the merged licence regex is anchored to statement form `^(?:import|export)\s+…` — an `import()`
  expression is neither;
- **the closure probe imports the root module and never calls the seam**, so a per-frame edge never
  fires during the measurement.

`ABC-041`'s `A2` spies miss it too: they are synchronous and the derive is a microtask.

*Value*: `NFR-002`'s structural claim — *zero derives added to the per-frame path* — is the claim
`plans/nfr-catalog.md`'s `O(window)` row rests on, and the frame path is the one path in this
codebase where an `O(plies)` replay per frame is the difference between a playable board and a
visibly slow one. A guard that cannot see the per-frame edge is a guard that reports the premise held
when it did not.

## Scope

*(Re-cut 2026-10-10 to `ADR-0029`. The pre-ruling scope — decide what the probe measures, and
declared vs derived — is discharged by that ADR.)*

- **Two phases in the ONE existing child** (`ADR-0029` decision 1). **At load:** `history.ts` is not
  among the modules loaded when the composition root is imported (today's measurement). **Per frame:**
  after the load phase the child builds a seam, clears the recorder, calls frames, settles a bounded
  number of macrotask turns (no wall-clock assertion), and asserts `history.ts` was not loaded. The
  instrument observes module **loads**, not derive calls. The frames' game is built from the distinct
  instance `history.ts?fixture`, so the probe holds no copy of `GameHistory`'s shape.
- **The required controls** (`ADR-0029` decision 1): the per-frame phase reports rows per frame and
  the parent asserts non-zero; the frames cover the **empty game** and a game **longer than 16 plies**
  played with the fixture instance's own `playMove`; the arming phase stays **last**.
- **One declared root, the list derived** (decision 2). `FRAME_PRODUCERS` is **deleted** and replaced
  by one declared composition root, `render-seam.ts` (cited to `ADR-0009` 9b). **The composer
  tripwire:** the set of production modules holding a **value-binding import** (`ADR-0030` decision 2)
  of `assembleFrame` from `./frame.ts` must **equal** `[<the root>]`.
- **`glyph-mode.ts` leaves the root set** (decision 3), under the stated membership rule.
- **The docblock** (decision 4): names both phases, says the path is derived from one declared root,
  and states in words what neither phase covers. It replaces the `FRAME_PRODUCERS` docblock
  (`src/history-pane.nfr.test.ts:166-194` today) and its dated-expiry paragraph.
- **`src/render-seam.test.ts` `A9` is a build file** *(named here before code lands, as `A5` requires)*.
  Its first assertion parses the `FRAME_PRODUCERS` literal (`:311-323` today) and is re-pointed to the
  composition root. Its `LICENSED_DRIVERS` half is unchanged. **Still 0 new files.**

## Out of scope

- **Changing `src/render-seam.ts`.** It is correct; `X5b` is a mutant, not a defect in the delivered
  module. Nothing on this ticket is a re-open of `ABC-041`.
- **The import-statement-vs-consumer blind spot** — that is `ABC-054`, a different regex and a
  different question, cut separately on purpose.
- **A wall-clock measurement of `NFR-002`.** Frame WRITE is still `UNKNOWN - verify` in
  `plans/nfr-catalog.md` and this ticket does not close it.
- **The three production docblocks that name the deleted identifier** — `src/render-seam.ts:35`,
  `src/result-screen.ts:14`, and the census line `src/cli.ts:8` ("frame producers 6"). **BA/PM's call
  (`ADR-0029` left it here): NOT folded.** They are true until this ticket lands, so a follow-up cut now
  would describe text that is not yet false; and folding them takes this ticket off the
  zero-production-lines UAT waiver. **A comment-only `XS` follow-up is owed at this ticket's merge**
  (BA/PM, on the Orchestrator's enqueue); `A5` makes the PR note list the sites.
- **Re-arming `WGLYPH-DYN`.** It is the ruling's one recorded loss (`ADR-0011` `R4` class: off the
  frame path, calls no derive). Keeping `glyph-mode.ts` as a root to catch it was rejected (`ADR-0029`
  alternative 5).
- **`ADR-0011`'s pointer lines** (clause 2 superseded in part, `R1` discharged, `R4` gains
  `WGLYPH-DYN`). Owed by Architect/Design at acceptance, not by this build.

## Acceptance (Given/When/Then)

*(Re-cut 2026-10-10 to `ADR-0029`. Ids are kept; `A1` is discharged.)*

- **`A1` (the ruling exists and is citable) — DISCHARGED** by `ADR-0029` (accepted 2026-10-10): the
  probe measures load **and** per frame, by module loads; the root is one declared name and the closure
  is derived; `ADR-0011` `R1`'s dated expiry is discharged. Nothing to build.
- **`A2` (the answer is in the file).** **Given** `src/history-pane.nfr.test.ts` opened cold, **then**
  its probe docblock names **both phases** (load and per frame), names `render-seam.ts` as the **one
  declared root** whose closure is derived, and lists in words the **four** cases `ADR-0029` says
  neither phase covers (a derive deferred past the settle; a lazy load conditional on a state the
  frames do not reach; a derive rebuilt from modules other than `history.ts`; a composer that never
  calls `assembleFrame`). **And** the file holds **0** occurrences of `FRAME_PRODUCERS`.
- **`A3` (the kill ledger, rebuilt — `X5b` is the arming control).** **Given** the delivered guard,
  **when** each build of `ADR-0029`'s ledger is applied alone (out of tree) and reverted, **then**:
  `X5b`, `X5b-CONDITIONAL`, `X5b-query`, `X5b-computed` and `X5c` go **RED on the per-frame
  assertion**; `WDYNIMP` and `INLINE-TYPE` **RED** (load); `WINDIRECT` **RED** (regex);
  `SECOND-COMPOSER` **RED on the composer tripwire**; `BASE` **green**. **9 of 9 RED, BASE green.**
  `WGLYPH-DYN` reads **green** and the docblock names it as the recorded loss. The PR note records
  each build: command, exit code and the red assertion.
- **`A3b` (the controls cannot pass vacuously).** **Given** the child, **then** (i) the parent
  asserts each frame returned **> 0** rows, and a build whose per-frame phase draws no frame is **RED**;
  (ii) the frames include the empty game **and** a game of **> 16** plies, so `X5b-CONDITIONAL` is red;
  (iii) the arming phase runs **after** both phases on the same recorder.
- **`A4` (`glyph-mode.ts` is answered).** **Then** `glyph-mode.ts` is **not** a declared root, and
  the docblock states the membership rule: a module is on the frame path **iff** it is in the root's
  load closure or is loaded by a frame call.
- **`A5` (the files, named before code).** `git diff --name-only <base>..<delivered>` lists under
  `src/` **exactly** `src/history-pane.nfr.test.ts` and `src/render-seam.test.ts` — **two paths, 0
  production lines, 0 new files, 0 new spawns** (both phases run in the existing `spawnSync` child).
  `src/render-seam.test.ts` `A9` asserts the declared root is `render-seam.ts`, and its
  `LICENSED_DRIVERS` assertion is byte-identical. **And** the PR note lists every production line that
  names `FRAME_PRODUCERS` or the six-producer census (today `src/render-seam.ts:35`,
  `src/result-screen.ts:14`, `src/cli.ts:8`), for the owed follow-up.

## Dependencies

- **`ADR-0029` — accepted 2026-10-10.** It supersedes `ADR-0011` clause 2's "declared, not derived" in
  part and discharges `R1`. The composer tripwire uses **`ADR-0030` decision 2**'s definition of a
  value-binding import (accepted the same day).
- ~~**`ABC-042` is the natural pairing, not a blocker.**~~ `ABC-042` is `Done` (2026-08-15). The entry
  point never assembles a frame (`ADR-0011` clause 4); `ABC-041`'s `render-seam.ts` is the assembly
  module.
- **`ABC-041` does not block it and it does not block `ABC-041`.** `ABC-041` is `Done`.
- **Sequence `ABC-053` → `ABC-054` → `ABC-057`** *(Orchestrator, 2026-10-10)*. All three edit
  `src/history-pane.nfr.test.ts`; this ticket and `ABC-054` both edit `src/render-seam.test.ts`.
  **This ticket goes first.** Never in parallel. Pulling this ticket fires `ABC-057`'s `R5` promotion
  trigger (the next hop that opens the file).

## Security / NFR triggers

- **`NFR-002` (render latency < 16 ms) is the subject.** Carried structurally, as `ABC-041` carries
  it: the guard must be able to observe the per-frame path, or say that it cannot. **No wall clock is
  asserted by this ticket** and none should be manufactured for it.
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, scope = every file the branch adds under
  `src/`. **This ticket plans 0 new test files**: the guard change lands in the existing
  `src/history-pane.nfr.test.ts`, plus `A9`'s re-point in the existing `src/render-seam.test.ts`.
  `ADR-0029` measured the probe at about **+30 ms** (median 245 against 214 ms, noisy). No `NFR-008`
  verdict is claimed; that is Security/NFR's.
- **Security: clause (d) fires (2026-10-10, below); (a)–(c) do not.** Four clauses, each with its own subject, per `ABC-041`'s repaired
  threshold: **(a)** fires on a `dependencies` key or any touch of `package.json` /
  `package-lock.json`; **(b)** fires if any non-`.test.ts` file under `src/` imports a Node builtin,
  reads `process.`, or calls `spawn`/`exec`/`fetch`/`eval`/`new Function`; **(c)** fires if a test
  file in the diff adds network, a filesystem write outside a temp dir, or a new `child_process`
  spawn — the probe's existing `spawnSync` is precedent and does not fire, a **second** one does;
  **(d)** fires if the diff touches any file under `src/` other than the probe. **(d) FIRES** *(2026-10-10)*:
  `src/render-seam.test.ts` is a second test file, named in advance by `ADR-0029` and in `A5`. **On a
  disputed reading it fires and the gate resolves it.**

## Test notes

1. **The ledger is written down; rebuild it, do not re-derive it.** `ADR-0029` § Consequences names
   all ten builds; `X5b`'s original recipe is in `.grugops/context/quality-gate-ABC-041/notes/`, and
   the Architect's ledger notes are in `.grugops/context/ruling-abc053-abc054/notes/` (`…151fda8a`).
   Plant out of tree (`git archive` copy), as that hop did.
2. **Run the probe both ways, as `ABC-041` `A9` requires**: rooted at the module under test (green)
   and rooted at `src/turn-loop.ts` (still reports `history.ts`, so still armed).
3. **A per-frame guard has to CALL the seam.** The old probe misses `X5b` because it imports a root and
   stops.
4. ~~**The derive in `X5b` is a microtask.**~~ *Resolved by the ruling:* a load hook fires when the
   import is issued, so `X5b` is RED with **zero** settle turns on Node v26.11.0. The bounded settle
   stays because `package.json` admits Node `>= 22`. **Do not replace it with a timer or a wall-clock
   wait.** If the per-frame phase ever flakes, look at the settle first (`ADR-0029` § Rollback).
5. **Do not hand-build a `GameHistory` literal** for the frames (`ADR-0029` alternative 3). Use the
   `?fixture` instance's own `newGame` / `playMove`.

## Lane cost — how many test FILES this ticket implies

**Zero new files.** The guard lands in the existing `src/history-pane.nfr.test.ts`, and `A9`'s
re-point in the existing `src/render-seam.test.ts`. A second probe file was rejected by the ruling
(`ADR-0029` alternative 6): it would re-size this ticket to `M` and add a spawn.

## Size and priority rationale

**Size `S` (2), unchanged — re-checked 2026-10-10 against the ruled build.** What is left is one probe
phase in an existing child, one tripwire, one deleted list, one docblock and one re-pointed assertion,
all in two existing test files. The Architect ran a reference implementation out of tree, so nothing
here is unestimated. **Re-size trigger, unchanged:** a new probe file or a second spawn makes it `M`.

*Original rationale, kept:* the analysis is done; the non-trivial work was deciding declared-vs-derived,
and that is now `ADR-0029` decision 2.

**Priority `P1`, kept with a new reason.** The August reason (`ABC-042` is the next pull) has lapsed:
`ABC-042` is `Done`. **Today's reason:** this ticket heads the ruled `053` → `054` → `057` chain on one
file, and pulling it fires `ABC-057`'s own `R5` trigger to `P1`, so the chain is `P1` as a unit. On its
own merits it is high `P2`: nothing is broken in the delivered tree, and the guard it fixes is blind to
six measured builds on `NFR-002`'s premise. **The Orchestrator may lower it to `P2`** if it does not
want the chain pulled this wave; then `ABC-057` stays `P2` too.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM** (`owner-adrs-followups`, wave tip `246ddfc`). **Result: 10 of 10 —
MET → `Ready`.**
- **Item 10, ⚠️ → ✅.** The ruling is made and accepted (`ADR-0029`, owner 2026-10-10).
- **Item 2 stays ✅, re-cut.** Scope is the ruled build. `src/render-seam.test.ts` is named as a build
  file. The production docblocks are fenced out, with BA/PM's reason and an owed follow-up.
- **Item 4 stays ✅, re-cut.** `A3` is the ruling's ledger, ten builds plus `BASE`, with an exact expected result each (9 RED,
  `BASE` green, `WGLYPH-DYN` green and named). `A3b` makes the controls falsifiable. `A5` names two paths.
- **Item 5 stays ✅.** `ADR-0029`/`ADR-0030` accepted; the `053` → `054` → `057` order is named.
- **Item 6 stays ✅.** Security clause (d) fires and is named in advance; `N8-LANE` 0 new files.
- **Items 1, 3, 7, 8, 9 stay ✅.** Five test notes. `S`, `P1` (reason restated).
- **Not blocking, owed elsewhere:** `ADR-0011`'s pointer lines (Architect/Design); the production
  docblock follow-up (BA/PM, at this ticket's merge).

**Cut-time assessment, 2026-08-13** — assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 9 of 10 — NOT MET.** ⚠️×1.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the probe measures load time, `NFR-002`'s premise is per-frame, and `X5b` is 19/19 green |
| 2 | scope and out-of-scope clear | **✅** one ruling plus its guard; four fences, including "do not touch `src/render-seam.ts`" |
| 3 | INVEST-shaped | **✅** independent of `ABC-041` and `ABC-054`; small; testable via `X5b` |
| 4 | acceptance testable and measurable | **✅** five criteria; `A3` is a named mutant with a stated red/green outcome for either ruling |
| 5 | dependencies known | **✅** `ADR-0011` clause 2 and its own dated expiry; `ABC-042` named as pairing, not blocker |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` structural, `N8-LANE` ≤ 650 ms with 0 files planned, security's four clauses |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), with the re-size trigger named |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | ~~**⚠️ NOT MET**~~ **✅ 2026-10-10 — see the re-score above.** Was: the ruling itself is the unresolved question, and it is **Architect/Design's**, not BA/PM's. This ticket is Ready to be *assigned*, not Ready to be *built*: an engineer pulling it today would be choosing what `ADR-0011` measures, which is exactly the wrong decider. **→ RULED 2026-10-10 by Architect/Design in [`ADR-0029`](../../memory-bank/50-decisions/ADR-0029-the-frame-path-guard-measures-load-and-per-frame-from-one-composition-root.md) (`proposed`, owner acceptance owed).** It covers both phases, measured by module loads, from one declared root; `glyph-mode.ts` is off the path. Not re-scored: the verdict is BA/PM's |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-053`).
- Branch `grugops/ABC-053-frame-path-per-frame`, from `e15eb31d`. The code is `c9509031`.
- Not merged, not pushed.
- Decisions, readings and raw files are in `.grugops/context/ticket-to-pr-ABC-053/` (`…9594aafe`,
  `…3a8f5aa3`, `probe/`) and are not restated here.

**`A2`–`A5` are met; `A1` was discharged by `ADR-0029`. No stop condition fired.** No production file
was touched; security clause (d) fires as named in advance.

| # | verdict | reading (builds out of tree on `c9509031`) |
|---|---|---|
| `A2` | MET | 0 × `FRAME_PRODUCERS` in the file. The docblock names both phases, the one root `render-seam.ts`, and the four uncovered cases |
| `A3` | MET | **9 of 9 RED, BASE green.** `X5b`, `X5b-CONDITIONAL`, `X5b-query`, `X5b-computed`, `X5c`: per frame. `WDYNIMP`, `INLINE-TYPE`: at load. `WINDIRECT`: regex. `SECOND-COMPOSER`: tripwire. `WGLYPH-DYN` is green and named as the loss |
| `A3b` | MET | No frame drawn → RED (rows; frames list). Empty game only → RED (frames list), and `X5b-CONDITIONAL` is green without the 40-ply state. Arming runs last on the same recorder |
| `A4` | MET | `glyph-mode.ts` is not a root; the membership rule is stated in the docblock |
| `A5` | MET | `src/` diff = `src/history-pane.nfr.test.ts` (+124/−52) and `src/render-seam.test.ts` (+6/−6). 0 production lines, 0 new files, 1 → 1 `spawnSync(`. `A9` asserts the root; `LICENSED_DRIVERS` is byte-identical |

- **Gate.** Lint, typecheck and build exit 0. `npm test` is 51 files / 1582 passed (load1 9.51). The
  skip count is 0 (measured), and integrity reads `No findings.` `lane-inventory.js` is exit 0 with
  no findings.
- **Cost (`ADR-0035`, proposed; narrow set = the two files, twin control).**
  - Set 1 (n = 8) is inadmissible: twin +8.55 %.
  - Set 2 (n = 12): twin R 0.052 s, head **+0.008 s CPU** (interval −0.023..+0.068), load1 median 11.3.
  - `N8-LANE` has no added file in scope. No `NFR-008` verdict is claimed.
- **Owed `XS` follow-up (BA/PM, at merge).** These production docblocks are stale on landing:
  `src/render-seam.ts:34-36`, `src/result-screen.ts:13-15`, `src/cli.ts:8` (the "frame producers 6"
  census).
- **Next.** QE's hop, then Security/NFR resolves clause (d). After merge, `ABC-054` and then
  `ABC-057` start from this file.
