---
id: 20261019T120000Z-ba-pm-decision-abc-173-cut-vitest-2-executors-2048-mib-heap-architect-first-7e3b19d4
kind: decision
by: ba-pm
task: bapm-cut-ABC-173
at: 2026-10-19T12:00:00Z
verified_by:
confidence: medium
refs:
  - ABC-173
  - ABC-174
  - ABC-144
  - ABC-151
  - ABC-152
  - ABC-042
  - ABC-119
  - ABC-146
  - ADR-0008
  - ADR-0035
  - NFR-008
  - plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md
  - .grugops/context/wave-2026-09-25/notes/20261019T113000Z-orchestrator-decision-owner-word-vitest-cap-2-cores-2gb-c4a8e1f6.md
---

# ABC-173 cut (S, P1, Backlog, DoR 9/10): 2 busy executors and Σ heap_size_limit ≤ 2048 MiB, applied in every lane; Architect addendum to ADR-0008 first

This note is hand-authored and unsealed, because `scripts/context-io.ts` is absent on this install. The ticket
page is authoritative, and its `## Scope` and `## Risks`-equivalent sections (Pins touched, Owner questions)
govern. This note records only the choices and the reasons for them.

## Decisions
- **One ticket, size S.** It is not split. The CPU half adds one static row (`C2`), and everything else in that
  half is already in place. The memory half is one mechanism with its probes.
- **The bar's meanings** are adopted and sent to the owner as Q1-Q3:
  - "2 cores" = ≤ 2 CPU-busy executors (a worker, or the sync child it is blocked on). The main thread counts as
    overhead.
  - "2 GB" = Σ `heap_size_limit` ≤ 2048 MiB over the isolates live at once. RSS is reported, not gated.
  - The scope is all of the `AGENTS.md` vitest lanes, not only the five the note names.
- **CLI_DEEP serial-children ruling:** yes. It holds today (`spawnSync`) and is pinned by `C2`.
- **The limit must be proven applied:**
  - in a worker (`A4`);
  - in the main process (`A5`);
  - in each child spawn site (`A6`);
  - in every lane, by armed reds on the default lane, `CLI_DEEP` and `INPUT_DEEP` (`A3`).
- **Architect first:** an `ADR-0008` addendum before the SE. It rules on:
  - where the limit lives;
  - the budget table;
  - the `INPUT_DEEP` `NODE_OPTIONS` collision;
  - how the `CLI_DEEP` child gets its flag under the `CHILD_ENV` pin;
  - whether a setup entry is allowed in `vitest.config.ts`;
  - `N8-LANE` admissibility.
- **The NFR-008 bar is 10 s (R-1, live since 2026-10-10).** The "≤ 3 s" in the brief is the struck level.
- **Staleness:** `ABC-146` `A0` fires, and that is accepted. `ABC-174` takes its readings after `ABC-173` merges.

## Refused
- Changing `maxWorkers`.
- Any RSS or OS cap.
- `poolOptions`, a custom pool, or vitest `execArgv` as a heap route (Node refuses it).
