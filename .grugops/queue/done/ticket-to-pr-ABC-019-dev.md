---
task: dev-frame-panels-2026-08-11
subtask: ticket-to-pr-ABC-019-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-019-dev/
parent_ref: .grugops/context/dev-frame-panels-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T08:45:00Z
branch: grugops/ABC-019-turn-loop-skeleton
worktree: ../cli-chess-ABC-019
---

# Subtask: implement `ABC-019` — turn loop skeleton, both seams stubbed

Read `parent_ref:` first, then `plans/tickets/ABC-019-turn-loop-skeleton.md`, then
`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md` — **clause 9 in full**.

`ABC-019` is `L` (5) and `P0`, 19 acceptance criteria. It was gated to `Ready for Dev` on 2026-08-11
once `A18`/`A19` discharged the clause-9 hold, and pulled into `In Development` at this hop; its DoR
was re-run against the checklist at the pull and all ten items hold. **You are not being asked to
re-open the ticket.** If you find a defect in it, flag it and stop — amendments are BA/PM's.

## Why you are running concurrently, and the one thing it means for you

`ABC-016` (the real status panel) is being built at the same time, in a different worktree, by a
different agent. That is the owner's directive (2 of 3). **The two of you never communicate.**

**You build against STUB panels. You merge LAST.** Merge order is `ABC-016` → `ABC-017` → `ABC-019`
and it is unchanged. `ABC-016` is a **correctness** dependency: its deletion of the panel's per-frame
`gameStatusOf` call is what makes `A5`/`A6` satisfiable at all. Because you build before it lands,
**your branch will be REBASED onto both merged panels and RE-GATED before it merges** (`ADR-0009`
clause 9f). That rebase is a later hop and is not yours to perform now — but everything you write
must survive it.

Your ticket's own DoR item 10 is the authority for building now: the `016 → 017 → 019` constraint is
a **merge** order, **not a start blocker**.

## Your file boundary — measured at the scheduling hop, and it is hard

- **YOURS**: `src/turn-loop.ts`, `src/turn-loop.test.ts`, `src/turn-loop.nfr.test.ts`. The module
  names are pinned by the **Orchestrator for collision avoidance under concurrency**, not by the
  Architect — the ticket names no module. If you have a substantive reason to differ, flag it; do
  not silently rename.
- Your **stub panels live inside your own test file.** `ADR-0009` option **G** — a shared
  `src/panel-stubs.ts` imported by both your tests and `src/frame.test.ts` — is **REJECTED**. Do not
  create one.
- **NOT YOURS, do not create or edit**: anything matching `src/status-panel.*` (that is `ABC-016`),
  and **`src/frame.test.ts`** — clause 5 assigns the fit-check to `ABC-017`, and your own ticket
  records that `src/frame.test.ts`'s 3/8 stubs are `ABC-018`'s fixtures, are not your seam, and are
  not touched.
- `plans/board.md` is the **Orchestrator's alone**. Do not write it. Your board move
  (`In Development` → `In Review`) is yours to *request* in your notes; the Orchestrator applies it.
- Your own ticket file and your own `plans/traceability.md` row are yours. Touch no other row.

## Constraints that bind

- Work **only** inside your worktree `../cli-chess-ABC-019` on branch
  `grugops/ABC-019-turn-loop-skeleton`. Never `git checkout main`. Never merge. Never deploy.
- `git commit` takes the **INDEX**, not the paths you just `git add`-ed. This project has a recorded
  defect (`2cd84cd`) where that swept ~640 lines of another role's work into one commit. Use
  `git commit -- <paths>` or verify `git status` before every commit.
- Gates are `blocking`: `lint`, `typecheck`, `unit`, `build` exit 0, skip count **0**. Baseline on
  `main` is **676/676 on 22 files**.
- `quality.tdd` is `encouraged` — inner red→green→refactor loop per Workflow 04 step 3.
- Do not change dependencies. No unrelated refactors. Follow the 12 coding rules in `AGENTS.md`.
- `NFR-002` and `N8-LANE` both bind — see the ticket and `plans/nfr-catalog.md`.

## Recording

Per Workflow 16, write typed notes into `ref:`. **`scripts/context-io.ts` does not exist in this
repo and `mcp__grugops__propose_note` is not available** — the recorded precedent here is to
hand-author the note and say so in it. **You may not write a `finding`**: no verification stamp is
issuable to you. Use `decision` / `observation` / `claim` / `artifact-ref`.

Claim this subtask per Workflow 17 before you start (atomic `mkdir` of
`.grugops/queue/claimed/ticket-to-pr-ABC-019-dev/`; `scripts/claim.js` does not exist here, so the
directory create is by hand and the directory IS the claim).

No candidate-defect list is supplied, deliberately.
