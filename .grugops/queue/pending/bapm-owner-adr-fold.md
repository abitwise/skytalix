---
subtask: bapm-owner-adr-fold
role: ba-pm
ref: .grugops/context/bapm-owner-adr-fold/
branch: new grugops/bapm-owner-adr-fold from main, own worktree
---

# BA/PM: fold the owner's 2026-10-30 answers into the epics and tickets

Source of truth: the owner-decision note `orch-2026-10-29g/…3dd61448`. In parallel, an Architect hop
(`arch-adr-accept-0052-0053-0054`) is editing the ADR files. Don't touch them; cite them as ACCEPTED per the note.

## Do
- EPIC-009, ABC-220 and ABC-222: the simple-tournament time is 22 s with a 22 s ceiling (was T 22.0 s under a 22.5 s ceiling).
  Whole seconds. Fix titles, acceptance rows and arithmetic (ABC-222's "longest move ≤ 22.5 s" → ≤ 22 s; check the
  clock-use and margin rows still hold at 40 × 22 s = 880 s of 900 s). ABC-221/223 are unchanged.
- ABC-220: DoR → 10/10 once ADR-0052 is accepted, and say so.
- ABC-228/229: ADR-0053 accepted. Record OQ-228-1 (build fully; the owner's "3s to 4s" clause is pending clarification and
  applies only on a G6 miss after the re-forecast). Re-score DoR.
- ABC-230: ADR-0054 accepted → DoR 10/10.
- EPIC-010: Q1 Syzygy is **deferred** by the owner (out of EPIC-010). Q3 is still open.

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-owner-adr-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.
