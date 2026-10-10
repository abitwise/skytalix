---
id: 20261010T101420Z-software-engineer-decision-abc130-literal-pathspec-and-message-branch-3e1a7c50
kind: decision
by: software-engineer
at: 2026-10-10T10:14:20Z
verified_by:
confidence: high
refs:
  - ABC-130
  - ABC-118
  - ABC-118-G5
  - ABC-118-G4
  - tools/grugops/lane-inventory.js
  - .grugops/context/rule-abc119-a2/notes/20261010T100852Z-ba-pm-decision-9f278676.md
supersedes:
---

# `ABC-130`: the tracked set omits `.grugops/` by a literal `:!.grugops/` pathspec, and a collected `.grugops/` path gets its own line

Hand-authored, no seal (the degraded posture `AGENTS.md` describes). The ruled shape is applied as written.
The ruling note `…9f278676` lives on `grugops/ABC-119-r2` (commit `a6453bc`), not on the wave. I read
it there with `git show`.

- `OMITTED_DIR = ".grugops/"` and `OMITTED_FROM_TRACKED = ":!.grugops/"` are literals. They are
  passed to `git ls-files -z -- '*.test.ts' ':!.grugops/'` as a fixed argv, with no shell. Nothing is
  read from argv, the environment or `vitest.config.ts`, so `ABC-118` `A4` holds.
- **Message branch.** In the collected loop, a path that starts with `.grugops/` is checked **before**
  the tracked check. It prints `Collected by the lane from .grugops/, which is factory state the lane must
  exclude: <path> — restore the ".grugops/**" glob …`. This covers both tracked `.ts` probes and
  the tracked `.mjs` that `*.test.ts` never matches. Either way, G4's "NOT tracked by git" text cannot
  be printed for a `.grugops/` path. G4 is still open for every other path, as scoped.
- No test file was added, and the page names none. The tool sits outside the lane by design (`ABC-118`).
  The evidence is the out-of-repo mutant harness, `raw-harness.sh.txt`.
- **Not done (fenced):** `plans/`, `memory-bank/`, `.github/` and `.gemini/` get no pathspec. They
  hold 0 tracked `*.test.ts` (the page measured this). The QE `ABC-118` gaps G1–G4 and G6 are untouched.
