---
subtask: arch-adr0048-status
role: architect-design
ref: .grugops/context/arch-adr0048-status/
adr: memory-bank/50-decisions/ADR-0048-the-repository-is-apache-2-0-and-the-cc-by-sa-evaluation-tables-are-carved-out-in-notice-until-re-derived.md
branch: new grugops/arch-adr0048-status from main, worktree ../wt-arch-adr0048-status
width: 1 of 2 agents (same Architect also claims arch-design-ABC-207; records only)
---

# ADR-0048: dated status line — the carve-out ended (ABC-215 merged)

## Do
- Per Orchestrator `orch-2026-10-25w/…ccf209d9` and QE `qe-ABC-215/…c2c3540f`: one dated § Status line on ADR-0048. The CC BY-SA 3.0 carve-out ended at `main` `5c91e2e4`, where ABC-215 merged the values made by rule. NOTICE and the `src/evaluate.ts` header no longer name it. Nothing else moves.

## Fences
- Only your worktree and `<scratchpad>/arch0048/`. No `src/`. No npm/vitest. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-adr0048-status). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-25, branch `grugops/arch-adr0048-status` @ `120b4b07` (= `main` `0e2358ce` + records; not
pushed, not merged). Records only: no `src/`, no npm or vitest.

- **Moved:** one dated paragraph at the top of `ADR-0048` § Status. The carve-out ended at `main` `5c91e2e4`, where
  `ABC-215` merged the values made by rule (decision 7 done). Nothing else in the ADR moves.
- **Evidence (class and count):** CC BY-SA name matches at `5c91e2e4`: `NOTICE` 0, `src/evaluate.ts` 0. At its first
  parent `cac2b4e9`: 5 and 4.
- **Not moved:** `LIC-PUB-1` / `OQ-214-4` (Security/NFR, owner-held), history rewrite (decision 8, the owner's).
- **Note** (`.grugops/context/arch-adr0048-status/notes/`): decision `…1592f0ba`.

**Trace row** (for the Orchestrator):

| ABC-215 (arch-adr0048-status) | ADR-0048 § Status: dated line, carve-out ended at 5c91e2e4 (decision 7 done) | EPIC-008 | CC BY-SA 3.0 carve-out removed from NOTICE and the src/evaluate.ts header (ABC-215) | none moved (records only) | grugops/arch-adr0048-status @ 120b4b07 (0e2358ce + records)<br>.grugops/context/arch-adr0048-status/notes/ (1) | git show match counts at 5c91e2e4 (0/0) and cac2b4e9 (5/4); no tests run | n/a (records only) | Orchestrator merges records; LIC-PUB-1 / OQ-214-4 stay with Security/NFR and the owner | — (no board move) |
