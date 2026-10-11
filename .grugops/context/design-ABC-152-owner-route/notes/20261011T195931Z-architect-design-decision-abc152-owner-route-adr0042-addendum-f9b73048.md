---
id: 20261011T195931Z-architect-design-decision-abc152-owner-route-adr0042-addendum-f9b73048
kind: decision
by: architect-design
at: 2026-10-11T19:59:31Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0041
  - ADR-0035
  - ADR-0008
  - ABC-094
  - ABC-013
  - QE-151-a
  - QE-151-b
  - QE-149-a
  - QE-149-c
  - QE-144-a
  - RISK-ABC143-01
  - RISK-ABC144-FCAP
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC152-A2-GRAPH
  - memory-bank/50-decisions/ADR-0042-vitest-4-1-with-the-module-runner-off-turns-the-lane-red-beyond-spy-form-rewrites-so-no-runner-off-lever-is-built-and-the-bump-goes-to-the-owner.md
  - .grugops/context/wave-2026-09-25/notes/20261011T194129Z-orchestrator-decision-owner-word-abc151-keep-k2-abc152-runner-off-one-ticket-06bfc2d7.md
  - .grugops/context/design-ABC-152/notes/20261011T163730Z-architect-design-observation-abc152-d3-screen-0ec854fb.md
  - .grugops/context/design-ABC-152-owner-route/probe/READINGS.md
supersedes:
---

# `ABC-152`: the owner's route is ruled in `ADR-0042`'s addendum. 4.1.11, runner off, R1–R5, A20 sorted, A2 by query import, pin at k = 2 on `VITEST_MAX_WORKERS`

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). The authority is
the addendum. This note points at it and does not restate it in full.

- **The owner's pick** (`…06bfc2d7` item 2) overtakes `ADR-0042` decision 3. Decisions 1, 2 and 4 take effect.
  "One ticket" overrides the ADR's Rollback ("a new ticket").
- **Ruling 1, the forms:**
  - R1 namespace spy → `{ spy: true }`;
  - R2 fresh-registry stub → `{ spy: true }` + `mockImplementation` / reset;
  - R3 `vi.fn(mock)` → a call-through wrapper;
  - R4 top-level `await import` → a static import;
  - R5 call-through factory → `{ spy: true }`.
  - **Armed** = a plant in production code that adds or removes one call turns the guard red. For an expected-0
    guard, the plant adds the call. A green is never evidence.
  - Shown here on `glyph-mode.nfr` (`NFR-007`): 4 plants, all red.
- **Ruling 2, A20:** `Object.keys(namespace).sort()` must equal `["parseSan", "toSan"]`. It pins the exact surface,
  and an extra export or an alias is red.
- **Ruling 3, A2:** ``import(`./book.ts?abc094-a2=${run}`)`` replaces `vi.resetModules()`. A load-time salt plant is
  red under it and green (blind) under the old form.
  - It narrows freshness to `book.ts` itself (`RISK-ABC152-A2-GRAPH`). The owner may overrule.
- **Ruling 4, the pin:**
  - `A7` is edited in place: `maxWorkers` is 2, `Object.hasOwn(test, "poolOptions")` is false, and `projects` is
    undefined;
  - `VITEST_MAX_WORKERS` is parsed as vitest parses it (no radix, empty ignored), with `1 ≤ n ≤ 2`. This folds
    `QE-151-a` and `QE-151-b`. `0` and `abc` raise to 7 on 4.1.11;
  - `V3` +1 `it`: `viteModuleRunner` is exactly `false`;
  - `cli.test.ts` `expect(` is +3, and tests are base + 1.
  - 13 plants red, 3 green, as designed.
- **Ruling 5, the reporter:**
  - `onTestRunEnd(testModules, unhandledErrors, reason)` replaces `onFinished`, plus a load-time check;
  - **the unhandled row's plant must await its timer.** The un-awaited form races on 4.1.11 (5 of 10 runs saw
    nothing);
  - `QE-149-a` is fixed by a one-line join;
  - `QE-149-c`: all six rows by content, plus `M9b`.
- **Ruling 6, CPU:** `V9`: H − B paired median CPU ≤ −15 % merges; (−15 %, 0) with the interval below 0 → the
  owner; else no merge.
  - The instrument is `lane144b.mjs`: width 1, n ≥ 8, round 0 discarded, unprofiled.
  - Each tree runs its own `npm ci`, behind the step-0 gate.
  - `V10`: cooled owed if warm + R > 9.0 s.
  - No floor `F` carries over the merge.
- **Ruling 7, the owner's:** any case that needs a test deleted, skipped, moved, merged or weakened, or a guard no
  admitted form arms. **Found: 0** (`UNKNOWN - verify` across all `V4` plants). Also the A2 narrowing, `ADR-0042`'s
  acceptance, and `V9` outside the band.
