---
task: owner-rulings-2026-09-19
subtask: ruling-abc100-distribution
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (ruling → superseding ADR; no code)
ticket: plans/tickets/ABC-100-distribution-channel-decision.md
ref: .grugops/context/ruling-abc100-distribution/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/ruling-abc100-distribution
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0018
---

# Subtask: deliver `ABC-100` — the distribution channel is `git clone` + `npm start`, on the owner's word

Read the authority note first, then `ABC-100`'s page in full, then `ADR-0007` (clause 5 and its
falsifier table `D1`–`D7`). The owner's word: *"1. git clone + npm start works for now"*.

## Deliver
- `memory-bank/50-decisions/ADR-0018-<slug>.md`, `status: accepted`, superseding `ADR-0007`
  **clause 5 only**; use `ADR-template.md`. Meet `ABC-100` `A1`–`A7` literally:
  - `A2`: quote the owner's word verbatim, dated, attributed — copy it from the authority note.
  - `A3`: price every option (npm publish, standalone binary, `git clone`+`npm start`, `npx` off
    a git URL, "not yet"), including the rejected ones.
  - `A4`: carry `ADR-0007`'s falsifier rows forward; `D2` and `D7` explicit.
  - "For now" is a revisit trigger — name what would re-open this (e.g. a second user, a publish
    request from the owner).
- `A7`: repair `EPIC-006`'s four `npx` sentences (`plans/epics/EPIC-006-…md`) to name the chosen
  channel; acceptance criterion 1 becomes `git clone` + `npm install` + `npm run chess`
  (check `package.json` for the actual script name — it is `chess`, not `start`; say so in the
  ADR and do NOT add a `start` script, that is a code change and `A6` forbids one).
- `NFR-007` in `plans/nfr-catalog.md`: its `npx`-vs-undecided item resolves to this channel; the
  first-frame trigger becomes measurable from `npm run chess`. Update the row text, not the bar.
- Close the 2026-08-06 TWO-DOCUMENTS-DISAGREE item wherever it is recorded (`grep -rn` for it).

## Fences
- `A5`/`A6`: zero files under `src/`, `package.json` untouched, `production_requires_human_confirmation`
  untouched. `git diff --numstat` must show only `memory-bank/`, `plans/`, `.grugops/`.
- Do not touch `AGENTS.md` (`ABC-109` byte cap), `plans/board.md` beyond the one row move below.
- Do not merge, do not deploy. Own `git worktree`, commit on the branch above.

## Board / trace
- `ABC-100` `Backlog` → `Done` is the Orchestrator's; you record in your `decision` note that the
  criteria are met and leave the board row where it is. Append a `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(`human_admission` is `off`; no `finding` is admissible — use `decision`/`observation`). Claim by hand
per Workflow 17: `mkdir .grugops/queue/claimed/ruling-abc100-distribution`, move this file in, then
out to `done/` when finished.
