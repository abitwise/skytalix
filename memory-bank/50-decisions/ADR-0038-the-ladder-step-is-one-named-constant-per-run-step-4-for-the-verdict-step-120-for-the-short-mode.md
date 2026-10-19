---
kind: adr
id: ADR-0038
---
# ADR-0038: The self-play ladder's step is one named constant per run, never a level's. Step 4 is the verdict step and step 120 the short mode. A verdict is a claim at a node rate, and it is taken after `ABC-083` merges

## Status

**accepted** 2026-10-10 by Olger Oeselg (owner), verbatim "levels 4 and 5 run as specified, step 4, keep P1,
accept ADR-0038" (note `.grugops/context/wave-2026-09-25/notes/20261010T192920Z-orchestrator-decision-owner-word-six-answers-b7c41e09.md`). Owner menu: question 1 → option (a); question 2 → step 4; question 3 → P1.

**Addendum 2026-10-11: ACCEPTED** 2026-10-11 by Olger Oeselg (owner), verbatim "accepr ADR-0040 and ADR-0038", read as the addendum because ADR-0038 itself was already accepted (note `.grugops/context/wave-2026-09-25/notes/20261011T102346Z-orchestrator-decision-owner-word-accept-adr0040-adr0038-addendum-7089c972.md`). It amends decision 5 only, and only for the verdict
mode. The verdict mode would run the same harness code under plain `node`, outside the vitest runner. Inside
vitest the engine runs about 4.3x slower per node, with the same node count. See § Addendum 2026-10-11 at the
end. Decisions 1–4 and 6, and decision 5 for the short mode and the default lane, stay **accepted** as
written.

