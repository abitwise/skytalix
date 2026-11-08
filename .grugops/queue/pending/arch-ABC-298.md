---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T18:15:29Z
subtask: arch-ABC-298
role: architect-design
ref: .grugops/context/arch-ABC-298/
branch: new grugops/arch-ABC-298 from main — worktree .claude/worktrees/arch-ABC-298
width: ABC-298's ADR, PROPOSED. Records only; nothing run. No src, test, ticket, EPIC or board.
---
# V3: the hash move before generation, node-identical
Your pick in …5a155b2c. Read ABC-298's page, ADR-0055 D3 (spread rule), ABC-254's speed reads, ADR-0076 d10 (order pattern), and main's negamax/quiescence around `legalMoves` and `entryMove`.
1. A new ADR: the form fixed in …5a155b2c (hash-move legality without the list; search it first; on no cutoff, build and order exactly as today and skip it); captures-before-quiets only if it keeps SG1 exact, else out. The identity duty in full: both recursions, `moveCountFrom`, `moves[0]`, futility's index, mate/stalemate detection when the hash move cuts before any list exists.
2. SG3: its bar and spread rule, fixed now, before any reading; timing only on a held host, sessions in one list. SG0 perft pins, SG1 exact counts, SG2. No games, and say why none are owed.
3. The order: QE's freeze of SG1's counts and the perft pins before the build, checkable by `git merge-base --is-ancestor`. Say whether a probe is worth it before the build or the build's own read is the probe.
4. Whether d6's `kingExposure` cut shares the held window as a separate arm, with its own identity and bar, or stays out. Do not bundle it into V3's identity.
5. NFR-008 line (≤ +0.10 s), deep pins moved (expect none if identical), intent, and the stop: if identity cannot be kept, V3 stops; it does not become a move-changing ticket.
6. The owner's questions in plain words with your recommendation.
Status PROPOSED: the owner accepts. If an item would move a standing bar, stop and say so. Fences: ADRs and your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
