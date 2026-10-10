---
id: 20261010T111050Z-software-engineer-observation-abc058-gates-mutants-a1-a8-cost-b98960df
kind: observation
by: software-engineer
at: 2026-10-10T11:10:50Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-042
  - V1.2.5
  - V1.3.3
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T111050Z-software-engineer-decision-abc058-token-bytes-pin-strip-comment-wording-0963774f
supersedes:
---

# `ABC-058` readings: gate green; `M3h` and the prose probe flip as the page asks, `MS1`/`MS2`/`M3f`/`M3g` still red; `A7`/`A8` by git; `N8-LANE` MET in set 1 and UNRESOLVED in set 2

Hand-authored and unsealed.
- Branch `grugops/ABC-058-security-bar-instruments`, from `b21ec7cf`. The code is `f2235ecd`
  (`src/cli.test.ts` +12/−7).
- Not merged, not pushed.
- Machine: Apple M3, 8 cores, Darwin 25.5.0, Node v26.11.0.
- Other hops' lanes were on the machine (QE `ABC-126`, BA/PM), so load1 is beside every reading.
- Raw files are in `../probe/`. Absolute paths in them are rewritten to `<repo>` / `<scratchpad>`.

## Gate (at `f2235ecd`, worktree)

| step | result | load1 |
|---|---|---|
| `npm run lint` | exit 0, 98 files | 4.81 |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 | 4.81 |
| `npm test` | exit 0, **51 files / 1581 passed**, 7.76 s (`raw-npm-test.txt`) | 4.52 |
| skip count | `0` (`jq '.numPendingTests + .numTodoTests'`) | 6.88 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 | 6.88 |
| `lane-inventory.js` | exit 0. "The lane collects 51 test files; git tracks 51. No findings." | 7.90 |

## Mutants: `src/cli.test.ts` alone, out-of-tree `git archive` copies

The harness is `probe/mutants.sh`. Each mutant is one anchored replacement that aborts unless its
anchor occurs exactly once, and the tree is restored by byte copy. Outputs are
`mutants-before.out.txt` and `mutants-after.out.txt`, at load1 4.9–7.5.

| probe | before `b21ec7cf` | after `f2235ecd` |
|---|---|---|
| control | 66/66 green | 66/66 green |
| prose `` `spawnSync(` `` docblock line (`A1`) | **RED 1/66**, the `N8-LANE` pin row | **GREEN 66/66** |
| `MS1` direct `spawnSync` child (`A2`) | RED 1/66, the pin row | **RED 1/66, the pin row** |
| `MS2` namespace import (`A2`) | RED 1/66, the pin row | **RED 1/66, the pin row** |
| `M3f` `0x7f`→`0x7e` (`A6`) | RED 1/66, the `A8` number row | **RED 2/66**: the `A8` number row + bar 3 |
| `M3g` `\|\| code === 0x7f` deleted (`A6`) | RED 1/66, the `A8` number row | **RED 2/66**: the `A8` number row + bar 3 |
| `M3h` `&& code !== 0x7f` (`A5`) | **GREEN 66/66** | **RED 1/66, bar 3** |

## Criteria

- **`A1` MET.** The prose probe goes RED → GREEN.
- **`A2` MET.** `MS1` and `MS2` were rebuilt and run, and both are RED on the pin.
- **`A3`/`A4`** are struck on the page.
- **`A5` MET.** `M3h` goes GREEN → RED on bar 3. Bar 3's non-vacuity assertions pass on the
  correct build: the control is 66/66.
- **`A6` MET.**
  - `M3f`/`M3g` are still RED and still attributed to the number-transcription row.
  - Bar 3 now reds as well.
  - That row is byte-identical: no line of `:1629-1639` is in the diff.
- **`A7` MET.**
  - `N8_SPAWN` is still `17 + 7 + 1 + 2`.
  - The pin row is green, so `spawned` and `Object.keys(CHILDREN)` both equal 27.
  - `it(` lines added or removed in the diff: 0. The test count stays 66.
  - Bar 3 still locates its token by whitespace split, over every occurrence.
- **`A8` MET.**
  - `git diff --name-only f2235ecd~1 f2235ecd` = `src/cli.test.ts`, one path.
  - Zero-production-lines grep: 0 lines.
  - Production modules: 35, all blob SHAs identical between `b21ec7cf` and `f2235ecd`.
  - Suite green, skip 0.

## Cost reading (`ADR-0035`, `proposed`): the narrow set is `src/cli.test.ts` alone

Harness `probe/timing.sh`:
- three `git archive` trees: base `b21ec7cf`, head `f2235ecd`, and a twin of base;
- the twin is `/usr/bin/diff -r -x node_modules` identical to base, and head differs in
  `src/cli.test.ts` only;
- `npx vitest run src/cli.test.ts`, one fresh process per run, CPU = user + sys;
- 9 rounds with round 0 discarded (n = 8, k = 2), arm order rotated;
- the count asserted at 66 on every run, and load1 logged before every run.

Scored by `probe/score.mjs`. The bound is `N8-LANE` ≤ 650 ms CPU.

| set | load1 median (range) | base CPU | twin − base (admissibility) | twin R | head − base, interval | state |
|---|---|---|---|---|---|---|
| 1 | 6.50 (5.53–7.53) | 7.99 s | +0.006 s (+0.08 %), sign 4/8 | **0.254 s** ≤ 0.650 | −0.610 s, −0.995..+0.028 | **MET** |
| 2 | 6.17 (5.14–6.88) | 6.95 s | −0.071 s (−1.02 %), sign 2/8 | **1.097 s** > 0.650 | −0.081 s, −0.141..+0.107 | **UNRESOLVED**, charge at most +0.107 s |

- Both sets are admissible: |median| ≤ 1.5 %, and the sign is at chance (2/8 is two-sided p ≈ 0.29).
- **They are reported unpooled.** Set 1's −0.61 s did not replicate, and it is read as noise, not
  as a saving.
- No `N8-LANE` line is claimed in this file (the pin's comment), and none is claimed by this note.
  The gate owns what an UNRESOLVED line means.
- This file's CPU (~7–8 s) is mostly its 27 children. Its twin R (0.25 / 1.10 s) sits above
  `ADR-0035`'s one-file floor `F` = 0.17 s, which came from lighter files.
