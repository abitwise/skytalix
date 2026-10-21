---
id: 20261021T133500Z-orchestrator-decision-cba9c8eb
kind: decision
by: orchestrator
at: 2026-10-21T13:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-164
  - ABC-185
  - ABC-109
  - QE-164-a
  - src/cli.test.ts
supersedes: 
seal: sha256:b567464588cbcb1f2149bc3571b39362f47426ce422eb0933d7f641888f84e8e
---

Owner decisions (Olger Oeselg, 2026-10-21, verbatim): "1. byte limit to 18,432 ; 2. do the re-split. ; 3. yes".

- AGENTS.md byte guard: lower `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` from 24,576 to 18,432 (AGENTS.md is 15,606 B after ABC-164; 2,826 B ≈ 2.4 edits of room at 1,159 B/edit). BA/PM cuts the XS ticket (next free id ABC-187), then SE builds, QE checks.
- ABC-185 (re-cell the short trace rows, M): pulled now. Racing per its page: merge main before QE and before merge; short append freeze before the merge commit.
- QE-164-a: Scribe amends the four stale present-tense sentences in memory-bank/90-agents-md-command-log.md (records only).
