# bapm-spike-accel records: files and commits as written; read by file reads, grep and git log/show; nothing run

- **Branch:** `grugops/bapm-spike-accel`, from `main` `7c67d3ad` (worktree `.claude/worktrees/bapm-spike-accel`). Claim commit `cc55ce93`; records commit `424e0087`.
- **New:** `plans/tickets/ABC-263-spike-can-skytalix-use-the-npu-the-igpu-and-more-cpu-threads-from-node-js-on-this-host-and-share-search-info-between-them-records-only.md`. The id was the next free one: the highest page was `ABC-262`, and no `ABC-263` appeared in `plans/`, `memory-bank/` or the queue.
- **Edited:**
  - `ABC-251` page: front matter and a dated close block.
  - `ABC-262` page: a dated block, and A4 struck and marked waived.
  - `EPIC-011`: tickets rows 14 (to Done) and 15 (new); the phases table row "any time"; the dedupe-audit row `ABC-263`.
  - `EPIC-010`: row 26 (`ABC-251`) only.
  - `plans/traceability.md`: 4 rows appended (`ABC-263`, `ABC-251`, `ABC-262`, `bapm-spike-accel`).
- **Facts read, not run:**
  - Owner words: `…78c476bf`, `…f7a50e95`, `…aab3b5f4`, `…2896c6eb`.
  - The close: `…1f6ed15a`; `se-ABC-251` notes `…4342e5b5`, `…687c4af7`, `…d1e5f719`; merge `d87f30f7`; board `d46ed7ec`.
  - `qe-ABC-262` notes `…ed4d02a5`, `…16924bec`, `…918ca02e`, `…064f5f07`, `…dffb3c15`; merge `2cf2bb69`.
  - The per-node rate: `ADR-0055` § Speed readings (`qe-ABC-240`). The out-of-scope lines: `EPIC-011` § Out of scope. One thread: `ADR-0044` D5. Stockfish at `Threads 1`: `ADR-0056`.
- **Host facts not verified:** the core and thread counts (4 fast + 8 slow, from the brief) and every runtime's availability are `UNKNOWN - verify`. They are the spike's to settle.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, the ADRs. Nothing was run, built, timed, pushed or merged.
