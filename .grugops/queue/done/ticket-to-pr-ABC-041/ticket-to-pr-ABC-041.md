---
task: pull-abc041-2026-08-13
subtask: ticket-to-pr-ABC-041
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-041/
ticket: plans/tickets/ABC-041-render-seam-closure.md
enqueued_by: orchestrator
enqueued_at: 2026-08-13T21:08:12Z
branch: grugops/ticket-to-pr-ABC-041
base: main @ 032589a
---

# Subtask: build `ABC-041` — the render seam, and nothing else

**Read `ref:` FIRST — three notes.** One of them is the `In Development`-entry criteria review and it
carries **two gaps in a 10/10 ticket** that you will otherwise walk into. Nothing about the ticket's
content is repeated here; the ticket and the notes are the channel.

## The claim, by hand

`scripts/claim.js` is absent on this install (`AGENTS.md` § Role / workflow files). Take the queue
claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/ticket-to-pr-ABC-041` — that bare `mkdir` is the atomic act. `EEXIST` means
the claim is lost: stop, do not proceed. Then move this file into the claim directory, and to
`done/` when the work is recorded.

## Hard limits on this hop

- Commit on `grugops/ticket-to-pr-ABC-041`, branched from `main` at `032589a`. **Never commit on
  `main`.**
- **`A10` is a budget, not advice**: your diff is the new module, its test file, and the one
  probe-root line. `src/frame.ts`, `src/render.ts`, `src/status-panel.ts`, `src/history-pane.ts` and
  `src/turn-loop.ts` must come out **byte-identical**.
- Record results as `claim` / `observation` / `decision` / `artifact-ref` under `ref:`. **No
  `finding` is admissible on this install** — no `§14-gate#<id>` stamp can be emitted here. Do not
  invent one.
- Run the mandatory gates (`lint`, `typecheck`, `unit`, `build`) plus the test-integrity step on your
  branch tip and record the numbers. `self_fix_attempts` is **2**.
- **Do not merge.** Hand back; the Orchestrator sequences the gate and the merge.

## Stop conditions

- The published `RenderSeam` at `src/turn-loop.ts:97-102` needs an adapter or a cast to accept your
  module → **stop**. `A1` says no adapter, and a seam that needs one is a design question, not an
  implementation detail.
- `A7`'s probe reports `src/history.ts` inside your module's closure → **stop and fix the import**.
  Read gap 1 in the review note before you touch any declared list.
- The lane cost lands above one median-weight test file → **stop and say so**. The budget is ~10 files
  across two epics and this ticket is allotted **1**.
