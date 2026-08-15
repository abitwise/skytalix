---
task: abc065-066-claim-drained-2026-08-16
subtask: abc065-066-claim-drained-2026-08-16
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/abc065-066-claim-drained-2026-08-16/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T21:45:00Z
branch: grugops/abc065-066-claim-drained
base: main @ TIP — branch by NAME, not by sha
---

# Subtask: ABC-065's one open ⚠️ is a claim that has now drained — re-score, and apply the standing pull-together instruction with ABC-066

**Clock note, so it is not mis-read as tidied:** `enqueued_at` above was taken by `date -u` on this
machine and reads `2026-08-15T21:45:00Z`, one day behind the session date this hop otherwise carries
(`2026-08-16`). This is the same clock skew this repository has already recorded twice
(`.grugops/queue/done/lint-config-drift.claim.md`). The measured value is written as read; do not
round it forward to look tidy.

## Why this hop exists

`plans/tickets/ABC-065-*.md` scores **9/10 — NOT MET**, and its sole `⚠️` (Definition-of-Ready item
#10) reads: *"`AGENTS.md` is under a live queue claim by `agents-md-owner-grants`... it clears when
that subtask drains to `done/`."* That subtask has drained:
`.grugops/queue/done/agents-md-owner-grants.md` and `.claim.md` both sit under `done/`, not
`claimed/` or `pending/` — verify this yourself before relying on it, do not take it from this file.
`plans/board.md`'s own 2026-08-16 header independently confirms the same drain and names this exact
re-score as the one thing "left for a named role, neither taken here" — **the Orchestrator does not
re-score another role's DoR** (the same rule this board already states on `ABC-036`).

**`ABC-066`'s traceability row (`plans/traceability.md`, the `ABC-066` line) already carries the
routing instruction for this moment, written 2026-08-15 at the ticket's own cut:** *"Recommended to
the Orchestrator: pull with `ABC-065` when its claim drains — until both land, no correct spelling of
the separator is reachable anywhere."* `ABC-066` already reads **DoR 10/10 MET** and needs no
re-score — only the coupled pull.

## What this hop is

1. **Re-score `ABC-065` Definition of Ready item #10** against
   `agent-factory/checklists/definition-of-ready.md`, on the now-drained claim. Verify independently
   (do not just cite this file): read `.grugops/queue/done/agents-md-owner-grants.md` /
   `.claim.md`, confirm `.grugops/queue/{pending,claimed}/` hold nothing named
   `agents-md-owner-grants`, and confirm `AGENTS.md` on `main` carries no live-claim marker for
   itself. Update the item-10 row and the "Result: 9 of 10" line in
   `plans/tickets/ABC-065-*.md`'s own Definition-of-Ready table in place.
2. **If and only if `ABC-065` now reads 10/10**, move it `Backlog → Ready` (this column's exit is
   BA/PM's, per `plans/board.md`'s own column table). Update its front matter (`status:`, `column:`)
   to match.
3. **Move `ABC-066` `Backlog → Ready` in the same hop**, applying its own traceability row's
   instruction verbatim. It needs no DoR re-score — re-read its existing 10/10 table and confirm
   nothing there has changed since 2026-08-15 (it shouldn't have; say so if it hasn't, stop and report
   if it has).
4. **`plans/board.md`**: remove both rows from `## Backlog`, append one line each under
   `## Ready (WIP 0/8)`. **A board row is ONE LINE** (the file's own rule, stated right above the
   column table) — do not narrate the re-score there; that belongs in this hop's context notes.
   Update the `(WIP x/8)` count in the heading to match (0 → 2).
5. **`plans/traceability.md`**: update the Status cell (last column) on the `ABC-065` and `ABC-066`
   rows to reflect `Ready`, DoR met, and the date of this hop. Do not touch any other row.
6. **Publish notes** under `ref:` per Workflow 16 — `claim` / `decision` / `observation` /
   `artifact-ref` only (`context.human_admission` is `off`; no `finding` is admissible on this
   install, and no stamp may be invented — `AGENTS.md` § Role / workflow files is the authority, do
   not re-derive it).

## Hard fences

- **`AGENTS.md` is not yours.** The drained claim is evidence to read, not a file to edit here.
- **Do not re-open `ABC-042`.** Both `ABC-065` and `ABC-066`'s own pages already fence this; do not
  weaken either fence while editing.
- **Do not pull past `Ready`.** `Ready → Ready for Dev` is the Orchestrator's exit, not this hop's —
  stop at `Ready` even though both tickets are fully speced.
- **Do no code work.** Zero files under `src/`. This hop touches exactly: `plans/tickets/ABC-065-*.md`,
  `plans/board.md`, `plans/traceability.md`, and this task's own notes.
- **WIP check before you move anything:** `Ready` reads `0/8` on `main` right now; landing both
  tickets brings it to `2/8` — inside the limit, no override needed. Re-read the live board yourself
  before moving, in case it changed since this file was written.

## How to work — this repository's recorded constraints

- **Claim by hand.** `scripts/claim.js` does not exist here or in the kit. `mkdir -p
  .grugops/queue/claimed` for the parent (already present), then a **bare** `mkdir` (no `-p`) of
  `.grugops/queue/claimed/abc065-066-claim-drained-2026-08-16/` — that bare `mkdir` is the atomic
  act; `EEXIST` means you lost the claim. Write `claim.md` inside it, then move this file from
  `pending/` to that directory (`git mv` if it is tracked on your branch; if the main worktree's copy
  is untracked, record the same deviation `lint-config-drift.claim.md` already recorded rather than
  re-deriving a new one).
- **Use your own `git worktree`**, branched from `main` by NAME at its tip.
- **Commit on `grugops/abc065-066-claim-drained`, never on `main`. Do not merge.** The Orchestrator
  takes the merge after re-running the gate on your tip.
- Stage **explicit paths only**. Never `git add -A`.

## Report back

State, in this order: the re-scored DoR verdict for `ABC-065` item 10 and the new total; whether both
tickets moved to `Ready` (and if not, which one and why); the exact board and traceability lines
changed; and the note filenames you wrote.
