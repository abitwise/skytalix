---
id: ABC-085
title: Self-play ladder — hardest scores ≥ 90% against easiest over 100 games
status: in-design
column: In Design
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-085 — the epic's first acceptance criterion, and it is the expensive one

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). The other half of
> `RISK-003`'s mitigation (`ABC-084` is the first). **This ticket exists because `EPIC-004`'s first
> acceptance criterion is a 100-game match and nothing else in this epic can satisfy it.**

## Problem

*User*: the player choosing a difficulty level and expecting it to mean something.

*Pain*: `ABC-087` will define levels as a budget plus a blunder rate. **Nothing checks that the
levels are actually ordered.** A difficulty ladder whose "hard" is not reliably better than its
"easy" is a menu of noise, and `RISK-003` says relative strength cannot be verified without an
opponent — a weaker copy of yourself is the cheapest available one.

*Value*: it is the direct implementation of the epic's first acceptance criterion — *"Given the
hardest difficulty, when the engine plays 100 games against the easiest difficulty, then it scores
at least 90%."*

## Scope

- A harness that plays **N games** between two configured engine instances, alternating colours.
- Game termination via the merged `src/gameend.ts` — checkmate, stalemate, fifty-move, threefold,
  insufficient material. **Nothing here re-implements a rule.**
- A score report: wins / draws / losses, score percentage, and per-game terminal reason.
- Runs at a **configurable reduced budget**, with the 100-game / default-budget run as an explicit
  opt-in mode.

## Out of scope

- **Absolute Elo.** `UNKNOWN - verify`, per the epic, until measured against a rated reference.
  **This harness produces a relative score and nothing else.**
- **Playing an external engine** (Stockfish, UCI). The epic's **permanent non-goal**.
- **Opening variety via an opening book.** **The book is `EPIC-005`'s and is not cut here.**
  Openings are diversified by a seeded random choice among the first few plies — see `A5` — which is
  a test-harness concern, not a book. *(2026-10-09: that choice reuses `ABC-087`'s seeded generator,
  per `ADR-0027` decision 2. It is not a second PRNG.)* **If `EPIC-005`'s book later changes what the engine plays
  from the start position, this harness's baselines are invalidated and must be re-measured. Named
  as a cross-epic dependency and not resolved.** *(2026-10-10: **resolved by construction.**
  `ADR-0012` puts the book in a decorator of `EngineSeam`, `(history) => Promise<Move>`, wired only
  at `src/cli.ts`'s composition root. This harness drives `createLevel`, `(position) => LevelChoice`
  (`src/levels.ts:110`), which no book wraps. **The ladder measures the levels without the book**,
  and a ladder through the book is not this ticket.)*
- **Tuning the levels to make the number pass.** If `A1` fails, that is `ABC-087`'s finding.

## Acceptance (Given/When/Then)

