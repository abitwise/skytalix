---
task: refinement-abc065-wording
subtask: refinement-abc065-wording
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-abc065-wording/
parent_ref: .grugops/context/pull-abc065-066-2026-08-16/
enqueued_by: orchestrator
enqueued_at: 2026-08-16T04:00:00Z
branch: grugops/refinement-2026-08-16
base: main @ 5cf86d3
id_range: ABC-068 … ABC-071 (yours alone — no other hop may use these)
---

# Subtask: five queued items from the `ABC-065` lane — `Q7`, `Q9`, `Q10`/`G8`, `G9`+`G11`, `G12`

**Read `parent_ref:` FIRST — in particular the ruling note on `G8`–`G12` — then
`.grugops/context/quality-gate-ABC-065-qe/notes/` and
`.grugops/context/ticket-to-pr-ABC-065-guard/notes/`.** All on disk. **I relay nothing**; the
routing line under each item below is a pointer, not evidence, and the notes outrank it.

## The five, and what is already ruled

The Orchestrator has already RULED on `G8`–`G12` — read that note before you re-open anything. Your
job is the **wording repair and the ticket**, not a re-litigation of the ruling. Where the ruling
settles a question, cite it; where it leaves one open, that is yours.

1. **`Q10` / `G8` — the moved content fence.** `ABC-065`'s `A2` pins a line range that named
   `ABC-042`'s row, and the merge of `ABC-066` moved it. QE ranked this **"BA/PM's pen, once"** —
   the durable repair is a criterion that names CONTENT, not line numbers. Whether that is a
   re-word of `A2` in place on a merged ticket, or a new ticket, is **yours to decide and record**.
2. **`G9` + `G11` — the helper documentation debt, ONE ticket.** `G9`: a comment says "THESE TWO
   HELPERS" and there are four. `G11`: `advertisedTextOf` returns garbage silently while its sibling
   `usageLineOf` throws. The Orchestrator ruled these are one ticket and that **nobody sneaks the
   fix in** as a drive-by. Honour that: the ticket must make the divergence a decision, not a tidy.
3. **`G12` LOW — the stale dependency.** Third confirmation; still BA/PM's.
4. **`Q7`** and 5. **`Q9`** — QE's remaining `ABC-065` gaps. Read them in
   `.grugops/context/quality-gate-ABC-065-qe/notes/` (the gaps-found and the `advertisedTextOf`
   notes) and refine each: dedupe against the five above and against the live Backlog before cutting
   anything.

## What you own

- **Dedupe first, cut second.** The Backlog already holds `ABC-057`…`ABC-064`, several of them about
  this exact guard surface. **An item that is already ticketed gets a note saying so, not a
  duplicate.** Say plainly how many of the five survived deduplication.
- Cut the surviving tickets inside `ABC-068`…`ABC-071`. **Fewer than four is a good outcome** if the
  subjects genuinely fold; more than four is a stop condition, not a reason to borrow an id.
- Each ticket: acceptance criteria that are testable, size, priority, epic, and a `DoR n/10` reading
  with every ⚠️ named.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-06[89]-*.md`, `plans/tickets/ABC-07[01]-*.md`, and your notes
  under `ref:`. **Never an id outside your range.**
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. Report the rows
  you want.
- **Editing a MERGED ticket page** (`ABC-065`, `ABC-066`) to repair its wording is allowed ONLY for
  `Q10`/`G8` and ONLY if you rule that way — and if you do, **say in the ticket that a merged
  criterion was re-worded after the fact and why that is honest**, so nobody later reads a
  retrofitted criterion as one the build hop met.
- **Do not fix any of the five.** No edit to `src/`, `AGENTS.md`, or any test.
- **Do not run git.** No `add`, no `commit`, no branch, no worktree. Two sibling agents share this
  working tree and one index; the Orchestrator commits once, at the end.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (this project's process rule 2)

Acceptance criteria, scope and risks in the ticket; measurements, rejected alternatives and gate
narration into `ref:` notes. Median ≤300 lines per ticket page.

## Stop conditions

- A ticket would be XL → `SPLIT_REQUIRED`, stop.
- The `G8`–`G12` ruling looks wrong to you → **stop and route it back to the Orchestrator with your
  reading.** Do not quietly write a ticket that contradicts a live ruling.
- Two items turn out to be the same defect → fold them and say so; that is a result, not a failure.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-abc065-wording/`, write `claim.md` inside
it, `mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: how many of the five survived dedupe and against what; every ticket id and title; the board
rows you want; and every gap with severity and owner.
