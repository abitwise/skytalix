---
task: epic-to-tickets-EPIC-005
subtask: epic-to-tickets-EPIC-005
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/epic-to-tickets-EPIC-005/
epic: plans/epics/EPIC-005-opening-book.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T06:00:00Z
branch: grugops/decompose-epics-2026-08-16
base: main @ a5a4d51
id_range: ABC-092 … ABC-099 (yours alone — a CEILING, never a quota)
---

# Subtask: decompose `EPIC-005` — opening book

Read `plans/epics/EPIC-005-opening-book.md` (73 lines — the smallest of the three, all sections
present), then its `## Dependencies` and `## NFR triggers` against `plans/nfr-catalog.md`. **I relay
nothing.**

## Subject boundary — read this, it is the lesson of the last hop

Two sibling BA/PM agents are decomposing `EPIC-004` (engine) and `EPIC-006` (packaging) **right
now**. Ranges are disjoint in ids and files; the last hop proved that is **not enough**, because
subjects overlap where ids do not. The boundary, ruled by me:

- **The book is yours: its format, its source data, how a line is looked up, and what happens when
  the book leaves book.**
- **The SEARCH is `EPIC-004`'s.** You CONSUME the engine's move interface; you do not modify search,
  evaluation, ordering or the time budget. **If the book needs a change to the engine's seam, name
  it as a dependency on `EPIC-004` and STOP** — do not cut the engine's work, even a small piece.
- **`EPIC-004` is being cut in parallel and its seam does not exist yet.** Expect to write
  dependencies against tickets whose ids you cannot know. **Depend on `EPIC-004` BY NAME and by the
  behaviour you need, never by a guessed ticket id.** A guessed id is worse than an unresolved one.

If you find an overlap I have not named, **record it and do not resolve it.**

## What you own

- Cut the epic into tickets inside `ABC-092`…`ABC-099`. **Eight ids is a ceiling. `EPIC-005` is
  recorded `S`, the smallest epic on the board — a small number of tickets is the expected and
  honest outcome, and I would rather see three good ones than eight thin ones.**
- **Size honestly, and correct the epic if it is wrong.** Both previously-decomposed epics were
  corrected UPWARD at decomposition (`EPIC-003` M→XL, `EPIC-006` M→L) — that is two for two, so
  treat `S` as a hypothesis, not a fact. Report the correction; I apply it.
- **No `XL` ticket may enter dev** — `SPLIT_REQUIRED` if one sizes that way.
- Each ticket: testable acceptance criteria, size, priority, epic, dependencies, NFR triggers, and a
  `DoR n/10` reading with every ⚠️ named. **Most of these will carry an ordering ⚠️ on `EPIC-004`;
  that is honest, not a defect — do not inflate a DoR score to make the epic look ready.**
- One question worth answering explicitly in a note: **is this epic pullable at all before
  `EPIC-004` delivers a move interface?** If the honest answer is no, say it plainly. `P1` work that
  cannot start is better labelled than quietly queued.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-09[2-9]-*.md` and your notes under `ref:`. **Never an id outside
  your range** — in particular **never `ABC-100` or above**, which is a sibling's territory.
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine. Report the rows you want.
- **Do not edit `plans/epics/EPIC-005-*.md`** — report corrections instead.
- **Do not edit `plans/nfr-catalog.md`.**
- **Do not write any code, test, or `src/` file.**
- **Do not run git.** Two sibling agents share this working tree and one index; I commit once.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (project process rule 2)

Criteria, scope and risks in the ticket; measurements, rejected alternatives and narration into
`ref:` notes. Median ≤300 lines per ticket page.

## Stop conditions

- A ticket sizes `XL` → `SPLIT_REQUIRED`.
- The book's data source or licence is undecided → **that is an owner/Architect question. Name it
  and stop; do not pick a source.** (Note this repo already has a licence-guard ticket in flight,
  `ABC-057` — bundled opening-book data is exactly the kind of thing that raises that question.)
- A decision belongs to `EPIC-004`'s engine design → name the owner and stop.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/epic-to-tickets-EPIC-005/`, write `claim.md` inside it,
`mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: the ticket count and why that count; whether this epic is pullable before `EPIC-004`
delivers; the epic size correction if any; the board rows you want; and every gap with severity and
owner.
