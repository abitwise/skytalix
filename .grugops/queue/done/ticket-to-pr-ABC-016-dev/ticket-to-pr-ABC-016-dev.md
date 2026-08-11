---
task: dev-frame-panels-2026-08-11
subtask: ticket-to-pr-ABC-016-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-016-dev/
parent_ref: .grugops/context/dev-frame-panels-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T08:45:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: implement `ABC-016` — status panel

Read `parent_ref:` first, then `plans/tickets/ABC-016-status-panel.md`, then
`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`.

`ABC-016` is `M` (3) and `P1`. It was gated to `Ready for Dev` on 2026-08-11 and pulled into
`In Development` at this hop; its Definition of Ready was re-run against the checklist at the pull
and all ten items hold. **You are not being asked to re-open the ticket.** If you find a defect in
it, flag it and stop — amendments are BA/PM's, not yours.

## Why you are running concurrently with another engineer, and what that costs you

`ABC-019` is being built at the same time, in a different worktree, by a different agent. That is
the owner's directive (2 of 3). **The two of you never communicate.** The shared verified context
and the queue are the only channels; nothing is relayed between you.

**Merge order is NOT build order.** `ABC-016` merges FIRST, then `ABC-017`, then `ABC-019`. You are
first in that order, so you rebase onto nothing and you are not waiting on anyone.

## Your file boundary — measured at the scheduling hop, and it is hard

- **YOURS**: `src/status-panel.ts`, `src/status-panel.test.ts`, `src/status-panel.nfr.test.ts`.
- **NOT YOURS, do not create or edit**: anything matching `src/turn-loop.*` (that is `ABC-019`),
  and **`src/frame.test.ts`** — `ADR-0009` clause 5 assigns the composition fit-check to `ABC-017`,
  the ticket that merges second. Adding it here puts a fourth copy of an assertion in the tree,
  which is the precise thing `ADR-0009` rejected.
- `plans/board.md` is the **Orchestrator's alone**. Do not write it. Your board move
  (`In Development` → `In Review`) is yours to *request* in your notes; the Orchestrator applies it.
- Your own ticket file and your own `plans/traceability.md` row are yours. Touch no other row.

## Constraints that bind

- Work **only** inside your worktree `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`.
  Never `git checkout main`. Never merge. Never deploy.
- `git commit` takes the **INDEX**, not the paths you just `git add`-ed. This project has a recorded
  defect (`2cd84cd`) where that swept ~640 lines of another role's work into one commit. Use
  `git commit -- <paths>` or verify `git status` before every commit.
- Gates are `blocking` (`quality.gate_enforcement`): `lint`, `typecheck`, `unit`, `build` must be
  exit 0, and the skip count must stay **0**. Baseline on `main` is **676/676 on 22 files**.
- `quality.tdd` is `encouraged` — run the inner red→green→refactor loop per Workflow 04 step 3.
- Do not change dependencies. No unrelated refactors. Follow the 12 coding rules in `AGENTS.md`.
- `N8-LANE` applies to the test lane budget — see the ticket and `plans/nfr-catalog.md`.

## Recording

Per Workflow 16, write typed notes into `ref:`. **`scripts/context-io.ts` does not exist in this
repo and `mcp__grugops__propose_note` is not available** — the recorded precedent here is to
hand-author the note and say so in it. **You may not write a `finding`**: no verification stamp is
issuable to you. Use `decision` / `observation` / `claim` / `artifact-ref`.

Claim this subtask per Workflow 17 before you start (atomic `mkdir` of
`.grugops/queue/claimed/ticket-to-pr-ABC-016-dev/`; `scripts/claim.js` does not exist here, so the
directory create is by hand and the directory IS the claim).

No candidate-defect list is supplied. This project has recorded twice that the Orchestrator's short
pre-check lists act as anchors, and the hop handed zero candidates found the most.
