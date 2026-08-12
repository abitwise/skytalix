---
id: ABC-035
title: In-game commands — `help`, `board`, `quit`, `claim`: the grammar, the tolerance, and the teaching rejection
status: backlog
column: Backlog
size: S
priority: P1
epic: EPIC-003
feature: —
---

# ABC-035 — four command tokens at the move prompt, and the one that is a right the player cannot otherwise exercise

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition. **`moves` is deliberately NOT in this ticket** — it is
> `ABC-036`, split out because it is the only command whose display promise the merged frame cannot
> keep. See that page.

## Problem

*User*: every player, and specifically the player holding a FIDE 9.2 / 9.3 draw claim.

*Pain*: `ABC-020` made threefold repetition and the fifty-move rule **claimable by the player having
the move**, `ABC-016` renders that availability, and `ABC-021` builds the loop's claim path — **and
there is still no token a human can type.** `EPIC-003`'s `## Scope` was amended on 2026-07-31 for
exactly this: *"a right the player cannot type is not a right"*. The other three commands are the
smaller half: today an input that is not a move is a rejection, so `help` is answered with *that is not
a legal move*.

*Value*: it closes the last gap in the `ABC-020` → `ABC-016` → `ABC-021` chain, all three of which are
already merged or cut, and it costs one token table.

## Scope

**Four tokens, classified before either resolver is asked**, returning `ABC-019`'s merged
`command` outcome (`src/turn-loop.ts:122`) — non-advancing, back to the prompt — except where noted:

| token | outcome | who owns the EFFECT |
|---|---|---|
| `help` | `command`, with the message set this ticket writes | this ticket |
| `board` | `command`, with **no** message | this ticket (see `A3` — merged code already redraws) |
| `quit` | `command` **here**; the confirmation and the exit are `EPIC-006`'s | **`EPIC-006`** |
| `claim` | `command` when unavailable (a teaching rejection); the terminal transition is `ABC-021`'s | **`ABC-021`** |

- **Tolerance, and only this much:** case-insensitive, surrounding whitespace trimmed, exact token
  match. **No abbreviations, no aliases, no arguments.** `EPIC-003` names the tokens and this ticket
  ships the tokens.
- **A command is classified BEFORE the resolvers run.** `ADR-0004` (2a): *"`parseSan` does not classify
  commands … `moves` / `help` / `quit` are not SAN, and teaching `src/san.ts` the command set would
  drag `EPIC-003`'s command vocabulary into a module whose entire justification is that it owns one
  grammar."*
- **`claim` when nothing is claimable is a rejection that teaches**, to `ABC-034`'s standard, and it
  quotes numbers `ABC-021` already specifies: *this position has occurred twice; a claim needs three* /
  *the halfmove clock is 41; a claim needs 100* — never a bare *cannot claim*.

## The boundary ruling this ticket implements

**BA/PM, 2026-08-12. `quit` appears in TWO epics' scope lines and they do not conflict — but nothing
said so, and an unstated seam costs a hop.**

`EPIC-003` § Scope lists `quit` among its in-game commands. `EPIC-006` § Scope lists *"`quit` with
confirmation"* among its session commands. **The split is the same one the 2026-07-31 `claim`
amendment already made and it is applied unchanged:** `EPIC-003` owns **the grammar** — the token, its
tolerance, its case-insensitivity, its tab-completion target — and **the rejection message that
teaches**; `EPIC-006` owns **what happens** — the confirmation prompt, the exit, the result screen.
So this ticket makes `quit` a recognised command that does not advance the ply, and `EPIC-006` gives
it its effect. **The same rule already governs `claim`** (grammar here, transition in `ABC-021`), which
is why one rule covers both rather than two special cases.

## Out of scope

- **The `moves` command** — `ABC-036`. Split out with its reason.
- **What `quit` does** — `EPIC-006` (confirmation, exit code, result screen).
- **What a valid `claim` does to the loop** — `ABC-021` (the fifth prompt outcome, the terminal
  transition, the claimed reason). This ticket supplies the token and the unavailable-case message.
- **Whether a claim is available** — `ABC-020`, through `gameStatusOf(history)`. This ticket **asks**;
  it does not derive, and it must not call `repetitionCounts` itself (`ABC-021` prices a second derive
  at **46–50 µs at 120 plies**, half the whole per-ply budget, for a value already in hand).
- **`undo`, `resign`, `new`** — `EPIC-006`'s command set. Not tokens here, not tab-completion targets
  here.
