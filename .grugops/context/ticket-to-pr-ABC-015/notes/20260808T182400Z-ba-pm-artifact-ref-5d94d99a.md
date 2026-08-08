---
id: 20260808T182400Z-ba-pm-artifact-ref-5d94d99a
kind: artifact-ref
by: ba-pm
at: 2026-08-08T18:24:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - EPIC-002
  - RISK-005
  - NFR-007
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - plans/board.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-015-promote/claim.md
  - 20260808T182300Z-ba-pm-decision-a57fe151
supersedes: 
---

# Artifacts this subtask produced, by reference

Branch `grugops/ticket-to-pr-ABC-015`, cut from merged `main` at `f1743a3`. **Never `main`.**

| Artifact | What changed |
|---|---|
| `plans/tickets/ABC-015-glyph-mode-selection.md` | Frontmatter `backlog`/`Backlog` → `ready`/`Ready`. `## Scope`: the both-flags-true case ruled. `## Acceptance`: one criterion **added** (both flags), one **replaced** by two falsifiable ones, the lead-in amended, plus an in-place `CORRECTED 2026-08-08` block carrying the reasoning. `## Test notes`: one line naming the mutant the session criteria must kill. `## Size and priority rationale`: test count recounted, size `S` re-affirmed. `## Definition of Ready`: rewritten to record the promotion, the source-verified dependency, and that this is **not** the pull gate |
| `plans/board.md` | `ABC-015` row moved `Backlog` → `Ready`; heading `## Ready (WIP 3/8)` → `(WIP 4/8)`; a new `Ready` comment block with the full reasoning; the 2026-07-30 `Backlog` claim that `ABC-015..ABC-019` "meet the Definition of Ready in full" annotated as false for `ABC-015` and **left standing**, not deleted; one entry prepended to the `_Updated:` header |
| `plans/traceability.md` | **One row (`ABC-015`), two cells** — `Tests` (recounted, and the new tuple + session criteria named) and `Status` (`Backlog` → `Ready`, with the reasoning and a `Was:` chain). One entry prepended to the `_Updated:` header. **No other row touched; `ABC-014`'s row byte-identical** |
| `.grugops/context/ticket-to-pr-ABC-015/notes/` | Four notes hand-written in the schema's exact shape: this one, `…182100Z-ba-pm-observation-c4930049` (the source re-check and the wrong pre-check row), `…182200Z-ba-pm-decision-69e00126` (the two acceptance rulings and the ownership seam), `…182300Z-ba-pm-decision-a57fe151` (the promotion). **No `finding`, no derived `index.md` / `index.jsonl`** — the renderer does not exist here and nothing was hand-faked. The four `at` stamps are wall-clock, not narrative: three notes were drafted forward-dated and were **re-stamped down** to the times they were actually written, ids and cross-refs with them |
| `.grugops/queue/…/ticket-to-pr-ABC-015-promote/` | Moved `pending/` → `claimed/…/` → `done/…/` **by hand**, with a `claim.md` registry record naming the method and the absent substrate |

## What was deliberately NOT produced

- **No code and no test.** `git diff --stat -- src/` is **empty**. This subtask implements nothing.
- **No edit to `ABC-018`, `EPIC-006`, `EPIC-002`, any ADR, `plans/nfr-catalog.md` or `plans/metrics.md`.**
  The ownership seam was closed by ruling it to the ticket that already had the rule; nothing in the
  other documents had to change, so nothing in them was touched.
- **No new ticket, no split.** `S` is not `XL`; there is no `SPLIT_REQUIRED` here.
- **No PR.** This repo has no git remote and none was invented — `autonomy: "pr"` has always meant
  "branch + gate" here, as `AGENTS.md` records.
- **Nothing merged and nothing deployed.** The owner's standing merge authority is approval to merge
  work that PASSED a gate, and no gate has run on this ticket — there is nothing to gate yet.
