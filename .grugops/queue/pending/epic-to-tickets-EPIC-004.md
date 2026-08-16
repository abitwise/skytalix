---
task: epic-to-tickets-EPIC-004
subtask: epic-to-tickets-EPIC-004
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/epic-to-tickets-EPIC-004/
epic: plans/epics/EPIC-004-engine-and-ai-opponent.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T06:00:00Z
branch: grugops/decompose-epics-2026-08-16
base: main @ a5a4d51
id_range: ABC-074 … ABC-091 (yours alone — a CEILING, never a quota)
---

# Subtask: decompose `EPIC-004` — engine and AI opponent

**`EPIC-004` is the only `P0` left on this board and it has never been cut.** Read
`plans/epics/EPIC-004-engine-and-ai-opponent.md` (126 lines, all sections present), then
`plans/nfr-catalog.md` — especially `NFR-004` and `NFR-005` and the `RISK-002` survival paragraph
around `:536`. **I relay nothing**; every routing line below is a pointer to be verified, and the
sources outrank me.

## Two things to VERIFY before you cut anything — I believe the board is stale, and I did not fix it

1. **The board row says "first ticket must be `RISK-002`'s timeboxed spike". I believe that is
   discharged**: `ABC-008` — *SPIKE — Node search throughput* — is in `Done`, merged 2026-07-23,
   outcome **GO WITH CONSTRAINT, `RISK-002` answered**. If you confirm it, **say so and cut no
   spike**; the row is mine to correct and I will.
2. **The spike left a NON-NEGOTIABLE inherited constraint, and it is not optional wording:**
   `EPIC-004`'s per-move budget must be **time-based (iterative deepening against a wall clock),
   not depth-based** — a fixed depth blows `NFR-004`'s 3-second ceiling on the machines least able
   to absorb it. **Any ticket you cut that implies a fixed search depth contradicts a survived
   spike constraint.** Verify the paragraph says what I think it says.
3. **There is a measured shortfall you must not decompose around.** Re-running the spike's own
   metric against the merged generator gave **163k–351k nodes/sec** against `NFR-005`'s 500k target
   — **with no evaluation, move ordering, transposition table or quiescence running at all**. That
   is a 1.4x–3.1x shortfall *before* the expensive parts exist. **`NFR-005`'s depth-7 level is
   PROVISIONAL and this is why.** Decide and record whether that makes a performance ticket the
   first real ticket of this epic.

## Subject boundary — read this, it is the lesson of the last hop

Two sibling BA/PM agents are decomposing `EPIC-005` and `EPIC-006` **right now**. Ranges are
disjoint in ids and files; the last hop proved that is **not enough**, because subjects overlap
where ids do not. The boundary, ruled by me so you three do not each invent one:

- **Search strength, depth, time budget, evaluation, move ordering and any transposition table are
  YOURS.**
- **The user-facing DIFFICULTY SELECTION** — a flag, a prompt, how a chosen level persists across a
  session — **is `EPIC-006`'s, not yours.** You own the mechanism; it owns the choosing.
- **The opening book is `EPIC-005`'s.** It CONSUMES your move interface. If your design would
  change what the book consumes, **name it as a dependency and stop** — do not cut the book's work.
- **The incremental Zobrist key seam is Architect/Design's to design.** The architecture audit says
  this epic needs it and does not have it. You may cut a ticket to BUILD it, naming Architect/Design
  as the owner of its design; **you may not specify the seam yourself.**

If you find a fourth overlap I have not named, **record it and do not resolve it** — that is exactly
the class of gap that cost the last hop a rewrite.

## What you own

- Cut the epic into tickets inside `ABC-074`…`ABC-091`. **Eighteen ids is a ceiling chosen for
  headroom, not a target.** The precedent is `EPIC-003` at 22 points over nine tickets and
  `EPIC-006`'s runnable half at 13 over six.
- **Size honestly. `EPIC-004` is recorded `L` and BOTH previously-decomposed epics were corrected
  UPWARD at decomposition** (`EPIC-003` M→XL, `EPIC-006` M→L). If this one is bigger than `L`,
  correct the epic row's size in your report — I will apply it.
- **No `XL` ticket may enter dev.** If a ticket sizes `XL`, emit `SPLIT_REQUIRED` and split it.
- Each ticket: testable acceptance criteria, size, priority, epic, dependencies, NFR triggers, and a
  `DoR n/10` reading with every ⚠️ named.
- State the **build order** explicitly — this epic has real sequencing and a reader should not have
  to infer it.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-0{74..91}-*.md` and your notes under `ref:`. **Never an id
  outside your range.**
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine. Report the rows you want.
- **Do not edit `plans/epics/EPIC-004-*.md`** — report the row/size corrections you want instead, so
  one hand applies them.
- **Do not edit `plans/nfr-catalog.md`.** `NFR-004`/`NFR-005` targets are Architect/Design's. If a
  target looks wrong, that is a finding, not an edit.
- **Do not write any code, test, or `src/` file.** This is decomposition.
- **Do not run git.** Two sibling agents share this working tree and one index; I commit once.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (project process rule 2)

Criteria, scope and risks in the ticket; measurements, rejected alternatives and narration into
`ref:` notes. Median ≤300 lines per ticket page.

## Stop conditions

- A ticket sizes `XL` → `SPLIT_REQUIRED`, split it, say so.
- A decision is Architect/Design's (the Zobrist seam, any NFR target, the search architecture) →
  **name the owner and stop.** Do not resolve by inference.
- `NFR-005`'s provisional depth-7 level needs re-setting → that is Architect/Design's, not yours.
- The epic's acceptance criteria cannot be met by the tickets you cut → say which criterion is
  uncovered rather than stretching a ticket to cover it.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/epic-to-tickets-EPIC-004/`, write `claim.md` inside it,
`mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: your verification of the three items above; the ticket count and why that count; the build
order; the epic size correction if any; the board rows you want; and every gap with severity and
owner.
