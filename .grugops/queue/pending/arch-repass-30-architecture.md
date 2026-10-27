---
subtask: arch-repass-30-architecture
role: architect-design
ref: .grugops/context/arch-repass-30-architecture/
branch: new records branch grugops/arch-repass-30-architecture from main, worktree ../wt-arch-repass-30-architecture
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# EPIC-008 close, step 2: full as-built re-pass of memory-bank/30-architecture.md

## Do
- Read Orchestrator `orch-2026-10-27m/…64925a53`, BA/PM `bapm-s1-ABC-210/…ff16a93d` (the close path) and your own close item `arch-records-arch-snapshot/…cdc1fb61`.
- Re-pass `memory-bank/30-architecture.md` against `main`'s `src/` as built (read-only). Every module, boundary, count and data-flow line must match what is on main now: ABC-208's null move is in; ABC-207, ABC-209 and ABC-210 are not.
  - Settle the open count: is `virtual-clock.ts` a production module (42 or 43 of 46)? Rule it with the evidence.
  - Fold the existing dated corrections (apply.ts, zobrist.ts) into the body where they belong; keep a dated change line for each edit.
  - Cross-check the ADR pointers (ADR-0024 d4 stands; ADR-0025 D4, ADR-0051 accepted, not in force; ADR-0050 in force).
- Run `node tools/grugops/reference-check.js` on 30-architecture.md.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board, ticket or epic pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-repass-30-architecture`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.
