---
id: ABC-095
title: Put the book in front of the engine's move choice — a book hit skips the search entirely, and leaving book falls through to the search with nothing visible to the player
status: backlog
column: Backlog
size: M
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
- **Added 2026-10-12 by BA/PM** (subtask `bapm-amend-ABC-095`), to `ADR-0037` § Addendum — 2026-10-12
  (R1, R2) and `ADR-0036` § S1. Besides the decorator already built (`521a8513`), the wiring hop delivers:
  - **`src/book-file.ts`, a new production module and a capability holder** (R1). One export,
    `readBookFile(): Uint8Array`, with no parameter. It imports `node:fs` only, holds no `process`, does
    not catch, and reads nothing at import. **The probe's `read` is `readBookFile`.** Its `warn` writes
    the line plus `\n` to `process.stderr`, bound in `src/cli.ts`, in the same `const` as
    `random: Math.random`, above `runTurnLoop({`.
  - **The re-target of the 10 `src/cli.test.ts` children that substitute `./engine.ts`** (`black`,
    `random`, `mate`, `engineThrows`, `engineForeign`, `colourBlack`, `colourWhite`, `resigns`, `quits`,
    `renews`) to `./book-engine.ts`, whose double exports `withBook(_probe, _inner)` and returns today's
    double seam (R2). No child keeps an `./engine.ts` substitution.
  - **Two pins move, each with a reason line** (R2): `ABC-042` `A9`'s `process` census (9 → 10, a third
    `process.stderr`) and `ABC-043` `A1`'s `engine:` row (`withBook(book, createEngine({ budgetMs:
    DEFAULT_BUDGET_MS }))`, both halves pinned). **Neither ticket's criterion text changes.**
  - **`ABC-119`'s lane moves to a book-absent, real, byte-verified copy of the tree** (R2; `ABC-119`
    § Amendment — 2026-10-12). The same copy serves `A5`'s stream half (test note 4).
  - **The files under `src/` this ticket touches** (`ABC-041` clause (d)): `src/book-engine.ts`,
    `src/book-engine.test.ts`, `src/book-file.ts`, `src/cli.ts`, `src/cli.test.ts`,
    `src/cli.real-engine.test.ts`. Any other `src/` file in the diff fires (d).

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
- **`A2` (and it is fast, measured against a ratified budget).** **Given** the same call,
  *made as **the first call in a fresh process**, so the one read and parse of `book.json` are inside the
  30 ms (cold) — amended 2026-10-12, `ADR-0037` § Addendum R3; the bar does not change*, **then**
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
  - **The game half, made concrete** *(amended 2026-10-12, BA/PM re-score; "a full game" named no driver)*.
    **Given** one probe whose `read` throws (ENOENT) and the decorator around a counting stub inner seam,
    **when** the decorated seam is asked for a move in **10** successive positions that the checked-in book
    **does** hold (the start position first), **then** the inner seam is called **exactly 10** times, `warn`
    is called **exactly 1** time, and no call throws. This runs in the default lane, in `A1`'s file. "The game
    reaches a normal result" is the stream half's real child, which exits **0** on `quit`.
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
  never in the default lane. *(Amended 2026-10-12, `ADR-0037` § Addendum R1: the probe's `read` is
  `readBookFile` from `src/book-file.ts`, and its `warn` writes the line plus `\n` to `process.stderr`
  in `src/cli.ts`. "`engine:` is the only changed property inside the call" is unchanged.)*

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
  *(Amended 2026-10-12, `ADR-0037` § Addendum R3, which holds the definition; this page cites it.)*
  **The 5 ms miss bar is WARM:** the steady-state cost of one `bookMove(P)` call on a probe whose one
  read and parse are done, `P` the position after `1. e4 e5 2. Ke2`. Fresh process, outside the suite;
  one warm-up hit on the start position; **200** timed calls; **the maximum ≤ 5 ms**, with the median and
  p99 recorded beside it; on the reference machine under the quiet-host gate; in the notes, never
  asserted (test note 5). The cold read and parse are `A2`'s.
- **`NFR-002` (frame < 16 ms) — touched by `A4` only as an observer.** 0 frame modules changed.
- **`NFR-005` (depth in budget) — NOT triggered and must not be re-measured here.** A book hit does
  not search, so it contributes no depth. **A book that shortens the measured search time must
  never be quoted as evidence for `NFR-005`** — the position pool that row names (`kiwipete`,
  `position-6`) is out of book anyway. Recorded because it is an easy and attractive mistake.
- **`NFR-008` (lane ≤ 3 s wall / ≤ 13 s CPU; per-ticket ≤ 650 ms CPU).** **Target: ≤ 1 new test
  file, 0 new spawned processes, ≤ 650 ms CPU.** `A5`'s full game and `A2`'s timing run **outside**
  the default lane. *(2026-10-10: the CPU level is 15 s (`ADR-0019`). Under `ADR-0035` (accepted,
  owner option R-1) the counts — ≤ 1 file, 0 spawns — are the pins.)* *(Amended 2026-10-12,
  `ADR-0037` § Addendum § Consequences.)* **0 new spawns and ≤ 1 new test file still hold.** Two costs
  are added, both `UNKNOWN - verify`, both charged to this ticket's `N8-LANE` line and read by QE under
  `ADR-0035`:
  - each of the 10 re-targeted `src/cli.test.ts` children now loads the real `./engine.ts` closure, plus
    `./book.ts` and `./book-file.ts`, which the `./engine.ts` double used to replace;
  - `ABC-119`'s default-lane row now builds the book-absent tree copy (filesystem writes under
    `os.tmpdir()` only, 0 spawns).
- **Security: no new surface.** No file is parsed here that `ABC-094` does not already parse; no
  network; no manifest change. `ABC-041`'s clauses are answered at the delivering hop against the
  real diff, which cannot be enumerated before `EPIC-004` exists. *(2026-10-10: superseded for
  routing. ~~`ADR-0036` (b2) fires through the new edge to the probe, or (b1) if `src/cli.ts` holds the
  read (`ADR-0037` § Consequences' injected-reader option).~~ D3's `Math.random` is not a limb: ASVS
  `V11.5.1` is L2, outside the active L1 set, the same reasoning as `src/cli-options.ts:103`.)*
  - **Struck and replaced 2026-10-12 by BA/PM**, to `ADR-0037` § Addendum R1 and `ADR-0036` § `### S1 —
    the fourth holder — 2026-10-12`. The struck prediction missed `ABC-042` bar 4, and `book.ts` holds no
    limb, so its edge never fires. **Prediction for the delivered diff**, read at `In Security/NFR` with
    `.grugops/context/design-F-072-1/probe/clause-b.mjs` plus § S1 Ruling 2 by hand:
    - **(b1) FIRES** on `src/book-file.ts` (limb 1, the `node:fs` import) and on `src/cli.ts` (limb 2,
      the warn's `process.stderr`);
    - **(b2) FIRES** on `cli.ts -> book-file.ts`. It does not fire on `cli.ts -> book.ts` or
      `cli.ts -> book-engine.ts`;
    - **the holder set goes 3 → 4**, which fired `ADR-0036` § Decision 3's trigger. § S1 rules it:
      (b2) gets no call-graph reach, and **limb 1's (b1) unit is the holder file**, so any later edit to
      `src/book-file.ts` routes to `In Security/NFR`.
  - **The gate is S3**, the checklist in `.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43`.
    Build to it.
  - **`ABC-042` bar 4 is file-scoped** (S2): its text does not change, and `src/cli.ts` imports no
    `node:fs`.
  - **Accepted risks, named:**
    - **`AR-095-READ`** (LOW, owner Security/NFR). An oversized or non-regular `book.json` is read whole
      (a FIFO blocks the first engine ply) before `NFR-006`'s 1 MB cap refuses it. Fixed when `data/`
      can come from a location another principal writes (`EPIC-006`), or when the path stops being a
      constant.
    - **`AR-095-L1UNIT`** (LOW, owner the Orchestrator). Until `clause-b.mjs` folds Ruling 2, the
      Orchestrator applies it by hand when routing. The fold is owed by Architect/Design.
    - `F-095-1` (MEDIUM) was closed when the § S1 block merged.

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
   worse than the defect. *(Amended 2026-10-12: this is the copy `ABC-119`'s lane uses (`ADR-0037` R2),
   built by one helper, and S3 item 7 binds it. It is **a real copy**: every entry under its `src/` is a
   regular file (`lstat`), never a symbolic link, because Node resolves `import.meta.url` to the real
   path and a linked `src/` reads the repository's book. Its `src/` is byte-identical to the
   repository's, asserted before the spawn, and `data/opening-book/book.json` is absent. It is made
   under `mkdtemp(os.tmpdir() …)`, and removed by a recursive `rmSync` of exactly the path `mkdtemp`
   returned: never a joined or computed path, and never the repository.)*
5. **Every wall-clock figure lives in the notes with its machine, never in an assertion.** Standing
   project rule.

## Lane cost — how many test FILES this ticket implies

**One**, holding `A1`, `A3`, `A4` and `A6`. `A2` and `A5` are out-of-lane measurements.

*(Amended 2026-10-12, `ADR-0037` § Addendum.)* **Still one new test file**, `src/book-engine.test.ts`
(built at `521a8513`; it also holds `A5`'s game half). **Two existing test files are edited:**
`src/cli.test.ts` (10 hook sites, 2 pins) and `src/cli.real-engine.test.ts` (`A7`'s and `A5`'s
stream-half `CLI_DEEP` rows, and `ABC-119`'s move to the book-absent copy).

## Size and priority rationale

**Size `S`.** Two or three call sites and one test file; every hard problem was retired by
`ABC-094`. **Not `XS`**: `A4`'s frame comparison and `A1`'s spy are real test construction. **Not
`M`** — *on the assumption that the seam is a wrappable function*. **If `EPIC-004` delivers a seam
this ticket must reach inside, re-size at `In Design` and do not absorb the difference silently.**

**Re-sized 2026-10-12 by BA/PM: `S` → `M` (3).** The re-size trigger above did not fire (the seam is
wrappable). `S` was priced on its other premise, "two or three call sites and one test file", and
the wiring rulings broke that one:
- **Production:** 3 files, 2 of them new (`src/book-engine.ts`, `src/book-file.ts`, `src/cli.ts`).
  `book-file.ts` is a capability holder with an 8-item `In Security/NFR` checklist (S3).
- **Tests:** 1 new file and 2 edited. The edits include a new harness, the book-absent tree copy, with
  three safety properties (real copy, byte identity, exact-path removal), shared with `ABC-119`. They
  also include 2 `CLI_DEEP` rows, 12 mechanical edits in `src/cli.test.ts`, and the amended Givens of a
  `Done` ticket (`ABC-119` `A1`/`A3`/`A4`) that this diff delivers.
- **Comparable:** `ABC-119` is `M` for a new lane with a spawn harness. This ticket now carries a
  harness of that class on top of the decorator.
- **Not `L`.** Every design question is ruled (R1–R3, S1–S3), the decorator is built, and every
  remaining edit is named.
- **Not splittable.** The re-targets and the lane move must land in the same diff as the wiring line,
  or the default lane and `CLI_DEEP` go red (`…ef39c9a6` on the SE's branch). `ADR-0037`'s merge order
  says the same.

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
  level's blunders? `ABC-138` merged (`497d3b2f`) into `src/cli.test.ts`~~, which this ticket does not
  need to edit~~. *(Struck 2026-10-12 by BA/PM, `ADR-0037` R2: the wiring hop edits it, 10 hook sites
  and 2 pins, and it edits `src/cli.real-engine.test.ts` too.)* No file overlap with `ABC-083`, `ABC-010`, `ABC-131` or `ABC-141`.

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

## Re-score — 2026-10-12

BA/PM (task `wave-2026-09-25`, subtask `bapm-rescore-backlog-product`, Workflow 07), at `main` `1eb2edbc`.
**Result: 10 of 10. Recommended for `Ready`** (the column move is the Orchestrator's). **`S`, `P1`, unchanged.**
Readings and commands: `.grugops/context/bapm-rescore-backlog-product/notes/`. No timing was read.

**Items 3 and 10 ⚠️ → ✅. Both merge waits are discharged.**
- `ABC-093` merged `ac83c3fd`, and `ABC-094` merged `02dfa044` (UAT accepted by the owner). Both are ancestors
  of `1eb2edbc`.
- `ABC-078` was already `Done`.

**Every seam the page cites, re-read at `1eb2edbc`:**
- `src/cli.ts:176` is still `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`, inside `runTurnLoop({`
  at `:170`.
- `createEngine` is at `src/engine.ts:518`. It is a 5-line adapter over `chooseMove`.
- `EngineSeam` is at `src/turn-loop.ts:150`: `(history: GameHistory) => Promise<Move>`.
- `createBookProbe({ read, warn, random })` is at `src/book.ts:105`. It exposes `inBook` and `bookMove` on a
  `Position`. `warn` takes the line with no newline. `read` is called at most once, on the first probe.

**The book, measured.**
- `data/opening-book/book.json` is 356,526 B, sha256 `3802f52f…4bb41d`, md5 `3b42ff79…802642`. It is format 1,
  with 5,390 entries, 3,626 of them in book. The last commit to it is `5332f501` (`ABC-093`).
- **`ABC-145`'s sha256 check guards the compiler's SOURCE files**
  (`tools/opening-book/compile.ts`, `data/opening-book/ATTRIBUTION.md`). It does not guard the artifact at run
  time. Nothing in `src/` hashes `book.json`, and this ticket adds no check. A corrupt artifact is
  `ABC-094`'s refusal path, and `A5` covers it.
- **`A1`'s start position is in book:** key `99116e4984517620`, 20 moves, `e2e4` weight 2,032 and `d2d4`
  weight 1,333.
- **`A7`'s position after `1. e4` is in book:** 19 replies (FEN `… b KQkq e3 0 1`), named "King's Pawn Game".

**The stderr criterion the board said was owed is on the page.** `QE-094-a`'s stream half was folded into
`A5` on 2026-10-11: the warning goes to stderr exactly once, 0 bytes of its text go to stdout, and the child
exits 0 on `quit`. It is a `CLI_DEEP` row, and it is testable today. `src/cli.real-engine.test.ts` exists, and
its lane ran green on 2026-10-10 (`AGENTS.md`).

**The owner's question 5 (book against a weak level) is answered:** KEEP. A book hit overrides a weak level's
opening move (note `…owner-word-six-answers-b7c41e09`, item 4). So when `ABC-101` lands, `engine:` becomes this
decorator around the level's seam. Whichever of the two lands second composes onto the first.

**`A2`'s reference runtime:** `node --version` → `v26.11.0`, as the page says.

**`ADR-0012`, `ADR-0036` and `ADR-0037` are unchanged in their effect on this page:**
- the decorator is a third module, flat in `src/`;
- the new edge fires `ADR-0036` (b2), or (b1) if `src/cli.ts` holds the read, so the ticket goes through
  `In Security/NFR`;
- the probe is built with `random: Math.random` (D3).

**The `ADR-0035` addenda (A1, B1)** change only how a QE lane window is pre-registered. If this ticket adds its
one test file, its QE hop's `N8-LANE` reading follows them.

**Amended:** `A5`'s game half now names its driver: 10 in-book positions, a throwing `read`, a counting stub.
`A1`–`A4`, `A6` and `A7` are unchanged.

**File overlaps:**
- `ABC-101` edits the same `engine:` expression. Do not build the two in parallel.
- None with `ABC-024` or `ABC-096`, unless `ABC-096` builds a probe of its own (see `ABC-096`).
- None with `ABC-146`'s stale-trigger list.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope clear | ✅ |
| 3 | INVEST-shaped | ✅ *(was ⚠️)* every dependency is merged |
| 4 | acceptance testable and measurable | ✅ `A5`'s game half is now concrete |
| 5 | dependencies known | ✅ |
| 6 | security/NFR triggers with a measurable target | ✅ |
| 7 | test notes present | ✅ |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | ✅ *(was ⚠️)* |

**Production and UAT:** a new `src/` module and `src/cli.ts`. That needs the owner's UAT word. QE runs
`CLI_DEEP`.

## Delivery

**2026-10-12, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-095`).
- Branch `grugops/ABC-095-book-before-engine`, from `e9b1c50a`. Code commit `521a8513`: `src/book-engine.ts`
  (production, +20) and `src/book-engine.test.ts` (+186, 5 tests). Not merged, not pushed.
- Readings and calls are in `.grugops/context/ticket-to-pr-ABC-095/` (`…ef39c9a6` reds, `…1e971b4d` decision,
  `…31116475` timing, `…2cc11fef` artifact-ref, `probe/`). They are not restated here.

**Partial. The decorator and five criteria are met. The wiring line is NOT delivered, and the hop stopped there.**
- **Test note 1 holds.** The search is spy-able through the decorator's inner-seam argument. 0 engine lines changed,
  and `A6` does not fire.
- **Met:** `A1` (search called 0 times), `A3` (1 time, 0 stderr writes, 0 warnings), `A4` (two real frames across the
  leave-book ply), `A5`'s game half (10 calls, 1 warning), `A6`.
- **Not met: `A7` and `A5`'s stream half.** Both need the `src/cli.ts` line. That line was built and run, then reverted,
  because it reds:
  - `ABC-042` **bar 4** (security): no `node:fs` in `cli.ts`. The ADRs' "(b1) if `src/cli.ts` holds the read" missed it.
  - `ABC-043` `A5`/`A7`, `ABC-044` `A3` and `ABC-119` `A1`. Their Givens assume the engine seam answers the engine's
    first ply, and with the book in front it does not.
  - two mechanical pins (the `process.*` census and the `engine:` regex).
  - This § Re-score's "`src/cli.test.ts` … this ticket does not need to edit" does not hold at `e9b1c50a`.
- **Rulings owed before the wiring hop:**
  - Security/NFR: where the read lives. Either amend bar 4, which is (b1), or use a holder module, which is (b2).
  - BA/PM and QE: how the four substituted-engine and real-search Givens meet a book that answers first.

**2026-10-12, Software Engineer, the wiring hop** (subtask `wire-ABC-095`). `main` `0974102f` was merged in at
`75606020` (no rebase), and the code is at `09740ea4`. It was built to this page as amended below, to `ADR-0037`
§ Addendum R1–R3, `ADR-0036` § S1, and S3 items 2–8. No ruling was weakened. Readings, plants, clause (b) and
the S3 self-check: `.grugops/context/wire-ABC-095/notes/` (`…c2673608`, `…adc2b5bb`, `…a045086f`, `…bd2ae8d8`).

| criterion | state | reading |
|---|---|---|
| `A1` | met | `src/book-engine.test.ts`: inner seam called 0 times on a book hit |
| `A2` | **NOT READ, so not met** | no quiet window in 15 min: a foreign vitest at every poll. Not estimated. Instrument: `probe/time.ts cold-hit` |
| `A3` | met | the inner seam is called once, with 0 stderr writes and 0 warnings. The warm miss bar (R3) is **NOT READ**, as for `A2` |
| `A4` | met | two real frames across the leave-book ply |
| `A5` | met | game half: 10 inner calls, 1 warning. Stream half (`CLI_DEEP`, book-absent copy): stderr is exactly the warning line, 0 occurrences of it on stdout, the session ends on `quit`, exit 0 |
| `A6` | met | 0 lines in engine, search, evaluation, ordering, TT, levels, time budget, `turn-loop.ts`, `book.ts` and `data/` |
| `A7` | met | `engine:` is the only changed line inside `runTurnLoop({…})`; `book` is built with `read: readBookFile`, a stderr `warn` and `Math.random`. `CLI_DEEP`: the reply to `e2e4` is one of the book's entries. **The child row alone does not red an unwired build** (the search's reply is also a book move). The pin and the re-targeted children do |

