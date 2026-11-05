---
id: 20261104T211909Z-software-engineer-observation-d7893f7d
kind: observation
by: software-engineer
at: 2026-11-04T21:19:09Z
verified_by: 
confidence: high (git commands as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - se-ABC-301-s0
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - E2
  - E4a
  - QE-271-f
  - QE-271-g
  - QE-271-h
  - QE-271-i
  - B-T1
  - NFR-008
  - R-N8H-1
  - arch-second-pull-1104/20261104T170627Z-architect-design-decision-4917f0f7
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-d0f7af61
  - qe-ABC-271/20261104T162300Z-qe-e2e-observation-2608eabc
  - orch-2026-10-30a/20261104T162502Z-orchestrator-decision-264e420e
  - orch-2026-10-30a/20261104T203850Z-orchestrator-decision-f30bd604
  - grugops/ABC-301
  - 57e942fb
  - df7d07a2
  - src/evaluate.passer.test.ts
  - tools/tune/tracer.ts
  - tools/tune/tune.ts
  - tools/tune/tune.test.ts
supersedes: 
seal: sha256:802ca87c7a92645137864a6a642de7f238201447fbe1a85bdb666ce1f139a8b8
---

# se-ABC-301-s0 artifact record: branch grugops/ABC-301, commits 57e942fb (rows) and df7d07a2 (tool), raw evidence

Sealed as an observation: an `artifact-ref` needs a section-14 `gate_run` this hop does not have.

- **Branch:** `grugops/ABC-301` from `main` `bbd0d54a`, worktree `.claude/worktrees/se-ABC-301`. Not pushed, not merged.
- **Commits:** `3d6d786e` claim; `57e942fb` test (`src/evaluate.passer.test.ts`: the P1 row, the P2 row); `df7d07a2` tool (`tools/tune/tracer.ts`, `tools/tune/tune.ts`, `tools/tune/tune.test.ts`).
- **Tests added:** default lane, one (`ABC-301 P1`), and one row widened (P2). `TUNE_DEEP`, five (`ABC-301 QE-271-i`).
- **Commands:** `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts`; `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`; `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`; the skip-count capture and `test-skip-integrity`; `raw/bt1.sh`; `raw/mutrun.sh`. Each under `flock <scratch>/host-test.lock`.
- **Raw:** `raw/forced-phase-probe.ts`, `.out`; `raw/mut.py`, `raw/mutrun.sh`, `raw/mutants-summary.txt`; `raw/guard-mutants.txt`; `raw/bt1.sh`, `raw/bt1-extract.json`; `raw/emit-base.ts`; `raw/row-durations.tsv`.
- **Migration:** none. **Docs:** the file headers touched. `AGENTS.md` is unchanged: the Tune deep lane line carries no count.
- **Left running:** nothing.
