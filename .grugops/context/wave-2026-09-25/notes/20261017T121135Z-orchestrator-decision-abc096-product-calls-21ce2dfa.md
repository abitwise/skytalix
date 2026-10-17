---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-17T12:11:35Z
sealed: false
refs: [ABC-096, ADR-0043]
---

# ABC-096 — the Architect's two product calls, decided under the owner's delegation (`…owner-word-abc096-specifics-delegated`)

1. **Name flicker (shown only on named positions, ~62.6% of in-book positions; ~3 on/off changes per book game): ACCEPTED.** Holding the last
   name needs frame-path state or a turn-loop change (S→M, ADR-0043 rejects both), for a P3 cosmetic field. UAT will see it; if the owner
   finds it unacceptable at UAT, that is a new ticket, not a re-open.
2. **Missing-book warning likely overdrawn by frame 0 on an in-place terminal: ACCEPTED, and made a UAT check.** Stderr still carries it
   exactly once (ABC-095 A5, ABC-096 A8 hold); a missing book is an install fault, not a play state. BA/PM writes it on the page as a
   named UAT observation, so the owner sees it rather than it being discovered.

Next: merge `design-ABC-096` (records only), then BA/PM `bapm-rescore-ABC-096` (item 10 discharged; NFR-007 now touched; A5 = "nothing";
names on empty-move entries; the two calls above).
