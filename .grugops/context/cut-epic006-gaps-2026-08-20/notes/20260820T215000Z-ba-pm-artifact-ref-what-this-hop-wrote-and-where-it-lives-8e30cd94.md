---
id: 20260820T215000Z-ba-pm-artifact-ref-what-this-hop-wrote-and-where-it-lives-8e30cd94
kind: artifact-ref
by: ba-pm
at: 2026-08-20T21:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-112
  - ABC-044
  - EPIC-006
  - plans/tickets/ABC-112-help-advertises-a-command-the-build-does-not-honour.md
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# What this hop wrote — four files, one new ticket, one annotated row

**Hand-authored `artifact-ref`, unstamped.** Branch `grugops/cut-epic006-gaps` off `main` @
`d849da9`, produced in a throwaway `git worktree`, **not** the repository tree. Nothing merged.

## Written

| path | what |
|---|---|
| `plans/tickets/ABC-112-help-advertises-a-command-the-build-does-not-honour.md` | **NEW.** The only ticket cut at this hop. `EPIC-006`, `XS`, `P1`, DoR 9/10 ⚠️×1 |
| `plans/board.md` | **ONE `Backlog` row ADDED** (`ABC-112`), **ONE `Backlog` row ANNOTATED IN PLACE** (`ABC-044` — blocker landed; NOT re-scored, stays 8/10 ⚠️×1), **ONE `_Updated` header ADDED** to the six above it (added to, not superseding — so no history file is written) |
| `plans/traceability.md` | **ONE row APPENDED** (`ABC-112`) |
| `.grugops/context/cut-epic006-gaps-2026-08-20/notes/` | **FIVE hand-authored notes**: this one, one `decision` (the ids), two `observation` (the measurements; the existing owners), one `claim` (what was left uncut, and the fences verified) |

## Not written — checked, not asserted

`src/**` (0 files), `plans/nfr-catalog.md`, `memory-bank/50-decisions/ADR-0014*`, `plans/epics/**`,
and the pages of `ABC-033`, `ABC-035`, `ABC-037`, `ABC-078`, `ABC-044`, `ABC-046`, `ABC-110`. **No
column was moved. Nothing was archived. Nothing was merged.**

## The one thing a reader should not miss

**Only ONE ticket was cut where the brief fenced EXACTLY TWO.** The second gap's ticket is
**`ABC-044`**, cut 2026-08-13, and the reasoning is in the sibling `decision` note
(`…-decision-one-ticket-cut-abc112-and-the-second-id-is-abc044-which-already-exists-…`). **The
recommended action for that gap is a PULL, which is the Orchestrator's, not a cut.**

## Note kinds, said plainly

**No `finding` was authored and none is admissible on this install** —
`context.human_admission` is `off`, `scripts/context-io.ts` and `mcp__grugops__propose_note` are
absent, and no `§14-gate#<id>` verdict can be emitted. Every note here is
`claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
`agent-factory/contracts/context-note.md`, with `verified_by` empty on all five. **No derived
`index.md` / `index.jsonl` was written**, because the tool that produces them byte-reproducibly does
not exist here and a hand-written render would be a fabrication of a derived artifact.
