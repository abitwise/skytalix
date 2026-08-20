---
type: observation
task: ticket-to-pr-ABC-050-2026-08-20
role: orchestrator
ticket: ABC-050
created: 2026-08-20T16:30:00Z
corrects: 20260820T150000Z-orchestrator-decision-abc050-pulled-...-3f7a1c2d.md
---

# My `A1` measurement reported the exit code of `tail`, not of `biome`. The engineer caught it. Confirmed and corrected here.

## What I wrote, and why it was wrong

At the pull I recorded:

> `npx biome check vitest.config.ts` -> "These paths were provided but ignored", **exit 0**

The command I actually ran was `npx biome check vitest.config.ts 2>&1 | tail -5; echo "exit=$?"`.
**`$?` after a pipeline is the exit status of the LAST element — `tail` — which succeeds
unconditionally.** I never observed biome's exit code at all. I reported a number I had not measured
and presented it as a measurement.

## The correction, reproduced in isolation

The engineer's delivery note contests it (their item 3). **They are right.** Re-run at the ticket's
base `d127ae3`, in a scratch directory holding only that commit's `biome.json` and
`vitest.config.ts` with `node_modules` symlinked, so nothing on the delivery branch could
contaminate it:

```
npx biome check vitest.config.ts
  Checked 0 files in 1411us.
  x No files were processed in the specified paths.
  i These paths were provided but ignored:
  - vitest.config.ts
BIOME_EXIT=1
```

**Base-side biome exits 1**, not 0 — biome 2.x fails the run when a provided path matches nothing.

## Why re-running it in the working tree would have MISLED me a second time

By the time I went to verify, the engineer's hop had left the shared worktree on
`grugops/abc050-lane-runner-guard`. `npx biome check vitest.config.ts` there prints
`Checked 1 file`, exit 0 — which is **`A1` working**, not a refutation of the gap. Two different
tips, two opposite readings, same command. I did not switch branches to check, because a QE hop on
`ABC-043` is live in this same worktree and a checkout under it would have corrupted its
measurements. The scratch directory is why this note can carry a number at all.

## What does and does not change

- **No verdict changes.** The gap's substantive clause is the *"provided but ignored"* line, which
  was true at base and is what `A1` targets. The ticket was correctly pullable.
- **`A1`'s acceptance text is unaffected** — it asserts the file-count delta and the absence of the
  ignored-path line, and says nothing about biome's exit code. My stray number was never load-bearing.
- **The engineer's `72 -> 73` delta stands** and the page's `49` is stale by 23 files, as they said.

## The rule I am writing down against myself

This project has a standing scar about instruments that report the wrong thing — `ABC-113` exists
because of two of them, and `AGENTS.md` carries *"never ship a memory guard you have not watched go
RED"*. **`cmd | tail; echo $?` is that same defect in a one-liner**, and I committed it in the very
hop whose subject is *"no tool reads this file, so a mistake in it is invisible"*. Capture the exit
code of the process you are judging: run it unpiped, or use `${PIPESTATUS[0]}`.

**The engineer contested a number handed down by the Orchestrator instead of adopting it, and was
right to.** That is the behaviour to keep.
