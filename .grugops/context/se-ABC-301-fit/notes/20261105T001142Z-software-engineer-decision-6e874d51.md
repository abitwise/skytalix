---
id: 20261105T001142Z-software-engineer-decision-6e874d51
kind: decision
by: software-engineer
at: 2026-11-05T00:11:42Z
verified_by: 
confidence: high: each cause read from a run; the attribution ran the old tool with E4a unfreed
refs:
  - se-ABC-301-fit
  - se-ABC-301-fit-2
  - ABC-301
  - ADR-0067
  - grugops/ABC-301
  - e763119c
  - 48f8134e
  - tools/tune/tune.ts
  - tools/tune/tune.test.ts
supersedes: 
seal: sha256:0e293fcf7ed56de9d86823b23bb1354bafc3ae50b310746017707a2edafea6fd
---

# se-ABC-301-fit decision: the four TUNE_DEEP reds of 22:10Z. One reporting defect fixed, one wrong test expectation corrected, two rows slow; none was a moved bar

Software Engineer, resumed as se-ABC-301-fit-2, on grugops/ABC-301. Fix at e763119c. The lane read 25 passed of 25 after it (raw/tune-deep-e763119c.txt), and 4 failed, 21 passed before it.

| row | cause | fix |
|---|---|---|
| "(1) and (3)": expected 0 to be greater than 0, on b.mu | **A defect in the tool's report.** newton zeroed mu whenever an iteration did not take the bounded step, before knowing the step was accepted. The last iteration's box-only step was rejected by the line search, so z stayed on the row (residual 6e-14, read -31 against -27) while its μ read 0. The row itself held; only the provenance figure was wrong | mu now changes only when a step is accepted. The table does not change. The bar (μ > 0 on a binding row) stands |
| "ABC-301: a term's without removes its families": expected [] | **A wrong expectation in the stalled agent's new row, never green.** On the rig row the two reads cancel every feature and leave the mobility count, so a is MOBILITY_WEIGHT.mg -48, eg -24 (count 72 at w = 16). Those are what the row must read: it is mobilityTerm(rig) > 0, and an empty a could not bind anything | The row now asserts those two entries. Checked outside the tool: evaluate less evaluateWithoutMobility is 100 on the rig, and the row reads -100 |
| "extract + fit + emit twice": 5 s timeout | **Slow.** 8.7 s, against 1.3 s with E4a's 18 parameters unfreed | stated timeout 60 s |
| "(2): a row the box-only fit holds": 5 s timeout | **Slow.** 8.7 s, against 1.2 s the same way | stated timeout 60 s |

"(1) and (3)" also takes the stated timeout: it runs 8.5 s and would have timed out next.

**Attribution, run:** the old tool with E4A_TERMS empty reads all three fit rows green, μ included, at 1.3, 4.1 and 1.2 s (scratch, not committed). So freeing E4a exposed the μ defect and the cost. It did not put the defect there.

**Added, reporting only:** the full fit's log line names how Newton stopped (relative change, line search, step cap).

**Seen, not changed.** On the deep lane's small fixture the projected Newton can stop on a rejected step after one iteration: far more parameters than rows, and a projected direction need not descend. That is d4's stop rule as written, and ruling (b) takes the box-only step when no row is crossed, so I left the solver alone. I added the stop reason so the real fit could be read: it stopped by relative change at 7 steps, so this did not bite there.

Slip of mine, no effect: my first fix failed the emission typecheck row (a Float64Array type) and was corrected before e763119c.
