---
id: ABC-127
title: Harder puzzles — catch the weakenings ABC-084's suite misses, and leave headroom below the ceiling
status: ready-for-uat
column: Ready for UAT
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-127 — the strength gate goes red on a broken evaluator, but stays green when quiescence, depth or ordering is lost

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `cut-harder-puzzles`, Workflow 03)
> at the wave tip `de7d9c9`, on the owner's word *"accept ABC-084, cut the harder puzzles ticket"*
> (note `.grugops/context/wave-2026-09-25/notes/20261010T075200Z-orchestrator-decision-e47a1c08.md`).
> Sources: QE `ABC-084` gaps QE-084-a…d (`.grugops/context/qe-ABC-084/notes/…927320d8`,
> `…80be6044`); Security/NFR `ABC-084` (`…c3a91e57`, `…7f3b2d61`: `N8-LANE`, `F1`). The pricing
> probe, alternatives and readings are in `.grugops/context/cut-harder-puzzles/` and are not
> restated here.

## Problem

*User*: QE, who runs `PUZZLE_DEEP=1` at review on every engine-touching ticket (option B), and
every ticket in this epic that claims a strength change (`ABC-083`, `ABC-087`, the ones after).

*Pain*: `ABC-084` shipped a gate with **coarse resolution and no headroom**.
- QE planted 17 subtle weakenings. **7 go red; 10 survive:** `W1` quiescence off
  (`QUIESCENCE_MAX_PLY` 0), `W1b` quiescence off at the engine's leaf only, `W2` quiescence 1 ply,
  `W4` depth cap 3, `W5` depth cap 4, `W10` PST off, `W11` mate score ignores ply, `W13` LMR
  reduces checks, `W14` LMR reduces by 2, `W16` move ordering off (QE-084-a). The default lane
  catches them only through exact pins, which a value-changing ticket re-records by rule
  (`ADR-0026` decision 10). **No strength reading goes red for them.**
- The baseline is **40/40, the ceiling** (QE-084-b), so the suite can show a drop and can never
  show an improvement. It saturates at about 5 virtual readings per move, and every row is solved
  at depth 3–4.

*Value*: an engine ticket that loses quiescence, depth or ordering goes red at QE, and a ticket
that makes the engine stronger can show it as a raised count. This finishes `RISK-003`'s
regression half.

## Scope

- **New rows appended to `PUZZLES` in `src/puzzle-corpus.ts`** (`A1`). The 40 existing rows and
  `HANGING_CORPUS` stay byte-identical.
- **Answers sourced independently of the engine and re-proven in a lane** (`A2`). This covers the
  6 existing win-material rows (QE-084-c).
- **A re-recorded baseline below the ceiling** that records which rows are unsolved (`A4`, `A5`).
- **The runner prints per-row differences against the baseline** (`A5`). The gate stays the
  count.
- **The measured sensitivity table**: QE's 17 weakenings run against the extended suite (`A3`).
- **Whatever runner change the rows need to be solvable within the price** (`A7`). For example,
  one budget for all rows, or a separate budget for a hard tier. Which one is the Engineer's.

## Out of scope

