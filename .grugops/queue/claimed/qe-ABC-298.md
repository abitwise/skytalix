---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T23:11:08Z
subtask: qe-ABC-298
role: qe-e2e
ref: .grugops/context/qe-ABC-298/
branch: new grugops/qe-ABC-298 from grugops/ABC-298 (b40a2d7e) — worktree .claude/worktrees/qe-ABC-298
width: ADR-0077 d9 step 7, in two stages. Stage A now, untimed. Stage B (timing) only on a later brief line from me. No games, no merge.
---
# ABC-298: QE's verdict
Read ADR-0077 whole with its dated lines (incl. arch-ABC-298-stop …251b60bb), ABC-298's page, your freeze …44a6717d / …1ba0ac40, se-ABC-298's notes (…db1b4b5c, …0c57c9f0, …e57979e2, …44c46e34), my note at 2026-11-08T23:11:08Z under orch-2026-10-30a.
**Stage A, now, untimed:**
1. Stage 0: the build's first code commit descends from b9b8eee9; the freeze's hashes re-read equal; src/ base bba42fb7.
2. SG0, SG1 (a)–(c), SG2 against your frozen figures; at SG1 (c) admit exactly the 4 removed lines of 400c1b9e and nothing else. Re-run what you need to trust it; G4 may be re-run or read from the Engineer's raw files at your judgement, saying which.
3. Gates: typecheck, lint, default lane whole with one worker, the pin deep lanes. Read the code against d1–d3 yourself.
4. Seal the timing PREREG before any timing figure exists: SG3 under ADR-0055 D3-V2 (≥ 1.03 on two boards, ≥ 1.00 on the third; 5 % spread rule; one re-run then VOID), G6, and NFR-008 (≤ +0.10 s, H − B, one worker spelled out, never plain `npm test`), session order, FL/CF rules as ADR-0077 names them.
5. STOP and report. Do not take a held window or time anything.
Every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time, vitest with one worker. Fences: your records and test rows only if a gap needs one (say so). No src/ change, ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit after stage A; a ## Stage A block in this brief, kept in claimed/. Before each commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