`ABC-119` `A1`/`A3`/`A4` and its default row run on the real, byte-verified, book-absent `mkdtemp` copy, and
`A3`(iv) asserts the warning present exactly once. Gates: lint, typecheck and build exit 0; `npm test` 58 files,
1780 passed, 0 skipped; skip integrity clean; `CLI_DEEP` 9/9. **Open:** `A2` and the warm miss bar (timing, quiet
host); QE's `N8-LANE` costs and `ABC-119` `A6`; S3 at `In Security/NFR`; the owner's UAT word.

## Amendment and re-score — 2026-10-12 (wiring rulings)

BA/PM (task `wave-2026-09-25`, subtask `bapm-amend-ABC-095`), at `main` `85e9d5cc`. Rulings applied:
`ADR-0037` § Addendum — 2026-10-12 (R1–R3, merge order) and `ADR-0036` § `### S1 — the fourth holder —
2026-10-12`. Amendment lists: `.grugops/context/design-ABC-095-wiring/notes/…a4fe3027` and
`.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43`. Why each change was made:
`.grugops/context/bapm-amend-ABC-095/notes/`. No timing was read.

**What changed on this page, each dated in place, with the original words kept:**
- § Scope: `src/book-file.ts`, the 10 re-targets, the 2 pins, `ABC-119`'s lane move, and the `src/` file
  list for clause (d).
