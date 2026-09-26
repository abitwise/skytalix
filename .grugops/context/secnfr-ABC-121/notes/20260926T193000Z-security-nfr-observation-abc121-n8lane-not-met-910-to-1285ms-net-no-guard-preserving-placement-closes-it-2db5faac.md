---
id: 20260926T193000Z-security-nfr-observation-abc121-n8lane-not-met-910-to-1285ms-net-no-guard-preserving-placement-closes-it-2db5faac
kind: observation
by: security-nfr
at: 2026-09-26T19:30:00Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - N8-LANE
  - NFR-008
  - N8-SPAWN
  - ADR-0019
  - ADR-0026
  - AR-N8LANE-078
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204300Z-software-engineer-observation-abc121-n8lane-rehop-1575ms-gross-1415ms-net-still-over-e4d6fcc8.md
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204200Z-software-engineer-observation-abc121-default-lane-ledger-23-of-23-placement-20-of-23-proposal-17a0830d.md
  - .grugops/context/qe-ABC-121/notes/20260926T005900Z-qe-e2e-decision-a4-chooseMove-saving-does-not-weaken-catch-not-applied-b2f12ced.md
  - .grugops/context/secnfr-ABC-121/notes/raw-harness-build.mjs.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-harness-mutants.mjs.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-run1-run.log.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-run1-summary.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-run3.tsv.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-run3-summary.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-mutants-F.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-out-mutants-G.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-diff-A-to-F.txt
  - .grugops/context/secnfr-ABC-121/notes/raw-diff-F-to-G.txt
supersedes:
---

# `N8-LANE` at `ada4093`: NOT MET, **+910 to +1 285 ms CPU net** against 650 ms on this gate's own readings. No placement that keeps every guard red reaches 650

Hand-authored, unsealed. **Confidence is medium, and the reason is load.** The harness itself
pushes load1 to a median of 14–18 (range 3.5–29), and in this session's sibling hops CPU-seconds
are not work-invariant on this 4P+4E M3 (`…e1e4a69f`). The protocol was followed exactly. The
paired deltas are the robust part, and the absolute totals are indicative only.

## Instrument (`NFR-008` § `N8-LANE`, unchanged)

