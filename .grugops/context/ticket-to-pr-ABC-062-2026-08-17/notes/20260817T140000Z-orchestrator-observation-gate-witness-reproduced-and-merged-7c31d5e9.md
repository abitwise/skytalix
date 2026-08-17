---
id: 20260817T140000Z-orchestrator-observation-gate-witness-reproduced-and-merged-7c31d5e9
kind: observation
by: orchestrator
at: 2026-08-17T14:00:00Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md
  - src/cli.test.ts
  - src/cli-options.ts
supersedes:
---

# `ABC-062` gate — the witness reproduced in three conditions, merged @ `56a48bd`

Gate run by me on the branch tip **before** the merge and on `main` **after**, per `AGENTS.md`
§ "Safety rules". **Both green: 864/864 on 30 files (863 before), skip 0, `No findings.`,
lint/typecheck/build exit 0.**

## The witness — I ran it, I did not relay it

Throwaway detached worktree at `/tmp/abc062-verify`, outside the repository, removed afterwards.
Mutant: `next ?? token` → `next as string` at `src/cli-options.ts:130`.

| condition | measured |
|---|---|
| mutant, guard **removed** | **863/863 GREEN on 30 files** — the defect ships silently |
| mutant, guard **present** | **RED, 1 failed \| 863 passed**, at `src/cli.test.ts:1198`, `expected [ undefined ] to deeply equal [ '--colour' ]` |
| **unmutated**, guard present | **864/864 GREEN** |

**The third row is the one an engineer's own report cannot give you**, and it is why I ran the set
rather than accepting two conditions: it shows the guard raises no false positive. Rows one and two
together show the new assertion is the witness and not a bystander. The engineer reported rows one
and two and its figures reproduce exactly.

## `A6`, verified on the delivery commit

`git diff --name-only edf85f6~1 edf85f6` → **`src/cli.test.ts` alone**; `--numstat` → **`42 0`**.
**Additive only, zero deletions**, so every fenced merged row — `:315`, `:325`, `:410`, `:545`,
`:750` and `ABC-066`'s `:949-984` — is byte-identical **by construction rather than by inspection**.
That is a stronger proof than the `cmp` extraction `ABC-061` needed, and it came free from how the
engineer chose to place the block. `expect(spawned).toBe(10)` still reads `10` at `:933`.
Process artifacts sit in a **second** commit (`163119f`) so the delivery diff stays exact — a
deliberate choice by the engineer and the right one.

## What I checked that nobody asked me to

**That the struck criteria were not quietly re-spelled.** The new block at `:1171-1212` reads no
`CHILDREN` entry, no captured child output and no usage line — two pure `resolveOptions` calls and
seven assertions, in process. `A3`/`A4`/`A5` are absent, not renamed.

## `In Security/NFR` skipped, and why that is a decision not an omission

Lean mode permits skipping the column unless a trigger fires. Against `AGENTS.md`'s trigger list:
**0 production lines, 0 new files under `src/`, 0 new child processes, no manifest touch, no
network, no auth/payment/personal-data surface.** Nothing fires. The ticket's own
§ "Security / NFR triggers" reaches the same reading.

**The engineer did NOT run the `N8-LANE` n ≥ 7 paired harness and did NOT invent a figure for it.**
It read the row's own scope clause (`plans/nfr-catalog.md:894`, "every file the branch adds under
`src/`") as charging zero because the branch adds no such file, and reported the raw 13–17 ms against
15 ms unmodified as context, not as a verdict. **Recording a refusal to fabricate a measurement as a
good outcome**, and flagging that the reading itself is Security/NFR's to confirm if that column is
ever opened on this ticket.

## Two drifts the engineer reported rather than worked around

- My queue brief's fence said the near-miss family is at `:410`. **`:410` is the `A6(iii)` table of
  four end-to-end children; the near-miss family is at `:554`.** My error, in my own brief. The
  engineer did the right thing and touched neither block.
- `:315`, `:325`, `:750` are mid-block anchors (comment lines and a closing `});`), not row starts.
  Stable as anchors; noted so no later reader thinks the fence was misapplied.

## Housekeeping left undone, deliberately

`git worktree list` shows **four stale worktrees from an earlier session** under
`/private/tmp/claude-501/…/9c5c9eeb-…/scratchpad/` (`wt-abc065-guard`, `wt-abc065-qe`,
`wt-abc066-qe`, `wt-secnfr`). Their branches are merged. `git worktree prune` does NOT clear them
because the directories still exist on disk. **Left alone: they belong to another session and are
outside this ticket's blast radius**, and `AGENTS.md` forbids destructive commands. Owner's call.

## Where this stops

**`Ready for UAT`, and no further.** `context.human_admission` is `off`, no `finding` is admissible,
and the `In UAT` exit is the owner's word. **He has not been asked in this session and has said
nothing. Nothing here is a waiver and nothing here is a signature.**