- **Any production line.** `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
  `src/quiescence.ts`, `src/transposition.ts`: 0 lines. A weakening is planted, measured and
  reverted, and is never committed. There is no production door.
- **The option-B trigger list, `quality.mandatory_gates`, and the red rule.** They are the
  owner's, verbatim. `src/puzzle-corpus.ts` is not on the list, and this ticket does not add it.
- **The two in-check `HANGING_CORPUS` rows (QE-084-e).** They belong to `ABC-126`.
- **Elo, the self-play ladder (`ABC-085`), and `W10` (PST off).** A tactics suite that went red on
  a positional table would be a fixture, so `W10` is not required (`A3`).
- **Adding rows the shipped engine solves only to raise the count.** Every new row carries a
  tag that says why it is there (`A1`).

## Acceptance (Given/When/Then)

- **`A1` (harder rows, with breadth).** **Given** `PUZZLES` after the build, **then** it holds the
  40 existing rows unchanged plus **≥ 16 new rows**, each tagged with its class and properties:
  - **≥ 6 `mate-in-3`** rows: no mate in ≤ 2, and the accepted set is exactly the first moves that
    force mate in 3;
  - **≥ 6 new `win-material`** rows, of which **≥ 3 have black to move** (QE-084-d);
  - **≥ 4 quiet-key** rows across the new rows, where the key is neither a capture, a check nor a
    promotion;
  - **≥ 4 rows tagged `depth≥5`**: the shipped engine solves the row at the recorded config, and
    with `W5` (depth cap 4) planted it does not;
  - **≥ 4 rows tagged `quiescence`**: the shipped engine solves the row at the recorded config,
    and with `W1` planted it does not.

  Rows may carry several tags. **No new row is a colour mirror of any corpus row**, checked by a
  row over the mirror-normalised placement and side to move (QE-084-d).
- **`A2` (the answers are the rules' answer, re-proven in a lane).** **Then** every new row records
  FEN, accepted move(s), class, tags and source (`ABC-084` `A6` discipline). Every accepted set is
  computed by an oracle that imports nothing from `src/engine.ts`, `src/search*.ts`,
  `src/evaluate*.ts`, `src/quiescence.ts` or `src/transposition.ts`, and is never the engine's
  output. A `PUZZLE_DEEP=1` row re-proves the following, red on any mismatch:
  - each `mate-in-3` set is exact, with no shorter mate;
  - each `win-material` set, **the 6 existing rows included**, is exactly the material-best set
    (QE-084-c).

  The mate-in-2 oracle row stays in the default lane (Security/NFR's `ABC-084` ruling). The `tag`
  properties of `A1` are engine measurements and are recorded with `A3`, never used as answers.
- **`A3` (the sensitivity, measured — the point of the ticket).** **Given** QE's 17 weakenings
  (the exact edits in `.grugops/context/qe-ABC-084/probe/weakenings.mjs`), each planted alone,
  run through `PUZZLE_DEEP=1` and reverted (`git status --porcelain src` is empty after each),
  **then**:
  - all **7 already-red** weakenings stay red;
  - of the **10 survivors, ≥ 6 go red on the solved count**. The six **must include `W1`, `W1b`,
    `W4` and `W5`**, plus **≥ 2 of `W2`, `W11`, `W13`, `W14` and `W16`**.

  The 17-row table (solved, missed rows, exit) goes in the build's note. **Stop rule:** if fewer
  than 6 go red, report the measured count and stop. The bar is not lowered at build. It is re-cut
  by BA/PM, with QE's reading, on the Orchestrator's routing.
- **`A4` (headroom below the ceiling, and an improvement that shows).** **Then**, at the recorded
  config:
  - the shipped engine leaves **≥ 3 of the new rows unsolved**, so `solved ≤ total − 3`;
  - the original 40 stay **40/40**, and `ABC-084` `A1` (10/10) and `A2` (≤ 1 losing) stay green;
  - `PUZZLE_DEEP=weakened` is still red.

  **And** one run of the same suite at **4×** the recorded readings per move (step ÷ 4) reads
  **solved > baseline**. That run is recorded in the note and is not a lane row. A suite in which
  more search does not raise the count cannot show an improvement.
- **`A5` (the baseline: re-recorded, its own commit, swaps visible).** **Then**
  `src/puzzle-suite.baseline.json` is re-recorded in **its own commit**:
  - it touches only that file and no trigger-list file, and its message states a reason;
  - it records count, total, budget(s), step(s), commit, machine, load, wall, and **the names of
    the unsolved rows**.

  The solved count does not fall below 40, so under `ABC-084` `A7` this is **not a lowering**.
  **And** the gating run prints one `NEWLY-MISSED` or `NEWLY-SOLVED` line per row whose state
  differs from the recorded list. The gate is unchanged: `solved ≥ baseline`, and `total` equals
  the recorded total. Under any red weakening of `A3`, the `NEWLY-MISSED` lines name exactly the
  missed rows.
- **`A6` (still deterministic).** **Then** `ABC-084` `A4` holds for the extended suite: three
  separate processes print identical per-row lines (move, depth, nodes), and the step guard still
  refuses `step < budgetMs / 1 000` before any search.
- **`A7` (the price QE pays at every engine ticket — `A5`'s wall, with `F1`'s lesson).** **Then**
  the whole `PUZZLE_DEEP=1` run (the gating run plus `A2`'s oracle row) reads **≤ 90 s wall at
  load1 ≤ 8**, and the gating run alone reads **≤ 45 s**. Each is printed and recorded in the
  baseline file. **Neither is asserted:** no wall-clock assertion is added, and every deep row
  keeps a **300 s hang guard**. The 45 s comes from the worst load inflation measured, 6.3×
  (12.6 s → 79.4 s at load1 49–54); 45 × 6.3 ≈ 284 s keeps the 300 s guard from turning load into
  a red. **Stop rule:** a reading over the cap is reported, not trimmed. Accepting that price is the
  Orchestrator's, with the owner.
- **`A8` (`N8-LANE`).** **Then** the default lane gains **0 test files**, and its net charge on
  the standing protocol is **≤ 650 ms** (Security/NFR).
- **`A9` (the `AGENTS.md` line).** **Then** the AGENTS.md Scribe updates the `PUZZLE_DEEP` comment
  with the new whole-lane count (the count is the guard against an unrecognised value,
  Security/NFR `…5e1c0a84`), the new baseline (`S/T`, budget, step) and the `A7` reading.
  `AGENTS.md` stays **≤ 24 576 B** (`wc -c`).

## Dependencies

- **`ABC-084` — `Done`**, merged `71a094f`. Its runner, lanes, baseline rule and oracle are what
  this ticket extends.
- **`ADR-0027`** (deterministic mode) and **`ADR-0028`** (the `HANGING_CORPUS` rows are untouched
  here).
- **`ABC-126` edits the same file**, but only two `HANGING_CORPUS` rows. The two tickets are
  independent. Whichever lands second rebases, and a baseline move that follows takes its own
  commit (`A5`).
- **Ordering, recommended:** build before `ABC-083` enters dev, so that `ABC-083`'s strength claim
  is read on a suite that can go up.

## Security / NFR triggers

- **`RISK-003`.** This closes the resolution gap in its regression half.
- **The price of the QE run (`A7`):** ≤ 45 s for the gating run and ≤ 90 s for the whole lane at
  load1 ≤ 8, readings only, with 300 s hang guards. Measured cost (probe):
  - **25 readings:** about 0.4 s per move in vitest, but only depth 3–4 on tactical middlegames;
  - **100 readings:** about 2.0 s per move, depth 5–6.

  So at most about 16 hard rows fit at 100 readings, or many more at 25 readings if the rows are
  sparse enough to reach depth ≥ 5 there.
- **`N8-LANE` ≤ 650 ms net (`A8`).** Every new oracle row is deep-lane. The default lane pays only
  the content of rows in the existing file.
- **`NFR-004`, `NFR-005`: not triggered.** There is no search-path change, and a virtual
  millisecond is not a real one.
- **Security: not triggered.** Static data and a test runner (as at `ABC-084`, `…5e1c0a84`).

## Test notes

1. **Build `A3`'s harness first and curate against it.** A row earns its place by turning a
   survivor red, and `A1`'s tags record which survivor. Write the measurement to the build's own
   context directory, not to `qe-ABC-084/`.
2. **Mate-in-3 needs depth 5.** At 25 readings the engine reaches d5–d8 on sparse positions but
   d3–d4 on kiwipete-like middlegames (probe). So either keep the hard rows sparse or give them
   more readings, inside `A7`.
3. **A `quiescence` row must flip on the leaf, not the root.** The existing do-not-hang rows never
   lose even at depth 1, because quiescence sees the recapture. A flipping row needs an exchange
   sequence longer than the depth reached.
4. **The exhaustive mate-in-3 oracle is expensive.** It runs in `PUZZLE_DEEP`, not in the default
   lane (`A8`). Its wall counts toward `A7`'s 90 s.
5. **Do not move the baseline in a commit that changes rows or the runner** (`A5`; `ABC-084` test
   note 4).

## Size and priority rationale

**Size `M` (3).** The runner, the lanes, the baseline rule, the oracles and QE's harness all exist.
The work is curating **≥ 16 provenanced rows** against a measured sensitivity target, extending the
oracle to mate-in-3 and the in-lane material check, and the per-row diff. **Not `L`:** no
production code and no design decision; `A3`'s and `A7`'s stop rules bound the iteration. **Not
`XL`.**

**Priority `P1`.** Nothing is broken, and `ABC-084` delivered the epic's criteria. But the next
engine tickets (`ABC-083` P1, `ABC-087` P1) would pass QE's strength gate with quiescence, depth or
ordering lost. **Promote to `P0` if an engine ticket enters dev before this one lands.**

## Definition of Ready

Assessed by BA/PM, **2026-10-10**, at `de7d9c9`. **Result: 9 of 10, 1 ⚠️ — NOT met; stays in
`Backlog`.** The ⚠️ is a measured target with a stop rule, not an open question, and the ticket is
pullable today.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 10 named survivors, a 40/40 ceiling, saturation at about 5 readings |
| 2 | scope and out-of-scope clear | **✅** rows, oracle, baseline and per-row diff are in. Production lines, the trigger list, the in-check pair (`ABC-126`) and `W10` are fenced out |
| 3 | INVEST-shaped | **⚠️ estimable only up to `A3`'s bar.** The ≥ 6/10 is set before any hard row exists, and whether the `W1`/`W1b` rows can be found inside `A7`'s price is unmeasured. **Owner: Software Engineer** (measures at build). If the stop rule fires, BA/PM re-cuts with QE's reading, on the Orchestrator's routing |
| 4 | acceptance testable and measurable | **✅** nine criteria: counts, oracle equality, a 17-row table, `≤ total − 3`, a 4× run, an own-commit `git log`, `cmp`-identical rows, two wall readings, `wc -c` |
| 5 | dependencies known | **✅** `ABC-084` Done; `ABC-126` shares the file and is independent |
| 6 | security/NFR triggers with a measurable target | **✅** `A7` ≤ 45 / 90 s readings with a 300 s guard (derived from 6.3×); `N8-LANE` ≤ 650 ms; `NFR-004` and `NFR-005` not triggered, with the reasons |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P1`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** no ruling owed. The baseline reading (a count that does not fall is not a lowering) is stated in `A5` |
