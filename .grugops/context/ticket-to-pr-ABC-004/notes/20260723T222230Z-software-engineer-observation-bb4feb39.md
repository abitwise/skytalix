---
id: 20260723T222230Z-software-engineer-observation-bb4feb39
kind: observation
by: software-engineer
at: 2026-07-23T22:22:30Z
verified_by: 
confidence: high
refs:
  - ABC-004
  - src/moves.test.ts
  - src/apply.test.ts
  - NFR-001
supersedes: 
---

Test approach and gate outcome for ABC-004 (from the implementing seat; the gate recommendation is the Orchestrator's separate note).

**Tests split by module, per the repo convention.** Generation-facing cases (castling appears/withheld, four promotions, ep onto the target, attack detection) went into `moves.test.ts`; make/unmake round-trips (castling rook + rights, ep restoring both pawns, promotion restoring the pawn) into `apply.test.ts`. Each block is headed "ABC-004 acceptance" so a reviewer can map it to the ticket's Given/When/Then table. All nine acceptance criteria are covered by an explicit hand-built FEN with an exact expected outcome.

**The ABC-003 make/unmake property test now proves the combinations for free.** Because Kiwipete and position-4 carry castling rights and a promotable pawn (a7), the existing round-trip-every-move property test began exercising castling and promotion make/unmake automatically the moment generation emitted them — it passed on the first run, which is the earliest strong signal the special-move undo is exact. The ticket's note ("extend ABC-003's property test to cover these move types") is satisfied structurally rather than by a second copy.

**One test correction during the run (code was right).** The attack-detection test first asserted the a1 rook attacks h1; it does not — the white king on e1 blocks the rank. Fixed the test to assert the blocked square is unreachable (a stronger blocking case), no production change. Coverage then flagged two colour-mirror gaps (black en passant, black promotion) and one diagonal-slider gap; I added black-side round-trip probes and a bishop-diagonal attack case — genuine QE value (colour asymmetry and diagonal checks are where these bugs hide), which took `src/` to 100% branch.

**Gate commands run:** `vitest run` (84 pass), `tsc --noEmit` typecheck + build (clean), `biome check` (0 errors after safe autofix reformatted the long castling-spec literals; 2 pre-existing config-migration infos, non-blocking under `lint.strict=false`). `src/` coverage 100% stmt/branch/func/line — above the 0.8 floor. NFR-001: no measurement here (that is ABC-006's perft harness); the common-path fast branch is preserved so throughput is unaffected by design.
