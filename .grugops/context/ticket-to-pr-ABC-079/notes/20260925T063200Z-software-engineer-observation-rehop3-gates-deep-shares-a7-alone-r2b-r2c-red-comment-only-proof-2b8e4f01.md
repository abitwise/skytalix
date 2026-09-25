---
id: 20260925T063200Z-software-engineer-observation-rehop3-gates-deep-shares-a7-alone-r2b-r2c-red-comment-only-proof-2b8e4f01
kind: observation
by: software-engineer
at: 2026-09-25T06:32:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - .grugops/context/ruling-abc079-g1g2/notes/20260925T061500Z-architect-design-decision-g1-pin-oracle-checked-depth3-answers-in-a5-g2-split-deep-corpus-by-root-licence-8c3e5a72.md
supersedes:
---

# Re-hop 3, every re-run the licence names. Gates green, 1392/1392 with 0 skipped. `SEARCH_DEEP=1` on both files is 94/94, and no case is over 50% (worst: `A4`'s kiwipete slice at 40.1%). Every `A7` case run alone is at 37.8% or below. `R2b` and `R2c` each red both depth-3 pins. The `search.ts` diff is 29 lines, all comments, with an identical token stream.

**NOT A STAMP.** This is a hand-authored `observation`.

Every run was against code commit `9d2306c` on `grugops/ABC-079-quiescence-rehop3`, in the
worktree `.claude/worktrees/ABC-079-rehop3`, with the main checkout's `node_modules` symlinked.
The machine has 8 cores. Load is the 1-min average, read before and after each child. Each figure
is one run. The harnesses and the raw output sit beside this note as `raw-rehop3-*.txt`.

## 1. Gates (licence item 4): `raw-rehop3-out-gates.json.txt`

| gate | command | result |
|---|---|---|
| lint | `npx biome check .` | exit 0, 78 files, no fixes |
| typecheck | `npx tsc --noEmit` | exit 0 |
| build | `npx tsc --noEmit` | exit 0 |
| default lane | `npx vitest run --reporter=json` | exit 0, **43 files, 1392 passed, 0 failed, 0 skipped**, 5.3 s wall, load 2.2 → 3.1 |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, `No findings.` |

1392 is QE's default-lane count on the integrated base. The hop added no default-lane case.

## 2. `SEARCH_DEEP=1 npx vitest run src/search.test.ts src/quiescence.test.ts` (item 1)

**Exit 0. 94 passed (search 57, quiescence 37), 0 failed, 0 skipped. Wall 109.2 s (vitest's
duration 108.75 s). Load 3.0 → 4.0.** The 50% line was crossed by NO case.
Source: `raw-rehop3-out-deep-both.shares.json.txt`.

Each deep case's share of its own timeout (the timeout is read from the runner):

| file | case | ms | timeout | share |
|---|---|---|---|---|
| search | `A4` deep, default d2 | 1 239 | 120 s | 1.0% |
| search | `A4` deep, broad d1 + the six slices are exactly the broad corpus | 1 160 | 120 s | 1.0% |
| search | `A4` deep, broad d2, startpos slice | 68 | 120 s | 0.1% |
| search | **`A4` deep, broad d2, kiwipete slice** | **48 086** | 120 s | **40.1%** (the worst in the lane) |
| search | `A4` deep, broad d2, position-3 slice | 52 | 120 s | 0.0% |
| search | `A4` deep, broad d2, position-4 slice | 370 | 120 s | 0.3% |
| search | `A4` deep, broad d2, position-5 slice | 3 660 | 120 s | 3.1% |
| search | `A4` deep, broad d2, position-6 slice | 9 475 | 120 s | 7.9% |
| search | `A7` deep, default d2 (warm) | 0 | 120 s | 0.0% |
| search | `A7` deep, broad d2, each of the six slices (warm) | 0 | 120 s | 0.0% |
| search | `A7` deep, roots (d2 pairs `.intact`, d3 `search` plus the bare door) | 16 700 | 120 s | 13.9% |
| search | `A1` kiwipete d2 | 11 486 | 30 s | 38.3% |
| search | `A1` kiwipete d3, bare leaf | 3 547 | 30 s | 11.8% |
| search | `A1` position-6 d3, bare leaf | 3 118 | 30 s | 10.4% |
| search | `A1` position-6 d2 | 3 074 | 30 s | 10.2% |
| search | `A1` position-5 d3, bare leaf | 2 000 | 30 s | 6.7% |
| search | `A3` mate-in-2 against mate-in-4, depth 7 | 1 432 | 30 s | 4.8% |
| search | `A1` position-5 d2 | 1 211 | 30 s | 4.0% |
| search | `A1` startpos d3 / position-4 d3 bare / startpos d3 bare / position-3 d3 bare | 376 / 381 / 187 / 55 | 30 s | 1.3 / 1.3 / 0.6 / 0.2% |
| search | `A3` mate-in-2 against mate-in-3, depth 5 / `A2` kiwipete d3 bare | 64 / 3 | 30 s | 0.2 / 0.0% |
| quiescence | **`A5` kiwipete d3 plus the pin `50` / `e2a6`** | 5 928 | 120 s | 4.9% |
| quiescence | **`A5` position-6 d3 plus the pin `30` / `c3d5`** | 2 328 | 120 s | 1.9% |
| quiescence | `A5` kiwipete d2 / position-6 d2 | 168 / 186 | 120 s | 0.1 / 0.2% |
| quiescence | `A4` position-6 d3 (14 565 / c3d5) / `A3` roots and children / `A1` depth rows / `A6` broad | 422 / 607 / 569 / 0 | 30 s / 60 s / 60 s / — | 1.4 / 1.0 / 0.9 / 0.0% |

