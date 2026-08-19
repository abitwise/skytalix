---
task: cut-epic006-gaps-2026-08-20
subtask: cut-epic006-gaps
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/cut-epic006-gaps-2026-08-20/
parent_ref: .grugops/context/uat-input-path-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T21:00:00Z
branch: grugops/cut-epic006-gaps
base: main @ HEAD
---

# Subtask: cut TWO `EPIC-006` tickets — the gaps a conducted UAT found, which are nobody's today

**The owner authorised TWO tickets, by name, in session (2026-08-20). This is the one time "one
ticket only" does not apply — and it is still exactly two.**

Both were found by UAT Planner **playing the real product**, not by reading it, and both were
**deliberately not cut as defects at the time** because neither is the fault of the ticket under
test. Both are `EPIC-006`'s. **Neither is anybody's ticket right now, which is why they are being
cut before they are forgotten** — this factory has already lost one item exactly this way (nothing
re-ran `NFR-008`'s restatement arithmetic, and eleven files landed against a planning number of
seven).

## Read first
- `parent_ref:` — the `ABC-033`/`035`/`037` conducted-UAT notes.
- `.grugops/context/uat-ABC-078-2026-08-20/notes/` — the `ABC-078` conducted-UAT notes.
- `plans/board.md` § the 2026-08-20 headers — the four closures and what the owner's word did NOT do.
- `AGENTS.md` § *Test and UAT authority*; `plans/epics/` for `EPIC-006`'s shape.

## Gap 1 — `quit` is advertised in `help` and does not quit

Measured in session: `quit` is **recognised**, then **nothing happens**; the session ended only at
EOF. **This is CORRECT against `ABC-035`**, which owns grammar only — the effect was ruled
`EPIC-006`'s on 2026-08-12, and `ABC-035` was accepted by the owner on that understanding. **Do not
re-open `ABC-035` and do not cut this as its defect.**

The user-facing fact that has no owner: **the product prints `quit` in its own `help` output and does
not honour it.** Cut the ticket for the EFFECT. Consider — and rule on the page, do not leave
implicit — whether `quit` should confirm, whether it should differ from EOF (which already exits 0
with `input ended`), and what exit code it carries.

## Gap 2 — at checkmate the product announces nothing

Measured in session: `1. f3 e5 2. g4 Qh4#` — the session **stops**, further typed moves are ignored,
exit 0, **and no result line is ever printed**. The status panel still reads `CHECK`
(`src/status-panel.ts:202-206`, deliberate). `src/turn-loop.ts:285-317` **returns the result
correctly** — so this is a PRESENTATION gap, not a rules gap, and the UAT said so.

**Not `ABC-078`'s** (its delivered diff is two files) and it was explicitly ruled must-not-hold it.
Cut the ticket for the ANNOUNCEMENT: what a human is told when a game ends, for **every** terminal
outcome the rules core already computes — checkmate, stalemate, and the draw conditions
`ABC-021` touches — not just mate.

## Fences
- **EXACTLY TWO TICKETS.** If you find a third thing, **name it and leave it uncut** — that is the
  Orchestrator's to route, as `ABC-111` was.
- **Do not re-open, re-score or amend `ABC-033`, `ABC-035`, `ABC-037` or `ABC-078`.** All four are
  `Done` on the owner's word. **A closed ticket is not re-opened to carry a gap it never owned.**
- **Do not read the owner's "All four, pass forward" as a ruling on either gap.** It accepted the
  tickets; it answered neither question, and the board says so.
- **Do not move `NFR-008`'s levels**, do not re-cut any `N8-LANE ≤ 650 ms` line, do not open
  `plans/nfr-catalog.md` or `ADR-0014` for writing. The eight rows must stay byte-identical at
  `sha256 63f66795…ca31` — **verify it, do not promise it.**
- **Do not decide `ABC-110`'s lever.** That is the owner's and it is still open.
- 0 files under `src/`. **Add Backlog rows only — column moves are mine.** Do not merge, do not
  deploy.

## Test notes you will want
The default lane at the repo root is **contaminated by leftover agent worktrees** (`ABC-050`):
`npx vitest run` reports ~1230 files / 36 443 tests. **The contained reading on `main` is 39 files /
1190 tests / skip 0 green**, `tsc --noEmit` exit 0, `biome check src` clean over 66 files. Use
`npx vitest run --dir src`. Size any test cost against the 1190/39 baseline.

## Publish
Two ticket pages under `plans/tickets/`, two Backlog rows, trace rows, and typed notes per
Workflow 16 into `ref:` — hand-authored per `agent-factory/contracts/context-note.md`; no `finding`
is admissible. **State both new ids explicitly in a `decision` note.** Give each a size, a priority
with its argument, and a DoR score with the ⚠️ items named rather than smoothed.

Claim by hand: `mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/cut-epic006-gaps`. **Work in your own `git worktree`, not the repository
tree.** Commit on `grugops/cut-epic006-gaps`, never on `main`.
