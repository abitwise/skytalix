---
subtask: bapm-rule-QE-177-ab
role: ba-pm
tickets: [ABC-177]
ref: .grugops/context/bapm-rule-QE-177-ab/
held: released 2026-10-21 (qe-ABC-177-timing ended)
---

# BA/PM: rule on QE-177-a and QE-177-b (records only)

The owner's word on 2026-10-21: "yes, BA/PM can rule on QE-177-a and -b".

## Read first
- `.grugops/queue/done/qe-ABC-177.md`.
- QE's open-points note `…02deb2e2` and its gap probes in `.grugops/context/qe-ABC-177/probe/`.
- The ABC-177 page.
- ADR-0046.
- Your step ruling `…e7b3c210`.

## Rule each gap: accept, or cut a test-only ticket
- **QE-177-a (LOW):** the A6 fold dropped the cross-session comparison. A build that shares `held` across sessions now survives the default lane.
- **QE-177-b (LOW):** with U7 at step 1000, a `go` that drops `depth`/`nodes`/`mate` and has no time token can have its budget cut to 2 500 ms unseen. The blind band grows from about 100 ms to about 1 000 ms.

## If you cut a ticket
- Use the next free id, ABC-178.
- It is test-only, and you score it against the DoR.
- **Cost the row against R-174-1 / NFR-008:** it must not re-break the ≤ 10 s lane. If it needs a step finer than ABC-177's, say so.
- Do not reopen ABC-177's scope.
- Also give an INFO ruling on QE-177-c, U8 at depth 1: is it fine as is, or should the literal go back to 10?

## Fences
- Records only: new ticket pages and your notes. Leave them uncommitted.
- No `src/`, ADRs, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- No lane runs and no timing. Never push or merge.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available.
- `.grugops/queue/done/bapm-rule-QE-177-ab.md` (brief + `## Result`) and `.claim.md`, uncommitted.
