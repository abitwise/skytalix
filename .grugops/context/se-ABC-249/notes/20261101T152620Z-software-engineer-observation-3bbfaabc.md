---
id: 20261101T152620Z-software-engineer-observation-3bbfaabc
kind: observation
by: software-engineer
at: 2026-11-01T15:26:20Z
verified_by: 
confidence: high: paths and shas as committed
refs:
  - se-ABC-249
  - ABC-249
  - ADR-0054
  - QE-248-c
  - QPLY4
  - EPIC-010
  - grugops/ABC-249
  - 09d1f675
  - src/engine.test.ts
  - 25371747
supersedes: 
seal: sha256:de419527764210632467159637d32feea23ef74c5413963aea6bc3e892ca2529
---

# ABC-249 artifacts

- Branch `grugops/ABC-249` from `main` `09d1f675` (worktree `.claude/worktrees/se-ABC-249`); row commit `25371747`. Published as an observation: an artifact-ref needs a gate_run this hop does not have.
- Diff: `src/engine.test.ts` only. It adds one describe at the end of the file, "ABC-249 — a pre-root repetition met four plies deep scores 0 (QE-248-c)", with one row. No existing row, title or `expect(` line changes. Comments cite only ABC-249, ADR-0054 and QE-248-c. It reuses the file's existing helpers (`gameOf`, `moveOf`, `fixedDepth`, `priorKeysOf`, `occurrencesAfter`).
- The row asserts: prior length 8; the ply-4 position stands 2 times in the prior keys and 0 times on the line before it; with keys {f1e1, 404} at depth 4 and the root FEN unchanged after the search; withheld {f1g1, 497} and the root FEN unchanged after the search.
- Not committed: the out-of-tree QPLY4 copy and the `node_modules` symlink in the worktree (gitignored, there only to run the lane).
