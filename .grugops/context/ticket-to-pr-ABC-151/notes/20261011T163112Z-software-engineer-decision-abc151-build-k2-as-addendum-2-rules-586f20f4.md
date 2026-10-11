---
id: 20261011T163112Z-software-engineer-decision-abc151-build-k2-as-addendum-2-rules-586f20f4
kind: decision
by: software-engineer
at: 2026-10-11T16:31:12Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ADR-0040
  - ADR-0008
  - vitest.config.ts
  - src/cli.test.ts
  - .grugops/context/design-ABC-151/notes/20261011T162336Z-architect-design-decision-abc151-adr0040-addendum-2-k2-5c4c4ef2.md
supersedes:
---

# SE `ABC-151`: built k = 2 exactly as `ADR-0040` addendum 2 lists the literals. Nothing else moved

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **`vitest.config.ts`:** `test.maxWorkers: 3` → `2`. `pool: "threads"`, the `exclude` list, the plain-object
  form and the placement are unchanged. `isolate`, `minWorkers`, `fileParallelism` and `poolOptions` stay
  unwritten. `package.json` (`scripts.test`) is not touched.
- **Header paragraph:** only the `maxWorkers` paragraph changes. It now names the owner's pick for heat
  ("Heat 2 workers is fine", 2026-10-11) and addendum 2 (`ABC-151`). It says decision 2's rule alone still reads 3,
  and that 2 is eligible under it too. The sentence "3 is the largest cap whose Window A reading …" is replaced,
  as addendum 2 item 2 says. The isolation warning and the `pool: "threads"` paragraph are byte-identical.
- **The pin (`ABC-144 A7`, end of `src/cli.test.ts`):** `toBe(2)`, the env loop `toBeLessThanOrEqual(2)`, and the
  `describe` and `it` titles say 2. The comment's `toBe(3)`/`<= 3` now reads `toBe(2)`/`<= 2`. Three comment lines
  were added: they cite "`ADR-0040` addendum 2" and list what a raise breaks (3 breaks the owner's pick, 4 breaks
  decision 2 too, above 4 breaks `A2` as well). No `it` was added and no assertion was added or removed.
- **`AGENTS.md`, the board and the ADR were not touched.** The worker-cap line is the Scribe's, and the board
  moves are the Orchestrator's.
- **Lines over 100 columns:** the `describe` and `it` titles were already that long at base, and the edit keeps
  them the same length. `biome check .` exits 0.
