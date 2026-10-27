---
subtask: arch-adr0051-not-in-force
role: architect-design
ref: .grugops/context/arch-adr0051-not-in-force/
branch: new records branch grugops/arch-adr0051-not-in-force from main, worktree ../wt-arch-adr0051-not-in-force
width: 2 of 2 — records only (no npm, vitest, build or timing)
---

# ADR-0051: accepted, not in force on main (ABC-210 not merged); ADR-0050 d9 P2 did not land

## Do
- Read Orchestrator `orch-2026-10-27k/…85e9c9b2` and QE `qe-ABC-210/…b953e670`.
- **ADR-0051 § Status:** add a dated line: **accepted, not in force on main**. ABC-210's single reading was S1 NOT MET (pooled 800 games NEUTRAL −4.78 ± 16.21), so the ticket was not merged. Use the ADR-0025 D4 / ADR-0026 d9 precedent; fix any pointer line at the top to match.
- **ADR-0050 d9:** on the dated P2 line, add that **P2 did not land**: `zugzwang.005` stays at depth 12 on main. The table row stays unchanged.
- Check read-only that `src/search.ts` / `src/engine.ts` on main carry no check extension.
- Run `node tools/grugops/reference-check.js` on both ADRs.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-adr0051-not-in-force`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
