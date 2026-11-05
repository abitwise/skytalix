---
id: 20261105T134134Z-architect-design-observation-f8c13d49
kind: observation
by: architect-design
at: 2026-11-05T13:41:34Z
verified_by: 
confidence: high for every kill, count and -t line, read under the sealed PREREG with no empty or short report; kept ms are single-worker medians of three, ungraded; the MC1 cause rests on a post-seal probe and one base read
refs:
  - arch-ABC-307-reads
  - arch-ABC-307
  - ABC-307
  - EPIC-011
  - ADR-0046
  - ADR-0035
  - NFR-008
  - T-QEHOP-GROWTH
  - R-N8H-1
  - R-N8H-2
  - R-307-a
  - R-307-b
  - R-307-c
  - QE-244-a
  - QE-105-p
  - QE-154-a
  - AR-154-TWO-POINT-CONTROL
  - ABC-105
  - ABC-154
  - ABC-101
  - ABC-241
  - ABC-171
  - ABC-212
  - ABC-220
  - ABC-221
  - ABC-259
  - ABC-094
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - arch-ABC-307-reads/20261105T130959Z-architect-design-decision-5c65a408
  - arch-ABC-307/20261105T125815Z-architect-design-decision-838ecf31
  - arch-ABC-307/20261105T125815Z-architect-design-observation-f246a007
  - orch-2026-10-30a/20261105T125927Z-orchestrator-decision-f86e0257
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - 8d66a706
supersedes: 
seal: sha256:81c743cd5a4bb0eb37c3827d801dc55dbf8bb05ee76b63be73168fd07f08034a
---

# arch-ABC-307-reads readings: the 20 mutants and every plant the base kills stay killed at the tip, with each remnant among its own killers. One sealed clause misses: C1's full row, alone on its `-t` line, passes under MC1. Saved reads 592 of 750 against 581, k is 7

Architect/Design, task `arch-ABC-307-reads`, on scratch copies of `main` `8d66a706`, under the PREREG `…5c65a408`. Every run was under the host lock on one core and one worker, about 25 minutes of lock in all. No report was empty or short: 40 lanes at 2 709 rows in 71 files, and the plant reports. Kill sets are in `raw/kills/`, `raw/kill-matrix.tsv` and `raw/plants.tsv`.

## Controls
- Three base lanes and three tip lanes: 2 709 / 2 709, 71 files, 0 skipped. Names: 9 out, 9 in. No " [deep" title in the default lane.
- All nine `-t` lines, unmutated: 1 passed (`raw/tlines-control.tsv`).
- Counts by `vitest list`, base → tip. Default: `uci-session` 245 → 245, `book` 35 → 35, `qe-hop` 32 → 32, `cli` 109 → 109. `ENGINE_DEEP=1`: `uci-session` 265 → 270, `book` 35 → 36, `qe-hop` 32 → 35. `cli` has no deep lane. Whole deep lanes were not run, as sealed.
- **B1's k is 7.** Replies on seeds 1 to 10: e7e5, e7e5, e7e5, e7e6, e7e5, e7e5, b8c6, c7c5, c7c5, e7e5. The third distinct reply is at seed 7, not near 4 as `ADR-0046`'s 20 ms assumed.

## The kill matrix (whole default lane, base and tip)
| mutant | base | base rows of the nine | tip | remnants among them | named holders among them | `-t` |
|---|---:|---|---:|---|---|---|
| ML1 | 1 | L1 | 1 | L1~ | - | L1 1 failed |
| M6 | 21 | L1, C1 | 20 | L1~, C1~ | - | L1, C1 1 failed |
| M7 | 3 | L1 | 3 | L1~ | - | L1 1 failed |
| S241M2 | 12 | L2, L3 | 12 | L2~, L3~ | `uci` A4 | L2, L3 1 failed |
| QMATCH1 | 8 | L2 | 7 | - | `cli` A4 (slice), `uci` A4, `ABC-249` | L2 1 failed |
| S241M1 | 18 | L3 | 19 | L2~, L3~ | `cli` A4 (slice), `uci` A5 (slice), `uci` A4 | L3 1 failed |
| S241M4 | 2 | L3 | 2 | L3~ | - | L3 1 failed |
| F230 | 8 | L3 | 7 | - | `cli` A4 (slice), `uci` A5 (slice), `cli` `ABC-230` A1 | L3 1 failed |
| M2s | 7 | L3 | 6 | - | the same three | L3 1 failed |
| M4 | 19 | L3, B1 | 20 | L2~, L3~, B1~ | `cli` A4 (slice), `uci` A4 | L3, B1 1 failed |
| QSEAMRAW | 7 | L3 | 6 | - | the same three as F230 | L3 1 failed |
| QPRIOROFF | 16 | L3 | 15 | - | those three, `uci` A4, `ABC-249` | L3 1 failed |
| QMATCH3 | 20 | L3 | 19 | - | the same five | L3 1 failed |
| QTRIM1 | 30 | L3 | 29 | - | the same five | L3 1 failed |
| MC1 | 11 | C1 | 11 | C1~ | - | **C1 1 passed** |
| MC2h | 9 | C2 | 9 | C2~ | - | C2 1 failed |
| P2a | 17 | C2 | 17 | C2~ | `ABC-221` A11 | C2 1 failed |
| P2b | 6 | C2 | 5 | - | `ABC-221` A11; also `ABC-220` A6 and A13, `ABC-221` A7, `ABC-259` | C2 1 failed |
| MB1 | 3 | B1 | 3 | B1~ | - | B1 1 failed |
| M4z | 22 | B1 | 22 | B1~ | - | B1 1 failed |

