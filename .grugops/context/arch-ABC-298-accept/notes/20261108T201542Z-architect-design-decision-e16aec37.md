---
id: 20261108T201542Z-architect-design-decision-e16aec37
kind: decision
by: architect-design
at: 2026-11-08T20:15:42Z
verified_by: 
confidence: high that the records now say what the owner's word and the Orchestrator's note say; nothing run
refs:
  - arch-ABC-298-accept
  - ABC-298
  - ADR-0077
  - ADR-0056
  - orch-2026-10-30a/20261108T201234Z-orchestrator-decision-44810861
  - e21d228c
supersedes: 
seal: sha256:5a3f877724835a0b37c99da1d3b7c57c5e1db2829c617e1968e28ec543c5779e
---

# arch-ABC-298-accept items 1 to 3: `ADR-0077` ACCEPTED, his question 2 where the stop lives, `ADR-0056` D2 row V3

**The owner's word, verbatim** (`orch-2026-10-30a` `…44810861`, 2026-11-08): "accept ADR-0077 ; yes". Question 1, accept `ADR-0077`: yes. Question 2, a stop or a miss ends V3: yes. Both were the recommendations he was shown (`…b517ced2`).

**Written, text of record `e21d228c`, on `grugops/arch-ABC-298-accept` from `main` `3458e31c`:**

1. **`ADR-0077` § Status: ACCEPTED 2026-11-08 by the owner, in force only at `ABC-298`'s merge.** His word, what it settles (d1–d12 as written), his question 2 in one line, and step 2 of d9's order split into the Architect's half and BA/PM's (`bapm-ABC-298-accept`). The PROPOSED block is kept below it under *As proposed*. § Decision log: an Owner row and an Architect/Design row.
2. **His question 2, as a dated line at d12, where the stop lives.** A count-probe STOP (d9, F5), a miss on SG3 (d7, F4) or identity not kept (d12, F2) ends V3. No wider form follows without a new ADR and his word: not captures before quiets (d4), not the hash move first at remaining depth 3 or more (d1's gate), and not the value-changing staged generator. A VOID or VOID-LOAD reading is not a miss and may be re-read as d7 says, which is what his question told him.
3. **`ADR-0056` D2, row V3, one dated line.** V3 (`ABC-298`) is the next search step, by his option 2, step-by-step gains at 100 ms (`…4d1e0382`), and by `arch-search-rank`'s pick (`…5a155b2c`). `ADR-0077` is ACCEPTED, in force only at the merge, in a form narrower than the row's (remaining depth 1–2, node-identical, no door, no games; captures first out). The row's +10–30 stays an estimate, unclaimed. The row's cells are not rewritten. D6's "V3 after O1-d" is already met: O1-d is `ABC-254`, done and merged 2026-11-01.

**Nothing else moved.** No gate, form, value, bar, spread rule, stop rule or order step changed. The count probe stays written and not run.

**Still owed, unchanged by this hop:** BA/PM's half of step 2 (`bapm-ABC-298-accept`: the page narrowed to d1, SG rows, the `NFR-008` line, DoR 10 / 10). Then step 3, `arch-ABC-298-probe`, the untimed count probe under the host lock, no held host, its plan sealed before it runs. QE's freeze only on GO.

Nothing was run: no test, build, engine or probe.
