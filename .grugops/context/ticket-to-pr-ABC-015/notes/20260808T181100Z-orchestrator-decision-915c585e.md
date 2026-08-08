---
id: 20260808T181100Z-orchestrator-decision-915c585e
kind: decision
by: orchestrator
at: 2026-08-08T18:11:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-014
  - ABC-018
  - ABC-009
  - ABC-022
  - EPIC-002
  - EPIC-006
  - RISK-005
  - NFR-007
  - src/render.ts
  - plans/board.md
  - plans/tickets/ABC-015-glyph-mode-selection.md
supersedes: 
---

# `ABC-015` opened as `ticket-to-pr` — routed to BA/PM first, because it is still in `Backlog`

## The request and what it changes about the pull order

Project owner **Olger Oeselg** said, in session on 2026-08-08: **"continue with ABC-015"**. That is
an owner pull-order call and it is taken as one, not argued with.

**What it displaces, named so nobody has to re-derive it later.** The standing pull order put
`ABC-009` (S, P1) and `ABC-022` (S, P1) — the two rules-core defects — ahead of renderer work,
under the owner's own legality-first directive. This request moves `ABC-015` in front of both.
**Neither defect is cancelled, de-prioritised, or re-sized by this**; they keep `P1` and their place
in `Ready`. The owner may re-order their own queue; this role records the displacement rather than
silently absorbing it.

## `ABC-015` is NOT in `Ready`, so this role cannot pull it yet

`plans/board.md` line 84 has `ABC-015` in **`Backlog`**, carrying `blocked-until: ABC-014`. The
board's column table gives the `Backlog` exit to **BA/PM**, not to this role. The ticket file says
the same thing in its own words: *"Promotion to `Ready` is a separate BA/PM step, taken when
`ABC-014` clears."*

So the first subtask is a **BA/PM promotion**, and only after it lands can this role apply the
Definition of Ready and pull `Ready → In Development`. This role will not shortcut a column exit it
does not own, and will not pull a ticket out of `Backlog` because the owner is waiting.

## The blocker IS discharged — verified against merged `main`, not inherited

`ABC-014` merged 2026-08-08 (`ed42d26` → `c1d694f`) and sits in `Done`. The dependency `ABC-015`
declares is *"`ABC-014` — declares the `GlyphMode` type this returns"*. Checked by reading the
merged file rather than trusting the close-out note:

- `src/render.ts:61` — `export type GlyphMode = "unicode" | "ascii";`
- `src/render.ts:68` — `export type Orientation = "white-bottom" | "black-bottom";`
- `src/render.ts:113-116` — `renderBoard(..., mode: GlyphMode, orientation: Orientation, ...)`

The type this ticket must return exists, is exported, and is on `main`. **The board's "no unbuilt
dependency" test — the single item `ABC-015` failed on 2026-08-04 — now passes.** That is a fact
BA/PM needs; the promotion decision is still theirs.

## Definition of Ready — pre-checked here, formally gated at the pull

Not the gate. The gate runs at `Ready → In Development`, after BA/PM acts, per Workflow 04 step 1.
This pre-check exists only to establish that routing to BA/PM is not routing into a wall:

| Check | State |
|---|---|
| problem clear | ✅ the `????????` player and the player who should never think about it |
| scope / out-of-scope | ✅ one function, five rows; six out-of-scope items each with a reason |
| INVEST | ✅ — and now genuinely *estimable/small*, since its one dependency is merged |
| acceptance testable | ✅ nine enumerated input tuples, each with one exact output |
| dependencies known | ✅ `ABC-014` (discharged above); merge-order constraint binds at `ABC-018` |
| NFR triggers + measurable target | ✅ zero filesystem + zero process operations, inside `NFR-007` |
| test notes | ✅ table-driven, env injected, `win32` case labelled a regression guard |
| size | ✅ `S` (2) — **not `XL`, so no `SPLIT_REQUIRED`** |
| priority | ✅ `P1` |
| no unresolved blocker | ✅ `Blocked` column is empty; `blocked-until` discharged |

## WIP, checked before scheduling, not after

`Ready` **3/8** → **4/8** on promotion. `In Development` **0/3** → **1/3** on the pull.
`In Analysis` 0/2 and `In Design` 0/2 are untouched — see below. **No limit is approached and no
override is taken.** Queue width this step is **1**, inside `queue.wip_limit: 3`.

## No design hop, and the reason is on the record rather than assumed

`ABC-014` — an `M`, the epic's headline — took no design hop because its cross-ticket contracts were
already settled at the epic. `ABC-015` is a strictly smaller case: **one pure function, a
five-row precedence table already written out in the ticket, and a return type another merged module
declares.** There is no structure to decide and no ADR owed. `In Analysis` and `In Design` are
skipped deliberately, not overlooked.

## `RISK-005`'s sequencing constraint, restated as an obligation this task carries

`ABC-015` merges **with or before `ABC-018`**, never after. `ABC-018` is unstarted and in `Backlog`,
so the constraint is satisfiable and satisfied by doing this work now. **This ticket being pulled
ahead of `ABC-018` is the constraint working, not being bent.**

## Substrate: degraded, same as every prior task on this board

This install has **no `scripts/claim.js`** and **no `scripts/context-io.ts`**. Workflow 17 step 2's
atomic `claimTask` cannot be executed and Workflow 16's sanctioned writer does not exist. Queue
transitions are moved by hand and notes are hand-written in the schema's exact shape.
**`finding` is NOT admissible here — no §14 gate exists to issue a stamp — and nothing is
self-stamped.** Recorded, not glossed.

## Branch

`grugops/ticket-to-pr-ABC-015`, cut from merged `main` at `f1743a3`. Every commit for this ticket —
BA/PM's promotion included — lands there. **Never on `main` directly**: the commit-side branch guard
is untouched by the owner's standing merge directive, which governs what happens *after* a green
gate, not how work is produced.

## Plan of record for this task

1. **BA/PM** — `Backlog → Ready` (their exit), with the discharged dependency checked at the ticket.
2. **Orchestrator** — Definition of Ready at the pull, then `Ready → In Development`.
3. **Software Engineer** — implement on this branch, `In Development → In Review`.
4. **QE/E2E** — break it, `In Review → In Security/NFR` or back.
5. **Security/NFR** — gate the zero-I/O bar and re-derive the ticket's "no security trigger" claim
   rather than ratifying its wording. `ABC-014`'s gate corrected exactly such a claim; this ticket
   reads `process.env`, which is a real data source, so the gate decides — the ticket does not.
6. **Orchestrator** — gates on both sides, merge, `Done`.

## Two items still open and NOT touched by this task

1. **The self-healing snapshot net** — routed to the AGENTS.md Scribe, still open.
2. **`ABC-012`'s ticket frontmatter is a column behind the board** — still the board sweep's.

## Next action

BA/PM decides `Backlog → Ready` for `ABC-015` on branch `grugops/ticket-to-pr-ABC-015`.
