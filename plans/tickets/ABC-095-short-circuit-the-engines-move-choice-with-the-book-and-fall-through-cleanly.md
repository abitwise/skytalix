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
  machine Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` elsewhere,
  measured **outside** the test suite.
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
- **`A6` (the engine was not modified).** **Given** the delivered diff, **then** the number of
  changed lines in the modules `EPIC-004` delivers as its search, evaluation and ordering is
  **0** — or, if the seam genuinely cannot be consumed without a change there, **the ticket stops
  and the change is raised against `EPIC-004`**, and this criterion fails rather than being
  reworded. **This criterion is the subject boundary, written as a test.**

## Dependencies

- **`EPIC-004` — HARD BLOCKER, BY NAME AND BEHAVIOUR.** What is needed: **a single, callable move-
  choice entry point that takes a position (and the difficulty/time budget) and returns a chosen
  legal move, which a caller can bypass.** *That is all.* Three things about it are **unknown at
  cut time and must not be guessed**: (a) its ticket id; (b) whether it is a function this ticket
  can wrap from outside, or a loop this ticket would have to reach into — **if the latter, `A6`
  fires and this ticket stops**; (c) whether the entry point is spy-able, which `A1` requires.
  **Whoever pulls this ticket reads `EPIC-004`'s delivered tickets first and records the real id
  here.**
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
  the default lane.
- **Security: no new surface.** No file is parsed here that `ABC-094` does not already parse; no
  network; no manifest change. `ABC-041`'s clauses are answered at the delivering hop against the
  real diff, which cannot be enumerated before `EPIC-004` exists.

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

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 7 of 10 — items 3, 5 and 10 carry a ⚠️. THE SCORE IS NOT INFLATED AND
THIS TICKET IS NOT READY TO PULL; it is honestly cut, honestly blocked, and it says so.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; this is the only ticket in the epic a player can perceive |
| 2 | scope and out-of-scope clear | **✅** four in, four out; the engine boundary is written as a STOP and again as `A6` |
| 3 | INVEST-shaped | **⚠️ NOT independent.** Valuable, estimable, small and testable — but it depends on an epic that has not been cut. Honest, and stated rather than scored away. |
| 4 | acceptance testable and measurable | **✅** six criteria on counts and states: search called 0 / exactly 1, ≤ 30 ms, 0 stderr bytes, equal row counts, exactly 1 warning, 0 engine lines changed |
| 5 | dependencies known | **⚠️ KNOWN BY NAME, UNRESOLVED BY IDENTITY.** `EPIC-004`'s seam is described by behaviour because its tickets were being minted in parallel with this page. Three sub-unknowns named — id, wrappable-or-not, spy-able-or-not. **No id was guessed.** |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 30 ms hit / 5 ms miss; `NFR-002` observed only; `NFR-005` explicitly not triggered and the tempting misuse named; `NFR-008` ≤ 650 ms / 1 file / 0 spawns |
| 7 | test notes present | **✅** five, including "check the seam is spy-able before estimating" |
| 8 | size assigned | **✅** `S`, conditional on the seam's shape, with the re-size trigger named |
| 9 | priority assigned | **✅** `P1`, with the reasons it is neither `P0` nor `P2` |
| 10 | no major unresolved blocker | **⚠️ TWO.** (a) **`EPIC-004`'s move interface does not exist.** (b) **Where the short-circuit lives is an unmade architecture decision straddling two epics.** Neither is resolvable by this role and neither was resolved by inference. |
