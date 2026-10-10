---
id: ABC-131
title: Drop the four puzzle rows that sit on the budget edge — 58/62 → 54/58, so every gating row keeps a 0.8x readings margin
status: ready-for-uat
column: Ready for UAT
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
>
> **Folded 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `postmerge-followups-2026-10-10`):
> **`QE-126-b`** (LOW, routed to BA/PM by QE at `qe-ABC-126`, `b22f6e16`) becomes **`A8`**. It is
> one assertion in the deep win-material row this ticket already runs ×3, in a file it already
> edits. Measured before folding, on an out-of-tree copy of `ABC-126`'s tip: **16 of 16** rows'
> `source` `+N` equal the oracle's gain, so `A8` is green on arrival and cannot stall this `P1`.
> **Separable, like `A6`.** Still `XS`, `P1`, DoR 10/10. Reasoning:
> `.grugops/context/postmerge-followups-2026-10-10/notes/`.

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
- **Fold `QE-126-b`** (LOW, routed to BA/PM by QE at `qe-ABC-126`). In the `PUZZLE_DEEP=1` row
  "`ABC-127` `A2` — each win-material row … accepts EXACTLY the material-best moves, and they gain",
  the gain is checked against the row's `source` `+N` and not only `> 0` (`A8`). One assertion goes
  inside the existing row, and no row is added. **Separable:** strike `A8` and the ticket still
  stands.

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
  `src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json` and `src/puzzle-suite.test.ts` (`A6` and
  `A8` only).
  **No trigger-list file.** Lint, typecheck, build and `npm test` exit 0; skip count 0; integrity
  `No findings.`; the default lane gains **0** test files and **0** rows.
- **`A8` (a win-material row's `+N` is the oracle's — `QE-126-b`, folded 2026-10-10).** **Given**
  `PUZZLE_DEEP=1`, **when** the row "`ABC-127` `A2` — each win-material row … and they gain" runs,
  **then** for **every** `win-material` row (**16** on the tree with `ABC-126`'s rows; this ticket
  drops none of them), the `source` holds exactly one `+N`, and `N` **equals** the gain
  `materialBest` returns for that row. The existing `gain > 0` and accepted-set assertions stay.
  **Red first:** QE's `M9` (`discovered check` row, `source` `+4` → `+6`, in an out-of-tree copy)
  is **RED** on this row and names that row. QE measured it green at `b22f6e16`. **Green on the
  delivered tree in all three `A2` processes.**

## Dependencies

- **`ABC-126` must merge first — ordering, no open design question.** It is `Ready for UAT` (QE
  PASS_WITH_GAPS `b22f6e16`); **the owner's UAT word is owed** because `src/puzzle-corpus.ts` is a
  non-test file (Orchestrator, 2026-10-10). It edits `src/puzzle-corpus.ts` and `src/puzzle-suite.test.ts` (other rows: the hanging pair, `pin`,
  `discovered check`). Its own `A4` re-reads 58/62. This ticket's baseline and its `A3` margin are
  measured on the tree **with** `ABC-126`'s rows, which the 0.8x rule covers too.
- **The owner's word on the lowering — given** (2026-10-10). Nothing else is owed before the build.
  *If the Orchestrator wants this built before `ABC-126`'s UAT word, branch from
  `grugops/ABC-126-corpus-repairs` and merge in that order; the measurements then hold as written.*
- **`ABC-083` is ordered after this ticket** (`ADR-0034` decision 5). `ABC-087` is not: its `A3` compares
  two levels on whatever suite is in the tree.
