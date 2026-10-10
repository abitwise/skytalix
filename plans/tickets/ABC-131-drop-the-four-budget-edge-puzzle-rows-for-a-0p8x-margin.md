---
id: ABC-131
title: Drop the four puzzle rows that sit on the budget edge — 58/62 → 54/58, so every gating row keeps a 0.8x readings margin
status: ready
column: Ready
size: XS
priority: P1
epic: EPIC-004
feature: —
---

# ABC-131 — four mate-in-3 rows go red on a 4 % bigger tree; take them out of the count before `ABC-083` is built

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `owner-adrs-followups`, Workflow 07)
> from [`ADR-0034`](../../memory-bank/50-decisions/ADR-0034-a-puzzle-red-on-an-evaluation-ticket-is-classed-per-row-and-only-budget-drift-goes-to-the-owner.md)
> decision 5, **option (b) at 0.8x, which the owner chose 2026-10-10**: *"accept ADR-0030, ADR-0031,
> ADR-0032, ADR-0034 with (b) at 0.8x"* (note `…owner-word-adrs-91c4e7a0`). That sentence is the owner's
> word `ABC-084` `A7` requires for a lowering. **`ABC-127` is `Done` and is not re-opened** (its gate would
> restart). Reasoning: `.grugops/context/owner-adrs-followups/notes/`.

## Problem

*User*: QE, who runs `PUZZLE_DEEP=1` at review on every engine ticket (option B), and the owner, who
gets every red that is budget drift (`ADR-0034` decision 4).

