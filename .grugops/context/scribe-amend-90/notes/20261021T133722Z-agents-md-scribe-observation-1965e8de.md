---
id: 20261021T133722Z-agents-md-scribe-observation-1965e8de
kind: observation
by: agents-md-scribe
at: 2026-10-21T13:37:22Z
verified_by: 
confidence: high: each before/after read in the worktree at d7752d53; gates run there, exit codes and counts as printed, no timing
refs:
  - ABC-164
  - QE-164-a
  - QE-164-b
  - memory-bank/90-agents-md-command-log.md
  - grugops/scribe-amend-90
  - d7752d53
  - 20261021T132911Z-qe-e2e-decision-47cae669
  - 20261021T132911Z-qe-e2e-observation-89fca9e3
  - 20261021T132911Z-qe-e2e-observation-71f134f6
  - 20261021T133500Z-orchestrator-decision-cba9c8eb
supersedes: 
seal: sha256:b53c75cd40d70f04f7e30a91ba212921d27210a306b8f1a36393c6910eda8c5e
---

# scribe-amend-90: four stale sentences in 90 made true; gates green at d7752d53

Only `memory-bank/90-agents-md-command-log.md` changed (+32/-12 lines). Verified against AGENTS.md at the tip: it keeps the command lines but not the three on-demand ones; it carries a comment fact only in the Dev / run and `npm test` slots; the Dev / run slot has a pointer, no rules; it has no opening-book line.

- Preamble "keeps each command line plus the single most load-bearing fact": now names the three on-demand exceptions and the two slots that keep a fact.
- Reader "one-line-per-command index": now "the command index every role reads (every command line but the three ...)"; its "one-line summary" clause changed with it (same split made it false; flagged in the done record).
- Dev / run "AGENTS.md carries the rules in the slot's own comment": now a pointer only; rules are in the WRITING RULES paragraph below.
- Opening book "AGENTS.md carries the line and one fact": now neither line nor comment, only a pointer to On-demand commands.
- QE-164-b: scribe-ABC-164 miss list now four kinds (O1 line split added); QE-hop comment removed as a miss (whole in 40-contributing.md).
- New history section `scribe-amend-90 pass` at the end of 90.

Gates: lint 0, typecheck 0, build 0; npm test 59 files / 1987 tests, last-run.json success true; pending+todo 0; skip-integrity --skip-count 0 "No findings.". Zero src/ lines, so the UAT waiver measurement prints nothing.
