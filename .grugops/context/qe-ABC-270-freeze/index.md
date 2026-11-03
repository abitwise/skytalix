<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-270-freeze

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T22:26:33Z | decision | qe-e2e | high (a pre-registration: every count derived by hand from the stated rule, then checked on main by a rule re-implementation and by main's evaluate per term; no ABC-270 code exists; K0 copied from ADR-0068 d6, not re-read) |  | # qe-ABC-270-freeze PREREG: ABC-270's K1 (c) queen pairs, frozen before any build. 7 pairs plus 1 control that differ only by the enemy queen(s), with each king's expected base and queen-on counts derived by hand from the stated rule, plus K0's node-identity numbers as ADR-0068 d6 lists them. se-ABC-270 implements against these rows and QE grades them; nobody changes them |
| 2026-11-03T22:26:38Z | observation | qe-e2e | high on the arithmetic (QP2 A's net seam delta is 0 by the frozen counts); the per-king read's form is the Engineer's |  | # qe-ABC-270-freeze gaps: three reading notes for se-ABC-270 and for QE's grading of K1 (c) (INFO / LOW). None blocks the build |
