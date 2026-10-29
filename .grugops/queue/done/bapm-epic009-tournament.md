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

## Result (ba-pm, 2026-10-29T20:03Z): **EPIC-009 cut (proposed, P2, M). Today's `Skill Level` 7 already spends ~22.5 s a move under a UCI 40/15 clock; options (o)/(a)/(b)/(c), the name and the measures go to the owner (Q1–Q8). `ABC-218` (a reading, no code) is `Ready`; `ABC-219`–`ABC-222` wait in `Backlog`.**

Claimed at 19:50:30Z. Records only, on `grugops/bapm-epic009-tournament` in `../wt-bapm-epic009-tournament`, cut from
`main` `51c85f49`. It has one commit, **`88d2ebe4`**, which is not merged and not pushed. Three notes were sealed with
grugops 2.2.0 `context-io.js` `admitAndAppend` (context root: the worktree's) and read back 3/3:
- `20261029T200156Z-ba-pm-decision-371570e0`: the epic decision, the options and the board lines;
- `20261029T200156Z-ba-pm-observation-4d365276`: owner questions Q1–Q8;
- `20261029T200156Z-ba-pm-decision-77ab69c0`: the ticket list with sizes, priorities and DoR.

**Time facts.** The SA's note `sa-ideas-verify` `…1ccf0010` landed during this hop (on `grugops/sa-ideas-verify` @
`c28054cc`, not merged). BA/PM read the code first, and the two readings agree. The page cites the SA's note.
- Under a 40/15 clock with `movestogo`, `G` = 900 000 / 40 = 22 500 ms. The 30 s cap at `Skill Level` 7 does not bind
  (SA P1: 22 500 ms).
- At the default `Skill Level` 5, about 13 % of each period is used.
- The 40th move of a period gets `t − 50 ms`.
- The CLI has no clock.
- The owner's "basic solution" therefore mostly exists over UCI already. Over UCI, a fixed 22.5 s misses M1 by
  arithmetic, and 22.0 s leaves ~20 s.

**Options (Q2, framed and not picked):**
- (o) nothing new; default without an answer;
- (a) a fixed-T named level at the CLI and UCI;
- (b) a named UCI clock mode with a margin and a hard stop;
- (c) both, with (a) in the CLI only.

BA/PM's reading: `ABC-218` first; then (c) if he plays the pace in the CLI, else (b).

**Owner questions:**
- Q1: who plays it;
- Q2: which option;
- Q3: "tournament" or "40-15";
- Q4: T and its ceiling, 22.5/24.5 s or 22.0/24.0 s;
- Q5: the mode's ceiling, keep 32 s;
- Q6: a strength reading, default none;
- Q7: think time in the CLI, default no;
- Q8: accept the measures M1–M4.

**Tickets:**

| id | title | size | prio | DoR | column |
|---|---|---|---|---|---|
| ABC-218 | Reading: today's `Skill Level` 7 under a 40/15 clock over UCI, clock use and closest call | S | P2 | 10/10 | Ready |
| ABC-219 | A named tournament level in the CLI, fixed T a move | M | P2 | 8/10 | Backlog (Q2 a/c, Q3, Q4) |
| ABC-220 | The same level over UCI | S | P2 | 8/10 | Backlog (Q2 = a, Q3, Q4) |
| ABC-221 | A named UCI clock mode: real clock, margin, hard stop | M | P2 | 9/10 | Backlog (Q2 b/c, Q3, Q5) |
| ABC-222 | Acceptance reading at 40/15: 0 losses on time, ≥ 75 % clock use | S | P2 | 9/10 | Backlog (after 220 or 221) |

`ABC-223` and `ABC-224` are unused and go back to the pool.

**Not touched:** `src/`, `tools/`, `plans/board.md` and `plans/traceability.md`. No test, game or timing ran.

**For the Orchestrator:**
- Merge `88d2ebe4`.
- Place the board lines from `…371570e0`.
- Append the trace row below.
- Put Q1–Q8 to the owner.
- Schedule `ABC-218` ALONE when the board is idle: ~2.5–4 h plus ~1 h QE, estimated.
- Merge order with `grugops/sa-ideas-verify` does not matter. The page cites that branch's note by id.

### Trace row (10 cells, header order)

| EPIC-009 cut (bapm-epic009-tournament) | EPIC-009 proposed: a named 40/15 setting that uses the clock and never loses on time. Today Skill Level 7 already spends ~22.5 s/move under a UCI 40/15 clock (SA …1ccf0010 P1), with a 50 ms margin at a period's 40th move; the CLI has no clock. Options (o)/(a)/(b)/(c), the name and M1–M4 to the owner (Q1–Q8); MVP ABC-218 (Ready) + ABC-219..222 (Backlog) | EPIC-009 | — | NFR-004 (new ceilings are the owner's: 24.5/24.0 s level, 32 s mode kept), NFR-009, NFR-008, ADR-0044 D5, ADR-0045; RISK-EPIC009-01..06; notes …371570e0, …4d365276, …77ab69c0 | grugops/bapm-epic009-tournament @ 88d2ebe4 (records only)<br>plans/epics/EPIC-009-…md; plans/tickets/ABC-218..ABC-222 | — (records only) | n/a (records) | not released | EPIC-009: Backlog (proposed); ABC-218 Ready; ABC-219..222 Backlog; card moves the Orchestrator's |
