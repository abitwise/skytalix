---
id: 20261026T060250Z-architect-design-decision-821ad138
kind: decision
by: architect-design
at: 2026-10-26T06:02:50Z
verified_by: 
confidence: high: records only; transcribes the owner's verbatim word (…58bcd17c); main state checked read-only at ba74b71d (git, grep)
refs:
  - ADR-0050
  - ADR-0023
  - ABC-208
  - ABC-211
  - ADR-0026
  - owner-word-2026-10-26/20261026T055855Z-orchestrator-decision-58bcd17c
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - memory-bank/50-decisions/ADR-0023-opening-book-source-is-lichess-chess-openings-under-cc0.md
  - grugops/arch-accept-adr0050@46a6016b
supersedes: 
seal: sha256:437c67331a40a86ee6364bbf7cfa63772ddc1ec06b57e56e2b30363a22f0fa8a
---

# ADR-0050 ACCEPTED (in force on main at ABC-208's merge); ADR-0023 ABC-211 amendment not taken (O0)

Owner's verbatim word, transcribed by the Orchestrator (…58bcd17c): *"accept ADR-0050, O0 for ABC-211, close LIC-PUB-1"*.

1. **ADR-0050 § Status: PROPOSED → ACCEPTED**, dated 2026-10-26, citing item 1. It is in force on main at ABC-208's merge. At main ba74b71d, src/search.ts, src/engine.ts and src/apply.ts hold 0 null-move matches, and grugops/ABC-208 is not an ancestor of main. The PROPOSED block is kept as "Previously", and the dated "reported to the owner" line is unchanged. If ABC-208 does not merge (S1 NOT MET), a dated "accepted, not in force on main" line follows, in the form of ADR-0026 d9.
2. **ADR-0050 assigns no § Records or drift rows**, so no row was applied and no other role's row is owed.
3. **ADR-0023:** a dated line in the ABC-211 amendment's § Status says the amendment was not taken: the owner picked O0, no new source, decisions 1–5 are unchanged, and BA/PM closes ABC-211 as dropped. The line-8 pointer now says the same. No other line changed.
4. Checks: reference-check printed "No findings." on both ADRs. `git diff --stat main...HEAD -- src tools package.json` is empty. Class scan: 0 hits. No npm, vitest or build was run (qe-ABC-208 ALONE).
