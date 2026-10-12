---
id: 20261012T150900Z-qe-e2e-artifact-ref-abc095-branch-commands-probe-4e66067b
kind: artifact-ref
by: qe-e2e
task: qe-ABC-095
at: 2026-10-12T15:09:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - N8-LANE
  - NFR-004
  - NFR-008
  - 20261012T143800Z-qe-e2e-observation-abc095-criteria-plants-children-e11e8176
  - 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
supersedes:
---

# QE `ABC-095`: branch, commands, probe files

Hand-authored, unsealed.

- **Reviewed tip:** `2307fc11` on `grugops/ABC-095-book-before-engine` (code `521a8513` + `09740ea4`; `main` `0974102f`
  merged in at `75606020`). The delivered pair is `0974102f..2307fc11` (merge-base with `main` = `0974102f`).
- **QE branch:** `grugops/qe-ABC-095` off `2307fc11`, worktree `../wt-qe-ABC-095`, `node_modules` symlinked at the
  root only. The pre-registration commits are `386f8e6f` and `536e2d5e` (an erratum, no rule changed), both before
  the first window (14:36:16Z). The records commit follows. Not merged, not pushed, and the SE's branch was not touched.
- **Commands** (outputs in `probe/`):
  - `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`, and
    `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts --reporter=verbose`, with a `$TMPDIR` census before and
    after;
  - `bash probe/plants.sh probe/plants <18 plants>` and the naive-wiring loop (`probe/children/naive-wiring-x10.txt`);
  - `npx vitest run src/cli.test.ts` ×20 (`probe/children/cli-test-x20.txt`);
  - `node probe/a1-a3-own.ts <tree>`, the `A4`, `A5` and `A7` real children (`probe/a4-child-frames.out.txt`,
    `probe/a5-multiply-child.out.txt`, `probe/a7-child-x10.out.txt`; frames parsed by `probe/frames.py`);
  - `bash probe/master.sh`, the pre-registered timing sequence → `probe/windows/` (`master.log`, one folder per window
    with `gate.tsv`, `sampler.tsv`, the raw TSV or `readings.txt`, and `readout.out.txt`);
  - static: `probe/static.out.txt` (`A6` numstat, clause (d), `A7`'s call diff, the UAT-waiver measurement).
- **Harness and gate used in place, unchanged:** `secnfr-ABC-144-window-b/probe/lane144b.mjs` (sha256 `652b7793…c80c7c`),
  `secnfr-ABC-152-window/probe/gate.sh` (`5335905a…52b6f`). The SE's instrument
  `wire-ABC-095/probe/time.ts` was used in place (sha256 `33142e12…67974`).
- **Arms and plant copies** live in the session scratchpad, outside the repository: `git archive 0974102f` (B), a
  `cp -R` twin (T), `git archive 2307fc11` (H), and one archive per plant. Nothing under `src/`, `tools/`, `data/`,
  `AGENTS.md`, the ADRs or `plans/board.md` was edited. Every plant was applied to a copy, never to the repository.
- **Docs touched:** `plans/traceability.md` (one row at the end), and the ticket page (§ QE, appended).
