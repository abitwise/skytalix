---
id: 20261101T233711Z-software-engineer-failed-attempt-db17e44b
kind: failed-attempt
by: software-engineer
at: 2026-11-01T23:37:11Z
verified_by: 
confidence: high on the readings (deterministic, two instruments agree); UNKNOWN - verify on the cause
refs:
  - se-ABC-238
  - ABC-238
  - ADR-0058
  - ABC-081
  - EPIC-011
  - ADR-0056
  - ADR-0026
  - ADR-0025
  - ABC-229
  - ABC-249
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-238
  - 3abaefdd
  - b19af469
supersedes: 
seal: sha256:337f3f130f0d627c9c4782cfd559195205b5dd23e280e56e32b135b79a15cf07
---

# se-ABC-238 STOP on A4 / ADR-0058 falsifier F4: at fixed depth 8 the rule saves 0.6 % and 0.4 % of nodes, against a bar of 5 %

## What was tried
- The rule exactly as ADR-0058 d1 writes it: stored depth >= requested depth, bound rules unchanged. It is on in `search()` and `chooseMove`, behind the two doors.

## Readings (deterministic, plain node and the SEARCH_DEEP row agree to the node)
- `search(…, 8)` against `searchWithoutDeeperCutoffs(…, 8)`:
  - kiwipete: 1 109 987 / 1 116 785 = **0.9939x**;
  - position-6: 1 595 656 / 1 602 457 = **0.9958x**.
  - The bar is <= 0.95x on both, so it is **NOT MET on both**. Score and move are unchanged on both.
- Report only, in the engine's shape: `chooseMove` frozen to depth 8 reads kiwipete 1 510 449 / 1 575 537 = 0.9587x and position-6 475 565 / 476 244 = 0.9986x. That also misses the bar on both.

## Why (measured, not argued)
- **The firing rate at depth 6 on the 190** (ADR-0058 d9, the test-side `tableCutoff` wrap):
  - `search()` d6: 2 367 deeper cuts / 1 114 332 probes = **0.212 %** (0.90 % of hits);
  - `chooseMove` to d6: 1 541 / 876 757 = **0.176 %** (0.48 % of hits).
  - Both are under the Architect's 1-in-100 line.
- **Per board, deeper cuts in one search** (search / chooseMove; `raw/probe-counts.txt`, from a temporary row run with the local binary and then deleted):
  - kiwipete reads 0/0 at d4, 0/1 at d5, 0/1 at d6;
  - position-6 reads 0/0 at d5 and 2/1 at d6;
  - position-3 reads 4/3 at d5 and 11/16 at d6.
  - The rule is alive (the liveness row), but in the middlegame a deeper entry for the same key is rarely in the table when it is probed.
- **Reading of the cause.** This is an engineer's reading for the Architect, `UNKNOWN - verify` as a cause.
  - ADR-0058's Context assumes that the three sources produce usable deeper entries:
    - **Iterative deepening** revisits a key at the same ply one deeper than it was stored, so the entry is shallower and does not cut. A deeper hit needs the same key two or more plies later, which is a tempo-losing transposition and rare outside endgames.
    - **LMR and null move** search the reduced copy first and the full depth after, so for the same key they mostly leave entries shallower than the later probe.
  - Always-replace (T2, `ABC-237`) may also evict the few deeper entries there are. That is not measured here.

## What F4 says
- "`ABC-238` not merged; this ADR accepted, not in force". The fallback F1 names (null-window nodes only) answers F1, not F4.
- The build is complete and every other row is met, so nothing here is a defect to fix.

## Not done
- The bar was not loosened. In the A4 row, 0.95x is printed, not asserted; the row asserts only head < door. The page's verdict is recorded here.
- No replacement or other scope was tried.
- The 100-game read, the smoke and the Levels lane were not run (QE's, and they wait on the owner).
