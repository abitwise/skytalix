---
subtask: arch-adr-accept-0052-0053-0054
role: architect-design
ref: .grugops/context/arch-adr-accept-0052-0053-0054/
branch: new grugops/arch-adr-accept-0052-0053-0054 from main, own worktree
---

# Architect: record the owner's acceptance of ADR-0052 (amended), ADR-0053 and ADR-0054

Source of truth: the owner-decision note `orch-2026-10-29g/…3dd61448`, which holds the owner's words verbatim.

## Do
- ADR-0052: Status → ACCEPTED 2026-10-30 by the owner, **with his amendment**. simple-tournament spends T = 22 000 ms
  under a 22 000 ms ceiling (was 22 500). Whole seconds; no sub-second budget or ceiling. Update D3, the constants, the
  examples and any arithmetic that used 22.5 s (e.g. the move-40 margin) to match. D4/D6 are unchanged. Close OQ-0052-1 by
  pointing to the note.
- ADR-0053: Status → ACCEPTED 2026-10-30 as written. Record OQ-228-1's answer: build the full design. If decision 9's
  forecast still misses G6, the owner said "increase 3s to 4s". Record those words verbatim. Mark the reading
  (G6 budget vs level-5 time) **pending the owner** and invent no meaning. Point out that the re-forecast runs first,
  on main with ABC-235/240 merged.
- ADR-0054: Status → ACCEPTED 2026-10-30 as written.
- On acceptance, add the dated pointer lines each ADR says it owes to the ADRs it amends (e.g. ADR-0002 cl. 3,
  ADR-0044 D2/D3/D6, ADR-0024 d4, ADR-0045 where named). Pointer lines only, no rewrites.
- ADR-0020 stays as it is (Q3 is still open).

## Fences
- memory-bank/50-decisions and your context only. No src/, tools/, data/, plans/ or board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths in any commit. Never bare `npx`.

## Publish
- Seal notes (task `arch-adr-accept-0052-0053-0054`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus
  a 10-cell trace row into this brief, then move it and its claim.md to done/.
