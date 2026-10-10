---
id: 20261010T150202Z-qe-e2e-observation-abc136-ledger-pins-spans-gate-cost-2f217343
kind: observation
by: qe-e2e
at: 2026-10-10T15:02:02Z
verified_by:
confidence: high
refs:
  - ABC-136
  - ABC-057
  - ADR-0011
  - ADR-0035
  - R5b
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - 20261010T150202Z-qe-e2e-decision-abc136-verdict-pass-with-gaps-b5b3f575
supersedes:
---

# `ABC-136` QE readings: ticket ledger reproduced, pins carry their own kills, 6 gate-clean narrowings survive, spans identical, gate green, cost inadmissible

This note is hand-authored and unsealed.

## Setup

- **Machine:** Apple M3, Node v26.11.0. A second QE agent was running puzzle lanes, so load1 is logged for every run.
- **Trees:** one fresh `git archive` per build, with `node_modules` linked.
- **Raw files:** `../probe/`. The index is `RUN.txt`.

## 1. The ticket's ledger, base `c715b3c2` → tip `520fa185`

Source: `ledger-ticket.tsv`, run 14:53:07Z–14:53:53Z, load1 4.2 → 5.6.

| build | base | tip (first failing message) |
|---|---|---|
| CONTROL | 0, 12/12 | 0, 12/12 |
| QSCAN-NARROW+FMT (and +WPERFT-STATIC) | 0, 12/12 | **1**, tripwire ("scans EVERY production module") |
| QLHS-INTERSECT+FMT (and +WPERFT-STATIC) | 0, 12/12 | **1**, tripwire ("scans EVERY…"; Biome rewraps to `production\n      .filter`) |
| QSCAN-NARROW / QLHS-INTERSECT, unformatted | 0 / 0 | **1** ("scans EVERY…") / **1** ("compares EVERY runtime importer") |
| M15+FMT, M15SUB+FMT | 1, tripwire | 1, tripwire ("an EQUALITY") |
| WLAUNDER / WSTALELICENCE / WPERFT-STATIC | 3 / 1 / 1 | the same tests by name |
| QMOVE-COMMENTED-M15 | 0 | 0 (the accepted residual) |

## 2. Pin isolation: each pin is deleted in turn on the tip

Source: `ledger-qe.tsv`.

- **Scan pin deleted:**
  - `QLHS-INTERSECT+FMT` (and `+WPERFT-STATIC`) still exits 1, on "compares EVERY runtime importer".
  - `QSCAN-NARROW+FMT` exits 0. So the scan pin alone carries `A1`.
- **Importer pin deleted:**
  - `QSCAN-NARROW+FMT` and `QLHS-INTERSECT+FMT` exit 1.
  - Unformatted `QLHS-INTERSECT` exits 0. So the importer pin alone carries the unformatted `A2` mutant.
  - `QLHS-INTERSECT+FMT` is double-covered.

## 3. QE's own narrowings (tip; lint is `biome check src`)

**Red (the pins hold):**
- `XSCAN-SLICE` (`.slice(0, -1)` on the scan line).
- `XRENAME-SCAN` (narrowed through an `allModules` intermediate binding), plain and `+WPERFT-STATIC`.
- `XLHS-AND` (`&& file !== …` inside the importer filter), plain and `+WPERFT-STATIC`.
  - These three red on "scans EVERY…".
- `XRENAME-PRODUCTION` (a harmless rename) reds both the guard and the tripwire. This is the accepted over-pin.
- `XDIR-NARROW` (`directory` → `./__snapshots__/`) reds the guard itself: "expected [] to include 'history-pane.ts'".
- A short dead copy reds, because Biome refolds it.

**Green, gate-clean:** lint 0 with 0 warnings, `tsc` 0, and the full suite with `+WPERFT-STATIC` passes 52 files / 1608 tests.

| mutant | what it does | where |
|---|---|---|
| `XSPLICE` | `runtimeImporters.splice(0, n, ...runtimeImporters.filter(licensed))` as a new statement after the importer statement | between the operands and the comparator |
| `XHELPER-NARROW` | clause 1's `productionModulesIn` excludes `perft-bench.ts` | `:163-164`, unpinned |
| `XSHADOW-HELPER` | a local `productionModulesIn` that narrows | inserted before the scan pair |
| `XSHADOW-READ` | a local `readFileSync` that blanks `perft-bench.ts` (plus an `as readText` import) | inserted before the scan pair |
| `XLICENCE-PUSH` | `(LICENSED_DRIVERS as string[]).push("perft-bench.ts")` | before the scan pair; the RHS, not an operand |
| `XDEAD-COPY2` | `QSCAN-NARROW` live, with the pinned pair kept verbatim in an uncalled `_pinnedGuardCopy` | the comment residual, made live code |

Each of these is also green at base. No kill was traded.

## 4. Spans, counts, phrases and the `biome-ignore`

- **Spans:** `spansqe.py` reads identically at base and tip on all 7 rows, and equals QE-057's recorded hashes (`licence-it-body` `33e2691d32c0f775`, …).
- **Counts:** the framed scan pair, the importer statement and the `toEqual` line each count 1 at base and at the tip. So does every planter anchor.
- **Raw-reader fence:** the added lines spell neither `const LICENSED_DRIVERS` nor `const COMPOSITION_ROOT` (0 hits).
- **Phrases** (collapsed text):

  | phrase | base | tip |
  |---|---|---|
  | "a hop that widens the guard reds this test" | 1 | **0** |
  | `R5b` | 0 | 2 |
  | "not tamper-proof" | 0 | 1 |

  Inside the tripwire's `//` comment alone, `R5b`, `productionModulesIn`, `runtimeImporters` and "not tamper-proof" each occur once.
- **`biome-ignore`:**
  - `XNOIGNORE` gives 1 warning, at `:500`, on the pinned literal.
  - `XIGNORE-LEAK` flags the next statement at `:503` and not the ignored literal.

## 5. A5 and the gate at `520fa185`, in QE's worktree

- **A5 diff:** `git diff --name-only c715b3c2..b50b0e2b` lists `src/history-pane.nfr.test.ts` only.
  - +16/−2, of which 6 added lines are not comments.
  - Base..tip adds the ticket, the traceability row and `.grugops/`.
- **Gate:** 14:59:11Z–14:59:34Z, load1 12.3 → 15.5.
  - lint exit 0: 100 files, no diagnostics.
  - typecheck and build exit 0.
  - `npm test` exit 0: 52 files / 1608 passed.
  - skip count 0; integrity `No findings.`
  - `lane-inventory.js`: 52 = 52, `No findings.`

## 6. Cost (`ADR-0035`, proposed)

Narrow set `src/history-pane.nfr.test.ts`, base / head / twin, 9 rounds with round 0 dropped. The twin is `diff -r -x node_modules` identical.

| set | load1 median | twin CPU | head − base CPU | admissible |
|---|---|---|---|---|
| 1 | 14.50 | +0.034 s (+1.73 %) | +0.051 s, interval −0.026..0.082 | no |
| 2 | 13.26 | +0.033 s (+1.92 %) | +0.076 s, interval −0.157..0.282 | no |

- **Both sets are INADMISSIBLE.** No claim is made.
- **Reported only:**
  - Every reading is far under `N8-LANE`'s 650 ms.
  - The in-process micro-timing of the two added `includes` calls is 0.37 µs per pair (load1 14.49).
