---
task: ticket-to-pr-ABC-063-2026-08-17
subtask: abc063-uat16-six-verbs
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-063-uat16-six-game-verbs-named-in-no-test.md
ref: .grugops/context/ticket-to-pr-ABC-063-2026-08-17/
parent_ref: .grugops/context/sweep-ABC-063-064-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T15:52:00Z
branch: grugops/abc063-uat16-six-verbs
base: main @ 39d3c5b
---

# Subtask: `ABC-063` — the six UAT-16 verbs, by name, in one closed case list

Read `ticket:` for the work. Read the ONE `observation` note in `parent_ref:` before you open the
file — it is my `Ready for Dev` exit criteria review and it carries **first-hand measurements**, not
readings. Take them as given; do not re-derive them.

## What that note already settled, so you do not spend a hop on it

1. **No criterion of this ticket is already satisfied.** `grep -rn` across `src/` finds **zero** of
   the six verbs as an argv literal in `src/cli.test.ts`. The `e4` hits elsewhere are chess-move
   strings in the move/SAN/legal tests — a different noun. `0 of 6` stands.
2. **Every `:NNN` anchor on the ticket page is STALE.** The file is 1211 lines now. Corrected,
   measured against `main` @ `39d3c5b`:
   - `:353` → **`:435`** (`ACCEPTED_ARGUMENTS` equals the scope table, both ways)
   - `:372` → **`:525`** (the enumeration is the only argv literal in the resolver)
   - `:477` → **`:630`** (1000 generated tokens, 250 per shape)
   - `:780` → **`:933`** (`expect(spawned).toBe(10)`)
   - `:401` → **UNRESOLVED. Read it and decide what the page meant; do NOT guess.** The `ABC-062`
     hop produced a wrong anchor by filling exactly this kind of gap from memory. If you cannot
     resolve it with confidence, say so in a note and leave the page's bullet alone.

## The commit-sequencing trap — read this before you commit anything

`A4` requires `git diff --name-only <delivered>~1 <delivered>` to show **exactly**
`src/cli.test.ts`. It is worded **per delivered commit**, not per branch. So:

- **Commit 1 (the delivery): `src/cli.test.ts` and nothing else.** This is the commit `A4` is
  measured against.
- **Commit 2 (separate, same branch): the ticket page's anchor corrections** from the table above,
  plus a line saying they were corrected and against which commit they were measured. Do not fold
  this into commit 1.

## Fences

- **Zero production lines.** You write `src/cli.test.ts` (commit 1) and
  `plans/tickets/ABC-063-*.md` (commit 2). Nothing else.
- **Zero new child processes.** `spawned` stays **10** (`:933`). The six verbs are resolved by
  calling the resolver directly — never spawned. An eleventh child is a defect.
- **Do not touch `:435`, `:525`, `:630`** or the near-miss family. This ticket adds names BESIDE the
  class argument; it does not replace or weaken it.
- **Do not re-open `ABC-042`, `ABC-061`, `ABC-062` or `ABC-066`.** All merged, gates passed.
- **Keep this list separate from `ABC-062`'s two argvs.** Different scenario (UAT-16 vs UAT-10),
  its own named block, its own comment.
- **Do not derive the six.** They are UAT-16's literal words; a derivation goes stale silently,
  which is the defect `ABC-059` exists for.
- **`--help` is not folded in.** It is UAT-10 row g.

## Gate

`quality.gate_enforcement` is `blocking`. Run on the branch tip: `npm test`, `npm run lint`,
`npm run typecheck`, `npm run build`, and the test-integrity step
(`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` with `<N>` from
the reporter). Record the real numbers. **Do not merge — the Orchestrator holds the merge and
re-runs the gate on `main` after.**

Also report, as measurements: the `A1` case count (must be 6), the `A2` list length (exactly 6),
`spawned` (must be 10), the `A3` mutant result (add one of the six to `ACCEPTED_ARGUMENTS` — the
suite must go RED **here and at `:435`** — then revert it and confirm green again).

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/abc063-uat16-six-verbs` — that bare `mkdir` is the atomic act.

Commit on `grugops/abc063-uat16-six-verbs`, never on `main`.
