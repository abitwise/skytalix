---
id: 20261101T083046Z-qe-e2e-observation-b96e5e0f
kind: observation
by: qe-e2e
at: 2026-11-01T08:30:46Z
verified_by: 
confidence: high: files listed are committed on grugops/qe-ABC-248 (an observation, not an artifact-ref: no §14-gate run to bind)
refs:
  - qe-ABC-248
  - ABC-248
  - EPIC-010
  - ADR-0046
  - ADR-0050
  - ADR-0035
  - NFR-008
  - N8-LANE
  - W1
  - ABC-167
  - ABC-244
  - ABC-245
  - QE-208-a
  - QE-208-b
  - SE-248-a
  - SE-248-b
  - SE-248-c
  - SE-248-d
  - QE-248-a
  - QE-248-b
  - QE-248-c
  - QE-248-d
  - QE-248-e
  - QE-248-f
  - QE-248-g
  - QE-244-a
  - QE-244-c
  - QE-245-b
  - P-2
  - bapm-tranche2-ruling
  - bapm-page-closes
  - se-ABC-248/20261101T075832Z-software-engineer-decision-237b57fb
  - se-ABC-248/20261101T075832Z-software-engineer-observation-b9dc61b6
  - se-ABC-248/20261101T075832Z-software-engineer-observation-64b1718e
  - se-ABC-248/20261101T075832Z-software-engineer-observation-aedad93f
  - grugops/ABC-248
  - 18bad5fb
  - 71700836
  - 7e9ab524
  - 46365ed0
  - grugops/qe-ABC-248
  - af00650c
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:1c1e2c9066b71aaab8502fc1c235fff37c4d9326db9e5355de5637bb4bebb975
---

# `qe-ABC-248` artifacts: branch `grugops/qe-ABC-248` (from `18bad5fb`), PREREG `af00650c`, raw evidence and scripts under `.grugops/context/qe-ABC-248/raw/`

- **Branch:** `grugops/qe-ABC-248`, worktree `.claude/worktrees/qe-ABC-248`, from the SE's tip `18bad5fb`.
  - Code under test: `71700836`. Base: `main` `46365ed0`.
  - Nothing was pushed and nothing was merged.
- **Files edited:** none under `src/`, `tools/`, `data/` or `plans/board.md`.
- **`raw/PREREG.txt`:** lists, rules and runner hash, committed as `af00650c` before any run.
- **`raw/qe-scripts/`:**
  - `mut.mjs` — QE's kill runner.
  - `parity.mjs`
  - `census.mjs` and `census-table.mjs` — A7 and non-vacuity.
  - `helpers.mjs` — A4 helper identity.
  - `names.mjs` — A3.
  - `g8.mjs`, `host.mjs`, `clear.mjs`, `waitpid.mjs` — `qe-ABC-246`'s, unchanged.
  - `lane.mjs` and `readout.mjs` — `qe-ABC-244`'s. `lane.mjs` has its file set changed.
  - `seal.mjs`
- **`raw/kill/`:** `kill-{B,H}-{uci,nm}.jsonl`, `parity-uci.out`, `parity-nm.out`, `run-k.sh`.
- **`raw/census/`:** `census-{B,H}.tsv`, `probe-{B,H}.txt` (`insideNull` / `underNull` / A4-a2 info line),
  `census-table.out`.
- **`raw/deep/`:** `escaped.txt` (4 passed), `unescaped.txt` (241 skipped, rc 0), `unset.txt`.
- **`raw/p2/`:** `kill-H-p2.jsonl`, `p2.log`, `qpathoff-npm-test.txt`.
- **`raw/gates/`:** `lint.txt`, `typecheck.txt`, `build.txt`, `skip.txt`, `inv.txt`.
- **`raw/a4/`:** `helpers.txt`, plus the A5 and pinned loop bodies at B and at H (deep block, de-indented).
- **`raw/g8/`:** `g8.log`, `g8-wait.log`, `stdout.txt`, `g8-perfile.txt`, `names.txt`, `pre-g8-top.txt`, a tail of each
  run, and the `last-run.json` hashes.
- **`raw/n8/`:** `n8.tsv`, `readout.txt`, `stdout.txt`, `wait.log`.
- **Commands run:**
  - `npm run lint`, `npm run typecheck`, `npm run build`.
  - `npm test`: ×6 in `G8`, ×6 in P-2, and 1 capture re-run.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
  - `node tools/grugops/lane-inventory.js`.
  - `node_modules/.bin/vitest`, for the per-file kill runs, the census, the deep lane and `N8-LANE`. Never npx.
- **Not run:** coverage (not asked), any `*_DEEP` lane other than ruling 6's describe, and the deep lanes against the P-2
  survivors.