- **`A1` (the epic's criterion, verbatim).** **Given** the hardest difficulty and the easiest,
  **when** 100 games are played, **then** the hardest scores **≥ 90%** (win = 1, draw = 0.5).
  Colours alternate so each side plays 50 as white.
- **`A2` (the ladder is monotone, not just its endpoints).** **Given** each **adjacent** pair of
  difficulty levels, **when** ≥ 20 games are played, **then** the stronger scores **> 50%**. *(A
  ladder that satisfies `A1` while having its middle levels out of order is still broken, and `A1`
  alone cannot see it.)*
- **`A3` (every game terminates).** **Given** any run, **then** **100/100** games reach a terminal
  state from `gameStatus` with no timeout, no crash, and no game exceeding a stated ply cap. **A
  game hitting the ply cap is reported as an error, not as a draw.**
- **`A4` (every move played was legal).** **Then** each game's move list replays cleanly from the
  start position through merged `apply`/`legal` — **100/100**. *(The harness is also the only
  long-running integration test this engine will ever have; it should be used as one.)*
- **`A5` (reproducible under a fixed seed — the epic's fifth criterion).** **Given** the same seed
  and the same build, **when** the ladder runs twice, **then** the game move lists are **identical**
  and the score is **identical**. *(This is also the harness's own opening-diversity mechanism: the
  seed selects among early moves, so games differ from each other and not from run to run.)*
  *(Re-pointed 2026-10-09 on the accepted `ADR-0027`.)* Both engines run in deterministic mode, each
  on its **own** instance of `ABC-086`'s virtual clock. The seed, and the generator that both the
  blunder draws and the opening choice consume, are `ABC-087`'s. This harness consumes both and
  re-implements neither.
- **`A6` (cost is reported and the run mode is honest).** **Then** the wall clock for the full
  100-game run at the default budget is reported. **A short mode — fewer games, reduced budget —
  is the one that runs routinely, and the report states which mode produced any quoted number.**

## Dependencies

- ~~**`ABC-087` must land first — OPEN.**~~ **`ABC-087` — `Done`** (merged `b696d8e8`, owner UAT
  accepted; status corrected 2026-10-10). There are no difficulty levels to ladder without it.
  *(2026-10-09.)* It also owns the seed and the seeded generator that `A5` consumes: `seededRandom`
  and `createLevel` are exported from `src/levels.ts`. Security/NFR's `R1` (the level clamp pin,
  owed "before `ABC-085` enters `In Development`") is delivered at `src/levels.test.ts:323`.
  - **Named risk to `A2`** *(2026-10-10, BA/PM, `rule-abc087-cost`)*. `ABC-087`'s built table puts
    **levels 3, 4 and 5 at 3 s, 4 s and 4.5 s, all at blunder rate 0**, so they differ by budget
    alone: 1.33x and 1.125x.
    - **Why it is structural.** Above the 3 s default, `NFR-004`'s 5 s ceiling allows at most
      1.67x. On `kiwipete`, one ply cost about 3x the time: depth 5 at 1 000 ms, 6 at 3 000 ms
      (`ADR-0032` § Context).
    - **The prediction.** The 3/4 and 4/5 pairs may score about 50 %, not > 50 %.
      `UNKNOWN - verify`; the ladder measures it, and the levels are not tuned for it (test note 4).
    - **Measured 2026-10-10 (BA/PM probe, not a game run).** On a virtual clock, an aborted
      iteration is discarded and the TT is cleared per search. So two rate-0 levels that complete
      the same depth play the **same move**, and a pair that agrees on every move plays the same
      game from both chairs. On 50 corpus positions, one step for both levels, the count of
      positions where the chosen move differs:

      | virtual step | 3 vs 4 | 4 vs 5 | median depth | real ms per L3 move (loaded host) |
      |---:|---:|---:|---:|---:|
      | 120 | 9 / 50 | 2 / 50 | 5 | ~110 |
      | 30 | 2 / 50 | 0 / 50 | 6 | ~550 |
      | 10 | 2 / 50 | 0 / 50 | 7 | ~1 600 |
      | 4 | 4 / 50 | 0 / 50 | 8 | ~4 400 (about real time here) |

      **Below step 120, level 5 never chose a different move from level 4 (0 of 50 at steps 30,
      10 and 4), and level 4 differed from level 3 on only 2–4 of 50.** This is evidence for the
      risk, not the verdict: `A2` is a game score.
    - **If `A2` fails there,** it is `ABC-087`'s finding, routed to BA/PM.
    - **Every fix found so far is a product call, and none is taken here.** Fewer levels above the
      default changes `ABC-101`'s vocabulary, which `EPIC-006` reads. A blunder rate at the default
      changes today's play and `NFR-005`'s referent. Scoping `A2` to pairs at or below the default
      weakens it, so it is the owner's.
- ~~**`ABC-086` must land first — OPEN.**~~ **`ABC-086` — `Done`** (merged `3f26e21`; status
  corrected 2026-10-09). `A5`'s ~~seeded reproducibility~~ deterministic mode, the virtual clock, is
  that ticket's contract *(re-pointed 2026-10-09; the seed moved to `ABC-087`)*. This one
  **consumes** it and does not re-implement it.
- **`ABC-125` — `Done`** (merged `99fb7ad1`; status corrected 2026-10-10). Was: must land first
  *(added 2026-10-09, `cut-followups-2026-10-09`)*. `A5`
  runs two engines, each on its own virtual clock, and the levels may use different steps. No
  merged row runs two live clocks at different steps. QE's mutant `M5` (the step held at module
  level) survives every row (`ABC-086` G-QE-1). `ABC-125` adds the row that kills it.
