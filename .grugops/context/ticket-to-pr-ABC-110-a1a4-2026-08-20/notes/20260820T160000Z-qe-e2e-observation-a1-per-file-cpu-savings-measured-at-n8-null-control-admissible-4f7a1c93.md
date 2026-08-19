---
id: 20260820T160000Z-qe-e2e-observation-a1-per-file-cpu-savings-measured-at-n8-null-control-admissible-4f7a1c93
kind: observation
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T16:00:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A1
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - ADR-0008
  - ADR-0014
supersedes:
---

# `A1` — the per-file all-in CPU saving is MEASURED for eight candidate files. **Identity null control `-0.34%` at sign 6/8 — ADMISSIBLE, and recorded before any treatment was looked at.** The quantity `ADR-0014` marked `UNKNOWN - verify` now has numbers

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install
(`AGENTS.md`). Confidence `high` on every paired delta below; the one figure I label INDICATIVE is
labelled INDICATIVE.

## Anchor, instrument and tree — stated, not implied

**Anchor: `54cbb23`**, the commit `ADR-0014` and `ABC-110` ruled against — **NOT `main` @ HEAD.**
That is a deliberate choice and it is the one that makes the arithmetic mean anything: the 1.480 s
deficit was measured at `54cbb23`, and `main` has since taken on `c2c5da1`/`eb43572`/`bd9c414`
(+987 lines in `src/cli.test.ts`), so a measurement at HEAD would price files against a lane that is
no longer the lane the deficit was computed for. **The lane at `main` HEAD is LARGER than the lane
measured here and every saving below is therefore a floor, not a ceiling.** Anyone who needs the
HEAD figure must re-measure; I did not, and I am not implying it.

Trees are `git archive 54cbb23` copies under a scratchpad **outside the repository**, `node_modules`
symlinked into each (**disclosed deviation, inherited from every prior lane reading on this
project**). `AGENTS.md` is tracked and came with the archive, so **the second inherited deviation —
5 `src/cli.test.ts` `ENOENT` failures — does not arise, and that is a difference from the inherited
reading rather than a silent repeat.** `N8-SPAWN` stays **0 ms**: nothing was run in the repository
and the harness is not committed. `vitest.config.ts`'s worktree trap does not arise — `git archive`
emits tracked files only, `.claude/worktrees/` is untracked, and **every run asserted 39 files**.

CPU = `user + sys` from `/usr/bin/time -p`, one fresh OS process per run, condition order **rotated
every round**, **10 rounds with round 0 discarded and rounds 1–8 taken, n = 8**, per-run file/test/
skip counts read from vitest's own JSON reporter and asserted. **Deviation, disclosed: the JSON
reporter is on for every run in every condition.** It is common-mode across a paired design, and the
baseline check below shows it costs nothing detectable.

**Baseline tripwire — MET on every single run of all 27 conditions × 10 rounds: 39 files / 1181
tests / skip 0 / exit 0** at condition `A`, and the removal conditions asserted their own reduced
counts (listed per condition below). **There were no harness errors and no run was discarded for a
count mismatch.**

**The baseline reproduces the ruled figure to the millisecond.** A single out-of-tree run at low load
read **CPU 14.48 s** (user 13.17 + sys 1.31), wall 3.28 s — against Architect/Design's ruled
**14.480 s**. That is a coincidence to three decimals and I do not claim it as more than a strong
reproduction, but it is the reason I am confident the instrument is the same instrument.

## Machine — and the `UNKNOWN - verify` that goes with it

Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 / Node v24.12.0 / vitest 3.2.7 —
**identical to the ruling hop's.** **`UNKNOWN - verify` on any other hardware.**

## THE NULL CONTROL, RECORDED FIRST — phase 1, run and written down before a single treatment tree existed

`A` and `N` are `git archive` copies of the same commit, verified byte-identical by
`/usr/bin/diff -r --exclude=node_modules` (no output). n = 8, rotated, round 0 discarded.

```
condition    n   median CPU   median WALL   files/tests
A            8    14.635 s      2.820 s     39 / 1181
N            8    14.575 s      2.765 s     39 / 1181

IDENTITY NULL CONTROL  N-A  paired median  -50 ms  =  -0.34% of A
                            per round (ms): -100  +180  -400  -10  +180  -60  -40  -300
                            sign 6/8 negative  ->  two-sided binomial p = 0.289, AT CHANCE
                            |-0.34%| <= 1.5%   ->  ADMISSIBLE
```

**This is a precondition that was satisfied before the treatment was looked at, not a post-hoc
comfort.** Phase 1 was a separate harness invocation whose only conditions were `A` and `N`; the
treatment trees were built by a later invocation. The order is a fact about the procedure, not a
claim about my attention.

## `A1` — THE PER-FILE MEASURED SAVINGS. Phase 2, n = 8, paired median CPU delta

Nine conditions (`A` plus eight single-file removals), rotated every round, 10 rounds, round 0
discarded, rounds 1–8 taken. Phase-2 `A` median CPU 15.485 s (this phase ran at a higher load than
phase 1 — see the sizing section; the paired statistic is what is quoted and it is load-robust).

