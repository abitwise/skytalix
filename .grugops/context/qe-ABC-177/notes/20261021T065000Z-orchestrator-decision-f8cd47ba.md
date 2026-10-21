---
id: 20261021T065000Z-orchestrator-decision-f8cd47ba
kind: decision
by: orchestrator
at: 2026-10-21T06:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-177
  - NFR-008
  - QE-177-g
  - .grugops/queue/pending/qe-ABC-177-timing-3.md
  - 20261021T055500Z-orchestrator-decision-b87c35b6
supersedes: 
seal: sha256:53fa985c08d723a970e4f5b2d45732ee02b3bd1e4fa9daff7537781a3a186d05
---

Owner word (Olger Oeselg, 2026-10-21 ~06:50Z): "it is ok that others run their tests, i have capped each test run to 1 or 2 cpu cores."

Effect on qe-ABC-177-timing-3 (amends its start gate):
- A foreign vitest run, including a FULL suite from Projects/public/grugops, does NOT block the start. Log it per run (count + command); do not wait for it to finish.
- Still required: AC on every sample, load1 <= 8, interleaved base/head arms.
- Thermal rule: the owner did not rule on it here. It stays as registered (rounds with thermal pressure > 0 discarded). If the stage voids on thermal again, QE marks OWED and the Orchestrator takes the thermal question to the owner. Do not relax it in-hop.
