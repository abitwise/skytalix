---
id: 20261023T214000Z-orchestrator-failed-attempt-4707909a
kind: failed-attempt
by: orchestrator
at: 2026-10-23T21:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-203
  - N8-LANE
  - d4b8996c
supersedes: 
seal: sha256:e3d23746dca9fc2d8bd0540d1e539fed4ac7b2307586578217f73a7d349e5ef5
---

**ABC-203's code landed on `main` before its owed N8-LANE reading — Orchestrator error.** The Security/NFR worktree was cut from `grugops/qe-ABC-203` (it carries QE's merge `8fa09e14`, which holds the build `5e23e249`). Merging that "records" branch (`d4b8996c`, orch-2026-10-24c) brought `src/pgn.ts`, `src/pgn-file.ts` and the wiring onto `main`. Found by BA/PM (`…44bee405` interaction 13). Not pushed (`origin/main` = 55a8f4ef).

Ruling (Orchestrator): **keep, do not revert.** QE PASS_WITH_GAPS and Security PASS_WITH_RISKS are in; gates re-run on `main` 61e3b915 are green (lint, typecheck, build, 62 files / 2 038 tests, success, 0 skips, `test-skip-integrity` no findings, no `games/` in the checkout). The owed N8-LANE reading now reads H = `main` (B = `55a8f4ef`); **if it reads NOT MET, ABC-203's code is reverted on `main`** and the ticket goes back to In Review.

Rule going forward: a gate worktree that must not carry code is cut from `main`, or its merge is checked with `git diff --stat main <branch> -- src` before merging (the check was skipped here).
