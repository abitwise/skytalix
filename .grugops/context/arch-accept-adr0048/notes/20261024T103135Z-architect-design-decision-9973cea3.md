---
id: 20261024T103135Z-architect-design-decision-9973cea3
kind: decision
by: architect-design
at: 2026-10-24T10:31:35Z
verified_by: 
confidence: high: a records-only transcription of the owner's word; every edited sentence read at main fb0a7703
refs:
  - ADR-0048
  - ADR-0044
  - ABC-214
  - OQ-214-3
  - LIC-PUB-1
  - owner-word-2026-10-24/20261024T091000Z-orchestrator-decision-776bba9a
  - se-build-ABC-214/20261024T082003Z-software-engineer-decision-e2623df7
  - bb8d4432
  - memory-bank/50-decisions/ADR-0048-the-repository-is-apache-2-0-and-the-cc-by-sa-evaluation-tables-are-carved-out-in-notice-until-re-derived.md
  - memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - grugops/arch-accept-adr0048
  - fb0a7703
supersedes: 
seal: sha256:3ecd7cdda53d7b7062ffbc8a38160570da74cc6168a6b054bf8393330fcfad0b
---

# ADR-0048 ACCEPTED (owner word …776bba9a) and its Architect/Design drift rows 1–7 applied to ADR-0044; records only, src/tools/package.json diff empty

Branch `grugops/arch-accept-adr0048`, cut from `main` `fb0a7703`. Two files edited, both ADRs. Nothing else moves.

## ADR-0048
- **Status PROPOSED → ACCEPTED** on the owner's verbatim *"accept ADR-0048 ; keep grugops under MIT ; ok, if no creds."* The PROPOSED block stays below as history ("Previously").
- **OQ-214-3 answered:** the four kit files stay MIT (decision 5's default). A dated line was added in decision 5 and in Alternatives. The built `NOTICE` does not change.
- **The reflow:** the Context bullet now breaks before the title, so "Simplified Evaluation Function" sits on one line. Decision 3 gains one dated sub-bullet: the built `NOTICE` layout (`bb8d4432`, SE note `…e2623df7`) is adopted, and its words are unchanged. ADR-0048 holds no verbatim `NOTICE` block, because it adopts `ABC-214` Scope 6. So the reflow lands on the one place the phrase was split, plus that pointer. `ABC-214`'s Scope 6 text is BA/PM's, and it is not edited here.
- **§ Records drift:** one dated line says rows 1–7 were applied and rows 11–13 are BA/PM's (`bapm-epic007-licence-line`).
- **§ Rollback:** one bullet for the window after acceptance and before `ABC-214` merges.

## ADR-0044 (rows 1–7, all Architect/Design's)
- **§ Status:** the "Proposed 2026-10-24" pointer is made final: "Superseded in part 2026-10-24 by ADR-0048". It is effective at `ABC-214`'s merge. The name, CC0 and kit-file bullets stand.
- **Rows 1, 2, 4:** one dated line under the D13 heading, in the row's wording. The bullets stay as history.
- **Row 3:** a pointer on the kit bullet: its `UNKNOWN - verify` notice is closed by ADR-0048 decision 5.
- **Row 5:** a new row `P7` in § Revision — private. P1–P6 and Q12/Q15 are kept.
- **Rows 6, 7:** dated pointers in the two § Consequences D13 sentences (config; distribution). The § Rollback line "the licence is a separate decision" stands unedited, as the row says.

## Not done here (by design)
- Rows 8–10 and 14 are not edited, per ADR-0048 (Done tickets' and dated readings).
- Rows 11–13 (`EPIC-007`) are BA/PM's hop.
- D8 "nothing is published" is not ADR-0048 drift. It goes to the posture ADR (task `arch-public-posture-adr`).
- No board edit. No traceability edit; the trace row goes in the brief's Result.

## Check
`git diff --stat fb0a7703..HEAD -- src tools package.json` prints nothing.
