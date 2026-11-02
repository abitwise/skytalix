---
id: 20261102T205122Z-agents-md-scribe-observation-deac9de8
kind: observation
by: agents-md-scribe
at: 2026-11-02T20:51:22Z
verified_by: 
confidence: high
refs:
  - scribe-futility-lane
  - ABC-265
  - ABC-268
  - memory-bank/90-agents-md-command-log.md
  - AGENTS.md
supersedes: 
seal: sha256:75996f911a25c45ebb3cc00405aa5e01290ad1a14ee6c52ebf1de346e744e715
---

# Futility and shared-table lanes recorded (ABC-265, ABC-268)

## Observation
- Nothing was run in this hop; the figures (47 tests in src/search.futility.test.ts, default lane 64 files / 2429 tests / ~9 s at e72487e1) are the Orchestrator brief's, copied.
- AGENTS.md: one new line, Futility deep lane (ABC-268, 47 tests), SEARCH_DEEP=1 ... npx vitest run src/search.futility.test.ts, after the null-move line. 18,421 -> 18,429 B (budget 18,432, pinned by src/cli.test.ts ABC-109 A5). 131 B of prose trimmed to make room; no command line touched.
- memory-bank/90-agents-md-command-log.md: table row and section for the futility lane, dated RE-MEASURED paragraph in Test (all) (64 / 2429 / ~9 s), dated NOTE in Transposition deep lanes naming src/transposition.shared.test.ts as a default-lane file, and a pass entry at the end.
- AGENTS.md carries no default-lane list or test count, so src/transposition.shared.test.ts is named in the command log only. No Threads / THREADS_DEEP line (ABC-266 parked).
