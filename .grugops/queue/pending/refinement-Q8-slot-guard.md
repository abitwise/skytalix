---
task: refinement-Q8-slot-guard
subtask: refinement-Q8-slot-guard
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-Q8-slot-guard/
parent_ref: .grugops/context/pull-abc065-066-2026-08-16/
enqueued_by: orchestrator
enqueued_at: 2026-08-16T04:00:00Z
branch: grugops/refinement-2026-08-16
base: main @ 5cf86d3
id_range: ABC-067 (one id, yours alone — no other hop may use it)
---

# Subtask: cut the `Q8` ticket — the unterminated HTML comment that extends the slot

**Read `parent_ref:` FIRST**, then `.grugops/context/quality-gate-ABC-065-qe/notes/`. Both on disk.
**I relay nothing** — the two sentences below are routing, not evidence; go read the measurement
yourself and let it correct me if I have it wrong.

`Q8` is QE's MEDIUM against the one-day-old `AGENTS.md` `Dev / run` slot guard delivered by
`ABC-065`: an unterminated HTML comment silently EXTENDS the slot window and the suite still ships
green. The Orchestrator ruled it **a real defect that gets a ticket rather than a quiet patch**, and
QE ranked it **first of three carry-forwards, "worth a hop."**

## What you own

1. Cut ONE ticket at `ABC-067` for `Q8`. Nothing else in your range.
2. **Verify the measurement before you write acceptance criteria on it.** Two claims are in the
   notes and both are testable by reading `AGENTS.md` and the guard: the slot grew from 9 lines to
   16, and the `end < 0` branch is dead in practice because `AGENTS.md` contains ten `-->`.
   Re-measure both. **If either is wrong, say so in a note and write the ticket against what you
   measure, not against what I quoted.**
3. Decide and record whether "it passed by luck" is a criterion the ticket can assert, or only
   narrative. QE's own words are that had the window reached `npx vitest run --coverage`, the guard
   would have redded on `--coverage` — that is a *reachability* claim; say whether a test can pin it.
4. Size, priority, epic, and a `DoR n/10` reading with any ⚠️ named, per the board's row format.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-067-*.md` and your notes under `ref:`.
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. Report the row
  you want and it will be appended for you.
- **Do not fix `Q8`.** You are refining it into a ticket, not implementing it. No edit to
  `AGENTS.md`, `src/`, or any test.
- **Do not run git.** No `add`, no `commit`, no branch, no worktree. Two sibling agents share this
  working tree and one index; the Orchestrator commits once, at the end.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (this project's process rule 2)

Acceptance criteria, scope and risks in the ticket; measurements, rejected alternatives and gate
narration into `ref:` notes. Target ≤300 lines for the ticket page.

## Stop conditions

- The ticket would be XL → emit `SPLIT_REQUIRED` and stop.
- A criterion needs a ruling that is Architect/Design's or the owner's → stop, name the owner, do
  not resolve by inference.
- You cannot verify a claim the notes make → record it UNVERIFIED; never restate it as measured.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-Q8-slot-guard/`, write `claim.md` inside it,
`mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: the ticket id and title, your re-measurement of both claims, the board row you want, and
every gap with severity and owner.