- **After merge, owed by others (not this ticket's criteria):**
  - **AGENTS.md Scribe** — the `PUZZLE_DEEP` comment's `58/62` → `54/58`, and the whole-lane count
    `17 passed` → `18 passed` (`A6`'s row). Both are same-length substitutions, so **0 B**; `AGENTS.md`
    is **24,433 / 24,576 B** (143 B headroom, measured at `246ddfc`). Any added prose spends that headroom.
  - **Security/NFR** — `RISK-003`'s "count gate records its budget margin" wording with the 0.8x figure
    (already enqueued as `secnfr-catalog-2026-10-10`).

## Security / NFR triggers

- **`RISK-003` — the subject.** Measured target: every gating row solved at **0.8x** readings (`A3`).
- **`N8-LANE` — ≤ 650 ms CPU net.** No new test file; the default lane gains no row. The deep lane loses
  four `depth≥5` rows and gains one row that reads a JSON file: it gets faster. `ABC-127` `A7`'s wall
  readings are printed and recorded, never asserted.
- **`NFR-004`, `NFR-005` — not triggered.** No engine line.
- **Security — not triggered.** Static test data and one test row.
- **UAT.** The waiver's literal git test lists `src/puzzle-corpus.ts` and the baseline file (data, not
  `*.test.ts`), so **the owner's UAT word is owed**, as the Orchestrator ruled for `ABC-126` on the same
  file (2026-10-10). The owner can give it together with `ABC-126`'s. The QE hop applies.

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
5. **`A8`'s numbers are measured, not inherited** (BA/PM, 2026-10-10). A `git archive` copy of
   `grugops/ABC-126-corpus-repairs` (`b22f6e16`) had one print line added to the win-material row.
   Under `PUZZLE_DEEP=1 -t "each win-material row"` the oracle printed **16 rows, each `+N` equal to
   its gain** (wall 5.21 s, load1 4.40). Readings:
   `.grugops/context/postmerge-followups-2026-10-10/probe/gaincheck-126.out.txt`. QE's `M9` recipe
   is `.grugops/context/qe-ABC-126/probe/mutant.sh` + `plant.mjs` (on `ABC-126`'s branch until it
   merges). Every `source` writes the gain as `+N` after the `WIN` / `WIN3` prefix. Neither prefix
   contains a `+`.

## Size and priority rationale

**Size `XS` (1).** Four deleted lines, one re-recorded JSON file, one test row. The measurements are
scripted and their expected values are written down. **Not `S`:** no row is re-found and no oracle runs
new. **Still `XS` after the `A8` fold** (2026-10-10): one assertion inside an existing deep row, one
mutant run, and the deep runs this ticket already makes.

**Priority `P1`.** It is the predecessor `ADR-0034` names for `ABC-083` (`P1`), so it cannot be lower.
Not `P0`: nothing shipped is wrong; the cost of not doing it is a predictable owner stop on `ABC-083`.

## Definition of Ready

**Re-scored 2026-10-10 by BA/PM at the `QE-126-b` fold** (`postmerge-followups-2026-10-10`, wave tip
`9ddd6e80`). **Still 10 of 10, 0 ⚠️, `Ready`.** Item 2 now covers two folded LOW gaps, each separable.
Item 4 adds `A8`: 16/16 equalities and a named mutant RED. Item 7 has five test notes. Item 3 is
unchanged: `A8` touches the file this ticket already edits and adds no dependency. Pull after
`ABC-126` merges, as before.

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `246ddfc`. **Result: 10 of 10 — MET →
`Ready`.** Pull after `ABC-126` merges.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four named rows at −4 / −8 / −8 / −12 % readings; four of five planted terms red on them |
| 2 | scope and out-of-scope clear | **✅** four deletions, one baseline commit, two measurements, one folded LOW gap; six fences |
| 3 | INVEST-shaped | **✅** small and testable; the `ABC-126` order is a merge order on a built, QE-passed ticket waiting only on the owner's UAT word (the `ABC-059`/`ABC-127` precedent at `rescore-batch-2`) |
| 4 | acceptance testable and measurable | **✅** 58 rows; 54/58 ×3 processes; 54/58 at step 1.25; 14/17 and ≥ 6/10 with four named; > 54 at 4×; `54 + 4 = 58`; three paths |
| 5 | dependencies known | **✅** `ABC-126` first; owner word on the lowering given, UAT word owed; `ABC-083` after; Scribe and Security/NFR (`secnfr-catalog-2026-10-10`, enqueued) owed after |
| 6 | security/NFR triggers with a measurable target | **✅** `RISK-003` at 0.8x; `N8-LANE` 0 files / 0 default rows |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P1`, tied to `ABC-083` |
| 10 | no major unresolved blocker | **✅** none |

## Delivery

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `ticket-to-pr-ABC-131`).
Branch `grugops/ABC-131-drop-edge-puzzles` from `679e847d`. Commits: tests `7cf74d43`, the drop
`506d80c6`, the baseline `51fb4ca9` (its own commit, that file only). Not merged, not pushed. Readings and
raw files: `.grugops/context/ticket-to-pr-ABC-131/notes/`. Every ladder, mutant and weakening run was in a
copy outside the repository. The worktree's `git status --porcelain src` was empty after each one.

**Premise re-verified at `679e847d`:** the four rows are present, and `A6` and `A8` are absent.
`PUZZLE_DEEP=1` read 58/62, exit 0, 17 passed (load1 8.75). **Criteria: 8 of 8 met.**

| # | verdict | reading |
|---|---|---|
| `A1` | MET | `PUZZLES` has 58 rows, none for seeds 1982/1008/1424/1075. `src/puzzle-corpus.ts` numstat is 1/4 (one comment line). Tagged rows 18; mate-in-3 8; quiet-key 11; `depth≥5` 6; `quiescence` 11 |
| `A2` | MET | Baseline 54/58, budget 25, step 1, `unsolved` byte-identical. The `reason` quotes the owner and cites `ADR-0034` decision 5 and `ABC-084` `A7`. `51fb4ca9` touches only that file. Three processes each gave 54/58, exit 0, 18 passed, identical per-row lines and no NEWLY line (load1 7.73 / 7.98 / 6.04; gating wall 23.94 / 19.21 / 19.93 s) |
| `A3` | MET | Step 1.25 out of tree: 54/58, 0 NEWLY-MISSED, exit 0. Sweep: 1.3 still 54/58 (the same 19 readings); 1.35 loses seeds 1, 69 and 1163 (51/58). **0.8x holds with one reading of slack** |
| `A4` | MET | 17 weakenings on `51fb4ca9`: **14/17 red**. Survivors red **7 of 10** (`W1`, `W1b`, `W2`, `W4`, `W5`, `W13`, `W16`); `W10`, `W11` and `W14` green. Table below. One count differs from the recount: `W9` 44 vs 45, from `ABC-126`'s re-authored `discovered check` row. Red either way |
| `A5` | MET | The four headroom rows are unsolved at 1x. 4x (step 0.25) reads **58/58**. `ABC-084` `A1`/`A2` are green in every 1x run. `PUZZLE_DEEP=weakened` exits **1** (15/58) |
| `A6` | MET | The new deep row is green: 54 + 4 = 58. Red first: one misspelt `unsolved` name in a copied baseline is RED and names the entry |
| `A7` | MET | `src/` diff = the three named files (+18/−12). Lint, typecheck and build exit 0. `npm test` 52 / 1608 at base and tip (+0 files, +0 rows), 0 skips. Integrity `No findings.`; inventory 52/52 |
| `A8` | MET | Green on all 16 win-material rows in every `A2` process. Red first: QE's M9 (`+4` → `+6`) is RED, `discovered check: the bishop moves, Rxd8: expected [ 6 ] to deeply equal [ 4 ]` |

`A4` table (solved / 58, exit): `W1` 43 1 · `W1b` 41 1 · `W2` 50 1 · `W3` 35 1 · `W4` 44 1 · `W5` 48 1 ·
`W6` 50 1 · `W7` 46 1 · `W8` 49 1 · `W9` 44 1 · `W10` 54 0 · `W11` 54 0 · `W12` 46 1 · `W13` 52 1 ·
`W14` 54 0 · `W15` 35 1 · `W16` 47 1. Missed rows per weakening: `raw-a4-weakenings.jsonl`.

**`N8-LANE`:** the default lane gains 0 files and 0 rows. The deep lane gets faster: gating wall 25.52 s
at base vs 19.2–23.9 s at tip, and the mate-in-3 oracle 8.70 s vs 4.18–5.34 s. Printed, not asserted.
**Owed:** the QE hop, the `In Review` move (Orchestrator) and the merge. **The owner's UAT word is owed**
(`src/puzzle-corpus.ts` and the baseline are non-test files). After merge: the Scribe and Security/NFR
(`RISK-003`: 0.8x holds; first loss at 0.74x nominal on seeds 1, 69 and 1163).

## QE

**2026-10-10, QE/E2E** (task `wave-2026-09-25`, subtask `qe-ABC-131`, Workflow 04 review exit).
**Result: PASS_WITH_GAPS. `A1`–`A8` are MET and no gap blocks it.** QE re-derived every criterion in
`git archive` copies with its own scripts, logging load1 for each run. It re-planted all 17 weakenings
itself. It added one test-only commit, `f994c724` (+4 in `src/puzzle-suite.test.ts`, inside the `A6` row,
0 production lines). Notes: `.grugops/context/qe-ABC-131/notes/` (decision `…7090a211`, observations
`…07d83577` and `…5e358534`, artifact-ref `…476bdc8f`).

| # | QE verdict | independent evidence |
|---|---|---|
| `A1` | MET | 58 rows, no seed 1982/1008/1424/1075. Corpus numstat 1/4 (the four rows, one comment). Shape 18 / 8 / 11 / 6 / 11 |
| `A2` | MET | Baseline 54/58, 25, 1. `unsolved` byte-identical; owner quote verbatim; `51fb4ca9` touches only that file. Three processes: 54/58, exit 0, 18 passed, no NEWLY line, per-row sha1 `11326e1c` ×3 (load1 10.58 / 7.50 / 6.82). Base: 58/62, 17 passed (load1 3.68) |
| `A3` | MET | Step 1.25 (19 of 24 readings): 54/58, 0 NEWLY-MISSED (load1 5.23). 1.3: the same. 1.35 (18 readings): 51/58, losing seeds 1, 69 and 1163 |
| `A4` | MET | 14/17 red; survivors red 7 of 10 (`W1`, `W1b`, `W2`, `W4`, `W5`, `W13`, `W16`); `W10`, `W11` and `W14` green. All 17 missed-row sets equal the engineer's. `W9` 44 vs the recount's 45 is confirmed to be `ABC-126`'s `discovered check` re-author |
| `A5` | MET | Headroom rows MISSED at 1x. 4x reads 58/58. `ABC-084` `A1`/`A2` green. `weakened` exit 1 (15/58) |
| `A6` | MET | Red first on misspelt, dropped-row and sum mutants. `QE-131-a` closed in the same row |
| `A7` | MET | `src/` diff = the three named files, no trigger-list file. Lint, typecheck, build exit 0. `npm test` 52 / 1608 (base 52 / 1608), skip 0, integrity and inventory `No findings.` |
| `A8` | MET | Green on 16 rows ×3. `M9` RED naming `discovered check: the bishop moves, Rxd8` (`[ 6 ]` vs `[ 4 ]`). Also red on `+N` removed, duplicated and lowered |

**Gaps.**
- `QE-131-a` (LOW): **closed** by `f994c724`. A repeated `unsolved` name kept the `A6` sum and the whole lane green. Now RED (`expected 3 to be 4`).
- `QE-131-b` (LOW): the baseline's `laneWallSeconds` has processes 1 and 2 swapped (`28.24 / 33.45` should be `33.45 / 28.24`, per the raw `Duration` lines). It is provenance only. The fix belongs to the next baseline-only commit, since QE is fenced from `src/` production files.
- `QE-131-c` (LOW): AGENTS.md's levels-lane comment ("246 moves", "35 vs 58 of 62") goes stale at merge. `src/levels.test.ts` reads `PUZZLES`, and at the tip the lane is green with 242 moves and 35/58 vs 54/58. The fix is 0 B, and it belongs to the Scribe with the `PUZZLE_DEEP` update.
- INFO:
  - `QE-131-d`: `A6` does not assert the run's misses (by design).
  - `QE-131-e`: `measuredAt` `506d80c` is red as committed, but its rows equal the tip's.
  - `QE-131-f`: the margin model is ≥ 26 % / ≤ 33 % growth on the tightest rows.
  - `QE-131-g`: `ABC-087` `A5` read a maximum of 4,780 ms of 5,000 under load.

**Owed:** the Orchestrator's board move and the merge. **The owner's UAT word** (non-test `src/`:
`src/puzzle-corpus.ts`, `src/puzzle-suite.baseline.json`). After merge, the AGENTS.md Scribe (`PUZZLE_DEEP`
and `QE-131-c`) and Security/NFR (`RISK-003`, `QE-131-f`).

### Delivery addendum: fix-forward `QE-131-b`

**2026-10-10, Software Engineer** (task `wave-2026-09-25`, subtask `fix-ABC-131`). Commit `b31ce2bb` on
`grugops/ABC-131-drop-edge-puzzles` touches only `src/puzzle-suite.baseline.json`, and in it only `laneWallSeconds`:
`28.24 / 33.45 / 28.97` → `33.45 / 28.24 / 28.97`, matching the raw `Duration` lines for processes 1, 2 and 3.
The oracle-row and process-real figures in that field were already in order and are unchanged. A key-by-key
JSON diff shows every other key byte-identical. Gates at `b31ce2bb`: lint, typecheck and build exit 0;
`npm test` 52/1608, 0 skipped; integrity `No findings.`. `PUZZLE_DEEP=1` once (load1 12.95 → 9.78): 54/58,
18 passed, exit 0, no NEWLY line, per-row sha1 `11326e1c`. **`A1`–`A8` still hold.** Not merged, not pushed.
Notes: `.grugops/context/fix-ABC-131/notes/`.
