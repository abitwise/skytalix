---
id: 20260806T090000Z-orchestrator-decision-3b7c1d24
kind: decision
by: orchestrator
at: 2026-08-06T09:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-014
  - ABC-014
  - ABC-012
  - ABC-015
  - ABC-018
  - EPIC-002
  - RISK-005
  - NFR-002
  - src/position.ts
  - src/perft.test.ts
  - src/render.ts
  - plans/board.md
  - plans/traceability.md
  - refinement-2026-08-04
  - epic-to-tickets-EPIC-002
supersedes: 
---

# ABC-014 pulled `Ready` → `In Development` — the third look at a ticket this role twice declined

## Why this ticket and why now

BA/PM's 2026-08-04 refinement fixed the pull order as **`ABC-012` → `ABC-014` → `ABC-009` →
`ABC-022` → `ABC-013`**. Item 1 is merged to `main` and `Done`. This pull takes item 2 and nothing
else; **the order is not re-opened and no priority is re-litigated here.**

`ABC-014` is `P0`, has **no unbuilt dependency at all**, and is the ticket the epic's own words call
"the headline of the epic — everything else in `EPIC-002` decorates this."

## The two prior declines are SPENT, not overturned

This role declined `ABC-014` on **2026-08-02** and again on **2026-08-03**. Both declines were
correct at the time and both were against the same thing: `ABC-015` claimed it must merge "with or
before `ABC-014` reaches `Done`" while being unwritable until `ABC-014` declares `GlyphMode` — a
cycle, and in this project (`mode=lean`) `Done` means merged.

BA/PM untied it on 2026-08-04, correcting **`ABC-015`, not this ticket**. Re-checked at this pull
rather than taken on trust — all four documents read, not summarised:

- `ABC-014` `## Dependencies` — names `ABC-018` as "first user-visible use".
- `ABC-015` — corrected in Dependencies, priority rationale and DoR.
- `ABC-018` — carries the constraint and the obligation not to hardcode or re-derive the mode.
- `EPIC-002` `RISK-005` — the propagated wrong wording is corrected in place.

**No two of them disagree.** The chain `ABC-014 → ABC-015 → ABC-018` is acyclic. The constraint
binds at `ABC-018` because that is the first ticket in the epic that puts a board in front of a
player; this one "returns a frame as a value … and writes nothing" and takes the glyph mode as a
**parameter it does not choose**, so merging it cannot produce the hardcoded-mode build `RISK-005`'s
mitigation rules out.

`ABC-015` stays in `Backlog` and is **not** promoted by this pull. Untying the merge order did not
remove the build dependency, and `ABC-014` is unbuilt until the work below lands.

## Definition of Ready — re-checked AT the pull, against merged `main` (`ed42d26`)

Re-checked rather than assumed from the 2026-07-30 promotion, per the `ABC-020` / `ABC-011` /
`ABC-012` precedent. Each premise was checked against the merged tree:

- **Problem** ✅ — and its central claim is still TRUE on `main`: there is no way to see a position
  in this product. **`src/render.ts` does not exist**; `src/` holds fen, moves, apply, legal, perft,
  gameend, zobrist, history, position and nothing that draws a board.
- **Scope / out-of-scope** ✅ — five scope bullets, six out-of-scope items each with a reason.
- **INVEST** ✅ — independent. Every primitive it names is exported from **merged** `src/position.ts`:
  `Position` (l.30), `fileOf` (l.46), `rankOf` (l.47), `squareAt` (l.49), `pieceType` (l.52),
  `isBlack` (l.55). Verified by reading the exports, not the ticket.
- **Acceptance measurable** ✅ — nine criteria, and not one of them is "looks right": exactly 64
  cells, the file-label row `a b c d e f g h` and `h g f e d c b a` asserted **by order**, rank
  labels `8..1` / `1..8`, a code-point count above `U+007F` of **exactly 0**, code points inside
  `U+2654`–`U+265F`, adjacent-square shading difference as a **property**, `a1`/`h8` both dark,
  **byte-identical** repeat renders, and constant row count/width across the standing perft FENs.
- **Dependencies** ✅ — none blocking. `ABC-001` is merged; the `ABC-015` relation is a *consumer*
  constraint that binds at `ABC-018`, not a predecessor of this ticket.
- **NFR triggers** ✅ — one, with a numeric bar and a machine requirement: **board-frame compute
  ≤ 500 µs per frame**, 3% of `NFR-002`'s 16 ms budget, measured over the standing perft FENs and
  recorded with its machine. **No security trigger**, stated with its reason (no user-supplied
  string reaches this module; it renders bytes from `position.board`).
- **Test notes** ✅ — a snapshot matrix plus three named traps, each of which is a real trap:
  assert the file ORDER not merely that two frames differ; count CODE POINTS not characters;
  snapshots taken from the frame **as a value**, with no TTY attached.
