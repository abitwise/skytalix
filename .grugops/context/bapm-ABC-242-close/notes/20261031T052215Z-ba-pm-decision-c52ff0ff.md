---
id: 20261031T052215Z-ba-pm-decision-c52ff0ff
kind: decision
by: ba-pm
at: 2026-10-31T05:22:15Z
verified_by: 
confidence: high on the records closed and the dispositions (every figure copied from sealed qe-ABC-242, se-ABC-242, qe-ABC-225-w1 and se-ABC-225-main notes); the restated 18.5 h and the ≈ 26 h whole-milestone sum are estimates, UNKNOWN - verify until the batch reads its own wall; ABC-245's game-reachable fixture is UNKNOWN - verify until the SE builds it; nothing run, built, timed or played
refs:
  - bapm-ABC-242-close
  - ABC-242
  - ABC-225
  - ABC-245
  - EPIC-010
  - ABC-244
  - ABC-230
  - ABC-228
  - ADR-0054
  - ADR-0032
  - ADR-0046
  - NFR-008
  - NFR-004
  - QE-242-a
  - QE-242-b
  - QE-242-c
  - SE-242-a
  - SE-242-b
  - SE-242-c
  - SE-242-d
  - SE-242-e
  - SE-242-f
  - QE-225w1-a
  - QE-225w1-b
  - QE-225w1-c
  - QE-225w1-d
  - QE-225w1-e
  - QE-225-d
  - RISK-EPIC010-04
  - arch-qe242a-ruling
  - qe-ABC-242/20261031T051332Z-qe-e2e-decision-f24601b8
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-b9f3cd67
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-f041ddb3
  - se-ABC-242/20261031T043705Z-software-engineer-observation-c0e5e0fa
  - se-ABC-242/20261031T043705Z-software-engineer-observation-76069fd1
  - qe-ABC-225-w1/20261030T223134Z-qe-e2e-decision-d0807789
  - qe-ABC-225-w1/20261030T223127Z-qe-e2e-observation-7e9bd36f
  - se-ABC-225-main/20261030T202846Z-software-engineer-observation-a9f5834c
  - bapm-ABC-222-epic009-m1/20261031T025846Z-ba-pm-observation-e84baed7
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - orch-2026-10-30a/20261030T181200Z-orchestrator-decision-f4673b9f
  - main af5b2b49
  - main 59dc3ab4
  - main d58f2d77
  - 6884d61a
supersedes: 
seal: sha256:e86375a0300caf3709dd551c20085b8ef5b793572c157bd629f9bb94a5a31de2
---

# BA/PM decision, bapm-ABC-242-close: `ABC-242` and `ABC-225` closed Done. `ABC-245` cut (XS, P3, test-only, Backlog 9/10) from QE-242-b. QE-242-a left pending with the Architect. `EPIC-010` milestone 1 restated at width 1: the batch alone remains, about 18.5 h ALONE plus about 1 h of QE

Records only, at `main` `d58f2d77`. Nothing was run, built, timed or played, because an SE shares the host. Every figure is
copied from sealed notes (see the observation of this task).

## 1. `ABC-242`: Done
- Merged `af5b2b49`. QE PASS_WITH_GAPS at `6884d61a` (`qe-ABC-242` `…f24601b8`) **signs UAT** (Test note 3; owner delegation).
- Front matter: `status: done`, `column: Done`, a `closed:` line. A CLOSED block at the top; dated pointers on § Problem's
  −1013 evidence line, A1's "(probe: `d8e8` −1013)" and the value line; a Done line above the DoR verdict.
