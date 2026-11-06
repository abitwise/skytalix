---
id: 20261106T213202Z-orchestrator-decision-8114f8df
kind: decision
by: orchestrator
at: 2026-11-06T21:32:02Z
verified_by: 
confidence: high
refs:
  - ABC-291
  - ADR-0075
  - qe-ABC-291/20261106T210624Z-qe-e2e-decision-a49d69d7
supersedes: 
seal: sha256:ea1cc4a32ecec540ac26e9909718b835ef99b294c4006a3ff30b3ba1474c459a
---

# qe-ABC-291's stage 0 taken; H3 ruled; window asked

- Stage 0 complete, no red. PREREG commit 22319099 precedes the count rows at be032c4c, which matches "sealed before any run"; branch holds records only against 9e496e4a. QE carried …32c023cc's three items in addendum …7febbbfe, so no separate brief is needed.
- **H3 ruled:** the stricter order stands. No game starts until NFR-008 is read and met, as sealed.
- **H4:** I deleted four stale engine copies from this session's scratch, about 1.6 GB, all from finished tickets and rebuildable from git: se305/arms, qe307/arms, se307/tip, se307/base. Scripts, logs and the lichess data stay. QE still reads the quota at launch.
- **H1, H2:** the window and W are asked of the owner now: about 55 min, up to about 75 with every allowance, which is over 1 h and needs his word; timing alone 14 to 27 min. The Orchestrator's recommendation is W.
