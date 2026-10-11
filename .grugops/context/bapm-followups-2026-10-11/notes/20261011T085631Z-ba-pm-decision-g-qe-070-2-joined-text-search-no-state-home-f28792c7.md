---
id: 20261011T085631Z-ba-pm-decision-g-qe-070-2-joined-text-search-no-state-home-f28792c7
kind: decision
by: ba-pm
at: 2026-10-11T08:56:31Z
verified_by:
confidence: high
refs:
  - G-QE-070-2
  - ABC-070
  - ABC-145
  - agent-factory/checklists/definition-of-ready.md
  - agent-factory/roles/ba-pm.md
  - 20261011T084951Z-qe-e2e-observation-abc070-a1-grep-blind-to-wrap-7fa9a4d1
supersedes:
---

# Item 4: `G-QE-070-2`. A text criterion on wrapped prose is read on joined text. No guidance file exists in the state plane, so no edit was made

This note is hand-authored and unsealed.

## The rule (BA/PM, from this hop on)
**A criterion that counts or forbids a phrase in prose reads it on joined text:** newlines folded to a space, runs of whitespace collapsed, and `**` and backticks stripped. It is never a line `grep -c`. Markdown on this repo is hard-wrapped near 100 columns, so a phrase can split across two lines and a line `grep` reads 0 for it. **Name the search in the criterion**, as `ABC-145` `A5` does, and give the "before" count from the same search. If counting by statements is clearer, count them by reading and say so.

- **Evidence:** `ABC-070` `A1`'s "one `grep`" read 1, not 2, at `c0fedf7c~1`, because "must not / be pulled" wraps across `:132–133`. QE's joined-text reading gives 2 → 0 (`…7fa9a4d1`).

## Where it is recorded, and why no file was edited
- **No state-plane home exists for BA/PM criteria guidance.** I searched `memory-bank/` (`40-contributing.md`, `70-runbook.md`, `20-product.md` and `00-index.md` have no criteria section) and `plans/` (`nfr-catalog.md`, `metrics.md`, `board.md` and `traceability.md` are not guidance).
- The only BA/PM criteria guidance is in the **kit**: `agent-factory/checklists/definition-of-ready.md` and `agent-factory/roles/ba-pm.md` § Responsibilities 3. The kit is **read-only** from this repo.
- `AGENTS.md` is fenced for this subtask.
- **So this note is the record, and the edit was skipped**, as the subtask allows.
- **Applied once already:** `ABC-145` `A5`.
- **Optional escalation, not done here:** a kit change that adds "a text criterion names its search; on wrapped prose, joined text" to the DoR checklist item for testable acceptance. It is the kit maintainer's call (Factory Coach or the owner), not a ticket.
