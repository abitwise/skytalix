---
id: 20261011T104858Z-software-engineer-decision-abc144-build-k3-as-ruled-a1f4c720
kind: decision
by: software-engineer
at: 2026-10-11T10:48:58Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - ABC-042
  - vitest.config.ts
  - src/cli.test.ts
supersedes:
---

# SE `ABC-144`: built k = 3 exactly as `ADR-0040` (+ Window A addendum, accepted 2026-10-11) rules it

- **`vitest.config.ts`:** `test.maxWorkers: 3`. `pool: "threads"` unchanged. `isolate`, `minWorkers`,
  `fileParallelism` and `poolOptions` are not written. `scripts.test` is not touched.
- **Plain-object form taken** (`export default { … } satisfies ViteUserConfig`, with
  `import type { ViteUserConfig } from "vitest/config"`). `npm run typecheck` exits 0 on it, which closes
  the ADR's `UNKNOWN - verify` on that point. So the `defineConfig` fallback was not needed.
- **Header:** one paragraph is added after the existing text. It names `ADR-0040`, the cap, why 3, the pin, and
  the env rule. The isolation warning and the `pool: "threads"` paragraph are unchanged, byte for byte.
- **The pin (`A7`):** one `it` in its own `describe`, appended at the END of `src/cli.test.ts`. That is far
  from the `A10` literal that `ABC-143` edits. It is the Architect's sketch (`…df7355cf`) with the
  addendum's three literals at 3. It adds one type-only import, `ViteUserConfig` from `vitest/config`,
  beside the `vitest` import.
- **The env half is kept.** r3 and r3b went red (see the readings note), so the residual "an exported
  `VITEST_MAX_THREADS` raises the cap unseen" does NOT apply.
