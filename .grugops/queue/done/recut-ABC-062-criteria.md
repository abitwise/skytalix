---
task: ticket-to-pr-ABC-062-2026-08-17
subtask: recut-ABC-062-criteria
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/recut-ABC-062-criteria/
parent_ref: .grugops/context/ticket-to-pr-ABC-062-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T13:35:00Z
branch: grugops/recut-ABC-062-criteria
base: main @ 48a00cf
---

# Subtask: re-cut `ABC-062`'s acceptance criteria — three of six are vacuous against today's tree

## Read this first, and do not re-measure it

**`parent_ref:` holds one `observation` note: `…-orchestrator-observation-criteria-review-at-ready-for-dev-exit-4b1e77a2.md`.**
It is the `Ready for Dev` exit criteria review (project process rule 1) and it carries **first-hand
mutant runs**, not readings. Take its measurements as given; your job is the page, not the probe.

The short of it: `ABC-062` was cut **2026-08-15**. `ABC-066` landed afterwards in the same file and
**already delivers `A4` verbatim and `A5`'s red**. `A1` and `A2` are still real — the `A1` mutant
ships **863/863 green** on `main` today and the program stack-traces where the usage line belongs.

## What to change on `plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md`

1. **Strike `A4` and `A5`, naming `ABC-066` and the line that delivers each** (`src/cli.test.ts:982`
   for `A4`; the `usageLineOf` extraction at `:190` for `A5`'s red). Strike them — do not restate them
   as something adjacent to keep the count at six. A criterion that a merged ticket already meets is
   not this ticket's work, and **`ABC-042`'s and `ABC-066`'s merged rows are not to be edited,
   widened or re-interpreted** — the existing out-of-scope fence still binds.
2. **Narrow `A3` to its unmet residue** (gap `G-2`): the six refusal children derived at `:954` have
   their **stderr** line asserted but **not** that their **stdout carries zero frame rows**. The
   hand-listed four at `:418` do assert it; the derived six do not. This is one assertion, not a block.
3. **Delete `## Scope` bullet 2** (gap `G-4`) — "a new `it` block asserting the usage line over the
   refusal children already captured at module scope" is `ABC-066`'s block, already written.
4. **Fix the stale `USAGE` quotation** (gap `G-3`): `src/cli.ts:58` reads
   `usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]`. The `--` separator
   is load-bearing and is `ABC-066`'s subject.
5. **Correct the drifted line references** (gap `G-5`): `:401` → `:410`, `:780` → `:933`,
   `:477` → the `:545` region. **`src/cli-options.ts:130` is still correct — leave it.**
6. **Re-size and re-price.** With `A4`/`A5` gone and `A3` reduced to one line, `S` (2) is probably now
   `XS` (1). Say what you decide and why. `P1` should survive — the `A1` defect is live and its
   failure shape is a stack trace where a help sentence belongs — but re-state the reason against
   what is LEFT, not against what was cut.

## Fences

- **Zero production lines and zero test lines.** You edit `plans/tickets/ABC-062-*.md` and nothing
  else. Do not write `src/`.
- **Do not re-open `ABC-042`, `ABC-061` or `ABC-066`.** All merged, both gates passed.
- **Do not delete the record of why the criteria shrank.** A future reader must be able to see that
  `A4`/`A5` were cut because a later ticket delivered them, not because they were hard.
- **Re-run the Definition of Ready** (`agent-factory/checklists/definition-of-ready.md`) on the
  narrowed page and record the score. It was 10/10; say what it is now.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory.

Commit on `grugops/recut-ABC-062-criteria`, never on `main`.
