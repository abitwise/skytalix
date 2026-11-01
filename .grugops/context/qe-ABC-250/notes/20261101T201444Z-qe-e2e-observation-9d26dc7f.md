---
id: 20261101T201444Z-qe-e2e-observation-9d26dc7f
kind: observation
by: qe-e2e
at: 2026-11-01T20:14:44Z
verified_by: 
confidence: high: paths, commits and hashes as recorded (observation: an artifact-ref needs §14-gate provenance this hop has not got)
refs:
  - qe-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0055-D3-V2
  - NFR-001
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - ABC-251
  - ABC-252
  - ABC-261
  - QE-261-c
  - QE-250-a
  - QE-250-b
  - QE-250-c
  - QE-250-d
  - QE-250-e
  - 20261101T194515Z-qe-e2e-decision-7ff2b573
supersedes: 
seal: sha256:d294fdca78553e0c45714e99f0b3290a0adf012a54b31974bfa25031ad693723
---

# qe-ABC-250 artifacts: branch, commits, scripts, raw files and hashes

QE/E2E, task `qe-ABC-250`. An observation, because the writer refuses an `artifact-ref` without §14-gate provenance.

- **Branch:** `grugops/qe-ABC-250` from `grugops/ABC-250` `35139b31` (code `2e04eee5`, base `ceb28780`). Worktree `.claude/worktrees/qe-ABC-250`. Not pushed, not merged.
- **Commits:** `746d2889` (claim), `eaa3d4ce` (PREREG and scripts), then the evidence-and-notes commit and the done move.
- **Scripts** (`raw/qe-scripts/`): the PREREG lists the hashes of the timed set. Added after the timed job (untimed only): `qe-scripts/plant.py` 6403bc33cd30b210; `qe-scripts/gates.sh` a3b3ed0908709229; `qe-scripts/g4-and-261.sh` 319e2674f47e9d03; `a4/grade.json` 14e25b252c452e94; `a5/grade.json` eae6810e75074d42; `a5/g56.json` 11a4250356f54bfc; 
- **Raw:**
  - `raw/times.txt`;
  - `raw/a4/`: `a4.jsonl`, `a4-rerun.jsonl`, the analyses, `grade.json`;
  - `raw/a5/`: `a5.jsonl`, `analysis-main.jsonl`, `grade.json`, `g56.json`;
  - `raw/gates/`: lint, typecheck, build, G8 and its tails, skips, lanes, G9, G1, QE-261-c, and `deep/`;
  - `raw/g4/`: summary, `g4-H.jsonl.gz`, `g4-sample-H.jsonl.gz`; B equals H by `cmp`;
  - `raw/plants/`.
- **Commands** (each under `flock …/scratchpad/host-test.lock`):
  - `bash run.sh <scratch> <raw> <scripts>` (A4 then A5);
  - `bash gates.sh …`, holding: npm run lint / typecheck / build; npm test ×6 (b h h b b h); the skip count; `test-skip-integrity.js --skip-count 0`; `lane-inventory.js`; the PUZZLE_DEEP, PERFT_DEEP, ENGINE_DEEP legal -t ABC-250 and the two transposition lanes; the plants; the ENGINE_DEEP engine lane;
  - `bash g4-and-261.sh`: main's gameend.nfr.test.ts on head's code, then the G4 pool.
- **Scratch** (not committed): `$SCRATCH/qe-250/{trees,FB,FP,out}`.
