---
id: 20261105T125815Z-architect-design-observation-f246a007
kind: observation
by: architect-design
at: 2026-11-05T12:58:15Z
verified_by: 
confidence: high for what source, git and the recorded kill sets show; every kill, kept ms and count at the tip is a prediction, UNKNOWN - verify; nothing was run
refs:
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
  - ABC-302
  - ABC-105
  - ABC-154
  - ABC-101
  - ABC-241
  - ABC-171
  - ABC-212
  - ABC-221
  - ABC-094
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - secnfr-census-1105/20261105T122931Z-security-nfr-decision-19cea480
  - orch-2026-10-30a/20261105T123040Z-orchestrator-decision-f40ce634
  - orch-2026-10-30a/20261105T124120Z-orchestrator-decision-9e878ba6
  - bapm-rows-cut-1105/20261105T124052Z-ba-pm-observation-0dd99758
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T181301Z-architect-design-observation-8c8cfeed
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - 02e6e180
supersedes: 
seal: sha256:9acb0d8d90b169883ce4fb09c16bbb18840400d4617d17f9677f9c7cf6244632
---

# arch-ABC-307 readings: every recorded mutant keeps a holder with the nine rows gone, three guards do not, and the note count is growing about three times faster than the trigger assumed

Architect/Design, task `arch-ABC-307`, at `main` `02e6e180`. **Nothing was run:** no test, build, engine, vitest, `tsc` or lint. Reads, git, and one script over recorded kill sets. The forms are in `ADR-0046` § Dated 2026-11-05 (`arch-ABC-307`), and this note holds only what they stand on.

## The limit of these readings
The page asks for measured mutant reads. This brief's width runs nothing. So no remnant was built, and no kill, kept ms or count at the tip is measured. The recorded kill sets are `arch-ABC-302`'s, on an older `src/`: `src/engine.ts` and `src/uci-session.ts` differ between `fed3f2b4` and `02e6e180`. No Q row was ever on a recorded mutant list.

## Recorded holders (`raw/holders.py`, `raw/holders.tsv`)
Dropping L1, L2, L3, C1, C2 and B1 from `arch-ABC-302`'s tip sets leaves every one of the 27 killed. Lowest counts among the nine rows' mutants: M7 2, QSEAMRAW 6, M2s 6, QMATCH1 7, F230 7.
- CLI A7 (L3) is among the killers of F230, M2s, M4, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1 and S241M1. R8's remnant holds all eight, R2's all but M4, `cli` `ABC-230` A1 all but M4 and S241M1.
- L2 holds QMATCH1 among the 27. `qe-ABC-244` also has S241M2 for it, at steps 100 and 1 000. Its UCI twin ("A4: the move that makes the third occurrence scores exactly 0; with a legal ep capture, …") is among QMATCH1's holders.
- L1 holds M6 and M7, C1 M6, B1 M4 and M4z. C2 is on none of the 27.

## Depth (`arch-ABC-302` `raw/probe2-cli.tsv`, `qe-ABC-244`)
- Step 100: seam 79.9 ms, depth 13, 27 655 nodes on the UCI shape. Step 250: seam 9.6 ms, depth 11. Step 500: seam 1.3 ms, depth 8. Step 1 000: 55 nodes, depth 4.
- At 346 nodes a ms, 1.3 ms is about 450 nodes, so 0 in-search node checks at `NODES_PER_CLOCK_CHECK` 1 024. An estimate; nodes at 500 were never recorded.
- `QE-244-a`: at 1 000, A7 loses F230, QSEAMRAW, QPRIOROFF, QMATCH3 and QTRIM1, and keeps S241M1, S241M2 and S241M4. The lost five need base's search on the hash list to play something other than d8e8. For A7 at 500 that is unread.
- No record of `ABC-302` reads its 500 ms remnants against `ADR-0046`'s floor.

## Source
- **`ABC-154`'s plants fire only on the unfiltered `readNotes`** (`qe4-ABC-105`'s `plants4.py`). A remnant on injected or filtered notes never reaches that branch, and the synthetic trees use neither family of folder name. The page's Q1 remnant would have gone 0 red on them.
- **The clamp's holder.** `budgetAt` stubs `chooseMove`, and the clamp is in it. "A11 — busy isready in the mode" sends `go movetime 30000` to the real search and reads `expectWithin(info.time, 30_000, 5_000)`, whose lower bound is the budget. `HARD_CEILING_MS` is pinned at 60 000 in `src/engine.test.ts`, `src/levels.test.ts` and `src/uci-session.test.ts`, and `ABC-259`'s default-lane source row pins the `deadline` line. RF-1's rows stay green under a lower literal, by reading.
- **`src/uci-session.test.ts` already imports everything L1, L2 and L3 use at runtime,** except `gameStatusOf`, which `./history.ts` exports and that import line already loads.
- **`--json` appears on one line of the file, Q3's.** No other row reads the partition.
- **Lane inputs.** The run rule's list holds neither `tools/grugops/qe-hop-integrity.js` nor `data/opening-book/book.json`.

## The record's size
| at | notes on `main` |
|---|---:|
| 2026-11-01 00:00 | 4 231 |
| 2026-11-02 00:00 | 4 537 |
| 2026-11-03 00:00 | 4 727 |
| 2026-11-04 00:00 | 4 988 |
| 2026-11-05 00:00 | 5 299 |
| `c9ff7ff9` | 5 434 |

That is about 267 a day, against the 74–104 the catalog's 5,500 was set on. Counted with `git ls-tree`. The context folder holds 1 345 folders. The named-folder subset is 15 folders and 52 notes.
