---
id: 20261013T121400Z-qe-e2e-artifact-ref-abc101-a11-branch-probe-commands-cb994968
kind: artifact-ref
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:14:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - .grugops/context/qe2-ABC-101/probe/
  - 20261013T121300Z-qe-e2e-decision-abc101-a11-recheck-verdict-pass-with-gaps-4da1976a
supersedes:
---

# `qe2-ABC-101`: branch, probe and the commands run

This note is hand-authored and unsealed. It is a pointer. The UAT-spec provenance keys do not apply, because nothing here is a `*.uat.spec.ts`.

- **Branch:** `grugops/qe2-ABC-101`, created by `git worktree add ../wt-qe2-ABC-101 -b grugops/qe2-ABC-101 36378ccf`. Its first commit is
  `ee688564`, the pre-registration and instruments, made before any run. The verdict commit follows it. Nothing was merged, pushed,
  amended, rebased or reset. The SE's branch was read only. `node_modules` is a symlink at the worktree root only.
- **Queue:** claimed by a bare `mkdir .grugops/queue/claimed/qe2-ABC-101` in the main checkout at 11:59:01Z. It closes as flat
  `.grugops/queue/done/qe2-ABC-101.md` + `.claim.md`, uncommitted.
- **Probe** (`.grugops/context/qe2-ABC-101/probe/`):
  - `preregistration.txt`, `master-n8.sh`, `window-n8.sh`, `readout-n8.py`, `readout-selftest.out.txt` and `smoke-counts.out.txt`;
    `windows/master.log` and `windows/n8-render-w{1,2}/` (gate, sampler, run TSV, summary, console, readout).
  - `a11/a11_static.py` + `.out.txt` (A11d `.snap` parse, re-pin strength and `it` inventory, from git blobs);
    `a11/a11_runtime.mts` + `.out.txt` (plain-node A11a/b/c/d against the B and H arms).
  - `plants/plant_edits.py`, `plants/run_plants.sh` and `plants/plants.batch{1,2,3}.out.txt`.
  - `cli-deep.out.txt`.
- **Commands (exactly as run):**
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  - `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`,
    `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`
  - `git diff --name-only 3ea3e352...36378ccf | grep -v '\.test\.ts$' | grep '^src/'`
  - `node tools/grugops/qe-hop-integrity.js --ticket ABC-101`: exit 0, "ABC-101: covered (qe-e2e)", covering note
    `…4da1976a` (this hop's decision). It also prints "ABC-101 is not a row in `## Done`"; that is informational.
- **Scratch outside the repository:** `…/scratchpad/qe2101/` (arms B/T/H, the plant copies and the extracted blobs). Each plant
  copy was removed by exact path, and the count was 0 before and 0 after each batch. The arms are removed by exact path at the end of the hop.
