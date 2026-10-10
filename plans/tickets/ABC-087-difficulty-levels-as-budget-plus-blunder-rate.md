---
id: ABC-087
title: Difficulty levels — the MECHANISM (search budget + blunder rate). The CHOOSING is EPIC-006's.
status: in-development
column: In Development
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-087 — levels as data. No flag, no prompt, no session state.

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03).
>
> **The boundary is on this page because it was ruled before I cut anything, and two sibling
> decompositions were running at the same time.** The Orchestrator's ruling, applied as written:
> **"Search strength, depth, time budget, evaluation, move ordering and any transposition table are
> yours. The user-facing DIFFICULTY SELECTION — a flag, a prompt, how a chosen level persists across
> a session — is `EPIC-006`'s, not yours. You own the mechanism; it owns the choosing."**
>
> **This ticket therefore has no user interface at all.** It ships a named set of levels and the
> engine behaviour each one produces. `EPIC-006` decides how a human picks one. That boundary is
> already consistent with merged code: `src/turn-loop.ts` takes a **resolved** `humanColour` and the
> architecture audit's entry-point table lists *"the resolved colour, difficulty, flags"* as
> `EPIC-006`'s **new** work.
>
> **Folded 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `fold-abc086-adr0027`) from the
> accepted `ADR-0027` (list `…f3caccd1`). **The seed moved here from `ABC-086`:** the seed bullet in
> Scope, `A9` (formerly `ABC-086` `A3`), `A10` (the seed half of `ABC-086` `A6`), test notes 5–6,
> and the generator's limits. The PVS-bound fact is carried into § The design question. `A7` is
> re-pointed, and the size is re-estimated. **The DoR was not re-scored and did not move** (see
> § Definition of Ready).
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-batch-2026-10-10`,
> Workflow 07) against the wave tip `71be48b`. `ABC-084` and `ABC-125` are `Done`. **The
> level-vocabulary mismatch is closed here.** `A1` adopts the vocabulary `ABC-101` published:
> integers `1`–`5`, default `3`. The PVS citation is re-pointed to today's lines. **DoR 9/10, item
> 10 ⚠️: the blunder construction is still Architect/Design's, and it is the only thing between
> this page and `Ready`.** Reasoning: `.grugops/context/rescore-batch-2026-10-10/notes/`.
>
> **Re-scored 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `owner-adrs-followups`) on
> [`ADR-0032`](../../memory-bank/50-decisions/ADR-0032-a-blunder-scores-every-root-move-with-the-shipped-engine-and-plays-the-strict-second-best.md),
> **accepted by the owner 2026-10-10**: construction (a), no re-size. Its four criteria edits are
> folded (`A2`, `A4` ×2, `A5`), `A8` gains `ADR-0032` decision 1's "engine and search do not change",
> the stale "OPEN" in § Dependencies and the stale "40/40" in `A3` are fixed. **DoR 10/10 → `Ready`.**
> Reasoning: `.grugops/context/owner-adrs-followups/notes/`.
>
> **Ruled 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rule-abc087-cost`), on the build's
> `N8-LANE` overrun. **Option (a): `A4`'s ≥ 200-move run moves to `ENGINE_DEEP=1`. No count, rate or
> clause is lowered, and the bar stays 650 ms.** `A4`'s frequency is re-worded so it reads p, not
> p(1−q)/(1−pq). The levels 3/4/5 risk is named on `ABC-085`. **DoR 10/10, unchanged.** What the
> Engineer re-runs is in § Delivery. Reasoning: `.grugops/context/rule-abc087-cost/notes/`.

## Problem

*User*: the beginner who loses every game, and the club player who wins every game.

*Pain*: one strength setting fits nobody. The epic's user value names the target — *"club level,
roughly 1400–1700, with weaker difficulty levels selectable below it"* — and its scope names the
mechanism — *"difficulty levels that map to a search budget plus a blunder rate, so lower levels are
beatable by a beginner without being random."*

*Value*: the product's whole "hard enough to be challenging" promise is a promise about *the right
level*, not about maximum strength.

## Scope

- A **named set of levels** (at least 3, including a defined *default* and a defined *hardest* and
  *easiest* — `ABC-085` `A1` requires the endpoints to be named).
- Each level is **data**: a per-move time budget and a blunder rate.
- The **blunder mechanism**: with probability *p*, play a move that is not the best — chosen from
  the searched move list, **seeded here** (next bullet).
- **The seed** *(moved from `ABC-086` 2026-10-09)*. An injected seed drives every random choice:
  this ticket's blunder draw, and `ABC-085`'s seeded opening choice, which reuses the same
  generator. The generator's limits come from `ADR-0027` decision 2, and its shape is this
  ticket's to choose within them:
  - it is a small seeded generator with **no new dependency**;
  - its state is **per instance and passed in, never module-level**;
  - it lives outside `src/engine.ts` and `src/search.ts`, which hold no PRNG and no seed
    (decision 1).
