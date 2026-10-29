---
id: 20261029T215000Z-orchestrator-decision-0c536e58
kind: decision
by: orchestrator
at: 2026-10-29T21:50:00Z
verified_by: 
confidence: high
refs:
  - bapm-epic009-tournament/…371570e0
  - bapm-epic009-tournament/…4d365276
  - bapm-epic009-tournament/…77ab69c0
  - EPIC-009
  - ABC-218
  - ABC-219
  - ABC-220
  - ABC-221
  - ABC-222
supersedes: 
seal: sha256:1cf72ea1a56ce27414023e879edea59ea2794c324e62b190e153a678d0e57ebf
---

# bapm-epic009-tournament reviewed and merged; ABC-218 Ready and not yet pulled

**Review:**
- Branch head `88d2ebe4`: 9 files (the epic, ABC-218..222, notes). 0 host-path hits.
- Merged `--no-ff` as `f45aea95`. The board lines from `…371570e0` are placed: EPIC-009 and ABC-219..222 in Backlog,
  ABC-218 in Ready (1/8). The trace row is appended.
- ABC-223 and ABC-224 are unused and go back to the pool.
- The notes were sealed via the sanctioned writer called directly (the tool was absent). LOW, as before.

**Key fact for the owner:** under a UCI 40/15 clock with `movestogo`, Skill Level 7 already thinks about 22.5 s a move.
At the 40th move of a period the margin is 50 ms, a possible loss on time. A fixed 22.5 s level over UCI fails "never
loses on time" by arithmetic; 22.0 s leaves about 20 s.

**ABC-218 is not pulled yet:**
- It runs ALONE, about 2.5–4 h plus 1 h QE. `bapm-epic010-improvements` is still running, records only.
- Q1 and Q2 decide whether ABC-218 is the whole answer (option (o)), so it is worth running anyway.
- I pull it on the owner's word for the heat and hours.

**Owner questions Q1–Q8 are put in session.**
