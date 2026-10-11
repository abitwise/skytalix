---
id: 20261011T220201Z-software-engineer-artifact-ref-abc152-repair-commits-ee7b87b9
kind: artifact-ref
by: software-engineer
at: 2026-10-11T22:02:01Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - QE-152-h
  - QE-152-a
  - QE-152-d
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
  - plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
supersedes:
---

# SE `ABC-152` repair hop: the three commits on top of `88009d0b`, tip `49997a87`

This note is hand-authored and unsealed. It carries no `sha` / `gate_run` / `content_hash` triple, because no §14
gate verdict exists on this install. It is a pointer, not an admitted artifact.

- **Branch:** `grugops/ABC-152-vitest-4-1-runner-off`, worktree
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-152` (its own vitest 4.1.11 `node_modules`).
- **Commits, in the order the ruling note `…e50fbbe3` gives:**

| # | commit | gap | files |
|---|---|---|---|
| 1 | `476fdde0` | `QE-152-h` (ruling 8) | `src/puzzle-suite.test.ts` only (+4 / −4) |
| 2 | `502df2b6` | `QE-152-a` (ruling 9) | `tools/grugops/result-file-reporter.js:76` only (+1 / −1) |
| 3 | `49997a87` | `QE-152-d` (ruling 10) | comment lines only, 5 files (+8 / −8) |

- **No fourth commit.** These notes and the probe sit in the main checkout under `.grugops/context/fix-ABC-152/`,
  uncommitted, for the Orchestrator to commit with the queue records. The ticket's § Delivery, the trace row and
  the board move are not written by this hop (see the handoff decision note).
- **Probe** (`.grugops/context/fix-ABC-152/probe/`):
  - `census-paths-56.txt`: `vitest list --filesOnly` at the worktree root, the lane's 56 paths (`V8`);
  - `census-step1-gates-476fdde0.txt` and `census-step2-apis-476fdde0.txt`: the raw grep output of the census;
  - `v2-head-502df2b6.json` and `v2-cut-commands.txt`: QE's `probe/v2rows.mjs`, run unmodified on a `git archive`
    of `502df2b6` outside the repository.
- Readings: `…130fe00c` (commit 1 and the census), `…894fcbdf` (commit 2), `…bc57d56f` (commit 3 and the gates).
