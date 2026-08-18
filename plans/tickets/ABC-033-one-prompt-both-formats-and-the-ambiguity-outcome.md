---
id: ABC-033
title: One prompt, both formats, no mode switch — and the ambiguity outcome that fits the frame
status: ready-for-uat
column: Ready for UAT
size: S
priority: P0
epic: EPIC-003
feature: —
---

# ABC-033 — one line of input, two grammars, three outcomes, and a candidate list the frame can actually show

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition.

## Problem

*User*: every player. `EPIC-003` promises **both formats always accepted, no mode switch** — the
player never declares which notation they are using.

*Pain*: `ABC-031` and `ABC-032` each answer *"is this string a move, in my grammar?"*. Nothing answers
*"is this line a move at all?"*, and nothing turns either answer into the `PromptOutcome` the merged
loop consumes. Without this ticket the epic ships two resolvers and no prompt behaviour.

*Value*: this is where the epic's second acceptance criterion lives — *"given an input that matches two
legal knight moves, both candidates are listed in SAN and the player is re-prompted; no move is
applied"* — and it is where the epic's own scope lines stop contradicting each other (see `## The
ruling this ticket implements`).

## The ruling this ticket implements

**BA/PM, 2026-08-12. Three of `EPIC-003`'s scope lines cannot all be true at once for SAN, and the
resolution is `ambiguous`, not a guess.**

The epic asks for (1) case-insensitive input, (2) both formats always accepted with no mode switch,
and (3) *when input matches more than one legal move, list the candidates and re-prompt rather than
guessing*. **In SAN, case is meaning**: `bxc4` is a pawn capture, `Bxc4` is a bishop capture, and both
can be legal in the same position. A case-folding parser must then guess between two legal moves,
which line (3) forbids.

**The ruling: fold case only as a RETRY, and route every multi-match to `ambiguous`.**

1. Try the input **exactly as typed**, coordinate reader and `parseSan`, in that order.
2. If both reject, retry **case-folded** — and if the fold produces **more than one** legal move,
   the outcome is **`ambiguous`**, never a pick.

This keeps every promise: the player who types `E2E4` is understood, the player who types `bxc4`
gets their pawn capture, and the player who types `BXC4` in a position where both are legal is asked
which one — instead of being handed a bishop and told nothing.

## Scope

- **One entry point** that takes the raw line and the `GameHistory` and returns a merged result over
  `ABC-031`'s and `ABC-032`'s three-arm shapes, ready for the seam.
- **Precedence, fixed and asserted:** exact coordinate → exact SAN → case-folded retry of both.
  **Coordinate first, because it is the smaller grammar and cannot match a SAN string by accident**
  (four characters of `[a-h][1-8]`), while a SAN string like `b4` and a coordinate are distinguishable
  by length in every case the epic accepts.
  **It is a precedence over answers, not an order of attempt** — corrected 2026-08-18 at the repair
  hop, where the page was found to be describing something the code does not do. Both readers are
  asked about every text, eagerly; the order decides which answer is preferred, and nothing is
  skipped. The two are indistinguishable by any real input for the very reason given above — the
  grammars are disjoint — so the precedence is asserted through the module's dependency seam, with
  two stub readers that both claim the same text. QE's mutant M12 swapped the two and reded nothing
  (`G5`); it reds now.
- **`legalMoves(position)` is generated ONCE per prompt and handed to every attempt** as the optional
  `legal` parameter both resolvers take. Not once per grammar, not once per retry.
- **The candidate list is rendered in SAN** (`EPIC-003` acceptance #2: *"both candidate moves are
  listed in SAN"*), through `toSan(position, move, legal)` with that same list.
- **The result maps onto `ABC-019`'s merged `PromptOutcome`**: `move`, `rejected` and `ambiguous`
  (`src/turn-loop.ts:125-132`). `command` and `eof` are the other two arms and belong to `ABC-035`
  and `ABC-036`.
- **`ABC-032`'s tolerance list is five entries, not two — ruled 2026-08-18 by BA/PM** (task
  `refinement-abc032-tolerances-2026-08-18`), and this ticket inherits it rather than re-deciding it.
  **Three consequences, and all three shrink this ticket rather than growing it.**
  - **Both resolvers now trim.** `parseCoordinateMove` already did; `parseSan` does and it is now
    asserted and named on the page. **This dispatcher must NOT trim a third time, and must not
    normalise the line before handing it over** — one line, unmodified, to both readers.
  - **Redundant qualifiers (`Nfg5`) and mixed castle spellings (`O-0`) return `move`, not
    `rejected`.** No new arm, no new branch: the dispatch shape is unchanged and the fixed order of
    attempt is unaffected. What changes is that fewer strings reach the case-folded retry.
  - **The case-folded retry is still wholly this ticket's, and `o-o` is one of its cases.** `parseSan`
    refuses lowercase deliberately (case is meaning) and the 2026-08-18 ruling did **not** widen it.
    `o-o` / `o-o-o` fold to `O-O` / `O-O-O` with **exactly one** candidate — assert it here, and do
    not push it back into `ABC-032`.

## Out of scope

- **Either grammar's internals** — `ABC-031`, `ABC-032`. This ticket asks; it does not parse.
- **Rejection wording and the reason vocabulary** — `ABC-034`. This ticket carries codes.
- **Commands** — `ABC-035`. A line that is a command never reaches these resolvers.
- **Reading the line from anywhere** — `ABC-036`. This is a pure function over a string.
- **Guessing between two legal moves, under any circumstance.** Named as out of scope rather than
  merely absent, because it is the cheap implementation and it looks helpful.

## Acceptance (Given/When/Then)

- **`A1` (both formats, one prompt, no mode switch).** **Given** the start position, **when** each of
  `e4`, `e2e4`, `E2E4` and `e2-e4` is submitted through the single entry point with no state carried
  between them, **then** all four return `kind: "move"` with the **same** element of the one `legal`
  array **by reference**. *(This is `EPIC-003`'s acceptance criterion #1, end to end, and it is the
  criterion that fails if a mode is remembered.)*
- **`A2` (ambiguity lists candidates in SAN and applies nothing).** **Given** a position in which two
  knights can reach `d2`, **when** `Nd2` is submitted, **then** the outcome is `kind: "ambiguous"`, it
  carries **exactly 2** messages naming `Nbd2` and `Nfd2`, and — asserted separately — **no move is
  applied**: `toFen(position)` is byte-identical before and after and the ply is not advanced. *(The
  two halves are separate assertions because a content assertion alone stays green through a build
  that lists the candidates and then plays one of them.)*
- **`A3` (the case-folded retry, both directions).** **Given** a position in which **only** `Bxc4` is
  legal, **when** `bxc4` is submitted, **then** `kind: "move"` and it is the bishop capture. **Given**
  a position in which **both** `bxc4` and `Bxc4` are legal, **when** `BXC4` is submitted, **then**
  `kind: "ambiguous"` with **exactly 2** candidates. **Given** a position in which only the pawn
  capture is legal, **when** `bxc4` is submitted, **then** `kind: "move"` and it is the pawn capture,
  reached on the **exact** attempt and not the fold. *(The third row is what proves the fold is a
  retry and not the first thing tried.)*
- **`A4` (the candidate list fits the frame — the frame hides nothing). FALSIFIED 2026-08-18 AND
  RE-SCOPED — see the block immediately below. It is NOT met, and it is NOT deleted.** **Given** any
  `ambiguous` outcome this ticket can produce, **when** its messages are passed to `assembleFrame` at
  the width the delivered panels set, **then** the message region's **hidden count is exactly 0** —
  every candidate is shown in full, in the region's 2 rows (`MESSAGE_ROWS`, `src/frame.ts:45`).
  *(Merged code packs the region and appends a `+N` marker for what it drops, `src/frame.ts:134-142`
  — the cut-hop cite of `:182-188` had drifted and is corrected here. A criterion that says "the
  candidates are listed" is satisfied by a frame that shows one of them and `+3`. **If any reachable
  ambiguity cannot fit, that is a finding for `EPIC-002`'s frame owner and a new ticket — not a
  silent truncation and not a widening of the frame**, which would break epic acceptance `4a`.)*

  > **`A4` IS FALSIFIED. CORRECTED 2026-08-18 by BA/PM** (task `cut-frame-overflow-2026-08-18`,
  > Workflow 07), on QE's `G1` and the Orchestrator's independent reproduction.
  >
  > **The criterion above is FALSE AS WRITTEN.** It reads as an unconditional promise — *hidden
  > count is exactly 0 for **any** `ambiguous` outcome this ticket can produce* — and this ticket
  > can produce an outcome for which it is not 0. **Seven knights attacking `d4` → `(+2 more)`,
  > eight → `(+3 more)`. Six is the last size that fits.** Both FENs are legal and round-trip
  > byte-identically through `toFen`. Measured twice, independently; the numbers are in
  > `.grugops/context/quality-gate-ABC-033-qe-2026-08-18/notes/` and
  > `.grugops/context/repair-ABC-033-2026-08-18/notes/` and are not re-derived here.
  >
  > **This is a criterion whose PREMISE was wrong, not an implementation defect.** The delivered
  > module is on the correct side of the line this criterion itself draws: it produced the full 7-
  > and 8-candidate lists and handed them over intact — **it truncated nothing and it widened
  > nothing**. The premise that failed is the engineer's cap argument (*"exactly six squares attack
  > any given square by knight move"*), which is true of `d2`, the square every `A4` knight fixture
  > used, and false of a central square: `d4` has **eight** knight-attackers.
  >
  > **`A4` therefore reads, from this date, as bounded rather than unconditional:** the hidden count
  > is **0 for every ambiguity of up to 6 candidates**, which is every ambiguity a game reaches, and
  > **the 7+ case is `EPIC-002`'s** — cut as **`ABC-107`**, exactly as the criterion's own prose
  > directs. **`A4` is NOT marked met on this page, in `plans/board.md` or in
  > `plans/traceability.md`.** A criterion that was falsified and re-scoped is a better record than
  > one that quietly disappears.
- **`A5` (one derive per prompt).** **Given** one submitted line, **when** it is resolved, **then**
  `legalMoves` is called **exactly once**, asserted by spy, regardless of how many attempts the line
  goes through. *(Four attempts × one generation each is the easy wrong implementation and it is
  invisible to every content assertion. Same shape as `ABC-021`'s per-ply `gameStatusOf` call-count
  assertion and `ABC-019`'s counts-map spy.)* **The once is of the PROMPT POSITION, and rendering an
  ambiguity is not free** — clarified 2026-08-18 at the repair hop, unchanged in substance.
  `toSan` derives the position AFTER each checking candidate for its `+`/`#` suffix, so a prompt
  costs `1 + O(candidates)` derives in all and six queens measured six. `A5` holds as written; what
  does not hold is quoting "one derive per prompt" as a cost bound for an ambiguity (`G3`).
