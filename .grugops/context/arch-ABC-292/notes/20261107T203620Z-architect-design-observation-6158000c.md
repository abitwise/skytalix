---
id: 20261107T203620Z-architect-design-observation-6158000c
kind: observation
by: architect-design
at: 2026-11-07T20:36:20Z
verified_by: 
confidence: high on the memo, the fixtures' arithmetic and the odds, each read from source or a named table; medium on the Elo price, an arithmetic on two reads; the lane figures are estimates, UNKNOWN - verify; nothing was run
refs:
  - arch-ABC-292
  - ABC-292
  - ABC-306
  - ABC-291
  - ABC-290
  - ABC-293
  - ABC-289
  - ABC-282
  - ABC-303
  - ABC-083
  - EPIC-011
  - ADR-0076
  - ADR-0075
  - ADR-0056
  - ADR-0067
  - ADR-0071
  - ADR-0064
  - ADR-0031
  - ADR-0028
  - ADR-0034
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G1
  - G2
  - G3
  - G6
  - C2-prime
  - S-prime
  - K0
  - K1
  - K2
  - K3
  - K4
  - K5
  - K7
  - F2
  - FL
  - b1227f2b
  - 70d931ab
  - 780d9021
  - arch-ABC-291-closed/20261107T200924Z-architect-design-decision-8cc32a89
  - arch-ABC-291-closed/20261107T200924Z-architect-design-observation-ad069f2f
  - arch-ABC-291-n8/20261106T224309Z-architect-design-decision-61a939d3
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
  - arch-owner-answers-1105/20261105T075329Z-architect-design-decision-ba8265e9
  - orch-2026-10-30a/20261107T201037Z-orchestrator-decision-aab9afd1
  - orch-2026-10-30a/20261106T225634Z-orchestrator-decision-6e0445ef
  - orch-2026-10-30a/20261106T211205Z-orchestrator-decision-32c023cc
  - orch-2026-10-30a/20261105T113540Z-orchestrator-decision-c1623ae7
  - qe-ABC-291/20261106T225544Z-qe-e2e-observation-2f762abf
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - se-ABC-291/20261106T201944Z-software-engineer-observation-cb124720
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
supersedes: 
seal: sha256:9688912c60076e8f72cf1f6e911886299e21509acea406011511d973f62f5c24
---

# arch-ABC-292 readings: a hit can keep seven reads, the term's per-call cost is small in a node, two `ABC-083` rows cannot hold as written on any exact build, and the deep pins are named. Nothing was run

Architect/Design, task `arch-ABC-292`, on `main` `b1227f2b`, `src/` tree `bba42fb7`. No test, build, engine, probe or game ran. Everything below is reading or arithmetic on source and records. `QE`'s figures are quoted. Anything that needs a run is marked.

## The memo, by reading `src/evaluate.ts`
- Seven arrays, 36 bytes a slot, 589 824 bytes. A hit reads seven words: two masks, `doubled`, `isolated`, `passed`, two passer words.
- `doubled`, `isolated` and `passed` are only ever summed on a hit.
- `pawnStructure` computes `whiteFiles` and `blackFiles` and drops them.
- So one new file word plus `ADR-0075` d5's fold leaves 36 bytes a slot and seven reads on a hit. `pawnCacheDoubledIsolated` stands in that form on `grugops/ABC-291`.
- `kingExposure` scans six ranks on up to three files, per king: up to 36 board reads a call. `own` and `enemy` there are the same sets `pawnStructure` builds, over the same ranks. That is the named cut. Its cost share is `UNKNOWN - verify`.

## `G2` in Elo, by arithmetic
- About 315 ns a call (`…024bbd63`, `ADR-0075`'s probe). 0.887 to 0.938 calls a node (`ADR-0031`).
- A node is 1 476 to 1 626 ns: `…024bbd63` K5's base nodes in 4 s.
- So the call is 17 to 19 % of a node. +5 % a call is about +1 % a node, about 0.7 to 1.4 Elo at `ADR-0055`'s 50–100 a doubling. `nsnode` on `ABC-291`: 1.0021 and 1.0089 beside a per-call 1.0267.
- Session spread: |r₁ − r₂| 0.03555 on K4. The same code read near 316 ns and near 329 ns. So one session's level moves R by about ± 0.018.

## Two rows no exact build holds as written
Hand arithmetic on `src/evaluate-params.ts`, `UNKNOWN - verify` until PR11.
- `src/evaluate.king-mobility.test.ts` A4 first row: `MOBILE_WHITE`, `6kr/6pp/8/8/3R4/8/6PP/6K1 w`. White's rook is on an open d-file, and black's is on the h-file with its own h7. The row asserts `evaluateWithoutMobility(position)` is 0. With the term on in that door it reads 20. The ± 100 bound row reads a difference and does not move.
- The same file's A3 (b): `F_CLOSED_F5_24` against `F_HALF_OPEN_E5_24`. White's rook stands on f1. The a-file rooks cancel. Margin on `main`, E5 less F5: +6 table, −10 isolated, −10 half-open, +12 mobility (f1 rook 6 against 3 squares) = −2. With any semi-open value of 2 or more the row turns red. The twin row stays green. The row's comment says "only the file differs", and the term makes the file pay twice.
- **Order, disclosed:** d3's rule came first. I read these fixtures after, and they changed no value. They could not have: any value of 2 or more does the same.

## The deep pins, by reading
- `src/uci-session.test.ts` `D8`, `D7`, `D6` at lines 2740 to 2742: six rows, the session has no door.
- `src/engine.test.ts` `ABC-282` A0-1 (6), A0-2 (4): re-points.
- `src/search.bundle.test.ts` `ABC-303` depth-8 counts (2): re-points.
- `src/uci-session.test.ts` D5 at cp 475, a default-lane real-engine row, with `ABC-282` A2 (a): a position with bishops and rooks. `ABC-291` did not move it. This term may.
- `ABC-291`'s `…cb124720` is the class list. None of its counts carry.

## What `ABC-291` cost in source and lane
`git diff 780d9021 70d931ab`: added bytes `src/evaluate.ts` 8 518, `src/search.ts` 2 350, `src/engine.ts` 1 665, `src/evaluate-params.ts` 818, `src/quiescence.ts` 496; removed 2 973. Net about 11 KiB. `…2f762abf`'s split: rows +0.018 s, load +0.01 to +0.06 s, unresolved at least +0.05 s. `R-N8H-3`: about 0.058 s of wall a file. K1's rows sat in an existing file there.

## Odds, arithmetic on `ADR-0056`'s C2′ table
- At least one of three passes: 87.5 % at 0, 71 % at −10, 96 % at +10. Of two: 75 % at 0. Of four: 94 % at 0.
- Exactly one of three: 37.5 % at 0, 44 % at −10, 23 % at +10, 10.5 % at +20.
- One read's weight: a pass 1.32 to 1 at +10, 1.58 to 1 at +20, against 0. A miss 2.4 to 1 away from +20.
- All assume the terms share one value, and they ignore S′ and the Levels lane, so they are upper bounds.

## Checks
- `ADR-0076` was free on every local ref. No record names it.
- `ADR-0064` B6 reads ≤ 1.05 × and E1 read 1.0373. Those are the words d6 cites.
- `zugzwang.001`'s FEN was not opened.
