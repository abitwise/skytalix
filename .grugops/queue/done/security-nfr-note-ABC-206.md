---
subtask: security-nfr-note-ABC-206
role: security-nfr
ticket: plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
ref: .grugops/context/security-nfr-note-ABC-206/
branch: new grugops/security-nfr-note-ABC-206 from grugops/qe-ABC-206 (918f308a), worktree ../wt-security-nfr-note-ABC-206
width: 1 of 3 (only hop; records only, no timing)
---

# Security/NFR dated NFR-001 note at the ABC-206 merge

## Do
- The page (§ NFR-001 lines; "Security: no limb") names one dated note in `plans/nfr-catalog.md`: the search leaf no longer calls `gameStatus`, so NFR-001's row text "which every search leaf … calls" goes stale. Write that dated note; no bound moves (if one would, STOP → Orchestrator).
- Read QE `qe-ABC-206/…809cd42a` (perft counts equal, 5.05 M n/s) and Orchestrator `qe-ABC-206/…cb10c36c`. Confirm "no limb" in one line; no other review.

## Fences
- Only your worktree and `<scratchpad>/sec206/`. No `src/` edits, no test lanes, no timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: no hostnames, IPs, or personal paths.

## Publish
- Commit on your branch. Seal notes (task security-nfr-note-ABC-206). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**PASS** (Security/NFR, 2026-10-24, on `grugops/security-nfr-note-ABC-206` @ `16aeae3b`, from the QE tip `918f308a`). This was a records hop. Nothing was run or timed, no test lane was run, and no `src/` edit was made.

- **Required fixes: none. Accepted risks: none.**
- **`NFR-001` dated note: PLACED** in `plans/nfr-catalog.md`, in the `NFR-001` row's `Applies to` cell.
  - "every search leaf and" is struck and kept.
  - The note says:
    - the leaf now calls `leafEndReason` (in `src/gameend.ts`, via `hasLegalMove`, with no Zobrist read);
    - `gameStatus`'s contract and body are unchanged, so its three bars stand and stay pinned in `src/gameend.nfr.test.ts`;
    - its production callers are now `history.ts` and `levels.ts`;
    - the Target's "at a search leaf" is 2026-07-31 history;
    - the new spied leaf rows are test guards, not catalog bounds;
    - the perft half is untouched (QE `…809cd42a`: counts equal, 5.05 M n/s).
  - One `_Updated:_` line heads the file.
- **No bound moved, so the STOP did not fire.**
  - `NFR-001`'s ID, Category, Target and Verified by cells are byte-identical, and so are `NFR-002`–`NFR-012`. Each line was hashed before and after.
- **Security: no limb.** The change touches 5 pure-computation modules and 3 test files. Nothing in I/O, parsing, the CLI/UCI surface or dependencies changed, and nothing outside `src/` changed.
- **`SEC-206-a` INFO. Owner: the Orchestrator.** The describe title at `src/gameend.nfr.test.ts:68` ("gameStatus stays cheap at a search leaf") is stale in the same way as QE-206-e. It can ride the same Backlog follow-up.
- **Notes** (`.grugops/context/security-nfr-note-ABC-206/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend`, read back as 2, index rendered):
  - `20261024T140655Z-security-nfr-observation-d1f0c910` (readings, hashes, no limb)
  - `20261024T140655Z-security-nfr-decision-322a594a` (the result)
- **Not touched:** `src/`, the tests, ADRs, the ticket page, `plans/board.md`, `plans/traceability.md` (the row below is the Orchestrator's), and the sibling branches. No column moved, and nothing was pushed or merged. Scratch: `<scratchpad>/sec206/`.

### Trace row (10 cells, header order)

| ABC-206 (security-nfr-note) | Security/NFR at the merge: NFR-001 dated note placed in the Applies to cell ("every search leaf and" struck and kept; the leaf calls leafEndReason, gameStatus unchanged) | EPIC-008 | faster search, identical answers | NFR-001: no bound moved (ID, Category, Target, Verified by and NFR-002–NFR-012 byte-identical, hashed); three gameStatus bars still pinned (gameend.nfr.test.ts :71/:91/:107); perft half untouched (QE …809cd42a 5.05 M n/s); security no limb; SEC-206-a INFO (Orchestrator) | `grugops/security-nfr-note-ABC-206` @ `16aeae3b` (records only, from `918f308a`)<br>`.grugops/context/security-nfr-note-ABC-206/notes/` (…d1f0c910, …322a594a) | source read: git diff 872b03c1..918f308a (gameStatus callers, gameend.ts body, nfr test assertions); row and cell hashes before and after; nothing run or timed | signed by QE PASS_WITH_GAPS …809cd42a under …5aaf7cec item 2 | — | PASS (no required fix, no accepted risk); merge on green per …cb10c36c; In Security/NFR → Ready for UAT is the Orchestrator's |