- **`A6` (rejection does not advance and does not re-evaluate).** **Given** a line no attempt resolves,
  **when** it is submitted, **then** `kind: "rejected"`, `toFen(position)` is byte-identical, and the
  ply is not advanced. *(`ABC-019`'s `rejected` path, unchanged; this ticket produces the outcome, it
  does not add a path.)*
- **`A7` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's own module and test file(s) and nothing else under `src/`; suite green, skip **0**,
  `PERFT_DEEP=1` **32/32**.

## Dependencies

- **`ABC-031` and `ABC-032` — both MERGED to `main`, and this dependency is DISCHARGED.** Measured
  2026-08-18 at HEAD `7ea9e1b`, not asserted: `parseCoordinateMove` is exported at
  `src/coordinate-move.ts:77` with `CoordinateParseResult` at `:51`, `parseSan` at `src/san.ts:223`
  with `SanParseResult` at `:190`. Both tickets sit in the board's `Done` column (`ABC-031` merged
  2026-08-17, `ABC-032` merged 2026-08-18). It was an **ordering** dependency on two siblings inside
  its own epic — it consumed their result shapes and neither consumed anything of this ticket's — and
  the ordering has occurred.
- **`ABC-019` is merged**, and `PromptOutcome` is the published target shape (`src/turn-loop.ts:125`).
- **`ABC-018` is merged**, and `assembleFrame`'s message region is `A4`'s instrument.
- **Not dependent on `ABC-034`.** Codes now, wording later; `A2`'s candidate list is SAN, not prose.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added, scope = every file the branch adds under `src/`.
- **`NFR-003` (input responsiveness) — routed to `ABC-036`**, which owns the keystroke. `A5` is this
  ticket's own cost bar and it is a **count**, not a clock: one `legalMoves` per prompt.
