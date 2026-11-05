---
id: 20261105T124145Z-architect-design-decision-0f8a4f82
kind: decision
by: architect-design
at: 2026-11-05T12:41:45Z
verified_by: 
confidence: high on the ruling, the list and no production change or door: code, ADR text and sealed figures decide them; A1 (a) at 5 and the door's stepping reads are UNKNOWN - verify, forecast by arithmetic; the reading of identity is a judgement, stated
refs:
  - arch-ABC-303-w1-rows
  - grugops/arch-ABC-303-w1-rows
  - ABC-303
  - ABC-282
  - ABC-286
  - ABC-288
  - ABC-078
  - EPIC-011
  - ADR-0071
  - ADR-0072
  - ADR-0073
  - ADR-0056
  - ADR-0067
  - ADR-0064
  - 2fd5243b
  - c0c5b84c
  - 572edf13
  - a21136b0
  - se-ABC-303-main/20261105T122839Z-software-engineer-failed-attempt-c31e9a54
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-main/20261105T122839Z-software-engineer-decision-1893d3c5
  - se-ABC-303-main/20261105T122845Z-software-engineer-observation-42aa51f1
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - orch-2026-10-30a/20261104T234244Z-orchestrator-decision-681c6363
supersedes: 
seal: sha256:349cb324a9e8ab272afb9003f55d2686528a4e66f1dc2ec05f4afd187395d830
---

# arch-ABC-303-w1-rows ruling: the 19 rows need no bar, no door and no production change. A1 (a) takes a new budget; A2 (a), D5 and A0-3 re-pin; A0-1 and A0-2 keep the base's figures on the all-off door, with the shipped path pinned beside them

Architect/Design, records only, on `grugops/arch-ABC-303-w1-rows` from `main` `a21136b0`. Nothing run. Readings and arithmetic: `…c66a3f5c`.

## 1. What governs

- `ADR-0071` D8: "The rows bind; the numbers are the base's." D12 item 4 and `ADR-0072` d11: whichever lands second re-reads A0's counts. That names these rows, so **the SE's "no record names them" is answered: A0's figures may be re-read. What was open is the form.**
- `ADR-0071` D9: A1 (a) stands "on a row where the base aborts inside d + 1", and "The Engineer re-scans on the base the build lands on" for A2.
- `ADR-0072` d7 and `ABC-303` test note 4: rows pinning shipped-path counts re-point to the all-off door. **That reaches only rows that need no `softMs`.** d11 and `ADR-0071` D12 item 6: no row hands a door `softMs`, and the session has no door.
- `…42c82347`: old-table figures are pins, re-pinned old → new, each dated and listed. Never-list rows stay. A row retires only with an Architect line. B-T4: only the literal moves.

## 2. The ruling, by group: what each proves and why it still proves it

| rows | proves | ruling |
|---|---|---|
| A1 (a) | past the soft limit the search returns after d with 0 nodes of d + 1, on a row where the base aborts inside d + 1 | **New form: budget 6 → 5.** Not a re-pin |
| A2 (a) | a root move that beat the incumbent at the same depth is played from an aborted iteration, at budget ÷ b | **Pin:** kept `a1b1`, 450 → `a1f6`, 475 |
| D5 | a kept move is reported by one `info string partial` line just before an unchanged `info` line | **Pin:** the same move and score |
| A0-1 (six) | `softMs` changes nothing until a clock reaches it; W1 off reads the base | **Split:** base's figures unmoved on the door; shipped figures pinned; `softMs: 1` stays shipped |
| A0-2 (four) | the row a frozen clock cannot replace: W1 off runs to the hard limit | **Split:** base's figures unmoved on the door; shipped side moves `score` only |
| A0-3 (six) | the session's W1-off lines, end to end | **Pin:** `cp` on five; the `go depth 6` line |

**A1 (a) cannot be a re-pin.** At H = 6 the head stops at depth 3 and the shipped base now COMPLETES depth 4. It is not aborted (2 197 is N(4), not a clock check). Pinning `base.depth` to 4 goes green while the row shows the opposite of its comment: the head gave up an iteration that would have finished, and D9's clause is unmet. At H = 5 the base aborts in iteration 4 at 2 121, 76 nodes short of N(4). `head.depth` 3 and `base.depth` 3 both stand, so **no asserted figure moves**. It is the only budget with d = 3 (`…c66a3f5c` § 2). This is `ADR-0071` D9's re-pick, not a tune: b, the soft rule and the assertions are untouched.

