---
id: ABC-095
title: Put the book in front of the engine's move choice — a book hit skips the search entirely, and leaving book falls through to the search with nothing visible to the player
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-005
feature: —
---

# ABC-095 — the wiring hop, and the ONE ticket in `EPIC-005` that `EPIC-004` blocks

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-005`, Workflow 03) from
> `plans/epics/EPIC-005-opening-book.md` § Scope bullets 3–4 and § Acceptance bullets 1 and 3.
>
> **`EPIC-004` IS BEING DECOMPOSED IN PARALLEL WITH THIS TICKET AND ITS TICKET IDS DID NOT EXIST
> WHEN THIS PAGE WAS WRITTEN. Every dependency below is stated BY EPIC AND BY BEHAVIOUR. No
> `EPIC-004` ticket id appears on this page, and none may be added by guess — an invented id is
> worse than an unresolved one.** Whoever pulls this ticket resolves the dependency by reading
> `EPIC-004`'s delivered tickets, and writes the real id in then.

## Problem

*User*: the player. Everything else in `EPIC-005` is machinery; **this ticket is the only one that
changes what a game feels like.**

*Pain*: with `ABC-093` and `ABC-094` delivered and this ticket not, the repository contains a
correct, tested, licensed opening book that **no game ever consults**. `EPIC-005`'s own user-value
statement — *"the opponent plays real lines … the early game is instant, and games vary between
sessions"* — is delivered here or nowhere.

*Value*: two or three call sites. All the risk was retired upstream by `ABC-094`; what remains is
placing the short-circuit and proving the fall-through is invisible.

## Scope

- **Consume `EPIC-004`'s move-choice entry point** — the behaviour described as *"given a position
  and a difficulty/time budget, return a chosen legal move"* (`EPIC-004` § Acceptance: *"when the
  engine is asked for a move under the default time budget, then it returns a legal move within
  that budget"*) — and place the book probe **in front of** it.
- **On a book hit: return the book move and do not enter the search at all.**
- **On a book miss, or on no book: enter the search exactly as if this ticket did not exist.**
- **Prove the fall-through is invisible** at the ply the game leaves book.
- **The one wiring line at the composition root** *(added 2026-10-10 by BA/PM, drawing the boundary
  that `ADR-0012` clause 6 left to this role)*. `src/cli.ts:176` reads
  `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })` today. This ticket wraps that value with
  the decorator. **Without that line, no player's game ever consults the book**, and the Problem
  above says this ticket is the only one a player can perceive. The seed binding comes with the
  line (`ADR-0012` clause 3(b)). Its source is **RULED 2026-10-10 (`ADR-0037` D3)**: there is no
  session seed, and the root builds the probe with `random: Math.random`.

## Out of scope — read this before writing a line

- **THE SEARCH IS `EPIC-004`'s.** This ticket **does not** modify search, evaluation, move
  ordering, the transposition table, iterative deepening, the time budget or the difficulty levels.
  **If placing the short-circuit requires changing any of those, STOP** — that is a change to
  `EPIC-004`'s seam, it is `EPIC-004`'s work to make, and it comes back here as a dependency. **Do
  not cut or perform even a small piece of the engine's work under this ticket's id.**
- **Building or changing the book, the artifact, the probe or the picker.** `ABC-093`/`ABC-094`'s,
  and both must be closed first.
- **Displaying the opening name.** `ABC-096`'s.
- **Any change to the book's contents to make a test pass.**

## Acceptance (Given/When/Then)

- **`A1` (a book hit does not search — proved by a CALL COUNT, not by a clock).** **Given** the
  start position and a loaded book, **when** the engine is asked for a move, **then** the returned
  move is one of the book's entries for that position and `EPIC-004`'s search entry point is
  called **exactly 0 times**. *(A spied call count. This project has ruled twice — `NFR-001`,
  `NFR-005` — that "not slower at all" is a call-count bar and no wall-clock run can settle it.)*
- **`A2` (and it is fast, measured against a ratified budget).** **Given** the same call, **then**
  it returns in **≤ 30 ms** — 1% of `NFR-004`'s ratified 3 s default budget — on the reference
  machine Apple M3 (Mac15,13) / ~~Node v24.12.0~~ **Node v26.11.0** / Darwin 25.5.0 arm64,
  `UNKNOWN - verify` elsewhere, measured **outside** the test suite. *(Re-pointed 2026-10-11 by
  BA/PM. The reference stack was re-declared to v26.11.0 by `ADR-0035` decision 5, applied in the
  `NFR-008` row. v24.12.0 is no longer installed. That clears `QE-094-f`'s "the reference names
  v24.12.0" ambiguity for this page. The bar is unchanged.)*
- **`A3` (leaving book searches, exactly once, silently).** **Given** a position **not** in the
  book, **when** the engine is asked for a move, **then** the search entry point is called
  **exactly 1** time, a legal move is returned, and **0 bytes** are written to stderr and **0**
  error or warning text appears in the rendered output. *(`EPIC-005` § Acceptance: "nothing in the
  output indicates an error".)*
- **`A4` (the transition is invisible — measured on the frame, not asserted by feel).** **Given** a
  game played from the start position that leaves book at ply *n*, **when** the frames at ply
  *n − 1* and ply *n* are compared, **then** they have the **same row count** and the message
  region carries **0** additional lines attributable to the book. *(`ADR-0009` and `NFR-002` fence
  the frame's row identity; a "now searching" line would break both.)*
- **`A5` (no book at all is a normal game).** **Given** the artifact absent from disk, **when** a
  full game is played, **then** every engine move comes from the search, **exactly 1** warning is
  emitted for the whole process, and the game reaches a normal result — **0** crashes.
  *(`EPIC-005` § Acceptance bullet 4. `ABC-094` proves the probe's half; this proves the game's.)*
  - **The stream half** *(folded 2026-10-11 by BA/PM from `QE-094-a`, MEDIUM, gap register
    `…3058eacd` on `grugops/ABC-094-book-probe`)*. **The one warning goes to stderr, and 0 bytes of
    it go to stdout.**
    - **Why this is `ABC-095`'s.** `ABC-094`'s probe takes an injected warn sink (SE decision
      `…d14f72cb`, allowed by `ADR-0037` § Consequences). So the stream is fixed only where the
      composition root binds it, and that root is this ticket's (`A7`).
    - **Given** the artifact moved aside (test note 4), **when** a real `node src/cli.ts` child runs
      from launch to exit, with its stdout and stderr captured separately (the human may `quit`
      after the engine's first reply), **then**:
      - stderr carries the warning **exactly once**;
      - stdout carries **0 bytes of the warning's text** (a count of its text in stdout is 0);
      - the child exits 0 on `quit`.
    - **"0 bytes to stdout" means 0 bytes OF THE WARNING.** In a live game, stdout carries the
      frames, so stdout itself is never empty. QE's "stdout 0 B" reading came from a probe-only
      child binding with no frames.
    - **This is a `CLI_DEEP` row** in `src/cli.real-engine.test.ts`, next to `A7`'s, and never in
      the default lane. It adds no test file.
- **`A6` (the engine was not modified).** **Given** the delivered diff, **then** the number of
  changed lines in the modules `EPIC-004` delivers as its search, evaluation and ordering is
  **0** — or, if the seam genuinely cannot be consumed without a change there, **the ticket stops
  and the change is raised against `EPIC-004`**, and this criterion fails rather than being
  reworded. **This criterion is the subject boundary, written as a test.**
- **`A7` (a real session consults the book)** *(added 2026-10-10)*. **Given** the delivered
  `src/cli.ts`, **then** its `engine:` value is the decorator wrapping
  `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` with a probe built with `random: Math.random`
  (`ADR-0037` D3), and `engine:` is the only changed property inside the `runTurnLoop({ … })` call.
  *(Folded 2026-10-10: a probe built in a `const` above the call is allowed. It is not inside the
  call.)* **And given** the book present and a real `node src/cli.ts` child in
  which the human plays `e2e4`, **then** the engine's reply is one of the book's entries for the
  position after `1. e4`. That is one row in the `CLI_DEEP` lane (`src/cli.real-engine.test.ts`),
  never in the default lane.

## Dependencies

- **`EPIC-004` — HARD BLOCKER, BY NAME AND BEHAVIOUR.** What is needed: **a single, callable move-
  choice entry point that takes a position (and the difficulty/time budget) and returns a chosen
  legal move, which a caller can bypass.** *That is all.* Three things about it are **unknown at
  cut time and must not be guessed**: (a) its ticket id; (b) whether it is a function this ticket
  can wrap from outside, or a loop this ticket would have to reach into — **if the latter, `A6`
  fires and this ticket stops**; (c) whether the entry point is spy-able, which `A1` requires.
  **Whoever pulls this ticket reads `EPIC-004`'s delivered tickets first and records the real id
  here.** *(2026-10-10: `ABC-078` is `Done` (2026-08-20). `createEngine` is at `src/engine.ts:518`.
  `EngineSeam` has moved to `src/turn-loop.ts:150` (it was `:138`). `ABC-043`'s composition root
  exists at `src/cli.ts:176`.)*
- **`ABC-094` — HARD BLOCKER.** No probe, nothing to place.
- **`ABC-093` — transitively required.**
- **`EPIC-002` / the frame path — needed by `A4` only.** `src/frame.ts`, `src/render.ts` and
  `src/status-panel.ts` are on `main` (read at this hop). `A4` compares frames; it does not change
  them.
- **OPEN AND DELIBERATELY NOT RESOLVED: *where* the short-circuit lives.** Inside `EPIC-004`'s
  move-choice function (which makes the engine know about the book) or in the caller above it
  (which makes the turn owner know about both) is an **architecture** decision that straddles two
  epics. **Architect/Design's, at `In Design`. It is recorded here and taken nowhere**, because
  taking it in a ticket page would be `EPIC-005` deciding `EPIC-004`'s shape.
- **RULED 2026-08-18 — `ADR-0012` is `accepted`, and the answer is NEITHER of the two places above.**
  The short-circuit lives in a **third module, owned by neither epic's core**: this ticket delivers a
  **decorator** taking the book probe and an **inner `EngineSeam`**, returning an `EngineSeam`; on a
  hit it never calls the inner seam. `EPIC-006`'s composition root wires it. The three unknowns in
  the `EPIC-004` bullet above are answered — **(a) the ticket id is `ABC-078`**; **(b) wrappable from
  outside: YES**, `EngineSeam` is a function type and `ABC-078` `A6` requires assignability to it;
  **(c) spy-able: YES**, the inner seam is an **argument**, so `A1`/`A3` count calls with a stub and
  need no module mocking. **`A6` therefore does not fire.** One thing this ticket did not know it had
  is flagged in `ADR-0012` clause 6: one of its "two or three call sites" is `ABC-043`'s composition
  root, which does not exist yet — it blocks `EPIC-005`'s **user value**, not this ticket's criteria.
  *(Recorded by Architect/Design at task `design-p0-chain-rulings-2026-08-18`. **Re-scoring the DoR
  and closing `G3` on the board are BA/PM's pen** and are not done here.)*

## Security / NFR triggers

- **`NFR-004` (≤ 3 s per move, hard ceiling 5 s) — consumed, not owned.** `A2`'s 30 ms is 1% of the
  default budget. **This ticket must not be allowed to make the *miss* path slower**: `A3`'s
  call-count bar plus a recorded probe cost of **≤ 5 ms** on an out-of-book position covers it.
- **`NFR-002` (frame < 16 ms) — touched by `A4` only as an observer.** 0 frame modules changed.
- **`NFR-005` (depth in budget) — NOT triggered and must not be re-measured here.** A book hit does
  not search, so it contributes no depth. **A book that shortens the measured search time must
  never be quoted as evidence for `NFR-005`** — the position pool that row names (`kiwipete`,
  `position-6`) is out of book anyway. Recorded because it is an easy and attractive mistake.
- **`NFR-008` (lane ≤ 3 s wall / ≤ 13 s CPU; per-ticket ≤ 650 ms CPU).** **Target: ≤ 1 new test
  file, 0 new spawned processes, ≤ 650 ms CPU.** `A5`'s full game and `A2`'s timing run **outside**
  the default lane. *(2026-10-10: the CPU level is 15 s (`ADR-0019`). Under `ADR-0035` (accepted,
  owner option R-1) the counts — ≤ 1 file, 0 spawns — are the pins.)*
- **Security: no new surface.** No file is parsed here that `ABC-094` does not already parse; no
  network; no manifest change. `ABC-041`'s clauses are answered at the delivering hop against the
  real diff, which cannot be enumerated before `EPIC-004` exists. *(2026-10-10: superseded for
  routing. `ADR-0036` (b2) fires through the new edge to the probe, or (b1) if `src/cli.ts` holds the
  read (`ADR-0037` § Consequences' injected-reader option). D3's `Math.random` is not a limb: ASVS
  `V11.5.1` is L2, outside the active L1 set, the same reasoning as `src/cli-options.ts:103`.)*

## Test notes

1. **`A1` and `A3` need a spy on `EPIC-004`'s search entry point.** **Check that it is spy-able
   before estimating this ticket** — if the search is called through a closure the caller cannot
   see, `A1` is unwritable and this ticket needs re-shaping, not a weaker criterion.
2. **Do not prove `A1` with a stopwatch.** "It came back fast so it must not have searched" is the
   exact reasoning `plans/nfr-catalog.md` has rejected twice. Count the calls.
3. **`A4` compares two real frames.** Capture them; do not reason about them. The row-count
   identity is fenced by `ADR-0009` (`= 23` tripwire, `≤ 24` requirement) and a book status line
   would trip it — which is `ABC-096`'s problem to solve, **not something to pre-empt here**.
4. **Play `A5`'s game with the artifact moved aside in a temp copy of the tree, never by deleting
   the checked-in file.** Shared working tree; a test that leaves the repo dirty on failure is
   worse than the defect.
5. **Every wall-clock figure lives in the notes with its machine, never in an assertion.** Standing
   project rule.

## Lane cost — how many test FILES this ticket implies

**One**, holding `A1`, `A3`, `A4` and `A6`. `A2` and `A5` are out-of-lane measurements.

## Size and priority rationale

**Size `S`.** Two or three call sites and one test file; every hard problem was retired by
`ABC-094`. **Not `XS`**: `A4`'s frame comparison and `A1`'s spy are real test construction. **Not
`M`** — *on the assumption that the seam is a wrappable function*. **If `EPIC-004` delivers a seam
this ticket must reach inside, re-size at `In Design` and do not absorb the difference silently.**

**Priority `P1`.** It is where all of `EPIC-005`'s user value is realised. **Not `P0`**: it cannot
start, and a `P0` on unstartable work makes the board lie. **Not `P2`**: the moment `EPIC-004`'s
move interface lands, this becomes the cheapest visible win on the board.

## Definition of Ready

**Fold note, 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-batch-2026-10-11`, at
`506550f3`). **Not re-scored; still 8 of 10, ⚠️x2 (items 3 and 10).** The re-score trigger is
`ABC-094`'s merge, and `ABC-094` is `In UAT` today.
- **`QE-094-a` is folded into `A5`** as its stream half. The one warning goes to stderr, and 0 bytes
  of it go to stdout, read on a real child. It is one more `CLI_DEEP` row, not one more file.
