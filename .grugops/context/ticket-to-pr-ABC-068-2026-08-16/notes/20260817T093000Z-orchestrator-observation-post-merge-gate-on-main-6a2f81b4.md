---
id: 20260817T093000Z-orchestrator-observation-post-merge-gate-on-main-6a2f81b4
kind: observation
by: orchestrator
at: 2026-08-17T09:30:00Z
verified_by: 
confidence: high
refs:
  - src/cli.test.ts
  - 3232929
  - 30ea8f3e21c34996feba2f315a0f3b114d2285b1
supersedes: 
---

# `ABC-068` — the post-merge gate on `main`, RUN rather than assumed

`AGENTS.md` § Safety rules: the merge grant is approval to merge work that PASSED, never to skip or
soften a gate — *"run the gates on the branch tip before and on `main` after, and record both."* The
before is in this task's earlier note. This is the after.

**Merge commit `3232929`** (`--no-ff` of `grugops/abc068-helper-contracts` into `main`).
**Delivered commit `30ea8f3`.**

| gate | command | result on `main` @ `3232929` |
|---|---|---|
| lint | `npm run lint` | `Checked 54 files in 88ms. No fixes applied.` exit 0 |
| typecheck | `npm run typecheck` | no output, exit 0 |
| build | `npm run build` | no output, exit 0 |
| unit | `npm test` | `Test Files 30 passed (30)`, `Tests 861 passed (861)`, exit 0 |
| skip count | `npx vitest run --reporter=json \| jq …` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js … --skip-count 0` | `No findings.` exit 0 |

**861 on `main` after the merge equals 861 on `main` before it and 861 on the branch tip.** All three
were measured, none quoted. That is `A5`'s zero-behaviour-change property surviving the merge, not
merely asserted about the branch.

Re-checked on the merged tree rather than trusted from the branch:

- **`A7`** — `git diff --name-only 30ea8f3~1 30ea8f3`, excluding `.grugops/`, is exactly
  `src/cli.test.ts`. One path.
- **`A6`** — the separator literal appears **1** time in `src/cli.test.ts` on `main`. The merged
  guard's property about the file's vocabulary is intact after the merge, not just before it.

**No deploy was performed and none exists to perform** (`AGENTS.md` § Deployment posture).
`production_requires_human_confirmation` is untouched and still `true`.
