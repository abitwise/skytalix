---
task: abc028-owed-2026-08-12
subtask: security-nfr-ABC-028-scoped
role: security-nfr
workflow: agent-factory/workflows/15-security-audit.md
ref: .grugops/context/security-nfr-ABC-028-scoped/
parent_ref: .grugops/context/ticket-to-pr-ABC-028-t493/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T19:15:00Z
branch: grugops/abc028-owed-2026-08-12
worktree: (main tree, read-only — a QE hop runs in parallel here)
---

# Subtask: the Security/NFR look `ABC-028` merged owing — SCOPED TO ITS OWN COMMITS, NEVER THE BRANCH

`ABC-028` is **`Done` and MERGED** (fast-forward `95086ae` → `a92d0fa` → `0ee148e`). It merged
carrying two named debts; this is the second. **The Orchestrator's own words on the board:** a
Security/NFR look on `ABC-028` **scoped to its own commits and never the branch** is owed —
*"measured: branch scope fires 313 times on `src/turn-loop.ts`, this ticket's own scope does not fire
at all."*

**Why the scope line matters more than the verdict.** `ABC-028` merged in one fast-forward with
`ABC-019` (which added `src/turn-loop.ts`, a real production runtime module) and `ABC-029`. A
branch-scoped review would attribute 313 trigger hits from **another ticket's production code** to a
ticket that shipped **zero production lines**. That is not a stricter review; it is a **wrong** one,
and it would put a false Security/NFR record on this ticket forever. **Scope to `ABC-028`'s own
commits and say in your note exactly which commits those are and how you identified them.**

## Read first (Workflow 16 — read before you act)

- `parent_ref:` in full — the Engineer's notes from the last hop.
- `plans/tickets/ABC-028-history-pane-unreached-input-classes.md` § **`Security / NFR triggers`**
  (~line 1814). It is the contract you are gating against, and it is **falsifiable on purpose**:
  > *"Security: NONE, and it is not pre-waived. … **Firing threshold**: any production line at all, or
  > any new file. Either means the ticket has changed shape and Security/NFR is owed a look."*
  Also read `NFR-008` / `N8-LANE` and `NFR-002` in that same section, and `plans/nfr-catalog.md`.
- Prior Security/NFR notes on neighbouring tickets in `.grugops/context/security-nfr-ABC-0*/` — the
  house style for a scoped, measured verdict.

## The three questions, in order

1. **Which commits are `ABC-028`'s own?** The board says **three**; the candidate set the Orchestrator
   sees touching `src/` is **four** (`8de988d`, `26e452f`, `593ba70`, `1ae7b8f`). **Measure it; do not
   inherit either number.** If the board's "three" is wrong, that is a finding — say so plainly.
2. **Does the ticket's own firing threshold fire under that scope?** Production lines added: claimed
   **zero**. New files: claimed **zero**. `src/history-pane.ts` md5 is claimed unmoved at
   `c4653c4c…` with an **empty** diff. **Verify each at source.** A measured non-trigger is a real
   result and is worth writing down precisely — it is what makes this ticket's contract falsifiable
   rather than a shrug. A trigger that *does* fire is a finding on a merged ticket.
3. **NFR.** `NFR-002` is claimed untouched (zero production runtime importers of the pane).
   `N8-LANE` — note carefully: the **lane total re-measurement is `ABC-026`'s**, and it fell due at
   this merge; it is **not yours to run and not yours to absorb**. What *is* yours: state whether
   `ABC-028`'s own commits move the lane at all, and re-home the total to `ABC-026` explicitly so it
   cannot be quietly counted as discharged. `ADR-0008`'s ratified clauses (`npm test` ≤ 3 s wall,
   ≤ 13 s CPU with `PERFT_DEEP` unset) are cheap to re-run on the tip if you want a live number.

Known risks already accepted and recorded — **do not re-litigate them, and do not re-home them onto
this ticket**: `S-1` (fd-3 forgeable, owner Architect/Design, `EPIC-006`), `S-2` (test-integrity exit
2, owner a **human**, because an agent may not author the registry), `R-A` (C1/CSI survives `sanitize`
in `unicode` mode — L2, outside the configured `asvs_level: L1`), `RISK-ABC028-01a`/`-02`.

## Constraints — the tree is SHARED and you are the read-only half

- A QE re-gate runs **in parallel in this same working tree**. Treat `src/` as **read-only**. If you
  need to build anything, make your own worktree and remove it after.
- **Do NOT `git commit`**, and do not run `git checkout`/`git stash` here. The Orchestrator commits.
- **Write ONLY under `.grugops/context/security-nfr-ABC-028-scoped/`** plus your queue transitions.
  Do **not** edit `plans/board.md`, `plans/traceability.md`, or the ticket file.

## Claim + publish (Workflows 17 and 16)

Claim per Workflow 17 by hand (`pending/` → `claimed/<task>/` → `done/`; no `scripts/claim.js` in this
project) and publish typed notes into `ref:` using the neighbouring folders' exact filename
convention. **Kinds honestly**: `finding` only with a real stamp; otherwise `claim` / `observation`
with `confidence: UNKNOWN - verify`. Five false statements have already been caught inside published
prose on this ticket. Do not add a sixth.

## Done condition

A scoped verdict (`PASS` / `PASS_WITH_RISKS` / `FAIL`) that names its commit scope and how it was
derived, verifies the zero-production-line claim at source rather than quoting it, keeps `ABC-026`'s
lane total visibly un-discharged, and moves the subtask to `done/`.