- **Reading the line** — `ABC-037`. **Tab-completion of these tokens** — `ABC-038`.

## Acceptance (Given/When/Then)

- **`A1` (the four tokens, case-insensitive, exact).** **Given** any position, **when** each of `help`,
  `HELP`, `  help  `, `board`, `quit`, `claim` and their upper-case forms is submitted, **then** each
  returns `kind: "command"`, the ply is **not** advanced, `toFen(position)` is byte-identical, and
  `gameStatus` is **not** re-evaluated. **When** `hel`, `helpme`, `h` or `boards` is submitted, **then**
  none is a command — each falls through to the resolvers. *(The negative half is the criterion; a
  prefix matcher passes the positive half and turns `b4` into `board`.)*
- **`A2` (a command never reaches a resolver).** **Given** each of the four tokens, **when** it is
  submitted, **then** the SAN and coordinate resolvers are **each called exactly 0 times**, asserted by
  spy. *(A build that asks the parser first and falls back to the command table is behaviour-equivalent
  on every string above and produces a rejection reason for `help` in the one case that matters — when
  a future token collides with legal notation. `b4` is a legal move; `board` must never be reachable
  from it and no resolver may ever see `help`.)*
- **`A3` (`board` is honest about being nearly free).** **Given** the merged loop, **when** `board` is
  submitted, **then** the outcome carries **zero** messages and the next frame is drawn by the loop's
  normal `rendering` transition — **no second render is triggered by this ticket**, asserted by
  counting render-seam calls: exactly **one** per prompt cycle. *(`ADR-0009` clause 9 and
  `src/turn-loop.ts:28-31`: the loop renders every ply and hands the writer the seam's rows unchanged.
  A `board` command that renders again writes two frames for one ply and is invisible to every content
  assertion.)*
- **`A4` (`help` names every token it accepts, and the list is derived not typed).** **Given** the
  delivered `help` output, **when** it is read, **then** it names **every** token in this ticket's
  command table and **no token that is not in it** — asserted **over the table**, so a token added
  later without a help line turns the criterion red. *(Quantifier form, `ABC-024` `A3` / `ABC-030` `A2`;
  a hand-written help string goes stale the first time the table changes, which is `ABC-030`'s entire
  subject.)*
- **`A5` (`claim` with nothing claimable teaches, with numbers).** **Given** a position where
  `gameStatusOf(history)` reports no claimable draw and the position has occurred **twice**, **when**
  `claim` is submitted, **then** the outcome is non-advancing, the message names **how far** the
  position is from a claim (the occurrence count and the three it needs, or the halfmove clock and the
  100 it needs), and it is **not** a bare *cannot claim*. **Given** a position where a claim **is**
  available, **when** `claim` is submitted, **then** this ticket's path is not the one taken —
  `ABC-021`'s terminal transition is, asserted by the outcome kind.
