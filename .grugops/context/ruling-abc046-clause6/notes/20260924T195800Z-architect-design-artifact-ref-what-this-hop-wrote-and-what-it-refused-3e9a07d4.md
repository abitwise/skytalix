---
id: 20260924T195800Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-3e9a07d4
kind: artifact-ref
by: architect-design
at: 2026-09-24T19:58:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ADR-0021
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/traceability.md
  - .grugops/queue/done/ruling-abc046-clause6.md
supersedes:
---

# What this hop wrote, and what it refused

**NOT A STAMP.** This note is a pointer only. It is not a UAT spec, so it carries no `sha`,
`gate_run` or `content_hash`. A note cannot name the commit that contains it, so the commit sha is
in the commit and in the report to the Orchestrator.

- **Branch:** `grugops/ruling-abc046-clause6`, off `grugops/wave-2026-09-24` @ `d68c10e`, in an
  isolated worktree. **Unmerged.**
- **Claim (Workflow 17, by hand):**
  - `mkdir .grugops/queue/claimed/ruling-abc046-clause6` (atomic);
  - `claim.md` recorded `by: architect-design`, `at: 2026-09-24T19:44:47Z`;
  - the subtask moved pending → claimed → `done/ruling-abc046-clause6.md`, with the record kept as
    `done/ruling-abc046-clause6.claim.md`;
  - the `at` is the real clock, and it is earlier than the subtask's `enqueued_at: 20:00:00Z`. That
    stamp was written ahead of time and was not changed here.

## Written

| file | change |
|---|---|
| `.grugops/context/ruling-abc046-clause6/notes/` | `observation` (the probe), `decision` (the ruling and the `A8` list), this `artifact-ref`, and the raw files `raw-probe-harness.mjs.txt`, `raw-probe-summary.json.txt`, `raw-probe-console.txt` |
| `plans/tickets/ABC-046-quit-and-new.md` | `## Ruling (clause 6) 2026-09-24` appended at the end; nothing above it touched, frontmatter untouched |
| `plans/traceability.md` | one `_Updated:` line under the title; one row `ABC-046 (clause-6 ruling)` appended at the end; no row touched in place |
| `.grugops/queue/` | the subtask record moved to `done/`, plus its claim record |

## Refused

1. **Any file under `src/`.** The probe ran in the session scratchpad. `git status --short -- src`
   was empty after it ran and is empty at commit.
2. **`memory-bank/50-decisions/ADR-0021-…md`.** Clause 6 stands, so there is nothing to supersede.
   The ADR forbids in-place edits.
3. **`plans/board.md` and `AGENTS.md`**, as the fence requires. The column move and the scheduling
   of the re-hop and re-QE are the Orchestrator's.
4. **`plans/nfr-catalog.md`.** No bar moves and no row is seeded, so there is nothing to write.
5. **Correcting D1/D2 or `G4-INFO`.** Those are the Engineer's (`ABC-114`: the finder does not
   author the replacement). The ruling names what must be true, not the wording.
6. **A `finding`.** It cannot be admitted on this install (`human_admission: off`).
