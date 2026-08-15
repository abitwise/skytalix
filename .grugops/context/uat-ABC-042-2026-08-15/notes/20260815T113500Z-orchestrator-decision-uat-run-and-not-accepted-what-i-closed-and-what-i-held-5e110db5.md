---
id: 20260815T113500Z-orchestrator-decision-uat-run-and-not-accepted-what-i-closed-and-what-i-held-5e110db5
kind: decision
by: orchestrator
at: 2026-08-15T11:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - .grugops/context/uat-ABC-042-pack/notes/
  - .grugops/context/uat-ABC-042-bapm/notes/
  - .grugops/context/uat-ABC-042-qe/notes/
  - plans/board.md
  - plans/traceability.md
  - agent-factory/workflows/06-uat-pack.md
supersedes: 
---

# Close of `uat-ABC-042-2026-08-15` — the UAT RAN, it is NOT ACCEPTED, and the pack is not yet signable

## The result, in the only words that are true

**17 scenarios written, 17 run, 17 passed. `ABC-042` is NOT ACCEPTED.**

Both halves are the result. Seventeen green scenarios are **evidence for the owner's decision, not the
decision**. `context.human_admission` is `off`, no `finding` is admissible on this install, no
`§14-gate#<id>` verdict can be emitted, and the twelve signoff checkboxes stand empty. **No agent on
this hop signed anything, and none could have.**

## What the three subtasks returned

| subtask | verdict |
|---|---|
| `uat-ABC-042-pack` (UAT Planner) | 17/17 passed; tree proven byte-identical to `main` BEFORE any scenario ran; **disclosed a defect in its OWN scenario** and corrected the scenario, not the result |
| `uat-ABC-042-bapm` (BA/PM) | **Covers the value, NINE named gaps.** Not materially deficient |
| `uat-ABC-042-qe` (QE/E2E) | **4 backed / 10 partial / 3 unbacked.** Test bar re-run by hand: 856/856 on 30 files, skip 0, integrity clean — no disagreement with any recorded figure |

**The self-correction was independently cleared.** The planner disclosed that one scenario required
the word `random` never appear on screen, and it does — npm echoes the typed command line. BA/PM was
sent at that specific question and ruled the correction **SOUND, not weakened**: it narrowed *where
to look*, not *what must be true*; the original was un-passable on any build; the corrected statement
is stricter. One narrow loss found and recorded — the frame has three regions and the fix names two.
**The disclosure worked. It is the reason this hop can be trusted at all, and it is recorded as the
control it is.**

## The two findings that matter most, and neither is a defect in what shipped

**QE killed the delivered build twice with one-word mutations while the suite stayed 856/856 GREEN:**

1. `--ascii`'s wiring is pinned by nothing — drop the flag on the floor and every test still passes,
   because `selectGlyphMode` agrees with it on a pipe and **every test child is piped**.
2. `--colour` with no value throws `TypeError` with a stack trace where the usage line belongs — and
   **the exit code stays `1`**, so an exit-code-only assertion passes too.

**The delivered build is correct on both; the instruments that watch it are not.** Controls confirm
this. Recorded as coverage holes, never as defects.

## What I closed

- **`plans/board.md`** — header replaced (outgoing line archived VERBATIM to
  `plans/tickets/history/ABC-042-board-history.md` first, md5 `c4ad92340de13382a20142975f0b46c9`,
  2714 chars, **verified byte-identical by `cmp` against the file read back from disk**). The
  `ABC-042` row carries the UAT state and **is still ONE LINE**. The new header is 1651 chars against
  the outgoing 2713 — the board's own anti-regrowth rule, honoured rather than quoted.
- **`plans/traceability.md`** — one row, one cell (`UAT`), which was EMPTY. 10 columns re-asserted by
  re-splitting from disk after the write; zero raw `|` inside any cell.
- **The queue** — 3 claims released, every `by`/`at` preserved beside its `done/` record. The
  unrelated `agents-md-owner-grants` claim was left untouched (its `at` is ahead of the system clock,
  so the wall-clock TTL sweep is a correct no-op).
- **The three tips consolidated onto this hop's branch before anything else.** This repository has
  already recorded the failure where merging the obvious tips would have deleted the only written
  copy of a ruling. Not repeated.

## What I did NOT do, each with its reason

- **No board column moved.** `ABC-042` was already `Done` and merged at `dbaf972`; nothing was
  re-worked. Reasoning recorded at this task's opening decision note.
- **`Lead time` NOT written to `plans/metrics.md`.** Workflow 06 records it as the ticket **clears
  acceptance**. It has not cleared acceptance. Writing it would encode an acceptance that did not
  happen into the one file the Factory Coach reads as fact.
- **No ticket cut, though sixteen are recommended** (BA/PM's six pack amendments + three; QE's ten
  repairs, nine of which need zero new spawns). Cutting tickets is BA/PM's, and the two lists overlap
  — one BA/PM hop reading both note sets cuts one coherent set, where I would cut two overlapping
  ones from summaries.
- **The pack was NOT presented for signature.** BA/PM's ruling is that six amendments are owed
  first. Chief among them: **the pack names two of `EPIC-006`'s four acceptance criteria as unmet and
  is silent that the other two are unmet as well — `ABC-042` meets ZERO of four.** Handing the owner
  a signoff sheet with that understatement in it, and whose own exit criterion cannot be discharged
  by completing it (`B8`), would be handing him a defective instrument. **The pack is the thing the
  UAT produces; producing it defective and asking for a signature anyway is the failure mode this
  whole workflow exists to prevent.**

## The deferral, discharged for ONE ticket

28 `Done` tickets read *UAT deferred → `EPIC-006`, explicitly NOT passed*. **This hop discharges it
for `ABC-042` alone.** The other 27 are named here so the omission stays deliberate: they are a
separate decision, with separate scope, and several concern modules with no user-facing surface at
all.