- The **default level's budget is 3 s** — `NFR-004`, and `NFR-005`'s levels are defined "at default
  difficulty", so the default is what those bars measure.

## Out of scope — and this is the epic boundary

- **A `--difficulty` flag, a prompt, a menu, or persistence across a session — `EPIC-006`'s.** Not
  cut here, not designed here, not named here.
- **The hard 5 s ceiling.** `NFR-004` binds **every** level; it is `ABC-078`'s guarantee and this
  ticket must not define a level that can exceed it (`A5`).
- **Elo calibration of the levels.** `UNKNOWN - verify` per the epic. Levels are **relatively**
  ordered (`ABC-085` `A2`); no level claims an Elo number.
- **Verifying the ladder.** `ABC-085`. This ticket defines levels; that one proves they are ordered.
- **Choosing the PRNG.** Any small seeded generator will do, and the choice is not worth a ticket.
  *(Moved from `ABC-086`.)*
- **Seeding the engine's own tie breaking.** `ADR-0027` decision 1 ruled it out by measurement.
  The seed reaches the blunder draw, never the search.

## The design question I am NOT answering

> **RULED 2026-10-10 — `ADR-0032`, accepted by the owner.** Construction **(a)**, in the level module;
> `src/engine.ts` and `src/search.ts` do not change. One seeded draw per move decides, before any
> search, whether the move is a blunder. Not a blunder: the shipped `chooseMove`, unchanged. A blunder:
> every legal root move is scored on its child with the shipped `chooseMove`, in `legalMoves` order,
> on one clock against one shared deadline `start + B·(i+1)/N`, with `B = min(level budget,
> HARD_CEILING_MS)`; the move played is the **strict second-best** (`n` = 2, not a level field). The
> premise below is corrected there: the root lacks per-move scores because of alpha-beta, not only PVS,
> and (b) measured **5.7–13.3x** nodes on `kiwipete`, not +3.3–5.2 %. The text below is kept as cut.

**"Beatable by a beginner without being random" is a real constraint and it is not obviously
satisfied by a uniform blunder draw.** A uniform random blunder occasionally throws a queen, which
*is* random-feeling; picking the *n*-th best move is more human. **Which construction meets the
epic's "without being random" wording is a strength-design decision. Owner: Architect/Design.** `A3`
is written so either construction can satisfy it, and `A4` is the criterion that would catch the
degenerate version. **I have not picked one.**

**The PVS fact either construction meets** *(carried from `ADR-0027` Consequences 2026-10-09; not
decided there or here)*:

- Under PVS, only the first root move gets an exact score. **Every root move after the first has
  only a bound** (`searchMove`, `src/engine.ts:314`–`:336`; the null window starts at `:325`;
  re-pointed 2026-10-10), so a move that ties or trails the best fails low and
  looks the same as a worse one.
- **The root therefore does not hold the scores a blunder draw needs.** Picking "the *n*-th best",
  or obeying `A4`'s "never the worst-scoring move", both need per-move scores.
- **Widening the root window to get those scores is the change `ADR-0027` measured and rejected
  for tie breaking.** With LMR on it is value-changing, and it costs +3.3–5.2% nodes. A
  construction that does it falls under `ADR-0026` decision 10: a switch, doors and a bounded
  oracle.
- **A construction that scores candidate moves separately**, without touching the root search,
  avoids that. But it spends nodes from the same per-move budget (`NFR-004`).
- **Owner: Architect/Design**, as part of this section's open question.

## Acceptance (Given/When/Then)

- **`A1` (levels are data, and the endpoints are named).** **Then** the delivered module exports a
  level table with **≥ 3** entries, each carrying a budget and a blunder rate, and with **default**,
  **easiest** and **hardest** identified by name. *(Vocabulary fixed 2026-10-10.)* The table is
  keyed by the ordinals `ABC-101` publishes: **integers `1`–`5`, weakest to strongest**. **easiest =
  `1`, default = `3`, hardest = `5`.** `EPIC-006` reads the table by those integers and attaches no
  meaning to them (`ABC-101`, `RISK-002`).
- **`A2` (the budget reaches the engine).** **Given** each level, **when** a move is requested,
  **then** the wall clock used matches that level's budget within **±20%**, and **no level ever
  exceeds 5 s** (`NFR-004`). *(Folded 2026-10-10, `ADR-0032`.)* The runs include **at least one blunder move at
  the easiest level**, with a seed chosen so that one fires, so the blunder path's budget (the clamped
  sum of its child searches) is measured, not only the shipped path's.
