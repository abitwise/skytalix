---
id: 20261026T133013Z-architect-design-decision-e12dd4c5
kind: decision
by: architect-design
at: 2026-10-26T13:30:13Z
verified_by: 
confidence: high: records only; transcribes the owner's verbatim word (…2ae5fc12); main state checked read-only at 9857bd1c (git, grep)
refs:
  - ADR-0025
  - ABC-209
  - EPIC-008
  - ADR-0026
  - ADR-0006
  - owner-word-2026-10-26b/20261026T132424Z-orchestrator-decision-2ae5fc12
  - arch-design-ABC-209/20261026T125648Z-architect-design-decision-2e73dcd9
  - memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md
  - grugops/arch-accept-adr0025-d4@bf876bb2
supersedes: 
seal: sha256:2faf398a790340660add744aa77df7e33a237024aa465f87889159fe7d82791d
---

# ADR-0025 decision 4 amendment ACCEPTED (in force on main at ABC-209's merge)

Owner's verbatim word, transcribed by the Orchestrator (…2ae5fc12): *"1. yes; 2. A;"*. Item 1 accepts the ADR-0025 decision 4 amendment (per-game transposition table, ABC-209).

1. **ADR-0025 § Proposed amendment 2026-10-26: PROPOSED → ACCEPTED**, dated 2026-10-26, citing item 1. The heading now reads ACCEPTED. The PROPOSED block is kept as "Previously". The "Decision 4, as amended" heading now reads "accepted 2026-10-26; in force on main at ABC-209's merge". The Rollback's "Before acceptance" bullet is marked passed.
2. **In force on main at ABC-209's merge. Until then, decision 4's clear-per-search stands on main.** At main 9857bd1c, src/engine.ts:550 still reads `clearTable();`, and grugops/ABC-209's tip is 9857bd1c itself, with no build commit. The QE verdict still decides the merge. If S1 is NOT MET, a dated "accepted, not in force on main" line follows, in the form of ADR-0026 d9.
3. **The top Status pointer** now says the same, keeping the old PROPOSED pointer as "Previously". Decisions 1–7 and every other section are unchanged.
4. **Drift rows: the amendment assigns none to Architect/Design, so none were applied.** Listed for others and not written: SE rewrites the source comments named in the amendment's § Consequences, at the build. BA/PM's ABC-209 page `adr:` line is already on main (bapm-records-owner-b, merge ff9358e4), and it matches. The ADR-0026 d7 sentence and the ADR-0006 errata stay true, so no edit is owed.
5. Checks: reference-check on ADR-0025 printed "No findings." `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan of the added lines: 0 hits. No npm, vitest or build was run.
