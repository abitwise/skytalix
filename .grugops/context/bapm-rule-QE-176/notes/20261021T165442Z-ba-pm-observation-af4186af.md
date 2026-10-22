---
id: 20261021T165442Z-ba-pm-observation-af4186af
kind: observation
by: ba-pm
at: 2026-10-21T16:54:42Z
verified_by: 
confidence: high (each reading run at main 03ac8bc4 on scratch copies outside the repository; restored, cmp-checked)
refs:
  - ABC-192
  - QE-176-a
  - QE-176-b
  - N8_SPAWN
  - ABC-173
  - 03ac8bc4
  - tools/grugops/heap-guard.js
  - src/cli.test.ts
  - package-lock.json
  - plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
supersedes: 
seal: sha256:b87d601e73dd5441f58b7689e3c15dbe8ee8097e8965e5236d8764b181d3a81b
---

# ABC-192 cut readings at `03ac8bc4`: the parser-view row tells base from M4/M4b; a plain Node child does too (not taken); vitest 4.1.11 installed and locked; 0 version readers

Scratch copies under this session's scratchpad. None were in the repository or a worktree, and each was restored and checked with `cmp`. No timing gate was set; the child costs below are wall readings, not bars.

- **Parser view (ABC-192 `A1`'s shape)**: a TypeScript `createSourceFile` read of `heap-guard.js`, looking for the default-exported `setup` and its `guard(…)` calls.
  - base: 1 setup, 1 call, args `project`, `v8.getHeapStatistics()`, `process.stdout` → ok.
  - M4 (`process.stderr`): fault.
  - M4b (`{ write() {} }`): fault.
- **Plain Node child (not taken; it would make `N8_SPAWN` 29)**: `setup({})`, the "cannot look" route.
  - base: stdout 79 B (`heap-guard: project.vitest.state.getPaths() is gone; …`), stderr 0.
  - M4: stdout 0, stderr 79 B.
  - M4b: 0 / 0.
  - About 57–60 ms each.
  - The refusal route (a 59-file stub) needs a child heap above the row: at flag 128 it is admitted (0 B), and at flag 4096 base gives 238 B of stdout. That conflicts with ABC-173 `A6`'s child construction, so it is not usable.
- **Versions**: `package-lock.json` reads `vitest` 4.1.11 and `@vitest/coverage-v8` 4.1.11. `node_modules/vitest/package.json` reads 4.1.11. `package.json` reads `~4.1.11`. 0 `src/*.ts` files read `vitest/package.json`.
- **Budget pins**: `N8_SPAWN = 17 + 7 + 1 + 2 + 1` (28) at `src/cli.test.ts`. `ABC-173` `C2` requires synchronous child forms, ≥ 4 sites.
- **Line pointers**: no open page (ABC-168, -178, -189, -190) cites `src/cli.test.ts` past line 4160. The file has 4,325 lines.
- `AGENTS.md` 15,797 B.
