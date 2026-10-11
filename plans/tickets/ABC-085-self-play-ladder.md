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
- ~~Runs at a **configurable reduced budget**, with the 100-game / default-budget run as an explicit
  opt-in mode.~~ *(Overtaken 2026-10-11, `ADR-0038` accepted.)* Runs at **one of two named steps**
  of the virtual clock: the **short step, 120** (`LADDER_DEEP=1`), and the **verdict step, 4**
  (`LADDER_DEEP=verdict`, the owner's choice). **Budgets are never scaled.** Every level plays at its
  `LEVELS` budget, verbatim (`ADR-0038` decision 1).

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
  - *(Folded 2026-10-11, `ADR-0038`.)* **The `A1` verdict is taken at the verdict step, step 4**
    (`ADR-0038` decision 3; the owner's choice, "step 4"), **on a tree that contains `ABC-083`'s
    merge** (decision 6). **The report names the commit, the step, the seeds, the game count, the
    wall time and load1.** A score from any other step is never quoted as `A1`.
  - If `ABC-083` is split, the tree must contain the merge of every piece that changes the evaluation.
    If it is dropped, the verdict is taken on the tip at the drop. Either way it is the engine that
    ships (decision 6's reason).
- **`A2` (the ladder is monotone, not just its endpoints).** **Given** each **adjacent** pair of
  difficulty levels, **when** ≥ 20 games are played, **then** the stronger scores **> 50%**. *(A
  ladder that satisfies `A1` while having its middle levels out of order is still broken, and `A1`
  alone cannot see it.)*
  - *(Folded 2026-10-11, `ADR-0038` and the owner's question 1, option (a): "levels 4 and 5 run as
    specified".)* **Same step as `A1` (step 4), same tree.** **The 3v4 and 4v5 pairs run first**
    (test note 5).
  - **`A2` is MEASURED AND REPORTED, and its bar stays `> 50%`.** Every adjacent pair's score is
    reported against `> 50%`, as MET or RED, with its game count.
  - A RED pair does not hold this ticket open, and it is not a delivery defect. It is
    **`ABC-087`'s finding, with a real score**, routed to BA/PM. The owner then chooses re-cutting
    levels 4/5 or scoping the ladder up to level 3 on a game result (`ADR-0038` owner menu (b)/(c)).
  - **The levels are not tuned here** (§ Out of scope).
  - `A1` reads the same way: ≥ 90% is MET or RED, and a RED is `ABC-087`'s finding (§ Out of scope).
- **`A3` (every game terminates).** **Given** any run, **then** **100/100** games reach a terminal
  state from `gameStatus` with no timeout, no crash, and no game exceeding a stated ply cap. **A
  game hitting the ply cap is reported as an error, not as a draw.**
  - *(Folded 2026-10-11. The claim policy is BA/PM's call, per `ADR-0038` § Consequences.)*
    **The harness CLAIMS every claimable draw at the first offer.** When `gameStatus` reports
    `claimable` for the side to move (`threefold-repetition` or `fifty-move`, `src/gameend.ts`), the
    game ends there as a draw. Its terminal reason is recorded as **`threefold-repetition (claimed)`**
    or **`fifty-move (claimed)`**, distinct from the automatic `fivefold-repetition` and
    `seventy-five-move`. A claimed draw counts as a terminal state for this criterion.
  - **Why claim.** For a deterministic pair (levels 3, 4 and 5 are all blunder rate 0), a
    history-blind engine that repeats once repeats until fivefold. So the claim **changes cost, not
    score** (`…d60bfcc9` item 6). When a pair includes level 1 or 2 (blunder rate 0.4 / 0.2),
    claiming ends play that the blunders could still have broken. When the stronger side is rate 0
    (every pair except 1v2), the claim is therefore **expected to lower the stronger side's score,
    not raise it**. That is the conservative direction for a ≥ 90% bar. The direction is an
    expectation, not a proof, and stays `UNKNOWN - verify` until the claimed-draw counts are read.
  - **The report counts claimed draws per pair**, so the policy's effect is visible (`A6`). If
    claimed draws decide a RED or a MET at the margin, that is reported, not re-run under another
    policy.
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
  - *(Folded 2026-10-11, `ADR-0038` decisions 1–2.)* **One step per run, for both sides**, each
    side on its own `virtualClock(step)` instance. **A per-level step is refused**, because it is a
    re-tuned level. **The steps are named constants in the harness (120 and 4), never computed from
    a timing at run time.** A step calibrated per host or per load would play different games on
    different machines, and that breaks this criterion.
- **`A6` (cost is reported and the run mode is honest).** ~~**Then** the wall clock for the full
  100-game run at the default budget is reported. **A short mode — fewer games, reduced budget —
  is the one that runs routinely, and the report states which mode produced any quoted number.**~~
  *(Overtaken 2026-10-11, `ADR-0038` accepted.)*
  - **Then** the wall clock for the full run at **the levels' own budgets at the verdict step
    (step 4)** is reported.
  - The routine run is the **short mode, `LADDER_DEEP=1`, at the short step 120**. "Reduced budget"
    means a coarser step and nothing else. The short mode may play fewer games than the verdict
    mode. Its game counts are named constants, and the report states them.
  - **Every number from the short mode is labelled "short mode, step 120"** and is never quoted as
    `A1` or `A2`. At step 120, level 1 sits on the depth-1 floor on 50 of 50 positions. The short
    mode can claim `A3`, `A4` and `A5`, plus an early `A2` signal on 3v4 and 4v5, and nothing more
    (decision 3).
  - Every report states the mode, the step, the game count and the count of claimed draws per pair
    (`A3`).

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
  runs two engines, each on its own virtual clock, ~~and the levels may use different steps~~
  *(overtaken 2026-10-11: `ADR-0038` decision 1 puts one step on the whole run)*. No
  merged row runs two live clocks at different steps. QE's mutant `M5` (the step held at module
  level) survives every row (`ABC-086` G-QE-1). `ABC-125` adds the row that kills it. **`ABC-125`'s
  row stays as a guard against a module-level step. It is not a licence for a per-level step.**
- **`ABC-083` — the VERDICT waits for it, and the BUILD does not** *(folded 2026-10-11, `ADR-0038`
  decision 6)*. `ABC-083` changes the evaluation every level uses. A verdict taken before it merges
  is a verdict on an engine that will not ship. There is no file overlap, so the harness can be
  built, and its short mode run, before `ABC-083`. **`ABC-083` is `Blocked` today**
  (BLOCKED_NEEDS_FIX, handoff #5), so the verdict has no date.
  - **Staleness rule.** A verdict is **STALE** after any merge that touches `PUZZLE_DEEP`'s engine
    trigger list, `src/levels.ts` or `src/virtual-clock.ts`. Re-taking it is the Orchestrator's to
    schedule. **It is not a gate on that merge.**
  - **Split trigger, pre-registered.** Suppose the build passes QE on `A3`–`A6` (short mode) while
    `ABC-083` is still unmerged. Then the Orchestrator may split `A1`/`A2`'s verdict run into its own
    `XS` ticket: the run plus the report, at step 4, on the tree decision 6 names. This ticket then
    closes on `A3`–`A6`. That keeps a ~10-hour background run on an unmerged dependency from holding
    a built harness in a column.
  - **Split CUT 2026-10-11 as `ABC-146`** (`XS`, `P1`, BA/PM subtask `bapm-fold-qe114-2026-10-11`). The
    trigger fired: QE passed `A3`–`A6` at `3783ae15` with `ABC-083` unmerged. It is built to the PROPOSED `ADR-0038`
    addendum: the same harness under plain `node` from `tools/ladder/`, with a digest equivalence
    check against `LADDER_DEEP=1` before any verdict, and `LADDER_DEEP=verdict` refused inside vitest.
    **`A1`, `A2` and `A6`'s verdict wall are taken there.** This ticket closes on `A3`–`A6`, as the
    trigger says. `ABC-146` waits on the owner's acceptance of the addendum and on `ABC-083`'s merge.
- ~~**`ABC-078`, `ABC-077`, `ABC-076` — OPEN** (transitively).~~ **All `Done`** (status corrected
  2026-10-09).
- **`src/gameend.ts`, `src/history.ts`, `src/apply.ts`, `src/legal.ts` — MERGED** and used as-is.
- **`EPIC-005`'s opening book — cross-epic, named and NOT resolved** (see `## Out of scope`).

## Security / NFR triggers

- **`RISK-003` — the relative-strength half of the mitigation.**
- **`N8-LANE` / `NFR-008` — ⚠️ THIS IS THE MOST EXPENSIVE THING IN THE EPIC AND IT CANNOT BE IN THE
  DEFAULT LANE.** Arithmetic, stated rather than hidden: 100 games × ~60 plies × 3 s ≈ **5 hours**.
  Against `NFR-008`'s **3 s wall / 13 s CPU** whole-suite clause this is four orders of magnitude
  out. **Ruling: OPT-IN ONLY, `PERFT_DEEP`'s established shape, never in `npm test`.** ~~A short mode
  (e.g. 10 games at a millisecond budget) may run in the default lane **only if it is measured to
  fit the 650 ms per-ticket bar** — measure, do not assume.~~ *(Overtaken 2026-10-11, `ADR-0038`
  decision 5 and its "a short mode in the default lane" alternative, rejected.)*
  - **Folded 2026-10-11, `ADR-0038` decision 5. The lane is `LADDER_DEEP`, in a test file.**
    - `LADDER_DEEP=1` is the short mode (step 120). `LADDER_DEEP=verdict` is the verdict mode
      (step 4).
    - **Unset, the rows are NOT DEFINED, not skipped**, so the gate's skip count stays 0.
    - There is one `it` per pair, so `-t "<pair>"` re-runs one pair, and `A5` makes the re-run
      reproduce it.
    - **The default lane plays 0 games.** That is pinned by a count: **0 games, +1 test file** at
      `ADR-0035` decision 2's per-file floor. **No wall bound is written.** `NFR-008` takes the +1
      file by count, which is Security/NFR's row.
    - The harness lives in a `*.test.ts` file (`src/ladder.test.ts` is suggested; the Engineer
      names it). The diff then carries zero production lines.
    - **`LADDER_DEEP` is not a gate**, not a `quality.mandatory_gates` entry, and not a per-ticket QE
      trigger. `ADR-0035` decision 5's `grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src` adds it to
      `NFR-008`'s Applies-to list by itself.
    - **The verdict run is machine time.** It runs once per verdict, in the background, on the
      Orchestrator's schedule.
  - **Cost table** (`ADR-0038` § Consequences). These are estimates, labelled, not readings. The
    formula is plies ÷ 2 × (budget A + budget B) ÷ step × 3.5–6.5 ms. Plies at step 4 are
    `UNKNOWN - verify`. A full run is `A1` at 100 games plus `A2` at 20 games per pair.

    | step | full run | `A1` alone | the 3v4 + 4v5 pairs |
    |---:|---:|---:|---:|
    | 4 (verdict) | ~10 h (7–13) | ~3.3 h | ~5.8 h |
    | 120 (short) | ~20 min (14–26) | ~7 min | ~12 min |

    *(2026-10-11, BA/PM.)* **These are plain-`node` figures.** Inside vitest the engine runs ~4.35x
    per node, so step 4 costs ~43.5 h (30–58) there (`ADR-0038` addendum). The table with a runner
    column is on `ABC-146`, where the verdict now lives.
  - *2026-10-10 re-score: the 5 hours was priced on the REAL clock.* `A5` puts the ladder on a
    virtual clock, where a move costs `budget ÷ step` readings at about 4.4–5.5 ms real each (probe,
    loaded host). **The step sets the cost and also what is measured.** At step 120 the levels run
    at about 1/27 of a real level-3 move. At step 10, level 3 still runs at only about half of one,
    and step 4 is about real time on this host (probe table above). Neither is the shipped 3 s engine (`ADR-0027`: "a virtual millisecond is
    not a real one"). ~~No ruling names the step. Until one does, "the default budget" in `A1` and
    `A6` has no reproducible meaning.~~ *(2026-10-11: `ADR-0038` names it, step 4 / step 120.)* The
    `N8-LANE` 650 ms is refused at the cut under `ADR-0035` (accepted); the short mode is pinned by a
    count.
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
6. **Test the step constants, not just the games** *(2026-10-11, `ADR-0038` decisions 1–2)*. One row
   shows that both sides of a game read the same step from a named constant. The run must fail if a
   side is handed a different step, or if the step is derived from a timing.
7. **Test the claim policy on a known repetition** *(2026-10-11, `A3`)*. Use a position sequence
   that reaches threefold. The game must end as `threefold-repetition (claimed)` at the first offer,
   not at fivefold.

## Size and priority rationale

**Size `M` (3).** A game loop over two engine instances, a scorer, a seeded opening selector and a
replay validator. **Not `L`:** every rule it needs is merged and it writes no production code.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`, not `P0`, and this is a deliberate call against the epic's own criterion.** It
implements the epic's **first** acceptance criterion, which argues for `P0`. But it can only run
after seven other tickets, it verifies rather than delivers behaviour, and a 5-hour run is not
something the board can pull like other work. **Recorded as a judgement, and it is BA/PM's to be
overruled on:** if the owner wants the epic's first criterion treated as `P0`, this is the row to
change. **2026-10-11: the owner kept `P1`** (*"keep P1"*, note `…owner-word-six-answers-b7c41e09`).

**Size `M` still holds after `ADR-0038` (2026-10-11).** It adds two named constants, one environment
variable with two values, and the claim policy. That is no new module and no production line.

## Definition of Ready

**RE-SCORED 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-batch-2026-10-11`, at
`506550f3`), on folding the accepted `ADR-0038` (fold list `…8d778218`, 9 items, all folded).
**Result: 10 of 10, 0 ⚠️ (was 8/10, ⚠️x2). Recommended column: `Ready for Dev`** (the design hop
is complete). Notes: `.grugops/context/bapm-batch-2026-10-11/notes/`.

- **Item 4 ⚠️ → ✅.** The step is named: 4 for the verdict and 120 for the short mode, as constants,
  one per run. `A1` and `A2` name their tree and their report fields. `A2` is "measured and
  reported" against `> 50%` (owner option (a)). `A3`'s claim policy is ruled. `A6`'s "default" and
  "reduced" budgets are replaced by steps.
- **Item 10 ⚠️ → ✅, re-worded as `ADR-0038` asks.** The run has a home: the `LADDER_DEEP` lane. The
  verdict runs once, in the background, on the Orchestrator's schedule. The owner answered the step
  question ("step 4"). **No homeless run and no open owner question is left.**
- **Item 3 stays ✅, with one ordering named.** The build is independent. The verdict waits for
  `ABC-083`, which is `Blocked`. The § Dependencies split trigger stops that from holding the built
  harness. **Item 5 stays ✅.** `ABC-083` is named, the staleness rule is stated, and `ABC-125` is
  re-read.
- **Item 6 stays ✅, restated.** `LADDER_DEEP`: 0 games and +1 file in the default lane, by count,
  with no wall bound. The cost table is labelled as an estimate.
- **Item 7 ✅ (seven test notes)**, **item 8 ✅ (`M` holds)**, **item 9 ✅ (`P1`, the owner's word)**.
- **Production and UAT** are unchanged. If the harness stays in a `*.test.ts` file, the diff has
  zero production lines and the UAT waiver is measured at the exit.
- **Overlaps.** `ABC-083` has no file overlap (`ADR-0038` decision 6). `ABC-144` (cut at this hop)
  may change the runner's worker settings, which changes `LADDER_DEEP`'s wall but not its games.
  `A5` is unaffected, because the virtual clock does not read the wall.

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

## Delivery

**2026-10-11, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-085`). **BUILD ONLY; the
verdict was not run.** Branch `grugops/ABC-085-self-play-ladder` from `aee4b8cb`: harness `d5b0f0e2`, docs on top.
Not merged, not pushed. Decisions and readings are in `.grugops/context/ticket-to-pr-ABC-085/notes/`
(`…098699a1` decisions, `…8c8d3fa3` readings, `…70684a78` cost risk, `…8515e3e7` artefacts), with raw files in
`probe/`. They are not restated here.

**The harness is `src/ladder.test.ts`. 0 production lines.** `SHORT_STEP = 120` and `VERDICT_STEP = 4` are
named constants. `LADDER_DEEP=1` / `=verdict` select one per run, and both sides get it, each on its own clock.
`LEVELS` is used verbatim. One `it` per pair: 3v4, 4v5, 2v3, 1v2, then 1v5.

| # | status | evidence |
|---|---|---|
| `A1` | **WAITS for the verdict run** | Not taken. It needs `LADDER_DEEP=verdict` on a tree with `ABC-083`'s merge (decision 6). The report line carries commit, step, seeds, games, wall and load1, and prints MET/RED. Short mode's 10/10 is against the depth-1 floor and is never `A1` |
| `A2` | **WAITS for the verdict run** | Not taken. Early signal ONLY (short mode, step 120, 4 games each): 3v4 2.5/4, 4v5 2.5/4, 2v3 4/4, 1v2 3/4 |
| `A3` | Met in short mode | 26/26 games ended in each of two runs, 0 at the ply cap, 7 by claim. Default rows: threefold claimed at ply 8 (the first offer, not fivefold at 16), fifty-move claimed at the first offer, a capped game is an error with no score |
| `A4` | Met in short mode | 26/26 move lists replay through `legalMoves` / `makeMove` in each run, with no ending before the last ply |
| `A5` | Met in short mode | 1v2 played twice in process gives equal move lists and score. All 5 pair digests are equal across two separate runs. The step rows refuse a per-side step and any un-named step (test note 6) |
| `A6` | Met (harness); the verdict wall waits | Every line names mode, step and games, plus claimed draws per pair. Short-mode counts are constants (10 / 4). Short-mode wall 848 s, **loaded machine, not graded** |

- **Gates at `d5b0f0e2`.** Lint, typecheck and build exit 0. `npm test` is 54 files / 1689 passed / 0 skipped
  (baseline 53 / 1680). Skip integrity reads `No findings.`, and the lane inventory is 54 = 54.
- **Default lane, by count:** 0 ladder games (a pin row), +1 file, +9 rows, 0 spawns. `LADDER_DEEP=1`: run 2
  exits 0, 14/14.
- **Raised, not acted on:**
  - Inside vitest the engine costs ~4.3x per node against plain node (same games, same nodes). The verdict
    estimate of ~10 h is likely **~44 h** in this lane (`…70684a78`). That is routed to Architect/Orchestrator.
  - The `AGENTS.md` lane line is drafted for the Scribe (`…8515e3e7`).
- **The board move (`In Development` → `In Review`) is the Orchestrator's.** This hop was fenced off
  `plans/board.md`.

## QE

**2026-10-11, QE/E2E** (subtask `qe-ABC-085`). Reviewed tip `773b48cc`; the harness is `d5b0f0e2`, with `src` identical. Every reading
is QE's own, from its own worktree and its own single `LADDER_DEEP=1` run. The detail is in `.grugops/context/qe-ABC-085/notes/`:
`…3b1e7c52` (verdict and readings), `…d4a90f16` (mutants), `…6f2c8a91` (gaps), `…9e47d0b3` (commands). Raw files are in `../probe/`.
**Loaded host, no timing grades.** Every deep-lane number is **short mode, step 120**.

**PASS_WITH_GAPS** on `A3`–`A6`. `A1` and `A2` are out of scope and wait for the verdict run.

| # | QE reading |
|---|---|
| `A3` | **MET.** 26/26 games ended and 0 hit the cap (max 135 plies against 600), with 0 crashes and 0 timeouts. Endings: 18 mate, 7 `threefold-repetition (claimed)`, 1 insufficient, 0 fivefold or seventy-five. Default rows: threefold claimed at ply 8, fifty-move at the first offer, and the cap is an error with no score. Mutants M1, M2 and M16 are killed |
| `A4` | **MET.** 26/26 move lists replay through `legalMoves` / `playMove` with 0 faults. The oracle refuses an illegal move and a move played past an ending |
| `A5` | **MET.** In process, the 1v2 pair played twice is equal. Across sessions, QE's run equals the SE's run 2 on all 32 report lines, all 5 pair digests included. The step is literal 120/4 (M15 killed), a per-side or derived step is refused (M3 killed), and each side has its own clock (M8 killed). Budgets verbatim are **unpinned** (M5 survives; `QE-085-b`) |
| `A6` | **MET (harness).** All 32 lines say "short mode, step 120". Every pair line names the step, the games, the seeds, the commit, the claimed draws and "not graded". The claimed counts match the `(claimed)` reasons. The verdict-step wall waits with the verdict run |

- **Default lane, by count:** 0 ladder games, pinned. Re-planted M4 turns the pin red. `npm test` gives 54 files / 1689 / 0 skipped, and
  the ladder file has 9 rows. Unset, the deep rows are not defined.
- **Mutants:** the SE's 4 are re-planted and all killed. QE added 13: 3 are killed and 10 survive the default lane.
- **Gaps** (none fails `A3`–`A6`):
  - `QE-085-a` **MEDIUM**, SE. The verdict report's colour schedule, score, bar and claimed count are unpinned in every lane (M6, M11,
    M12, M14). Fix this before the verdict run.
  - `QE-085-b` **LOW**, SE. `LEVELS` verbatim and the game counts are unpinned (M5, M7, M7b).
  - `QE-085-c` **LOW**, SE. `PLY_CAP` is unpinned (M13).
  - `QE-085-d` **INFO**. M9 is equivalent; M10 is killed by the deep A5 row by construction, not run.
  - `QE-085-e` **INFO**, Scribe. `LADDER_DEEP=` or `=0` fails at load, unlike the other `*_DEEP` lanes. The lane line should say "unset is
    the only off".
- **Gates:** lint, typecheck and build exit 0. Skip integrity reads `No findings.`, and the inventory is 54 = 54. There are 0 production
  `src/` lines, so on QE's reading the UAT waiver applies (WAIVED, not accepted; the Orchestrator applies it).

## QE (2nd pass)

**2026-10-11, QE/E2E** (subtask `qe2-ABC-085`). This pass reviews the fix `f28d91ad`, at tip `dacbf42a`. Every reading is QE's own, from
its own worktree and its own single `LADDER_DEEP=1` run. The detail is in `.grugops/context/qe2-ABC-085/notes/`: `…a2b6e4f0` (verdict),
`…5e81c0a4` (mutants), `…7c3d19e2` (gaps and the `PLY_CAP` ruling) and `…91f0d6b8` (commands). Raw files are in `../probe/`. **Loaded
host, no timing grades.** Every deep-lane number is **short mode, step 120**.

**PASS_WITH_GAPS** on `A3`–`A6`. Only LOW and INFO gaps remain. `QE-085-a`, `-b` and `-c` are closed. `A1` and `A2` wait for the
verdict run.

- **The refactor preserved behaviour.** The run exited 0, 18/18, with the commit `dacbf42a` clean. All 32 report lines and all 5 pair
  digests equal **each** of the three earlier runs, with wall, load1 and commit excluded. The digests are `72f01570a3987247`,
  `302d8b4676cd7299`, `f89bbd75f4a066e9`, `89b8059f53c970df` and `d30b4a153b7c1a9a`. `A3`: 26/26 games ended, 0 at the cap, max 135
  plies. `A4`: 26/26 replays clean.
- **Mutants:** QE re-planted all 16 itself against the refactored file, re-finding the sites of M5, M6, M11 and M14.
  - 14 are killed, and M7b is killed too. All 8 of the SE's named survivors are now killed (M5, M6, M7, M7b, M11, M12, M13, M14).
  - M9 and M10 survive as INFO, as before.
  - Three call-site plants (X6, X13, X14) survive. The pure functions are pinned, but the deep row's hand-off into them is not.
- **Default lane, by count:** 0 ladder games, pinned (M4 turns the pin red). `npm test` gives 54 files / 1693 / 0 skipped, and the
  ladder file has 13 rows.
- **The `PLY_CAP` call-site ruling: LOW, not blocking.**
  - A smaller value turns `A3` red, which is loud.
  - A larger value cannot manufacture a draw (M2 pins cap-as-error).
  - It only hides a game of more than 600 plies (the max seen is 135), so it is equivalent on every run so far.
  - An optional one-line deep-row check `max plies <= PLY_CAP` closes it with 0 games.
- **Gaps** (none fails `A3`–`A6`):
  - `QE2-085-a` **LOW**, SE, optional before the verdict run. The three call-site hand-offs are unpinned: `playPair`'s colours, the
    `runGame` cap, and `summarizePair`'s level.
  - `QE-085-d` **INFO** is carried: M9 is equivalent, and M10 is `UNKNOWN - verify`.
  - `QE-085-e` **INFO**, Scribe, is carried.
- **Gates:** lint, typecheck and build exit 0. Skip integrity reads `No findings.`, and the inventory is 54 = 54. The `src` diff from
  `aee4b8cb` is `src/ladder.test.ts` only, so there are 0 production lines.
