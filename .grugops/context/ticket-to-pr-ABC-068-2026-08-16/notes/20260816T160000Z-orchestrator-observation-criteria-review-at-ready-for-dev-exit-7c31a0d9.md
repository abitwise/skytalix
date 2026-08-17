---
id: 20260816T160000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-7c31a0d9
kind: observation
by: orchestrator
at: 2026-08-16T16:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
  - src/cli.test.ts
  - AGENTS.md
supersedes: 
---

# `ABC-068` criteria re-read against the built tree — the `Ready for Dev` exit (project process rule 1)

Not a Definition-of-Ready re-run. DoR asks whether the criteria are well formed; this asks whether
they still match what EXISTS. Read at `f566304`, working tree clean. **Five gaps. None blocks the
pull. Two would have caused the engineer to report a false "today" number.**

## `G-A` — every line number on the page has drifted, and one by 25 lines

The page was cut before `ABC-067`/`ABC-071` landed in `82133dd`, which grew the `ABC-065` block.

| the page says | the tree at `f566304` |
|---|---|
| helper block `:160`–`:214` | `:161`–`:215` |
| `usageLineOf` `:180` | `:180` — correct |
| `advertisedTextOf` `:193` | `:193` — correct |
| the count comment `:165` | `:165` — correct |
| call site 1 (`ABC-066`) `:867` | `:867` — correct |
| **call site 2 (`ABC-065`) `:923`** | **`:948`** |

`:923` today is a line INSIDE `devRunSlotIn`'s comment, part of `ABC-067`'s merged repair. **An
engineer who edits `:923` on the page's authority edits a merged guard's comment and breaches this
ticket's own `## Out of scope`.** Locate both call sites by `advertisedTextOf(`, never by number.

## `G-B` — `A2`'s "(Today: 0 of 3)" is FALSE on the built tree; it is 1 of 3

`src/cli.test.ts:937`–`943` — call site 2, inside `ABC-065`'s `A1` — already states the precondition
AND the failure mode in five lines: that `indexOf` returns `-1` when the separator is absent, that
the helper therefore "returns a corrupted stem SILENTLY instead of throwing", that "every downstream
reading of it is garbage that still parses", and that the assertion above it is what makes the row
non-vacuous. It is the reason the call is safe, written where the call is.

The remaining work under `A2` is **2 sites, not 3**: `advertisedTextOf`'s own doc comment, and call
site 1 at `:867` (`ABC-066`'s block), which has nothing. **The criterion's target of 3 of 3 stands
unchanged and is still the right target** — only its parenthetical baseline is wrong. Do not
re-write `:937`–`943` to "add" what is already there; `A5` counts changed lines and a re-flow of a
merged guard's comment is exactly what `## Test notes` 4 forbids.

## `G-C` — `A3` is partly present, and the part that is present is the part `A3` does not ask for

`:941` states the divergence as a FACT ("Its sibling `usageLineOf` throws on bad input; this one
does not"). `A3` asks for it as a DECISION — deliberate, and what forbids unifying them. **That
sentence exists nowhere in the tree.** `A3` is genuinely open, and the new sentence belongs in the
helper block, not appended to a merged guard's comment.

## `G-D` — `A5`'s parenthetical baseline `859` is stale

The suite was `859` at `ABC-065`'s merge; `82133dd` added assertions and the post-merge gate on
`main` measured **861/861 on 30 files**. `A5`'s operative clause already self-corrects — "the hop
records the number it measured on `main` immediately before, and the two are equal" — so the
criterion is sound as written. **Measure it; do not quote `859`, and do not quote `861` from this
note either.** A number relayed through the Orchestrator is not a number the hop measured.

## `G-E` — `## Dependencies` says `ABC-065` and `ABC-066` are "both in `Ready for UAT`"

Both are `Done` and merged. The dependency reasoning was "UAT does not read comments, so this may
run while they wait"; the constraint it derived has therefore been REMOVED, not tightened. The
neighbouring constraint that still binds is the real one: **one hop at a time in `src/cli.test.ts`**.
`In Development` is 0/3, `.grugops/queue/pending/` is empty, no `claimed/` directory exists, and
`ABC-061`/`ABC-062` are both still in `Backlog` — so the file is unheld and this is safe to pull.

## What was confirmed intact, by reading rather than by assuming

- **`A6`** — `grep -c "npm run chess -- "` on `src/cli.test.ts` is **1**. The property the merged
  guard asserts is live and the trap is real.
- **`A7`** — `spawned` is pinned at **10** by a live assertion at `:836`.
- **`A4`** — `:165` still reads "THESE TWO HELPERS ARE THE SHARED ONES" above a block introducing
  four names (`SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf`, `invocationsAdvertisedBy`). The
  defect is exactly as described.
- **`A1`** — 1 of 2, as stated. `usageLineOf` states its throw at `:186`–`:188`; `advertisedTextOf`'s
  one-line doc comment at `:192` states only what it returns on good input.

## Effect on the pull

**Pull stands. DoR 10/10 unchanged, size `XS` unchanged, priority `P2` unchanged** (`ABC-061` and
`ABC-062` are still in `Backlog`, so the promotion trigger has not fired). Gaps recorded HERE, at
this exit, which is what the control measures.
