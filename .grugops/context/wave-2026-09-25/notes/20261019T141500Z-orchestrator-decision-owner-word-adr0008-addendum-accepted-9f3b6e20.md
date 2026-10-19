---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T14:15:00Z
sealed: false
refs: [ADR-0008, ABC-173, NFR-008]
---

# Owner word, 2026-10-19: ADR-0008 addendum (vitest heap ceiling) ACCEPTED

The owner answered two menu questions. Verbatim:

- **OQ1:** "Accept, two sizes (Recommended)".
  - SUITE runs use flag 128, which gives 224 MiB per isolate. Nine isolates come to 2016 MiB.
  - ONE-FILE runs use flag 400, which gives 496 MiB per isolate. Four isolates come to 1984 MiB.
  - The guard is `tools/grugops/heap-guard.js`, run as a globalSetup.
- **OQ3:** "Yes, every run (Recommended)".
  - Every vitest run in this repo carries the cap. That includes coverage, skip-count, single-file runs and `test:watch`.
  - A run without the prefix is refused.
- **OQ2** was not asked separately. The accepted two-size design counts workers that are still shutting down, with a reserve of 2. That is the recommended reading.

ABC-173's DoR item 10 is now discharged, so ABC-173 is 10/10. The status lines in the ADR were edited to ACCEPTED by the Orchestrator, citing this note.

For Security/NFR at ABC-173's gate:
- the proposed new catalog row NFR-010, "Test-lane V8 heap ceiling";
- the heap clause on NFR-008's stack declaration.
