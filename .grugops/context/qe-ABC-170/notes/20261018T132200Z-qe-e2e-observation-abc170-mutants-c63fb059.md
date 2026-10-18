---
id: 20261018T132200Z-qe-e2e-observation-abc170-mutants-c63fb059
kind: observation
by: qe-e2e
task: qe-ABC-170
at: 2026-10-18T13:22:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - QE-170-b
  - QE-170-c
  - QE-170-d
  - QE-170-f
  - .grugops/context/qe-ABC-170/probe/mutants.py
  - .grugops/context/qe-ABC-170/probe/run-all-t120.log
  - .grugops/context/qe-ABC-170/probe/run-extra.log
supersedes:
---

# ABC-170 mutation probe: 23 mutants of `src/engine.ts` at `64b07741`, whole default lane

## Method
- Each mutant was applied to `src/engine.ts` in the scratch worktree only.
- Each ran `npx vitest run --testTimeout=120000` with every `*_DEEP` unset, and failures were collected from the JSON reporter.
- The file was restored after each run: md5 `3ce3a251…` before and after, equal to `git show 64b07741:src/engine.ts`.
- The baseline is 1839/1839.
- A first pass at the default 5 s timeout is kept as `run-all-t5000-default-timeout.log`. Its extra "kills" by `ABC-170 A3` were
  timeouts (QE-170-a). The table below is the 120 s pass.

| id | mutant | result | killed by |
|---|---|---|---|
| M01 | countNode: drop the `maxNodes` term | KILLED (2) | ABC-170 A2 bound row, A2 identity row |
| M02 | header: drop the `maxNodes` term | KILLED (2) | A4 text checks only (the behaviour is near-equivalent: the next iteration aborts at its first check) |
| M03 | header: drop the `maxDepth` term | KILLED (5) | A4 ×2, A1 d3, A1 d1, A2 identity |
| M04 | countNode: `maxNodes` before the clock | **SURVIVED** | none (QE-170-d) |
| M05 | header: clock last | KILLED (1) | A4 loop-header text check only |
| M06 | header: `iteration <` (off by one) | KILLED (3) | A4 ×2, A1 d3 |
| M07 | catch: report the aborted depth | KILLED (4) | engine A3 abort row, A3 identity (endgames), ABC-170 A2 identity, transposition A5 |
| M08 | `maxNodes` default 10 000 000 | **SURVIVED** | none (QE-170-b) |
| M08b | `maxNodes` default 200 000 | **SURVIVED** | none (QE-170-b) |
| M08c | `maxNodes` default 60 000 | **SURVIVED** | none (QE-170-b) |
| M09 | header `maxDepth ?? 64` | KILLED (3) | A4 ×2, engine.capacity ABC-122 A8 |
| M10 | body `if (iteration > 64) break;` | KILLED (1) | engine.capacity ABC-122 A8 only, **not A4** |
| M11 | body `if (iteration > 9) break;` | KILLED (1) | engine.capacity ABC-122 A8 only, **not A4** |
| M10c | body `if (iteration >= 130) break;` | **SURVIVED** | none (QE-170-c) |
| M10b | body `if (iteration > 200) break;` | **SURVIVED** | none (QE-170-c) |
| M12 | `maxNodes` checked at every node after depth 1 (a precise abort) | SURVIVED | none. Near-equivalent: it gives a tighter bound and deviates from D12's placement |
| M13 | first iteration abortable by `maxNodes` | KILLED (1) | ABC-170 A2 `maxNodes: 1` row |
| M14 | countNode `>=` → `>` | SURVIVED | none. Equivalent except when `nodes == maxNodes` exactly at a check |
| M15 | extra clock read **only when `maxNodes` is absent** | KILLED (6) | ABC-170 A3, engine A3 abort row, ABC-086 A1, levels R1, search.ordering G1, transposition A6 |
| M16 | extra clock read on **both** paths, at init | KILLED (5) | the same set **minus ABC-170 A3** (QE-170-f) |
| M17 | `maxDepth ??` → `\|\|` (0 means unlimited) | KILLED (2) | A4 text checks only |
| M18 | extra clock read per iteration on both paths | KILLED (7) | engine A3 abort, A4 behavioural, RF-1, ABC-170 A1 "real stop", search.ordering G1, transposition A5, A6. **Not ABC-170 A3** |
| M19 | a node-limit abort returns the aborted iteration's partial best as completed | KILLED (1) | ABC-170 A2 identity row only |

**Totals:** 23 mutants. 15 killed and 8 survived. Of the 8 survivors, M12 and M14 are near-equivalent, and the other 6 are real gaps:
M04, M08, M08b, M08c, M10b and M10c.

## Answers to the brief's two questions
- **Does the loosened A4 header check still catch a constant depth cap?**
  - **In the header, yes.** M09 is killed by both A4 checks. Any extra clause also breaks the verbatim `toContain`.
  - **Outside the header, no, and the old exact pin could not either.** Both are contain-checks of the `for` line. The new ban
    regex `iteration\s*<=?\s*(\d|[A-Z_]{2,}\b)` only covers the `<` / `<=` direction, so `if (iteration > N) break;` passes it.
  - Below about 128, the cap is caught behaviourally by `ABC-122 A8`. At 130 or more it survives the lane.
  - So the loosening lost nothing against the old pin (QE-170-c).
- **Is "dropping `maxNodes`" or "swapping the clock-first order" killed?**
  - Dropping it in `countNode` is killed by A2. Dropping it in the header is killed only by A4's text pin.
  - The swap in the header is killed by the A4 text pin only. **The swap in `countNode` survives** (QE-170-d).
