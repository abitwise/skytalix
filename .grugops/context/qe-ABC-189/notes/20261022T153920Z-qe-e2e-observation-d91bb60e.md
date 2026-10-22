---
id: 20261022T153920Z-qe-e2e-observation-d91bb60e
kind: observation
by: qe-e2e
at: 2026-10-22T15:39:20Z
verified_by: 
confidence: high (own runs)
refs:
  - ABC-189
  - AR-168-BINPIN
  - 2022a8d8
  - 66fd8e1b
  - 91883f94
  - deb555d2
  - 823a9885
  - 20261022T153720Z-qe-e2e-observation-c55e148e
supersedes: 
seal: sha256:f7f08d8d1b1d533aeb352231be1cf20e4c8c2e4645970e02d845056b7d4b209f
---

# qe-ABC-189 re-merge: main moved 823a9885 → 66fd8e1b during the hop; merged at 2022a8d8; every reading reproduces

- `main` gained 6 commits (`b3e4c959` … `66fd8e1b`). `git diff --name-only 823a9885 66fd8e1b` touches only `.grugops/` and `plans/`.
  It touches no `src/`, `package*.json`, `AGENTS.md`, `tsconfig*.json`, `vitest.config.ts` or `tools/`.
- `git merge --no-edit main` gave a clean merge, `2022a8d8`. `src`, the package files, `AGENTS.md`, the tsconfigs, the vitest config and `tools` are byte-equal to `91883f94`.
- At `2022a8d8`, the gates:
  - lint, typecheck and build give rc 0;
  - `npm test` gives rc 0, 60/60 and 1995/1995, with `success` true;
  - the skip-count capture as spelled gives `0`, and integrity prints `No findings.`
- The waiver form `main..2022a8d8` prints nothing.
- A2 on an export of `2022a8d8`: the real file is `1 passed`. `(iv-b)` and `(iv-a)` are `1 failed` on `:1823`, with the AR-168-BINPIN message.
