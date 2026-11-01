# `ABC-248` readings: parity per lever, plants, non-vacuity, counts and names, diff shape, gates, the deep lane, and one informal `G8`

Everything below was run. The base is `46365ed0` (a `git archive` in scratch). The tip is the code commit `71700836`.
Raw files are under `raw/` and `raw/probe/`.

## Parity (A2; QE re-confirms at A5/A6)
Runner: `probe/mut.mjs`. It runs one file in the default lane (`ENGINE_DEEP` / `SEARCH_DEEP` unset, heap 400), invoked
as `node_modules/.bin/vitest`, with CONTROL first. The lists are the PREREG's, unchanged.

| arm (base + …) | file | CONTROL ran / failed | killed base → tip | lost | per-row | out file |
|---|---|---|---|---|---|---|
| T2c-a only (Ca) | null-move | 38 / 0 | 26 → 26 | none | QE-208-a SAME | `parity-nm-base-vs-tipCa.out` |
| T2c-b only (Cb) | null-move | 38 / 0 | 26 → 26 | none | both QE-208-b SAME | `parity-nm-base-vs-tipCb.out` |
| T2c-a + b (C) | null-move | 38 / 0 | 26 → 26 | none | all three SAME | `parity-nm-base-vs-tipC.out` |
| T2a only (A) | uci-session | 234 / 0 → 230 / 0 | 120 → 120 | none | every staying A5 row SAME | `parity-uci-base-vs-tipA.out` |
| T2d only (D) | uci-session | 234 / 0 | 120 → 120 | none | A4-a2 SAME (8 ids) | `parity-uci-base-vs-tipD.out` |
| T2a + T2d (U, delivered) | uci-session | 234 / 0 → 230 / 0 | 120 → 120 | none | A4-a2 and every staying A5 row SAME | `parity-uci-base-vs-tipU.out` |

- **Survivors at base (17, the same at every tip):** 167-M09, M10, M35, M38, M40, M41, M42; 171-N08, S03, S09, S29,
  S43, S46, S47; 174-M12, M13, M14. They survive at base and at every tip alike, so this ticket made none of them.
  Why each one survives was not analysed at this hop (`UNKNOWN - verify`, out of scope).
- **Raw kill logs:** `kill-base-uci.jsonl`, `kill-base-nm.jsonl`, `kill-tip{A,D,U}-uci.jsonl`,
  `kill-tip{Ca,Cb,C}-nm.jsonl`. The T2a analysis is `t2a.mjs` → `t2a.out`.

## Non-vacuity at the tip (T2c; scratch `console.log` in a copy, not committed): `nonvacuity-reads.out`
- `QE-208-a`: `insideNull` base **5** (readings 3..25) → tip **4** (even readings 4..24). It must be ≥ 3. `mutated` [].
- `QE-208-b`: `underNull` base 44 / 44 (position-6) → tip **19 / 19** (startpos). It must be > 0. `stale` [] in both.
- Per-row in-thread time (informal, load1 ≈ 1): QE-208-a 393 → 198 ms; `search()` row 228 → 65 ms; `chooseMove` row
  115 → 53 ms.

## Counts and names (A3): `names-base-vs-tip.txt`, from each arm's `npm test` JSON report
- `src/search.null-move.test.ts`: 38 = 38, all passed. The sorted names differ only by the three ruling-5 retitles.
- `src/uci-session.test.ts`: 234 → **230** (= 234 − 4 moved). The sorted names equal base's with exactly the four moved
  rows removed.
- Lane: 2 366 → **2 362** (= 2 366 − 4), 0 failed, 0 pending, 0 todo. 63 files in both arms. No other file's count
  changed.

## Diff shape (A4): `diff-checks.txt`
- `git diff --name-only 46365ed0 71700836` lists the two test files plus this task's own context files
  (`.grugops/context/se-ABC-248/raw/…`, the PREREG). There is no other `src/` file, and no config, `tools/`, `data/`
  or `AGENTS.md` file.
- Numstat: null-move +13 / −8, uci-session +45 / −14.
- `expect(` lines: 0 removed. The 6 added lines are the deep block's copies of the two A5 loop bodies. The moved rows'
  five body lines are byte-identical at +2 indent. The two `it` title templates are byte-identical.
- The helpers `dialogue`, `talk`, `parseInfo`, `rig`, `session220`, `instrument`, `probes` and `fenOf` are byte-identical
  (each definition is compared). `virtualClock` is production and untouched.
- A4-a2's only change is `100` → `1_000`. Each added comment cites `ABC-248` and `ADR-0046` § Addendum 2026-10-31.
- No scratch instrumentation is in `src/`. The two probe test files live in scratch and in `raw/probe/`, which
  `vitest.config.ts` excludes (`.grugops/**`).

## Gates at the tip (A11, worktree `71700836`)
- `npm run lint`: rc 0 (131 files). `npm run typecheck`: rc 0. `npm run build`: rc 0.
  (`lint.txt`, `typecheck.txt`, `build.txt`)
- `npm test`: rc 0, 63 files, **2 362 / 2 362 passed**, 0 failed, **0 skipped**, in both head runs.
- Skip integrity: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed "No
  findings.", rc 0. The 0 is `numPendingTests + numTodoTests` from the tip's `npm test` JSON report. The AGENTS.md
  capture line spells `npx` and is fenced here, so this is a deviation in how the count was read, not in its value.
  (`skip.txt`)
- Lane inventory: "The lane collects 63 test files; git tracks 63. No findings.", rc 0. (`inv.txt`)

## The deep lane (A10): `deep-run.txt`
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 node_modules/.bin/vitest run src/uci-session.test.ts -t "ABC-167
  A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"` ran the 4 moved rows green (4 passed,
  237 skipped by the filter), rc 0.
- **With the brackets unescaped, as ruling 6 spells it, the same command runs 0 tests** ("241 skipped", rc 0). See
  SE-248-a in the findings note.
- With `ENGINE_DEEP` unset: 230 rows are collected, 0 pending, and 0 rows carry the deep title. The block is not
  defined.

## One informal `G8` (head vs main; QE owns the gate, W1): `g8-informal.txt`
`npm test`, run sequentially b h h b at 07:56Z, ALONE (no other hop). Before each run I read load1, Tctl and the top
three CPU users.

| run | wall (outer) | vitest Duration | load1 | Tctl | tests |
|---|---|---|---|---|---|
| b | 9.38 s | 9.05 s | 0.58 | 37.6 °C | 2 366 pass |
| h | 9.00 s | 8.70 s | 0.87 | 72.4 °C | 2 362 pass |
| h | 9.06 s | 8.74 s | 1.28 | 73.9 °C | 2 362 pass |
| b | 9.33 s | 9.03 s | 1.86 | 74.4 °C | 2 366 pass |

- Medians (n = 2): **H 9.03 s, B 9.36 s, H − B ≈ −0.33 s** on the outer wall (vitest Duration: −0.32 s).
- Foreign processes: `abtop` 6.2 %, three idle `claude` sessions about 2 % each. The "100 % ps" entries are the probe's
  own `ps`. Tctl median 73 °C, under the 85 °C stop.
- This is n = 2 in one window, so it is **UNKNOWN - verify** until QE's A9 (b h h b b h after a wait-clear). It is not
  the gate.
