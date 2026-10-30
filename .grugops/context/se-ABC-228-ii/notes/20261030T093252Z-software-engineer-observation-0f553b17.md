---
id: 20261030T093252Z-software-engineer-observation-0f553b17
kind: observation
by: software-engineer
at: 2026-10-30T09:32:52Z
verified_by: 
confidence: medium: test-strength and method notes, not product faults
refs:
  - se-ABC-228-ii
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 8c82399f
  - d9c5bcde
  - 61d5d629
  - qe-ABC-228/20261030T091456Z-qe-e2e-decision-70c4723b
  - qe-ABC-228/20261030T091456Z-qe-e2e-observation-8829bc22
  - qe-ABC-228/20261030T073301Z-qe-e2e-observation-bcf2fd7c
  - QE-228-c
  - QE-228-b
  - A9
  - G9
  - OQ-228-1
supersedes: 
seal: sha256:8356c6c315a06792b1ee1515b4dd7c46d0b356843f54d2043dbb64f5154104c8
---

# Software Engineer observation, se-ABC-228-ii: three small findings (LOW / INFO) from the (ii) build

- **SE-228ii-a (LOW, test strength), `src/uci-session.test.ts`.**
  - The `GO_G3500` rows used to read level 5's 3 000 cap, which separated level 5 from levels 6 and 7: `min(3500, 5000/30000)` = 3 500.
  - Under (ii) level 5 also reads 3 500. So the setoption-Hash row's "still the default level 5" no longer detects a silent jump to level 6 or 7. It still detects a jump to levels 1–4.
  - A bare `go` (now 4 000 at level 5) would discriminate again. Not changed here, because it is outside the data-follower scope. The Orchestrator may queue it.
- **SE-228ii-b (INFO, method), `se-ABC-228/raw/scripts/forecast.mjs`.**
  - In its A9 mode (`budgetMs` 4000) it divides by 4/3 x base but prints `bar: 133`. That mixes the two units.
  - It was not used. `raw/scripts/a9.mjs` prints both forms: A8's units against 133.3 %, and the share of 4/3 x base against 100 %.
- **SE-228ii-c (INFO), the brief versus the ticket on the literal count.**
  - The brief names two literals. The ticket and `ADR-0053` d10 name three: `DEFAULT_BUDGET_MS` too, for `ADR-0045` D2.
  - The ticket was followed (decision note). No other `src/` value moved.
