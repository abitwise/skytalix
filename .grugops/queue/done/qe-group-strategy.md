---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-09T21:38:06Z
subtask: qe-group-strategy
role: qe-e2e
ref: .grugops/context/qe-group-strategy/
branch: new grugops/qe-group-strategy from main
width: records only, one strategy note. Nothing run, no test, build, timing or game.
---
# A test strategy for re-testing the dropped work in groups
Read my note at 2026-11-09T21:37:44Z (orch-2026-10-30a), which lists the groups and the owner's words. Then read the instruments already on record: C2′ (self-play vs main, 100 games), S2 under ADR-0055 D3-V2 (nps), R1/R2 (ABC-273, ABC-295: 200 games vs Stockfish), NFR-008, the deep lanes, and the dropped tickets' pages for each group.

Write one sealed decision note: the strategy. For each group A–H it gives:
1. **How the group branch is formed.** Code exists on kept branches that are 42 to 2 378 commits behind main. Say when a merge is tried and when a re-port from the ticket page is expected. Name the branches: grugops/ABC-207, 209, 210, 238, 239, 239b, 250, 264, 264-fix, 289, 291, 298, 301, and origin/grugops/arch-rule-ABC-205-g6.
2. **The untimed gates first:** perft, node identity where the group claims it, the default lane with one worker, deep lanes and mate floors.
3. **The graded read, with its instrument, bar and game count.** These must fit the owner's rules: no SPRT, 100 games per change (a group counts as one change), 400 for the whole program, one core under the host lock, a held host for timing and games, and anything over 1 h asked of the owner first.
4. **An estimated wall time.** Each hold must stay under 1 h where possible. Give a total for the program.
5. **What happens on a miss.** A miss is never re-played. Say whether one cheap untimed diagnostic may name a single member to drop, and whether one re-read without that member is allowed (it must be pre-registered).
6. **The order across groups,** and what each later group is measured against (main, or main plus the groups that passed). The closing read is one R-shaped 200-game read vs Stockfish, against R2's 1 902.5 ± 49.1.

**Fix these four too:**
- Group E's tuning: its cost, and whether it fits the time budget at all.
- Group G's read: Threads N vs 1, on what hardware claim.
- Group H: ordinary tests, no games.
- Groups I and J: say what is excluded and why.

Keep it short and concrete: a table per group plus a few rules. Mark every estimate as an estimate. Never run anything.
Publish the sealed note (contextRoot = your worktree's .grugops/context; `at` from `date -u` run immediately before writing). Commit after running `node tools/grugops/records-path-check.js --base main`. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
