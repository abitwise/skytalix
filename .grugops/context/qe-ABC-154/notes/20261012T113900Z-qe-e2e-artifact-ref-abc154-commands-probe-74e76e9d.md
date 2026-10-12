---
id: 20261012T113900Z-qe-e2e-artifact-ref-abc154-commands-probe-74e76e9d
kind: artifact-ref
by: qe-e2e
task: qe-ABC-154
at: 2026-10-12T11:39:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - N8-LANE
  - .grugops/context/qe-ABC-154/probe/
  - 20261012T113800Z-qe-e2e-decision-abc154-verdict-pass-with-gaps-n8-met-d9ae510a
supersedes:
---

# QE `ABC-154`: branch, commands and probe files

This is a hand-authored, unsealed note (`AGENTS.md`).

**Branch.** `grugops/qe-ABC-154`, off `beb0991c`, in worktree `../wt-qe-ABC-154` with `node_modules` symlinked
into its root only. Nothing was merged or pushed, and no other branch was moved.
- `b9a5c957` is the pre-registration, the window and readout scripts, and the readout self-test, committed before
  window 1.
- `31ec102d` holds window 1's raw data and readout.
- `69577b62` and `819cfbd2` hold the plants, reads, sweep, static checks and gates.
- A last commit holds these notes, the trace row and the ticket § QE.

**Commands.** `<scratch>` is the session scratchpad `…/scratchpad/qe154`, outside the repo.
- **Trees:** `git archive beb0991c | tar -x -C <scratch>/plant`, and the same into `<scratch>/lane/arms/{B,H,T}`.
  The placeholder goes at the path in B and T.
- **Plants:** `python3 -I probe/plants6.py <worktree> <scratch>/plant <mode>`. Each mode writes one output:
  - `load` → `load6.out.txt`;
  - `plants` → `plants6.out.txt`;
  - `own` → `own6.out.txt`;
  - `extra` → `extra6.out.txt`;
  - `reads` → `reads6.out.txt`;
  - `sweep` → `sweep6.out.txt`, followed by `cmp` of the four stdout/stderr files.
- **Comparison:** `python3 -I probe/compare6.py probe/plants6.out.txt qe4-ABC-105/probe/plants4.out.txt` →
  `compare6.out.txt`.
- **Static:** `git diff`, `grep` and a comment-stripped hash → `static6.out.txt`.
- **Window:** run `MAXLOAD="" GMAX=45 bash window-qe5.sh` from `<scratch>/lane`. Its outputs are copied to
  `probe/w1/`. The readout is `python3 -I probe/readout-qe5.py probe/w1` → `probe/w1/readout-qe5.out.txt`.
- **Gates** (`gates6.txt`):
  - `npm run -s lint`, `npm run -s typecheck`, `npm run -s build` and `npm test`;
  - `jq` on `.test-results/last-run.json`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `npx vitest run tools/grugops/qe-hop-integrity.test.ts`;
  - `node tools/grugops/qe-hop-integrity.js --sweep` and `--ticket ABC-154`.

**Probe files** (`probe/`):
- Scripts: `preregistration.txt`, `window-qe5.sh`, `readout-qe5.py`, `placeholder.test.ts`, `plants6.py`,
  `compare6.py`.
- Outputs: `readout-selftest.out.txt`, `load6.out.txt`, `plants6.out.txt`, `compare6.out.txt`, `own6.out.txt`,
  `extra6.out.txt`, `reads6.out.txt`, `sweep6.out.txt`, `static6.out.txt`, `gates6.txt`.
- Raw window data, in `w1/`: `gate.tsv`, `sampler.tsv`, `window-once.txt`, `n8-qe5.tsv`, `n8-qe5.console.txt`,
  `n8-qe5.summary.txt`, `h-last-run.json` and `readout-qe5.out.txt`.

**Untouched:** `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json`, `plans/board.md`,
`plans/nfr-catalog.md` and ADRs. Every plant was applied in the scratch tree only and restored. Each run ends
`tool == 0f8036f9: True ; test == 0f8036f9: True`.
