---
id: 20261009T161600Z-qe-e2e-artifact-ref-abc102-qe-branch-probes-raw-outputs-and-commands-0dcd0fcf
kind: artifact-ref
by: qe-e2e
at: 2026-10-09T16:16:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - grugops/qe-ABC-102
  - .grugops/context/qe-ABC-102/probes/
  - .grugops/context/qe-ABC-102/notes/
supersedes:
---

# `ABC-102` QE artifacts: branch, probes, raw outputs, commands

This note is hand-authored and has no `seal`. It is a pointer, not a gate run: there is no
`gate_run` or `content_hash`, because no `§14-gate` verdict can be emitted on this install.

- **Branch:** `grugops/qe-ABC-102`, off `grugops/ABC-102-undo` @ `7caead3`. Worktree:
  `.claude/worktrees/qe-ABC-102`. This commit is QE's only one: docs, context, ticket § QE, one
  trace row.
- **Probes** (outside every lane; run from the worktree root):
  - `probes/loop-probe.ts`: `node .grugops/context/qe-ABC-102/probes/loop-probe.ts`. Exit 0,
    242/242. Output in `notes/raw-loop-probe.txt`.
  - `probes/mutants.mjs`: `node .grugops/context/qe-ABC-102/probes/mutants.mjs`. 10 mutants, each
    restored with `git checkout`. Output in `notes/raw-mutants.json.txt`.
  - `probes/help-permutations.ts`: 10080 renders, 0 hide a token. Output in
    `notes/raw-help-permutations.json.txt`.
- **Entry point:** `printf 'undo\nhelp\ne2e4\nundo\nundo\nquit\nundo\nquit\nquit\n' | node src/cli.ts`
  → `notes/raw-entry-white.stdout.txt` (exit 0, stderr empty).
  `printf 'undo\nhelp\nUNDO\nquit\nquit\n' | node src/cli.ts --colour black` →
  `notes/raw-entry-black.stdout.txt` (exit 0, stderr empty).
- **`N8-LANE` in-file reading:** `notes/raw-n8-infile-interleaved.txt`. Base was a detached
  worktree at `4c5eddc` in the session scratchpad, removed afterwards.
- **Gate commands** (from the `AGENTS.md` slots): `npm run lint`, `npm run typecheck`,
  `npm run build`, `npm test`,
  `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`,
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, and
  `npx vitest run src/command-input.test.ts --coverage --coverage.include=src/command-input.ts`.
- **A9:** `git diff --name-only 4c5eddc 7caead3 -- src/` and `git rev-parse <rev>:<file>` for
  the six fenced files.
