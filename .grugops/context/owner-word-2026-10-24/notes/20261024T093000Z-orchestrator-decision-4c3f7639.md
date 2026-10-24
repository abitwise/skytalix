---
id: 20261024T093000Z-orchestrator-decision-4c3f7639
kind: decision
by: orchestrator
at: 2026-10-24T09:30:00Z
verified_by: 
confidence: high
refs:
  - qe-ABC-212
  - qe-ABC-206
  - qe-ABC-204
  - ABC-205
  - EPIC-008
  - NFR-008
  - qe-timing-ABC-203/…1dc2eccc
supersedes: 
seal: sha256:01a7a611a69dffcecf856e08c33f6a9e3869105a8f2a2063913d026722cb9a5c
---

# The owner's in-session word on timing runs. A transcription, not a stamp

Verbatim: *"if you already ran timings, the previous results can be used, if not then these timing runs can run and write the results. No more runs needed after that."*

- **Prior results:** checked. No valid timing reading exists for ABC-212 (A4 ENGINE_DEEP), ABC-206 (A4/G6/G8/perft rate), ABC-204 (A5, baseline R, A/A D) or ABC-205 (G6, D): every SE/Architect note says "not run" or "host not quiet, no wall-clock figure here is a reading". So nothing can be reused.
- **Rule from now:** each of the four pending runs (`qe-ABC-212`, `qe-ABC-206`, `qe-ABC-204`, then ABC-205's G6 + D reading) runs **once**, under the existing preconditions (AC, quiet host, alone), and its written result is final. The procedure's own defined steps (e.g. EPIC-008 S1's one pooled extension) are part of that one run.
- **No more runs after that:** no re-reading for staleness (EPIC-008 § "When a D reading goes stale" does not trigger a re-run for these branches), no repeat on UNRESOLVED/NOT MET — a NOT MET result is graded as the ticket's rules say (e.g. no GAIN → ABC-205 does not ship). The full-lane NFR-008 catch-up reading named in `…1dc2eccc` is dropped.
- My reading of scope (veto open): this governs the six current branches. Future EPIC-008 tickets (ABC-207, ABC-215…) still carry their own single reading, since measuring strength is that epic's purpose.
