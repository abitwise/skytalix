---
id: 20260820T164500Z-qe-e2e-observation-a4-the-coverage-price-of-every-candidate-by-criterion-id-2b8d47ea
kind: observation
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T16:45:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A4
  - ABC-006
  - ABC-013
  - ABC-017
  - ABC-019
  - ABC-025
  - ABC-077
  - ABC-078
  - NFR-002
supersedes:
---

# `A4` — the coverage price of all eight candidates, **by criterion id**, each one marked *still answered in the default lane* or *would move behind the flag*, with the resulting count

**This is not a stamp.** Hand-authored `observation`; no `finding` is admissible on this install.
**"Coverage preserved" appears nowhere below, because it is not an answer to `A4`.**

## Method, and one thing it forced into the open

Criterion ids were read from the **test titles vitest actually reports** (the JSON reporter's
`ancestorTitles` + `title`), not from file header comments, because a comment can describe an
intention a test no longer has. Cross-coverage was then checked file by file: for each criterion, is
there a **retained** default-lane file that also answers it?

**Criterion ids on this project are TICKET-SCOPED and they collide.** `A1` means five different
things across `ABC-013`, `ABC-017`, `ABC-025`, `ABC-077` and `ABC-078`; `san.parse.test.ts`,
`frame.test.ts` and `status-panel.test.ts` all report an `A1`–`A7` band belonging to their own
tickets. **Every id below is written `TICKET/id` for that reason, and a bare `A1` in any downstream
re-homing table should be treated as an error.**

## The table `A4` asks for

### 1. `src/engine.test.ts` — saving **1.400 s** — **7 criteria move, 0 remain**