**Addendum 2, 2026-10-17 (the last section of this file; it governs over the first addendum for the verdict
mode's runner): the verdict runs inside vitest, as `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`.**
`ABC-146` `A0` read `F_hi` 1.006 ≤ 1.30, so the owner's route rule of 2026-10-12 picks route V. The first
addendum's code move (route N) is not built; it stays the accepted fallback. No owner acceptance is owed: the
addendum records his own pre-registered rule applied to a reading. **The verdict's result is not yet known.**

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

## ADDENDUM 2026-10-11 (ACCEPTED 2026-10-11, § Status; its route is not built, see addendum 2): the verdict mode runs the same harness under plain `node`, not inside vitest. The vitest runner costs ~4.3x per node and plays the same games

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-abc085-verdict-cost`), on the wave tip
`8639effb`. **No timing was taken at this hop.** A QE hop and an Engineer hop were running. Every figure is
the Engineer's recorded reading, or arithmetic on it:
- note `…70684a78` and `.grugops/context/ticket-to-pr-ABC-085/probe/RUN.txt`, on branch
  `grugops/ABC-085-self-play-ladder`;
- this hop's notes `…2566e813` (the ruling) and `…5d70d79e` (the arithmetic).

### Context: what the Engineer read

- **The same games, at a different wall.** The vitest harness's 3v4 row and this ADR's own plain-`node` probe
  played **the same four step-120 games**: the same plies, 123/122/119/115, and the same endings.
  - The probe took 11.7–12.2 s a game.
  - The harness took 57.3–62.0 s a game, back to back at load1 ~2.8.
- **Isolated:** `chooseMove(start, 4 000 ms, virtualClock(120))` ×5 searched **145 765 nodes every time**,
  under either runner.
  - Plain `node`: 782 / 791 ms, which is **5.5 ms per 1 024 nodes**.
  - vitest `threads`: 3 473 / 3 379 ms. vitest `forks`: 3 344 / 3 490 ms. That is 23.5–24.5 ms per 1 024 nodes.
  - **The ratio is 4.23–4.46x (mean 4.35x).** It does not depend on the pool. Its cause is `UNKNOWN - verify`.
    The Engineer's guess is the module transform's import indirection in the hot path, which is not shown.
- **Cost.** § Consequences priced the verdict at ~10 h (7–13). That figure used 3.5–6.5 ms per reading, which
  is plain-`node` probe data. **Two routes give the same in-vitest figure:**
  - this ADR's ~10 h × 4.35 = **~43.5 h** (band 30–58 h);
  - the Engineer's in-vitest step-120 walls × 30 (120 ÷ 4) = **43.5 h**. Plies at step 4 are
    `UNKNOWN - verify`.

  **So the verdict costs ~10 h under plain `node` and ~44 h inside vitest, for identical games.**

### What a virtual-clock verdict depends on, and what it does not

- The games depend on node counts only (decision 4; `A5`). The runner changes the wall and nothing else. The
  Engineer read equal node counts under both runners, and the four games above were equal.
- **The Rollback band of 2–8 ms per reading is read under plain `node`.** That is the runner the engine ships
  on (`npm run chess` is `node src/cli.ts`), and step 4's "about real time" was calibrated against it.
  - The vitest figure, ~24 ms per 1 024 nodes, is a reading of the test runner. It is not a reading of real
    play, and **it does not trigger the Rollback**.
  - The plain-`node` 5.5 ms is inside the band. **Step 4 stands.**

### Decision 5, amended (ACCEPTED 2026-10-11; not built, see addendum 2). Only the verdict mode moves

1. **The verdict mode runs under plain `node`, from a tool outside `src/`.** The shape is `ADR-0037` D1(g)'s
   precedent (`tools/opening-book/compile.ts`): it imports `src/` read-only, runs on demand, and is not
   production code (`ADR-0011` clause 1 covers `.ts` under `src/` only).
   - **One game loop, not two.** The harness's non-vitest code moves verbatim into a module under
     `tools/ladder/`: the step constants, `stepForMode`, the sides, the game loop, the claim policy, the cap,
     the scorer, the `A4` replay, the digests and the report lines.
     - `src/ladder.test.ts` imports it. It keeps every default row and `LADDER_DEEP=1`.
     - A small entry, run as `node tools/ladder/<entry>.ts verdict` (the Engineer names it), runs the
       verdict plan. It takes `1` too, for the equivalence check in item 2.
     - `tsconfig.json` `include` and `biome.json` `files.includes` gain `tools/ladder/**/*.ts`, as `ADR-0037`
       did.
   - **There is one verdict route.** Under vitest, `LADDER_DEEP=verdict` is refused at load, and the message
     names the `node` command. A 44-hour route that nobody should take is not left open.
   - The step, the game counts, the seeds, the claim policy, `-t`-style single-pair re-runs, and the rule
     that `A1`/`A2` are printed and never asserted are all unchanged. `A3` and `A4` failures exit non-zero.
2. **Equivalence is pre-registered. It is a check on counts and digests, never on a timing.** On one commit,
   before any verdict is quoted:
   - run `LADDER_DEEP=1 npx vitest run src/ladder.test.ts` and the `node` entry with `1`;
   - they must print **the same five pair digests, the same `A5` digest, and the same plies and ending for
     every game**. The digests recorded at `d5b0f0e2` are `72f01570a3987247`, `302d8b4676cd7299`,
     `f89bbd75f4a066e9`, `89b8059f53c970df` and `d30b4a153b7c1a9a`. They hold only while the engine path is
     unchanged.
   - **If any differs, the `node` route is not the same harness.** The verdict then stays in vitest (~44 h),
     and the difference goes to the owner.
3. **The report adds one field: the runner and its version** (`node v…`). The commit, step, seeds, game count,
   wall time and load1 stay as before. A wall time from one runner is never compared with one from the other.
4. **Scheduling, the Orchestrator's (unchanged in kind).** The verdict is one process, serial, in the
   background, once per verdict.
   - **It never overlaps a no-other-hop window.** That covers `ABC-144` Window B and any `ADR-0035` reading.
     A run holding one core for ~10 h is another hop by that definition.
   - **The pairs never run as parallel processes** (Alternatives (b)).

### Alternatives (this addendum)

| option | ruling | why |
|---|---|---|
| **(a) accept ~44 h inside vitest** | **rejected as the plan; kept as the fallback** if item 2's check fails | identical games at ~4.35x the CPU, about 33 extra core-hours per verdict, and again at every re-take after a staleness merge (decision 6). It holds one core of a fanless Air for ~2 days, with no quiet window possible meanwhile. It runs against the owner's "reduce cpu usage" (`ABC-144`) |
| **(b) the pairs as parallel processes** | **rejected**, under either runner | CPU-hours stay the same (~43.5 h in vitest). Up to 5 cores are held at once. The wall floor is still the single `A1` `it`, 1v5 at ~18.7 h in vitest. `ADR-0040`'s cap is per process and cannot see it. Window A read the M3 reach moderate thermal pressure after ~6 min of lane runs. A once-per-verdict background run has no wall requirement to buy |
| **(c) the same harness outside vitest** | **RECOMMENDED** (items 1–4) | the same games and ~10 h (7–13), the cost this ADR was accepted at. The build is `XS` |
| (c′) the `node` entry under `src/` | rejected | it becomes a production module (`ADR-0011` cl. 1). It adds a `process.` holder to `ADR-0036`'s capability surface. Decision 5 says it needs the owner's UAT word |
| (c″) a shim that runs `src/ladder.test.ts` itself under `node` (stubbing `vitest`) | rejected | one file with two meanings. Clever, not boring |
| (d) find and remove the vitest overhead | not a dependency of the verdict | the cause is `UNKNOWN - verify`. It may matter to the default lane's CPU, so it is routed to BA/PM (note `…be323233`), not ruled here |
| (e) a coarser verdict step (10) | not offered again | the step is the owner's, and he chose 4. Under `node`, step 4 costs what he accepted |

### Consequences (this addendum)

| route, step 4 | full run | `A1` (1v5, 100 games) | 3v4 + 4v5 first (test note 5) |
|---|---:|---:|---:|
| plain `node` (recommended) | **~10 h** (7–13) | ~4.3 h | ~4.6 h |
| inside vitest | ~43.5 h (30–58) | ~18.7 h | ~20.0 h |

- The per-pair split is the Engineer's ×30 route, divided by 4.35 for `node`. It is an estimate, not a
  reading.
- **`NFR-008`, the default lane:** unchanged. The default lane still plays 0 games. `src/ladder.test.ts`
  stays 1 file. `tools/ladder/` adds no test file unless the Engineer chooses one, and then it is +1, by
  count.
- **`ABC-144` `A6`** reads `LADDER_DEEP=1` only. The verdict mode is not an opt-in vitest lane after this
  amendment, and it was never one of `A6`'s runs.
- **Where it is built.** `ABC-085` is In Review on its harness `d5b0f0e2`, and the verdict cannot run before
  `ABC-083` merges (decision 6; `ABC-083` is `Blocked`). So nothing is lost by building this in the
  **pre-registered split ticket** (`ABC-085` § Dependencies: the `A1`/`A2` verdict run as its own `XS`), not
  as a repair to the build under review. The Orchestrator and BA/PM choose. The design is the same either
  way.
- The `AGENTS.md` lane line drafted in `…8515e3e7` ("~10 h estimated, likely ~44 h in vitest") stays
  accurate until this is accepted and built. The Scribe then writes the `node` command.

### Rollback (this addendum)

Delete `tools/ladder/`'s entry, and let `src/ladder.test.ts` define `LADDER_DEEP=verdict` again. The core
module can stay where it is, because nothing in `src/` production depends on it. The verdict then costs
~44 h again.

## ADDENDUM 2, 2026-10-17: the verdict runs inside vitest (route V). `A0` read the factor at about 1, so the first addendum's code move is not built

Written by Architect/Design (task `wave-2026-09-25`, subtask `arch-ABC-146-a7`, `ABC-146` `A7`), on branch
`grugops/ABC-146-ladder-verdict` at `c639a220`. **No test, timing or build was run at this hop.** A verdict run
was in progress in the same worktree. Every figure below is Security/NFR's recorded reading:
- the pre-registration `.grugops/context/secnfr-ABC-146-a0/notes/…107ff1bf` (commit `1e2cae9f`, before the
  first graded run);
- the reading `.grugops/context/secnfr-ABC-146-a0/notes/…f1558f02` (commit `c639a220`).

### Context: why the first addendum's premise is gone

- The first addendum moved the verdict out of vitest because the engine cost **~4.35x per node** there
  (`…70684a78`). `ADR-0041` names vite's module runner as the cause. `ABC-152` turned that runner off
  (`vitest.config.ts` `experimental.viteModuleRunner: false`, merged `7a920ca5`).
- **The owner's word, 2026-10-12** ("Re-measure, then vitest", transcription `…19019ec0`, not a stamp): take
  one paired re-reading of the factor first. If the run inside vitest fits the accepted 7–13 h band, the
  verdict runs there with no new code. Otherwise it falls back to plain `node`, as accepted. `ABC-146` `A0`
  fixed the rule: **route V iff `F_hi` ≤ 1.30** (10 h × `F_hi` ≤ 13 h). The worst of the five pairs decides,
  which is the owner's reading as relayed in `…107ff1bf`.
- **`A0`'s reading (`…f1558f02`, at `c639a220`).** The workload was `chooseMove(start, 4 000 ms,
  virtualClock(120))`, run as 5 interleaved pairs, one call per fresh process, at width 1. The vitest arm
  used the repository's own `vitest.config.ts`, unedited.
  - **10 of 10 node counts were equal: 29 717.** The result digest `398995d95a12e6e6` was the same on all 10.
  - The pair ratios (vitest ÷ node) were 0.920, 0.946, 1.006, 1.004 and 0.954. **The median `F` is 0.954 and
    `F_hi` is 1.006.**
  - node v26.11.1, vitest 4.1.11. load1 4.92–5.01, thermal level 0, on battery. These were recorded, not
    gated.
  - **`F_hi` 1.006 ≤ 1.30, so the route is V.** The in-vitest projection is 10 h × 1.006 ≈ 10.1 h. That is
    arithmetic on `A0`, not a reading of any verdict run.
  - `A0`'s own limit: the call is short (~190–206 ms), so the pair spread is mostly noise. The rule's
    margin of 0.29 is far wider than that spread.

### Decision 5, amended again. Only the verdict mode's runner moves back

1. **The verdict runs inside vitest, as `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts`.** It is run
   directly and **never through `npm test`**: that script's 60 s bound (`ABC-122`, `run-bounded.js`) would
   end it. This is the harness as `ABC-085` built it. `src/ladder.test.ts` already accepts
   `LADDER_DEEP=verdict` (`stepForMode`) and plays `ladderPlan`'s order, 3v4 and 4v5 first.
   - **Noted 2026-10-19 (`arch-ABC-166-a5`, records only, no decision changes):** run it with
     `--reporter=verbose`, as `LADDER_DEEP=verdict npx vitest run src/ladder.test.ts --reporter=verbose`.
     vitest 4.1.11's default reporter drops a passing test's `console.log`, so run 1 (`d73c4d6c`) passed
     17/17 with no `LADDER` line and no score (`…75f37904`). The flag changes output only, so the same games
     are played. A re-take under the staleness rule uses this form.
   - **Executed 2026-10-19:** run 2 used this form and is the route's reading (`ABC-146` `A5`,
     `.grugops/context/abc146-verdict/notes/…4c1d8e27`, commit `e68a4327`).
2. **Route N's code move is not built.** The first addendum's item 1 (the move to `tools/ladder/`, the `node`
   entry, the two include globs and the refusal of `LADDER_DEEP=verdict` under vitest) is not built. Its
   item 2 (the equivalence check between runners) is moot, because only one runner plays the games.
   `ABC-146` `A1`–`A4` are cancelled on this route (the ticket's route table). **Zero lines change under
   `src/`, `tools/`, `vitest.config.ts` and `package*.json`.**
3. **The report names the runner and its version.** The first addendum's item 3 stands. On this route the
   runner is vitest, and the versions are read with `npx vitest --version` and `node --version`. The report
   also names the commit, the step (4), the seeds, the game counts, the wall time and load1. A wall time from
   one runner is never compared with one from the other.
4. **Scheduling stands unchanged** (the first addendum's item 4). The verdict is one serial background
   process, on the Orchestrator's schedule, once per verdict. It never overlaps a no-other-hop window, and
   the pairs never run as parallel processes. `ADR-0040`'s worker cap (`maxWorkers: 2`) applies, because the
   run is inside vitest.
5. **Unchanged:** decisions 1–4 and 6, step 4, the game counts (100 for `A1` and 20 for each `A2` pair: 180
   games), the seeds, the claim policy, the ply cap, and the rule that `A1`/`A2` are printed and never
   asserted. A verdict at one step is never quoted as a verdict at another (decision 4).

**What this addendum does not say.** **The verdict's result is not yet known.** No score, MET, RED or wall
time of the verdict run is quoted here or anywhere in this ADR. Those numbers belong to the verdict's report,
and to `ABC-146` `A5`.

### Alternatives (this addendum)

| option | ruling | why |
|---|---|---|
| **(V) the verdict inside vitest, no new code** | **chosen** | the owner's rule, applied to `A0`: `F_hi` 1.006 ≤ 1.30 |
| (N) build the first addendum's route anyway | not built; kept as the fallback | at a factor of about 1, the move, the entry, the globs and the refusal buy no core-hours. Building them would be work that the reading shows has no payoff |
| reading the rule on the median `F` (0.954) | not needed | either statistic picks V. The rule was fixed on `F_hi` before the run, and it is read on `F_hi` |

### Consequences (this addendum)

- **`ABC-146`'s route table applies, route V.** `A5` and `A6` stand, with this command. `A6` on this route:
  `git diff --name-only <base> -- src/ tools/ vitest.config.ts package.json` is empty. `A7` is this
  addendum together with the two headings above, which no longer say PROPOSED.
- **The first addendum's cost table is history.** Its "inside vitest ~43.5 h" row was priced on the 4.35x
  factor, which `A0` no longer reads.
- **`NFR-008`, the default lane:** unchanged. The default lane plays 0 ladder games, and no file is added.
- **`AGENTS.md`'s ladder lane comment** still says the verdict is not run in vitest (~44 h) and that its route
  is plain `node`. That is now stale. The Scribe rewrites it; this hop does not edit `AGENTS.md` (`ABC-146` §
  Out of scope).
- **`A0` goes stale before the verdict starts** if a merge changes `vitest.config.ts`, the node or vitest
  version, or `PUZZLE_DEEP`'s engine trigger list (the ticket's staleness rule). The verdict itself goes
  stale under decision 6.

### Rollback (this addendum)

- **If the vitest run exits non-zero before 180 of 180 games terminate and replay legally** (a crash, not a
  red score), no score is quoted from it. The owner's word does not cover that case. The Orchestrator takes it
  to the owner, with route N, the first addendum as accepted, named as the next step.
- **If `A0` is re-taken and reads `F_hi` > 1.30**, route N applies, and the first addendum is built as
  written.
- Nothing in code depends on this addendum. Reverting it changes records only.
