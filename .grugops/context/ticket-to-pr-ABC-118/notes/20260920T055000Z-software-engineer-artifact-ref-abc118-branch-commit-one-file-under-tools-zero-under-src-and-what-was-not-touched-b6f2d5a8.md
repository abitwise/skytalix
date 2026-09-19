---
id: 20260920T055000Z-software-engineer-artifact-ref-abc118-branch-commit-one-file-under-tools-zero-under-src-and-what-was-not-touched-b6f2d5a8
kind: artifact-ref
by: software-engineer
at: 2026-09-20T05:50:00Z
verified_by:
confidence: high
refs:
  - ABC-118
  - tools/grugops/lane-inventory.js
  - plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-118.md
supersedes:
---

# `ABC-118` — where the work is

**Pointer note, no stamp.** This `artifact-ref` points at a tool and a branch, not at a
committed UAT spec, so it carries no `sha` / `gate_run` / `content_hash` keys — there is no
`§14-gate` verdict on this install to bind them to.

- **Branch:** `grugops/ABC-118-lane-inventory`, off `grugops/wave-2026-09-19` @ `129f53d`.
  **Unmerged; not deployed.** The Orchestrator merges.
- **Build commit:** `1d0ce2a` — `tools/grugops/lane-inventory.js` (+93) and the queue claim
  (`.grugops/queue/claimed/ticket-to-pr-ABC-118/`). A second commit carries these notes, the
  trace row, the ticket's `## Delivery` and the queue's move to `done/`; the code did not change
  between them (the lane and the instrument are re-run at that tip and recorded in the report).
- **`git diff --numstat 129f53d HEAD -- src/`:** empty. **Zero production lines and zero test
  lines under `src/`**, so the 2026-08-17 UAT waiver is expected to apply — measured from git at
  the `Ready for UAT` exit by whoever moves it, never asserted here.
- **Not touched, by fence:** `plans/board.md`, `AGENTS.md`, `vitest.config.ts`,
  `plans/nfr-catalog.md`, every `src/*.ts`, `src/search.*` / `src/quiescence.*` (`ABC-079`
  live), `src/command-input.*` / `src/line-input.*` (`ABC-046` live),
  `.claude/worktrees/residual-gqe115-3` (measured, not opened), `.grugops/test-skips.md`
  (read and run, never written), `package.json`.
- **Owed elsewhere, named:** one `AGENTS.md` `## Test integrity` line recording
  `node tools/grugops/lane-inventory.js` — the Scribe's under `ABC-109`. The ticket's `A5` hash
  pin (`63f66795…`) — BA/PM's to refresh; the rows moved on `main` before this hop (gates note).
- **How to run it:** `node tools/grugops/lane-inventory.js` from the checkout; exit 0 / 1 / 2.
  Beside this note: `raw-gates-tip-1d0ce2a.txt`, `raw-probe-output.txt`,
  `raw-paired-lane-runs.txt` and the three `raw-*-harness.mjs.txt` scripts that produced them.
- **QE hop owed** before `In Review` is exited (owner's standing rule, 2026-08-17). QE is not
  UAT. The reds QE should reproduce are the four in the mutants note, in a copy outside the
  repository, with the copy re-initialised as its own git repository — the instrument reads the
  index, so a plain `cp -R` without `git init` reads exit 2 (`git rev-parse` fails), not green.