- Every one of the 20 is killed at base and at the tip. No suite error. Each row's full row is among the base killers of its own mutant.
- **`ABC-241` A7's eight all hold:** F230 7, M2s 6, M4 20, QSEAMRAW 6, QPRIOROFF 15, QMATCH3 19, QTRIM1 29, S241M1 19.
- ML1 has one killer at base and one at the tip. It is the only mutant here whose killer is that row alone.
- **Where the ADR's reading was wrong:** P2a is killed by C2's remnant, because the session reads `HARD_CEILING_MS` too. The ADR said no. S241M1 and M4 gain L2~.

## The trio (`raw/plants.tsv`, 38 tool plants, 6 memo plants, 3 re-anchored)
- **Every plant the base file kills, the tip file kills.** Two read 0 at both: `q5x-…-real-tree-only` and `q5x-…-quality-gate-except-ABC-031`, as `QE-154-a` recorded, so they leave parity.
- `ABC-154`'s two `q4a` plants: base Q1, Q2; tip Q1~. MQ2: Q1~, Q2~. MQ3: Q3~. So a plain sweep on the copied root does reach the unfiltered branch.
- `q4b-both-memos-empty`: base 2 red. At the tip the memo plant reaches only the deep rows (0 default, Q1 and Q2 deep). Re-anchored: `q4b-tip-both-empty` reads Q1~, Q2~.
- Under each of those, the deep rows that went red are the base's rows, by name.
- **A5R:** base 3 red, tip 0. No default-lane row reads the real tree unfiltered, so the page's `A5` holds, measured.

## Kept ms (`raw/kept.tsv`; ungraded; one core, one worker, median of three)
| row | census | base | kept | saved |
|---|---:|---:|---:|---:|
| Q1 | 180 | 252.2 | 13.9 | 238.3 |
| Q2 | 90 | 129.9 | 7.3 | 122.5 |
| Q3 | 65 | 61.4 | 26.9 | 34.5 |
| L1 | 121 | 156.0 | 84.1 | 71.9 |
| L2 | 77 | 116.8 | 0.3 | 116.4 |
| L3 | 62 | 76.8 | 3.5 | 73.3 |
| C1 | 54 | 58.1 | 12.3 | 45.7 |
| C2 | 51 | 51.2 | 1.9 | 49.3 |
| B1 | 50 | 44.0 | 49.6 | −5.6 |
| sum | 750 | 946.2 | 199.9 | 746.3 |

- **At the sealed scale (× 0.793): kept 158, saved 592 of 750,** about −0.219 s realised, against 581 and −0.215 s. Inside by 11 ms.
- **That margin is smaller than the read's noise.** B1's three base reads run 34.6–59.3 and its kept 40.2–53.0, so its −5.6 is noise around a saving that seven seeds of ten leave small. Scaled row by row, not by the sum, the same read gives saved 569. That scale was not the sealed one.
- The estimates were low: L1 84 against 35 (three calls at the default level are most of the row), the trio 48 against 25, B1 50 against 20.

## MC1 and C1
- In the lane MC1 kills C1 at base and C1~ at the tip: `['b1c3', …]` against `['e2e3', …]`.
- **Alone on its `-t` line, the full row passes.** The sealed clause (d) reads "1 failed", and it reads 1 passed.
- **The row did not lose it by moving.** After the seal, the same row alone at base under MC1 also reads 1 passed (`raw/mc1-base-alone.txt`).
- **The cause is the mutant** (`raw/mc1-probe.txt`). MC1 adds the session count to the seed, and a session pair differs only where salts n and n + 1 take different paths on the first go. Salts 1 and 2 both take the engine path. In the lane the row's sessions fall on a pair that differs. So MC1's kill depends on how many sessions ran first, at both ends.
- M6 is C1's other listed mutant. It kills C1~ in the lane and the full row alone.
- The sealed read is not re-played, and no mutant was changed.
