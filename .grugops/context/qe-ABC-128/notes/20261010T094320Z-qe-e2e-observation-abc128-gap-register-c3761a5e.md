---
id: 20261010T094320Z-qe-e2e-observation-abc128-gap-register-c3761a5e
kind: observation
by: qe-e2e
at: 2026-10-10T09:43:20Z
verified_by:
confidence: high
refs:
  - ABC-128
  - ABC-021
  - ABC-120
  - QE-128-a
  - QE-128-b
  - QE-128-c
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - 20261010T094320Z-qe-e2e-observation-abc128-twelve-mutants-m9-red-exactly-a3-a5-1c4b0c68
supersedes:
---

# `ABC-128` gap register: two surviving mutants on edges the ticket fenced out; none blocking

Hand-authored, no seal. Every gap below is **outside `ABC-128`'s scope**. The ticket's `## Out of
scope` names these edges, and the narrowed `A8` title does not claim them. So none of them is a
criterion miss. They are recorded so the ticket's `UNKNOWN - verify` is replaced by a measurement.

- **QE-128-a — LOW, advisory, a follow-up candidate for BA/PM.** `M14` puts one `keyHistory(history)`
  in the branch shared by `rejected`, `ambiguous` and `command` (`board`/`help`). That is an
  `O(plies)` replay on every typo or command, the same cost class as `M9`/QE-051-b. **It survives
  the whole default lane at the tip: 1540/1540.** A one-line `toHaveBeenCalledTimes(0)` in an
  existing row whose script includes a `board` or a rejected move would kill it. The candidate rows
  were not measured here. `A1`'s run in this file is one (its script includes `board`), but it would
  need to read the spy, and that is the next ticket's choice.
- **QE-128-b — INFO.** `M17` puts one `keyHistory` on the seam's `game-over` edge. It survives the
  whole lane at the tip. The edge is terminal, so the cost is one replay per session. QE grades it
  INFO. It is listed only because the ticket named the edge.
- **QE-128-c — INFO, kept by accident.** `quit` (`M15`) and `eof` (`M16`) are killed, but only because
  `A3`'s script ends in `quit` and the `A8`/`A4`/`A5` runs end in `eof`. No row names those edges. If
  someone edits those scripts, the kill can go away without anyone noticing. The title correctly
  does not claim them.

**Not gaps:**
- `M9c` (a replay only when `plies > 0`) leaves `A5` green. This is correct: `A5` is the ply-0 row,
  and `A3`/`A4` kill it.
- The ticket's test note 1 cites `:1948` for `A3`, which is 2 lines off at the base (1946). The
  Engineer already recorded this (`…f2b00452`). It is prose only.

**Carried, not re-measured by QE:** an admissible full-lane `N8-LANE` paired figure. The Engineer's
null was +1.76 %, sign 6/7, load1 17→44. QE did not re-run it either (load1 7.6–15.5 during this hop).
The branch adds 0 files, so it is 0 ms net by the catalog's scope. The figure is `UNKNOWN - verify`
on a quiet machine.