- `A2`: the Given is cold (the first call in a fresh process). The 30 ms bar does not change.
- `A7`: `read` is `readBookFile`, and `warn` writes to `process.stderr` in `src/cli.ts`.
- § Security / NFR triggers: `NFR-004`'s 5 ms miss bar is warm (R3). `NFR-008` adds two costs, both
  `UNKNOWN - verify`. The Security prediction is struck and replaced with R1's, citing § S1, S3,
  `AR-095-READ` and `AR-095-L1UNIT`.
- Test note 4: the copy's rules (real, byte-verified, book absent, `mkdtemp`, exact-path `rmSync`).
- § Lane cost: still one new file; two existing test files are edited.
- § Size: `S` → `M` (3). `P1` holds.
- The 2026-10-10 re-score's "does not need to edit `src/cli.test.ts`" is struck.

**`A1`, `A3`–`A6` and the Givens of `A5` and `A7` do not change.** Neither do `ABC-042`'s criteria or bar
4's text. **Criteria on other pages that this diff delivers**, each amended on its own page:
- `ABC-119` `A1`, `A3`, `A4` and its default-lane row: their Givens change;
- `ABC-043` `A1`: a pointer only;
- `ABC-043` `A2`/`A5`/`A7`, `ABC-044` `A3`/`A6`, `ABC-045` `A4`, `ABC-046` `A2`/`A3`/`A6`: (N) is
  confirmed, and the Givens do not change.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ unchanged |
