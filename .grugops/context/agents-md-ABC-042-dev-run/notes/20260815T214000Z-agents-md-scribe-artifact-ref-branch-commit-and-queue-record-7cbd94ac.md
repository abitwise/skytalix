---
id: 20260815T214000Z-agents-md-scribe-artifact-ref-branch-commit-and-queue-record-7cbd94ac
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-15T21:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q13
  - AGENTS.md
  - grugops/agents-md-ABC-042-dev-run
  - bf68578
supersedes: 
---

# Branch, commit, worktree and queue record

## The change

| | |
|---|---|
| branch | `grugops/agents-md-ABC-042-dev-run` |
| base | `grugops/quality-gate-ABC-042-regate` @ `d011df4` |
| `main` an ancestor? | **NO** — `git merge-base --is-ancestor main grugops/agents-md-ABC-042-dev-run` returns non-zero. `main` was not merged in |
| worktree | `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-scribe042` |
| the fix | commit **`bf68578`** — `AGENTS.md` alone, **4 insertions, 2 deletions, one hunk** |
| the notes | the commit that carries this file — `.grugops/context/` and `.grugops/queue/` only |

Check the delivered change with:

```
git diff bf68578~1 bf68578
```

Expected: `AGENTS.md` and nothing else.

## Queue record

`.grugops/queue/claimed/agents-md-ABC-042-dev-run/claim.md` — the now-running registry record, taken
by a bare `mkdir` in the **main worktree's** queue (the only location shared with the concurrent
Security/NFR hop), and committed here on the branch. The `pending → claimed → done` transition of
`.grugops/queue/pending/agents-md-ABC-042-dev-run.md` is **the Orchestrator's** and I did not make it.
The directory is untracked in the main worktree; nothing was committed on `main`.

## Not produced, on purpose

- **No `plans/board.md` row, no `plans/traceability.md` row** — both reserved to the Orchestrator on
  this ticket. The traceability row my role file would normally append for an `AGENTS.md` update is
  **owed, not waived**.
- **No gate stamp and no `kind: finding`.** `scripts/context-io.ts`, `scripts/claim.js` and
  `mcp__grugops__propose_note` are absent from this install and `context.human_admission` is `off`,
  so no `§14-gate#<id>` verdict is emittable. These four notes are `decision` / `observation` ×2 /
  `artifact-ref`, hand-authored per `agent-factory/contracts/context-note.md`. **No stamp was
  invented.** `index.md` / `index.jsonl` were not written either — the sanctioned renderer that
  produces them does not exist here, and hand-forging a derived index would be a fabricated render.
- **Nothing merged, nothing pushed, nothing deployed.** There is no remote on this repo in any case.
- **No file in the Security/NFR hop's scope touched.** My file set is `AGENTS.md`,
  `.grugops/context/agents-md-ABC-042-dev-run/`, `.grugops/queue/claimed/agents-md-ABC-042-dev-run/`.
