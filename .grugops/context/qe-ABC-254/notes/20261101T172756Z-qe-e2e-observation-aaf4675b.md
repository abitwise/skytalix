---
id: 20261101T172756Z-qe-e2e-observation-aaf4675b
kind: observation
by: qe-e2e
at: 2026-11-01T17:27:56Z
verified_by: 
confidence: high: every gate and 16 deep lanes run once at head under the lock; G8 on a shared host (load1 about 4, under the bar of 8)
refs:
  - qe-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0026
  - NFR-005
  - NFR-004
  - NFR-009
  - NFR-008
  - NFR-001
  - QE-254-a
  - QE-254-b
  - QE-254-c
  - G1
  - G4
  - G5
  - G6
  - G7
  - G8
  - G9
  - grugops/ABC-254
  - 600d8de3
  - fe53dbda
  - 09d1f675
  - grugops/qe-ABC-254
  - 2c0bcbc3
  - 12288266
  - 6d393592
  - qe-ABC-254/20261101T153338Z-qe-e2e-decision-6b25d0a8
  - se-ABC-254/20261101T152313Z-software-engineer-decision-cb525705
  - se-ABC-254/20261101T152313Z-software-engineer-decision-7f5312e8
  - se-ABC-254/20261101T152313Z-software-engineer-observation-4a50887c
  - se-ABC-254/20261101T152313Z-software-engineer-observation-1b77dfbe
  - se-ABC-254/20261101T152325Z-software-engineer-observation-d672f92e
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:ff5715ae958c09a2045757ea99b70a9b370ecd5a451d79f4e252c155fc6f9d73
---

# ABC-254 gates at head 600d8de3: lint, typecheck, build exit 0; npm test 2 368/2 368 ×3, skips 0; G8 H 9.01 s (B 9.59 s), new rows 21.7 ms; 16 deep lanes green (711 tests); G1 54/58 rows equal; G5, G7, G9 MET

QE/E2E, task `qe-ABC-254`, worktree `grugops/qe-ABC-254`, whose `src` equals `600d8de3`'s. Every run was under
`host-test.lock`. Tools ran through `npm run …` or `./node_modules/.bin/<tool>`. Raw files are in `raw/gates/` and `raw/deep/`, with paths redacted.

## Mandatory gates (16:54:35–16:57:18)
| gate | result |
|---|---|
| `npm run lint` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 (`dist/` removed afterwards) |
| `npm test` | **2 368 passed, 0 failed, 0 skipped, 0 todo**, in each of the 3 head runs of G8 |
| test integrity | `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings." |
| lane inventory | 63 collected, 63 tracked: "No findings." |

## G8 (NFR-008): `npm test` as spelled, b h h b b h; B is the full archive of `09d1f675`
| run | tree | wall | vitest Duration | load1 before / after |
|---|---|---|---|---|
| 1 | B | 9.59 s | 9.26 s | 3.84 / 3.87 |
| 2 | H | 9.91 s | 9.60 s | 3.80 / 4.26 |
| 3 | H | 9.01 s | 8.67 s | 4.26 / 4.08 |
| 4 | B | 9.84 s | 9.55 s | 4.08 / 4.22 |
| 5 | B | 9.21 s | 8.94 s | 4.22 / 3.96 |
| 6 | H | 8.92 s | 8.63 s | 3.96 / 4.05 |
- **Medians: H 9.01 s, B 9.59 s.** H ≤ 10 s at load1 ≤ 8, so **G8 MET**.
  - Load1 was about 4 because the host was shared (see the timing note). Both trees read alike.
  - H's 9.91 s run is 0.09 s under the bar.
- **The new rows:** 6 ABC-254 rows sum to 24.7 / 21.3 / 21.7 ms in the three head runs (median **21.7 ms ≤ 100 ms**).
  - `legal.test.ts` file time: H median 158.1 ms, B median 148.5 ms (+9.6 ms).
  - `gameend.nfr.test.ts`: 10.5–15.7 ms on head, 11.5–19.7 ms on base.

## Deep lanes at head, one file at a time (`NODE_OPTIONS=--max-old-space-size=400`), 16:58:23–17:17:48
| lane | tests | wall |
|---|---|---|
| `ENGINE_DEEP` legal (A1 walks, A2, every legal row) | 48/48 | 194.5 s |
| `ENGINE_DEEP` engine (ABC-078 A3 identity sweep; G4/G5) | 77/77 | 178.5 s |
| `ENGINE_DEEP` transposition (G7) | 26/26 | 5.5 s |
| `ENGINE_DEEP` gameend | 58/58 | 3.8 s |
| `ENGINE_DEEP` gameend.nfr | 10/10 | 0.3 s |
| `ENGINE_DEEP` moves | 38/38 | 4.7 s |
| `ENGINE_DEEP` search.pvs-lmr | 21/21 | 48.4 s |
| `SEARCH_DEEP` search | 57/57 | 3.0 s |
| `SEARCH_DEEP` search.pvs-lmr (`ADR-0026` bounded oracle; G4) | 29/29 | 55.2 s |
| `SEARCH_DEEP` search.null-move | 44/44 | 28.1 s |
| `SEARCH_DEEP` search.ordering | 43/43 | 7.0 s |
| `SEARCH_DEEP` quiescence | 116/116 | 49.1 s |
| `SEARCH_DEEP` transposition (G7) | 40/40 | 4.2 s |
| `PERFT_DEEP` perft | 32/32 | 2.6 s |
| `PUZZLE_DEEP` puzzle-suite (G1) | 18/18 | 3.0 s |
| `ENGINE_DEEP` levels (G5) | 54/54 | 577.2 s |
- That is **711 tests: 0 failed, 0 skipped.** Load1 was 1.95–3.09.
- The puzzle lane ran twice more, only to print its count line (qe-ABC-235 precedent): first with `--silent=false`, which printed nothing more, then with `--reporter=verbose`. All three runs were 18/18. See G1 below.

## The EPIC-008 / EPIC-010 gates
- **G1:** 18/18 green. The 58 per-row results (move, score, depth, nodes) are `cmp`-equal between B and H (identity note). `PUZZLES shipped: solved 54/58, baseline 54/58, budget 25 step 1`, with no NEWLY line. **G1 MET.**
- **G4:** MET (identity note), plus the engine lane, the bounded-oracle lane and the search, null-move, ordering, quiescence and transposition lanes above.
- **G5:** MET.
  - The `ENGINE_DEEP` engine lane is 77/77 and the levels lane 54/54. Their real-clock rows pass the ≤ 5 s instrument.
  - Every 4 000 ms A4 search finished in ≤ 4 002.7 ms of wall time (timing note).
- **G6:** MET (timing note): kiwipete 8 → 9, position-6 10 = 10.
- **G7:** MET. The transposition lanes are green (26/26 and 40/40), including the byte sum and the growth rows.
  - Code read of `src/legal.ts`: the pin set is one module-level `Uint32Array(128)` (512 B), allocated once at load and stamped by epoch, so it is never cleared or reallocated per call.
  - `filterLazily` compacts the generator's own fresh array in place. Nothing goes on `Position`.
  - Per-node growth is 0.
- **G8:** MET (above). **G9:** MET. `git diff 09d1f675 600d8de3 -- src/levels.ts src/engine.ts` is empty, and so is the diff of `search.ts`, `quiescence.ts`, `moves.ts`, `apply.ts` and `perft.ts`.
- **Production lines:** `src/legal.ts` only (the unfiltered waiver measurement lists `src/legal.ts`). So **UAT is owed**, and it is signed by a QE verdict of PASS or PASS_WITH_GAPS with no blocking gap.
