---
task: ticket-to-pr-ABC-068-2026-08-16
subtask: ticket-to-pr-ABC-068
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-068-2026-08-16/
parent_ref: .grugops/context/ticket-to-pr-ABC-068-2026-08-16/
ticket: plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T16:00:00Z
branch: grugops/abc068-helper-contracts
base: main @ f566304
---

# Subtask: write the two helpers' failure contracts — `ABC-068`, comments only

Read the ticket. Read `ref:` — it holds ONE Orchestrator note, the criteria re-read against the
built tree at the `Ready for Dev` exit. **That note corrects two "today" baselines on the ticket
page and one call-site line number that has drifted by 25 lines onto a merged guard. Read it before
you open the source.** Nothing from it is restated here.

## Hard limits on this subtask

- **Not one executable line.** Making `advertisedTextOf` throw is forbidden — the ticket's
  `## Out of scope` answers that question and the answer is no, and not here.
- **Do not re-flow, renumber or tidy the helper block.** `A5` is checked by reading the diff.
- **Do not touch `ABC-065`'s or `ABC-066`'s ticket pages, and do not re-open a criterion of either.**
- **Use no option name in any comment you write** — `A6`, and it reds a merged guard.
- **One path in the diff: `src/cli.test.ts`** (`.grugops/` excluded as process artifact).
- Measure the suite total on `main` BEFORE you change anything; `A5` compares two numbers.

## Definition of done for this subtask

`A1`–`A7` each answered with the number the criterion asks for, measured not asserted; gates
(`lint`, `typecheck`, `build`, `npm test`, test-integrity) run on your branch tip and recorded;
notes published per Workflow 16 under `ref:`, hand-authored per
`agent-factory/contracts/context-note.md` — **no `kind: finding`, no invented stamp; none is
emittable on this install** (`AGENTS.md`). Queue claim taken by hand per `AGENTS.md`. Do not merge —
the Orchestrator re-runs the gate itself and holds the merge.
