---
id: 20260815T112800Z-qe-e2e-observation-n8-lane-measured-with-the-null-control-6d2fa374
kind: observation
by: qe-e2e
at: 2026-08-15T11:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# `N8-LANE` measured independently, WITH the identity null control the engineer flagged as missing

**I am not ruling on `G1`.** The bar's reading is Security/NFR's on this ticket and
`plans/nfr-catalog.md` / `ADR-0008` are owner-ratified — **I edited neither and moved no target.**
The subtask asked for an independent number because the engineer flagged its own as *"not a fully
admissible `N8-LANE` measurement"* for want of an identity null control. Here is that number, with
the control.

## Protocol

Four conditions per round, **order rotated every round**, one fresh OS process per run, **round 0
discarded**, n = 7. CPU is `user + sys` from `/usr/bin/time -p` over the whole process tree —
`N8-LANE`'s own instrument (*"CPU (user + sys) of the default lane. NOT wall."*). `PERFT_DEEP` unset.

| condition | what it is |
|---|---|
| **W** | the delivered tree — **30 files / 856 tests** |
| **X** | `--exclude src/cli.test.ts --exclude '**/node_modules/**'` — **29 files / 827 tests**, verified to be exactly the merged lane by file *and* test count |
| **W2** | a byte-identical rerun of **W** — **the identity null control** |
| **F** | **W** plus one trivial extra test file — measures the **per-file floor** empirically instead of importing 160 ms from the catalog |

The tree was verified `git status --porcelain` **clean** at the end of the whole sweep, so W and W2
really were byte-identical conditions; the floor file was created and deleted inside `F` only.

## The readings (ms CPU)

| round | W | X | W2 | F | dW = W−X | dNull = W−W2 | dFloor = F−W |
|---|---|---|---|---|---|---|---|
| 0 *(discarded)* | 10560 | 9230 | 10810 | 10940 | 1330 | −250 | 380 |
| 1 | 10810 | 9470 | 10670 | 10910 | **1340** | 140 | 100 |
| 2 | 10780 | 9290 | 10910 | 10920 | **1490** | −130 | 140 |
| 3 | 10850 | 9620 | 10860 | 10990 | **1230** | −10 | 140 |
| 4 | 10990 | 9500 | 11100 | 11140 | **1490** | −110 | 150 |
| 5 | 11190 | 9740 | 11300 | 11200 | **1450** | −110 | 10 |
| 6 | 10940 | 9730 | 11050 | 11220 | **1210** | −110 | 280 |
| 7 | 10980 | 9590 | 11180 | 11380 | **1390** | −200 | 400 |

## The result

```
median dW      (treatment)   1390 ms CPU      sign test 7/7 positive
median dNull   (CONTROL)     -110 ms CPU      <- the instrument's own noise floor
median dFloor  (per file)     140 ms CPU      measured here, not imported
treatment / |null|           12.6x

NET = 1390 - 140            = 1250 ms CPU
N8-LANE bar                 =  650 ms CPU
                            = 1.92x  ->  BREACHED
NFR-008 lane total  median W = 10.94 s against the 13 s CPU clause -> HOLDS
```

**The null control is the point of this run.** Two byte-identical conditions differ by a median of
**−110 ms** — small, and slightly negative because the later run of a pair sits marginally warmer.
The treatment effect is **12.6x** that magnitude and **7/7 signed**. So the 1250 ms is attributable
to `src/cli.test.ts` and not to ordering, drift or load. That is the arm the engineer said its own
reading lacked, and it does not change the conclusion.

**Independent agreement with the engineer, on a differently-built instrument:**

| | engineer | me |
|---|---|---|
| gross delta | 1400 ms | **1390 ms** |
| per-file floor | 160 ms *(imported from the catalog)* | **140 ms *(measured)*** |
| net | 1240 ms | **1250 ms** |
| null control | none | **−110 ms, 12.6x separation** |

Ten milliseconds apart on the net figure, from two separately written harnesses. **`N8-LANE` is
breached at 1.9x and the figure is not in doubt.**

## What I add to the causal account, and what I do not

I did **not** re-derive the engineer's per-child decomposition; I have no reason to doubt it and
re-measuring it would not change the bar. What I can confirm from my own side:

- **The ten children are the cost.** `src/cli.test.ts` runs its 29 assertions in **12 ms**; its
  *collect* phase — where all ten children are spawned at module scope — is **~815 ms** of a ~970 ms
  single-file run. The assertions are free; the processes are not.
- **The spawn count is genuinely forced by the criteria**, which I verified against the ticket rather
  than against the engineer's note: `A1` names the bare `npm run <name>` (1), `A4` names three colour
  runs (3), `A5` end-to-end (1), `A6`(iii) names four argvs *verbatim* (4), bar 3 says **"spawn
  once"** (1). That is 10, and no two of them can be merged without changing what a criterion says.
- **My arming added zero to this.** Interleaved delivered-vs-armed CPU for the file alone:
  `−20 / 0 / +50 ms`, inside the noise floor.

## The limit on this reading, stated

This is a **loaded** machine: a Security/NFR hop was live in this repository throughout, on the same
8 cores. Load pushes the absolutes **up**, which makes W, X, W2 and F all conservative — and the
**paired, rotated, null-controlled deltas are exactly the design that survives that**, which is why
the catalog specifies them. I did not attempt an idle-machine reading and do not claim one.

**No target, bar, level or measured figure was moved in `plans/nfr-catalog.md` or `ADR-0008`. I did
not open either file for writing.** A needed change is a recorded reason, and this note is it.
