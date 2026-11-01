# qe-EPIC-010-m1-batch-2 verdict: NOT LOSS (NEUTRAL). Pair X = −58.3, Y = 77.9, X + Y = +19.6 ≥ 0. Base `ca6e675c` 78.25 % ± 5.48 points, head `51902be5` 72.00 % ± 6.11 points, 200 + 200 games at 4 000 ms both sides (Skill Level 6). New 4 000 ms trend reference: 72.00 %, flag at 52.00 %

QE/E2E, task `qe-EPIC-010-m1-batch-2`. EPIC-010 § "Did things get worse?", layer 3, milestone 1's batch. Everything below was
pre-registered in `…316833e1` (commit `5d9c6b3a`, before any game). Run 1 was VOID at 48 min (`…3fb3b1fd`, commit `fbbdcabc`).
This is the PREREG's single re-run, and it ran clean.

## The reading (the tool's `summary.txt`, re-computed by QE from the PGNs)
| build | W/L/D | score (95 % half-width) | cutechess pooled Elo vs E 1 910 | draw ratio |
|---|---|---|---|---|
| base `ca6e675c` (main just before `ABC-230`) | 151 / 38 / 11 | **78.25 % ± 5.48 points** | +222.4 ± 56.9 | 5.5 % |
| head `51902be5` (main at spawn) | 141 / 53 / 6 | **72.00 % ± 6.11 points** | +164.1 ± 53.2 | 3.0 % |

- **Pair:** X = 164.1 − 222.4 = **−58.3**, Y = √(56.9² + 53.2²) = **77.9**, so **X + Y = +19.6 ≥ 0 → NOT LOSS.** The tool's
  state is `NEUTRAL` (`EPIC-008`). There is no `halted:` line and no UNRESOLVED in either build.
- **QE's own recomputation** (`raw/scripts/elo.mjs`, W/L/D counted in the 20 PGNs) gives the same W/L/D, the same one-decimal
  Elo lines and the same X, Y, to the digit, so there is no formula mismatch (`raw/batch/elo.txt`).
- The pentanomial line, information only: −58.3 ± 72.6 (100 openings, r = 0.004).
- **Clean in every one of the 20 block-runs:**
  - 0 faults, 0 time losses, 0 unclassified results and 0 move-cap draws;
  - 20 of 20 games in each block-run, 400 in all;
  - every `skytalix.stderr` and `stockfish.stderr` is 0 bytes;
  - the openings cover 1–100 once per build with both colours (the tool's coverage check passed; no cause was printed).

## What the verdict says and does not say
- **By the rule, the batch passes.** Milestone 1's value-changing merges (`ABC-230`, `ABC-228`, `ABC-241`, `ABC-229`) and the
  disclosed non-EPIC-010 `src/` merges (`ABC-220`, `ABC-221`, `ABC-242`) together show no fall larger than the pair's half-width.
- **The point estimate is negative.** The head scored 6.25 points (−58 Elo) below the base, and only the 77.9 half-width keeps
  it from LOSS (margin +19.6). The epic itself says a fall of tens of Elo is invisible at 200 + 200 games. This reading
  neither confirms nor rules out a real fall of that size. It is information for BA/PM and the owner (QE-M1B2-d), not a
  verdict.

## The new 4 000 ms trend reference (EPIC-010 § After a passing batch), for BA/PM to fold
- **Reference: head `51902be5`'s R score at 4 000 ms = 72.00 % (141 / 53 / 6 over 200 games; 95 % half-width ± 6.11
  points)**, against Stockfish 19 `UCI_LimitStrength` E 1 910. The pins are `rpair`'s (= `r`'s plus `Skill Level` 6; at the head,
  level 5 and level 6 both search 4 000 ms at rate 0).
- **The trend flag reads 72.00 − 20 = 52.00 %:** a pooled ≥ 30 R games at or below 52.00 % pulls the next batch forward.
- **The pool restarts at this batch.** The R rows waiting at 4 000 ms (`ABC-228` 7.0 / 10, `ABC-241` 6.5 / 10, `ABC-229` 9.0 / 10)
  were played on builds now inside this batch's head. QE does not pool them; that is BA/PM's fold.
- A caveat for the fold, information only: the per-ticket R smoke runs `r` (level 5) and the batch runs `rpair` (level 6). At
  any SHA from `e42b637b` on, both search `go movetime 4000` for 4 000 ms at rate 0, so the reference is comparable with later
  smokes.

## Run facts (details in the run note)
- **Block-01 guard (`ABC-247` Test note 3): PASS on both builds.** Base 943 and head 951 skytalix moves at 4.0 s, 0 at 3.0 s.
  Over all 20 PGNs: base 8 536 and head 9 305 at 4.0 s, **0 at 3.0 s**, and no other clock value.
- **Wall:** the session ran 22.22 h (08:39:34Z → 06:52:33Z), of which play was 22.21 h and builds about 5 s. There were
  0 thermal pauses, so play with and without cool-down is the same. That is 18.0 games/h, inside the restated 21.7–24.1 h.
  The whole hop, from the first launch and counting VOID run 1, took 23.17 h.
- **Thermal:** `thermal.log` median 75.1 °C and max 89.5 °C (one 10 s sample). The highest 5-min median the watcher saw was
  83.30 °C, so no pause and no THERMAL STOP. Busy-core median 5 021 MHz.
- **Contamination:** 102 of 1 332 watcher ticks (7.7 %) had a foreign process, every one a `vitest` from another repository
  on the host (`<home>/projects/public/grugops`). Three block-runs were > 25 %: base b01 34 %, base b04 30 %, candidate b05 42 %.
  It was logged and never killed. It is not a cause under the PREREG, and no block shows a fault, a time loss or a clock
  change.
- **Crashes and halts:** none in the re-run. Run 1 was VOID (`…3fb3b1fd`), and its 14 games count for nothing.

## Not done here (owed elsewhere)
- Folding the reference and restarting the pool on EPIC-010's page and in the ledger: BA/PM.
- No suspects list (that is for a LOSS only). The merges in the batch are named in the PREREG.
