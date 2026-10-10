---
id: 20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61
kind: observation
by: security-nfr
at: 2026-10-09T22:36:20Z
verified_by:
confidence: high
refs:
  - ABC-084
  - N8-LANE
  - NFR-008
  - ADR-0019
  - ADR-0027
  - src/puzzle-suite.test.ts
  - plans/nfr-catalog.md
  - .grugops/context/ticket-to-pr-ABC-084/notes/20261009T213713Z-software-engineer-observation-abc084-gates-criteria-baseline-n8lane-26f28829.md
supersedes:
---

# `ABC-084` readings: `N8-LANE` **+85 / +210 ms net** on two admissible sessions (the third was inadmissible, null 1.64 %). The `A6` oracle row costs **195 ms** CPU. `A5` reads **12.5–12.7 s** at load1 ≈ 7, **48.9 s** at load1 36–49, and **79.4 s** at load1 49–54. The last of these is a **false red**: the gate row timed out with 40/40 solved

Hand-authored and unsealed. Machine: Apple M3 (8 cores), Darwin 25.5.0, **Node v26.11.0**. The
catalog's reference is Node v24.12.0, so every absolute figure here is `UNKNOWN - verify`
against the reference. The deltas are paired, so they are the quantity the bar actually reads.
Raw files sit beside this note.

## `N8-LANE`: the row's own protocol

- **Arms.** Out-of-tree copies made with `git archive`, with `node_modules` symlinked:
  - **A** = `e426e91`, the build tip (50 files / 1539 tests);
  - **N** = a second copy of A, `diff -rq -x node_modules` clean;
  - **B** = `7b54dae`, the base (49 / 1530);
  - **R** = the remedy arm: A with the `A6` oracle `it` defined only when `PUZZLE_DEEP` is set
    (1538; diff in `raw-remedy-arm-R.diff.txt`).
- **Protocol.** Lane run as `npx vitest run --dir src`, with the runner invoked directly.
  `/usr/bin/time -p` CPU (user + sys). One fresh process per run. The order is rotated every round
  and round 0 is discarded. File and test counts are asserted on every run. The statistic is the
  median of paired per-round deltas, with the sign test beside it.
- **Load gate.** Before each round the harness waited until load1 < 6, or 90–180 s at most. That
  gave QE's lanes gaps to run in. Load1 and the number of foreign vitest processes were recorded
  before every run (`raw-harness-lane.mjs.txt`).
- **Net.** Gross minus **160 ms**, the floor for **one** added test file (`src/puzzle-corpus.ts`
  is not collected). **N8-SPAWN is 0**: the ticket spawns no child process.

| session (UTC) | rounds used | load1 before runs (min / median / max) | foreign vitest | null N − A | gross A − B (sign) | **net** | R − B gross (sign) | admissible |
|---|---|---|---|---|---|---|---|---|
| 1 (21:43–22:05) | 10 | 5.44 / 7.39 / 44.14 | 20 of 44 runs | **+0.62 %**, 6/10 | +245 ms, 6/10 | **+85 ms** | +245 ms, 6/10 | **yes** |
| 2 (22:05–22:16) | 8 | 5.13 / 7.72 / 13.6 | 19 of 36 | **+1.64 %**, 6/8 | +460 ms, 4/8 | (+300) | +5 ms, 4/8 | **NO: null > 1.5 %, not used** |
| 3 (22:17–22:29) | 8 | 5.64 / 7.46 / 14.67 | 36 of 36 | **+1.42 %**, 6/8 | +370 ms, 4/8 | **+210 ms** | +400 ms, 6/8 | **yes** (only just) |

There were 0 harness errors in 116 runs. The lane's medians on A were 25.1 / 25.4 / 26.1 s CPU
and 6.65 / 6.80 / 7.01 s wall.

**Reading.** On both admissible sessions the charge is **under 650 ms net**: +85 ms and
+210 ms. **The honest second sentence:** on the lane instrument, at the load this machine had,
the charge cannot be separated from zero. The signs are 6/10 and 4/8, and the per-round deltas
swing ±1–3 s. The same instrument resolved the build's runs in the same direction, at much higher
load. **Its charge falls with load:**

| source | load1 | net |
|---|---|---|
| build | 54 | +790 |
| build | 31 | +400 |
| build | 24 | +120 |
| this gate | 7.4 | +85 |
| this gate | 7.5 | +210 |

**Contention inflates the CPU of the same work.** Measured here: the same deterministic gating run
took **13.6–13.9 s** user CPU at load1 ≈ 7 and **19.9 / 33.4 s** at load1 36–54. So the build's
+790 ms at load1 54 is a contended reading, not the ticket's content. That is why the bar is read
on the quietest admissible sessions available.

## Supplement: the file's content, resolved (not the bar's instrument)

