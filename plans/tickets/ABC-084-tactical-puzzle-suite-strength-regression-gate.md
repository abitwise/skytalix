---
id: ABC-084
title: Tactical puzzle suite as a strength regression gate
status: ready
column: Ready
size: M
priority: P0
epic: EPIC-004
feature: —
---

# ABC-084 — the epic's own test note, built: a commit that drops the solve count fails

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). This ticket is
> `EPIC-004`'s `## Test notes` section made real — *"Tactical puzzle suite (mate-in-N and
> win-material positions) as a strength regression gate; a commit that drops puzzle-solve count
> fails the gate"* — and it is half of `RISK-003`'s mitigation.
>
> **Folded 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `fold-abc084-gate-b`, Workflow
> 07), against the wave tip `dfda6ba` (`ABC-076`…`ABC-082`, `ABC-086`, `ABC-121`, `ABC-122` all
> merged). Four changes:
> - **The trigger is ruled — option B.** The owner's words are quoted under `## The trigger`.
>   It is now a scope item and criterion `A8`.
> - **`A4` is re-pointed to `ADR-0027` deterministic mode.** The page said "same seed", and the
>   seed now belongs to `ABC-087`. `A5`'s 60 s is sized in that mode.
> - **The dependencies are met.** The do-not-hang corpus exists (`ABC-079`, with one pair re-found
>   at `ABC-082` under `ADR-0028`), and this ticket extends it.
> - **DoR 10/10. Ready.**
>
> Measurements and the probe are in `.grugops/context/fold-abc084-gate-b/`.

## Problem

*User*: everyone downstream of a strength regression, which is invisible without an instrument.

*Pain*: `RISK-003` states it — **strength is hard to verify without a reference opponent**, and
`plans/nfr-catalog.md` records it as *"untouched and remains open"*. Every ticket in this epic that
claims a strength improvement (`ABC-079`, `ABC-080`, `ABC-082`, `ABC-083`) currently has **no
instrument to claim it against**. Worse, a refactor that quietly makes the engine weaker passes
every test this project has.

*Value*: it is the only cheap, deterministic, fast strength signal available, and it directly
implements **two of the epic's five acceptance criteria** (mate-in-2 found; hanging piece not
played).

## The trigger (owner's ruling, option B)

Owner (Olger Oeselg), 2026-10-09, verbatim: *"accept ABC-086, go with B for ABC-084"* (note
`.grugops/context/wave-2026-09-25/notes/20261009T205550Z-orchestrator-decision-b61e0d35.md`).
Option B, as it was put to him: *"QE, during review, when the change touches engine code
(`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`,
move ordering). A red result means QE fails the ticket."*

The note also records what came with it, as stated to the owner: *"the baseline moves only in its
own commit with a stated reason, never with an engine change; raising it is QE's, lowering it needs
the owner's word (the `ADR-0028` pattern). NOT option A: `quality.mandatory_gates` is unchanged."*

How this page reads that ruling. Nothing is widened or narrowed.
- **Move ordering is `orderMoves` in `src/search.ts`**, so the `src/search*.ts` glob already
  covers it.
- **The globs are read literally.** A test-only change inside them (`src/search.test.ts`, for
  example) triggers a run as well. One run is ≤ 60 s (`A5`).
- **The trigger line in `AGENTS.md` lands with this build, written by the AGENTS.md Scribe.** The
  lane has to exist before the line can name its command (`A8`). QE's role text is kit and is not
  edited.

## Scope

- A curated suite of **≥ 40** positions in two classes, each with its known correct move(s):
  - **mate-in-N** (N ≤ 3), **≥ 10** of them — the epic's third acceptance criterion (`A1`).
  - **win-material / do-not-hang**, **≥ 20** of them — the epic's fourth criterion (`A2`). This
    class **extends the shared corpus and does not fork it**:
    - `ABC-079`'s 24-row `HANGING_CORPUS` (`src/quiescence.test.ts:196`, with the pair re-found
      under `ADR-0028` decision 2) moves into **one importable non-test data module**. That
      follows the shape of `src/search.mate-corpus.ts`; the name is the Engineer's.
    - The 24 rows move **byte-identical**, and `src/quiescence.test.ts` imports them from there.
    - The suite's additions go into the same list, each tagged with its source.
    - **`ABC-079` `A1` keeps reading exactly its 24 rows.** Its levels scale with the corpus
      size (`floor(n/20)`), so a bigger input would re-level it, and under `ADR-0028` decision 5
      a level moves only by ruling.
  - **≥ 6 win-material rows**, where a named move wins material: a fork, a pin, a skewer or a
    discovered attack. The 24 shared rows are all one theme, "capture a defended piece with a more
    valuable one" (`ABC-079` QE G3: *"extending it is `ABC-084`'s work"*).
