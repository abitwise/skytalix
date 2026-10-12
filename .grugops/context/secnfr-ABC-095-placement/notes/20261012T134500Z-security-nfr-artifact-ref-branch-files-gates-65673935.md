---
id: 20261012T134500Z-security-nfr-artifact-ref-branch-files-gates-65673935
kind: artifact-ref
by: security-nfr
task: secnfr-ABC-095-placement
at: 2026-10-12T13:45:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ADR-0036
  - ADR-0037
  - 20261012T132829Z-security-nfr-observation-placement-plants-bar4-scope-symlinked-copy-f0bf8b4a
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
supersedes:
---

# Branch, files and gates

This note is hand-authored and unsealed.

- **Branch.** `grugops/secnfr-ABC-095-placement`, in worktree `../wt-secnfr-ABC-095-placement`, from
  `main` `d0cde2e2`. It is not merged and not pushed.
- **Ruling commit `24cdc047`:**
  - `ADR-0036`: a § Status bullet, and `### S1 — the fourth holder — 2026-10-12` appended at the end;
  - `ADR-0037`: a dated pointer in § Status, saying that S1 and S2 are answered and R1 stands;
  - `plans/traceability.md`: one row, at the end;
  - notes `…f0bf8b4a` (the observation) and `…a096cf43` (the decision).
- **This note** is in the next commit, which holds notes only.
- **What is not touched:**
  - `src/`, `tools/` and `plans/board.md`;
  - `AGENTS.md`, `plans/nfr-catalog.md` (no security row moves) and every ticket page. `ABC-042` is
    not edited, because S2 needs no amendment.
  - the `ABC-095` SE worktree.
- **Gates on the tree of `24cdc047`,** run before the commit, with `node_modules` symlinked into the
  worktree root:
  - `npm run -s lint`: exit 0. Biome checked 109 files and applied no fixes.
  - `npm run -s typecheck`: exit 0.
  - `npm run -s build`: exit 0.
  - `npm test`: exit 0. 57 files; 1775 passed, 0 failed, 0 pending, 0 todo.
    `.test-results/last-run.json` has `success: true`.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`,
    exit 0.
- **Probes.** Every probe ran outside the repository: a scratch `git clone --no-hardlinks` of
  `d0cde2e2` for the plants, and a scratch directory for the symlink probe. Their readings are in
  `…f0bf8b4a`. No clock was read.