- **`A3` (a lower level is measurably weaker).** **Given** the easiest and the default level on
  `ABC-084`'s puzzle suite, **then** the easiest solves **strictly fewer** puzzles. *(Cheap, fast,
  deterministic evidence of ordering; `ABC-085` provides the expensive game-level evidence.)* *(2026-10-10:
  run it on `ABC-084`'s runner in deterministic mode (`ADR-0027`) with a fixed seed, so the two
  counts are reproducible. `src/puzzle-suite.baseline.json` is not touched — ~~(40/40)~~, stale; it
  reads 58/62 today and 54/58 after `ABC-131`. Both counts come from one run on whatever suite is in
  the tree, so `A3` does not wait on `ABC-131`. This is a measurement, not the gate (`ADR-0034`
  § Consequences).)*
- **`A4` (the blunder is a mistake, not chaos).** **Given** the easiest level over **≥ 200** moves,
  **then** every played move is **legal**, the observed blunder frequency matches the configured
  rate within **±5 percentage points**, and **no played move is ever the worst-scoring move in the
  list**. *(The last clause is the "without being random" constraint made falsifiable. If
  Architect/Design's construction cannot satisfy it, that is the finding.)*
  *(Folded 2026-10-10, `ADR-0032` decisions 2–3.)*
  - ~~**The frequency's denominator:** blunders played ÷ moves, with **no-candidate moves** (fewer than
    three distinct scores, so no strict second-best exists) **left out of the denominator and
    reported** as a count.~~ *(Struck 2026-10-10, `rule-abc087-cost`. Only a no-candidate move whose
    draw fired leaves that denominator. With a no-candidate share q it reads p(1−q)/(1−pq), not p:
    25.8 % against 40 % on pawn endings.)*
  - **The frequency** *(2026-10-10)* is **(blunder moves + no-candidate moves) ÷ moves**. That is
    every move on which the draw called for a blunder, and it must be within ±5 pp of the rate.
    **Blunders played ÷ moves and the no-candidate count are reported beside it.** **Every
    no-candidate move's own scored list has fewer than three distinct scores.** So a skipped blunder
    cannot hide under the label.
  - **"Never the worst" is asserted on every blunder move, against that move's own returned scored
    list.** The module returns the list with the move (shape: the Engineer's), and the test reads it;
    it does not re-derive scores. The **worst class** is every move scoring the list's minimum, when
    that minimum is strictly below the maximum; if all score the same, no move is worst. On a
    non-blunder move there is no list and the clause does not apply.
- **`A5` (the hardest level respects `NFR-004`).** **Given** the hardest level over **≥ 30**
  positions, **then** every move returns within **≤ 5 s** — **30/30**. *(The ceiling binds at
  **any** difficulty, and "hardest" is where it is most likely to be broken.)*
  *(Folded 2026-10-10, `ADR-0032`.)* **If the hardest level's blunder rate is above 0**, the 30 include
  blunder moves (a seed chosen so that they fire), and each of those also returns within **≤ 5 s**:
  `NFR-004` is enforced per `chooseMove` call, and only the level layer's clamp bounds the sum.
- **`A6` (the default is the 3 s level).** **Then** the default level's budget is **3 s**, and
  `NFR-005`'s depth measurements on `kiwipete` and `position-6` are taken at that level.
- **`A7` (seeded, in deterministic mode).** **Given** a fixed seed and deterministic mode, **then**
  the blunder decisions are identical across runs. *(Re-pointed 2026-10-09.)* Deterministic mode is
  `ABC-086`'s virtual clock, consumed and not re-implemented. The seed is this ticket's own.
- **`A8` (no user interface — the epic boundary as a criterion).** **Then** `git diff --numstat`
  shows **no change to `src/cli.ts`, `src/cli-options.ts` or `src/turn-loop.ts`**, and the delivered
  diff contains **no argv parsing and no prompt string**. *(Added 2026-10-10, `ADR-0032` decision 1:)*
  **and no change to `src/engine.ts` or `src/search.ts`**; the level module does not import
  `src/virtual-clock.ts` (the clock is passed in, `ADR-0027` decision 4). *(The boundary is asserted, not trusted —
  which is what the last decomposition hop's rewrite was about.)*
- **`A9` (different seeds actually differ)** *(moved from `ABC-086` `A3`, 2026-10-09, re-aimed at
  the blunder draw)*. **Given** the easiest level, deterministic mode and the same **≥ 30**
  positions, **when** they are played under **≥ 5** different seeds, **then** at least two seeds
  produce different blunder-decision sequences. A blunder-decision sequence is, per position,
  whether a blunder was played and which move it was. *(A "seeded" draw that ignores its seed passes
  `A7` perfectly.)* No tie fixture is needed: the draw is random by design.
- **`A10` (the seed is threaded, not global)** *(the seed half of `ABC-086` `A6`, moved
  2026-10-09)*. **Given** two level instances with **different seeds**, each with its own virtual
  clock, **when** they are called interleaved in one process (A, B, A, B, …) over **≥ 10**
  positions, **then** each instance's played moves are identical to the same instance run alone:
  **10/10 for each.** The generator's state lives in the instance and is passed in, never held at
  module level (`ADR-0027` decision 2). This is asserted because `ABC-085`'s ladder runs exactly
  that configuration.

## Dependencies

- ~~**`ABC-078` must land first — OPEN.**~~ **`ABC-078` — `Done`** (status corrected 2026-10-09,
  `cut-followups-2026-10-09`). Budgets need the deepening loop, and it exists.
- ~~**`ABC-086` must land first — OPEN.**~~ **`ABC-086` — `Done`** (merged `3f26e21`; status
  corrected 2026-10-09). *(Re-pointed 2026-10-09.)* `A7`, `A9` and `A10` run on its virtual clock
  (deterministic mode). The seed is no longer `ABC-086`'s: it is this ticket's own.
- ~~**`ABC-084` must land first — OPEN (In Development at `7b54dae`).**~~ **`ABC-084` — `Done`**
  (merged `e634bc1`, 2026-10-10). `A3` uses its suite and runner.
- **`ABC-125` — `Done`** (2026-10-10). The board asked for it to land first. It is a prerequisite
  of `ABC-085`, not of this ticket.
- ~~**Architect/Design's ruling on the blunder construction — OPEN.**~~ **RULED and accepted
  2026-10-10 — `ADR-0032`**, construction (a). See § The design question.
- **`EPIC-006` consumes this table.** *(Cross-epic, and the direction matters: `EPIC-006` reads the
  level names this ticket publishes. **If `EPIC-006`'s decomposition — running concurrently with
  this one — assumed a different level vocabulary, that mismatch is real and is not resolved
  here.** Owner: the Orchestrator, who holds both decompositions.)* **Resolved 2026-10-10 by BA/PM.**
  `ABC-101` published integers `1`–`5`, default `3`, as an "opaque ordinal" that is "cheap to
  change". `A1` now uses exactly that, and `ABC-101` is not edited. Both pages are BA/PM's cuts.
  This needs no ruling. The Orchestrator may reverse it.
- **File overlap (2026-10-10; (a) ruled).** The level module is a new production file, and `A8` keeps
  `src/engine.ts` and `src/search.ts` unchanged, so this ticket shares **no file** with `ABC-083`,
  `ABC-126` or `ABC-131`. `A3` and `A6` read results that `ABC-083` moves, so they are measured on the
  tree this ticket lands on. **Option B (`PUZZLE_DEEP` at QE):** the level module's file name is the
  Engineer's. If it falls under a trigger glob (`src/search*.ts`, `src/evaluate*.ts`), QE runs the
  gate; otherwise it does not, and `A3` is the only puzzle reading (`ADR-0034` § Consequences).

## Security / NFR triggers

- **`NFR-004` — ≤ 3 s at default, hard ceiling 5 s at ANY difficulty.** `A2` and `A5` are its direct
  tests, and `A5` exists because this is the ticket that could create a level that breaks it.
- **`NFR-005` — `A6` fixes the level the depth bars are measured at.** Without it "default
  difficulty" in `NFR-005`'s target has no referent.
- **`N8-LANE` — ≤ 650 ms CPU.** `A2`/`A5`'s wall-clock runs are **opt-in**; ~~`A1`, `A4`, `A7` and
  `A8` are fast and machine-independent and stay in the default lane.~~ *(2026-10-09.)* `A9` and
  `A10` also run on the virtual clock and are machine-independent. Their CPU is measured against
  the bar, not assumed: `A9` alone is ≥ 150 searches.
  *(Re-placed 2026-10-10, `rule-abc087-cost`.)* The ruled construction made "`A4` is fast" false.
  Every blunder runs one `chooseMove` per legal root move, and the build read +0.825 s.
  - **`ENGINE_DEEP=1`:** `A2`, `A3`, `A5`, and **`A4`'s ≥ 200-move run, every clause**.
  - **Default lane:** `A1`, `A6`, `A7`, `A8`, `A9`, `A10`, plus test note 7's guard.
  - **The bar is still 650 ms**, read on `ADR-0035`'s narrow set (`src/levels.test.ts`).
- **Security — not triggered.** No input surface — `A8` guarantees it, since the only surface would
  be the argv parsing this ticket is forbidden to add.

## Test notes

1. **`A8` first, and keep it.** Two epics were decomposed in parallel and this is the seam between
   them; a criterion is worth more than a paragraph.
2. **`A4`'s "never the worst move" is the one that means something.** A blunder rate alone is
   satisfiable by an engine that occasionally plays a random legal move, which is exactly what the
   epic says not to build.
3. **`A2`'s ±20% must use the injected clock** (`ABC-086`'s virtual-clock module), or it becomes a
   load-sensitive test.
4. **Do not tune the levels to make `ABC-085` `A1` pass.** That is measuring the ruler with the
   thing it measures; if the ladder does not reach 90%, report it.
5. **`A9` before `A7`** *(moved from `ABC-086`)*. A draw that ignores its seed passes `A7` trivially.
6. **Do not add a PRNG dependency** *(moved from `ABC-086`)*. A dozen lines of xorshift is enough,
   and `AGENTS.md` says not to add dependencies without reason.
7. **Keep the per-move half of `A4` in the default lane, at no search cost** *(2026-10-10,
   `rule-abc087-cost`)*. `A4`'s run is opt-in now. So on the moves `A9` already plays (5 seeds × 30),
   assert every non-engine move's clauses: legal, list in `legalMoves` order, never the worst, the
   strict second-best, and no-candidate means fewer than three distinct scores. That adds no new
   search and no frequency clause. It is a regression guard for note 2, not `A4`'s evidence.

## Size and priority rationale

**Size `M` (3).** A level table, a blunder draw ~~wired to an existing seed~~ *with its own seed
(2026-10-09)*, and ~~eight~~ ten criteria, of which three are boundary or NFR guards. **Not `L`:**
the budget plumbing is `ABC-078`'s, ~~the seed is `ABC-086`'s~~ deterministic mode is `ABC-086`'s,
and the verification is `ABC-084`'s and `ABC-085`'s.

*(Re-estimated 2026-10-09, after the seed moved here.)* **`M` (3) holds, and it is now conditional.**

- **What the seed adds is small.** The generator is about a dozen lines, plus `A9`, `A10` and two
  test notes. That alone stays within `M`.
- **What can move the size is the PVS fact** (§ The design question).
  - If Architect/Design's construction scores candidate moves without touching the root search,
    the size stays `M`.
  - If the construction changes the root search, it is a switch, doors and an oracle under
    `ADR-0026` decision 10. The size is then re-estimated at that point, and likely `L`. It is not
    guessed now.

**Resolved 2026-10-10: `M` (3), unconditional.** `ADR-0032` ruled construction (a): candidates are
scored outside the root search, so no switch, doors or oracle, and no re-size (`ADR-0032`
§ Consequences). The fold adds five clauses to existing criteria (`ADR-0032`'s four, plus decision 1 on `A8`) and no new criterion.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** The engine is playable at one strength without it, and it sits behind three `P0`
tickets. **It is a hard blocker for `ABC-085`**, which is also `P1`, so the pair is consistent.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM** (`rule-abc087-cost`, branch tip `ef297855`). **Result: 10 of 10 —
unchanged.** The column is the Orchestrator's, and the ticket stays `In Development` until the re-run below.
- **Item 4 stays ✅.** `A4`'s frequency now reads p on any corpus. No count, tolerance or clause was
  lowered: ≥ 200 moves, ±5 pp and never-the-worst all stand.
- **Item 6 stays ✅.** `N8-LANE` keeps 650 ms. Only `A4`'s run changes lane, and the line says which.
- **Item 7 stays ✅:** seven notes.
- **Item 10 stays ✅.** The overrun is a delivery reading. It is ruled, not a readiness blocker.
- **Items 1–3, 5, 8, 9 are unchanged.** The levels 3/4/5 risk is `ABC-085`'s to measure. It is named
  there and does not block this page.

**Re-scored 2026-10-10 by BA/PM** (`owner-adrs-followups`, wave tip `246ddfc`). **Result: 10 of 10 —
MET → `Ready`.** No ordering: it shares no file with any open ticket.
- **Item 10, ⚠️ → ✅.** The blunder construction is ruled and accepted (`ADR-0032`, owner 2026-10-10):
  (a), the strict second-best, and "worst" defined on the construction's own scores.
- **Item 4 stays ✅, folded.** `A4`'s denominator and its per-blunder-move list; `A2` measures at least
  one blunder at the easiest level; `A5` covers the blunder path when the hardest rate is above 0;
  `A8` adds "no change to `src/engine.ts` or `src/search.ts`". `A3`'s stale "40/40" is struck.
- **Item 5 stays ✅.** § Dependencies no longer reads "OPEN"; every ticket dependency is `Done`.
- **Item 8 stays ✅:** `M`, no longer conditional.
- **Items 1–3, 6, 7, 9 stay ✅.** `P1`, hard blocker for `ABC-085`.
- **Owed elsewhere, not blocking:** `NFR-004`'s catalog wording for the level layer's clamp on the sum
  (Security/NFR, `ADR-0032` § Consequences).

**Re-scored 2026-10-10 by BA/PM** (`rescore-batch-2026-10-10`, wave tip `71be48b`). **Result: 9 of 10,
1 ⚠️ — NOT met; stays in `Backlog`.**
- **Item 3, ⚠️ → ✅.** Every ticket dependency is `Done` (`ABC-078`, `ABC-086`, `ABC-084`). The
  design ruling is counted once, at item 10.
- **Item 5, ⚠️ → ✅.** The vocabulary mismatch is closed by adopting `ABC-101`'s (§ Dependencies).
- **Item 4 stays ✅.** `A1` names its keys, and `A3` names its mode.
- **Item 8 stays ✅:** `M`, conditional on the ruling, as § Size says.
- **Item 10 stays ⚠️. The exact question for Architect/Design:** *"Under PVS only the first root
  move has an exact score (`src/engine.ts:314`–`:336`). Which blunder construction ships? (a)
  Candidate root moves are scored separately, outside the root search and inside the same
  per-move budget (`NFR-004`). (b) The root window is widened for exact scores, under `ADR-0026`
  decision 10 (switch, doors, bounded oracle; +3.3–5.2% nodes; value-changing with LMR on). Within
  the construction, what does a blunder pick: the n-th best, or a uniform choice among the moves
  that are not the worst? And on that construction's scores, what is the 'worst-scoring move in the
  list' that `A4` forbids?"* **When the answer is on this page, the ticket is `Ready` (10/10) under
  (a). Under (b) it is `Ready` once it is re-sized, likely to `L` (§ Size).**
  **→ RULED 2026-10-10 by Architect/Design in [`ADR-0032`](../../memory-bank/50-decisions/ADR-0032-a-blunder-scores-every-root-move-with-the-shipped-engine-and-plays-the-strict-second-best.md)
  (`proposed`, owner acceptance owed): (a), no re-size (`M`).** A blunder move scores every root move
  with the shipped `chooseMove` on its child, inside the level's own clamped budget. It plays the
  **strict second-best**. `A4`'s "worst" is the minimum class of that move's own scored list. (b)
  measured 5.7–13.3x nodes on `kiwipete`, not +3.3–5.2%. Not re-scored: the verdict is BA/PM's.

**Fold note, 2026-10-09** (subtask `fold-abc086-adr0027`): **not re-scored, and the score did not
move. It is still 7 of 10, with the same three ⚠️ items.** What the fold touched:

- **Item 4** gains `A9` and `A10`, and `A7` is re-pointed. It stays ✅.
- **Item 8:** `M` is now conditional on item 10 (§ Size).
- **Item 10** is widened. The blunder construction must now also answer the PVS-bound fact.
- **Items 3 and 5 are unchanged by the fold.** Their cells below are as of 2026-08-16 and are not
  refreshed here.

**Status correction, 2026-10-09** (subtask `cut-followups-2026-10-09`). **Not re-scored; still 7
of 10.** `ABC-078` and `ABC-086` now read `Done` in § Dependencies. Item 3 stays ⚠️, because
`ABC-084` and the blunder-construction ruling are still open.

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both users named; the epic's own value and scope sentences quoted |
| 2 | scope and out-of-scope clear | **✅** four fences, the first being the ruled epic boundary and asserted by `A8` |
| 3 | INVEST-shaped | **⚠️** **not independent** — three open tickets plus an open design ruling |
| 4 | acceptance testable and measurable | **✅** eight: a named ≥ 3-entry table, **±20%** budget fidelity, strict puzzle ordering, **±5 pp** blunder rate with a never-the-worst-move clause, **30/30** under 5 s, a fixed 3 s default, seeded reproducibility, and a diff-level UI prohibition |
| 5 | dependencies known | **⚠️** **the `EPIC-006` level-vocabulary mismatch is real and unresolved** — the two epics were decomposed **concurrently** and neither could read the other's output. Owner: the Orchestrator |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` 3 s / 5 s tested twice; `NFR-005`'s referent fixed; lane split stated per criterion |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P1`, consistent with `ABC-085` |
| 10 | no major unresolved blocker | **⚠️** **the blunder construction is genuinely open and is Architect/Design's.** `A4` is written to accept either candidate and to reject the degenerate one, but **which construction satisfies "beatable without being random" is not decided** |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-087`). Branch
`grugops/ABC-087-difficulty-levels` from `94cf5e6b`: code `659215a3`, test refinements `3a133d26`,
docs on top. Not merged, not pushed. Decisions, readings and drafts are in
`.grugops/context/ticket-to-pr-ABC-087/notes/` (`…4e5f0323`, `…25962b19`, `…53ebd6d1`), with raw files
in `probe/`. They are not restated here.

**Criteria: `A1`-`A10` met. One NFR bar is NOT MET: `N8-LANE` reads +0.825 s CPU against 650 ms.
It is reported, not lowered. No stop condition fired on the engine: `src/engine.ts` and
`src/search.ts` are untouched, and 0 trigger-list files changed.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `LEVELS` 1-5, frozen: 100 ms/0.40, 500/0.20, **3000/0**, 4000/0, 4500/0. Easiest 1, default 3, hardest 5 |
| `A2` | MET | Virtual clock: shipped path +2.0 % at every level; blunder path at the easiest level 101.3/100 over 20 and over 43 children; all ≤ 5 000 |
| `A3` | MET (measurement) | Easiest **35/62**, default **58/62**, `ABC-084`'s rule at one step (120 virtual ms) for both. Baseline untouched |
| `A4` | MET | Default lane 80/(204 − 1) = **39.4 %**; deep (perft + puzzles) 97/(246 − 0) = **39.4 %**. All legal. Never the worst, the strict second-best, on every blunder's own list |
| `A5` | MET | Hardest, real clock: **30/30 ≤ 5 s, max 4,527 ms**. The rate is 0, so the blunder clause does not apply (asserted) |
| `A6` | MET | Default = 3000 = `DEFAULT_BUDGET_MS`, rate 0. Identical to `chooseMove` reading-for-reading |
| `A7` | MET | Same seed, same decisions over 30 positions (with blunders) |
| `A8` | MET | `src/` diff: `levels.ts` +182/−0 and `levels.test.ts` +484/−0 only. The import set is asserted (no `virtual-clock.ts`), and no argv or prompt |
| `A9` | MET | 5 seeds → 5 distinct sequences over 30 positions |
| `A10` | MET | Interleaved A/B, seeds 11/12: **10/10 each**, and A ≠ B |

- **Gate at `3a133d26`.** Lint, typecheck and build exit 0. `npm test` is 52 files / 1601 passed / 0
  skipped. Skip integrity reads `No findings.`, and the lane inventory is 52 = 52.
  `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`: 25 passed, 199 s at load1 5.8 → 4.0.
- **`N8-LANE`** (`ADR-0035` narrow set, twin R 0.060 s): **+0.825 s (0.78-0.85), NOT MET.** Options
  (a) move the default-lane `A4` run to deep, (b) a criterion change, or (c) accept. Routed in
  `…53ebd6d1`; the Engineer took none.
- **Raised, not acted on:**
  - `A4`'s folded frequency is biased low by p(1 − q)/(1 − pq) when no-candidate positions are
    common. It reads exact on the shipped corpora.
  - Levels 3/4/5 differ by budget only, a risk to `ABC-085` `A2`.
  - `NFR-004` wording is drafted for Security/NFR.
  - The `AGENTS.md` lane line is drafted for the Scribe.

**2026-10-10, BA/PM ruling** (subtask `rule-abc087-cost`). **Option (a). (b) is refused: lowering
`A4`'s count weakens a criterion. (c) is not needed unless (a)'s re-run misses.**

The Engineer changes `src/levels.test.ts` only. `src/levels.ts` is not touched.
1. **Move** the default-lane `it("every move legal; rate ±5 pp; never the worst; the strict
   second-best")` under `describe("A4 — the easiest level over ≥ 200 moves")` into the
   `if (RUN_DEEP)` block, unchanged and tagged `[deep]`. Move it; do not delete it. It is the only
   run that exercises a no-candidate move inside `A4`.
2. **Keep in the default lane:** `A1` ×4, `A6` ×3, `A4`'s "byte-identical after a blunder", the four
   edge cases, `seededRandom` ×2, `A9`, `A7`, `A10`, and `A8` ×2. That is **19 tests**.
3. **Add test note 7's guard inside `A9`'s `it`**, on the choices it already plays. It adds
   assertions only, with no new search and no new test.
4. **Re-word `assertA4`'s frequency** to (blunders + no-candidate) ÷ moves, and log both.
   Expected: deep perft + puzzles (97 + 0)/246 = 39.4 %; `ENDGAMES` (80 + 1)/204 = 39.7 %.

**Re-measure:**
- **Gate.** Expect `npm test` at 52 files / **1600** / 0 skipped, plus integrity and lane inventory.
  Expect `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` at **25 passed (19 default)**.
- **`N8-LANE` on the same harness:** `ADR-0035` narrow set, placeholder base, `diff -r` twin, n = 8,
  R reported.
- **The verdict:**
  - **MET** needs an admissible twin (≤ 1.5 %, sign at chance), R ≤ 650 ms and a median ≤ 650 ms.
  - The variant's +0.54 s (0.47–0.57) stood on an inadmissible twin (−1.92 %). It is not evidence.
  - An inadmissible twin is re-run within `self_fix_attempts` (2).
  - **NOT MET or UNRESOLVED → stop.** That is option (c), the owner's word, with both readings.
    BA/PM moves no other criterion out of the default lane.

**2026-10-10, Software Engineer re-hop** (option (a) applied, `src/levels.test.ts` only, `f61ad6b1`).
I applied the ruling's four items exactly. The moved `A4` run's body is unchanged, including its now
stale `"default lane, ENDGAMES"` log label. Readings are in `…69fa98d1`, which supersedes `…25962b19`
for the gate and the cost.

- **Gate:**
  - lint, typecheck and build: exit 0;
  - `npm test`: **52 files / 1600 / 0 skipped**;
  - integrity `No findings.`;
  - lane inventory 52 = 52.
- **`ENGINE_DEEP=1`:** **25 passed (19 default)**, 200.8 s at load1 6.9 → 3.7.
  - `A4`: `ENDGAMES` (80 + 1)/204 = **39.7 %**; perft + puzzles (97 + 0)/246 = **39.4 %**, both within
    ±5 pp. Blunders played ÷ moves are 39.2 % and 39.4 %.
  - `A5`: max 4,590 ms.
  - `A3`: 35/62 vs 58/62.
- **`N8-LANE`: MET.** The reading is +0.535 s CPU (0.50-0.62, sign 8/8), with an admissible twin
  (+0.31 %, 4/8) and R 0.030 s, at load1 6.42-6.85. The verdict rests on `ADR-0035` (`proposed`).
- **The `AGENTS.md` lane line** is re-drafted with "19 default" in `…53ebd6d1`. It is the Scribe's,
  owed before merge.

**2026-10-10, Software Engineer QE fix-forward** (`026a7373`, `src/levels.test.ts` only, on QE's
`a2850bd0`). This closes QE-087-a, -b and -e from QE's register (`…62d79e31`). Readings are in
`…26fd4d9d`, which supersedes `…69fa98d1`.

- **QE-087-a (default lane).** A pass-through spy on `chooseMove` checks 8 seeds: every call is
  `{ budgetMs, now }` only, and the engine path gets exactly the level budget. **M3a is red** (1 of 21:
  this row only).
- **QE-087-b (default lane).** Every child score of one blunder is re-derived against the real
  `chooseMove` at depth 1, and Qxd5 (wins a queen) must be alone at the top. **M8 is red** (1 of 21:
  this row only).
- **QE-087-e.** The deep `ENDGAMES` run now logs `ENGINE_DEEP, ENDGAMES`.
- **Gate:**
  - lint, typecheck and build: exit 0;
  - `npm test`: **52 / 1602 / 0 skipped**;
  - integrity `No findings.`;
  - lane inventory 52 = 52.
- **`ENGINE_DEEP=1`:** **27 passed (21 default)**, 197.6 s at load1 12.5 → 3.6. `A4` reads 39.7 % and
  39.4 %; `A5` max is 4,536 ms; `A3` reads 35 vs 58.
- **`N8-LANE`: MET.** The reading is +0.555 s (0.52-0.57), twin −0.66 % at 3/8, R 0.030 s, at load1
  9.0-15.0. It rests on `ADR-0035` (`proposed`).
- **The `AGENTS.md` lane line** is re-drafted in `…53ebd6d1` as "27 passed (21 default)". The Scribe
  owes it before merge.

**2026-10-10, Software Engineer: Security/NFR R1** (`1160b063`, `src/levels.test.ts` only, on
`c35f38bf`). The readings are in `…14ec8ea7`, which supersedes `…26fd4d9d`.

**New rows and pins.**
- **R1 / QE-087-c (new default-lane row, 6 ms).** A `{ 20 000 ms, rate 1 }` level on a 5-move
  position with `virtualClock(250)`, asserting `elapsedMs ≤ HARD_CEILING_MS + 4·step`. **M4 is red,
  on this row only** (20 750 > 6 000).
- **QE-087-d (taken, inside `A9`'s test, no new search).** Move k is a non-engine move iff the k-th
  draw of a fresh `seededRandom(seed)` is below the rate. **M5b is red, on `A9` only.**

**Gate.** Lint, typecheck and build exit 0. `npm test` reads **52 / 1603 / 0 skipped**, integrity
`No findings.`, and the lane inventory is 52 = 52.

**`ENGINE_DEEP=1`.** **28 passed (22 default)**, 202.0 s at load1 8.9 → 8.4.

**`N8-LANE`: MET.**
- Treatment **+0.545 s**, interval 0.53-0.56.
- Twin +0.33 % at 4/8.
- R 0.030 s.
- load1 8.41-9.54.

**`AGENTS.md`.** The lane line is re-drafted as "28 passed (22 default)" (`…53ebd6d1`). It is owed by
the Scribe.