- A runner that reports **solved / total** and the per-puzzle result.
  - It runs **the shipped engine in `ADR-0027` deterministic mode**:
    `chooseMove`/`createEngine({ budgetMs, now: virtualClock(step) })` from
    `src/virtual-clock.ts`.
  - It builds **a fresh clock for every move**.
  - Solved means: for mate and win-material, the chosen move is one of the accepted moves; for
    do-not-hang, the chosen move is not the losing move.
- **An opt-in lane** in the `PERFT_DEEP` shape (`*_DEEP=1 npx vitest run <file>`; the variable's
  name is the Engineer's). It is not in the default `npm test` lane.
- **A recorded baseline**, checked in, that every later run is compared against (`A7`).
- **The gate rule**: a run whose solved count is **below the recorded baseline** fails.
- **The trigger (option B)**, written down where QE reads it (`A8`).

## Out of scope

- **The self-play ladder** — `ABC-085`. Different instrument, different question (relative strength
  vs regression detection), radically different cost.
- **Absolute Elo.** `UNKNOWN - verify` until measured against a rated reference, per the epic. This
  suite does **not** produce an Elo number and must not be quoted as one.
- **Adding puzzles to raise the number.** The baseline moves only with a stated reason (`A7`).
- **`quality.mandatory_gates` — ruled out by the owner** (option B, not option A). The key stays
  `["lint","typecheck","unit","build"]`.
- **Any production door to weaken the engine.** `A3`'s constant evaluator is reached without a new
  export, a new `EngineOptions` field or a new door (`ADR-0027` decision 3, `ADR-0024` decision 7).
  A vitest module mock of `src/evaluate.ts` reaches it with zero `src/` lines (probe).
- **Editing QE's role text.** It is kit.

## Acceptance (Given/When/Then)

- **`A1` (mate-in-2 is found — the epic's criterion).** **Given** a position with a forced mate in
  2, **when** the suite's runner searches it, **then** it finds the mate. Asserted over **≥ 10**
  mate-in-2 positions: **10/10**.
- **`A2` (the hanging piece is not played — the epic's criterion).** **Given** a position where a
  piece hangs to a simple one-move tactic, **when** the suite's runner searches it, **then** it does
  not play the losing move. Asserted over **≥ 20** positions: **≥ 19/20**. *Reading at `dfda6ba`
  (probe): the shared 24 rows read **0/24 losing** at 25, 100 and 200 virtual readings per move.
  The bar is met today on the shared rows, and that is why the scope adds rows of other themes.*
- **How `A1` and `A2` read the epic's *"at default strength"*.** It means the shipped engine with no
  door, at the suite's recorded budget and step. It does not mean `DEFAULT_BUDGET_MS`'s 3 wall
  seconds, because `A5` requires a reduced budget. A pass at a few hundred virtual readings per
  move is the suite's claim, and it is not quoted as a claim at 3 s. This is BA/PM's reading, and
  the earlier "verbatim" tag on both criteria is dropped because of it.
- **`A3` (the gate actually fails).** **Given** a deliberately weakened engine — evaluation returning
  a constant, reached without a production door — **when** the suite runs, **then** it reports a
  **lower** solved count than the baseline and **exits non-zero**. *(A gate nobody has seen go red is
  not a gate. This criterion is the whole point of the ticket.)* This arm runs in **≤ 60 s wall**
  on its own.
- **`A4` (it is deterministic).** **Given** the suite's configuration — the shipped engine in
  `ADR-0027` deterministic mode, a **fresh** `virtualClock(step)` for every move, and the budget and
  step that the baseline file records — **when** the suite runs **three** times **in three separate
  processes**, **then** the solved count and every per-puzzle chosen move are **identical** all three
  times. **And** the runner refuses, before any search and with a non-zero exit, any step below
  **`budgetMs / 1 000`** (that is, more than 1 000 virtual readings per move). This is the lower
  bound QE asked for in `ABC-086` G-QE-2: `virtualClock(0.001)` costs about 14 s per move at
  budget 2, and a step below about `1e-16 × budget` freezes the clock.
- **`A5` (it is fast enough to be run).** **Then** the gating run (every puzzle once, shipped
  evaluator) completes in **≤ 60 s wall** at the recorded budget and step.
  - In deterministic mode the cost is about **1 020 × budget / step nodes per move**.
  - At `dfda6ba`, under load 7–16 with another lane running, 100 readings per move came to 94 k
    nodes and 323 ms per move, and 200 readings to 195 k nodes and 648 ms.
  - So 40 puzzles at ≤ 200 readings is about **26–30 s**.
  - The measured wall time and load go into the baseline file.
- **`A6` (every puzzle carries its provenance).** **Then** each position records FEN, the accepted
  move(s) (or the losing move, for do-not-hang), its class, and where it came from. **A puzzle whose
  "correct" answer is the engine's own current output is not a puzzle** — the answers are
  independently sourced, and the ticket says how.
- **`A7` (the baseline is data, not a magic number).** **Then** the recorded baseline is a checked-in
  file stating the count, the commit it was measured at (at or after `ABC-082`'s merge `0de4a93`), the
  budget, the step, the machine and the load. **And** after the build, every commit that touches
  that file touches no file on `## The trigger`'s list, and its message states a reason. A raise is
  QE's to make; a lowering cites the owner's word. Checked at review with `git log --name-only`
  over the file.
- **`A8` (the trigger is written where QE reads it).** **Then**, landed with this build by the
  AGENTS.md Scribe, `AGENTS.md` carries:
  - the suite's command;
  - the owner's file list, verbatim;
  - "red = QE FAIL";
  - the baseline rule from `A7`.

  **And** `AGENTS.md` stays **≤ 24 576 B** (`wc -c`).

## Dependencies

- **`ABC-076`, `ABC-077`, `ABC-078` (per-move budget), `ABC-079` (quiescence) — all `Done`.**
- **`ABC-080`, `ABC-081`, `ABC-082`, `ABC-121`, `ABC-122` — all `Done`.** The baseline is recorded
  on a tree that includes `ABC-082`'s evaluator (`A7`).
- **`ABC-086` (deterministic mode) — `Done`**, merged at `3f26e21`. `src/virtual-clock.ts` is its
  module, which `A4` and `A5` build on.
- **Shared corpus: `ABC-079` built it, and this ticket extends it** (`## Scope`). The earlier
  symmetric wording, *"whichever lands first"*, is retired. That was the open follow-up on
  `ABC-079`'s DoR item 10. The board row is the Orchestrator's.
- **`ADR-0028` governs the shared rows.** A row whose label depends on an evaluator margin is a
  fixture: it is re-found, and its level is not moved. A level the owner accepted moves only on his
  word. The baseline here follows the same pattern (`A7`).
- **The `AGENTS.md` trigger line (`A8`) — the AGENTS.md Scribe, with this build.**

## Security / NFR triggers

- **`RISK-003` — this ticket is half its mitigation** (the other half is `ABC-085`).
- **`N8-LANE` — ≤ 650 ms CPU net**, on the standing instrument.
  - The suite is **opt-in** and is not in the default lane (`A5` allows 60 s, against the lane's
    whole-suite clause). This follows `PERFT_DEEP`'s shape and was ruled 2026-08-16.
  - The default lane pays only the per-file floor of each new test file, about 140–160 ms each
    (`vitest.config.ts` notes). One or two files fit under 650 ms.
  - The data module the corpus moves into is not a test file and adds no file to the lane.
- **`NFR-004` — not triggered.** The suite runs at a reduced, virtual budget by design, and
  `src/cli.ts` never imports `src/virtual-clock.ts` (`ABC-086` `A5`).
- **`NFR-005` — not triggered.** There is no search-path change. A virtual millisecond is not a real
  one (`ADR-0027`).
- **Security — not triggered.** Static data and a runner.

## Test notes

1. **`A3` is the criterion that proves the ticket.** Build the weakened-engine harness first; a gate
   that has never gone red is decoration.
   - At `dfda6ba` (probe), the constant evaluator reads **24/24 losing** on the shared rows.
   - It **still finds the mate in 2**, because mate scores do not come from `evaluate`. So `A3`'s
     drop comes from the material class alone.
   - Under a vitest mock the arm cost about **4× the wall time per node** (32.7 s for 24 moves at
     100 readings, against 7.9 s for the shipped evaluator). `A3`'s separate 60 s bound is there for that reason.
2. **`A6` is not bureaucracy.** A puzzle answered by asking the current engine locks in today's
   behaviour and can never detect anything.
3. **`A4`'s three runs must be in separate processes.** Same-process determinism is weaker. Use a
   fresh clock per move: a reused clock with a non-dyadic step shifts node counts (QE G-QE-2).
4. **Do not move the baseline in the same commit that changes the engine** — the baseline is
   evidence, and moving it and the code together destroys the comparison (`A7`).
5. **`ABC-079` `A1` reads its own 24 rows, byte-identical, after the move.** Its default-lane
   arms (0/24 losing with quiescence, 24/24 for the bare leaf) and its `SEARCH_DEEP` arm stay green
   unchanged.

## Size and priority rationale

**Size `M` (3), unchanged.** The runner is small. **The real work is curating ≥ 16 new provenanced
positions** (≥ 10 mates and ≥ 6 win-material), plus the `A3` harness. The fold adds two small
items and removes one:
- the corpus moves to a data module, and `src/quiescence.test.ts` re-points to it;
- the step guard;
- the seed question is gone.

**Not `L`:** there is no production logic change and no design decision left.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It implements two of the epic's five acceptance criteria directly. Without it,
four other tickets in this epic cannot substantiate their strength claims.

## Definition of Ready

**Re-scored by BA/PM, 2026-10-09** (task `wave-2026-09-25`, subtask `fold-abc084-gate-b`, Workflow
07), against the wave tip `dfda6ba`. It supersedes the score below, which is kept as history.
**Result: 10 of 10 clean, no ⚠️ — MET.** The page frontmatter is set to `Ready`. The `plans/board.md`
move is the Orchestrator's (`Ready` WIP is 0/8).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged |
| 2 | scope and out-of-scope clear | **✅ re-read.** It adds the trigger, the corpus move (24 rows byte-identical, `ABC-079` `A1` on its own 24), ≥ 6 win-material rows, and deterministic mode. The fences now include `quality.mandatory_gates` (ruled out), any production door, and QE's role text |
| 3 | INVEST-shaped | **✅** *(was ⚠️)* Every dependency is `Done`, and the shared corpus exists. Independent |
| 4 | acceptance testable and measurable | **✅ re-read.** There are eight criteria. `A4` is now three processes in deterministic mode with a fresh clock and a step ≥ `budgetMs/1 000`. `A5` is ≤ 60 s for the gating run, sized by the cost law and measured. `A3` gets its own ≤ 60 s. `A7` adds step, load and the own-commit rule. New `A8` is the `AGENTS.md` line, checked by grep and `wc -c` |
| 5 | dependencies known | **✅ re-read.** All are `Done`. The corpus is extended, not forked, and `ADR-0028` governs the shared rows |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms net (opt-in, per-file floor only). `NFR-004` and `NFR-005` are not triggered, and the reasons are stated |
| 7 | test notes present | **✅** five (adds the `A3` measurements and `ABC-079` `A1` unchanged) |
| 8 | size assigned | **✅** `M` (3), unchanged |
| 9 | priority assigned | **✅** `P0`, unchanged |
| 10 | no major unresolved blocker | **✅** *(was ⚠️)* **The trigger is ruled — option B, the owner's word, 2026-10-09** (`## The trigger`). The `A3` route with no production door was measured as feasible |

<details>
<summary>DoR 2026-08-16 (cut) — 8/10, 2 ⚠️, superseded above</summary>

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `RISK-003` quoted as open; the invisible-regression pain stated concretely |
| 2 | scope and out-of-scope clear | **✅** four fences, including the config change explicitly refused and handed to an owner |
| 3 | INVEST-shaped | **⚠️** **not independent** — three open dependencies plus a shared corpus |
| 4 | acceptance testable and measurable | **✅** seven: **10/10** mates, **≥ 19/20** tactics, a **red-gate demonstration**, three-run determinism, **≤ 60 s**, per-puzzle provenance, a dated baseline file |
| 5 | dependencies known | **✅** three open tickets, a shared-corpus ownership rule, and a config change refused with a named owner |
| 6 | security/NFR triggers with a measurable target | **✅** — and the **`N8-LANE` conflict is named and RULED** (opt-in, `PERFT_DEEP` shape) rather than left to the developer |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **an opt-in gate is a gate nobody runs.** The mechanism is decided; **who runs it, and at which board transition, is not** — and it is not BA/PM's to add to `quality.mandatory_gates`. Owner: the Orchestrator with the project owner. **Without that decision this ticket ships an instrument with no trigger** |

</details>

## Delivery

**2026-10-09, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-084`).
Branch `grugops/ABC-084-puzzle-suite` from `7b54dae`. The code is in `b3321f0` and the baseline in
`a287461`, in its own commit. Not merged, not pushed. Decisions, readings and raw files are in
`.grugops/context/ticket-to-pr-ABC-084/notes/` (`…99ac852f`, `…26f28829`, `…a9bf6ab2`) and are not
restated here.

**Criteria: `A1`–`A7` met. `A8` is the Scribe's; its line is drafted in claim `…a9bf6ab2`.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | 10/10 mate-in-2 rows found (`PUZZLE_DEEP=1`) |
| `A2` | MET | 0/24 losing on the do-not-hang rows; win-material 6/6 |
| `A3` | MET | `PUZZLE_DEEP=weakened` (`evaluate` mocked to 0, no `src/` door): 10/40 solved, the gate row red, exit 1, 10.4–10.7 s |
| `A4` | MET | three separate processes, all 40 per-puzzle move/depth/node lines `cmp`-identical. The step guard refuses before any search |
| `A5` | MET | 12.2–13.2 s at budget 25, step 1 |
| `A6` | MET | every row records FEN, move(s), class and source. The mate keys are re-proven by an exhaustive search in the default lane; the win-material keys come from a material-only oracle probe |
| `A7` | MET | `src/puzzle-suite.baseline.json` holds 40/40 at `b3321f0`, with machine, load and wall. Its commit touches only that file |

- **Files.** The corpus is `src/puzzle-corpus.ts`: `HANGING_CORPUS` (24 rows, byte-identical,
  imported back by `src/quiescence.test.ts`) and `PUZZLES` (40 rows).
- **Lane.** The suite is `src/puzzle-suite.test.ts`, run with
  `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`.
- **Trigger list.** `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts` and
  `src/transposition.ts`: 0 lines.
- **Gate.** `npm test` is 50 files / 1539 passed / 0 skipped (base 49 / 1530). Lint, typecheck and
  build exit 0. Skip integrity reads `No findings.` `SEARCH_DEEP` quiescence: 37 passed (29 default).
- **`N8-LANE`, handed up.** Three admissible runs read +790 / +400 / +120 ms net at load1
  54 / 31 / 24. The median is under 650 and run 1 is over. Nothing was trimmed.
- **Found:** two of ABC-079's rows start in check (observation `…26f28829`). They are reported, not
  changed.

## Security/NFR

**2026-10-09, Security/NFR** (task `wave-2026-09-25`, subtask `secnfr-ABC-084`, Workflow 05).
Reviewed `7b54dae..e426e91 -- src`; ASVS L1, block on `high`. **Result: PASS_WITH_RISKS.** Notes
are in `.grugops/context/secnfr-ABC-084/notes/` (`…c3a91e57` decision, `…7f3b2d61` readings,
`…5e1c0a84` security) and are not restated here.

| item | reading | disposition |
|---|---|---|
| `N8-LANE` ≤ 650 ms net | **+85 / +210 ms** on two admissible sessions (nulls +0.62 / +1.42 %, load1 median about 7.5). A third session was inadmissible (null 1.64 %). The file alone costs **+280 ms**, 12/12 | **MET** |
| `A6` oracle → `PUZZLE_DEEP` | It would save about 195 ms. `A6` would lose the default lane's only rules-only proof of the mate keys | **Not required; keep it in the default lane** |
| `A5` ≤ 60 s | 12.5 / 12.7 s at load1 ≈ 7. 48.9 s at 36–49. 79.4 s at 49–54. `A3` 49.3 s at 54–61 | **MET** at the recorded conditions |
| **`F1`** (MEDIUM) | The gate row's 60 s vitest timeout went **red with 40/40 solved** at load1 49–54. Under option B that red is a QE FAIL | **Required fix, non-blocking.** Make the timeout a hang guard (300 s), drop "in <= 60 s" from the row name, and keep `A5` as the printed and recorded reading. If not taken, `AR-PUZZLE-TIMEOUT` waits on Olger Oeselg's word |
| `NFR-008` total | Base lane 24.9–26.0 s CPU on Node v26.11.0. This ticket adds +0.25–0.37 s gross | Reported to Architect/Design (`ADR-0019`), not ruled |
| Security | Static data, one fixed-path read of a checked-in file, no production importer, no dependency | **No finding** |
