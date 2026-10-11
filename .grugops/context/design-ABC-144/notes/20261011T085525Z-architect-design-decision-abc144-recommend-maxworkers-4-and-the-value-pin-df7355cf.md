---
id: 20261011T085525Z-architect-design-decision-abc144-recommend-maxworkers-4-and-the-value-pin-df7355cf
kind: decision
by: architect-design
at: 2026-10-11T08:55:25Z
verified_by:
confidence: medium
refs:
  - ABC-144
  - ADR-0040
  - ADR-0008
  - ADR-0035
  - ADR-0017
  - ABC-042
  - ABC-138
  - ABC-143
  - ABC-083
  - ABC-085
  - AR-N8SPAWN-DRIFT
  - N8-LANE
  - N8-SPAWN
  - NFR-008
  - memory-bank/50-decisions/ADR-0040-the-default-lane-holds-at-most-four-test-workers-pinned-by-value-and-isolation-stays-on.md
supersedes:
---

# `ABC-144`: recommend `test.maxWorkers: 4` (`ADR-0040`, proposed). It is held by a value pin, never a timing

`ADR-0040` carries the full text. This note is the hand-off for the Engineer and for QE.

## The setting (`ADR-0040` d1)

- **`vitest.config.ts`:** add `maxWorkers: 4` under `test`. `pool: "threads"` stays. Do not write `isolate`,
  `minWorkers` or `poolOptions`. `scripts.test` is not touched.
- **The config form:** change `import { defineConfig } from "vitest/config"` to
  `import type { ViteUserConfig } from "vitest/config"`. Change `export default defineConfig({ … })` to
  `export default { … } satisfies ViteUserConfig`.
  - Why: the pin then imports a module with no run-time dependency, not all of `vite`.
  - Read at this hop: vitest resolves the form (effective 4).
  - `npm run typecheck`: `UNKNOWN - verify`. If it fails, keep `defineConfig` and report the pin's
    narrow-set CPU under `N8-LANE`.
- **The header comment** gains one paragraph that names `ADR-0040` and the cap. The isolation warning is
  not edited.
- **The number is 4 unless Window A rules otherwise** (`ADR-0040` d2, the selection rule). The Engineer
  builds whatever k the ADR's addendum records.

## The value check (`A7`, `ADR-0040` d3)

One new `it`, in its own `describe`, in `src/cli.test.ts`. Place it away from the `A10` literal at `:1648`,
because `ABC-143` edits that hunk. Shape (the Engineer owns the exact text):

```ts
// at the top, beside the other type imports:
import type { ViteUserConfig } from "vitest/config";

describe("ABC-144 A7 — the lane's runner holds its worker cap and keeps isolation (ADR-0040)", () => {
  it("vitest.config.ts resolves to 4 threads workers with isolation on, and no env raises it", async () => {
    const { default: lane } = await import("../vitest.config.ts");
    // Widened on purpose: `satisfies` keeps the literal type, and the keys asserted ABSENT
    // (`isolate`, `fileParallelism`, `poolOptions`) would not exist on it.
    const test: NonNullable<ViteUserConfig["test"]> = lane.test ?? {};
    expect(test.pool).toBe("threads");
    expect(test.maxWorkers).toBe(4);
    expect(test.fileParallelism ?? true).toBe(true);
    expect(test.isolate ?? true).toBe(true);
    expect(test.poolOptions).toBeUndefined();
    for (const name of ["VITEST_MAX_THREADS", "VITEST_MAX_FORKS"]) {
      const raw = process.env[name];
      if (raw !== undefined) expect(Number.parseInt(raw, 10), name).toBeLessThanOrEqual(4);
    }
  });
});
```

**Why each line is there.** The lines follow vitest 3.2.7's own precedence (`…222e288c` item 1):
- `fileParallelism: false` → 1 worker;
- `poolOptions.threads.maxThreads` outranks `maxWorkers`;
- the env outranks both;
- `A10`'s byte pin on `scripts.test` closes the CLI-flag route.

**`toBe(4)`, not `≤ 4`.** That is stricter than `A7`'s "raised above", on purpose. Lowering the cap moves
`A3`/`A4`'s wall and the floors `F`, so it is a ruling. The env check allows lowering only. That is the
operator's per-shell lever at width ≥ 2.

**Armed before it is trusted.** Record each red on a scratch copy:
- (r1) delete `maxWorkers: 4`;
- (r2) add `isolate: false`;
- (r3) `VITEST_MAX_THREADS=8 npx vitest run src/cli.test.ts -t "ABC-144"`.

If (r3) stays green, the worker does not see the variable. Then remove the env loop, and record the residual
"an exported `VITEST_MAX_THREADS` raises the cap unseen".

**The account:**
- 0 files, 0 spawns (`N8_SPAWN` stays 27; `ABC-138`'s pin counts only calls that name `child_process`);
- **+1 test**, so `A6`'s count reads **base + 1**, declared here before any reading;
- the cost is milliseconds in process, inside `AR-N8SPAWN-DRIFT`'s narrow set, far below `F` = 1.097 s.

**For QE, `A2` from the resolved configuration** (test note 4). Run
`node .grugops/context/design-ABC-144/probe/resolved-workers.mjs` at head's root. Expect
`effectiveWorkers: 4`, `isolate: true`. Base prints 7.

## The floors and the straddle (`ADR-0040` d4, d5)

- **Narrow sets of ≤ 4 files:** the recorded `F` carries over provisionally. That includes
  `src/cli.test.ts` 1.097 s, `history-pane.nfr` 0.058 s and the two-file set 0.038 s. The next three
  readings replace them.
- **Sets of more than 4 files, and the full lane:** they are re-read under the cap. Until then they take the
  provisional 16 % rule, or the window's twin R.
- **A paired reading whose base and head differ in `vitest.config.ts` is not a reading of the ticket.**
  Rebase first (`ABC-083`'s open +1.08 s, `ABC-085`'s `LADDER_DEEP`).

## Gates for the build

lint, typecheck, build and `npm test`. 0 `src/` production lines. Then the QE hop, then `In Security/NFR`
for `A1`–`A5` in Window B (`…ff54a750`). `A6`'s 20-run screen needs no quiet window.