| 2 | scope and out-of-scope clear | ✅ § Scope names every new file and every edited test file, and clause (d)'s file list. The engine boundary (`A6`) is unchanged |
| 3 | INVEST-shaped | ✅ every input is merged: `ABC-093`, `ABC-094`, `ADR-0037` § Addendum and `ADR-0036` § S1. `M`, and not splittable (§ Size) |
| 4 | acceptance testable and measurable | ✅ `A2` is now cold and definite. `ABC-119`'s amended Givens are checkable properties (`lstat`, byte identity, an absent file, a warning counted on stderr) |
| 5 | dependencies known | ✅ the decorator commit `521a8513` is this ticket's own, on `grugops/ABC-095-book-before-engine`. It merges only together with the wiring |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-004`: ≤ 30 ms cold, and a max of 200 warm calls ≤ 5 ms. `NFR-008`: ≤ 1 new file, 0 spawns, `N8-LANE` ≤ 650 ms CPU (two costs `UNKNOWN - verify`, read by QE). Security: the (b1)/(b2) prediction, the S3 checklist, two accepted risks named |
| 7 | test notes present | ✅ five; note 4 now carries the copy's rules |
| 8 | size assigned | ✅ `M` (3), re-sized from `S` |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | ✅ none. `AR-095-L1UNIT` is routed by hand until the fold lands, and it does not block |

