---
id: 20260813T121910Z-agents-md-scribe-artifact-ref-what-this-hop-wrote-and-what-it-refused-052b4c7b
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-13T12:19:10Z
verified_by:
confidence: high
refs:
  - agents-md-rules-2026-08-13
  - AGENTS.md
  - plans/traceability.md
  - delivery-audit-2026-08-12
  - EPIC-006
supersedes:
---

# Artifact: `AGENTS.md` (+24 lines). Everything this hop declined, with reasons.

**Written:** `AGENTS.md` — one new H2, `## Process rules (this project)`, between `## Delivery` and
`## Branching model`. 227 → 251 lines; 12,818 → 14,519 bytes (44% of the 32 KiB cap). Plus these four
notes. **Nothing else in the repository was modified** — verified with `git status`.

## Refused, deliberately

- **No `UNKNOWN - verify` slot was filled.** Six remain (`Dev / run`, Acceptance, single-file
  Typecheck, Docs build, Clean/reset, E2E). Every one is still genuinely unknown, and the most
  tempting — `Dev / run`, which the audit's proposal 1 is *about* — cannot be answered until a CLI
  entry point exists under `EPIC-006`. A guessed command reads as truth to every agent downstream.
- **§ Stack and § Test unchanged.** Today's `vitest.config.ts` made nothing in them false; the
  separate `observation` note records the check statement by statement. Editing them to look
  responsive to a change that did not falsify them would have been motion, not maintenance.
- **`vitest.config.ts`'s isolation warning NOT copied into `AGENTS.md`.** It is already written at the
  point of use, where the engineer about to disarm the lane will see it. Duplicating it here creates a
  second copy to drift.
- **The audit's other three proposals left out.** The owner adopted **6B then A** — proposals 3 and 2.
  Proposals **1** (`EPIC-006` entry-point slice), **4** (metrics staleness bound) and **5** (owners and
  dates on open debts) are equally real and two of them are process-shaped, so bundling them in would
  have been easy and would have put unadopted rules in the substrate under the owner's name.
- **No evidence numbers restated in `AGENTS.md`** beyond the two control thresholds. The 9/25 rework
  rate, the 300× shift, the per-ticket gap counts stay in `.grugops/context/audit-delivery/notes/`.
- **No ID allocated, no ticket written, no `plans/` file touched, nothing under `src/`.** Two BA/PM
  lanes hold `ABC-041`–`ABC-049` and `ABC-050`+ concurrently.

## ONE THING THE ORCHESTRATOR MUST DECIDE — a duty I could not discharge

`agent-factory/roles/agents-md-scribe.md` § "Trace updates" tells this role to **append to
`plans/traceability.md`** recording that the substrate was updated. **I did not, and this is a
flagged refusal rather than an oversight.** My subtask brief scopes me to `AGENTS.md` plus these
notes and explicitly forbids writing `plans/`; the task-specific boundary is the narrower instruction
and it wins. Two further reasons it is the right call to defer rather than quietly do it: BA/PM owns
that file, and the delivery audit measured it as already carrying **32 `ABC-` rows for 30 tickets**
(duplicates at lines 201/203 and 202/204) plus ~26 stacked `_Updated:` headers — a file mid-repair by
another owner is the worst place for a concurrent unrequested append.

**So: if a traceability row is owed for this substrate change, it is unwritten and owned by whoever
holds `plans/traceability.md`.** Recorded here so it is a decision on the record, not a silent gap.
