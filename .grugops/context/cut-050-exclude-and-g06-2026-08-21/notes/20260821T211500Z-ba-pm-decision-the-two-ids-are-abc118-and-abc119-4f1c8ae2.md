---
id: 20260821T211500Z-ba-pm-decision-the-two-ids-are-abc118-and-abc119-4f1c8ae2
kind: decision
by: ba-pm
role: ba-pm
task: cut-050-exclude-and-g06-2026-08-21
at: 2026-08-21T21:15:00Z
verified_by: ""
confidence: high
refs:
  - ABC-118
  - ABC-119
  - ABC-050
  - ABC-043
  - G-06
supersedes: ""
tree: grugops/cut-050-exclude-and-g06 off main @ 565c623
---

# The two ids are **`ABC-118`** and **`ABC-119`**, derived by listing `plans/tickets/` and cross-grepped before use

**`context.human_admission` is `off` on this install. This is a hand-authored `decision`, not a
`finding`, and it carries no `§14-gate#<id>` stamp. Nothing here is gate-verified.**

## The ids

| id | title | size | priority | DoR |
|---|---|---|---|---|
| **`ABC-118`** | A type-valid `exclude` glob silently changes what the default lane collects — nothing in this repository asserts the lane's inventory | `S` | `P1` | 9/10, ⚠️x1 (item 4) |
| **`ABC-119`** | No automated test anywhere spawns the delivered CLI and lets the REAL engine choose a move (`G-06`) | `M` | `P2` | 9/10, ⚠️x1 (item 5) |

**Derivation, not inheritance.** `ls plans/tickets/` returns **108 pages**, highest **`ABC-117`** —
which CONFIRMS the brief's claim rather than trusting it. `grep -rlo 'ABC-11[89]'` across `plans/`,
`memory-bank/`, `.grugops/context/`, `src/` and `AGENTS.md` returned **zero hits**, so neither id is
in use anywhere.

**Assignment of id to subject was arbitrary in one respect and deliberate in another:** the numbers
follow the brief's own ordering of the two items, and the ORDERING ARGUMENT between them is recorded
on both pages and runs the other way from the ids — `ABC-118` should land first because it guards
`ABC-119`'s deliverable. Neither blocks the other.

## Exactly two, and the third thing is named rather than cut

**`ABC-050`'s SECOND residual — the vitest sequencer / cached-durations trap that needs `--no-cache`
for armed probes — was not authorised and is NOT cut.** It is named in `ABC-118`'s `## Out of scope`
so a later reader cannot mistake `ABC-118` for covering it.

## Board and trace

Two `Backlog` rows on `plans/board.md`, two rows on `plans/traceability.md`, one board header.
**No ticket moved, no column moved, no WIP limit touched, no DoR re-scored, nothing archived,
nothing merged, nothing deployed.** Column moves are the Orchestrator's.