- The lane is `npx vitest run --dir src`, one fresh OS process per run, invoking the runner
  directly (the bar's stated form; the `npm test` wrapper is not a lane file).
- 13 rounds with the arm order rotated, round 0 discarded, so n = 12.
- Test-file and test counts are asserted on every run.
- CPU is user + sys from `/usr/bin/time -p`.
- The harness is the build's `rehop-lane.mjs` copied with only the scratch path changed
  (`raw-harness-lane.mjs.txt`).
- Every arm is a `git archive` outside the repository with `node_modules` symlinked, the
  disclosed deviation every lane reading here has carried. `AGENTS.md` is in every arm, because
  `src/cli.test.ts` reads it.

| arm | tree | files / tests |
|---|---|---|
| **A** | `ada4093`, the reviewed tip | 48 / 1 466 |
| **N**, **NG** | `/usr/bin/diff -rq`-identical twins of A and of G | — |
| **B** | `ada4093` with `src/` replaced by `main` (`26c0fe0`) `src/`, so the lane without this ticket. `main`'s `src/` is byte-identical to the build's base `15c6eb0` | 47 / 1 446 |
| **F** | A with both `A4` rows' reference search, and the two reference-equality `expect`s, removed. The literal pin `[95, "h5e5"]` and the re-search assertion are kept (`raw-diff-A-to-F.txt`) | 48 / 1 466 |
| **G** | F plus the PVS bite (`it`) and the whole `A5` describe gated on `SEARCH_DEEP` (`raw-diff-F-to-G.txt`) | 48 / 1 464 |

## Readings

| run | load1 median (range) | null control | A − B gross → **net** | F − B | G − B |
|---|---|---|---|---|---|
| 1 (B,A,N,F) | 17.2 (3.9–29.3) | N − A **+95 ms (0.41%)**, sign 8/12: admissible | +1 195, 12/12 → **+1 035** | +945, 12/12 → **+785** | — |
| 2 (B,G,NG,A) | 13.6 (3.5–19.3) | **none admissible**: the G/NG build had an empty `describe`, and vitest fails that file. The harness refused all 26 G/NG runs | +1 070, 12/12 → **+910** (corroboration only) | — | invalid |
| 3 (B,G,NG,A) | 17.9 (7.1–25.5) | NG − G **−130 ms (−0.52%)**, sign 4/12: admissible | +1 445, 12/12 → **+1 285** | — | +1 030, 12/12 → **+870** |

- **Net is gross minus the 160 ms floor for the one new test file.** `src/search.mate-corpus.ts`
  is not a test file.
- **`N8-SPAWN` is 0.** The new file spawns no child, and no criterion forces one.
- **Read beside the build's two readings:** +1 670 net at `9823c27` (pre-placement, load 13.6)
  and +1 415 net at `6c1e895` (load 22.8). Every reading on record is NOT MET, from **1.40x to
  2.57x**. This gate's are the lowest.
- **Paired savings, within run:**
  - A − F is **+200 ms median, sign 8/12**. That is **not resolved** against run 1's null spread
    (±0.5 s per round). Read it as ≈ 0.2 s, not as a measurement.
  - A − G is +390 ms, sign 10/12 (run 3).
- **`NFR-008`'s total is inherited and is not this ticket's.** B reads 23.4–25.1 s CPU and 5.6–6.3 s
  wall against 15 s / 3 s. `ADR-0019` trigger (a) fired at `ABC-079`, and the owner accepted
  `AR-N8LANE-079` (board, 2026-09-25).

## Where the default-lane charge sits (per-row test time at A, load ≈ 3, single run)

| row | test time | sole default-lane guard of (placement ledger `…17a0830d`) |
|---|---|---|
| `A4` `search()` | 137 ms | `noLmrResearch-search-only` |
| `A4` `chooseMove` | 106 ms | `noLmrResearch-engine-only`, `noResearch-engine-only` |
| engine doors bite | 46 ms | `engine-door-withoutReductions-reduces` |
| PVS bite | 33 ms | none of the 23. It is the only default guard of an **unplanted** variant, see below |
| `A5` position-3 | 33 ms | none (a "does something" pin) |
| 190-corpus length pin | 12 ms | none |
| kp-vs-k identity | 9 ms | `door-withoutReductions-reduces` |
| `A3` ×12 and the mate-corpus pin | ~0 ms | `ignores-*`, `search-literal-reduction`, `engine-bypasses-predicate` |

## The cheapest moves, each checked against the ledger in the default lane alone

- **F: drop both `A4` reference searches. 23 of 23 red** (`raw-out-mutants-F.txt`). The per-variant
  row counts are identical to the placement ledger.
  - It extends QE's `…b2f12ced` ruling from the `chooseMove` row to the `search()` row, by the
    same argument and now by measurement: the literal pin is what fires.
  - **It is guard-neutral, and it saves about 0.2 s. It does not close the gap: +785 net.**
  - Lint-clean as it stands: `npx biome check src/search.pvs-lmr.test.ts` in arm F reads "No
    fixes applied", because both door imports are still used elsewhere in the file. F's default
    lane is green at 48 / 1 466.
- **G: F plus the PVS bite and `A5` moved behind `SEARCH_DEEP`. 23 of 23 red**
  (`raw-out-mutants-G.txt`), but **it is not free.**
  - I planted a 24th variant by hand, with `pvs: false` in `searchWithoutReductions`, so the
    reference door silently loses PVS.
  - At A it is **red**, one row: the PVS bite. At G it **survives the default lane** (48 / 1 464
    green).
  - It is value-preserving, so a product bug it is not. But the bounded drift oracle's reference
    would then no longer be the configuration `ADR-0026` decision 5 names, and only the deep 190
    row would notice.
  - **It still does not close the gap: +870 net.**
- **Every further move drops a sole guard.** `A4` ×2, the engine-doors bite and kp-vs-k are each
  a planted variant's only default-lane guard. The build's four-row proposal leaves 20 / 23
  (`…17a0830d`).
- **So no test-only placement reaches 650 ms without leaving a variant unguarded.** That
  confirms the lane re-hop's conclusion on this gate's own instrument.

## Machine

Apple M3 (Mac15,13), 4P+4E, Darwin 25.5.0 arm64, node v24.12.0, vitest 3.2.7. `UNKNOWN - verify`
elsewhere. 0 harness errors in runs 1 and 3 (104 runs). Run 2 is recorded as invalid for G/NG.
