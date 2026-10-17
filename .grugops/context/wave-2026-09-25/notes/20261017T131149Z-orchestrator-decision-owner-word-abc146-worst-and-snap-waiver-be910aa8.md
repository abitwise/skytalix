---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-17T13:11:49Z
sealed: false
refs: [ABC-146, QE2-101-b]
---

# Owner word, 2026-10-17 — two answers

The owner said verbatim: **"ABC-146: yes it can run, use the wors timings ; it can if you can validate yourself"**.

1. **ABC-146 (A0 route rule):** the verdict may run inside vitest (route V); the projection uses the **worst** of the five paired readings
   (route V iff 10 h × worst factor ≤ 13 h). This confirms the page's default; no page edit needed.
2. **QE2-101-b (snapshot-only waiver):** a ticket whose only non-test `src/` change is a regenerated `src/__snapshots__/*.snap` **keeps the
   zero-production-lines UAT waiver, provided the Orchestrator validates the snapshot diff itself** — reads every changed snapshot body,
   confirms each change is the one the ticket's criteria call for, and records that reading in the Done note. If any change cannot be
   explained from the criteria, the waiver does not apply and UAT goes to the owner.
