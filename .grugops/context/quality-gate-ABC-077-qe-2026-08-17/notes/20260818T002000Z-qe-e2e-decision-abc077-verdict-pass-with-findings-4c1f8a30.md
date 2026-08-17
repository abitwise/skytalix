---
id: 20260818T002000Z-qe-e2e-decision-abc077-verdict-pass-with-findings-4c1f8a30
kind: decision
by: qe-e2e
at: 2026-08-18T00:20:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - RISK-002
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
supersedes:
---

# VERDICT: PASS WITH FINDINGS. Seven gaps, two HIGH. No production defect.

The mandatory QE hop on `ABC-077` (`AGENTS.md` § QE validation authority; `agent-factory/workflows/04-ticket-to-pr.md` step 5), run against branch `grugops/abc077-negamax-alpha-beta` at tip `45d6591`.

## VERDICT — **pass-with-findings**

`A1`-`A7` are **all MET as written** on the delivered tip. The full gate re-ran green here. **No defect was found in `src/search.ts` and QE changed no production line** — the module genuinely has no default depth, does not export a move-picker, and returns a byte-identical position.

It is not a clean pass because **two of the guards do not establish what their criteria claim**, and one of those, `A6`, is `RISK-002`'s only falsifiable expression at this layer.

**It is not a fail.** A fail would need an unmet criterion or a defect in the delivered code. Neither exists. What exists is a verification surface thinner than the criteria read, on code that is correct today.

## The seven gaps, with severities

| # | gap | severity | closed here? |
|---|---|---|---|
| `G1` | **`A6` is bypassable.** `searchRoot(position, depth ?? 4, true)` passes all three `A6` assertions, `tsc` and `biome`, and all 28 default-lane tests, while `search(position)` returns a move at a **fixed depth 4** with no caller-supplied depth — the fixed-depth per-move budget `RISK-002` forbids | **HIGH** | **yes** — `QE-G1` added, asserts the behaviour rather than the source text |
| `G2` | **The evaluation the search maximises is unasserted repository-wide.** Swapping `PIECE_VALUE`'s ROOK and QUEEN left **963/963 green across all 33 files**, and 41/41 in the `SEARCH_DEEP` lane | **HIGH** | **partly** — `QE-G2`/`QE-G3` added; they are coarse material nets, not a correct-evaluation proof |
| `G3` | **`A2`'s 40% bar cannot see partial pruning loss, in EITHER lane.** True ratios 9.0% / 27.1%; mutants destroying roughly half the pruning still read 16.6% and 12.4% at kiwipete depth 3. Only total removal of the cutoff is caught | MEDIUM | no — the bar is the ticket's and moving it is not QE's |
| `G4` | **The default lane's `A4`/`A7` corpus runs at depth 1, which never enters `negamax`'s move loop.** Interior make/unmake in the default lane rests entirely on the one retained `position-3` depth-3 pair | MEDIUM | no — but the retained pair was verified load-bearing, see the mutation note |
| `G5` | **A delivered measurement is wrong: the broad corpus is 184 positions, not 204.** In `src/search.test.ts:20` and three places in the engineer's notes, including "204/204" pass counts in the `A4` and `A7` verdict rows | LOW-MEDIUM | corrected in `plans/traceability.md`; the source comment and the notes are their authors' |
| `G6` | **Interior nodes never consult `gameStatus`.** Dead position and the seventy-five-move rule are detected at depth-0 leaves only; an interior node that is already drawn is searched on | LOW | no — flagged, not fixed; it meets `ABC-081`'s in-tree repetition work |
| `G7` | **The ticket page's § Dependencies still says `ABC-076` is OPEN.** It is merged | LOW | no — the page-owner's, and the engineer correctly declined to edit it |

**Two HIGH, two MEDIUM, one LOW-MEDIUM, two LOW.**

## What this verdict does NOT say

- It does **not** say the engine plays well. `G2` is the reason, and it is now measured rather than suspected.
- It is **not** a UAT and carries **no human acceptance**. `ABC-077` ships production lines, so the 2026-08-17 zero-production-lines UAT waiver does not apply to it; the owner's word is still owed for the `In UAT` exit.
- It takes **no NFR verdict**. `NFR-005` depth figures stay diagnostics, and the `N8-LANE` and `NFR-008` readings in this task's notes are measurements handed to Architect/Design, not rulings.

## Process-rule 1 control data

The Orchestrator recorded **four** gaps at the `Ready for Dev` exit; QE found **seven**. `AGENTS.md` § Process rules control wants QE gaps **below 3 per ticket**. **It is not met on this ticket, and it should be recorded as not met** rather than counted down by re-classing `G5`-`G7` as hygiene. Backward moves: **zero** — nothing is sent back to development.
