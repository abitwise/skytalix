---
id: 20261009T171000Z-software-engineer-observation-n8-lane-plus-18-rows-0-files-0-children-in-file-plus-6-ms-tests-plus-60-ms-process-cpu-within-650-b8d1f5a2
kind: observation
by: software-engineer
at: 2026-10-09T17:10:00Z
verified_by:
confidence: medium
refs:
  - ABC-102
  - N8-LANE
  - NFR-008
  - ADR-0019
  - src/command-input.test.ts
supersedes:
---

# `N8-LANE`: +18 rows, 0 files, 0 children. In-file +6 ms test time, +60 ms process CPU — within 650 ms. Lane CPU 23.04 → 23.11 s median, noise. Not a conforming `ADR-0019` reading; `NFR-008` not ruled

**Instrument:** `raw-n8-lane-harness.sh.txt` — `/usr/bin/time -p npx vitest run …`, one fresh process
per run, base = a detached scratch worktree at `4c5eddc` (removed afterwards), after = this worktree
at the committed tree. Interleaved B A / A B. CPU = user + sys. 1-min load 4.2 (in-file), 4.2–8.9
(lane); sibling hops live. Raw: `raw-n8-lane-interleaved.txt`.

| measure | before (`4c5eddc`) | after | delta |
| --- | --- | --- | --- |
| `src/command-input.test.ts` rows | 133 | 151 | +18 |
| vitest `tests` ms, median n = 5 | 23 (22–27) | 29 (28–31) | **+6 ms** |
| process CPU, median n = 5 | 1.17 s | 1.23 s | **+0.06 s** (includes transform/collect of the larger file) |
| whole lane CPU (`--dir src`), median n = 3 | 23.04 s (22.95–23.07), 1467 tests | 23.11 s (22.62–23.38), 1485 tests | +0.07 s, inside both ranges' spread |

- **Against the ticket's line (≤ 650 ms):** met by either reading. **Against its expectation
  (≲ 10 ms):** met on vitest test time (+6 ms); the process-CPU reading (+60 ms) is above that
  estimate, reported as measured, not trimmed.
- **0 new test files, 0 new children** — `src/cli.test.ts` byte-identical; `N8-SPAWN` not engaged.
- **Lane clause state, not ruled:** the whole lane reads ~23 s CPU both before and after, over the
  15 s `NFR-008` line, as the ticket page already records for the base. The breach is the base's,
  not this diff's; the question is Architect/Design's (`ADR-0019` trigger (a)).