**Result: 10 of 10.** The wiring hop may proceed. The column stays `In Development` (the board is the
Orchestrator's). **Production and UAT** are unchanged: the owner's UAT word is needed, QE runs
`CLI_DEEP`, and `In Security/NFR` runs S3.

## QE

QE/E2E, 2026-10-12 (subtask `qe-ABC-095`, branch `grugops/qe-ABC-095` off `2307fc11`; QE was the only hop running).
**Verdict: PASS_WITH_GAPS.** The detail is in `.grugops/context/qe-ABC-095/notes/` (decision `…ee8775a2`).

- **`A1`–`A7` MET, every one re-read by QE.**
  - **`A2`: max 8.300 ms ≤ 30 ms, cold.** 10 fresh processes, read in a clean pre-registered window.
  - **R3 (warm miss): max 0.0149 ms ≤ 5 ms.** 3 × 200 calls, median about 0.0009 ms and p99 about 0.007 ms.
  - **`CLI_DEEP` 9 / 9**, with 0 copies left behind.
  - **Real children:**
    - `A4`: the book frame and the search frame have the same rows, and nothing on screen or stderr names the book;
    - `A5`: 3 searched plies in a book-absent copy give exactly 1 warning, on stderr only;
    - `A7` ×10: every reply is a book entry.
- **18 plants, outside the repository.**
  - All are caught except a cwd-relative `readBookFile` (`QE-095-a`) and two copy leaks (`QE-095-d`).
  - `ABC-119` `A6` holds on the amended lane: M1 and M2 red `CLI_DEEP` `A1` alone, and the default lane stays green.
  - The 10 re-targeted children each exercise their criterion. `src/cli.test.ts` ×20 is green (the naive wiring is
    red in 4 of 10), and the default lane never reads the book.
- **The SE's readings hold.** The copy rule (no links, every non-directory entry a regular file) is honest and
  sufficient; the page wording is `QE-095-e`. "Both halves pinned" pins a superset of either reading.
- **`N8-LANE`: NOT READ (`QE-095-N8`, MEDIUM).**
  - All 4 pre-registered windows were void, and both named costs stay `UNKNOWN - verify`.
  - The count pins hold: +1 file, 0 new spawns.
- **Other gaps** (LOW unless marked):
  - `QE-095-b`: the `A7` child alone does not discriminate. That is enough by composition;
  - `QE-095-c`: "1 warning per process" is not behavioural in `CLI_DEEP`;
  - `QE-095-h`: the added file's lane cost has never been read;
  - `QE-095-f`, `-g` and `-i` are INFO.
- **UAT:** the waiver does not apply (3 production files in the delivered pair). The owner's word is owed. Next is
  `In Security/NFR` (S3).

**2026-10-12, `N8-LANE` re-read** (QE/E2E, subtask `qe-n8-ABC-095`, branch `grugops/qe-n8-ABC-095` off `7b93c973`).
QE was the only hop running; this followed the owner's word "(a)". The detail is in
`.grugops/context/qe-n8-ABC-095/notes/` (decision `…15521bc7`, readings `…195fc847`).
- **`N8-LANE` is MET on both named costs, so `QE-095-N8` is closed.**
  - The pre-registration was committed as `8f4f75e5` before any run.
  - Base `0974102f`, head `2307fc11`, n = 8. Each set was read clean in its first window, with 0 rounds discarded.
  - S1 `src/cli.test.ts`: H−B **+0.225 s** CPU (x(2)..x(7) −0.100..+0.690), twin R 0.340 s, `F` 0.100 s.
  - S2 `src/cli.real-engine.test.ts` default lane: **+0.025 s** (+0.020..+0.050), R 0.030 s.
- **`QE-095-h` is closed.** S3 `src/book-engine.test.ts` against the placeholder reads **+0.115 s**
  (+0.100..+0.120), R 0.030 s: MET.
- **The ticket line is arithmetic, not a reading.**
  - S1 + S2 medians sum to 0.250 s, and their x(7) ends sum to 0.740 s.
  - With S3, the sums are 0.365 s and 0.860 s.
- **New INFO items:**
  - `QE-095-j`: S1's x(7) is above 650 ms;
  - `QE-095-k`: S2 and S3 are admissible only by A1's tick floor;
  - `QE-095-l`: new twin readings for Architect/Design to fold.
- The laptop was on battery throughout. Power was logged and is not a void clause. No platform process appeared.
  The other `qe-ABC-095` rows stand.

## Security/NFR

**2026-10-12, Security/NFR** (task `wave-2026-09-25`, subtask `secnfr-ABC-095-s3`, branch
`grugops/secnfr-ABC-095-s3` off the QE tip `e1444f23`; width 1). This is the S3 gate on the delivered pair
`0974102f..2307fc11`; the QE tip adds no production line. ASVS L1, block on `high`. **Result:
PASS_WITH_RISKS.** The notes are in `.grugops/context/secnfr-ABC-095-s3/notes/` (`…b65b11b7` decision,
`…c24fec8e` readings) and are not restated here. No timing was read.

| item | reading | state |
|---|---|---|
| 1 clause (b) | (b1) `book-file.ts` limb 1 and `cli.ts` limb 2; (b2) `cli.ts -> book-file.ts` only; limb 3 silent; **holders 4**; Ruling 2 by hand fires | **MET, as predicted** |
| 2–6 | `book-file.ts` to R1's contract and cwd-independent in a child; `cli.ts` limited to imports, the `const` and `engine:`; `A9` 9 → 10; bars 1 and 4 unedited; `book.ts` 0 lines, fixed-text warning | **MET** |
| 7 tree copy | real copy, leak detector present once, `mkdtemp` under `tmpdir()`, exact-path removal | **MET**; the checklist text is corrected (`QE-095-e`) |
| 8 `ABC-041` (a) (c) (d) | no manifest change; tmp-only writes, 0 new default-lane spawns, 2 named `CLI_DEEP` children; the six files | **MET** |
| `QE-095-a` | ruled LOW, non-blocking: no ASVS requirement fails at the tip. Accepted as **`AR-095-CWD`** (owner: the Orchestrator). The named fix is QE's (run `A7`'s child from a neutral cwd), and it is measured to red the cwd-relative plant. Not owed before merge | **accepted risk** |

