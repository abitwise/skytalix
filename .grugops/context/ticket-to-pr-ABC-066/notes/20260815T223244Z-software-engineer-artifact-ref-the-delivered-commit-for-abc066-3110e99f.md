---
id: 20260815T223244Z-software-engineer-artifact-ref-the-delivered-commit-for-abc066-3110e99f
kind: artifact-ref
by: software-engineer
at: 2026-08-15T22:32:44Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - src/cli.ts
  - src/cli.test.ts
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
supersedes: 
---

# `ABC-066` — the delivered commit, and where `ABC-065`'s hop finds the shared helpers

**Branch:** `grugops/ticket-to-pr-ABC-066`, off `main` @ **`4e9ed1d`**.
**Delivered commit:** **`ab0864e`** — `fix(cli): grug put the -- in the usage line, so the printed
command runs`.
**Not merged, not pushed, not deployed.** This repository has no git remote, so `autonomy: "pr"`
means "branch + gate" here; the merge key is the Orchestrator's on the owner's standing grant.

## `A6`, as `ABC-060`'s ruling words it

```
$ git diff --name-only ab0864e~1 ab0864e
src/cli.test.ts
src/cli.ts

$ git diff --numstat ab0864e~1 ab0864e
92	0	src/cli.test.ts
7	2	src/cli.ts
```

| `A6` clause | measured |
|---|---|
| exactly `src/cli.ts` and `src/cli.test.ts` | **2 paths** ✅ |
| exactly 1 production line changed | `src/cli.ts` **`7 2` raw → `1 1` comments aside** ✅ (6 comment lines added, 1 removed; 1 code line added, 1 removed) |
| 0 new files | **0** ✅ |
| `spawned` still `10` | **10** ✅ |
| suite green, skip 0 | **857/857 on 30 files, skip 0** ✅ |

**The queue claim and these context notes are in a SEPARATE commit on the same branch, deliberately.**
`ABC-060`'s ruling — which `A6` cites — makes the ticket page, ADRs and everything under `.grugops/`
**process artifacts of the ticket's refinement, not part of what it delivers**. Folding them into
`ab0864e` would have made `git diff --name-only ab0864e~1 ab0864e` read 7 paths and breached `A6` by
its own letter. **A reader who runs the BRANCH diff instead will see all 7 paths, and that is the
exact confusion `ABC-060` exists to name; the delivered-commit reading is the one `A6` specifies.**

## The shared extraction helpers — `ABC-065`'s guard hop reuses these, it does not write a second set

**File: `src/cli.test.ts`. Location: module scope, immediately above the first `describe`** (after
`invocationsAdvertisedBy`, before `describe("ABC-042 — a human can run it")`).

| name | signature |
|---|---|
| `SEPARATOR_FORM` | `string` — `"npm run chess -- "`, the file's ONLY spelling of it |
| `usageLineOf` | `(stderr: string) => string` |
| `advertisedTextOf` | `(usageLine: string) => string` |
| `invocationsAdvertisedBy` | `(advertised: string) => readonly (readonly string[])[]` |

They are module-scope rather than inside this ticket's `describe` **so that `ABC-065`'s block can
call them without editing this one** — the fence both ticket pages state for whichever ticket writes
second. `ABC-065` reads its option list out of `AGENTS.md` rather than off stderr, so it will use
`SEPARATOR_FORM`, `advertisedTextOf` and `invocationsAdvertisedBy` and may not need `usageLineOf`;
all four are available and none is private to this block.

**This discharges the parent note's `G3`.** `ABC-066` wrote the first extraction helper because
`ABC-062` has not merged, exactly as `G3` ruled; the ticket page's test note 3 (*"if `ABC-062` has
merged, its extraction helper exists; use it"*) was NOT followed as written and could not have been.

## The new guard block

`src/cli.test.ts`, last `describe` in the file, **separately named** per the two-way fence:

```
describe("ABC-066 — the usage line is a command the user can actually run")
  it("A1/A2/A3 — every refusal advertises the separator, and all it advertises resolves")
```

One `it`, as `## Scope` bounds it. It edits no `ABC-042` block and adds no child process.

## Board and trace

**Not written by this hop, by instruction:** `plans/board.md` and `plans/traceability.md` are the
Orchestrator's on this task. The `In Development → In Review` move that
`agent-factory/roles/software-engineer.md` normally gives this role, and the trace row for
`ab0864e`, are **owed and unwritten** — named here so they are not silently lost.
