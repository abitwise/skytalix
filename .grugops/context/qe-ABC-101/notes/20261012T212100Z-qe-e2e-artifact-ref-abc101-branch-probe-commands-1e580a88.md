---
id: 20261012T212100Z-qe-e2e-artifact-ref-abc101-branch-probe-commands-1e580a88
kind: artifact-ref
by: qe-e2e
task: qe-ABC-101
at: 2026-10-12T21:21:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - N8-LANE
  - 20261012T212000Z-qe-e2e-decision-abc101-verdict-pass-with-gaps-2fa04d14
supersedes:
---

# Artifacts: `qe-ABC-101` (branch, probe, commands)

This note is hand-authored and unsealed.

- **Branch:** `grugops/qe-ABC-101`, off the `ABC-101` tip `98ea0a84` (code `ac8deab1`, merge of `main` `e88a7832`,
  base `main` `3ea3e352`). Worktree `../wt-qe-ABC-101`, `node_modules` symlinked into the worktree root only. Not
  merged, not pushed. The SE's branch and worktree were only read.
- **Commits:** `bd846627` = the pre-registration and instruments, before any run (21:01:40Z). The next commit adds
  the windows, the readings, the plants log, these notes, the ticket's § QE (an appended dated block) and one trace
  row at the end of `plans/traceability.md`.
- **Probe** `.grugops/context/qe-ABC-101/probe/`:
  - `preregistration.txt`; `master-n8.sh`, `window-n8.sh`, `readout-n8.py` (sha256 in the pre-registration);
    `readout-selftest.out.txt`; `smoke-counts.out.txt`; `master.console.txt`;
  - `windows/master.log` and `windows/n8-{cli-w1,real-w1,real-w2,eng-w1}/` (`window-once.txt`, `gate.tsv`,
    `sampler.tsv`, `<tag>.tsv`, `<tag>.summary.txt`, `<tag>.console.txt`, `readout.out.txt`);
  - `plants/plant_edits.py`, `plants/run_plants.sh`, `plants/plants.out.txt` (every plant's diff and red rows);
  - `readings/{a123,edges,a8,draws}.mts` and their `.out.txt`.
- **Used in place, unchanged:** `secnfr-ABC-144-window-b/probe/lane144b.mjs` (`652b7793…c80c7c`),
  `secnfr-ABC-152-window/probe/gate.sh` (`5335905a…352b6f`).
- **Scratch, outside the repository, removed by exact path:** the timing arms `qen8101/arms/{B,T,H}`, every plant
  copy `qe101plants/<name>`, and the A10 book-absent copy `qe101-a10-bookabsent`. Counted 0 before and 0 after.
- **Commands** (every one run at this hop; results in the observation notes):
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` ×2 (once `--reporter=verbose`): 10/10 each; 0
    `abc095-book-absent-*` before and after each.
  - `npx vitest run src/cli.test.ts` ×10 (`CLI_DEEP` unset), json reporter: 78/78 each.
  - `npm run -s chess -- <args> < /dev/null` for the eight advertised forms and five refused ones.
  - `node src/cli.ts --colour black --difficulty 1 --ascii` (stdin `quit\nquit\n`) in the worktree and in a
    book-absent copy; the same with a `./book-engine.ts` logging double via `node --import data:…`.
  - `node --no-warnings probe/readings/<name>.mts`.
  - `bash probe/master-n8.sh` (one run, 21:02:12Z–21:08:51Z).
  - `git diff -U0 3ea3e352 98ea0a84 -- src/cli-options.ts | grep '^+' | grep -niE '…'`;
    `git diff -U0 3ea3e352 98ea0a84 -- src/engine.test.ts`; `git diff --numstat 3ea3e352 98ea0a84`;
    `git diff --name-only 3ea3e352...98ea0a84 | grep -v '\.test\.ts$' | grep '^src/'`.
- **Gates** on the QE tree before the last commit, and `qe-hop-integrity`, are recorded on the ticket's § QE and
  in the report; they are run after this note is written, because `tools/grugops/qe-hop-integrity.test.ts` reads
  `.grugops/context`.
- **Not touched:** `src/`, `tools/`, tests, `AGENTS.md`, `plans/board.md`, ADRs, other sessions' processes.
