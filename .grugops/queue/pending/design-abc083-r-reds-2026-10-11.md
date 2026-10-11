---
task: design-abc083-r-reds-2026-10-11
subtask: design-abc083-r-reds-2026-10-11
role: architect-design
workflow: agent-factory/workflows/14-ui-design-to-build.md (n/a). This is a design ruling: publish per Workflow 16.
ticket: plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
ref: .grugops/context/design-abc083-r-reds-2026-10-11/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/design-abc083-r-reds
base: grugops/wave-2026-09-25 @ HEAD
---

# Subtask: rule on ABC-083's two class R reds under ADR-0028 d4, before any re-tune

ABC-083 is `Blocked` (BLOCKED_NEEDS_FIX). Its A10 failed on two class R levels, both from **mobility**.
Both reds are past the 1.5x headroom, so per `ADR-0028` d4 the ruling is yours:
- row 15, ABC-080 A3: 43.56 % against ≤ 40.5 %;
- row 14, ABC-079 A5: 28.46x against ≤ 26x.

King safety alone passes both R rows.

## Read first
- `ADR-0028`, `ADR-0031` (accepted: mobility is cut and king safety ships alone), and `ADR-0034` (accepted: puzzle-red classing).
- The ABC-083 ticket page, and the build notes on branch `grugops/ABC-083-king-safety-mobility`
  (tip `fa81b948`) under `.grugops/context/ticket-to-pr-ABC-083/notes/`. Start with the stop note
  `…e3f81b07`, the re-pin ledger `…4a6d2c88` and the term-shape note `…c7a1e4d2`.
- Handoff #5 is `.grugops/context/wave-2026-09-25/notes/…handoff-5-e41d7a20.md`, § Board at stop. It
  suggests splitting king safety from mobility.

## Rule on these
1. For each R row: is it a fixture or level that the new term legitimately moves (re-pin, with a reason), or a real regression (refuse)? Apply ADR-0028 d4 as written.
2. Does `ADR-0031`'s cut (king safety ships alone, mobility goes back to Backlog) fire here? If so, say what exactly ships and what BA/PM must re-cut.
3. What follows for the other two open items? Do not resolve them, only route them: PUZZLE_DEEP 53/58 (seed 5061) goes to QE classing under ADR-0034, and N8-LANE +1.08 s CPU goes to Security/NFR.
4. The branch base `489c549e` is stale. State whether the ruling depends on a rebase.

## Fences
- **Do not take new timing or CPU measurements.** Two other agents are loading this machine right now, so any reading is inadmissible. Rule on the recorded readings. If a ruling truly needs a fresh reading, name the reading and stop.
- Do not touch `src/`, `plans/board.md` or `AGENTS.md`. Do not re-tune anything. Do not merge or push.
- If an ADR is needed, write it PROPOSED. Acceptance is the owner's.

## Publish
Publish typed notes per Workflow 16 into `ref:`: a `decision` for each ruling and `finding`/`observation` for anything else. Write any ADR under `memory-bank/50-decisions/`. Claim per Workflow 17, then mark the subtask done.
