---
id: 20261104T135528Z-software-engineer-observation-6000a44f
kind: observation
by: software-engineer
at: 2026-11-04T13:55:28Z
verified_by: 
confidence: high (each edit read from git diff main; npm test green; deep lanes green except the mate-floor rows named)
refs:
  - se-ABC-283
  - grugops/ABC-283
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - EPIC-011
  - O1h
  - O3s
  - S1
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0069
  - ADR-0026
  - ADR-0050
  - ABC-279
  - ABC-122
  - ABC-084
  - P0
  - G1
  - F2
  - NFR-008
  - NFR-009
  - orch-2026-10-30a
  - 4c4cb03d
  - 09694a4e
  - 0d573303
  - d15752cc
  - 2b192331
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/see.test.ts
  - src/engine.capacity.test.ts
  - src/search.futility.test.ts
  - src/evaluate.taper.test.ts
  - src/quiescence.test.ts
  - src/search.null-move.test.ts
  - src/search.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:ec6ccebc4a4c987bde7ce98ab0aeab3e67357b4b56666b49c005b9a7d0e8c846
---

# se-ABC-283 migration: every row that moved, old → new. No figure was re-pinned except one clock bound. One WORK row group was re-pointed to the all-off doors with its figures unchanged. Seven source ladders and two export lists grew by the new doors. No zugzwang depth was re-pinned, and every value and behaviour row stays on the shipped path.

## Source ladders: the ABC-283 doors keep every older switch on, so each "true on" list grows

- `src/search.null-move.test.ts` QE-208-c: `nullMove` is true on the 3 search doors and the 4 engine doors.
- `src/search.futility.test.ts`:
  - the futility literal row: true on the new doors; `least` 14 → 17 and 8 → 12;
  - the node-test source row: search.ts `futileMove(` count 2 → 3. The third call is `recordHistoryCutoff` asking it again; it skips nothing.
- `src/quiescence.test.ts`: the `quiescenceEvasions` and `quietPromotions` ladders gain the new doors through `SWITCH_MODULES.bundle`.
- `src/evaluate.taper.test.ts`: the taper ladder is on in the new doors; `least` 15 → 18 and 9 → 13.
- `src/see.test.ts` (ABC-279 switch ladder):
  - `seePruning` is on in the new doors;
  - `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning` now equal the ALL-OFF door less the skip, no longer the shipped path less the skip;
  - `least` 15 → 18 and 9 → 13.
- Export lists:
  - `src/search.test.ts` A6 gains 7 (`searchWithoutHistory`, `searchWithoutSeeOrdering`, `searchWithoutBundle`, `clearHistory`, `recordHistoryCutoff`, `historyByteLength`, `historyScore`);
  - `src/engine.test.ts` A4 gains 4 doors, each with `.length` 2.

## Behaviour row adjusted (not a figure)

- `src/engine.capacity.test.ts` ABC-122 A8: the frozen clock counted ply-1 entries as iterations. Aspiration can search an iteration's root up to five times, so the clock is now frozen for `5 × 130` root passes instead of 130. Its assertions are unchanged: depth > 128, the leaf's score, deepest ply 128, and at most 128 key writes per pass.
  - On the old bound, the shipped `chooseMove` completed only 75 iterations.

## Re-pointed, figures unchanged (ADR-0050 d4 / ADR-0064 d7: a WORK row whose other side is an older door)

- `src/see.test.ts` ABC-279 A4 (a), d8 on kiwipete and position-6:
  - head `search()` → `searchWithoutBundle`, and `chooseMove` → `chooseMoveWithoutBundle`;
  - READ stays 605 117 / 839 514, 406 787 / 1 533 901, 766 275 / 1 296 788 and 87 475 / 404 930.
  - On the shipped bundle the head reads 514 521, 222 273, 703 710 and 97 096.

## Not moved, and red on the shipped path (the value rows stay; see the acceptance note)

- `src/search.futility.test.ts` A3 (b), `src/see.test.ts` A3 (b) and `src/evaluate.taper.test.ts` B2: the same-depth mate floor, `search()` d5 against the older doors. Each reads 1 violation, the KRK `6k1/R7/5K2/8/8/8/8/8 w - - 2 2` (door 29995 → shipped 652).
  - They were NOT re-pointed or loosened. They are the ADR-0064 d7 safety bar.
