---
id: ABC-045
title: `resign` — the one session command the merged loop can already express exactly
status: backlog
column: Backlog
size: XS
priority: P1
epic: EPIC-006
feature: —
---

# ABC-045 — the player resigns: one token, one `game-over`, and the opponent wins

> **Cut 2026-08-13 by BA/PM** (task `epic006-2026-08-13`, subtask `epic-to-tickets-EPIC-006`,
> Workflow 03) at `EPIC-006`'s decomposition. **`resign` is separated from `quit` and `new`
> (`ABC-046`) deliberately: it is the only one of the three whose effect the merged `PromptOutcome`
> already has an arm for.** Keeping them together would have held a clean `XS` behind an open
> contract question.

## Problem

*User*: the player in a lost position.

*Pain*: **the transition exists and nothing drives it.** `ABC-019` shipped
`{ kind: "game-over", result, reason }` on `PromptOutcome` and put `"resignation"` in
`TerminalReason` **specifically** for this — *"`resignation` — `EPIC-006`'s, whose transition this
loop provides and whose command it does not implement"* (`src/turn-loop.ts:68-69`). `ABC-035`'s
`## Out of scope` confirms the other half: *"`undo`, `resign`, `new` — `EPIC-006`'s command set. Not
tokens here."* So the token exists nowhere and the arm is unreachable.

*Value*: the epic's own user-value sentence — *"resign a lost position"* — and the second of the eight
reasons on `ABC-044`'s screen that a human can actually cause.

## Scope

- **The `resign` token**, added to `ABC-035`'s delivered command table (grammar + tolerance +
  teaching rejection follow that ticket's merged rules; this ticket adds a row, not a second table).
- **The effect**: the command resolves to
  `{ kind: "game-over", result: <the opponent's win>, reason: "resignation" }`.
- **Nothing else.** No confirmation — see the ruling.

## The ruling: `resign` is not confirmed, and `quit` is

**BA/PM, 2026-08-13.** The epic's scope line reads *"`undo` (...), `resign`, `new`, `quit` with
confirmation"* — the modifier attaches to `quit`. **Adopted as written**, on two supporting reasons
and one named counter-argument:

- A mis-typed `resign` is **visible**: it ends the game with `ABC-044`'s screen naming *resignation*,
  so the player knows immediately what happened. A mis-typed `quit` leaves nothing behind at all.
- Coding rule 5 — only requested features. Confirmation on `resign` was not requested.
- **The counter-argument, named rather than buried:** most chess software confirms resignation,
  because it is the one command that hands the game away. **This is a cheap product call to reverse** —
  it becomes one call to `ABC-046`'s confirmation mechanism — and it is the owner's to overturn.
  **I checked whether I preferred this reading because it keeps this ticket unblocked; the epic's own
  sentence is what decides it, and it would read the same way if the sequencing were reversed.**

## Out of scope

- **`quit` and `new`** — `ABC-046`.
- **`undo`** — **not cut at all**; it needs an engine reply to take back. See
  `plans/epics/EPIC-006-game-session-and-packaging.md` § what was not cut.
- **The result screen's wording** — `ABC-044` owns every string it prints.
- **Grammar, tolerance and the teaching rejection for unknown words** — `ABC-035`'s merged rules.
- **The engine resigning.** Nothing in any epic asks for it, and `ABC-019`'s arm is reachable only
  from `awaiting-human`.

## Acceptance (Given/When/Then)

