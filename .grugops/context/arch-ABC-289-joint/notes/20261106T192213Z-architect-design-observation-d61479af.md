---
id: 20261106T192213Z-architect-design-observation-d61479af
kind: observation
by: architect-design
at: 2026-11-06T19:22:13Z
verified_by: 
confidence: high on every count, deterministic and re-readable from raw/; all DIAGNOSTIC under PREREG 174760a3; what the drift means as error is UNKNOWN - verify
refs:
  - arch-ABC-289-joint
  - grugops/arch-ABC-289-joint
  - ABC-289
  - ABC-291
  - EPIC-011
  - ADR-0074
  - ADR-0072
  - ADR-0034
  - ADR-0028
  - b42706b3
  - 063ca870
  - se-ABC-289/20261106T190400Z-software-engineer-failed-attempt-0e380b06
  - se-ABC-289/20261106T190400Z-software-engineer-observation-8b80f592
  - arch-ABC-289/20261104T201807Z-architect-design-decision-174760a3
supersedes: 
seal: sha256:81b58835dcdf81d0ecb581d0b51dd7092d8a1ff51e47c044e464727d67622a19
---

# arch-ABC-289-joint readings: the two reds reproduce; both are `moveCount` with Q2, not the countermove; row 1632 is class B on `ADR-0034`'s ladder and no longer holds 0.8× on the door; drift at other depths is wider than the one row at d5 suggests

Architect/Design, on `git archive b42706b3 src package.json` copies in scratch, under the host lock, one job at a time. No game, no timing, no `src/` or branch change. Everything here is DIAGNOSTIC under PREREG `…174760a3`: it cannot change a verdict and it moves no bar. Scripts and outputs: `raw/`. All jobs exit 0 (`raw/out/exits.txt`).

## 1. The four arms, `deltaPruning` head against its door

`moveCount` and `countermove` set in `search()`, `chooseMove` and the two new doors. d5 on the 190; `G1` on its clock.

| arm | drift `search()` | drift `chooseMove` | `G1` head | `G1` door |
|---|---|---|---|---|
| shipped tip, both on | 99.47 %, **34** | 99.47 %, **34** | **53, 1632 new** | 54 |
| `countermove` off | 98.93 %, **34** | 99.47 %, **34** | **53, 1632 new** | 54 |
| `moveCount` off | 100 %, 12 | 100 %, 20 | 54 | 54 |
| both off | 100 %, 12 | 100 %, 20 | 54 | 54 |

- The tip's figures are `…8b80f592`'s, on a fresh copy. The both-off row is `…0e380b06`'s and `ADR-0074`'s.
- **Both reds are P4 with Q2.** The countermove neither causes nor cures them. With it off a second row reads 29 cp (`startpos/b2b4`).
- **The `moveCount`-off arm, the rest of the page:** d8 ratios 0.6331 / 0.6475 / 0.8433 / 0.8203; reach 6.900 → 7.158 (+0.258; 52 deeper, 4 shallower); floor 0 / 191, 0 / 189; zugzwang 7 / 7. Against the shipped figures: `main` reach 7.016, both-on head 7.405. `G6` not read.

## 2. Row 1632 on `ADR-0034`'s ladder

`8/2R1QpK1/5p2/8/8/8/7n/1N4k1 w`, accept `e7e2`. `raw/out/row1632-ladder.jsonl`, `raw/out/ladder.txt`.

| readings | head | door |
|---|---|---|
| 0.8× | d5, `e7e3`, 29 993 | **d4, `e7f6`, 1 520** |
| 1× | d5, `e7e3`, 29 993 | d5, `e7e2`, 29 995 |
| +5 %, +10 %, +25 % | d5, `e7e3`, 29 993 | d5, `e7e2`, 29 995 |
| 2×, 2.5× | d5, `e7e3`, 29 993 | d5, `e7e2`, 29 995 |
| 3.33× | d6, `e7e2`, 29 995 | d5, `e7e2`, 29 995 |

- **Class B by the table:** a mate-in-3 row still missed at +25 %, at depth 5 against base's 5. Also B by d2: the instrument prints `src/engine.ts`, `src/quiescence.ts`, `src/search.ts` (`raw/out/adr0034-d2-instrument.txt`).
- **`e7e3` is a true mate, one move longer.** After it, head and door read −29 994 at d4 to d8 in both recursions. The game is still won; the row's label is exact and is still missed.
- **A same-depth mate is lost one ply above the floor's reach.** After `e7e2`, `search()` at d4 reads head −1 816 against door −29 996. d3, d5, d6, d7 agree. Not a bar: F2 reads d5.
- **The door lost this row's margin with the bundle.** On the tree without the bundle the door solves it at d4, 7 105 nodes. On `main` it needs d5, 16 838 of 20 534, so **at 0.8× readings `main` misses 1632**. No other row is newly missed at that rung; the door's count stays 54 only because seed 234 falls in. `G1` on `main` is green at 1×. `ADR-0034` d5's "every retained row tolerates about 25 % tree growth" no longer holds for this row.
- Other ladder rows move on both arms alike (1706, 1811, seeds 24, 234, 288, 580) and are not this ticket's.

## 3. Row `kiwipete/a2a4`, the drift red

`raw/out/a2a4-*.jsonl`. Score (`search()` head / door, `chooseMove` head / door):

| d | tip | `moveCount` off |
|---|---|---|
| 3 | 290 / 290, 290 / 290 | 290 / 290, 290 / 290 |
| 4 | 324 / 290, 324 / 290 | 290 / 290, 290 / 290 |
| 5 | **324 / 290, 324 / 290** | 290 / 290, 290 / 290 |
| 6 | 403 / 403, 403 / 358 | 358 / 358, 358 / 358 |
| 7 | 360 / 360, 403 / 360 | 360 / 360, 360 / 360 |
| 8 | 405 / 392, 405 / 392 | 392 / 392, 392 / 392 |

At d5 the head's 324 is nearer the row's deeper scores than the door's 290: it has seen `e6d5` early. That says the drift is not plainly an error on this row. It does not touch the bar, which reads difference, not truth. At d6 and d7 `chooseMove` differs by 45 and 43 cp on the same row.

## 4. Drift by depth (reports; only d5 is a bar)

Share within 25 cp and max, head against door. `raw/out/rows-*.jsonl`.

| d | both off, `search()` | both off, `chooseMove` | tip, `search()` | tip, `chooseMove` |
|---|---|---|---|---|
| 4 | 99.47 %, 31 | 99.47 %, 31 | 99.47 %, 34 | 98.93 %, 73 |
| 5 | 100 %, 12 | 100 %, 20 | 99.47 %, 34 | 99.47 %, 34 |
| 6 | 97.86 %, 89 | 99.47 %, 38 | 95.72 %, 106 | 95.19 %, 103 |
| 7 | 100 %, 22 | 100 %, 11 | 98.40 %, 58 | 96.79 %, 110 |

- **d5 was the quiet depth on the old tree too.** Its d6 reads 89 cp. `ADR-0074`'s 30 cp was derived from d5 alone, as sealed.
- **On the joint tree the spread is wider at every depth.** "One row, 4 cp over" is true of d5 and understates the rest. How much of that is error and how much is P4's own sensitivity is `UNKNOWN - verify`: head against door reads difference only.

## 5. What was deliberately not read

No other form: no check-exempt form with the bound, no wider margin with the bound, no second guard read. PREREG `…174760a3`: "No margin or form is added or moved after the read". A scan now would spoil any later PREREG's forms. `se-ABC-289`'s guard read stands as its one scratch read.
