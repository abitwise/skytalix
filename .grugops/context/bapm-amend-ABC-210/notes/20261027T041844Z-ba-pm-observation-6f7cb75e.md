---
id: 20261027T041844Z-ba-pm-observation-6f7cb75e
kind: observation
by: ba-pm
at: 2026-10-27T04:18:44Z
verified_by: 
confidence: high on the re-reads at 5a9855b7; the readings are named choices with their alternatives
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0024
  - NFR-005
  - G6
  - A1
  - A2
  - A3
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - orch-2026-10-27f/20261027T041414Z-orchestrator-decision-75af453c
  - arch-design-ABC-210/20261027T041209Z-architect-design-decision-c5d0e464
  - arch-design-ABC-210/20261027T041209Z-architect-design-observation-8e6a40c2
  - orch-2026-10-27d/20261027T033728Z-orchestrator-decision-828d5794
  - bapm-ready-ABC-210/20261027T033612Z-ba-pm-decision-133465f3
  - bapm-amend-ABC-208/20261026T023835Z-ba-pm-decision-e8505f19
  - grugops/bapm-amend-ABC-210
  - 5a9855b7
  - ABC-208
  - ABC-209
  - ABC-215
supersedes: 
seal: sha256:23e48bb728fa59f31a550ef14fd092a494b230c7c57babc422fa1f0b1bcea159
---

# BA/PM: ABC-210 amend re-reads at 5a9855b7 and the readings behind the lines

Task `bapm-amend-ABC-210`, records only. Re-read at `main` `5a9855b7`: the ticket page (351 lines before, 407 after,
+61/−5), `ADR-0051` (PROPOSED), `ADR-0026` d7, `ADR-0050` d9's `zugzwang.005` row, `src/transposition.test.ts:513-517`
(the P1 row: `search(REPEATS_AT_PLY_4, 3).score` pinned −485), and the DoR checklist.

## Readings, each with the alternative not taken
- **Item 10 under a held build.** The page is scored ✅ with the hold named. The alternative was ⏳, holding the ticket
  in In Design. Not taken, because the hold is a known, routed, single owner yes/no, and the page needs no edit
  whichever way he answers. If he declines, the ticket goes back to In Design for a re-design or a close. That is the
  `ABC-208` / `ABC-209` reading (b) precedent plus the Orchestrator's delivery call (`…75af453c`).
- **The pin rulings were placed in § Dependencies,** not inside the Architect's § Design ruling. They gate the build,
  and § Design ruling is the Architect's text.
- **The "≥ base − 1" text is struck with `~~`** and the dated reason is kept beside it (the `ABC-209` page convention).
  The flagged paragraph is kept and marked answered, so the history stays readable.
- **The drift bars sit under `A3`** ("growth stays bounded"), as `ADR-0051` d7 names them `A3`'s oracle.

## Flags
- LOW: the front-matter `status: ready` / `column: Ready` is stale against the board (In Design). It was left as
  written (the `ABC-215` / `bapm-amend-ABC-208` precedent).
- LOW: the page is 407 lines. No written line budget was found in `AGENTS.md` or the kit; sibling pages run 300–546.
- The 90 % drift figure is looser than the 95 % precedent. That was already told to the owner, inside his yes/no.
