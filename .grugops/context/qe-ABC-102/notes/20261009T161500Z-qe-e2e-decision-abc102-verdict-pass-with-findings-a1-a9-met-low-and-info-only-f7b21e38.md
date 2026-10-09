---
id: 20261009T161500Z-qe-e2e-decision-abc102-verdict-pass-with-findings-a1-a9-met-low-and-info-only-f7b21e38
kind: decision
by: qe-e2e
at: 2026-10-09T16:15:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - ADR-0021
  - ABC-035
  - ABC-036
  - ABC-038
  - N8-LANE
  - grugops/qe-ABC-102
  - grugops/ABC-102-undo
supersedes:
---

# QE verdict on `ABC-102` (`undo`): PASS WITH FINDINGS

This decision is hand-authored and has no `seal`. This install has no sanctioned writer
(`AGENTS.md`), so this is a `decision`, not a stamped `finding`.

## Verdict: PASS WITH FINDINGS. Nothing blocks.

Reviewed: `grugops/ABC-102-undo` @ `7caead3`, with src at `53fd3d2` off `4c5eddc`. All nine
criteria `A1`–`A9` were reproduced independently and all are MET (`…90c804d2`). The four gates are
green at 48 files / 1485 passed / 0 skips, and test integrity is clean. The edge cases were driven
through the real loop, reader and engine (242/242) and through the real entry point, for both
colours (`…406a94ec`). The build's M1 and M3 were re-applied and both go red, matching its ledger
row for row. 8 mutants of QE's own were added; 7 go red, and the 8th (table order) is shown
equivalent across 10080 renders (`…dbe418af`). The three superseded rows each have an equivalent
or stronger guard, and that was proven by mutant Q3. Docblocks are true.

## Findings (none blocking)

| # | severity | finding | to |
| --- | --- | --- | --- |
| G1 | low (cosmetic) | `src/command-input.ts:133` (the `helpMessages` docblock) is one comment line of ~120 columns, where the file's style is ≤ 100. Biome does not reflow comments, so lint is green. | Software Engineer, at the next touch. Not worth a re-hop on its own. |
| G2 | low (forward risk) | At the narrowest frame (start position, 21 columns) `help`'s row 1, `help board quit claim`, is **21/21 with zero headroom**. Measured: an eighth token the length of `moves` (`ABC-036`) fits at exactly zero headroom on both rows. A ninth hides 3 (`resign new (+3 more)`). The ticket's ruling 6 is met; the next vocabulary ticket inherits a full region. | BA/PM, for the `ABC-036` / `ABC-038` re-score |
| G3 | info | Table / help order is pinned by no test (Q8 survives). It is equivalent: none of the 10080 orderings hides a token, and classification is exact-match. | none |
| G4 | info | **Black's `undo` floor is ply 1.** The engine's opening move cannot be undone; ruling 3 refuses at ply 1 and `new` is the route back. This is consistent with the page. `A3`'s "start position" is White-only. Worth knowing at UAT. | UAT |
| G5 | info (process) | The build notes' `at:` values (17:00–17:10Z) and this subtask's `enqueued_at` (16:50Z) are about 1 h **later** than the build commit's own clock (`53fd3d2` at 15:55:45Z) and later than this hop's claim (15:58:07Z). Replay sorts by `at`, so this review sorts **before** the build notes it reviews. This hop's notes carry the real UTC time. | Orchestrator |
| G6 | info | Q4 (guard `> 2`) is killed by exactly one row in the test file (`A3`). Red, so the criterion holds; it is a thin spot only. | none |

## `N8-LANE`: readings only, not ruled

- 0 new test files, 0 new children. `src/cli.test.ts` is byte-identical, so `N8-SPAWN` is not
  engaged.
- In-file, interleaved B A / A B against a detached base worktree at `4c5eddc` (removed after),
  n = 5 each, 1-min load 6.4–6.5 with a sibling engineer live: vitest `tests` time median
  **31 → 37 ms (+6 ms)**; process CPU median **1.68 → 1.72 s (+0.04 s)**. Both are within
  650 ms, and both agree with the build's +6 ms / +60 ms (`…b8d1f5a2`). Raw:
  `raw-n8-infile-interleaved.txt`.
- The whole-lane `NFR-008` clause state was not re-measured. The build's reading (~23 s CPU both
  before and after) and the ticket's "breach is the base's, Architect/Design's question" stand as
  reported.
- No Security/NFR trigger: the only files touched under `src/` are the two in `A9`.

## Fences held

- Zero lines committed under `src/`, `tools/` or `package.json`. Every mutant was reverted by
  `git checkout`, and `git status --porcelain -- src` read empty after each one and at the end.
  Probes live under `.grugops/context/qe-ABC-102/probes/` only, which is excluded from vitest,
  biome and tsc.
- No edits to `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` or any ADR. Not merged, not
  pushed.
- The board move out of `In Review` belongs to the Orchestrator.
