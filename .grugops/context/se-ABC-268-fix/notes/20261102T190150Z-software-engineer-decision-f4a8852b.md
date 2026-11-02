---
id: 20261102T190150Z-software-engineer-decision-f4a8852b
kind: decision
by: software-engineer
at: 2026-11-02T19:01:50Z
verified_by: 
confidence: high: as committed in fad0fb7c; tests only, no production line, bar or older row changed
refs:
  - se-ABC-268-fix
  - ABC-268
  - ADR-0061
  - ABC-230
  - EPIC-011
  - QE-268-a
  - QE-268-b
  - QE-268-c
  - grugops/ABC-268-fix
  - grugops/qe-ABC-268
  - fad0fb7c
  - 3895297f
  - df984484
  - src/search.futility.test.ts
  - src/engine.test.ts
  - qe-ABC-268/20261102T185311Z-qe-e2e-observation-0a18c9a1
  - qe-ABC-268/20261102T185311Z-qe-e2e-observation-aa73c424
  - qe-ABC-268/20261102T185311Z-qe-e2e-decision-b58a6a29
supersedes: 
seal: sha256:f41e1307d98c751307808ad897881c0cd0ad6aa98602454ab6778c59097a3aa9
---

# se-ABC-268-fix rows: QE-268-a/b/c closed with ten default-lane rows in two test files, no production change (fad0fb7c)

Software Engineer, task `se-ABC-268-fix`, branch `grugops/ABC-268-fix` from `grugops/qe-ABC-268` `3895297f` (ABC-268 code `df984484`). Closes the three LOW gaps of `qe-ABC-268/…aa73c424`. Tests only: `src/search.ts`, `src/engine.ts` and every other production file untouched; no bar, fixture or older row moved.

- **QE-268-a** (`src/engine.test.ts`, new describe "QE-268-a — chooseMoveWithoutFutility reads prior keys, as chooseMove does", 4 rows): on each of `ABC-230` A1's four third-occurrence fixtures (`THIRD_OCCURRENCE`), the door with the game's prior keys at fixed depth 4 plays the repeating king move at exactly 0; the position is byte-identical on return; without the keys the door plays another move at a non-zero score (non-vacuity). The behaviour form, not a literal map: it reads `ADR-0061` d4's "everything else on" through what the keys do.
- **QE-268-b** (`src/search.futility.test.ts`, new describe "QE-268-b — a futile node returns the best score among the moves it searched, fail-soft", 3 rows): root `4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1`. Qxd5 is the root's first move, 1010. After Qd3 Rxd3 the node `4k3/8/8/8/8/3r4/8/4K3 w - - 0 2` stands at ply 2, depth 1, window (1010, 1011): futile (eval -556 + 150 ≤ 1010). It searches Ke2 (index 0, -554) and skips Kf1 and Kf2 (full width it scores -544). Nothing re-searches it (Black's null-window parent cuts on Rxd3; the root move fails low). After `search()` at depth 3 and after `chooseMove` deepened to 3, the node's table entry, read through the module's public `probeTable` / `tableCutoff` (no production hook), is an upper bound at depth 1 of exactly -554, strictly below 1010, and equal to the best score among the moves `futileMove` leaves (computed independently with `orderMoves` and `search(child, 0)`). A fixture row pins the non-vacuity: node futile at that window; root 1010 / d1d5; searched [e1e2], skipped [e1f1, e1f2]; full-width -544. A fail-hard `best = alphaIn` stores 1010 instead.
- **QE-268-c** (`src/search.futility.test.ts`, new describe "QE-268-c — futileMove on the other move kinds", 3 rows): fixture `k7/8/8/3pP3/8/8/P7/4K2R w K d6 0 1`; a fixtures-bite row (exd6 is `FLAG_EN_PASSANT` with a capture and an empty target square; O-O is `FLAG_CASTLE`; none of exd6, a3, Kd2, O-O checks); en passant false at index 1 and 9; a quiet pawn push (a3), a quiet king move (Kd2) and castling (O-O) false at index 0, true at 1 and 9. The pawn push and castling are the extra cells QE's gap note named; the brief named en passant and the king move.