- **`QE-094-a` asked for this to land before `ABC-095` is pulled.** It has.
- **`A2`'s reference runtime** is re-pointed to v26.11.0 (`ADR-0035` decision 5). The bar is
  unchanged.
- **`QE-094-e`** (one warning per probe *instance*) is already covered by `A5`'s "exactly 1 for
  the whole process", which holds only if the root builds one probe. `A7`'s wiring line builds
  one.
- The `ABC-094` page was not touched.

**RE-SCORED 2026-10-10 by BA/PM at the fold** (task `wave-2026-09-25`, subtask
`bapm-fold-book-chain-2026-10-10`, at `4768b3b0`; `ADR-0037` folded per `…d06f5ba8`). **Result: 8 of
10, ⚠️x2 (items 3 and 10). It stays in `Backlog`, last of the chain.** Readings:
`.grugops/context/bapm-fold-book-chain-2026-10-10/notes/`.

- **Item 5 ⚠️ → ✅.** The seed source is ruled (`ADR-0037` D3). `A7` names the probe's `random`.
- **Items 3 and 10 ⚠️ STAND**, on `ABC-093` and `ABC-094`, both unbuilt. **Re-score trigger:
  `ABC-094`'s merge.**
- **Size `S` and `P1` hold.**
- **Production and UAT.** **The owner's UAT word** (a decorator module, and `src/cli.ts`).
  `In Security/NFR` through (b2), or (b1) if `src/cli.ts` holds the read. D3 adds no limb.
