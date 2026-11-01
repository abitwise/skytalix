# `ABC-248` A5/A6/A7 as run by QE: T2a 120 → 120, T2d A4-a2 8 = 8, plants 26 → 26, per-row sets equal at B and H; `insideNull` 4, `underNull` 19/19; node census −435 052

**Trees.** All scratch, nothing in `src/`:
- B = `git archive 46365ed0`
- H = `git archive 18bad5fb`
- The only `src/` / `tools/` / `data/` difference between them is the two test files.
- One `node_modules` symlink to the main checkout. `package*` and the configs are equal at B, H and `main`.

**Runner.** `qe-scripts/mut.mjs` is QE's own, sha256 `66c2541a…`, the same file as in the PREREG.
- **Isolation:** each mutant runs in a `cp -al` work tree. A file is written only after `rm`, so B and H are never touched.
- **Edits:** every edit must occur exactly once.
- **Invocation:** `node_modules/.bin/vitest run <file> --reporter=json`, heap 400, with `ENGINE_DEEP` and `SEARCH_DEEP` unset.
- **Order:** CONTROL first. All of B ran before the first H run (08:03–08:16Z).
- **Lists:** the SE's frozen lists, reused (hashes in the PREREG).

## A5: T2a and T2d (`raw/kill/parity-uci.out`)
- **CONTROL:** B 234 ran / 0 failed; H 230 / 0. The same 137 ids ran in the same order. Suite errors 0.
- **File level:** killed **B 120, H 120**. LOST {} and gained {}.
- **Survivors (17, identical at B and H):** 167-M09, M10, M35, M38, M40, M41, M42; 171-N08, S03, S09, S29, S43, S46, S47;
  174-M12, M13, M14. These are pre-existing and not made by this ticket.
- **Moved rows:** each one's base kills are killed at H by the default lane:
  - "movetime 100": 9/9 (incl. MOVETIME-OFF; A5-b4/b5 kill it)
  - "G = 3 500": 12/12 (incl. L5-3000, 167-M01/M03/M04)
  - "a bare go": 10/10 (incl. 167-M07r, L5-3000, L5-4500)
  - "A5-b3": 10/10 (incl. MOVESTOGO-1, 167-M05)
- **Rows that stay**, each with the same set at B and H:
  - "white reads wtime" {…, WRONGSIDE, WS-WHITE}
  - "black reads btime" {…, WRONGSIDE, WS-BLACK}
  - "a short clock", A5-b1, A5-b2, A5-b4, A5-b5 and A5-c1
- **Who kills the wrong-side mutants at H:**
  - `WRONGSIDE`: only those two rows.
  - WS-WHITE: only "white reads wtime".
  - WS-BLACK: only "black reads btime".
  - So both rows stay under ruling 3, as the SE decided.
- **T2d:** A4-a2 kills {167-M24, 167-M29, 167-M45b, 167-M46, 171-S28, 174-M10, 174-M11, 174-M17} at B (step 100) and at H
  (step 1 000). **SAME.**
- **Agreement with the SE's run:** QE's per-row sets equal the SE's `t2a.out` / `parity-uci-base-vs-tipU.out`.

## A6: T2c plants (`raw/kill/parity-nm.out`)
- **CONTROL:** 38 / 0 at B and H. 26 plants apply, and all 26 are killed at B and at H. No survivors and no suite errors.
- **Per-row sets, SAME at B and H:**

| row | kills |
|---|---|
| `QE-208-a` | {engine-no-finally, min-depth-3, null-no-fullmove} |
| `QE-208-b` `search()` | {R-5, key-without-ep, null-no-ep-clear, search-stale-null-key} |
| `QE-208-b` `chooseMove` | {R-5, engine-stale-null-key, key-without-ep, null-no-ep-clear} |

## Non-vacuity (`raw/census/probe-{B,H}.txt`; a scratch `__p()` log before each row's first `expect`)
- **`QE-208-a`:** B `{"insideNull":5,"mutated":[]}` (readings 3..25) → H `{"insideNull":4,"mutated":[]}` (even 4..24).
  The bar is ≥ 3.
- **`QE-208-b`:** B `{"underNull":44,"stale":[]}` in both rows (position-6) → H `{"underNull":19,"stale":[]}` in both rows
  (startpos).
- **New root:** startpos has 7 non-pawn pieces per side (≥ 3).
- **A4-a2's info line:**
  - B (step 100): `info depth 6 score cp 0 nodes 34836 time 4100 nps 8497 pv b1c3`.
  - H (step 1 000): `info depth 3 score cp 66 nodes 1044 time 5000 nps 209 pv b1c3`.
  - Both have 3 lines, the `[31m` sequence is dropped from the info string, and bestmove is b1c3.

## A7: node census (`raw/census/census-table.out`; `deepen`'s return and `search()`'s `SearchResult.nodes` counted in scratch, per-test hooks)
| lever | row | nodes B | nodes H | delta |
|---|---|---:|---:|---:|
| T2c-a | `QE-208-a` (23 → 11 searches) | 265 237 | 126 881 | −138 356 |
| T2c-b | `QE-208-b` `search()` | 154 466 | 26 703 | −127 763 |
| T2c-b | `QE-208-b` `chooseMove` | 73 867 | 23 798 | −50 069 |
| T2d | A4-a2 | 34 836 | 1 044 | −33 792 |
| T2a moved | movetime 100 / G = 3 500 / a bare go / A5-b3 | 5 140 / 29 716 / 34 836 / 15 380 | (deep) | −85 072 |
| T2a stayed | white reads wtime / black reads btime | 45 076 / 39 966 | same | 0 |

- **Strictly fewer:** every T2c/T2d row reads strictly fewer nodes; rows breaking the rule: 0.
- **Other rows:** the other 262 rows of the two files are node-equal.
- **Sum:** the two-file default lane goes **1 689 340 → 1 254 288 nodes, −435 052**, equal to the SE's figure.
