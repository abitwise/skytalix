---
id: 20260812T144300Z-ba-pm-decision-size-priority-board-and-what-routes-where-d1f68b47
kind: decision
by: ba-pm
at: 2026-08-12T14:43:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - EPIC-002
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# Size `S` and priority `P1` both HOLD, re-derived; the requested board move is **NONE**; and what routes where

> **Hand-authored**; `scripts/context-io.ts` does not exist here. `kind: decision` needs no stamp. **No
> figure below was re-measured at this hop** — `src/` was not opened — so every measurement is
> attributed to QE at `quality-gate-ABC-029-qe` or Architect/Design at `design-ABC-029-loss-record`,
> both on this stack. **This is a departure from the two previous BA/PM hops on this ticket and it is
> recorded as a cost, on the ticket at `## Test notes` 12 as well as here.**

## 1. Size `S` (2) — HOLDS, and the derivation is about the TICKET

**A ticket's size does not shrink because part of it is built.** The re-derivation the brief asked for:

- **The condition named in advance at the previous hop did NOT fire.** *"If `A2`'s channel fix cannot
  be made without a third file in the lane or a dependency, the size is re-derived."* `A2` is built —
  channel on **fd 3**, lane file count **TWO**, `dependencies` `{}` (traceability row, build hop).
- **The containment adds no file, no module, no dependency** — `ADR-0011` rules it as two sites in one
  existing test file with **zero production lines**. A fraction of an `S`, not an addition to one.
- **`A6` and `A5.6` add criteria, not files.** Same calibration as when `A5` was added: `ABC-024` was
  `S` with five criteria and named discriminating mutants in one existing file. **The six new required
  verdicts are constructed builds run out of tree; none is a committed file.**
- **New condition named in advance, replacing the spent one:** if the widened expression cannot land
  without a **second expression in the scanned-set derivation** (`A1` fixes that at zero filename
  exclusions) or a **third site** in the instrument, the size is re-derived. **`## Test notes` 11 is
  the live candidate for the second** — the record gives two line ranges for the docblock and they may
  be two blocks.

## 2. Priority `P1` — HOLDS

- **Not `P0`.** Trigger: *"the frame path itself gains a runtime importer of `src/history.ts`"*.
  **Not fired** — frame closure **11 modules on both trees**, `history.ts` absent, measured twice
  independently on this stack. **Being on a `P0`'s critical path still does not make this ticket `P0`;
  the line has now been held three times.**
- **Not `P2`.** `ABC-019` is `P0`, `gate_enforcement` is `blocking`, and **`ABC-029` has not landed** —
  this branch is nineteenth in a linear stack off `main` and the fast-forward is with the owner.
- **The containment is LATENT and that does not lower the ticket's priority.** QE swept: **zero bare
  imports and zero re-exports of any local module anywhere in production `src/`**. Nothing is one edit
  from `WLAUNDER`. **The priority is the ticket's and the ticket's blocker is unchanged.**

## 3. Requested board move — **NONE**

`ABC-029` sits in **`In Development`** (WIP 2/3) and the ticket's front matter reads
`status: in-development` / `column: In Development`. **They AGREE** — the Orchestrator verified that at
source this hop — **so nothing moves and the front matter is NOT edited.** Editing a header that
already agrees would manufacture the two-records-disagree defect in the opposite direction.

**BA/PM's own transition is the `Backlog → Ready` exit and it was SPENT** at
`refinement-ABC-029-criteria` (DoR 10 of 10). **Writing rows onto a ticket already in development does
not move it.** `plans/board.md` was **not opened for edit**; it is the Orchestrator's and the brief
reserves it.

## 4. `plans/traceability.md` — read, CONFIRMED, not edited

Workflow 07 asks this role to *confirm or extend* the requirement→epic→feature→ticket linkage and
`Status`. **The linkage is present and correct — `ABC-029` → `EPIC-002` → no feature — and did not
move; `Status` did not move.** Nothing written here produces a new code, test or UAT artefact, so a
`Tests` cell would have to describe tests BA/PM did not add — **the same refusal Architect/Design and
QE both recorded on that file, and a concurrent `ABC-028` hop has had live edits on it.** The row the
containment deserves is appended by the hop that lands it, from a note it admits.

## 5. Definition of Ready — RE-CHECKED, not re-scored

**The DoR is the `Backlog → Ready` bar and this ticket cleared it.** A ticket in development is not
re-admitted through a gate it already passed; what was checked is whether this hop could have made a
passed item fail. **Item 4 is strictly stronger** (six required verdicts, each with the build that
would pass it while being wrong). **Item 6 unchanged — no target, bar or level moved and
`plans/nfr-catalog.md` was not opened.** Item 3 stays `⚠️` — still not independent, still shares
`src/history-pane.nfr.test.ts` with `ABC-028`.

**Anti-smoothing check: this hop ADDED six required verdicts, MARKED two limits it could not close with
a row, and ROUTED one sentence back to Architect/Design. Smoothing removes obligations; this added
nine.**

## 6. What routes where

- **Engineer** — the containment, red-first against **`WLAUNDER` on both trees**, then `A6.1`'s two
  other RED builds, then `A6.2`'s three GREEN builds, then `A5.6`. **`## Test notes` 8's both-trees
  rule stands. `## Test notes` 11 says the docblock may be two sites, not one.**
- **Architect/Design** — one sentence in `ADR-0011`, in the sibling `claim` note and on the ticket at
  `## Routed to Architect/Design`. **Not a blocker, and I did not stop for it; the call is the
  Orchestrator's.** The two deferred items (clause 3's over-listing bound with its
  *first-licence-entry-after-`turn-loop.ts`* trigger and `EPIC-006` named the WRONG expiry; clause 1's
  depth-fixed specifier, checked **AT** `EPIC-006`) are **theirs, were not re-ruled, and the ticket now
  points at both** — `L1`'s trigger is deliberately aligned with the first of them.
- **Security/NFR** — `NFR-002`'s `MET`/`MISS` is still theirs. **`N8-LANE`'s delta for the containment
  is owed at the Engineer's hop, not here** (two sites, one file, zero production lines), and the lane
  **TOTAL is disputed and routed to `ABC-026`**. **No `N8-LANE` verdict is claimed at this hop.**
- **Orchestrator** — the board move (none), the `ADR-0011` sentence, and the sequencing of the Engineer
  hop against the live `ABC-028` work in the shared file.