- **`NFR-002` — not triggered.** This module composes no frame and is on no render path; `A4` reads
  `assembleFrame` as an instrument and changes nothing in it.
- **Security: no trigger, not pre-waived.** The only user-supplied text this ticket can put in front
  of a player is echoed inside a rejection or candidate message, and every message reaches the terminal
  through `assembleFrame`, which **sanitizes** (`src/frame.ts:123`, module-private, not exported —
  RE-MEASURED at `main` HEAD `16e9269`; the page cited `:202`, which had drifted. The claim is
  unchanged in substance; only the number moved — `ABC-018` owns terminal
  escape-sequence injection for the whole frame). **This ticket introduces no second path to that
  sink**, and that is the measurable claim: `git diff` shows no write to a stream. **Firing threshold:**
  any file touched under `src/` other than this ticket's module and test file(s), or any runtime
  dependency added.

## Test notes

1. **Assert "nothing was applied" separately from "the candidates were listed".** A build that lists
   and then plays passes every content assertion.
2. **`A3`'s third row is the load-bearing one.** Without it, an implementation that folds case first
   passes rows one and two.
3. **Spy the `legalMoves` call count** — `A5`. This board has two precedents for exactly this shape.
4. **Do not assert a frame width.** `A4` reads the hidden count that merged code computes; the width is
   the panels' and this ticket must not learn it.