| criterion | status if this file moves |
|---|---|
| `ABC-078/A2` (budget below one iteration still returns a move) | **would move behind the flag** |
| `ABC-078/A3` (aborted iteration's move discarded) | **would move behind the flag** |
| `ABC-078/A3-identity` (completed iteration equals `search()`) | **would move behind the flag** |
| `ABC-078/A4` (no fixed depth in the delivered engine) | **would move behind the flag** |
| `ABC-078/A5` (completed depth monotonic in budget) | **would move behind the flag** |
| `ABC-078/A6` (implementation IS an `EngineSeam`, loop drives it) | **would move behind the flag** |
| `ABC-078/A7` (legal move at an exhausted budget, 200+ positions) | **would move behind the flag** |
| `ABC-078/RF-1` (budget above `HARD_CEILING_MS` is capped) | **would move behind the flag** |
| `ABC-078/A1` (wall-clock, 30 positions at 3 s) | *unchanged — already `ENGINE_DEEP` only* |

**`ABC-078` default-lane criteria: 8 → 0.** No retained file answers any of them; `search.test.ts`
mentions `ABC-078` but answers `ABC-077`'s table. **`ABC-078/A4` and `RF-1` are the guards on
`RISK-002` (no fixed per-move depth) and on the unbounded-budget path — the two the CLI's live
session depends on.**

### 2. `src/perft.test.ts` — saving **1.055 s** — **4 criteria move, 0 remain — and `ABC-006` HAS NO CRITERION IDS**

**`ABC-006`'s acceptance is five unnumbered prose bullets.** `A4` demands the price "by id" and the
ids do not exist on the page. I assign positional ids **`ABC-006/AC1`–`AC5`** here so the table can
be written, and **flag that assignment as mine, not the ticket's** — it must be written onto
`ABC-006` before any re-homing table cites it, or two hops will number them differently.

| criterion (positional id assigned here) | status if this file moves |
|---|---|
| `ABC-006/AC1` startpos counts 1–4 (depth 5 is already `PERFT_DEEP`) | **would move behind the flag** |
| `ABC-006/AC2` kiwipete counts 1–3 (depth 4 is already `PERFT_DEEP`) | **would move behind the flag** |
| `ABC-006/AC3` all six standard positions to their configured depths | **would move behind the flag** |
| `ABC-006/AC5` `perftDivide` at depth 3 sums to the total, labels moves | **would move behind the flag** |
| `ABC-006/AC4` a broken generator makes the suite fail (non-vacuity) | *asserted by NO default-lane test today* — see below |

**`ABC-006` default-lane criteria: 4 → 0.** `apply.test.ts` and `fen.test.ts` reference `ABC-006` but
assert no perft count. **A second gap, reported not smoothed: `ABC-006/AC4` — the non-vacuity
criterion — has no test anywhere in the lane.** It is a mutation property nothing runs. That is true
today and is not caused by any move; it is named because a re-homing table that lists `AC1`–`AC5` as
"moved" would be claiming a coverage this project never had.

**`npm run perft` is a separate command, not the default lane**, so it is not a re-homing answer
under this project's convention.

### 3. `src/history-pane.test.ts` — saving **0.775 s** — **11 criteria move, 2 remain (+2 sub-clauses)**

| criterion | status if this file moves |
|---|---|
| `ABC-017/A1` … `ABC-017/A10` (10 criteria) | **would move behind the flag** |
| `ABC-017/A14` | **would move behind the flag** |
| `ABC-017/A11` (the pane derives nothing — a spied call count) | *still answered in the default lane* — `src/history-pane.nfr.test.ts`, retained |
| `ABC-017/A6.3`, `ABC-017/A6.4` (type-only exclusion; generalised importer forms) | *still answered in the default lane* — `src/history-pane.nfr.test.ts`, retained |
| `ABC-017/A13` (the frame's composition fit-check) | *still answered in the default lane* — `src/frame.test.ts`, retained |
| `ABC-017/A12` (two wall-clock parts) | *unchanged — asserted nowhere by standing rule; its third part IS `A11`* |

**`ABC-017` default-lane criteria: 13 → 2** (`A11`, `A13`), plus `A6`'s two sub-clauses. **The best
retention ratio of any candidate**, and it is an accident of `ABC-017` having already split its
call-count and composition criteria into two other files.

### 4. `src/san.qualifier.hardening.test.ts` — saving **0.590 s** — **6 criteria move, 0 remain**

| criterion | status if this file moves |
|---|---|
| `ABC-025/A1` (minimality ladder — kills `Q33 Q34 Q35 Q27 Q38`) | **would move behind the flag** |
| `ABC-025/A2` (the census — `A1` may not be vacuous) | **would move behind the flag** |
| `ABC-025/A3` (63 hand-typed strings — kills `Q28'` and eight more) | **would move behind the flag** |
| `ABC-025/A4` (injectivity given an owner — **SOLE guard on `Q13 Q14 Q36`**) | **would move behind the flag** |
| `ABC-025/A5`, `ABC-025/A6` | **would move behind the flag** |

**`ABC-025` default-lane criteria: 6 → 0.** `san.suffix.hardening.test.ts` is retained but reports
no `ABC-025` criterion id in any of its 4 tests. **This file is the whole net BA/PM cut `ABC-025`
for: six wrong builds of `toSan` pass every other test in the repository.** Moving it puts all six
back behind a flag. **`ABC-025/A4` is named on the file's own header as the SOLE guard on three
mutants** — moving it is the single most concentrated loss per criterion in this table.

### 5. `src/search.test.ts` — saving **0.585 s** — **7 criteria move, 0 remain**

| criterion | status if this file moves |
|---|---|
| `ABC-077/A1` … `ABC-077/A7` (7 criteria) | **would move behind the flag** |

**`ABC-077` default-lane criteria from this file: 7 → 0.** `SEARCH_DEEP` already holds the expensive
repetitions; this is the file that keeps every criterion answered in the default lane, and moving it
is precisely the convention `ABC-077` wrote into `AGENTS.md` being reversed. `search.qe.test.ts`
(retained, unless also moved) answers `QE-G1`, which asserts the BEHAVIOUR that `ABC-077/A6`'s
source-text assertions were found bypassable on — **a partial and deliberately narrower substitute,
not an answer to `A6`.**

### 6. `src/search.qe.test.ts` — saving **0.405 s** — **3 criteria move, 0 remain**

| criterion | status if this file moves |
|---|---|
| `ABC-077/QE-G1` (no exported function yields a move with depth omitted) | **would move behind the flag** |
| `ABC-077/QE-G2`, `QE-G3` (the search prefers the bigger piece; does not throw a queen away) | **would move behind the flag** |

**3 → 0.** **These three exist because mutation testing found nothing else notices**: the file's own
header records that swapping `PIECE_VALUE`'s rook and queen left **all 963 tests green**. Moving
them behind a flag restores exactly that blindness in the default lane. **They are QE's own
gap-closers, added at an `In Review` hop, and I am naming that conflict of interest rather than
letting it sit unstated.**

### 7. `src/san.test.ts` — saving **0.510 s** — **20 criteria move, 2 remain — the HIGHEST criterion price in the table**

| criterion | status if this file moves |
|---|---|
| `ABC-013/A1` … `ABC-013/A20` (20 criteria — the whole `toSan` acceptance table) | **would move behind the flag** |
| `ABC-013/A21` (the cost bars) | *still answered in the default lane* — `src/san.nfr.test.ts`, retained |
| `ABC-013/A22` (the suite) | *unchanged — it is the gate itself* |

**`ABC-013` default-lane criteria: 22 → 2.** `san.qualifier.hardening.test.ts` explicitly does NOT
re-assert them — its own header records that widening its corpus would silently redefine
`ABC-013/A18` and `A19` and make its own `A5` unfalsifiable. `san.parse.test.ts`, `frame.test.ts` and
`status-panel.test.ts` report `A1`–`A12` bands belonging to their OWN tickets, not `ABC-013`'s.
**20 criteria for 0.510 s is the worst ratio on offer: 39 ms of saving per criterion moved, against
`engine.test.ts`'s 175 ms.**

### 8. `src/turn-loop.nfr.test.ts` — saving **0.395 s** — **1 NFR guard moves, 0 remain**

| criterion | status if this file moves |
|---|---|
| `NFR-002` derive-once-per-ply, spied at `ABC-019/A17`'s 40 / 120 / 300 ply counts | **would move behind the flag** |
| `ABC-019/A17`'s timing `MET`/`MISS` | *unchanged — Security/NFR's out-of-tree measurement, never in this lane* |

**1 → 0, and this candidate carries a structural objection the others do not.** It is a
`*.nfr.test.ts` **permanent guard**, and its own header records why it exists: the timing bar it
replaces **cannot resolve the 2x error it is meant to catch** (two derives per ply is 93.58 µs
against a ≤ 100 µs bar — it PASSES while being twice wrong), so the bar was moved off a clock and
onto a spy. **Putting that spy behind an opt-in flag disarms an NFR bar in the default lane, which is
the same species of harm `ADR-0008` decision 7 refuses `isolate: false` for, at a smaller scale.**
I am not choosing sets, but the price of this one is not 1 criterion — it is an NFR bar going quiet.

## The resulting counts, all in one place

```
file                                saving    criteria MOVED   criteria still answered   ms saved
                                              behind a flag    in the default lane       per criterion moved
engine.test.ts                      1.400 s         8                  0                    175
perft.test.ts                       1.055 s         4                  0                    264
history-pane.test.ts                0.775 s        11                  2 (+2 sub-clauses)     70
san.qualifier.hardening.test.ts     0.590 s         6                  0                     98
search.test.ts                      0.585 s         7                  0                     84
san.test.ts                         0.510 s        20                  2                     26
search.qe.test.ts                   0.405 s         3                  0                    135
turn-loop.nfr.test.ts               0.395 s         1 (an NFR bar)      0                    395
```

**Read the last column as a price, not a score.** It says nothing about which criteria matter — a
cheap-per-criterion file may hold the one guard that catches a live mutant, and `ABC-025/A4` and
`ABC-077/QE-G2` are exactly that. **It is offered so the owner can see the shape of the trade, and it
does not rank the options.**

## Two gaps in the inputs, recorded because they will bite `A6`–`A9`

1. **`ABC-006` has no criterion ids.** The `AC1`–`AC5` above are mine. **Number them on the ticket
   before any re-homing table cites them.**
2. **`ABC-006/AC4` (non-vacuity — a broken generator must fail the suite) is asserted by no test in
   the lane today.** Pre-existing, not caused by anything here, and **flagged rather than fixed**:
   fixing it would add a test to the lane this ticket is trying to shrink, and this hop moves nothing.