`raw-harness-onefile.mjs.txt`. Each file was run **alone** with `npx vitest run <file>`, 13 rounds,
rotated, round 0 discarded, at load1 7.3–8.6:
- **P** = `src/puzzle-suite.test.ts` as built (9 tests);
- **Q** = the remedy copy (8 tests);
- **E** = a one-assertion empty test file (1 test).

| pair | median CPU per round | sign |
|---|---|---|
| **P − E**: the whole file, net of the runner and the per-file cost | **+280 ms** | **12/12** |
| **P − Q**: the `A6` mate-oracle row | **+195 ms** | **12/12** |
| **Q − E**: everything else (corpus import, transform, shape, provenance, `A4` rows) | **+80 ms** | **12/12** |

This instrument resolves what the lane cannot. It is consistent with the build's in-vitest
attribution (rows 174–240 ms, oracle ~157 ms). **The content is about 280 ms against 650**, a
2.3x margin when uncontended.

## `A5`: gating run wall, measured with the load

Arm A, `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`, at budget 25 and step 1:

| UTC | load1 at start → end | condition | solved | wall (vitest / process) | exit |
|---|---|---|---|---|---|
| 22:29:57 | 7.8 → 7.2 | ambient (QE's 7 vitest processes) | 40/40 | 12.46 / 13.43 s | 0 |
| 22:30:10 | 7.2 → 6.8 | ambient | 40/40 | 12.71 / 13.64 s | 0 |
| 22:31:18 | 36 → 49 | plus 3 concurrent default-lane loops | 40/40 | **48.94** / 50.25 s | 0 |
| 22:32:08 | 49 → 54 | plus 3 concurrent default-lane loops | **40/40** | **79.40** / 81.43 s | **1: "Test timed out in 60000ms"** |
| 22:33:29 | 54 → 61 | `PUZZLE_DEEP=weakened` (`A3`), loops on | 10/40 | 49.26 s | 1, the correct red: `expected 10 to be >= 40` |

- **`A5` (≤ 60 s): MET at ambient load,** 12.5–12.7 s, a 4.7x margin. That agrees with the build's
  12.2–13.2 s.
- **Not met at load1 ≈ 50.** This machine read load1 up to 75 during the build today.
- **`A3` (≤ 60 s on its own): MET**, 49.3 s even under load1 54–61.

**The defect this exposes.** The gate row, *"the gate: solved >= the recorded baseline, in <= 60 s
(A5)"*, carries a **60 000 ms vitest timeout**. Under load it **goes red with the solved count at
the baseline**. Option B's rule is *"red = QE FAIL"*, so an unchanged engine fails QE because the
machine was busy. The red text differs ("Test timed out" against "expected N to be >= 40"), but
the owner's rule does not distinguish them.

This is the case `plans/nfr-catalog.md` rules out in the suite: *"No wall-clock assertion belongs
in the suite: it would be a test that passes or fails on the machine that runs it."* Hang-guard
timeouts are the project's precedent: `src/engine.test.ts` uses 30–300 s on deep rows. A timeout
named and sized as the criterion is not a hang guard.

## The remedy the brief names (move the `A6` oracle row to `PUZZLE_DEEP`)

- **Not required.** The bar is met without it (+85 / +210 ms net, content about 280 ms).
- **What it would save:** about **195 ms** CPU (the supplement). On the lane instrument the R arm
  is not separable from A (R − B +245 / +400 gross against A − B +245 / +370).
- **What `A6` would lose in the default lane:**
  - The only check that the mate rows' answers are **the rules' answer and not the engine's**.
    The check is that each accepted set **equals exactly** the set of first moves that mate in 2
    (by an exhaustive search over `legalMoves` / `makeMove`), and that no row has a mate in 1.
  - The deep lane's `A1` cannot stand in for it. `A1` only checks that the engine picks *an*
    accepted move, so an over-broad accepted set **loosens `A1` silently**.
  - **`src/puzzle-corpus.ts`, `src/legal.ts` and `src/apply.ts` are not on option B's trigger
    list.** So once the row moves, a corpus edit or a move-generation change runs no mate oracle
    at all unless someone opts in.
  - Kept as it is, the oracle re-proves the keys on every `npm test`.
- **Recommendation: keep the row in the default lane.**

## `NFR-008` total: second order, reported, not ruled

- **Base lane:** 24.9–26.0 s CPU and 6.5–7.2 s wall (B medians, load1 median about 7.5), on Node
  v26.11.0 and not the reference v24.12.0.
- **Clauses:** 15 s CPU and 3 s wall. Both readings are far above them, as the `ABC-082` gate
  already flagged to `ADR-0019`'s owner (`…cd2e14c1`).
- **This ticket adds +0.25–0.37 s gross CPU** to an overdrawn total. By the catalog's 2026-08-19
  reading, `N8-LANE` is a rate limit, not a grant.
- **Not this gate's to rule.** It stays with Architect/Design (`ADR-0019`, the floor account) and
  with the owner for the level.
