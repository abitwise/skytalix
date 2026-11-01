---
id: 20261101T071525Z-qe-e2e-observation-bdf4e139
kind: observation
by: qe-e2e
at: 2026-11-01T07:15:25Z
verified_by: 
confidence: high: files listed are committed on grugops/qe-ABC-246 (an observation, not an artifact-ref: no §14-gate run to bind)
refs:
  - qe-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - ADR-0046
  - NFR-008
  - ABC-221
  - ABC-170
  - ABC-248
  - QE-221-a
  - QE-221-b
  - SE-221-g
  - SE-246-a
  - QE-246-a
  - QE-246-b
  - QE-246-c
  - QE-246-d
  - W1
  - bapm-tranche2-ruling
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-246/20261101T070329Z-software-engineer-decision-2f43204c
  - se-ABC-246/20261101T070329Z-software-engineer-observation-8de958b6
  - se-ABC-246/20261101T070329Z-software-engineer-observation-851629b3
  - se-ABC-246/20261101T070329Z-software-engineer-observation-0d04bf8a
  - grugops/ABC-246
  - 3c5e05fd
  - a1942ea0
  - 832ff246
  - grugops/qe-ABC-246
  - c95e6324
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:e7dc415427f00e0a748bf585cabfe1ee0356b99c1de90c0d2a63b33ad030f32a
---

# `qe-ABC-246` artifacts (committed on `grugops/qe-ABC-246` under `.grugops/context/qe-ABC-246/raw/`)

- `PREREG.txt`: the pre-registration, commit `c95e6324`, before any run.
- `qe-scripts/`:
  - `setup.sh`: the scratch trees H and B.
  - `plant.mjs`: none, HSCM and CLOCKWINSCM on the whole lane, at H and B.
  - `a4.mjs`: the comment-only diff check.
  - `a4-readings.ts`: the `ABC-170` A2 readings count.
  - `g8.mjs`: `qe-ABC-245`'s script with an optional order argument.
  - `names.mjs`: the tree regex.
  - Copied unchanged from `qe-ABC-245`: `host.mjs`, `clear.mjs`, `waitpid.mjs` and `seal.mjs`.
- `plants/`: `plant-{H,B}-*.red.txt`, `plants-summary-{H,B}.txt`, and `json-sha256.txt` (the json stayed in scratch).
- `a4/`: `a4-diff.txt` and `a4-readings.txt`.
- `gates/`: `setup.txt`, `diff.txt`, `lint.txt`, `typecheck.txt`, `build.txt`, `skip.txt`, `inv.txt` and
  `tree-integrity.txt`.
- `g8/`:
  - `g8.log`, `g8-wait.log`, `stdout.txt` and `pre-g8-top.txt`;
  - `g8-{1..6}-{base,head}.txt`, the full `npm test` outputs;
  - `g8-perfile.txt`, `counts.txt` and `names.txt`;
  - `last-run-sha256.txt` (the last-run.json files stayed in scratch).
- `notes/`: the note bodies and `spec.json`.
- Host paths are replaced by `<scratch>`, `<repo>` or `<worktree>`.
- Scratch `qe-246/` (H, B, P and the json outputs) was removed at the end of the hop. No process was left running.
