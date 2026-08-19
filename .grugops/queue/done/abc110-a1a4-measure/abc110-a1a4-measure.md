---
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
subtask: abc110-a1a4-measure
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-110-close-the-default-lanes-1480-ms-cpu-deficit.md
ref: .grugops/context/ticket-to-pr-ABC-110-a1a4-2026-08-20/
parent_ref: .grugops/context/design-oq1-lane-budget-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T12:00:00Z
branch: grugops/abc110-a1a4-measure
base: main @ HEAD
---

# Subtask: `ABC-110` `A1`–`A4` ONLY — measure, assemble, price, and STOP at the fence

`A1`–`A4` are pullable today; `A5`–`A9` are NOT and you must not touch them.
**`A5` is a hard fence on a HUMAN decision. You produce what the owner needs to decide. You do not
decide, and you do not move a single test file into another lane.**

## Read first, do not re-derive
- The ticket page in full — every measurement on it is Architect/Design's, already published.
- `parent_ref:` — `design-oq1-lane-budget-2026-08-19/notes/` including the raw per-run TSVs.
- `plans/nfr-catalog.md` § the `NFR-008` row and its `OQ-1 IS RULED` note; `ADR-0014`; `ADR-0008`.
- `.grugops/context/cut-lane-remedy-2026-08-19/notes/` — BA/PM's sizing of the options.

## What is yours
- **`A1`** — paired median CPU delta at **n = 8** per `NFR-008`'s own protocol, out of tree, for each
  candidate file removed. Identity null control **≤ 1.5%, sign at chance, recorded BEFORE you look at
  the treatment**. A per-file in-worker time is INADMISSIBLE as a saving — if you report one, report
  it as inadmissible.
- **`A2`** — the candidate set whose MEASURED savings sum against **1.480 s**, with the residual as a
  number. **If no admissible set closes it, that is the result.** Do not close it by other means.
- **`A3`** — reject on the page, with the arithmetic, any proposal that trims assertions in a
  retained file. ~4.2 s of 14.5 s is the whole per-file in-worker sum; only a whole-file move removes
  a floor.
- **`A4`** — for every candidate, list **each acceptance criterion it answers, by id**, and mark each
  *still answered in the default lane* or *would move behind a flag*, with the resulting count.
  *"Coverage preserved" is not an answer.*

## Fences — refuse these, in writing, if they tempt you
- **`isolate: false`** is UNAVAILABLE (`ADR-0008`: 30–36%, disarms three `*.nfr.test.ts` guards).
  This is the FIFTH time it is written down. Do not rediscover it.
- **Do not move `NFR-008`'s 13 s / 3 s level.** The owner's outright.
- **Do not rule the WALL clause.** It is routed to BA/PM in this same wave as its own ticket and is
  an INPUT to `A6`, not part of your work.
- **Do not re-derive `N8-LANE`'s 5%** and do not re-cut any ticket's `N8-LANE ≤ 650 ms` line.
- **Do not delete, thin or consolidate a test.** **Do not move any file between lanes** (`A5`).
- **Do not touch `AGENTS.md`** — `A9` is not yours and `ABC-109` is live in that file.
- **Do not open `plans/nfr-catalog.md` for writing.** `A7`'s hash `sha256 63f66795…ca31` over the
  eight rows must be byte-identical across your whole diff — **verify it, do not promise it.**
- No production code, no `package.json`, no `vitest.config.ts`. **The harness runs OUTSIDE the
  repository and is not committed** — that is `NFR-008`'s own stated firing threshold.
- Do not merge, do not deploy, do not move a board column, do not edit the DoR table.

## Measurement hygiene, learned the hard way here
- The repo root is contaminated (`ABC-050`); use a contained lane. Watch the `vitest.config.ts`
  worktree trap in the ticket's `## Test notes`.
- **Do NOT claim a quiet machine.** `ABC-108`'s `A1` was ruled UNSATISFIABLE for exactly that:
  a load threshold sampled during a self-parallel harness measures the harness. The shape that
  WORKED and that you should reuse — **measure load SENSITIVITY and SIZE the contamination.**
- Baseline tripwire: **1181 tests**, skip 0, per the ticket. Assert file and test counts per run.

## Stop and publish
When `A4` is answered, **STOP**. Publish typed notes per Workflow 16 into `ref:` — no `finding` is
admissible on this install; use `claim` / `observation` / `decision` / `artifact-ref`, hand-authored
per `agent-factory/contracts/context-note.md`. State plainly what the owner is being asked to choose
between, with each option's measured saving and its coverage price by criterion id.

Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/abc110-a1a4-measure`. Commit incrementally on
`grugops/abc110-a1a4-measure`, never on `main`.
