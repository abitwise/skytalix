---
id: 20261011T152136Z-qe-e2e-artifact-ref-abc083-qe2-refind-probes-and-runs-a51498aa
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T15:21:36Z
verified_by:
confidence: high
refs:
  - ABC-083
  - grugops/ABC-083-king-safety-mobility
  - 35f49bb7
  - b29c837c
  - 5ed308a8
supersedes:
---

# Where QE's `qe2-ABC-083-refind` readings live

This note is hand-authored and unsealed. No `sha`/`gate_run`/`content_hash` is given, because no `§14-gate`
verdict exists on this install (AGENTS.md).

- **Trees read.**
  - Branch: a git worktree of `grugops/ABC-083-king-safety-mobility` at `35f49bb7`, outside the repository.
  - Base: a `git archive` copy of `5ed308a8` in the session scratchpad, with `git show b29c837c --
    src/puzzle-corpus.ts` applied.
  - `node_modules` is symlinked from the main checkout; `package-lock.json` is the same blob on all three
    commits.
  - `W1`/`W5` variants were built from both trees by `ticket-to-pr-ABC-127/probe/curation/mkvariants.mjs`.
    On the branch it stops at `W9` (its `src/evaluate.ts` anchor matches twice there). `W1` and `W5` are built
    first, and each differs from `shipped` by exactly its one edit.
  - Nothing under `src/` in the repository was edited.
- **Probe directory:** `.grugops/context/qe2-ABC-083-refind/probe/`.
  - `runs.sh`, `r{1,2}-{base,branch}.txt`, `weakened-branch.txt`, `summary.tsv`: two alternating
    `PUZZLE_DEEP=1` rounds, then one `PUZZLE_DEEP=weakened`, with load1 and thermal at each start and end.
  - `lead.mjs`, `lead-{base,branch}.txt`: the readings ladder, and the clean and shipped-child leads plus
    `search()` at d ± 1, for seeds 5147, 5061 (control), 1700 and 5180.
  - `tags.mjs`, `tags.txt`: the `W1`/`W5` tag re-measure for 5147 and 1700.
  - `gates.txt`: `npm test`, lint, typecheck, skip count and integrity at `35f49bb7`.
  - `levels-deep-branch.txt`: `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` at `35f49bb7`.
  - `levels-a3-attribution.txt`: the same lane's `A3` alone (`-t`) on base + 5147 and on a `git archive` copy
    of `1b5d5c42` (the branch before the re-find).
  - `scope.txt`: the commit's files, the trigger-glob match, the baseline check, corpus importers, the
    `ADR-0034` d2 instrument and the UAT-waiver measure.
- **Edited after capture:** in the `*.txt` logs, the absolute tree paths (vitest's `RUN` line) were replaced
  by `<base-tree>` / `<branch-tree>`. Nothing else was changed.
- **Not run by QE in this hop:** the other deep lanes. Their inputs do not include `PUZZLES`, and no
  engine-loadable file changed since QE's pass at `67c189b9` (`…6b2e2f3b`).
- **Machine:** Apple M3, 8 CPUs, Node v26.11.0, vitest 3.2.7.
