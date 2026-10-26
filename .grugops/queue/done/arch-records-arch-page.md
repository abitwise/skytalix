---
subtask: arch-records-arch-page
role: architect-design
ref: .grugops/context/arch-records-arch-page/
branch: new grugops/arch-records-arch-page from main, worktree ../wt-arch-records-arch-page
width: 1 of 3 (records only — no npm, vitest or timing; no src/)
---

# memory-bank/30-architecture.md: four stale lines (your …0aad233a)

## Do
- Add dated correction lines, in the page's own form, for the four lines your observation `arch-records-housekeeping/…0aad233a` found contradicted by files on `main`:
  - "There is no `vitest.config.ts`".
  - "`npm run build` is `tsc --noEmit`".
  - The § Deployment posture bullet saying there is no `bin`, nothing to run and no entry module.
  - Line 32, "no entry module".
- Check each against `main` first, by reading files only. Nothing else moves. Orchestrator `orch-2026-10-26k`.

## Fences
- Only that page, your worktree and `<scratchpad>/arch-page/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-arch-page). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-records-arch-page` (worktree `../wt-arch-records-arch-page`), cut from `main` `4356b184`. Commits `f9fdde20` (records) and `e5c401c2` (notes); tip `e5c401c2`. Not pushed and not merged.

All four lines were checked read-only against `main` (`git show`, `git log`, `git grep`) before writing. Each gets a dated italic line in the page's own form (the `ADR-0049` row 33 line and the `QE-216-h` line). Every original word is kept.
- **1. § Tech context, "There is no `vitest.config.ts`":** "*2026-10-26 (`ABC-026`): no longer true. `vitest.config.ts` exists since `ABC-026` (`acbddf43`, 2026-08-13), and it now also pins `test.maxWorkers: 2` (`ABC-144`, `50-decisions/ADR-0040` addendum 2).*"
- **2. § Tech context, "`npm run build` is `tsc --noEmit`":** "*2026-10-26 (`ABC-168`): no longer true. `npm run build` is `tsc -p tsconfig.build.json` and emits `dist/uci.js` since `ABC-168` (`825b21d1`, `50-decisions/ADR-0044` D8); `tsc --noEmit` is now `npm run typecheck`.*"
- **3. § Deployment posture, "Nothing publishable and nothing to run" bullet:** "*2026-10-26 (`ABC-042`, `ABC-168`): no longer true in part. `npm run chess` runs `src/cli.ts` since `ABC-042` (`e1403550`), and `npm run uci` runs `src/uci.ts`; `package.json` has a `bin` (`dist/uci.js`) and `npm run build` emits `dist/` since `ABC-168` (`825b21d1`). `AGENTS.md` § Development lists both commands. Still true: `private`, no `main`, `exports` or `start` script. Nothing is deployed, published or released.*"
- **4. § System context l.32, "no barrel and no entry module":** "*2026-10-26 (`ABC-042`, `ABC-168`): the entry half is no longer true. `src/cli.ts` is the entry point that starts a game (`npm run chess`) since `ABC-042` (`e1403550`, 2026-08-15), and `src/uci.ts` (`npm run uci`) since `ABC-168` (`825b21d1`); `AGENTS.md` records `Dev / run` as `npm run chess`. The barrel half still holds: no `src/` module re-exports another.*"
  - The `…0aad233a` `UNKNOWN - verify` is resolved by the sentence's own clause, "because nothing starts a game": "entry module" there means a run entry.
  - The barrel half was checked: no non-test `src/*.ts` has an `export … from`, and there is no index module.
- **Open (LOW, Orchestrator to route):** observation `…5302a6ba` lists 3 more stale lines outside this brief, not edited:
  - § System context l.24, "no `main`, `exports` or `bin`";
  - "Two epics are built and merged" (`EPIC-003`…`006` "do not");
  - "Seventeen production modules" (`main` has 46).
  - Suggested, not ruled: a full as-built re-pass, or one dated header line saying the page body is the 2026-08-12 snapshot.
- **Empty diff:** `git diff --stat main..e5c401c2 -- src tools package.json AGENTS.md` printed nothing. Class scan over the added lines and the notes: 0 hits. No `_Updated` header line, no board edit. No npm, vitest or timing run: only git, grep, file reads, the claim script and the note writer.
- **Notes** (task `arch-records-arch-page`): `20261026T042038Z-architect-design-decision-d69c87d3` and `20261026T042038Z-architect-design-observation-5302a6ba`.
  - Both were sealed by grugops 2.1.0 `admitAndAppend` with an explicit `contextRoot` and read back with `readContext` (2 notes).
  - The index was rendered.
- **For the Orchestrator:** merge `grugops/arch-records-arch-page` when ready.

### Trace row (10 cells, header order)

| 30-architecture stale lines (arch-records-arch-page) | 30-architecture: 4 stale as-built lines dated (no `vitest.config.ts`; build `tsc --noEmit`; § Deployment posture "nothing to run / no `bin` / no entry module"; l.32 "no entry module") | EPIC-006 (ABC-042), EPIC-007 (ABC-168) | ABC-026, ABC-042, ABC-168 | none moves | `grugops/arch-records-arch-page` @ `e5c401c2` (on 4356b184)<br>30-architecture + notes …d69c87d3, …5302a6ba | records only: `git diff --stat 4356b184..HEAD -- src tools package.json AGENTS.md` empty; class scan 0 | — | — | records written; 3 more stale 30-architecture lines flagged LOW (…5302a6ba) |
