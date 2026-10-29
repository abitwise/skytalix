---
id: 20261029T212500Z-orchestrator-decision-27fae3c4
kind: decision
by: orchestrator
at: 2026-10-29T21:25:00Z
verified_by: 
confidence: high
refs:
  - sa-ideas-verify/…837e6fa8
  - sa-ideas-verify/…306a4012
  - sa-ideas-verify/…1ccf0010
  - bapm-epic010-improvements
  - EPIC-010
  - orch-2026-10-29g/…ccb72dbe
supersedes: 
seal: sha256:0e26cd99c37698135ea1b1a83f804525a1f829d3270d11afc3970e2dc3245c7d
---

# sa-ideas-verify reviewed and merged; the improvements epic is routed

**Review:**
- Branch head `3d19a6bd`: 2 commits, 9 files, all under `.grugops/context/sa-ideas-verify/`. 0 host-path hits.
- The early note copy in main was byte-identical; I removed it before the merge.
- Merged `--no-ff` as `f513a9ea`. Probes used about 41 s of CPU, with no games.

**Verdicts:**
- **Stand:** items 1 (with a correction: the leaf mate test exists), 3, 5 and 6, and 8 (never tried).
- **Stand in part:** 7 (ABC-206 already did part of it) and 9 (ABC-209 already tried TT retention).
- **Already in hand:** 2 (`arch-epic008-rd`; its gauntlet was since declined by the owner, `…183a5bbc`).
- **Corrected:** 4. UCI uses the clock, then caps it at the level's budget.
- **Against a recorded non-goal:** 10 (EPIC-004).
- **Time facts for EPIC-009:** level 7 plus a GUI's `movestogo` already gives about 22.5 s/move over UCI. A named level
  is blocked by the integer levels 1–7 on every surface, by NFR-004 and by ADR-0044/0045. Clock mode is blocked by the
  level cap, the 32 s clamp, the lack of a time manager, and a harness that drives only `st=`.

**Routed:** `bapm-epic010-improvements` (BA/PM; EPIC-010; ABC-225..239). It runs in parallel with
`bapm-epic009-tournament`. In Analysis is 2/2 and width 2/3.

**Owner questions (asked in session, carried in the epic):**
1. Syzygy against EPIC-004's non-goal.
2. EPIC-004's "strength above ~1700" non-goal: cite or amend.
3. Re-open ADR-0020 d2.
4. The pre-merge outside-opponent rule.
