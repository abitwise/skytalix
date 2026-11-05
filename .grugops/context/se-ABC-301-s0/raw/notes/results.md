# se-ABC-301-s0 observation: P1 44 / 44 in the own-phase form and E14–E16 killed by that row; P2 0 callers, five planted callers red; P3 17 value exports equal to main's, typecheck 0, B-T1 0 misses over 1 494 610 keys; default lane +1 row, about +2.4 ms in-thread

Every run was under the host lock. Mutants ran on scratch copies, never the worktree. No fit and no game ran.

**P1 (`QE-271-h`).** Row "evaluateAtPhase at each fixture's own phase is exact against the seam, on 44 of 44", `src/evaluate.passer.test.ts`: green. The ticket's literal forced-phase form reads 31 / 44 (decision note, `raw/forced-phase-probe.out`).

**Mutants on the hot path** (`raw/mutants-summary.txt`; E14–E16 are QE's text from `raw/scripts/mutate.py`):
| mutant | file result | new row |
|---|---|---|
| CLEAN | 22 passed | green |
| E14 | 2 red | **red** (the other red is the source pin, as at QE's read) |
| E15 | 2 red | **red** (same) |
| E16 | 1 red | **red**, the only red: it survived all 21 rows before |
| H1, own: hot path passes phase 0 | 2 red | **red** |

**P2 (`QE-271-g`).** The row reads 0 callers. Planted on a scratch copy, each red with the planted file named (`raw/guard-mutants.txt`): G1 a caller in a new `src/` file, G2 nested under `tools/`, G3 in a `scripts/` directory, G4 in `package.json`, G5 a second call in `src/evaluate.ts`.
- G5's first plant crashed at module load, so it read no row. It was re-planted as a function that is not called at load, and that read is the one recorded.

**P3 (`QE-271-i`).** `TUNE_DEEP` lane: 22 passed (17 + 5 new), exit 0.
- Tracer row: on the 44 fixtures each side's counts equal QE's frozen features, and count × probed value equals the frozen seam part. A second row: the probed table moves the model by the frozen white minus black × (24 − w) / 24.
- Emission at the base values: 20 `export const`, the same names as `main`, 17 value exports, every one `toEqual` `main`'s, U `{ mg: 0, eg: 0 }`.
- Typecheck on the emission: the row's `tsc --noEmit` passes, and the literal `npm run typecheck` on a scratch copy holding the emission exits 0. `src/evaluate.passer.test.ts` reads 22 passed on that copy too.
- Biome on that scratch emission reports one format error, a trailing space on the own-games line. It comes from the empty `counts` the scratch driver passes, and no real extract has empty counts. Not seen on a real emission: `UNKNOWN - verify` at the fit.
- Tool mutants, all red (`raw/mutants-summary.txt`): T1 own-king sign, T2 cap 6, T3 U ignores the side to move, T4 path stops before Q, T5 every passer on a file, T6 `tableOf` drops U, T7 `tableOf` crosses the free table, M2 a wrong value emitted. T1, T6 and T7 are red on the model row only, which is why that row exists.
- **`QE-271-i`'s open question, answered:** M1 removes the four exports from the emitter. Both the export row and the typecheck row go red, so a 13-export file fails typecheck rather than loading as undefined.

**B-T1, the full set at the base values** (`raw/bt1-extract.json`; extract only, tool at `df7d07a2`, `--lichess`, the tool's sha256 pin check passed): **0 misses over 1 494 610 gated keys, worst |model − evaluate| 0.9583 cp.** Exit 0, 207 s, 1 527 MiB peak. Rows: own training 172 019, own validation 46 688, Lichess 1 000 000. 492 759 of the 1 218 707 rows carry at least one E4a feature, and 3 375 carry U. As d5 says, B-T1 cannot see the terms at 0: the tracer rows carry that.

**Default lane.** 2 684 → **2 685** in 71 files, 0 skipped; no new file; nothing added to `src/cli.test.ts`; no row of ≥ 50 ms.
- In-thread, three runs each (`raw/row-durations.tsv`): the new row 1.12 / 1.14 / 1.15 ms; the guard row 0.70 → 1.94–1.97 ms, with one 3.75 ms read. So **about +2.4 ms added** (+4.2 ms on the worst read), against the 90 ms aim.
- One `npm test` read 9.37 s, ungraded. The ≤ +0.10 s budget is QE's `N8-LANE` read at the gate.

**Gates at the tip:** `npm test` 2 685 / 2 685; lint clean; typecheck 0; build 0; skip count 0; `test-skip-integrity` No findings. `src/evaluate.ts` and `src/evaluate-params.ts` are untouched.
