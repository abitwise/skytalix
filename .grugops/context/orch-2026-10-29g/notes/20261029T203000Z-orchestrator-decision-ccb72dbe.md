---
id: 20261029T203000Z-orchestrator-decision-ccb72dbe
kind: decision
by: orchestrator
at: 2026-10-29T20:30:00Z
verified_by: 
confidence: high
refs:
  - ideas-2026-10-29/input/owner-ideas.md
  - sa-ideas-verify
  - bapm-epic009-tournament
  - EPIC-009
  - arch-epic008-rd
supersedes: 
seal: sha256:fc1bac6e500532acf1ca93fa761b183523a2e3b66ce7bb7a70201b92b5ac8699
---

# Owner ideas 2026-10-29: verify first, shape the tournament epic in parallel

**Owner input:** his own idea (a 40/15 "tournament" difficulty) and 10 improvement ideas from external chat models. He
asks that they be checked, not taken as valid. Transcribed verbatim to `ideas-2026-10-29/input/owner-ideas.md`.

**Classification:** idea-to-epics plus refinement.

**Routed (width 3/3 with `arch-epic008-rd`; In Analysis 2/2):**
1. `sa-ideas-verify` (System Analyst): a verdict per claim against main's code and history (TRUE / PARTLY / FALSE /
   ALREADY DONE / ALREADY TRIED), plus an exact map of today's time handling. Records only.
2. `bapm-epic009-tournament` (BA/PM): EPIC-009 for the 40/15 level.
   - It frames options (a) fixed 22.5 s, (b) UCI clock-based and (c) both, plus the naming question, for the owner.
   - It cuts MVP tickets from ABC-218 (218–224 reserved).
   - It cites the SA's time note if one exists; otherwise its own code reading, so marked.

**Deferred on purpose:** the epic for the other improvements (items 1–3 and 5–10). It waits until:
- (a) the SA verdicts are in, so no ticket rests on an unverified claim;
- (b) the Architect's R/D investigation is in, because item 2, "strengthen the evaluation process", is the same
  question.

Then BA/PM cuts it from ABC-225 onwards.

**Owner questions to expect:** options (a)/(b)/(c) and the level's name.
