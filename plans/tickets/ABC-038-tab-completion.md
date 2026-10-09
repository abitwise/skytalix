---
id: ABC-038
title: Tab-completion of legal moves and commands — one derive per prompt, and the epic's negotiable slice
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-003
feature: —
---

# ABC-038 — tab-completion, and the one clause that keeps it from breaking the prompt it sits in

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition. **This is the epic's negotiable slice** — the ticket to
> cut first if the epic runs long. The drop condition is named under `## Size and priority rationale`
> rather than left to a judgement call later.

## Problem

*User*: the player who knows roughly what they want to play and does not want to think about
disambiguation. `EPIC-003` § Scope names *"tab-completion of legal moves at the prompt"*.

*Pain*: without it, `ABC-036`'s truncated `moves` listing is the only way to see what is available, and
a player who types `N` and pauses has no way to find out which knight moves exist.

*Value*: it answers *"what can I play from here"* incrementally, at the point of typing, and it is the
cheapest antidote to the display promise `ABC-036` had to reduce. It is genuinely optional: every other
promise in the epic holds without it.

## Scope

- A completer attached to `ABC-037`'s line reader, over **two** sources: the SAN strings of the legal
  moves in the current position, and `ABC-035`'s command tokens.
- **The legal list is derived ONCE per prompt and reused for every Tab press within that prompt.**
- SAN strings come from `toSan(position, move, legal)` with that same list — never string arithmetic.
- Standard completer semantics only: common-prefix completion, and the candidate list on an ambiguous
  prefix.

## Out of scope

- **Coordinate completion.** A coordinate is four characters and its prefix carries no information a
  player needs help with; completing `e2` to `e2e4` would silently pick one of up to 27 destinations.
  **Explicitly declined**, not forgotten.
- **Fuzzy matching, ranking, or "did you mean".** Prefix only. Coding rules 5 and 7.
- **Arrow keys, input-history recall, raw-mode key handling** — named non-goals in `EPIC-003` § Out of
  scope and in `ABC-037`.
- **Any change to `ABC-037`'s reader beyond attaching the completer**, and any change to `src/frame.ts`.
- **`EPIC-006`'s command tokens** (`undo`, `resign`, `new`). They are not in `ABC-035`'s table, so they
  are not completion targets here; `EPIC-006` adds them to the table and inherits completion for free.
  *(Premise outdated, 2026-10-09: all three are now in `COMMAND_TABLE`, `src/command-input.ts:105`–`:111`,
  seven tokens. Completion reads the table, so they are completion targets as this bullet
  predicted. Nothing here adds or edits a token; see `A6`.)*

## Acceptance (Given/When/Then)

- **`A1` (legal moves complete; illegal ones do not exist).** **Given** a position in which exactly two
  knight moves start with `N`, **when** `N` is completed, **then** the candidates are **exactly those
  two** SAN strings and nothing else — asserted against `legalMoves(position)` rather than against a
  typed list.
- **`A2` (commands complete too, and never collide with a move).** **Given** `ABC-035`'s table, **when**
  `h` is completed in a position where `h4` and `h3` are legal, **then** the candidate set contains
  `help`, `h4` and `h3` — **the two sources are merged, not one-or-the-other**. **When** `b` is
  completed in a position where `b4` is legal, **then** `board` and `b4` both appear. *(A completer that
  tries commands first and returns early hides half the answer, and it is invisible unless a fixture
  puts a legal move and a token behind the same prefix.)*
- **`A3` (ONE derive per prompt — the clause this ticket turns on).** **Given** a single prompt, **when**
  Tab is pressed **five** times, **then** `legalMoves` is called **exactly 1** time and `toSan` is
  called **at most once per legal move** for that prompt, asserted by spy. **The discriminating
  requirement:** a completer that regenerates per Tab press is behaviour-identical on every criterion
  above and breaks `ABC-037`'s `A7` (**0** derives per keystroke).
