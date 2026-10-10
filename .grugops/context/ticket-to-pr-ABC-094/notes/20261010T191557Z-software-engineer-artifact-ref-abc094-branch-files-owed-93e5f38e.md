---
id: 20261010T191557Z-software-engineer-artifact-ref-abc094-branch-files-owed-93e5f38e
kind: artifact-ref
by: software-engineer
at: 2026-10-10T19:15:57Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - ABC-096
  - EPIC-005
  - src/book.ts
  - src/book.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-094-book-probe-lookup-weighted-choice-and-safe-failure.md
  - 20261010T191557Z-software-engineer-decision-abc094-injected-reader-and-warn-sink-probe-holds-no-limb-d14f72cb
  - 20261010T191557Z-software-engineer-observation-abc094-a1-a7-readings-clause-b-cost-gates-77180424
supersedes:
---

# `ABC-094`: branch, files, and what is owed

- **Branch** `grugops/ABC-094-book-probe` from `97223dfe`. Code commit `8cf395fc`; the docs commit
  (these notes, `probe/`, the trace row, the ticket's § Delivery) follows it. Not merged, not pushed.
- **`src/` numstat:** production `src/book.ts` **+153 / −0**; test `src/book.test.ts` **+359 / −0**. No
  other file under `src/` changes. The zero-production-lines waiver does not apply: **the owner's UAT
  word is owed.**
- **Owed by others:**
  - QE/E2E's hop (`In Review`), which is the Orchestrator's to dispatch; the board move is too (fenced).
  - `In Security/NFR`: clause (b) does not fire here; it fires on `ABC-095`, which binds `read` and
    `warn` in `src/cli.ts` (`…d14f72cb`). Whether to send this ticket anyway on its hostile-input
    content is the Orchestrator's call.
  - `ABC-095`: bind `warn` to stderr and assert it; resolve the artifact path; pass `Math.random` (D3).
  - The `NFR-008` narrow-set cost: two inadmissible readings; a re-read on a quieter host.
  - `ABC-096`: the `n` accessor was not built (optional, coding rule 5).
