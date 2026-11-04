# Security/NFR decision, secnfr-nfr008-1104: **PASS_WITH_RISKS.** `NFR-008` is MET, graded, at 9.84 s. **`R-N8H-1` goes back to MEDIUM** (from LOW). **`Q-N8H-1` is RIPE**, and the Orchestrator puts it to the owner. **Headroom work: one test-only ticket in ABC-281's form, nine named rows, about −0.5 s.** W1 and the second pull are cut with a default-lane budget

Ruled on this task's readings observation (session 1, graded) and probe observation (session 2), under the rules sealed in the PREREG `…c7289371` and the probe plan `…39f73707`. No §14 stamp exists on this install, so nothing here is a `finding`. Every risk is observation-grade, with a named owner.

## Scope of the review
- **NFR only.** This hop measured the default lane on `main` after ABC-271 and ABC-283. It made no security claim about those merges; their own gates hold that.
- No `src/`, test, config, ticket, ADR or board file was edited.

## `NFR-008`
- **MET, graded: H median 9.84 s [9.78, 10.00], max 10.05 s** (ADR-0035 D1; twin admissible at 0.51 %, wall R 0.19 s).
- **Headroom: 0.16 s on the median, 0.00 s at the interval top.** 2 of 16 H / H2 runs were over 10 s.
- This window ran about 0.15 s slow (B 9.59 s against its tree's graded 9.42 s). On QE's window, `main` would read about 9.7 s.
- No level, bar, W, F, cap or flag moved.

## Risks
| id | was | now | owner | why |
| --- | --- | --- | --- | --- |
| **`R-N8H-1`** | LOW, carried | **MEDIUM** | **Orchestrator** (the `NFR-008` watch); remedy **Architect/Design** | The graded median is 9.84 s ≥ 9.5 s, which is the PREREG's MEDIUM band. Headroom (0.16 s) is under the window spread (0.3–0.5 s), and the interval touches 10.00. A slow gate window can now read a median over 10 s. That would be NOT MET, and it goes to the owner (ADR-0035 D6) |
| `R-N8H-2` | LOW | LOW, unchanged | Architect/Design (`T-QEHOP-GROWTH`) | 5 210 note files, 290 short of 5 500. That is +123 since `ebd1263f`, so the re-arm point is about 1–2 days away at this rate. `qe-hop-integrity.test.ts` is a 367 ms slot (it was 364–417) |
| `R-N8H-3` | INFO | INFO, unchanged | BA/PM, at each cut | It applied: ABC-271 added a file (`src/evaluate.passer.test.ts`; 71 files). Each new file costs about 0.1 s of start-up before its first assertion |
| **`R-281-a`** | LOW, carried | **CLOSED** | Architect/Design (the rule's owner) | `ADR-0046` § Dated 2026-11-04 (`arch-ADR-0070-accept`) reads it closed from the first QE hop that applies the rule, and Security/NFR records that at its next reading. `qe-ABC-283` ran the four `-t` lines: 4 / 1 / 1 / 1, none short (`…de1dc511`, `…3f370426`). Rows moved by the ticket below join the rule's table with their ticket (rule item 3) |

### `R-N8H-1`: what moves it
- **To LOW:** a graded median < 9.5 s.
- **Closed:** a graded median ≤ 9.0 s.
- **To HIGH:** a graded NOT MET. The breach goes to the owner (ADR-0035 D6).
- The Orchestrator routes each move. Until the lane is read again, every lane-input merge spends the 0.16 s on an estimate.

## `Q-N8H-1`: RIPE, so the Orchestrator puts it to the owner
- **Why it is ripe.** The trigger is a median ≥ 9.6 s once ABC-281's moves have landed. QE read 9.60 s, and this hop graded 9.84 s. Re-stating an NFR bound is the owner's word (standing rulings, 2026-10-22).
- **The options, framed:**
  - (a) keep `npm test` wall ≤ 10 s, and keep moving heavy rows to deep lanes;
  - (b) re-state W for the 24-CPU reference (for example 12 s);
  - (c) raise the 2-worker cap, the owner's 2026-10-19 word.
- **Recommendation: (a) now, with the ticket below and the per-ticket budget.** It costs one small ticket and moves no bound.
- **But the form is near its end.** The probe sized every eligible row ≥ 60 ms at about −0.5 s. Engine tickets add about +0.15 s each (ABC-271 and ABC-283: +0.28 s together in this window). So (a) buys about three tickets of growth.
- **If a graded median is back at ≥ 9.6 s after the ticket lands, (b) is the cleaner word.** (c) also moves `NFR-010`: the two workers and the two that are still terminating are 4 of the 9 isolates in its 2 016 / 2 048 MiB sum. So (c) needs two owner words, and (b) needs one.
- **The headroom ticket does not wait for the answer.** It is option (a), and it moves no bound.

## Headroom recommendation, in ABC-281's form (`ADR-0046` § Dated 2026-11-04, form S)
**One test-only ticket.**
- BA/PM cuts it.
- Architect/Design confirms each remnant with mutant reads (default-lane kill parity, ABC-281's DoR row 11).
- QE re-reads `NFR-008` graded, in the A8 form.
- **Order: before or with W1 (ABC-282).**

### Part 1: seven rows, each to its own file's existing deep lane (probe P1: −0.26 s wall, 8 / 8)
| row | file | to | ms | remnant to keep in the default lane (a proposal; the Architect confirms) |
|---|---|---|---:|---|
| R1 null-move A2 "search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces" | `src/search.null-move.test.ts` | SEARCH_DEEP | 134 | the in-check root plus one middlegame root, both recursions, with both asserts and a rescaled non-vacuity count. The describe's other two rows stay |
| R2 ABC-241 A5 "the CLI level seam's injected list equals UCI's, key for key, and both play d8e8" | `src/uci-session.test.ts` | ENGINE_DEEP (`RUN_ENGINE_DEEP`) | 107 | the key-for-key list equality on a cheaper search. The d8e8 play is held by the A4 rows |
| R3 futility "the rule changes the work …" | `src/search.futility.test.ts` | SEARCH_DEEP | 90 | the same comparison at depth 3, or one recursion |
| R4 ABC-075 ep property "holds at every node within 2 plies of every perft position" | `src/zobrist.test.ts` | ZOBRIST_DEEP | 86 | depth 1 over the same positions, with both halves asserted non-vacuous |
| R5 ABC-170 A5 "on an infinite budget, maxDepth 1000 returns within the same consultation count" | `src/engine.test.ts` | ENGINE_DEEP | 77 | the same equality on a shorter counting clock. The sibling "budgetMs 5, maxDepth 50" row stays |
| R6 levels A7 "a fixed seed gives identical blunder decisions across runs" | `src/levels.test.ts` | ENGINE_DEEP | 71 | the first 10 of the thirty (ABC-281 R3's shape) |
| R7 levels ABC-174 A3 "move, depth and nodes are equal on 30 of 30 positions, for each of two seeds" | `src/levels.test.ts` | ENGINE_DEEP | 67 | seed 1 on the first 10 of the thirty |

### Part 2: two rows on the critical path whose files have no deep gate (probe: −0.30 s more; P2 −0.555 s, 8 / 8)
| row | file | ms | where it could go (the Architect's call) |
|---|---|---:|---|
| R8 ABC-241 A4 "with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not" | `src/cli.test.ts` | 188 | the full row to an existing lane (`src/cli.real-engine.test.ts`, CLI_DEEP, or `uci-session`'s ENGINE_DEEP block). The remnant keeps the seam's d8e8 play in `cli.test.ts` |
| R9 ABC-122 A8 "ends every line at ply 128 …" (the file's only row) | `src/engine.capacity.test.ts` | 115 | the full row to `src/engine.test.ts`'s ENGINE_DEEP block. The Architect names a remnant that keeps the `KEY_ARRAY_CAPACITY` guard's kill |

- **Why existing lanes only:** a new deep gate in a new file needs a new lane line in `AGENTS.md`, which is at 18 429 of 18 432 B.
- `src/cli.test.ts`'s worker is the critical path (collect-time children plus its slot), so its rows return about one second of wall per second.

### About how many seconds
- Part 1 about −0.24 s, and Parts 1 + 2 about **−0.50 s**, with remnants (the probe read −0.26 s and −0.555 s with skips; ABC-281 kept about 94 %).
- **`main` lands near 9.3 s on this window (9.84 − 0.50), and about 9.2 s on QE's.** That takes `R-N8H-1` back to LOW. It is not closed.

### Sized for W1 (ABC-282) and the second pull
- **Growth on the record:** ABC-283 +0.14 s; ABC-271 about +0.14–0.17 s; the two together +0.28 s here.
- **W1:** its cut puts A0-1, A0-2 and A1 (c) in ENGINE_DEEP, and the small A1 (a) / (b) and A2 rows in the default lane. **Its optional 0.09 s identity slice should not go in the default lane** unless the Architect names a kill that only it holds. Estimate: +0.05–0.15 s.
- **The second pull:** ABC-271-shaped, about +0.15 s. Rows go in existing files (`R-N8H-3`).
- **Target:**
  - Take both parts, about −0.5 s.
  - Cut W1 and the second pull with a **default-lane budget of ≤ +0.1 s each**: no new test file, and any row ≥ 50 ms goes to its file's deep lane, or is offset in the same ticket.
  - Expected: about 9.3 s after this ticket, and about 9.4–9.55 s after both.
- **Closing `R-N8H-1` (≤ 9.0 s) is not reachable by this form alone.** That is why `Q-N8H-1` goes to the owner now.

### What must stay in the default lane
- **The recorded bars:**
  - the zugzwang rows (`zugzwang.001` and the K+P rows);
  - ABC-283's bundle rows (`src/search.bundle.test.ts`);
  - every door-switch row (`QE-208-c` and the doors' "makes / no null move" rows);
  - ABC-281's three remnants.
- **The time-reading rows on fine virtual-clock steps:** `uci-session`'s ABC-167 A5 / A6 / A7, ABC-171 A2 / A6, ABC-174 A5 and ABC-220 A13 (busy `isready`, default lane). ABC-248 and `ADR-0046` kept them on purpose.
- **The depth-1 slices that already have a deeper deep twin:** `legal` ABC-206 A2 and `search.test` A4.
- **`src/cli.test.ts`'s spawned children:** they are the lane's only end-to-end runs of the delivered command (`ADR-0008` C2, synchronous form).
- **Every remnant this ticket names.**

## Records
- `plans/nfr-catalog.md`: one dated insertion in the `NFR-008` row (the latest verdict and the risk lines), and one `_Updated` line. No other row is touched.
