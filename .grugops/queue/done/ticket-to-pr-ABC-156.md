---
result: delivered
branch: grugops/ABC-156-metrics-rework-count
tip: 6d2caf56
code_commit: 64e9c94d
base: ac7d9589
---

ABC-156 delivered on branch. Under `plans/`, `src/` and `memory-bank/` the change is: `plans/metrics.md` +2/-1
(the `Rework rate` row and one `_Updated:` line), the ABC-156 page +29/-0 (Delivery), and `plans/traceability.md`
+1/-0. `src/` is empty. Notes are in `.grugops/context/ticket-to-pr-ABC-156/notes/` (3).

A1-A5 are MET. Re-derived from the register (15 rows, all ancestors of 3215004c) and from the git order in which
tickets entered `## Done`: 15 moves, 0.60 per ticket, ABC-017 2, ABC-019 3, sum 15. The last ten have 7 tickets and
13 moves. "off by one" appears 0 times and "13 backward moves in total" 0 times.

Gates on the tip: lint 0, typecheck 0, build 0, npm test 58 files 1810/1810, last-run.json success, skip-integrity
`--skip-count 0` No findings. Flag for QE: the new `_Updated:` line has no blank separator, to keep A5 at one
added line.
