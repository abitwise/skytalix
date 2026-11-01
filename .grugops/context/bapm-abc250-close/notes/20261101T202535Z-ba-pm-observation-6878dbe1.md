---
id: 20261101T202535Z-ba-pm-observation-6878dbe1
kind: observation
by: ba-pm
at: 2026-11-01T20:25:35Z
verified_by: 
confidence: high: files and commits as written; facts read by file reads, grep and git log/show, no test run (recorded as an observation: no gate run backs an artifact-ref here)
refs:
  - bapm-abc250-close
  - ABC-250
  - ABC-251
  - ABC-252
  - ABC-253
  - ABC-254
  - ABC-249
  - ABC-259
  - ABC-260
  - ABC-261
  - ABC-262
  - ABC-255
  - ABC-240
  - ABC-209
  - ABC-256
  - EPIC-010
  - EPIC-011
  - ADR-0055
  - ADR-0056
  - ADR-0003
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - RISK-EPIC011-03
  - QE-250-a
  - QE-250-b
  - QE-250-c
  - QE-250-d
  - QE-250-e
  - QE-259-c
  - QE-260-a
  - QE-261-c
  - arch-abc250-close
  - orch-2026-10-30a/20261101T201645Z-orchestrator-decision-d2571be5
  - orch-2026-10-30a/20261101T201630Z-orchestrator-decision-1f5e3b27
  - qe-ABC-250/20261101T201444Z-qe-e2e-decision-4fe9c469
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-677d4d41
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-81a2c477
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-94b58687
  - qe-ABC-250/20261101T201444Z-qe-e2e-observation-f2befa65
  - se-ABC-250/20261101T192954Z-software-engineer-observation-ff7ffb6e
  - 767a2e3e
  - a9fa76c5
  - 24f6caae
  - c64a9672
  - 2e04eee5
  - 35139b31
  - 55c4f09d
  - 3bfe180e
  - 98d601d6
  - 2091d301
  - 59842f9f
  - 12e78c4d
supersedes: 
seal: sha256:293f97eb7dc74492080af4fe0b8dd85d35a2259e8951812f97bf102adcfe7374
---

# Artifacts of `bapm-abc250-close`: three ticket pages (`ABC-250`, `ABC-251`, `ABC-252`), two epic blocks plus `EPIC-010` rows, and four trace rows; nothing else touched

The records commit is `c64a9672` on `grugops/bapm-abc250-close` (from `main` `767a2e3e`; claim commit `24f6caae`).

- **`plans/tickets/ABC-250-…`:** front matter `status: dropped`, `column: Done`. A dated close block is added after
  the H1. The rest of the page stays as history.
- **`plans/tickets/ABC-252-…`:** front matter `status: dropped`, `column: Done`. A dated dropped block is added after
  the H1.
- **`plans/tickets/ABC-251-…`:**
  - Title, H1 and size (L to S) are changed; the file name is kept.
  - A dated re-scope block is added. In place, with struck text kept: Problem, Scope, Out of scope, A1–A5, the miss
    rules, NFR triggers, test notes 3 and 4, Size and priority, and Dependencies.
  - Test note 8 is added. The DoR table is re-scored (9/10).
- **`plans/epics/EPIC-010-…`:**
  - A dated top block is added.
  - § Tickets rows 25, 26 and 27 are re-stated. The status cells of rows 24, 29, 30, 31 and 32 are set to Done, with
    the merges `98d601d6`, `3bfe180e`, `2091d301`, `59842f9f` and `12e78c4d`.
  - The first cells of § Milestone 1b rows 1, 2 and 3 are marked, and row 2's cut and size cells are narrowed.
- **`plans/epics/EPIC-011-…`:** a dated top block is added (E 1 650 confirmed and the raise rule; "the packed base"
  re-read; `ABC-262` unchanged). No row is changed.
- **`plans/traceability.md`:** four 10-cell rows are appended: `ABC-250`, `ABC-251`, `ABC-252` and
  `bapm-abc250-close`.
- **Facts read** (file reads and `git log` / `git show` at `767a2e3e`; no test run):
  - `pieceType` / `isBlack` sit at `src/position.ts:52`/`:55`.
  - Lines calling them: `moves.ts` 13, `evaluate.ts` 7, `apply.ts` 3, `search.ts` 2, `quiescence.ts` 2, `legal.ts`
    1, `zobrist.ts` 1 (`grep -c`).
  - `...heuristics` is at `src/engine.ts:719`.
  - `grugops/ABC-250` tip is `35139b31`, with code at `2e04eee5`; `grugops/qe-ABC-250` tip is `55c4f09d`.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, the ADRs and `AGENTS.md`.
