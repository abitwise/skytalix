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
