---
id: 20260819T154000Z-agents-md-scribe-artifact-ref-branch-commits-and-the-amended-block-833527df
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-19T15:40:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - AGENTS.md
supersedes:
---

# Branch, commits, and where the amended block sits

- **Branch:** `grugops/agents-md-input-deep`
- **Base:** `grugops/quality-gate-ABC-037-qe-2026-08-19` @ `daaf3b6` (QE's tip, the six/seven-note
  publish commit). **Unmerged, deliberately** — humans hold merge; the Orchestrator routes it.
- **Commits:**
  - `ff5657c` `chore(queue): grug take the AGENTS.md correction claim by hand`
  - `8466bef` `docs(agents-md): grug fix the heapUsed trap - the mechanism wrong and the guard do exist` — `AGENTS.md` +13/−4

- **Changed region:** `AGENTS.md` § `Commands` → `### Test`, the `Input-seam deep lane (opt-in slow
  suite, ABC-037)` bullet's HTML comment. The bullet's command line is **byte-identical** to the
  base; only the comment body changed, and only its final third.

- **Claim:** `.grugops/queue/claimed/agents-md-input-deep/` — taken by a bare `mkdir` (the atomic
  act) per `AGENTS.md` § Role / workflow files, since `scripts/claim.js` is absent on this install.
  **The subtask file was enqueued on `cfad1b7`, which is NOT an ancestor of this branch's base** —
  the base was cut before the enqueue — so the file was restored from that commit into `claimed/`
  rather than renamed out of `pending/`. Recorded here so the missing `pending/` → `claimed/`
  rename is not later read as a skipped step.

- **Not produced:** no `index.md` / `index.jsonl` (`scripts/context-io.ts` is absent; notes under
  `notes/` are the source of truth and stand alone). No `finding` note — none is admissible on this
  install. No `plans/traceability.md` row — fenced out of `plans/`; see the decision note.
