---
id: 20261101T192954Z-software-engineer-observation-2107ec2a
kind: observation
by: software-engineer
at: 2026-11-01T19:29:54Z
verified_by: 
confidence: high: every row ran as stated at 2e04eee5; A3/G4, G1, G5, G6 not run (QE)
refs:
  - se-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0003
  - ADR-0056
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/zobrist.ts
  - src/perft.ts
  - src/perft.test.ts
  - src/legal.test.ts
supersedes: 
seal: sha256:77ed891ba553f4171905e60b8efe1ac725d0a8c0522d44193974bc8e2c910722
---

# ABC-250 correctness: A1, A2, plants, gates at 2e04eee5

- **A1 (perft and key identity).** `perft` is packed, so every count row reads the packed path.
  - `PERFT_DEEP=1 src/perft.test.ts`: **45/45** green, 4.03 s. That is the 32 prior rows (all published counts, including startpos d5, position-3 d6 and position-4 d5) plus 13 new rows.
  - The new rows compare the leaf-key XOR on the packed path (packed key delta) with the object path (`zobristKeyAfterMove`) and are equal on all six positions at perft-bench's depths (4/4/5/4/4/4). Both leaf counts equal the published counts.
  - Lane (depth 2): each packed key delta also equals a fresh `zobristKey` at every node, with 0 mismatches.
- **A2 (list equality).** At every node the decoded packed legal list equals `legalMoves` in order, and the packed captures equal `legalCaptures` in order. Each packed word equals `packMove` of its object move. Each packed make leaves the board and fields the object `makeMove` leaves, and each packed unmake restores `toFen`, the Zobrist key and the full state.
  - `ENGINE_DEEP=1`, the 285 074-position walk (perft roots plus ABC-206's terminal FENs, depth 3): green, 45.9 s, `nodes === 285_074`, mismatches 0, mutations 0. The captures and flagged denominators are both above 0.
  - Lane: the six perft roots at depth 1 (184 nodes), 55 ms.
- **Guards:** a generator run past its buffer throws a RangeError, and a perft or divide deeper than 128 plies throws. Both are lane rows.
- **Plants:** five plants all went red and each file was restored by copy (the tree hash before and after is equal):
  - promotion order: 1 red;
  - en-passant victim not restored: 7;
  - castle rook missing from the packed key: 3;
  - packed filter ignoring pins: 16;
  - halfmove clock not restored: 1.
- **A3 (G4) is QE's:** `UNKNOWN - verify`. Informal spot check only: `search(·, 4)` on the six perft roots and their 178 children is byte-equal base vs head (184 rows, sha256 d44276e1…). That is not the A3 corpus or the doors.
- **Gates at 2e04eee5** (each run under the host lock):
  - `npm test`: 63 files, 2 381 passed, 0 failed, 8.37 s (G8 ≤ 10 s).
  - Lint 0, typecheck 0, build 0.
  - Skip count 0; skip-integrity reports No findings.
  - Lane inventory: 63 = 63, No findings.
  - G9: `git diff src/levels.ts` is empty.
  - N8-LANE: the new default rows add 71 ms (A1 16 ms, A2 55 ms), ≤ 0.1 s.
- **Not run by this hop:** G1 (`PUZZLE_DEEP`), G5, G6, and the full G4. They are QE's: `UNKNOWN - verify`.
