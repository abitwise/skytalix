---
id: ABC-087
title: Difficulty levels — the MECHANISM (search budget + blunder rate). The CHOOSING is EPIC-006's.
status: backlog
column: Backlog
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

**"Beatable by a beginner without being random" is a real constraint and it is not obviously
satisfied by a uniform blunder draw.** A uniform random blunder occasionally throws a queen, which
*is* random-feeling; picking the *n*-th best move is more human. **Which construction meets the
epic's "without being random" wording is a strength-design decision. Owner: Architect/Design.** `A3`
is written so either construction can satisfy it, and `A4` is the criterion that would catch the
degenerate version. **I have not picked one.**

**The PVS fact either construction meets** *(carried from `ADR-0027` Consequences 2026-10-09; not
decided there or here)*:

- Under PVS, only the first root move gets an exact score. **Every root move after the first has
  only a bound** (`src/engine.ts:320-331`), so a move that ties or trails the best fails low and
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
  **easiest** and **hardest** identified by name.
- **`A2` (the budget reaches the engine).** **Given** each level, **when** a move is requested,
  **then** the wall clock used matches that level's budget within **±20%**, and **no level ever
  exceeds 5 s** (`NFR-004`).
- **`A3` (a lower level is measurably weaker).** **Given** the easiest and the default level on
  `ABC-084`'s puzzle suite, **then** the easiest solves **strictly fewer** puzzles. *(Cheap, fast,
  deterministic evidence of ordering; `ABC-085` provides the expensive game-level evidence.)*
- **`A4` (the blunder is a mistake, not chaos).** **Given** the easiest level over **≥ 200** moves,
  **then** every played move is **legal**, the observed blunder frequency matches the configured
  rate within **±5 percentage points**, and **no played move is ever the worst-scoring move in the
  list**. *(The last clause is the "without being random" constraint made falsifiable. If
  Architect/Design's construction cannot satisfy it, that is the finding.)*
- **`A5` (the hardest level respects `NFR-004`).** **Given** the hardest level over **≥ 30**
  positions, **then** every move returns within **≤ 5 s** — **30/30**. *(The ceiling binds at
  **any** difficulty, and "hardest" is where it is most likely to be broken.)*
- **`A6` (the default is the 3 s level).** **Then** the default level's budget is **3 s**, and
  `NFR-005`'s depth measurements on `kiwipete` and `position-6` are taken at that level.
- **`A7` (seeded, in deterministic mode).** **Given** a fixed seed and deterministic mode, **then**
  the blunder decisions are identical across runs. *(Re-pointed 2026-10-09.)* Deterministic mode is
  `ABC-086`'s virtual clock, consumed and not re-implemented. The seed is this ticket's own.
- **`A8` (no user interface — the epic boundary as a criterion).** **Then** `git diff --numstat`
  shows **no change to `src/cli.ts`, `src/cli-options.ts` or `src/turn-loop.ts`**, and the delivered
  diff contains **no argv parsing and no prompt string**. *(The boundary is asserted, not trusted —
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

- **`ABC-078` must land first — OPEN.** Budgets need the deepening loop.
- **`ABC-086` must land first — OPEN.** *(Re-pointed 2026-10-09.)* `A7`, `A9` and `A10` run on its
  virtual clock (deterministic mode). The seed is no longer `ABC-086`'s: it is this ticket's own.
- **`ABC-084` must land first — OPEN.** `A3` uses its puzzle suite.
- **Architect/Design's ruling on the blunder construction — OPEN.** Named above; not resolved here.
- **`EPIC-006` consumes this table.** *(Cross-epic, and the direction matters: `EPIC-006` reads the
  level names this ticket publishes. **If `EPIC-006`'s decomposition — running concurrently with
  this one — assumed a different level vocabulary, that mismatch is real and is not resolved
  here.** Owner: the Orchestrator, who holds both decompositions.)*

## Security / NFR triggers

- **`NFR-004` — ≤ 3 s at default, hard ceiling 5 s at ANY difficulty.** `A2` and `A5` are its direct
  tests, and `A5` exists because this is the ticket that could create a level that breaks it.
- **`NFR-005` — `A6` fixes the level the depth bars are measured at.** Without it "default
  difficulty" in `NFR-005`'s target has no referent.
- **`N8-LANE` — ≤ 650 ms CPU.** `A2`/`A5`'s wall-clock runs are **opt-in**; `A1`, `A4`, `A7` and
  `A8` are fast and machine-independent and stay in the default lane. *(2026-10-09.)* `A9` and
  `A10` also run on the virtual clock and are machine-independent. Their CPU is measured against
  the bar, not assumed: `A9` alone is ≥ 150 searches.
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

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** The engine is playable at one strength without it, and it sits behind three `P0`
tickets. **It is a hard blocker for `ABC-085`**, which is also `P1`, so the pair is consistent.

## Definition of Ready

**Fold note, 2026-10-09** (subtask `fold-abc086-adr0027`): **not re-scored, and the score did not
move. It is still 7 of 10, with the same three ⚠️ items.** What the fold touched:

- **Item 4** gains `A9` and `A10`, and `A7` is re-pointed. It stays ✅.
- **Item 8:** `M` is now conditional on item 10 (§ Size).
- **Item 10** is widened. The blunder construction must now also answer the PVS-bound fact.
- **Items 3 and 5 are unchanged by the fold.** Their cells below are as of 2026-08-16 and are not
  refreshed here.

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
