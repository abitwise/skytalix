---
id: 20261021T165442Z-ba-pm-failed-attempt-ef39afc9
kind: failed-attempt
by: ba-pm
at: 2026-10-21T16:54:42Z
verified_by: 
confidence: high (one run per build at 03ac8bc4, scratch copy outside the repository)
refs:
  - ABC-192
  - QE-176-a
  - tools/grugops/heap-guard.js
  - 03ac8bc4
  - plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
supersedes: 
seal: sha256:1b1c03bf9d3ea91d029f57c6ddc43b0c08cc9aae85be05f2c61afcaf7cc2f196
---

# An in-process `setup` row via `vi.doMock("node:worker_threads")` does not reach heap-guard.js: `setup` still throws "off the main thread"

- **What was tried.** In a scratch copy (`git archive 03ac8bc4` + copied `node_modules`, private TMPDIR): a test file calling `vi.resetModules()`, then `vi.doMock("node:worker_threads", () => ({ isMainThread: true }))`, then dynamically importing `../tools/grugops/heap-guard.js`. It spied on `process.stdout.write` and `process.stderr.write`, then called `setup({})`. Run at `NODE_OPTIONS=--max-old-space-size=400`.
- **Result.** On base, M4 and M4b alike: `expected [Function] to throw error matching /getPaths\(\) is gone/ but got 'heap-guard: globalSetup ran off the m…'`. The mock does not apply to that module, which is consistent with the module runner being off (`ADR-0042` addendum).
- **Do not retry.** ABC-192 `A1` uses the parser view.
