---
id: EPIC-004
title: Engine and AI opponent
status: backlog
column: Backlog
priority: P0
size: L
owner: BA/PM
---

# EPIC-004 — Engine and AI opponent

_Updated: 2026-07-30 by BA/PM (NFR-005 trigger restated to the depth-in-budget target ratified 2026-07-30; RISK-002's spike re-pointed at the measurement that target names. This is the FIRST `_Updated:` line on this file — no epic in `plans/epics/` carried one, so it was added in the style of `plans/board.md` and `plans/nfr-catalog.md` rather than updated. Nothing else in this epic changed.)_

> **`NFR-005`'s `≥ 500,000 nodes/sec` target was RETIRED on 2026-07-30. Kept here as dated
> history, not silently overwritten.** Until today this epic's `NFR triggers` section read:
> *"`NFR-005` Search throughput — target **≥ 500,000 nodes/sec** during search (slower than raw
> perft because evaluation runs). This is the leading indicator for NFR-004 and the primary output
> of the spike; until the spike reports, it is `UNKNOWN - verify`."*
>
> That target was retired when Olger Oeselg ratified `ADR-0003` clause 2 **as amended** on
> 2026-07-30. Two reasons, both recorded in `plans/nfr-catalog.md`: the 500k figure came from the
> ABC-008 spike, a throwaway benchmark that ran **no legality filtering at all** and therefore never
> measured this code; and "nodes/sec" is undefined until the node is defined — the same merged code
> measures **207k to ~6.1M nodes/sec** on the node definition alone, and under one definition
> `startpos` passes 500k while `kiwipete` does not. A target a *position* can pass or fail with no
> code change is not testable. The live target is **depth-in-budget** and is restated under
> `NFR triggers` below, transcribed from the `NFR-005` row in `plans/nfr-catalog.md` as that row
> reads today.
>
> `RISK-002`'s mitigation is corrected in the same edit and for the same reason: the ratified row
> names **this epic's own timeboxed spike** as the verification that lifts the **PROVISIONAL**
> marker from the depth-7 level, so that spike measures **depth-in-budget on non-M3 target
> hardware**, not nodes/sec. Its timeboxed, before-the-full-build shape is unchanged.
>
> **One consequence for whoever decomposes this epic.** The closing line of `NFR triggers` still
> reads *"Architect seeds both rows in `plans/nfr-catalog.md` at design time"* — that sentence is
> left as written, but both rows now exist and the `NFR-005` row is **ratified**, so at design time
> that step is a **read, not a re-seed**. Re-seeding it would overwrite a human's ratified decision.

## User value

"Hard enough to be challenging" — the opponent is the product. An engine that hangs pieces
is not worth playing twice; one that takes 30 seconds a move is not worth playing once.
Target: club level, roughly 1400-1700, with weaker difficulty levels selectable below it.

## Scope

- Search: negamax with alpha-beta pruning, iterative deepening, quiescence search on
  captures, and a transposition table.
- Move ordering: MVV-LVA for captures, killer moves, hash move first. Move ordering is
  where most of the strength-per-line-of-code lives.
- Evaluation: material, piece-square tables, pawn structure (doubled/isolated/passed),
  king safety, mobility. Deliberately hand-tuned and small, not learned.
- Difficulty levels that map to a search budget plus a blunder rate, so lower levels are
  beatable by a beginner without being random.
- Time control: engine returns a move within a bounded wall-clock budget per move, using
  iterative deepening so it can always return the best move found so far.

## Out of scope

- Neural network evaluation, NNUE, or any learned component — permanent non-goal.
- UCI protocol support or driving an external engine such as Stockfish — permanent
  non-goal; this is a self-contained engine.
- Endgame tablebases — permanent non-goal.
- Strength above ~1700 — the requester's "not too complex" constraint binds here.

## Acceptance (epic level)

- **Given** the hardest difficulty, **when** the engine plays 100 games against the easiest
  difficulty, **then** it scores at least 90%.
- **Given** any position, **when** the engine is asked for a move under the default time
  budget, **then** it returns a legal move within that budget, every time.
- **Given** a position with a forced mate in 2, **when** the engine searches at default
  strength, **then** it finds the mate.
- **Given** a position where a piece hangs to a simple one-move tactic, **when** the engine
  searches at default strength, **then** it does not play the losing move.
- **Given** the same position and the same difficulty twice, **when** the engine searches,
  **then** the chosen move is reproducible under a fixed seed.

## Dependencies

- `EPIC-001` — move generation and apply/undo are the search's inner loop.

## Risks

- `RISK-002` Node/JS search throughput may cap achievable depth below what 1400-1700
  requires. Mitigate with an early timeboxed spike, before the full build commits to the
  design, that measures **depth-in-budget on non-M3 target hardware** — how deep the search
  gets on `kiwipete` and `position-6` inside the 3 s budget, against the depth-6 FAIL floor
  and the depth-7 WARN level. The ratified `NFR-005` row names this spike as the verification
  that **lifts the PROVISIONAL marker** from the depth-7 level, which is why it measures depth
  and not a rate. *(Until 2026-07-30 this mitigation read "measures nodes/sec"; the rate is
  now a diagnostic, not the target — see the note under the title. The spike's timeboxed,
  before-the-build shape is unchanged, and RISK-002's own answer from ABC-008 —
  **GO WITH CONSTRAINT**: the per-move budget must be time-based iterative deepening, never
  a fixed depth — is unchanged and non-negotiable.)*
- `RISK-003` Strength is hard to *verify* without a reference opponent. Mitigate with the
  self-play ladder plus a fixed tactical-puzzle suite as a regression gate.

## NFR triggers

- `NFR-004` Move-search wall clock — the engine returns a move in **≤ 3 s** at default
  difficulty, with a **hard ceiling of 5 s** never exceeded at any difficulty.
- `NFR-005` Search depth in budget — on the standing benchmark positions **`kiwipete` and
  `position-6`** (both already carrying published perft counts in `src/perft.test.ts`), at
  default difficulty the search completes **≥ depth 6** within the 3 s budget and never
  exceeds the 5 s ceiling — **below depth 6 = FAIL** — and reaches **depth 7** within that same
  3 s budget — **below depth 7 = WARN**. The **depth-7 level is PROVISIONAL** pending
  measurement on non-M3 target hardware, and this epic's own timeboxed spike (`RISK-002`'s
  mitigation) is the named verification that lifts that marker; the **depth-6 floor is not
  provisional**, because NFR-004's promise and the 1400-1700 strength target rest on it.
  **Node rate is a diagnostic, not the target** — every rate figure quoted anywhere must carry
  its node definition, its position and its machine. Depth-in-budget on target hardware is
  `UNKNOWN - verify`; on an M3 both levels clear today (`kiwipete` depth 7 in 0.39-0.68 s,
  `position-6` depth 7 in 0.644 s — ADR-0003, a model at EBF 6 with leaves evaluated not
  generated, so those times are a lower bound). The earlier **≥ 500,000 nodes/sec** target is
  **RETIRED** — see the note under the title.

Architect seeds both rows in `plans/nfr-catalog.md` at design time.

## Test notes

Tactical puzzle suite (mate-in-N and win-material positions) as a strength regression gate;
a commit that drops puzzle-solve count fails the gate. Self-play ladder for relative
strength. Absolute Elo is `UNKNOWN - verify` until measured against a rated reference.
