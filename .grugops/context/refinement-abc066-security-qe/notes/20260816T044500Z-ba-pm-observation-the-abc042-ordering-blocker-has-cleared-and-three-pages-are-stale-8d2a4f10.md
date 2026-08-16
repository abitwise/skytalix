---
id: 20260816T044500Z-ba-pm-observation-the-abc042-ordering-blocker-has-cleared-and-three-pages-are-stale-8d2a4f10
kind: observation
by: ba-pm
at: 2026-08-16T04:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-057
  - ABC-058
  - ABC-059
  - plans/board.md
  - src/cli.test.ts
supersedes: 
---

# The `ABC-042` ordering blocker has **CLEARED**, and three `EPIC-006` pages still say it has not

The subtask named this as a trap: the `EPIC-006` security follow-ups are marked ⚠️ *"ordered behind
`ABC-042`'s merge"*, and asked whether the blocker is still real now `ABC-065`/`ABC-066` have merged.
**It is not real, it is unambiguously cleared, and I am recording it rather than bumping any DoR.**

## The measurement

| premise the ⚠️ rests on | state today |
|---|---|
| *"`ABC-042` must merge first — OPEN and HELD"* (`ABC-058` § Dependencies) | **MERGED to `main` @ `dbaf972` on 2026-08-15** (`plans/board.md` `ABC-042` row) |
| *"`src/cli.test.ts` **does not exist on `main`** (verified)"* | **It exists** — 49,897 bytes in the clean `main` @ `5cf86d3` working tree, 47 `it(` blocks |
| *"held at the merge on `G1`, with the project owner"* | **`G1` re-graded MET at 0.23× against `N8-SPAWN`**; `ABC-042` reached `Done` and **UAT ACCEPTED 2026-08-15 by the project owner** |

**Three independent premises, all three false today, none of them ambiguous.** The subtask's stop
condition — *"if the status is ambiguous, record it ambiguous, do not resolve by inference"* — did
not fire: nothing here is inferred. `ABC-058`'s own dependency line names the single fact it turned
on (*the file does not exist on `main`*), and that fact is directly observable.

## What I did NOT do

- **I did not edit `ABC-057`, `ABC-058` or `ABC-059`.** They are outside my id range; `ABC-058` was
  writable only in the fold case, which did not occur. **The DoR bump is the Orchestrator's or the
  next BA/PM hop's, and it must be made on the page as well as on the board — a board row edited
  alone leaves the page's Dependencies section contradicting it.**
- **I did not re-score their DoR.** Each is `9/10` with **one** ⚠️ that is exactly this ordering, so
  each should reach **`10/10` MET** once its page is repaired — but scoring is done by reading the
  page, not by arithmetic from a note.

## A second staleness on `ABC-058`, found while measuring — worth one line at the repair

`ABC-058`'s § Scope cites line numbers in `src/cli.test.ts` that **moved when `ABC-042`, `ABC-065`
and `ABC-066` merged**:

| cited | actual on `main` @ `5cf86d3` |
|---|---|
| spawn pin `sourceOf("cli.test.ts")` at **`:787`** | **`:843`** |
| the `N8-LANE` pin row **`:775-793`** | **≈ `:831-849`** (`expect(spawned).toBe(10)` at `:836`) |
| bar 3's assertion at **`:769`** | **`:825`** |
| `CHILDREN.escape` at **`:158`** | **`:158` — still correct** |
| `executableCodeOf` defined at **`:45-48`** | **`:45` — still correct** |

**`A7`'s foresight held**: it deliberately states the test count *as a delta, not as the absolute
`29`* — the file is now **47** `it(` blocks and that criterion still reads correctly. **The line
numbers did not have that protection.** Not a defect in the ticket's substance; a re-measure at the
hop, and the same warning is carried in `ABC-073` Test note 4.
