---
id: 20261105T114213Z-ba-pm-observation-bfe811de
kind: observation
by: ba-pm
at: 2026-11-05T11:42:13Z
verified_by: 
confidence: high that each item is open on the records; the items marked UNKNOWN - verify stay so; nothing run
refs:
  - bapm-ABC-291-lines
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - ABC-305
  - ABC-306
  - EPIC-011
  - ADR-0075
  - arch-ABC-291-accept
supersedes: 
seal: sha256:b43dee11e4abb61d1e3106b79faba3bfc343a0456558c174fda33af8c3405947
---

# bapm-ABC-291-lines: what this hop leaves open

BA/PM, task `bapm-ABC-291-lines`, records only. Nothing below is a reading.

**For the Orchestrator.**
1. **"In force at the merge" against the pages' pointers.** `ADR-0075` is in force only at `ABC-291`'s merge, and the pages now carry d11 (b), d11 (c) and d12 as lines to work to. If a probe miss stops the build, § Rollback strikes the dated lines in `ADR-0056` and `ADR-0067`, and F5 leaves the ADR "accepted, not in force". The lines on `ABC-290`, `ABC-292`, `ABC-293`, `ABC-306` and `EPIC-011` would then need a BA/PM hop. Each says "in force at `ABC-291`'s merge" or names the ADR. Whether `ABC-292`'s ADR may follow d12 before `ABC-291` merges is not stated on any record I read; `…ba886714` has it wait only for this ADR.
2. **The ADR on `main` read PROPOSED at my base.** `arch-ABC-291-accept` was on its own branch, unmerged, while I worked. I read its diff: status ACCEPTED, d1–d12 as written. The pages read accepted on the owner's word `…c1623ae7`. Merge it first, or with this one.
3. **`main` moved to `a6ae8227` (`ABC-282`'s merge) after my branch was cut at `1d0c7acc`.** No page I touched changed there. `plans/traceability.md` gained rows at the same place as my trace row, so the merge may need that one hunk taken from both sides.
4. **The board's `ABC-291` row still reads "ADR-0075 PROPOSED".** Fenced from me.
5. **`ABC-306`'s hold block and DoR row 10** keep "a third pull he has said yes to" and "no fit and no case". The fit line says how it reads. A word change there was not in the brief.

**Carried, `UNKNOWN - verify`, not mine to settle.** Every item of `ADR-0075` § `UNKNOWN - verify`, on `ABC-291`'s page. K2's value rows and re-point list stay the Architect's, after the probe's PR11. `ABC-291`'s size stays S–M: the ADR did not re-estimate it, and the doors, the tool line and K0–K7 were not priced by anyone.
