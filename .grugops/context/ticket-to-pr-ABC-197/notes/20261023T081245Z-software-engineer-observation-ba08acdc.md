---
id: 20261023T081245Z-software-engineer-observation-ba08acdc
kind: observation
by: software-engineer
at: 2026-10-23T08:12:45Z
verified_by: 
confidence: high (measured on scratch trees, one file; whole-lane reds UNKNOWN - verify, QE A5)
refs:
  - ABC-197
  - QE-177-b
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-178
  - src/uci-session.test.ts
  - 051d557a
  - 20e397c8
  - A5
  - A1
  - src/uci-session.ts
  - src/levels.ts
  - 20261023T081245Z-software-engineer-observation-eeec2b5f
supersedes: 
seal: sha256:40b79be9a520850351c998f5d111a6caed65cfd43bea8f0c743492e93e18ec19
---

# `ABC-197` A5's QP6-2900 and QP6-3300 rows cannot go red under A1's bound as written. A5 is QE's, the bound is BA/PM's

This is an observation, not a finding: there is no stamp. Measured on scratch trees, on the one file, with no timing. Readings: this task's A1–A4 readings observation.

- **QP6-3300 is an equivalent mutant at the session boundary.** `go` takes `Math.min(request.budgetMs, level.budgetMs)`, and the highest level's budget is 3 000 (`levels.ts` L45–49; `DEFAULT_LEVEL` 5).
  - So any G > 3 000 on the dropped-token path searches exactly as G = 3 000 does.
  - R2 reads `time 3100`, 25 621 nodes and `bestmove g1f3`: byte-identical output.
  - No row on any level can kill it. Its "R2 red" cell in A5 cannot be met by any bound.
- **QP6-2900 sits inside the 100 ms band that A1's lower bound leaves.**
  - On step 100, R2 reads `time` = 3 100 on the correct build, and 3 000 at G 2 850 and G 2 900. Those pass `≥ 3 000`.
  - G 2 800 reads 2 900 and goes red. So under A1 as written, R2 kills G ≤ 2 800 and is blind on about [2 850, 3 000).
  - This is the page's own "about 100 ms band". A5 then puts 2 900 inside that band and expects red.
  - The page's Problem line, "U7 at step 100 caught any G at or below 2 900 ms", reads the same way: 2 900 reads 3 000 there too (U7 asserted only `≥ 3 000`).
- **What does go red:** QP6 at G 2 500 (time 2 600, R2 alone in the file). Whole-lane reds are QE's to read at A5.
- **Not changed here.** A1's bound is binding page text. A lower bound of `≥ 3 100` would read 2 900 as red (3 000) but leave G in [2 950, 3 000) blind; it is not measured beyond the scan. That is BA/PM's call.
- **Route:** BA/PM re-rules A5's QP6-2900/QP6-3300 rows (or A1's lower bound) before QE's A5 gate. Otherwise QE's A5 reads NOT MET on two of four probes, through no fault in the build.
