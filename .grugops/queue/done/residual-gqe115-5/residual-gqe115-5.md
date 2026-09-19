---
task: residual-G-QE115-5-2026-08-21
subtask: residual-gqe115-5
role: qe-e2e
workflow: agent-factory/workflows/05-quality-gate.md (guard audit; no ticket)
ticket: none (residual against plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md, Done)
ref: .grugops/context/residual-G-QE115-5-2026-08-21/
enqueued_by: orchestrator
enqueued_at: 2026-08-21T11:00:00Z
branch: grugops/residual-gqe115-5
base: main @ e4a5c48
---

# Subtask: rule `G-QE115-5` — `ABC-066`'s derived refusal guard is blind to the child `ABC-115` added, and the blindness is what keeps it green

**The project owner authorised this hop by name in session (2026-08-21), third and last of three
residuals, in order.** `ABC-115` is merged and sits in `Ready for UAT`, **unsigned**. This hop does
NOT touch it, does not move it, and does not sign it. **You are not re-running `ABC-115`'s gate.**

## The residual, stated exactly (re-derive it; this is not evidence)
`src/cli.test.ts`, the `ABC-066 — A1/A2/A3` row. It derives its subject rather than listing it:

```ts
const refused = Object.values(CHILDREN).filter(
  (child) => child.status !== 0 && !/internal error/i.test(child.union),
);
expect(refused, "the captured refusal children").toHaveLength(6);
```

`child.status` is the **wrapper's** status. `ABC-115`'s new `A10` child is
`/bin/sh -c '<product> …; echo NODE_EXIT=$?'`, so its wrapper exits **0** while the product inside
exits **1** — `USAGE_EXIT_CODE`, with a raw stack on stderr and **no usage line at all**. The filter
does not see it and `toHaveLength(6)` still holds. A previous hop measured that a
wrapper-transparent derivation turns 6 into 7 and reds the row.

**Read the row's own comment before you touch it.** It says a listed set *"would go stale the day a
further criterion refuses a command line this row cannot see."* That day arrived, and it arrived to
the derivation the comment was defending. Say so plainly in your notes whichever way you rule.

## The thing that makes this hard, and you must not rule around it
Making the guard honest may red an `ABC-066` row — because the product genuinely does exit `1` with
a stack and **no usage line** on a failed non-`EPIPE` stdout write. That behaviour is **the residual
BA/PM accepted by name on 2026-08-21**; it is not new, not a regression, and not yours to re-open.
So the question is which of these is true, and you must pick one and argue it:

1. **The guard is correctly scoped and the blindness is honest** — `A10`'s child is not a *refused
   command line*, it is a failed write, so it was never `A1/A2/A3`'s subject. If so, the derivation
   must say that **in its own terms**, not by accident of reading a wrapper status. Make the
   exclusion explicit and principled, or explain why the current filter already is one.
2. **The guard is stale and `ABC-066`'s criterion is now false about the product** — there exists a
   non-zero product exit, not marked an internal error, that advertises no usage line. If so, the
   guard should see it, the row goes red, and **that red is a real finding about a `Done` ticket**.
3. Something else you measured.

**If the honest answer is (2), do NOT make it green.** Report it, leave the tree in a state you can
defend, and hand it up. Turning a red guard green by narrowing it is the exact failure this residual
is about.

## Fences
- **Weaken nothing.** No assertion removed, loosened, or narrowed to dodge a red. If your change
  makes any row easier to pass, stop and say so. Zero assertions deleted.
- **Zero production files.** `src/` production code is not opened for writing; `src/cli.ts` stays
  byte-identical. `git diff --numstat` under production sources must be empty.
- **Do not re-open** `ABC-115`, `ABC-066`'s merged delivery, the exit-code ruling, `ADR-0016`,
  `G-QE115-1`, `G-QE115-2`, `G-QE115-3` (ruled today, branch UNMERGED — do not branch off it, do not
  cite it as landed) or `G-QE115-4` (corrected today on `grugops/residual-gqe115-4`, also UNMERGED
  and touching this same file's comments — **branch off `main`, not off it**).
- **Do not re-open the accepted stdout-write residual** and do not propose a wider product arm.
- **Do not cut a ticket.** If one is owed, **name it with a size, a priority and an owner** and
  leave it uncut — that is BA/PM's pen and the owner's call.
- Do not touch `AGENTS.md` (`ABC-109` live, byte cap), `plans/nfr-catalog.md`, or `plans/board.md`.
- **Do not add a spawn.** The `N8-LANE` pin (`17 + 7`) and the one-`spawnSync`-call-site pin stay
  green and untouched; a new child would charge `N8-SPAWN` and today's `G-QE115-3` ruling names a
  re-measure trigger (`T2`) for any hop that changes what an existing child does. **If your change
  touches an existing child's behaviour, `T2` fires and you re-measure.**
- Do not merge to `main`, do not deploy. Own `git worktree`, commit on `grugops/residual-gqe115-5`.

## Gates
Lint, typecheck, build, unit — all four, at the branch tip, numbers reported. Contained reading is
`npx vitest run --dir src` (the root lane is contaminated by leftover worktrees, `ABC-050`).
Baseline at `e4a5c48`: **40 files / 1213 tests / skip 0** green, `test-skip-integrity` `No findings.`

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` is admissible from you). The ruling goes in a `decision` note, in terms a later hop
can overturn on the same evidence. Include the measured before/after of any derivation you change.
Append your `plans/traceability.md` row. Record any board move — I expect none.
Claim by hand per Workflow 17: bare `mkdir .grugops/queue/claimed/residual-gqe115-5`, move this
file in, then out to `done/`.
