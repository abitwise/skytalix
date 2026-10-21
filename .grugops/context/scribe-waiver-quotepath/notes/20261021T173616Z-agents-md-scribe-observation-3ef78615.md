---
id: 20261021T173616Z-agents-md-scribe-observation-3ef78615
kind: observation
by: agents-md-scribe
at: 2026-10-21T17:36:16Z
verified_by: 
confidence: high
refs:
  - AR-191-QUOTEPATH
  - 20261021T173242Z-orchestrator-decision-717a2219
  - 20261021T165304Z-security-nfr-decision-7c1f3590
supersedes: 
seal: sha256:937f582391ee8e5feccdfa3651fb5445624296fce1e9940e2df3cc6d9b1be757
---

Scratch demonstration (own .git, private HOME and TMPDIR, GIT_CONFIG_GLOBAL=/dev/null, no config set), outside the repository. Commit adding src/qé.ts (38398b41 in the scratch repo): old form (no -c) prints nothing, rc 1; new form (-c core.quotePath=false) prints src/qé.ts, rc 0. Test-only commit adding src/a.test.ts (cfbe927d): both forms print nothing, rc 1. So the old form missed a non-ASCII production path (git quotes it as "src/q\303\251.ts" and the grep '^src/' stage drops it); the new form catches it and leaves the test-only case empty.
