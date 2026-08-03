---
id: 20260804T114000Z-ba-pm-artifact-ref-3d5f81ba
kind: artifact-ref
by: ba-pm
at: 2026-08-04T11:40:00Z
verified_by: 
confidence: high
refs:
  - refinement-2026-08-04
  - ABC-022
  - ABC-014
  - ABC-015
  - ABC-018
  - EPIC-002
  - EPIC-001
  - RISK-005
  - NFR-001
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/tickets/ABC-014-board-frame-renderer.md
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/board.md
  - plans/traceability.md
  - memory-bank/60-progress.md
supersedes: 
---

# Artifacts produced and edited by `refinement-2026-08-04`

Everything this task wrote, by reference, so a later reader can check the decisions against the files
rather than against the notes. Branch `grugops/refinement-2026-08-04`, cut from `main`. **No file
under `src/` was modified and no production code changed.**

## Created

- `plans/tickets/ABC-022-en-passant-generation-preconditions.md` — the new ticket. `S`, `P1`,
  `EPIC-001`, `status: ready` / `column: Ready`. Definition of Ready met in full and enumerated in
  its own `## Definition of Ready` section.

## Edited in place (each with a dated reason in the file)

- `plans/tickets/ABC-015-glyph-mode-selection.md` — `## Dependencies` merge-order clause corrected
  `ABC-014` → `ABC-018` with a dated correction block; `## Size and priority rationale` and
  `## Definition of Ready` updated to match. **Size, priority, scope, out-of-scope, acceptance
  criteria, test notes and `Backlog` position all unchanged.**
- `plans/tickets/ABC-014-board-frame-renderer.md` — `## Dependencies` clause clarified to name
  `ABC-018` as "first user-visible use", with a dated block recording that **this ticket was not the
  one written wrong** and never blocked on `ABC-015`. Nothing else changed.
- `plans/tickets/ABC-018-frame-output-and-redraw.md` — `## Dependencies` gains the `ABC-015`
  merge-order constraint and the obligation it implies (take the glyph mode as an argument; do not
  default, hardcode or re-derive it). Recorded as a merge-order constraint, **not** a build
  dependency.
- `plans/epics/EPIC-002-terminal-board-and-game-loop.md` — the `RISK-005` entry, which had propagated
  the wrong wording, corrected with the same reasoning. **`RISK-005`'s severity and mitigation
  strategy are unchanged.**
- `plans/board.md` — header entry; `Ready` heading `WIP 4/8` → `WIP 5/8`; `ABC-022` row appended to
  `Ready`; `ABC-014`'s row annotated as unblocked; `ABC-015` and `ABC-018` `Backlog` rows carry the
  corrected merge order; a `Ready` comment block recording both rulings, the pull order with a reason
  per ticket, and the "re-read and deliberately not moved" list. **The 2026-07-31 re-sequencing
  comment is untouched.**
- `plans/traceability.md` — header entry; **one row appended** (`ABC-022`, with its `NFR-001` bar,
  the `NFR-005` structural exclusion and the test-shape constraints); **two rows corrected in place**
  (`ABC-015`'s NFRs cell for the merge-order fix, `ABC-014`'s Status cell for "pullable, never
  blocked"). One row per ticket, this file's own format rule, is preserved. **Code, Tests and UAT
  cells of `ABC-014` and `ABC-015` untouched** — nothing was built.
- `memory-bank/60-progress.md` — header entry; the known-issues table's "NEW, unticketed" row becomes
  the **`ABC-022`** row (`S`/`P1`, ticketed), with the three reproduction divergences, the guard-(a)
  correction, and the two named-not-fixed gaps in `ABC-009` and `ABC-010`; the `## Next action`
  section rewritten to the fixed pull order.

## Queue

- `.grugops/queue/claimed/refinement-2026-08-04/` — claim directory and `claim.md` registry record,
  both created **by hand** (no `scripts/claim.js` on this install), then the subtask file moved
  `pending/` → `claimed/` → `done/`.

## Not committed, deliberately

Four throwaway reproduction scripts and one guard-(a)-deleted copy of `src/`, all in the session
scratchpad outside the repository: `repro-gen.ts`, `repro-gen2.ts`, `repro-gen3.ts`, `nogA/probe.ts`.
Every number they produced is transcribed with its machine into
`20260804T104500Z-ba-pm-observation-1f7c04a9`, so nothing depends on the scripts surviving — the same
posture every measurement on this project has taken.

## Not produced, and why

No `index.md` / `index.jsonl` render under `.grugops/context/refinement-2026-08-04/`. Those are
**derived** artifacts of `scripts/context-io.ts`, which does not exist on this install; hand-writing
them would produce a render that is not byte-reproducible from the notes and would misrepresent a
degraded substrate as a working one. The `notes/` markdown files are the source of truth and are
complete on their own.
