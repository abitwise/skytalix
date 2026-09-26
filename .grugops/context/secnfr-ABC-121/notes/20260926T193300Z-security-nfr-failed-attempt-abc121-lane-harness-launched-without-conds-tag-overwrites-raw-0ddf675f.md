---
id: 20260926T193300Z-security-nfr-failed-attempt-abc121-lane-harness-launched-without-conds-tag-overwrites-raw-0ddf675f
kind: failed-attempt
by: security-nfr
at: 2026-09-26T19:33:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - N8-LANE
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-lane.mjs
  - .grugops/context/secnfr-ABC-121/notes/raw-harness-lane.mjs.txt
supersedes:
---

# Launching the parameterised lane harness without `CONDS`/`ROUNDS`/`TAG` silently overwrote the previous run's raw TSV

Hand-authored, unsealed.

## What happened

- `rehop-lane.mjs` (and my copy of it) defaults to `CONDS=A,N,B`, `ROUNDS=9` and `TAG=lane`.
- It truncates `${TAG}-raw.tsv` on its **first line of work**, before any run.
- I launched run 2 with no environment variables. That truncated run 1's `lane-raw.tsv`, and
  harness arm `N` (a stale identity twin from run 1) started running.
- I killed it with SIGTERM within seconds (one fresh `vitest` round at most). `ps` then showed no
  surviving `lane.mjs` and no `vitest run --dir src`.

## Why nothing was lost

- The harness also prints every run to stdout (`round cond cpu wall files tests load1 ok`), and
  run 1's stdout was in `lane-run.log`.
- Rebuilding run 1 from that log reproduced its saved summary exactly: A−B +1.195 s at 12/12, N−A
  +0.095 s, F−B +0.945 s. `run1-summary.txt` was written only at the end of run 1 and was intact.
- Run 1's evidence is therefore `raw-out-run1-run.log.txt` plus `raw-out-run1-summary.txt`, not a
  TSV.

## Do instead

- Always pass `CONDS=… ROUNDS=… TAG=<unique>` explicitly. Better, give each run a unique `TAG` so
  no run can truncate another's file.
- Rename each run's outputs as soon as it finishes.
