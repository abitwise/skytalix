---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T14:08:04Z
subtask: arch-ABC-303-load
role: architect-design
ref: .grugops/context/arch-ABC-303-load/
branch: new grugops/arch-ABC-303-load from main — worktree .claude/worktrees/arch-ABC-303-load
width: one reading of ADR-0056 D5 (CF10). No src, no test, no run.
---
# How foreign load is read during C2′ and S′
QE stopped before the first game of bundle 1: read qe-ABC-303's …b59650bc and PREREG …53858301 in .claude/worktrees/qe-ABC-303/.grugops/context/qe-ABC-303/notes/. Answer Q1 under CF10: how foreign load during a C2′ or S′ is read, on this read and any later C2′, with options (a) log and report, (b) a sealed void line, (c) an owner-held game window, or a mix.
Facts to weigh: both engines share the one core, so load falls on both, but a candidate loss on time ends the read under CF1, and an unreproducible cause under CF3 is a STOP with no new read. Today's record: five of seven graded lane reads voided by foreign load; both reads held by the owner stood first time. qe-ABC-282's A6 logged and reported. Games take about 44 minutes. A void is not a miss, and nothing may loosen a sealed rule after a result: this comes before any game.
Q2 is ruled, not yours: timing rows P6, P7, R5 run first and games after, B6 as written.
Say whether this is within ADR-0056's accepted form or moves anything the owner accepted; if it moves a bar or the fault rule itself, stop and say so. Dated insertion in ADR-0056 only.
Fences: ADRs and your records only. No ticket, EPIC, board, src or test edits. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-06, Architect/Design. One reading, of `ADR-0056` D5 under CF10. Records only, on `grugops/arch-ABC-303-load` from `main` `b716d86c`. No test, build, game or engine run. Nothing pushed or merged, no `src/`, test, ticket, EPIC or board edit, nothing left running.**

- **Q1 (`…a5dc0532`, `ADR-0056`):** foreign load changes no line of a C2′ or S′ read, and a played read is never voided for it. Option (a) is the rule, as line FL, for this read and every later C2′ the Reach line names. Option (c) is line W, a launch condition on `ABC-303`'s read only: the first game waits for the owner's word that the whole host is quiet. Option (b) is not taken: on the score it is not needed, and on a loss on time it would move C-2, CF3 and CF4.
- **Standing:** within the accepted form. No bar moves, no word of CF1–CF10 moves, and nothing the owner accepted moves. W is a host fact, and the Orchestrator may drop it by a recorded line before the first game.
- **Stated residual:** a spike that costs the candidate a game on time, with CF2 at 50.0 or more and a cause that is the host's alone or not reproduced, is CF3's STOP: no new read, no verdict, not a miss. Closing that branch in advance would move the fault rule, so it is the owner's question and is not asked here.
- **A correction to the brief:** "one core" is width 1, not a pin. The match is not pinned and the host has 24 cores. The conclusion holds.
- **`UNKNOWN - verify`:** the move-time tail at 100 ms under heavy load, and how load moves a score.
- **QE owes:** the addendum carrying FL and W word for word, sealed before the first game, with the order as ruled for Q2.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exit 0 at `d4f00dc8`, before this last commit.
