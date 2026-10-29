---
subtask: bapm-epic009-tournament
role: ba-pm
ref: .grugops/context/bapm-epic009-tournament/
input: .grugops/context/ideas-2026-10-29/input/owner-ideas.md (§ A)
branch: new grugops/bapm-epic009-tournament from main, worktree ../wt-bapm-epic009-tournament
ids: EPIC-009; tickets ABC-218..ABC-224 reserved for this epic (ABC-225+ held for the later improvements epic)
---

# EPIC-009: a "tournament" difficulty for 40/15 play (owner's idea), cut to an MVP of ready tickets

**The owner's idea** (`input/owner-ideas.md` § A): a new difficulty that allows the 40/15 tournament time control
(https://computerchess.org.uk/4040/index.html). His basic solution is 22.5 s per move; today level 7 allows 30 s per
move. The name could be "tournament" or "40-15". § B item 4 (UNVERIFIED) proposes real clock management (UCI
wtime/btime/movestogo, a safety margin, a hard stop) instead.

## Do
- Write `plans/epics/EPIC-009-….md` in the house shape of EPIC-007 and EPIC-008. Cover:
  - the problem and who plays it (a human in the CLI? a GUI or a CCRL-style match over UCI?);
  - the measurable outcome; scope and out-of-scope; risks; open questions for the owner.
- **Frame the options; don't pick for the owner where it is his call.**
  - (a) A fixed 22.5 s/move level: the simplest. It cannot lose on time only if the engine always answers within
    budget.
  - (b) Clock-based allocation over UCI (40 moves / 15 min, repeating).
  - (c) Both: (a) for the CLI, (b) for UCI.
  - Give the trade-offs: forfeit risk, use of the clock, testability, the human-facing levels unchanged.
  - Name the naming question ("tournament" or "40-15").
  - Say what 40/15 means here: 40 moves in 15 min, repeating. Mark anything about CCRL's own rules you can't confirm
    (for example, hardware time adjustment or pondering) as **UNKNOWN - verify**. You have no web access.
- **The facts about today's time handling come from System Analyst `sa-ideas-verify`.** That task runs in parallel
  with this one. If its time-behaviour note is in `.grugops/context/sa-ideas-verify/notes/` when you need it, cite it.
  If not, read the code yourself (`src/levels.ts`, the UCI session and the engine) and mark your reading as yours.
- Cut the MVP into tickets `ABC-218…`, each sized XS–L (no XL; split instead). Give each Given/When/Then acceptance,
  security/NFR triggers, test notes, and a Definition of Ready score per `agent-factory/checklists/definition-of-ready.md`.
  - A ticket that waits on an owner answer stays in Backlog, with the question named.
  - Include how strength or time use is shown, if at all. Respect EPIC-008's lessons: R vs D, and the heat on this
    host (Orchestrator `…ef6ab697`).
- The board stays the Orchestrator's job. List the board lines you want in your decision note.

## Fences
- Records only: `plans/epics/`, `plans/tickets/`, your context folder. No `src/` or `tools/` edits. No board edits.
  Never push, force, amend or rebase. Never merge into main. No host paths or usernames in records.

## Publish
- Seal notes (task `bapm-epic009-tournament`) with `at` from `date -u`: the epic decision, the owner questions, and
  the ticket list with sizes, priorities and DoR. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
