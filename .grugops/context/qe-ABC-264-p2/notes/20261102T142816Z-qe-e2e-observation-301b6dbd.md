---
id: 20261102T142816Z-qe-e2e-observation-301b6dbd
kind: observation
by: qe-e2e
at: 2026-11-02T14:28:16Z
verified_by: 
confidence: high: paths, commits and window as recorded (observation: an artifact-ref needs a gate_run)
refs:
  - qe-ABC-264-p2
  - ABC-264
  - QE-264-p2-a
  - QE-264-p2-b
  - QE-264-p2-c
  - QE-264-b
  - ADR-0059
  - ADR-0056
  - EPIC-011
  - EPIC-010
  - grugops/qe-ABC-264-p2
  - 4d1c0616
  - 0b73f51d
  - e32b4745
  - qe-ABC-264-p2/20261102T134413Z-qe-e2e-decision-a63b4c37
  - orch-2026-10-30a/20261102T134058Z-orchestrator-decision-81ae2db4
  - tools/rating/rating.ts
  - src/levels.test.ts
supersedes: 
seal: sha256:7c88cb23364974f862aca3fd494b4290fbe7b18854481989121a62e988721850
---

# qe-ABC-264-p2 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

- **Branch and worktree:** branch `grugops/qe-ABC-264-p2`, worktree `.claude/worktrees/qe-ABC-264-p2`, from `grugops/ABC-264-fix` `4d1c0616`.
- **Commits:** claim `fe5a1b12`; PREREG `e32b4745`; then the notes commit and the closing commit.
- **Candidate and base:** candidate `4d1c0616` (code `358b5f4a` + `bcc82866`). Base `0b73f51d` is the merge-base with `main`; `src`, `tools` and `package.json` show no diff to `main`.
- **Host:** AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, node v26.12.1. cutechess-cli 1.5.1 and Stockfish 19 both equal their pins.
- **Window:** 2026-11-02T13:43:02Z to 14:27:19Z, all under `flock <host-test.lock>`.
- **Raw records** (host paths masked), under `.grugops/context/qe-ABC-264-p2/raw/`:
  - `gates/` (test, lint, typecheck, build);
  - `a6/`: d.log, cmd.txt, artifacts.txt, SHA256SUMS, host.log, machine.txt, summary.txt, cutechess-summary.txt, timing-and-pairs.txt;
  - `smoke/`: the same set, plus latency-and-pool.txt;
  - `levels/` (verbose log);
  - `note-src/`; `scripts/seal.mjs`.
- **Deleted after the figures were recorded** (brief): both PGNs, both cutechess `-debug` logs (`d.out` 10.9 MB, `r.out`), and the build clones.
- **Nothing left running.** Not pushed, not merged.
