---
id: ABC-031
title: Coordinate move input — `e2e4`, `E2E4`, `e2-e4`, `e7e8q`, resolved against the legal move list
status: backlog
column: Backlog
size: S
priority: P0
epic: EPIC-003
feature: —
---

# ABC-031 — coordinate move input, resolved against the legal move list and never constructed

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition. First of seven; `ABC-010` already sat under this epic
> before the decomposition and is not re-cut.

## Problem

*User*: the player who does not know algebraic notation. `EPIC-003`'s stated user value is *"a player
who does not know algebraic notation must still be able to play"*, and `e2e4` is the format that
promise rests on.

*Pain*: **there is no production input path of any kind today.** `ABC-019` shipped
`InputSeam = (history: GameHistory) => Promise<PromptOutcome>` and shipped the loop that awaits it,
but the only implementation is a scripted stub inside `src/turn-loop.test.ts` — that module's own
header says so (`src/turn-loop.ts:45-47`: *"THE STUBS ARE NOT HERE … a `src/` stub module would be
production code that is dead the day the real parser lands"*). **Measured 2026-08-12: no non-test
file in `src/` imports `turn-loop.ts`.**

*Value*: the cheapest half of the epic's dual-format promise, and the half a beginner reaches for. It
is a pure total function over merged code — no I/O, no prompt, no terminal — so it can be delivered
and proved before any of the surface around it exists.

## Scope

A **new module under `src/`** (the file name is the engineer's; nothing here depends on it) exporting
one **total function** that resolves a coordinate string against a position's legal moves:

- **Accepted forms, and only these.** Two square names, optionally separated by a single `-`, with an
  optional promotion letter: `e2e4`, `e2-e4`, `e7e8q`, `e7-e8q`. **Case-insensitive throughout**
  (`E2E4`, `E7E8Q`). Surrounding whitespace is trimmed.
- **Three outcomes, matching `ADR-0004`'s `SanParseResult` shape** — `move` (exactly one), `ambiguous`
  (N ≥ 2 candidates), `rejected` (a machine-readable code). Same three arms, same closure rule, so
  `ABC-033` dispatches over one shape instead of two.
- **Move identity — every returned `Move` is an element of `legalMoves(position)`.** This ticket
  adopts `ADR-0004` **(2b)** verbatim for the coordinate reader.
- **An optional `legal?: readonly Move[]` parameter**, the same contract and the same caller
  obligation `ADR-0004` clause 2 states for `toSan` / `parseSan`: *the supplied list must be the legal
  moves of the supplied position*.

## Out of scope

- **SAN** — `ABC-032`. This module contains no piece letters, no capture marker, no castle string and
  no disambiguation rule. Two grammars in one module is exactly what `ADR-0004` clause 2 forbids.
- **Deciding which grammar a line of input is** — `ABC-033`. This function is asked; it does not sniff.
- **Rejection *wording*** — `ABC-034`. This ticket emits a machine-readable code, never display copy
  (`ADR-0004` (2a), seam invariant 5: message text is data the loop places, not output a parser prints).
- **Reading stdin, the prompt, readline, tab-completion** — `ABC-036` / `ABC-037`.
- **Commands (`moves`, `help`, `board`, `quit`, `claim`)** — `ABC-035`.
- **Any tolerance not named in `## Scope`.** No `e2 e4`, no `e2,e4`, no `P-K4`, no SAN-ish input.
  Coding rules 5 and 7: the epic named two tolerances and this ticket ships two.
- **Any change to `src/moves.ts`, `src/legal.ts` or `src/apply.ts`.** Zero production lines are
  expected outside the new module.

## Acceptance (Given/When/Then)

Every FEN is exact. `legal` below always means `legalMoves(position)` — **one array, handed to the
call**, because reference identity is the only assertion that can see an `ADR-0004` (2b) violation
(that ADR's own falsification note: two `legalMoves` calls return field-equal, reference-distinct
objects, so deep equality would pass a perfectly reconstructed `Move`).

- **`A1` (the four accepted forms are one move).** **Given** the start position
  `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1` and `legal`, **when** each of `e2e4`,
  `E2E4`, `e2-e4` and `  e2e4  ` is resolved, **then** each returns `outcome: "move"` and the SAME
  element of `legal` **by reference** (`result.move === legal[i]` for one fixed `i`), four times.
- **`A2` (promotion letter selects one of four).** **Given** `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` and
  `legal`, **when** `e7e8q` is resolved, **then** `outcome: "move"`, the move's `promotion` is the
  queen, and it is reference-identical to the matching element of `legal`. **When** `e7e8` is resolved
  with no letter, **then** `outcome: "ambiguous"` with **exactly 4** candidates, every one reference-
  identical to an element of `legal` and all four sharing `from`/`to`. *(`src/moves.ts:88-98` pushes
  four promotion moves with identical `from`/`to`; `ABC-019` recorded that the ambiguity arm is
  reached for free here, and this is the criterion that collects it.)*
- **`A3` (rejection is classified, not merged).** **Given** the start position, **when** each of
  `e2e5` (well-formed, names no legal move), `zz9q` (not two squares), `e2e4e5` (too long), `""` and
  `e9e4` (off-board rank) is resolved, **then** each returns `outcome: "rejected"` and the code
  distinguishes **at minimum** *this text is not a coordinate I can read* from *this is a well-formed
  coordinate that names no legal move here*. **The two must never collapse to one code** — that is
  `ADR-0004` (2a)'s floor, applied to this grammar.
- **`A4` (totality — it never throws).** **Given** each of `null`, `undefined`, `42`, `{}`, `[]` and a
  10,000-character string, **when** each is passed, **then** the call returns a `rejected` result and
  **throws nothing**. *(`ADR-0004` (2a): SAN and coordinates arrive on every line a human types;
  exceptions as control flow on the loop's most-travelled edge is the wrong shape, and that divergence
  from `parseFen`'s throwing contract is deliberate and recorded there.)*
- **`A5` (provenance, as a property over the perft corpus).** **Given** each of the six positions
  already in `src/perft.test.ts`, **when** every move in `legal` is rendered to its own coordinate
  string (`from`+`to`+promotion letter) and resolved back with that same `legal` array, **then** every
  result is `outcome: "move"` with `result.move === move` by **reference**, for every move of every
  position, with **zero** exceptions. **The discriminating requirement:** an implementation that
  constructs a `Move` from the parsed text — right `from`, right `to`, wrong `captured` / `flags` /
  `promotion` — must fail this criterion. It is the only one that can see it, and `ADR-0004` (2b)
  records why it matters: `src/apply.ts:157`, `:160` and `:109` read those fields back off the `Move`
  during a take-back, so a fabricated field puts a wrong piece on the board during `EPIC-006`'s `undo`,
  with nothing thrown and nothing logged.
- **`A6` (the supplied list is the list that is used).** **Given** a position and `legal`, **when** a
  form from `A1` is resolved **with** `legal` supplied, **then** the returned move is reference-
  identical to an element of **that exact array**. *(This is a call-count guard without a spy and
  without a second test file: a function that generated its own list returns a reference-distinct
  object and fails. No `vi.mock`, so no `*.nfr.test.ts` file is added — see `## Lane cost`.)*
- **`A7` (no production line outside the new module).** **Given** the delivered diff, **when**
  `git diff --numstat` is read, **then** the only non-test file added or changed under `src/` is this
  ticket's own new module, the suite is green with a skip count of **0**, and `PERFT_DEEP=1` is
  **32/32** exact.

## Dependencies

- **None blocking.** Everything this ticket resolves against is merged on `main`: `legalMoves`
  (`src/legal.ts:42`), the `Move` shape (`src/moves.ts`), `squareName` (`src/position.ts`) and the
  six perft positions (`src/perft.test.ts`).
- **Not dependent on `ABC-032`.** The two grammars share no code by `ADR-0004` clause 2's own logic —
  the SAN table lives in `src/san.ts` and coordinate tolerance lives here. Either may ship first.
- **Not dependent on `ABC-010`.** This module never parses a FEN. `ABC-010` guards the *other* input
  boundary and is ordered ahead of this epic for its own reasons, not for this ticket's.
- **`ADR-0004` (2b) is adopted here for a module the ADR does not name.** That extension is BA/PM's
  product call and it is stated rather than assumed; if Architect/Design wants the rule written into an
  ADR that covers both readers, that is their call. **Flagged, not decided, and it blocks nothing** —
  the criterion (`A5`) is identical either way.

## Security / NFR triggers

- **`N8-LANE`, inherited by name and not re-derived** (`plans/nfr-catalog.md`, the standing per-ticket
  lane bar): the tests this ticket adds cost **≤ 5% of `NFR-008`'s TOTAL — ≤ 650 ms CPU against the
  13 s CPU clause**, CPU instrument (not wall), median of paired per-round deltas over n ≥ 7
  interleaved rounds with the sign test beside it, admissible only with an identity null control
  reading ≤ 1.5%, **net of 160 ms CPU per test file added**, scope = every file the branch adds under
  `src/`. **A tighter bar may be stated; a looser one may not.** This ticket states no tighter bar.
- **`NFR-002` (render latency, < 16 ms) — not triggered, and the reason is structural**: this module
  is not on any render path and no renderer imports it. **But it adds a production module**, so it
  joins the set `ADR-0011` / `ABC-029` scoped `NFR-002`'s structural premise over. Expected effect:
  none. Named so the next `NFR-002` re-derivation counts 18 modules and not 17.
- **`NFR-003` (input responsiveness — keystroke echo < 50 ms) is NOT this ticket's.** It belongs to the
  prompt (`ABC-036`), which owns the keystroke. This module's own cost bar is `A6`: with `legal`
  supplied it performs **zero** additional `legalMoves` calls.
- **Security: no trigger, and it is not pre-waived.** No user string reaches a sink from here — this
  function returns data, prints nothing, and there is no user surface at all until `EPIC-006`. **Firing
  threshold, stated so it is falsifiable:** the security half fires if the delivered diff touches any
  file **under `src/`** other than this ticket's new module and its test file, or if it adds a runtime
  dependency (`package.json` has **no `dependencies` key** — verified 2026-08-12, absent, not `{}`).

## Test notes

1. **Assert reference identity, never deep equality.** `ADR-0004`'s falsification note is the whole
   reason `legal` is a parameter: deep equality passes a fabricated `Move` and cannot see a (2b)
   violation at all.
2. **Do not hand-roll a `Move` in a fixture.** Take every expected move out of `legal` by index or by
   `find`. A fixture that constructs one teaches the test the same bug the code might have.
3. **`A5` is a property test over the existing perft table** — the table is already there
   (`src/perft.test.ts`), it is legal play by construction, and it costs one `legalMoves` call per
   position. Do not invent a corpus.
4. **Print the input, not the verdict.** Every row names the exact string it fed. This board has paid
   twice for a measurement whose input was not recorded.
5. **`e7e8` on a promoting pawn is `ambiguous`, not `rejected`.** Getting this backwards is the easy
   wrong implementation and every content assertion on the other rows stays green through it.

## Lane cost — how many test FILES this ticket implies

**One.** A single `*.test.ts` beside the new module. **No `*.nfr.test.ts`**, because `A6` makes the
call-count property observable through reference identity instead of through `vi.mock` — and a
`vi.mock` factory is what forces a second file (it is hoisted to file scope and re-routes the module
graph for every test in the file it sits in).

At the measured per-file floor — **160 ms CPU, band 100–229 ms** (`plans/nfr-catalog.md`,
`CPU = 0.85 s + 159 ms × files`, R² 0.9999) — one file is **≈ 1.2% of `NFR-008`'s 13 s CPU clause**.
**This is BA/PM arithmetic over a published measurement, not a new measurement**; the lane total
itself is owed (`ABC-026`, `UNKNOWN - verify`).

## Size and priority rationale

**Size `S` (2).** One pure total function in one new module. No I/O, no new dependency edge beyond
`legal.ts` (already a level-2 module), no design decision, no chess logic — the rules core answers
every question and this ticket only selects from its answer. Calibrated against `ABC-017` (layout over
an existing list, `S`) and `ABC-011` (one guarded condition plus two test shapes, `S`). **The thing
that would make it `M`, named so nobody drifts into it:** teaching it any grammar beyond two squares
and a promotion letter.

**Priority `P0`.** `EPIC-003` is `P0`, and this is the epic's cheapest slice with the fewest
dependencies — every input the loop can ever receive arrives through this module or `ABC-032`. It is
**not** `P1`: the product has no input path at all today, and a game nobody can type a move into is
not a game. It ranks **below `ABC-010`** in the pull order for a stated reason: `ABC-010`'s own page
requires it to be `Ready` before this epic is decomposed, and this epic has now been decomposed.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 10 of 10 MET. Requesting `Backlog`, not `Ready`** — new work lands in
`Backlog` and promotion is a separate step.

| # | item | verdict |
|---|---|---|
| 1 | problem clear — user, pain, value | **✅** the player who does not know notation; no production input path exists (measured: no non-test file imports `turn-loop.ts`); the cheapest half of the dual-format promise |
| 2 | scope and out-of-scope clear | **✅** four accepted forms and only those; seven fences, each with its owner |
| 3 | INVEST-shaped | **✅** independent (merged code only; **not** behind `ABC-032` and **not** behind `ABC-010`), negotiable, valuable, estimable, small, testable |
| 4 | acceptance testable and measurable | **✅** seven criteria: exact FENs, exact strings, exact candidate counts (**4**), reference-identity assertions, exit-shaped totality, `32/32` deep perft, skip **0**. No criterion says "works" |
| 5 | dependencies known | **✅** none blocking; one flagged non-blocking ADR-extension question with its owner |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` inherited by name with its number (**≤ 650 ms CPU**); `NFR-002` module-count effect named; `NFR-003` routed to `ABC-036`; security threshold falsifiable (any second file under `src/`, or a runtime dependency) |
| 7 | test notes present | **✅** five, two of them lessons this board has already paid for |
| 8 | size assigned | **✅** `S` (2), calibrated, with the condition that would make it `M` |
| 9 | priority assigned | **✅** `P0`, with the reason it ranks below `ABC-010` |
| 10 | no major unresolved blocker | **✅** none |
