# bapm-ABC-302-dor observation: two readings carried onto the ABC-302 page. The cut's futility "expected 48" was wrong (53), and R5's placement is worded two ways by the Architect's sources

BA/PM, task `bapm-ABC-302-dor`, read from `arch-ABC-302`'s sealed notes and `ADR-0046`; nothing re-run.

## 1. The futility count (corrects `bapm-ABC-302-cut` `…0ea9a948` and the page's § Scope)
- The cut expected `AGENTS.md`'s futility "47 tests" to become 48. That was reasoned from the line, not from a count.
- The Architect's `counts.tsv` (observation `…8c8cfeed`) defines **53** in that lane at `fed3f2b4`. The 47 was already stale at base. R3 takes W, which adds 0, so the tip reads 53.
- The page now carries 53 (A4 table, A5). The passed count QE reads in A4 decides.

## 2. R5's placement
- `ADR-0046` § Dated 2026-11-04 (`arch-ABC-302`), in its table, places R5's full row in "a sibling describe".
- `…bcadd41d` § SE build lines, line 3, says R1, R3 and R5 nest an `if (RUN_DEEP) describe(…)` inside the original describe, so that `countingClock` stays one copy.
- BA/PM does not rule placement. The page records both readings. Either shape meets A2 and A4 if `countingClock` stays one copy and R5's `-t` line prints "1 passed" (the page's existing "another shape" rule). If the SE needs one answer, it is Architect/Design's.
