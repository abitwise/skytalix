---
subtask: arch-adr0025-not-in-force
role: architect-design
ref: .grugops/context/arch-adr0025-not-in-force/
branch: new records branch grugops/arch-adr0025-not-in-force from main, worktree ../wt-arch-adr0025-not-in-force
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# ADR-0025 D4 amendment: accepted, not in force on main (ABC-209 not merged)

## Do
- Read Orchestrator `orch-2026-10-27a/…00f47145` and QE `qe-ABC-209/…e32e0ee4`.
- **ADR-0025 § amendment status:** add a dated line saying it is **accepted, not in force on main**. ABC-209's single reading was S1 NOT MET (pooled 800 games NEUTRAL +8.69 ± 18.25), so the ticket was not merged. Decision 4's clear-per-search stands on main. Use the ADR-0026 d9 precedent and fix the pointer line at the top to match.
- Check read-only that `src/engine.ts` on main still clears per search.
- Run `node tools/grugops/reference-check.js` on ADR-0025.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-adr0025-not-in-force`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done. Records only. Branch `grugops/arch-adr0025-not-in-force` @ `13f8853e`** (`c386ea89` ADR + `13f8853e` note), from `main` `a5306773`. Not pushed, not merged.

- **ADR-0025 § Proposed amendment 2026-10-26, Status: dated line "2026-10-27: accepted, not in force on `main`"**, in the `ADR-0026` d9 form.
  - It cites `ABC-209`'s single reading, S1 NOT MET: d1 NEUTRAL −0.9 ± 25.3, d2 NEUTRAL +18.3 ± 26.3, pooled over 800 games NEUTRAL +8.69 ± 18.25 (QE `…e32e0ee4`, failed attempt `…0932c037`, merge `b5f46e86`). Not merged (Orchestrator `…00f47145`). `grugops/ABC-209` `bb6cf451` is kept unmerged.
  - **Decision 4's clear-per-search stands on `main`.** `T1` holds by this reading. The line moves no code.
- **The top Status pointer is fixed to match:** "2026-10-27: accepted, not in force on `main`". The 2026-10-26 "in force at `ABC-209`'s merge" pointer is kept as "Previously".
- **Synced:** the amendment heading (ACCEPTED, not in force on `main`), the "Decision 4, as amended" heading, the `T1` re-read row (read NEUTRAL; T1 holds) and the Rollback's "After it ships" bullet (not reached). Decisions 1–7 and every other section are unchanged.
- **`main` checked read-only at `a5306773`:** `src/engine.ts:550` still calls `clearTable()` at `chooseMove` entry. `src/` has no `game` option, `prepareTable` or game tracker. `grugops/ABC-209` is not an ancestor of `main`.
- **Checks:**
  - `node tools/grugops/reference-check.js` on ADR-0025 printed `No findings.`
  - `git diff --stat main...HEAD -- src tools package.json` printed nothing. The pasted output is empty:
    ```
    ```
  - Class scan of the added lines (personal paths, addresses, hostnames, URLs): 0 hits.
  - No npm, vitest, build or timing was run.
- **Note** (`.grugops/context/arch-adr0025-not-in-force/notes/`, 1): decision `20261027T032409Z-architect-design-decision-aa96534c`, admitted through `context-io` `admitAndAppend`. `at` 2026-10-27T03:24:09Z is from `date -u`.
- **Owed:** the Orchestrator merges this records branch. No drift rows for other roles: nothing in the ADR names a build-time edit that is now owed.

**Trace row** (for the Orchestrator):

| ABC-209 (arch-adr0025-not-in-force) | ADR-0025 decision 4 amendment (table lives one game, held by a game token): dated line "2026-10-27: accepted, not in force on main" (ADR-0026 d9 form); S1 NOT MET, pooled 800 games NEUTRAL +8.69 ± 18.25 (…e32e0ee4); not merged (…00f47145); top pointer, headings, T1 row, Rollback synced | EPIC-008 | per-search TT lifetime stands on main; per-game lifetime accepted, not in force | NFR-009 unchanged (4 MiB, nothing ships); NFR-005 untouched; T1 holds | grugops/arch-adr0025-not-in-force @ 13f8853e (c386ea89 ADR + note)<br>memory-bank/50-decisions/ADR-0025-…cleared-per-search.md § Status + § Proposed amendment 2026-10-26<br>.grugops/context/arch-adr0025-not-in-force/notes/ (1) | reference-check: No findings; records guard (src tools package.json) empty; class scan 0; main src/engine.ts:550 clearTable() checked read-only; no npm/vitest/build | n/a (records); UAT not signed (QE FAIL on A6) | not released; not in force on main | Backlog (unchanged; no board move) |
