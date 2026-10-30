---
id: 20261030T093252Z-software-engineer-observation-5a99ee51
kind: observation
by: software-engineer
at: 2026-10-30T09:32:52Z
verified_by: 
confidence: high: ALONE, wait-clear before every run; base read x3 per board, round 1 graded as pre-declared; head counts deterministic and equal A8's
refs:
  - se-ABC-228-ii
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 8c82399f
  - d9c5bcde
  - 61d5d629
  - qe-ABC-228/20261030T091456Z-qe-e2e-decision-70c4723b
  - qe-ABC-228/20261030T091456Z-qe-e2e-observation-8829bc22
  - qe-ABC-228/20261030T073301Z-qe-e2e-observation-bcf2fd7c
  - QE-228-c
  - QE-228-b
  - A9
  - G9
  - OQ-228-1
supersedes: 
seal: sha256:618d780b9318238db80b022545f7c052501d792cffda0d40369d894185837421
---

# Software Engineer observation, se-ABC-228-ii: A9 at 4 000 ms reads 65.9 % (kiwipete) and 97.4 % (position-6), both <= 133 %. MET; G6 is read under (ii)

`ADR-0053` decision 10's re-forecast (`ABC-228` `A9`), after Scope 5 was built (`8c82399f`). It was ALONE in plain `node`, with no cutechess and no game. Base is `61d5d629`, the same base as A8 and QE's G6. Head is the Scope 5 tree. Method and readings are in `raw/`: `a9-real.jsonl`, `a9-frozen.jsonl`, `a9-wait.log`, and `scripts/timed.mjs`, `a9.mjs`, `run-a9.sh`.

## Pre-declared rule (in `run-a9.sh` before any read)
- The A9 reading is round 1's base read per board. That is A8's form: one real-clock `chooseMove` per board at 3 000 ms.
- Rounds 2–3, and every head read at 4 000 ms, are INFO.
- Before **every** run the script waited for 0 `cutechess-cli`, 0 vitest (`pgrep -f "[/]vitest"`), load1 <= 2.0 and Tctl <= 60.0 °C, which is QE's G6 rule.
  - A foreign vitest from another project held the host 09:22:03–09:24:49Z. Round 1's kiwipete run (09:21:45.4–09:21:48.4) ended before it arrived; the 09:21:48 sample reads vitest 0.
  - Every other run started at Tctl 35.5–39.5 °C. Post-run peak was 73.5 °C.

## A9 (graded): head's frozen-clock nodes x 1.09 against base's 3 s nodes, A8's units, bar <= 133.3 %
| board | base 3 s depth / nodes (round 1) | head nodes to that depth (frozen) | head x 1.09 / base | as a share of 4/3 x base (bar 100 %) | result |
|---|---:|---:|---:|---:|---|
| kiwipete | 8 / 2 552 685 | 1 543 477 | **65.9 %** | 49.4 % | MET |
| position-6 | 10 / 2 617 954 | 2 340 431 | **97.4 %** | 73.1 % | MET |

- Head's frozen counts equal A8's and the ADR's finding 4 exactly. The budget does not enter a frozen-clock search.
- Head's door equals base's frozen `chooseMove` on both boards, nodes and score (`doorEqualsBase: true`).

## INFO (not graded)
- **QE's measured CPU-per-node factor, 1.139 instead of 1.09:** 68.9 % and 101.8 %, both <= 133 %.
- **Base, rounds 1–3:**
  - kiwipete: d8 x3, 2 517 869–2 552 685 nodes.
  - position-6: d10 x3, 2 579 042–2 638 434 nodes. QE's G6 base median is 2 628 194.
- **Head on the real clock at its own `LEVELS[5]` = 4 000 ms, rounds 1–3:**
  - kiwipete: d8 x3, 3.00–3.16 M nodes, Bxa6 / −59.
  - position-6: **d10 x3**, 3.11–3.14 M nodes, Nd5 / 73.
  - Head reached base's depth in every run. **This is not G6.** The graded G6 (5 interleaved runs, median, floor 6) is QE's under A5's "Under (ii)".