**A2 (a) is still that case.** Kept `a1f6`, 475 is a move that beat the incumbent at the same depth, from an iteration aborted mid-way:
- iteration 3 is aborted at 3 125 of N(3) = 3 506, on a full window, with depth 2 on both sides and equal nodes;
- the frozen depth-3 line reads `a1f6`, 475 over `a1e5`, so by the root's strict `>` that score is strictly above the incumbent's own completed depth-3 score;
- `main` reads the same `a1f6`, 475 at depth 3, so this is `main`'s answer, reached sooner, not a figure the bundle made;
- budget 5 and `softMs` 5 ÷ 2.3 stay, the row's reason for existing among the A2 rows.

No new position is needed. D5 runs the same search (1 105 − 1 100 = 5), so it follows.

**A0-1 and A0-2: why split rather than re-pin or re-point alone.** A figure read from a tree that has W1 in it cannot, alone, show that W1 is off, and A0's sentence is still true, so it does not retire as K0 did.
- **Re-pin alone** would drop the base's figures and leave A0 reading itself.
- **Re-point alone** would lose `softMs: 1` (d11) and the shipped read.
- **So both:** the door side keeps every old literal, unmoved, on `chooseMoveWithoutQuietBundle` with `softMs` absent. The door and `chooseMove` differ only in `heuristics` into the same `deepen`. The shipped side keeps the `softMs` absent ≡ `softMs: 1` relation and takes D12 item 4's re-read figures.
- This is the form `src/search.bundle.test.ts` P0 and `src/engine.test.ts` A3 already took on this branch.

A0-2's shipped side still catches a leak: its `nodes` did not move, and a leak would read 33 116, 104 780, 39 268, 94 911 against 47 384, 199 960, 44 105, 196 681.

**A0-3.** No door exists, so the row stays on the session. On five rows only `cp` moves. `depth`, `nodes`, `time`, `nps` and the move stay, and they are what a leak would change (39 268 against 69 705; 94 911 against 196 681). `cp` agrees with A0-1's frozen scores. `go depth 6` could not see W1 on any tree (no clock reached); its line is a tree pin, and "hands no soft limit" for that row is the default-lane stub row, untouched.

## 3. Bars, identity and relations (brief item 2)

- **No row of the 19 is a bar.** None is a zugzwang, mate-floor or `G1` row. `ADR-0071`'s numeric bar in this set, A1 (c), is not among them and is green.
- **The literal never-list does not reach A0.** `…681c6363` 1: its "identity" is `ADR-0067` d5's tracer gate. A0 shares the word.
- **I hold A0 to the stricter reading anyway.** A0 is an identity row by title, and the ruling's short form says identity rows are not re-pinned. So no figure that carries A0's identity moves: the base's literals stay on the door, and every leak-reading column stays. What moves is the tree's own `score`, `cp` and frozen counts, which D8 and D12 item 4 name.
- **Weak point, stated:** A0-3's `cp` literal sits in a row titled identity with no door behind it. If the Orchestrator reads "identity" as every literal in such a row, A0-3 has no legal form, and that comes back here. I do not read it so, because D8 and D12 item 4 are the specific text and the session has no other form.
- **Relations, none moved:** `head.nodes` = N(d), `base.nodes` > `head.nodes`, `head.nodes` = `base.nodes`, `softMs` absent ≡ 1, and "D3's row reads less than the base did" (39 268 < 69 705, green).
- **No row retires.** F1 and F2 do not fire: W1 acts and stays off exactly as D1, D2 and D4 say on every read, and the figures moved because the tree did.

## 4. Production and doors (brief item 3)

**No production change, no new door, no door handed `softMs`. The read's form does not change.** The W1 rows stay on the shipped path, which is what ships. Tables 1–3, C2′, S′ and the Levels lane are untouched. `raw/w1probe.ts`'s scratch use of `softMs` on the door stays a diagnosis and must not become a row. b reads 2.2786, which rounds to 2.3: reported, no ticket.

## 5. The engineer's list (`src/engine.test.ts`, `src/uci-session.test.ts`, nothing else)

Each edit carries one dated `ABC-303` comment citing this note. The PR lists every row: file, row, old → new.

**E1. A1 (a).** `search(6, 6 / ITERATION_GROWTH)` → `search(5, 5 / ITERATION_GROWTH)`; `search(6)` → `search(5)`. Every assertion, the title and the comment stay. Forecast: head `depth` 3, 1 262; base `depth` 3, 2 121.

**E2. A2 (a).** `kept: ["a1b1", 450]` → `kept: ["a1f6", 475]`. Nothing else.

**E3. A0-1.** `read` takes the search as an argument. Each row asserts three things: `engineModule.chooseMoveWithoutQuietBundle` on `frozen` reads the door figures; `chooseMove` on `frozen` reads the shipped figures; `chooseMove` on `{ ...frozen, softMs: 1 }` reads the shipped figures. `partial: undefined` throughout.

