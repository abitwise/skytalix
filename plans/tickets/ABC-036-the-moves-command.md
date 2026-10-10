---
id: ABC-036
title: The `moves` command — the count is exact, and the frame cannot show the list
status: in-development
column: In Development
size: S
priority: P1
epic: EPIC-003
feature: —
---

# ABC-036 — `moves`: an epic acceptance criterion the merged frame cannot keep, stated rather than smoothed

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03), **split out of `ABC-035` at the cut** because it is the only in-game command whose
> display promise the merged frame cannot keep. Splitting it lets the other four commands compete for
> `Ready` on their own merits instead of waiting behind a promise question.
>
> **THIS TICKET CARRIES A REDUCED USER-FACING PROMISE AND FLAGS IT FOR A NAMED HUMAN.** That is this
> repo's standing convention for a material promise change (`ADR-0002`, `ADR-0003`, `NFR-005`'s
> amendment and `EPIC-002`'s `[A1]` all took this posture). **It does not block ticket cutting or
> development** — the amended criterion is testable either way — and it is exactly one choice a human
> can reverse.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`,
> Workflow 07) against the wave tip `71be48b`. `ABC-032`, `ABC-033`, `ABC-035` and `ABC-037` are
> `Done`, and `EPIC-006` delivered the composed frame. `A4` is re-worded to the merged seam. A
> `moves` line never reaches `ABC-033`'s resolver, so no array is "already generated" for it. `A6`
> names the module. **DoR 10/10 → `Ready`.** Reasoning: `.grugops/context/rescore-batch-2026-10-10/notes/`.

## Problem

*User*: the player learning the game, and the player who wants to check whether the move they are
about to type exists.

*Pain*: `EPIC-003`'s fourth acceptance criterion reads *"given the `moves` command, when it is run,
then **every legal move in the position is listed in SAN** and the count matches EPIC-001's generator
exactly"*. **The merged frame cannot show that list.**

Measured 2026-08-12 from merged artifacts:

```
widest row in src/__snapshots__/render.test.ts.snap        17-18 chars  (board + file labels)
widest row in src/__snapshots__/status-panel.test.ts.snap  ~21 chars
MESSAGE_ROWS                                                2          (src/frame.ts:45)
=> message region capacity                                 ~42 chars, ~8-9 SAN tokens with separators
legal moves at the start position                          20
legal moves in a typical middlegame                        ~41  (ADR-0004 clause 2's own figure)
```

The frame's width `W` is set by the panels and **the message region is bounded BY it** — deliberately:
`src/frame.ts:198-201` records that taking `W` over the message rows too would let a long message widen
the frame, *"which is the one way content can break `4a`'s constant geometry"*. So the region packs
what fits and appends a **`+N` marker** for what it drops (`src/frame.ts:182-188`). **At the start
position, `moves` would show roughly 9 of 20 and `+11`.** *(The exact runtime `W` is `UNKNOWN - verify`
until the composed frame exists — that composition is `EPIC-006`'s render-seam closure, `ADR-0009`
clause 9b — so these are widths measured from merged snapshots and the arithmetic over them, not a
runtime measurement.)*

*Value*: the **count** is the half a player actually needs to trust (*"is my move in there?"* is
answered by typing it; *"how many are there?"* is not answerable any other way), and it is the half
that is exactly testable against `EPIC-001`'s generator.

## The ruling — a REDUCED PROMISE, stated rather than hidden

**BA/PM, 2026-08-12.** Four options were considered; three are rejected on merged evidence.

| option | verdict |
|---|---|
| Print the list outside the frame | **Rejected.** Breaks epic acceptance `4a` (identical row count every frame) and `4b` (erase-to-end-of-screen). The frame is the only output channel and `ABC-019` shipped it that way on purpose |
| Widen the frame for a long message | **Rejected by merged code and its recorded reason** (`src/frame.ts:198-201`). It is the one way content breaks `4a` |
| A pager / temporary alternate screen | **Rejected.** A new terminal surface, on a product whose value is *one command, five seconds, and you are playing* — the same ground that rejected the first-run glyph prompt (`EPIC-002` `[A1]`, `2c`) and the draw-offer prompt (`ABC-021`, ruling 3) |
| **State the exact count; show what fits; make the remainder explicit** | **ADOPTED** |

**The amended criterion**: *given the `moves` command, the message states the **exact** number of legal
moves and that number matches `legalMoves(position).length` exactly; the message region shows as many
of them in SAN as it holds and the region's own `+N` marker states how many it does not.*

**What is reduced, said plainly:** the product **no longer promises that every legal move is visible in
one frame.** It promises an exact count and a partial list.

**The single choice a human can reverse** is the pager. It is the only option that keeps the original
promise, and it is rejected on product grounds rather than technical ones — which is precisely the
shape `EPIC-002` `[A1]`/`2c` flagged for a human and shipped anyway.

## Scope

- The `moves` token joins `ABC-035`'s command table (same tolerance rules: case-insensitive, trimmed,
  exact match, no arguments). *(2026-10-10: that table is `COMMAND_TABLE` in `src/command-input.ts:104`,
  seven tokens today. `CommandToken` (`:74`) gains `"moves"`. Nothing outside that file reads the
  table or the type, so this ticket's module is `src/command-input.ts`.)*
- The outcome is `ABC-019`'s merged `command` (`src/turn-loop.ts:122`) — **non-advancing**.
- The message carries the **exact count** and the SAN listing, rendered with
  `toSan(position, move, legal)` over the **one** `legal` array the prompt already generated.
- **Ordering of the listing is specified, not incidental:** ascending by SAN string. A player scanning
  a truncated list needs it to be in the same order every time.

## Out of scope

- **The other four commands** — `ABC-035`.
- **Changing `MESSAGE_ROWS`, the frame width rule, or `assembleFrame`'s packing** — `EPIC-002`'s, and
  every one of them is ruled by `ADR-0009` / `ADR-0010` and merged code. **If this ticket appears to
  need one, stop and report; do not edit `src/frame.ts`.**
- **A pager, an alternate screen, scrolling, or `less`** — rejected above; named so the omission stays
  deliberate.
- **Tab-completion** (which answers the same question a different way) — `ABC-038`.

## Acceptance (Given/When/Then)

- **`A1` (the count is exact — the half that survives the reduction).** **Given** the start position
  and any three mid-game positions from `src/perft.test.ts`, **when** `moves` is submitted, **then** the
  message states a number equal to `legalMoves(position).length` **exactly**, for every position, with
  **zero** exceptions. *(This is `EPIC-003`'s criterion #4's testable half, unamended.)*
- **`A2` (the listing is SAN, from the one list, in a fixed order).** **Given** any position, **when**
  `moves` is submitted, **then** every listed token equals `toSan(position, move, legal)` for a move in
  that same `legal` array, and the listing is in ascending SAN-string order. **No token is constructed
  by string arithmetic.**
- **`A3` (the reduction is asserted, not assumed).** **Given** the start position (20 legal moves),
  **when** the message is passed to `assembleFrame` at the delivered panel width, **then** the region's
  **hidden count `N` is > 0** and the message's stated total is **still exactly 20** — i.e. the count
  survives the truncation the list does not. **The discriminating requirement:** a build that quietly
  states the *shown* count instead of the *legal* count passes every other criterion on this page.
- **`A4` (one derive per `moves` line; re-worded 2026-10-10).** **Given** one `moves` submission,
  **when** it is resolved, **then** `legalMoves` is called **exactly once**, and **every** `toSan`
  call receives that same array as its third argument. Both are asserted by spy through the
  `MoveInputDeps` seam that `resolvePromptLine` already takes (`src/command-input.ts:197`).
  *(Was: "the same array `ABC-033` generated". On the merged code a `moves` line goes to the
  command table and never reaches `resolveMoveInput`, so no array exists for it yet. One derive per
  `moves` line is the merged equivalent. Spy on both because `toSan` falls back to its own
  `legalMoves` when the list is missing, and a spy on `legalMoves` alone does not see that. QE
  mutant `M11` on `ABC-033` proved this, `src/move-input.ts:95`–`:99`.)* *(`ADR-0004` clause 2 prices the alternative: with the list supplied, `toSan` costs
  **0.10 µs instead of 4.31 µs** per move, and this command formats ~41 of them.)*
- **`A5` (non-advancing).** **Given** `moves`, **when** it is submitted, **then** the ply is not
  advanced, `toFen(position)` is byte-identical, and `gameStatus` is **not** re-evaluated.
- **`A6` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's module and test file(s) and nothing else under `src/` — **`src/frame.ts` in particular is
  byte-identical** — suite green, skip **0**, `PERFT_DEEP=1` **32/32**. *(Named 2026-10-10: the module
  is `src/command-input.ts`, and its test file is `src/command-input.test.ts`. `src/move-input.ts`
  and `src/turn-loop.ts` stay byte-identical. The `command` outcome arm already carries messages.)*
- **`A7` (`help` still shows every command; added 2026-10-09 from QE `ABC-102` G2, `…f7b21e38`).**
  **Given** the delivered command table with `moves` as its **eighth** token, **then** the merged
  rows `ABC-035 A7 — help fits the message region: hidden count exactly 0`
  (`src/command-input.test.ts:548`, start position and a claimable mid-game) are **green and
  unedited**. They fold `help` out of the table, so they see `moves` without any new copy. No
  `(+N more)` appears, and every token is shown whole. *(QE measured the table after `ABC-102` at 7
  tokens. Row 1, `help board quit claim`, is **21/21** columns at the start position, the narrowest
  frame, in all 16 glyph-set × colour × position renders. An eighth token as long as `moves` fits
  at exactly zero headroom on both rows. So this criterion is met by a margin of 0, and the
  order of the table matters.)* **If those rows go red, stop and report.** Do not widen the frame,
  change `MESSAGE_ROWS`, or edit the rows (`ABC-035` `A7`'s own rule: shorten the help, never widen
  the frame).

## Dependencies

- ~~**`ABC-035` must land first — OPEN.**~~ **`ABC-035` — `Done`.** The table is `COMMAND_TABLE`.
- ~~**`ABC-032` must land first — OPEN.**~~ **`ABC-032` — `Done`.** `toSan(position, move, legal)` is
  `src/san.ts:146`.
- ~~**A named human on the reduced promise — OPEN, and NON-BLOCKING.**~~ **CLOSED 2026-08-13: the
  reduced promise is ACCEPTED and the pager is REFUSED.** Ruled by the Orchestrator under the owner's
  in-session delegation (*"Decide on 2, 3 and 4 based on your best recommendations"*); the ruling, its
  three limits and its explicit not-precedent status are in `memory-bank/60-progress.md` § "Standing
  rulings taken under delegation, 2026-08-13", item 3, and the epic-level amendment it authorises is in
  `plans/epics/EPIC-003-move-input-and-controls.md` § Acceptance. **The count clause binds exactly; the
  list clause is reduced to a partial list plus the exact total and the `+N` marker.** The pager was
  refused as unrequested scope (coding rules 5 and 7), and the reversal is named rather than closed off:
  if play-testing under `EPIC-006` shows the truncation is a real barrier, the pager is the change to
  make and this ticket is re-cut at `M` or `L`. **The DoR score below is NOT re-scored here — that is
  BA/PM's at pull time.** The Orchestrator ruled the blocker, not the checklist; re-scoring another
  role's ⚠️ is precisely how a recorded gap gets smoothed away.
- **The `help` region is full after this ticket** *(added 2026-10-09, QE `ABC-102` G2)*. With
  `moves`, both `help` rows are at 21/21 on the start-position frame. **A ninth token hides three**
  (measured: `resign new (+3 more)`). Any later ticket that adds a command token inherits a full
  region and must answer it first. Ticket order is the Orchestrator's.
- **`EPIC-006` supplies the runtime frame width** (the render-seam closure, `ADR-0009` clause 9b), which
  is why `A3`'s `N > 0` is asserted against the delivered panels rather than against a number typed
  here. *(Delivered, 2026-10-10. The panel width is 21 columns at the start position and 18 at the
  narrowest board-only frame (`src/command-input.ts:115`, `:133`). The `ABC-035 A7` rows' helper
  (`src/command-input.test.ts:550`) shows how to read the region at the delivered width.)*

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added.
- **`NFR-003` (input responsiveness — the `moves` command returns in < 100 ms).** This is the ONE
  ticket in this epic that `NFR-003`'s `moves` clause names directly. The measurable form here is a
  **count, not a clock**: one `legalMoves` (`A4`) and one `toSan` per listed move at **0.10 µs** with
  the list supplied (`ADR-0004` clause 2's measured figure) — ~41 moves is ~4 µs of formatting, four
  orders of magnitude inside the 100 ms. **The wall-clock reading itself belongs in
  `plans/nfr-catalog.md` with its machine, not in an assertion in this suite** — this board's standing
  rule (`src/gameend.nfr.test.ts:16-17`: *"Wall-clock cost is not asserted anywhere in this suite"*).
- **`NFR-002` — not triggered.** This module composes no frame; `A3` reads `assembleFrame` as an
  instrument and `A6` pins `src/frame.ts` byte-identical.
- **Security: no trigger, not pre-waived.** No user-supplied text is echoed at all — the output is
  generated SAN and a number. **Firing threshold:** any direct stream write, any file touched under
  `src/` other than this ticket's module and test file(s), or any runtime dependency added.

## Test notes

1. **`A3` is the criterion that catches the plausible wrong build** — stating the shown count instead
   of the legal count. Assert both numbers in the same test.
2. **Do not assert a frame width, and do not assert `N`'s value** — only that it is `> 0` at the start
   position with the delivered panels. The width is `EPIC-006`'s and this ticket must not learn it.
3. **Do not edit `src/frame.ts`.** `A6` pins it byte-identical. Every temptation on this page is a
   frame change and every one of them is ruled out by `ADR-0009`, `ADR-0010` or epic acceptance `4a`.
4. **Hand `toSan` the list.** `A4`. `ADR-0004` clause 2's caller obligation applies: the supplied list
   must be the legal moves of the supplied position.
5. **Sort deterministically and assert the order** — a truncated list in an unstable order is worse
   than no list.
6. **Put the count first** *(2026-10-10)*. The region places each item whole, in order, or hides
   it (`src/frame.ts:145`–`:187`). If the count is not the first item it can be the one hidden,
   and then `A3` is red.

## Lane cost — how many test FILES this ticket implies

**One.** `A4`'s spy is a `vi.spyOn` over an injected seam, not a hoisted `vi.mock`, so **no
`*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s clause** (arithmetic over the
published floor, not a new measurement).

## Size and priority rationale

**Size `S` (2) — and it is `S` only because of the ruling above.** One token, one count, one sorted
listing over a list already in hand, and one truncation assertion. **If the human reverses the reduced
promise and asks for the pager, this is re-cut** — a new terminal surface, its own redraw discipline
and its own interaction with `4a`/`4b` puts it at `M` or `L`, and it becomes a different ticket rather
than a bigger one.

**Priority `P1`.** It is one of the epic's four acceptance criteria and the only one that helps a player
who does not know what is legal. **Not `P0`:** a player can play without it, and `ABC-038`'s
tab-completion answers a neighbouring question. **Not `P2`:** the criterion is written into the epic
and dropping the command would leave that criterion unmet with nothing recorded, which is the failure
mode this page exists to avoid.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM** (`rescore-batch-2026-10-10`, wave tip `71be48b`). **Result: 10 of
10, 0 ⚠️ — met; page `Ready`. The board move is the Orchestrator's.**
- **Item 3, ⚠️ → ✅.** `ABC-035` and `ABC-032` are `Done`, and so are `ABC-033` and `ABC-037`.
- **Item 10, ⚠️ → ✅.** The reduced promise was ruled on 2026-08-13: accepted, with the pager refused
  (§ Dependencies). The Orchestrator ruled under the owner's delegation, and the reversal condition
  is named. Nothing else is open.
- **Item 4 stays ✅, corrected.** `A4` named an array that does not exist on the merged path. It now
  requires one `legalMoves` per `moves` line, with that array passed to every `toSan`, both spied.
  `A7`'s zero-headroom check is unchanged.
- **Item 5 stays ✅.** All dependencies are `Done`. The frame width is delivered.
- **Items 1, 2, 6–9 unchanged ✅.** `A6` now names `src/command-input.ts`.

**Fold note, 2026-10-09** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`). **Not
re-scored; the score below does not move.** Item 4 gains `A7`, a hidden count of 0 checked through
the real frame. Item 5 gains the full-region note. The re-score is BA/PM's at pull time, as this
page already says.

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 8 of 10 clean, 2 recorded ⚠️ — the Definition of Ready is NOT met and this
ticket stays in `Backlog`.** Recorded rather than smoothed, per this board's standard (`ABC-024`,
`ABC-026`, `ABC-028`, `ABC-030` were all left with the DoR honestly unmet).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the learning player; an epic criterion the merged frame cannot keep, with the widths and counts measured |
| 2 | scope and out-of-scope clear | **✅** one token, one count, one sorted listing; four fences, including an explicit refusal to touch `src/frame.ts` |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: two open sibling dependencies (`ABC-035`, `ABC-032`) |
| 4 | acceptance testable and measurable | **✅** six criteria: an exact count with **zero** exceptions, a fixed order, `N > 0` with the total still exactly **20**, an exact call count of **1**, byte-identical `toFen` and byte-identical `src/frame.ts`, `32/32`, skip **0** |
| 5 | dependencies known | **✅** two open sibling dependencies, one open **non-blocking** human ratification, and `EPIC-006`'s supply of the runtime width, all named in the direction they run |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-003`'s `moves` clause carried as a **count** with the µs figures behind it and the wall-clock reading routed to the catalog; firing threshold falsifiable |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` (2), **conditional on the ruling**, with the re-cut condition named |
| 9 | priority assigned | **✅** `P1`, with the not-`P0` and not-`P2` arguments |
| 10 | no major unresolved blocker | **⚠️** **a REDUCED USER-FACING PROMISE awaits a named human.** It does not block development (the criterion is testable either way, `EPIC-002` `[A1]`'s posture) — but it is a promise change and this repo ratifies those with a human, so it is recorded here as open rather than absorbed |