| file removed | tests in it | **measured saving (paired median CPU)** | sign | condition counts asserted |
|---|---|---|---|---|
| `src/engine.test.ts` | 24 | **1.400 s** | 8/8 | 38 / 1157 |
| `src/perft.test.ts` | 24 | **1.055 s** | 8/8 | 38 / 1157 |
| `src/history-pane.test.ts` | 26 | **0.775 s** | 8/8 | 38 / 1155 |
| `src/san.qualifier.hardening.test.ts` | 20 | **0.590 s** | 8/8 | 38 / 1161 |
| `src/search.test.ts` | 28 | **0.585 s** | 8/8 | 38 / 1153 |
| `src/san.test.ts` | 22 | **0.510 s** | 8/8 | 38 / 1159 |
| `src/search.qe.test.ts` | 6 | **0.405 s** | 7/8 | 38 / 1175 |
| `src/turn-loop.nfr.test.ts` | 4 | **0.395 s** | 7/8 | 38 / 1177 |

Per-round deltas for every cell are in `raw-phase2-per-file-treatments.tsv` beside this note. Two
cells are sign 7/8 rather than 8/8 (`search.qe`, `turn-loop.nfr`) — both single positive rounds are
+260 ms and +370 ms, the same magnitude as the null control's largest excursion (+180 ms), and both
files' medians are still ~2.5x the null control's spread. **Reported, not smoothed.**

## THE RESULT THAT VINDICATES `A1`'s INADMISSIBILITY RULE — in-worker time neither predicts NOR bounds the saving

`ADR-0014`'s `observation` note published per-file **in-worker** times and said in as many words that
they price nothing. **They do not, and now that is measured rather than asserted.** In-worker times
below are my own, from one run at `54cbb23`, and are **INDICATIVE ONLY — a per-file in-worker time is
INADMISSIBLE as a saving under `A1` and none of these is reported as one.**

```
file                              in-worker (1 run)   MEASURED saving   saving MINUS in-worker
engine.test.ts                        1130 ms            1400 ms            +270 ms
perft.test.ts                         1392 ms            1055 ms            -337 ms   <-- OVER-predicts
history-pane.test.ts                   334 ms             775 ms            +441 ms
san.qualifier.hardening.test.ts        465 ms             590 ms            +125 ms
search.test.ts                         333 ms             585 ms            +252 ms
san.test.ts                            175 ms             510 ms            +335 ms
search.qe.test.ts                      295 ms             405 ms            +110 ms
turn-loop.nfr.test.ts                  200 ms             395 ms            +195 ms
```

**In-worker time UNDER-predicts the saving for 7 of 8 files and OVER-predicts it for 1.** There is no
constant, no ratio and no direction to correct it by. A remedy that had picked candidates off the
in-worker table would have ranked `perft` first (it is second) and `san.test.ts` seventh (it is
sixth, and it beats two files with more in-worker time than it). **`A1`'s rule that an inferred
saving is inadmissible is not procedural fussiness; the inference is wrong by up to 3x in both
directions on this lane.**

## Sizing the contamination — **quiet was NOT available, was NOT claimed, and the paired statistic does not need it**

`ABC-108` `A1` was ruled unsatisfiable for this lane and I did not retry it. Loads observed across
this hop, recorded before every run:

```
phase 1 (null)        min  6.72   median  9.68   max 15.46
phase 2 (per-file)    min 10.56   median 14.21   max 22.52
phase 3 (joint)       min  9.12   median 11.60   max 13.56
```

**Higher than the ruling hop's, and I am not going to dress that up: my harness runs conditions
back-to-back with no idle gap, so it drives its own load.** What makes the reading usable is that the
statistic is a **within-round paired delta between conditions run adjacently under the same load**,
not an absolute. **The load sensitivity of the paired delta was measured rather than assumed**, by
splitting each condition's eight rounds at the median load of its own phase:

```
                      low-load half   high-load half   spread   as % of the delta
NULL CONTROL  N-A          -55 ms          -50 ms        5 ms         10.0%  (of 50 ms)
JOINT  engine+perft      -2550 ms        -2600 ms       50 ms          2.0%
JOINT  engine+search+qe  -2505 ms        -2500 ms        5 ms          0.2%
JOINT  4-file            -3790 ms        -3920 ms      130 ms          3.4%
single files (worst)     -925 ms         -665 ms       260 ms         33.5%  (history-pane)
```

**The absolutes move with load and the paired deltas barely do.** Condition `A` itself read 14.415 s
at load 8.66 and 14.760 s at load 13.70 in phase 1 — a 2.4% swing — while the null control's paired
delta moved 5 ms across the same split. **Single-file deltas carry the most load sensitivity (up to
33% of the delta, over a 1.7x load swing) and the joint-set deltas — the ones any recommendation
rests on — carry 0.2–3.4%.** The direction of the residual sensitivity is **conservative**: for 6 of
8 single files the saving reads SMALLER at high load, so a loaded machine under-states the saving
rather than inventing one.

**What this does NOT establish:** it is not a claim of a quiet machine, and it is not a bound on any
machine but this one.

## What this observation does NOT establish

- **Not a wall-clause verdict, in any direction.** Wall figures are recorded in the raw TSVs and in
  the `A2` note as data. `NFR-008`'s wall clause is routed to its own ticket in this wave and I did
  not rule it, did not settle warm/cold, and did not read `J2`'s lower wall as evidence about it.
- **Not a re-derivation of `N8-LANE`'s 5%**, which I did not touch, and **not a re-cut of any
  ticket's 650 ms line**.
- **Not a proposal to change `isolate`.** `ADR-0008` decision 7 stands; I did not measure it, did not
  re-test it, and I am recording that I did not so the fifth write-down does not become a sixth.
- **Not a figure at `main` HEAD.** See the anchor section.
- **Not a move of anything.** `src/` is byte-identical across this hop; no file changed lane; no
  level, bar, floor or account moved. **`plans/nfr-catalog.md` is untouched — verified in the `A2`
  note, not promised here.**
