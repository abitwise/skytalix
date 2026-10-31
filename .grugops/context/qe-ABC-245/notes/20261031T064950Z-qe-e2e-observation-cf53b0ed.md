---
id: 20261031T064950Z-qe-e2e-observation-cf53b0ed
kind: observation
by: qe-e2e
at: 2026-10-31T06:49:50Z
verified_by: 
confidence: high on what was run; none blocking
refs:
  - qe-ABC-245
  - ABC-245
  - EPIC-010
  - ADR-0046
  - ADR-0054
  - ADR-0032
  - NFR-008
  - ABC-244
  - ABC-242
  - ABC-221
  - ABC-230
  - QE-242-b
  - SE-242-f
  - SE-245-a
  - SE-245-b
  - SE-245-c
  - QE-221-c
  - QE-245-a
  - QE-245-b
  - QE-245-c
  - QE-245-d
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - bapm-ABC-245-rescore
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - se-ABC-245/20261031T061812Z-software-engineer-decision-69e64b77
  - se-ABC-245/20261031T061812Z-software-engineer-observation-c1655da6
  - se-ABC-245/20261031T061812Z-software-engineer-observation-bce18931
  - se-ABC-245/20261031T061812Z-software-engineer-observation-f0b04c75
  - grugops/ABC-245
  - 7e81732e
  - 7c1721ce
  - 9c008db4
  - 4387d4e8
  - c48a6f83
  - grugops/qe-ABC-245
  - d16c7505
  - src/levels.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:84f1a21a57cadcf52c034ec0e0392dce7f5e445ca978791d8622463a3baee283
---

# `ABC-245` QE findings: one LOW (`G8` head 9.82 s fires tranche 2 on a noise-dominated median; 0.18 s of `NFR-008` headroom) and three INFO. None is a build fault. QE-242-b is closed

- **QE-242-b: CLOSED.** Cap 8 (Q6) and cap 50 (Q8) now turn the default lane red, on the ABC-245 row and only there. The row kills
  every cap below 98 (Q97 red, Q98 survives). Caps 98–100 and removing the cap stay equivalent for every trimmed caller.
- **QE-245-b (LOW, a lane-headroom regression risk, not this ticket's fault).** `G8` head median **9.82 s**, base 9.44 s, so
  **`ABC-244`'s tranche-2 trigger fires on the raw head median**. `NFR-008` (≤ 10 s) holds with 0.18 s to spare.
  - The +0.38 s delta is not the row: `levels.test.ts` is +18 ms, while files byte-identical between B and H account for the
    rest (`cli` +80 ms, `engine` +43, `uci-session` +41).
  - One head run (10.19 s) was slow across files. Transient foreign `node` processes appeared before runs 1–3.
  - Owner: whoever reads `ABC-244` tranche 2 (Orchestrator / Architect). It is reported, not acted on here.
- **QE-245-a (INFO).** The R1 census line's "10 reads per level call" is the ruling's interval count (⌈100 ÷ 10⌉). The level call
  actually makes 30 `now()` calls at step 10 and runs 290 of its 100 virtual ms. The child budgets read as handed equal the SE's
  line value for value. `ADR-0046` § Ruling 2026-10-31 accepts the form. This is a labelling note only.
- **QE-245-c (INFO; SE-245-c confirmed).** The header count is right today (46 = 46). It goes stale with the next row added to
  `src/levels.test.ts`, as it did from 19 against 45 before this ticket. No guard ties the number to the run. A4 permits dropping
  the number; the SE kept it. That is a maintenance cost, not a fault.
- **QE-245-d (INFO, harness).** Two deviations, neither a change to any plant or expectation:
  - `node_modules` in the scratch tree H is one symlink to the main checkout's, not a hard link. A hard link cannot cross from
    `/home` to the tmpfs scratchpad. The lock files are equal, and B and P are hard-link trees of H.
  - `names.mjs`'s tree regex was fixed after the PREREG: the first copy missed the escaped slash. The fix is marked in the file's
    header.
- **Bonus, not owed (INFO).** The −98 match sits exactly at the oldest readable entry, min(child clock 98, list 98). So the row
  also pins the clock and list-length terms of `standsTwiceBefore`'s bound at their edge: a bound one entry shorter on any term
  misses it. This is by reasoning from the asserted offsets; the root-clock mutant (qe-ABC-242 Q9) was not re-run here.
- **Not covered here, by design:** deep lanes (`ENGINE_DEEP`, `LADDER_DEEP`) were not run, because the brief did not ask and no
  production line changed. No UAT: 0 production lines (Test note 2).
