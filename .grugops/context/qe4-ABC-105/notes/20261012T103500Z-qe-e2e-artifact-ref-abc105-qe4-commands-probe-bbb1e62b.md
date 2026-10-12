---
id: 20261012T103500Z-qe-e2e-artifact-ref-abc105-qe4-commands-probe-bbb1e62b
kind: artifact-ref
by: qe-e2e
task: qe4-ABC-105
at: 2026-10-12T10:35:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - .grugops/context/qe4-ABC-105/probe/
  - 20261012T103400Z-qe-e2e-decision-abc105-qe4-verdict-pass-with-gaps-n8-not-read-6a647762
supersedes:
---

# QE4 `ABC-105`: branch, commands and probe files

This is a hand-authored, unsealed note (`AGENTS.md`).

**Branch.** `grugops/qe4-ABC-105`, off `cfcd59af`, in worktree `../wt-qe4-ABC-105` with `node_modules`
symlinked. Nothing was merged or pushed, and no other branch was moved.
- `9ed227fa` is the pre-registration, committed before window 1.
- `5a3748a3` holds window 1 (void) and the addendum, committed before window 2.

**Commands** (scratch trees under the session scratchpad, outside the repo):
- **Plant and read trees:** `git archive cfcd59af | tar -x -C <scratch>/q4/plant`.
- **Arms:** the same archive three times, as `<scratch>/q4/lane/arms/{B,H,T}`. `placeholder.test.ts` goes at the
  path in B and T.
- **Plants:** `python3 -I probe/plants4.py <worktree> <scratch>/q4/plant plants` → `probe/plants4.out.txt`.
- **Reads:** `python3 -I probe/plants4.py <worktree> <scratch>/q4/plant reads` → `probe/reads4.out.txt`.
- **Seam:** `node probe/seam4.mjs` (it imports the tool from a scratch copy at `cfcd59af`) →
  `probe/seam4.out.txt`. The CLI argv and missing/empty context-dir checks are recorded in `…6df3826a`.
- **Window:** run `MAXLOAD="" GMAX=45 bash window-qe4.sh` from `<scratch>/q4/lane`. Its outputs are copied to
  `probe/w1/` and `probe/w2/`. The readout is `python3 -I probe/readout-qe4.py probe/wN` →
  `probe/wN/readout-qe4.out.txt`.
- **Gates** (`probe/gates4.txt`):
  - `npm run -s lint`, `npm run -s typecheck`, `npm run -s build` and `npm test`;
  - `jq` on `.test-results/last-run.json`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `npx vitest run tools/grugops/qe-hop-integrity.test.ts`;
  - `node tools/grugops/qe-hop-integrity.js --sweep`.

**Probe files** (`probe/`):
- Scripts: `preregistration.txt`, `window-qe4.sh`, `readout-qe4.py`, `placeholder.test.ts`, `plants4.py`,
  `seam4.mjs`.
- Outputs: `plants4.out.txt`, `reads4.out.txt`, `seam4.out.txt`, `gates4.txt`.
- Raw window data: `w1/` and `w2/`, each holding `gate.tsv`, `sampler.tsv`, `window-once.txt`, `n8-qe4.tsv`,
  `n8-qe4.console.txt`, `n8-qe4.summary.txt` and `readout-qe4.out.txt`. `w2/` also holds `h-last-run.json`.

**Untouched:** `src/`, `tools/`, `AGENTS.md`, `tsconfig.json`, `biome.json` and `plans/board.md`. Every plant was
reverted in the scratch tree and checked equal to `8fd0c233`.
