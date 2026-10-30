---
id: 20261030T223415Z-architect-design-observation-77b392a3
kind: observation
by: architect-design
at: 2026-10-30T22:34:15Z
verified_by: 
confidence: high for figures copied from qe-ABC-229 / qe-ABC-220 raw records; the row-level and collect split is from QE's G8 run-6 JSON report (sha256 54ae234d…), shape only and not admissible; nothing run or timed at this hop
refs:
  - arch-g8-headroom
  - NFR-008
  - QE-229-a
  - SEC-REBASE-b
  - ADR-0046
  - ADR-0035
  - ADR-0027
  - ADR-0040
  - ABC-229
  - ABC-220
  - ABC-228
  - ABC-230
  - ABC-241
  - ABC-242
  - ABC-243
  - ABC-221
  - ABC-177
  - G8
  - qe-ABC-229/20261030T202320Z-qe-e2e-observation-0b7fd4f6
  - qe-ABC-220/20261030T152147Z-qe-e2e-observation-58af5b6a
  - secnfr-catalog-rebase
  - d1b14662
supersedes: 
seal: sha256:a8c75260777eddc684db4891b4ea9396192bcbfad446d6618a3b4ad547d765b8
---

# Architect/Design observation, arch-g8-headroom: the default lane's cost by file at `ABC-229` (9.90 s), and why `src/uci-session.test.ts` costs 2.0 s on a virtual clock

Records only, on branch `grugops/arch-g8-headroom` from `main` `d1b14662`. Nothing was run or timed, because an SE
runs `npm test` beside this hop. Every figure is copied from a QE record or derived from QE's own `G8` run-6 report.

## Sources
- **Per-file medians:** `qe-ABC-229` `raw/g8/g8-perfile.txt` (median vitest time per file over 3 base and 3 head
  runs) and `raw/g8/g8.log.txt`. The note is `qe-ABC-229` `…0b7fd4f6`.
- **Before and after `ABC-220`:** `qe-ABC-220` `raw/g8/g8-*.txt` (default-reporter logs, 3 base and 3 head runs).
- **Shape (row-level, collect gaps):** the JSON report written by QE's `G8` run 6.
  - Run 6 is head `e196a281`, which started 16:30:42Z, read 9.90 s wall, and is graded in the log.
  - The report sat in the `qe-ABC-229` worktree's `.test-results/last-run.json`, sha256 `54ae234d…0fb5ef`. QE did
    not commit it.
  - The derived outputs are in `.grugops/context/arch-g8-headroom/raw/probe/` (`rank.out`, `timeline.out`,
    `rows.out`; `rank.py` and `timeline.py` are byte copies from `arch-lane-under-10s`, and `rows.py` is new).
  - It is used for shape and ranking only. It is not an admissible reading.

## The lane's arithmetic (run 6)
- vitest Duration 9.56 s, process wall 9.90 s. Of vitest's own accounting, imports took 6.24 s and tests 8.04 s,
  summed over workers.
- **2 slots, both busy to the end, so wall ≈ 0.35 s + Σ slot-seconds ÷ 2.** Σ ≈ 2 × 9.57 ≈ 19.1 slot-seconds. This
  is the `ADR-0046` model, and it still holds.

| block | slot-s | share | fenced by |
|---|---:|---:|---|
| per-file worker start and imports, ≈ 0.12 s × 63 files | ≈ 7.8 | 41 % | `ADR-0040` (isolation on, `maxWorkers: 2`) |
| `src/cli.test.ts` module-scope children (28 `spawnSync`, before its first test; seen as a 3.48 s gap on one slot) | ≈ 3.4 | 18 % | `N8-SPAWN`, `ABC-173` `C2` (synchronous only) |
| test bodies, all files | 7.99 | 42 % | the rows themselves |

