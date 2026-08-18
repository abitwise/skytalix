---
id: 20260819T161000Z-agents-md-scribe-artifact-ref-branch-and-files-d7e0f4a9
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-19T16:10:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - ABC-037
supersedes:
---

# Branch, commits and the exact file list

- **Branch:** `grugops/agents-md-expose-gc`, off `main` @ `298bb95`.
- **Commit:** `525aad3` — `docs(agents): grug put NODE_OPTIONS=--expose-gc in the INPUT_DEEP command,
  and grug write the counts down so short run get caught`.

## Files changed by this hop

```
AGENTS.md                                        +22 / -21   (one slot, lines 94-115)
.grugops/context/agents-md-expose-gc-2026-08-19/notes/*      3 notes, new
.grugops/queue/pending/agents-md-expose-gc.md -> .grugops/queue/done/
```

**Nothing else.** No file under `src/`, none under `plans/`, none under `memory-bank/`, no board
file, no config. `agent-factory/` read only, never written.

## The one line that is the point of the hop

`AGENTS.md:94`, before and after:

```
- INPUT_DEEP=1 npx vitest run src/line-input.test.ts
+ INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts
```

## Claim

`.grugops/queue/claimed/agents-md-expose-gc/` taken by bare `mkdir` per Workflow 17 and the
`AGENTS.md` no-`finding` block. No stamp invented; these notes are hand-authored `observation` /
`decision` / `artifact-ref` per `agent-factory/contracts/context-note.md`.

## Size

`AGENTS.md` **29,749 → 29,838 bytes** (+89). Cap 32,768, silent tail-first truncation.
**2,930 bytes of headroom.** Follow-on ticket `cut-agents-md-cap-2026-08-19` owns the compaction;
this hop deliberately did not begin it.
