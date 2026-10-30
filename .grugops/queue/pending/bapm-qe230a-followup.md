---
subtask: bapm-qe230a-followup
role: ba-pm
ref: .grugops/context/bapm-qe230a-followup/
branch: new grugops/bapm-qe230a-followup from main, own worktree
---

# BA/PM: cut the QE-230-a follow-up ticket; fix ABC-230's stale Q3 line

Source: `qe-ABC-230/…ba5a249a` (verdict) gap QE-230-a. On levels 1–4 the blunder path's move that makes a third
occurrence is not scored as a draw: each child search starts after the move, and no search checks its own root for
repetition. ADR-0054 and ABC-230's A1 were met; this is a design gap, not a build fault.

## Do
- Cut a ticket (next free id) in EPIC-010: the problem, the probe evidence QE recorded, testable acceptance, size, and
  priority. State whether it needs an Architect reading (it likely touches ADR-0054 decision 2's level hand-off) and
  whether it is value-changing on levels 1–4 only, which decides whether the smoke pair applies, since the smokes play level 5.
  Note the overlap with ABC-241, which edits the same blunder-root key. Backlog, DoR scored.
- ABC-230's page: its text still says Q3 is open and (c) is a separate ticket. Add a dated line: Q3 answered (c) →
  ABC-241; ABC-230 Done at 24f3e322.

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits. An SE is building ABC-228:
  don't edit its page.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`. Run nothing CPU-heavy (an
  SE timing read is in progress).

## Publish
- Seal notes (task `bapm-qe230a-followup`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/. If the worktree guard refuses the main checkout's
  queue, put the done/ move on your branch's tracked copy and say so.
