---
id: 20261101T192954Z-software-engineer-decision-de63198a
kind: decision
by: software-engineer
at: 2026-11-01T19:29:54Z
verified_by: 
confidence: high: each deviation is named on the page or narrows the diff
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
seal: sha256:72c42137370b920653681adeff09bd69ee454b762cc480e385816309d04512e6
---

# ABC-250 fence and scope notes (deviations from the page's file list, each small)

- **`src/zobrist.ts` edited.** The page's § Dependencies names it: A1's leaf-key XOR needs a packed `zobristKeyAfterMove`. Only an added function and imports changed; `zobristKeyAfterMove` is byte-unchanged. `ABC-253` rebases on this.
- **`src/perft-bench.ts` NOT edited.** It calls `perft`, which now runs packed, so the A4 reading of head-packed against base-object is the same harness on both builds.
- **Tests went into existing files** (`src/perft.test.ts`, `src/legal.test.ts`). No new test file, so the lane inventory stays 63 = 63.
- **Packed forms limited to what perft and A2 read:** `legalMovesPacked` and `legalCapturesPacked`. A packed `hasLegalMove` / `legalCapturesAndQueenPromotions` / `givesCheck` is `ABC-251`'s, when the search moves.
- **Shared pin scratch:** the packed filter reuses ABC-254's `pinStamp` epoch. No filter calls another filter inside its loop, which is the condition ADR-0003 (1-A) sets on a shared scratch.
- **No board edits, no push, no merge.**
