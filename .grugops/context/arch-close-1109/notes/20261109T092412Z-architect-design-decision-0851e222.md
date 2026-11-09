---
id: 20261109T092412Z-architect-design-decision-0851e222
kind: decision
by: architect-design
at: 2026-11-09T09:24:12Z
verified_by: 
confidence: high: dated lines only, each quoted from a named record; nothing run
refs:
  - arch-close-1109
  - EPIC-011
  - ABC-298
  - ABC-284
  - ABC-266
  - ABC-257
  - ABC-237
  - ABC-258
  - ABC-295
  - ABC-299
  - ADR-0077
  - ADR-0060
  - ADR-0062
  - ADR-0058
  - ADR-0025
  - ADR-0056
  - orch-2026-10-30a/20261109T091814Z-orchestrator-decision-a9c03e07
  - orch-2026-10-30a/20261109T082311Z-orchestrator-decision-035a25ff
  - qe-ABC-298/20261109T082155Z-qe-e2e-decision-77b0a7e8
  - e069b49a
supersedes: 
seal: sha256:0be380cef27195832dabcda10f77cf383ac0025c12be29caf1507e1d61c9a30e
---

# arch-close-1109: the ADR lines for the project close

Architect/Design, records only, on `grugops/arch-close-1109` from `main` `e069b49a` (`src/` `bba42fb7`). Nothing was run. Inputs: the owner's close `orch-2026-10-30a` `…a9c03e07`, the Orchestrator's `…035a25ff`, QE's verdict `qe-ABC-298` `…77b0a7e8` and its failed-attempt `…77448919`. Dated lines only; no decision, bar, value or row is rewritten, and nothing in force changes.

| ADR | ticket(s) | status after this hop | line |
|---|---|---|---|
| `ADR-0077` | `ABC-298` | **ACCEPTED, NOT IN FORCE ON `main`** (never comes into force) | § Status bullet + decision-log row: F4 fired, SG3 0.962736 / 0.973838 / 0.959488, every board valid, identity held; V3 ends, no wider form; QE's cause guess (gated-node cost on top of the full list) unmeasured, `UNKNOWN - verify` |
| `ADR-0060` | `ABC-284` | **WITHDRAWN, project closed** (never accepted, never in force) | top of § Status; the 2026-11-08 look was not taken (`…0b4bc6ba`); `ADR-0026`'s flat 1-ply LMR stands |
| `ADR-0062` | `ABC-266` | **WITHDRAWN, project closed** (was PROPOSED, PARKED) | top of § Status; `Threads` stays 1; `ADR-0044` D3, D5 and D6's `Threads` row stand |
| `ADR-0058` | `ABC-257` (and `ABC-238`, closed earlier) | **ACCEPTED, NOT IN FORCE ON `main`; not delivered** | top of § Status; `tableCutoff` stays exact-depth (`src/transposition.ts`, `!== depth`, read at `e069b49a`) |
| `ADR-0025` (two amendments only) | `ABC-257`; `ABC-237`, `ABC-258` | 2026-10-26 decision 4 amendment: **ACCEPTED, NOT IN FORCE, not delivered**. 2026-11-01 T2 amendment: **WITHDRAWN** | top of § Status; decisions 1–7 with the TH-1 amendment (in force, `ABC-265`) unchanged |
| `ADR-0056` | `EPIC-011`, `ABC-295`, `ABC-299` | ACCEPTED IN DIRECTION, unchanged | § Status line: Phase 4 closed by the owner's project close; R2 (`ABC-295`) the last reading; R3 (`ABC-299`) won't-do; `EPIC-011` closes after R2 |

Status spelling: "ACCEPTED, NOT IN FORCE ON `main`" follows `ADR-0059`, `ADR-0075` and `ADR-0076` for an accepted decision whose change was never delivered. "WITHDRAWN" is the brief's word for a never-accepted proposal. The template's set (proposed / accepted / deprecated / superseded) has no closer term, and no earlier ADR used one.