- ~~**`ABC-078`, `ABC-077`, `ABC-076` — OPEN** (transitively).~~ **All `Done`** (status corrected
  2026-10-09).
- **`src/gameend.ts`, `src/history.ts`, `src/apply.ts`, `src/legal.ts` — MERGED** and used as-is.
- **`EPIC-005`'s opening book — cross-epic, named and NOT resolved** (see `## Out of scope`).

## Security / NFR triggers

- **`RISK-003` — the relative-strength half of the mitigation.**
- **`N8-LANE` / `NFR-008` — ⚠️ THIS IS THE MOST EXPENSIVE THING IN THE EPIC AND IT CANNOT BE IN THE
  DEFAULT LANE.** Arithmetic, stated rather than hidden: 100 games × ~60 plies × 3 s ≈ **5 hours**.
  Against `NFR-008`'s **3 s wall / 13 s CPU** whole-suite clause this is four orders of magnitude
  out. **Ruling: OPT-IN ONLY, `PERFT_DEEP`'s established shape, never in `npm test`.** A short mode
  (e.g. 10 games at a millisecond budget) may run in the default lane **only if it is measured to
  fit the 650 ms per-ticket bar** — measure, do not assume.
  - *2026-10-10 re-score: the 5 hours was priced on the REAL clock.* `A5` puts the ladder on a
    virtual clock, where a move costs `budget ÷ step` readings at about 4.4–5.5 ms real each (probe,
    loaded host). **The step sets the cost and also what is measured.** At step 120 the levels run
    at about 1/27 of a real level-3 move. At step 10, level 3 still runs at only about half of one,
    and step 4 is about real time on this host (probe table above). Neither is the shipped 3 s engine (`ADR-0027`: "a virtual millisecond is
    not a real one"). No ruling names the step. Until one does, "the default budget" in `A1` and
    `A6` has no reproducible meaning. The `N8-LANE` 650 ms is refused at the cut under `ADR-0035`
    (proposed); the short mode, if any, is pinned by a count.
- **`NFR-004` — not triggered.** The harness sets its own budget.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A4` costs almost nothing and buys the most.** Replaying every generated game through the
   merged legality path is a very large integration test for a few lines of harness.
2. **`A3`'s ply cap must report an error.** Silently scoring a stuck game as a draw is how a
   90% number gets manufactured.
3. **Do not let `A1` be the only measurement.** `A2` is the one that catches a broken middle.
4. **Report the mode with every number** (`A6`). A 90% from a 10-game short run is not the epic's
   criterion and must never be quoted as if it were.
5. **Run `A2`'s 3/4 and 4/5 pairs first** *(2026-10-10)*. They are the named risk in
   § Dependencies, and the cheapest early answer to it.

## Size and priority rationale

**Size `M` (3).** A game loop over two engine instances, a scorer, a seeded opening selector and a
replay validator. **Not `L`:** every rule it needs is merged and it writes no production code.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`, not `P0`, and this is a deliberate call against the epic's own criterion.** It
implements the epic's **first** acceptance criterion, which argues for `P0`. But it can only run
after seven other tickets, it verifies rather than delivers behaviour, and a 5-hour run is not
something the board can pull like other work. **Recorded as a judgement, and it is BA/PM's to be
overruled on:** if the owner wants the epic's first criterion treated as `P0`, this is the row to
change.

## Definition of Ready

**RE-SCORED 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-p1-backlog-2026-10-10`,
at `aaa88263`). **Result: 8 of 10, ⚠️x2 (was 7). Recommended column: `In Design`.** Readings:
`.grugops/context/rescore-p1-backlog-2026-10-10/notes/` and `../probe/`.

- **Item 3 ⚠️ → ✅.** Every dependency is `Done` (`ABC-087` `b696d8e8`, `ABC-125` `99fb7ad1`,
  `ABC-086`, `ABC-076`–`ABC-078`), and Security/NFR's `R1` is delivered.
- **Item 5 ⚠️ → ✅.** The book dependency is resolved by construction (§ Out of scope).
- **Item 4 ✅ → ⚠️ (new).** `A1` and `A6` say "the default budget", but `A5` runs on a virtual clock
  whose step is unnamed. The probe shows the step changes the answer: at step 120, 4 vs 5 differ on
  2/50 moves, and at steps 30, 10 and 4 on 0/50. A criterion whose verdict depends on an unstated
  dial is not yet measurable. **Architect/Design** names the step (or steps) and states what a
  virtual-clock verdict claims about the shipped real-clock levels. `ADR-0027` decision 6 calls
  the step "the dial". BA/PM folds the ruling into `A1`/`A2`/`A6`.
- **Item 10 ⚠️ STANDS, changed in kind.** The run no longer has to be "5 hours with no home". At a
  coarse step it is a deep lane of the kind the board already runs (`PUZZLE_DEEP` at QE on the
  owner's option B; `ENGINE_DEEP` ~5 min). Near real time it is hours again. **The step decides
  the home, and the cost-versus-fidelity trade is the owner's** (owner question in the note).
- **Size `M` holds. Priority `P1` holds.** The P0 argument is stronger now: this is the only thing
  left that can prove `EPIC-004`'s first criterion. It stays the owner's call, as written below.
- **Production and UAT.** If the harness lives only in a `*.test.ts` file (`ABC-087` `A3`'s
  precedent), the diff has zero production lines and UAT is waived by measurement. A non-test
  harness module under `src/` would need the owner's word.
- **Overlaps.** No file overlap with `ABC-083`, `ABC-131`, `ABC-141`, `ABC-138` or `ABC-140`.
  `ABC-010` (unmerged) edits one fixture in `src/levels.test.ts` (`:351`). If this harness goes in
  that file, build after `ABC-010` merges. **By value, `ABC-083` changes the evaluation every level
  uses.** A ladder verdict taken before `ABC-083` merges is a verdict on the old engine. Run the
  verdict after `ABC-083` merges, or re-run it then.

**Fold note, 2026-10-10** (subtask `rule-abc087-cost`). **Not re-scored; still 7 of 10.** A named
risk to `A2` (§ Dependencies) and test note 5 are added. No criterion changed. Item 3 stays ⚠️
because `ABC-087` is not `Done`.

**Fold note, 2026-10-09** (task `wave-2026-09-25`, subtask `fold-abc086-adr0027`, accepted
`ADR-0027`, list `…f3caccd1`). **Not re-scored, and the score did not move: still 7 of 10, the same
three ⚠️.**

- `A5` and Dependencies are re-pointed: the virtual clock is `ABC-086`'s, and the seed and
  generator are `ABC-087`'s.
- `A5`'s criterion is unchanged.
- The ticket still waits on both `ABC-086` and `ABC-087`, so item 3 stays ⚠️.

**Fold note, 2026-10-09** (subtask `cut-followups-2026-10-09`). **Not re-scored; still 7 of 10.**
`ABC-086` is now `Done`, and `ABC-125` (the two-step clock row) has been added as an XS
prerequisite. `ABC-087` is still open, so item 3 stays ⚠️.

Assessed by BA/PM, **2026-08-16**. **Result: 7 of 10 clean, 3 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** an unordered ladder is the pain; the epic's own criterion is the value |
| 2 | scope and out-of-scope clear | **✅** five fences, two of them permanent epic non-goals, one a live cross-epic boundary |
| 3 | INVEST-shaped | **⚠️** **least independent ticket in the epic** — five open dependencies, two of them direct |
| 4 | acceptance testable and measurable | **✅** six: **≥ 90%** over 100 alternating-colour games, **> 50%** on every adjacent pair, **100/100** termination with cap-as-error, **100/100** legal replay, byte-identical seeded reruns, mode-tagged cost |
| 5 | dependencies known | **⚠️** the `EPIC-005` book dependency is **named and deliberately unresolved** — it can invalidate this harness's baselines and no owner is assigned to that interaction |
| 6 | security/NFR triggers with a measurable target | **✅** — and the **~5 hour vs 3 s lane conflict is calculated and ruled** rather than discovered later |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P1`, **with the argument against it stated and handed to the owner** |
| 10 | no major unresolved blocker | **⚠️** **a 5-hour opt-in run has no home in this delivery process.** No board column, cadence or gate accommodates it, and nothing says who runs it or how often. Owner: the Orchestrator with the project owner |
