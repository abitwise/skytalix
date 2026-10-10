---
id: 20261010T194248Z-software-engineer-artifact-ref-abc083-branch-files-probes-0d7c55e3
kind: artifact-ref
by: software-engineer
at: 2026-10-10T20:13:21Z
verified_by:
confidence: high
refs:
  - ABC-083
  - grugops/ABC-083-king-safety-mobility
  - 79248602
supersedes:
---

# `ABC-083`: where the work is

- **Branch** `grugops/ABC-083-king-safety-mobility`, worktree `.claude/worktrees/ticket-to-pr-ABC-083`,
  base `grugops/wave-2026-09-25` @ `489c549e`. **Code commit `79248602`.** The docs commit (these notes,
  the ticket's § Delivery and the trace row) follows it on the same branch.
- **Production:** `src/evaluate.ts`.
- **Tests:**
  - new: `src/evaluate.king-mobility.test.ts`;
  - edited: `src/evaluate.pawns.test.ts`, `src/search.ordering.test.ts`, `src/search.pvs-lmr.test.ts`,
    `src/engine.test.ts`, `src/transposition.test.ts`, `src/quiescence.test.ts`.
- **Probes** `.grugops/context/ticket-to-pr-ABC-083/probe/`, in groups:
  - Cost and depth: `cost.mjs`, `depth.mjs` + `depth-rounds.sh`, `nodes7.mjs`, `n8.sh`.
  - Pins and rows: `rows.ts` (copied from `ABC-082`), `r14.mjs`, `r15.mjs`, `g6.mjs`, `hanging.mjs`,
    `oracle.ts`.
  - Fixture scans: `a4scan.ts`, `a4engine.ts`, `lmr-ref.ts` and `corpus.ts` (copied from `ABC-121`),
    `tiescan.ts`, `a3scan.ts`, `rigscan.mjs`, `rigkings.mjs`, `rigblackking.mjs`.
  - Mutants: `mutants.mjs` (adapted from `ABC-082`).
  - Outputs: `*.out.*`, `*.jsonl`, `n8-raw.tsv`, `deep-lanes-*.txt`, `puzzle-5061-ladder.txt`.
- **Scratch trees, not committed:** base, king-safety-only, weight 1/2/3, E8/E9, ladder and n8 trees in
  the session scratchpad, all derived by `git archive` or `cp` plus the edit each probe names.
- **Not done here:** no `plans/metrics.md` entry, no board move (the queue's publish list and fences).
