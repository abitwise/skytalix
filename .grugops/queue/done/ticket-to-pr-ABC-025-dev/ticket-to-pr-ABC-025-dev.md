---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-dev
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T15:35:00Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: implement `ABC-025` — write the SAN qualifier minimality net

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Three notes matter and they are not interchangeable: the opening decision (where the evidence lives),
BA/PM's two notes from the cutting hop (the 13 mutant verdicts and the census you will build against),
and the DoR gate decision (what I checked myself, what I got wrong, and the one hard bar).

The ticket is `plans/tickets/ABC-025-san-qualifier-minimality-net.md`. It is unusually complete: 23
positions, 63 hand-typed strings and six criteria, all measured at the cut and cross-checked against
an external implementation. **Read `## Test notes` before you write a line** — nine notes, four of
them lessons this board has already paid for in defects.

Claim per `agent-factory/workflows/17-task-claim.md` first. `scripts/claim.js` does not exist in this
install; verify that at the source rather than inheriting it, then take the claim by hand with a plain
atomic `mkdir`, as prior hops did.

## What "done" means for this hop

`A1`–`A6` green, and green for the right reason. `A1`, `A3` and `A4` each name **the mutants that
must turn them red** and **the four equivalent controls that must stay green** — that is the
requirement, not "the tests pass". A row that kills an equivalent control is pinning implementation
shape rather than behaviour and must be rewritten.

Run the gates: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and the
`PERFT_DEEP=1` lane that `A6` requires. Commands are in `AGENTS.md`.

## The one hard bar, and it is the ticket's own

`A6`: `src/san.ts` still hashes `cbcc3be37c21414d16e8e6b4d0c68959`, no file under `src/` that is not
a `*.test.ts` is touched, **additions only**, no existing test row modified or deleted — verified with
`git diff -U0`, not by inspection.

**If a row proves the delivered code wrong, `A6` fails BY DESIGN.** Say so out loud, record it, and
stop — the defect gets its own ticket. Do not fold a production fix into a hardening ticket, and do
not adjust a test until it agrees with the code.

## Explicit non-instructions

- **No file-count bar, no row-count bar, no line-count bar.** `ABC-013`'s five gaps are open because
  I capped that ticket's QE diff at three files. Where the rows and the corpus live is your call,
  subject only to `## Test notes` note 1, which is a criteria-conflict rule and not a preference.
- I do not tell you how many tests to write. The ticket predicts ~+550 lines; that is a prediction
  BA/PM derived from measured precedent, and it is **not** a target. Missing it is not a failure —
  hiding that you missed it would be.
- Do not re-open `ABC-013`, `ADR-0004`, or `EPIC-003`'s `parseSan` contract. Do not add `chess.js` or
  any oracle as a repository dependency; if you use one, install it in a scratchpad **outside** the
  repo and assert `package.json` / `package-lock.json` come back byte-identical.
- The ticket's 23 positions and 63 strings are **material, not a bar** — its own words. Any set that
  satisfies `A2`'s census and `A3`'s discriminating requirement is acceptable, and this one is known
  to. If you find one of them wrong, that is a finding and it outranks the table.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only. A `finding` needs a real
`§14-gate#<id>` stamp; if you do not have one, record it as a `claim` or `observation` and say so.
Update `plans/traceability.md`'s `ABC-025` row (code and test cells) and move the board row yourself
only if your workflow owns that transition — otherwise leave it to the gate. Mark the subtask done
per Workflow 17.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
Never deploy.
