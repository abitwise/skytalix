---
task: ticket-to-pr-ABC-062-2026-08-17
subtask: abc062-refusal-argvs
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/abc062-refusal-argvs/
parent_ref: .grugops/context/ticket-to-pr-ABC-062-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T13:50:00Z
branch: grugops/abc062-refusal-argvs
base: main @ 4c5e19e
---

# Subtask: `ABC-062` — name the two untested argvs at the resolver

## The page is authoritative and it was re-cut TODAY

`plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md`. **The filename is stale by
design** (stable key, merged notes cite the path) — **read the `title` field, not the filename.**

**Live criteria: `A1`, `A2`, `A6`, `A7`. `A3`, `A4` and `A5` are STRUCK and their ids are RETIRED —
do not implement them, do not renumber into them, do not "restore" them.** They were struck for
being **already delivered** by `ABC-042` and `ABC-066`, each with its deliverer named in the page's
`## Struck criteria` section. If you find yourself about to assert the usage line's tokens, or that
deleting `${USAGE}` reds, or that refusal children write no frame rows — **stop, you are re-doing
merged work.**

## Read before you write

- `parent_ref:` — the Orchestrator's `Ready for Dev` criteria review, with first-hand mutant runs.
  **It contains a documented ERROR: its `G-2` on `A3` was wrong and BA/PM overruled it with a
  measurement.** The note is kept as written. Trust the page over that note where they differ.
- `.grugops/context/recut-ABC-062-criteria/notes/` — BA/PM's three notes: the adoption provenance,
  the `A3` vacuity measurement, and the re-cut decision.

## The work

One new `it` block in `src/cli.test.ts`. `A1` and `A2` name `["--colour"]` and `["white"]` at
`resolveOptions`, asserting `.ok`, `.problem` and `.offending`. `A7` asserts the two `.problem`
values DIFFER.

**Write `A1`'s mutant first and watch it RED.** It is the ticket's only mutation witness now:
`next ?? token` → `next as string` at `src/cli-options.ts:130`. **It ships 863/863 GREEN on `main`
at `4c5e19e` — measured by the Orchestrator, twice. If your guard passes with that mutant applied,
your guard is not a guard.** Run it in a throwaway worktree OUTSIDE the repository.

**`MISSING_VALUE` and `UNRECOGNISED` are module-private at `src/cli-options.ts:92-93` and exporting
them is a production line this ticket does not have.** BA/PM caught itself about to recommend that
and rewrote the note; do not walk back into it.

## Fences

- **Zero production lines.** `src/cli.ts` and `src/cli-options.ts` are READ, never edited. `A6` is
  `git diff --name-only` showing **exactly** `src/cli.test.ts`.
- **Zero new child processes.** `spawned` stays pinned at `10` (`src/cli.test.ts:933`); an eleventh
  is a defect.
- **`ABC-066`'s block at `:949-984` stays byte-identical**, as do `:315`, `:325`, `:410`, `:545`,
  `:750`. Do not add a line inside a merged block.
- **Do not fold the two argvs into the near-miss family at `:410`** — that family is complete over
  position and derived from the table; hand-picked members change what a merged criterion means.
- `N8-LANE` ≤ 650 ms, MET at 152.5 ms today; do not move it.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`.
Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task dir.

Commit on `grugops/abc062-refusal-argvs`, never on `main`. Do not merge — report back for the gate.