- **`A6` (availability is read from the ply's single derive).** **Given** one prompt cycle, **when**
  `claim` is submitted, **then** `gameStatusOf` is called **exactly once** for that ply and
  `repetitionCounts` **zero** additional times, asserted by spy. *(`ABC-019`'s `NFR-002` bar —
  *derive the counts once per ply, not once per call site* — and `ABC-021`'s identical assertion.)*
- **`A7` (message fits the frame).** **Given** the `help` output and each `claim` rejection, **when**
  passed to `assembleFrame` at the delivered panel width, **then** the message region's **hidden count
  is exactly 0** (`MESSAGE_ROWS` = 2, `src/frame.ts:45`). **If `help` cannot fit two rows, it is
  shortened here — not the frame widened**, which would break epic acceptance `4a`.
- **`A8` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's module and test file(s) and nothing else under `src/`; suite green, skip **0**,
  `PERFT_DEEP=1` **32/32**.

## Dependencies

- **`ABC-033` must land first — OPEN.** It owns the entry point a command is classified in front of.
  An **ordering** dependency, one direction.
- **`ABC-034` — soft, and stated in the direction it runs.** `A5`'s message is written to that ticket's
  standard. If `ABC-034` has not landed, `A5` is still testable (it asserts the numbers, not a shared
  vocabulary) — so this is a **quality** dependency, not a blocker.
- **`ABC-021` — no build-time dependency in either direction, and that is deliberate.** This ticket
  produces the token and the unavailable message; that ticket owns the terminal transition. `A5`'s
  second half asserts the boundary by outcome kind, which is checkable whichever lands first.
- **Merged:** `gameStatusOf` (`src/history.ts:152`), `PromptOutcome` (`src/turn-loop.ts:118`),
  `assembleFrame` (`src/frame.ts:194`), `ABC-020`'s claimable-draw set.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added.
- **`NFR-002` — `ABC-019`'s per-ply bar of ≤ 100 µs (excluding render, input wait and engine call) is
  unchanged by this ticket, and that is the measurable requirement.** `A6` is what holds it: zero
  additional derives. A second `repetitionCounts` per ply costs **46–50 µs at 120 plies** (measured,
  Apple M3 / Node v24.12.0 / darwin-arm64, carried from `ABC-021`) — half the budget for a value
  already in hand.
- **`NFR-003` — routed to `ABC-037`**, which owns the keystroke.
- **Security: no trigger, not pre-waived.** The command table matches literal tokens; nothing is
  evaluated, spawned or interpolated. `help` output and the `claim` rejection reach the terminal through
  `assembleFrame`'s **sanitized** message region (`src/frame.ts:202`) and this ticket adds no second
  path to that sink. **Firing threshold:** any direct stream write, any file touched under `src/` other
  than this ticket's module and test file(s), or any runtime dependency added.

## Test notes

1. **`A1`'s negative half is the ticket.** `hel`, `helpme`, `h`, `boards` — and `b4`, which is a legal
   move and must never be read as `board`.
2. **Spy the resolvers at zero** (`A2`). Content assertions cannot see the fall-back-after-parse build.
3. **Count render-seam calls** (`A3`). One per prompt cycle. `board` adds none.
4. **Derive `help` from the table** (`A4`). A typed help string is `ABC-030`'s defect with a different
   file name.
5. **`A5` needs two fixtures, not one:** a position two occurrences from a claim and a position with a
   claim available. The pair is the criterion; one alone proves nothing about the boundary.
6. **Do not call `repetitionCounts`.** Ask `gameStatusOf(history)` once and read availability off it —
   `ABC-021`'s ruling, `ABC-019`'s bar, and `ADR-0002` clause 4's *"`positionCounts` gets exactly one
   supplier"*.

## Lane cost — how many test FILES this ticket implies

**One.** The spies in `A2`, `A3` and `A6` are `vi.spyOn` over injected seams, not hoisted `vi.mock`
factories, so **no `*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s clause**
(arithmetic over the published floor, not a new measurement).

## Size and priority rationale

**Size `S` (2).** One token table, one classification step in front of an existing dispatcher, one
derived help string, one rejection message with numbers already specified elsewhere, and four spied
counts. No new chess logic, no new dependency edge, no design decision — the boundary questions
(`quit`, `claim`) are ruled on this page rather than left open. Calibrated against `ABC-021` (one
prompt outcome and one transition on a specified machine, `S`) and `ABC-015` (a selection rule with a
precedence table, `S`).

**Priority `P1`, deliberately not `P0`.** The three `P0` tickets in this epic (`ABC-031`, `ABC-032`,
`ABC-033`) are what make a move typable at all; a player with no command set can still play chess. It
is **not** `P2`: `ABC-016` renders a claim indicator today and `ABC-021` builds the claim path, so
without this ticket the product **tells the player a draw is claimable and gives them no way to claim
it** — `ABC-021`'s own words for why it is not droppable, and the same argument lands here.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 9 of 10 clean, 1 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the player holding a claim; a right nobody can type; `help` currently answered with *not a legal move* |
| 2 | scope and out-of-scope clear | **✅** four tokens with the effect-owner named per token; the `quit` / `claim` epic boundary **ruled on this page**; six fences |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not fully independent**: it classifies in front of `ABC-033`'s entry point and must land after it |
| 4 | acceptance testable and measurable | **✅** eight criteria: exact tokens and exact non-tokens, spied counts of **0** and **1**, a table-derived help assertion, exact claim-distance numbers, a **hidden count of 0**, `32/32`, skip **0** |
| 5 | dependencies known | **✅** one open ordering dependency; one soft quality dependency stated as soft; one deliberate non-dependency with the reason |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002`'s ≤ 100 µs per-ply bar carried with the cost of the wrong implementation quantified (**46–50 µs**); sanitization sink named; firing threshold falsifiable |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `S` (2), calibrated |
| 9 | priority assigned | **✅** `P1`, with the not-`P0` and not-`P2` arguments both stated |
| 10 | no major unresolved blocker | **⚠️** **one ordering dependency is OPEN** — `ABC-033`. Named, owned, and the reason this sits in `Backlog` |
