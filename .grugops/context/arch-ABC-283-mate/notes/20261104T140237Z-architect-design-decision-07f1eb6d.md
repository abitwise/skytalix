---
id: 20261104T140237Z-architect-design-decision-07f1eb6d
kind: decision
by: architect-design
at: 2026-11-04T14:02:37Z
verified_by: 
confidence: high (written and sealed before any measured run; the rule and the bars are fixed here)
refs:
  - arch-ABC-283-mate
  - ABC-283
  - ABC-233
  - ADR-0063
  - ADR-0064
  - F2
  - orch-2026-10-30a
  - 19583086
  - se-ABC-283
  - 0b0b135f
  - 0d3e1e5b
  - d64042c4
  - grugops/ABC-283
  - 4e7ddcca
  - src/search.ts
  - src/engine.ts
  - PREREG
supersedes: 
seal: sha256:3e4c6e8ee7763e7f9555e8c1c6ae6870d4a6dc5592fff3fe8419ebe802854295
---

# PREREG arch-ABC-283-mate: why history loses the KRK mates on `grugops/ABC-283`, the structural candidates, the bars, and the rule that decides ADR-0063 F2. Sealed and committed before any measured run.

Brief `arch-ABC-283-mate`; Orchestrator ruling `orch-2026-10-30a` `…19583086`; inputs `se-ABC-283` `…0b0b135f`, `…0d3e1e5b`, `…d64042c4`; ADR-0063 (d2, d4, d8, d11, F2); ADR-0064 d7 (safety rows on the shipped path).

## Instrument

- A scratch copy of `grugops/ABC-283` `src/` (tree `8171d713`, tip `4e7ddcca`), outside the repository. Nothing is committed to `src/`.
- Every run under `flock <scratch>/host-test.lock`, one core. Fixed depth for `search()`; `chooseMove` with `maxDepth` on a frozen clock (`now: () => 0`, `budgetMs` 1e9). G1 on its virtual clock. No timing is read. No games.
- Each candidate is a patch to the copy, gated on the `history` switch being on, so the all-off doors are untouched by construction. P0 is still read.

## Step 1: diagnosis (exploratory; it cannot move a bar)

On the three rows (`search()` d5 `6k1/R7/5K2/8/8/8/8/8 w - - 2 2`; `chooseMove` d5 `8/7k/5K2/8/8/8/8/5R2 w - - 2 2` and `8/k7/2K5/8/8/8/8/1R6 w - - 2 2`):

1. **Door-by-door on the head, history kept on.** A scratch-only entry runs the shipped switches with exactly one other door off: LMR, futility, PVS, the table, the killers. A door whose removal restores the mate is implicated.
2. **Node trace along the door's mating line.** At each node of the line: the move index of the mating-line move in the head's order and in the history-off order, its history cell, whether LMR reduced it, whether futility skipped it, the window, any table cutoff, and the score returned. The trace names the node where the head's score leaves the mate band and the door that put it there.
3. **Hypotheses**, one or more to be named by the evidence:
   - **H-L:** history moves a mating-line quiet move to index ≥ 3 at a depth ≥ 3 node; LMR reduces it; the reduced null-window search does not fail high, so no full-depth re-search runs.
   - **H-F:** history moves a mating-line move behind index 0 at a futility node, and it is skipped.
   - **H-M:** the malus from mate-band cutoffs demotes the mating move.
   - **H-C:** history in an in-check node changes cutoffs or the table enough to lose the line.
   - **H-T:** a table bound written by a reduced or skipped search settles a later node of the line.
   - **H-pre:** a pre-existing LMR or futility property that history only unmasks: the door loses the same mate when only the order of the bottom (quiet, non-killer) tier is permuted. Read by running the history-off door with that tier reversed, on the 287 at d5 (a report).

## Candidates (structural; none changes a value: d², gravity 16 384, the LMR and futility constants and the tiers stay as built)

- **K1:** LMR and futility read each move's **pre-history index**: its index in the order with history off (hash, captures, killers, losing captures, then quiet moves in generation order). The search still visits moves in history order. History then changes cutoffs, never which moves are reduced or skipped.
- **K1L:** K1 for LMR only. **K1F:** K1 for futility only.
- **K2:** no history update from a cutoff whose score is in the mate band (|score| ≥ `MATE_FLOOR`): no bonus, no malus.
- **K3:** history may promote, never demote: the ordering key of a quiet move is max(0, h). The table and its updates are unchanged.
- **K-post:** at most one candidate derived after the trace, only if the named mechanism is a door none of K1–K3 acts on. It is labelled post-hoc wherever it is cited.

## Bars (all three parts on, on the patched copy)

| # | bar | today |
|---|---|---|
| B1 | `search()` d5 against `searchWithoutBundle` d5, the 287: **0 violations** (a door mate not a same-sign mate) | 1 / 190 |
| B2 | `chooseMove` d5 against `chooseMoveWithoutBundle` d5, the 287: **0 violations** | 2 / 188 |
| B3 | the older mate rows, `search()` d5 against `searchWithoutFutility`, `searchWithoutSeePruning`, `searchWithoutTaper` at d5, and `searchWithoutTaper` d4 → `search()` d5: **0 violations** each | red |
| B4 | P0: `searchWithoutBundle` / `chooseMoveWithoutBundle` at d6, d7, d8 on kiwipete and position-6 equal `se-ABC-283` `raw/out/p0-main.jsonl` (main `09694a4e`) in nodes, score and move | met |
| B5 | zugzwang: `ADR-0050` d9's seven rows, shipped `chooseMove`, recorded depths: **7 / 7** | 7 / 7 |
| B6 | `G1`: ≥ 54 / 58, no NEWLY-MISSED line | 54 / 58 |
| R1 | report: `chooseMove` d6 against its door d6 on the 287 (the brief's d6 report) | 4 / 209 |
| R2 | report: ADR-0063 d8 drift at d5 on the 190, both recursions, against `searchWithoutHistory` / `chooseMoveWithoutHistory` (≥ 95 % within 25 cp, none beyond 42 cp, 0 mate sign changes) | — |
| R3 | report: d8 nodes against main, kiwipete and position-6, both recursions | 0.8503 / 0.5464; 0.9184 / 1.1100 |

B5 and B6 are read only for a candidate that meets B1–B4.

## The rule

1. A candidate is a fix only if **(a)** the trace shows it acts on the mechanism Step 1 names, on the three rows, and **(b)** it meets B1–B6.
2. If more than one is a fix, the ruling takes the first in this order, the smallest departure from ADR-0063's design of record: **K2** (changes only mate-band cutoffs), **K1L**, **K1F**, **K1**, **K3** (changes the key over the whole tree), then K-post.
3. **F2 (i):** the chosen fix is stated exactly as a dated line in ADR-0063, which stays PROPOSED, with the SE build lines.
4. **F2 (ii):** if none is a fix, ADR-0063 F2 fires; the dated line says so, and the Orchestrator takes option (b).
5. R1–R3 are reports and cannot change the verdict. No bar here is loosened after the read; ADR-0063 d8's mate floor and ADR-0064 d7 are never re-pinned.

## Budget

Each probe ≤ 30 min, total ≤ 1 h of measured runs. Nothing is left running.
