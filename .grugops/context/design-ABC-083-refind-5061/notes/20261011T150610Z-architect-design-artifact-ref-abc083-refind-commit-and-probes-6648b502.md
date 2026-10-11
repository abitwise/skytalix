---
id: 20261011T150610Z-architect-design-artifact-ref-abc083-refind-commit-and-probes-6648b502
kind: artifact-ref
by: architect-design
at: 2026-10-11T15:06:10Z
verified_by:
confidence: high
sha: b29c837c
refs:
  - ABC-083
  - src/puzzle-corpus.ts
  - .grugops/context/design-ABC-083-refind-5061/probe/
supersedes:
---

# Artifacts: re-find commit `b29c837c`, and the probes and runs behind it

This note is hand-authored and unsealed. There is no `gate_run` and no `content_hash`, because no
`§14-gate` verdict exists on this install (AGENTS.md).

- **`b29c837c`** on `grugops/ABC-083-king-safety-mobility`: `test(ABC-083): grug re-find puzzle rock seed
  5061 as seed 5147`. It touches `src/puzzle-corpus.ts` only (+3/−1: two comment lines and the row).
- **`probe/screen.mjs`** reads every `win-material` row and `ABC-127`'s `cand-wm` pool on one tree.
  - Usage: `node screen.mjs <tree> <variants> <label> <cand-wm.jsonl>`.
  - The variants come from `ticket-to-pr-ABC-127/probe/curation/mkvariants.mjs`, which uses `W1` and
    `W5` only.
  - Output: `screen-base.tsv` and `screen-branch.tsv`.
- **`probe/focus.mjs`** reads the shortlist on one tree: the readings ladder, and the clean lead plus
  `search()` at d ± 1. Output: `focus-base.txt` and `focus-branch.txt`.
- **Runs:**
  - `branch-1.txt` / `.rows`: `PUZZLE_DEEP=1` at `b29c837c`, 54/58, exit 0.
  - `branch-weakened.txt`: 15/58, exit 1.
  - `base-1.txt` / `.rows`: base `5ed308a8` with the same row, 54/58, exit 0. The tree was reverted
    afterwards.
  - Each run records load1 and thermal at its start and end (2.75–3.58, thermal 0).
- **`probe/scope.txt`:** the files the commit touches, the trigger-glob match (none), the baseline check
  (not touched), and production importers of the corpus (none).
- **Machine:** Apple M3, Node v26.11.0. Readings are node counts on a virtual clock, so load does not move
  them.