## Ranking by test-body cost (head median ms, `g8-perfile.txt`; qe-hop from run 6)
| # | file | head ms | note |
|---:|---|---:|---|
| 1 | `src/uci-session.test.ts` | 2 007 | 200 rows. It was 1 770–1 793 ms at 148 rows before `ABC-220` (`qe-ABC-220` base logs), so `ABC-220` added ≈ +0.2 s |
| 2 | `src/search.null-move.test.ts` | 1 443 | fixed depth, no clock: `QE-208-a` sweep 354, `QE-208-b` 329, A2 instrumented 295, doors 248 |
| 3 | `src/cli.test.ts` | 1 325 | **plus ≈ 3.4 s of collect that this column does not show**. Of the bodies, `ABC-230` 710 and `ABC-241` 335 |
| 4 | `src/engine.test.ts` | 525 | `ABC-230` A4 is 239, already at budget 5 / `tickingClock(1)` |
| 5 | `tools/grugops/qe-hop-integrity.test.ts` | ≈ 280 | not in QE's per-file list. It grows with the board (`T-QEHOP-GROWTH`) |
| 6–15 | `legal` 132, `levels` 130, `zobrist` 124, `quiescence` 115, `book` 111, `search.ordering` 108, `perft` 108, `search` 101, `history-pane.nfr` 99, `transposition` 92 | | none over 0.14 s |
| — | the other 47 files in QE's list, plus `tools/opening-book/book.test.ts` (≈ 20, run 6) | ≈ 1 310 | |

**With collect counted, `src/cli.test.ts` is the costliest file, at ≈ 4.8 slot-seconds.** `src/uci-session.test.ts`
comes next at ≈ 2.1.

## Why `src/uci-session.test.ts` costs ≈ 2 s on a virtual clock
- **A virtual clock makes the abort point a node count. It does not make the search free** (`ADR-0027`).
  - The engine reads the clock every `NODES_PER_CLOCK_CHECK` = 1 024 nodes, plus once per iteration and once at
    return.
  - So a search costs about 1 024 × (budget ÷ step) nodes.
  - At the default level, 4 000 ÷ 100 is 40 reads, about 41 000 nodes, which is 60–70 ms here. The row "a bare go:
    go -> 4000 ms" took 64 ms.
- **The file holds 25 rows in the 30–110 ms band, 1.72 s in all.** The other 175 rows take 0.28 s.
  - Most of the 25 are class P rows (a pinned `G ≤ time ≤ G + 2 × step`) at step 100, from `ABC-167` A5/A6/A7,
    `ABC-171`, `ABC-174` and `ABC-212`. Those keep their step under `ADR-0046`.
  - The class H rows went to step 1 000 at `ABC-177`.
- **The single largest row is time-blind.** `ABC-230` A2, "bestmove is byte-equal to the CLI level seam's move on
  the same game and clock", takes 271 ms. Its sibling `ABC-241` A5 takes 84 ms.
- **`ABC-228` (ii) moved level 5 from 3 000 to 4 000 ms.** Every row that takes its budget from `LEVELS` or
  `DEFAULT_BUDGET_MS` at a fixed step then made 33 % more reads, without its file changing. `G8` read +0.70 s at that
  ticket (`qe-ABC-228-ii`).

## The tranche-1 set (run 6, in-thread ms; every row reads the move, the score or the keys, and none reads time)
| file | block | rows | ms |
|---|---|---:|---:|
| `src/cli.test.ts` | `ABC-230` A1, A3, read-once | 3 | 710 |
| `src/cli.test.ts` | `ABC-241` A4 ×2, A7 (+1 static row, 0 ms) | 4 | 335 |
| `src/uci-session.test.ts` | `ABC-230` A2/A3/A5 | 7 | 294 |
| `src/uci-session.test.ts` | `ABC-241` A4/A5 | 4 | 90 |
| | **total** | | **1 429** |

## Lane history on `oeselg-devl` (head medians, QE records)
- `ABC-228` (i): 9.37 s.
- `ABC-228` (ii): 9.61 s, against base 8.91 s.
- `ABC-241`: 9.63 s.
- `ABC-220`: 9.73 s.
- `ABC-229`: 9.90 s, against base 9.90 s.
- **The same lane inputs** (`fbab54ff` and `b92a3394`, with an empty `git diff` over the lane inputs) read 9.73 s
  and then 9.90 s, a +0.17 s drift between windows.
- **`ABC-229`'s base runs span 9.64–10.09 s.** One single `npm test` on `main` already reads over 10 s.