Before this hop, `A4` deep was ONE case at 62.4 s (52%) under the ruling's probe, and at
60.2–66.9 s (50–56%) under QE. After the split, its worst case is kiwipete's slice at 48.1 s
(40.1%). The ruling estimated that slice at 45.7 s (38%).

## 3. `A7` order independence (item 2): each case ALONE, cold, `-t <exact title>`

One vitest process per case. Each process ran exactly one case: 1 passed, 56 filtered out.
Source: `raw-rehop3-out-alone.json.txt`.

| `A7` case, run alone | ms | share of 120 s | load |
|---|---|---|---|
| default d2 | 1 151 | 1.0% | 3.8 |
| broad d2, startpos slice | 81 | 0.1% | 3.8 |
| **broad d2, kiwipete slice** | **45 307** | **37.8%** | 3.8 → 3.5 |
| broad d2, position-3 slice | 58 | 0.0% | 3.5 |
| broad d2, position-4 slice | 362 | 0.3% | 3.5 |
| broad d2, position-5 slice | 3 449 | 2.9% | 3.5 → 3.4 |
| broad d2, position-6 slice | 9 200 | 7.7% | 3.4 → 3.0 |
| roots (d2 pairs plus d3) | 31 172 | 26.0% | 3.0 → 3.7 |

All eight pass, and all are under 50%. Before this hop, `A7` deep run alone read 92.9 s (77.4%,
QE) and 99.8 s (83.2%, the ruling). The roots case measures 31.2 s. The ruling estimated about
31.6 s, as the sum of two components.

## 4. The pins bite (item 3): `R2b`, `R2c` at K = 5, QE's exact edits. Source: `raw-rehop3-out-mutants.json.txt`

Each mutant was applied in place and run as
`SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A5`. It was then reverted with
`git checkout -- <file>` against the committed `9d2306c`.

| mutant | diff | exit | `A5` rows | red rows (message) | `git status --porcelain -- src` after revert |
|---|---|---|---|---|---|
| `R2b` (leaf slip, capture-dense) | `src/search.ts` +2/−1 | 1 | 4 pass, **2 fail** | `kiwipete at depth 3, … 50 / e2a6`: **expected 205 to be 50**; `position-6 at depth 3, … 30 / c3d5`: **expected 120 to be 30** | empty |
| `R2c` (slip inside `quiesce`) | `src/quiescence.ts` +1/−0 | 1 | 4 pass, **2 fail** | the same two rows, **expected 205 to be 50** and **expected 120 to be 30** | empty |

Both rows go red on the SCORE assertion, which is checked before the move. The ratio levels
held under both mutants, which is why `A5` was blind to them before. `src` was clean before the
first mutant and after each revert. The hop's own diff is committed, so "clean" means only the
hop's diff differs from the base.

## 5. `search.ts` is comment lines only (item 5)

- `git diff -U0 9a7e549 9d2306c -- src/search.ts` changes 29 lines (+21/−8). **Every one begins
  with `*`, `/**` or `//`, and 0 are non-comment.** Source:
  `raw-rehop3-out-search-ts-diff-U0.txt` and `raw-rehop3-diffproof.mjs.txt`.
- It was checked a second way, by token stream. TypeScript's scanner, with trivia (comments and
  whitespace) skipped, reads **808 tokens before and 808 after, identical**. Source:
  `raw-rehop3-tokens.mjs.txt`.

## Numstat (`git diff --numstat 9a7e549 9d2306c`)

```
38	8	src/quiescence.test.ts
60	14	src/search.test.ts
21	8	src/search.ts
```
