---
id: 20261023T071821Z-qe-e2e-observation-f9ed376d
kind: observation
by: qe-e2e
at: 2026-10-23T07:18:21Z
verified_by: 
confidence: high (commands and files as run)
refs:
  - ABC-178
  - qe-timing-ABC-178
  - 00f77f26
  - a93c1e72
  - 2aeeabda
  - 0036e5c6
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - B9
supersedes: 
seal: sha256:ede5f366b4649ab364ee5e52099545ce237063f2877255c00807df0d6b2f3dbc
---

# `qe-timing-ABC-178`: the merge, the correctness check at the merge, and the artifacts and commands

**Merge.** The worktree is `../wt-qe-timing-ABC-178` on branch `grugops/qe-timing-ABC-178`, created from `grugops/qe-ABC-178` `2aeeabda`. I merged `main` `a93c1e72` into it with `git merge --no-ff`, a merge and not a rebase. There was no conflict. The result is **merge `00f77f2625d55df4fdc772f968e33a10ca4a0e96`**, with parents `2aeeabda` and `a93c1e72`.
- Against `main`, the merge differs only in `src/uci-session.test.ts` (+9: R1 and its re-check), the ABC-178 page, and the `qe-ABC-178*` context.
- Against the tip `0036e5c6`, `src/` differs only by `main`'s own `src/cli.test.ts` (3 lines) and `package-lock.json` (ABC-198's vitest 4.1.11 → 4.1.12 bump).

**Correctness check at `00f77f26`, before any timing.** The worktree has its own `npm ci --ignore-scripts`, which installed vitest 4.1.12.

| gate | result |
|---|---|
| `npm run lint` | exit 0; "Checked 119 files … No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0; 60 files, **1 996 passed**. `last-run.json`: `success: true`, 1 996 total, 0 failed, 0 pending, 0 todo |
| `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts` | exit 0; 1 file, 5/5 |

The wall times vitest printed during these runs are incidental and are not claimed.

**Not re-run at this merge:** the B1, B3–B6 probes, the skip-integrity capture and the M4 plant. `main` changed no line of `src/uci-session.test.ts` or of production since QE's re-read at `7b87e5de`, so `qe-ABC-178b` `…d72f02f0` still stands for those criteria.

**Artifacts** (`.grugops/context/qe-timing-ABC-178/probe/`, 58 files under `RUNSUMS`; `SHA256SUMS` seals the pre-registration set):
- `preregistration-qe178t.txt`, written 06:59:25Z, before any gate poll.
- `inst/`: ten byte copies, `cmp`-equal to `qe-ABC-177/probe`.
- `run178t.sh`, `gate178t.sh`, `hostpoll178t.sh`, `go178t.sh`: derivatives of the earlier hop's scripts. Each header lists its changes.
- `gate.tsv`, `gate.log.txt`, `hostpoll.tsv`.
- `n8/n8-a1/` and `full/full-a1/`: the lane TSVs, sampler, window, power, every readout, perrun and powercheck. The B/T extract and its readout (`*-BT-*`) are among them.
- `gates/`: the correctness logs and `last-run-merge.summary.json`.
- `arms-build/`: the `npm ci` logs and the empty `diff -r` of T against B.
- Logs are committed as `*.log.txt`, because `.gitignore` ignores `*.log`.

**Scratch, not committed:** the arm trees (`qe178t/{n8,full}/arms`).

**Not touched:** `src/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other worktrees, and every process this hop did not start. I did not push, force, amend or rebase, and I did not merge into `main`.
