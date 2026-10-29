---
id: 20261029T200049Z-system-analyst-decision-837e6fa8
kind: decision
by: system-analyst
at: 2026-10-29T20:00:49Z
verified_by: 
confidence: high on which items stand; play effects UNKNOWN - verify as named in observation 306a4012
refs:
  - sa-ideas-verify
  - sa-ideas-verify/20261029T195803Z-system-analyst-observation-1ccf0010
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - ideas-2026-10-29/input/owner-ideas.md
  - orch-2026-10-29g/20261029T203000Z-orchestrator-decision-ccb72dbe
  - bapm-epic009-tournament
  - EPIC-009
  - EPIC-008
  - EPIC-004
  - arch-epic008-rd/20261029T195200Z-architect-design-decision-0c5d62f4
  - ABC-205
  - ABC-206
  - ABC-207
  - ABC-209
  - ABC-210
  - ADR-0020
  - ADR-0024
  - ADR-0026
supersedes: 
seal: sha256:24778aa04718f1d3cd25e1b4f90882574aaed1a1cfc27962bd4655e3f421a7b3
---

# SA decision, sa-ideas-verify: § B's code claims hold, with five corrections; four ideas were already tried, one is a permanent non-goal, and item 2 is already in hand

The evidence is in the two observations sealed with this note: the claims table
(`20261029T200022Z-system-analyst-observation-306a4012`) and the time-behaviour map
(`20261029T195803Z-system-analyst-observation-1ccf0010`). Main `51c85f49`, `src`/`data`/`tools` = `3ad6bc10`. This
note ranks nothing and proposes no design. Ranking and cutting are BA/PM's; design is the Architect's.

## Which items stand

| # | Item | Stands? | In one line |
|---|---|---|---|
| 1 | Quiescence | **Stands**, with one correction | In-check stand pat, no terminal test past the leaf, and no quiet promotions are all true. The leaf itself is checked for mate and stalemate. A horizon check extension was tried (`ABC-210`, NEUTRAL). Evasions inside quiescence were never tried. An ADR is owed (`ADR-0024` d4) |
| 2 | Evaluation process | **Facts true; already in hand** | D +52.5 against R −82.9 is the R/D split `arch-epic008-rd` analysed (merged `ff459d6c`); its gauntlet is with the owner. Paired openings already exist |
| 3 | Game history into search | **Stands** | True for CLI and UCI. Never tried. `ADR-0002` clause 3 already speaks of seeding from history. The ep-late point is an owner ruling (`ADR-0020` d2) |
| 4 | Tournament clock | **Stands**, with one correction | The clock is honoured below the level cap, not ignored. Level 7 already spends 22.5 s a move under 40/15 when `movestogo` is sent. The blockers for a named level and for clock-based time are in the time note §§ 8-9 |
| 5 | Phase-aware evaluation | **Stands** | Untapered king table and king safety, phase-free passed pawns. `ABC-205` failed on depth cost (`G6`), not on play |
| 6 | Move ordering | **Stands** | No history heuristic and no SEE. SEE is fenced (`ADR-0024` d4). Under LMR an order change changes values, so `ADR-0026` d10 applies |
| 7 | Cost per node | **Stands in part** | Captures-only legality is already done (`ABC-206`). Full pseudo-legal generation, the board walk and the ordering allocations remain. EPIC-008 shows depth alone did not win games |
| 8 | Offline tuning | **Stands; never tried** | Weights are rule-written, not tuned. `ABC-207` −18.3 ± 16.5 is confirmed. Self-play non-transfer bears on how a tuned set is judged |
| 9 | TT and aspiration | **Stands in part** | 4 MiB, always replace and exact-depth cutoffs are true. TT kept across a game is **already tried** (`ABC-209`, NEUTRAL). Deeper-entry cutoffs revise `ABC-081` `A1`. Aspiration windows were never tried |
| 10 | Syzygy | **Against a recorded non-goal** | `EPIC-004` lists endgame tablebases as a permanent non-goal. Reopening it is the owner's word |

## Corrections to § B, stated once

1. Item 1: "the recursive quiescence does not detect terminal positions" is true only past the leaf. The leaf is
   checked (`src/engine.ts:262-264`).
2. Item 4: UCI does not ignore the clock. `wtime`/`btime`/`winc`/`binc`/`movestogo`/`movetime` are honoured and then
   capped by the level (`src/uci-session.ts:215-225`, `:287`).
3. Item 4: under a 40/15 clock with `movestogo`, level 7 already spends about 22.5 s a move (probe P1). That is the
   owner's option (a), today, on UCI only. The CLI has no clock.
4. Item 2: paired openings already exist (`-repeat`, both colours). Per-candidate outside-opponent readings do not.
5. Item 7: "direct tactical-move generation" is half done. `ABC-206` made only captures pay the legality test.

## Already tried, not to be re-run as is

- `ABC-205` king safety and a tapered king table: S1, `G6` miss on `position-6`.
- `ABC-207` mobility weights and the early-queen term: LOSS −18.3 ± 16.5 (800 games).
- `ABC-209` TT kept across one game: NEUTRAL +8.7 ± 18.3 (800 games).
- `ABC-210` horizon check extension: NEUTRAL −4.8 ± 16.2 (800 games).

## For the owner and BA/PM (questions, not decisions)

- Item 10 is a permanent non-goal of `EPIC-004`. Is it reopened?
- `EPIC-004` still lists "Strength above ~1700" as a permanent non-goal, and EPIC-008 went past it on the owner's word.
  Does the next strength epic cite that word, or is the line amended?
- Item 3's ep point re-opens `ADR-0020` d2, an owner ruling. Is that intended?

## STOP

None. No claim needed a game, and none was run.
