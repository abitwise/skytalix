---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T22:03:52Z
subtask: arch-ABC-298-stop
role: architect-design
ref: .grugops/context/arch-ABC-298-stop/
branch: new grugops/arch-ABC-298-stop from main — worktree .claude/worktrees/arch-ABC-298-stop
width: records only (ADRs). A ruling on se-ABC-298's STOP. Nothing run. No src, test, ticket, EPIC or board.
---
# ABC-298: the Engineer's STOP on three source-shape rows
Read se-ABC-298's notes on branch grugops/ABC-298 (tip 0123e893): …999b2535 (the stop), …db1b4b5c, …0c57c9f0; the diff `git diff 6f943726 0123e893 -- src`; the three red rows in src/search.bundle.test.ts (ABC-283 (h) source count) and src/search.null-move.test.ts (no storeEntry( before legalMoves, both files); ADR-0063/ABC-283 and ADR-0050 (or whichever ADRs those rows serve); ADR-0077 d1, d3, d6 SG1 (c), d12, F2; how ABC-303 re-pointed rows in place; my note at 2026-11-08T22:03:52Z under orch-2026-10-30a.
1. Rule: for each row, what property it protects. Is it an identity row in ADR-0077's sense (F2 / d12, which ends V3 by the owner's word), or a record of the old code shape whose property still holds on the build and which a dated ruling may re-point in place? Say what the re-pointed row must still prove, word for word, so no property is lost. If any row's property does not hold on the build, it is F2: say so.
2. The engine.ts / search.ts export question (src/search.test.ts A6 freezes the export list): is a new export allowed, or must the build stay as the Engineer left it?
3. The `list.slice(1)` per non-cutting gated node: is it within d1–d3, and does it cost SG3? If a non-allocating form is required, name it.
4. Information: the default lane read 25.97 s at one worker on the build. Is there a one-worker figure for main on record to compare? NFR-008 stays QE's read on its own instrument; no ruling needed unless the figure points to a defect.
5. ADR-0077 d8 calls ABC-299 the 400-game close read; ABC-299's page is R3, 200 games against Stockfish. Correct the wording by dated line.
If the answer is F2, say so plainly: V3 closes as "none". No bar moves. Fences: ADRs and your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
