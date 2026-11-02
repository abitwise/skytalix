# arch-ABC-233 results: O1h on `main` `e72487e1` (futility in force). Every form is safe and every form misses the pay gate. H1 reads d8 1.0011 / 0.7970 (`search()`) and 0.9751 / 0.9832 (`chooseMove`), with reach +0.089. Diagnostic: P1 over H1 fixes `A4` (a) and the 63 cp line but drops to zugzwang 5 / 7

Architect/Design, task `arch-ABC-233`, by the PREREG `…4d5a0fe3`, sealed and committed `ec2ed472` before any run. Scratch `git archive` of `main` `60b76b52` (`src/` `58fa3eb4`). Four batches under `flock <host-test.lock> timeout 300`; 66 jobs, every exit 0; node counts only. Raw: `raw/probe/out/`.

## Instrument check: exact
- Door `search()` d8 888 786 / 1 262 046, `chooseMove` d8 1 306 981 / 391 451, reach 5.837. These are `ADR-0061` d9's counts.
- Door zugzwang 905 900 (`.004`) / 1 310 019 (`.005`), and door `G1` 54 / 58.

## Gates (d8 ratios head / door; reach at 47 000 on the 190)
| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | pay ≤ 0.95 ×4 | reach | drift s / c (within, max) | mate d4→5; d5 | zug | G1 | safety |
|---|---|---|---|---|---|---|---|---|---|
| H1 side×from×to, malus | 1.0011 / 0.7970 | 0.9751 / 0.9832 | MISSED | +0.089 | 100 %, 25 / 99.47 %, 28 | 0/163; 0/189 | 7/7 | 56/58 (+2 newly solved) | met |
| H0 from×to, malus | 1.0011 / 0.7970 | 0.9751 / 0.9832 | MISSED | +0.089 | 100 %, 25 / 99.47 %, 28 | 0/163; 0/189 | 7/7 | 56/58 | met |
| H2 side×from×to, no malus | 0.9901 / 0.8178 | 1.0047 / 0.9759 | MISSED | +0.105 | 100 %, 25 / 100 %, 25 | 0/163; 2/189 | 7/7 | 54/58 | met |
| H3 piece×to, malus | 0.9988 / 0.7784 | 0.9746 / 0.9734 | MISSED | +0.079 | 100 %, 25 / 99.47 %, 28 | 0/163; 1/189 | 7/7 | 55/58 (+1) | met |
| H1nr (report) | 1.0011 / 0.7970 | 0.9762 / 0.9670 | — | +0.089 | — | — | — | — | — |

**Verdict by the PREREG rule:** no form passes both gates, so `ADR-0063` is written PROPOSED with "premise not met on `main`" (the pay gate). No form is tuned after the read.

## Reports (H1)
- Depth 7, the ticket's `A3` depth: `search()` 0.9497 / 0.8367, which meets the ticket's literal 0.95 by 0.0003. `chooseMove` reads 0.9769 / 0.9373.
- Depth 8 on other roots (`search()` / `chooseMove`): position-4 0.971 / 0.999, position-5 0.805 / 1.051, startpos 0.328 / 0.680.
- Reach at 20 000: 4.842 → 4.868.
- Firing at d6 (H1 / door):
  - nodes 0.945×;
  - order changed at 82 % of full-width nodes;
  - first-move cutoffs 82.3 % / 81.9 %;
  - quiet cutoffs 112 689 / 124 674, mean index 1.21 / 1.52, killer share 89.9 % / 89.7 %;
  - in the door, quiet cutoffs are 26 % of all cutoffs.
- Table: 17–91 non-zero cells after a d5 `search()`; 0 after the next search's entry.

## Cut audit (information)
Every 10th null-window node at depth 6 whose order history changed, re-searched with the snapshot.

| form | flips | rate | largest error | errors ≥ 100 cp | depths with flips |
|---|---|---|---|---|---|
| H1 | 84 of 42 364 | 0.20 % | 40 cp | 0 | d3–d5 only |
| H0 | 81 of 44 615 | 0.18 % | 40 cp | 0 | d3–d5 only |
| H2 | 79 of 35 009 | 0.23 % | 40 cp | 0 | d3–d5 only |
| H3 | 87 of 43 120 | 0.20 % | 41 cp | 0 | d3–d5 only |

## Diagnostics (added after the pay-gate miss; not pre-registered; no verdict)
- **Depth 10:**
  - H1: `search()` 0.9664 / 0.8206, `chooseMove` 0.9680 / 0.9656.
  - H2: 0.9698 / 0.7051, 1.0193 / 0.9569.
- **`ADR-0060` decision 1 over H1 as door:**
  - d8 0.7505 / 0.7952 / 0.7166 / 0.7749, so all four meet ≤ 0.85;
  - reach 5.926 → 6.274 (+0.348);
  - drift: `search()` 100 % within 25, max 25; `chooseMove` max 11;
  - mate 0 / 163;
  - **zugzwang 5 / 7**: `.001` plays e1e6 at d9, and `.004` plays g7f6 at d11.
  - Against `main` as door: 0.7513 / 0.6338 / 0.6988 / 0.7619.

## S′ dry-run
`rating.ts r e72487e1 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1 --dry-run` exited 0. It printed `option.UCI_Elo=1810`, `st=0.5` for both engines, `timemargin` 50 / 2 000, and 5 rounds × 2 games (`raw/s-prime-dry-run-1810.txt`). Pick depth at 1 810: 4.