*Pain*: `ABC-127` recorded **58/62** at 25 readings per move. Four solved rows sit **on the budget
edge** (Security/NFR's sweep, `ADR-0034` § Context): seed **1982** is lost at **−4 %** readings,
**1008** and **1424** at −8 %, **1075** at −12 %. In deterministic mode the budget is a node count, so an
evaluation term that makes the depth-5 tree about 4 % bigger turns the gate **red without being wrong**.
Four of five planted `ABC-083`-shaped terms did exactly that. Each such red is class D and goes to the
owner, so as recorded **an owner stop is the expected result of every evaluation ticket.**

*Value*: after the drop, every retained row tolerates about **25 %** tree growth (`ABC-082`, the one real
evaluation term measured, grew `kiwipete`'s nodes by 14.6 %). A D red after this means > 25 % growth on
some row — a reading worth the owner's time, not a false alarm. **This must land before `ABC-083` enters
`In Development`** (`ADR-0034` decision 5).

## Scope

- **Delete four rows from `PUZZLES`** in `src/puzzle-corpus.ts`: `mate in 3, seed 1982`, `seed 1008`,
  `seed 1424` and `seed 1075` (`:142`, `:143`, `:144`, `:147` at `246ddfc`). At most **one** added
  comment line, naming the four seeds and `ADR-0034` (b).
- **Re-record `src/puzzle-suite.baseline.json` at 54/58** in **its own commit**, touching only that file,
  whose message cites the owner's word. Budget 25 and step 1 do not change. `unsolved` (the four
  headroom rows) does not change.
- **Prove the margin the rule promises** (`A3`) and **re-read `ABC-127` `A3`** on the re-cut build
  (`A4`): `ADR-0034`'s figures are computed, and it says they stay `UNKNOWN - verify` until a re-run.
- **Fold `QE-127-e`** (LOW, routed to BA/PM by QE at `qe-ABC-127`, homeless since): one `PUZZLE_DEEP=1`
  row that cross-checks `unsolved` against the corpus (`A6`). It is here because this ticket re-records
  that list. **Separable:** strike `A6` and the ticket still stands.

## Out of scope

- **Budget, step, the gate expression, the trigger list, the red rule.** Unchanged (`ADR-0034` decision 1).
- **Re-finding the dropped rows.** A mate row's label is exact; only its budget moved (`ADR-0034` decision 4).
- **Option (b) at 0.9x** (keep 1075) **or option (c)** (raise the budget). Not chosen.
- **The `AGENTS.md` `PUZZLE_DEEP` comment** and `memory-bank/90-agents-md-command-log.md`. The Scribe's,
  after merge (§ Dependencies).
- **`RISK-003`'s wording in `plans/nfr-catalog.md`** with the 0.8x figure. Security/NFR's.
- **`ABC-127`'s page and criteria.** Not re-opened; `A4` re-reads its `A3`, it does not edit it.

## Acceptance (Given/When/Then)

- **`A1` (exactly four rows go, nothing else in the corpus moves).** **Given** `src/puzzle-corpus.ts`
  after the build, **then** `PUZZLES` holds **58** rows (62 − 4), no row name contains `seed 1982`,
  `seed 1008`, `seed 1424` or `seed 1075`, and the diff of that file is **4 deleted lines** plus at most
  **1 added comment line**. The default lane is green unchanged: `ABC-127` `A1`'s row still holds
  (18 new rows ≥ 16; mate-in-3 8 ≥ 6; quiet-key 11 ≥ 4; `depth≥5` 6 ≥ 4; `quiescence` 11 ≥ 4).
- **`A2` (the baseline: 54/58, its own commit, the owner's word cited).** **Then**
  `src/puzzle-suite.baseline.json` reads `solved` **54**, `total` **58**, `budgetMs` 25, `stepMs` 1,
  `unsolved` **byte-identical** to the base (4 names), plus the commit, machine, load and wall
  (`ABC-127` `A5`'s fields). Its `reason` quotes the owner's sentence and cites `ADR-0034` decision 5 and
  `ABC-084` `A7`. **It lands in its own commit**: that commit touches **only** that file, and its message
  states the reason. **And** `PUZZLE_DEEP=1` exits **0** in **three separate processes** with identical
  per-row lines (move, depth, nodes), printing **54/58** and **no** `NEWLY-MISSED` or `NEWLY-SOLVED` line.
- **`A3` (the 0.8x margin holds — the rule's own measurement).** **Given** the re-cut build copied out of
  tree, with **only** `stepMs` changed to **1.25** in the copied baseline file (Security/NFR's sweep
  method; the tree and the real baseline are never touched), **when** the gating run is repeated,
  **then** every one of the 54 rows solved at 1x is solved: **54/58, 0 `NEWLY-MISSED`**. This includes
  the rows `ABC-126` re-found. **Stop rule:** a retained row missed at 1.25 is reported by name and the
  hop stops. Dropping a further row is the owner's word, not this ticket's.
- **`A4` (`ABC-127` `A3` still met — measured, not computed).** **Given** QE's 17 weakenings
  (`.grugops/context/qe-ABC-084/probe/weakenings.mjs`), each planted alone out of tree on the re-cut
  build and reverted, **then**: the 7 old reds (`W3`, `W6`, `W7`, `W8`, `W9`, `W12`, `W15`) stay red; of
  the 10 survivors **≥ 6** go red, **including `W1`, `W1b`, `W4` and `W5`**, plus **≥ 2** of `W2`, `W11`,
  `W13`, `W14`, `W16`. **Expected** (computed from QE's per-row files, twice — `ADR-0034` and this cut):
  **14/17 red; survivors red 7 of 10**; `W14` **green** (both its rows are dropped), `W10` and `W11`
  green. The 17-row table (solved, missed rows, exit) goes in the PR note. **Stop rule:** if `ABC-127`
  `A3` fails, report and stop; do not restore rows.
- **`A5` (headroom and improvement still visible — `ABC-127` `A4`).** **Then** the four headroom rows
  stay unsolved at 1x; **one** run at **4×** readings (step ÷ 4, out of tree) reads **solved > 54**;
  `ABC-084` `A1` (every mate in 2) and `A2` (≤ 1 losing do-not-hang row) are green; and
  `PUZZLE_DEEP=weakened` still exits **1**.
- **`A6` (`unsolved` is cross-checked — `QE-127-e`).** **Given** `PUZZLE_DEEP=1`, **then** one new row
  asserts that **every** name in the baseline's `unsolved` is the name of a `PUZZLES` row, and that
  `solved + |unsolved| = total` (**54 + 4 = 58**). **Red first:** with one `unsolved` name misspelt in an
  out-of-tree copy of the baseline, the row is **RED**.
- **`A7` (scope and gates).** `git diff --name-only <base>..<delivered>` lists under `src/` **exactly**
  `src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json` and `src/puzzle-suite.test.ts` (`A6` only).
  **No trigger-list file.** Lint, typecheck, build and `npm test` exit 0; skip count 0; integrity
  `No findings.`; the default lane gains **0** test files and **0** rows.

## Dependencies

- **`ABC-126` must merge first — ordering, no open question.** It is `In Review` (QE hop running) and
  edits `src/puzzle-corpus.ts` and `src/puzzle-suite.test.ts` (other rows: the hanging pair, `pin`,
  `discovered check`). Its own `A4` re-reads 58/62. This ticket's baseline and its `A3` margin are
  measured on the tree **with** `ABC-126`'s rows, which the 0.8x rule covers too.
- **The owner's word — given** (2026-10-10). Nothing else is owed before the build.
- **`ABC-083` is ordered after this ticket** (`ADR-0034` decision 5). `ABC-087` is not: its `A3` compares
  two levels on whatever suite is in the tree.
- **After merge, owed by others (not this ticket's criteria):**
  - **AGENTS.md Scribe** — the `PUZZLE_DEEP` comment's `58/62` → `54/58`, and the whole-lane count
    `17 passed` → `18 passed` (`A6`'s row). Both are same-length substitutions, so **0 B**; `AGENTS.md`
    is **24,433 / 24,576 B** (143 B headroom, measured at `246ddfc`). Any added prose spends that headroom.
  - **Security/NFR** — `RISK-003`'s "count gate records its budget margin" wording with the 0.8x figure.

## Security / NFR triggers

- **`RISK-003` — the subject.** Measured target: every gating row solved at **0.8x** readings (`A3`).
- **`N8-LANE` — ≤ 650 ms CPU net.** No new test file; the default lane gains no row. The deep lane loses
  four `depth≥5` rows and gains one row that reads a JSON file: it gets faster. `ABC-127` `A7`'s wall
  readings are printed and recorded, never asserted.
- **`NFR-004`, `NFR-005` — not triggered.** No engine line.
- **Security — not triggered.** Static test data and one test row.
- **UAT.** The waiver's literal git test lists `src/puzzle-corpus.ts` and the baseline file (data, not
  `*.test.ts`). As at `ABC-084` and `ABC-127`, that call is the Orchestrator's. The QE hop applies.

## Test notes

1. **Do the deletions and the baseline in two commits**, rows first. Between them the gate is red
   (`total` 58 against a recorded 62); that is expected and is why the baseline commit says why.
2. **Every ladder run is out of tree** (`ADR-0034` decision 3): copy `src/`, change only `stepMs` in the
   copied baseline. `git status --porcelain src` is empty after each run.
3. **The `A4` expectation was computed twice from QE's raw files**, not inherited: this cut's recount is
   `.grugops/context/owner-adrs-followups/probe/drop-recount.{sh,out.txt}`, which matches
   `ADR-0034`'s `classify.out.txt` on all 17 weakenings. A measured number that differs is the finding.
4. **Expect about 10 minutes of deep runs** (17 weakenings + the 1.25 and 4× runs + 3 processes, ~20–35
   s each). Record load1 beside each.

## Size and priority rationale

**Size `XS` (1).** Four deleted lines, one re-recorded JSON file, one test row. The measurements are
scripted and their expected values are written down. **Not `S`:** no row is re-found and no oracle runs
new.

**Priority `P1`.** It is the predecessor `ADR-0034` names for `ABC-083` (`P1`), so it cannot be lower.
Not `P0`: nothing shipped is wrong; the cost of not doing it is a predictable owner stop on `ABC-083`.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `246ddfc`. **Result: 10 of 10 — MET →
`Ready`.** Pull after `ABC-126` merges.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four named rows at −4 / −8 / −8 / −12 % readings; four of five planted terms red on them |
| 2 | scope and out-of-scope clear | **✅** four deletions, one baseline commit, two measurements, one folded LOW gap; six fences |
| 3 | INVEST-shaped | **✅** small and testable; the `ABC-126` order is a merge order on a ticket with no open question |
| 4 | acceptance testable and measurable | **✅** 58 rows; 54/58 ×3 processes; 54/58 at step 1.25; 14/17 and ≥ 6/10 with four named; > 54 at 4×; `54 + 4 = 58`; three paths |
| 5 | dependencies known | **✅** `ABC-126` first; owner word given; `ABC-083` after; Scribe and Security/NFR owed after |
| 6 | security/NFR triggers with a measurable target | **✅** `RISK-003` at 0.8x; `N8-LANE` 0 files / 0 default rows |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P1`, tied to `ABC-083` |
| 10 | no major unresolved blocker | **✅** none |
