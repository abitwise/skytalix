---
id: 20261021T134409Z-software-engineer-decision-45ccc2b7
kind: decision
by: software-engineer
at: 2026-10-21T13:44:09Z
verified_by: 
confidence: high
refs:
  - ABC-187
  - ABC-109
  - QE-164-h
  - src/cli.test.ts
  - grugops/ABC-187
  - 94c4b510
  - 494f7862
  - 20261021T133500Z-orchestrator-decision-cba9c8eb
  - 20261021T133924Z-ba-pm-decision-d74b218a
supersedes: 
seal: sha256:f8c53ff81feaf8cccc746ea9e85b85d4e832414265cdd47382bac1f30c26a745
---

ABC-187 SE: exactly the three Scope lines of src/cli.test.ts, 3+/3-, net 0, commit 494f7862 on grugops/ABC-187 from main 94c4b510. :2484 `const AGENTS_MD_BUDGET_BYTES = 18_432;`. :2483 JSDoc (one line, my wording inside A1): "The owner's ceiling (`ABC-187`, decision `…cba9c8eb`): 18,432 B, so the `ABC-164` cut cannot regrow unflagged." :2242 closer count 13 -> 8 (kept a number: the A5 script prints 8 at base and head; the sentence's argument needs a count). AGENTS.md untouched: the Orchestrator folded :7 in as a Scribe hop on this branch after this commit.
