---
id: 20261010T094235Z-qe-e2e-observation-abc127-readings-a3-17of17-identical-oracle-38of38-f5e127b9
kind: observation
by: qe-e2e
at: 2026-10-10T09:42:35Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - ABC-126
  - RISK-003
  - N8-LANE
  - ADR-0027
  - ADR-0033
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
  - 20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49
  - 20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970
supersedes:
---

# `ABC-127` QE readings at `a7e1128`: gate green; `PUZZLE_DEEP=1` ×3 `cmp`-identical; `weakened` exit 1; QE's own A3 harness: 15/17 red, 17/17 identical to the build; QE's own oracle: 38/38 answered rows exact; 22/22 seeds reproduce

Hand-authored and unsealed (no sanctioned writer on this install; `human_admission` is `off`).
Worktree `.claude/worktrees/ABC-127-harder-puzzles`, branch `grugops/ABC-127-harder-puzzles`, tip
`a7e1128`. Machine: Apple M3, 8 cores, Node v26.11.0. Other agents' lanes were running, so load is
given with each reading. Raw files: `../probe/`.

## Gate at `a7e1128` (`probe/raw-gates.txt`, `probe/raw-npm-test.txt`)

| step | result |
|---|---|
| `npm run lint` | exit 0, 97 files |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` | exit 0, **50 files / 1543 passed**, 7.99 s |
| skip count (`jq '.numPendingTests + .numTodoTests'`) | 0 |
| `test-skip-integrity.js … --skip-count 0` | `No findings.`, exit 0 |
| `host-protection.js` | **exit 2**, `UNKNOWN - verify` (see the verdict note for the reading) |

## Deep lanes (`probe/run-deep.sh`, `probe/raw-deep-process{1,2,3}.txt`, `probe/raw-weakened.txt`)

| run | load1 at start | gating (vitest) | ORACLE m3 / wm | process real | result |
|---|---|---|---|---|---|
| `PUZZLE_DEEP=1` #1 | 8.43 | 28.25 s | 9.06 / 6.32 s | 44.81 s | exit 0, 17 passed, 58/62 |
| `PUZZLE_DEEP=1` #2 | 7.37 | 32.34 s | 11.40 / 8.32 s | 53.39 s | exit 0, 17 passed, 58/62 |
| `PUZZLE_DEEP=1` #3 | 8.78 | 30.50 s | 9.39 / 5.11 s | 47.03 s | exit 0, 17 passed, 58/62 |
| `PUZZLE_DEEP=weakened` | 11.29 | 31.84 s | — | 32.89 s | **exit 1**, 19/62, only the gate row red (`expected 19 to be greater than or equal to 58`) |

- **`A6`:** the 62 per-row lines (move, depth, nodes) of the three processes are `cmp`-identical, and
  identical to the build's `raw-a6-process1.rows.txt`. No `NEWLY-*` line prints at the shipped engine.
- The first 40 rows are all SOLVED. The 22 new rows reach d5–d7, and the 4 missed rows reach d5.

## `A3`: QE's own harness (`probe/qe-a3.mjs`, `.out.jsonl`, `.console.txt`, `a3/*.rows.txt`, `qe-a3-vs-build.txt`)

**What it does.** It plants QE-084's 17 edits verbatim, and each must match its count. It requires
`git diff --numstat` to show the plant before each run. It recomputes solved and `NEWLY-*` from the
62 per-row lines and checks them against the runner's summary and printed lines. It lists the failing
vitest rows. After every run it restores the file and requires both `git diff --quiet HEAD -- src` and
an empty `git status --porcelain src`. **`src/` was clean after all 17 runs.**

| id | solved | exit | gate | `NEWLY-MISSED` | failing rows | vs build |
|---|---|---|---|---|---|---|
| W1 quiescence off | 47 | 1 | red | 11 (tag truth `quiescence` 11/11) | gate | identical |
| W1b leaf quiescence off | 41 | 1 | red | 17 | gate | identical |
| W2 quiescence 1 ply | 53 | 1 | red | 5 | gate | identical |
| W3 depth cap 2 | 35 | 1 | red | 23 | gate, `ABC-084` A1 | identical |
| W4 depth cap 3 | 44 | 1 | red | 14 | gate | identical |
| W5 depth cap 4 | 48 | 1 | red | 10 (tag truth `depth≥5` 10/10) | gate | identical |
| W6 N↔R | 54 | 1 | red | 4 | gate, `ABC-084` A2 | identical |
| W7 Q=300 | 50 | 1 | red | 8 | gate, `ABC-084` A2 | identical |
| W8 P=300 | 53 | 1 | red | 5 | gate, `ABC-084` A2 | identical |
| W9 eval ignores side | 46 | 1 | red | 12 | gate, `ABC-084` A2 | identical |
| W10 PST off | 58 | 0 | survives | 0 | — | identical |
| W11 mate score ignores ply | 58 | 0 | survives | 0 | — | identical |
| W12 interior mate = stalemate | 48 | 1 | red | 10 | gate, `ABC-084` A1 | identical |
| W13 LMR reduces checks | 55 | 1 | red | 3 (seeds 1, 69, 1982) | gate | identical |
| W14 LMR by 2 | 56 | 1 | red | 2 (seeds 1008, 1075) | gate | identical |
| W15 TT accepts shallower | 35 | 1 | red | 23 | gate, `ABC-084` A1 | identical |
| W16 ordering off | 48 | 1 | red | 10 | gate | identical |

- **15/17 red.** All 7 old reds stay red. 8 of the 10 old survivors go red, including `W1`, `W1b`,
  `W4` and `W5`, plus 4 of the 5 optional ones (`W2`, `W13`, `W14`, `W16`).
- **Matches the build's table on all 17:** the solved count, the exit code and the exact
  `NEWLY-MISSED` row set are identical.
- **`A5` under every weakening:** the printed `NEWLY-MISSED` / `NEWLY-SOLVED` lines equal QE's
  recomputation, and no `NEWLY-SOLVED` line appears.
- **Summary line:** the runner's own summary agrees with the per-row count every time.

## `A2`: QE's own oracle (`probe/qe-oracle.mjs` → `probe/qe-oracle.out.txt`)

**The generator.**
- It is a fresh 64-square mailbox generator with copy-make. It imports nothing from `src/`.
- It shares no code with QE-084's `indep-oracle.mjs`, which the build's curation oracle reuses, or
  with the lane's `legalMoves`.
- **Perft:** 13/13 ok. Start position d1–d4, CPW position 3 d1–d5 (674 624), and the promotion test
  d1–d4 (182 838).

**The whole answered set was checked, not a sample: 38/38 OK, exit 0, 51.8 s.**
- **mate-in-2:** 10 rows, each `accept` = the mate-within-2 set exactly, with no mate in 1.
- **mate-in-3:** 12 rows, each `accept` = the mate-within-3 set exactly, with no mate within 2.
- **win-material:** 16 rows. Each `accept` = the material-best set exactly (ABC-084's rule), with
  gain > 0. ABC-084's 6 rows are included.

**Curation claims for the 10 new win-material rows:** gain ≥ 2, the runner-up ≥ 2 behind and no mate
within 2. All 10 meet them (gain +2…+8, margin 2–4).

**Structure and legality.**
- **quiet-key:** 14 rows. Every accepted move is no capture, no check and no promotion.
- **New rows:** 22, with no duplicate and no colour mirror against any of the 62 corpus rows (38 answered + 24 hanging).
- **`ADR-0033` (two rules):** no new row has a pawn on rank 1/8, and in no new row is the side not to
  move in check.

**`LEGALITY`: the two known old defects reproduce,** and both are already `ABC-126`'s:
- "pin: Re1 pins the queen to the king" has a pawn on rank 1/8.
- "discovered check: the bishop moves, Rxd8" has the side not to move in check. The bishop on d4
  attacks the king on g7.
- **Note on the second row's answer.** On QE's first run the oracle allowed king captures, and that
  row read `d4g7` at +998, a mismatch. The page's set (`d4a1,d4b2,d4c3,d4e5`, +6) exists only under
  the convention that a king is never captured. The oracle now refuses king captures, as `src/` and
  QE-084 do.

## Provenance: 22/22 seeds reproduce (`probe/seed-repro.mjs` → `.out.txt`)

`rng` and `gen` were lifted as text from the build's `curate-m3.mjs` / `curate-wm.mjs`. No engine was
loaded. `toFen(gen(seed))` equals the committed placement and side for all 22 new rows.

## Commits, byte identity, intermediate red (`probe/raw-static.txt`, `probe/raw-e1f5732.txt`)

**Byte identity.**
- `HANGING_CORPUS` is byte-identical to `4a64dd9`.
- The old `PUZZLES` block (16 inline rows plus the `HANGING_CORPUS` spread line) is a byte-identical
  prefix of the new one.
- The corpus diff removes exactly one line, the `kind` union.

**Commit shapes.**
- `e1f5732` touches `puzzle-corpus.ts` (+50/−1) and `puzzle-suite.test.ts` (+202/−2) only.
- `47433c5` touches **only** `src/puzzle-suite.baseline.json` (+14/−7), and its message states a
  reason.
- `a7e1128` touches 0 `src/` files.
- Trigger-list lines over `4a64dd9..a7e1128`: **0**.

**`e1f5732` alone** (git archive, out of tree):
- The default lane is green: 50 files / 1543.
- `PUZZLE_DEEP=1` exits 1 with **only** the gate row red (`expected 62 to be 40`).
- The other 16 rows pass, the two `A2` oracle rows and `ABC-084` A1/A2 included.

## Headroom and budget-edge readings (out of tree; `src/` never edited)

| run | solved | `NEWLY-*` | gating | load1 |
|---|---|---|---|---|
| 4× readings (step 0.25), `probe/raw-4x.txt` | **62/62**, exit 0 | 4 `NEWLY-SOLVED` (the 4 headroom rows) | **299.04 s** (330.5 s real) | 19.2 → 44.1 |
| 0.8× readings (step 1.25), `probe/raw-0.8x.txt` | **54/62**, exit 1 | 4 `NEWLY-MISSED`: seeds 1008, 1075, 1424, 1982 (all `depth≥5` mate rows) | 28.4 s | 45.9 → 34.0 |

- **4×:** a reading, not a lane row. Its gating run came within 1 s of the 300 s per-row guard at
  load1 ~44.
- **0.8×:** a 20 % cut in readings drops 4 solved rows. These are the rows the `W14` red rests on
  (1008, 1075), plus 1982, which `W13` also catches.

## `A7` / `A8` / `A9`: readings only (not QE's to rule)

- **`A7`.** Gating 28.3 / 32.3 / 30.5 s. Whole lane 44.8 / 53.4 / 47.0 s real. Load1 7.4–8.8 at start.
  All under the 45 / 90 s caps. At `e1f5732`, with QE's matrix running alongside (load1 ~9–19), the
  gating run read 43.7 s. Nothing is asserted, and the guards are 300 s.
- **`A8`.** 50 test files at base and at tip (0 new). The net ms charge is not measured by QE.
- **`A9`.** Not landed. `AGENTS.md` is 23 464 B and unchanged on the branch; the line is the Scribe's.
