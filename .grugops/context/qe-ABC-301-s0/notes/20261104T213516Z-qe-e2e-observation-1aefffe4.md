---
id: 20261104T213516Z-qe-e2e-observation-1aefffe4
kind: observation
by: qe-e2e
at: 2026-11-04T21:35:16Z
verified_by: 
confidence: high (commands as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - qe-ABC-301-s0
  - grugops/qe-ABC-301-s0
  - grugops/ABC-301
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - ABC-274
  - E2
  - E4a
  - B-T1
  - NFR-008
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - QE-301-a
  - QE-301-b
  - QE-301-c
  - QE-301-d
  - QE-301-e
  - QE-301-f
  - 704e331f
  - 57e942fb
  - df7d07a2
  - se-ABC-301-s0/20261104T211909Z-software-engineer-decision-8fb36960
  - se-ABC-301-s0/20261104T211909Z-software-engineer-observation-f68982f4
  - se-ABC-301-s0/20261104T211909Z-software-engineer-observation-534a582c
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-4917f0f7
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-d0f7af61
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-2608eabc
  - orch-2026-10-30a/20261104T212001Z-orchestrator-decision-878035ca
  - src/evaluate.passer.test.ts
  - tools/tune/tracer.ts
  - tools/tune/tune.ts
  - tools/tune/tune.test.ts
supersedes: 
seal: sha256:0eef167984297c6d7c85f3b17ccf2d89968fc56068c7d3750d1d8571984444b6
---

# qe-ABC-301-s0 artifact record: branch grugops/qe-ABC-301-s0, records only, and the raw evidence

Sealed as an observation: an `artifact-ref` needs a section-14 `gate_run` this hop does not have.

- **Branch:** `grugops/qe-ABC-301-s0` from `grugops/ABC-301` `704e331f`, worktree `.claude/worktrees/qe-ABC-301-s0`. Not pushed, not merged. No `src/` or `tools/` file changed.
- **Commands, each under `flock <scratch>/host-test.lock`:** the mutant and plant loops `raw/batch1.sh`, `raw/batch2.sh`, `raw/batch4.sh`, `raw/batch5.sh`; `raw/batch3.sh`, which holds `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`, `npm run typecheck`, `npm run lint`, `npm run build`, `VITEST_MAX_WORKERS=1 npm test`, the skip-count capture, `test-skip-integrity`, the lane-cost loop and B-T1 (`node --max-old-space-size=3000 tools/tune/tune.ts extract <out dir> --lichess <file>`).
- **Raw:** `raw/formprobe.ts`, `raw/forms.jsonl`, `raw/summary.txt` (P1); `raw/plant.py`, `raw/plants.txt` (P2); `raw/emitprobe.ts`, `raw/emitprobe.clean.json`, `raw/bt1-extract.json`, `raw/b3.log` (P3); `raw/tracerdirect.ts`, `raw/tracerdirect.json`, `raw/mut301t.py`, `raw/toolmut.txt`, `raw/emitlane.txt`, `raw/gate-h5.txt` (the tracer and the emitter); `raw/mut301.py`, `raw/params.py`, `raw/fit-shape.txt`; `raw/lane-cost.txt`.
- **Left running:** nothing. Scratch copies are outside the repository.
