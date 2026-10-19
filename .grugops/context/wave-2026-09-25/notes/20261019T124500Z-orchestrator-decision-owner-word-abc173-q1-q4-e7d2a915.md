---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T12:45:00Z
sealed: false
refs: [ABC-173, ADR-0008, NFR-008]
---

# Owner word, 2026-10-19: ABC-173 Q1–Q4

The owner answered three questions, verbatim:

- **Q1** — *"what does '2GB of memory' mean?"*
  - **Answer:** "Summed heap limit (Recommended)".
  - **Meaning:** Σ `heap_size_limit` of the live isolates ≤ 2048 MiB. RSS is reported but not gated.
- **Q2** — *"what does '2 CPU cores' mean?"*
  - **Answer:** "if 2 workers/executors then each will have 1 cpu core."
  - **Reading:** 2 busy executors, each counted as one core. This is today's `maxWorkers: 2`, and the main thread counts as overhead. Q2 is therefore BA/PM's recommended reading, worded by the owner. A hard 2.0-core total with `maxWorkers: 1` is **not** what he chose.
- **Q3/Q4** — *"scope and trade-off"*
  - **Answer:** "All lanes; ask me on breach (Recommended)".
  - **Meaning:** all 10 `AGENTS.md` vitest lanes are covered. If a lane hits OOM under the cap, or `npm test` breaches its 10 s wall bar, **nothing gives way without his word**.

**Result:** ABC-173's DoR item 10 now waits only on the ADR-0008 addendum (Architect).
