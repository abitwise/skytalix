---
id: 20261020T192200Z-qe-e2e-artifact-ref-abc177-probe-files-commands-155330b9
kind: artifact-ref
by: qe-e2e
task: qe-ABC-177
at: 2026-10-20T19:22:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - .grugops/context/qe-ABC-177/probe/
---

# `ABC-177` QE artifacts and commands

Hand-authored and unsealed.

**Probe directory:** `.grugops/context/qe-ABC-177/probe/`

**`parity/`**
- `kill-qb.jsonl` (base) and `kill-qh.jsonl` (tip): byte-identical, sha256 `c4534664…`.
- `parity-qb-vs-qh.out`, plus the driver `run.sh`.
- `refrozen-mutants.json`: re-derived from base, byte-identical to the SE's (`b9033970…`).

**`census/`**
- `census-base.tsv`, `census-head.tsv`, `census-qe.out` (A7 re-run).

**`gap/`**
- `gp.mjs`: probes QP0–QP6 and QP4b. These are not in the A6 list.
- `gp-{base,tip}-file.{jsonl,log}` and `gp-tip-lane.{jsonl,log}`.
- `u8-shape.txt`: U8's info lines at step 10 and step 100.

**`gates/`**
- Tails of lint, typecheck, build, `CLI_DEEP` and `PERFT_DEEP`.
- `npm-test.tail` and `last-run-{base,tip}.summary.json`.
- `names-{base,tip}.txt` (A3), `m4plant.json` (A12), and the drivers `gates.sh` and `after-parity.sh`.

**Timing instruments (none produced a reading; see the timing note):**
- `lane174.mjs`: byte copy, sha256 `e2074cdb…`.
- `sampler174.mjs`, `readout174.py` and `readout-nfr008-174.py`: byte copies.
- `window.mjs`: qe-ABC-174's, with the own-line exclusion renamed to this hop.
- `preregistration.txt`: written before any window. It adds the AC-only gate P1/P2 per the owner's word `…bfdc97e5`.
- `powercheck.py`: the P2 check.
- `powerlog.mjs` and `powerlog.tsv`: power, load1, user processes and foreign count, every 30 s.

**Scratch, removed at the end of the hop:**
- the detached worktree `../wt-qe-ABC-177` at `f81bf03c`, with `node_modules` symlinked to main's;
- the archive trees `par/`, `gp/`, `cen/` and `shape/` in the session scratchpad.

**Commands, one process tree at a time:**
- 2 × 146 single-file mutant runs (parity).
- 2 census runs.
- 1 re-freeze.
- 8 + 8 single-file probe runs, plus 8 whole-lane `npm test` probe runs.
- lint, typecheck and build.
- `npm test` at the tip and at the base.
- The skip capture, as spelled in AGENTS.md, plus `test-skip-integrity.js`.
- `CLI_DEEP` and `PERFT_DEEP`.
- 1 M4 plant run.
- 2 U8 shape runs.

**Not touched:** `src/` on any branch, `../wt-ABC-177`, `plans/board.md`, `plans/traceability.md`, and every process
this hop did not start.

**Noted, not touched:** `node_modules/node_modules` in main's tree is a self-symlink, dated 2026-10-17. It predates
this ticket. It makes `diff -r` over a symlinked `node_modules` report a directory loop. The A9 own-`npm ci` arms would
not carry it.