- **`A4` (`NFR-003`'s tab clause, as a count).** **Given** a position with ~41 legal moves, **when**
  completion runs, **then** it performs **zero** `legalMoves` calls beyond `A3`'s one and formats each
  candidate with the list supplied — `ADR-0004` clause 2's measured **0.10 µs instead of 4.31 µs** per
  move. *(`NFR-003` promises tab-completion returns in **< 100 ms**; the wall-clock reading is a
  `plans/nfr-catalog.md` entry with its machine, not an assertion in this suite —
  `src/gameend.nfr.test.ts:16-17`.)*
- **`A5` (completion never changes state).** **Given** any number of Tab presses, **when** they are
  handled, **then** `toFen(position)` is byte-identical, no ply is advanced, and `gameStatus` is **not**
  evaluated.
- **`A6` (no production change outside this ticket's module and one attachment point).** `git diff
  --numstat` shows this ticket's module, its test file(s), and at most the one line in `ABC-037`'s
  reader that attaches the completer; **`src/frame.ts`, `src/turn-loop.ts` and `src/san.ts`
  byte-identical**; suite green, skip **0**, `PERFT_DEEP=1` **32/32**. **And (added 2026-10-09, QE
  `ABC-102` G2, `…f7b21e38`) `src/command-input.ts` is byte-identical: this ticket adds no command
  token.** The merged `ABC-035 A7` rows (`src/command-input.test.ts:548`, `help` hides 0 tokens) stay
  green and unedited. *(The `help` region has no room for another token. With seven tokens, row 1
  is 21/21 at the start position. With `ABC-036`'s `moves` it is 21/21 on both rows, and a ninth
  token hides three.)*

## Dependencies

- **`ABC-037` must land first — OPEN.** The reader the completer attaches to.
- **`ABC-035` must land first — OPEN.** The command table `A2` merges in.
- **`ABC-032` — not required.** Completion generates SAN with the merged `toSan`; it never parses.
- **Merged:** `toSan` (`src/san.ts:146`), `legalMoves` (`src/legal.ts:42`).

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added.
- **`NFR-003` — the tab-completion clause (< 100 ms) is this ticket's**, carried as `A4`'s count. The
  keystroke-echo clause stays `ABC-037`'s.
- **`NFR-002` — not triggered.** No frame row is written; `A6` pins `src/frame.ts` byte-identical.
- **Security: no new trigger.** Completion emits generated SAN and fixed tokens — no echo of arbitrary
  user text, and the terminal write path is `ABC-037`'s, unchanged. **Firing threshold:** any file
  touched under `src/` other than this module, its test file(s) and the single attachment line; any
  runtime dependency added.

## Test notes

1. **`A2` needs a fixture where a token and a legal move share a prefix** (`h`/`help`/`h4`,
   `b`/`board`/`b4`). Without it, the early-return build passes.
2. **Spy the derive count across five Tab presses** (`A3`). One press proves nothing.
3. **Derive the expected candidates from `legalMoves`**, never from a typed list — the same rule
   `ABC-035` `A4` applies to `help`, and the same defect `ABC-030` exists for.
4. **Assert no state change** (`A5`) even though nothing here should touch state. The completer holds a
   position and a move list; that is exactly the shape that mutates one by accident, and `ABC-009`
   shipped this project's worst defect doing it.

## Lane cost — how many test FILES this ticket implies

**One.** No `vi.mock`, so **no `*.nfr.test.ts`**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s clause**
(arithmetic over the published floor, not a new measurement).

## Size and priority rationale

**Size `S` (2).** One completer over two sources with one cached list, attached at one point. No new
grammar, no parsing, no state, no design decision. Calibrated against `ABC-015` (a selection rule with
a precedence table, `S`).

**Priority `P2`, and `P2` on this board is the drop-first tier** (`ABC-017`'s row, `ABC-021`'s priority
rationale). **That is the correct tier for this ticket and it is stated as a choice, not a default.**

**The drop condition, named now rather than improvised later:** if `EPIC-003` runs long, **cut this
ticket first, before any other in the epic.** Every one of the epic's four acceptance criteria holds
without it; it is the only ticket in the decomposition of which that is true. **The escalation trigger
that would move it to `P1`:** if `ABC-036`'s reduced display promise is *not* reversed by the human and
play-testing shows players cannot discover their legal moves, this becomes the remaining answer to that
question and is re-prioritised then — **checked at this cut: NOT FIRED**, because no play-testing has
happened and there is no runnable product to test with.

## Definition of Ready

**Fold note, 2026-10-09** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`). **Not
re-scored; the score below does not move.** Item 4's `A6` now also requires
`src/command-input.ts` to be byte-identical, which means no new token. The stale premise of one
out-of-scope bullet is marked.

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 9 of 10 clean, 1 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the player who knows roughly what to play; the antidote to `ABC-036`'s reduced display promise |
| 2 | scope and out-of-scope clear | **✅** two sources, one cached derive, prefix semantics only; five fences including an explicitly declined coordinate completion with its reason |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable (**the most negotiable ticket in the epic**), estimable, small, testable — **not independent**: two open sibling dependencies (`ABC-037`, `ABC-035`) |
| 4 | acceptance testable and measurable | **✅** six criteria: exact candidate sets derived from `legalMoves`, a merged two-source set behind one prefix, an exact derive count of **1** across **five** Tab presses, byte-identical `toFen` and three byte-identical modules, `32/32`, skip **0** |
| 5 | dependencies known | **✅** two open sibling dependencies; one explicit non-dependency with the reason; two merged instruments with line numbers |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-003`'s tab clause owned here as a count; firing threshold falsifiable |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2), calibrated |
| 9 | priority assigned | **✅** `P2`, stated as a choice, with the drop condition and one escalation trigger **checked and NOT FIRED** |
| 10 | no major unresolved blocker | **⚠️** **two ordering dependencies are OPEN** — `ABC-037` and `ABC-035`. Named, owned, and the reason this sits in `Backlog` |
