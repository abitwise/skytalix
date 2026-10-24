---
id: 20261024T140655Z-security-nfr-observation-d1f0c910
kind: observation
by: security-nfr
at: 2026-10-24T14:06:55Z
verified_by: 
confidence: high (read at the source and diffed; hashes computed this hop; nothing timed)
refs:
  - ABC-206
  - security-nfr-note-ABC-206
  - EPIC-008
  - grugops/security-nfr-note-ABC-206
  - 918f308a
  - 872b03c1
  - NFR-001
  - plans/nfr-catalog.md
  - plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
  - qe-ABC-206/…809cd42a
  - qe-ABC-206/…cb10c36c
  - arch-design-ABC-206
  - QE-206-e
  - SEC-206-a
  - src/gameend.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:66daa33c12723b9e3d0064ed82479a38f736a412272c5960c617ea7bacce4386
---

# security-nfr-note-ABC-206 readings: the leaf no longer calls gameStatus; gameStatus unchanged; no limb

Records only, at `918f308a` (QE tip; merge `b8a30264` over `main` `872b03c1`). Nothing was run or timed. No `src/` edit.

## Read at the source (`git diff 872b03c1 918f308a`)
- **Callers of `gameStatus` in production code.** At `872b03c1`: `engine.ts`, `search.ts`, `history.ts`, `levels.ts`. At `918f308a`: `history.ts` (ABC-019's loop) and `levels.ts` (a root child with no move) only.
- **The leaf now calls `leafEndReason`** (`src/gameend.ts`), from `search.ts:298` and `engine.ts:250`. It calls `hasLegalMove`, builds no move list and reads no Zobrist key.
- **`gameStatus`'s body is unchanged.** The `src/gameend.ts` diff is one import line plus the appended `leafEndReason`.
- **The three NFR-001 bars stay pinned.** `src/gameend.nfr.test.ts` keeps its three `NFR-001` rows (:71, :91, :107). The diff only widens the mocks and adds an `ABC-206` describe block (:133). No assertion line was removed.
- **Perft half:** `generateMoves` and `legalMoves` are untouched. QE read the counts as equal at 5 049 330 nodes/s (`…809cd42a`).

## Security: no limb
The change touches 5 pure-computation modules (`engine`, `gameend`, `legal`, `quiescence`, `search`) and 3 test files. No I/O, parsing, CLI/UCI surface, dependency or file outside `src/` changed. No ASVS L1 row is engaged.

## Catalog hashes (sha256 of the line, first 12 hex)
- `NFR-001` row 2705090302d5 → 61b48ca3c8f6. Only the `Applies to` cell changed (ba60bb11d0ac → 9a7dea60720b). ID, Category, Target and Verified by: SAME.
- `NFR-002`–`NFR-012`: SAME, all 11.

## INFO, no action at this hop
- `SEC-206-a` INFO. The describe title at `src/gameend.nfr.test.ts:68` reads "gameStatus stays cheap at a search leaf", which is stale in the same way as QE-206-e (`src/gameend.ts:17`). It can ride the same Backlog follow-up. Owner: the Orchestrator, who routes that follow-up.
