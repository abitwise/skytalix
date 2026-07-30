---
id: 20260730T170500Z-ba-pm-artifact-ref-d41f6b09
kind: artifact-ref
by: ba-pm
at: 2026-07-30T17:05:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - ABC-011
  - ABC-012
  - ABC-013
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0004
  - NFR-002
  - NFR-003
  - NFR-007
  - RISK-005
  - 20260730T161000Z-ba-pm-decision-9c4e1d83
  - 20260730T162500Z-ba-pm-decision-b7f20a56
  - 20260730T164000Z-ba-pm-decision-3ef8c1d2
  - 20260730T165200Z-ba-pm-observation-5a1c7be4
supersedes: 
---

# Artifacts written by `ba-pm-epic002-tickets` — the complete list

Pointer note for subtask `ba-pm-epic002-tickets` of task `epic-to-tickets-EPIC-002`. Every path is
repo-relative. **No file under `src/` was created, modified or deleted** — the subtask's stated
constraint, and it holds literally.

## Tickets created (8)

| Path | Id | Size / Pri | Column |
|---|---|---|---|
| `plans/tickets/ABC-012-game-history-module.md` | ABC-012 | `M` / `P0` | Ready |
| `plans/tickets/ABC-013-san-rendering.md` | ABC-013 | `M` / `P1` | **Blocked** |
| `plans/tickets/ABC-014-board-frame-renderer.md` | ABC-014 | `M` / `P0` | Ready |
| `plans/tickets/ABC-015-glyph-mode-selection.md` | ABC-015 | `S` / `P1` | Backlog |
| `plans/tickets/ABC-016-status-panel.md` | ABC-016 | `M` / `P1` | Backlog |
| `plans/tickets/ABC-017-bounded-move-history-pane.md` | ABC-017 | `S` / `P2` | Backlog |
| `plans/tickets/ABC-018-frame-output-and-redraw.md` | ABC-018 | `S` / `P0` | Backlog |
| `plans/tickets/ABC-019-turn-loop-skeleton.md` | ABC-019 | `L` / `P0` | Backlog |

23 points. Largest `L`. **No `SPLIT_REQUIRED`.**

## Files amended (6)

- **`plans/epics/EPIC-002-terminal-board-and-game-loop.md`** — four marked amendments (`[A1]`–`[A4]`)
  with a summary table at the head; acceptance #2 → `2a`/`2b`/`2c` and #4 → `4a`/`4b`/`4c`/`4d`;
  **#1 and #3 unchanged**; two promise reductions marked **REDUCED** rather than softened quietly;
  size `M` → `XL` with the reason; `tickets:` added; `EPIC-006` and `ADR-0004` added to
  `## Dependencies`; `## Out of scope` grew ANSI colour, SIGWINCH, an animating thinking indicator,
  `parseSan` and the captured-piece list; `## NFR triggers` records the `O(plies)` → `O(window)`
  consequence and flags that `plans/nfr-catalog.md`'s NFR-002 row is owed an Architect/Design update.
- **`plans/tickets/ABC-011-zobrist-en-passant-hashing.md`** — escalated `P2` → `P1`,
  `Backlog` → `Ready`, front matter and Definition-of-Ready block updated, with a dated block at the
  head quoting the trigger that fired. **Size, acceptance, reproduction, the open design question and
  the `NFR-005` bar are untouched.**
- **`plans/board.md`** — `EPIC-002` row annotated `decomposed:` and re-sized (row **stays in
  `Backlog`**, matching `EPIC-001`'s precedent exactly); `Ready` 0/8 → **3/8**; `Blocked` gains its
  first-ever row; five ticket rows appended to `Backlog` with `blocked-until` lists; header updated.
  **No WIP limit approached and no override taken.**
- **`plans/traceability.md`** — eight rows appended, replacing `EPIC-002`'s single `pending` row;
  `ABC-011`'s Status cell updated to `Ready` with the trigger named; trailing comment block extended.
  **No `ADR-0004` row appended** — this file's own convention is that ADR rows land after
  ratification.
- **`plans/metrics.md`** — Throughput records 8 tickets **created** and explicitly **0 reached Done**
  (creation is not throughput); `WIP` and `Blocked time` updated, the latter naming the 2026-08-01
  escalation date for `ABC-013`.

## Context notes published (5, this one included)

- `20260730T161000Z-ba-pm-decision-9c4e1d83` — **BLOCKER 1 ruled** (glyph mode).
- `20260730T162500Z-ba-pm-decision-b7f20a56` — **BLOCKER 2 ruled** (redraw model, bounded history).
- `20260730T164000Z-ba-pm-decision-3ef8c1d2` — the ticket cut, sizes, priorities, board and WIP.
- `20260730T165200Z-ba-pm-observation-5a1c7be4` — **what was escalated instead of ruled**, plus the
  disposition of all eight stop-list items.
- `20260730T170500Z-ba-pm-artifact-ref-d41f6b09` — this note.

All five are `decision` / `observation` / `artifact-ref`. **`finding` is not admissible in this
task** — there is no §14 gate here to stamp one and no agent may self-stamp. No `verified_by` field
was filled on any note and no stamp was claimed.

## Definition of Ready — the gate result, in one place

| Check | 012 | 013 | 014 | 015 | 016 | 017 | 018 | 019 |
|---|---|---|---|---|---|---|---|---|
| problem clear | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| scope + out-of-scope | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| INVEST | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| acceptance testable + measurable | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| dependencies known | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| security/NFR triggers measurable | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| test notes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| size | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| priority | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **no major unresolved blocker** | ✅ | **❌** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Seven of eight meet the Definition of Ready in full.** `ABC-013` fails exactly one check —
`ADR-0004` is unratified — which is why it is in `Blocked` rather than `Ready`, and why
ratification alone clears it. The five in `Backlog` meet the DoR and are held only by unbuilt
predecessor **tickets**; they are not Blocked-column blocked.

**Every acceptance criterion across the eight tickets is a number, a state, or an observable
outcome.** No criterion reads "works" or "looks right" — the two that used to (the epic's #2 and
#4) are the two that were amended.
