---
subtask: arch-q3c-oq228ii
role: architect-design
ref: .grugops/context/arch-q3c-oq228ii/
branch: new grugops/arch-q3c-oq228ii from main, own worktree
---

# Architect: record Q3 (c) as an ADR-0020 amendment, and OQ-228-1 (ii) in ADR-0053

Source: the owner-decision note `orch-2026-10-29g/…c4ab73de` (owner verbatim: "QQ-228-1: ii ; Q3: c"). Your own Q3 table is
in `arch-ABC-230-reading/…90a3aa31` § 3.

## Do
- **Q3 (c):** write the design for "normalise for the game-history comparison only". One helper: the oldest key of the
  reversible window loses its ep file when that position has no ep capture. It is used by ABC-230's prior-key builder AND
  by history.ts's game-end count. The hash is unchanged. Choose the form: a dated amendment section in ADR-0020, or a new
  ADR that amends ADR-0020 d2's consequence. Either way it is **ACCEPTED 2026-10-30 on the owner's word** (cite the note).
  State: value-changing (10 D + 10 R smoke), size S, built after ABC-230 merges, the tests it owes, and the
  ADR-0011 / history.ts licence surface it touches.
- **OQ-228-1 (ii):** in ADR-0053 decision 10, replace "pending the owner" with his answer (ii). On a G6 re-forecast miss,
  level 5's per-move time becomes 4 000 ms. Spell out the consequences that build would carry: an ADR-0045 amendment,
  G9 waived for that ticket, the R mode's frozen 3 000 ms and EPIC-008/010 reference readings moving, and what must be
  re-read. Nothing changes if the forecast meets G6. Add a pointer line in ADR-0045 § Status ("conditional, see ADR-0053 d10").

## Fences
- memory-bank/50-decisions and your context only. No src/, tools/, data/, plans/ or board edits. An SE is building
  ABC-230 in parallel; don't touch its files.
- Never push, force, amend or rebase. Never merge into main. No host paths in any commit. Never bare `npx`.

## Publish
- Seal notes (task `arch-q3c-oq228ii`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.
