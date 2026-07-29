---
id: 20260729T151049Z-ba-pm-artifact-ref-328eba81
kind: artifact-ref
by: ba-pm
at: 2026-07-29T15:10:49Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ABC-009
  - ABC-010
  - EPIC-001
  - EPIC-003
  - NFR-001
  - NFR-003
  - 20260729T145735Z-security-nfr-observation-abedec95
  - 20260729T150600Z-orchestrator-observation-7b2f91c4
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Artifacts produced — two defect tickets cut from the architecture audit

Subtask `arch-audit-cut-defect-tickets`. This note **points at artifacts**; it asserts no new
result. Every fact about the defects themselves belongs to the audit notes cited in `refs`.

## Provenance and admissibility (read first)

**This repo has no `scripts/context-io.ts`** — there is no `scripts/` directory at all. The
sanctioned SCTX-01 writer is absent, so this note was **hand-written directly against the
schema** in `agent-factory/contracts/context-note.md` and against the shape of the four
existing notes in this folder. **No validator ran, no admission check ran**, and `index.md` /
`index.jsonl` were not regenerated. No enforcement is claimed that did not happen.

`kind: artifact-ref` and `verified_by:` is **deliberately empty**. **No `finding` is admitted
here** — there is no live §14-gate verdict for this task, so a `finding` would be
inadmissible, and I did not self-stamp. This is the same posture the other four notes in this
folder took.

## Artifacts written

| Artifact | Path |
|---|---|
| Ticket ABC-009 | `plans/tickets/ABC-009-legalmoves-position-mutation.md` |
| Ticket ABC-010 | `plans/tickets/ABC-010-fen-semantic-validation.md` |
| Board rows (Backlog only) | `plans/board.md` |
| Traceability rows | `plans/traceability.md` |

Left **uncommitted in the working tree** by instruction — the Orchestrator commits this branch
once, after the concurrent agent finishes, to avoid a git race. Branch
`grugops/architecture-audit-2026-07-29`, unchanged.

## The two tickets

| Id | Title | Size | Priority | Epic | Column |
|---|---|---|---|---|---|
| ABC-009 | legalMoves mutates the position it documents as unchanged | `S` (2) | `P2` | EPIC-001 | Backlog |
| ABC-010 | FEN semantic validation | `M` (3) | `P1` | EPIC-003 | Backlog |

Neither sizes `XL`, so neither was split. ABC-010 carries a **pre-named split line** in case
its open design question moves it: (a) board-semantic legality / (b) field bounds + error
typing, with (b) shippable alone at `S`.

Front matter on both matches the board↔ticket contract in `plans/board.md`: `status: backlog`,
`column: Backlog`, plus `size` / `priority` / `epic` / `feature`. Ticket `column:` equals the
board column each sits under.

## Priority reasoning, recorded because it was the judgment call

Both defects are **latent today and live at EPIC-003** — that distinction, not a default, set
the two numbers, and they deliberately differ:

- **ABC-010 = `P1`.** It is the boundary. Every deeper symptom the audit reproduced, ABC-009's
  board corruption included, enters through `parseFen`. It goes live the moment EPIC-003 —
  a `P0` epic — accepts a user FEN, which is what EPIC-003 exists to do. It is the audit's
  named required fix `RF-3`. Not `P0`: nothing in flight is broken, suite 143/143 green.
- **ABC-009 = `P2`.** Latent, *and* ABC-010 removes its only reachable trigger — that
  asymmetry is why it sits a rung lower. Not `P3`: "unreachable in practice" is precisely the
  reasoning that let a broken contract ship under a 100% coverage number, the invariant is
  documented and relied on transitively by `gameStatus` and `perft`, and it fails silently.
  The ticket carries an explicit **escalation trigger** — it rises to `P1` if ABC-010 is
  deferred or descoped, or if any epic starts accepting positions from outside the rules core
  first — so the ordering is not left to later judgment.

## Deviation from the audit's own disposition, recorded

The security/NFR note's `AR-3` proposed that the `legalMoves` purity fix **ride along with**
`RF-3`. It was cut as a **separate ticket** instead: different modules, independently
testable, either can ship first, and `legalMoves`' contract should not depend on a caller
having validated its input — which is the assumption that failed. This is a scope judgment,
not a correction of the audit.

## Acceptance shape

Per the subtask brief, **each reproduction from the audit became a failing test that must go
green** — that is the acceptance bar on both tickets, written as Given/When/Then with exact
FEN strings, exact move counts, exact error types, and the current (defective) behavior stated
in parentheses beside each. Both tickets also carry a regression bar: full suite green with
skip count 0, deep perft 32/32 exact, `npm run perft` ≥ 1,000,000 nodes/sec.

I re-ran every reproduction myself from the session scratchpad (importing `src/` by absolute
path, repo untouched) rather than transcribing the numbers. All reproduced exactly as the
audit recorded, including the control that a well-formed position is unaffected. One detail I
can add: the phantom castle in `4k3/8/8/8/8/8/8/4K3 w K - 0 1` carries `FLAG_CASTLE` and is
`4->6`, in a list of 6 legal moves — the flag field is `flags`, not `flag`, which matters to
whoever writes the assertion.

## Board and traceability

- `plans/board.md` — two one-line rows appended under `## Backlog (WIP unlimited)`, matching
  the existing row format, plus a provenance comment. Backlog is WIP-unlimited, so **no WIP
  limit is breached**. **No other ticket was moved and no other column was touched.** The
  `_Updated:` line now reads 2026-07-29 / BA/PM.
- `plans/traceability.md` — one row per ticket, appended after ABC-008 and before the
  `pending` epic rows, `Status = Backlog`. Code/Tests cells name the **defective merged file**
  and read "not started"; UAT and Release are empty. **No code, test, UAT or release evidence
  was invented** — none exists yet.

## Not done, deliberately

- **Nothing promoted to `Ready`.** Both tickets record the Definition of Ready as met in their
  own footer, but the promotion is a separate BA/PM gate step and was not taken.
- **No `src/**` change.** The fix is a later `ticket-to-pr` run by a Software Engineer.
- **No touch of `plans/nfr-catalog.md` or `memory-bank/**`** — an Architect/Design agent is
  working those files concurrently on this branch. I neither saw nor waited for its output.
- **No `git add`, no `git commit`, no merge, no deploy.** `agent-factory/**` read-only.
- The audit's `RF-1` (NFR-005 catalog correction) and `RF-2` (pin-aware legality decision) are
  **not ticketed here** — both are Architect/Design-owned decisions, outside this subtask, and
  are named as out-of-scope inside ABC-010 so they do not get absorbed into it by drift.
