# `ABC-243` readings at code `8772cf36` (base `4bd9ac6a`)

## Gates (A5)
- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0, 0, 0.
- `npm test`: base 63 files / **2 322** passed; tip 63 files / **2 323** passed (twice). Skips 0, failures 0.
  `uci-session.test.ts` 200 → 201, `transposition.test.ts` 25 → 25.
- Sorted names (vitest JSON, base vs tip): exactly one name only at tip, the A6 row; none only at base (A4: one added,
  none removed; the Hash row's name is unchanged).
- `ENGINE_DEEP=1`, `src/transposition.test.ts -t DEFAULT_BUDGET_MS`, heap flag 400: the renamed deep row **passed**
  (5 094 ms); the other 25 were filtered out by `-t` (not a default-lane skip).
- Row walls (vitest JSON, one run each): Hash row 55.5 ms base → 65.3 ms tip; A6 row 1.8 ms.
- **Informal `npm test` wall** (`/usr/bin/time`, oeselg-devl, load1 0.36–0.66): base 9.05 s (n = 1); tip 8.81 s and
  9.20 s (n = 2). Vitest Duration: base 8.71 s; tip 8.48 s, 8.86 s. Not a `G8` reading: `UNKNOWN - verify` (QE).

## Plants (A2, A6), scratch copies only (`raw/probe/plant.mjs`, `plants.out`, `plants-why.out`)
Each plant is one string replacement in a scratch copy of `src/uci-session.ts`; only `src/uci-session.test.ts` is run.

| plant | tip test file | failing assertion at tip | base test file |
|---|---|---|---|
| none | green 201/201 | — | green 200/200 |
| `setoption Hash` sets level 4 | **red** (Hash row only) | `expected 1100 to be greater than or equal to 4000` | red (level-4 control, as QE found) |
| level 6 | **red** (Hash row only) | `expected 5100 to be less than or equal to 4200` | **green** (the SE-228ii-a gap) |
| level 7 | **red** (Hash row only) | `expected 30100 to be less than or equal to 4200` | **green** (the gap) |
| QM3 (`const keys = [zobristKey(position)];`) | **red** (A6 row only) | `expected 'cp -875' to be 'cp 0'` | **green** 200/200 (QE-241-a reproduced) |

The diff touches only `src/uci-session.test.ts` (+33/−1) and `src/transposition.test.ts` (3 lines).
