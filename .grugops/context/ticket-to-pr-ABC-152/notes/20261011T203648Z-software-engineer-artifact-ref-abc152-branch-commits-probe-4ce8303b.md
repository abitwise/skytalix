---
id: 20261011T203648Z-software-engineer-artifact-ref-abc152-branch-commits-probe-4ce8303b
kind: artifact-ref
by: software-engineer
at: 2026-10-11T20:36:48Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
supersedes:
---

# SE `ABC-152`: the branch, its commits and the probe

This note is hand-authored and unsealed. It carries no `sha` / `gate_run` / `content_hash` triple, because no §14
gate verdict exists on this install. It is a pointer, not an admitted artifact.

- **Branch:** `grugops/ABC-152-vitest-4-1-runner-off` from `main` `91024242`. Worktree at
  `/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-152`, with its own `npm ci` / `npm install` and no
  `node_modules` symlink.
- **Code and test commits:**

| commit | step |
|---|---|
| `9313dda7` | bump: `package.json` + lockfile |
| `be4e3552` | runner key + header paragraph (`vitest.config.ts`) |
| `fb039214` | `A7` re-armed + `V3` `it` (`src/cli.test.ts`) |
| `2d523837` | reporter route + load-time check + plant block + READ IT join (`tools/grugops/result-file-reporter.js`) |
| `66aaa39e` | R1 (`cli`, `render-seam`) |
| `7883d87b` | R2 (`tools/opening-book/book`) |
| `1155b038` | R3 + R5 (`command-input`) |
| `808a7e82` | R4 (8 files) + R5 (`status-panel.nfr`) |
| `ccb8f1bd` | ruling 2 (`san` A20) |
| `23c5521a` | ruling 3 (`src/book` A2) |

- A docs commit on top carries these notes, the probe, the ticket's § Delivery and one trace row. It changes no
  code.
- **Probe** (`.grugops/context/ticket-to-pr-ABC-152/probe/`):
  - `mkcopy.sh`, `plant.py`, `specs/*.py` and `plants.out.txt` (`V4`);
  - `pinplant.py` and `pin-plants.out.txt` (`V3`, `V6`);
  - `v2rows.mjs`, `v2-rows-{head,m9b,old}.json` and `reporter-loadcheck.mjs` (`V2`);
  - `v7-20-runs.txt` (`V7`);
  - `lanes.sh` and `lanes.out.txt` (`V8`);
  - `f1-apply.mjs`: the architect's `f1-rewrites.mjs` with a file filter.
