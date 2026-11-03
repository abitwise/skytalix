<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-ABC-274-seam

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-03T13:04:52Z | decision | architect-design | high: seam and test text read from c131ecd0 by git show; rules read from ADR-0026 d2, ADR-0064 d7, ADR-0067 d5/d6; S1's arithmetic is a reading, not run (UNKNOWN - verify until the repair's rows show it); the seam's shipped-path cost UNKNOWN - verify (A5) |  | # arch-ABC-274-seam ruling: ACCEPT WITH CONDITIONS. `withParametersForTest` is an allowed test-only seam (not a door, not ADR-0026 d2's module-level hook). Three conditions S1–S3, met by one test-only Engineer repair before QE's verdict. ABC-239 does not reuse the seam. A3's stated rule suffices: QE freezes no rows, and checks Q1–Q4 instead. Written into ADR-0067 decision 8 (dated line) and F8; no bar moved |
| 2026-11-03T13:04:52Z | observation | architect-design | high: every line quoted is read from c131ecd0 by git show or git grep; nothing was run |  | # arch-ABC-274-seam reading of the build (by `git show`, nothing run): the seam's code facts the ruling rests on, and the two defects in it, one in the seam (loader outside `try`) and one in A3's mobility counter (E1-dependent) |
