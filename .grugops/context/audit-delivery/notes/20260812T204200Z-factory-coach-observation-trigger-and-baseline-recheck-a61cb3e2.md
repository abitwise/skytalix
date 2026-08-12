---
id: 20260812T204200Z-factory-coach-observation-trigger-and-baseline-recheck-a61cb3e2
kind: observation
by: factory-coach
at: 2026-08-12T20:42:00Z
verified_by:
confidence: high
refs:
  - delivery-audit-2026-08-12
  - agent-factory/workflows/11-retro.md
  - agent-factory/workflows/16-context-read-write.md
  - agent-factory/workflows/17-task-claim.md
  - .grugops/factory.config.json
  - plans/board.md
  - plans/metrics.md
  - plans/epics/EPIC-001-chess-rules-core.md
  - tools/grugops/test-skip-integrity.js
supersedes:
---

# The trigger is ON-DEMAND, not the enterprise one — and the Orchestrator's baseline re-checked, line by line

## Trigger, stated plainly because the role file lists three

Workflow 11 fires on `mode=enterprise`, at the end of a sprint, **or on-demand**. **The
on-demand trigger fired.** The other two did not, and neither is close to firing:

- `.grugops/factory.config.json` → `"mode": "lean"`. Not enterprise. Workflow 11 says the retro is
  kept **light** in lean, and this hop is scoped accordingly: metrics, classification, a ruling,
  the debts, and at most five proposals.
- `"cadence": "kanban"`, `plans/sprints/` is **empty**, and zero sprints have ever been run. There
  is no sprint boundary here and there never has been one.

I was also told, and confirm, that this is not a sprint boundary. Saying which trigger fired
matters because the enterprise retro and the on-demand retro have different budgets, and a lean
factory that quietly runs the enterprise version has just spent a day it did not have.

## Recording constraints for this task, checked before I wrote anything

`context.human_admission` is `off` and no `§14-gate#<id>` stamp exists under this task. **Therefore
no note in this folder is `kind: finding`** — every result is a `claim`, `observation`, `decision`
or `artifact-ref`. `scripts/context-io.ts` does not exist in this repository or in the kit
(`/Users/olgeroeselg/.grugops/agent-factory/` has no `scripts/` directory at all), so **these notes
are HAND-AUTHORED and I say so rather than implying a sanctioned writer ran.** Likewise
`scripts/claim.js` does not exist: the queue claim was a hand-performed atomic
`mkdir .grugops/queue/claimed/audit-delivery/` which succeeded on the first attempt (no `EEXIST`),
followed by a `git mv` of the subtask file into the claim directory.

## The Orchestrator's baseline — I was asked to check it, so I checked all seven claims

| Baseline claim | Verdict | What I measured |
|---|---|---|
| `main` at `43d5a9d`, worktree on `grugops/audit-delivery` branched from it | **CONFIRMED** | `git worktree list` shows all four worktrees at `43d5a9d`; `git status` clean but for the queue file |
| `npm test` = 807/807, 28 files, 1.59 s | **CONFIRMED**, and the wall time is a fair single sample | I re-ran it four times: **807/807 on 28 files** every time; wall 1.62 / 2.05 / 1.51 / 1.73 s, **median 1.68 s**. The baseline's 1.59 s sits just under my fastest run, which is what one run looks like |
| 30 tickets `ABC-001`…`ABC-030`, no gaps; 25 `Done`; five in `Backlog` (`ABC-010`, `-021`, `-024`, `-026`, `-030`) | **CONFIRMED** | `ls plans/tickets/` plus the `status:`/`column:` front matter of all 30 files. Board `Done` rows count 25 and agree with the front matter |
| One epic `Done`, five not | **CONFIRMED ON THE BOARD, CONTRADICTED IN THE FILE** | The board has `EPIC-001` in `Done` (complete 2026-07-24). `plans/epics/EPIC-001-chess-rules-core.md` front matter still reads `status: backlog` / `column: Backlog`. All six epic files read `backlog`. See the debts note |
| Every WIP column 0, nothing in flight | **CONFIRMED** | Read from the live column headings and rows of `plans/board.md` |
| `src/`: 17 production modules, 28 test files | **CONFIRMED** | `ls src/*.ts` split on `.test.ts` — exactly 17 and 28 |
| `plans/metrics.md` twelve days stale; four rows never filled; ~17 tickets reached `Done` since | **CONFIRMED, and the 17 is exact** | The file's header read `2026-07-31`. Counting merges after that date from the board: `ABC-011`, `-012`, `-014`, `-015`, `-018`, `-009`, `-022`, `-013`, `-023`, `-025`, `-016`, `-027`, `-017`, `-019`, `-029`, `-028` = 16, plus `ABC-020` merged 2026-08-02 = **17**. `Rework rate`, `Escaped defects` and `Velocity` were empty; `Lead time` read "no data" |
| No CLI entry point; `AGENTS.md` records `Dev / run: UNKNOWN - verify`; `EPIC-006` owns packaging at `P2` | **CONFIRMED** | `AGENTS.md:48` is exactly that, with the comment `<!-- no CLI entry point until EPIC-006 -->`. `package.json` has no `bin` and no `main`. `plans/epics/EPIC-006-*.md` front matter is `priority: P2`, `status: backlog` |

**One correction to the brief itself**, recorded in the lineage note: the brief says `ABC-029` was
cut from `ABC-028`'s hops. It was not. `ABC-029` and `ABC-028` were cut **together, from
`ABC-017`'s MERGE**, at the same BA/PM task `abc017-cut-2026-08-12`.

## Method, so this is attackable rather than merely assertive

Every figure I publish came from `git`, `ls`, ticket front matter, or from executing a binary.
The board header was used for merge dates and column counts only, and each of its independently
checkable claims that I relied on was re-derived rather than trusted. Where the repository cannot
answer, I wrote `UNKNOWN - verify` and named what would be needed — twice in `plans/metrics.md`
(`Cycle time`'s column timestamps, and `H5`'s lane measurement, which is not mine to close).
