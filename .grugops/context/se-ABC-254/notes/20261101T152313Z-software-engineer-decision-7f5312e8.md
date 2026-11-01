---
id: 20261101T152313Z-software-engineer-decision-7f5312e8
kind: decision
by: software-engineer
at: 2026-11-01T15:23:13Z
verified_by: 
confidence: high: bars tightened, never loosened; plant red then green; fence acceptance is the reviewer's
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
seal: sha256:3b1ac1945991192bb3be050ca4c55039c689974dfd917f53d3c9485d20104063
---

# Deviation: two call-count bars in src/gameend.nfr.test.ts tightened (outside the files the ticket names)

- **The ticket names** `src/legal.ts` (and possibly `src/moves.ts`). The new lane rows went into `src/legal.test.ts`, which is the module's test file.
- **The problem:** `npm test` was red on two `ABC-206`/`ABC-217` call-count bars, so A5 could not be met without touching that file.
  - "hasLegalMove on the start position plays EXACTLY one move": `makeMove` was called 0 times, against a bar of 1.
  - "legalCaptures on kiwipete plays only the pseudo-legal captures": 0 calls, against a bar of 8.
  - Lazy legality accepts those moves untested, and it plays a tested unflagged move on the board bytes alone.
- **The change:** both bars were TIGHTENED to 0, never loosened, and their titles and comments were updated to say so. They still catch the regression they exist for.
- **The plant:** `hasLegalMove` and `legalCaptures` rebuilt on the full filters gave both rows red (2 failed). After the restore they are green.
- **The NFR level** does not move. The bars only get stricter.
- **For review:** the Reviewer or QE should confirm that this file edit is acceptable under the fence.
