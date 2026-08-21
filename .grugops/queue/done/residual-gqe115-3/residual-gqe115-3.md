---
task: residual-G-QE115-3-2026-08-21
subtask: residual-gqe115-3
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (design ruling; ADR per role page)
ticket: none (residual disposition against plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md)
ref: .grugops/context/residual-G-QE115-3-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T09:00:00Z
branch: grugops/residual-gqe115-3
base: main @ e4a5c48
---

# Subtask: rule `G-QE115-3` — two of `N8-SPAWN`'s three clauses are asserted by nothing mechanical, and the cheap close is already forbidden

**The project owner authorised this hop by name in session (2026-08-21), first of three residuals,
in order.** `ABC-115` is merged and sits in `Ready for UAT`, **unsigned**. This hop does NOT touch it.

QE ruled `G-QE115-3` a knowingly-open residual and handed it to Architect/Design and `ABC-108`
**by name**. That hand-off is the whole reason this task exists: the disposition QE could make was
"name it with an owner", and you are the owner. **Ruling it is not the same as closing it — if the
honest answer is that it stays open with a named shape and a cost, say that plainly and write no
mechanism.**

## Read first (re-derive; nothing in this brief is evidence)
- `.grugops/context/qe-ABC-115-repair-2026-08-21/notes/` — especially the `decision` note on
  `G-QE115-3` and the `observation` note carrying the three CPU measurements. **All unstamped**
  (`human_admission` is `off`): claims to re-measure, not facts.
- `plans/nfr-catalog.md` — the `N8-SPAWN` account (created 2026-08-15 on the owner's instruction),
  the `NFR-002` boundary block, the `ABC-077` ruling, and **`OQ-1`'s own ruling of 2026-08-19,
  which is yours**: `N8-LANE` is a rate limit, not a grant, and `NFR-008`'s CPU clause is breached
  at 14.480 s against 13 s.
- `plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md` — where the lane's total is
  already under open question.
- `src/cli.test.ts` — the `N8-LANE`/`N8-SPAWN` pin row (`17 + 7`), and how the count clause is
  asserted while the other two are not.
- `AGENTS.md` — why the `ENGINE_DEEP` lane is opt-in and the default lane runs on an injected clock.
- `memory-bank/50-decisions/` — house ADR form; `ADR-0016` is the latest id in the tree.

## What you must settle
1. **Whether the `<= 2.0 s` added-wall and `<= 0.30 s` added-CPU-per-child clauses should be
   asserted by anything mechanical at all** — or whether an account whose only mechanical pin is its
   count is the correct, intended shape. Both answers are available to you. Argue the one you pick.
2. **If they should be asserted: name the shape.** QE says the only arguable shape is an opt-in
   lane with an instrument and an interleaved-paired-run protocol that **does not exist today**.
   Say what would have to be built, what it costs, who owns it, and whether that is `ABC-108`'s or a
   ticket of its own. **Name the ticket you would have cut — do not cut it. Cutting is BA/PM's pen.**
3. **If they should not: rule the clauses non-mechanical by design and say what replaces the gate** —
   a re-measure obligation on a named trigger, or nothing, and who carries it. A residual with no
   carrier is how this factory has lost items before.
4. **Whether an ADR is owed.** If the ruling changes what the project guarantees about its own
   budgets, write `ADR-0017` in house form and link it. If not, **say so and write none.**

## Fences
- **Do not touch `src/`.** Zero files. No test added, deleted, trimmed, moved or re-titled.
- **Do not move any target, bar, level, floor, account, instrument, statistic, null control or
  `UNKNOWN - verify` marker in `plans/nfr-catalog.md`.** The eight rows `NFR-001`–`NFR-008` must
  stay byte-identical at `sha256 63f66795…ca31` — **verify it by hashing, do not promise it.**
  `NFR-008`'s 3 s wall / 13 s CPU level is Olger Oeselg's, ratified in person; rule against it if
  you must, never edit it.
- **Do not re-open** `G-QE115-1`, `G-QE115-2`, the exit-code ruling, `ADR-0016`, or `ABC-115`'s
  size/priority. Do not re-open QE's PASS.
- **Do not move `ABC-115`** — it stays `Ready for UAT`, unsigned, and no agent signs it.
- **Do not grade `NFR-008` or claim an `N8-LANE` line.** That is `ABC-108`'s and it is open.
- Do not merge to `main`, do not deploy. Work in your own `git worktree`, commit on
  `grugops/residual-gqe115-3`.
- If your ruling implies an edit to `AGENTS.md`, **name the edit owed and its owner** — `ABC-109`
  is live against that file and under a byte cap.

## Test notes you will want
The default lane at the repo root is contaminated by leftover agent worktrees (`ABC-050`). Use
`npx vitest run --dir src`. The contained reading at the tip is **40 files / 1213 tests / skip 0**,
green. Any measurement you take, take at your own hand and say which tree and which commit.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible from you). **State the ruling explicitly in a `decision` note**, in terms
that let a later hop overturn it on the same evidence. Append your `plans/traceability.md` row with
any ADR id and NFR ids touched. Record any board move you make — I expect none.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/residual-gqe115-3`, move this
file in, then out to `done/`.
