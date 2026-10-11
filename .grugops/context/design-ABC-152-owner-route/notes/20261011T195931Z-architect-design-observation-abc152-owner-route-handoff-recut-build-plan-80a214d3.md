---
id: 20261011T195931Z-architect-design-observation-abc152-owner-route-handoff-recut-build-plan-80a214d3
kind: observation
by: architect-design
at: 2026-10-11T19:59:31Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - QE-151-a
  - QE-149-a
  - QE-149-c
  - QE-144-a
  - plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
  - .grugops/context/design-ABC-152-owner-route/notes/20261011T195931Z-architect-design-decision-abc152-owner-route-adr0042-addendum-f9b73048.md
supersedes:
  - .grugops/context/design-ABC-152/notes/20261011T163730Z-architect-design-observation-abc152-handoff-owner-build-plan-cff84b67.md
---

# `ABC-152` owner route: what BA/PM re-cuts, the build plan, the owner's cases, the board

This note is hand-authored and unsealed. It supersedes the hand-off `…cff84b67`, whose build plans assumed option (1)
or option (2).

## Board (the Orchestrator's move)

- `ABC-152` leaves `In Design` once BA/PM re-cuts the page. The design is just enough.
- **Then `Ready for Dev`.** `ABC-149` and `ABC-151` are merged on `main`, so nothing it depends on is open.
- `ADR-0042`'s acceptance is owed. Recommended: it holds the **merge**, not the build.

## BA/PM must re-cut on the ticket (before the build; ticket prose budget: overflow to notes)

1. **The header and § Scope.** The owner's word of 2026-10-11 (`…06bfc2d7`) replaces the reading "his yes covers only
   spy-form rewrites". The scope becomes R1–R5, A20 and A2 (`ADR-0042` addendum rulings 1–3). Deleting, skipping,
   moving, merging or weakening a test stays his (ruling 7). `D4` is answered.
2. **§ Out of scope.** "Test content beyond `V5`'s rewrites" becomes "beyond the addendum's admitted forms".
   `src/` changes stay out.
3. **`V4`.** The sensitive set is: `A2`'s 13 red files, plus `src/book.test.ts` (A2's silent premise), plus C4's set.
   - Ruling 1's armed rule applies. **For an expected-0 guard, the plant adds the call.**
   - `glyph-mode.nfr` (`NFR-007`) needs one plant per spied module (`node:fs`, `node:fs/promises`,
     `node:child_process`).
   - `src/book.test.ts` A2's salt plant must be red at head **and** shown green (blind) under the old form.
4. **`V5`.**
   - **Admitted content:** R1–R5, ruling 2's one assertion, ruling 3's one import, and the pins.
   - **`expect(` counts:** equal per rewritten file, except `src/cli.test.ts` **+3**.
   - **Counts:** tests = base + 1 (the `V3` `it`); files = base; skips 0.
5. **`V6`.**
   - The env name becomes **`VITEST_MAX_WORKERS`** (1 ≤ n ≤ 2, parsed as vitest parses it). Drop
     `VITEST_MAX_THREADS` / `_FORKS`. k = 2.
   - **Reds:** r1, r2, r3 `=8`, r3b `=3`, **r4 `projects`**, `maxWorkers: 3`, and the **`QE-151-a` row `=0x3`**,
     plus `=0` and `=abc`.
   - **Greens:** `=` (empty), `=1`, `=2`.
   - `QE-144-a` closes. **Fold `QE-151-a` and `QE-151-b`** by name.
6. **`V2`.**
   - **The unhandled row's plant awaits its timer.** The un-awaited form races on 4.1.11.
   - **All six rows run by content, including the exit-code-only row, plus QE's `M9b`** (`QE-149-c`). `ABC-143`
     `A1`–`A6` are never a substitute.
   - **`QE-149-a`:** the one-line join, by name.
7. **`V9`–`V11`** (ruling 6).
   - **Base** = the build's merge-base on `main` (k = 2, 3.2.7). Each tree runs its own `npm ci`, and **no
     `node_modules` symlink to the main checkout**.
   - The instrument is `lane144b.mjs`, behind the step-0 gate.
   - **`V10`:** the cooled state is owed if warm + R > 9.0 s.
   - **`V9`'s bar is unchanged** (≤ −15 %, the owner band to 0).
8. **§ Dependencies.**
   - `ABC-149` and `ABC-151` are merged (`abd21ff4`, `ef581383`).
   - **Floors `F`:** none carries over the merge (ruling 6).
   - `RISK-ABC144-FCAP` closes for the pre-merge lane at `V9`'s twin R.
9. **Residuals to carry:** `RISK-ABC152-NEGWORKERS` (low, QE / Security) and `RISK-ABC152-A2-GRAPH` (low, the owner).
10. **Size.** It is `L` at the upper edge: 14 test files touched, plants across about 16 files, the reporter, a
    dependency, a window and 20 runs. **Re-sizing is BA/PM's call.** The page's "`D4` closes it early" no longer
    applies.

## Build plan (Software Engineer, on `grugops/ABC-152-…` from `main`)

1. **`package.json` devDependencies:** `vitest ~4.1.11`, `@vitest/coverage-v8 ~4.1.11`, `vite ~7.3.6`. Then
   `npm install` (no `--force`), and `npm ls vitest @vitest/coverage-v8 vite` must exit 0 (`V1`). One commit.
2. **`vitest.config.ts`:** `experimental: { viteModuleRunner: false }`. The header gains one paragraph (ruling 4). The
   isolation warning stays word for word.
3. **`src/cli.test.ts`:** apply ruling 4 (`probe/pin-prototype.diff`, plus the `biome-ignore`). Show every red and
   green of ruling 4 on scratch copies (`V3`, `V6`).
4. **`tools/grugops/result-file-reporter.js` and its header, in one commit:** ruling 5 items 1–3, with the plant
   block's unhandled example replaced. Then `V2` per ruling 5 item 4.
5. **The test rework,** one commit per form for review:
   - R1 (`cli`, `render-seam`);
   - R2 (`tools/opening-book/book.test.ts`);
   - R3 + R5 (`command-input`);
   - R4 (8 files) + R5 (`status-panel.nfr`);
   - ruling 2 (`san.test.ts`);
   - ruling 3 (`src/book.test.ts`).

   For each file, list the `expect(` count before and after.
6. **`V4` plants:** per file, per ruling 1, each recorded with its diff and red message.
   - **Any guard that stays green under every admitted form, or any test that only deletion, skipping, moving or
     weakening would make green: STOP, and route it to the owner via the Orchestrator** (ruling 7).
7. **Gates:** lint, typecheck, build and `npm test` must give 56 / 1741 / 0 skipped. Run the skip-count capture
   and the integrity check. Then QE (`V2`, `V4`–`V8`, `M9b`, the opt-in lanes and coverage; `PUZZLE_DEEP=weakened`
   still exits 1). Then Security/NFR (`V12`, and the `V9`–`V11` window, width 1).
8. **After the merge:** the Scribe updates `AGENTS.md`: the worker-cap line, the Stack line, the `RISK-ABC143-01`
   line and the coverage figure's meaning. The `RISK-ABC152-NEGWORKERS` line too, if QE keeps it.

## The owner's cases (via the Orchestrator)

- **None found that needs a test deleted or skipped.** The build's `V4` is the full check (ruling 7).
- **Ruling 3's narrowing** (`book.ts` is fresh; its imports are shared). It is ruled, and he may overrule it.
- **`ADR-0042` with its addendum:** acceptance owed.
- **`V9` outside the merge band**, as the ticket says.