5. **Feed the fixtures a real position where both `bxc4` and `Bxc4` are legal.** Constructing one is
   the only fiddly part of this ticket; do it once, name the FEN in the row, and round-trip it through
   `toFen` before believing it.

## Lane cost — how many test FILES this ticket implies

**One.** No `vi.mock` is required — `A5`'s spy can be a `vi.spyOn` on the injected resolver seam
rather than a hoisted module mock — so **no `*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of
the 13 s clause** (arithmetic over `plans/nfr-catalog.md`'s published floor, not a new measurement).

## Size and priority rationale

**Size `S` (2).** One dispatch function with a fixed attempt order, one merge of two result shapes, one
SAN rendering of a candidate list, and one call-count property. No new grammar, no new chess logic, no
new dependency edge, no design decision. Calibrated against `ABC-021` (one prompt outcome and one
transition on a specified machine, `S`) and `ABC-017` (layout over an existing list, `S`).

**Priority `P0`.** It is the epic's acceptance criterion #2 and the only ticket that makes "no mode
switch" observable. Not `P1`: without it the two resolvers are libraries nothing calls.

## Definition of Ready

Cut-hop assessment by BA/PM **2026-08-12**: **9 of 10, ⚠️x2** — items 3 and 10, both the same open
ordering dependency on `ABC-031` + `ABC-032`. *(The cut-hop prose said "1 recorded ⚠️" while its own
table carried two, and the board row said `⚠️x2`; the table and the board were right.)*

**RE-SCORED against the tree at `main` HEAD `7ea9e1b` by BA/PM, 2026-08-18** (task
`refinement-p0-chain-2026-08-18`). **Result: 10 of 10, 0 ⚠️ — the Definition of Ready is MET.** Both
⚠️ were the SAME fact stated twice, and that fact is **discharged by measurement**: `ABC-031` merged
to `main` 2026-08-17 and `ABC-032` merged 2026-08-18, both are in the board's `Done` column, and both
result shapes are exported at HEAD (see `## Dependencies`). Nothing else on this page changed —
the ⚠️ were not smoothed, they were outlived. Column moves are the Orchestrator's.

**RE-SCORED AGAIN 2026-08-18 by BA/PM** (task `cut-frame-overflow-2026-08-18`) after QE falsified
`A4`. **Result: 10 of 10, 0 ⚠️ — THE SCORE DOES NOT MOVE, and that is a judgement, not an
oversight.** The Definition of Ready asks whether the criteria are *well formed*; it does not ask
whether they turn out to be true. `A4` named an instrument (`assembleFrame`), a quantity (the hidden
count) and a threshold (**0**), and it pre-assigned the disposition if the threshold failed — which
is why the falsification produced a ticket (`ABC-107`) in one hop instead of an argument. **Only
item 4 is annotated, and only to say why it stayed ✅.** Nothing else on this page moved. **The
falsification is recorded on `A4` itself, where a reader meets it; it is not smoothed into this
table and `A4` is NOT met.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** every player; two resolvers and no prompt behaviour; the epic's criterion #2 |
| 2 | scope and out-of-scope clear | **✅** one entry point, a fixed attempt order, one derive; five fences including an explicit refusal to guess |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* valuable, negotiable, estimable, small, testable — and now **independent**: both shapes it consumes are merged and exported at HEAD `7ea9e1b`, so it stands alone. Discharged by measurement 2026-08-18, not by re-argument |
| 4 | acceptance testable and measurable | **✅ — UNCHANGED, and deliberately so after `A4` was falsified 2026-08-18.** Seven criteria: exact candidate counts (**2**), reference identity, byte-identical `toFen`, an exact call count (**1**), a **hidden count of 0** in the frame's message region, `32/32`, skip **0**. **`A4` was measurable, was measured, and came back FALSE — that is the DoR working, not the DoR failing.** This item asks whether a criterion is *well formed*, not whether it turned out true; a falsified criterion is the strongest possible evidence it was testable |
| 5 | dependencies known | **✅** the two sibling dependencies are now **merged**, stated in the direction they ran; two merged instruments named with their line numbers (`src/turn-loop.ts:125` re-checked at HEAD — the cut-hop cite of `:118` had drifted and is corrected on this page) |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `A5`'s count bar; sanitization sink named with its line; firing threshold falsifiable |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` (2), calibrated |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* the two ordering dependencies are **CLOSED** — `ABC-031` and `ABC-032` are both in `Done`. Nothing else is unresolved and nobody is waiting on a decision |
