---
id: 20260815T110727Z-uat-planner-observation-the-tree-under-test-is-byte-identical-to-main-and-the-check-that-says-so-8e4f1770
kind: observation
by: uat-planner
at: 2026-08-15T11:07:27Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - package.json
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# The tree under test IS the delivered product — the identity check, and the machine that ran it

**This note exists so the run's results cannot later be dismissed as "you tested your own branch."**
The run happened on branch `grugops/uat-ABC-042-pack`, and the check below is what makes that branch
a legitimate stand-in for `main`.

## The identity check, run before any scenario

```
$ git diff main -- src package.json
$ echo $?
0
```

**Empty output.** Every file under `src/` and `package.json` on the branch that ran the scenarios is
byte-identical to `main`. The check was run first, before any command was executed, and it is
recorded here because a UAT that runs a different build than the one that shipped is worthless.

Confirmed a second way, by object hash rather than by diff — a diff can be fooled by a filter, an
object hash cannot:

| path | branch `grugops/uat-ABC-042-pack` | `main` |
|---|---|---|
| `src/` (tree) | `2b35f71cb939de02fc30f41821b2847250dc51ee` | `2b35f71cb939de02fc30f41821b2847250dc51ee` |
| `package.json` (blob) | `81d3a85ae064041428c3d8ad3720f42edb9a7071` | `81d3a85ae064041428c3d8ad3720f42edb9a7071` |

**Identical on both rows.**

## The commits

| what | value |
|---|---|
| `main` at the time of the run | `eebbaa3d08ab539f33a13e34c0a9fc1dbefd1661` |
| the `ABC-042` merge named in the subtask brief | `dbaf972` — *"feat(ABC-042): grug turn key owner give, and grug write down what the scale say"* |
| is `dbaf972` an ancestor of `main`? | **YES** — `git merge-base --is-ancestor dbaf972 main` returned 0 |
| branch the run happened on | `grugops/uat-ABC-042-pack`, cut **by name** from `grugops/uat-ABC-042` at its tip `0db45a91cf79103f738903fab78e3786ef1fdfa7` |

**The branch's only difference from `main` is queue records and this notes folder.** No production
file, no test file and no configuration file was created, edited or deleted by this hop.

## The machine and the toolchain

Recorded because the timing scenario (UAT-13) is a wall-clock reading, and a wall-clock reading
without its machine is not a measurement.

| item | value |
|---|---|
| machine | Apple M3, 8 cores |
| OS | Darwin 25.5.0 (macOS 26.5.2), arm64 |
| Node | v24.12.0 |
| npm | 11.7.0 |
| working copy | a private `git worktree`, so the shared worktree's `HEAD` was never moved |
| setup performed | `npm install` — completed, and **left `package-lock.json` unmodified** (checked: `git status` showed no change to it) |

`package.json` declares `engines.node >= 22`; the run used 24.12.0, which satisfies it. **This was not
run on Node 22**, so nothing here says anything about the oldest supported Node version — an untested
edge, named rather than assumed away.

## Two things the run did NOT do

- **It did not run the automated test suite.** Whether the tests back these scenarios is QE/E2E's
  subtask, not this one. This hop exercised the *product*, through the command a person types.
- **It did not touch `plans/`, `memory-bank/`, `AGENTS.md` or anything under `src/`.** Those belong to
  the Orchestrator at close.
