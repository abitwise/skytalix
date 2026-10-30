---
subtask: bapm-ABC-230-fold
role: ba-pm
ticket: ABC-230
ref: .grugops/context/bapm-ABC-230-fold/
branch: new grugops/bapm-ABC-230-fold from main, own worktree
---

# BA/PM: fold ADR-0054 (PROPOSED) into ABC-230's ticket page, records only

The Architect's reading (`arch-ABC-230-reading`, ADR-0054 PROPOSED) left a BA/PM fold owed. The board row lists it:
scope 3/5, the A1 wording, the A5 cut, and rows H2/H4. Fold it so ABC-230 is build-ready the moment the owner accepts ADR-0054.

## Do
- Read ABC-230's page, ADR-0054, the arch-ABC-230-reading notes, ABC-226's records scan and EPIC-010 § The merge rule.
- Rewrite ABC-230's scope and acceptance to match ADR-0054: priorKeys; pre-root needs two earlier occurrences, the path
  needs one; no TT or door change; a bare FEN supplies no history.
- A5: value-changing, so the 10 D + 10 R smoke applies, S-1..S-4.
- Keep the ADR's status PROPOSED and say ABC-230 waits on the owner's accept. Leave Q3 (ep key) as the owner's open
  question, with the recommendation (a) keep. Re-score DoR.

## Fences
- Records only: `plans/tickets/ABC-230-*.md` and your context. No src/, tools/, data/ or ADR edits. No board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-ABC-230-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.
