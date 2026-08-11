---
id: 20260811T191000Z-ba-pm-artifact-ref-11469dee
kind: artifact-ref
by: ba-pm
at: 2026-08-11T19:10:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-027
  - ADR-0010
  - plans/tickets/ABC-019-turn-loop-skeleton.md
  - .grugops/queue/claimed/refinement-ABC-019-qe-gaps/
supersedes:
---

# What this hop produced, where it is, and two process defects found while producing it

> **Hand-authored** — see this hop's `decision` note. **Nothing here is a `finding`.**

## The artifact

**One file changed: `plans/tickets/ABC-019-turn-loop-skeleton.md`** (1360 → 1910 lines). The
amendment is marked in place throughout as `[D38]`–`[D48]`, on this ticket's established convention:
an amendment that lists what it changed is auditable, and a superseded sentence is struck and
explained under rather than silently replaced.

| section | what changed |
|---|---|
| header | fourth-hop amendment block: what changed, why one hop not two, which single ruling moves the board |
| `## Scope` | transition **15**'s trigger reworded + `[D38]`'s type-level argument |
| `## Out of scope` | `ABC-027` named; pointer to the prohibition |
| `## Acceptance` | **`A5b`, `A8b`, `A10b`, `A20` ADDED**; `A2`, `A6`, `A9b`, `A19` amended in place; `[D32]`'s witness corrected; **the PROHIBITION** written beneath `A20` |
| `## Dependencies` | `ABC-027` added; merge order → `ABC-016` → `ABC-027` → `ABC-017` → `ABC-019` |
| `## Test notes` | **rows 15–18**; row 16 vs row 3 explained; `A12` enumeration checked; `A20` fixture mechanics; `N8-LANE` restated |
| `## Size and priority rationale` | fourth re-derivation, `L`/`P0` unmoved, split considered and rejected, fifth-hop caution |
| `## Definition of Ready` | fourth DoR re-check, eleven-ruling table, item 10 argued explicitly, board move requested, flags 10–13, flag 9 CLOSED |

**Criteria 23 → 27** (`A1`–`A20`, seven sub-lettered) — verified mechanically after the edit, in
order, **none renumbered and none deleted**. **Table rows 14 → 18.**

## Gates, re-run after the edit

| gate | result |
|---|---|
| `npm test` | **717/717 on 24 files** |
| `npm run lint` | **0** |
| `npm run typecheck` | **0** |
| `md5 src/turn-loop.ts` | `c92a1776e34b94cb3d9087dc3510e507` — **unchanged** |
| `git diff --stat -- src/` | **empty** |
| `git status --porcelain` | one modified ticket, the queue move, nothing else |

## The probe

`<scratch>/probe.ts` — **outside the repository and not named `*.test.ts`, so nothing entered the
lane** (24 files / 717 tests before and after). It imports the worktree's `src/` directly and drives
the delivered `runTurnLoop` through five scenarios: an already-terminal start, a prompt-driven
`game-over`, a foreign move from the input seam, message-region content across five frames, and an
engine-side termination. Measured output is in this hop's `observation` note. **It is a scratch
artifact and is deliberately not promoted into the repo.**

## Queue

Claimed per Workflow 17 **by hand** — `scripts/claim.js` does not exist here. Atomic
`mkdir .grugops/queue/claimed/refinement-ABC-019-qe-gaps/` returned success (not `EEXIST`), a
`claim.md` registry record was written (`by` / `at` / `task`), and the subtask file was moved
`pending/` → `claimed/`. It is moved to `done/` as the final act of this hop.

## TWO PROCESS DEFECTS FOUND WHILE WORKING, neither of them the ticket's

1. **The subtask brief's `parent_ref` points at a directory that does not exist.**
   `refinement-ABC-019-qe-gaps.md` carries `parent_ref: .grugops/context/abc019-qe-gaps-2026-08-11/`
   and the brief instructs the role to read it **first**. **It exists nowhere** — not in this
   worktree, not in the main worktree, not under any other name; a `find` across all worktrees for
   `*qe-gaps*` context dirs returns only `cli-chess-ABC-016`'s. The nearest routing note that does
   exist is `.grugops/context/adr0010-routing-2026-08-11/`. **The routing reasoning was recoverable in
   full from `plans/board.md`'s `_Updated:` header and the `ABC-019` row, so nothing was lost and
   nothing was guessed** — but a brief that names an unreadable `parent_ref` as step 1 is the shape of
   defect that makes a later role either invent the context or stall. **For the Orchestrator.**
2. **This ticket has now contradicted itself INSIDE a single amendment twice** — 2026-07-31's *"three
   things and no more"* (wrong by three) and `[D32]`/`[D35]` (`G-5`). Both times the individual
   rulings were right and their **interaction** was not. **That is the argument for merging this hop's
   two workstreams rather than splitting them**, and it is now recorded in the ticket itself so the
   next reader inherits the reason and not just the outcome.

## Owed elsewhere, flagged and NOT taken

- **`EPIC-006`** inherits the `[D38]` residue: on transitions 12/13 the last frame the player sees
  carries `status in-progress` with the thinking indicator lit, because no terminal `GameStatus`
  exists on those edges. **The result screen is what says the game ended.** New, ticket flag 12.
- **`ABC-021`** still needs the matching half of `[D12]` — **restated, not re-verified at this hop**;
  that ticket was not opened.
- **`ADR-0009`** is owed two narrow items by Architect/Design (clause 9e's wording; clause 9b +
  evidence (vii)'s stale seam signature) — **restated, neither re-verified here**; the board records
  the latter as QUEUED.
- **The duplicate `## Test notes` bullet** is still present and still not deleted (coding rule 12) —
  verified still present at this hop; removing it needs a mandate no hop has had.
- **`plans/board.md`'s `ABC-019` row is NOT flagged** — the stale `blocked-until`/`merge-order` text
  was fixed by the Orchestrator this hop, verified by reading the row, and the ticket now records it
  **CLOSED** so it is not raised a sixth time.
