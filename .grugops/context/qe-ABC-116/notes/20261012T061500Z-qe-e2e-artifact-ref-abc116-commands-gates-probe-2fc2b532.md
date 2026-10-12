---
id: 20261012T061500Z-qe-e2e-artifact-ref-abc116-commands-gates-probe-2fc2b532
kind: artifact-ref
by: qe-e2e
task: qe-ABC-116
at: 2026-10-12T06:15:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - grugops/ABC-116-t2-carrier@d39618d1
  - grugops/qe-ABC-116
  - plans/traceability.md
  - plans/tickets/ABC-116-record-the-t2-re-measure-trigger-where-a-hop-will-meet-it.md
  - .grugops/context/qe-ABC-116/probe/
supersedes:
---

# QE `ABC-116`: commands, gates, probe files, and the UAT-waiver reading

- **Worktrees.**
  - `../cli-chess-example-qe-ABC-116` on `grugops/qe-ABC-116`, off tip `d39618d1`.
  - A detached `../cli-chess-example-qe-ABC-116-base` at `3c38a8ea`, used for the base lane only.
  - Both had `node_modules` symlinked from the main checkout, and both were removed when the hop ended.
  - The Engineer's branch was never written.
- **Timed runs.** These came first: 05:55Z–06:11Z, in two windows, the first aborted. All gates ran after them and never during.
  - The A2 trees were scratchpad `git archive d39618d1` copies outside the repository, removed at the end.
  - The harness is `probe/qe-a2window.sh` (`bash qe-a2window.sh <dir> 5`), and the readout is
    `probe/qe-readout.py` → `probe/qe-readout.out.txt`.
  - The raw data is `probe/qe-a2-runs.tsv`, with `probe/qe-a2-window.log.txt` holding the per-run
    load / thermal / power / foreign lines and the foreign-process dumps.
  - The mutant is `probe/qe-mutant.diff`.
  - The first window is in `probe/aborted-start-1/`. **It is not a reading.**
- **Gates at tip `d39618d1`** (06:12Z):
  - `npm run lint` exit 0 (107 files, no fixes);
  - `npm run typecheck` exit 0;
  - `npm run build` exit 0;
  - `npm test` exit 0, 56 files / 1743 tests, with `.test-results/last-run.json` reading `success: true`,
    `numPendingTests` 0, `numTodoTests` 0;
  - the skip-count capture `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`
    gives `0`;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` gives `No findings.`, exit 0.
- **Base `3c38a8ea`.** `npm test` exit 0, 56 / 1743 / 0 / 0, `success: true`.
- **UAT-waiver reading, measured.**
  - `git diff --name-only d39618d1~1 d39618d1 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.
    That is the rule's literal form.
  - The same pipe over the whole delivery `3c38a8ea..d39618d1`, and over the carrier commit
    `9b8c38ec~1..9b8c38ec`, is also **empty**.
  - **0 production lines, so the 2026-08-17 waiver applies at the exit.** A waiver is not a signature.
- **Not touched by this hop.** `src/`, `plans/board.md`, `plans/nfr-catalog.md`, `AGENTS.md`, and the
  Engineer's branch. No `--force`, `-D` or `reset --hard`. Nothing was merged or pushed.
