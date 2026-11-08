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

## Result

**2026-11-08, Architect/Design. Records only, on `grugops/arch-ABC-298` from `main` `36baff11` (`src/` tree `bba42fb7`). `ADR-0077` PROPOSED (`memory-bank/50-decisions/ADR-0077-v3-at-full-width-nodes-of-remaining-depth-1-and-2-…`). Notes `…cc298539` (observation) and `…fbca95f8` (decision), sealed. No test, build, engine, probe or game run. No `src/`, ticket, EPIC or board edit. Nothing pushed or merged. No bar moved.**

- **The form, narrowed by one gate.** At full-width nodes below the root, at **remaining depth 1 and 2 only**, the hash move is checked for legality without the list and searched first. If it does not cut off, today's list and order follow, and the loop starts after the hash move.
  - **Why the gate:** today the sort runs before the hash move's subtree. From depth 3, that subtree writes the history and countermove cells the sort reads. So `…5a155b2c`'s form is node-identical only at 1–2 (`…cc298539`).
  - **The check:** the generator's own per-piece helpers for one square, then a single-move make/test/unmake. Its oracle is `entryMove(slot, legalMoves(position))`, field for field, within `ADR-0003` (1-A).
  - Captures before quiets is out. No switch, no door.
- **Identity duty:** 15 items in d3. They cover both recursions, `moveCountFrom`, `moves[0]`, futility's index, mate and stalemate before any list, the live read of word 2, the capacity mocks, and the clock.
- **SG3, fixed before any reading.**
  - S2 under `ADR-0055` D3-V2, unchanged: 5 % spread, one re-run then VOID, agreement guard at 1.03 and 1.00.
  - **≥ 1.03 on two of kiwipete, position-6 and start, and ≥ 1.00 on the third,** on a held host.
  - **The other rows:** SG0 perft pins; SG1 exact (frozen counts, `ABC-254` A3's `G4` form, no figure changed); SG2 oracle units and walks.
  - **No games:** `EPIC-011` says value-identical tickets keep S2 and play no games.
- **The order:**
  1. the owner;
  2. the records;
  3. **a count probe**, untimed, which STOPs if C ÷ G < 0.048 on two of three boards;
  4. **QE's freeze;**
  5. the Orchestrator's `git merge-base --is-ancestor` check;
  6. the build;
  7. QE.
- **`kingExposure`:** stays out. It is not ready, uses another instrument, and must never sit on V3's head.
- **`NFR-008`:** ≤ +0.10 s stands. No deep pin moves.
- **The stop:** if identity cannot hold, V3 stops as "none".
- **Owner:** 1, accept `ADR-0077`: yes. 2, a stop or a miss ends V3: yes.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exit 0 at `c4636c29`, before this last commit.
