---
task: residual-G-QE115-4-2026-08-21
subtask: residual-gqe115-4
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md (docblock-only correction; no ticket)
ticket: none (residual disposition against plans/tickets/ABC-115-piped-session-dies-on-epipe-with-the-refusal-exit-code.md, merged)
ref: .grugops/context/residual-G-QE115-4-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T10:00:00Z
branch: grugops/residual-gqe115-4
base: main @ e4a5c48
---

# Subtask: correct `G-QE115-4` — the trap warning in `A10`'s docblock states the wrong failure direction

**The project owner authorised this hop by name in session (2026-08-21), second of three residuals,
in order.** `ABC-115` is merged and sits in `Ready for UAT`, **unsigned**. This hop does NOT touch
it, does not move it, and does not sign it.

QE found this at its own hand, ruled it non-blocking, PASSED the ticket anyway, and said in writing
why sending the ticket back on it would be *"the rule applied capriciously rather than evenly"*.
**That judgement is not being re-opened.** What QE also wrote is that the one-clause fix belongs to
whoever next opens the docblock. **You are that hop, and that is the entire job.**

## The defect, stated exactly (re-derive it; this is not evidence)
`src/cli.test.ts`, the `unwritableStdout` docblock, the paragraph beginning
**"THE TRAP, AND A ROW THAT FALLS IN IT IS GREEN ON EVERY BUILD"**.

Its premise is TRUE: the redirection binds `node` alone, the wrapper's status is the trailing
`echo`'s, and it is `0` on the fixed, unfixed and swallowing build alike. Its stated CONSEQUENCE is
FALSE **for this row**: `A10` asserts `not.toBe(0)`, so a version of the row that falls into the
trap is **RED on every build**, not green. Green-on-every-build is what you get when the assertion
is `toBe(0)`; that is the classic shape of the trap and it is not the shape here.

The instruction the block gives — read `NODE_EXIT=`, never `child.status` — is CORRECT and stays.

## What you must do
1. **Measure the direction yourself before you write it.** Mutate the row to read `child.status`
   in an out-of-repo copy, run it, and record what colour it goes and against which build. Do not
   take QE's table on trust and do not take mine. Restore and `cmp`-verify the tree afterwards.
2. **Correct the sentence** so it states what a trapped row actually does. QE's suggested clause is
   *"a row that falls in it discriminates nothing"*; you are not bound to that wording. Prefer the
   phrasing that would stop the next reader from making the mistake, and keep the true premise.
3. **Consider — and rule on, in a note — whether the paragraph should also say what shape the trap
   DOES catch** (`toBe(0)`), since that is the version a later hop might write. Add it or argue
   against it; do not leave it implicit.

## Fences — this is a comment fix and its whole value is that it changes nothing else
- **ZERO executable lines changed.** No assertion added, removed, loosened, re-ordered or
  re-titled. No test title touched. `A10`'s three `expect`s stay byte-identical. The `N8-LANE`
  spawn pin (`17 + 7`), the import census and the one-`spawnSync`-call-site pin stay untouched.
  **Prove this**: `git diff` stripped of comment and blank lines must be EMPTY. Show that command
  and its output in your notes.
- **Only `src/cli.test.ts` is opened for writing.** Zero production files. Do not touch
  `src/cli.ts`, `plans/nfr-catalog.md`, `AGENTS.md` (`ABC-109` is live against it under a byte cap)
  or `plans/board.md`.
- **Do not re-open** `ABC-115`, its exit-code ruling, `ADR-0016`, QE's PASS, `G-QE115-1`,
  `G-QE115-2`, or `G-QE115-3` — the last is ruled as of today on `grugops/residual-gqe115-3`,
  which is UNMERGED; do not branch off it, do not depend on it, do not cite it as landed.
- **Do not fix `G-QE115-5`** (`ABC-066`'s guard blindness). It is the next hop and it is not yours.
  If you see it, leave it.
- **Do not write a false sentence to replace a false sentence.** This residual exists because a
  true-sounding sentence was not true; `ABC-114` was cut for four of them. Every clause you write
  must be one you measured.
- Do not merge to `main`, do not deploy. Work in your own `git worktree`, commit on
  `grugops/residual-gqe115-4`.

## Gates
All four are mandatory and blocking: lint, typecheck, build, unit. Run them at the branch tip and
report the numbers. The contained reading is `npx vitest run --dir src` — the repo root lane is
contaminated by leftover agent worktrees (`ABC-050`). Baseline at `e4a5c48`: **40 files / 1213
tests / skip 0**, green, `test-skip-integrity` `No findings.` **A comment-only diff that moves any
of those numbers is a defect in your diff — stop and say so rather than explaining it away.**

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible from you). Include the measured mutation table as an `observation` and
the wording choice as a `decision`. Append your `plans/traceability.md` row. Record any board move
you make — I expect none.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/residual-gqe115-4`, move this
file in, then out to `done/`.
