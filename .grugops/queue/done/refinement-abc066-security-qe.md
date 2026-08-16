---
task: refinement-abc066-security-qe
subtask: refinement-abc066-security-qe
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-abc066-security-qe/
parent_ref: .grugops/context/pull-abc065-066-2026-08-16/
enqueued_by: orchestrator
enqueued_at: 2026-08-16T04:00:00Z
branch: grugops/refinement-2026-08-16
base: main @ 5cf86d3
id_range: ABC-072 … ABC-074 (yours alone — no other hop may use these)
---

# Subtask: four queued items from the `ABC-066` lane — `S1`, `S2`, `Q3`, `Q4`

**Read `parent_ref:` FIRST**, then `.grugops/context/security-nfr-ABC-066/notes/` and
`.grugops/context/quality-gate-ABC-066-qe/notes/`. All on disk. **I relay nothing**; the routing
line under each item is a pointer, not evidence, and the notes outrank it.

## The four

1. **`S1`** — Security/NFR's own finding that `ABC-041` clause (b) is a **state** predicate, not a
   delta. This reading is already load-bearing: the Orchestrator used it to justify skipping
   Security/NFR on `ABC-065`, in a paragraph written to be argued with. **Refining `S1` therefore
   has a live consequence — if the reading is wrong, a gate was skipped on it.** Say so in the
   ticket if you find that.
2. **`S2`** — clause (b)'s one-limb instrument.
3. **`Q3`** — `A2` tightening.
4. **`Q4`** — whitespace.

## What you own

- **Dedupe first, cut second.** `ABC-058` in the Backlog is already "three security-bar instruments
  cannot observe their own clauses" and already carries `S1`/`Q5`, `S4`, `S5` — **check whether `S1`
  and `S2` belong on that existing ticket rather than on a new one.** Folding into `ABC-058` (by
  editing its page) is a legitimate and probably better outcome than cutting a near-duplicate; if
  you fold, say what you added and why it is not a scope creep on a ticket that is already `DoR
  9/10`.
- Cut whatever genuinely survives inside `ABC-072`…`ABC-074`. **Zero new tickets is an acceptable
  result** if all four fold into existing Backlog rows — report it plainly rather than manufacturing
  a ticket to look productive.
- Each new ticket: testable acceptance criteria, size, priority, epic, `DoR n/10` with every ⚠️
  named.
- **Note the ordering trap:** the four `EPIC-006` security tickets are marked ⚠️ "ordered behind
  `ABC-042`'s merge". Check whether that blocker is still real now that `ABC-065`/`ABC-066` have
  merged — and if it has cleared, that is a finding worth recording, not a silent DoR bump.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-07[234]-*.md`, `plans/tickets/ABC-058-*.md` (fold case only),
  and your notes under `ref:`. **Never an id outside your range.**
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. Report the rows
  and row-edits you want.
- **Do not fix any of the four.** No edit to `src/`, `AGENTS.md`, or any test.
- **Do not re-run or re-decide the Security/NFR verdict.** You refine its findings into work; you do
  not overturn a risk verdict. If `S1`'s reading looks wrong, **stop and route to Security/NFR** via
  the Orchestrator.
- **Do not run git.** No `add`, no `commit`, no branch, no worktree. Two sibling agents share this
  working tree and one index; the Orchestrator commits once, at the end.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (this project's process rule 2)

Acceptance criteria, scope and risks in the ticket; measurements, rejected alternatives and gate
narration into `ref:` notes. Median ≤300 lines per ticket page.

## Stop conditions

- A ticket would be XL → `SPLIT_REQUIRED`, stop.
- `S1`'s state-vs-delta reading looks wrong → **stop**; it is Security/NFR's, and a skipped gate
  hangs off it.
- The `ABC-042` ordering blocker's status is ambiguous → record it ambiguous, do not resolve by
  inference.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-abc066-security-qe/`, write `claim.md`
inside it, `mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: how many of the four survived dedupe and against what; every ticket id/title and every
existing page you edited; the board rows you want; and every gap with severity and owner.
