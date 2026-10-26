---
subtask: arch-accept-adr0025-d4
role: architect-design
ref: .grugops/context/arch-accept-adr0025-d4/
branch: new records branch grugops/arch-accept-adr0025-d4 from main, worktree ../wt-arch-accept-adr0025-d4
width: 1 of 3 — records only (no npm, vitest, build or timing)
---

# Owner word: the ADR-0025 decision 4 amendment is accepted

## Do
- Read Orchestrator `owner-word-2026-10-26b/…2ae5fc12`.
- **ADR-0025 § Proposed amendment 2026-10-26: PROPOSED → ACCEPTED**, citing the owner's verbatim word.
  - Add that it is **in force on main at ABC-209's merge**. Until then, decision 4's clear-per-search stands on main.
  - Keep the PROPOSED text as "Previously" (the ADR-0048/0050 form).
  - Update any pointer line at the top of the ADR to match.
  - Apply any drift rows the amendment assigns to Architect/Design. Rows owned by other roles are listed, not written.
- Run `node tools/grugops/reference-check.js` on ADR-0025.
- Records only: `git diff --stat main...HEAD -- src tools package.json` must print nothing. Paste it.

## Fences
- Work only in your worktree. Don't touch the board or ticket pages.
- Never push, force, amend or rebase. Never merge into main.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-accept-adr0025-d4`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done. Records only. Branch `grugops/arch-accept-adr0025-d4` @ `83965cd8`** (`bf876bb2` ADR + `83965cd8` note), from `main` `9857bd1c`. Not pushed, not merged.

- **ADR-0025 § Proposed amendment 2026-10-26: PROPOSED → ACCEPTED**, dated 2026-10-26, citing the owner's verbatim *"1. yes; 2. A;"* (item 1, `owner-word-2026-10-26b/…2ae5fc12`).
  - **In force on `main` at `ABC-209`'s merge. Until then, decision 4's clear-per-search stands on `main`.** At `9857bd1c`, `src/engine.ts:550` still reads `clearTable();`. `grugops/ABC-209`'s tip is `9857bd1c` itself, with no build commit. The QE verdict still decides the merge. If S1 is NOT MET, a dated "accepted, not in force on `main`" line follows (the `ADR-0026` d9 form).
  - The PROPOSED text is kept as "Previously" (the `ADR-0048`/`0050` form). The section heading, the "Decision 4, as amended" heading and the Rollback's "before acceptance" bullet are updated to match.
  - **The top Status pointer is updated:** ACCEPTED, in force at `ABC-209`'s merge, with the old PROPOSED pointer kept as "Previously".
- **Drift rows: the amendment assigns none to Architect/Design, so none were applied.** Listed for other roles and not written:
  - SE: the source-comment rewrites named in the amendment's § Consequences, at the build.
  - BA/PM: the `ABC-209` page `adr:` line, already on `main` (`bapm-records-owner-b`, merge `ff9358e4`). It matches.
  - The `ADR-0026` d7 sentence and the `ADR-0006` errata stay true, so no edit is owed.
- **Checks:**
  - `node tools/grugops/reference-check.js` on ADR-0025 printed `No findings.`
  - `git diff --stat main...HEAD -- src tools package.json` printed nothing: the pasted output is empty.
  - Class scan of the added lines (personal paths, addresses, hostnames, URLs): 0 hits.
  - No npm, vitest, build or timing was run.
- **Note** (`.grugops/context/arch-accept-adr0025-d4/notes/`): decision `20261026T133013Z-architect-design-decision-e12dd4c5`, admitted through `context-io` `admitAndAppend`. `at` 2026-10-26T13:30:13Z is from `date -u`.
- **Owed:** the Orchestrator merges this records branch. Then the build (`ticket-to-pr-ABC-209`) and the QE verdict decide whether the amendment comes into force.

**Trace row** (for the Orchestrator):

| ABC-209 (arch-accept-adr0025-d4) | ADR-0025 decision 4 amendment (table lives one game, held by a game token) PROPOSED → ACCEPTED on the owner's word "1. yes; 2. A;" (…2ae5fc12 item 1); in force on main at ABC-209's merge, decision 4's clear-per-search stands until then; PROPOSED kept as "Previously"; top pointer synced | EPIC-008 | per-game TT lifetime (accepted; not in force until merge) | NFR-009 unchanged (4 MiB; 40-search growth probe is QE's at build); NFR-005 untouched | grugops/arch-accept-adr0025-d4 @ 83965cd8 (bf876bb2 ADR + note)<br>memory-bank/50-decisions/ADR-0025-…cleared-per-search.md § Status + § Proposed amendment 2026-10-26<br>.grugops/context/arch-accept-adr0025-d4/notes/ (1) | reference-check: No findings; records guard (src tools package.json) empty; class scan 0; no npm/vitest/build | n/a (records); UAT at build (QE verdict signs) | not released; in force at ABC-209's merge (if S1 NOT MET: dated "accepted, not in force on main" line) | In Development (unchanged; no board move) |
