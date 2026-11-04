<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-271-freeze

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-04T13:38:56Z | decision | qe-e2e | high (a pre-registration: every value derived by hand from ADR-0070 d1/d2, then checked on main by a re-implementation of the ADR text and by main's parseFen / phaseOf / isPassedPawn / evaluate mirror; no ABC-271 code exists; K0 copied from ADR-0070 d5, not re-read) |  | # qe-ABC-271-freeze PREREG: ABC-271's K1 (a) passer positions, K1 (c) seam fixtures and K0 counts, frozen before any build. 12 new passer positions for the mirror; 44 seam fixtures (5 U twin pairs + 5 U singles, 9 king-distance pairs, 5 free-path pairs + 1 control), each with FEN, phase, side to move and the four E4a feature values per side derived by hand from ADR-0070's definitions; K0's seven counts as ADR-0070 d5 lists them. se-ABC-271 implements against these rows and QE grades them; nobody changes them |
| 2026-11-04T13:39:02Z | observation | qe-e2e | high on the readings stated (each is from the ADR text and the frozen rows); the seam's form is the Engineer's |  | # qe-ABC-271-freeze gaps: five reading notes for se-ABC-271 and for QE's grading of K1 (c) (INFO / LOW). None blocks the build |
