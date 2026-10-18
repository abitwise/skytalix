---
id: 20261018T075600Z-ba-pm-decision-epic-007-proposed-two-ticket-uci-v1-9d3b5f61
kind: decision
by: ba-pm
task: bapm-engine-plan
at: 2026-10-18T07:56:00Z
verified_by:
confidence: medium
refs:
  - EPIC-007
  - EPIC-004
  - ADR-0044
  - ADR-0036
  - ADR-0018
  - NFR-004
  - NFR-008
  - ABC-167
  - ABC-168
  - ABC-169
  - plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
  - 20261018T075500Z-ba-pm-observation-engine-plan-readings-a41c7e02
  - .grugops/context/wave-2026-09-25/notes/20261018T073030Z-orchestrator-decision-owner-word-chess-engine-conversion-research-only-5b37b0bc.md
  - .grugops/context/arch-engine-research/notes/20261018T074200Z-architect-design-observation-chess-engine-standards-read-on-the-primary-sources-3f1a9c20.md
  - .grugops/context/arch-engine-research/notes/20261018T074300Z-architect-design-observation-repo-fit-map-what-uci-needs-against-what-src-has-7b2e4d18.md
  - .grugops/context/arch-engine-research/notes/20261018T074400Z-architect-design-decision-adr-0044-proposed-uci-v1-shape-and-the-owner-questions-c5d07e91.md
supersedes:
---

# EPIC-007 PROPOSED: UCI v1 in two tickets (S + XS) and one conditional XS, gated by Q1. Nothing enters Ready

This note is hand-authored and unsealed. The epic page is authoritative for scope, the success measures,
the tickets, the owner questions and the web-UI boundary. This note gives only the choices and the
reasons for them.

- **A new epic, not an amendment to EPIC-004.** `EPIC-004` is the strength epic (`XL`, decomposed). UCI is
  a new way to reach the same engine and changes none of its acceptance. `EPIC-004` gets one sentence lifted,
  and only on `Q1` = yes, in the hop that accepts this epic. This page did not edit `EPIC-004`.
- **Confidence is medium** because every line rests on `Q1`, and v1's scope rests on `Q3`–`Q6` being
  answered as recommended.
- **The ticket split.**
  - `ABC-167` (S) is the capability-free session. It has value on its own: it is route (b)'s whole payload.
    It fires no Security/NFR hop (see the observation note).
  - `ABC-168` (XS) is the entry point. It fires `ADR-0036` (b1) and so goes through `In Security/NFR`. It
    carries the M1/M2 play-test at its UAT.
  - `ABC-169` (XS, outside v1, on `Q8`) adds the licence.
  - I refused a third v1 ticket for "the GUI play-test". That test is `ABC-168`'s UAT, not a deliverable.
- **Where I differ from ADR-0044.** On `Q7` I recommend route (a), the web project's own bridge spawning
  `node <clone>/src/uci.ts`, for its first version. `ADR-0044` D8 recommends route (b) for a single-user
  UI. My reason: (a) needs nothing from this repo but a path, and keeps `Q8` deferred. This is stated for
  the owner to rule on, and `ADR-0044` is not edited.
- **New product questions:** `Q9` (`id name`/`id author`), `Q10` (who installs `cutechess-cli` and En
  Croissant), `Q11` (v1 is done without any web UI).
- **Not done at this hop:**
  - no ticket page was cut;
  - `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `EPIC-004` and `ADR-0044` were
    not edited;
  - 0 lines changed in `src/`, `tools/`, config, manifests or `AGENTS.md`;
  - no test, vitest, build or timing was run;
  - nothing was merged or pushed.
