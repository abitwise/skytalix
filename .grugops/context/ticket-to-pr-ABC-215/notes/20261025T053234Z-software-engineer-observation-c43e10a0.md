---
id: 20261025T053234Z-software-engineer-observation-c43e10a0
kind: observation
by: software-engineer
at: 2026-10-25T05:32:34Z
verified_by: 
confidence: high (deterministic counts, gates as run); G6/G2/D are UNKNOWN - verify until QE reads them
refs:
  - ABC-215
  - EPIC-008
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - bapm-amend-ABC-215/20261025T050544Z-ba-pm-decision-fb4f7c9c
  - grugops/ABC-215
  - ec9331e2
  - c8fc3075
  - G1
  - G6
  - NFR-005
  - NFR-008
  - S3
supersedes: 
seal: sha256:2d6ded5e558f709287c753428d0eef060719692ce3cfa47a59d752b8158f2c52
---

# ABC-215 plants, frozen-clock counts and gates, all run by the SE (no real-clock search, no G6, no games)

Scratch: `<scratchpad>/se215/` (copies of the worktree; no plant touched `src/`). Plain node; deterministic clocks only.

## Plants (red-first)
- **A2 red at base values:** the 15 new rows were run before the values changed. 14 were red: 7 rebuild and 7 differ. The keys row was green. After the values went in: 36/36.
- **Single-cell mutants:** knight a8 +1, king g1 +1 and `PIECE_VALUE` knight +1 each turn exactly 1 row red: that array's rebuild row.
- **Bite checks on the moved rows:** `N3` 1 red (G1 342). `M13` 6 red (the promotion-capture 232 row among them). `M11` (unordered engine root) 2 red: the tie companion a4b3 and G1. `keepBestSoFar` 3 red, including engine `A3` "returns the completed depth-2 move". `noLmrResearch` and `noResearch` each turn both `pvs-lmr` `A4` rows red. Each recursion alone turns its own row red (4 single-recursion plants, 1 red each). The unmutated baseline is 152/152 green.

## Frozen-clock pre-check (`chooseMove`, `now: () => 0`, `maxDepth: k`; nodes to complete depth k; a count, not a reading)
| tree | kiwipete d7 | kiwipete d8 | position-6 d7 | position-6 d8 |
|---|---|---|---|---|
| base `ec9331e2` | 566 233 | 1 638 196 | 644 469 | 1 451 759 |
| head `c8fc3075` | 609 900 | 1 735 339 | 586 333 | 1 355 149 |
These equal the design's base and `c2` rows exactly.

## Gates at `c8fc3075`
- lint rc 0 (128 files); typecheck rc 0; build rc 0.
- `npm test` rc 0: 62 files, **2 090 / 2 090** (base 2 075 + 15 A2 rows). `last-run.json` success true, 0 failed / pending / todo. Duration 7.18 s (base 7.40 s, same session; load ~3; not a reading).
- `test-skip-integrity --skip-count 0`: `No findings.`. `lane-inventory`: 62 = 62, `No findings.`.
- Deep lanes, real-clock rows excluded by name (`real clock|REAL clock|wall clock|NFR-005`): PUZZLE_DEEP 18/18, **54/58 against a 54/58 baseline**. SEARCH_DEEP: search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29, all green. ENGINE_DEEP: engine 54 green + 6 filtered; levels 37 green + 4 filtered.
- Fences: `git diff --name-only ec9331e2` gives `NOTICE`, `README.md`, `src/evaluate.ts` and 6 `src/*.test.ts`. The diff on `LICENSE`, `package*.json`, `tools`, `data`, `src/levels.ts` and `src/status-panel.ts` is empty. The `michniewski|by-sa|chessprogramming` count is 0 in each of `NOTICE`, `src/evaluate.ts` and `README.md`. `NOTICE` has no `@`, no `/Users/` and no non-ASCII. `README.md` is 87 lines with 8 `## ` headings.

## Not run (QE's)
- G2, G5, G6 (real clock), G8, G9, G11, D/S3, N8-LANE timing, the real-clock rows. G6 is predicted MET by the counts above. It is `UNKNOWN - verify` until QE reads it.