| position | d | door, unchanged | shipped, old → new |
|---|---|---|---|
| kiwipete | 6 | e2a6, −59, 140 341 | e2a6, −101, 104 780 |
| kiwipete | 7 | d5e6, −82, 330 628 | e2a6, −105, 244 677 |
| kiwipete | 8 | d5e6, −89, 707 548 | e2a6, −114, 573 518 |
| position-6 | 6 | c3d5, 87, 14 570 | c3d5, 87, 10 513 |
| position-6 | 7 | c3d5, 79, 32 165 | c3d5, 43, 39 268 |
| position-6 | 8 | c3d5, 71, 101 425 | c3d5, 45, 94 911 |

Title: `` `A0-1: ${name} at maxDepth ${depth}: the all-off door reads the base; all on reads one line with softMs absent and with softMs 1` ``.

**E4. A0-2.** Each row asserts the door (no `softMs`) on the old figures, and `chooseMove` (no `softMs`) on the same figures with the score moved. `partial: undefined`.

| position | budget | depth, move, nodes (both sides) | door score | shipped score |
|---|---|---|---|---|
| kiwipete | 50 | 5, e2a6, 47 384 | −59 | −75 |
| kiwipete | 200 | 6, e2a6, 199 960 | −59 | −101 |
| position-6 | 50 | 7, c3d5, 44 105 | 79 | 43 |
| position-6 | 200 | 8, c3d5, 196 681 | 71 | 45 |

Title: `` `A0-2: ${name} at ${budgetMs} virtual ms, softMs absent: the all-off door reads the base; all on stops at the same node` ``.

**U1. D5.** `score cp 450` → `score cp 475`; `pv a1b1$` → `pv a1f6$`; `bestmove a1b1` → `bestmove a1f6`. `info string partial depth 3`, `info depth 2`, the line count and the comment stay.

**U2. A0-3.** Three constants, from `a0-3-head.jsonl`, exact:
- `D8` = `"info depth 8 score cp 45 nodes 196681 time 201 nps 978512 pv c3d5"`
- `D7` = `"info depth 7 score cp 43 nodes 69705 time 76 nps 917171 pv c3d5"`
- `D6` = `"info depth 6 score cp 87 nodes 10513 time 17 nps 618412 pv c3d5"`

Title `reads the base's lines` → `reads W1 off's lines`. The doc comment gets the dated line and keeps its `…aadd2d48`. The `69_705` in "D3's row reads less than the base did" stays.

**Touch nothing else:** A1 (b), the other seven A2 rows, A1 (c), D5's no-line row, the default-lane A0-3 stub rows, `ITERATION_GROWTH`.

**Then:** `npm test`, then `ENGINE_DEEP` and `SEARCH_DEEP` engine and `ENGINE_DEEP` uci-session, one at a time under the host lock, as `…42aa51f1` owes. No default-lane row is added and no default-lane search grows. The door halves add ten searches to `ENGINE_DEEP` only, about 1.9 M nodes, about 4 s at `ADR-0071`'s rate.

**STOP, nothing adjusted, if:** a door figure in E3 or E4 is red (S1's class, a wiring defect); E1 does not read head 3 / base 3 with base nodes above head's; any figure in E2, E3, E4, U1 or U2 reads other than listed. Do not pick another budget or position.

## 6. Owner

**No owner call.** No bar, value, requirement or read moves; test rows on `ADR-0071`'s and `ADR-0072`'s own text. The one judgement is § 3's reading of "identity", which is the Orchestrator's to overrule.

## 7. `UNKNOWN - verify`, each read by the engineer's lanes unless named

- E1 at H = 5 has not been run; it is arithmetic from sealed N(d). Base 2 121 is the forecast.
- The door on `virtualClock(1)` for A0-2's four rows. S1 reads the door against `main` on a frozen clock; the stepping read is expected equal and not read.
- `softMs: 1` on the tip for A0-1: the test stopped at its first `expect`. Expected equal by the frozen clock.
- D5's whole output on the tip: `…c31e9a54` reports `a1f6`, cp 475. The partial line, `info depth 2` and the line count are expected from the engine row's read.
- Whether E2's row still tells "latest such move" from "first such move". That needs the tip's depth-3 root order, which is on no record. It was not shown of the old row either. For QE's mutant read, not a gate here.
- `G6` and the rest of `…bd60978c` § Not read stand as they were.

## 8. Owed, none of it mine, none blocking the rows

- **BA/PM:** one dated line on `ABC-303` test note 4 pointing at `ADR-0071` D8 and D9's lines of this task.
- **Orchestrator:** the `se-ABC-303-main` follow-on brief, carrying § 5.
- **At the PR:** the row table beside `ABC-279` A3 (a)'s.
