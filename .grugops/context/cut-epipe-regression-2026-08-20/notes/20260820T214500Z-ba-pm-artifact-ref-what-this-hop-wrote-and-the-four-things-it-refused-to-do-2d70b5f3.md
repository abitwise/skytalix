---
id: 20260820T214500Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-four-things-it-refused-to-do-2d70b5f3
kind: artifact-ref
by: ba-pm
at: 2026-08-20T21:45:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - EPIC-006
  - plans/board.md
  - plans/traceability.md
  - ABC-043
  - ABC-050
supersedes:
---

# What this hop wrote, and the four things it refused to do

Branch `grugops/cut-epipe-regression`, cut from `main` @ `414ef75` in its own `git worktree`
(`.claude/worktrees/cut-epipe-regression`, which is git-ignored and never part of the repo).

## Written

| artifact | shape |
|---|---|
| `plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md` | the whole deliverable — `S`/`P1`, `epic: EPIC-006`, `A1`–`A8`, DoR 9/10 ⚠️x1 with the ⚠️ named |
| `plans/board.md` | **+2 lines, 0 removed** — one row appended to `Backlog`. **No column move, no other ticket touched, no WIP limit touched, no header rewritten** |
| `plans/traceability.md` | **+3 lines, 0 removed** — one `_Updated:_` line and one row appended. **Nothing touched in place** |
| `.grugops/context/cut-epipe-regression-2026-08-20/notes/` | 5 notes: 3 `observation`, 1 `decision`, this `artifact-ref` |
| `.grugops/queue/claimed/cut-epipe-regression/` → `done/` | claim taken by bare `mkdir` (Workflow 17, by hand — `scripts/claim.js` is absent on this install), subtask file moved `pending` → `claimed` → `done` |

**Note kinds, honestly:** no `finding` anywhere. `human_admission` is `off`, `scripts/context-io.ts` and
`mcp__grugops__propose_note` are absent from this repo and from the kit, so no `§14-gate#<id>` verdict
can exist and no note here carries a `verified_by`. These notes are hand-authored per
`agent-factory/contracts/context-note.md`, which is what this install's `AGENTS.md` directs.

## Refused

1. **I did not fix it.** `git diff --numstat main...HEAD -- src/` is **empty**. Cutting is not fixing,
   and a ticket is the whole deliverable.
2. **I did not move, re-score, re-open or archive any other ticket.** `ABC-043` stays `Done` on the
   owner's word; `ABC-042`, `ABC-044`, `ABC-113`, `ABC-114` untouched. The only board change is my new
   `Backlog` row.
3. **I did not cut tickets for the other two open items** — `ABC-050`'s type-valid `exclude` residual
   and `G-06`. Both are real, both are still open and unowned, both are out of this subtask's fences.
   Neither is folded into `ABC-115`; `## Out of scope` says so on the page.
4. **I did not invent a fourth exit code, and I did not self-sign anything.** `141`/`SIGPIPE` is named on
   the page as considered and rejected-as-not-mine, with the substitution pre-registered so an
   Architect/Design ruling costs one literal. Nothing merged to `main`; nothing deployed.

## Measurement provenance, in one line

Every number on the ticket page was produced by a run at this hop on `main` @ `414ef75` (Node v24.12.0,
macOS) — the reproduction, the 14-point `head -N` sweep, the three-tree bisect re-run, the two harness
probes, the refusal-path exit code, and the lane base (40 files / 1207 tests / 0 skipped, green, 2.95 s
wall / 13.74 s user). **The QE/E2E note was the lead, not the evidence**, and the two places my numbers
disagree with it are written on the page and in
`20260820T211500Z-ba-pm-observation-…-7c41d9a2.md`.

## What the next hop needs from a human, and what it does not

- **Nothing blocks pulling `ABC-115` today.** No open ruling gates it.
- **The one thing an Architect/Design hop may want to overturn** is the exit-code ruling (`0`), and `A2`
  is built so that costs one literal.
- **Column moves are the Orchestrator's.** This row is `Backlog` and NOT pulled.
