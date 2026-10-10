---
kind: adr
id: ADR-0038
---
# ADR-0038: The self-play ladder's step is one named constant per run, never a level's. Step 4 is the verdict step and step 120 the short mode. A verdict is a claim at a node rate, and it is taken after `ABC-083` merges

## Status

**accepted** 2026-10-10 by Olger Oeselg (owner), verbatim "levels 4 and 5 run as specified, step 4, keep P1,
accept ADR-0038" (note `.grugops/context/wave-2026-09-25/notes/20261010T192920Z-orchestrator-decision-owner-word-six-answers-b7c41e09.md`). Owner menu: question 1 → option (a); question 2 → step 4; question 3 → P1.

Previously **proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-085`, Workflow 02
In Design hop and Workflow 07). It is D4, owed to `ABC-085`'s DoR item 4 by BA/PM's re-score
(`20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324`).

- **Decisions 1, 2, 4, 5 and 6 are this role's.** They cover what the step is, what a verdict claims, the
  lane, and when the verdict is taken. They take effect when this ADR is accepted.
- **Decision 3's verdict step is a recommendation.** The owner answers question 2 (cost against fidelity).
  He may move the verdict step to any step that decision 3 admits, and to nothing coarser.
- It builds on `ADR-0027` (the virtual clock; decision 6, "the step is the dial") and amends nothing.
- No code changes because of this ADR. `ABC-085` builds against it once BA/PM folds it.
- The readings are in `.grugops/context/design-ABC-085/notes/` and the probe in `../probe/`. They are
  cited here, not restated in full.

## Context

`ABC-085` plays levels against each other on `ABC-086`'s virtual clock (`A5`). `A1` and `A6` say "the
default budget", but no ruling names the step. BA/PM's probe showed that the step changes the answer.

**What a virtual budget is.** Inside the search the clock is read once per `NODES_PER_CLOCK_CHECK` (1 024)
nodes (`src/engine.ts:139`, `:204-212`). It is also read at entry, at each iteration boundary and at
return. So a level with budget `b` at step `s` gets about `b ÷ s` readings, which is about
`1 024 · b ÷ s` nodes. An aborted iteration is discarded, and the TT is cleared per search (`ADR-0025`).
So two rate-0 levels that complete the same depth play the same move.

**Measured at this hop** (tip `489c549e`). The engine path is byte-identical to BA/PM's `aaa88263`.
Only `src/fen.ts` moved (`ABC-010`), and the corpus still parses.

- **The premise holds.** BA/PM's own script, re-run unmodified, reads the same counts. At step 120: 3v4
  differs on 9/50 moves and 4v5 on 2/50. At step 30: 2/50 and 0/50. The depth counts are identical too.
  Steps 10 and 4 were not re-run: step 4 took ~13.5 min, which is over this hop's 10-minute fence.
- **The step and the budget are one dial.** Budget 3 000 at step 120, 750 at step 30 and 300 at step 12
  give the same move, depth AND node count on 50 of 50 positions. Only `b ÷ s` matters, up to
  `HARD_CEILING_MS`. The step is not clamped, and a budget above 5 000 is.
- **A coarse step pins the bottom of the ladder to the engine's floor.** Depth 1 is unabortable
  (`src/engine.ts` `deepen`). Level 1's 100 ms:

| step | readings | level 1 median depth | positions at depth 1 | level 2 (500 ms) median depth |
|---:|---:|---:|---:|---:|
| 120 | 1 | 1 | **50 / 50** | 3 |
| 30 | 4 | 2 | 6 / 50 | 4 |
| 10 | 10 | 3 | 0 / 50 | 5 |
| 4 | 25 | 5 | 0 / 50 | 6 |

  At step 120, level 1's budget buys nothing that level "0 ms" would not. A step-120 `A1` score is a
  score against the floor, not against level 1.
- **Real cost per reading.** The real cost per reading is 3.5–6.5 ms at this hop (load1 2–65), against
  BA/PM's 3.6–5.8 ms. On the reference stack (`ADR-0035` decision 5: Apple M3, Node v26.11.0), real
  play gets roughly one reading per 3.5–6.5 real ms. **So step 4 is about real time there**: 256 nodes
  per virtual ms, against the 158–293 nodes per real ms measured.
- **Real games at step 120, 4 per pair.** These are cost readings, not a verdict:
  - 5v1: 34–45 plies, 3.1–4.1 s each, score 3.5/4.
  - 4v3: 115–123 plies, ~13 s each, 2.5/4.
  - 5v4: 67–113 plies, 10.5–16.5 s each, 2.5/4.
  - 6 of 12 games ended by a threefold claim. The engine is history-blind (`createLevel` takes a
    position), so the stronger side cannot step out of a repetition. That is the shipped engine's
    behaviour, and the ladder measures it.
  - **At step 30, 5v4, 4 games:** seed 1 played the **identical 90-ply game from both chairs**, a
    threefold draw each way. Seed 2's two games differed, and white won both. The score was 2/4,
    **exactly 50 %**, at 57–82 s a game. This is the BA/PM mechanism at game level. It is still 4 games,
    not `A2`'s verdict.

## Decision

1. **The step is a property of the RUN, never of a level.**
   - Both sides of every game in a run use one step. Each side has its own `virtualClock(step)` instance
     (`A5`, `ADR-0027` decision 4).
   - **Every level is played at its `LEVELS` budget, verbatim.** The harness never scales a budget. A
     "reduced budget" (`A6`, Scope) IS a coarser step: measured, `(b, s)` and `(b/k, s/k)` are the same
     search.
   - **A per-level step is refused.** `budget ÷ step` is the level's strength, so a per-level step is a
     re-tuned level. That is "tuning the levels to make the number pass", which is out of scope. It would
     also model two machines of different speed playing each other, which no player meets.
   - `ABC-125`'s row (two live clocks at two steps) stays as a guard against a module-level step. It is
     not a licence for one.
2. **Each step is a named constant in the harness. It is never computed from a timing at run time.** A
   step calibrated per host or per load would play different games on different machines, which breaks
   `A5`.
3. **Two steps, each with one meaning.**
   - **The short step is 120.** It runs routinely and is cheap. **What it can claim:** `A3`, `A4` and
     `A5`. Termination, legal replay and reproducibility do not depend on the step. It also gives an
     early `A2` signal on the 3v4 and 4v5 pairs. **What it cannot claim:** any `A1` or `A2` verdict,
     because level 1 sits on the depth-1 floor on 50 of 50 positions. Every number it produces is
     labelled "short mode, step 120" (`A6`, test note 4).
   - **The verdict step is 4. This is RECOMMENDED; the owner's answer to question 2 decides it.** It is
     the only measured step at which a virtual budget buys about what the same real budget buys on the
     reference stack. `A1`'s and `A2`'s verdicts are taken here.
   - **Admission rule for any verdict step:** the easiest level's budget must buy at least 10 readings,
     so that `s ≤ LEVELS[1].budgetMs ÷ 10` = **10** today. At step 10 no level sits at depth 1 (0/50).
     At step 30, 6/50 do. **So the owner may choose a verdict step from 4 to 10. Steps 30 and 120 are
     not verdict steps.** The rule is re-read if `LEVELS[1]` changes.
4. **What a virtual-clock verdict claims, and what it does not.**
   - **It claims:** at a named commit, the shipped engine with the shipped `LEVELS` table scored X. The
     engine was given `1 024 ÷ s` nodes per budget millisecond, from the harness's seeded openings, with
     no book (`ADR-0012`). **At step 4, that is a player's ladder on the reference stack, without the
     clock's noise.**
   - **It does not claim any real-clock time or depth.** `ADR-0027` stands: "a virtual millisecond is
     not a real one". Step 4 borrows a real meaning only through the calibration above. `NFR-004` and
     `NFR-005` stay on the wall clock.
   - **It does not claim the order on a machine with a very different node rate.** The budget ratios do
     not depend on the rate. But where a ratio crosses a ply boundary does depend on it. A verdict at one
     step is evidence about other machines, not proof.
   - **It does not claim real-clock jitter.** On a wall clock, two rate-0 levels that tie here may differ
     move to move by timing noise. That noise is not strength, and the verdict excludes it by
     construction.
   - **It does not claim an Elo,** and it does not claim play through the book.
   - **A verdict at one step is never quoted as a verdict at another.**
   - **The step cannot repair 3v4 or 4v5.** It scales every level together and leaves the 1.33x and
     1.125x ratios alone. Measured: 4v5 differs on 2/50 moves at step 120 and on 0/50 at 30, 10 and 4.
     **So question 1 (the levels) cannot be traded against question 2 (the step).**
5. **The lane is `LADDER_DEEP`, opt-in, in the `*_DEEP` shape.**
   - **`LADDER_DEEP=1`** is the short mode, at step 120.
   - **`LADDER_DEEP=verdict`** is the verdict mode, at the verdict step. `PUZZLE_DEEP=weakened` is the
     precedent for a value-mode.
   - **When unset, the rows are NOT DEFINED, not skipped,** so the gate's skip count stays 0.
   - **One `it` per pair,** so that `-t "<pair>"` re-runs one pair. Because of `A5`, the re-run
     reproduces the pair. No new knob is added.
   - **The default lane plays no game.** That is pinned by a count: 0 games, and +1 file at
     `ADR-0035` decision 2's per-file floor. It is never pinned by a wall bound.
   - **The file is a test file** (the suggestion is `src/ladder.test.ts`; the Engineer names it). The
     diff then carries zero production lines. A non-test harness module would need the owner's UAT word.
   - **`LADDER_DEEP` is not a gate, not a `quality.mandatory_gates` entry, and not a per-ticket QE
     trigger.** `PUZZLE_DEEP` already guards engine changes. `ADR-0035` decision 5's
     `grep -rhoE 'process\.env\.[A-Z_]+_DEEP' src` adds it to `NFR-008`'s Applies-to list by itself.
   - **The verdict run is machine time.** It runs once per verdict, in the background, on the
     Orchestrator's schedule. **Its report names the commit, the step, the seeds, the game count, the
     wall time and load1.**
6. **The verdict is taken on a tree that contains `ABC-083`'s merge. The build does not wait.**
   - `ABC-083` changes the evaluation every level uses (king safety, and mobility if `ADR-0031` keeps it).
     A verdict taken before it merges is a verdict on an engine that will not ship.
   - There is no file overlap, so the harness can be built and its short mode run before `ABC-083`.
   - **Generally, a verdict is STALE after any merge that touches `PUZZLE_DEEP`'s engine trigger list,
     `src/levels.ts` or `src/virtual-clock.ts`.** Re-taking it is the Orchestrator's to schedule. It is
     not a gate on that merge.

## Alternatives

- **One step for everything (120, or 4).** Rejected.
  - At 120 there is no verdict: level 1 is on the floor.
  - At 4 there is no routine run: about 10 machine-hours.
  - The ticket's `A6` already asks for a short mode and a full mode.
- **A step calibrated at run time** (measure ms per reading, then set the step). Rejected by decision 2,
  because it breaks `A5`.
- **Scale the budgets instead of the step.** Rejected. It is the same search below the ceiling, and a
  different one above it (a budget is clamped at 5 000 and the step is not). It also makes "the level"
  mean two things in one table.
- **A per-level step to separate 4 and 5.** Rejected by decision 1: it is a re-tuned level.
- **Reuse `ENGINE_DEEP`.** Rejected. That lane is ~5 min after any engine change, and the verdict is hours.
- **A short mode in the default lane.** Rejected. Any game costs seconds, and `ADR-0035` decision 3
  refuses a per-ticket wall bound that the instrument cannot resolve.

## Consequences

- **BA/PM folds `A1`, `A2`, `A5`, `A6`, Scope, the `N8-LANE` paragraph and DoR items 4 and 10** (list in
  the decision note). Item 4 ⚠️ → ✅ when folded.
- **Cost, estimated and labelled.** The formula is plies ÷ 2 × (budget A + budget B) ÷ step × 3.5–6.5 ms.
  Plies are measured at step 120 for 5v1, 4v3 and 5v4, and assumed to be 60 for 1v2 and 2v3. Plies at
  step 4 are `UNKNOWN - verify`. The full run is `A1` at 100 games plus `A2` at 20 games per pair:

| step | full run | `A1` alone | the 3v4 + 4v5 pairs |
|---:|---:|---:|---:|
| 4 | ~10 h (7–13) | ~3.3 h | ~5.8 h |
| 10 | ~4 h (3–5) | ~1.3 h | ~2.3 h |
| 120 | ~20 min (14–26) | ~7 min | ~12 min |

- **`NFR-004` and `NFR-005`: not triggered.** No search path changes. **`NFR-008`:** +1 default-lane file,
  charged by count. The catalog is not opened.
- **The threefold claim policy changes cost, not score, for a deterministic pair.** A history-blind pair
  that repeats once repeats until fivefold. That policy is BA/PM's to fold into `A3`, not this ADR's.

## Rollback

- **The verdict step is data.** Re-derive it if the reference stack is re-declared (`ADR-0035` decision 5),
  or if a reading puts real ms per reading outside 2–8 ms. Either one puts step 4 more than 2x off
  parity. A verdict already taken keeps its step and its claim.
- **The admission rule** is re-read whenever `LEVELS[1]` changes.
- **Decision 1** reopens only if a level is redefined as something other than a budget plus a rate.
- Nothing in code depends on this ADR beyond two constants and one environment variable in a test file.
