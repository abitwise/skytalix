---
id: 20261011T163730Z-architect-design-decision-abc152-d4-split-fires-adr0042-4473fbb3
kind: decision
by: architect-design
at: 2026-10-11T16:37:30Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-149
  - ABC-151
  - ADR-0042
  - ADR-0041
  - ADR-0040
  - ADR-0008
  - RISK-ABC143-01
  - QE-144-a
  - memory-bank/50-decisions/ADR-0042-vitest-4-1-with-the-module-runner-off-turns-the-lane-red-beyond-spy-form-rewrites-so-no-runner-off-lever-is-built-and-the-bump-goes-to-the-owner.md
  - .grugops/context/design-ABC-152/notes/20261011T163730Z-architect-design-observation-abc152-d3-screen-0ec854fb.md
  - .grugops/context/design-ABC-152/notes/20261011T163730Z-architect-design-observation-abc152-d1-d2-reads-b3bc61c9.md
supersedes:
---

# `ABC-152` `D4` FIRES: no runner-off lever is built. `ADR-0042` (PROPOSED) sends the bump to the owner

This note is hand-authored and unsealed (no sanctioned writer on this install).

- **The split.** No runner-off configuration reached a green lane with the forms declared before the screen
  (R1–R2 at `1530b965`, and R3 disclosed at `f0edb392`). `F1` reads **91 red tests in 10 files**.
  - **`san.test.ts` ABC-013 A20 needs an assertion change under any reading of the forms.** A native ES
    namespace lists its keys in sorted order, so `Object.keys` reads `["parseSan", "toSan"]`. That is never
    `V5`-shaped.
  - `book.test.ts` ABC-094 A2 is a **silent premise**: `vi.resetModules()` is a no-op with the runner off.
- **The two options go to the owner, and no agent picks:**
  - **(1) ship 4.1.11 with the runner on.** It buys no CPU by this ruling (`UNKNOWN - verify`). It pays `V2`,
    `V12`, the `ADR-0040` pin re-arm and R3 (2 sites);
  - **(2) stay on 3.2.7.**
- **If any 4.1 route ships:**
  - `vitest` and `@vitest/coverage-v8` at `~4.1.11`, and `vite` held at `~7.3.6` by a direct
    devDependency;
  - the `ADR-0040` pin reads `VITEST_MAX_WORKERS` and `projects`;
  - the reporter reads unhandled errors in `onTestRunEnd` and has a load-time check.
- **Composition:** `ADR-0008` d7 holds by mechanism on 4.1.11. `ADR-0040` and `ADR-0041` are unamended until
  the owner picks.
