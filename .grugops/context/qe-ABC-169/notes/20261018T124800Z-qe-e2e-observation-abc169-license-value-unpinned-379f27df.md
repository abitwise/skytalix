---
id: 20261018T124800Z-qe-e2e-observation-abc169-license-value-unpinned-379f27df
kind: observation
by: qe-e2e
task: qe-ABC-169
at: 2026-10-18T12:48:00Z
verified_by:
confidence: high
refs:
  - ABC-169
  - QE-169-a
  - ABC-042
  - 20261018T124600Z-qe-e2e-observation-abc169-acceptance-readings-9b0bf9ae
supersedes:
---

# QE-169-a (LOW, residual): no test pins the value of `license`; `"MIT"` passes the whole default lane

Hand-authored and unsealed. No timing was read. Each mutant was planted in the scratch worktree's working tree, and
`package.json` was restored and its md5 re-checked after each one.

| mutant in `package.json` | lane | result |
|---|---|---|
| `"license": "MIT"` | whole `npm test` | **survives**: exit 0, 58 files, 1830/1830 |
| `"license": ""` | `vitest run src/cli.test.ts -t 'ABC-042'` | **survives**: exit 0, 31 passed (47 filtered out by `-t`) |
| `"licence": "UNLICENSED"` (key spelling) | same | killed: 1 failed (A10) |
| `"private": false` | same | killed: 1 failed |

A10 checks key names, not values. `git grep -i 'licen[cs]e|UNLICENSED'` finds no test under `src/` or `tools/`. So
only a hop's reading checks A1's value, and a later edit to it would go unnoticed. The ticket fences a new test
(Out of scope: *"including a new test for the `license` key"*), so this is not a delivery defect. BA/PM can cut a
value pin, or the owner can accept the gap as a residual.