- **Required fixes before merge:** none.
- **Accepted risks:** `AR-095-CWD` (LOW, the Orchestrator), `AR-095-READ` (LOW, Security/NFR, confirmed)
  and `AR-095-L1UNIT` (LOW, the Orchestrator, confirmed open; Architect/Design owes the fold).
- **Owed by BA/PM:** test note 4 and `ABC-119` § Amendment, to the corrected copy rule; the
  `AR-095-CWD` fix, as an amendment to `A7`'s Given or as a follow-up.
- **Next:** `Ready for UAT` (the Orchestrator's move). The owner's UAT word is owed.

**2026-10-21, Security/NFR: `AR-095-CWD` is CLOSED. Its fallback form is carried as `AR-162-FALLBACK`.**
This is subtask `security-nfr-ABC-162`, on `ABC-162` at `3d05e230` (QE `91f18689`). The notes are in
`.grugops/context/security-nfr-ABC-162/notes/` (`…06c147db` decision, `…3ea2c883` readings) and are not
restated here.
- **`AR-095-CWD`: closed as written.** QE read P6b green at base and red at head, on `A7`'s stderr check
  (`…68554c31`). P6c and P6e red too.
- **`AR-162-FALLBACK` (LOW; owner the Orchestrator): the residual.** A cwd-first read with a module-URL
  fallback (P6f) still passes `CLI_DEEP`, because `A7`'s cwd is empty.
  - **Compensating controls:** `ADR-0036` Ruling 2 and S3 item 2 by hand.
  - **Closes when** a `CLI_DEEP` row reds P6f, read by QE with the plant.
  - **Promotion trigger:** a ticket that edits `src/book-file.ts`, or `EPIC-006` being cut or pulled.
    Either makes the fix owed before that merge.
  - **Fix:** one XS P3 test-only BA/PM cut. A non-book decoy goes at `data/opening-book/book.json` in `A7`'s
    neutral cwd, with `A1`/`A2` reworded. `A7`'s stderr assertion gets a label naming it the detector (QE's G-2).
- **Citation fix.** `V12.3.1` [L1] above is the ASVS 4.0.3 id. In the pinned 5.0.0 checklist the requirement
  is `V5.3.2` [L1]. The ruling is unchanged.
- **Unchanged:** `AR-095-READ` (LOW, Security/NFR) and `AR-095-L1UNIT` (LOW, the Orchestrator).
