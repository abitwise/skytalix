---
task: ticket-to-pr-ABC-025
subtask: ticket-to-pr-ABC-025-qe
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/ticket-to-pr-ABC-025/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T16:05:41Z
branch: grugops/ticket-to-pr-ABC-025
---

# Subtask: QE gate on `ABC-025` — break the net that was written to catch six wrong builds

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Six notes are there; the ones that will shape your hop are BA/PM's two from the cut (13 mutant
verdicts and the census), the Engineer's five (what he built, and the `N5` breach he reported against
himself), and my two (the DoR gate, and my own reproduction of that breach).

Claim per `agent-factory/workflows/17-task-claim.md` first. `scripts/claim.js` does not exist here —
verify at the source, then take the claim by hand with an atomic `mkdir`, as three hops before you did.

## The job

`ABC-025` exists because `ABC-013`'s acceptance net could not see six wrong builds. **The question
for this hop is whether THIS net can be fooled the same way.** Two roles have now scored the same 13
mutants and agreed exactly. That agreement is worth something, and it is also the thing most likely to
be a shared blind spot: both derived their mutant set by reading `ABC-013`'s criteria and QE's five.

Your predecessor on `ABC-023` ran 67 mutants over three tree states and found **fourteen** builds that
passed every criterion where the ticket predicted two. On `ABC-013` your predecessor disbelieved a
premise three hops had written down and closed the ticket's largest risk with an external oracle. That
is the standard.

## Explicit non-instructions — the scoping error I am not repeating

- **No file-count bar, no row-count bar, no line-count bar.** On `ABC-013` I capped the QE diff at
  three files; QE honored it, proved five gaps and could not close them, and those five gaps are the
  reason this ticket exists. **If you find a gap, you may close it.** Adding rows is in scope.
- **`N5` (the ≤5% runtime bar) is BREACHED and OPEN, and it must not constrain your coverage
  decisions.** Measured ~10.3% by me independently, ~12.5% by the Engineer. Its owner is BA/PM and it
  is going back to them. If the right rows make the breach larger, write them and report the number —
  do not trade coverage against a bar that is itself under review.
- Do not re-open `ABC-013`, `ADR-0004`, or `EPIC-003`'s `parseSan` contract. Do not add any oracle as
  a repository dependency; install outside the repo and assert `package.json` / `package-lock.json`
  come back byte-identical.

## What the verdict must contain

- PASS / PASS_WITH_RISKS / FAIL, with each risk carrying a named owner and a trigger.
- The mutant set you ran, and how you chose it — including any class the two prior hops did not touch.
- Whether the four behaviour-equivalent controls (`Q22`, `Q24`, `Q29`, `Q40`) are still alive. A row
  that kills one is pinning implementation shape, not behaviour.
- Whether `A2`'s census can pass vacuously, and whether `A1` read the qualifier back out of the
  emitted string rather than asking the module for it (`## Test notes` 2 and 3 — if either was written
  as a second copy of the procedure under test, it agrees with the code by construction and cannot
  falsify it).
- `A6` re-checked on your own instrument: `src/san.ts` md5, additions only, no existing row modified.

## Publish

Typed notes into `ref:notes/` per Workflow 16, honest kinds only — a `finding` needs a real
`§14-gate#<id>` stamp; without one, record a `claim` or `observation` and say which. Update
`plans/traceability.md`'s `ABC-025` test cell. The `In Review` exit is yours: move the board row and
the ticket front matter yourself when your verdict supports it, one line, and archive the outgoing
`_Updated:` header verbatim to `plans/tickets/history/ABC-025-board-history.md` first.

Commit on this branch per `agent-factory/_commit-convention.md`. Never commit on `main`. Never merge.
Never deploy.