- **`A1` (the loser is the resigner — both directions).** **Given** the human is **white**, **when**
  `resign` is entered, **then** the loop returns `result: "black-wins"`, `reason: "resignation"`,
  `exitCode: 0`. **Given** the human is **black**, **then** `result: "white-wins"`. *(Both, because
  a build that hardcodes one satisfies a single-direction criterion and reports the winner as the
  loser half the time — the exact failure `ABC-019`'s `LoopOutcome` comment warns of.)*
- **`A2` (it ends the game on the ply it is typed).** **Given** a game at ply ≥ 4 with legal moves
  available, **when** `resign` is entered, **then** the loop returns on that iteration, `legalMoves`
  is called **0** times after the outcome is produced (spied), and **exactly one** further frame is
  written — the final one.
- **`A3` (it is a command, classified before the grammars).** **Given** the line `resign`, **then**
  the outcome is produced by the command table and **neither move resolver is called** (spied) —
  `ABC-035` `A2`'s order, re-asserted because this ticket adds a row to that table.
- **`A4` (it reaches the screen as reason 8).** **Given** a scripted game driven through the entry
  point where the human resigns, **then** the emitted stream ends with `ABC-044`'s screen naming
  **resignation**, the opponent as the winner, and the process exits **0**.
- **`A5` (no confirmation, and that is asserted).** **Given** a single `resign` line, **then** the
  game ends on it — **no** second line is read (asserted by a stdin whose next line is never
  consumed).
- **`A6` (nothing else changed).** `git diff --numstat` shows `ABC-035`'s command module, this
  ticket's test rows and nothing else under `src/` — **`src/turn-loop.ts` and `src/gameend.ts`
  byte-identical**. Suite green, skip **0**.

## Dependencies

- **`ABC-035` must land first — OPEN** (`EPIC-003`, `P1`). This ticket adds a row to its table.
- **`ABC-037` must land first — OPEN** (`EPIC-003`, `P0`). The table is consulted by the reader.
- **`ABC-043` must land first — OPEN and itself blocked.** `A4` needs a running session.
- **`ABC-019` and `ABC-020` are MERGED** and supply the arm, the reason value and the result type.
  **None is re-decided here.**
- **Cross-epic check, named so it is not discovered:** if `ABC-038` (tab-completion) has merged, this
  new token must appear as a completion target. That holds automatically **if** `ABC-038`'s source is
  the command table itself; if it is a separate list, this ticket adds the token there too.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol.
- **`NFR-002` — not triggered.** No frame is composed and no derive is added; `A2`'s spied **0** is
  the guard.
- **Security — not triggered.** One token in an existing table that already reads outside input under
  `ABC-037`'s three bars. **Firing threshold:** it fires if the diff touches any file under `src/`
  other than `ABC-035`'s command module and the test file(s).

## Test notes

1. **Assert both colours** (`A1`). One direction is satisfied by a build that always names black.
2. **Assert the unconsumed next line** (`A5`). A build that reads a confirmation nobody asked for eats
   the player's next input and passes every other criterion.
3. **`A4` shares the entry-point spawn harness** from `ABC-042`/`ABC-043`. Do not build another.
4. **Do not re-test `gameStatus`.** The resignation path never consults it; that is the point.

## Lane cost — how many test FILES this ticket implies

**Zero new files.** `A1`–`A3` and `A5` extend `ABC-035`'s delivered command test file; `A4` extends
the entry-point file `ABC-042`/`ABC-043` share. No `vi.mock`, so **no `*.nfr.test.ts`**. Cost is a
handful of cases at the published per-test figure (**0.35–0.43 ms per test**, `plans/nfr-catalog.md`),
i.e. **single-digit milliseconds** — arithmetic over the published floor, not a new measurement.

**Weight: nil.** It adds no file, so the QE file-weight gap does not apply to it.

## Size and priority rationale

**Size `XS` (1).** One table row, one returned object, no state, no async, no new module, no new
dependency edge, no design decision — the one it needed (confirmation) is ruled on this page.
Calibrated against `ABC-030` (`XS`).

**Not `XL`; there is no split line — it is one row and one object.**

**Priority `P1`.** It is named in the epic's user-value sentence and it is the cheapest reachable
reason on the result screen. **Not `P0`:** a player who cannot resign can still play the game out,
and three `P0` tickets sit in front of it.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-13**. **Result: 8 of 10 clean, 2 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the player in a lost position; the arm and the reason value are published in merged code and the token exists nowhere — both read, not argued |
| 2 | scope and out-of-scope clear | **✅** one token, one object; five fences, including `undo` named as **not cut** and the engine never resigning |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: three open ordering dependencies, two of them in `EPIC-003` |
| 4 | acceptance testable and measurable | **✅** six criteria: both colours asserted, **0** post-outcome `legalMoves` calls, **exactly one** further frame, both resolvers spied at 0, an unconsumed-line witness, `src/turn-loop.ts` byte-identical |
| 5 | dependencies known | **✅** three open tickets with their epics and priorities; two merged tickets named as the source of the arm; one cross-epic completion check named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` not triggered with a spied **0** as the guard; security not triggered with a falsifiable threshold |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` (1), calibrated |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️** **three ordering dependencies are OPEN** (`ABC-035`, `ABC-037`, `ABC-043`) and the last is itself blocked. **No contract question is open** — that is what separates this ticket from `ABC-046` |
