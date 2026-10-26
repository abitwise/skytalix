---
id: 20261026T030739Z-software-engineer-observation-83c40265
kind: observation
by: software-engineer
at: 2026-10-26T03:07:39Z
verified_by: 
confidence: high: deterministic counts and gates as run at afb6b32f; G6, A1 out of tree and every real-clock reading are UNKNOWN - verify until QE reads them
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0020
  - ADR-0034
  - NFR-004
  - NFR-005
  - NFR-008
  - G1
  - G6
  - A1
  - A2
  - A3
  - A4
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - bapm-amend-ABC-208/20261026T023835Z-ba-pm-decision-e8505f19
  - grugops/ABC-208
  - 2e7899fc
  - afb6b32f
supersedes: 
seal: sha256:a2907c60be8343486f1391e34dc039c99e1bffc31fe66f8c9c4888adc9599569
---

# Software Engineer: ABC-208 evidence. Red-first 30/128 at base; 18 default-lane and 5 deep plants each red their named rows with the ADR's figures; frozen-clock d7/d8/d9 equal the ruling's; A2 7/7; A3 100 %/25 cp, 100 %/8 cp, mate floor 0 of 189; gates green. No real-clock timing

Task `ticket-to-pr-ABC-208`, branch `grugops/ABC-208`, code `afb6b32f`. Plants and probes ran on a scratch copy of the
worktree under `<scratchpad>/se208/`, never in `src/` of the worktree. Plain node v26.11.1 for the probes. Every count
here is deterministic. No real-clock search, no `G6`, no game, no D.

## Red-first (head's tests on base's four production files, scratch copy)
- 30 of 128 red in the four touched test files: 24 in `src/search.null-move.test.ts`, the 2 export lists, and 4
  re-pointed `pvs-lmr` rows (they import the new doors). Green at head: 128/128.
- The 9 new rows green on base are the ones a pre-null build passes by construction: the A2 row count/source row, the
  five cheap A2 rows (base solves them at those depths), the pawn-only row and the two PVS-on older-door rows (0 null
  moves).

## Plants (each on head, one at a time; scratch copy; restored and diffed equal after)
Default lane (`src/search.null-move.test.ts`, 33 rows): every plant is red.
- null in check → predicate "in check" row + the instrument row (2)
- double null → predicate "after a null" row (1)
- return the null score (the named blind spot) → the source row ×2 (2); deep lane 0 red, as the ADR says
- no halfmove reset → the null-move unit row (1)
- no material guard → 3 predicate rows, A2 `.001` + 4 K+P rows, instrument, pawn-only row (10)
- guard 1 (floor) → "two pieces" row, A2 `.001`, instrument (3)
- guard 2 → "two pieces" row (1); deep: A2 `.004` and `.005` (2)
- R 5 and R 2 → the four "-> 3" rows (4 each); minimum depth 3 → the threshold row (1)
- null at every finite-beta node → the source row ×2 (2)
- cut without searching → both door bites, the instrument, the in-check row (4); deep: both drift rows (2)
- sign error on the null score → the source row ×2 (2); deep: both drift rows (2)
- key without the ep file → the zobrist invariant row (1)
- each door wired on (`searchWithoutNullMove`, `searchWithoutReductions`, `chooseMoveWithoutNullMove`,
  `chooseMoveWithoutReductions`) → its own instrument row (+ the shipped bite for the two new doors)
Deep figures reproduced exactly from `ADR-0050` Consequences: cut-without-search 42.78 % within 25 cp; sign error
41.71 %; no material guard: mate floor 60 violations of 189, and A2 `.004` (plays g7f6) and `.005` lost; guard 2:
`.004` (g7f6) and `.005` (f4e2) lost, so 5/7 as the ruling says.

## Frozen-clock pre-check (Test note 4; `chooseMove`, `now: () => 0`, `maxDepth: k`; reported, not graded)
| board | base d7 | head d7 | base d8 | head d8 | head d9 |
|---|---:|---:|---:|---:|---:|
| kiwipete | 609 900 | 590 489 | 1 735 339 | 1 259 463 | 2 907 475 |
| position-6 | 586 333 | 180 941 | 1 355 149 | 355 565 | 940 109 |
All ten cells equal the ruling's table. `chooseMoveWithoutNullMove` on head reads base's four counts exactly.

## Cross-build door self-check (the Architect's `a1.mts`, base tree vs head tree; not a substitute for QE's A1)
- 222/222 door cells node-, score- and move-equal (7 search doors d1–4 on the six roots; 3 engine doors at maxDepth
  3/5/6), the new pair against base's shipped search included.
- **Discrepancy, flagged:** shipped `chooseMove` differs from base on **5/6** roots at d6, not the 6/6 that
  `…bae20026` § Doors states. The equal root is position-3 (6 154 nodes both): each side has one non-pawn piece, so
  the three-piece guard rules out every null move there. Head's kiwipete and position-6 d6 counts (309 541; 52 265)
  equal that note's R3 = `hd` row, and `src/` is unchanged since its base `93d79b2d`, so 5/6 is what the ruled design
  gives. No pin, value or bound depends on it.

## A2 and A3 (deterministic; `SEARCH_DEEP=1` for the deep ones)
- A2: 7/7 at the ruled depths: `.001` Rf1 d9, `.004` Qxh4 d11, `.005` Nxd5 d12, the four K+P rows at d8. The K+P rows
  make 0 null moves; the instrument saw no null move in check or below three pieces (> 100 null moves inspected).
- A3: `search()` vs `searchWithoutNullMove` d5: 100.00 % within 25 cp of 187, max 25 cp (position-5/e1f2);
  `chooseMove` vs `chooseMoveWithoutNullMove` d5: 100.00 %, max 8 cp (position-6/f3d4); mate flips on the 190: 0 (report);
  mate floor d5 → d5 on the 287: 0 of 189. Equal to the ruling's measured figures.

## Gates (at `afb6b32f`)
- lint, typecheck, build: exit 0. Lane inventory: 63 collected = 63 tracked, `No findings.`
- `npm test`: 63 files, **2 123 / 2 123** (base 2 090 + 33 new), exit 0. `last-run.json`: success, runState exited,
  0 failed, 0 pending, 0 todo. **Duration 7.71 s** on a quiet host (base 7.05 s on the same host this session; one
  earlier head run read 8.25 s while a plant run loaded the host). The 60 s bound has wide headroom (NFR-008).
- Skips: count 0; `test-skip-integrity.js` `No findings.`, exit 0. `.grugops/test-skips.md` read and run only.
- Deep lanes (real-clock rows filtered by name, as the Architect's probe did): `PUZZLE_DEEP` 18/18, **G1 54/58** (misses
  seeds 24, 234, 288, 580 = base's four); `SEARCH_DEEP` search 57, ordering 38, transposition 40, quiescence 37,
  pvs-lmr 29, null-move 39, all green; `ENGINE_DEEP` engine 54 green + 6 filtered, levels 37 + 4 filtered,
  transposition 26 green.
- The 12 re-pointed rows' printed readings at head equal base's own run line for line (8 lines: A5 1 099 / 1 377,
  18 079 / 23 802, 19 403 / 31 721; mate floor 0 of 180; d5 drift 97.86 % / max 63 cp in both recursions; A2 companion
  609 900 and 586 333 vs 2 191 755 and 2 575 128).
- Not run (QE's or forbidden here): A1 out of tree, `G2`, `G5`, `G6`, `G8`, `G9`, `G10`, `G11`, D, `N8-LANE` as a
  timed reading, the ladder lane, any real-clock row.
