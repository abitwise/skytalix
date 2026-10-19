---
id: 20261019T145000Z-qe-e2e-observation-abc173-a9-and-n8-lane-owed-c9e4a7d1
kind: observation
by: qe-e2e
task: qe-ABC-173
at: 2026-10-19T14:50:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - ADR-0008
  - ADR-0035
  - NFR-008
---

# `ABC-173` `A9` and `N8-LANE`: both **OWED**. No quiet window opened. Nothing was timed or estimated

Hand-authored and unsealed. The ADR-0008 addendum (Ruling 5) asks QE for both readings before merge, on `840ebbf7`.
The brief allows them only in a foreground-verified 180 s window with no foreign vitest, no `oeselg-labs/platform`
process, and no other hop of ours running.

**Host:** MacBook-Air.local, Mac15,13, 8 cores, Darwin 25.5.0, node v26.11.1, vitest 4.1.11.

**Two foreground windows**, `probe/window.mjs` (a copy of `qe2-ABC-167/probe/window.mjs`, widened to count another
hop's processes), 1 s polls, run with nothing of this hop live:
| window (UTC start) | polls | foreign polls | what | load1 |
|---|---:|---:|---|---|
| 2026-10-19T14:41:49Z, 180 s | 181 | **181** | the two `oeselg-labs/platform` `main-worker.js` processes (pids 40997, 50110, up since ~11:26Z) in every poll; the `uat-ABC-171` hop (`wt-uat-ABC-171/.../uat-harness.ts` and its shell) in every poll | 2.51–3.43 |
| 2026-10-19T14:45:40Z, 180 s | 181 | **181** | the same two platform workers and the `uat-ABC-171` hop, every poll | 2.41–3.50 |

An earlier spot check at ~14:20Z saw the same platform workers and the `uat-ABC-171` harness. No window opened in this
hop.

**What is staged, untouched, for the next attempt** (in this hop's scratchpad, removed with it; copies of the scripts are
in `probe/`):
- arms outside the repository: `B` = `git archive 68bbf33f`, `T` = `cp -R B` (`diff -r` identical), `H` = `git archive
  840ebbf7`, `H2` = `cp -R H` (identical);
- `probe/lane173.mjs`: `secnfr-ABC-144-window-b/probe/lane144b.mjs` (sha256 `652b7793…0c7c`) with one change, a per-arm
  command `CMD_<cond>`. The base and twin arms run the base's unprefixed `npx vitest run <set>`; the head arm runs
  `NODE_OPTIONS=--max-old-space-size=128 npx vitest run <set>` (5 files: SUITE shape);
- the narrow set: `src/cli.test.ts src/cli.real-engine.test.ts src/engine.test.ts src/line-input.test.ts
  src/uci-session.test.ts` (every test file the ticket modifies; it modifies no production file, so `vitest related`
  adds none). Bound 650 ms CPU; per-set `F` provisional 16 % (no reading of this set exists);
- `A9`: `CONDS=H,H2`, `npm test` as spelled, 9 rounds; `probe/readout-a9.py` (MET needs admissible, wall R <= 10 s,
  median wall <= 10 s, load1 <= 8 on every scored run; CPU reported);
- `probe/readout173.py`: `qe2-ABC-101/probe/readout-n8.py` (sha256 `8b18f27e…c215`) with one change, a multi-file
  count rule;
- `probe/sampler173.mjs`, `probe/readings.sh`.

**State:** `A9` OWED. `N8-LANE` OWED. The full-lane `F` (1.72 s / 3.25 s) stays as recorded, labelled pre-cap; no twin
`R` replaces it yet.