- **Dispositions:**
  - **SE-242-a (INFO): answered.** Base `d8e8` reads −1013 at `24f3e322` (`ABC-230`) and −1020 from the `ABC-228` merge
    `e42b637b` on. A known merge moved it. The page's −1013 lines carry a dated pointer. `ADR-0054`'s −1013 is the
    Architect's text: not edited here.
  - **SE-242-b (LOW, design note): recorded, no ticket.** On a plain 2-cycle base already scores the winner's third
    occurrence 0 from inside the child search. The change bites the loser's repeat, and a winner's only where the loser's
    replies are not themselves repeats. Noted on the value line.
  - **QE-242-b (LOW): cut as `ABC-245`.** Judged worth one XS row: a 6-ply cycle (matches at −6 and −12) is ordinary play
    and a cap of 8 misses it, and nothing in the lane would turn red. Q18 stays INFO (unpinned by design).
  - **QE-242-c (INFO): recorded, no ticket.** The ladder pair scores are `UNKNOWN - verify` from QE's hop; A7 rests on
    the rows' assertions; the SE's run printed 4/4, 3.5/4, 3/4, 3.5/4, 10/10.
  - **SE-242-c, -d, -e: INFO, recorded. SE-242-f: folded into `ABC-245`** (the stale `src/levels.test.ts` header count).
  - **QE-242-a (MEDIUM): PENDING with the Architect** (`arch-qe242a-ruling`). **Not ruled by BA/PM.** If the ruling names a
    change to a merged row, BA/PM cuts that ticket then.

## 2. `ABC-245` cut: XS, P3, test-only, `EPIC-010`, Backlog, DoR 9/10
- One row in `src/levels.test.ts`: on a forced level-1 blunder, a third occurrence whose two earlier occurrences both lie
  more than 50 plies back (inside the child's clock and ≤ 101 handed keys) scores exactly 0 with legal − 1 child searches
  (A1). It turns red under Q6 (cap 8) and Q8 (cap 50) and is green at 100 (A2). Base scores it ≠ 0 (A3). The header count
  is corrected (A4). Gates and `G8` ≤ 10 s (A5).
- DoR row 10 open: the row's step waits on the QE-242-a ruling (how `ABC-244` condition 2 reads a blunder). Ready when
  it lands. In no milestone. `src/levels.ts` does not change.

## 3. `ABC-225`: Done (merged `59dc3ab4`, 2026-10-30)
- The page read `in-development`; now `status: done`, `column: Done`, a `closed:` line, a CLOSED block, and a Done line in
  place of the DoR verdict (the old one kept as "Was"). `tools/` only: no UAT.
- **Dispositions:**
  - **QE-225w1-a (LOW): no ticket; recorded as a known misleading field, with a fold rule.** `rpair`'s `budget: 4000` is
    passed and not read on the `r` path. A1 holds by construction and `pair-check.ts`'s pin reds if the literal moves
    alone. The next ticket that moves the R budget names one constant or drops the field in the same change.
  - **QE-225w1-b (LOW): already done** (`bapm-ABC-222-epic009-m1`).
  - **QE-225w1-c (INFO): no ticket.** QE-225-c stands; the batch's PREREG keeps the wait-clear rule.
  - **QE-225w1-d (INFO): no ticket; carried to the batch,** which reports the per-block nps spread as information.
  - **QE-225w1-e (INFO): no ticket; a residual.** The real halt path is exercised by the first real fault.
  - QE-225-d (LOW) carried unchanged.

## 4. `EPIC-010` milestone 1 total, restated at width 1
- All nine milestone 1 tickets are Done, so **what remains is the batch alone: about 18.5 h ALONE (17.5–19.4 h) plus about
  1 h of QE, about 19.5 h.** Spent plus remaining is about 26 h, about 23 h ALONE (estimate). The "≈ 15 h, ≈ 12 h ALONE"
  total is struck as stale (it assumed the batch at width 2).
- Width 1: the owner's "ABC-225 - approve to run one at a time" (`…65848126`), extended to the batch by the Orchestrator's
  2026-10-30 delivery ruling (thermal; owner informed, may override). Both are cited.
- 18.5 h is `ABC-225` A6's projection from 40 games, an estimate (`UNKNOWN - verify` until the batch reads its own wall);
  22–24 h stays the slow case.
- Changed: a FOLDED header block; the cost table's total row; § Cost on this host's batch line; `RISK-EPIC010-04`; the
  `ABC-242` footnote; tickets rows 3 and 10 (Done) and row 21 (`ABC-245`); a fold line under the table.

## For the Orchestrator
- Board columns are yours: `ABC-245` (new, Backlog 9/10) and `ABC-225`/`ABC-242` already read Done there.
- `ADR-0054`'s recorded −1013 (base probe) reads −1020 since `e42b637b`; a dated line there is the Architect's, if wanted.
