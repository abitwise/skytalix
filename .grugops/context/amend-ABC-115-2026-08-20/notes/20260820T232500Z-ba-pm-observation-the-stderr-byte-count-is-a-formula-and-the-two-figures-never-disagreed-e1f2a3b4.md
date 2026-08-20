---
id: 20260820T232500Z-ba-pm-observation-the-stderr-byte-count-is-a-formula-and-the-two-figures-never-disagreed-e1f2a3b4
kind: observation
by: ba-pm
at: 2026-08-20T23:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A1
  - src/cli.ts
supersedes:
---

# `A1`'s BYTE FIGURE IS A FUNCTION OF THE CHECKOUT PATH — AND 1196 vs 1282 WAS NEVER A DISAGREEMENT

Architect/Design reported the stack at **1282 bytes** against the cut's **1196**, and called it
path-length dependent. **I measured how dependent, because "it varies" is not something a criterion
can be written against.**

## The measurement

Same delivered build, same command
(`set -o pipefail; node <path>/src/cli.ts --ascii </dev/null | head -2`), four checkout paths:

| absolute path length (chars) | stderr bytes | occurrences of the path in the stack |
|---|---|---|
| 68 (the repo checkout) | **1118** | 2 |
| 142 | **1266** | 2 |
| 152 | **1286** | 2 |
| 156 (this worktree) | **1294** | 2 |

`+10 characters -> +20 bytes`, exactly. The fit is exact on all four points:

**`bytes = 982 + 2 x (characters in the absolute checkout path)`**

## What that dissolves

- **1196 (the cut)** = a 107-character path. The cut ran its bisect in throwaway worktrees.
- **1282 (the design hop)** = a 150-character path. Their sibling figures 1262 and 1303 are two other
  harness shapes at their own paths.
- **Neither hop was wrong and neither mis-measured.** There is nothing to reconcile: three hops
  measured one quantity at three path lengths, and the page recorded the result as if it were a
  constant. **The defect was in the criterion, not in anyone's arithmetic.**

**Also measured, so the model is not over-fitted to one invocation shape:** at the repo checkout,
relative invocation, absolute invocation and `set -o pipefail` on or off all read **1118** bytes /
25 lines identically; `npm run chess -- --ascii` reads **1131** (npm adds 13 bytes of its own). Line
count is **25 in every shape** and is path-independent.

## The consequence written into `A1`

`A1`'s italic base is now **a formula plus a prohibition**: **no test may assert a byte count, and no
hop may quote one from the page.** The RED watch is the path-independent shape that was already
there — stderr non-empty, carrying `Unhandled 'error' event`, `Error: write EPIPE` and `/^\s+at /`
frames, and naming the checkout path. **Those assertions are the ones that survive a `git worktree`.**

`A1`'s binding assertions were correct as written and are unchanged. Only the italic base moved.
