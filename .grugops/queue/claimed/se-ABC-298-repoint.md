---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T22:12:36Z
subtask: se-ABC-298-repoint
role: software-engineer
ref: .grugops/context/se-ABC-298/
branch: grugops/ABC-298 (continue from 0123e893) — worktree .claude/worktrees/ABC-298
width: the re-point, the owed reads, G4. No other src change. No timing read, no games, no merge.
---
# ABC-298: re-point three source rows; finish the build's reads
Freeze: QE's …44a6717d, freeze commit b9b8eee9. Ruling: arch-ABC-298-stop …251b60bb, ADR-0077 d6's dated line (on main at 3439faa1). Bring main's records in by merging main into grugops/ABC-298 (no rebase); src/ on main is unchanged (bba42fb7).
1. One commit: exactly the re-point the dated line names (R1 in search.bundle.test.ts; R2/R3 in search.null-move.test.ts), titles unchanged, no other test line, message citing the dated line.
2. Re-read under the lock, one core, one worker: default lane whole (expect 2 782/2 782); SEARCH_DEEP search.bundle (56/56, the freeze's mate floors); SEARCH_DEEP search.null-move; typecheck, lint, build.
3. G4, SG1 (b), against the frozen digest (b65f747a… / 2e1534f0…) with qe-ABC-254's harness. A difference is F2: defect check first, inside d1–d2 only; if nothing fixes it, STOP. Never re-pin.
4. The rest of the deep lanes owed by the freeze's list; any red row comes back to the Architect, not re-pinned.
Every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one at a time. No single run over 1 h. Fences: those test lines, your records. No ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit; append a ## Result (re-point) to the done brief + trace row; move this brief to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
