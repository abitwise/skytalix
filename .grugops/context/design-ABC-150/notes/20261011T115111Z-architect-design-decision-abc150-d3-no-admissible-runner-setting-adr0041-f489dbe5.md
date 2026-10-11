---
id: 20261011T115111Z-architect-design-decision-abc150-d3-no-admissible-runner-setting-adr0041-f489dbe5
kind: decision
by: architect-design
at: 2026-10-11T11:51:11Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ABC-149
  - ADR-0041
  - ADR-0040
  - ADR-0035
  - ADR-0008
  - NFR-008
  - RISK-ABC143-01
  - RISK-ABC147-02
  - memory-bank/50-decisions/ADR-0041-vitests-5x-is-the-module-runners-cross-module-interop-and-no-admissible-runner-setting-removes-it.md
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-d1-d2-factor-and-candidates-edc1ffd9.md
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-c4-admissibility-screen-blinds-mocks-f80e9eba.md
supersedes:
---

# `ABC-150` `D3`: the cause is the module runner's cross-module interop. **No admissible runner setting removes it**, so no lever is built here (`ADR-0041`, PROPOSED)

This note is hand-authored and unsealed.

- **The cause, C3:**
  - Every read of another `src/` module's export goes through a getter on a null-prototype namespace
    object that V8 holds in dictionary mode.
  - Removing that indirection removes ≥ 100 % of the excess on E, S and P.
  - Source maps (C1) and the worker thread (C2) remove ~0. The TS transform emits the same JS as Node.
- **The setting: none.**
  - The only vitest 3.2.7 value that removes the factor is `test.server.deps.external` over production
    `src/`, and it blinds the lane's mocks (`…f80e9eba`).
  - Under the ticket's pre-registered **split rule**, `ABC-150` closes on `D1`–`D3`. This ruling goes to
    BA/PM with the `D2` table.
  - `L1`–`L5` are not run.
- **Expected effect on lane CPU from `ABC-150`: 0.**
- **Composition:**
  - `ADR-0040` is unchanged (k = 3, its pin unchanged).
  - `ADR-0035`'s floors `F` carry over unchanged.
  - `ADR-0008` decision 7 is unchanged.
- **Recorded warning:** do not add a `deps.external` entry that matches production `src/`. A narrow one can
  blind a guard silently.
- **Routes left, each a new ticket and the owner's call:**
  - **(a) vitest ≥ 4.1 with `test.experimental.viteModuleRunner: false`.**
    - It is a major bump, so `ABC-149` goes first (`RISK-ABC143-01`), and Security reviews the lockfile.
    - It needs test content: namespace `vi.spyOn` in `render-seam.test.ts` and `cli.test.ts` → `vi.mock(…, { spy: true })`.
    - Its effect is `UNKNOWN - verify`.
  - **(b) a `src/` route.** None is proposed.
