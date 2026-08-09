---
id: 20260809T083704Z-orchestrator-decision-215adfeb
kind: decision
by: orchestrator
at: 2026-08-09T08:37:04Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-016
  - ABC-019
  - EPIC-002
  - EPIC-003
  - RISK-005
  - NFR-002
  - plans/board.md
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - plans/tickets/ABC-018-frame-output-and-redraw.md
supersedes: 
---

# Definition of Ready PASSES at the pull — `ABC-018` `Ready → In Development`

Workflow 04 step 1. This is the gate, not the pre-check. It is applied to the **corrected** ticket,
and BA/PM's five rulings were **re-verified at the source rather than inherited** — the same standard
BA/PM applied to this role's pre-check, and it is the standard that found the pre-check's amber row
was actually a FAIL.

## What was re-verified, and how

Three of BA/PM's five rulings are cheap to check and were checked. Two carry a cross-ticket contract,
so they were checked hardest.

| Ruling | Verified at | Verdict |
|---|---|---|
| **Defect 2 — the epic's reference layout contains a prompt row** | `plans/epics/EPIC-002-terminal-board-and-game-loop.md:197-198` — *"8 board rows + 1 file-label row + 3 status rows + 8 history rows + 2 message rows + **1 prompt row** = **23 rows**"* | **CONFIRMED.** `23` was never unsourced; this role's pre-check item 2 was wrong on that point and BA/PM's correction stands. The ticket's `## Scope` did assemble four of five regions and sum to 22 |
| **Defect 2 — no ticket owned the prompt row** | `ABC-016:72` gives *"all writing"* to `ABC-018`. `ABC-019`'s eight `prompt` hits are all about **when** to prompt (*"re-prompts"*, *"the fifth prompt outcome"*), never a frame row. `EPIC-003`'s are the prompt's **text, echo and `NFR-003`**, never a row | **CONFIRMED, and the split is clean.** Reserving the row here creates **no double ownership**: this ticket reserves and renders nothing, `EPIC-003` keeps the surface |
| **The ASCII sanitizer widening** | `EPIC-002:133` — `#2a` asserts zero code points above `U+007F` **"in the emitted frame"**, not in one panel | **CONFIRMED and required.** With `EPIC-003` echoing player text, a player typing `é` made two of this ticket's own criteria contradict. The widening is consistency with the epic, not scope creep |
| **Defect 3 — the `≥` boundary** | `EPIC-002:200` `#4b` — *"a TTY with **at least** as many rows as the frame"* | **CONFIRMED.** `R = H` is in-place by the epic's own rule and was untested |
| **Defect 4 — `NFR-002` as the sum** | The ticket's own `## Security / NFR triggers` and `plans/traceability.md`'s `ABC-018` row both said *"compute + write < 16 ms"* | **CONFIRMED.** The criterion contradicted its own ticket; the sum reading is the one the rest of the record already carried. **No target moved** |

**Defect 5** (the criterion phrased against ambient `process.stdout` that the ticket's own captured-sink
test notes make untestable) needed no external check — the contradiction is internal to the ticket and
visible on its face. It is the `ABC-015` defect-2 shape a second time, and the mutant is live here.

## The Definition-of-Ready gate

`agent-factory/checklists/definition-of-ready.md`, all ten checks, on the corrected ticket:

problem ✅ · scope + out-of-scope ✅ (out-of-scope now names the prompt itself) · INVEST ✅ ·
**acceptance testable ✅ — the row this role left AMBER and BA/PM correctly called a FAIL, now met
after five in-place corrections** · dependencies ✅ (both discharged, re-verified at the source in
this task's first note) · security/NFR triggers with measurable targets ✅ · test notes ✅ ·
size `S` ✅ · priority `P0` ✅ · no unresolved blocker ✅ (`Blocked` empty).

**`S` (2), not `XL` — no `SPLIT_REQUIRED`.** The size was re-checked rather than carried: the
corrections add one reserved row placed by the mechanism the message region already uses, one width
constant, one sanitizer clause and four tests. No argv, no I/O, no new module. `S` holds.

**GATE PASSES.** Pulling `Ready → In Development` — the exit this role owns.

## WIP, checked before the pull

`Ready` **4/8 → 3/8**. `In Development` **0/3 → 1/3**. `In Analysis` 0/2 and `In Design` 0/2
untouched. **No limit approached, no override taken, no written reason owed.** Queue width this step
is **1**, inside `queue.wip_limit: 3` — the pipeline from here (dev → QE → Security/NFR) is serial by
dependency, so scheduling wider would mean inventing work, not going faster.

## An open cross-ticket obligation this task creates and does NOT discharge

**The reserved prompt row is now a contract, and only one side of it is written down.** `ABC-018`
reserves the frame's last row and leaves the cursor at its start; `EPIC-003` is expected to type into
exactly that row, and `ABC-019` drives the loop around it. BA/PM was explicit that it **did not edit
and does not vouch for** `EPIC-002`, `ABC-016`, `ABC-017` or `ABC-019` — correctly, since a promotion
subtask should not quietly rewrite four other tickets.

So the obligation is real and currently lives in one ticket only. It is **not a blocker for
`ABC-018`**, which is buildable and testable against a stub, and it is **not** invented work for this
task. It is recorded here so it is not rediscovered as a defect: **when `ABC-019` is refined, and
when `EPIC-003` is decomposed, the prompt-row contract must be carried into them.** Routed to BA/PM
at that point, not now.

## Substrate and safety, unchanged

No `scripts/` — claims by hand, notes hand-written, **no `finding` admissible**, nothing self-stamped.
Work stays on `grugops/ticket-to-pr-ABC-018`; `main` is untouched at `7e0923c` and was verified so.
Nothing merged, nothing deployed.

## Next action

Software Engineer implements `ABC-018` on `grugops/ticket-to-pr-ABC-018`, then takes the
`In Development → In Review` exit.
