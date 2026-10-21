---
id: 20261021T174146Z-software-engineer-decision-8fd17c58
kind: decision
by: software-engineer
at: 2026-10-21T17:41:46Z
verified_by: 
confidence: high (both rows built and read red/green at grugops/ABC-192 5d1fbaa7)
refs:
  - ABC-192
  - QE-176-a
  - QE-176-b
  - ABC-133
  - ABC-173
  - ABC-176
  - N8_SPAWN
  - grugops/ABC-192
  - 5d1fbaa7
  - 47a3c9a1
  - src/cli.test.ts
  - tools/grugops/heap-guard.js
  - plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
  - .grugops/context/bapm-rule-QE-176/notes/20261021T165442Z-ba-pm-decision-73efba41.md
  - .grugops/context/bapm-rule-QE-176/notes/20261021T165442Z-ba-pm-failed-attempt-ef39afc9.md
supersedes: 
seal: sha256:fd98baa239dc9c82b4b69da76959df440acddd4b416560da7b8440355209a25f
---

# ABC-192 design: one new describe block after ABC-176 in src/cli.test.ts, two in-process rows; 0 production lines, 0 children

- **A1 (QE-176-a), parser view (ABC-133).** `guardStreamFaultOf(ts, source)` parses `tools/grugops/heap-guard.js` with `ts.createSourceFile`. It requires exactly one top-level `export default function setup`, exactly one `guard(…)` call (identifier callee) anywhere inside it, exactly three arguments, and the third a `process.stdout` property access. Any other shape returns a named fault; the row puts the fault in its failure message.
- **Non-vacuity, in memory (ABC-173 A6 (static) house style).** Five planted setups: the real call → no fault; `process.stderr`, `{ write() {} }`, a setup whose only guard is in a comment (0 calls), and a setup with two calls → one fault each. Expected `[false, true, true, true, true]`.
- **A2 (QE-176-b).** Reads `node_modules/vitest/package.json` from the repository root, checks it is a version string, and compares it with the one literal `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"`. A comment above the literal says when to change it. The assertion message is `BUMP_RERUN_LIST`, the page's four-item list in order: (1) the ABC-176 capture arm, SUITE and ONE-FILE, refusal and green; (2) the reporter header's seven rows; (3) re-read RISK-ABC173-STATE (getPaths, catchError) and RISK-ABC143-01; (4) re-pin with reason and readings, never silently.
- **Not taken** (as the page fences): no spawned refusal row (N8_SPAWN stays 28), no spawned vitest, no in-process `setup` via `vi.doMock` (failed attempt `…ef39afc9`, not retried). No edit to `tools/`, `package*.json`, `vitest.config.ts` or `AGENTS.md`.
- Only `@vitest/coverage-v8` is not pinned by A2: the page names `vitest` only.