- **Size `M`** ✅ (3) — **not XL, so no `SPLIT_REQUIRED`.** The ticket's own size rationale explains
  why folding in the status panel and history pane would make it an 8-point XL, and those stay in
  `ABC-016` / `ABC-017`.
- **Priority `P0`** ✅.
- **No blocker** ✅ — no `proposed` ADR is in this ticket's path. The `ABC-013`-in-`Blocked`
  situation does not repeat here.

The standing perft FEN table the geometry criterion is written over **exists and was counted**:
7 FENs in `src/perft.test.ts` (startpos, kiwipete, and five more). The criterion is executable as
written.

## NO design hop and NO Frontend/UI hop — the judgment, stated rather than defaulted

`In Design` stays 0/2. This is a ruling, not an omission, and it is recorded because "renderer
ticket, therefore UI role" is the reflex it declines.

**The three cross-ticket contracts a design hop would exist to settle are already settled in
writing, by the roles that own them:**

1. **Shading is by CHARACTER, not ANSI background** — `EPIC-002` scope amendment `[A4]`, with its
   reason (a character survives a pipe, a snapshot diff and a colour-blind terminal; `EPIC-006`'s
   end-to-end test drives stdout as a pipe). ANSI colour is cut from the MVP, deferred not deleted.
2. **The glyph mode is a PARAMETER this module does not choose** — amendment `[A1]` and acceptance
   `2b`, whose five-row selection table belongs to `ABC-015`. This ticket declares the type; it does
   not decide the value.
3. **The frame is a VALUE with constant geometry** — acceptance `4a`, which gives a reference layout
   and then says in its own words that **"the invariant is the criterion; the exact split is the
   engineer's."** The epic has already delegated the remaining layout freedom to the engineer.

**Frontend/UI was considered and declined.** Its output is a UI contract — design tokens, component
inventory, the five states, the accessibility bar. For a function that returns an array of strings,
those questions are either answered above or do not exist. Running the hop would produce a
restatement of `EPIC-002`, and the routing matrix routes to the role that adds a decision, not to
the role whose name matches the noun in the ticket title.

**The trigger that WOULD earn a Frontend/UI hop is named here so it is not missed: `ABC-018`**,
where the board, the status panel, the history pane and the message region compose into one frame
under acceptance `4a`/`4b`/`4c` and the row budget stops being one ticket's private business.

Contrast with the two tickets that DID take a design hop: `ABC-020` and `ABC-011` were each pulled
into `In Design` for a written reason quoted from the ticket itself (an `### Open design question`).
`ABC-014` carries no such line — the same test that sent `ABC-012` straight to development.

## Scheduling, width, and the substrate

**One ticket, not three.** `In Development` 0/3 → 1/3. `ABC-009`, `ABC-013` and `ABC-022` are all
pullable and none is pulled: a second concurrent ticket buys throughput this project has no way to
spend and costs the review attention this one needs. **No WIP limit is approached, no override is
taken, and no written reason is owed** — this sentence is the record that the limit was checked.

**Width for this task is 1 by the shape of the work, not by the cap.** `ticket-to-pr` is a chain —
engineer → QE/E2E → Security/NFR — and each stage reads what the previous one published. Three
subtasks are enqueued at once; they are drained in order. `queue.wip_limit` is 3 and
`queue.claim_cap` is 2; neither is reached.

**Substrate degradation, recorded not glossed:** this install still has **no `scripts/claim.js` and
no `scripts/context-io.ts`**. Workflow 17 step 2's atomic `claimTask` cannot be executed and
Workflow 16's sanctioned writer does not exist, so queue files move by hand and notes are
hand-written in the schema's exact shape. **`finding` is NOT admissible here — no §14 gate exists to
issue a stamp, and no role may self-stamp.** This note is a `decision`, which needs none. Same
posture as every task in this project's history; it is a real gap, not a hidden one.

## What this pull does NOT authorize

- **No merge is performed by this pull.** Merging gated work to `main` is authorized standing by the
  project owner (2026-08-06) — see `AGENTS.md` `## Branching model` — but that authority is approval
  to merge work that **PASSED**, never to skip or soften a gate. `quality.gate_enforcement` is
  `blocking`. The gate has not run yet.
- **No deploy.** `production_requires_human_confirmation: true`. Merge approval is not deploy
  approval, and per `ADR-0007` this project deploys nowhere at all.
- **No re-prioritisation and no board sweep.** Only `Ready` and `In Development` moved.
- **No ticket text edited.** Ticket prose is BA/PM's. Only the frontmatter `status` / `column`
  fields moved, which are board state.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed** — exactly as `ABC-011` and `ABC-012`
  carried them.

## Next action

The Software Engineer implements `ABC-014` on `grugops/ticket-to-pr-ABC-014` and owns the
`In Development → In Review` exit. QE/E2E then owns the `In Review` exit; Security/NFR gates
`NFR-002`'s board-frame bar after it, this ticket having one NFR trigger and no security trigger.
