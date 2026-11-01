---
id: 20261101T091000Z-architect-design-decision-ff1e419d
kind: decision
by: architect-design
at: 2026-11-01T09:10:00Z
verified_by: 
confidence: high: records only; every figure quoted from sealed notes and checked against them; diff is 16 insertions, 0 deletions
refs:
  - arch-adr-folds-nov1
  - ADR-0046
  - ADR-0053
  - ABC-248
  - ABC-247
  - EPIC-010
  - NFR-008
  - W1
  - QE-248-a
  - bapm-ABC-248-close/20261101T083859Z-ba-pm-decision-82916ae5
  - bapm-ABC-248-close/20261101T083905Z-ba-pm-observation-305c1830
  - qe-ABC-248/20261101T083046Z-qe-e2e-decision-cf9bdabf
  - qe-ABC-248/20261101T083046Z-qe-e2e-observation-b519324e
  - qe-EPIC-010-m1-batch-2/20261101T065538Z-qe-e2e-observation-428e3797
  - qe-EPIC-010-m1-batch-2/20261101T065538Z-qe-e2e-decision-1a53a7f9
  - ef4cd095
  - f88873d4
  - ead08533
  - grugops/arch-adr-folds-nov1
supersedes: 
seal: sha256:da91528230ae13a6099337139f83ae2efea18d19c9a0c0d9dcf345b753706def
---

# `arch-adr-folds-nov1`: three LOW dated folds in ADR-0046 and ADR-0053, insertions only, no ruling changes

Architect/Design, records only, from `main` `f88873d4`, worktree `.claude/worktrees/arch-adr-folds-nov1`, branch
`grugops/arch-adr-folds-nov1`, commit `ead08533`. Nothing run, built or timed (`qe-qehop-growth` holds the host).

1. **ADR-0046 § Addendum 2026-10-31, Decision, condition 4.** A dated sub-line "Spelling 2026-11-01" under the
   condition gives the escaped-bracket `-t` form (`… \[deep, ENGINE_DEEP=1\]`) byte-equal to BA/PM's dated line of
   2026-11-01 in § BA/PM ruling 2026-10-31, and the check: "4 passed", not exit 0 (QE-248-a; QE read "4 passed" escaped
   and "241 skipped, rc 0" unescaped, `qe-ABC-248` `…b519324e`). The condition's text is kept; the sub-line says
   which form it means. Closes BA/PM owed item (1) in `…305c1830`.
2. **ADR-0046 § Status.** A dated line "Tranche 2 delivered 2026-11-01": `ABC-248` merged `ef4cd095` (code
   `71700836`, QE PASS_WITH_GAPS `…cf9bdabf`), `G8` H 9.09 s / B 9.37 s, `NFR-008` MET, 9.4 s target MET, W1 not
   triggered, no tranche 3, W1 stays in force. It wins over the Status line that says tranche 2 is OPEN. Closes owed
   item (2).
3. **ADR-0053 decision 10 (the R frame, the batch's wall).** A dated sub-line "Wall read 2026-11-01" under "The batch's
   wall time grows by `UNKNOWN - verify`": milestone 1's batch session ran 22.22 h at 18.0 games/h (400 games, 0
   pauses), inside the restated 21.7–24.1 h, via `rpair` at `Skill Level` 6 on both builds (`ABC-247`). Source
   `qe-EPIC-010-m1-batch-2` `…428e3797` (22.216 h, 18.01 games/h) and `…1a53a7f9`.

No NFR level, cap, pin, W, step set, lane command or rule moves. No owner word is owed. Owed item (3) of `…305c1830`
(condition 2's unit) stays owed only if a later depth-sensitive step move trips the floor; not taken here.