- **`ABC-101` overlap.** Its integer seed for `createLevel` comes from the same root read,
  `Math.floor(Math.random() * 2 ** 32)` (D3). Its wiring is its own. Owner question 5 is unchanged.

**History. Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-p1-backlog-2026-10-10`,
at `aaa88263`). **Result: 7 of 10, ⚠️x3. It stays in `Backlog`, last of the four.** Readings:
`.grugops/context/rescore-p1-backlog-2026-10-10/notes/`.

- **The `ABC-078` half of item 10 is DISCHARGED.** It is `Done` and the seam it supplies is merged.
  **Items 3 and 10 STAND** on `ABC-093` and `ABC-094`, both unbuilt.
- **Item 5 ✅ → ⚠️, and this is the cost of the wiring line now in scope.** For "games vary between
  sessions" (`EPIC-005`), the composition root needs a seed that differs per session. **No production
  module has a session seed source today.** `createEngine` takes none, and `src/levels.ts` takes a
  caller's seed. **Ruled 2026-10-10 (`ADR-0037` D3): there is no session seed; `src/cli.ts` binds
  `Math.random`.**
  **If the Orchestrator reverses the wiring call,** the score returns to 8/10 and the wiring line
  needs its own XS ticket.
- **Size `S` holds**: one wiring expression, plus one `CLI_DEEP` row. **`P1` holds.**
- **Production and UAT.** It adds a new decorator module (`ADR-0012` clause 8: flat in `src/`) and
  changes `src/cli.ts`, so it **needs the owner's UAT word**. The new `src/cli.ts` import edge
  reaches `ABC-094`'s `node:fs` read, which fires `ADR-0036` (b2), so expect `In Security/NFR`.
  `CLI_DEEP` runs at QE (`AGENTS.md`: after any `src/cli.ts` change).
- **Overlaps.** `ABC-101` (P2, Backlog) rewrites the same `engine:` expression to wire a level. The
  second of the two to land composes onto the first. Owner question: does a book hit bypass a weak
  level's blunders? `ABC-138` merged (`497d3b2f`) into `src/cli.test.ts`, which this ticket does not
  need to edit. No file overlap with `ABC-083`, `ABC-010`, `ABC-131` or `ABC-141`.

**History. Assessed 2026-08-16** against `agent-factory/checklists/definition-of-ready.md` by BA/PM
at the cutting hop. **Result: 7 of 10 — items 3, 5 and 10 carry a ⚠️. THE SCORE IS NOT INFLATED AND
THIS TICKET IS NOT READY TO PULL; it is honestly cut, honestly blocked, and it says so.**

**RE-SCORED 2026-08-18 by BA/PM** (task `cut-frame-overflow-2026-08-18`), on `ADR-0012` being
`accepted` and merged (`3f73d7e`). **Result: 8 of 10, ⚠️x2 — STILL NOT READY TO PULL.** One of the
three ⚠️ is discharged; the other two are **half** discharged, and a half is not a ✅.

- **⚠️(5) → ✅. All three named unknowns are answered by ruling.** **(a) the id is `ABC-078`**;
  **(b) wrappable from outside: YES** — `EngineSeam` is a function type and `ABC-078` `A6` requires
  assignability to it; **(c) spy-able: YES** — the inner seam is an **argument**, so `A1`/`A3` count
  calls with a stub and need no module mocking. **`A6` does not fire.** No id was guessed: the ADR
  names it.
- **⚠️(10) STANDS, reduced from TWO blockers to ONE.** Blocker **(b)** — *where the short-circuit
  lives* — is **RULED and closed**: a third module, a decorator, owned by neither epic's core.
  Blocker **(a)** stands: **`ABC-078` is `In Review` and NOT merged**, and `ABC-093`/`ABC-094` — the
  artifact and the probe, both hard blockers on this page — are **unbuilt and in `Backlog`**. There
  is nothing to wrap and nothing to probe with. **The ⚠️ is not smoothed because the ruling moved
  the architecture question, not the build order.**
- **⚠️(3) STANDS** for the same reason: still **not independent**, now of three merges rather than
  of an unmade decision. What the ruling did buy is that item 8's conditional is settled — see below.
- **Also settled by the ADR, and worth the reader's attention: `ADR-0012` clause 6 flags that one of
  this ticket's "two or three call sites" is `ABC-043`'s composition root, which does not exist
  yet.** That blocks **`EPIC-005`'s user value**, not this ticket's criteria — recorded, not scored.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; this is the only ticket in the epic a player can perceive |
| 2 | scope and out-of-scope clear | **✅** four in, four out; the engine boundary is written as a STOP and again as `A6` |
| 3 | INVEST-shaped | **⚠️ STANDS — NOT independent**, updated 2026-08-18. Valuable, estimable, small and testable, and the shape question is now ruled (`ADR-0012`) — but it still waits on three merges: `ABC-078` (`In Review`, not merged), `ABC-093` and `ABC-094` (both `Backlog`, both hard blockers on this page). The dependency changed character, not existence. |
| 4 | acceptance testable and measurable | **✅** six criteria on counts and states: search called 0 / exactly 1, ≤ 30 ms, 0 stderr bytes, equal row counts, exactly 1 warning, 0 engine lines changed |
| 5 | dependencies known | **✅** *(was ⚠️)* **RESOLVED BY IDENTITY 2026-08-18, by ruling** — `ADR-0012` (`accepted`, `3f73d7e`) answers all three sub-unknowns: **id `ABC-078`**, **wrappable: YES** (`EngineSeam` is a function type), **spy-able: YES** (the inner seam is an argument). No id was ever guessed; the ADR supplied it |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 30 ms hit / 5 ms miss; `NFR-002` observed only; `NFR-005` explicitly not triggered and the tempting misuse named; `NFR-008` ≤ 650 ms / 1 file / 0 spawns |
| 7 | test notes present | **✅** five, including "check the seam is spy-able before estimating" |
| 8 | size assigned | **✅** `S`, and **the condition is now DISCHARGED** — `ADR-0012` rules the seam a wrappable function type, which is the assumption `S` was priced on, so the re-size trigger (*"a seam this ticket must reach inside"*) **cannot fire**. `S` stands unconditionally |
| 9 | priority assigned | **✅** `P1`, with the reasons it is neither `P0` nor `P2` |
| 10 | no major unresolved blocker | **⚠️ ONE** *(was TWO)*, 2026-08-18. **(b) is CLOSED by `ADR-0012`** — the short-circuit lives in a third module, a decorator; neither epic's core owns it. **(a) STANDS and is now a MERGE-ORDER blocker, not a design one:** `ABC-078` is `In Review` and unmerged, and `ABC-093`/`ABC-094` are unbuilt — no seam to wrap, no probe to place. Not resolvable by this role, and not resolved by inference |
