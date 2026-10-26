---
subtask: arch-records-housekeeping
role: architect-design
ref: .grugops/context/arch-records-housekeeping/
branch: new grugops/arch-records-housekeeping from main, worktree ../wt-arch-records-housekeeping
width: 2 of 2 (records only — no npm, vitest or timing; no src/)
---

# Two stale record lines: Node floor in 30-architecture; ADR-0034 118 cp pointer

## Do
1. **QE-216-h:** the architecture page (§ Stack line "TypeScript on Node >= 22") should read >= 22.18, matching `package.json` engines since ABC-216 (39b93505). Add a dated line per the page's convention.
2. **ADR-0034 addendum decision 1:** its pointer says the clean-lead bar "reads 118 cp" (OD-205-2). That is not in force on `main`, where the ABC-121 rows assert ≤ 75 cp, the same as your ADR-0026 d9 line in `arch-records-ADR-0050/…f9357ec6`. Add the same dated "accepted, not in force on main" line. No bound moves.

## Fences
- Only those two files, your worktree and `<scratchpad>/arch-hk/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-housekeeping). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-records-housekeeping` (worktree `../wt-arch-records-housekeeping`), cut from `main` `08b44f94`. Commits `f5ef3d9b` (records) and `7ce3d042` (notes); tip `7ce3d042`. Not pushed and not merged. `main` has since moved to `3b335742` (the Scribe's `scribe-node-floor` merge, `AGENTS.md` only); this branch touches neither `AGENTS.md` nor any file that merge touched.

- **1. `QE-216-h`, `memory-bank/30-architecture.md` § Tech context:** "TypeScript on Node >= 22, ESM." is kept, and a dated italic line follows it in the page's convention (the `ADR-0049` row 33 line): "*2026-10-26 (`QE-216-h`): the floor now reads Node >= 22.18, matching `package.json` `engines.node` since `ABC-216` (`39b93505`); 22.18.0 is where Node 22 type-strips by default (`50-decisions/ADR-0044`).*" Checked: `39b93505`'s `package.json` diff is exactly `>=22` → `>=22.18`, on `main`; `ADR-0044` l.405 names 22.18.0 / 23.6.0.
- **2. `ADR-0034` addendum decision 1:** a sub-bullet under the 2026-10-24 `OD-205-2` pointer, in the form of `ADR-0026` d9's line: "**2026-10-26: accepted, not in force on `main`.**" Checked read-only at `08b44f94`:
  - `src/search.pvs-lmr.test.ts` has one shared `toBeLessThanOrEqual(75)`, used by both `ABC-121` d5 drift rows.
  - `grugops/ABC-205-final` (`b5d5cea5`, which carries 118) is not an ancestor of `main`.
  - The clean-lead bar is a screen procedure, not a coded literal. The 118 hits in `src/` are 0x88 square indices.
  - The line says, for the reader, that for this bar a larger ceiling is the stricter reading, the reverse of `ADR-0026` d9. No bound moves.
- **Open (LOW, Orchestrator to route):**
  - Which number a later L re-find on `main` applies, 75 or 118, is not ruled. The line records facts only.
  - Observation `…0aad233a`: 4 more stale as-built lines on `30-architecture`, outside this brief and not edited. They are "no `vitest.config.ts`" (it exists since `ABC-026`, `acbddf43`), "`npm run build` is `tsc --noEmit`" (now `tsc -p tsconfig.build.json`, `ABC-168`), and the § Deployment posture "nothing to run / no `bin` / no entry module" bullet plus l.32. Suggested: one more records-only hop.
- **Empty diff:** `git diff --stat 08b44f94..7ce3d042 -- src tools package.json AGENTS.md` printed nothing. Class scan over the added lines and the notes: 0 hits. No board edit. No npm, vitest or timing run: only git, grep, file reads, the claim script and the note writer.
- **Notes** (task `arch-records-housekeeping`): `20261026T041629Z-architect-design-decision-b17ea799` and `20261026T041629Z-architect-design-observation-0aad233a`. Both were sealed by grugops 2.1.0 `admitAndAppend` with an explicit `contextRoot`, read back with `readContext` (2 notes, both seals ok), and had their index rendered.
- **For the Orchestrator:** merge `grugops/arch-records-housekeeping` when ready.

### Trace row (10 cells, header order)

| QE-216-h / ABC-216 + ADR-0034 (arch-records-housekeeping) | 30-architecture § Tech context Node floor dated ">= 22.18" (QE-216-h); ADR-0034 addendum d1 118 cp pointer dated "accepted, not in force on main" | EPIC-008 | — | none moves (NFR-005 drift bar: pointer 118, main's rows 75; line records, moves nothing) | `grugops/arch-records-housekeeping` @ `7ce3d042` (on 08b44f94)<br>30-architecture, ADR-0034 + notes …b17ea799, …0aad233a | records only: `git diff --stat 08b44f94..HEAD -- src tools package.json AGENTS.md` empty; class scan 0 | — | — | records written; 4 more stale 30-architecture lines flagged LOW (…0aad233a) |
