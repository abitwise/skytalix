---
id: 20261101T152313Z-software-engineer-observation-4a50887c
kind: observation
by: software-engineer
at: 2026-11-01T15:23:13Z
verified_by: 
confidence: high for what was run (counts exact, all green); G1/G4/G5/G6/G9 not run by SE: UNKNOWN - verify
refs:
  - se-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0020
  - NFR-005
  - NFR-009
  - NFR-008
  - NFR-001
  - grugops/ABC-254
  - 600d8de3
  - 09d1f675
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:abbabc89bfee0f9ae15f6b5326c1458a60c17abc8eb56eec76ea81722464fe87
---

# ABC-254 correctness: A1, A2, A3 perft, gates, plants (all run in the worktree, under the host lock)

- **A1, deep** (`ENGINE_DEEP=1`, vitest `-t ABC-254`): 8 passed. 40 rows were skipped by the `-t` filter only.
  - ABC-206's walk to depth 3 reached **285 074 nodes exactly** in 22.6 s.
  - The six perft roots at depths 4/3/4/3/3/3 reached **518 474 nodes exactly** in 36.0 s.
  - At every node: all four lazy lists `toEqual` the full lists in order, and `hasLegalMove` agrees with the full filter and with the list length.
  - `toFen`, `zobristKey` and the full state are unchanged after the calls: 0 mutations.
  - Child moves come from `fullLegalMoves`.
  - The denominators asserted > 0: in-check nodes, en-passant moves, pinned-piece rejections, and quiet promotions appended (that last one on the 285 074 walk). Raw: `raw/a1-deep.txt`.
- **A1, lane:** depth 1 runs in about 21–35 ms.
- **A2 lane rows,** each read against the full test and with presence or absence asserted:
  - a rook pinned on a file, a bishop pinned on a diagonal, and a promoting pawn pinned on a diagonal and on a rank (quiescence's list included);
  - en passant exposing the rank, plus a legal control;
  - a king into an attacked square, plus the x-ray along the checking ray;
  - in check: a slider (capture and block), a knight, a double check;
  - a castle through an attacked square.
- **A3 perft:** `PERFT_DEEP=1 vitest run src/perft.test.ts` gave **32/32 passed** (`raw/perft-deep.txt`). The G4 corpus is out-of-tree byte equality and is QE's; the SE did not run it: `UNKNOWN - verify`.
- **Plants:** each of the four below turned red and was restored byte-exact (`cmp`):
  - P1, no pins marked: 7 rows red.
  - P2, en-passant class dropped: 6 red.
  - P3, in-check path skipped: 6 red.
  - P4, diagonal rays read as rook lines: 4 red.
- **Gates at 600d8de3:**
  - `npm run lint`: clean, 131 files.
  - `typecheck`: rc 0.
  - `npm test`: **63 files, 2368 passed, 0 failed, 0 skipped**, 8.79 s.
  - `build`: rc 0.
  - `test-skip-integrity` at skip count 0: No findings.
  - `lane-inventory`: 63 collected, 63 tracked, No findings.
- **Not run by the SE:** `G1` (PUZZLE_DEEP), `G5`, `G6`, `G9` and the formal `G8` are QE's or Sec/NFR's: `UNKNOWN - verify`.
