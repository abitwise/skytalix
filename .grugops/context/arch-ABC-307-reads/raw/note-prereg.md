# arch-ABC-307-reads PREREG: the mutant list per row, what counts as killed and what would change a form, sealed before the first run

Architect/Design, task `arch-ABC-307-reads`. This note is sealed and committed before any test, build or engine run of this hop. Dry anchor checks only have been made: every anchor below applied exactly once and restored `cmp` 0, with no test run.

## Base and copy
- Base: `main` `8d66a706`. Two `git archive` copies, `<scratch>/arch307/base` and `<scratch>/arch307/tip`, with `node_modules` linked. Nothing is written to the repository's `src/`, `tools/` or `data/`.
- `tip` holds the remnants as `raw/tip.py` writes them, from `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307`) and its SE build lines.
- Every run is `flock <scratch>/host-test.lock taskset -c 0 …`, with `VITEST_MAX_WORKERS=1`: one core, one run at a time.
- Scripts, sha256 prefix: `mut.py` eac26ea2, `tip.py` f8d54043, `plants.py` e993fc0f, `lane.sh` 2e03fd97, `sweep.sh` 68283ba8, `tlines.sh` 220bab6c, `summ.py` 3a8544ff, `b1-k.mjs` cac133a9, `mb1.json` 8ea3c0b3, `frozen-mutants.json` 9cbf279f (`qe-ABC-244`'s, verbatim). Plant set: sha256 17826ac6.

## The list
**Whole default lane at base and tip, plus the row's `-t` line at the tip (20 `src`/`data` mutants, `raw/mut.py`):**

| row | its own mutant | also read |
|---|---|---|
| L1 | ML1 | M6, M7 |
| L2 | S241M2 | QMATCH1 (the guard leaves the remnant; named holders) |
| L3 | S241M1 | S241M2, S241M4; and `ABC-241` A7's eight: F230, M2s, M4, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1, S241M1 (the five seam-side kills leave the remnant; named holders) |
| C1 | MC1 | M6 |
| C2 | MC2h | P2a, P2b (the guard leaves the remnant; named holders) |
| B1 | MB1 | M4, M4z |

- QPRIOROFF is the same plant re-anchored on today's `chooseMove` literal, as `arch-ABC-302` did. ML1, MC1, MC2h, P2a, P2b and MB1 are written from `ADR-0046`'s table. MB1 keeps 1. e4's e7e5 and c7c5.
- Named holders: `cli` "A4 (slice)", `uci` "A5 (slice)", `cli` `ABC-230` A1, `uci` A4; for P2a and P2b `ABC-221`'s "A11 — busy isready in the mode" and the `HARD_CEILING_MS` pins.

**The trio (Q1–Q3), `raw/plants.py`, the one test file at base and tip, and with `ENGINE_DEEP=1` at the tip where a trio row kills at base.** Only `tools/grugops/qe-hop-integrity.test.ts` imports the tool (`grep`), so that file is the whole default lane's reach for a tool plant.
- `ABC-154`'s own: `q4a-readNotes-unfiltered-drops-secnfr`, `…-drops-quality-gate`, `q4b-both-memos-empty (two faults)`.
- The rest of `ABC-154` `A2`'s set, loaded not retyped: the 22 recorded plants and `plants4.py`'s other plants.
- `QE-154-a`'s `q5x` four and `plants6.py`'s four deterministic `q5` tool plants. The three random-half plants are left out: they read differently on each run.
- This row's own: MQ2, MQ3.
- `q4b` at the tip: the memos stay under the constant, so `q4b-tip-named-read-empty`, `q4b-tip-copied-root-empty` and `q4b-tip-both-empty (two faults)` are its re-anchoring on what the remnants read. The memo plants themselves are also read at the tip, on the deep rows.
- **A5R is a sentinel, not a mutant:** any unfiltered `readNotes` of the real tree throws. The tip's default run must read 0 red.

## What counts as killed
- A mutant is killed by a row when the run's JSON report has that row `failed`. A suite error counts for every row of that file and is recorded as a suite error.
- **A report that is absent or empty is UNREAD, never 0 killers.** It is re-run once. An UNREAD after that, or a run-bounded exit 124, is recorded as such and is not a kill of any named row.
- A report whose total differs from its control, with no suite error, is UNREAD.
- The three unmutated control lanes at each of base and tip must be green with 0 skipped before any mutant reading stands. A tip lane red unmutated is a fault in the sketch, fixed before any mutant runs, and recorded.

## Procedure
1. `b1-k.mjs` reads k on the unmutated tree: the smallest k with three distinct replies. `tip.py` is then re-run with it. k is a parameter, not a redesign.
2. Controls: three lanes at base and three at tip. Each moved row's `-t` line at the tip: "1 passed". Counts by `vitest list`, with and without the flag, for the three deep files. Whole deep lanes are not run: `uci-session`'s holds real-clock rows of minutes.
3. `sweep.sh` over the 20. `plants.py` over the trio's set.
4. Kept ms: each row's in-thread `duration`, median of the three controls, base for the row and tip for the remnant. Ungraded. This one-core, one-worker figure is not the census's.

## What would change a form
**A row stays S when all of these hold:**
- (a) its remnant is among the tip's default-lane killers of its own mutant;
- (b) each listed mutant the base default lane kills is killed by the tip's default lane;
- (c) where the remnant is not the killer by design, a named holder is, or another staying row is, and that row is then named;
- (d) its `-t` line prints "1 passed" unmutated, and "1 failed" under each listed mutant the full row kills at base.

- If a row's own mutant is not killed by the full row at base, it is not that row's mutant: the next listed mutant the full row kills takes its place in (a), and this is recorded.
- For the trio, (a) is: MQ2 for Q2, MQ3 for Q3, and `ABC-154`'s two `q4a` plants for Q1. Over every plant the base file kills, the tip file kills it too (per plant).
- A plant or mutant the base default lane does not kill leaves parity, and is recorded.
- **A miss** of (a) or (b): the remnant is redesigned once, and that is recorded and re-read. C1's fallback to the page's form, which `ADR-0046` already names, is that one redesign unless the draws fail to straddle, which is the ADR's own branch.
- **A second miss means the row must go K or W. I do not decide that: it goes to the Orchestrator**, as does any (b) with no holder under any form.

## The slack
- **K:** the K rows' § Scope ms against 113. L3 with B1, or L3 with C2, is past it (`…f86e0257` 2).
- **The sum with every row S:** saved is base minus kept, in this read's ms, scaled to the census by 750 ÷ Σbase. One in-thread ms saved is about 0.37 ms realised (`ADR-0046`), so −0.215 s needs **581 ms saved of 750, or kept ≤ 169**, at that scale. Below 581 is past the slack and goes to the Orchestrator. It is a forecast, graded only by `A9`.

## Budget
At most 40 minutes inside the lock, tallied per run. At 36 minutes the sweep stops and what is unread is said. Nothing is left running.

## Row 10
It closes only if all nine rows stay S under the rules above and the sum is inside the slack.
