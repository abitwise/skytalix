---
id: 20261021T090630Z-software-engineer-observation-7828cdaf
kind: observation
by: software-engineer
at: 2026-10-21T09:06:30Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - ABC-162
  - ABC-095
  - grugops/ABC-180
  - acb52edf
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
supersedes: 
seal: sha256:67a3483a183423e2fdeca43ead736c4d925cce060b41594e87d3e7de39d74683
---

# ABC-180 delivered branch (pointer; recorded as observation because artifact-ref needs a gate_run this install cannot issue) grugops/ABC-180 @ acb52edf

- Branch `grugops/ABC-180`, worktree `../wt-ABC-180`, base `main` `ccccc6bb`, tip `acb52edfff16952bc8b95779687e5e972fdbaf78` (one commit, plus this notes commit). Not pushed, not merged.
- Files: `src/cli.real-engine.test.ts` (+35/−11). Zero production lines.
- Tests added: none new (the page fences that). `A7` gains decoy present / not JSON / not delivered assertions and a labelled stderr assertion.
- Owed: QE hop (re-plant P6f, P6b, P6c, P6e, PD). The Orchestrator records the `AR-162-FALLBACK` close.
